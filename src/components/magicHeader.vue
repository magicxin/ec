<template>
	<div class="header-container" v-if="!hide">
		<div class="header-fix">
			<div class="left" v-tap="{methods:goBack,native:returnNative}">
				<img v-if="!hideReturn" :src="leftReturn" class="left-return" />
			</div>
			<div class="middle" v-if="titleName !== ''">{{titleName}}</div>
			<!--  在标题是tab栏的时候隐藏名称 -->
			<slot name="title-middle" class="title-middle"></slot>
			<div class="right">
				<slot name="title-right"></slot>
				<div v-if="isEve" class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow">
					<img src="../assets/eve_share.svg" class="badgeImg" @click="shareActivity">
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import leftReturn from 'assets/left-gray.svg'
	export default {
		name:'magic-header',
		data() {
			return {
				hide:false
			}
		},
		props: {
			hideReturn:{
				type:Boolean,
				default(){
					return false
				}
			},
			titleName: {
				type: String,
				required: false,
				default() {
					return "V服爱车"
				}
			},
			leftReturn: {
				type: String,
				required: false,
				default() {
					return leftReturn
				}
			},
			returnNative:{
				type:Boolean,
				required:false,
				default(){
					return false
				}
			},
			isEve:{
				stpe:Boolean,
				required:false,
				default(){
					return false
				}
			}
		},
		methods: {
		//返回机制：若returnNative传了一个true值，会使用桥接的back 这里需要在相应的auth下配置native为true，并且在首位导航判断search。
			goBack(params) {
				if(params.native){
					this.$.back()
				}else{
					this.$router.back()
				}
			},
			// 活动分享

			shareActivity () {
				if(this.$.userId){
					let url = document.location.hash.slice(1, document.location.hash.length)
					let shareThumImage = '/upload/image/default_user_icon.png'
					this.$.push('route_share', {
						shareTitle: this.titleName,
						shareContent: '活动好精彩，快来参加吧~',
						shareThumImage: shareThumImage,
						shareType: '9',
						needOAuth: '0',
						shareUrl: url,
						shareId: url.split('/')[2]
					})
				}else{
					this.$.goLogin({
						shopId: this.shop.id
					})
				}
			}
		},
		created(){
			if(this.isEve){
				setTimeout(() => {
//					console.log(this.shop)
					// 判断是否在微信，如果在微信 调用分享接口，返回数据覆盖微信自定义的分享
					if (this.$.isWechat) {
					if(this.$.env === 'wxPublic'){
						return
					}else{
						this.$.get({
						methodName: 'CreateStaticPath',
						shareType: '9',
						shareFuncName: '近期活动',
						needOAuth: '1',
						id: this.$route.params.activityId,
						shareWay: '1',
						title: this.mainText,
						content: '活动好精彩，快来参加吧~',
						image: this.shareThumImage,
						path: document.location.hash.slice(1, document.location.hash.length),
						shopId: this.shop.id
						}).then(res => {
							
						})
					}
					}
				}, 500)
			}
		}
	}
</script>

<style scoped>
	.header-container{
		width:100%;
		height:50px;
	}
	.header-fix {
		position: fixed;
		width: 100%;
		height: 50px;
		display: flex;
		border-bottom: 1px solid #929292;
		background-color: #F7F7F7;
		z-index: 100;
	}
	
	.left,
	.right,
	.middle {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.left {
		width: 50px;
	}
	
	.right {
		width: 50px;
	}
	
	.middle {
		width: calc(100% - 100px);
		font-size:20px;
	}
	
	.left-return {
		width: 24px;
	}
	.submit-btn{
	  	background:#f98700;
	  	color:#fff;
	  	padding:4px 10px;
	  	border-radius: 4px;
	}
	.cant-btn{
		color:#999;
		border:1px solid #999;
		padding:4px 10px;
	  	border-radius: 4px;
	}
	.badgeImg {
		position: absolute;
		top: 9px;
		width: 30px;
		right: 10px;
	}
</style>