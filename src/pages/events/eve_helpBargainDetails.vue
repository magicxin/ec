
<template>
  <div id="eve_helpDetails">
    <goodsDetail :product="product" :shop="shop" :evalData="evalData" :evalDataSome="evalDataSome" :evalArray="evalArray" :favorId="favorId" :isCollect="isCollect" :collectState="collectState" :activity="activity">
      <div slot="bargainRecode">
        <cell value="" v-tap="{methods: goAnnounce }">
          <p slot="label" class="options-label"  >帮砍价记录</p>
        </cell>
      </div>
    </goodsDetail>
    <mu-popup position="bottom" popupClass="demo-popup-bottom" :open="bottomPopup" @close="close('bottom')">
      <h3 class="sm_f help">帮一把</h3>
      <p class="shareCon">
        这个东西真的很棒哦，希望你能帮我一把~
      </p>
      <p class="goHelp mid_f" @click="openDialog">
        前去帮忙
      </p>
    </mu-popup>
    <mu-dialog :open="dialog" title="关注公众号" @close="closeDialog" dialogClass="help_dialog">
       <img :src="defaultImg" alt="">
       <label for="" style="display: inline-block;vertical-align: middle;transform: translateY(-190%);margin-left: 30px;">V服爱车</label>
      <mu-flat-button slot="actions" @click="closeDialog" backgroundColor="#fff" label="取消" style="color:#000"/>
      <mu-flat-button slot="actions" backgroundColor="#28aa28" @click="followFun" label="关注" style="color:#fff"/>
    </mu-dialog>
  </div>
</template>
<script>
	import Vue from 'vue'
import goodsDetail from 'components/goods/goodsDetail'

import cell from 'components/cell'
import defaultImg from 'assets/default_user_icon.png'


export default {
  data () {
    return {
      product: {}, // 产品参数对象
      shop: {}, // 商家信息参数对象
      evalData: {}, // 评价参数对象
      evalDataSome: {}, // 列表默认展示 三条评价
      evalArray: [], // 评价数组
      isCollect: true, // 是否收藏
      favorId: '', // 收藏id
      collectState: '收藏',
      bottomPopup: true,
      dialog: false,
      defaultImg,
      activity: {}, // 活动参数
      activityId: this.$route.params.activityId,
      id: this.$route.params.id,
      userId: this.$route.params.userId
    }
  },
  methods: {
    open (position) {
      this[position + 'Popup'] = true
    },
    close (position) {
      this[position + 'Popup'] = false
    },
    closeDialog () {
      this.dialog = false
    },
    openDialog () {
      this.$.get({
        methodName: 'CreateBargainOAuth',
        activityId: this.activityId,
        userId: this.userId
      }).then(res => {
        console.log(res)
        window.location.href = res.data.respUrl
      })
      // this.dialog = true
    },
    followFun () {
      this.dialog = false
      let url = document.location.href
      window.open('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe01a681cdc2d5985&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect')
      this.$.get({
        methodName: 'AttendBargain',
        targetUserId: this.userId,
        bargainId: this.activityId,
        wxId: '',
        wechatOpenId: 'wxe01a681cdc2d5985'
      }).then(res => {
        if (res.data.resultCode === '100') {
          this.$router.push({
            name: 'eve_helpSuccess',
            params: {activityId: this.activityId, id: this.id},
            query: {
              bargainMoney: res.data.bargainMoney
            }
          })
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  beforeRouteEnter (to, from, next) {
    Promise.all([
      Vue.prototype.$.get({
        methodName: 'QueryActivityProduct',
        productId: to.params.id,
        activityId: to.params.activityId,
        type: '4'
      }),
      Vue.prototype.$.get({
        methodName: 'QueryProductReview',
        type: '0',
        index: '0',
        count: '10',
        productId: to.params.id
      })
    ])
    .then(result => next(vm => {
      vm.product = result[0].data.product
      vm.activity = result[0].data.activity
      vm.shop = result[0].data.shop
      vm.favorId = result[0].data.product.favorId
      vm.evalData = result[1].data
      vm.evalDataSome = result[1].data
      vm.evalDataSome.reviews = vm.evalDataSome.reviews.slice(0, 2)
      vm.evalArray = [
        {text: '全部', num: vm.evalData.all, active: true, type: 0},
        {text: '好评', num: vm.evalData.positive, active: false, type: 1},
        {text: '中评', num: vm.evalData.moderate, active: false, type: 2},
        {text: '差评', num: vm.evalData.negative, active: false, type: 3},
        {text: '有图', num: vm.evalData.imageCount, active: false, type: 4}
      ]
      if (vm.product.isFavor === '1') {
        vm.isCollect = false
        vm.collectState = '已收藏'
      } else {
        vm.isCollect = true
        vm.collectState = '收藏'
      }
    }))
  },
  mounted () {
    /* eslint-disable */

  },
  components: {
    goodsDetail,
    cell
  }
}
</script>
<style>
.demo-popup-bottom {
  width: 100%;
  max-width: 375px;
}
.goHelp {
  text-align: center;
  padding: 18px;
  color: #DE970C;
}
.shareCon {
  text-align: center;
  color: #8D8D8D;
}
.help {
    text-align: center;
    margin: 15px;
    color: #757575;
}
.help_dialog .mu-dialog{
  background-color: #d9d9d9;
  border-radius: 10px;
}
.help_dialog .mu-dialog-title {
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    padding: 10px 20px;
    margin-bottom: 10px
}
.help_dialog .mu-dialog-body {
  padding: 0px 20px;
}
.help_dialog button {
    margin: auto;
}
.help_dialog img {
    width: 75px;
    border-radius: 50%;
}
.help_dialog .mu-dialog-actions {
  padding: 20px 8px;
}
</style>