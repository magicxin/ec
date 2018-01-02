<template>
  <div id="login">
  	<div v-if="!isLogin">
  			<section class="sm_f">
		      <div class="border">
		      	<div class="img"><img :src="tel" class="tel"/></div>
		        <input type="tel" v-model="phone" placeholder="请输入用户名或手机号">
		        <!--<div :class="{'invalid': isInvalid, 'legal': !isInvalid }" @click="getCode()">{{ message }}</div>-->
		      </div>
		      <div class="border">
		      	<div class="img"><img :src="passwordImg"  class="pwd"/></div>
		        <input type="password" placeholder="请输入密码" v-model="password">
		      </div>
		    </section>
		    <!--<div class="forget-pwd">
		    	忘记密码
		    </div>-->
		    <div v-show="canTouchLogin" class="draw_btn login-btn" v-tap="{methods: login}">
		        <div>登录</div>
		    </div>
		    <div v-show="!canTouchLogin" class="draw_btn login-btn">
		        <div>登录</div>
		    </div>
		    <div class="draw_btn signup-btn"  v-tap="{methods: signup}">
		        <div>没有账号？立即注册</div>
		    </div>
  	</div>
    <div v-if="isLogin">
    		<div class="head-img">
    			<img :src="$.user&&$.user.headerUrl?$.user.headerUrl:head" />
    			<div class="head-nickname">{{$.user&&$.user.nickName?$.user.nickName:''}}</div>
    		</div>
    		<div  v-show="canTouchLogout" class="draw_btn login-btn"  v-tap="{methods:logout}">
	    		<div>退出</div>
		    </div>
		    <div v-show="!canTouchLogout" class="draw_btn login-btn">
		    		<div>退出</div>
		    </div>
    </div>
  </div>
</template>

<script>
	import Vue from 'vue'
	import tel from 'assets/tel.png'
	import head from 'assets/default_user_icon.png'
	import passwordImg from 'assets/password.png'
	import axios from 'axios'
  export default {
    data () {
      return {
      	tel:tel,
        password: null,
      	passwordImg:passwordImg,
        isInvalid: true,
        phone: this.$route.query.phoneNumber,
        message: '获取验证码',
        isLogin:this.$.userId,
        loginColor: '#ccc',
        validate:true,
        axios:axios,
        canTouchLogin:true,
        canTouchLogout:true,
        env: this.$.env,
        head:head,
        loginFrom:this.$.query('loginFrom'),
        routeParams:''
      }
    },
    methods: {
      signup () {
        this.$router.push({name:'signup'})
      },
      //  网页登录
      login(){
      	this.canTouchLogin = false
      	if(this.env === 'wxPublic'){
      		this.bindUserInfo()
      		return 
      	}
        if (!this.validate) {
          return;
        }
        let params = {
          userName: this.phone,
          userPwd: this.password,
          clientType: this.$.getClientType,
          methodName: 'Login',
          shopId: this.$.shopId
        };
        this.$.get(params)
          .then(res => {
            console.log(res.data.resultCode)
            this.posting = false;
            if (res.data.resultCode === '100') {
              this.$.editAttr('userId',res.data.userId)
//            this.$.editAttr('shopId',res.data.shop.id)
//						res.data.shop = {shop:this.$.shopId}
              Vue.prototype.setUserInfo(res.data)
              this.isLogin = this.$.userId
              this.$router.back()
//            else {
//             	console.log(this.$.userId)
//             	this.$router.push(this.routeParams)
//	            }
            } else{
              this.$.toast(res.data.errorMessage);
             }
            this.canTouchLogin = true
         })
        .catch(err => {
          this.posting = false;
//        this.refreshStatus();
        });
      },
      // 公众平台绑定登录
      bindUserInfo(){
      	const url = '/api/' + this.$.openid + '/bind.jhtml';
	      let params = {
	        userName: this.phone,
	        userPwd: this.password,
	        clientType: this.$.getClientType,
	        shopId: this.$.shopId,
	        wechatOpenId: this.$.state
	      };
//	      alert(JSON.stringify(params))
	      axios.post(url,params,{
			    timeout: 60000
				})
	        .then(res => {
	        	alert(JSON.stringify(res.data))
	        	if(res.data.resultCode === '100'){
	        		  Vue.prototype.setUserInfo(res.data)
		        		Vue.prototype.$.editAttr('userId',res.data.userId)
		        		this.$router.back()
		            this.isLogin = this.$.userId
		            
	        	}else{
	        		this.$.toast(res.data.errorMessage)
	        	}
//          if(this.routeParams){
//          	this.$router.push(this.routeParams)
//          }else{
//          	this.$router.back()
//          }
//          
						this.canTouchLogin = true
	        })
	        .catch(err => {
	          alert(err)
	        });
      },
      // 退出
      logout(){
      	this.canTouchLogout = false
      	axios.post(this.$.host+'/api/unbind.jhtml',{
      		clientType:this.$.getClientType,
      		"methodName" : "Unbind", 
      		"userId" : this.$.userId, 
		      "shopId" : this.$.shopId, 
		      "wechatOpenId" : this.$.state, 
		      "wechatUserOpenId" : this.$.openid
      	},{
			    timeout: 60000
				}).then(res=>{
					alert(JSON.stringify(res))
						Vue.prototype.setUserInfo(this.$.getAttr('initInfo'))
	          Vue.prototype.$.editAttr('userId','')
	          this.isLogin = this.$.userId
	          this.canTouchLogout = true
				}).catch(err=>{
					alert(err)
				})
      }
    },
    watch: {
      phone: function () {
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.phone))) {
          this.isInvalid = true
        } else {
//        this.$.toast('请输入正确的手机号')
					this.isInvalid = false
        }
      }
    },
    created(){
    	let data = this.$route.params.to
    	if(data){
    		this.routeParams = {name:data.name,params:data.params}
	    	this.$set(this.routeParams,'name',data.name)
	    	this.$set(this.routeParams,'params',data.params)
	    	console.log(this.routeParams)
    	}
    	
    }
    
