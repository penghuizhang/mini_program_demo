// pages/movie/more-movies/more-movies.js
var app = getApp();
var utils = require("../../../utils/utils.js");
Page({
  data: {
    movies: {},
    navigateTitle: "",
    isEmpty: true,
    requestUrl: "",
    totalCount: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.categoryTitle;

    //设置中间变量，将接收的值放置到data中，然后在其他生命周期函数中进行获取
    this.data.navigateTitle = category;

    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    utils.http(dataUrl, this.processDoubanData);
    //关闭加载更新
    wx.showNavigationBarLoading();
    //关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var index in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: utils.covertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovies = {};

    //如果有新绑定加载的数据，需要同原有的数据进行绑定，合并在一起
    //如果第一次进入该方法，会加载20条数据，然后将isEmpty设置成false，经过判断，第二次进入后执行合并在一起方法
    // ，此时将数据增加20条
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {
        console.log(res.data);
      }
    })
  },
  onScroll: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function(event){
    console.log("下拉刷新");
    var refresh = this.data.requestUrl+"?start=0&count=20";
    this.data.movies={};
    this.data.totalCount = 0;
    this.data.isEmpty = true;
    utils.http(refresh, this.processDoubanData);
    wx.stopPullDownRefresh();
  }

})