Page({
  onTapBtn_Photo:function(){
    wx.switchTab({
      url: '../page_photo/page_photo',
    })
  },
  onTapBtn_Trans:function(){
    wx.switchTab({
      url: '../page_trans/page_trans',
    })  
  },
  GotoAbout:function(){
    wx.navigateTo({
      url: '../page_about/page_about',
    })
  }

});
