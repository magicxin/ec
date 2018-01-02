<template>
  <section id="vipRule">
    <bigHeader bgColor="#7c4900" :growthValue="Number(queryData.point || '0')" :scoreText="ranksFormated" :vipRank="vipRank" :vbean="queryData.bean" :name="queryData.name">
      <section :style="{background: 'url(' + level +')'}" slot="main-img" class="header">
        {{queryData.rank}}会员
      </section>
    </bigHeader>

    <!-- 我的权益 -->
    <section class="rule-list">
      <div class="list-title">
        <h4>我的权益</h4>
        <span @click="goToRights(vipData)">更多&gt;</span>
      </div>
      <ul class="list-content" v-if="queryRightList.length">
        <li v-for="(item, index) in queryRightList" :key="index">
          <div class="img" :style="'background-image:url('+item.logo+')'"></div>
          <div class="name">{{item.name}}</div>
        </li>
      </ul>
      <div v-if="!queryRightList.length" class="v-mall-list-none">当前会员等级没有对应的权益哦！</div>
    </section>

    <!-- v豆兑换 -->
    <section class="rule-list">
      <div class="list-title">
        <h4>V豆兑换</h4>
        <span @click="activeToVMall">更多&gt;</span>
      </div>
      <ul class="list-content" v-if="productsVMall.length">
        <li v-for="(item, index) in productsVMall" :key="index">
          <div :style="'background-image:url('+(item.image ? addPath(item.image) : defaultUser) +')'"></div>
          <p>{{item.name}}</p>
        </li>
      </ul>
      <div v-if="!productsVMall.length" class="v-mall-list-none">暂时没有可以兑换的商品哦！</div>
    </section>
  </section>
</template>

<script>
import Vue from "vue";
import bigHeader from "components/big-header.vue";
import grids from "components/grids.vue";
import grid from "components/grid.vue";
import level from "assets/level.png";
import right1 from "assets/right1.png";
import right2 from "assets/right2.png";
import right3 from "assets/right3.png";
import right4 from "assets/right4.png";
import defaultUser from "assets/default_user_icon.png";
import loadMore from "components/loadmore.vue";

let query = {
  pageNumber: 1,
  pageSize: 10
};

let loading = false;

// 获取我的权益积分等详情
function _getRights(vm) {
  if (loading) {
    return;
  }
  loading = true;
  return Vue.prototype.$
    .get({
      methodName: "QueryUserRankInfo",
      pageable: query
    })
    .then(resp => {
      query.pageNumber++;
      loading = false;
      return resp;
    });
}

// 查询我的权益等级可享受的权益
function _getQueryRight(vm) {
  return vm.$
    .get({
      methodName: "QueryRights"
    })
    .then(resp => {
      return resp;
    });
}

// 获取v豆商品
let queryV = {
  index: 0,
  count: 5
};

