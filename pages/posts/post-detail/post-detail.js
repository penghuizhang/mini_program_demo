var postsData = require("../../../data/post-data.js");
var app = getApp();
Page({
    data:{
        isPlayingMusic :false
    },
    onLoad: function (option) {
        var globalData = app.globalData;
        var postid = option.id;
        this.data.currentPostid = postid;
        var postData = postsData.postList[postid];

        this.setData({
            postData: postData
        })

        var postsCollected = wx.getStorageSync('posts_collected');   
        if (postsCollected) {
            var postcollected = postsCollected[postid];
            this.setData({
                collected: postcollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postid] = false;
            wx.setStorageSync('posts_collected', postsCollected)
        }
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentPostId === postid){
            this.setData({
                isPlayingMusic:true
            })
            
        }
        this.setMusicMonitor();

    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentPostId = that.data.currentPostid;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentPostId = null;
        });
        
        wx.onBackgroundAudioStop(function (){
            that.setData({
                isPlayingMusic:false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentPostId = null;
        });

    },


    onCollectionTap: function (event) {
        //读取缓存信息
        var postsCollected = wx.getStorageSync('posts_collected');
        // this.data.currentPostid是通过onLoad方法中，将获得的当前id编号定义到当前
        // 变量中，通过this.data.currentid进行读取获得的传送过id编号
        //postsCollected[this.data.currentPostid]从postsCollected对象中获取当前的id状态值
        var postCollected = postsCollected[this.data.currentPostid];
        //获取到的postsCollected是当前刚进入页面时的id状态值
        //因为该方法是通过点击“收藏”按钮触发的事件响应，因此
        //通过取反运算将postCollected状态进行改变
        postCollected = !postCollected;
        //将获取到的POSTCollected状态值对原有状态进行修改
        postsCollected[this.data.currentPostid] = postCollected;
        this.showToast(postsCollected, postCollected);
    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章" : "取消收藏文章",
            showCancel: "true",
            cancelText: "取消成功",
            cancelColor: "#333",
            confirmText: "收藏成功",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //获取缓存对象，设置
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新对象数据
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        //获取缓存对象，设置
        wx.setStorageSync('posts_collected', postsCollected);
        //更新对象数据
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功"
        })
    },
    onShareTap: function (event) {
        var itemList = [
            "分享到微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ]
        wx.showActionSheet({
            // rse.cancel
            // res.tapIndex
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消?" + res.cancel + "现在无法分享该功能，什么时候能支持呢?"
                })
            }
        })

    },
    onMusictap: function (event) {
        var currentpostId = this.data.currentPostid;
        var postData = postsData.postList[currentpostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
            // this.data.isPlayingMusic = false;
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.dataUrl,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImgUrl,
            })
            this.setData({
                isPlayingMusic: true
            })
            //this.data.isPlayingMusic = true;
        }
    }


})