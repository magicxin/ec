<template>
	<section id="terminal-file-update">
		<!-- <appbar :title="fileType=='ecu' ? '车辆标定（ECU刷写）' : '设备升级'" :link="{name:'car-test'}"/> -->
		<magic-header titleName="文件升级"></magic-header>
		<!-- <content-with-loading :loaded="loaded" :isDelay="isDelay"> -->
			<section v-if="fileName" :class="['net-file',loadingPercent==100 ? 'loaded' : '']">
				<!-- <mu-list-item :class="[loadingPercent==100 ? 'loaded' : '']" :title="fileName || '--'" @click="downloadFile"> -->
			      <!-- <mu-avatar :src="fileImg || defaultImg" slot="leftAvatar"/> -->
			      <!-- <mu-icon value="file_download" slot="right"/> -->
			    <!-- </mu-list-item> -->
			     <!-- <mu-divider/> -->
			     <section class="img-wrapper">
				     <img class="file-img" :src="fileImg || defaultImg" alt="file image">
				     <p style="padding:0;width:85%;padding-left:0.5rem;"><span>{{fileName || '暂无文件名'}}</span><span style="float:right;">{{loadingPercent==100 ? '已下载' : '未下载'}}</span></p>
			     </section>
			     <p><span>文件版本：</span>{{fileVersion || '暂无文件版本信息'}}</p>
			     <p><span>发布时间：</span>{{fileDate || '暂无文件发布时间'}}</p>
			     <p><span>资费情况：</span>{{fileMoney || '暂无资费信息'}}</p>
			     <p><span>文件大小：</span>{{fileSize || '暂无文件大小信息'}}</p>
			     <p><span>版本说明：</span>{{fileDescription || '暂无版本说明'}}</p>
				<mu-raised-button v-if="loadingPercent==100" label="使用下载的文件升级" class="submit" @click="submitFile" primary fullWidth/>
				<mu-raised-button v-if="loadingPercent!=100" label="下载文件" class="submit" @click="downloadFile" secondary fullWidth/>
			</section>
			<section v-else class="empty-note">
				<img :src="defaultImg" alt="">
				<p>暂无可用的网络文件~</p>
			</section>
