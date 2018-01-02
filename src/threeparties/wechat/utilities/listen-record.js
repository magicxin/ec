import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    params = params || {}
    bridge().then(function(wx){
		wx.playVoice({ 
			localId: sessionStorage.getItem("localVoice"),
            success: function (res) {
                success && success(res);
            },
            fail: function (res) {
		       fail && fail(res);
		    }
       })
	},function(err){
	    fail && fail(err)
	})
}
