
<template>
  <div id="timeSpike">
      <magic-header :isEve="true" :titleName="$route.query.title ? $route.query.title : '限时秒杀'" :returnNative="$route.params.native"></magic-header>
    <!-- <my-header main-text="限时秒杀" bg-color="#fff" text-color="#000" :shop="shop">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <!--<div class="tab_list">
      <ul ref="wrap" v-show="seckillsTabs">
        <li v-for="tab in seckillsTabs" class="tab_li mid_f" v-on:click="tabCheck(tab.beginDate)">{{ tab.beginDate | formatTime }} <br> <span class="mini_f">{{ tab.beginDate | formatNowState}}</span></li>
      </ul>
    </div>
    <div class="divide"></div>-->
    <div>
      <eveListTitle v-if="racentData.product">
        <img :src="racentData.cover ? addPath(racentData.cover) : defaultImg" width="100%" height="150px" alt=""
             slot="imageShow">
        <div slot="title" class="mid_f">
          {{ racentData.product.name }}
        </div>
        <span slot="nowPrice" class="mid_f">
          ￥{{ racentData.activityPrice || 0}}
      </span>
        <span slot="beforePrice" class="mini_f">
          原价:￥{{ racentData.product.price || 0 }}
      </span>
        <span slot="needNum" class="mini_f">
         <label>已售:{{ racentData.sentCount || 0 }}件/余<span
           class="col_yellow">{{ Number(racentData.countAll) - Number(racentData.sentCount) }}</span>件</label>
      </span>
       <button slot="clickEvent" class="btn_style btn btn_sty2" 
               v-if="racentData.state == '0'" 
               @click="isLogin">
          期待中
        </button>
        <button slot="clickEvent" class="btn_style btn"
                v-tap="{methods: attendSpike, id: racentData.id}"
                v-if="racentData.state == '1' 
                && racentData.attends[0] === undefined">
          去抢券
        </button>
        <button slot="clickEvent" class="btn_style btn" 
                v-tap="{methods: go, id: racentData.product.id, activityId: racentData.id,coupon:racentData.attends[0].couponCode.coupon}"
                v-if="racentData.state == '1' 
                && racentData.attends[0] 
                &&racentData.attends[0].couponCode !== undefined">
          去购买
        </button>
      
        <span slot="more_content" class="mini_f">
        热款抢购中
      </span>
        <span slot="overTime" class="span_bor mini_f">
       <small v-if="racentData.state == '1'">距结束</small>
       <small v-if="racentData.state == '0'">距开始</small>
        <span v-if="surplusTime.endDays > 0">{{ surplusTime.endDays }}</span> <small
          v-if="surplusTime.endDays > 0">天</small> <span>{{ surplusTime.surplusHours
          }}</span>时 <span>{{ surplusTime.surplusMinutes }}</span>分 <span>{{ surplusTime.surplusSeconds }}</span>秒
      </span>
      </eveListTitle>
      <!--<load-more :getMore="loadBottom" :allLoaded = "allLoaded">-->
      <panel v-show="exceptData" v-for="(item,index) in exceptData" :key="index" :value="item.product">
        <span slot="fullName" class="mid_f">{{ item.product.name }}</span>
        <span slot="desc" class="sm_f col_gay"><del>原价:{{ item.product.price }}</del></span>
        <span slot="price" class="sm_f text_red">￥{{ item.activityPrice }}</span>
        <div slot="number" class="text-right">
          <label>已售:{{ item.sentCount || 0 }}件/余<span class="col_yellow">{{ item.countAll - item.sentCount
            }}</span>件</label>
          <a class="btn_style" 
            v-tap="{methods: go, id: item.product.id, activityId: item.id,coupon:item.attends[0].couponCode.coupon}"
               v-if="item.state == '1' 
                &&item.attends[0] 
                &&item.attends[0].couponCode !== undefined">
            去购买</a>
          <a class="btn_style" 
            v-tap="{methods: attendSpike, id: item.id}" 
            v-if="item.state == '1' 
            && item.attends[0] === undefined">
            去抢券</a>
            
          <a class="btn_style btn_sty2" v-if="item.state == '0'" @click="isLogin">期待中</a>

        </div>
      </panel>
      <!--</load-more>-->
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import magicHeader from "components/magicHeader";
import eveListTitle from "components/eve_list_title";
import panel from "components/panel";
import origin from "components/origin";
import price from "components/price";

