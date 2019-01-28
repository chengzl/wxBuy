// pages/updateaddress/updateaddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    consignee: '',
    mobile: '',
    province: '',
    city: '',
    district: '',
    address: '',
    value: '',
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  formSubmit: function (e) {
    let address_id = e.detail.value.address_id
    let consignee = e.detail.value.name;
    let mobile = e.detail.value.phone;
    let region = this.data.region;
    let address = e.detail.value.address;
    
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        let globalData = res.data
        let token = globalData.auth_code
        let user_id = globalData.user_id

        wx.request({
          url: 'https://api.360ppl.cn/User/editUserAddress',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
            address_id: address_id,
            consignee: consignee,
            mobile: mobile,
            province: region[0],
            city: region[1],
            district: region[2],
            address: address,
          },
          success: function (addressRes) {
            //console.log(addressRes)
            wx.navigateTo({
              url: '../chooseaddres/chooseaddres',
              success: function (res) {
              },
              fail: function () {
              },
              complete: function () {
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '网络繁忙',
              icon: 'loading'
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let that=this
    let address = options.address
    let addressid = options.addressid
    let city = options.city
    let consignee = options.consignee
    let district = options.district
    let mobile = options.mobile
    let province = options.province
    let region = [province, city, district]
    that.setData({
      consignee: consignee,
      mobile: mobile,
      province: province,
      city: city,
      district: district,
      address: address,
      value: addressid,
      region: region
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