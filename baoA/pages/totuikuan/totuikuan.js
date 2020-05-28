// pages/totuikuan/totuikuan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    imglist: [],
    upimg: '../../../images/index/pic.png',
    upimglist: [],
    base64list: [],
    imgnum: 0,
    con: '',   //内容
    orderid:'',
    btntype:false,
  },
  del(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var uplist = this.data.upimglist;
    var list = this.data.imglist;

    wx.showModal({
      title: '提示',
      content: '确认删除该图片?',
      success(res) {
        if (res.confirm) {
          uplist.splice(index, 1)
          list.splice(index, 1)
          console.log(list)
          _this.setData({
            upimglist: uplist,
            imglist: list
          })
        }
      }
    })
  },
  //退款提交
  sub() {
    var _this = this;
    if(this.data.btntype == false){
      if (this.data.con == '') {
        wx.showToast({
          title: '请输入退款原因',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      var list = JSON.stringify(_this.data.upimglist)
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'applyOrderRefund',
          userId: wx.getStorageSync('userid'),       //用户ID
          orderId: _this.data.orderid,
          refundReason: _this.data.con,
          imgList: list,    //申诉图片
        },
        success: function (res) {
          console.log(res);
          if (res.data.result == 0) {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1000
            })
            var pages = getCurrentPages();   //当前页面
            var prevPage = pages[pages.length - 2];   //上一页面
            prevPage.setData({
              flag: 0,
              rfstate:0
            });
            _this.setData({
              btntype: true
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1000
            })
          }


        },
      });
    }else{
      wx.showToast({
        title: '请勿重复提交!',
        icon:'none',
        duration:1000
      })
    }
    
  },
  conwatch(e) {
    this.setData({
      con: e.detail.value
    })
  },
  //传图片
  chuanImg: function () {
    var num = this.data.imgnum;
    var _this = this;
    if (num >= 4) {
      wx.showToast({
        title: '最多上传四张图片',
        icon: 'none'
      })
      return false;
    }
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: resss => {
        console.log(resss)
        if (resss.tempFiles[0].size >= 1024 * 1024) {
          wx.showToast({
            title: '图片过大,请重新选择',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        wx.showLoading({
          title: '图片上传中',
        })
        let base64 = wx.getFileSystemManager().readFileSync(resss.tempFilePaths[0], 'base64')
        var list = [];
        list.push(base64)
        var imglist = _this.data.imglist;
        imglist.push(resss.tempFilePaths[0])
        _this.setData({
          imglist: imglist,
        })
        var list = JSON.stringify(list)
        wx.request({
          url: app.globalData.url, //自己的服务接口地址
          method: "post",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            cmd: 'uploadPluralImg',
            imgList: list
          },
          success: function (res) {
            console.log(res);
            var upimglist = _this.data.upimglist;
            upimglist.push(res.data.imgUrllist[0])
            _this.setData({
              upimglist: upimglist
            })
            wx.hideLoading()
            console.log(_this.data.upimglist)
          },
        });
        num++;
        _this.setData({
          imgnum: num
        })

      },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var orderid = options.orderid;
    var type = options.type;
    if (type == 8 || type == 9) {
      var flag = 1;
    } else {
      var flag = 0;
    }
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getOrderDetail',
        userId: wx.getStorageSync('userid'),
        orderId: orderid,
        flag: flag,
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0) {
          _this.setData({
            info: res.data,
            orderid: orderid
          })
        }

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