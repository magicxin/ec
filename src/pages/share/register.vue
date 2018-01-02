<template>
  <div id="register">
    <section class="sm_f">
      <img src="../../assets/register.jpg" alt="" width="100%">
      <div class="border">
        <span>手机号</span>
        <input type="tel" class="sm_f" v-model="phone" placeholder="仅支持中国大陆手机">
        <button :class="{'invalid': isInvalid, 'legal': !isInvalid }" @click="getCode()">{{ message }}</button>
      </div>
      <div class="border">
        <span>验证码</span>
        <input type="tel" class="sm_f" placeholder="请输入验证码" v-model="code">
      </div>
    </section>
    <div class="draw_btn">
        <mu-raised-button label="注册" :backgroundColor="registerColor" :fullWidth="isTrue" v-tap="{methods: register}"/>
    </div>
  </div>
</template>
<style>
  #register {
    background-color: #fff;
    min-height: 667px;
    position: relative;
  }
  #register input {
    padding: 0px 4px;
    outline: none;
    border: none;
  }
  #register input:focus {
    outline: none;
  }
  #register .border {
    margin: 0px 15px;
    border-bottom: 1px solid #dcdcdc;
    padding: 6px 0px;
  }
  #register .invalid {
    padding: 8px;
    border: none;
    color: #929292;
  }
  #register .legal {
    padding: 8px;
    border: none;
    background-color: #f98700;
    color: #fff;
  }
  #register .draw_btn {
    width: 88%;
    margin: auto;
    margin-top: 20px;
  }
  #register .draw_btn button {
    font-size: 16px;
  }
</style>
<script>




  export default {
    data () {
      return {
        isInvalid: true,
        phone: null,
        message: '获取验证码',
        isTrue: true,
        registerColor: '#ccc',
        isRegister: false,
        code: null,
        serCode: ''
      }
    },
    methods: {
      getCode () {
        if (!this.isInvalid) {
          this.isInvalid = true
          this.isRegister = true
          this.registerColor = '#f98700'
          // 获取验证码
          main.base({
            methodName: 'SendValidateCode',
            phoneNumber: this.phone,
            type: '0'
          }).then(res => {
            if (res.data.resultCode === '201') {

            } else if (res.data.resultCode === '100') {
              this.serCode = res.data.validateCode
              let time = 60
              let countDown = setInterval(() => {
                this.message = '重新发送' + time
                time--
                if (time === 0) {
                  clearInterval(countDown)
                  this.isInvalid = false
                  this.message = '获取验证码'
                }
              }, 1000)
            }
          })
        } else {
          console.log('不能点')
        }
      },
      register () {
        if (this.isRegister) {
          /* eslint-disable  */
          if (this.serCode == this.code) {
            main.base({
              methodName: 'QuickLogin',
              phoneNumber: this.phone,
              id: this.$route.params.activityId,
              type: '0',
              inviterId: this.$route.params.id,
              inviteWay: this.$route.params.inviteWay
            }).then(res => {
              if (res.data.resultCode === '100') {
                this.$router.push({name: 'register_success'})
              }
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
