// pages/cantuanxq/cantuanxq.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '1',     //tab切换index
    id: 'maodian1',   //初始锚点id
    pageheight: '',  //滑动页面高
    type: '1',         // 正在开抢1  即将开始2
    goodsid: '',      //商品id
    info: {},        //商品详细信息
    pingjialist: [],    //评价列表
    goodstype: '',   //是否收藏商品
    shoptype: '',    //是否收藏店铺
    tuijianlist: [],  //本店推荐
    nearlist: [],     //附近热推
    nearpage: '',   //附近几个轮播
    tuijianpage: '',   //附近几个轮播
    countDownList: [],     //显示时间列表
    actEndTimeList: [],    //时间列表
    sizexzbox: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    num: '1',  //购买数量
    guigeindex: 0,    //规格索引
    guigelist: [],       //规格列表
    timer:'',
    isOverShare: true,
    shareimg:'',
    img1: '',
    img2: '',
    timetype: false,
    endtime:''
  },
  isshareyes(){
    wx.showToast({
      title: '正在加载分享内容',
      icon: 'none',
      duration: 1500
    })
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
    const ctx = wx.createCanvasContext('shareimg')
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
    ctx.fillText(String(info.goodsCurPrice), 24, 185)
    var moneywidth = ctx.measureText(String(info.goodsCurPrice)).width
    // console.log(moneywidth)
    ctx.setFontSize(12)
    var discountText = '拼团';
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
      url: '../pingjialist/pingjialist?goodsid=' + goodsid + '&flag=1',
    })
  },
  //跳转更多推荐
  totuijian() {
    var shopid = this.data.shopid;
    wx.navigateTo({
      url: '../mytuijian/mytuijian?shopid=' + shopid,
    })
  },
  //跳转到更多热推
  toretui() {
    var shopid = this.data.shopid;
    var flag = 1;
    wx.navigateTo({
      url: '../retuimore/retuimore?shopid=' + shopid + '&flag=' + flag,
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
      money: info.goodsCurPrice
    }
    var obj = JSON.stringify(obj)
    wx.navigateTo({
      url: '../toshensu/toshensu?goodsid=' + goodsid + '&obj=' + obj,
    })
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
        cmd: 'toGoBalance',
        shopId: _this.data.shopid,
        userId: wx.getStorageSync('userid'),
        goodsList: JSON.stringify(list)
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0) {
          var obj = JSON.stringify(res.data)
          wx.navigateTo({
            url: '../suredd/suredd?obj=' + obj + '&type=tuangou',
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
  timeFormat: function timeFormat(param) {
    //小于10的格式化函数
    return param < 10 ? "0" + param : param;
  },
  //获取时间
  countDown: function countDown() {
    var that = this;
    //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    var newTime = new Date().getTime();
    var endTimeList = that.data.actEndTimeList;
    var countDownList = [];
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(function (o) {
      var endTime = new Date(o).getTime();
      var obj = null;
      var time = 0;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        var _time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        var day = parseInt(_time / (60 * 60 * 24));
        var hou = parseInt(_time % (60 * 60 * 24) / 3600);
        var min = parseInt(_time % (60 * 60 * 24) % 3600 / 60);
        var sec = parseInt(_time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        };
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      } else {
        //活动已结束，全部设置为'00'
        obj = {
          day: "00",
          hou: "00",
          min: "00",
          sec: "00"
        };

        /// -------
        if (that.data.type == 2) {
          var endtime = that.data.endtime;
          var timelist = [];
          timelist.push(endtime);
          that.setData({
            type: 1,
            actEndTimeList: timelist
          })
        } else {
          wx.showToast({
            title: '活动已结束',
            icon: 'none',
            duration: 1500
          })
          that.data.timetype = true
          var timer = that.data.timer;
          clearTimeout(timer)
          that.data.timer = ''
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)

          return false;
        }
        // obj = obj.day + "天" + obj.hou + ":" + obj.min + ":" + obj.sec;
      }
      
      countDownList.push(obj);
      
      // console.log(that.data.countDownList)
    });
    that.setData({
      countDownList: countDownList
    })
    // console.log(that.data.countDownList)
    if (that.data.timetype == false) {
      var timer = setTimeout(that.countDown, 1000);
      this.setData({
        timer: timer
      })
    }

  },
  //跳转商品详情
  toxq(e) {
    // console.log(e.currentTarget.dataset.goodsid)
    var goodsid = e.currentTarget.dataset.goodsid
    var shopid = e.currentTarget.dataset.shopid
    wx.navigateTo({
      url: '../cantuanxq/cantuanxq?goodsid=' + goodsid
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
        flag: 1,
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
        userId: wx.getStorageSync('userid'),
        shopId: _this.data.info.shopId,
        searchKey: '',
        nowPage: 1,
        townId: wx.getStorageSync('townid'),
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          tuijianlist: res.data.goodsList,
          tuijianpage: Math.ceil(res.data.goodsList.length / 3)
        })
        console.log(res.data.goodsList.length)

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
        flag: 1,
        nowPage: 1,
      },
      success: function (res) {
        console.log(res);
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
        // console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
      },
    });

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
    this.setData({
      goodstype: !_this.data.goodstype
    })
    var type;
    if (_this.data.goodstype) {
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
        type: 0,
        // goodsId: _this.data.goodsid
        cid: _this.data.goodsid,
        isCollect: type
      },
      success: function (res) {
        // console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
      },
    });

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
  tanchusizebox() {
    if (this.data.info.goodsState == 1) {
      wx.showToast({
        title: '商品已下架，不支持该操作',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    this.setData({
      blackzt: 'block',
      num:1,
      guigeindex:0,
    })
    setTimeout(function () {
      _this.setData({
        sizexzbox: true
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
      guigeindex: e.currentTarget.dataset.index
    })
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
        cmd: 'getGoGoodsDetail',
        userId: wx.getStorageSync('userid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        // goodsId: _this.data.goodsid
        goodsId: _this.data.goodsid
      },
      success: function (res) {
        console.log(res);
        if(res.data.result == 0){
          
        if (res.data.goState == 1) {
          var tabindex = 1;
        } else {
          var tabindex = 2;
        }
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
        var endTimeList = [];
        if (tabindex == 1) {
          var str = res.data.goEndTime.replace(/-/g, "/");
          endTimeList.push(str);

        } else if (tabindex == 2) {
          var str = res.data.goStartTime.replace(/-/g, "/");
          endTimeList.push(str);
        }
        var info = res.data;
        var hpl = parseInt(res.data.shopRate * 100)
          wx.downloadFile({
            url: res.data.goodsImg[0], //仅为示例，并非真实的资源
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode == 200) {
                _this.data.img1 = res.tempFilePath
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
          var endtime = res.data.goEndTime.replace(/-/g, "/");
        _this.setData({
          info: res.data,
          goodstype: type,
          shoptype: type1,
          shopid: res.data.shopId,
          actEndTimeList: endTimeList,
          type: tabindex,
          guigelist: res.data.goodsSku,
          hpl:hpl,
          endtime:endtime
        })
          if (_this.data.timetype == false) {
            _this.countDown();
          }
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
  // 推荐商品tab切换锚点
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)

    this.setData({
      tabindex: e.currentTarget.dataset.current,
      id: e.currentTarget.dataset.idr
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // console.log(options)
    this.setData({
      goodsid: options.goodsid
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
          timetype: false
        })
      }
    })
    this.getinfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var timer = this.data.timer;
    clearTimeout(timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var timer = this.data.timer;
    clearTimeout(timer)
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
      path: "/pages/index/index?goodsid=" + goodsid + '&type=5&name=' + name + '&goodsimg=' + info.goodsImg[0] + '&userimg=' + userimg,
      imageUrl: shareimg,
      title: info.shopName
    };
  }
})