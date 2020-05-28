//app.js
App({
  onLaunch: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法进行版本更新，请升级到最新微信版本后重试。'
      })
    }
    this.share()
  },
  share: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        // console.log('是否重写分享方法', data);
        if (!data.isOverShare) {
          view.onShareAppMessage = function () {
            //分享配置
            return {
              title: '有人@我 快来看看吧~',
              path: '/pages/index/index',
              
            };
          }
        }
      }
    })
  },
  getOpenid: function (date) {
    wx.showLoading({
      title: '正在授权中',
    })
    wx.getSetting({
      success: function success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: function success(ress) {
              var code = ress.code; //登录凭证
              wx.setStorageSync("code", code);
              if (code) {
                //2、调用获取用户信息接口
                wx.getUserInfo({
                  success: function success(resss) {
                    // console.log({
                    //   encryptedData: res.encryptedData,
                    //   iv: res.iv,
                    //   code: code
                    // });
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    wx.request({
                      url: "https://ceshi.zjguangxuan.com/xcx/decodeUserInfo", //自己的服务接口地址
                      method: "post",
                      header: {
                        "content-type": "application/x-www-form-urlencoded"
                      },
                      data: {
                        encryptedData: resss.encryptedData,
                        iv: resss.iv,
                        code: code
                      },
                      success: function success(data) {
                        console.log(data);
                        //4.解密成功后 获取自己服务器返回的结果
                        if (data.data.status == 1) {
                          var userInfo_ = data.data.userInfo;
                          // console.log(userInfo_);
                          var userid = data.data.userInfo.userId;
                          var openid = data.data.userInfo.openId;
                          var rctoken = data.data.rctoken;
                          wx.setStorageSync("userid", userid);
                          wx.setStorageSync("openid", openid);
                          wx.setStorageSync("rctoken", rctoken);
                          
                          var timer =  setInterval(function () {
                            if (wx.getStorageSync("userid")){
                              clearInterval(timer)
                              wx.navigateBack({
                                delta: 1
                              })
                            }
                          }, 300)
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            duration:1500,
                            icon:'none'
                          })
                        }
                      },
                      fail: function fail() {
                        wx.showToast({
                          title: '系统错误',
                          duration: 1500,
                          icon: 'none'
                        })
                      }
                    });
                  },
                  fail: function fail() {
                    wx.showToast({
                      title: '获取用户信息失败',
                      duration: 1500,
                      icon: 'none'
                    })
                  }
                });
              } else {
                wx.showToast({
                  title: "获取用户登录态失败！" + r.errMsg,
                  duration: 1500,
                  icon: 'none'
                })
              }
            },
            fail: function fail() {
              wx.showToast({
                title: "登陆失败",
                duration: 1500,
                icon: 'none'
              })
            }
          });
        } else {
          // console.log("获取用户信息失败");
          wx.showToast({
            title: '获取用户信息失败getSetting',
            duration: 1500,
            icon: 'none'
          })
        }
      }
    });
  },
  
  globalData: {
    userInfo: null,
    // url: "https://shop.zjguangxuan.com/service",
    url: "https://ceshi.zjguangxuan.com/service",
    isdingwei:false,
  }
  // "networkTimeout": {
  //   "request": 5000
  // },
})