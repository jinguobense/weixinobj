// pages/toyaoqing/toyaoqing.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    info:{},
    countDownList:[],
    timer:'',
    isOverShare: true,
    img1:'',
    shareimg:'',
    shopname:''
  },
  jiazai(){
    wx.showToast({
      title: '正在加载分享信息',
      icon:'none',
      duration:1500
    })
  },
  getshareimg(){
    var _this = this;
    var info = this.data.info;
    const ctx = wx.createCanvasContext('shareimg')
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 250, 200);
    ctx.fillStyle = "#333";
    ctx.setFontSize(18)
    var str = info.goodsName;
    if (str.length > 13) {
      str = str.substring(0, 13) + "...";
    }
    ctx.fillText(str, 10, 150)

    var img1 = this.data.img1;
    ctx.drawImage(img1, 10, 10, 110, 110)
    ctx.fillStyle = "#E22405";
    ctx.setFontSize(16)
    ctx.fillText("￥", 10, 185)
    ctx.setFontSize(22)
    ctx.fillText(String(info.goodsCostPrice), 24, 185)
    var moneywidth = ctx.measureText(String(info.goodsCostPrice)).width
    // console.log(moneywidth)
    ctx.setFontSize(12)
    var discountText = info.pnum + "人团";
    var bdColor = '#E22405';
    var bdBackground = 'transparent';
    var bdRadius = 4;
    var textPadding = 6;
    var boxHeight = 18;
    var boxWidth = ctx.measureText(discountText).width + textPadding * 2;
    ctx.fillText(discountText, moneywidth+40, 183);
    this.roundRect(ctx, moneywidth+35, 169, boxWidth, boxHeight, bdRadius, bdBackground, bdColor)
    ctx.draw()
    setTimeout(function(){
      wx.canvasToTempFilePath({
        canvasId: 'shareimg',
        success(res) {
          console.log(res.tempFilePath)
          _this.setData({
            shareimg: res.tempFilePath
          })
        }
      })
    },500)
    

  },
  toxq(){
    var _this = this;
    var goodsid = this.data.info.goodsId;
    var tourid = this.data.info.tourId;
    wx.navigateTo({
      url: "/pages/sharexq/sharexq?goodsid=" + goodsid + ' &tourid='+tourid,
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
        // wx.showToast({
        //   title: '本组拼团已结束',
        //   icon:'none',
        //   duration:1500
        // })
        // setTimeout(function(){
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // },1500)
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      }

      countDownList.push(obj);
      that.setData({
        countDownList: countDownList
      })
      // console.log(that.data.countDownList)
    });
    var endTime = new Date(endTimeList[0]).getTime();
    if (endTime - newTime > 0) {
      var timer = setTimeout(that.countDown, 1000);
      this.setData({
        timer: timer
      })
    }else{
      wx.showToast({
          title: '本组拼团已结束',
          icon:'none',
          duration:1500
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1500)
    }
    


  },
  //获取群组信息
  getinfo(){
    var _this = this;
    //获取分类内容数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getTourGroupInfo',
        userId: wx.getStorageSync('userid'),
        orderId:_this.data.orderid
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0){
          var endTimeList = [];
          var str = res.data.endTime.replace(/-/g, "/");
          endTimeList.push(str);
          _this.setData({
            info: res.data,
            actEndTimeList: endTimeList,
          })
          _this.countDown();

          wx.downloadFile({
            url: res.data.goodsImg, //仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode == 200) {
                _this.data.img1 = res.tempFilePath;
                _this.setData({
                  img1: res.tempFilePath,
                })
              }
            }
          })
          var timers = setInterval(function () {
            if (_this.data.img1) {
              _this.getshareimg();
              clearInterval(timers)
            } else {
              wx.downloadFile({
                url: res.data.goodsImg, //仅为示例，并非真实的资源
                success(res) {
                  _this.data.img1 = res.tempFilePath;
                  _this.setData({
                    img1: res.tempFilePath,
                  })
                }
              })
            }
          }, 500)

          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        }else{
          wx.hideLoading()
          wx.showToast({
            title: res.data.resultNote,
            icon:'none',
            duration:1000
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },1000)
        }
        
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
    var shopname = options.shopname;
    this.setData({
      orderid:orderid,
      shopname:shopname
    })
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
  toindex(){
    var _this = this;
    var goodsid = this.data.info.goodsId;
    var tourid = this.data.info.tourId;
    var info = this.data.info;
    var name = wx.getStorageSync('userInfo').nickName;
    var userimg = wx.getStorageSync('userInfo').avatarUrl;
    wx.switchTab({
      url: "../../../pages/index/index?goodsid=" + goodsid + '&type=7&name=' + name + '&goodsimg=' + info.goodsImg + '&userimg=' + userimg + '&tourid=' + tourid,
    })
    
  },
  roundRect(ctx, x, y, w, h, r, fillColor, strokeColor) {
    // 画圆角 ctx、x起点、y起点、w宽度、y高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
    // 开始绘制
    ctx.beginPath()

    // 绘制左上角圆弧 Math.PI = 180度
    // 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // 绘制border-top
    // 移动起点位置 x终点、y终点
    ctx.moveTo(x + r, y)
    // 画一条线 x终点、y终点
    ctx.lineTo(x + w - r, y)
    // ctx.lineTo(x + w, y + r)

    // 绘制右上角圆弧
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // 绘制border-right
    ctx.lineTo(x + w, y + h - r)
    // ctx.lineTo(x + w - r, y + h)

    // 绘制右下角圆弧
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // 绘制border-bottom
    ctx.lineTo(x + r, y + h)
    // ctx.lineTo(x, y + h - r)

    // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // 绘制border-left
    ctx.lineTo(x, y + r)
    // ctx.lineTo(x + r, y)

    if (fillColor) {
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      ctx.setFillStyle(fillColor)
      // 对绘画区域填充
      ctx.fill()
    }

    if (strokeColor) {
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      ctx.setStrokeStyle(strokeColor)
      // 画出当前路径的边框
      ctx.stroke()
    }
    // 关闭一个路径
    // ctx.closePath()

    // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore
    ctx.clip()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var goodsid = this.data.info.goodsId;
    var tourid = this.data.info.tourId; 
    var info = this.data.info;
    var name = wx.getStorageSync('userInfo').nickName;
    var userimg = wx.getStorageSync('userInfo').avatarUrl;
    var shareimg = this.data.shareimg;  
    var shopname = this.data.shopname;  

    return {
      path: "/pages/index/index?goodsid=" + goodsid + '&type=7&name=' + name + '&goodsimg=' + info.goodsImg + '&userimg=' + userimg + '&tourid='+tourid,
      imageUrl: shareimg,
      title:shopname
    };
    
  }
})