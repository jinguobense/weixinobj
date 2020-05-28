// pages/dianpu/dianpu.js
const app = getApp();
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageheight: '',  //页面高
    tabindex: 0,    //分类索引
    foottype:true,    //是否滑到了固定位置
    uptype: false,   //右侧弹出框
    blackzt1: 'none',  //黑幕层显示/隐藏状态
    num: 1,         //购买数量
    showtype:false, 
    guigeindex: 0,    //规格索引
    sizexzbox: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    headertop:0, 
    longstr:0,  //上次距离  
    foottop:0,
    pagewidth:0,   //屏幕宽   
    shopid:'',     //商品id
    info:{},      //店铺详情
    conlist:[],    //内容列表
    page:1,       //当前页数
    goodsindex:'',    //当前点击第几个商品
    carlist:[],     //购物车列表
    heji:0,      //购物车合计
    star:'',
    hdheight:0,
    isOverShare: true,
    maxpage:'',
    endheji:0,
    isshoucang:null,
    isend:false,
    startmoney:0, //起送金额
    goodsnum:0,//商品数量
    peisong:true,
  },
  clearCar(){
    var that = this
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'removeShopCart',
        flag: 0,
        userId: wx.getStorageSync('userid'),
        goodsList: JSON.stringify(that.data.carlist)
      },
      success: function (res) {
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1500
        })
        that.getcarlist()
        that.closelistbox()
      },
    });
  },
  shoucang(e){
    var type = e.currentTarget.dataset.type;
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    var _this = this;
    //收藏/取消
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'collect',
        userId: wx.getStorageSync('userid'),
        type: 1,
        // goodsId: _this.data.shopId
        cid: _this.data.info.shopId,
        isCollect: type
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          isshoucang:type
        })
        console.log(type)
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1500
        })
      },
    });
  },
  tobottom(){
    var _this = this;
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
      _this.getconlist();
    }
  },
  openmap11(){
    
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
      location: '34.758578,113.689347', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {//成功后的回调
        console.log(res);
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
          iconPath: '../../images/dianpu/shopdingwei.png',//图标路径
          width: 25,
          height: 28,
          callout: { //在markers上展示地址名称，根据需求是否需要
            content: '距您' + _this.data.info.shopDistance,
            color: '#000',
            padding:'10rpx',
            radius:'5rpx',
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
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: '',
      to: '34.758578,113.689347',
      success: function (res) {
        console.log(res);
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
        console.log(pl)
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
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  toimgxq(e){
    var _this = this;
    var urltype = e.currentTarget.dataset.urltype;
    var goodstype = e.currentTarget.dataset.goodstype;
    var urlvalue = e.currentTarget.dataset.urlvalue;
    if(urltype == 2){
      wx.showToast({
        title: urlvalue,
        icon: 'none',
        duration: 1500
      })
      // if(goodstype == 0){
      //   wx.navigateTo({
      //     url: '../shopxq/shopxq?goodsid=' + urlvalue,
      //   })
      // }
      // if (goodstype == 1) {
      //   wx.navigateTo({
      //     url: '../cantuanxq/cantuanxq?goodsid=' + urlvalue,
      //   })
      // }
      // if (goodstype == 2) {
      //   wx.navigateTo({
      //     url: '../manjianxq/manjianxq?goodsid=' + urlvalue,
      //   })
      // }
      // if (goodstype == 3) {
      //   wx.navigateTo({
      //     url: '../xianshibuyxq/xianshibuyxq?goodsid=' + urlvalue,
      //   })
      // }
      // if (goodstype == 10) {
      //   wx.navigateTo({
      //     url: '../zhixiaoxq/zhixiaoxq?goodsid=' + urlvalue,
      //   })
      // }
    }
    if (urltype == 0) {
      if (goodstype == 0) {
        wx.navigateTo({
          url: '../shopxq/shopxq?goodsid=' + urlvalue,
        })
      }
      if (goodstype == 1) {
        wx.navigateTo({
          url: '../cantuanxq/cantuanxq?goodsid=' + urlvalue,
        })
      }
      if (goodstype == 2) {
        wx.navigateTo({
          url: '../manjianxq/manjianxq?goodsid=' + urlvalue,
        })
      }
      if (goodstype == 3) {
        wx.navigateTo({
          url: '../xianshibuyxq/xianshibuyxq?goodsid=' + urlvalue,
        })
      }
      if (goodstype == 10) {
        wx.navigateTo({
          url: '../zhixiaoxq/zhixiaoxq?goodsid=' + urlvalue,
        })
      }
      // baoA / pages / pintuanxq / pintuanxq
      if (goodstype == 11) {
        wx.navigateTo({
          url: '../pintuanxq/pintuanxq?goodsid=' + urlvalue,
        })
      }
    }
    if (urltype == 1){
      if (urlvalue == 1){
        wx.navigateTo({
          url: '../pintuan/pintuan?shopid=' + _this.data.shopid,
        })
      }
      if (urlvalue == 3) {
        wx.navigateTo({
          url: '../manjianmore/manjianmore?shopid=' + _this.data.shopid,
        })
      }
      if (urlvalue == 4) {
        wx.navigateTo({
          url: '../xianshibuy/xianshibuy?shopid=' + _this.data.shopid,
        })
      }
      if (urlvalue == 6) {
        wx.navigateTo({
          url: '../pintuan/pintuan?shopid=' + _this.data.shopid,
        })
      }
      if (urlvalue == 5) {
        wx.navigateTo({
          url: '../youhuijuan/youhuijuan?shopid=' + _this.data.shopid,
        })
      }
    }

  },
  lookmap(){
    var _this = this;
    var latitude = Number(_this.data.info.shopLat);
    var longitude = Number(_this.data.info.shopLng);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  //跳转到搜索
  tosearch(e) {
    var shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '../../../pages/search/search?shopid='+shopid,
    })
  },
  //跳转客服
  tokefu(){
    var _this = this;
    var friendid = this.data.info.shopRcToken;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getChatFace',
        userId: friendid,
        flag:1
      },
      success: function success(res) {
        console.log(res);
        var name = res.data.chatName;
        var img = res.data.chatFace;
        if (res.data.result == 0){
          wx.navigateTo({
            url: '../kefu/kefu?friendId=' + friendid + '&friendName=' + name +'&friendAvatarUrl='+img,
          })
        } 
      }
    });
  },
  //跳转到厂家直销
  tozhixiao() {
    var _this = this;
    wx.navigateTo({
      url: '../zhixiao/zhixiao?shopid=' + _this.data.shopid,
    })
  },
  //跳转到限时抢购
  toxianshibuy() {
    var _this = this;
    wx.navigateTo({
      url: '../xianshibuy/xianshibuy?shopid=' + _this.data.shopid,
    })
  },
  //跳转到优惠券
  toyouhui(){
    var _this = this;
    wx.navigateTo({
      url: '../youhuijuan/youhuijuan?shopid=' + _this.data.shopid,
    })
  },
  //跳转满减
  tomanjian() {
    var _this = this;
    wx.navigateTo({
      url: '../manjianmore/manjianmore?shopid=' + _this.data.shopid,
    })
  },
  //跳转拼团
  topintuan(){
    var _this = this;
    wx.navigateTo({
      url: '../pintuan/pintuan?shopid='+_this.data.shopid,
    })
  },
  //打电话
  totel(){
    var tel = this.data.info.shopPhone;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  },
  //去结算
  tosuredd() {
    var _this = this;
    var shopid = this.data.shopid;
    var goodslist = [];
    var list = this.data.carlist;
    for (var i in list) {
      goodslist.push({
        goodsId: list[i].goodsId,
        skuId: list[i].skuId,
        goodsBuyNum: list[i].goodsBuyNum,
      })
    }
    var goodslist = JSON.stringify(goodslist);
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'toCsBalance',
        userId: wx.getStorageSync('userid'),
        shopId: shopid,
        goodsList: goodslist
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0) {
          var obj = JSON.stringify(res.data)
          wx.navigateTo({
            url: '../suredd/suredd?obj=' + obj + '&type=onepin&juantype=true',
          })
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1500
          })
        }

      }
    });

  },
  //单商品加
  carchange(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var skuid = e.currentTarget.dataset.skuid;
    var type = e.currentTarget.dataset.type;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'addShopCart',
        flag: 0,
        userId: wx.getStorageSync('userid'),
        goodsId: goodsid,
        skuId: skuid,
        operType: type,
        goodsBuyNum: 1,
      },
      success: function success(res) {
        // console.log(res);
        if (res.data.result == 0) {
          _this.getcarlist();
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1500
          })
        }

      }
    });

  },
  //单商品减
  carchange1(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var skuid = e.currentTarget.dataset.skuid;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var carlist = this.data.carlist;
    var goodslist = [{
      goodsId: goodsid,
      skuId: skuid
    }]
    var goodslist = JSON.stringify(goodslist)
    if (carlist[index].goodsBuyNum == 1){
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'removeShopCart',
          userId: wx.getStorageSync('userid'),
          flag: 0,
          goodsList: goodslist
        },
        success: function success(res) {
          console.log(res);
          if (res.data.result == 0) {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1500
            })
            _this.closelistbox();
            _this.getcarlist();
          } else {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1500
            })
          }

        }
      });
      return false;
    }
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'addShopCart',
        flag: 0,
        userId: wx.getStorageSync('userid'),
        goodsId: goodsid,
        skuId: skuid,
        operType: type,
        goodsBuyNum: 1,
      },
      success: function success(res) {
        // console.log(res);
        if (res.data.result == 0) {
          _this.getcarlist();
        } else {
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
          })
        }

      }
    });

  },
  //加入购物车
  addcar(){
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    var _this = this;
    var guigeindex = this.data.guigeindex;
    var goodsindex = this.data.goodsindex;
    var conlist = this.data.conlist;
    var guigelist = conlist[goodsindex].goodsSku;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'addShopCart',
        flag: 0,
        userId: wx.getStorageSync('userid'),
        goodsId:conlist[goodsindex].goodsId,
        skuId: guigelist[guigeindex].skuId,
        operType:0,
        goodsBuyNum:_this.data.num
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon:"none",
            duration:1000
          })
          _this.closechoosebox();
          _this.getcarlist();
          
        }else{
          wx.showToast({
            title: res.data.resultNote,
            icon: "none",
            duration: 1000
          })
        }


      },
    });


  },
  //获取购物车列表
  getcarlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getShopCartList',
        shopId: _this.data.shopid,
        flag:0,
        userId: wx.getStorageSync('userid'),
      },
      success: function success(res) {
        console.log(res);
        var heji = 0;
        var carlist = [];
        var endheji = 0;
        var peisong = true
        var goodsnum = 0 //购物车商品数量    2020.3.13新改动
        if (res.data.shopCartList.length > 0){
          var carlist = res.data.shopCartList[0].goodsList;
          for (var i in carlist) {
            var num = Number(carlist[i].goodsBuyNum);
            goodsnum = goodsnum + num
            var money = Number(carlist[i].goodsCurPrice);
            heji = Math.round(heji * 100 + (num * (money * 100))) / 100;
            endheji = Math.round( 3000 - (heji * 100) ) / 100;
            if (carlist[i].distribut==1){
              peisong = false
            }
          }
        }
        
        _this.setData({
          heji:heji,
          endheji: endheji,
          carlist: carlist,
          goodsnum: goodsnum,
          peisong: peisong
        })


      },
    });
  },
  //跳转详情
  toxq(e){
    var type = e.currentTarget.dataset.type;
    var goodsid = e.currentTarget.dataset.goodsid;
    var shopid= this.data.shopid;
    if (type == 0) {
      wx.navigateTo({
        url: '../shopxq/shopxq?goodsid=' + goodsid,
      })
    }
    if (type == 6) {
      wx.navigateTo({
        url: '../shopxq/shopxq?goodsid=' + goodsid + '&shopid='+shopid,
      })
    }
  },
  //获取商品详情
  getconlist(){
    var _this = this;
    var index = this.data.tabindex
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getGoodsList',
        shopId: _this.data.shopid,
        flag:0,
        goodsTypeId: _this.data.info.goodsTypeList[index].goodsTypeId,
        nowPage:_this.data.page,
      },
      success: function success(res) {
        console.log(res);
      if (res.data.result == 0){

        if (_this.data.page == 1) {
          _this.setData({
            conlist: res.data.goodsList,
            maxpage: res.data.totalPage,
            
          })
        } else {
          var oldarr = _this.data.conlist;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            conlist: endarr,
            maxpage: res.data.totalPage,
          })

        }
        setTimeout(function () {
          wx.hideLoading()
        }, 50)
      }else{
        wx.hideLoading()
        wx.showToast({
          title: res.data.resultNote,
          icon:'none',
          duration:1000
        })
      }

        
        

      },
    });
  },
  //获取店铺详细数据
  getinfo(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getShopDetail',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        userId: wx.getStorageSync('userid'),
        shopId:_this.data.shopid
      },
      success: function success(res) {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res.data.shopDetail.shopName
        })
        var star = res.data.shopDetail.shopScore;
        star = Math.round(star)
        var foottop = _this.data.foottop;
        setTimeout(function(){
          if (res.data.shopDetail.clusterGoodsFlag == 0 && res.data.shopDetail.fullRedGoodsFlag == 0 && res.data.shopDetail.agtGoodsFlag == 0 && res.data.shopDetail.timeLimGoodsFlag == 0 && res.data.shopDetail.couFlag == 0){
            foottop = foottop - 200;
            _this.data.foottop = foottop;
            _this.setData({
              foottop: foottop,
            })
          }
        },500)
        
        res.data.shopDetail.shopRate = parseInt(res.data.shopDetail.shopRate * 100)
        var startmoney = res.data.shopDetail.disfee;
        _this.setData({
          info: res.data.shopDetail,
          star:star,
          startmoney: startmoney,
          foottop: foottop,
          isshoucang: res.data.shopDetail.isCollect,
          isend: true
        })
        if (res.data.shopDetail.goodsTypeList.length >0){
          _this.getconlist();
        }else{
          wx.hideLoading();
          
        }
          
      },
    });
  },
  // // 监听页面滚动
  // onPageScroll: function (e) {
  //   // console.log(e.scrollTop + '++++++++++');//{scrollTop:99}
  //   // console.log(e)
  //   var _this = this
  //   var str = e.scrollTop - this.data.longstr;

  //   this.setData({
  //     headertop: str / 2 + this.data.headertop,
  //     longstr: e.scrollTop
  //   })
  //   const query = wx.createSelectorQuery()
  //   query.select('#Footer').boundingClientRect()
  //   query.selectViewport().scrollOffset()
  //   query.exec(function (res) {
  //     console.log(res)
  //     if (res[0].top <= 0) {
  //       _this.setData({
  //         foottype: true,
  //         // uptype: true,
  //       })
  //     } else {
  //       _this.setData({
  //         foottype: false,
  //         // uptype: true,
  //       })
  //     }
  //   })

  //   console.log(this.data.headertop + '-----' + this.data.longstr)
  // },
  //滚动监听
  scroll(e){
    // console.log(e.detail.scrollTop)
    // var _this = this
    // this.setData({
    //   // headertop: -e.detail.scrollTop/(_this.data.pagewidth / 750)  ,
    //   longstr: e.detail.scrollTop
    // })
    // const query = wx.createSelectorQuery()
    // query.select('#Footer').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(function (res) {
    //   // console.log(res)
    //   if (res[0].top <= 0) {
    //     _this.setData({
    //       foottype: true,
    //       // uptype: true,
    //     })
    //   } else {
    //     _this.setData({
    //       foottype: false,
    //       // uptype: true,
    //     })
    //   }
    // })
  },
  // 去店铺简介
  tojianjie(){
    var obj ={};
    obj.name = this.data.info.shopName;
    obj.time = this.data.info.busiTime;
    obj.addr = this.data.info.shopAddr;
    obj.img = this.data.info.shopBriefImgs;
    wx.navigateTo({
      url: '../dianpuxx/dianpuxx?obj=' + JSON.stringify(obj) ,
    })
  },
  //加
  spinnerJia: function () {
    var that = this;
    this.data.num++;
    this.setData({
      num: this.data.num
    })
  },

  //减
  spinnerJian: function () {
    var that = this;
    if (this.data.num > 1) {
      this.data.num--;
    }
    this.setData({
      num: this.data.num
    })

  },
  //弹出尺码选择窗口
  tanchusizebox(e) {
    var _this = this;
    this.setData({
      blackzt: 'block',
      goodsindex: e.currentTarget.dataset.index,
      num:1,
    })
    setTimeout(function () {
      _this.setData({
        sizexzbox: true,
        guigeindex:0
      })
    }, 100)
  },
  //关闭尺码选择窗口
  closechoosebox() {
    var _this = this;
    this.setData({
      sizexzbox: false
    })
    setTimeout(function () {
      _this.setData({
        blackzt: 'none'
      })
    }, 300)

  },
  //规格切换
  changeguige(e) {
    this.setData({
      guigeindex: e.currentTarget.dataset.index,

    })
  },
  //弹出尺码选择窗口
  tanchulistbox() {
    var _this = this;
    if(this.data.carlist.length >0){
      this.setData({
        blackzt1: 'block',
      })
      setTimeout(function () {
        _this.setData({
          showtype: true
        })
      }, 100)
    }else{
      wx.showToast({
        title: '购物车暂无商品',
        icon:'none',
        duration:1000
      })
    }
  },
  //关闭尺码选择窗口
  closelistbox() {
    var _this = this;
    this.setData({
      showtype: false
    })
    setTimeout(function () {
      _this.setData({
        blackzt1: 'none'
      })
    }, 300)

  },

  // 分类tab切换
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tabindex: e.currentTarget.dataset.current,
      page:1,
    })
    this.getconlist();
  },
  // 回到顶部
  totop(){
    // this.setData({
    //   foottype: false,
    //   uptype: false,
    //   foottype: false,
    // })
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    var shopid = options.shopid;
    this.setData({
      shopid:shopid
    })
    
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        _this.setData({
          pageheight: (res.windowHeight * 2) / ((res.windowWidth * 2) / 750),
          pagewidth: res.windowWidth * 2
        })
        const query = wx.createSelectorQuery()
        query.select('#header').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (ress) {
          console.log(ress[0].height)
          _this.setData({
            foottop: ress[0].height * 2 / (res.windowWidth * 2 / 750)
          })
          console.log(ress)
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    _this.getcarlist();
    setTimeout(function(){
     _this.getinfo();
      
    },500)
    qqmapsdk = new QQMapWX({
      key: 'JZPBZ-U5CWU-WAMVJ-2SCHB-AQDY5-LKF6U'  //腾讯地图key
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
  
  //分享
  onShareAppMessage: function onShareAppMessage(res) {
    
    var _this = this;
    var goodsid = this.data.shopid;
    var info = this.data.info;
    var name = wx.getStorageSync('userInfo').nickName;
    var userimg = wx.getStorageSync('userInfo').avatarUrl;
    return {
      path: "/pages/index/index?goodsid=" + goodsid + '&type=9&name=' + name + '&goodsimg=' + info.shopLogo + '&userimg=' + userimg,
      imageUrl: info.shopLogo,
      title: info.shopName
    };
  },
})