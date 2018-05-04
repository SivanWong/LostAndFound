// pages/foundermsg/foundermsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardUrl:'../../images/img.png',
    cardUserName: '',
    weixinNum: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
       cardUserName: options.cardUserName,
       weixinNum: options.weixinNum,
       phone: options.phone,
       cardUrl: options.cardUrl
    })
  },
  bindImage: function (e) {
    var that = this;
    var imgs = [that.data.cardUrl]
    wx.previewImage({
      current: imgs[0],
      urls: imgs
    })  
  },
  report: function() {
    wx.navigateTo({
      url: '../report/report'
    })
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
  
  }
  

})