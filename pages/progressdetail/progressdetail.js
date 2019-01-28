// pages/prevdetail/prevdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carousel_list: [
      { id: 1, img: '../resource/prev.png' },
      { id: 2, img: '../resource/law_two.png' },
      { id: 3, img: '../resource/law_three.png' },
      { id: 4, img: '../resource/law_four.png' },
      { id: 5, img: '../resource/law_five.png' }
    ],
    price_record: [
      { name: '金丹期', photo: '../resource/law_one.png', time: '06.24 13:50:45', money: '12000', flag: true },
      { name: '合体期', photo: '../resource/law_two.png', time: '06.27 18:30:25', money: '2000', flag: false },
      { name: '炼虚期', photo: '../resource/law_three.png', time: '06.29 10:44:23', money: '6000', flag: false },
      { name: '大乘期', photo: '../resource/law_four.png', time: '07.01 13:50:45', money: '7000', flag: false },
      { name: '大罗金仙', photo: '../resource/law_five.png', time: '07.03 13:50:45', money: '4000', flag: false },
      { name: '太乙玉仙', photo: '../resource/law_one.png', time: '07.06 13:50:45', money: '9000', flag: false },
    ],
    money: '',
  },

  bidRecord: function () {
    wx.navigateTo({
      url: '../bidrecord/bidrecord',
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  buyRule:function(){
    wx.navigateTo({
      url: '../buyrule/buyrule',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let good_id = options.good_id
    let qishu_id = options.qishu_id
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        //console.log("token:" + token + ",user_id:" + user_id + ",good_id:" + good_id + ",qishu_id:" + qishu_id)
        wx.request({
          url: 'https://api.360ppl.cn/Index/goodInfo',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            good_id: good_id,
            is_wx_app: 1,
            qishu_id: qishu_id
          },
          success: function (detailRes) {
            console.log(detailRes)
            var carousel_list = []
            let result = detailRes.data.result
            if (result) {
              let pictures = result.pictures
              let plen = pictures.length
              if (pictures && plen > 0) {
                for (let i = 0; i < plen; i++) {
                  carousel_list.push({
                    id: pictures[i].img_id,
                    img: pictures[i].img_url
                  })
                }
              }

              let goods = result.goods
              
              let out_price = result.out_price
              that.setData({
                goods:goods,
                out_price: out_price,
                productType: ['黑色', '4G+64G', '5.84英寸'],
                source: '本商品由京东商城提供',
                carousel_list: carousel_list
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