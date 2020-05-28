// pages/xianshibuy/xianshibuy.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtabindex:'1',  //头部分类索引
    tabindex: '0',    //分类索引
    moveParams: {
      scrollLeft: 0, // scroll-view滚动的距离,默认为0,因为没有触发滚动
      subLeft: 0, //点击元素距离屏幕左边的距离
      subHalfWidth: 0, //点击元素的宽度一半
      screenHalfWidth: 187.5, //屏幕宽度的一半
    },
    headlist: [],    //头部类别
    page: 1,          //当前页数
    conlist: [],     //内容数据
    maxpage: '',     //最多页数
    countDownList:[],     //显示时间列表
    actEndTimeList:[],    //时间列表
    shopid:'',
    timer:'',
    isend:false
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
    endTimeList.forEach(function (o,i) {
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
        
        var actEndTimeList = that.data.actEndTimeList;
        actEndTimeList.splice(i, 1)
        var conlist = that.data.conlist;
        conlist.splice(i, 1)
        that.setData({
          actEndTimeList: actEndTimeList,
          conlist: conlist
        })
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      }
      
      countDownList.push(obj);
      
      // console.log(that.data.countDownList)
    });
    
    that.setData({
      countDownList: countDownList
    })
    var timer = setTimeout(that.countDown, 1000);
    this.setData({
      timer:timer
    })
    
    
  },
  //获取内容列表
  getconlist() {
    var _this = this;
    if (this.data.tabindex == 0) {
      var typeid1 = '';
    } else {
      var typeid1 = this.data.headlist[_this.data.tabindex - 1].pfgTypeId1;
    }
    if(!this.data.shopid){
      //获取分类内容数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getNearFlashSaleList',
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          flag: _this.data.headtabindex,
          pfgTypeId1: typeid1,
          nowPage: _this.data.page,
          searchKey: ''
        },
        success: function (res) {
          console.log(res);
          var endTimeList = _this.data.actEndTimeList;
          if (_this.data.headtabindex == 1) {
            for (var _i in res.data.goodsList) {
              res.data.goodsList[_i].actEndTime = res.data.goodsList[_i].actEndTime.replace(/-/g, "/");
              endTimeList.push(res.data.goodsList[_i].actEndTime);

            }
          } else if (_this.data.headtabindex == 2) {
            for (var _i2 in res.data.goodsList) {
              res.data.goodsList[_i2].actStartTime = res.data.goodsList[_i2].actStartTime.replace(/-/g, "/");
              endTimeList.push(res.data.goodsList[_i2].actStartTime);
            }
          }


          if (_this.data.page == 1) {
            _this.setData({
              conlist: res.data.goodsList,
              maxpage: res.data.totalPage,
              actEndTimeList: endTimeList,
              isend:true
            })
          } else {
            var oldarr = _this.data.conlist;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              conlist: endarr,
              maxpage: res.data.totalPage,
              actEndTimeList: endTimeList,
            })
          }
          // 执行倒计时函数
          _this.countDown();
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        },
      });
    }else{
      //获取分类内容数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getNearFlashSaleList',
          flag: _this.data.headtabindex,
          pfgTypeId1: typeid1,
          nowPage: _this.data.page,
          searchKey: '',
          shopId:_this.data.shopid,
        },
        success: function (res) {
          console.log(res);
          var endTimeList = _this.data.actEndTimeList;
          if (_this.data.headtabindex == 1) {
            for (var _i in res.data.goodsList) {
              res.data.goodsList[_i].actEndTime = res.data.goodsList[_i].actEndTime.replace(/-/g, "/");
              endTimeList.push(res.data.goodsList[_i].actEndTime);

            }
          } else if (_this.data.headtabindex == 2) {
            for (var _i2 in res.data.goodsList) {
              res.data.goodsList[_i2].actStartTime = res.data.goodsList[_i2].actStartTime.replace(/-/g, "/");
              endTimeList.push(res.data.goodsList[_i2].actStartTime);
            }
          }


          if (_this.data.page == 1) {
            _this.setData({
              conlist: res.data.goodsList,
              maxpage: res.data.totalPage,
              actEndTimeList: endTimeList,
              isend: true
            })
          } else {
            var oldarr = _this.data.conlist;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              conlist: endarr,
              maxpage: res.data.totalPage,
              actEndTimeList: endTimeList,
            })
          }
          // 执行倒计时函数
          _this.countDown();
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        },
      });
    }
    



  },
  //获取头部分类
  getheadlist() {
    var _this = this;
    //获取头部分类数据
    if (!this.data.shopid) {
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getPfgTypeList',
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          flag: 5,
          fstype: _this.data.headtabindex,
        },
        success: function (res) {
          console.log(res);
          _this.setData({
            headlist: res.data.pfgTypeList
          })
        },
      });
    }else{
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getPfgTypeList',
          flag: 5,
          fstype: _this.data.headtabindex,
          shopId: _this.data.shopid
        },
        success: function (res) {
          console.log(res);
          _this.setData({
            headlist: res.data.pfgTypeList
          })
        },
      });
    }
  },
  // 头部分类tab切换
  changeheadtab(e) {
    // console.log(e.currentTarget.dataset.current)
    var timer = this.data.timer;
    clearTimeout(timer)
    this.setData({
      tabindex: 0,
      headtabindex: e.currentTarget.dataset.current,
      page: 1,
      actEndTimeList: [],
      timer:''
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getheadlist();
    this.getconlist();
  },
  
  // tab滑动动画
  getRect(ele) { //获取点击元素的信息,ele为传入的id
    var that = this;
    wx.createSelectorQuery().select(ele).boundingClientRect(function (rect) {
      let moveParams = that.data.moveParams;
      moveParams.subLeft = rect.left;
      moveParams.subHalfWidth = rect.width / 2;
      that.moveTo();
    }).exec()
  },
  changetab: function (e) {
    let ele = 'ele' + e.target.dataset.current
    this.setData({
      tabindex: e.target.dataset.current,
      page: 1,
      actEndTimeList:[]
      
    });
    this.getRect('#' + ele);
    wx.showLoading({
      title: '加载中',
    })
    this.getconlist();
  },
  scrollMove(e) {
    let moveParams = this.data.moveParams;
    moveParams.scrollLeft = e.detail.scrollLeft;
    this.setData({
      moveParams: moveParams
    })
    console.log(e)
  },
  moveTo: function () {
    let subLeft = this.data.moveParams.subLeft;
    let screenHalfWidth = this.data.moveParams.screenHalfWidth;
    let subHalfWidth = this.data.moveParams.subHalfWidth;
    let scrollLeft = this.data.moveParams.scrollLeft;

    let distance = subLeft - screenHalfWidth + subHalfWidth;

    scrollLeft = scrollLeft + distance;
    console.log(subLeft)
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  //跳转商品详情
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid
    var headtabindex = this.data.headtabindex
    wx.navigateTo({
      url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid + '&type=' + headtabindex
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shopid) {
      this.setData({
        shopid: options.shopid
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
    this.setData({
      page:1
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getheadlist();
    this.getconlist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var timer = this.data.timer
    clearTimeout(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var timer = this.data.timer
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
    var _this = this;
    if (this.data.page == this.data.maxpage) {
      wx.showToast({
        title: '已经到底啦',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        page: _this.data.page + 1
      })
      wx.showLoading({
        title: '加载中',
      })
      _this.getconlist();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})