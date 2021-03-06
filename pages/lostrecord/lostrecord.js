// pages/lostrecord/lostrecord.js
const app = getApp()
var lostMsg = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostTh: [{ title: '姓名' },
    { title: '学号' },
    { title: '卡号' },
    { title: '状态' }],
    lostMsg: [],
    title: "丢卡记录",
    loststatus: null,
    color: null
  },
  myrequest:function(){
    var that = this
    //请求丢卡记录
    wx.request({
      url: 'https://yangyi.obstacle.cn/system/lostController/getLostCardRecord',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'u_id': app.globalData.uId
      },
      success: function (res) {
        that.setData({
          lostMsg: res.data.data.list
        })
        if (res.data.data.list.extend!==null) {
          that.setData({
            loststatus: '匹配成功',
            color: 'blue'
          })
        } else {
          that.setData({
            loststatus: '匹配失败',
            color: 'red'
          })
        }

      },
      fail: function (res) {
        console.log("失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.myrequest() 

  },
  deleteClick: function (event) {
    var that =this
    var id = event.currentTarget.dataset.deleteid;
    wx.showModal({
      title: '提示',
      content: '确定删除记录？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://yangyi.obstacle.cn/system/lostController/delete?id=' + id,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded', 
              'u_id': app.globalData.uId

            },
            success: function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                that.myrequest()
              }else{
                console.log("失败")
              }
      
              
            },
            fail: function () {
              wx.showToast({
                title: '服务器网络错误!',
                icon: 'loading',
                duration: 1500
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})