import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    params = params || {}
    bridge().then(function(wx){
		wx.stopRecord({ 
            success: function (res) {
                var voiceMinute = res.localId;
                sessionStorage.setItem("localVoice",voiceMinute);
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