// pages/myzuji/myzuji.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list:[],
    maxpage:'',
    pageheight:'',
    startTime: '',
    endTime: '',
    isend:false
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
  todel(e) {
    var _this = this;
    var browid = e.currentTarget.dataset.browid;
    
    wx.showModal({
      title: '提示',
      content: '确认删除该足迹?',
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
              cmd: 'deleteMyBrowInfo',
              userId: wx.getStorageSync('userid'),
              type: 0,
              browId: browid
            },
            success: function success(res) {

              console.log(res);
              if (res.data.result == 0) {
                wx.showToast({
                  title: res.data.resultNote,
                  icon: 'none',
                  duration: 1000
                })
                  _this.getlist();
                
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
  //清空足迹
  clear(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'deleteMyBrowInfo',
        userId: wx.getStorageSync('userid'),
        type: 0,
        browId:'-1'
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0){
          _this.setData({
            list:[]
          })
          wx.showToast({
            title: res.data.resultNote,
            icon:'none',
            duration:1000
          })
          setTimeout(function(){
            _this.getlist();
          },1000)
        }
      }
    });
  },
  //跳转到商品详情
  toxq(e) {
    var _this = this;
    if (this.data.endTime - this.data.startTime < 200) {
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
      if (type == 6) {
        wx.navigateTo({
          url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
        })
      }
      if (type == 5) {
        wx.navigateTo({
          url: '../newuserxqq/newuserxqq?goodsid=' + goodsid,
        })
      }
    }else{
      var browid = e.currentTarget.dataset.browid;
      var index = e.currentTarget.dataset.index;
      wx.showModal({
        title: '提示',
        content: '确认删除该足迹?',
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
                cmd: 'deleteMyBrowInfo',
                userId: wx.getStorageSync('userid'),
                type: 0,
                browId: browid
              },
              success: function success(res) {

                console.log(res);
                if (res.data.result == 0) {
                  wx.showToast({
                    title: res.data.resultNote,
                    icon: 'none',
                    duration: 1000
                  })
                  var list = _this.data.list;
                  list.splice(index,1)
                  _this.setData({
                    list:list
                  })

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
  //获得我的足迹
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyBrowInfoList',
        userId: wx.getStorageSync('userid'),
        type: 0,
        nowPage: _this.data.page
      },
      success: function success(res) {

        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list: res.data.goodsList,
            maxpage: res.data.totalPage,
            isend:true
          })
        } else {
          var oldarr = _this.data.list;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            list: endarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()
      }
    });
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
    var _this = this;
    this.setData({
      page: 1
    })
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        _this.setData({
          pageheight: (res.windowHeight * 2) / ((res.windowWidth * 2) / 750),
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
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
      _this.getlist();
      

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})