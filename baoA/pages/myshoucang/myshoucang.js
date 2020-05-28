// pages/myshoucang/myshoucang.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headindex: '0',  //0商品 1店铺
    page:1,       //页数
    goodslist:[],
    shoplist:[],
    startX:0,
    stylelist:[],
    delBtnWidth: 200,
    maxpage:'',
    startTime:'',
    endTime:''
  },
  bindTouchStart: function (e) {
    this.setData({
      startTime: e.timeStamp
    })
    
  },
  bindTouchEnd: function (e) {
    this.setData({
      endTime: e.timeStamp
    })
  },  
  todel(e){
    var _this = this;
    console.log(e)
    var type = e.currentTarget.dataset.type;
    if(type == 0){
      var id = e.currentTarget.dataset.goodsid;
    }else{
      var id = e.currentTarget.dataset.shopid;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除该收藏?',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.request({
            url: app.globalData.url, //自己的服务接口地址
            method: "post",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              cmd: 'collect',
              userId: wx.getStorageSync('userid'),
              type: type,
              cid: id,
              isCollect: 0
            },
            success: function success(res) {

              console.log(res);
              if (res.data.result == 0) {
                wx.showToast({
                  title: res.data.resultNote,
                  icon: 'none',
                  duration: 1000
                })
                if (type == 0) {
                  _this.getgoodslist();
                } else {
                  _this.getshoplist();
                }
              } else {
                wx.showToast({
                  title: res.data.resultNote,
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
    
    
  },
  
  //跳转到商品详情
  toxq(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var shopstate = e.currentTarget.dataset.shopstate;
    if (this.data.endTime - this.data.startTime < 200) {
      if (this.data.headindex == 0) {
        var goodsid = e.currentTarget.dataset.goodsid;
        var type = e.currentTarget.dataset.goodstype;
        if (type == 0) {
          wx.navigateTo({
            url: '../shopxq/shopxq?goodsid=' + goodsid,
          })
        }
        if (type == 1) {
          wx.navigateTo({
            url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
          })
        }
        if (type == 2) {
          wx.navigateTo({
            url: '../manjianxq/manjianxq?goodsid=' + goodsid,
          })
        }
        if (type == 3) {
          wx.navigateTo({
            url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
          })
        }
        if (type == 4) {
          wx.navigateTo({
            url: '../pintuanxq/pintuanxq?goodsid=' + goodsid,
          })
        }
        if (type == 5) {
          wx.navigateTo({
            url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
          })
        }
      } else {
        if (shopstate == 1) {
          wx.showToast({
            title: '该店铺已关闭',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        var shopid = e.currentTarget.dataset.shopid;
        wx.navigateTo({
          url: '../dianpu/dianpu?shopid=' + shopid,
        })
      }
    }else{
      var type = e.currentTarget.dataset.type;
      if (type == 0) {
        var id = e.currentTarget.dataset.goodsid;
      } else {
        var id = e.currentTarget.dataset.shopid;
      }
      wx.showModal({
        title: '提示',
        content: '确认删除该收藏?',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.request({
              url: app.globalData.url, //自己的服务接口地址
              method: "post",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                cmd: 'collect',
                userId: wx.getStorageSync('userid'),
                type: type,
                cid: id,
                isCollect: 0
              },
              success: function success(res) {

                console.log(res);
                if (res.data.result == 0) {
                  wx.showToast({
                    title: res.data.resultNote,
                    icon: 'none',
                    duration: 1000
                  })
                  if (type == 0) {
                    var list = _this.data.goodslist;
                    list.splice(index, 1)
                    _this.setData({
                      goodslist: list
                    })
                  } else {
                    var list = _this.data.shoplist;
                    list.splice(index, 1)
                    _this.setData({
                      shoplist: list
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.data.resultNote,
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            });
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  //获取收藏列表
  getgoodslist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyCollectList',
        userId: wx.getStorageSync('userid'),
        type:0,
        nowPage: _this.data.page
      },
      success: function success(res) {
        console.log(res)
        if (_this.data.page == 1) {
          _this.setData({
            goodslist: res.data.goodsList,
            maxpage: res.data.totalPage
          })
        } else {
          var oldarr = _this.data.goodslist;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            goodslist: endarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()
      }
    });
  },
  //获取收藏列表
  getshoplist() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyCollectList',
        userId: wx.getStorageSync('userid'),
        type: 1,
        nowPage: _this.data.page
      },
      success: function success(res) {
        console.log(res)
        if (_this.data.page == 1) {
          _this.setData({
            shoplist: res.data.shopList,
            maxpage: res.data.totalPage
          })
        } else {
          var oldarr = _this.data.shoplist;
          var newarr = res.data.shopList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            shoplist: endarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()
      }
    });
  },
  //左右滑动事件
  huachange(e) {
    // console.log(e.detail.current)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      headindex: e.detail.current,
      page:1,
    })
    if (e.detail.current == 0){
      this.getgoodslist();
    }else{
      this.getshoplist();
    }
  },
  // 分类tab切换
  tabchange(e) {
    // console.log(e.currentTarget.dataset.current)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      headindex: e.currentTarget.dataset.index,
      page: 1,
    })
    if (e.currentTarget.dataset.index == 0) {
      this.getgoodslist();
    } else {
      this.getshoplist();
    }
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
      page: 1
    })
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    this.getgoodslist();
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
    var _this = this;
    console.log('111')
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
      if(this.data.headindex == 0){
        _this.getgoodslist();
      }else{
        _this.getshoplist();
      }
      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})