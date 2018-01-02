<template>
  <div id="cb_record">
    <my-header main-text="使用记录" bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>
    <scroll :bottom="true" :top="true" marginBottom="0">
    <div layout="column" class="cb_record_box">
      <div flex layout="row" class="cb_sum_box">
        <div flex layout="column" >
          <h4 flex layout="row" layout-align="center center">收入(元)</h4>
          <p flex layout="row" layout-align="center center">¥{{queryData.income}}</p>
        </div>
        <div flex layout="column">
          <h4 flex layout="row" layout-align="center center">支出(元)</h4>
          <p flex layout="row" layout-align="center center">¥{{queryData.expend}}</p>
        </div>
      </div>
      <div flex="nogrow" layout="row" layout-align="space-between center" class="cb_record_title">
        <div flex>收支明细</div>
        <!--<div flex class="text-right">全部</div>-->
        <mu-select-field flex v-model="type">
          <mu-menu-item  title="全部"  value="0" />
          <mu-menu-item  title="收入"  value="1" />
          <mu-menu-item  title="支出"  value="2" />
        </mu-select-field>
      </div>
    </div>

    <load-more :getMore="loadBottom" :allLoaded = "allLoaded">
      <section v-for="(value, key) in currentValue">
        <header>
          <h2 class="title">{{key}}</h2>
        </header>
        <div class="cb_record_time" v-for="item in value">
          <div layout="row" class="cb_one_record">
            <div flex layout="column">
              <h4>{{item.name}}</h4>
              <p>{{item.happenDate}}</p>
            </div>
            <div flex="nogrow" >
              <span class="money">{{item.type === '0' ? '+' : '-'}}¥ {{item.amount}} 元</span>
            </div>
          </div>
        </div>
      </section>
    </load-more>
    </scroll>
  </div>
</template>
<script>
	import Vue from 'vue'
  import myHeader from 'components/my-header'

  import Loadmore from 'components/loadmore'
  import scroll from 'components/scroll/scroll'

  let query = {
    index: 0,
    count: 10
  }
  let _cache = {}
  let isLoading
  function getRecord (vm, type, id) {
    if (isLoading) {
      return
    }
    isLoading = true
    return Vue.prototype.$.get({
      methodName: 'ListMemberCardConsume',
      // shopId: vm.$route.query.shopId,
      index: query.index.toString(),
      count: query.count.toString(),
      type: type,
      memberCardId: id
    }).then(resp => {
      isLoading = false
      query.index = query.index + query.count
      vm.queryData = resp.data
      vm.queryData.consumes.forEach(val => {
        let _year = val.happenDate.slice(0, 4)
        if (!_cache[_year]) {
          _cache[_year] = []
        }
        _cache[_year].push(val)
      })
      vm.currentValue = _cache
      if (resp.data.consumes.length < query.count) {
        vm.allLoaded = true
      }
    })
  }

  export default {
    name: 'cb_record',
    components: {
      myHeader,
      loadMore: Loadmore,
      scroll
    },
    data () {
      return {
        queryData: {},
        allLoaded: false,
        currentValue: {},
        type: '0'
      }
    },
    methods: {
      loadBottom () {
        getRecord(this, this.type, this.$route.query.id)
      }
    },
    watch: {
      type (val) {
        this.allLoaded = false
        query.index = 0
        isLoading = false
        this.currentValue = {}
        _cache = {}
        getRecord(this, this.type, this.$route.query.id)
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        getRecord(vm, vm.type, to.query.id)
      })
    },
    beforeRouteLeave (to, from, next) {
      _cache = {}
      query = {
        index: 0,
        count: 10
      }
      isLoading = false
      next()
    }
  }
</script>

<style>

  #cb_record .title{
    color: #ccc;
    font-weight: normal;
    font-size: 1.2rem;
    vertical-align: middle;
    line-height: 40px;
    height: 40px;
  }

  #cb_record h4{
    font-weight: normal;
  }

  .mu-menu-item-wrapper.active {
    color: #FBAD59;
  }

  .mu-text-field-focus-line{
    background-color: #FBAD59;
  }

  .mu-dropDown-menu-text {
    text-align: right;
  }

  #cb_record .mu-text-field{
    /*margin-top: 14px;*/
    margin-bottom: 0px;
    font-size:1.3rem;
    min-height: auto;
  }

  #cb_record .mu-text-field-line{
    display: none;
  }

  .cb_sum_box{
    margin: 10px 15px 25px;
    background-color: #F7F7F7;
  }

  .cb_sum_box h4, .cb_sum_box p {
    line-height: 20px;
    margin-top: 10px;
  }

  .cb_sum_box p {
    color: #F04644;
    font-size: 1.3rem;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .cb_record_box{
    background-color: #fff;
    /*margin-bottom: 20px;*/
  }

  .cb_record_title {
    padding: 5px;
    margin-top: -10px;
  }

  .cb_record_time .time {
    margin-left: 10px;
    color: #9D9D9D;
    font-size: 1.2rem;
  }

  .cb_record_time .money {
    color: red;
    font-size: 1.4rem;
  }

  .cb_one_record {
    position: relative;
    padding: 10px;
    line-height: 15px;
    background-color: #fff;
  }

  .cb_one_record:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }


</style>
