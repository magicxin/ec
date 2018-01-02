import bridge from 'threeparties/wechat/settings/bridge'

export default function(params, success, fail) {
    params = params || {}

    bridge().then((wx) => {
    	var localIds,serverId,localId;
    	wx.chooseImage({
		    count: 3, // 默认9
		    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		    success: function (res) {
		        localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
		        console.log(localIds);
		        success && success(res,localIds);
		        //预览第一张
//		        wx.previewImage({  
//	                current: '',  
//	                urls: [localIds[0]]  
//	            }); 

//		        wx.uploadImage({
//				    localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
//				    isShowProgressTips: 1, // 默认为1，显示进度提示
//				    success: function (res) {
//				        serverId = res.serverId; // 返回图片的服务器端ID
//				        console.log("serverId" + serverId)
//				        wx.downloadImage({
//						    serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
//						    isShowProgressTips: 1, // 默认为1，显示进度提示
//						    success: function (res) {
//						        localId = res.localId; // 返回图片下载后的本地ID
//						        console.log("localId" + localId)
//						        success && success(res,localId);
//						    }
//						});
//				    }
//				});
		    },
		    fail:function(res){
            	fail && fail(res.errMsg)
            }
	});
//		wx.getLocalImgData({
//		    localId: localId, // 图片的localID
//		    success: function (res) {
//		        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
//		        success && success(res,localData);
//		    }
//		});
    }, (err) => {
        fail && fail(err)
    })
}
