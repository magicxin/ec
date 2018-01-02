<template>
  <div id="cbVDetail">
    <icar-header main-text="V豆明细" bgColor="#F7F7F7" textColor="#242424">
      <img :src="left" alt="">
    </icar-header>
    <scroll :bottom="true" marginBottom="0">
      <div class="vDetal_box" layout="column">
        <h4 flex>V豆总额 <span class="intro">(1元 = 100V豆)</span></h4>
        <h1 flex>{{sum}}</h1>
        <p flex>·每天按时签到或者参与活动可以获得V豆奖励</p>
        <p flex>·支付时可以抵现金使用</p>
      </div>
      <Loadmore :getMore="loadBottom" :allLoaded="allLoaded">
        <div v-for="item in vList" class="vListHistory">
          <div layout="row">
            <div flex layout="column">
              <h4>{{item.name}}</h4>
              <p>{{item.happenDate}}</p>
            </div>
            <div flex class="text-right">
              <span>
                {{item.type === '0' ? '+' : '-'}} {{item.bean === 'null' ? 0 : item.bean}}
              </span>
            </div>
          </div>
          <mu-divider/>
        </div>
      </Loadmore>
    </scroll>
  </div>
</template>
<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'

  import scroll from 'components/scroll.vue'
  import Loadmore from 'components/loadmore'

  let query = {
    index: 0,
    count: 5
  }
  let loading = false
  function ListV (vm) {
    if (vm.allLoaded || loading) {
      return
    }
    loading = true
    Vue.prototype.$.get({
      methodName: 'ListMemberCardBean',
      type: '0',
      shopId: vm.$route.query.shopId,
      index: query.index.toString(),
      count: query.count.toString(),
      memberCardId: vm.$route.query.id
    }).then(resp => {
      if (resp.data.resultCode === '100') {
        loading = false
        query.index = query.index + query.count
        vm.vList = vm.vList.concat(resp.data.memberCardBeans)
        if (resp.data.memberCardBeans.length < query.count) {
          vm.allLoaded = true
        }
      }
    })
  }
  export default {
    data () {
      return {
        left,
        allLoaded: false,
        vList: [],
        sum: this.$route.query.sum
      }
    },
    methods: {
      loadBottom () {
        ListV(this)
      }
    },
    mounted () {
      ListV(this)
    },
    beforeRouteLeave (to, from, next) {
      loading = false
      next()
    },
    components: {
      icarHeader,
      Loadmore,
      scroll
    }
  }
</script>
<style lang="scss">
  .vDetal_box {
    background-color: #F98700;
    min-height: 120px;
    color: #fff;
    padding: 10px;
  }

  .vDetal_box h4 {
    font-size: 1.3rem;
  }

  .vDetal_box h1 {
    font-size: 2.5rem;
    margin: 10px 0;
  }

  .vDetal_box p, .vDetal_box span {
    color: #F7CCC6;
  }

  .vDetal_box span {
    font-size: 1rem;
    font-weight: normal;
  }

  .vListHistory {
    padding: 20px;
    h4 {
      /*width: calc(100% - 180px);*/
      /*white-space: nowrap;*/
      height: 19px;
      line-height: 19px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .vListHistory .text-right {
    color: #F98701;
  }

  .vListHistory .mu-divider {
    margin-top: 15px;
  }

  .vListHistory p {
    font-size: 1.1rem;
    color: #9E9E9F;
  }

  .vListHistory h4 {
    font-size: 1.4rem;
    font-weight: normal;
    color: #333333;
    margin-bottom: 5px;

  }
</style>
