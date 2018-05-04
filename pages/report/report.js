// pages/report/report.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: ''
  },
  write: function(e){
    this.setData({
      content: e.detail.value
    })
  },
  confirm: function(e) {
     var that = this;
     if (this.data.content != '') {
       var openId = wx.getStorageSync('openId');
       wx.request({
         url: 'https://yangyi.obstacle.cn/system/Report',
         header: {
           "Contype-Type": "application/json",
           "u_id": app.globalData.uId
         },
         method: 'POST',
         data: {
           "content": this.data.content,
           "openid": openId
         },
         success: function (res) {
           if (res.data.code == 200) {
             wx.showModal({
               title: '举报成功',
               content: '我们将会在七个工作日内处理',
               showCancel: false,
               success: function() {
                 wx.navigateBack({
                   delta: 1
                 })
               }
             })
           } else {
             wx.showToast({
               title: '举报失败',
               icon: 'none'
             })
           }
         }
       })
     }else {
       wx.showToast({
         title: '举报理由不能为空',
         icon: 'none'
       })
     }
      
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
  onShareAppMessage: function () {
  
  }
})