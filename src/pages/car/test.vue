<template>
	<section id="test">
		<button @touchstart="startRecord()" @touchend="overRecord()" secondary fullWidth class="btn-record">开始录音</button>
		<button @click="upLoad()" secondary fullWidth class="btn-record btnUpload">上传录音</button>
		<button @click="listerRocord()" secondary fullWidth class="btn-record btnListen">试听</button>
		<button @click="getGpsLocation()" secondary fullWidth class="btn-record btnGps">获取GPS坐标</button>
		<input type="text" name="" id="getGpsLocation" value="" />
		<button @click="getBdLocation()" secondary fullWidth class="btn-record btnBd">转为GPS坐标</button>
		<button @click="closeWebview()" class="btn-record test">CLOSE </button>
	</section>
</template>
<script>
	import hideMenuItems from '../threeparties/wechat/utilities/hide-menuItems';
	//隐藏分享按钮中的一项或多项
	var hideMenuItem = ["QZone"];
	import startRecord from '../threeparties/wechat/utilities/start-record';
	import stopRecord from '../threeparties/wechat/utilities/stop-record';
	//分享到
	import shareItems from '../threeparties/wechat/utilities/share-items';
	var params = {
				"timeLine":{title : "",link : "",imgUrl : ""},//朋友圈
				"appMessage":{title : "",link : "",imgUrl : "","desc":""},//朋友
				"qq":{title : "",link : "",imgUrl : "","desc":""},//qq
				"weiBo":{title : "",link : "",imgUrl : "","desc":""},//微博
				"qZone":{title : "",link : "",imgUrl : "","desc":""}//qq空间
				};
	//关闭当前窗口方法引入
	import closeWebview from '../threeparties/wechat/utilities/close-webView';
	import upLoad from '../threeparties/wechat/utilities/up-load';
	import listenRecord from '../threeparties/wechat/utilities/listen-record';
	import getGpsLocation from '../threeparties/wechat/utilities/get-location';
	import getBdLocation from '../threeparties/wechat/utilities/get-baiduMapLocation';
	import localSavedLocation from 'services/location-data';
	var serverId,voiceStart,voiceMinute,voiceLocalId;
  	export default {        
	    components:{
	    },
	    data(){
			return {
				defaultLongitude:116.404, 
				defaultLatitude:39.915
			}
		},
	    created(){
	    	//隐藏分享项
			hideMenuItems(hideMenuItem,function(success){
				console.log(success);
			},
			function(fail){
				console.log(fail);
			});
			//分享
			shareItems(params,function(success){
				console.log(success);
			},
			function(fail){
				console.log(fail);
			});
	    },
	    methods:{
	    	startRecord : function(){
	    		startRecord({},function(success,e){
	    			console.log(success);
	    		},
	    		function(fail){
					console.log(fail);
				})
	    	},
	    	overRecord : function(){
	    		stopRecord({},function(success){
	    			console.log(success);
	    		},
	    		function(fail){
					console.log(fail);
				})
	    	},
	    	upLoad : function(){
	    		upLoad({},function(success){
	    			console.log(success);
	    		},
	    		function(fail){
					console.log(fail);
				})
	    	},
	    	listerRocord : function(){
	    		listenRecord({},function(success){
	    			console.log(success);
	    		},
	    		function(fail){
					console.log(fail);
				})
	    	},
	    	getGpsLocation : function(){
	    		getGpsLocation({},(position)=>{
					this.longitude=position.longitude;
					this.latitude=position.latitude;
					localSavedLocation.set({
						longitude:position.longitude,
						latitude:position.latitude
					});
					document.getElementById("getGpsLocation").value = this.longitude + "，" + this.latitude;
				},(err)=>{
					var localSavedUserLocation=localSavedLocation.get();
					this.longitude=localSavedUserLocation ? localSavedUserLocation.longitude : this.defaultLongitude;
					this.latitude=localSavedUserLocation ? localSavedUserLocation.latitude : this.defaultLatitude;
					console.log(err);
				})
	    	},
	    	//GPS坐标转化为百度地图坐标
	    	getBdLocation : function(){
	 			var positionArray = [
							     {"longitude":116.174008, "latitude":41.059728},
							     {"longitude":117.172708, "latitude":42.0603688},
							     {"longitude":118.174535, "latitude":43.059727},
							     {"longitude":119.373919, "latitude":44.981656}
							     ];
	    		getBdLocation(positionArray).then((value)=>{
			  		console.log(value);
			  	},(err)=>{
			  		console.log(err);
			  	});
	    	},
	    	//关闭当前窗口
	    	closeWebview : function(){
	    		closeWebview({},function(success){
	    			alert(success);
	    		});
	    	}
	    }
	}
</script>
<style type="text/css">
	.btn-record{
		width: 200px;
		height: 40px;
		background: lightblue;
		border-radius: 20%;
		position: absolute;
		text-align: center;
	}
	.btnUpload{
		top: 50px;
	}
	.btnListen{
		top: 100px;
	}
	.btnGps{
		top: 150px;
	}
	#getGpsLocation{
		top: 200px;
	}
	.btnBd{
		top: 250px;
	}
	.test{
		top: 300px;
	}
</style>