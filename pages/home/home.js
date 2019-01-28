// pages/home/home.js
const app=getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    carousel_list:[],
    periodList:[],
    now_data:[],
    prev_data:[],
    now_title:'active',
    prev_title: '',
    nav_now:'active-bottom',
    nav_prev:'',
    now_display:'',
    prev_display:'display:none;'
  },

  scrollimageclick:function(e){
    
  },

  buyDetail:function(e){
    let that = this
    let good_id = e.currentTarget.dataset['goodid']
    let qishu_id = e.currentTarget.dataset['qishuid'];
    wx.navigateTo({
      url: '../buydetail/buydetail?good_id=' + good_id + '&qishu_id=' + qishu_id,
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  prevDetail:function(e){
    let that = this
    let good_id = e.currentTarget.dataset['goodid']
    let qishu_id = e.currentTarget.dataset['qishuid'];
    wx.navigateTo({
      url: '../prevdetail/prevdetail?good_id=' + good_id + '&qishu_id=' + qishu_id,
      success: function (res) {
      },
      fail: function () {
        wx.showToast({
          title: '网络繁忙',
          icon: 'loading'
        })
      },
      complete: function () {
      }
    })
  },

  tapNow:function(){
    this.setData({
      now_title: 'active',
      prev_title: '',
      nav_now: 'active-bottom',
      nav_prev: '',
      now_display:'',
      prev_display:'display:none;'
    })
  },

  tapPrev:function(e){
    let that=this
    let periodId = e.currentTarget.dataset['periodid'];
    
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log(periodId + ":" + token + ":" + user_id)
        wx.request({
          url: 'https://api.360ppl.cn/PeriodGood/getList',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            period_id: periodId,
            is_wx_app:1,
            page: 1,
            rows: 5
          },
          success: function (prevRes) {
            //console.log(prevRes)
            let result = prevRes.data.result
            if (result) {
              let goods = result
              let len = goods.length
              var prev_data = []
              for (let i = 0; i < len - 1; i++) {
                prev_data.push({
                  goodid: goods[i].good_id,
                  qishuid: goods[i].qishu_id,
                  img: goods[i].good_info.goods_img,
                  productName: goods[i].good_info.goods_name,
                  productType: ['黑色', '4G+64G', '5.84英寸'],
                  successPrice: goods[i].success_price,
                  source: '本商品由京东商城提供'
                })
              }

              that.setData({
                prev_data: prev_data,
                now_title: '',
                prev_title: 'active',
                nav_now: '',
                nav_prev: 'active-bottom',
                now_display: 'display:none;',
                prev_display: ''
              })
            }else {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData=res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log("token:"+token)
        wx.request({
          url: 'https://api.360ppl.cn/Index/getIndexData?is_wx_app=1',
          method: 'post',
          data: {
            token: token,
            user_id: user_id
          },
          success: function (homeRes) {
            console.log(homeRes)
            let result = homeRes.data.result
            if (result){
              let banner = result.banner
              let period = result.period
              let goods=result.goods
              let len=goods.length
              var now_data=[]
              for(let i=0;i<len-1;i++){
                now_data.push({
                  goodid: goods[i].good_id,
                  qishuid: goods[i].qishu_id,
                  img: goods[i].good_info.goods_img,
                  productName: goods[i].good_info.goods_name,
                  productType: ['黑色', '4G+64G', '5.84英寸'],
                  jdmoney: goods[i].good_info.market_price,
                  source: '本商品由京东商城提供'
                })
              }
              
              that.setData({
                carousel_list: banner,
                now_data: now_data,
                periodList:period
              })

            }else{
              wx.showToast({
                title: '网络繁忙',
                icon:'loading'
              })
            }
          }
        })
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