
<template>
  <div id="robBuy">
      <!-- <my-header :mainText="prepaiPrice" bg-color="#fff" text-color="#000" :shop="shop">
        <img slot="" src="../../assets/left-gray.svg">
      </my-header> -->
      <magic-header :isEve="true" :titleName="$route.query.title ? $route.query.title : prepaiPrice" :returnNative="$route.params.native"></magic-header>
      
      <eveListTitle v-if="racentData && racentData.product">
        <img :src="racentData.image ? addPath(racentData.image) : defaultImg" width="100%" height="150px" alt="" slot="imageShow">
        <div slot="title" class="mid_f">
            {{ racentData.product.name }}
        </div>
        <span slot="nowPrice" class="mid_f">
              ￥{{ racentData.activityPrice }}
        </span>
        <span slot="beforePrice" class="sm_f">
              原价:￥{{ racentData.product.price }}
        </span>
        <span slot="needNum" class="mini_f">
           还需<span class="col_yellow">{{ Number(racentData.countAll) - Number(racentData.sentCount) || 0 }}</span>人
        </span>
        <button class="btn_style btn" slot="clickEvent" v-tap = "{methods: go, id: racentData.product.id, activityId: racentData.id}" v-if="racentData.state == '1'">
            去抢购
        </button>
        <button slot="clickEvent" class="btn_style btn btn_sty2" v-if="racentData.state == '0'" @click="isLogin">
            期待中
        </button>
        <span slot="more_content" class="sm_f">
            更多热抢
        </span>
      </eveListTitle>
      <div v-if="exceptData">
        <panel v-for="(item, index) in exceptData" :key="index" :value="item.product">
          <span slot="fullName" class="mid_f">{{ item.product.name }}</span>
          <span slot="desc" class="sm_f col_gay"><del>原价:{{ item.product.price || 0 }}</del></span>
          <span slot="price" class="sm_f text_red">￥{{ item.activityPrice || 0}}</span>
          <div slot="number" class="text-right">
            还需<span class="col_yellow">{{ Number(item.countAll) - Number(item.sentCount) || 0}}</span>人
            <a class="btn_style" v-tap = "{methods: go, id: item.product.id, activityId: item.id}" v-if="item.state == '1'">去抢购</a>
            <a class="btn_style btn_sty2" v-if="item.state == '0'" @click="isLogin">期待中</a>
          </div>
        </panel>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
// import myHeader from 'components/eve-my-head'
import magicHeader from 'components/magicHeader'
import eveListTitle from 'components/eve_list_title'
import panel from 'components/panel'
import origin from 'components/origin'
import price from 'components/price'


import Loadmore from 'components/loadmore'
import defaultImg from 'assets/default_user_icon.png'




// let query = {
//   index: 5,
//   count: 3
// }

// function getProduct (vm) {
//   return Vue.prototype.$.get({
//     methodName: 'ListPanicBuying',
//     index: query.index.toString(),
//     count: query.count.toString(),
//     activityId: vm.$route.params.id
//   }).then(res => {
//     query.index += query.count
//     res.data.exceptData.forEach(val => {
//       vm.exceptData.push(val)
//     })
//     if (res.data.exceptData.length < query.count) {
//       vm.allLoaded = true
//     }
//   })
// }

export default {
  components: {
    magicHeader,
    panel,
    eveListTitle,
    origin,
    loadMore: Loadmore,
    price
  },
  data () {
    return {
      defaultImg,
      exceptData: [],
      racentData: {},
      prepaiPrice: '',
      beginTime: 0,
      shop: {},
      activityId: this.$route.params.activityId
    }
  },

  methods: {
    go (parmas) {
    	if(this.$.userId){
    		this.$router.push({name: 'eve_robBuyDetails', params: {id: parmas.id, activityId: parmas.activityId}})
    	}else{
    		this.$.goLogin({
            shopId: this.shop.id
        })
    	}
    },
    isLogin () {
    	if(this.$.userId){
    		this.$.toast('稍等片刻，活动即将开始~')
    	}else{
    		this.$.goLogin({
            shopId: this.shop.id
        })
    	}
    }
  },
  beforeRouteEnter (to, from, next) {
  	console.log(to)
    Vue.prototype.$.get({
      methodName: 'ListPanicBuying',
      index: '0',
      count: '100',
      id: to.params.activityId
    }).then(res => {
    	console.log(res)
      next(vm => {
        window.scrollTo(0, 0)
        vm.exceptData = res.data.exceptData
        vm.racentData = res.data.racentData
        vm.shop = res.data.shop
        let price1 = res.data.racentData.activityPrice
        let price2
        /* eslint-disable */
        if (price1.charAt(price1.length - 1) == '0') {
          price2 = price1.slice(0, price1.length - 1)
          if (price2.charAt(price2.length - 1) == '0') {
            price2 = price2.slice(0, price2.length - 2)
          }
        } else {
          price2 = price1
        }
        vm.prepaiPrice = price2 + '元抢购'
        let state = vm.racentData.state
        console.log(state)
      })
    })
  }
}
</script>
<style scoped>
#robBuy {
  background-color: #fff;
}
.lab_style {
    position: absolute;
    top: 15px;
    right: 12px;
    color: #929292;
}

.origin{
  margin-bottom: 5px;
  display: inline-block;
}

.text-right{
  color: #B7B7B7;
  margin-right: 10px;
}

.original{
  margin-top: 5px;
}
.btn {
  margin-right: 10px;
  margin-left: 2%;
}
.btn_sty2 {
  outline: none;
  background-color: #bcbcbc;
  color: #fff;
}
</style>