//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    buy_progress: 'active',
    buy_success: '',
    buy_fail:'',
    nav_progress:'active-bottom',
    nav_success:'',
    nav_fail:'',
    progress_display: '',
    success_display: 'display:none;',
    fail_display:'display:none;',
    progress_data: [],
    success_data: [],
    fail_data: [],
    countDownList: [],
    countDownArr:[],
  },

  tapProgress: function () {
    this.setData({
      buy_progress: 'active',
      buy_success: '',
      buy_fail: '',
      nav_progress: 'active-bottom',
      nav_success: '',
      nav_fail: '',
      progress_display: '',
      success_display: 'display:none;',
      fail_display: 'display:none;'
    })
  },

  tapSuccess: function () {
    let that=this
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log(periodId + ":" + token + ":" + user_id)
        wx.request({
          url: 'https://api.360ppl.cn/PeriodBuy/buyList',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
            state: '1',
            page: 1,
            rows: 10
          },
          success: function (prevRes) {
            console.log(prevRes)
            let result = prevRes.data.result
            if (result) {
              let goods = result
              let len = goods.length
              var success_data = []
              for (let i = 0; i < len; i++) {
                success_data.push({
                  goodid: goods[i].good_id,
                  qishuid: goods[i].qishu_id,
                  img: goods[i].good_info.goods_img,
                  productName: goods[i].good_info.goods_name,
                  productType: ['黑色', '4G+64G', '5.84英寸'],
                  successPrice: goods[i].good_info.in_price,
                  source: '本商品由京东商城提供'
                })
              }

              that.setData({
                buy_progress: '',
                buy_success: 'active',
                buy_fail: '',
                nav_progress: '',
                nav_success: 'active-bottom',
                nav_fail: '',
                progress_display: 'display:none;',
                success_display: '',
                fail_display: 'display:none;',
                success_data: success_data,
              })
            } else {
              wx.showToast({
                title: '网络繁忙',
                icon: 'loading'
              })
            }
          }
        })
      }
    })
  },

  tapFail: function () {
    let that = this
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log(periodId + ":" + token + ":" + user_id)
        wx.request({
          url: 'https://api.360ppl.cn/PeriodBuy/buyList',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
            state: '1',
            page: 1,
            rows: 10
          },
          success: function (prevRes) {
            console.log(prevRes)
            let result = prevRes.data.result
            if (result) {
              let goods = result
              let len = goods.length
              var fail_data = []
              for (let i = 0; i < len; i++) {
                fail_data.push({
                  goodid: goods[i].good_id,
                  qishuid: goods[i].qishu_id,
                  img: goods[i].good_info.goods_img,
                  productName: goods[i].good_info.goods_name,
                  productType: ['黑色', '4G+64G', '5.84英寸'],
                  successPrice: goods[i].good_info.in_price,
                  source: '本商品由京东商城提供'
                })
              }

              that.setData({
                buy_progress: '',
                buy_success: '',
                buy_fail: 'active',
                nav_progress: '',
                nav_success: '',
                nav_fail: 'active-bottom',
                progress_display: 'display:none;',
                success_display: 'display:none;',
                fail_display: '',
                fail_data: fail_data,
              })
            } else {
              wx.showToast({
                title: '网络繁忙',
                icon: 'loading'
              })
            }
          }
        })
      }
    })


    this.setData({
      
    })
  },

  addressManager:function(){
    wx.navigateTo({
      url: '../chooseaddres/chooseaddres',
    })
  },

  progressDeail:function(e){
    let that = this
    let good_id = e.currentTarget.dataset['goodid']
    let qishu_id = e.currentTarget.dataset['qishuid'];
    wx.navigateTo({
      url: '../progressdetail/progressdetail?good_id=' + good_id + '&qishu_id=' + qishu_id,
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  successDeail: function () {
    wx.navigateTo({
      url: '../successorder/successorder',
    })
  },

  failDeail: function () {
    wx.navigateTo({
      url: '../prevdetail/prevdetail',
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that=this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(app.globalData)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log(periodId + ":" + token + ":" + user_id)
        wx.request({
          url: 'https://api.360ppl.cn/PeriodBuy/buyList',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
            state: '1',
            page: 1,
            rows: 10
          },
          success: function (prevRes) {
            console.log(prevRes)
            let result = prevRes.data.result
            if (result) {
              let goods = result
              let len = goods.length
              let countDownArr = [];
              let progress_data = []
              for (let i = 0; i < len ; i++) {
                let leftTime = goods[i].left_time
                countDownArr.push(leftTime)
                progress_data.push({
                  goodid: goods[i].good_id,
                  qishuid: goods[i].qishu_id,
                  img: goods[i].good_info.goods_img,
                  leftTime:leftTime,
                  productName: goods[i].good_info.goods_name,
                  productType: ['黑色', '4G+64G', '5.84英寸'],
                  successPrice: goods[i].good_info.in_price,
                  source: '本商品由京东商城提供'
                })
              }
              that.setData({
                countDownArr: countDownArr,
                progress_data: progress_data,
              })
              that.countDown();
            } else {
              wx.showToast({
                title: '网络繁忙',
                icon: 'loading'
              })
            }
          }
        })
      }
    })
  },
  countDown:function(){
    let countDownArr = this.data.countDownArr
    let countDownList=[]
    let countDownArr2=[]
    countDownArr.forEach(o => {
      let timeNum = o - 1
      if (o > 0) {
        countDownArr2.push(timeNum)
        countDownList.push(util.formatSeconds(timeNum))
      }else{
        countDownArr2.push(0)
        countDownList.push(util.formatSeconds(0))
      }
    })
    //console.log(countDownArr2)
    this.setData({
      countDownArr: countDownArr2,
      countDownList: countDownList
    })
    setTimeout(this.countDown, 1000)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo){
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }else{
      wx.showLoading({
        title: '请授权使用',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    }
    
  }
})
