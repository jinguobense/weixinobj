// pages/adddizhi/adddizhi.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapdizhi: '',        //定位所得地址
    name: '',        //收货人
    tel: '',         //联系电话
    address: '',     //详细收货地址
    id:'',          //地址id
    type: true,      //是否设为默认地址
    lat:'',
    lng:''
  },
  //是否默认地址
  changetype() {
    var _this = this;
    this.setData({
      type: !_this.data.type
    })
  },
  //保存
  baocun() {
    var _this = this;
    if (this.data.name == '') {
      wx.showToast({
        title: '请填写收货人',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.tel == '' || this.data.tel.length != 11) {
      wx.showToast({
        title: '请填写正确的联系电话',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.mapdizhi == '') {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.address == '') {
      wx.showToast({
        title: '请填写收货地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    //保存地址
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'modifyAddr',
        userId: wx.getStorageSync('userid'),
        townId: wx.getStorageSync('townid'),
        lng: _this.data.lng,
        lat: _this.data.lat,
        addrName: _this.data.name,
        addrPhone: _this.data.tel,
        localaddr: _this.data.mapdizhi,
        detailedAddr: _this.data.address,
        addrId: _this.data.id
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0) {
          if (_this.data.type == true) {
            //设为默认地址
            wx.request({
              url: app.globalData.url, //自己的服务接口地址
              method: "post",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                cmd: 'setDefaultAddr',
                userId: wx.getStorageSync('userid'),
                addrId: res.data.addrId
              },
              success: function success(ress) {
                // console.log(res);
                wx.showToast({
                  title: res.data.resultNote,
                  icon: 'none',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000)
              },
              fail: function fail() {
                // console.log("系统错误");
              }
            });
          }else{
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  //姓名
  writename(e) {
    var _this = this;
    this.setData({
      name: e.detail.value
    })
  },
  //电话
  writetel(e) {
    var _this = this;
    this.setData({
      tel: e.detail.value
    })
  },
  //详细地址
  writeaddress(e) {
    var _this = this;
    this.setData({
      address: e.detail.value
    })
  },
  //获取定位详细信息
  getmap() {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        _this.setData({
          mapdizhi: res.address,
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   id: options.id
    // })
    var obj = JSON.parse(options.obj)
    console.log(obj)
    this.setData({
      name: obj.addrName,
      tel: obj.addrPhone,
      mapdizhi: obj.localaddr,
      address: obj.detailedAddr,
      id: obj.addrId,
      lat:obj.lat,
      lng:obj.lng
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