//index.js
//获取应用实例
var util = require('../../utils/util.js'); // 转换时间插件
var webim = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var webimhandler = require('../../utils/webim_handler.js'); // 这个是所有 im 事件的 js
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    tabindex: '1', //精选商品索引
    tjboxtype: false, //下面box是否固定
    condition: false, //模拟授权
    city: '', //城市信息
    adList: [], //首页轮播图
    shopList: [], //推荐好店列表
    newtype: false, //新人专享框状态动画
    newshowtype: false, //新人专享框状态显示隐藏
    sharetype: false, //新人专享框状态动画
    shareshowtype: false, //新人专享框状态显示隐藏
    tuijianpage: 1, //推荐商品页数    
    goodsList: [], //推荐商品列表
    maxpage: '', //最多页数
    shareobj: {},
    kostate: '',
    first: true
  },
  toheadxq(e) {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    var urltype = e.currentTarget.dataset.urltype;
    var adurl = e.currentTarget.dataset.adurl;
    if (urltype == 1) {
      wx.navigateTo({
        url: '../../baoA/pages/dianpu/dianpu?shopid=' + adurl,
      })
    }
    if (urltype == 4) {
      wx.navigateTo({
        url: '../../baoA/pages/cantuan/cantuan',
      })
    }
    if (urltype == 5) {
      wx.navigateTo({
        url: '../../baoA/pages/youhuijuan/youhuijuan',
      })
    }
    if (urltype == 7) {
      wx.navigateTo({
        url: '../../baoA/pages/xianshibuy/xianshibuy',
      })
    }
    if (urltype == 8) {
      wx.navigateTo({
        url: '../../baoA/pages/manjian/manjian',
      })
    }
    if(urltype == 2) {
      wx.navigateTo({
        url: '../../baoA/pages/shopxq/shopxq?goodsid=' + adurl,
      })
    }
  },
  //跳转推荐好店
  totuijianshop() {
    wx.navigateTo({
      url: '../../baoA/pages/tuijianshop/tuijianshop',
    })
  },
  //获取区县id
  gettownid() {
    var _this = this;
    var str = wx.getStorageSync('addressobj').district;
    if (str == '长垣县') {
      str = '长垣市'
    }
    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'locationTown',
        province: wx.getStorageSync('addressobj').province, //省    
        city: wx.getStorageSync('addressobj').city, //城市
        town: str, //区县
      },
      success: function success(res) {
        console.log(res);
        wx.setStorageSync('townid', res.data.townId)
      },
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    if (this.data.goodsList.length != 0) {
      if (this.data.tuijianpage == this.data.maxpage) {
        wx.showToast({
          title: '已经到底啦',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        this.setData({
          tuijianpage: _this.data.tuijianpage + 1
        })
        setTimeout(function() {
          _this.getInfo();
          _this.gettuijian();
        }, 0)
      }
    }

  },
  //获取推荐商品
  gettuijian() {
    var _this = this;


    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getRecomGoodsList',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag: _this.data.tabindex,
        nowPage: _this.data.tuijianpage

      },
      success: function success(res) {
        console.log(res);
        var list = res.data.goodsList;
        if (_this.data.tabindex == 2) {
          for (var i in list) {
            list[i].shopScore = Math.round(list[i].shopScore)
          }
        }
        if (_this.data.tuijianpage == 1) {
          _this.setData({
            goodsList: list,
            maxpage: res.data.totalPage
          })
        } else {
          var oldarr = _this.data.goodsList;
          var newarr = list;
          if (oldarr[oldarr.length - 1].goodsId == list[list.length - 1].goodsId) {
            return false
          }
          var endarr = oldarr.concat(newarr);
          _this.setData({
            goodsList: endarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()

      }
    });
  },
  //获取首页信息
  getInfo() {
    var _this = this;
    //获取首页数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMainInfo',
        userId: wx.getStorageSync('userid'),
        cityId: wx.getStorageSync('cityid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),

      },
      success: function success(res) {
        console.log(res);
        var list = res.data.shopList;
        for (var i in list) {
          list[i].shopScore = Math.round(list[i].shopScore)
        }
        if (!res.data.kostate) {
          res.data.kostate = ''
        }
        if (res.data.kostate == 1 && _this.data.first == true) {
          _this.setData({
            newshowtype: true,
            first: false,
            newtype: true,
            adList: res.data.adList,
            shopList: list,
            kostate: res.data.kostate
          })
        } else {
          _this.setData({
            adList: res.data.adList,
            shopList: list,
            kostate: res.data.kostate
          })
        }


        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
        setTimeout(function() {
          wx.hideLoading()

        }, 200)
        // if (_this.data.shareobj.type != undefined) {
        //   // setTimeout(function () {
        //   //   _this.showshare();
        //   // }, 1000)
        // }
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  // 跳转到新人专享
  tonewuser() {

    wx.navigateTo({
      url: '../../baoA/pages/newuser/newuser',
    })
    this.hiddennew();
  },
  //展示分享
  showshare() {
    var _this = this;
    this.setData({
      shareshowtype: true
    })
    setTimeout(function() {
      _this.setData({
        sharetype: true
      })
    }, 100)
  },
  //隐藏分享
  hiddenshare() {
    var _this = this;
    this.setData({
      sharetype: false
    })
    setTimeout(function() {
      _this.setData({
        shareshowtype: false,
        shareobj: {}
      })
    }, 300)
  },
  //展示新人专享图片
  shownew() {
    var _this = this;
    this.setData({
      newshowtype: true
    })
    setTimeout(function() {
      _this.setData({
        newtype: true
      })
    }, 100)
  },
  //隐藏新人专享图片
  hiddennew() {
    var _this = this;
    this.setData({
      newtype: false
    })
    setTimeout(function() {
      _this.setData({
        newshowtype: false
      })
    }, 300)
  },
  //首页初次请求的数据
  first() {
    var _this = this;

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(ress) {
            console.log(ress.result.address_component)
            _this.setData({
              city: ress.result.address_component.district
            })
            wx.setStorageSync("addressobj", ress.result.address_component);
            wx.setStorageSync("latitude", res.latitude);
            wx.setStorageSync("longitude", res.longitude);
            //获取对应城市id并储存
            wx.request({
              url: app.globalData.url, //自己的服务接口地址
              method: "post",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                cmd: 'locationCity',
                province: ress.result.address_component.province, //省    
                city: ress.result.address_component.city //城市
              },
              success: function success(data) {
                console.log(data);
                wx.setStorageSync("cityid", data.data.cityId);
                _this.getInfo(); //获取首页信息
                _this.gettuijian(); //获取推荐商品
              },
            });
          },
          fail: function(error) {
            console.error(error);
          },
        })

        if (_this.data.shareobj.type != undefined || wx.getStorageSync('addressobj').type != undefined) {
          wx.showLoading({
            title: '跳转中',
          })
          var options = _this.data.shareobj || wx.getStorageSync('addressobj');
          setTimeout(function() {
            var goodsid = options.goodsid;
            var type = options.type;
            var tourid = options.tourid;
            // 跳转小团
            if (type == 1) {
              wx.navigateTo({
                url: '../../baoA/pages/pintuanxq/pintuanxq?goodsid=' + goodsid,
              })
            }
            // 跳转限时
            if (type == 2) {
              wx.navigateTo({
                url: '../../baoA/pages/xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
              })
            }
            // 跳转满减
            if (type == 3) {
              wx.navigateTo({
                url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
              })
            }
            // 跳转直销
            if (type == 4) {
              wx.navigateTo({
                url: '../../baoA/pages/zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
              })
            }
            // 跳转大团商品
            if (type == 5) {
              wx.navigateTo({
                url: '../../baoA/pages/cantuanxq/cantuanxq?goodsid=' + goodsid,
              })
            }
            // 跳转普通商品
            if (type == 6) {
              wx.navigateTo({
                url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
              })
            }
            // 跳转多人团分享
            if (type == 7) {
              wx.navigateTo({
                url: '../../baoA/pages/sharexq/sharexq?goodsid=' + goodsid + '&tourid=' + tourid,
              })
            }
            // 跳转新人专享
            if (type == 8) {
              wx.navigateTo({
                url: '../../baoA/pages/newuserxqq/newuserxqq?goodsid=' + goodsid,
              })
            }
            // 跳转店铺
            if (type == 9) {
              wx.navigateTo({
                url: '../../baoA/pages/dianpu/dianpu?shopid=' + goodsid,
              })
            }
            // 跳转满减更多列表
            if (type == 10) {
              wx.navigateTo({
                url: '../../baoA/pages/manjianmore/manjianmore?shopid=' + goodsid,
              })
            }
          }, 500)
        }
      },
      fail(res) {
        wx.getSetting({
          success(res) {
            console.log(res.authSetting)
            if (res.authSetting['scope.userLocation'] == true) {
              _this.first()
            } else {
              wx.redirectTo({
                url: '../../baoA/pages/getdingwei/getdingwei'
              })
            }
          }
        })

      }

    })




  },
  //开启地图
  openmap() {
    var _this = this;
    app.globalData.isdingwei = true
    this.setData({
      tuijianpage: 1
    })
    wx.chooseLocation({
      success(res) {
        console.log(res, '地图')
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(ress) {
            console.log(ress, '地图')
            // console.log(ress.result.address_component)
            _this.setData({
              city: ress.result.address_component.district
            })
            wx.setStorageSync("addressobj", ress.result.address_component);
            wx.setStorageSync("latitude", res.latitude);
            wx.setStorageSync("longitude", res.longitude);
            wx.showLoading({
              title: '加载中',
            })
            //获取对应城市id并储存
            wx.request({
              url: app.globalData.url, //自己的服务接口地址
              method: "post",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: {
                cmd: 'locationCity',
                province: ress.result.address_component.province, //省    
                city: ress.result.address_component.city //城市
              },
              success: function success(data) {
                console.log(data);
                wx.setStorageSync("cityid", data.data.cityId);
                _this.getInfo(); //获取首页信息
                _this.gettuijian(); //获取推荐商品
              },
              fail: function fail() {
                // console.log("系统错误");
              }
            });
          },
          fail: function(error) {
            console.error(error);
          },
        })
      }
    })
  },

  // 监听页面滑动
  onPageScroll: function(e) {
    var _this = this;
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('#tuijiancon').boundingClientRect()
    query.exec(function(ress) {
      // console.log(ress[0])
      if (ress[0][0].top > 98) {
        _this.setData({
          tjboxtype: false,
          // uptype: true,
        })
      } else {
        _this.setData({
          tjboxtype: true,
          // uptype: true,
        })
      }

    })
  },
  // 跳转到消息
  tomsg() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../msg/msg',
    })
  },
  //跳转到搜索
  tosearch() {
    wx.navigateTo({
      url: '../searchall/searchall',
    })
  },
  // 推荐商品tab切换
  changetab(e) {
    var _this = this;
    // console.log(e.currentTarget.dataset.current)
    wx.showLoading({
      title: '加载中',
    })
    var tabindex = e.currentTarget.dataset.current;

    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getRecomGoodsList',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag: tabindex,
        nowPage: 1

      },
      success: function success(res) {
        console.log(res);
        var list = res.data.goodsList;
        if (tabindex == 2) {
          for (var i in list) {
            list[i].shopScore = Math.round(list[i].shopScore)
          }
        }

        _this.setData({
          tabindex: e.currentTarget.dataset.current,
          tuijianpage: 1,
          goodsList: list,
          maxpage: res.data.totalPage
        })
        wx.hideLoading()

      }
    });

  },
  //跳转到店铺
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    if (e.currentTarget.dataset.shopid) {
      var shopid = e.currentTarget.dataset.shopid;
    }

    var type = e.currentTarget.dataset.shoptype;
    if (type == 0) {
      wx.navigateTo({
        url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
      })
    }
    if (type == 5) {
      wx.navigateTo({
        url: '../../baoA/pages/pintuanxq/pintuanxq?goodsid=' + goodsid + '&shopid=' + shopid,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../../baoA/pages/xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '../../baoA/pages/zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 1) {
      wx.navigateTo({
        url: '../../baoA/pages/cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }

  },
  tosharexq(e) {
    var goodsid = this.data.shareobj.goodsid;
    var type = this.data.shareobj.type;
    var tourid = this.data.shareobj.tourid;
    if (type == 1) {
      wx.navigateTo({
        url: '../../baoA/pages/pintuanxq/pintuanxq?goodsid=' + goodsid,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '../../baoA/pages/xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '../../baoA/pages/zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 5) {
      wx.navigateTo({
        url: '../../baoA/pages/cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }
    if (type == 6) {
      wx.navigateTo({
        url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
      })
    }
    if (type == 7) {
      wx.navigateTo({
        url: '../../baoA/pages/sharexq/sharexq?goodsid=' + goodsid + '&tourid=' + tourid,
      })
    }
    if (type == 8) {
      wx.navigateTo({
        url: '../../baoA/pages/newuserxqq/newuserxqq?goodsid=' + goodsid,
      })
    }
    if (type == 9) {
      wx.navigateTo({
        url: '../../baoA/pages/dianpu/dianpu?shopid=' + goodsid,
      })
    }
    if (type == 10) {
      wx.navigateTo({
        url: '../../baoA/pages/manjianmore/manjianmore?shopid=' + goodsid,
      })
    }
    this.hiddenshare();
  },
  onLoad: function(options) {
    var _this = this;
    app.globalData.isdingwei = false
    wx.showLoading({
      title: '加载中',
    })
    // 实例化API核心类
    if (options.type != undefined) {
      if (options.tourid) {
        var tourid = options.tourid;
      } else {
        var tourid = '';
      }
      var obj = {
        type: options.type,
        goodsid: options.goodsid,
        name: options.name,
        goodsimg: options.goodsimg,
        userimg: options.userimg,
        tourid: tourid
      }
      _this.setData({
        shareobj: obj
      })
      wx.setStorageSync('shareobj', obj)

    }
    qqmapsdk = new QQMapWX({
      key: 'JZPBZ-U5CWU-WAMVJ-2SCHB-AQDY5-LKF6U' //腾讯地图key
    });


  },
  onShow: function() {
    var _this = this;
    if (app.globalData.isdingwei == false) {
      _this.first();
      setTimeout(function() {
        _this.gettownid();
      }, 500)
    } else {
      var city = wx.getStorageSync('addressobj').district;
      this.setData({
        city: city
      })
      // this.getInfo();  //获取首页信息

      // this.gettuijian();  //获取推荐商品
      if (_this.data.shareobj.type != undefined || wx.getStorageSync('addressobj').type != undefined) {
        wx.showLoading({
          title: '跳转中',
        })
        var options = _this.data.shareobj || wx.getStorageSync('addressobj');
        setTimeout(function() {
          var goodsid = options.goodsid;
          var type = options.type;
          var tourid = options.tourid;
          if (type == 1) {
            wx.navigateTo({
              url: '../../baoA/pages/pintuanxq/pintuanxq?goodsid=' + goodsid,
            })
          }
          if (type == 2) {
            wx.navigateTo({
              url: '../../baoA/pages/xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
            })
          }
          if (type == 3) {
            wx.navigateTo({
              url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
            })
          }
          if (type == 4) {
            wx.navigateTo({
              url: '../../baoA/pages/zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
            })
          }
          if (type == 5) {
            wx.navigateTo({
              url: '../../baoA/pages/cantuanxq/cantuanxq?goodsid=' + goodsid,
            })
          }
          if (type == 6) {
            wx.navigateTo({
              url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
            })
          }
          if (type == 7) {
            wx.navigateTo({
              url: '../../baoA/pages/sharexq/sharexq?goodsid=' + goodsid + '&tourid=' + tourid,
            })
          }
          if (type == 8) {
            wx.navigateTo({
              url: '../../baoA/pages/newuserxqq/newuserxqq?goodsid=' + goodsid,
            })
          }
          if (type == 9) {
            wx.navigateTo({
              url: '../../baoA/pages/dianpu/dianpu?shopid=' + goodsid,
            })
          }
          if (type == 10) {
            wx.navigateTo({
              url: '../../baoA/pages/manjianmore/manjianmore?shopid=' + goodsid,
            })
          }
        }, 500)
      }
    }

  },
  onPullDownRefresh: function() {
    this.setData({
      tuijianpage: 1
    })
    wx.showNavigationBarLoading();
    this.getInfo(); //获取首页信息
    this.gettuijian(); //获取推荐商品

  },
  onHide: function() {
    wx.removeStorageSync('shareobj');
    this.setData({
      shareobj: {}
    })
    console.log(111)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('shareobj');
    this.setData({
      shareobj: {}
    })
  },
})