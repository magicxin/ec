<template>
  <div id="coupon_box">
    <!-- 有效优惠券 -->
    <div class="one_coupon" v-for="(item, index) in effectiveCoupons" :key="index">
      <div layout="row" class="coupon_panel">
        <div class="clickToInfo" @click="goToInfo(item)"></div>
        <div flex="33" class="coupon_img text-center" :class="{coupon_img_hasuse: item.state !== '2'}" layout="column">
          <div flex layout="row" layout-align="center center">
            <div flex="33" class="coupon_icon text-left">¥</div>
            <div flex="66" class="coupon_price text-center">{{item.amount}}</div>
          </div>
          <div flex="nogrow" class="coupon_desc">
            {{item.minimumPrice ? '满' + item.minimumPrice + '减' + item.amount : item.desc}}
          </div>
        </div>
        <img :src="ticket" alt="" v-if="item.state === '2'">
        <img :src="gray" alt="" v-else>
        <div flex="66" layout="column" class="coupon_detail">
          <a class="primary-button" v-tap="{methods: use, item: item}" 
                                    v-if="item.state === '2'&&(item.type === '2' || item.type === '3')">核销</a>
           <a class="primary-button" v-tap="{methods: use, item: item}" 
                                    v-if="item.state === '2'&&item.type !== '2'&&item.type !== '3'">使用</a>                         
          <a class="primary-button hasUse" v-if="item.state === '3'">已过期</a>
          <a class="primary-button hasUse" v-if="item.state === '4'">已使用</a>
          <h4>{{item.name}}</h4>
          <p flex>{{item.couponDesc}}</p>
          <p flex>有效期:{{item.beginDate}}至{{item.endDate}}</p>
        </div>
      </div>
    </div>

    <!-- button: 是否展示失效的优惠券 -->
    <div style="padding: 20px;" v-if="invalidCoupons && invalidCoupons.length > 0 && !showInvalidCoupons">
      <mu-raised-button fullWidth 
        :label="toggleShowTitle" 
        @click="toggleInvalidCoupons" 
        labelClass="toggle-button" />
    </div>
    <!-- 失效优惠券 -->
    <div class="one_coupon" v-for="(item, index) in invalidCoupons" :key="index" v-show="showInvalidCoupons">
      <div layout="row" class="coupon_panel">
        <div class="clickToInfo" @click="goToInfo(item)"></div>
        <div flex="33" class="coupon_img text-center" :class="{coupon_img_hasuse: item.state !== '2'}" layout="column">
          <div flex layout="row" layout-align="center center">
            <div flex="33" class="coupon_icon text-left">¥</div>
            <div flex="66" class="coupon_price text-center">{{item.amount}}</div>
          </div>
          <div flex="nogrow" class="coupon_desc">
            {{item.minimumPrice ? '满' + item.minimumPrice + '减' + item.amount : item.desc}}
          </div>
        </div>
        <img :src="ticket" alt="" v-if="item.state === '2'">
        <img :src="gray" alt="" v-else>
        <div flex="66" layout="column" class="coupon_detail">
          <!-- <a class="primary-button" v-tap="{methods: use, item: item}" v-if="item.state === '2'">使用</a> -->
          <a class="primary-button hasUse" v-if="item.state === '3'">已过期</a>
          <a class="primary-button hasUse" v-if="item.state === '4'">已使用</a>
          <h4>{{item.name}}</h4>
          <p flex>{{item.couponDesc}}</p>
          <p flex>有效期:{{item.beginDate}}至{{item.endDate}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ticket from "assets/pic_ticket_bg_y.png";
import gray from "assets/gray.png";
import Order from "tools/order.service.js";
let order = Order.getInstance();

// 常量
const COUPON_EFFECTIVE = "2"; // 优惠券状态-可用
const COUPON_INVALID = "3"; // 优惠券状态-已过期
const COUPON_USED = "4"; // 优惠券状态-已使用

export default {
  name: "coupon",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
      // limit: String
    },
    fromState: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      gray,
      ticket,
      showInvalidCoupons: false
    };
  },
  computed: {
    effectiveCoupons() {
      return this.value.filter(item => {
        return item.state === COUPON_EFFECTIVE;
      });
    },
    invalidCoupons() {
      return this.value.filter(item => {
        return item.state === COUPON_INVALID || item.state === COUPON_USED;
      });
    },
    toggleShowTitle() {
      return this.showInvalidCoupons ? "关闭" : "查看已失效的劵";
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("from.name:" + from.name);
      vm.fromState = from.name;
    });
  },
  methods: {
    mytest() {
      alert("0000000000");
    },
    use(params) {
      // this.$router.push({
      //   name: 'sg_goodsList'
      // })
      console.log(params.item.type);
      if (   
        this.fromState === null ||
        this.fromState == "cb_couponInfo" ||
        this.fromState == "orderManage"
      ) {
        if(params.item.type === '1'){
          this.$router.push({
            name: "sg_goodsList"
          });
        }else if(params.item.type === '2'|| params.item.type === '3'){
          this.$router.push({
            name: "cb_couponInfo",
            query: {
              id: params.item.id
            }
          });
        }else if(params.item.type === '4'){ //团购券
          this.$router.push({
            name:'eve_groupShoppingDetails',
            params:{
              coupon:{
                name:item.name,
                id:item.id
              },
              activityId:item.activityId
            }
          })
        }else if(params.item.type === '5'){  //秒杀券
          this.$router.push({
            name: "eve_timeSpikeDetails",
            params:{
              coupon:{
                name:item.name,
                id:item.id
              },
              activityId:item.activityId
            }
          });
        }else{
          this.$router.push({
            name: "sg_goodsList"
          });
        }
        
      } else {
        order.useCoupon(params.item);
        console.log("111111");
        this.$router.back();
        this.$router.push({
          name: this.fromState
        });
      }
    },
    goToInfo(item) {
      console.log(item.id);
      this.$router.push({
        name: "cb_couponInfo", 
        query: {
          id: item.id
        }
      });
    },
    toggleInvalidCoupons(){
      this.$el.scrollTop +=50 
      this.showInvalidCoupons = !this.showInvalidCoupons;
    }
  }
};
</script>

