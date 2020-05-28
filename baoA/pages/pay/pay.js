// pages/pay/pay.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',   //支付金额
    prepay_id:'',
    orderid:'',
    type:'',
    tuanNum:"",
    ispay:false,  //防止重复点击

  },
  pay(){
    var that = this;
    if (this.data.prepay_id && this.data.ispay == false ){
      that.data.ispay = true
      wx.request({
        url: "https://ceshi.zjguangxuan.com/wxs/gspay",
        data: {
          prepay_id: that.data.prepay_id
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function success(res) {
          wx.requestPayment({
            appId: res.data.appId,
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: function success(res) {
              wx.hideLoading()
              that.data.ispay = false
              // console.log(that.data.tuanNum)
              // console.log(that.data.type)
              
              if ( that.data.type == 2 && that.data.tuanNum != 1) { 
                console.log("111")
                wx.redirectTo({
                  url: "../toyaoqing/toyaoqing?orderid=" + that.data.orderid
                });
              }else{
                console.log(222)
                wx.redirectTo({
                  url: "../paysuccess/paysuccess?orderid=" + that.data.orderid
                });
              }
              
              
            },
            fail: function fail(res) {
              // console.log(res);
              wx.showToast({
                title: "取消支付",
                icon: "none",
                duration: 1000
              });
              that.data.ispay = false
              if(that.data.type != 1 ){
                setTimeout(function () {
                  wx.redirectTo({
                    url: "../myddxq/myddxq?orderid=" + that.data.orderid
                  });
                }, 500)
              }
              
            },
            complete: function complete(res) {
              // console.log(res);
            }
          });
        }
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      money: options.pay,
      orderid: options.orderid,
      type:options.type,
      tuanNum:options.tuanNum
    })
    var money = Math.round(Number(options.pay) * 100) 
    wx.request({
      url: "https://ceshi.zjguangxuan.com/wxpay",
      data: {
        code: wx.getStorageSync('code'),
        pamount: money,
        randomOrderId: options.num,
        type: 1,
        openId: wx.getStorageSync('openid')
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function success(res) {
        _this.setData({
          prepay_id: res.data.prepay_id
        })
        
        setTimeout(function(){
          _this.pay();
        },500)
      }
    });
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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