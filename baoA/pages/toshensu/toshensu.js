// pages/toshensu/toshensu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgnum:0,
    obj:{},
    goodsid:'',
    list:[],    //申诉类型列表
    listcon:'',
    imglist:[],
    upimg:'../../../images/index/pic.png',
    upimglist:[],
    base64list:[],
    tit:'',   //主题
    con:'',   //内容
    baselist:[],
    type:''
  },
  del(e){
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
          imglist:list
        })
        }
      }
    })
  },
  titwatch(e){
    this.setData({
      tit: e.detail.value
    })
  },
  conwatch(e) {
    this.setData({
      con: e.detail.value
    })
  },
  //提交审核
  sub(){
    var _this = this;
    if (this.data.listcon == ''){
      wx.showToast({
        title: '请选择申诉类型',
        icon:'none',
        duration:1000
      })
      return false;
    }
    if (this.data.tit == '') {
      wx.showToast({
        title: '请输入申诉主题',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.con == '') {
      wx.showToast({
        title: '请输入申诉内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.upimglist == '') {
      wx.showToast({
        title: '请上传申诉图片',
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
        cmd: 'submitAppealMsg',
        type: 0,         //0-商品申诉 1-订单申诉
        userId: wx.getStorageSync('userid'),       //用户ID
        goodsId: _this.data.goodsid,          //商品id    0-商品申诉时传
        appealType: _this.data.listcon,       //申诉类型
        appealTitle: _this.data.tit,       //申诉主题
        appealContent: _this.data.con,    //申诉内容
        imgList: list,    //申诉图片
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0){
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
        }else{
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
          })
        }
      },
    });
  },
  getExtension: function (path) {
    let _type = '';
    var parts = path.split('.');
    if (path.lastIndexOf('.') >= 0) {
      _type = parts.slice(-1)[0]
    }
    return _type
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
        if (resss.tempFiles[0].size >= 1024*1024){
          wx.showToast({
            title: '图片过大,请重新选择',
            icon:'none',
            duration:1000
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
          baselist:list,
        })
        _this.data.imglist = imglist;
        _this.data.baselist = list;
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
            _this.data.upimglist = upimglist;
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
  onMyEvent: function (e) {
    console.log(e.detail)
    this.setData({
      listcon: e.detail
    })
  },
  //获得申诉列表
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getAppealTypeList',
        type: 0,
      },
      success: function (res) {
        console.log(res);
        var list = [];
        for (var i in res.data.appealType){
          list.push({
            id:i,
            text: res.data.appealType[i]
          })
        }
        _this.setData({
          list: list
        })
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsid = options.goodsid;
    var obj = JSON.parse(options.obj)
    this.setData({
      obj:obj,
      goodsid:goodsid,
      type:options.type
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
    this.getlist();
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