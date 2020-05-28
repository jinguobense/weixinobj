// pages/pingjia/pingjia.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    info:{},
    goodslist:[],
    imglist:[]
  },
  del(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var indexss = e.currentTarget.dataset.indexss;
    var uplist = this.data.goodslist;
    var list = this.data.imglist;

    wx.showModal({
      title: '提示',
      content: '确认删除该图片?',
      success(res) {
        if (res.confirm) {
          uplist[index].imgList.splice(indexss, 1)
          list[index].img.splice(indexss, 1)
          _this.setData({
            goodslist: uplist,
            imglist: list
          })
        }
      }
    })
  },
  sub(){
    var _this = this;
    var goodslist = this.data.goodslist;

    for(var i in goodslist){
      if (goodslist[i].content == '') {
        wx.showToast({
          title: '请输入评价内容',
          icon: 'none',
          duration: 1000
        })
        return false;
      }
      // if(goodslist[i].cmtImgFile.length == 0) {
      //   wx.showToast({
      //     title: '请上传评价图片',
      //     icon: 'none',
      //     duration: 1000
      //   })
      //   return false;
      // }
    }
    var goodslist = JSON.stringify(goodslist)
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'orderGoodsCmt',
        userId: wx.getStorageSync('userid'),
        orderId:_this.data.orderid,
        goodsList: goodslist
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0) {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
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
  },
  //传图片
  chuanImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var num = this.data.goodslist[index].imgList.length;
    var goodslist = this.data.goodslist;
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
        imglist[index].img.push(resss.tempFilePaths[0])
        
        _this.setData({
          imglist: imglist,
        })
        console.log(imglist)
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
            var goodslist = _this.data.goodslist;
            goodslist[index].imgList.push(res.data.imgUrllist[0])
            _this.data.goodslist = goodslist;
            _this.setData({
              goodslist: goodslist
            })
            wx.hideLoading()
          },
        });
        
      },
    })

  },
  changestar(e){
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var goodslist = this.data.goodslist;

    if(type == 1){
      goodslist[index].star = indexs + 1;
      this.setData({
        goodslist:goodslist
      })
    }else{
      goodslist[index].star = goodslist[index].star + indexs + 1;
      this.setData({
        goodslist: goodslist
      })
    }
  },
  //监听
  watch(e){
    var index = e.currentTarget.dataset.index;
    var goodslist = this.data.goodslist;
    goodslist[index].content = e.detail.value;
    this.setData({
      goodslist:goodslist
    })
  },
  getinfo(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getOrderDetail',
        userId: wx.getStorageSync('userid'),
        orderId: _this.data.orderid,
        flag: 0,
      },
      success: function success(res) {
        console.log(res);
        var list = res.data.goodsList;
        var goodslist = [];
        var imglist = [];
        for(var i in list){
          goodslist.push({
            goodsId: list[i].goodsId,
            skuId: list[i].skuId,
            star:5,
            content:'',
            imgList:[]
          })
          imglist.push({
            img:[]
          })
        }
        _this.setData({
          info: res.data,
          goodslist: goodslist,
          imglist: imglist
        })
        wx.hideLoading();
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
    this.setData({
      orderid:orderid
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getinfo();
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