// 获取可兑换商品列表
function loadMoreV(vm, type) {
  Vue.prototype.$
    .get({
      methodName: "QueryProductList",
      type: type || "0",
      index: queryV.index.toString(),
      count: queryV.count.toString(),
      isBeanExchange: "1"
    })
    .then(resp => {
      if (resp.data.resultCode === "100") {
        // queryV.index = queryV.index + queryV.count;
        vm.queryDataVMall = resp.data;
        console.log(resp.data);
        vm.productsVMall = vm.productsVMall.concat(resp.data.products);
        console.log(vm.productsVMall);
        if (resp.data.products.length < queryV.count) {
          vm.allLoaded = true;
        }
      }
    });
}
export default {
  components: {
    bigHeader,
    grids,
    grid,
    loadMore
  },
  methods: {
    // loadBottom() {
    //   _getRights().then(resp => {
    //     const _length = resp.data.integralDetails.length;
    //     if (_length) {
    //       resp.data.integralDetails.forEach(val => {
    //         this.queryData.integralDetails.push(val);
    //       });
    //       if (_length < query.pageSize) {
    //         this.allLoaded = true;
    //       }
    //     }
    //   });
    // },
    getRightsList() {
      _getQueryRight(this).then(resp => {
        resp.data.rightsCategorys.forEach(data => {
          data.logo = this.addPath(data.logo);
          this.queryRightList.push(data);
        });
        console.log(this.queryRightList);
      });
    },
    // 获取V豆兑换, 产品列表
    getVMallList() {
      loadMoreV(this);
    },
    // V豆 更多->跳转至商城
    activeToVMall() {
      let query = {
        name: "sg_goodsList",
        params: {
          isVBean: true
        }
      };
      this.$router.push(query);
    },
    //会员权益 新
    goToRights(rank) {
      console.log(rank);
      this.$router.push({
        name: "vb_vipRights",
        params: {
          vipRank: rank
        }
      });
    },
    // goForRight() {
    //   // 会员权益
    //   this.$router.push({
    //     name: "cb_forRight",
    //     query: {
    //       right: this.queryData.description,
    //       name: this.queryData.shop.name,
    //       shopId: this.queryData.shop.id
    //     }
    //   });
    // }
  },
  created() {
    this.getRightsList();
    this.getVMallList();
  },
  data() {
    return {
      allLoaded: false,
      level,
      query: query,
      // rights: [
      //   {
      //     icon: right1,
      //     name: "免费救援"
      //   },
      //   {
      //     icon: right2,
      //     name: "免费洗车"
      //   },
      //   {
      //     icon: right3,
      //     name: "优先服务"
      //   },
      //   {
      //     icon: right4,
      //     name: "免费洗车"
      //   }
      // ],
      queryData: {},
      ranksFormated: [],
      vipRank: 0,
      rankNum: [],
      queryRightList: [],
      queryDataVMall: {},
      productsVMall: [],
      vipData: "",
      defaultUser: defaultUser
    };
  },
  beforeRouteEnter(to, from, next) {
    _getRights().then(resp => {
      if (resp.data.resultCode !== "100") {
        this.$.toast("服务端出错");
      }
      next(vm => {
        let _index;
        vm.queryData = resp.data;
        console.log(vm.queryData);
        vm.queryData.ranks.forEach((val, index) => {
          if (vm.queryData.rank === val.name) {
            // 建议:id比name用来作主键更好(暂未修改)
            // 获取当前VIP等级, 在集合中的index, 在查询更多权益的时候, 作初始化数据
            // 注意: ListRankRights(更多权益->vb_vipRights页面), 与QueryUserRankInfo(当前页面),查出的Ranks, 顺序是相反的
            vm.vipData = vm.queryData.ranks.length - index - 1;
            _index = index;
            console.log(vm.vipData);
          }

          vm.ranksFormated.push({
            name: val.name, // vip名称
            score: val.point, // vip等级分数区间
            color: "#fff"
            // ,
            // scoreNum: ""
          });

          // vm.rankNum.push(val.point);
        });

        // vm.rankNum = vm.rankNum.reverse(); 
        // for (var i = 0; i < vm.ranksFormated.length; i++) {
        //   vm.ranksFormated[i].scoreNum = vm.rankNum[i];
        // }

        // 获取中间成长值中间的分数值
        // let vipRankNumber =
        //   vm.ranksFormated.length - Number(vm.queryData.rank.substring(1, 2)) - 1;
        
        // 是否满级了?
        if (Number(vm.queryData.point || "0") >= vm.ranksFormated[vm.ranksFormated.length - 1].score) {
          vm.vipRank = vm.ranksFormated[vm.ranksFormated.length - 1].score;
        } else {
          vm.vipRank = vm.ranksFormated[_index+1].score;
        }

        //          vm.rank = vm.ranksFormated.reverse()
        if (resp.data.integralDetails.length < query.pageSize) {
          vm.allLoaded = true;
        }
      });
    });
  }
};
</script>

<style lang="scss">
@mixin border {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

#vipRule {
  .divide {
    border: none;
  }
  .main_title {
    padding: 10px;
    font-weight: normal;
    position: relative;
    &::after {
      @include border;
    }
  }
  .grid {
    border: none;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    img {
      width: 70% !important;
      margin-bottom: 5px;
    }
    color: black;
  }
  .header {
    height: 90px;
    width: 100%;
    background-size: cover !important;
    background-repeat: no-repeat;
    line-height: 115px;
    font-size: 1.1rem;
    color: #fff;
    padding-top: 0.8rem;
  }
  .main-img {
    text-align: center;
    /*width: 40% !important;*/
    width: 140px !important;
  }
  .title {
    padding: 10px 10px 4px 20px;
    font-weight: normal;
    position: relative;
    &::after {
      @include border;
    }
    &::before {
      content: "|";
      position: absolute;
      font-weight: bold;
      transform: scaleX(1.5);
      left: 10px;
      color: red;
    }
  }
  .record {
    padding: 10px;
    position: relative;
    h5 {
      height: 30px;
      line-height: 15px;
      font-weight: normal;
      font-size: 1.2rem;
    }
    &::after {
      @include border;
    }
  }
  .header-progress-score {
    color: #fff;
    text-align: center;
    margin-top: -1rem;
    padding-bottom: 0.6rem;
    font-size: 1.2rem;
    span {
      color: #f98700;
    }
  }
  .vip-rule-distance {
    color: #f2efec;
    font-size: 1rem;
    padding: 0.5rem 0 0.5rem 1.2rem;
  }
  .rule-list {
    width: 100%;
    margin-top: 1rem;
    border-top: 3px solid #b8b8b8;
    border-bottom: 3px solid #b8b8b8;
    padding: 0.5rem 1rem;
    .list-title {
      overflow: hidden;
      h4 {
        margin-top: 0.2rem;
        font-size: 1.2rem;
        float: left;
        font-weight: normal;
      }
      span {
        float: right;
      }
    }
    .list-content {
      margin-top: 2rem;
      overflow: hidden;
      li {
        display: flex;
        padding: 4px;
        .img {
          width: 3em;
          height: 3em;
          background-size: cover;
        }
        .name {
          display: flex;
          align-items: center;
          border: 1px solid #eee;
          margin-left: 1em;
        }
        p {
          line-height: 1.5rem;
        }
      }
    }
    .v-mall-list-none {
      margin-top: 1rem;
      height: 5rem;
      text-align: center;
      line-height: 3rem;
      font-size: 1.1rem;
    }
  }
}
</style>
