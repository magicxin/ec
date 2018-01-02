
<template>
  <div class="smart-message">
    <div class="smart-img-container">
    	<img class="smart-img" :src="smartImg"/>
    </div>
    <div class="smart-message-container">
    	<div class="to-do-content row">
    			<div class="img-container">
    					<img :src="toDoMsg" />
		    	</div>
		    	<div v-if="initData.name">
		    			待办内容：客户接待，{{initData.plateNumber}}客户，{{initData.name}}{{initData.gender}}到店时间 {{initData.accessTime}}
		    	</div>
		    	<div v-else>
		    			待办内容：客户接待，{{initData.plateNumber}}客户，先生/女士到店时间 {{initData.accessTime}}
		    	</div>
    	</div>
    	<div class="to-do-time row">
    			<div class="img-container">
    					<img :src="timer" />
		    	</div>
		    	<div>
		    			待办时间：{{initData.accessTime}}
		    	</div>
    	</div>
    </div>
    <div class="btn-container">
    			<input v-if="initData.isConfirm == true" class="useless-btn" type="button" value="确定" />
    			<input v-else class="btn" type="button" value="确定" @click="catchOrder" />
    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import smartImg from 'assets/smart-message.png'
  import timer from 'assets/timer.png'
  import toDoMsg from 'assets/need-to-do.png'


  export default {
    name: 'eve_smart_message',
    data() {
      return {
       	smartImg:smartImg,
       	toDoMsg:toDoMsg,
       	timer:timer,
       	initData:'',
       	touch:true
      }
    },
    created() {
      this.initData = this.$route.params.initData
      this.initData.gender = 'male'?'先生':'女士'
      console.log(this.initData)
    },
    mounted() {

    },
    beforeRouteEnter(to,from,next){
    	let $ = Vue.prototype.$
    	console.dir(to)
    	$.get({
         "clientType": $.getClientType,
         "methodName": "QueryAccessInfo",
         "id": $.query('id')
      }).then((res) => {
         console.dir(res)
         to.params.initData = res.data
          next()
      })
    },
    methods: {
     catchOrder(){
     	var that = this
     	  if(this.touch == true){
     	  	  this.touch = false
     	  		this.$.get({
		         "clientType": this.$.getClientType,
		         "methodName": "ConfirmReception",
		         "userId": this.$.query('userId'),
		         "id": this.$.query('id')
		      }).then((res) => {
		          if(res.data.resultCode){
		          	this.initData.isConfirm = true
		          	this.$.toast(res.data.errorMessage)
		          }else{
		          	this.touch = true
		          }
		      })
     	  }
     }
    }
  }


</script>
<style>
  .smart-message{
  	width:100%;
  	height:100%;
  	background:#f1f1f5;
  	font-size:14px;
  }
  .smart-img-container ,.smart-message-container{
  	background:#fff;
  }
  .smart-img{
  	width:100%;
  }
  .smart-message-container{
  	width:100%;
  	display:flex;
  	flex-flow:column;
  	padding:2em;
  	margin-top:10px;
  	line-height:28px;
  }
  .smart-message .row {
  	display:flex;
  	flex-flow:row;
  	justify-content: flex-start;
  	padding:4px;
  }
  .to-do-content,.to-do-time{
  	align-items: flex-start;
  }
  .img-container{
  	width:24px;
  	height:24px;
  	margin-right:1em;
  	margin-top:4px;
  }
  .img-container img {
  	height:100%;
  }
  .btn-container {
  	position:absolute;
  	bottom:2em;
  	width:100%;
  	display:flex;
  	justify-content: center;
  }
  .smart-message .btn{
  	background:#F98700;
  	padding:0 2em;
  	border:none;
  	border-radius: 15px;
  	color:#fff;
  	outline: none;
  }
  .smart-message .useless-btn{
  	background:#999;
  	padding:0 2em;
  	border:none;
  	border-radius: 15px;
  	color:#fff;
  	outline: none;
  }
</style>
