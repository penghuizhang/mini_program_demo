// pages/movie/movies-detail/movies-detail.js
var app = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + id;
    utils.http(url, this.processDoubanData);
  },
  processDoubanData: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if(data.directors[0] != null){
      if(data.directors[0].averatars != null){
        director.avatar = data.directors[0].avatar.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg:data.images?data.images.large:"",
      country :data.countries[0],
      title:data.title,
      originalTitle:data.original_title,
      wishCount: data.wish_count,
      commentCount:data.comments_count,
      year:data.year,
      generes:data.genres.join("、"),
      stars:utils.covertToStarsArray(data.rating.stars),
      score:data.rating.average,
      director:director,
      casts:utils.convertToCastString(data.casts),
      castsInfo:utils.convertToCastInfos(data.casts),
      summary:data.summary
    }
    console.log(movie)
    this.setData({
      movie:movie
    })
  },

  /**
   * 查看图片
   */

  viewMociePostImg:function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  }
})