//  mounted () {
//    console.log(this.$route)
//    document.title = '登录V服爱车'
//    if (this.phone) {
//      this.isInvalid = false
//      this.islogin = true
//      this.loginColor = '#f98700'
//    }
//  }
  }
</script>
<style>
  #login {
  	padding:1em;
    background-color: #ececec;
    position: relative;
    height:100vh;
  }
  #login input {
    padding: 0px 8px;
    outline: none;
    border: none;
  }
  #login input:focus {
    outline: none
  }
  #login .border {
  	display:flex;
  	align-items: center;
    padding : 6px;
    background:#fff;
    margin-bottom:1em;
  }
  #login .border .img {
  	display:flex;
  	justify-content: center;
  	flex:1 1 0;
  }
  #login .border input {
  	flex:10 1 0;
  }
  #login .draw_btn{
  	
  }
  .tel{
  	width:20px;
  	height:100%;
  }
  .pwd{
  	width:16px;
  	height:100%;
  }
  .forget-pwd{
  	color:#999;
  	text-decoration: underline;
  	margin-bottom:1em;
  }
  .draw_btn{
  	width:100%;
  	height:40px;
  	display:flex;
  	justify-content: center;
  	align-items: center;
  	color:#fff;
  	background:#f98700;
  	margin-bottom:1em;
  	border-radius: 5px;
  }
  .signup-btn{
  	color:#333;
  	background:#fff;
  	border:1px solid #999;
  }
  .head-img{
  	width:100%;
  	padding :2em;
  	display:flex;
  	flex-flow:column;
  	align-items: center;
  	justify-content: center;
  }
  .head-img img{
  	width:30vw;
  	height:30vw;
  	border-radius: 15vw;
  	border:1px solid #ececec;
  }
  .head-nickname{
  	padding:1em;
  }
</style>