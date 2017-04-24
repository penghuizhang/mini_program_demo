Page({
    onbutton:function(){
        wx.navigateTo({
          url: '/pages/posts/post',
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
        // wx.navigateTo({  该页面是跳转后的主页面，跳转后的页面带有返回链接
        //   url: 'String',
        //   success: function(res){
        //     // success
        //   },
        //   fail: function(res) {
        //     // fail
        //   },
        //   complete: function(res) {
        //     // complete
        //   }
        // })
    }
})