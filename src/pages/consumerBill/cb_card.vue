<template>
  <div id="card">
    <magic-header  titleName="" :returnNative="$route.params.native">
      <mu-tabs :value="activeTab" @change="handleTabChange" class="test" slot="title-middle">
        <mu-tab value="tab1" title="会员卡"/>
        <mu-tab value="tab2" title="优惠券"/>
      </mu-tabs>
    </magic-header>
    <!-- <is-header bgColor="#F7F7F7" textColor="#474747">
      <img :src="left">
      
    </is-header> -->
    <!-- <scroll marginBottom="0"> -->
      <div v-if="activeTab === 'tab1'" class="vip_card" layout="column">
        <empty v-if="queryData.memberCards.length === 0" message="您暂时没有会员卡, 快去申办吧">

        </empty>
        <div flex layout="column" v-for="item in queryData.memberCards"
             v-tap="{methods: goForDetail, id: item.id, shopId: item.shop && item.shop.id}" class="momberCard">
          <div flex class="card_header" layout="row">
            <div flex="nogrow">
              <mu-avatar style="margin: 0px 10px" :src="item.shop.logo?addPath(item.shop.logo):defaulImg" height="50"
                         alt=""></mu-avatar>
            </div>
            <div flex>
              <span>{{item.memberRank.name}}</span> <span class="rest">VIP</span>
              <h4 class="title">{{item.shop.name}}</h4>
            </div>
            <!--<div flex="nogrow">-->
            <!--<h4 class="price">¥ {{item.balance}}</h4>-->
            <!--<h4 class="v">  {{item.bean}}V豆</h4>-->
            <!--</div>-->
          </div>
          <div flex="nogrow" class="card_footer">
            <span>余额:</span><span class="price">¥ {{item.balance}}</span><span class="v">  {{item.bean}}V豆</span>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'tab2'">
        <empty v-if="couponList.length === 0" message="您暂时没有优惠券">

        </empty>
        <coupon :value="couponList" :fromState="fromState"></coupon>
      </div>
    <!-- </scroll> -->
  </div>
</template>
<script>
	import Vue from 'vue'
  import isHeader from 'components/my-header'
  import isInput from 'components/is-input'
  import left from 'assets/left-gray.svg'
  import defaulImg from 'assets/default_user_icon.png'
  import bmw from 'assets/baoma.svg'
  import coupon from 'components/coupon'


  import empty from 'components/empty-page.vue'
  import scroll from 'components/scroll'
  import magicHeader from 'components/magicHeader'

  export default {
    name: 'card',
    data () {
      return {
        left,
        bmw,
        activeTab: 'tab1',
        queryData: {
          memberCards: []
        },
        couponList: [],
        fromState: '',
        defaulImg
      }
    },

    methods: {
      handleTabChange (val) {
        this.activeTab = val
      },
      goForDetail (params) {
        this.$router.push({
          name: 'cb_cardDetail',
          query: {
            id: params.id,
            shopId: params.shopId
          }
        })
      }
    },
    components: {
      empty,
      isHeader,
      coupon,
      isInput,
      scroll,
      magicHeader
    },
    created(){
      console.log(this.$route)
    },
    beforeRouteEnter (to, from, next) {
      Promise.all([
        Vue.prototype.$.get({
          methodName: 'ListMemberCard'
        }),
        Vue.prototype.$.get({
          methodName: 'ListCoupon',
          type: '1'
        })
      ]).then(([card, coupon]) => {
        next(vm => {
          vm.fromState = from.name
          vm.queryData = card.data
          vm.couponList = coupon.data.coupons
        })
      }, (err) => {
        window.alert(err)
      })
    }
  }
</script>

<style>
  #card .test {
    margin-bottom: 0px;
  }

  #card .momberCard {
    margin-top: 10px;
  }

  #card .mu-tab-active {
    color: #FB8713;
  }

  #card {
    font-size: 1.1rem;
  }

  #card .title {
    font-size: 1.3rem;
    font-weight: normal;
  }

  #card .price {
    padding-left: 5px;
    font-weight: normal;
    padding-right: 10px;
  }

  #card .rest {
    float: right;
    margin-right: 10px;
  }

  #card .card_header {
    padding-top: 20px;
    padding-bottom: 10px;
    background: #F98700;
    color: #fff;
    line-height: 25px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  #card .v {
    padding-left: 19px;
    font-weight: normal;
    line-height: 10px;
    padding-right: 10px;
  }

  #card .vip_card {
    padding: 8px 15px;
  }

  #card .card_footer {
    background: #D07000;
    color: #fff;
    line-height: 32px;
    padding-left: 10px;
  }
</style>
