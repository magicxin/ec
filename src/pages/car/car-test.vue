<template>
	<section id="car-test">
		<!-- <appbar/> -->
		<!-- <content-with-loading :loaded="loaded" loadingText="正在检测，请稍候 ..."> -->
			<section class="sub-header">
				<circle-percent :percent="score">
					{{score}}分
				</circle-percent>
				<section class="wrapper">
					<p v-if="!!faultCount">检测到{{faultCount}}个故障</p>
					<p v-else>未检测到故障</p>
					<p class="test-time">{{testTime}}</p>
					<star-percent :percent="score"/>	
				</section>
				<section class="buttons-wrapper">
				<mu-raised-button secondary label="检测故障" @click="initData"/>
				<mu-flat-button class="clear-faults-button" v-if="!!faultCount" :class="[!faultCount ? 'disable' : '']" label="清除故障" @click="clearFault"/>					
				</section>
			</section>
			<section class="buttons">
				<router-link :to="{name:'terminal-data-flow-select'}">
					数据流
				</router-link>
<!-- 				<router-link class="has-sub-note" :to="{name:'terminal-file-update',query:{fileType:'ecu'}}">
					车辆标定<span class="sub-note">（ECU刷写）</span>
				</router-link> -->

				<router-link :to="{name:'terminal-file-update',query:{fileType:'ecu'}}">
					车辆标定
				</router-link>

				<router-link :to="{name:'terminal-params-update'}">
					参数编辑
				</router-link>
				<router-link :to="{name:'terminal-file-update'}">
					设备升级
				</router-link>


			</section>
			<mu-list>
			    <mu-list-item v-for="fault in faults" :title="fault.text" :key="fault" @click="activeFaultDetail(fault)">
			    	<section class="slot-right" slot="right">
					    <span class="fault" v-if="!!fault.count">{{fault.count}}</span>
					    <i class="check-right mu-icon material-icons" v-else>check_circle</i>
					    <i class="right-arrow mu-icon material-icons">keyboard_arrow_right</i>
			    	</section>
			    </mu-list-item>
			</mu-list>
		<!-- </content-with-loading> -->
	<mu-snackbar class="center" v-if="!!message" :message="message" action="我知道了" @actionClick="message=''" @close="message=''"/>
	<loading-spin v-if="clearingFaults">
		正在清除故障，请稍候...
	</loading-spin>
	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	// import MuFlatButton from 'muse-components/flatButton'
	// import MuRaisedButton from 'muse-components/raisedButton'
	// import MuSnackbar from 'muse-components/snackbar'
  	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  	import LoadingSpin from 'components/loading-spin'

	import CirclePercent from 'components/circle-percent'
	import StarPercent from 'components/star-percent'
	import carTestData from 'services/car-test-data'
	import carFaultsClear from 'services/car-faluts-clear'
	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			CirclePercent,
			StarPercent,
			// MuFlatButton,
			// MuSnackbar,
			// MuList,
			// MuListItem,
			LoadingSpin,
			// MuRaisedButton
		},
		data(){
			return {
				loaded:false,
				score:100,
				faultCount:0,
				testTime:'',
				message:'',
				faults:[],
				clearingFaults:false
			}
		},
		created(){
			console.log('created')
			this.initData()
		},
		watch:{
			'$route':function(to,from){
				console.log('router change')
				if(to.name=='car-test' && from.name!='article-show' && from.name!='car-test-detail' && from.name!='terminal-file-update' && from.name!='terminal-params-update' && from.name!='terminal-data-flow-select'){
					this.initData()
				}
			}
		},
		methods:{
			initData(){
				this.loaded=false
				this.clearingFaults=false
				carTestData({},(data,message,resultCode)=>{
					this.faultCount=data.falutCount
					this.testTime=data.testTime
					this.isHistory=data.isHistory
					this.faults=data.faults
					this.score=data.score
					this.message=message
					this.loaded=true
					if(this.isHistory){
						this.message='当前您的车辆处于熄火状态，为您展现上一次体检数据'
					}
				},(err)=>{
					this.message=err
				})
			},
			clearFault(){
				if(!!this.faultCount){
					this.clearingFaults=true
					carFaultsClear({},(data)=>{
						if(data.successCount){
							this.message='成功清除'+data.successCount+'个故障'
							this.faultCount-=data.successCount
							this.score=data.score || 100
							this.faults.forEach((fault)=>{
								fault.count=0
							})
						}else{
							this.faultCount=0
							this.score=100
							this.message='清除故障成功'
							this.faults.forEach((fault)=>{
								fault.count=0
							})
						}
						this.clearingFaults=false
					},(err)=>{
						this.message=err
						this.clearingFaults=false
					})
				}else{
					this.message='当前无故障，无需清除'
				}
			},
			activeFaultDetail(fault){
				if(fault.path){
					this.$router.push({name:'article-show',query:{articleUrl:fault.path,articlePageId:'',from:'car-test'}})					
				}else if(fault.routeName){
					this.$router.push({name:fault.routeName,query:{from:'car-test'}})					
				}
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#car-test{
		.sub-header{
			padding:$spaceMedium;
			background-color:#548CD1;
			// text-align:center;
		}
		.circle-percent{
			vertical-align:bottom;
		}
		.wrapper{
			display:inline-block;
			vertical-align:bottom;
			text-align:left;
			position:relative;
			bottom:-0.3rem;
			p{
				padding-left:0.7rem;
				color:#fff;
				font-weight:bold;
			}
			.test-time{
				font-size:1rem;
				font-weight:normal;
				color:rgb(230,230,230);		
			}
		}


		.sub-header .buttons-wrapper{
				margin:2rem auto 0;
				width:100%;
				display:flex;
				>*{
					flex:1;
					width:50%;
				}
				.mu-raised-button{
					background:#fff;
					color:#548CD1;
				}
			.mu-flat-button{
				// color:$colorSecondary;
				color:#fff;
				// border:solid 2px $colorSecondary;
				border:solid 2px #fff;
				line-height:2.6rem;
				&.disable{
					opacity:0.7;
				}
			}		
		}
		.buttons{
			border-bottom:solid 1px rgba(0,0,0,0.1);
			text-align:center;
			font-size:0;
			>*{
				display:inline-block;
				white-space:nowrap;
				width:25%;
				vertical-align:top;
				padding:1rem 0.5rem;
				height:60px;
				font-size:14px;
				border-right:solid 1px rgba(0,0,0,0.1);
				// background-color:$colorSecondary;
				background-color:#e2ecf7;
				// color:#fff;
				color:#568cce;
				line-height:65px; 
				background-size:30%;
				background-position:center 7px;
				background-repeat:no-repeat;
				&:nth-child(1){
					background-image:url(../../assets/icon_data_stream.png);
				}
				&:nth-child(2){
					background-image:url(../../assets/icon_file_update.png);
					
				}
				&:nth-child(3){
					background-image:url(../../assets/icon_edit.png);
					
				}
				&:nth-child(4){
					background-image:url(../../assets/icon_file_upload.png);
					
				}

				&:last-child{
					border:none;
				}
				&.has-sub-note{
					line-height:1.7;
				}
				.sub-note{
					font-size:1rem;
					color:#fff;
					opacity:0.7;
					display:block;
				}
			}
		}
		.mu-list{
			padding:0;
			.mu-item-right{
				width:5rem;
			}
			>*{
				border-bottom:solid 1px rgba(0,0,0,0.1);
				.slot-right{
					span,i{
						display:inline-block;
						vertical-align:middle;
						width:2rem;
						height:2rem;
						text-align:center;
						line-height:2rem;
						border-radius:2rem;
						&.fault{
							color:#fff;	
							background-color:#ff3333;
						}
						&.check-right{
							color:#99cc00;
						}
						&.right-arrow{
							text-align:right;
							position:relative;
							right:-1rem;
						}
					}
				}
			}
		}

	}
</style> 