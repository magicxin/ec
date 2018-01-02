import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
  console.log(params)
    params = params || {}

    bridge().then((wx) => {
        wx.openLocation({ 
          latitude: params.latitude,
          longitude: params.longitude,
          name: params.title,
          address: params.address,
          scale: params.scale || 12
          // ,
          // infoUrl: 'http://weixin.qq.com'
        })
    }, (err) => {
        fail && fail(err)
    })
}
