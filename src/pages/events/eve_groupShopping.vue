<template>
  <div id="eve_groupShopping">
    <magic-header :isEve="true" :titleName="$route.query.title ? $route.query.title : '拼团购'" :returnNative="$route.params.native"></magic-header>
      <!-- <my-header main-text="拼团购" bg-color="#fff" text-color="#000" :shop="shop">
        <img slot="" src="../../assets/left-gray.svg">
      </my-header> -->
      <eveListTitle v-if="racentData.product">
          <img :src="racentData.product.image ? addPath(racentData.product.image) : defaultImg" width="100%" height="150px" alt="" slot="imageShow">
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
            已有<span class="col_yellow">{{ racentData.attendCount }}</span>人参与/{{ racentData.total }}人团
          </span>

          <button slot="clickEvent" class="btn_style btn btn_sty2" 
                  v-if="racentData.state == '0'" 
                  @click="isLogin">
              期待中
          </button>
          <button class="btn_style btn btn_sty2" 
                  slot="clickEvent" 
                  v-if="racentData.state == '1' && racentData.isAttend == '0' && racentData.sentCount == racentData.countAll" >
              已满员
          </button>
          <button class="btn_style btn" 
                  slot="clickEvent" 
                  @click="attendGroup"
                  v-tap="{methods:attendGroup,id: racentData.id}"
                  v-if="racentData.state == '1' && racentData.isAttend == '0' && racentData.sentCount != racentData.countAll" >
              去参团
          </button>
          <button class="btn_style btn" 
                  slot="clickEvent" 
                  v-tap = "{methods: go, id: racentData.product.id, activityId: racentData.id,coupon:racentData.attends[0].couponCode.coupon}" 
                  v-if="racentData.state == '1' && racentData.isAttend == '1'
                   && racentData.attends 
                   && racentData.attends[0].couponCode !== undefined
                   && racentData.attends[0].couponCode.isUsed == 'false'" >
              去购买
          </button>

          <button class="btn_style btn btn_sty2" 
                  slot="clickEvent" 
                  v-if="racentData.state == '1' && racentData.isAttend == '1'
                   && racentData.attends 
                   && racentData.attends[0].couponCode == undefined" >
              成团中
          </button>

          <button class="btn_style btn btn_sty2" 
                  slot="clickEvent" 
                  v-if="racentData.state == '1' && racentData.isAttend == '1'
                   && racentData.attends 
                   && racentData.attends[0].couponCode
                   && racentData.attends[0].couponCode.isUsed == 'true'" >
              已购买
          </button>
          
          <!-- <button class="btn_style btn" 
                  slot="clickEvent" 
                  v-tap = "{methods: go, id: racentData.product.id, activityId: racentData.id}" 
                  v-if="racentData.state == '1'" >
              去参团
          </button> -->
          
          
          <span slot="more_content" class="mini_f">
              更多团购
          </span>
      </eveListTitle>
      <load-more :getMore="loadBottom" :allLoaded = "allLoaded">
        <panel v-for="(item, index) in exceptData" :key="index" :value="item.product">
          <span slot="fullName" class="mid_f">{{ item.product.name }}</span>
          <span slot="desc" class="sm_f col_gay"><del>原价:{{ item.product.price }}</del></span>
          <span slot="price" class="sm_f text_red">￥{{ item.activityPrice }}</span>
          <div slot="number" class="text-right">
            已有<span class="col_yellow">{{ item.attendCount }}</span>人参与/{{ item.total }}人团
            <!-- <a class="btn_style" v-tap = "{methods: go, id: item.product.id, activityId: item.id}" v-if="item.state == '1'" >去参团</a>
            <a class="btn_style btn_sty2" v-if="item.state == '0'"  @click="isLogin">期待中</a> -->
            <button slot="clickEvent" class="btn_style btn_sty2" v-if="item.state == '0'" @click="isLogin">
                期待中
            </button>
            <button class="btn_style btn_sty2" 
                    slot="clickEvent" 
                    v-if="item.state == '1' && item.isAttend == '0' && item.sentCount == item.countAll" >
                已满员
            </button>
            <button class="btn_style" 
                    slot="clickEvent" 
                    @click="attendGroup"
                    v-tap="{methods:attendGroup,id: item.id}"
                    v-if="item.state == '1' && item.isAttend == '0' && item.sentCount != item.countAll" >
                去参团
            </button>
            <button class="btn_style" 
                    slot="clickEvent" 
                    v-tap = "{methods: go, id: item.product.id, activityId: item.id,coupon:item.attends[0].couponCode.coupon}"
                    v-if="item.state == '1' && item.isAttend == '1'
                    && item.attends 
                    && item.attends[0].couponCode !== undefined
                    && item.attends[0].couponCode.isUsed == 'false'" >
                去购买
            </button>

            <button class="btn_style btn_sty2" 
                    slot="clickEvent" 
                    v-if="item.state == '1' && item.isAttend == '1'
                    && item.attends 
                    && item.attends[0].couponCode == undefined" >
                成团中
            </button>
            <button class="btn_style btn_sty2" 
                  slot="clickEvent" 
                  v-if="item.state == '1' && item.isAttend == '1'
                   && item.attends 
                   && item.attends[0].couponCode
                   && item.attends[0].couponCode.isUsed == 'true'" >
              已购买
          </button>
          </div>
        </panel>
      </load-more>
  </div>