<style lang="scss">
#coupon_box .primary-button {
  position: absolute;
  right: 10px;
  line-height: 25px;
  height: 25px;
  width: 50px;
  background-color: #f98700;
}

#coupon_box .hasUse {
  color: #b0b0b0;
  background-color: #fff;
}

#coupon_box .one_coupon {
  margin: 10px;
  padding-top: 10px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

#coupon_box .coupon_panel img {
  position: absolute;
  right: -5px;
  height: 83px;
  // z-index: 999;
  left: 33%;
}

#card .scroll-box {
  background-color: #fafafa;
}

#coupon_box .coupon_panel {
  background-color: #fff;
  overflow: hidden;
  min-height: 80px;
  border-radius: 4px;
}

#coupon_box .coupon_img {
  background-color: #ffac30;
  position: relative;
  height: auto;
  color: #fff;
}

#coupon_box .coupon_img_hasuse {
  background-color: #b0b0b0;
}

#coupon_box .coupon_icon {
  font-size: 1.4rem;
}

#coupon_box .coupon_price {
  font-size: 2.4rem;
  text-align: left;
}

#coupon_box .coupon_detail {
  padding: 7px 5px 7px 20px;
  position: relative;
  h4 {
    font-weight: normal;
    width: calc(100% - 60px);
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    text-overflow: ellipsis;
    height: 1.23rem;
  }
}

#coupon_box .coupon_desc {
  /*margin-top: -5px;*/
  height: 30px;
  line-height: 25px;
}

#coupon_box h4 {
  font-size: 1.2rem;
  margin-top: 5px;
}

#coupon_box p {
  margin-top: 10px;
  color: #a7a7a7;
  font-size: 0.9rem;
}

#coupon_box p + p {
  margin-top: 9px;
}

#coupon_box .coupon_panel {
  position: relative;
  .clickToInfo {
    position: absolute;
    width: 80%;
    height: 100%;
    z-index: 8;
  }
}

#coupon_box .toggle-button {
  font-size: 15px;
}
</style>
