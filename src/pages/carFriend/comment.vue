<template>
	<div class="comment">
		<magic-header titleName="评论">
			<div :class="content?'submit-btn':'cant-btn'" slot="title-right" v-tap="{methods:submitComment}">
				发送
			</div>
		</magic-header>
		<div class="content">
			<textarea v-model="content" placeholder="说点什么吧" maxlength="50"></textarea>
		</div>
	</div>
</template>
<script>
	import magicHeader from 'components/magicHeader'
	export default {
		name: 'comment',
		data() {
			return {
				id:'',
				content:''
			}
		},  // 截取日期字符串
		components:{magicHeader},
		methods: {
	     	submitComment(){
	     		this.$.get({
		          methodName: 'CreateSpaceComment',
		          content: this.content,
		          spaceId: this.id
		        }).then(resp => {
		          if (resp.data.resultCode === '100') {
//		            this.$router.push({
//		            		name:'community',
//		            		params:{
//		            			count:true
//		            		}
//		            	})
   					this.$router.back()
		          }
		        })
	     	}
		},
		created(){
			this.id = this.$route.params.id
			console.log(this.$route)
		}
	}
</script>

<style scoped>
	.comment{
		height:100%;
		background:#fff;
	}
	textarea {
    padding: 10px;
    font-size: 16px;
    line-height: 24px;
    border: none;
    resize: none;
    outline: none;
    width:calc(100% - 20px);
    height:calc(100vh - 74px);
  }
  textarea.active {
    border: none;
  }
  textarea.focus {
    border: none;
  }
  
</style>