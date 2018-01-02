<template>
  <div id="vBean-list">
    <my-header main-text="V豆明细" bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>
    <div class="integral-title">
      <!--<p class="rental">V豆总额 <span>( 一元 = 100V豆 )</span></p>-->
      <p class="rental">V豆总额</p>
      <h4>{{integralNum}}</h4>
      <p>每天按时签到或者参与活动可以获得V豆奖励</p>
      <p>支付时可以抵现金使用</p>
    </div>
    <div class="integral-info">
      <section layout="column">
        <!--<h3 class="main_title">我的权益</h3>
        <grids>
        <grid layout="column" v-for="item in rights" class="text-center" layout-align="center center">
        <img :src="item.icon" alt="">
        <figcaption>{{item.name}}</figcaption>
        </grid>
        </grids>-->
        <loadMore :getMore="loadBottom" :allLoaded="allLoaded">
          <section layout="row" class="record" v-for="(item, index) in vList" :key="index">
            <section flex layout="column">
              <h5 flex>{{item.name || 0}}</h5>
              <p>{{item.happenDate }}</p>
            </section>
            <section flex="nogrow" class="text-right">
              {{item.type == '0' ? '+' : '-'}}{{item.bean == 'null' ? 0 : item.bean}}V豆
            </section>
          </section>
        </loadMore>
      </section>
    </div>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  import bigHeader from 'components/big-header.vue'
  import grids from 'components/grids.vue'
  import grid from 'components/grid.vue'
  import level from 'assets/level.png'
  import right1 from 'assets/right1.png'
  import right2 from 'assets/right2.png'
  import right3 from 'assets/right3.png'
  import right4 from 'assets/right4.png'
  import loadMore from 'components/loadmore.vue'
  import Vue from 'vue'




  let query = {
    index: 0,
    count: 10
  }
  let loading = false
  function ListV (vm) {
    if (vm.allLoaded || loading) {
      return
    }
    loading = true
    vm.$.get({
      methodName: 'ListMemberCardBean',
      clientType: 0,
      index: query.index.toString(),
      count: query.count.toString(),
      type: 0,
      memberCardId: 1
    }).then(resp => {
      if (resp.data.resultCode === '100') {
        vm.integralNum = resp.data.totalBean
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
    name: 'vb_vBeanList',
    data () {
      return {
        vList: [],
        allLoaded: false,
        integralNum: 0
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      },
      loadBottom () {
        ListV(this)
      },
    },
    components: {
      myHeader,
      bigHeader,
      grids,
      grid,
      loadMore
    },
    mounted () {
      query.index = 0
      ListV(this)
    },
    deactivated (){
      this.$destroy()
    },
    beforeRouteLeave (to, from, next) {
      loading = false
      next()
    },
  }
</script>

<style lang="scss">
  #vBean-list {
    .integral-title {
      background-color: #fe9900;
      padding: 1rem;
      color: rgba(255, 255, 255, .85);
      .rental {
        font-size: 1.2rem;
        span {
          font-size: 1rem;
          opacity: .8;
        }
      }
      h4 {
        font-size: 1.6rem;
        line-height: 4rem;
      }
      p {
        line-height: 1.3rem;
      }
    }
    .integral-info {
      padding: 1.5rem;
      #loadMore {
        .record {
          margin-bottom: 1rem;
          border-bottom: 2px solid #c3c3c3;
          h5 {
            font-size: 1.1rem;
            line-height: 2rem;
          }
          p {
            line-height: 2rem;
          }
        }
        .text-right {
          padding-top: 1rem;
          color: #fe9900;
        }
      }
    }

  }
</style>
