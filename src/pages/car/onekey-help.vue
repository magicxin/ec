<template>
	<section id="onekey-help" class="background-white" ref="stopMove">
		<!--<ul id="">
			<li :class='item.current ? "active" : ""' v-on:click="addActiveClass(index)" v-for="(item,index) in checkHelpResonBtn">{{item.title}}</li>
		</ul>-->
		<ul class="" id="onekey-help-ul">
			<li class='fullWidth onekey-help-ul_liOne'>一键救援
				<mu-raised-button label="" secondary id="getHelpLIst" class="iconfont icon-dianhua" @click="getHelpList">
	    		</mu-raised-button>
			</li>
		</ul>
		<div id="waitHelp" v-show="waitHelp">
			<p>救援人员马上出发请耐心等待......</p>
			<a href="javascript:;" @click="open">取消</a>
		</div>
		<div id="sureCancel" v-show="dialog">
			<p>您确定要取消救援吗？</p> 
		    <mu-flat-button label="确定" slot="actions" primary @click="refuseRescue" />
		    <mu-flat-button label="取消" slot="actions" primary @click="close"/>
		</div>
		<section id="help-map-container"></section>
		<section id="helpList" v-show="helpListShow">
			<ul class="" id="">
				<li class='fullWidth borderB' style="position: relative;height: 50px;">
					<p class="ft14 pl10">V服爱车道路救援</p>
					<p class="pl10">电话：400-968-1123</p>
					<a href="tel:400-968-1123" class="positionAbsRight iconfont icon-dianhua"></a>
				</li>
			</ul>
			<div id="hideHelpList" @click="function(){helpListShow = !helpListShow}">
				
			</div>
		</section>
	    <div class="onekey-help-sureHelp">
	    	<mu-raised-button label="确认救援" secondary fullWidth id="sureHelp" @click="sureNeedHelp"/>
	    	<mu-raised-button label="" secondary fullWidth id="checkReson" class="iconfont icon-biaodan" :class="checkHelpReson ? 'orangeBg' : ''" v-on:click="checkResonDiv"/>
	    	<mu-raised-button label="" secondary id="callPhone" class="iconfont icon-dianhua">
	    		<a href="tel:400-968-1123" class="positionAbs"></a>
	    	</mu-raised-button>
	    </div>
	    <div id="checkHelpReson" v-if="checkHelpReson" >
	    	<div class="checkHelpReson_checkBox">
	    		<p>选择故障原因（最多可选择3项）</p>
	    		<div class="checkBoxDiv" v-for="(item,index) in checkBox">
	    			<input type="checkbox" ref="abc" :value="item.value" :id="item.id" v-model="item.checked" class="checkBoxType" @click="checkBoxOne(item.checked,item.value)"/><label :for="item.id">{{item.value}}</label>		
	    		</div>
	    	</div>
	    	<div class="photoAndVoive">
	    		<div class="showPicture" v-show="showPicture" ref="pictureSrcOne">
	    			<span class="photoAndVoive_span">
	    				照片：
	    			</span>
	    			<img :src="item" ref="pictureSrc" id="" style="height: 60px;width: 60px;" v-for="item in imgSrcs"/>
	    		</div>
	    		<div class="showVoice" v-show="showVoice">
	    			<span id="" class="photoAndVoive_span">
	    				语音：
	    			</span>
	    			<span class="sphotoAndVoive_span" id="showVoiceSpan" ref="changeWidth" style="width:"></span>
	    		</div>
	    		<div id="takePicture" class="photoAndVoive_btn iconfont icon-xiangji" v-on:click="choicePicture"></div>
	    		<div id="beginSpeak" class="photoAndVoive_btn iconfont icon-huatong" ref="recordCheck" @touchstart="startRecords()" @touchend="stopRecord()" @touchMove="movePlice()"></div>
	    	</div>
	    </div>
	    <div class="showVoiceDiv" v-show="showVoiceDivShow">
	    	<div class="showVoiceDiv_words" v-show="showVoiceDivShowWords" id="bgBlack">
	    		手指上滑，取消发送
	    	</div>
	    	<div class="showVoiceDiv_words" v-show="hideVoiceDivShowWords" id="bgRed">
	    		松开手指，取消发送
	    	</div>
	    </div>
	</section>
