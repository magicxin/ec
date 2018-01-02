<template>
  <div id="password">
    <div class="container" layout="row">
      <span flex class="one-word" v-for="item in maxLength">
        {{queryData.length >= item ? '●' : ''}}
      </span>
    </div>
    <a class="forget-password" @click="routeToBalanceSet">{{hasSetPassword ? '忘记密码?' : '设置密码'}}</a>
    <form action="" class="hidden-form">
      <!--<div class="cover"></div>-->
      <input type="number" v-model="queryData" id="password-input">
    </form>
  </div>
</template>

<script>
  /* eslint-disable */

  import Order from 'tools/order.service.js'
  let order = Order.getInstance()
  let active = 0
  export default {
    name: 'password',
    props: {
      maxLength: {
        type: Number,
        default () {
          return 6
        }
      }
    },
    methods: {
      routeToBalanceSet () {
        order.userBalancePay({})
        this.$.push('router_setPayPassword', null, () => {
          console.log('页面成功跳转')
        })
      }
    },
    mounted () {
      this.hasSetPassword = order.userBalancePay().hasSetPayPassword !== '0'
      let input = document.querySelector('#password-input')
      let el = document.querySelector('.container')
      el.addEventListener('click', (e) => {
        e.preventDefault()
        input.focus()
      })
      input.addEventListener('keyup', () => {
        let length = this.queryData.length
        if (length <= 6) {
          this.$emit('input', this.queryData)
        }
      })
    },
    data () {
      return {
        queryData: '',
        hasSetPassword: true
      }
    }
  }
</script>

<style>
  #password input {
    width: 1px;
    height: 1px;
    border: none;
    margin-left: 0px;
    text-align: center;
    outline: none;
    position: relative;
    border-right: 1px solid #ccc;
    opacity: 0;
    color: transparent;
    top: -60px;
    left: 1px;
    text-shadow: 0 0 0 #000;
    /*font-size: 0px;*/
  }

  #password input:last-child {
    border-right: none;
  }

  .forget-password{
    float: right;
    z-index: 99;
  }

  #password .hidden-form{
    opacity: 0;
    height: 0px;
    width: 10px;
  }

  #password {
    padding-left: 0px;
    width: auto;
  }

  #password .one-word {
    display: inline-block;
    height: 30px;
    width: 30px;
    border: 1px solid #ccc;
    border-right: none;
  }

  #password .one-word:last-child{
    border-right: 1px solid #ccc;
  }
</style>
