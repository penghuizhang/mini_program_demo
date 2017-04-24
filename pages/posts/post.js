var datas = require('../../data/post-data.js');

Page({
  data: {

  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

    this.setData({
      post_key: datas.postList
    });
  },
  ontag: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  swipertap: function (event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }

})