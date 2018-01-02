import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    bridge().then(function(wx){
    	console.log('bridge inited')
    	//分享到朋友圈
		wx.onMenuShareTimeline({
		    title: params.timeLine.title, // 分享标题
		    link: params.timeLine.link, // 分享链接
		    imgUrl: params.timeLine.imgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       success && success("分享成功");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("取消分享");
		    },
		    fail: function(res){
		    	fail && fail(res);
		    }
		});
		//分享给朋友
		wx.onMenuShareAppMessage({
		    title: params.appMessage.title, // 分享标题
		    desc: params.appMessage.desc, // 分享描述
		    link: params.appMessage.link, // 分享链接
		    imgUrl: params.appMessage.imgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       success && success("分享成功");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("取消分享");
		    },
		    fail: function(res){
		    	fail && fail(res);
		    }
		});
		//分享到qq
		wx.onMenuShareQQ({
		    title: params.qq.title, // 分享标题
		    desc: params.qq.desc, // 分享描述
		    link: params.qq.link, // 分享链接
		    imgUrl: params.qq.imgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       success && success("分享成功");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("取消分享");
		    },
		    fail: function(res){
		    	fail && fail(res);
		    }
		});
		//分享到腾讯微博
		wx.onMenuShareWeibo({
		    title: params.weiBo.title, // 分享标题
		    desc: params.weiBo.desc, // 分享描述
		    link: params.weiBo.link, // 分享链接
		    imgUrl: params.weiBo.imgUrl, // 分享图标
		   success: function () { 
		        // 用户确认分享后执行的回调函数
		       success && success("分享成功");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("取消分享");
		    },
		    fail: function(res){
		    	fail && fail(res);
		    }
		});
		//分享到qq空间
		wx.onMenuShareQZone({
		    title: params.qZone.title, // 分享标题
		    desc: params.qZone.desc, // 分享描述
		    link: params.qZone.link, // 分享链接
		    imgUrl: params.qZone.imgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		       success && success("分享成功");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("取消分享");
		    },
		    fail: function(res){
		    	fail && fail(res);
		    }
		});
    },function(err){
        fail && fail(err);
    })
}
