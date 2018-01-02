
<template>
  <div id="attend">
    <my-header main-text="确认报名" bg-color="#F7F7F7" text-color="#000">
      <img :src="left">
    </my-header>
    <div class="detail">
      <h2>{{ activeDetail.title }}</h2>
      <p>{{ activeDetail.beginDate }}</p>
      <p>{{ activeDetail.address }}</p>
    </div>
    <form>
      <div class="info">
        <h2>确认信息</h2>
        <!-- <div>
          <mu-row>
            <mu-col width="32"><span>姓名：</span></mu-col>
            <mu-col width="65"><input value="queryData.name" v-model="queryData.name"/></mu-col>
          </mu-row>
        </div>
        <div>
          <mu-row>
            <mu-col width="32"><span>电话：</span></mu-col>
            <mu-col width="65"><input v-model="queryData.mobile"/></mu-col>
          </mu-row>
        </div>
        <div>
          <mu-row>
            <mu-col width="32"><span>车牌号：</span></mu-col>
            <mu-col width="65"><input v-model="queryData.platenumber"/></mu-col>
          </mu-row>
        </div> -->
        <div>
          <mu-row v-for="(item,index) in optionsData" :key="index">
            <mu-col width="32"><span>{{item.content}}：</span></mu-col>
            <mu-col width="65"><input v-model="item.value"/></mu-col>
          </mu-row>
        </div>
      </div>
    </form>
    <full-button v-tap="{methods: submit}" name="确认"></full-button>
  </div>
</template>

<script>
	import Vue from 'vue'
  import myHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import fullButton from 'components/button/full_button'



  export default {
    data () {
      return {
        left,
        queryData: {},
        activeDetail: {},
        optionsData: [],
      }
    },
    created(){
    	this.$.get({
    		methodName:"Index",
    		userId: this.$.userId
    	}).then(resp=>{
    		if (resp.data.resultCode === '100'){
    			let userInof = {};
    			userInof.name = resp.data.nickName;
    			userInof.mobile = resp.data.mobile;
    			userInof.platenumber = resp.data.carPlateNumber;
    			this.queryData = Object.assign({},userInof);
    		}
    	})
    },
    methods: {
      goBack () {
        this.$router.push({
          name: 'active_detail'
        })
      },
      submit () {
        // 表单验证
        // if (!this.queryData.name) {
        //   this.$.toast('请输入姓名')
        //   return
        // }
        // if (!this.queryData.mobile) {
        //   this.$.toast('请输入电话')
        //   return
        // }
        // if (this.queryData.mobile) {
        //   if (!isNaN(this.queryData.mobile) && this.queryData.mobile.length !== 11) {
        //     this.$.toast('请输入正确的电话')
        //     return
        //   }
        // }
        // if (!this.queryData.platenumber) {
        //   this.$.toast('请输入车牌号')
        //   return
        // }
        // 遍历从后台获取到
        let optionData = {}
        let isInvaild = false
        
        this.optionsData.some(val => {
          if (!val.value) {
            isInvaild = val.content
            return
          }
          optionData[val.id] = val.value
        })
        if (isInvaild) {
        	this.$.toast('请输入' + isInvaild)
          console.log(isInvaild)
          return
        }
        this.$.get({
          methodName: 'JoinFleetActivity',
          activityId: this.activeDetail.id,
          name: this.queryData.name,
          mobile: this.queryData.mobile,
          platenumber: this.queryData.platenumber,
          option: optionData
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.$router.go(-1)
          } else {
            this.$.toast(resp.data.errorMessage)
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryFleetActivity',
        activityId: to.params.activeId
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          next(vm => {
            vm.activeDetail = resp.data.fleetActivityData
            vm.optionsData = resp.data.fleetActivityData.options.map(val => {
              val.value = null
              return val
            })
          })
        }
      })
    },
    components: {
      myHeader,
      fullButton
    }
  }
</script>

<style>
  #fullButton{
    position: absolute;
    bottom: 0;
  }
  #attend {
    position: relative;
  }
  #attend .mu-icon {
    font-size: 24px;
  }
  #attend .detail {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 15px;
  }
  #attend .detail>h2 {
    color: #393939;
  }
  #attend .detail>p {
    padding-top: 12px;
    font-size: 15px;
    color: #B1B1B1;
  }
  #attend .mu-raised-button {
    position: fixed;

  }
  #attend .info {
    height: calc(100vh - 161px);
    background-color: #fff;
    padding: 15px 15px 15px 0px;
  }
  #attend .info>h2 {
    color: #393939;
    padding-bottom: 10px;
    padding-left: 15px;
  }
  #attend .info>div>.row {
    padding-top: 16px;
    padding-left: 15px;
  }
  #attend .info>div>.row>.col-32 {
    font-size: 16px;
    padding-top: 6px;
  }
  #attend .info>div>.row>.col-65>input {
    border-radius: 5px;
    border: solid 1px #C7C7C9;
    background-color: #EFEFF4;
    padding-left: 15px;
    font-size: 16px;
  }
</style>