<!-- 			<section :class="['local-file',localFileName ? 'local-file-selected' : '']">
				<section class="img-wrapper" v-if="localFileName">
				     <img class="file-img" :src="fileImg || defaultImg" alt=" file image">
				     <p style="padding:0;width:85%;padding-left:0.5rem;"><span>{{fileName || '暂无文件名'}}</span><span style="float:right">已选择</span></p>
			     </section>
				<mu-raised-button class="select-local-file submit" :label="localFileName ? '重新选择' : '选择本地文件'" @click="selectLocalFile" fullWidth/>
				<mu-raised-button v-if="localFileName" label="使用选择的文件升级" class="submit submit-local-file" @click="submitLocalFile" primary fullWidth/>
			</section> -->
		<!-- </content-with-loading> -->
	<loading-spin class="loading-message-loading-spin" v-if="!!loadingMessage" :fixed="true">
		{{loadingMessage}}
		<mu-raised-button v-if="loadingFile" label="取消下载" class="submit cancel-download" @click="cancelDownload" primary/>
		<!-- <mu-raised-button v-if="submitingFile" label="取消升级" class="submit cancel-submit" @click="cancelSubmit" primary/>							 -->
   	 </loading-spin>
	<mu-snackbar class="center" v-if="!!message" :message="message" action="我知道了" @actionClick="clearMessage" @close="clearMessage"/>

	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	import LoadingSpin from 'components/loading-spin'
  	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  	// import MuFlatButton from 'muse-components/flatButton'
  	// import MuRaisedButton from 'muse-components/raisedButton'
  	// import MuIcon from 'muse-components/icon'
  	// import MuSnackbar from 'muse-components/snackbar'
  	// import MuAvatar from 'muse-components/avatar'
  	// import MuDivider from 'muse-components/divider'
  	import defaultImg from 'assets/favicon.png'

  	import fileInfo from 'services/terminal-file-info'
  	import downloadFile from 'services/terminal-file-download'
  	import importLocalFile from 'services/terminal-file-local-import'
  	import submitFile from 'services/terminal-file-submit'

  	// import hybridRouter from 'settings/hybrid-router'

  	export default {
  		components:{
			magicHeader,
  			// Appbar,
  			// ContentWithLoading,
  			// LoadingSpin,
  			// MuList,
  			// MuListItem,
  			// MuSnackbar,
  			// MuAvatar,
  			// MuDivider,
  			// MuFlatButton,
  			// MuRaisedButton,
  			// MuIcon
  		},
  		data(){
  			return {
  				fileType:'',
	  			loaded:false,
	  			fileName:'',
	  			fileImg:'',
	  			fileVersion:'',
	  			fileDate:'',
	  			fileMoney:'',
	  			fileSize:'',
	  			fileDescription:'',
	  			submitSource:'',
	  			defaultImg:defaultImg,
	  			loadingFile:false,
	  			submitingFile:false,
	  			submitPercent:0,
	  			loadingPercent:0,
	  			message:'',
          isDelay : true,
	  			localFileName:''
  			}
  		},
  		computed:{
  			loadingMessage(){
  				if(this.loadingFile){
  					return '已下载'+this.loadingPercent+'%，请稍候 ...'
  				}
  				if(this.submitingFile){
  					return '总进度'+this.submitPercent+'%，'+(this.submitPercent<50 ? '文件传输中' : '升级中')+'，请稍候 ...'
  				}
  				return ''
  			}
  		},
  		created(){
  			this.initData()
  		},
  		beforeRouteLeave(to,from,next){
  			if(this.submitingFile){
  				this.message='当前升级未完成，请稍后。'
  			}else{
  				next()
  			}
  		},
  		watch:{
  			'$route':function(to,from){
  				if(to.name=='terminal-file-update'){
  					this.initData()
  				}
  				if(from.name=='terminal-file-update'){
  					if(this.loadingFile){
  						this.cancelDownload()
  					}
  					// if(this.submitingFile){
  					// 	this.cancelSubmit()
  					// }
  				}
  			}
  		},
  		methods:{
  			initData(){
  				this.fileType=this.$route.query.fileType
  				this.submitSource=''
	  			this.loaded=false
	  			this.fileName=''
	  			this.fileImg=''
	  			this.fileVersion=''
	  			this.fileDate=''
	  			this.fileMoney=''
	  			this.fileSize=''
	  			this.fileDescription=''
	  			this.loadingFile=false
	  			this.submitingFile=false
	  			this.submitPercent=0
	  			this.loadingPercent=0
	  			this.message=''

	  			this.localFileName=''

	  			fileInfo({type:this.fileType},(file)=>{
		  			this.fileName=file.fileName
		  			this.fileImg=file.fileImg
		  			this.fileVersion=file.fileVersion
		  			this.fileDate=file.fileDate
		  			this.fileMoney=file.fileMoney
		  			this.fileSize=file.fileSize
		  			this.fileDescription=file.fileDescription
		  			this.loaded=true
	  			},(err)=>{
	  				this.message=err
	  			})
  			},
  			downloadFile(){
  				if(this.loadingPercent!=100){
  					 this.loadingFile=true
  					 downloadFile.download({type:this.fileType},(progress)=>{
  					 	this.loadingPercent=progress.loadingPercent
		  				if(this.loadingPercent==100){
			  				this.loadingFile=false
			  				this.message='下载完成'
			  			}
  					 },(err)=>{
  					 	this.message=err
  					 })
  				}else{
  					this.message='您已下载文件。'
  				}
  			},
  			handleSubmitProgress(progress){
  				this.submitPercent=progress.submitPercent
	  			if(this.submitPercent==100){
	  				this.submitingFile=false
	  				this.message='升级完成，请重新发动车辆。'
	  			}
  			},
  			clearMessage(){
  				this.message=''
  				if(this.submitPercent==100){
					  // hybridRouter.back()
					  this.$.back()
  				}
  			},
  			submitFile(){
  				if(this.loadingPercent==100){
  					this.submitingFile=true
  					this.submitPercent=0
  					this.submitSource='net'
	  				submitFile.submit({type:this.fileType,source:this.submitSource},this.handleSubmitProgress,(err)=>{
	  					this.message=err
	  				})
  				}else{
  					this.message='请在文件下载完成后进行升级。'
  				}
  			},
  			selectLocalFile(){
  				importLocalFile({type:this.fileType},(file)=>{
  					this.localFileName=file.fileName
  				},(err)=>{
  					this.message=err
  				})
  			},
  			submitLocalFile(){
  				this.submitingFile=true
  				this.submitPercent=0
  				this.submitSource='local'
  				submitFile.submit({type:this.fileType,source:this.submitSource},this.handleSubmitProgress,(err)=>{
  					this.message=err
  				})
  			},
  			cancelDownload(){
  				this.loadingFile=false
  				this.loadingPercent=0
  				downloadFile.cancel({type:this.fileType})
  				this.message='您已中断下载'
  			},
  			cancelSubmit(){
  				this.submitingFile=false
  				this.submitPercent=0
  				submitFile.cancel({type:this.fileType,srouce:this.source})
  				this.message='您已中断升级'
  			}
  		}
  	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#terminal-file-update{
		.loaded{
			.img-wrapper p{
				color:$colorSecondary;
			}
		}
		.submit{
			margin-top:1.5rem;
			margin-bottom:2.5rem;
			&.submit-local-file{
				margin-top:-1.5rem;
			}
			&.disable{
				opacity:0.5;
			}
		}
		.img-wrapper{
			padding:1.2rem;
			padding-left:1.5rem;
			padding-bottom:0;
			img{
				width:12%;
			}
			> *{
				display:inline-block;
				vertical-align:middle;
			}
		}
		p{
			&:first-of-type{
				padding-top:1rem;
			}
			padding:0.5rem 1.5rem;
			line-height:1.5;
			word-break:break-all;
			span{
				font-weight:bold;
			}
		}
		.empty-note{
			text-align:center;
			padding:3rem 1rem;
		}
		.net-file,.empty-note{
			// border-bottom:solid 1px rgba(0,0,0,0.1);
		}
		.local-file{
			&.local-file-selected{
				border-top:solid 1px rgba(0,0,0,0.1);
			}
			.img-wrapper{
				margin-bottom:3rem;
			}
			.img-wrapper p{
				color:$colorSecondary;
			}
			.select-local-file{
				color:$colorSecondary;
				border:solid 2px $colorSecondary;
				margin-top:-1.5rem;
			}

		}
		.loading-spin{
			.mu-raised-button{
				display:block;
				margin:2rem auto;
				background:none;
				color:$colorSecondary;
				border:solid 2px $colorSecondary;
			}
		}
		.loading-message-loading-spin .spin-wrapper{
			height:150px;
		}
	}
</style>
