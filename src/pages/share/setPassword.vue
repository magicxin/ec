<template>
  <div id="setPassword">
    <section class="sm_f">
      <div class="border">
        <span>输入密码</span>
        <input class="sm_f" v-model="oncePwd" placeholder="输入密码">
      </div>
      <div class="border">
        <span>确认密码</span>
        <input class="sm_f" placeholder="确认密码" v-model="twicePwd">
      </div>
    </section>
    <div class="draw_btn login-btn" v-tap="{methods: setPassword}">
		    <div>确定</div>
		</div>
  </div>
</template>

<script>
	import axios from 'axios'
  export default {
    data () {
      return {
        oncePwd:'',
        twicePwd:'',
        isFilter:true,
        isTouch:false
      }
    },
    methods: {
      setPassword () {
      	let that = this
      	if(this.isTouch){
      		return
      	}else{
      		this.isTouch = true
      	}
        if(this.isFilter){
        	if(this.oncePwd === this.twicePwd){
        		alert(JSON.stringify(this.getUserInfo()))
        		let params = Object.assign({},this.getUserInfo(),{
		        			"clientType":this.getClientType,
		        			"methodName": "UpdateUserInfo",
		        			"userPwd" : this.oncePwd,
		        			"userNewPwd" : this.oncePwd
		      	})
        		
        		alert(JSON.stringify(params))
        		this.$.get(params)
        		.then(res=>{
        			alert(JSON.stringify(res.data.resultCode))
        			if(res.data.resultCode === '100'){
        				//绑定
            		const url = '/api/' + this.$.openid + '/bind.jhtml';
				      let params = {
				        userName: this.getUserInfo().mobile,
				        userPwd: this.oncePwd,
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
					        	this.$.toast('设置成功！')
			        			setTimeout(function(){
			        				that.$router.push({name:'login'})
			        			},1000)
				        	}else{
				        		this.$.toast(res.data.errorMessage)
				        	}
				        })
				        .catch(err => {
				          alert(err)
				        });
        			}else{
        					this.$.toast(res.data.errorMessage)
        			}
        		})
        		.catch(res=>{
        			alert(JSON.stringify(res))
        		})
        	}
        }
      }
    }
  }
</script>

<style>
  #setPassword {
  	padding:1em;
    background-color: #ececec;
    position: relative;
    height:100vh;
  }
  #setPassword input {
    padding: 0px 8px;
    outline: none;
    border: none;
  }
  #setPassword input:focus {
    outline: none
  }
  #setPassword .border {
  	display:flex;
  	align-items: center;
    padding : 6px;
    background:#fff;
    margin-bottom:1em;
  }
  #setPassword .tel{
  	width:20px;
  	height:100%;
  }
  #setPassword .draw_btn{
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
  #setPassword .invalid{
  	padding: 8px;
    border: none;
    color: #929292;
    background-color: #ececec;
    border-radius: 4px;
  }
  #setPassword .legal {
    padding: 8px;
    border: none;
    background-color: #f98700;
    color: #fff;
    border-radius: 4px;
  }
</style>