//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        //console.log(res)
        this.globalData.code = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              var that=this
              that.globalData.userInfo = res.userInfo
              //console.log(res)
              var params={
                encryptedData: res.encryptedData,
                iv:res.iv,
                signature: res.signature,
                userInfo: res.userInfo,
                code: that.globalData.code
              }
              //console.log(JSON.stringify(params))
              wx.request({
                url: 'https://api.360ppl.cn/Public/wxlogin',
                method: 'post',
                data:params,
                success: function (loginRes) {
                  var result = loginRes.data.result
                  console.log(loginRes)
                  if (result){
                    that.globalData.auth_code = result.auth_code
                    that.globalData.user_id = result.user_id
                  }
                  wx.setStorage({
                    key: "globalData",
                    data: that.globalData
                  })
                }
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    code:'',
    user_id:'',
    auth_code:'',
  }
})