</template>
<script>
import Vue from "vue";
// import myHeader from "components/eve-my-head";
import magicHeader from 'components/magicHeader'
import eveListTitle from "components/eve_list_title";
import panel from "components/panel";
import origin from "components/origin";
import price from "components/price";

import Loadmore from "components/loadmore";
import defaultImg from "assets/default_user_icon.png";

let query = {
  index: 5,
  count: 3
};

function getProduct(vm) {
  return Vue.prototype.$.get({
    methodName: "ListSpellDeals",
    index: query.index.toString(),
    count: query.count.toString(),
    id: vm.activityId
  }).then(res => {
    query.index += query.count;
    res.data.exceptData.forEach(val => {
      vm.exceptData.push(val);
    });
    console.log(res.data.exceptData.length);
    console.log(query.count);
    if (res.data.exceptData.length < query.count) {
      vm.allLoaded = true;
    }
  });
}

export default {
  components: {
    magicHeader,
    panel,
    eveListTitle,
    origin,
    loadMore: Loadmore,
    price
  },
  data() {
    return {
      defaultImg,
      exceptData: [],
      racentData: {},
      beginTime: 0,
      isBegin: true,
      allLoaded: false,
      shop: {},
      activityId: this.$route.params.activityId
    };
  },
  created(){
    this.getListSpellDeals()
  },
  methods: {
    attendGroup(params){
      if(this.$.userId){
        this.$.get({
          methodName:'AttendGroupBuying',
          id:params.id
        }).then(resp =>{
          resp = resp.data
          if(resp.resultCode == '100'){
            this.$.toast('领取优惠券成功')
            this.getListSpellDeals()
          }else{
            this.$.toast(resp.errorMessage)
          }
        })
      }else{
        this.$.goLogin({
          shopId: this.shop.id
        });
      }
    },
    go(params) {
      if (this.$.userId) {
        this.$router.push({
          name: "eve_groupShoppingDetails",
          params: { id: params.id, activityId: params.activityId,coupon:params.coupon }
        });
      } else {
        this.$.goLogin({
          shopId: this.shop.id
        });
      }
    },
    isLogin() {
      if (this.$.userId) {
        this.$.toast("稍等片刻，活动即将开始~");
      } else {
        this.$.goLogin({
          shopId: this.shop.id
        });
      }
    },
    // 下拉刷新
    loadBottom() {
      getProduct(this);
    },
    // 获取列表
    getListSpellDeals(){
      this.$.get({
      methodName: "ListSpellDeals",
      index: "0",
      count: "5",
      id: this.$route.params.activityId
    }).then(res =>{
      window.scrollTo(0, 0);
        this.exceptData = res.data.exceptData;
        this.racentData = res.data.racentData;
        this.shop = res.data.shop;
        let state = this.racentData.state;
        if (state === "0") {
          this.isBegin = false;
        } else {
          this.isBegin = true;
        }
        if (this.exceptData.length < 5) {
          this.allLoaded = true;
        }
    })
    }
//  created(){
//  	this.isNative = this.$.query('isAndroid') || this.$.query('isIos') 
//  },
  },
  // beforeRouteEnter(to, from, next) {
  //   Vue.prototype.$.get({
  //     methodName: "ListSpellDeals",
  //     index: "0",
  //     count: "5",
  //     id: to.params.activityId
  //   }).then(res => {
  //     next(vm => {
  //       window.scrollTo(0, 0);
  //       vm.exceptData = res.data.exceptData;
  //       vm.racentData = res.data.racentData;
  //       vm.shop = res.data.shop;
  //       let state = vm.racentData.state;
  //       if (state === "0") {
  //         vm.isBegin = false;
  //       } else {
  //         vm.isBegin = true;
  //       }
  //       if (vm.exceptData.length < 5) {
  //         vm.allLoaded = true;
  //       }
  //     });
  //   });
  // }
};
</script>
<style scoped>
#eve_groupShopping {
  background-color: #fff;
}
#eve_groupShopping .lab_style {
  position: absolute;
  top: 15px;
  right: 12px;
  color: #929292;
}

#eve_groupShopping .text-right {
  color: #b7b7b7;
  margin-right: 10px;
}

#eve_groupShopping .original {
  margin-top: 5px;
}
.btn_sty2 {
  outline: none;
  background-color: #bcbcbc;
  color: #fff;
}
.btn {
  margin-right: 10px;
  margin-left: 2%;
}
</style>