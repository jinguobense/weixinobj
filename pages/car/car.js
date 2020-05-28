// pages/car/car.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,    //页数
    guesslist:[],   //猜你喜欢推荐
    maxpage:'',     //猜你喜欢最大页数
    guanlitype:false,
    list:[],              //购物车列表
    chooselist:[],        //购物车选中状态列表 0未选中1选中
    qxtype:false,
    listtype:0,
    scrollTop: 0,
    adlistimg:[]
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    // this.setData({
    //   num: e.detail.value
    // })
    console.log(e)
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var skuid = e.currentTarget.dataset.skuid;
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var money = e.currentTarget.dataset.money;
    var list = this.data.list;
    var num = e.detail.value;
    list[index].goodsList[indexs].goodsBuyNum = e.detail.value;
    this.setData({
      list: list
    })

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
        operType: 2,
        goodsBuyNum: num,
      },
      success: function success(res) {
        // console.log(res);
        var index = e.currentTarget.dataset.index;
        var indexs = e.currentTarget.dataset.indexs;
        var money = e.currentTarget.dataset.money;
        if (res.data.result == 0) {
          var list = _this.data.chooselist;
          var carlist = _this.data.list;
          // var heji = list[index].heji;
          if (list[index].list[indexs].type == 1) {
            var heji = 0;
            for (var i in list[index].list) {
              var money = Number(carlist[index].goodsList[i].goodsCurPrice);
              var num = Number(carlist[index].goodsList[i].goodsBuyNum);
              heji = (Math.round(heji * 100 + (money * num * 100))) / 100
              // list[index].list[i].type = 1;

            }
            // list[index].btntype = true;
            list[index].heji = heji
            _this.setData({
              chooselist: list
            })
          }
          // 
          //   if (type == 1) {
          //     list[index].heji = Math.round((heji * 100) - (Number(money) * 100)) / 100;
          //   }
          //   if (type == 0) {
          //     list[index].heji = Math.round((heji * 100) + (Number(money) * 100)) / 100;
          //   }
          //   console.log(list)
            

          // }

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
  imageLoad(e) {
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var adlist = this.data.list;
    var adlistimg = this.data.adlistimg;
    if (adlistimg.length == 0) {
      console.log(adlist.length)
      for (var i in adlist.length) {
        adlistimg.push({
          list:[]
        })
        console.log(11)
        for (let l in adlist[i].goodsList.length){
          adlistimg[i].list.push(0)
        }
      }
    }
    
    // adlistimg[index].list[indexs] = 1;
    this.setData({
      adlistimg: adlistimg
    })
  },
  //购物车信息点击去详情
  carxq(e){
    var _this = this;
    var cstype = e.currentTarget.dataset.cstype;
    var goodsid = e.currentTarget.dataset.goodsid;
    if(cstype == 0){
      wx.navigateTo({
        url: '../../baoA/pages/shopxq/shopxq?goodsid='+ goodsid,
      })
    }
    if (cstype == 1) {
      wx.navigateTo({
        url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }

  },
  //去结算
  tosuredd(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    
    var goodslist = [];
    var list = this.data.list;
    var clist = this.data.chooselist;
    var shopid = list[index].shopId;
    for(var i in clist[index].list){
      if(clist[index].list[i].type == 1){
        goodslist.push({
          goodsId: list[index].goodsList[i].goodsId,
          skuId: list[index].goodsList[i].skuId,
          goodsBuyNum: list[index].goodsList[i].goodsBuyNum,
        })
      }
    }
    if(goodslist.length == 0){
      wx.showToast({
        title: '请选择要结算商品',
        icon:'none',
        duration:1000
      })
      return false;
    }
    console.log(clist[index].isps)
    if (clist[index].isps == false){
      wx.showToast({
        title: '结算商品中包含有不支持配送的商品',
        icon: 'none',
        duration: 1000
      })
      return false;
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
        shopId:shopid,
        goodsList: goodslist
      },
      success: function success(res) {
        console.log(res);
        if (res.data.result == 0) {
          var obj = JSON.stringify(res.data)
          var hasmanjian = true;
          for(var i in res.data.goodsList){
            if(res.data.goodsList[i].csType == 0){
              hasmanjian = false
            }
          }
          console.log(hasmanjian)
          wx.navigateTo({
            url: '../../baoA/pages/suredd/suredd?obj=' + obj + '&type=onepin&juantype=true&hasmanjian='+hasmanjian,
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

  },
  //移除购物车选中列表
  del(){
    var _this = this;
    var list = this.data.chooselist;
    var carlist = this.data.list;
    var goodslist = [];
    for(var i in list){
      for(var n in list[i].list){
        var goodsid = carlist[i].goodsList[n].goodsId;
        var skuid = carlist[i].goodsList[n].skuId;
        if (list[i].list[n].type == 1){
          goodslist.push({
            goodsId:goodsid,
            skuId:skuid
          })
        }
      }
    }
    var goodslist = JSON.stringify(goodslist)
    wx.showModal({
      title: '提示',
      content: '是否删除选中购物车商品',
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
                  duration: 1000
                })
                _this.setData({
                  chooselist:[]
                })
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
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })

    



  },
  //全选
  quanxuan(){
    var carlist = this.data.list;
    var list = this.data.chooselist;
    var type = !this.data.qxtype;
    if (type) {
      for (var i in list) {
        list[i].type = 1;
        list[i].btntype = true;
        var heji = 0;
        for (var n in list[i].list) {
          list[i].list[n].type = 1
          var money = Number(carlist[i].goodsList[n].goodsCurPrice);
          var num = Number(carlist[i].goodsList[n].goodsBuyNum);
          heji = (Math.round(heji*100 + (money * num*100)))/100
          if (carlist[i].goodsList[n].distribut == 1 || carlist[i].goodsList[n].distribut == null || carlist[i].disfee == null ){
            list[i].isps = false;
          }
        }
        list[i].heji = heji;
      }
      this.setData({
        chooselist: list,
        qxtype: type
      })
    } else {
      for (var i in list) {
        list[i].type = 0;
        list[i].heji = 0;
        list[i].isps = true;
        list[i].btntype = false;
        for (var n in list[i].list) {
          list[i].list[n].type = 0
        }
      }
      this.setData({
        chooselist: list,
        qxtype: type
      })
    }

  },
  //店铺点击状态
  dpchange(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.chooselist;
    var type = list[index].type;
    var carlist = this.data.list;
    if (type == 0) {
      type = 1
    } else {
      type = 0
    }
    list[index].type = type;
    if(type == 1){
      var heji = 0;
      for (var i in list[index].list){
        var money = Number(carlist[index].goodsList[i].goodsCurPrice);
        var num = Number(carlist[index].goodsList[i].goodsBuyNum);
        heji = (Math.round(heji * 100 + (money * num * 100))) / 100
        list[index].list[i].type = 1;
        if (carlist[index].goodsList[i].distribut == 1 || carlist[index].goodsList[i].distribut == null || carlist[index].disfee == null ){
          list[index].isps = false;
        }
        
      }
      list[index].btntype = true;
      list[index].heji = heji

    }else{
      for (var i in list[index].list) {
        list[index].list[i].type = 0;
      }
      list[index].btntype = false;
      list[index].heji = 0;
    }
    this.setData({
      chooselist: list
    })

  },
  //商品点击状态
  spchange(e){
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var list = this.data.chooselist;
    var type = list[index].list[indexs].type;
    var heji = list[index].heji;
    var carlist = this.data.list;
    if(type == 0){
      type = 1
    }else{
      type = 0
    }
    list[index].list[indexs].type = type;

    var btntype = false;
    var shopchange = true;
    for (var i in list[index].list) {
      if (list[index].list[i].type == 1) {
        btntype = true;
      }
      if (list[index].list[i].type == 0){
        shopchange = false;
      }
    }
    var money = Number(carlist[index].goodsList[indexs].goodsCurPrice);
    var num = Number(carlist[index].goodsList[indexs].goodsBuyNum);
    if(type == 1){
      heji = (Math.round(heji * 100 + (money * num * 100))) / 100
    }else{
      heji = (Math.round(heji*100 - (money * num *100)))/100
    }
    var isps = true;
    for (var i in carlist[index].goodsList) {
      if (carlist[index].goodsList[i].distribut == 1 || carlist[index].goodsList[i].distribut == null || carlist[index].disfee == 1) {
        isps = false;
      }
      
    }


    list[index].heji = heji
    list[index].isps = isps
    
    list[index].btntype = btntype;
    list[index].type = shopchange;
    this.setData({
      chooselist:list,

    })

  },

  //获得购物车列表
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
        userId: wx.getStorageSync('userid'),
        flag: 0,
      },
      success: function success(res) {
        console.log(res);
        if(res.data.resultNote == "该商品的店铺已停止销售" && res.data.result == 0){
          wx.showToast({
            title: '该商品的店铺已停止销售',
            icon:"none",
            duration:1500
          })
          setTimeout(function(){
            wx.navigateTo({
              url: '/pages/index/index',
            })
          },1500)
        }else{
          
        }
       // if(_this.data.chooselist.length == 0){
        var list = [];
        for (var i in res.data.shopCartList) {
          list.push({
            type: 0,
            list: [],
            btntype: false,
            heji: 0,
            isps:true
          })
          for (var l in res.data.shopCartList[i].goodsList) {
            list[i].list.push({
              type: 0
            })
          }
        }
        _this.setData({
          
          chooselist: list,
          list: res.data.shopCartList,
        })
        // }
        // _this.setData({
          
        // })
        
        if (res.data.shopCartList.length == 0) {
          _this.setData({
            listtype:2
          })
        }else{
          _this.setData({
            listtype: 1
          })
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh(); 
        wx.hideLoading()
      }




    });
  },
  //改变管理状态
  guanli(){
    var _this = this;
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    this.setData({
      guanlitype:!_this.data.guanlitype
    })

  },
  //跳转详情
  toxq(e){
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
    })
  },
  //换一批
  change(){
    var page = this.data.page;
    var max = this.data.maxpage;
    page = page+1;
    if(page > max){
      page = 1;
    }
    this.setData({
      page:page
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getguesslist();
    setTimeout(function(){
      wx.hideLoading()
    },500)
    
  },
  //获得猜你喜欢
  getguesslist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getFavoGoodsList',
        cityId: wx.getStorageSync('cityid'),
        userId: wx.getStorageSync('userid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag:1,
        nowPage:_this.data.page
      },
      success: function success(res) {
         console.log(res);
        if (res.data.result == 1){
          _this.setData({
            guesslist: [],
          })
        }else{
          _this.setData({
            guesslist: res.data.goodsList,
            maxpage: res.data.totalPage
          })
        }
        
        
      }
    });
  },
  
  //加减购物车
  carchange(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var skuid = e.currentTarget.dataset.skuid;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var indexs = e.currentTarget.dataset.indexs;
    var money = e.currentTarget.dataset.money;
    var list = this.data.list;
    if(type == 1){
      if (list[index].goodsList[indexs].goodsBuyNum == 1){
        var goodslist = [{
          goodsId: goodsid,
          skuId: skuid
        }]
        var goodslist = JSON.stringify(goodslist)
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
              _this.getcarlist();
              _this.setData({
                qxtype: false,
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
        return false;


      }else{
        list[index].goodsList[indexs].goodsBuyNum--
      }
      
    }else{
      list[index].goodsList[indexs].goodsBuyNum ++ 
    }
    this.setData({
      list:list
    })

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
        goodsId:goodsid,
        skuId:skuid,
        operType:type,
        goodsBuyNum:1,
      },
      success: function success(res) {
        // console.log(res);
        var index = e.currentTarget.dataset.index;
        var indexs = e.currentTarget.dataset.indexs;
        var money = e.currentTarget.dataset.money;
        if (res.data.result == 0){
          var list = _this.data.chooselist;
          var heji = list[index].heji;
         
          if(list[index].list[indexs].type == 1){
            if (type == 1) {
              list[index].heji = Math.round((heji * 100) - (Number(money) * 100)) / 100;
            }
            if (type == 0) {
              list[index].heji = Math.round((heji * 100) + (Number(money) * 100)) / 100;
            }
            console.log(list)
            _this.setData({
              chooselist: list
            })
            
          }
          
        }else{
          wx.showToast({
            title: res.data.resultNote,
            icon:'none',
            duration:1000
          })
        }
       
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
    wx.showLoading({
      title: '加载中',
    })
    
    
    this.setData({
      // chooselist: [],
      qxtype: false,
    })
    this.getcarlist();
    this.getguesslist();
    setTimeout(function () {
      wx.hideLoading()
    }, 300)
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
    wx.showNavigationBarLoading();
    // this.getcarlist();
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getShopCartList',
        userId: wx.getStorageSync('userid'),
        flag: 0,
      },
      success: function success(res) {
        console.log(res);

        // if(_this.data.chooselist.length == 0){
        var list = [];
        for (var i in res.data.shopCartList) {
          list.push({
            type: 0,
            list: [],
            btntype: false,
            heji: 0,
            isps: true
          })
          for (var l in res.data.shopCartList[i].goodsList) {
            list[i].list.push({
              type: 0
            })
          }
        }
        _this.setData({
          qxtype: false,
          chooselist: list,
          list: res.data.shopCartList,
        })
        // }
        // _this.setData({

        // })

        if (res.data.shopCartList.length == 0) {
          _this.setData({
            listtype: 2
          })
        } else {
          _this.setData({
            listtype: 1
          })
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }
    });

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