</template>
<script>
// import MuRadio from 'muse-components/radio';
// import MuRaisedButton from 'muse-components/raisedButton';
// import MuDialog from 'muse-components/dialog';
// import MuFlatButton from 'muse-components/flatButton';
import localSavedLocation from 'services/location-data';
import getLocation from 'utilities/get-location';
import gpsConvertor from 'utilities/gps-convertor';
import chooseImg from 'threeparties/wechat/utilities/choose-img';
import startRecord from 'threeparties/wechat/utilities/start-record';
import stopRecord from 'threeparties/wechat/utilities/stop-record';
import listenRecord from 'threeparties/wechat/utilities/listen-record';
import getRescueReason from 'services/get-rescue-reason';
import refuseRescue from 'services/refuse-rescue';
import getRescueList from 'services/get-rescueList';
import userInfo from 'services/user-info';
export default {
    components: {
    	// MuRaisedButton,
    	// MuRadio,
    	// MuDialog,
    	// MuFlatButton
    },
    data() {
      return {
      	dialog: false,
      	waitHelp : false,
      	helpListShow : false,
      	imgSrcs : [],
      	timer : '',
      	timeNum : 0,
      	wantSaveVoice : false,
      	showVoiceDivShow : false,
      	showVoiceDivShowWords : true,
      	hideVoiceDivShowWords : false,
      	showPicture : false,
      	showVoice : false,
      	showPictureSrc : "",
      	checkBoxNum : 0,
        checkHelpReson : false,
        checkHelpResonBtn :  [
			            {"title": "一键救援", current: true},
			            {"title": "一键保险", current: false}
       				 ],
        checkedNames : [],
        checkBox :  [{checked:false,disabled:false,value:'紧急送油',id : 1},
        			{checked:false,disabled:false,value:'紧急加水',id:2 },
        			{checked:false,disabled:false,value:'电瓶接电',id:3},
        			{checked:false,disabled:false,value:'更换轮胎',id:4},
        			{checked:false,disabled:false,value:'现场抢修',id:5},
        			{checked:false,disabled:false,value:'拖车牵引',id:6},
        			{checked:false,disabled:false,value:'其他故障',id:7}
        			],
        baiduPoint : [],
        resuseReason : []
      }
    },
    computed:{
      
    },
    created(){
    	//获取基类信息
    	userInfo.bind(this)(function(success){
			console.log(success);
		},function(fail){
			console.log(fail);
		})
    	function drawPerson(){
			setTimeout(()=>{
				this.drawMap()
				this.marker=new BMap.Marker(this.point)
				this.map.addOverlay(this.marker)
				this.marker.enableDragging()
			},500)
		}
    	//获取GPS坐标
      	getLocation({},(position)=>{
			this.longitude=position.longitude
			this.latitude=position.latitude
			localSavedLocation.set({
				longitude:position.longitude,
				latitude:position.latitude
			})
			drawPerson.bind(this)()
		},(err)=>{
			let localSavedUserLocation=localSavedLocation.get()
			this.longitude=localSavedUserLocation ? localSavedUserLocation.longitude : this.defaultLongitude
			this.latitude=localSavedUserLocation ? localSavedUserLocation.latitude : this.defaultLatitude
			drawPerson.bind(this)()
		})
      	
	},
    methods:{
    	open () {
	      this.dialog = true
	    },
	    close () {
	      this.dialog = false
	    },
    	//绘制地图	
      	drawMap(){
			!this.mapInited && (this.map = new BMap.Map("help-map-container"))
			var abc = ([{"lng":this.longitude, "lat":this.latitude}]);
			this.point=new BMap.Point(this.longitude, this.latitude);
			var _this = this;
			this.map.clearOverlays();
			//转换为百度地图坐标
			gpsConvertor({points:[{
				lat:parseFloat(this.latitude),
				lng:parseFloat(this.longitude)
			}]}).then((points)=>{
				console.log(points)
				_this.baiduPoint = points[0];
				_this.map.centerAndZoom(points[0], 15);
			 	_this.map.clearOverlays();
			 	var opt = {"title":"","enableDragging":true};  
			 	var marker = new BMap.Marker(points[0],opt);
			 	_this.map.addOverlay(marker);  
			},(err)=>{

			})
			let trafficControl=new BMapLib.TrafficControl({showPannel:false})
//			!this.mapInited && this.map.addControl(new BMap.NavigationControl())
//			!this.mapInited && this.map.addControl(trafficControl)
// 			!this.mapInited && trafficControl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT)
		},
      	addActiveClass (index) {
       		for(let i = 0, len = this.checkHelpResonBtn.length ; i < len ; i++) {
    			this.checkHelpResonBtn[i].current = false
			}
      		this.checkHelpResonBtn[index].current = !this.checkHelpResonBtn[index].current;
      	},
      	//故障原因模块显示与隐藏
      	checkResonDiv(){
      		this.checkHelpReson = !this.checkHelpReson;
      	},
      	//复选框选择
      	checkBoxOne(a,b){
      		if(a == true){
      			this.checkBoxNum--;
      			console.log(this.checkBoxNum)
      		}else{
      			this.checkBoxNum++;
      			console.log(this.checkBoxNum)
      		} 
      		var getDom = this.$refs.abc;
  			for(var i=0;i<getDom.length;i++){
  				if(this.checkBoxNum == 3){
      				if(getDom[i].checked == false){
      					getDom[i].disabled = true;
      				}
      			}else{
      				getDom[i].disabled = false;
      			}
  			}
      	},
      	//调用微信接口获取图片本地id
     	choicePicture(){
     		var _this = this;
      		chooseImg({},function(success,localIds){
      			//把微信接口返回的id值赋给页面中img的src属性
      			_this.imgSrcs = localIds;
      			_this.showPicture = true;
      		},
      		function(fail){
      			console.log(fail);
      		});
      	},
      	//开始录音
      	startRecords(){
      		var _this = this;
      		this.timer = setInterval(function(){
      			_this.timeNum+=1;
      		},1000)
      		this.showVoiceDivShow = true;
      		this.showVoiceDivShowWords = true;
    		this.hideVoiceDivShowWords = false;
    		startRecord({},function(success,e){
    			console.log(success);
    		},
    		function(fail){
				console.log(fail);
			})
			var touch = event.targetTouches[0];
			this.$refs.recordCheck.addEventListener('touchmove',function(event){
				var touchOne = event.targetTouches[0];
	            if(Math.abs(touch.pageX - touchOne.pageX) > 50 || Math.abs(touch.pageY - touchOne.pageY) > 50){
	            	_this.showVoiceDivShowWords = false;
	            	_this.hideVoiceDivShowWords = true;
	            	_this.wantSaveVoice = false;
	            	function stopRecord(){
	            		_this.showVoiceDivShow = false;
	            	}
	            }else{
	            	_this.wantSaveVoice = true;
	            	_this.showVoiceDivShowWords = true;
	            	_this.hideVoiceDivShowWords = false;
	            	
	            }
	        },false);
    	},
    	//停止录音
    	stopRecord(){
    		this.showVoiceDivShow = false;
    		var _this = this;
    		if(this.hideVoiceDivShowWords == false){
    			stopRecord({},function(success){
	    			console.log(success);
	    			_this.showVoice = true;
	    			_this.$refs.changeWidth.style.width = (_this.timeNum * 5 + 30) +  "px";
	    			clearInterval(_this.timer);
	    			_this.timeNum = 0;
	    		},
	    		function(fail){
					console.log(fail);
				})
    		}
			
    	},
    	//确认救援，创建救援信息，获取救援原因
    	sureNeedHelp(){
    		var getDom = this.$refs.abc;
    		var arrReason = [];
    		if(getDom){
    			for(var i=0;i<getDom.length;i++){
	    			if(getDom[i].checked == true){
	    				// arrReason+= getDom[i].value + " ";
						arrReason.push(getDom[i].id);
					}
	    		}
    		}
    		console.log(arrReason);
    		this.waitHelp = true;
    		var getUserMessaage = JSON.parse(localStorage.getItem("user"));
    		var happanTime = new Date();
    		var creatRescueRecord = {
    			carId : getUserMessaage.carId,
    			userId : getUserMessaage.userId,
    			shopId : getUserMessaage.shop.id,
    			reasons : arrReason,
    			memberBaiduLat : this.baiduPoint.lat,
    			memberBaiduLng : this.baiduPoint.lng,
    			happanDate : happanTime.toLocaleString()
    		}
    		console.log(creatRescueRecord);
    		getRescueReason.bind(this)(creatRescueRecord,(data)=>{
	        	
	      	},(errorMessage)=>{
	       		console.log(errorMessage);
	      	})
    	},
    	//获取救援机构列表
    	getHelpList(){
    		getRescueList.bind(this)({},(data)=>{
	        	console.log(data);
	        	this.helpListShow = true;
	      	},(errorMessage)=>{
	       		console.log(errorMessage);
	      	})
    	},
    	//拒绝救援
    	refuseRescue(){
    		this.waitHelp = false;
    		this.dialog = false;
    		this.close
    		refuseRescue.bind(this)({},(data)=>{
	        	console.log(data);
	      	},(errorMessage)=>{
	       		console.log(errorMessage);
	      	})
    	}
    },
    mounted () {
    	
  	}
}
</script>
<style lang="scss" type="text/css">
	@import "../../scss/variables.scss";
	// @import "../../assets/fonts/iconfont.css";
	.fullWidth{
		width : 100%;
	}
	#onekey-help .iconfont{
		font-size: 26px;
		color: #ff8d00;
	}
	#onekey-help-ul{
		width: 100%;
		height: 50px;
		list-style: none;
		position: absolute;
		top: 0;
		li.onekey-help-ul_liOne{
			height: 100%;
			text-align: center;
			/*border-bottom: 1px solid gainsboro;*/
			float: left;
			line-height: 50px;
			&.active{
				border-bottom-color: orange;
			}
		}
	}
	#getHelpLIst{
		height: 100%;
		min-width: 50px;
		position: absolute;
		right: 0;
		top: 0;
		background: white;
		line-height: 50px;
	}
	#helpList{
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		background: white;
		z-index: 10;
	}
	#waitHelp{
		width: 100%;
		min-height: 50px;
		color: white;
		position: absolute;
		top: 50px;
		left: 0;
		background-color: rgba(0,0,0,0.6);
		font-size: 16px;
		z-index: 1;
		p{
			height: 50px;
			line-height: 50px;
			padding-left: 20px;
		}
		a{
			color: white;
			position: absolute;
			right: 20px;
			top: 50%;
			margin-top: -15px;
			display: block;
			height: 30px;
			min-width: 50px;
			border-radius: 5px;
			background: #ff8d00;
			line-height: 30px;
			text-align: center;
		}
	}
	.onekey-help-sureHelp{
		position: absolute;
		bottom: 0;
		width: 100%;
		background: white;
		height: 60px;
		button#sureHelp{
			margin: 0;
			position: absolute;
			top: 50%;
			left: 5%;
			margin-top: -20px;
			width: 60%;
			height: 40px;
		}
		button#checkReson{
			margin: 0;
			position: absolute;
			top: 50%;
			left: 70%;
			margin-top: -20px;
			width: 40px;
			height: 40px; 
			min-width: 40px;
			font-size: 24px;
			background: white;
			line-height: 38px;
			border: 1px solid gainsboro;
			&.orangeBg{
				background: #ff8d00;
				color: white;
			}
		}
		button#callPhone{
			margin: 0;
			position: absolute;
			top: 50%;
			left: 85%;
			margin-top: -20px;
			width: 40px;
			height: 40px; 
			min-width: 40px;
			background: white;
			border: 1px solid gainsboro;
			color: gray;
			font-size: 28px;
		}
	}
	#help-map-container{
		position: absolute;
		top: 50px;
		bottom: 60px;
		width: 100%;
	}
	#checkHelpReson{
		box-sizing: border-box;
		width: 100%;
		height: 36%;
		position: absolute;
		bottom: 60px;
		background: white;
	}
	.checkHelpReson_checkBox{
		padding: 0 20px;
		height: 45%;
	}
	.checkBoxDiv{
		margin-bottom: 5px;
		width: 30%;
		float: left;
	}
	.checkBoxType{
		border-radius: 100%;
	}
	.photoAndVoive{
		width: 100%;
		height: 55%;
		position: absolute;
		bottom: 0;
		border-top: 1px solid gainsboro;
		padding: 5px 20px 0;
		.photoAndVoive_btn{
			position: absolute;
			bottom: 0;
			border-radius: 100%;
			height: 40px;
			min-width: 40px;
			background: white;
			border: 1px solid #ff8d00;
			text-align: center;
		}
		.showVoice{
			min-height: 30px;
			line-height: 30px;
		}
		#beginSpeak{
			right: 10px;
		}
		#takePicture{
			right: 60px;
			line-height: 32px;
		}
	}
	
	.showVoiceDiv{
		width: 120px;
		height: 120px;
		background-color: rgba(0,0,0,0.4);
		border-radius: 10px;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-top: -100px;
		margin-left: -50px;
		overflow: hidden;
		.showVoiceDiv_words{
			width: 100%;
			height: 30px;
			line-height: 30px;
			position: absolute;
			bottom: 0;
			font-size: 12px;
			text-align: center;
			color: white;
			filter: opacity(1);
			z-index: 5;
		}
	}
	#bgBlack{
		background: gainsboro;
	}
	#bgRed{
		background: lightcoral;
	}
	.photoAndVoive_span{
		display: inline-block;
		height: 30px;
		float: left;
	}
	#showVoiceSpan{
		background: #ff8d00;;
		display: inline-block;
		height: 30px;
		border-radius: 5px;
		max-width: 120px;
		min-width: 30px;
	}
	.positionAbs{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.positionAbsRight{
		position: absolute;
		text-align: center;
		box-sizing: border-box;
		right: 0;
		top: 0;
		min-width: 50px;
		height: 50px;
		padding-top: 3px;
	}
	.borderB{
		border-bottom: 1px solid gray;
	}
	.ft14{
		font-size: 16px;
	}
	.pl10{
		padding-left: 10px;
	}
	#hideHelpList{
		width: 50px;
		height: 50px;
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -25px;
		&:after{
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			bottom: 0;
			left: 50%;
			margin-left: -15px;
			border-top: 20px solid transparent;
			border-left: 15px solid transparent;
			border-right: 15px solid transparent;
			border-bottom: 20px solid gray;
		}
	}
	#sureCancel{
		width: 200px;
		height: 120px;
		position: fixed;
		left: 50%;
		top: 30%;
		margin-left: -100px;
		border-radius: 10px;
		background: white;
		z-index: 1;
		p{
			height: 80px;
			line-height: 80px;
			text-align: center;
		}
		button{
			min-width: 50%;
			float: left;
		}
	}
</style>