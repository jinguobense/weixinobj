// pages/suredd/suredd.js
const app = getApp();
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peisongtype:false,     //false自提 true配送
    obj:{},     //主要信息
    tel:'', 
    now:'',
    msg:'',
    type:'',     //onepin 拼团单独购买
    addr:{},      //地址
    addrtype:false,
    yhjlist:[],      //优惠券列表
    juanmoney:0,    //劵减少钱数
    juanid: '',        //劵的id
    juantype:'',        //劵的类别
    endpaycash:'',
    hasjuan:false,
    hasmanjian:false,
    juli:'',
    headshow:true,     //平台配送时是否满足30元
    ispay:false,   //防止重复点击提交订单
    tuanNum:"" //参团人数 该组缺少人数
  },
  //计算距离
  jisuan(longt1, lat1, longt2, lat2){
    var PI = 3.14159265358979323; // 圆周率
    var R = 6371229; // 地球的半径
    var x, y, distance;
    x = (longt2 - longt1) * PI * R * Math.cos(((lat1 + lat2) / 2) * PI / 180) / 180;
    // console.log(x)
    y = (lat2 - lat1) * PI * R / 180;
    // console.log(y)
    distance = Math.hypot(x, y);
    // console.log(distance)
    return distance
  },
  
  openmap11(obj) {
    // console.log(obj)
    // var info = this.data.info;
    // let plugin = requirePlugin('route-plan');
    // let key = 'JZPBZ-U5CWU-WAMVJ-2SCHB-AQDY5-LKF6U';  //使用在腾讯位置服务申请的key
    // let referer = '众聚逛选-小程序';   //调用插件的app的名称
    // let endPoint = JSON.stringify({  //终点
    //   'name': info.shopAddr,
    //   'latitude': info.shopLat,
    //   'longitude': info.shopLng
    // });
    // wx.navigateTo({
    //   url: 'plugin://route-plan/route-plan?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    // });
    var _this = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
       //Object格式
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      */
      location: obj.lat + ','+obj.lng, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调
        // console.log(res);
        var res = res.result;
        var mks = [];
        /**
         *  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
         *
            for (var i = 0; i < result.pois.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
                title: result.pois[i].title,
                id: result.pois[i].id,
                latitude: result.pois[i].location.lat,
                longitude: result.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
            })
            }
        *
        **/
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../../images/dianpu/shopdingwei.png',//图标路径
          width: 25,
          height: 28,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: '距您' + obj.juli,
            color: '#000',
            padding: '10rpx',
            radius: '5rpx',
            display: 'ALWAYS'
          }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function (error) {
        // console.error(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    })
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: '',
      to: '34.758578,113.689347',
      success: function (res) {
        // console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        // console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        // console.error(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  lookmap() {
    var _this = this;
    var latitude = Number(_this.data.obj.lat);
    var longitude = Number(_this.data.obj.lng);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  //选择优惠券
  tochoosejuan(){
    var list = this.data.yhjlist;
    var listt = JSON.stringify(list)
    if (list.length > 0){
      wx.navigateTo({
        url: '../youhuijuanchoose/youhuijuanchoose?list=' + listt,
      })
    }
    
  },
  //获得优惠券
  getjuan(){
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        goodsCurPrice: goodslist[i].goodsCurPrice,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    var ddobj = _this.data.obj;
    var paycash;
    // if (ddobj.disCusFee){
    //   paycash = ddobj.payCash - ddobj.disCusFee;
    // }else{
    //   paycash = ddobj.payCash;
    // }
    wx.request({
      url: app.globalData.url,
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: "usefulCouponList",
        userId: wx.getStorageSync('userid'),
        shopId: _this.data.obj.shopId,
        goodsList: obj,
        totalPrice: ddobj.payCash,
        nowPage:1,
      },

      success: function success(res) {
        console.log(res.data);
        _this.setData({
          yhjlist: res.data.couponList
        })


      }
    });
  },
  //专享
  newbuy() {
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    console.log(JSON.stringify(goodslist))
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        skuId: goodslist[i].skuId,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    console.log(obj)
    //自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "newPmentPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: '',
          userCouponId: ''
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
      //配送
    } else {
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "newPmentPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: '',
          userCouponId: ''
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
    }
  },
  //直销
  zhixiao() {
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        skuId: goodslist[i].skuId,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    //自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toCmentPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
      //配送
    } else {
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toCmentPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输  
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
    }
  },
  //团购
  tuangou() {
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    console.log(JSON.stringify(goodslist))
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        skuId: goodslist[i].skuId,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    console.log(obj)
    //自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toGoPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: '',
          userCouponId: ''
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
      //配送
    } else {
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toGoPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: '',
          userCouponId: ''
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
    }
  },
  //拼团单独购买
  onepin(){
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    console.log(JSON.stringify(goodslist))
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        skuId: goodslist[i].skuId,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    console.log(obj)
    //单独购买自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' ||  this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toCsPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: _this.data.juantype,
          userCouponId: _this.data.juanid
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
            _this.setData({
              juanid: '',
              juanmoney: '',
              juantype: ''
            })
          }
        }
      });
    //单独购买配送
    }else{
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toCsPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
          type: _this.data.juantype,
          userCouponId: _this.data.juanid
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            

            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
            _this.setData({
              juanid: '',
              juanmoney: '',
              juantype: ''
            })
          }
        }
      });
    }
  },
  //开团
  kaipin(){
    var _this = this;
    //开团自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toTourPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          flag: 0,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsId: _this.data.obj.goodsId,
          skuId: _this.data.obj.skuId,
          goodsBuyNum: _this.data.obj.goodsBuyNum,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },
        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId + '&type=2'
            });
          }
        }
      });
    //开团配送
    }else{
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toTourPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          flag: 0,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsId: _this.data.obj.goodsId,
          skuId: _this.data.obj.skuId,
          goodsBuyNum: _this.data.obj.goodsBuyNum,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },
        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId + '&type=2'
            });
          }
        }
      });
    }

  },
  //开团
  qupin() {
    var _this = this;
    //开团自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toTourPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          tourId:_this.data.obj.tourId,
          flag: 1,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsId: _this.data.obj.goodsId,
          skuId: _this.data.obj.skuId,
          goodsBuyNum: _this.data.obj.goodsBuyNum,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },
        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1 ) { //|| _this.data.tuanNum != 0
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1000)
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId + "&tuanNum=" + _this.data.tuanNum + '&type=2'
            });
          }
        }
      });
      //开团配送
    } else {
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toTourPay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          tourId: _this.data.obj.tourId,
          flag: 1,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsId: _this.data.obj.goodsId,
          skuId: _this.data.obj.skuId,
          goodsBuyNum: _this.data.obj.goodsBuyNum,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },
        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
    }

  },
  //限时抢购
  qianggou(){
    var _this = this;
    var obj = [];
    var goodslist = this.data.obj.goodsList;
    console.log(JSON.stringify(goodslist))
    for (var i in goodslist) {
      var objj = {
        goodsId: goodslist[i].goodsId,
        skuId: goodslist[i].skuId,
        goodsBuyNum: goodslist[i].goodsBuyNum
      }
      obj.push(objj)
    }
    var obj = JSON.stringify(obj)
    console.log(obj)
    //单独购买自提
    if (this.data.peisongtype == false) {
      if (this.data.tel == '' || this.data.tel.length != 11) {
        wx.showToast({
          title: '请填写正确的取货电话',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toFlashSalePay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 1,
          takePhoneNum: _this.data.tel,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
      //单独购买配送
    } else {
      if (!this.data.addr.addrId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      wx.request({
        url: app.globalData.url,
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: "toFlashSalePay",
          userId: wx.getStorageSync('userid'),
          shopId: _this.data.obj.shopId,
          disState: 0,
          addrId: _this.data.addr.addrId,
          goodsList: obj,
          leaveMsg: _this.data.msg,
          // addrId: that.addrid,   //配送时传输
        },

        success: function success(res) {
          console.log(res.data);
          if (res.data.result == 1) {
            wx.showToast({
              title: res.data.resultNote,
              icon: "none",
              duration: 1500
            });
          } else if (res.data.resultNote == "处理成功") {
            wx.redirectTo({
              url: "../pay/pay?pay=" + res.data.payCash + "&num=" + res.data.orderNo + "&orderid=" + res.data.orderId
            });
          }
        }
      });
    }
  },
  toaddr(){
    if (this.data.peisongtype == true){
      wx.navigateTo({
        url: '../dizhi/dizhi?type=1',
      })
    }
    
  },

  //获取默认地址
  getaddr(){
    var _this = this;
    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyAddrList',
        userId: wx.getStorageSync('userid'),
        nowPage: 1,
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
      },
      success: function success(res) {
        console.log(res);
        if (res.data.addrList.length >0){
          _this.setData({
            addr: res.data.addrList[0],
            addrtype:true,
          })
        }else{
          _this.setData({
            addrtype: false,
            addr:{}
          })
        }
        
      }
    });
  },
  //提交订单
  sure(){
    var _this = this;
    //拼团单独购买
    console.log(11)
    if(this.data.ispay == false){
      this.data.ispay = true
      setTimeout(function(){
        _this.setData({
          ispay:false
        })
      },3000)
      console.log(22)
      if (this.data.type == 'onepin') {
        this.onepin();
      }
      //开团
      if (this.data.type == 'kaipin') {
        this.kaipin();
      }
      //抢购
      if (this.data.type == 'qianggou') {
        this.qianggou();
      }
      //团购
      if (this.data.type == 'tuangou') {
        this.tuangou();
      }
      //直销
      if (this.data.type == 'zhixiao') {
        this.zhixiao();
      }
      //直销
      if (this.data.type == 'newbuy') {
        this.newbuy();
      }
      //参团
      if (this.data.type == 'qupin') {
        this.qupin();
      }
      
    }else{
      wx.showToast({
        title: '请勿频繁操作',
        icon:'none',
        duration:1500
      })
    }
    


    
    
    
  },
  //电话
  telipt(e) {
    var _this = this;
    this.setData({
      tel: e.detail.value
    })
  },
  //留言
  msgipt(e) {
    var _this = this;
    this.setData({
      msg: e.detail.value
    })
  },
  //选择配送方式
  choosehave(e){
    var _this= this;
    var type = e.currentTarget.dataset.type;
    var peisongtype = this.data.peisongtype;
    var pstype;
    if (type == 1) {
      pstype = true;
    } else {
      pstype = false;
    }
    if (peisongtype == pstype){
      return false;
    }

    var obj = this.data.obj;
    var peisongtype = this.data.peisongtype;
    var money = this.data.juanmoney;
    var endpaycash = this.data.endpaycash;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      if (money > 0) {
        if (peisongtype){
          endpaycash = (Math.round(endpaycash * 100 )/100).toFixed(2)
        }else{
          endpaycash = (Math.round(endpaycash * 100) / 100).toFixed(2)
        }
      }else{
        if (peisongtype) {
          obj.payCash = (Math.round(obj.payCash * 100) / 100).toFixed(2)
        } else {
          obj.payCash = (Math.round(obj.payCash * 100) / 100).toFixed(2)
        }
      }
      
      
      _this.setData({
        peisongtype: pstype,
        endpaycash: endpaycash,
        obj: obj
      })
      wx.hideLoading()
    }, 300)
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var obj = JSON.parse(options.obj) 
    //console.log(obj)
    console.log(options)
    var tuanNum = options.tuanNum
    qqmapsdk = new QQMapWX({
      key: 'JZPBZ-U5CWU-WAMVJ-2SCHB-AQDY5-LKF6U'  //腾讯地图key
    });
    if (obj.takePhoneNum){
      var telnum = obj.takePhoneNum
    }else{
      var telnum = ''
    }
    // if (obj.disstate == 0){
    //   var peisongtype = true;
    // }else{
    //   var peisongtype = false;
    // }
    obj.oldmoney = obj.payCash;
    // if (obj.disCusFee){
    //   obj.payCash = Math.round(obj.payCash * 100 + obj.disCusFee * 100) / 100
    // }
    var juantype;
    if(options.juantype){
      juantype = options.juantype
    }else{
      juantype = false;
    }
    var hasmanjian;
    if (options.hasmanjian) {
      hasmanjian = options.hasmanjian
    } else {
      hasmanjian = false;
    }
    var now;
    if(options.now){
      now = options.now
    }else{
      now = ''
    }
    var lat = wx.getStorageSync('latitude')
    var lng = wx.getStorageSync('longitude')
    var juli = this.jisuan(Number(lng), Number(lat), Number(obj.lng), Number(obj.lat))
    if(juli >1000){
      juli = (juli/1000).toFixed(2) + 'km'
    }else{
      juli = Math.ceil(juli) + 'm'
    }
    obj.juli = juli
    this.openmap11(obj);
    if (obj.deadline){
      wx.setStorageSync('endtime', obj.deadline)
    }else{
      wx.removeStorageSync('endtime')
    }
    
    this.setData({
      obj:obj,
      // peisongtype: peisongtype,
      type:options.type,
      tel:telnum,
      hasjuan:juantype,
      hasmanjian:hasmanjian,
      now:now,
      juli:juli,
      tuanNum:tuanNum
    })
    this.getaddr();
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
    var _this =this;
    var obj = this.data.obj;
    var money = Number(_this.data.juanmoney);
    var peisongtype = this.data.peisongtype;
    var endpaycash = Number(_this.data.endpaycash);
    var obj = _this.data.obj ;
    var type = true;
    if (money > 0){
      if (peisongtype){
        endpaycash = (Math.round(obj.payCash * 100 - money * 100 ) / 100).toFixed(2);
        // if (endpaycash <31){
        //   type = false;
        // }
      }else{
        endpaycash = (Math.round(obj.payCash * 100 - money * 100) / 100).toFixed(2);
        // if (endpaycash < 30) {
        //   type = false;
        // }
      }
    }
    // else{
    //   if (peisongtype) {
    //     if (obj.payCash < 31) {
    //       type = false;
    //     }
    //   } else {
    //     if (obj.payCash < 30) {
    //       type = false;
    //     }
    //   }
    // }
    this.setData({
      endpaycash:endpaycash,
      headshow:type
    })
    this.getjuan();
    
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