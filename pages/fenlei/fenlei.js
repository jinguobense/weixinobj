// pages/fenlei/fenlei.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '0',    //分类索引
    leftlist:[],     //店铺分类列表
    fenleiid:'',      //店铺分类id
    page:1,    //当前页数
    rightlist:[],       //店铺列表
    banner:'',       //各个分类的广告banner
    maxpage:'',
    adlistimg: [],
    bannerimg:false,
    bannerid:'',
    isend:false,
    searchcon:'',
  },
  //搜索
  tosearch() {
    var _this = this;
    if (this.data.searchcon == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.navigateTo({
      url: '../searchshopend/searchshopend?search=' + _this.data.searchcon,
    })
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    this.setData({
      searchcon: e.detail.value
    })
  },
  tobannerid(){
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    var bannerid = this.data.bannerid
    wx.navigateTo({
      url: '../../baoA/pages/dianpu/dianpu?shopid='+bannerid,
    })
  },
  
  //进入店铺详情
  todianpu(e){
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    var shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '../../baoA/pages/dianpu/dianpu?shopid=' + shopid,
    })
  },
  //获取右侧店铺
  getrightlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getShopList',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        cityId: wx.getStorageSync('cityid'),
        townId: wx.getStorageSync('townid'),
        shopTypeId: _this.data.fenleiid,      //店铺分类id        传空默认全部
        nowPage:_this.data.page       //页数  
      },
      success(res) {
        console.log(res);
        if (res.data.adImg) {
          var banner = res.data.adImg;
          if (res.data.adUrl){
            var bannerid = res.data.adUrl;
          }else{
            var bannerid = '';
          }
          
        } else {
          var banner = '';
          var bannerid = '';
        }
        for (var i in res.data.shopList){
          res.data.shopList[i].shopScore = parseInt(res.data.shopList[i].shopScore * 100)
        }
        if (_this.data.page == 1) {
          var list = res.data.shopList;
          _this.setData({
            rightlist: list,
            banner: banner,
            maxpage: res.data.totalPage,
            bannerid: bannerid,
            isend: true
          })
        } else {
          var oldarr = _this.data.rightlist;
          var newarr = res.data.shopList;
          var endarr = oldarr.concat(newarr);
          var list = endarr
          _this.setData({
            rightlist: list,
            maxpage: res.data.totalPage,
            isend: true
          })
        }
        
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh(); 

        setTimeout(function(){
          wx.hideLoading()
        },0)
      }
    });
  },
  //获取左侧店铺分类
  getleftlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getShopTypeList',
        flag:1,
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
      },
      success(res) {
        console.log(res);
        var id;
        if (res.data.shopTypeList.length == 0){
          id = '';
        }else{
          var index = _this.data.tabindex;
          id = res.data.shopTypeList[index].shopTypeId;
        }
        _this.setData({
          leftlist: res.data.shopTypeList,
          fenleiid: id,
          
        })
        if(id != ''){
          setTimeout(function () {
            _this.getrightlist();
          }, 0)
        }else{
          _this.setData({
            rightlist:[],
            isend: true
          })
          wx.hideLoading()
        }
        
        
      }
    });
  },
  // 分类tab切换
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)
    wx.showLoading({
      title: '加载中'
    })
    var _this = this;
    this.setData({
      // rightlist:[],
      tabindex: e.currentTarget.dataset.current,
      fenleiid: e.currentTarget.dataset.id,
      page:1,
      // adlistimg:[],
      // banner:'',
      // bannerimg:false
    })
    setTimeout(function () {
      _this.getrightlist();
    }, 0)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      page: 1,
      tabindex:0
    })
    wx.showLoading({
      title: '加载中'
    })
    this.getleftlist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   isend:false
    // })
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
    wx.showNavigationBarLoading();
    this.setData({
      page:1
    })
    this.getleftlist()
    this.getrightlist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    var _this = this;
    if (this.data.rightlist.length != 0){
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
        _this.getrightlist();
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})