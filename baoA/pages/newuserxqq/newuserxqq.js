// pages/manjianxq/manjianxq.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '1',     //tab切换index
    id: 'maodian1',   //初始锚点id
    pageheight: '',  //滑动页面高
    num: '1',  //购买数量
    guigeindex: 0,    //规格索引
    guigelist: [],       //规格列表
    goodsid: '',      //商品id
    shopid: '',      //店铺id
    info: {},        //商品详细信息
    pingjialist: [],    //评价列表
    goodstype: '',   //是否收藏商品
    shoptype: '',    //是否收藏店铺
    tuijianlist: [],  //本店推荐
    nearlist: [],     //附近热推
    nearpage: '',   //附近几个轮播
    tuijianpage: '',   //附近几个轮播
    type: '',       //1添加 2购买
    sizexzbox: false,  //判断弹出框动画class
    sizexzboxnear: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    blackztnear: 'none',  //黑幕层显示/隐藏状态
    isOverShare: true,
    shareimg: '',
    img1: '',
    img2: '',
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    this.setData({
      num: e.detail.value
    })
  },
  roundRect(ctx, x, y, w, h, r, fillColor, strokeColor) {
    // 画圆角 ctx、x起点、y起点、w宽度、y高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
    // 开始绘制
    ctx.beginPath()

    // 绘制左上角圆弧 Math.PI = 180度
    // 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // 绘制border-top
    // 移动起点位置 x终点、y终点
    ctx.moveTo(x + r, y)
    // 画一条线 x终点、y终点
    ctx.lineTo(x + w - r, y)
    // ctx.lineTo(x + w, y + r)

    // 绘制右上角圆弧
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // 绘制border-right
    ctx.lineTo(x + w, y + h - r)
    // ctx.lineTo(x + w - r, y + h)

    // 绘制右下角圆弧
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // 绘制border-bottom
    ctx.lineTo(x + r, y + h)
    // ctx.lineTo(x, y + h - r)

    // 绘制左下角圆弧
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // 绘制border-left
    ctx.lineTo(x, y + r)
    // ctx.lineTo(x + r, y)

    if (fillColor) {
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      ctx.setFillStyle(fillColor)
      // 对绘画区域填充
      ctx.fill()
    }

    if (strokeColor) {
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      ctx.setStrokeStyle(strokeColor)
      // 画出当前路径的边框
      ctx.stroke()
    }
    // 关闭一个路径
    // ctx.closePath()

    // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore
    ctx.clip()
  },
  getshareimg() {
    var _this = this;
    var info = this.data.info;
    var imglist = info.goodsImg;
    const ctx = wx.createCanvasContext('shareimg', this)
    // console.log(imglist)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 250, 200);

    ctx.fillStyle = "#333";
    ctx.setFontSize(18)
    var str = info.goodsName;
    if (str.length > 13) {
      str = str.substring(0, 13) + "...";
    }
    ctx.fillText(str, 10, 150)

    var img1 = this.data.img1;
    var img2 = this.data.img2;
    ctx.drawImage(img1, 10, 10, 110, 110)
    if (img2) {
      ctx.drawImage(img2, 135, 10, 110, 110)
    }
    ctx.fillStyle = "#E22405";
    ctx.setFontSize(16)
    ctx.fillText("￥", 10, 185)
    ctx.setFontSize(22)
    ctx.fillText(String(info.goodsSku[0].goodsLimitPrice), 24, 185)
    var moneywidth = ctx.measureText(String(info.goodsSku[0].goodsLimitPrice)).width
    // console.log(moneywidth)
    ctx.setFontSize(12)
    var discountText = '新人专享';
    var bdColor = '#E22405';
    var bdBackground = 'transparent';
    var bdRadius = 4;
    var textPadding = 6;
    var boxHeight = 18;
    var boxWidth = ctx.measureText(discountText).width + textPadding * 2;
    ctx.fillText(discountText, moneywidth + 40, 183);
    this.roundRect(ctx, moneywidth + 35, 169, boxWidth, boxHeight, bdRadius, bdBackground, bdColor)
    ctx.draw()
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'shareimg',
        success(res) {
          console.log(res.tempFilePath)
          _this.setData({
            shareimg: res.tempFilePath
          })
        }
      })
    }, 500)


  },
  lookmap() {
    var _this = this;
    var latitude = Number(_this.data.info.shopLat);
    var longitude = Number(_this.data.info.shopLng);
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  //跳转客服
  tokefu() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
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
        flag: 1
      },
      success: function success(res) {
        console.log(res);
        var name = res.data.chatName;
        var img = res.data.chatFace;
        if (res.data.result == 0) {
          wx.navigateTo({
            url: '../kefu/kefu?friendId=' + friendid + '&friendName=' + name + '&friendAvatarUrl=' + img,
          })
        }
      }
    });
  },
  topingjialist() {
    var goodsid = this.data.goodsid;
    wx.navigateTo({
      url: '../pingjialist/pingjialist?goodsid=' + goodsid + '&flag=0',
    })
  },
  //跳转到更多热推
  toretui() {
    var shopid = this.data.shopid;
    var flag = 3;
    wx.navigateTo({
      url: '../retuimore/retuimore?shopid=' + shopid + '&flag=' + flag,
    })
  },
  //跳转更多推荐
  totuijian() {
    var shopid = this.data.shopid;
    wx.navigateTo({
      url: '../mytuijian/mytuijian?shopid=' + shopid,
    })
  },
  //跳转申诉
  toshensu() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    var goodsid = this.data.goodsid
    var info = this.data.info;
    var obj = {
      shopname: info.shopName,
      goodsname: info.goodsName,
      goodsimg: info.goodsImg[0],
      money: info.goodsCurPrice,
      newmoney: info.goodsSku[0].goodsLimitPrice
    }
    var obj = JSON.stringify(obj)
    wx.navigateTo({
      url: '../toshensu/toshensu?goodsid=' + goodsid + '&obj=' + obj + '&type=1',
    })
  },
  //挑战购物车
  tocar() {
    wx.switchTab({
      url: '../car/car',
    })
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
        url: '../shopxq/shopxq?goodsid=' + goodsid,
      })
    }
    if (type == 6) {
      wx.navigateTo({
        url: '../pintuanxq/pintuanxq?goodsid=' + goodsid + '&shopid=' + shopid,
      })
    }
    if (type == 1) {
      wx.navigateTo({
        url: '../manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
    if (type == 5) {
      wx.navigateTo({
        url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }

  },
  //跳转到店铺
  todianpu(e) {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    var shopid = e.currentTarget.dataset.shopid;
    wx.navigateTo({
      url: '../dianpu/dianpu?shopid=' + shopid
    })
  },
  //获取附近热推
  getnearlist() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getNgGoodsList',
        flag: 3,
        shopId: _this.data.info.shopId,
        searchKey: '',
        nowPage: 1,
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          nearlist: res.data.goodsList,
          nearpage: Math.ceil(res.data.goodsList.length / 3)
        })
      },
    });
  },
  //获取本店推荐商品
  getmytuijian() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getRecommendGoodsList',
        shopId: _this.data.info.shopId,
        nowPage: 1,
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          tuijianlist: res.data.goodsList,
          tuijianpage: Math.ceil(res.data.goodsList.length / 3)
        })

      },
    });
  },
  //获取该商品评价
  getpingjia() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getGoodsCmtList',
        userId: wx.getStorageSync('userid'),
        // goodsId: _this.data.goodsid
        goodsId: _this.data.goodsid,
        flag: 0,
        nowPage: 1,
      },
      success: function (res) {
        // console.log(res);
        _this.setData({
          pingjialist: res.data.commentList
        })

      },
    });
  },
  //收藏店铺
  shoucangshop() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    var _this = this;
    this.setData({
      shoptype: !_this.data.shoptype
    })
    var type;
    if (_this.data.shoptype) {
      type = 1;
    } else {
      type = 0;
    }
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
        cid: _this.data.shopid,
        isCollect: type
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
      },
    });

  },
  //弹出附近店铺
  tanchusizeboxnear() {
    var _this = this;
    this.setData({
      blackztnear: 'block',

    })
    setTimeout(function () {
      _this.setData({
        sizexzboxnear: true
      })
    }, 100)
  },
  //关闭附近店铺
  closechooseboxnear() {
    var _this = this;
    this.setData({
      sizexzboxnear: false
    })
    setTimeout(function () {
      _this.setData({
        blackztnear: 'none'
      })
    }, 300)

  },
  //收藏商品
  shoucanggoods() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    // this.setData({
    //   goodstype: !_this.data.goodstype
    // })
    var type;
    if (_this.data.goodstype) {
      type = 0;
    } else {
      type = 1;
    }
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
        type: 0,
        // goodsId: _this.data.goodsid
        cid: _this.data.goodsid,
        isCollect: type
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
          })
          _this.setData({
            goodstype: !_this.data.goodstype
          })
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
  //获取商品详情
  getinfo() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getNewPmentDetail',
        userId: wx.getStorageSync('userid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        // goodsId: _this.data.goodsid
        goodsId: _this.data.goodsid
      },
      success: function (res) {
        console.log(res);
        if(res.data.result == 0){
          
        if (res.data.isCollect == 0) {
          var type = false;
        } else {
          var type = true;
        }
        if (res.data.shopCollect == 0) {
          var type1 = false;
        } else {
          var type1 = true;
        }
        var info = res.data;
        var hpl = parseInt(res.data.shopRate * 100)
          wx.downloadFile({
            url: res.data.goodsImg[0], //仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode == 200) {
                _this.data.img1 = res.tempFilePath;
                _this.setData({
                  img1: res.tempFilePath,
                })
              }
            }
          })
          if (res.data.goodsImg[1]) {
            wx.downloadFile({
              url: res.data.goodsImg[1], //仅为示例，并非真实的资源
              success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode == 200) {
                  _this.data.img2 = res.tempFilePath;
                  _this.setData({
                    img2: res.tempFilePath,
                  })
                }
              }
            })
          }
        _this.setData({
          info: res.data,
          goodstype: type,
          shoptype: type1,
          shopid: res.data.shopId,
          guigelist: res.data.goodsSku,
          hpl:hpl
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 0)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
        var timers = setInterval(function () {
          if (_this.data.img1 || _this.data.img2) {
            _this.getshareimg();
            clearInterval(timers)
          } else {
            wx.downloadFile({
              url: res.data.goodsImg[0], //仅为示例，并非真实的资源
              success(res) {
                _this.data.img1 = res.tempFilePath;
                _this.setData({
                  img1: res.tempFilePath,
                })
              }
            })
            if (res.data.goodsImg[1]) {
              wx.downloadFile({
                url: res.data.goodsImg[1], //仅为示例，并非真实的资源
                success(res) {
                  _this.data.img2 = res.tempFilePath;
                  _this.setData({
                    img2: res.tempFilePath,
                  })
                }
              })
            }
          }
        }, 500)
      },
    });
  },
  //跳转确认订单
  tosuredd() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    var index = this.data.guigeindex;
    //添加购物车
    if (this.data.type == 1) {
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'addShopCart',
          flag: '0',
          userId: wx.getStorageSync('userid'),
          goodsId: _this.data.goodsid,
          skuId: _this.data.guigelist[index].skuId,
          // goodsId: _this.data.goodsid
          operType: '0',
          goodsBuyNum: _this.data.num
        },
        success: function (res) {
          console.log(res);
          if (res.data.result == 0) {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1000
            })
            _this.closechoosebox()
          } else {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1000
            })
          }

        },
      });
      //购买
    } else {
      var list = [{
        goodsId: _this.data.goodsid,          //商品id
        skuId: _this.data.guigelist[index].skuId,            //商品规格id
        goodsBuyNum: _this.data.num,      //商品购买数量
      }]
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'newPmentBalance',
          shopId: _this.data.shopid,
          userId: wx.getStorageSync('userid'),
          goodsList: JSON.stringify(list)
        },
        success: function (res) {
          console.log(res);
          if (res.data.result == 0) {
            var obj = JSON.stringify(res.data)
            wx.navigateTo({
              url: '../suredd/suredd?obj=' + obj + '&type=newbuy',
            })
            _this.closechoosebox();
          } else {
            wx.showToast({
              title: res.data.resultNote,
              icon: 'none',
              duration: 1000
            })
          }
        },
      });
    }
  },
  // 推荐商品tab切换锚点
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)

    this.setData({
      tabindex: e.currentTarget.dataset.current,
      id: e.currentTarget.dataset.idr
    })
  },
  //规格切换
  changeguige(e) {
    this.setData({
      guigeindex: e.currentTarget.dataset.index
    })
  },
  // 页面滚动事件监听
  pagescroll(e) {
    // console.log(e.detail.scrollTop + '1111')
    var _this = this;
    var index;
    const query = wx.createSelectorQuery()
    query.selectAll('#maodian1').boundingClientRect()
    query.exec(function (res) {
      if (res[0][0].top <= 200) {
        index = 1;
      }
      const query = wx.createSelectorQuery()
      query.selectAll('#maodian2').boundingClientRect()
      query.exec(function (ress) {
        if (ress[0][0].top <= 200) {
          index = 2;
        }
        const query = wx.createSelectorQuery()
        query.selectAll('#maodian3').boundingClientRect()
        query.exec(function (resss) {
          if (resss[0][0].top <= 200) {
            index = 3;
          }
          const query = wx.createSelectorQuery()
          query.selectAll('#maodian4').boundingClientRect()
          query.exec(function (ressss) {
            if (ressss[0][0].top <= 200) {
              index = 4;
            }
            _this.setData({
              tabindex: index,
            })
          })
        })
      })
    })


  },
  //弹出尺码选择窗口
  tanchusizebox(e) {
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var type = e.currentTarget.dataset.type;
    var _this = this;
    this.setData({
      blackzt: 'block',

    })
    setTimeout(function () {
      _this.setData({
        sizexzbox: true,
        type: type,
        num: 1,
        guigeindex: 0,
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
  //加
  spinnerJia: function () {
    wx.showToast({
      title: '该商品限购1件',
      icon:'none',
      duration:1000
    })
  },

  //减
  spinnerJian: function () {
    wx.showToast({
      title: '该商品限购1件',
      icon: 'none',
      duration: 1000
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      goodsid: options.goodsid,
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getinfo();
    setTimeout(function () {
      _this.getmytuijian();
      _this.getnearlist();
      _this.getpingjia();
    }, 800)
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
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        _this.setData({
          pageheight: (res.windowHeight * 2) / ((res.windowWidth * 2) / 750) - 200,
        })
        console.log(res.windowHeight * 2 - 200)
      }
    })
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
  onShareAppMessage: function (res) {
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    var goodsid = this.data.goodsid;
    var info = this.data.info;
    var shareimg = this.data.shareimg;
    var name = wx.getStorageSync('userInfo').nickName;
    var userimg = wx.getStorageSync('userInfo').avatarUrl;
    return {
      path: "/pages/index/index?goodsid=" + goodsid + '&type=8&name=' + name + '&goodsimg=' + info.goodsImg[0] + '&userimg=' + userimg,
      imageUrl: shareimg,
      title: info.shopName
    };
  }
})