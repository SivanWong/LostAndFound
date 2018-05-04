// pages/lost/lost.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '我想找卡',
    display1: 'none',
    display2: 'none',
    display3: 'none',
    display4: 'none',
    cardUserName: '',
    userId: '',
    cardId: '',
    weixinNum: '',
    phone: ''
  },
  write: function(e){
    if (e.target.id == "cardUserName" && e.detail.value == ''){
        this.setData({
          display1:'block'
        })
    } else if (e.target.id == "cardUserName") {
      this.setData({
        display1: 'none',
        cardUserName: e.detail.value
      })
    }else if (e.target.id == "userId" && e.detail.value == '') {
      this.setData({
        display2: 'block'
      })
    } else if (e.target.id == "userId") {
      this.setData({
        display2: 'none',
        userId: e.detail.value
      })
    } else if (e.target.id == "cardId"){
      this.setData({
        cardId: e.detail.value
      })
    } else if (e.target.id == "weixinNum" && e.detail.value == '') {
      this.setData({
        display3: 'block'
      })
    } else if (e.target.id == "weixinNum") {
      this.setData({
        display3: 'none',
        weixinNum: e.detail.value
      })
    } else if (e.target.id == "phone" && e.detail.value == '') {
      this.setData({
        display4: 'block'
      })
    } else if (e.target.id == "phone") {
      this.setData({
        display4: 'none',
        phone: e.detail.value
      })
    }
  },
  confirm: function (e) {
    var that = this;
    if (this.data.cardUserName != '' && this.data.userId != '' && this.data.weixinNum != '' && this.data.phone != ''){
      this.setData({
      display1: 'none',
      display2: 'none', 
      display3: 'none', 
      display4: 'none'
      })
      wx.request({
        url: 'https://yangyi.obstacle.cn/system/lostController/uploadInfoAndMatch',
        header: {
          "Contype-Type": "application/json",
          "u_id": app.globalData.uId
        },
        method: 'POST',
        data: {
          "cardUserName": that.data.cardUserName,
          "userId": that.data.userId,
          "cardId": that.data.cardId,
          "cardType": "1",
          "status": "0",
          "extend": "",
          "weixinNum": that.data.weixinNum,
          "phone": that.data.phone
        },
        success: function (res) {
          if (res.data.code == 200) {
            // 上传成功，并配对成功
            var cardUserName = res.data.data.record.cardUserName
            var phone = res.data.data.record.phone
            var weixinNum = res.data.data.record.weixinNum
            var cardUrl = res.data.data.record.cardUrl
            wx.showModal({
              title: '上传成功，并配对成功',
              content: '学生卡配对成功，点击确定立即跳转至“捡卡人信息”页面',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 跳转至“捡卡人信息”页面
                  wx.redirectTo({
                    url: '../foundermsg/foundermsg?cardUserName=' + cardUserName + '&phone=' + phone + '&weixinNum=' + weixinNum + '&cardUrl=' + cardUrl
                  })
                }
              }
            })
          } else if (res.data.code == 201) {
            // 上传成功，暂无配对
            wx.showModal({
              title: '上传成功，暂无配对',
              content: '请在“我-丢卡记录”中查看具体信息',
              showCancel: false,
              success: function (res) {

                if (res.confirm) {
                  wx.redirectTo({
                    url: '../lostrecord/lostrecord'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }
      })
    }else {
      switch (this.data.cardUserName) {
        case '': this.setData({
          display1: 'block'
        })
          break;
        default: this.setData({
          display1: 'none'
        })
      }
      switch (this.data.userId) {
        case '': this.setData({
          display2: 'block'
        })
          break;
        default: this.setData({
          display2: 'none'
        })
      }
      switch (this.data.weixinNum) {
        case '': this.setData({
          display3: 'block'
        })
          break;
        default: this.setData({
          display3: 'none'
        })
      }
      switch (this.data.phone) {
        case '': this.setData({
          display4: 'block'
        })
          break;
        default: this.setData({
          display4: 'none'
        })
      }
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