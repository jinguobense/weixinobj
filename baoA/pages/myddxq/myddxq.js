// pages/myddxq/myddxq.js
const app = getApp();
const QRCode = require('../../../utils/weapp-qrcode.js')
import rpx2px from '../../../utils/rpx2px.js'
let qrcode;
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(400)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peisongtype: false ,     //false自提 true配送
    info:{},
    rfstate:'',   //0退款中  2拒绝
    text: '',
    image: '',
    // 用于设置wxml里canvas的width和height样式
    qrcodeWidth: qrcodeWidth,
    imgsrc: '',
    sizexzbox: true,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    orderid:'',
    flag:'',
    ordertype:'',
    timer:'',
    isend: true,
    first:true,
  },
  openmap11(info) {
    var _this = this;
    var lat = wx.getStorageSync('latitude')
    var lng = wx.getStorageSync('longitude')
    var juli = this.jisuan(Number(lng), Number(lat), Number(info.lng), Number(info.lat))
    if (juli > 1000) {
      juli = (juli / 1000).toFixed(2) + 'km'
    } else {
      juli = Math.ceil(juli) + 'm'
    }
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
      location: info.lat + ',' + info.lng, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
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
            content: '距您' + juli,
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
  //计算距离
  jisuan(longt1, lat1, longt2, lat2) {
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
  //实时获取订单状态
  getordertype(){
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
        flag: _this.data.flag,
      },
      success: function success(res) {
        console.log(res);
        if(res.data.state != _this.data.ordertype){
          wx.showToast({
            title: '取货成功!',
            icon:'none',
            duration:1500
          })
          setTimeout(function(){
            var orderid = _this.data.orderId;
            var flag = _this.data.flag;
            var orderNo = _this.data.info.orderNo;
            wx.request({
              url: app.globalData.url, //自己的服务接口地址
              method: "post",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                cmd: 'getOrderDetail',
                userId: wx.getStorageSync('userid'),
                orderNo: orderNo,
                flag: flag,
              },
              success: function success(res) {
                console.log(res);
                if (res.data.result == 0) {
                  _this.setData({
                    info: res.data,
                    text: res.data.orderNo,
                    ordertype: res.data.state
                  })
                  _this.closechoosebox()
                }
              }
            });
          },1500)
        }else{
          if(_this.data.isend == true){
            setTimeout(function () {
              _this.getordertype()
            }, 2000)
          }
          
        }
      }
    });
  },
  togoodsxq(e){
    var type = e.currentTarget.dataset.type;
    var goodsid = e.currentTarget.dataset.goodsid;
    if(type == 0){
      var _this = this;
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getCsGoodsDetail',
          userId: wx.getStorageSync('userid'),
          goodsId: goodsid,
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
        },
        success: function (res) {
          if (res.data.result == 0){
            wx.navigateTo({
              url: '../shopxq/shopxq?goodsid=' + goodsid,
            })
          }else{
            wx.navigateTo({
              url: '../manjianxq/manjianxq?goodsid=' + goodsid,
            })
          }
        }
      })


      
    }
    if (type == 1) {
      wx.navigateTo({
        url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 5) {
      wx.navigateTo({
        url: '../pintuanxq/pintuanxq?goodsid=' + goodsid,
      })
    }
    if (type == 6) {
      wx.navigateTo({
        url: '../newuserxqq/newuserxqq?goodsid=' + goodsid,
      })
    }
    
  },
  lookmap() {
    var _this = this;
    var latitude = Number(_this.data.info.lat);
    var longitude = Number(_this.data.info.lng);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  toyaoqing(e) {
    var orderid = e.currentTarget.dataset.orderid;
     
    wx.navigateTo({
      url: '../toyaoqing/toyaoqing?orderid=' + orderid + '&shopname='+ this.data.info.shopName,
    })
  },
  toyaoqingdt(e) {
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../cantuanxqshare/cantuanxqshare?goodsid=' + goodsid,
    })
  },
  getcode(){
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
    var verno;
    if (this.data.info.verno){
      verno = this.data.info.verno
    }else{
      verno = ''
    }
    var str = z.data.text + '@' + verno;
    qrcode.makeCode(str, () => {
      // 回调
      setTimeout(() => {
        qrcode.exportImage(function (path) {
          console.log(path)
          z.setData({
            imgsrc: path
          })
        })
      }, 200)
    })
  },
  //弹出尺码选择窗口
  tanchusizebox(e) {
    var _this = this;
    if (this.data.text && this.data.info.verno){
      var timer = setTimeout(function () {
        _this.getordertype()
      }, 1000)
      this.setData({
        blackzt: 'block',
        timer: timer,
        sizexzbox: false,
        isend: true
      })
    }
    
    
  },
  //关闭尺码选择窗口
  closechoosebox() {
    var _this = this;
    clearTimeout(_this.data.timer)
    this.setData({
      sizexzbox: true,
      timer:'',
      blackzt: 'none',
      isend:false
    })
    

  },
  topingjia(e){
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../pingjia/pingjia?orderid='+orderid,
    })
  },
  //确认收货
  shouhuo(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var _this = this;
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
        if (res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
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
        
      }
    });
  },
  //去支付
  pay(e) {
    var money = e.currentTarget.dataset.money;
    var orderid = e.currentTarget.dataset.orderid;
    var orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: "../pay/pay?pay=" + money + "&num=" + orderno + "&orderid=" + orderid + '&type=1'
    });
  },
  //取消订单
  quxiao(e) {
    var _this = this;
    var orderid = e.currentTarget.dataset.orderid;
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
        if (res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
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
        
        
      }
    });
  },
  //去申请退款
  totuikuan(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: "../totuikuan/totuikuan?orderid=" + orderid + '&type=' + type
    });
  },
  //复制
  fuzhi(){
    var _this =this;
    wx.setClipboardData({
      data: _this.data.info.orderNo,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    qqmapsdk = new QQMapWX({
      key: 'JZPBZ-U5CWU-WAMVJ-2SCHB-AQDY5-LKF6U'  //腾讯地图key
    });
    
    var _this = this;
    if (options.rfstate){
      if (options.rfstate != 'undefined'){
        this.setData({
          rfstate: Number(options.rfstate) 
        })
        console.log(options.rfstate)
      }
    }
    var orderid = options.orderid;
    var type = options.type;
    if(type == 8){
      var flag = 1;
    }else{
      var flag = 0;
    }
    
    wx.showLoading({
      title: '加载中',
    })
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
        if (res.data.result == 0){
          _this.setData({
            info:res.data,
            text:res.data.orderNo,
            orderid:orderid,
            flag:flag,
            ordertype: res.data.state,
            first:false,
          })
        }
        //获取地图
        _this.openmap11(res.data);
        _this.getcode();
        wx.hideLoading()
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
    var _this = this;
    if(this.data.first == false){
      wx.showLoading({
        title: '加载中',
      })
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
          flag: _this.data.flag,
        },
        success: function success(res) {
          console.log(res);
          if (res.data.result == 0) {
            _this.setData({
              info: res.data,
              text: res.data.orderNo,
              ordertype: res.data.state
            })
          }
          wx.hideLoading()
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this;
    this.setData({
      timer: '',
      isend: false
    })
    clearTimeout(_this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this;
    this.setData({
      timer:'',
      isend: false
    })
    clearTimeout(_this.data.timer)
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