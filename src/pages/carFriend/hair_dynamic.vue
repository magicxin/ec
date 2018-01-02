<template>
	<div class="container">
		<form>
			<ma-header titleName="话题讨论">
				<div slot="title-right">
					<div :class="queryData.content?'submit-btn':'cant-btn'" slot="title-right" v-tap="{methods:submit}">
						发送
					</div>
				</div>
			</ma-header>
			
			<div class="content">
				<textarea v-model="queryData.content" placeholder="说点什么吧"></textarea>
				<div>
					<span v-for="(item, index) in imgList" class="content-img img-container">
		               <mu-icon value="close" v-tap="{methods: cancelUploadByIndex, index: index}"></mu-icon>
		               <img :src="item.data" :height="imgHeight" :width="imgWidth">
		            </span>
					<img class="upImg" v-tap="{methods: upload}" v-show="imgList.length < 6" src="../../assets/add-img.png" :height="imgHeight" :width="imgWidth">
				</div>
			</div>
		</form>
	</div>
</template>
<script>
	import maHeader from 'components/magicHeader'
	let cache = {}
	export default {
		name: 'magic-audio',
		data() {
			return {
				screenWidth: window.screen.width,
				queryData: {
					methodName: 'CreateSpace',
					content: '',
					images: [],
					position: '',
					topics: [this.$route.params.topicId]
				},
				conLength: '',
				imgList: []
			}
		},
		components:{maHeader},
		computed: {
			imgWidth() {
				let width = (this.screenWidth - 28) * 0.33 - 4
				return width
			},
			imgHeight() {
				return this.imgWidth
			}
		},
		created() {
				
		},
		methods: {
			cancel() {
				this.imgList = []
				this.queryData.content = '#' + _tit + '#'
				this.queryData.images = []
			},
			upload() {
				let maxLength = 6
				if(this.imgList.length >= maxLength) {
					this.$.toast(`您最多可以选择${maxLength}张图片`)
					return
				}
				this.$.push('router_takePhoto', {
					maxNum: maxLength - this.imgList.length
				}, (resp) => {
					try {
						resp = JSON.parse(resp)
						resp.forEach(val => {
							if(this.imgList.length < maxLength) {
								this.imgList.push(val)
								if(!cache[val.type]) {
									cache[val.type] = []
								}
								cache[val.type].push(val.data)
							}
						})
					} catch(e) {
						window.alert(e)
					}
				})
			},
			submit() {
				let promises = []
				for(let name in cache) {
					if(cache[name].length > 0) {
						promises.push(
							this.$.postFileByFormData({
								type: '.' + name,
								data: cache[name]
							})
						)
					}
				}
				if(promises.length > 0) {
					Promise.all(promises).then(([result]) => {
						console.log(result)
						try {
							// 之后就是将新上传的照片拼接回来就好了
							this.queryData.images = result && this.queryData.images.concat(result.urls)
							this.$.get({
								methodName: 'CreateSpace',
								content: encodeURIComponent(this.queryData.content.split('#')[2]),
								position: this.queryData.position,
								images: this.queryData.images,
								topics: [this.$route.params.topicId]
							}).then(resp => {
								if(resp.data.resultCode === '100') {
									cache = {}
									this.dynamicList = []
									pageable.pageNumber = 0
									this.getDetail()
									this.isShow = true
									this.imgList = []
									this.queryData.content = '#' + _tit + '#'
									this.queryData.images = []
								}
							}, (err) => {
								window.alert(err)
							})
						} catch(e) {
							window.alert(e)
						}
					})
				} else {
					this.$.get({
						methodName: 'CreateSpace',
						content: encodeURIComponent(this.queryData.content.split('#')[2]),
						position: this.queryData.position,
						images: this.queryData.images,
						topics: [this.$route.params.topicId]
					}).then(resp => {
						if(resp.data.resultCode === '100') {
							this.$router.back()
						}
					})
				}
			},
			cancelUploadByIndex(params) {
				let index = params.index
				let whichToSplice = this.imgList.splice(index, 1)[0]
				try {
					let type = whichToSplice.type
					let cancelIndex = cache[type].indexOf(whichToSplice.data)
					cache[type].splice(cancelIndex, 1)
				} catch(e) {
					window.alert(e)
				}
			},
		}
	}
</script>

<style scoped>
	.container.border_bottom {
		border-bottom: 1px solid #929292;
	}
	
	.container {
		background-color: #F7F7F7;
		min-height: 50px;
		position: fixed;
		top: 0px;
		/*line-height: 50px;*/
		width: 100%;
		z-index: 2;
	}
	
	.container .header-right-img {
		width: 50px;
		line-height: 50px;
	}
	
	.container .header-content {
		text-align: center;
		font-size: 1.6rem;
		line-height: 50px;
	}
	
	.container .mu-flat-button {
		position: relative;
		top: 8px;
		left: -15px;
		font-size: 16px;
	}
	
	.container .icon-left {
		position: relative;
		top: 0px;
		left: 8px;
		font-size: 23px;
	}
	
	.container .mu-flat-button.disSend {
		position: relative;
		top: 10px;
		right: 30px;
		height: 30px;
		min-width: 30px;
		font-size: 13px;
		color: #B9B9B9;
		background-color: #F7F7F7;
	}
	
	.container .mu-flat-button.send {
		position: relative;
		top: 10px;
		right: 30px;
		height: 30px;
		min-width: 30px;
		font-size: 13px;
		background-color: #F7F7F7;
		color: #F98700;
	}
	
	.container .left {
		padding-left: 10px;
		line-height: 50px;
	}
	
	.container .content {
		background-color: #fff;
	}
	
	.container .content textarea {
		padding: 10px;
		font-size: 16px;
		line-height: 24px;
		border: none;
		resize: none;
		outline: none;
		overflow: auto;
		width: 100%;
		height: 150px;
	}
	
	.container .content textarea.active {
		border: none;
	}
	
	.container .content textarea.focus {
		border: none;
	}
	
	.container .upImg {
		display: inline-block;
		margin-left: 10px;
	}
	
	.container .content-img {
		display: inline-block;
		margin-left: 10px;
		margin-bottom: 10px;
		position: relative;
	}
	
	.container .mu-icon {
		position: absolute;
		color: #fff;
		border: 1px solid #BDBEC0;
		background-color: #BDBEC0;
		background-color: rgba(0, 0, 0, 0.2);
		left: 78%;
		opacity: 0.7;
	}
	
	.container .content-img img {
		object-fit: cover;
	}
</style>