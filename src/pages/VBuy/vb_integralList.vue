<template>
  <div id="integral-list">
    <my-header main-text="积分明细" bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>
    <div class="integral-title">
      <p class="rental">积分总额</p>
      <h4>{{integralNum}}</h4>
      <p>充值、消费可以获得积分</p>
      <p>积分越高会员等级越高，可享受的权益越多</p>
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
          <section layout="row" class="record" v-for="(item, index) in queryData" :key="index">
            <section flex layout="column">
              <h5 flex>{{item.memo}}</h5>
              <p>{{item.happenData }}</p>
            </section>
            <section flex="nogrow" class="text-right">
              {{item.pointCount}}积分
            </section>
          </section>
        </loadMore>
      </section>
    </div>
  </div>
</template>
<script>
	import Vue from 'vue'
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




  let query = {
    pageNumber: 1,
    pageSize: 10
  }
  let loading = false
  function _getRights (vm) {
    if (loading) {
      return
    }
    loading = true
    return Vue.prototype.$.get({
      methodName: 'QueryUserRankInfo',
      pageable: query
    }).then(resp => {
      query.pageNumber++
      loading = false
      return resp
    })
  }
  export default {
    name: 'vb_integralList',
    data () {
      return {
        queryData: [],
        allLoaded: false,
        integralNum: 0
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      },
      loadBottom () {
        _getRights().then(resp => {
          console.log(resp)
          this.integralNum = resp.data.point
          const _length = resp.data.integralDetails.length
          if (_length) {
            resp.data.integralDetails.forEach(val => {
              val.happenData = val.happenData.slice(0, 10)
              this.queryData.push(val)
            })
            if (_length < query.pageSize) {
              this.allLoaded = true
            }
          }
        })
      },
    },
    components: {
      myHeader,
      bigHeader,
      grids,
      grid,
      loadMore
    },
    created(){
      this.loadBottom()
    }
  }
</script>

<style lang="scss">
  #integral-list {
    .integral-title {
      background-color: #fe9900;
      padding: 1rem;
      color: rgba(255, 255, 255, .85);
      .rental {
        font-size: 1.2rem;
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
