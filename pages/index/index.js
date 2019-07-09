//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabindex:'1',    //精选商品索引
  },
  //跳转到搜索
  tosearch(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  // 推荐商品tab切换
  changetab(e){
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      tabindex: e.currentTarget.dataset.current
    })
  },
  //跳转到店铺
  todianpu(){
    wx.navigateTo({
      url: '../dianpu/dianpu',
    })
  },
  onLoad: function () {
    
  },
  
})
