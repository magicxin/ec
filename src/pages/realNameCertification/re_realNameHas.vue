<template>
  <div id="realNameHas">
    <icar-header main-text="实名认证" textColor="#474747" bgColor="#F7F7F7">
      <img :src="left" alt="">
    </icar-header>
    <div layout="row" layout-align="center center" class="has_box" v-if="status === '3'">
      <img :src="has" height="60px">
    </div>
    <div layout="row" layout-align="center center" class="has_box" v-if="status === '1'">
      <img :src="loading" height="60px">
    </div>
    <div layout="row" layout-align="center center" class="has_box" v-if="status === '2'">
      <img :src="wrong" height="60px">
    </div>
    <div class="divide"></div>
    <cells>
      <cell label="真实姓名" :link="false" :value="queryData.name">

      </cell>
      <cell :label="type" :link="false" :value="queryData.number">

      </cell>
      <cell label="证件信息" :link="false">
        <span slot="value" class="result" v-if="status === '3'">审核通过</span>
        <span slot="value" class="result loading" v-if="status === '1'">证件审核中</span>
        <span slot="value" class="result warn" v-if="status === '2'">审核未通过通过</span>
      </cell>
    </cells>

    <mu-flat-button label="重新认证" class="demo-flat-button" v-if="status === '2'" backgroundColor="rgb(251, 135, 19)" v-tap="{methods: getAuthAgain}" color="#FFF"/>
  </div>
</template>

<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import has from 'assets/realNameHas.png'
  import loading from 'assets/authLoading.png'
  import wrong from 'assets/authWrong.png'
  import cells from 'components/cells.vue'
  import cell from 'components/cell'


  export default {
    name: 're_realNameHas',
    data () {
      return {
        left,
        has,
        queryData: {},
        status: '',
        loading,
        wrong
      }
    },
    methods: {
      getAuthAgain () {
        this.$router.push({
          name: 'realName'
        })
      }
    },
    computed: {
      type () {
        switch (this.queryData.type) {
          case '0':
            return '身份证'
          case '1':
            return '驾驶证'
          case '2':
            return '护照'
          case '3':
            return '军官证'
          case '4':
            return '16岁一下户口簿'
        }
      }
    },
    beforeRouteEnter: (to, from, next) => {
      let status = to.query.type
      Vue.prototype.$.get({
        methodName: 'QueryCertification'
      }).then((resp) => {
        next(vm => {
          vm.status = status
          vm.queryData = resp.data.idCard
        })
      })
    },
    components: {
      icarHeader,
      cells,
      cell
    }
  }
</script>
<style>
  .has_box{
    height: 120px;
    background-color: #fff;
  }

  #realNameHas .warn{
    color: red;
    background-color: #fff;
  }

  #realNameHas .result{
    font-size: 1.1rem !important;
    color: #FBAD59;
  }

  #realNameHas .demo-flat-button{
    width: 80%;
    margin-left: 10%;
    margin-top: 60px;
  }

  #realNameHas .loading{
    color: #FBAD59;
  }

</style>
