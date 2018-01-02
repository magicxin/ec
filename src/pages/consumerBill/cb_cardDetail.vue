<template>
  <div id="cb_cardDetail">
    <icar-header main-text="会员卡" bgColor="#F7F7F7" textColor="#242424" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods: goBack}">
    </icar-header>
    <div class="card_box" layout="column">
      <div flex class="card_header" layout="row">
        <div flex="nogrow">
          <mu-avatar style="margin: 0px 10px" :src="queryData.shop.logo?addPath(queryData.shop.logo):defaulImg" height="50"
                     alt=""></mu-avatar>
        </div>
        <div flex>
          <span>{{queryData.memberRank.name}}</span> <span class="rest">VIP</span>
          <h4 class="title">{{queryData.shop.name}}</h4>
          <div class="sn">{{queryData.sn}}</div>
        </div>
      </div>
      <div>

      </div>
      <div flex="nogrow" class="card_footer">
        <span>余额:</span><span class="price">¥ {{queryData.balance}}</span><span class="v">  {{queryData.bean}}V豆</span>
      </div>
    </div>
    <div layout="row" layout-align="center center" style="margin: 20px 0;">
      <mu-flat-button label="充值" class="demo-flat-button" backgroundColor="#FB8713" v-tap="{methods: charge}" color="#FFF"/>
    </div>
    <div class="intro">

    </div>
    <cells>
      <cell label="V豆" :value="queryData.bean" v-tap="{methods: goVDetail}"></cell>
      <!--<cell label="会员权益" v-tap="{methods: goForRight}"></cell>-->
      <cell label="使用记录" v-tap="{methods: goForRecord}"></cell>
      <cell label="使用门店" :value="queryData.shop.address" :link="false"></cell>
      <cell label="商家电话" :link="false">
        <a v-tap="{methods: callPhoto}" slot="value" class="tell"><img :src="call"
                                                                       style="vertical-align: middle;width: 20px"/>{{queryData.shop.mobile}}</a>
      </cell>
    </cells>
  </div>
</template>
<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import call from 'assets/icon_phone.png'
  import cells from 'components/cells'
  import cell from 'components/cell'


  import defaulImg from 'assets/default_user_icon.png'


  export default {
    name: 'cb_cardDetail',
    components: {
      icarHeader,
      cells,
      cell
    },
    beforeRouteEnter (to, from, next) {
      console.log(to)
      Vue.prototype.$.get({
        methodName: 'QueryMemberCard',
        id: to.query.id,
        shopId: to.query.shopId
      }).then(resp => {
        next(vm => {
          vm.queryData = resp.data.memberCard
          console.log(vm.queryData)
        })
      })
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      callPhoto () {
        this.$.push('router_callOthers', {
          phone: this.queryData.shop.mobile
        }, () => {
          console.log('调用成功')
        })
      },
      goForRecord () {
        this.$router.push({
          name: 'cb_record',
          query: {
            id: this.queryData.id,
            shopId: this.queryData.shop.id
          }
        })
      },
      goVDetail () {
        // V豆详情
//        this.$router.push({
//          name: 'cb_VDetail',
//          query: {
//            id: this.queryData.id,
//            shopId: this.queryData.shop.id,
//            sum: this.queryData.bean
//          }
//        })
        this.$router.push({
          name: 'vb_vBeanList'
        })
      },
      goForRight () {
        // 会员权益
        this.$router.push({
          name: 'cb_forRight',
          query: {
            right: this.queryData.description,
            name: this.queryData.shop.name,
            shopId: this.queryData.shop.id
          }
        })
      },
      charge () {
        this.$router.push({
          name: 'cb_recharge',
          query: {
            id: this.queryData.id
          }
        })
      }
    },

    data () {
      return {
        queryData: {
          shop: {}
        },
        left,
        call,
        hello: 'world',
        defaulImg
      }
    }
  }
</script>
<style>
  .card_box {
    margin: 10px 10px;
    background-color: #FB8713;
    border-radius: 5px;
    position: relative;
    color: #fff;
    padding: 10px 0px;
  }

  .card_box .brand {
    position: relative;
    text-align: center;
    min-height: 80px;
  }

  #cb_cardDetail .mu-flat-button {
    min-width: 50%;
  }

  #cb_cardDetail .intro {
    margin-top: 10px;
  }

  .tell {
    color: #949494;
    font-size: 1.1rem;
  }

  /*.card_box .brand h2{

  }*/

  #cb_cardDetail .demo-flat-button{
    border-radius: 5px;
  }
  #cb_cardDetail {
    font-size: 1.1rem;
  }

  #cb_cardDetail .title {
    font-size: 1.3rem;
    font-weight: normal;
  }

  #cb_cardDetail .price {
    padding-left: 5px;
    font-weight: normal;
    padding-right: 10px;
  }

  #cb_cardDetail .rest {
    float: right;
    margin-right: 10px;
  }

  #cb_cardDetail .card_header {
    padding-top: 20px;
    padding-bottom: 10px;
    background: #F98700;
    color: #fff;
    line-height: 25px;
    border-radius: 8px;
  }

  #cb_cardDetail .v {
    padding-left: 19px;
    font-weight: normal;
    line-height: 10px;
    padding-right: 10px;
  }

  #cb_cardDetail .vip_card {
    padding: 8px 15px;
  }

  #cb_cardDetail .card_footer {
    background: #D07000;
    color: #fff;
    line-height: 32px;
    padding-left: 10px;
  }

</style>
