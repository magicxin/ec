<style>
  #eve_announce .my-swipe {
    height: 200px;
    text-align: center
  }
  #eve_announce .progress {
    margin-left: 14px;
    margin-right: 14px;
  }
  #eve_announce .pad_rig {
    padding-right: 10px;
  }
  #eve_announce .ul_border {
    padding: 16px;
    padding-bottom: 0px;
  }
  #eve_announce .ul_border li{
    padding-bottom: 10px;
  }
  #eve_announce .right_label {
    float: right
  }
  #eve_announce .fixedBtn {
    position: fixed;
    bottom: 0px;
    height: 50px;
    font-size: 16px;
  }
  #eve_announce .fixedBtn .mu-raised-button-label {
    font-size: 16px;
  }
  #eve_announce .detail_body {
    background-color: rgba(249, 135, 0, 0.79);
    margin: 30px 15px;
  }
  #eve_announce .img_content {
    text-align: center;
    padding: 10px;
  }
  #eve_announce .detail_content {
    margin-left: 12%;
    padding-bottom: 10px;
  }
  #eve_announce .detail_content li {
    padding: 6px;
    font-size: 14px;
    color: #fff;
  }
</style>
<template>
  <div id="eve_announce">
    <magic-header  titleName="商品详情"></magic-header>
    <!-- <my-header main-text="商品详情" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header> -->
    <!--<swipe :auto="2000" class="my-swipe">
        <swipe-item v-for="item in product.productImages" v-if="product.productImages.length !== 0 ">
            <img :src="item ? addPath(item) : defaultImg" style="min-height: 200px;" height="100%">
        </swipe-item>
        <swipe-item v-if="product.productImages == ''">
            <img :src="defaultImg"  height="100%">
        </swipe-item>
    </swipe>-->
    <swipe :auto="2000" class="my-swipe">
      <swipe-item v-for="(item,index) in product.productImages" :key="index" v-if="product.productImages.length !== 0 ">
          <img :src="item ? addPath(item) : defaultImg" style="min-height: 200px;" height="100%">
      </swipe-item>
      <swipe-item v-if="product.productImages == ''">
          <img :src="defaultImg"  height="100%">
      </swipe-item>
    </swipe>
    <ul class="ul_border">
      <li><span class="name mid_f">{{ product.name }}</span></li>
      <li class="text_orange">总需：<span class="mid_f">{{ activity.total }}人</span></li>
      <li class="text_dark">
        <label>第{{ detail_body.index }}期</label>
        <label class="right_label" v-if="currentNum == allNum">已满</label>
        <label class="right_label" v-if="currentNum != allNum">还差<span class="col_yellow">{{ allNum - currentNum }}人</span></label>
      </li>
    </ul>
    <div class="progress">
      <mu-linear-progress mode="determinate" color="#F98700" :value="currentNum" class="mu-linear-progress" :max="allNum" />
    </div>
    <section class="detail_body">
      <div class="img_content">
        <img :src="detail_body.head ? addPath(detail_body.head ) : defaultImg" alt="" width="75">
      </div>
      <div class="detail_content">
        <ul>
          <li>揭晓号码：{{ detail_body.luckyCode }}</li>
          <li>得奖用户：{{ detail_body.user }}</li>
          <li>参与时间：{{ detail_body.openDate }}</li>
          <li>参与人数：{{ detail_body.personTimes }}人</li>
        </ul>
      </div>
    </section>
    <mu-raised-button label="前往最新一期" class="fixedBtn" backgroundColor="#f98700" :fullWidth="istrue" @click="goNewStage()"/>
    <div style="height: 50px; width: 100%"></div>
  </div>
</template>
<script>
	import Vue from 'vue'
//  import myHeader from 'components/my-header'
import magicHeader from 'components/magicHeader'


 import { Swipe, SwipeItem } from 'vue-swipe'
 import 'vue-swipe/dist/vue-swipe.css'
 import defaultImg from 'assets/default_user_icon.png'



/* eslint-disable */
 export default {
    data () {
      return {
          product: {},
          defaultImg,
          istrue: true,
          activity: {},
          detail_body: JSON.parse(this.$route.params.item),
          latestActivityId: this.$route.query.latestActivityId,
          currentNum: 0,
          total: 0,
          allNum: 0,
          currentNum: 0
      }
    },
    methods: {
      // 前往最新一期
      goNewStage () {
        console.log(this.latestActivityId)
        this.$router.push({name: 'eve_robBuy', params: {activityId: this.latestActivityId}})
      }
    },
    components: {
      magicHeader,
      SwipeItem,
      Swipe
    },

    beforeRouteEnter (to, from, next) {
      Promise.all([

        // 查看商品接口
        Vue.prototype.$.get({
          methodName: 'QueryActivityProduct',
          productId: to.params.id,
          activityId: to.params.activityId,
          type: '1'
        })
      ])
      .then(result => next(vm => {
        vm.product = result[0].data.product
        vm.activity = result[0].data.activity
        vm.allNum = Number(vm.activity.total)
        vm.currentNum = Number(vm.activity.attendCount)
      }))
    }
 }
</script>
