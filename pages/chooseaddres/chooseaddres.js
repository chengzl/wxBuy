// pages/chooseaddres/chooseaddres.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [
      // { name: '天下我最帅1', phone: '14870643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id1', checked: true },
      // { name: '天下我最帅2', phone: '15670643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id2', checked: false },
      // { name: '天下我最帅3', phone: '18870643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id3', checked: false },
      // { name: '天下我最帅4', phone: '15800643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id4', checked: false },
      // { name: '天下我最帅5', phone: '18900643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id5', checked: false },
      // { name: '天下我最帅6', phone: '13780643567', address: '深圳市南山区西丽丽兰苑4栋406', value: 'id6', checked: false }
    ],
  },

  radioChange: function (e) {
    let that = this
    let address_id= e.detail.value
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id

        wx.request({
          url: 'https://api.360ppl.cn/User/setDefault',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
            address_id: address_id
          },
          success: function (defaultRes) {
            
            wx.showToast({
              title: '设置成功',
              icon:'success',
              success:function(){
                setTimeout(function(){
                  that.onLoad()
                },1000)
              }
            })
          },
          fail: function () {
            wx.showToast({
              title: '网络繁忙',
              icon: 'loading'
            })
          },
        })
      }
    })
  },

  updateAddres:function(e){
    //console.log(e)
    let address = e.currentTarget.dataset['address']
    let addressid = e.currentTarget.dataset['addressid']
    let city = e.currentTarget.dataset['city']
    let consignee = e.currentTarget.dataset['consignee']
    let district = e.currentTarget.dataset['district']
    let mobile = e.currentTarget.dataset['mobile']
    let province = e.currentTarget.dataset['province']
    wx.navigateTo({
      url: '../updateaddress/updateaddress?addressid=' + addressid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&mobile=' + mobile + '&province=' + province,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id

        wx.request({
          url: 'https://api.360ppl.cn/user/addressList',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            is_wx_app: 1,
          },
          success: function (addressRes) {
            let addressArray=[]
            let addressList = addressRes.data.result
            let len = addressList.length
            if (addressList && len > 0) {
              for (let i = 0; i < len; i++) {
                let address_id = addressList[i].address_id
                let is_default = addressList[i].is_default
                let consignee = addressList[i].consignee
                let mobile = addressList[i].mobile
                let addr = ''
                let province = addressList[i].province
                let city = addressList[i].city
                let district = addressList[i].district
                let address = addressList[i].address
                if (province == city) {
                  addr = city + district + address
                } else {
                  addr = province + city + district + address
                }

                if (addr.length > 20) {
                  addr = addr.substring(0, 20) + "..."
                }

                addressArray.push({
                  name: consignee,
                  phone: mobile,
                  province: province,
                  city: city,
                  district: district,
                  allAddress: addressList[i].address,
                  address: addr,
                  value: address_id,
                  checked: is_default==1?true:false
                })

                that.setData({
                  address: addressArray
                })
              }
            } else {
              wx.showToast({
                title: '请添加收货地址',
                icon: 'loading'
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: '网络繁忙',
              icon: 'loading'
            })
          },
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