// import Loadmore from 'components/loadmore'
import defaultImg from "assets/default_user_icon.png";

//
// let query = {
//   index: 5,
//   count: 3
// }

// function getProduct (vm) {
//   return Vue.prototype.$.get({
//     methodName: 'ListSeckill',
//     index: query.index.toString(),
//     count: query.count.toString()
//   }).then(res => {
//     query.index += query.count
//     res.data.seckills[vm.tabIndex].seckillItems.forEach(val => {
//       vm.exceptData.push(val)
//     })
//     if (res.data.spellDeals.spellDealsItems.length < query.count) {
//       vm.allLoaded = true
//     }
//   })
// }

export default {
  data() {
    return {
      defaultImg,
      title: {
        needNum: 20
      },
      exceptData: [],
      racentData: {},
      shop: {},
      endTime: null,
      beginTime: null,
      isBegin: true,
      surplusTime: {
        surplusHours: "00",
        surplusMinutes: "00",
        surplusSeconds: "00",
        endDays: 0
      },
      nowState: null,
      tabIndex: 1,
      allLoaded: false,
      activityId: this.$route.params.activityId
    };
  },

  components: {
    magicHeader,
    panel,
    eveListTitle,
    origin,
    price
    // loadMore: Loadmore
  },
  filters: {
    formatTime: function(value) {
      return value.split(" ")[1].slice(0, 5);
    },
    formatNowState: function(value) {
      let nowTimes = new Date().getTime();
      let beginTimes = new Date(
        value.replace(new RegExp("-", "gm"), "/")
      ).getTime();
      if (nowTimes > beginTimes) {
        return "抢购中";
      } else {
        return "期待中";
      }
    }
  },
  methods: {
    getTimeSpike() {
      let ProductCategory = {
        methodName: "ListSeckill",
        index: "0",
        count: "100",
        id: this.$route.params.activityId
      };

      this.$.get(ProductCategory).then(res => {
        window.scrollTo(0, 0);
        this.exceptData = res.data.exceptData;
        this.racentData = res.data.racentData;
        this.shop = res.data.shop;
        this.endTime = new Date(
          this.racentData.endDate.replace(/-/g, "/")
        ).getTime();
        this.beginTime = new Date(
          this.racentData.beginDate.replace(/-/g, "/")
        ).getTime();
        let nowTime = new Date().getTime();
        if (this.beginTime - nowTime > 0) {
          this.isBegin = false;
        } else {
          this.isBegin = true;
        }
      });
    },
    handleTabChange(val) {
      this.activeTab = val;
    },
    attendSpike(params) {
      if (this.$.userId) {
        this.$.get({
            methodName: "AttendSeckill",
            id: params.id
          })
          .then(resp => {
            resp = resp.data;
            if (resp.resultCode == "100") {
              this.$.toast("领取优惠券成功");
              this.getListSpike();
            } else {
              this.$.toast(resp.errorMessage);
            }
          });
      } else {
        this.$.goLogin({
          shopId: this.shop.id
        });
      }
    },
    go(params) {
      if (this.$.userId) {
        this.$router.push({
          name: "eve_timeSpikeDetails",
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
    getListSpike(){
      let ProductCategory = {
        methodName: "ListSeckill",
        index: "0",
        count: "100",
        id: this.$route.params.activityId
      };
      let vm = this
       vm.$.get(ProductCategory).then(res => {
          window.scrollTo(0, 0);
          vm.exceptData = res.data.exceptData;
          vm.racentData = res.data.racentData;
          vm.shop = res.data.shop;
          vm.endTime = new Date(
            vm.racentData.endDate.replace(/-/g, "/")
          ).getTime();
          vm.beginTime = new Date(
            vm.racentData.beginDate.replace(/-/g, "/")
          ).getTime();
          let nowTime = new Date().getTime();
          if (vm.beginTime - nowTime > 0) {
            vm.isBegin = false;
          } else {
            vm.isBegin = true;
          }
        })
    }
    // 下来刷新
    // loadBottom () {
    //   getProduct(this)
    // }
  },
  created(){
    console.log('33333333')
    this.getListSpike()
  },
  // beforeRouteEnter(to, from, next) {
    // let ProductCategory = {
    //   methodName: "ListSeckill",
    //   index: "0",
    //   count: "100",
    //   id: to.params.activityId
    // };

    // Vue.prototype.$.get(ProductCategory).then(res => {
    //   next(vm => {
    //     window.scrollTo(0, 0);
    //     vm.exceptData = res.data.exceptData;
    //     vm.racentData = res.data.racentData;
    //     vm.shop = res.data.shop;
    //     vm.endTime = new Date(
    //       vm.racentData.endDate.replace(/-/g, "/")
    //     ).getTime();
    //     vm.beginTime = new Date(
    //       vm.racentData.beginDate.replace(/-/g, "/")
    //     ).getTime();
    //     let nowTime = new Date().getTime();
    //     if (vm.beginTime - nowTime > 0) {
    //       vm.isBegin = false;
    //     } else {
    //       vm.isBegin = true;
    //     }
    //   });
    // });
  // },
  mounted() {
    /* eslint-disable */
    setInterval(() => {
      let nowTime = new Date().getTime();
      let differTime = 0;
      // 判断当前活动是否开始
      if (this.beginTime - nowTime > 0) {
        differTime = this.beginTime - nowTime;
        this.isBegin = false;
      } else {
        differTime = this.endTime - nowTime;
        this.isBegin = true;
      }
      let endDays, surplusHours, surplusMinutes, surplusSeconds;
      // if (differTime > 0) {
      endDays = Math.floor(differTime / 86400000);
      differTime -= endDays * 86400000;
      surplusHours = Math.floor(differTime / 3600000);
      differTime -= surplusHours * 3600000;
      surplusMinutes = Math.floor(differTime / 60000);
      differTime -= surplusMinutes * 60000;
      surplusSeconds = Math.floor(differTime / 1000);
      if (surplusHours < 10) {
        surplusHours = surplusHours;
      }
      if (surplusMinutes < 10) {
        surplusMinutes = surplusMinutes;
      }
      if (surplusSeconds < 10) {
        surplusSeconds = surplusSeconds;
      }
      // let strTime = endDays + '天' + surplusHours + '小时' + surplusMinutes + '分钟' + surplusSeconds + '秒'
      this.surplusTime.surplusHours = Number(surplusHours);
      this.surplusTime.surplusMinutes = Number(surplusMinutes);
      this.surplusTime.surplusSeconds = Number(surplusSeconds);
      this.surplusTime.endDays = Number(endDays);
    }, 500);
    // setTimeout(() => {
    //   document.querySelectorAll('.tab_li')[0].style.color = '#F98700'
    //   let aa = Array.from(document.querySelectorAll('.tab_li'))
    //   aa.forEach((x, index) => {
    //     x.addEventListener('click', () => {
    //       this.seckills = this.seckillsTabs[index]
    //       this.tabIndex = index
    //       // query = {
    //       //   index: 5,
    //       //   count: 3
    //       // }
    //       aa.forEach((x) => {
    //         x.style.color = '#666666'
    //       })
    //       this.endTime = new Date(this.seckills.endDate).getTime()
    //       document.querySelectorAll('.tab_li')[index].style.color = '#F98700'
    //     })
    //   })
    // }, 10)
  }
};
</script>
<style scoped>
#timeSpike {
  background-color: #fff;
}

.lab_style {
  position: absolute;
  top: 15px;
  right: 12px;
  color: #929292;
}

.text-right {
  color: #b7b7b7;
  margin-right: 10px;
}

.original {
  margin-top: 5px;
}

.mu-tabs {
  background-color: #fff;
}

.mu-tab-link-highlight {
  background-color: #f98700;
}

.span_bor {
  margin-right: 14px;
}

.span_bor span {
  background-color: #000;
  color: #fff;
  padding: 2px;
}

.tab_list {
  width: 100%;
}

.tab_list ul {
  white-space: nowrap;
}

.tab_list ul li {
  display: inline-block;
  padding: 6px 0px;
  width: 20%;
  text-align: center;
  color: #666666;
}

.tab_list ul .tab_actived {
  border-bottom: 2px solid #f88701;
  color: #f98700;
}

.tab_list ul {
  overflow: initial;
  position: relative;
}

.btn_sty2 {
  background-color: #bcbcbc;
  color: #fff;
}

.btn {
  margin-right: 10px;
  margin-left: 2%;
}
</style>