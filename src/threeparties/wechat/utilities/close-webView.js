import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
	params = {} || params;
    bridge().then(function(wx){
    	wx.closeWindow({
    		success : function(){
    			success && success("关闭窗口");
    		}
    	});
    },function(err){
        fail && fail(err);
    })
}
