//app.js
App({
  onLaunch: function () {
    // 调用API从本地缓存中获取数据  
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  onShow: function (options) {
    var that = this,
      // scenes是场景值它的类型是整形  
      scenes = options.scene,
      // sid是参数,建议兼容ios和android的时候强转换为整形  
      sid = Number(options.query.sid)
    // 获取用户信息  
    that.getUserInfo()
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 调用登录接口  
      wx.login({
        success: function (res) {
          // 登录成功   
          var code = res.code// 登录凭证
          // 获取用户信息  
          wx.getUserInfo({
            // 当你获取用户信息的时候会弹出一个弹框是否允许授权  

            // 这里点击允许触发的方法  
            success: function (res2) {
              that.globalData.userInfo = res2.userInfo
              wx.request({
                url: 'https://yangyi.obstacle.cn/system/login?code=' + code,
                method: 'POST',
                header: {
                  'content-type': 'application/json', // 默认值
                  'u_id': 'login'
                },
                success: function (res3) {
                  wx.setStorageSync('userInfo', res3.data.data)
                  //如果u_id过期
                  if (res3.data.code==202){
                    that.getUserInfo()
                  }else{
                    that.globalData.uId = res3.data.u_id
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                },
                fail:function (msg){
                  console.log(msg.data)
                }
              })
            },
            fail: function (res2) {
              //如果拒绝，打开微信小程序的设置，允许小程序重新授权的页面  
              wx.openSetting({
                success: (res4) => {
                  if (res4.authSetting["scope.userInfo"]) {
                    // 进入这里说明用户重新授权了，重新执行获取用户信息的方法  
                    that.getUserInfo()
                  }
                }
              })
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    uId:null
  }
})