<template>
  <div class="mall" id="mall">
    <icar-header main-text="V豆换购" bgColor="#F7F7F7" textColor="#242424" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods: goBack}">
    </icar-header>
    <scroll :bottom="true" marginBottom="0">
      <div class="vb_box" layout="row" layout-align="center center">
        <img :src="VIcon" flex="nogrow">
        <h4 flex>
          我的V豆: <span>{{queryData.bean}}</span>个
        </h4>
        <!--<span class="VDetail" flex="nogrow" @click="goToBeanList">V豆明细</span>-->
      </div>

      <empty v-if="products.length === 0" message="暂时没有换购的商品">

      </empty>

      <load-more :getMore="loadBottom" :allLoaded="allLoaded" v-else>
        <panel v-for="(item,index) in products" :key="index" :value="item">
          <origin slot="desc" :value="item.marketPrice"></origin>
          <price slot="price" :value="item.pri"></price>
          <div class="text-right" slot="number">
            <span>余{{item.stock}}件</span>
            <a class="primary-button" v-tap="{methods: go, item: item}">换购</a>
          </div>
        </panel>
      </load-more>
    </scroll>
  </div>
</template>
<script>
	import Vue from 'vue'
  import bigHeader from 'components/big-header'
  import orderHeader from 'components/order-header'
  import panel from 'components/panel'
  import origin from 'components/origin'
  import price from 'components/price'
  import icarButton from 'components/order-button'

  import Loadmore from 'components/loadmore'

  import defaultImg from 'assets/default_user_icon.png'
  import VIcon from 'assets/VIcon.png'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import defaultEmpty from 'assets/default_empty_icon.png'

  import empty from 'components/empty-page.vue'
  import scroll from 'components/scroll'
  let cache


  let query = {
    index: 0,
    count: 5
  }
  function loadMore (vm, type) {
    Vue.prototype.$.get({
      methodName: 'ListRedemption',
      type: type || '0',
      index: query.index.toString(),
      count: query.count.toString()
    }).then(resp => {
      if (resp.data.resultCode === '100') {
        query.index = query.index + query.count
        vm.queryData = resp.data
        vm.products = vm.products.concat(resp.data.products)
        if (resp.data.products.length < query.count) {
          vm.allLoaded = true
        }
      }
    })
  }
  export default {
    name: 'vb_integralMall',
    data () {
      return {
        defaultEmpty,
        VIcon,
        left,
        defaultImg,
        queryData: {
          products: []
        },
        products: [],
        type: '0',
        allLoaded: false,
        fromRoute: ''
      }
    },

    components: {
      empty,
      bigHeader,
      orderHeader,
      panel,
      origin,
      price,
      icarButton,
      loadMore: Loadmore,
      icarHeader,
      scroll
    },
    methods: {
      loadBottom () {
        loadMore(this)
      },
      getSort (type) {
        loadMore(this, type)
      },
      go (params) {
        if (params.item.categoryType === '1') {
          this.$router.push({name: 'sg_goods', params: {id: params.item.id, name: '1'}})
        } else {
          this.$router.push({name: 'sg_goods_car', params: {id: params.item.id, name: '1'}})
        }
      },
      goVDetail () {
        console.log(this.queryData)
        this.$router.push({
          name: 'cb_VDetail',
          query: {
            id: this.queryData.id,
            sum: this.queryData.bean
          }
        })
      },
      goToBeanList(){
        this.$router.push({
          name: 'vb_vBeanList'
        })
      },
      goBack (params) {
        // let historyLength = window.history.length
        // if (historyLength === 2) {
        //   this.$.push('router_back', null, (resp) => {
        //     console.log('调用成功')
        //   })
        // }
        console.log(this.fromRoute)
        if (this.fromRoute === 'vb_vipRule') {
          this.$router.go(-1)
          return
        }
        if (cache) {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
          return
        }
        if (this.fromRoute === 'orderManage' || this.fromRoute === 'cb_VDetail') {
          this.$router.go(-1)
        } else {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
        }
      }
    },
    mounted () {
      this.loadBottom()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fromRoute = from.name || from.fullPath.slice(1)
        console.log(vm.fromRoute)
        if (!from.name && !cache) {
          cache = true
        }
      })
    }
  }
</script>

<style scoped>
  #mall .right-text {
    background-color: #db8000;
    padding-left: 12px;
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
  }

  .vb_box {
    background-image: url('../../assets/bg_mypage.png');
    height: 120px;
    width: 100%;
    position: relative;
    padding-left: 20px;
    overflow: hidden;
  }

  .VDetail {
    color: #fff;
    position: absolute;
    right: -10px;
    top: 20px;
    height: 25px;
    line-height: 25px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    width: 80px;
    text-align: center;
    background-color: #D78701;
  }

  .vb_box img {
    height: 60px;
  }

  .vb_box h4 {
    color: #fff;
    font-size: 1.2rem;
    font-weight: normal;
    margin-left: 20px;
  }

  .vb_box h4 span {
    font-size: 1.4rem;
  }

  #mall .title {
    font-size: 15px;
    font-weight: 300;
    padding: 15px 10px;
    padding-right: 0px;
  }

  #mall .title span {
    color: #999999;
    vertical-align: middle;
    font-size: 12px;
    vertical-align: baseline;
  }

  #mall .text-right {
    margin-right: 20px;
  }

  #mall .text-right span {
    margin-right: 30px;
  }

  #mall .primary-button {
    background-color: #fff;
    color: #E1411A;
    display: inline-block;
    width: 50px;
    border: 1px solid #E1411A;
    height: 30px;
    line-height: 30px;
  }
</style>
