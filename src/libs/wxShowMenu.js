import { getJsApiMsg } from '@/api'
import wx from 'weixin-js-sdk'
export const wxShowMenu = (title, desc, link, img) => {
  // alert(window.location)
  getJsApiMsg({
    url: window.location.href
  }).then(function (res) {
    var getMsg = res.data
    // alert(JSON.stringify(res))
    wx.config({
      debug: false, // 生产环境需要关闭debug模式
      appId: getMsg.appId, // appId通过微信服务号后台查看
      timestamp: getMsg.timestamp, // 生成签名的时间戳
      nonceStr: getMsg.nonceStr, // 生成签名的随机字符串
      signature: getMsg.signature, // 签名
      jsApiList: [ // 需要调用的JS接口列表
        'updateAppMessageShareData', // 分享给好友
        'updateTimelineShareData', // 分享到朋友圈
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
    })
    wx.ready(function () {
      wx.checkJsApi({
        jsApiList: [ 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage' ]
      })

      wx.onMenuShareTimeline({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: img // 分享图标
      })

      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: img // 分享图标
      })
      // 分享到朋友圈
      wx.updateTimelineShareData({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: img // 分享图标
      })

      // 分享给朋友

      wx.updateAppMessageShareData({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: img // 分享图标

      })
    })
  })
}
