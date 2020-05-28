// pages/jointuan/jointuan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    countDownList: [],     //显示时间列表
    actEndTimeList: [],    //时间列表
    sizexzbox: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    num: 1,  //购买数量
    guigeindex: 0,    //规格索引
    guigelist: [],       //规格列表
    tourid:'',
    goodsid:'',
    info:{},
    shopid:'',
    timer:'',
    tuanNum:""
  },
  //确认订单
  suredd(){
    var _this = this;
    var index = this.data.guigeindex;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'toTourBalance',
        flag: 1,
        shopId: _this.data.shopid,
        userId: wx.getStorageSync('userid'),
        goodsId: _this.data.goodsid,
        skuId: _this.data.guigelist[index].skuId,
        goodsBuyNum: _this.data.num,
        tourId: _this.data.tourid,
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0) {
          var obj = JSON.stringify(res.data)
          wx.navigateTo({
            url: '../suredd/suredd?obj=' + obj + '&type=qupin' + "&tuanNum=" + _this.data.tuanNum,
          })
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
          })
        }
      },
    });
  },
  //获取商品详情
  getinfo() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getTourGoodsDetail',
        userId: wx.getStorageSync('userid'),
        // goodsId: _this.data.goodsid
        goodsId: _this.data.goodsid
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          info: res.data,
          guigelist: res.data.goodsSku,
          shopid: res.data.shopId,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 0)
      },
    });
  },
  //弹出尺码选择窗口
  tanchusizebox(e) {
    var _this = this;
    var tourid = e.currentTarget.dataset.tourid;
    this.setData({
      blackzt: 'block',
      guigeindex: 0,
      num: 1,
      tourid:tourid
    })
    setTimeout(function () {
      _this.setData({
        sizexzbox: true
      })
    }, 100)
  },
  //关闭尺码选择窗口
  closechoosebox() {
    var _this = this;
    this.setData({
      sizexzbox: false
    })
    setTimeout(function () {
      _this.setData({
        blackzt: 'none'
      })
    }, 300)

  },
  //规格切换
  changeguige(e) {
    this.setData({
      guigeindex: e.currentTarget.dataset.index
    })
  },
  timeFormat: function timeFormat(param) {
    //小于10的格式化函数
    return param < 10 ? "0" + param : param;
  },
  //获取时间
  countDown: function countDown() {
    var that = this;
    //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    var newTime = new Date().getTime();
    var endTimeList = that.data.actEndTimeList;
    
    var countDownList = [];
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(function (o) {
      var endTime = new Date(o).getTime();
      var obj = null;
      var time = 0;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        var _time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        var day = parseInt(_time / (60 * 60 * 24));
        var hou = parseInt(_time % (60 * 60 * 24) / 3600);
        var min = parseInt(_time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(_time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        };
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      } else {
        //活动已结束，全部设置为'00'
        obj = {
          day: "00",
          hou: "00",
          min: "00",
          sec: "00"
        };
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      }
      
      countDownList.push(obj);
      
      // console.log(that.data.countDownList)
    });
    that.setData({
      countDownList: countDownList
    })
    // console.log(that.data.countDownList)
    var timer = setTimeout(that.countDown, 1000);
    this.setData({
      timer:timer
    })


  },
  //获取团拼群组
  gettuanpin() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getGoodsTourList',
        goodsId: _this.data.goodsid,
        nowPage: 1,
      },
      success: function (res) {
        console.log(res);
        var endTimeList = [];
        for (var _i in res.data.tourList) {
          res.data.tourList[_i].tourEndDate = res.data.tourList[_i].tourEndDate.replace(/-/g, "/");
          endTimeList.push(res.data.tourList[_i].tourEndDate);

        }

        _this.setData({
          list: res.data.tourList,
          actEndTimeList: endTimeList,
          tuanNum:res.data.tourList[0].num
        })
        console.log(_this.data.list)
        console.log(_this.data.tuanNum)
        _this.countDown();
        wx.hideLoading();
      },
    });
  },
  //加
  spinnerJia: function () {
    var that = this;
    this.data.num++;
    this.setData({
      num: this.data.num
    })
  },

  //减
  spinnerJian: function () {
    var that = this;
    if (this.data.num > 1) {
      this.data.num--;
    }
    this.setData({
      num: this.data.num
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.goodsid){
      this.setData({
        goodsid:options.goodsid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.gettuanpin();
    this.getinfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var timer = this.data.timer;
    clearTimeout(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var timer = this.data.timer;
    clearTimeout(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})