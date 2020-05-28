// pages/msg/msg.js
var util = require('../../utils/util.js'); // 转换时间插件
var webim = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var webimhandler = require('../../utils/webim_handler.js'); // 这个是所有 im 事件的 js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    selSess: '',
    list: [],
    isgetlishi: false,
    isend: false
  },
  onConnNotify(resp) {
    var info;
    switch (resp.ErrorCode) {
      case webim.CONNECTION_STATUS.ON:
        // webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
        break;
      case webim.CONNECTION_STATUS.OFF:
        info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;

        // webim.Log.warn(info);
        break;
      case webim.CONNECTION_STATUS.RECONNECT:
        info = '连接状态恢复正常: ' + resp.ErrorInfo;

        // webim.Log.warn(info);
        break;
      default:
        // webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
        break;
    }
  },
  onMsgNotify(newMsgList) {
    //console.warn(newMsgList);
    var _this = this
    // var selToID = this.data.selToID;
    var sess, newMsg;
    //获取所有聊天会话
    var sessMap = webim.MsgStore.sessMap();
    // console.log(newMsgList)
    for (var j in newMsgList) { //遍历新消息
      newMsg = newMsgList[j];
      // console.log(newMsg)
      // if (newMsg.getSession().id() == selToID) {//为当前聊天对象的消息，selToID 为全局变量，表示当前正在进行的聊天 ID，当聊天类型为私聊时，该值为好友帐号，否则为群号。
      //   // var selSess = newMsg.getSession();
      //   // console.log(selSess)
      //   // _this.setData({
      //   //   selSess: selSess
      //   // })
      //   //在聊天窗体中新增一条消息
      //   //console.warn(newMsg);

      //   // _this.addMsg(newMsg);

      // }
    }

    //消息已读上报，以及设置会话自动已读标记
    // var selSess = this.data.selSess;
    // webim.setAutoRead(selSess, true, true);
    for (var i in sessMap) {
      // sess = sessMap[i];
      // if (selToID != sess.id()) {//更新其他聊天对象的未读消息数
      //   updateSessDiv(sess.type(), sess.id(), sess.unread());
      // }
    }
  },
  webimLogin() {
    wx.showLoading({
      title: '加载中',
    })

    var _this = this
    var loginInfo = {
      'sdkAppID': '1400205994', //用户标识接入SDK的应用ID，必填。（这个可以在腾讯云的后台管理看到）
      'appIDAt3rd': '1400205994', //App 用户使用 OAuth 授权体系分配的 Appid，必填    （这个其实和上面那个是一样的）
      'identifier': wx.getStorageSync('userid'), //用户帐号，必填   （这个就是自己服务器里，每个用户的账号，可以自己设置）
      'identifierNick': wx.getStorageSync('userInfo').nickName,
      'accountType': 1,
      'userSig': wx.getStorageSync('rctoken') //鉴权 Token，identifier 不为空时，必填   我觉得这个也是必填的，这个需要在一开始就从后端获取。
    }
    //监听事件
    var listeners = {
      "onConnNotify": _this.onConnNotify //监听连接状态回调变化事件，选填
        ,
      "onMsgNotify": _this.onMsgNotify //监听新消息（私聊，普通群（非直播聊天室）消息，全员推送消息）事件，必填
    };
    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': true //是否开启控制台打印日志,默认开启，选填
    };

    webim.login(loginInfo, listeners, options, function(resp) {
      loginInfo.identifierNick = _this.chatName2; //设置当前用户昵称
      console.log("登录成功", loginInfo, listeners, options);
    }, function(err) {
      console.log("登录失败------------------", loginInfo, listeners, options);
    });
    // var selToID = this.data.selToID;
    var selType = webim.SESSION_TYPE.C2C;
    // var selSess = webim.MsgStore.sessByTypeId(selType, selToID);
    // this.setData({
    //   selSess: selSess
    // })
    this.setData({
      isgetlishi: true
    })
    setTimeout(function() {
      _this.getmsglist()
    }, 1000)

  },
  getinfo() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMsgState',
        userId: wx.getStorageSync('userid'),
      },
      success: function success(res) {
        console.log(res);
        _this.setData({
          info: res.data
        })


      }
    });
  },
  gettime(msg) {
    var msgTime = msg; //得到当前消息发送的时间
    //得到当天凌晨的时间戳
    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var thisdate;
    var d = new Date(msgTime * 1000); //根据时间戳生成的时间对象
    var min = d.getMinutes();
    var hour = d.getHours();
    //得到时和分，分小于10时，只返回一位数
    if (min < 10) {
      min = "0" + min;
    }
    //得到月份和天  月份一般是从0开始，所以展示出来要+1
    var month = d.getMonth();

    var day = d.getDate();
    //得到时间   当天时间应该只显示时分  当天以前显示日期+时间
    if (timeStamp > msgTime) {
      thisdate = month + 1 + "-" + day + " " + hour + ":" + min;
    } else {
      thisdate = hour + ":" + min;
    }
    return thisdate;
  },
  tokefu(e) {
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    var friendid = e.currentTarget.dataset.friendid;
    wx.navigateTo({
      url: '../../baoA/pages/kefu/kefu?friendId=' + friendid + '&friendName=' + name + '&friendAvatarUrl=' + img,
    })
  },
  getmsglist() {

    var _this = this;
    var getlist = []
    webim.getRecentContactList({}, function(resp) {
      console.log(resp)
      //业务处理
      if (resp.SessionItem) {
        var msglist = resp.SessionItem;
      } else {
        var msglist = []
      }

      console.log(msglist)

      if (msglist.length == 0 || msglist == undefined) {

        if (msglist == undefined) {
          msglist = []
        }

        _this.setData({
          list: msglist,
          isend: true
        })
        wx.hideLoading()
        return false;
      }
      for (let i in msglist) {
        getlist[i] = {}
        var time = _this.gettime(msglist[i].MsgTimeStamp);
        var msg = msglist[i].MsgShow;
        var id = msglist[i].To_Account;
        if (msg.indexOf('&pic&') != -1) {
          var msg = '[图片]'
        }
        if (msg.indexOf('&tex&') != -1) {
          var msg = msg.substring(5)
        }
        getlist[i].time = time;
        getlist[i].msg = msg;
        getlist[i].id = id;
        // console.log(msg)
        wx.request({
          url: app.globalData.url, //自己的服务接口地址
          method: "post",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            cmd: 'getChatFace',
            userId: id,
            flag: 1
          },
          success: function success(res) {
            // console.log(res);
            var name = res.data.chatName;
            var img = res.data.chatFace;
            getlist[i].name = name;
            getlist[i].img = img;
            // console.log(getlist)
            _this.setData({
              list: getlist,
              isend: true

            })
            wx.hideLoading()
          }
        });
      }


      // console.log(resp.SessionItem)
      // console.log(getlist)

    }, function(resp) {
      //错误回调
      // wx.hideLoading()
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.webimLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    this.getinfo();

    if (this.data.isgetlishi == true) {
      _this.getmsglist()
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})