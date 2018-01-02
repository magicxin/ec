<template>
  <div id="eve_helpBarginRecord">
    <magic-header titleName="帮砍价记录"></magic-header>
    <!-- <my-header main-text="帮砍价记录" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header> -->
    <div class="top">
      <p class="mid_f p_one">{{ product.name }}</p>
       <p class="mid_f">原价￥{{ product.price }}，已有{{ recordList.length }}人砍掉了<span class="hg_f">{{ cutPriceAll.toFixed(2) }}元</span></p>
    </div>
    <div>
      <ul class="clear">
        <li class="clear" v-for="record in recordList">
          <img :src="record.head ? record.head : defaultImg" alt="" class="fl_left_img">
          <label for="" class="fl_left_lab">
            <span class="sm_f">{{ record.wxName }}</span> <br>
            <span class="text_gray sm_f">{{ record.happenDate }}</span>
          </label>
          <label for="" class="fl_right mid_f">-￥{{ record.cutPrice }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
	import Vue from 'vue'
  import defaultImg from 'assets/default_user_icon.png'
  //
  // import myHeader from 'components/my-header'
  import magicHeader from 'components/magicHeader'



  export default {
    data () {
      return {
        defaultImg,
        recordList: [],
        product: JSON.parse(this.$route.query.product),
        cutPriceAll: 0
      }
    },
    components: {
      magicHeader
    },
    //
    beforeRouteEnter (to, from, next) {
      Promise.all([
        Vue.prototype.$.get({
          methodName: 'ListBargainRecord',
          bargainId: to.params.activityId,
          index: '0',
          count: '500'
        })
      ])
      .then(result => next(vm => {
        vm.recordList = result[0].data.records
        vm.recordList.forEach(function (element) {
          vm.cutPriceAll += Number(element.cutPrice)
        }, this)
      }))
    }
  }
</script>
<style>
  #eve_helpBarginRecord li {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }
  #eve_helpBarginRecord .top {
    width: 100%;
    height: 130px;
    background-color: #f98700;
    color: #fff;
    padding: 25px 18px;
  }
  #eve_helpBarginRecord .p_one {
    margin-bottom: 30px;
  }
  #eve_helpBarginRecord .fl_left_img {
    float: left;
    margin: 10px;
    width: 60px;
    border-radius: 50%;
  }
  #eve_helpBarginRecord .fl_left_lab {
    float: left;
    line-height: 25px;
    margin-top: 16px;
  }
  #eve_helpBarginRecord .fl_right {
    float: right;
    color: #f98700;
    margin-right: 20px;
    margin-top: 32px;
  }
</style>
