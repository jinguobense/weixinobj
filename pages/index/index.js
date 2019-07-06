//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabindex:'1',    //精选商品索引
  },
  // 推荐商品tab切换
  changetab(e){
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      tabindex: e.currentTarget.dataset.current
    })
  },
  onLoad: function () {
    
  },
  
})
