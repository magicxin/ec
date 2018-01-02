import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
	var hideMenuLIst = "";
    for(var i=0;i<params.length;i++){
    	hideMenuLIst += "menuItem:share:" + params[i] +",";
    }
    hideMenuLIst = hideMenuLIst.substr(0,hideMenuLIst.length-1).split(",");
    bridge().then(function(wx){
    	console.log('bridge inited')
		wx.hideMenuItems({
	        menuList: 
//	        			hideMenuLIst.substr(0,hideMenuLIst.length-1)
	        			 // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//	                    "menuItem:share:qq","menuItem:share:weiboApp","menuItem:share:facebook","menuItem:share:QZone","menuItem:openWithQQBrowser",
//	                    "menuItem:share:email","menuItem:share:brand","menuItem:editTag","menuItem:delete","menuItem:copyUrl",
//	                    "menuItem:originPage","menuItem:readMode","menuItem:openWithSafari"
	        			hideMenuLIst,
	        success : function(res){
	        	success && success("隐藏功能按钮成功，隐藏项为" + params);
	        },
	        fail : function(res){
	        	fail && fail(res);
	        }       
	    });
    },function(err){
        fail && fail(err)
    })
}