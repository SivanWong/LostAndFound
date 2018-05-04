// pages/found/found.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '我捡到卡',
    display: 'true',
    display1: 'none',
    display2: 'none',
    display3: 'none',
    display4: 'none',
    img: '../../images/img.png',
    cardUserName: '',
    userId: '',
    cardId: '',
    name: '',
    weixinNum: '',
    phone: ''

  },
  write: function(e) {
    // 失主姓名、失主学号、微信号、手机号不能为空，其余选填
    if (e.target.id == "cardUserName" && e.detail.value == '') {
      this.setData({
        display1: 'block'
      })
    } else if (e.target.id == "cardUserName") {
      this.setData({
        display1: 'none',
        cardUserName: e.detail.value
      })
    } else if (e.target.id == "userId" && e.detail.value == '') {
      this.setData({
        display2: 'block'
      })
    } else if (e.target.id == "userId") {
      this.setData({
        display2: 'none',
        userId: e.detail.value
      })
    } else if (e.target.id == "cardId") {
      this.setData({
        cardId: e.detail.value
      })
    }else if(e.target.id == "name") {
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
  AddImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://yangyi.obstacle.cn/system/findController/uploadPic',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "content-type": "multipart",
            "u_id": app.globalData.uId
          },
          success: function (res) {
            var  data  = JSON.parse(res.data);
            if(data.code == 200) {
              that.setData({
                img: data.data.imgurl
              })
            }else {
              wx.showToast({
                title: '图片格式只能为jpg',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },
  confirm: function(e) {
    var that = this;
    if (this.data.cardUserName != '' && this.data.userId != '' && this.data.weixinNum != '' && this.data.phone != '' && this.data.img != '../../images/img.png') {
      this.setData({
        display1: 'none',
        display2: 'none',
        display3: 'none',
        display4: 'none'
      })

      wx.request({
        url: 'https://yangyi.obstacle.cn/system/findController/uploadCardInfo',
        header: {
          "Contype-Type": "application/json",
          "u_id": app.globalData.uId
        },
        method: 'POST',
        data: {
          "cardType": "1",
          "cardUserName": that.data.cardUserName,
          "userId": that.data.userId,
          "cardId": that.data.cardId,
          "name": that.data.name,
          "status": "0",
          "extend": "",
          "weixinNum": that.data.weixinNum,
          "phone": that.data.phone,
          "cardUrl": that.data.img
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 200) {
            // 上传成功，并配对成功
            var cardUserName = res.data.data.record.cardUserName
            var phone = res.data.data.record.phone
            var weixinNum = res.data.data.record.weixinNum
            wx.showModal({
              title: '上传成功，并配对成功',
              content: '学生卡配对成功，点击确定立即跳转至“丢卡人信息”页面',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 跳转至“丢卡人信息”页面
                  wx.redirectTo({
                    url: '../lostermsg/lostermsg?cardUserName=' + cardUserName + '&phone=' + phone + '&weixinNum=' + weixinNum 
                  })
                }
              }
            })
          } else if (res.data.code == 201) {
            // 上传成功，暂无配对
            wx.showModal({
              title: '上传成功，暂无配对',
              content: '未能找到卡的主人，请在“我-捡卡记录”中查看具体信息',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 跳转至“丢卡人信息”页面
                  wx.redirectTo({
                    url: '../foundrecord/foundrecord'
                  })
                }
              }
            })
          } else {
            // 上传失败
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        }
      })
    } else if (this.data.img == '../../images/img.png'){
      wx.showToast({
        title: '图片不能为空',
        icon: 'none'
      })
    }else{
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