// pages/mydd/mydd.js
const app = getApp();
const QRCode = require('../../../utils/weapp-qrcode.js')
import rpx2px from '../../../utils/rpx2px.js'
let qrcode;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(400)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '0',    //分类索引
    moveParams: {
      scrollLeft: 0, // scroll-view滚动的距离,默认为0,因为没有触发滚动
      subLeft:0, //点击元素距离屏幕左边的距离
      subHalfWidth: 0, //点击元素的宽度一半
      screenHalfWidth: 187.5, //屏幕宽度的一半
    },
    page:1,
    list:[],    //我的订单列表
    maxlist:'',   //全部订单
    list1: [],    //我的订单列表
    list2: [],    //我的订单列表
    list3: [],    //我的订单列表
    list4: [],    //我的订单列表
    list5: [],    //我的订单列表
    pageheight:0,
    qrcodeWidth: qrcodeWidth,
    isend:false,
    sizexzbox: true,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态    
  },
  //弹出尺码选择窗口
  tanchusizebox(e) {
    var _this = this;
    const z = this
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      text: "",
      image: '',
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#333333",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    // 生成图片，绘制完成后调用回调
    
    var orderno = e.currentTarget.dataset.orderno;
    var verno = e.currentTarget.dataset.verno;
    var str = orderno + '@' + verno;
    qrcode.makeCode(str, () => {
      // 回调
      console.log(str)
        qrcode.exportImage(function (path) {
          console.log(path)
        })
    })
    wx.showLoading({
      title: '正在打开中',
    })
    setTimeout(function(){
      _this.setData({
        // blackzt: 'block',
        sizexzbox: false,
      })
      wx.hideLoading()
    },1000)
    

  },
  //关闭尺码选择窗口
  closechoosebox() {
    var _this = this;
    this.setData({
      sizexzbox: true,
      // blackzt: 'none',
    })


  },
  toyaoqing(e){
    var orderid = e.currentTarget.dataset.orderid;
    var shopname = e.currentTarget.dataset.shopname;
    console.log(shopname)
    wx.navigateTo({
      url: '../toyaoqing/toyaoqing?orderid=' + orderid + '&shopname='+ shopname,
    })
  },
  toyaoqingdt(e) {
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../cantuanxqshare/cantuanxqshare?goodsid=' + goodsid,
    })
  },
  topingjia(e) {
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../pingjia/pingjia?orderid=' + orderid,
    })
  },
  //去申请退款
  totuikuan(e){
    var orderid = e.currentTarget.dataset.orderid;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: "../totuikuan/totuikuan?orderid="+orderid+'&type='+type
    });
  },
  //确认收货
  shouhuo(e){
    var orderid = e.currentTarget.dataset.orderid;
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url, //自己的服务接口地址
            method: "post",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              cmd: 'confirmOrder',
              userId: wx.getStorageSync('userid'),
              orderId: orderid
            },
            success: function success(res) {
              console.log(res);
              wx.showToast({
                title: res.data.resultNote,
                icon: 'none',
                duration: 1000
              })
              if (_this.data.tabindex == 0) {
                _this.getlist();
              }
              if (_this.data.tabindex == 3) {
                _this.getlist3();
              }
            }
          });
        } else if (res.cancel) {
          
        }
      }
    })
    
  },
  //去支付
  pay(e){
    var money = e.currentTarget.dataset.money;
    var orderid = e.currentTarget.dataset.orderid;
    var orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: "../pay/pay?pay=" + money + "&num=" + orderno + "&orderid=" + orderid + '&type=1'
    });
  },
  //查看订单详情
  lookxq(e){
    var _this = this;
    var orderid = e.currentTarget.dataset.orderid;
    var type = e.currentTarget.dataset.type;
    var rfstate = e.currentTarget.dataset.rfstate;
    wx.navigateTo({
      url: '../myddxq/myddxq?orderid=' + orderid + '&type=' + type + '&rfstate=' + rfstate,
    })
  },
  //取消订单
  quxiao(e){
    var _this = this;
    var orderid = e.currentTarget.dataset.orderid;
    this.setData({
      page:1
    })
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'cancelOrder',
        userId: wx.getStorageSync('userid'),
        orderId: orderid
      },
      success: function success(res) {
        console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
        if(_this.data.tabindex == 0){
          _this.getlist();
        }
        if (_this.data.tabindex == 1) {
          _this.getlist1();
        }
      }
    });
  },
 
  //获取全部订单列表
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: '',
        nowPage:_this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if(_this.data.page == 1){
          _this.setData({
            list: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        }else{
          var list = _this.data.list;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list: list,
            maxlist: res.data.totalPage,
          })
        }
        wx.hideLoading();
      }
    });
  },
  //获取待付款订单列表
  getlist1() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: 0,
        nowPage: _this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list1: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        } else {
          var list = _this.data.list1;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list1: list,
            maxlist: res.data.totalPage
          })
        }
        wx.hideLoading();
      }
    });
  },
  //获取拼团订单列表
  getlist2() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: 1,
        nowPage: _this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list2: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        } else {
          var list = _this.data.list2;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list2: list,
            maxlist: res.data.totalPage
          })
        }
        wx.hideLoading();
      }
    });
  },
  //获取待收货订单列表
  getlist3() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: 2,
        nowPage: _this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list3: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        } else {
          var list = _this.data.list3;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list3: list,
            maxlist: res.data.totalPage
          })
        }
        wx.hideLoading();
      }
    });
  },
  //获取待评价订单列表
  getlist4() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: 3,
        nowPage: _this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list4: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        } else {
          var list = _this.data.list4;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list4: list,
            maxlist: res.data.totalPage
          })
        }
        wx.hideLoading();
      }
    });
  },
  //获取全部订单列表
  getlist5() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyRetailOrderList',
        userId: wx.getStorageSync('userid'),
        type: 4,
        nowPage: _this.data.page,
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list5: res.data.orderList,
            maxlist: res.data.totalPage,
            isend: true
          })
        } else {
          var list = _this.data.list5;
          for (var i in res.data.orderList) {
            list.push(res.data.orderList[i])
          }
          _this.setData({
            list5: list,
            maxlist: res.data.totalPage
          })
        }
        wx.hideLoading();
      }
    });
  },
  
  //左右滑动事件
  huachange(e) {
    // console.log(e.detail.current)
    let ele = 'ele' + e.detail.current
    this.setData({
      tabindex: e.detail.current,
      page:1,
      isend: false
    })
    this.getRect('#' + ele);
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.current == 0) {
      this.getlist();
    }
    if (e.detail.current == 1) {
      this.getlist1();
    }
    if (e.detail.current == 2) {
      this.getlist2();
    }
    if (e.detail.current == 3) {
      this.getlist3();
    }
    if (e.detail.current== 4) {
      this.getlist4();
    }
    if (e.detail.current == 5) {
      this.getlist5();
    }
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
      isend:false
    });
    this.getRect('#' + ele);
    wx.showLoading({
      title: '加载中',
    })
    if (e.target.dataset.current == 0) {
      this.getlist();
    }
    if (e.target.dataset.current == 1) {
      this.getlist1();
    }
    if (e.target.dataset.current == 2) {
      this.getlist2();
    }
    if (e.target.dataset.current == 3) {
      this.getlist3();
    }
    if (e.target.dataset.current == 4) {
      this.getlist4();
    }
    if (e.target.dataset.current == 5) {
      this.getlist5();
    }
  },
  scrollMove(e) {
    let moveParams = this.data.moveParams;
    moveParams.scrollLeft = e.detail.scrollLeft;
    this.setData({
      moveParams: moveParams
    })
    // console.log(e)
  },
  moveTo: function () {
    let subLeft = this.data.moveParams.subLeft;
    let screenHalfWidth = this.data.moveParams.screenHalfWidth;
    let subHalfWidth = this.data.moveParams.subHalfWidth;
    let scrollLeft = this.data.moveParams.scrollLeft;

    let distance = subLeft - screenHalfWidth + subHalfWidth;

    scrollLeft = scrollLeft + distance;
    // console.log(subLeft)
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  // // 分类tab切换
  // changetab(e) {
  //   // console.log(e.currentTarget.dataset.current)
  //   this.setData({
  //     tabindex: e.currentTarget.dataset.current
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let ele = 'ele' + options.index
    this.setData({
      tabindex: options.index
    });
    this.getRect('#' + ele);
    
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
          pageheight: (res.windowHeight * 2) / ((res.windowWidth * 2) / 750) - 100,
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.tabindex == 0) {
      this.getlist();
    }
    if (this.data.tabindex == 1) {
      this.getlist1();
    }
    if (this.data.tabindex == 2) {
      this.getlist2();
    }
    if (this.data.tabindex == 3) {
      this.getlist3();
    }
    if (this.data.tabindex == 4) {
      this.getlist4();
    }
    if (this.data.tabindex == 5) {
      this.getlist5();
    }
    
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
    console.log(this.data.page)
    if (this.data.page >= this.data.maxlist) {
      wx.showToast({
        title: '已经到底啦',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.showLoading({
        title: '加载中',
      })
      // this.setData({
      //   page: _this.data.page + 1
      // })
      this.data.page = this.data.page +1
      setTimeout(function () {
        if (_this.data.tabindex == 0) {
          _this.getlist();
        }
        if (_this.data.tabindex == 1) {
          _this.getlist1();
        }
        if (_this.data.tabindex == 2) {
          _this.getlist2();
        }
        if (_this.data.tabindex == 3) {
          _this.getlist3();
        }
        if (_this.data.tabindex == 4) {
          _this.getlist4();
        }
        if (_this.data.tabindex == 5) {
          _this.getlist5();
        }
      }, 0)
    }
  },

  /**
   * 用户点击右上角分享
   */
  //分享
  onShareAppMessage: function onShareAppMessage(res) {
    // var _this = this;
    // var goodsid = res.target.dataset.goodsid;
    // console.log(res)
    // if (res.from === "button") {
    //   // 来自页面内转发按钮
    //   // console.log(res);
    //   return {
    //     path: "/pages/pintuanxq/pintuanxq?goodsid=" + goodsid
    //   };
    // }
    
  },
})