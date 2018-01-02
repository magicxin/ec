import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    params = params || {}
    bridge().then(function(wx){
		console.log('bridge inited');
		//开始录音
    	wx.startRecord({
    		success: function(res,e){
    			success && success(res);
    		},
    		fail: function (res) {
		       fail && fail(res);
		    }
    	});
//		wx.onVoiceRecordEnd({
//	        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
//	        complete: function (res) {
//	            var voiceLocalId = res.localId;
//	            alert('录音时间已超过一分钟');
//	            sessionStorage.setItem("localVoice",voiceLocalId);
//	        },
//	        success: function(res){
//	        	success && success("录音时间超过1分钟" + res);
//	        },
//	        fail: function(res){
//	        	fail && fail(res);
//	        }
//	   })
	},function(err){
	    fail && fail(err)
	})
}