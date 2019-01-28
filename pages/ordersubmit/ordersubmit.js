// pages/ordersubmit/ordersubmit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    shipping_fee:0,
    total_price:0,
    goods:null,
    showPoper:'',//地址显示
    showPoper2:'display',//新建地址弹窗显示
    addr:'',
    consignee:'',
    mobile:'',
    address_id: '',
    deal_id:'',
    postscript:''
  },

  cancel:function(){
    this.setData({
      showPoper2:'display'
    })
  },

  chooseAddress:function(){
    wx.navigateTo({
      url: '../chooseaddres/chooseaddres',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  createAdress:function(){
    wx.navigateTo({
      url: '../createaddress/createaddress',
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

  inputRemark: function (e) {
    this.setData({
      postscript: e.detail.value
    })
  },

  wxPay:function(){
    let that=this
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id
        let address_id = that.data.address_id
        let deal_id = that.data.deal_id
        let postscript = that.data.postscript
        console.log(address_id)
        console.log(deal_id)
        console.log(postscript)

        wx.request({
          url: 'https://api.360ppl.cn/order/orderPay',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            address_id: address_id,
            deal_id: deal_id,
            postscript: postscript,
            is_wx_app: 1
          },
          success: function (detailRes) {
            console.log(detailRes)
            let info = detailRes.data.result
            wx.requestPayment({
              'timeStamp': info.timeStamp,
              'nonceStr': info.nonceStr,
              'package': info.packages,
              'signType': info.signType,
              'paySign': info.paySign,
              'success': function (res) {
                console.log(res)
                wx.navigateTo({
                  url: '../payresult/payresult',
                })
              },
              'fail': function (res) {
                console.log(res);
                wx.showLoading({
                  title: '支付失败，请重试',
                })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    let money = options.money
    let good_id=options.goodid
    let qishu_id=options.qishu_id
    that.setData({
      money: money
    })
    wx.getStorage({
      key: 'globalData',
      success: function (res) {
        var globalData = res.data
        var token = globalData.auth_code
        var user_id = globalData.user_id

        wx.request({
          url: 'https://api.360ppl.cn/order/checkOut',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            token: token,
            user_id: user_id,
            good_id: good_id,
            is_wx_app: 1
          },
          success: function (detailRes) {
            console.log(detailRes)
            let result=detailRes.data.result
            let deal_id = result.deal_id
            let goods = result.cartGoods
            let total_price = parseFloat(result.shipping_fee)+parseFloat(money)
            that.setData({
              goods: goods,
              deal_id: deal_id,
              shipping_fee: result.shipping_fee,
              total_price: total_price
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
            //console.log(addressRes)
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

                if (addr.length > 22) {
                  addr = addr.substring(0, 22) + "..."
                }

                if (is_default == 1) {
                  that.setData({
                    address_id: address_id,
                    showPoper: 'display',
                    showPoper2: 'display',
                    consignee: consignee,
                    mobile: mobile,
                    addr: addr,
                  })
                }
              }
            } else {
              that.setData({
                showPoper: '',
                showPoper2: ''
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