import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    params = params || {}
    bridge().then(function(wx){
	 	//如果录音上传语音
        wx.uploadVoice({
            localId: sessionStorage.getItem("localVoice"), // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID
                success && success('上传语音成功，serverId 为' + res.serverId);
            },
            fail: function (res) {
		       fail && fail(res.errMsg);
		    }
        });
	},function(err){
	    fail && fail(err)
	})
}