<template>
  <div id="signup">
    <section class="sm_f">
      <div class="border">
        <span>手机号</span>
        <input type="tel" class="sm_f" v-model="phone" placeholder="输入手机号码">
        <div :class="{'invalid': isInvalid || getCodeEnd  , 'legal': !isInvalid && !getCodeEnd }" v-tap="{methods:getCode}">{{ message }}</div>
      </div>
      <div class="border">
        <span>验证码</span>
        <input type="tel" class="sm_f" placeholder="输入验证码" v-model="code">
      </div>
    </section>
    <div class="draw_btn login-btn" v-tap="{methods: signup}">
		    <div>注册</div>
		</div>
  </div>
</template>

<script>
	import Vue from 'vue'
  export default {
    data () {
      return {
        isInvalid: true,
        phone: null,
        message: '获取验证码',
        isTrue: true,
//      signupColor: '#ccc',
        issignup: false,
        code: null,
        serCode: '',
        getCodeEnd:false,
        canTouchSign:true
      }
    },
    methods: {
      getCode () {
        if (!this.isInvalid && !this.getCodeEnd) {
          this.isInvalid = true
          this.issignup = true
          this.getCodeEnd = true
          // 获取验证码
          this.$.get({
            methodName: 'SendValidateCode',
            phoneNumber: this.phone,
            type: '0'
          }).then(res => {
          	if(res.data.resultCode === '201'){
          		this.$.toast(res.data.errorMessage)
                  this.getCodeEnd = false
          	}
            if (res.data.resultCode === '100') {
              this.serCode = res.data.validateCode
              let time = 60
              let countDown = setInterval(() => {
                this.message = '重新发送' + time
                time--
                if (time === 0) {
                  clearInterval(countDown)
                  this.isInvalid = false
                  this.getCodeEnd = false
                  this.message = '获取验证码'
                }
              }, 1000)
            }
          })
        } else {
          console.log('不能点')
        }
      },
      signup () {
        if (this.issignup && this.canTouchSign) {
          /* eslint-disable  */
         this.canTouchSign = false
         console.log(this.serCode)
         console.log(this.code)
          if (this.serCode == this.code) {
            this.$.get({
              methodName: 'QuickLogin',
              phoneNumber: this.phone,
              weixinOpenId: this.$.openid,
              clientType: this.$.getClientType
            }).then(res => {
            	if (res.data.resultCode == '278') {
            		Vue.prototype.setUserInfo(res.data)
		        	Vue.prototype.$.editAttr('userId',res.data.userId)
            		this.$router.push({name: 'setPassword'})
               }
              if (res.data.resultCode == '100') {
                Vue.prototype.setUserInfo(res.data)
                this.$router.push({name: 'setPassword'})
              }else{
              	this.issignup = false
              	this.$.toast(res.data.errorMessage)
              }
              this.canTouchSign = true
            })
          } else {
            this.$.toast('验证码不正确')
          }
        }
      }
    },
    watch: {
      phone: function () {
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(this.phone))) {
          this.isInvalid = true
        } else {
          this.isInvalid = false
        }
      }
    },
    mounted () {
      document.title = '注册V服爱车'
    }
  }
</script>

<style>
  #signup {
  	padding:1em;
    background-color: #ececec;
    position: relative;
    height:100vh;
  }
  #signup input {
    padding: 0px 8px;
    outline: none;
    border: none;
  }
  #signup input:focus {
    outline: none
  }
  #signup .border {
  	display:flex;
  	align-items: center;
    padding : 6px;
    background:#fff;
    margin-bottom:1em;
  }
  #signup .tel{
  	width:20px;
  	height:100%;
  }
  #signup .draw_btn{
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
  #signup .invalid{
  	padding: 8px;
    border: none;
    color: #929292;
    background-color: #ececec;
    border-radius: 4px;
  }
  #signup .legal {
    padding: 8px;
    border: none;
    background-color: #f98700;
    color: #fff;
    border-radius: 4px;
  }
</style>