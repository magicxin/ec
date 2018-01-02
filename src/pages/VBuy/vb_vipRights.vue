<template>
  <div id="vip-rights">
    <my-header main-text="会员权益" bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>

    <!--<ul class="rights-title" :style="style" @click="dragUl(maxPosition)" id="dragUl">-->
    <!--<li v-for="(item,index) in queryData" :style="{width:liWidth}">-->
    <!--<div v-bind:class="{active:index == vipRankNum}" :style="'background-image:url('+item.image+')'"-->
    <!--@click="activeLi(index)"></div>-->
    <!--<p>{{item.name}}</p>-->
    <!--</li>-->
    <!--</ul>-->

    <!-- rights list -->
    <scroll class="rights-box" :bottom="true" marginBottom="0" :top="true">
      <ul class="rights-title" :style="style" id="dragUl">
        <li v-for="(item, index) in queryData" :style="{width:liWidth}" :key="index">
          <div v-if="item.isPresent =='0'" v-bind:class="{active:index == vipRankNum}" :style="'background-image:url('+item.image+')'" @click="activeLi(index)"></div>
          <div v-if="item.isPresent =='1'" v-bind:class="{active:index == vipRankNum}" :style="'background-image:url('+item.image+')'" @click="activeLi(index)"></div>
          <p>{{item.name}}</p>
          <div v-if="index == vipRankNum" class="triangle"></div>
        </li>
      </ul>
    </scroll>

    <!-- rights detail -->
    <div class="rights-content">
      <ul class="list-content" v-if="rightsContent.rights.length">
        <li v-for="(item, index) in rightsContent.rights" :key="index">
          <div class="img" :style="'background-image:url('+item._logo+')'"></div>
          <div class="name">{{item.name}}</div>
        </li>
      </ul>
      <empty v-if="rightsContent.rights.length === 0" message="当前会员等级没有对应的权益哦！"></empty>
    </div>
  </div>
</template>
<script>
import myHeader from "components/my-header";
import level from "assets/level.png";
import favIcon from "assets/favicon.png";
import diamond from "assets/icon_diamond.png";
import loadMore from "components/loadmore.vue";
import scroll from "components/scroll.vue";
import empty from "components/empty-page.vue";

let query = {
  methodName: "ListRankRights",
  clientType: 0
};

function _getRightsList(vm) {
  return vm.$.get(query).then(resp => {
    return resp;
  });
}

export default {
  name: "vb_vipRights",
  components: {
    myHeader,
    loadMore,
    scroll,
    empty
  },
  data() {
    return {
      queryData: [],
      liWidth: "",
      ulPosition: "0",
      style: {
        width: "0",
        left: "0",
        height: "100%"
      },
      maxPosition: "",
      rightsContent: {
        rights: []
      },
      vipRankNum: 0
    };
  },
  methods: {
    handleTabChange(val) {
      this.activeTab = val;
    },
    getRightsList() {
      _getRightsList(this).then(resp => {
        console.log(resp.data);
        resp.data.ranks.forEach(data => {
          if (data.isPresent === "1") {
            if (data.image) {
              data.image = this.addPath(data.image);
            } else {
              data.image = favIcon;
            }
          } else {
            if (data.image) {
              data.image = this.addPath(data.image);
            } else {
              data.image = diamond;
            }
          }

          this.queryData.push(data);
        });
        let _num = this.queryData.length;
        this.style.width = 25 * _num + "%";
        this.liWidth = 100 / _num + "%";
        let arseWidth = document.body.clientWidth;
        this.maxPosition = -arseWidth / 4 * (_num - 4);
        //获取当前等级的vip 权益
        this.activeLi(this.vipRankNum);
      });
    },
    activeLi(index) {
      console.log(index);
      this.vipRankNum = index;
      this.rightsContent = this.queryData[index];
      this.rightsContent.rights.forEach(item => {
        item._logo = this.addPath(item.logo);
      });
      console.log(this.rightsContent);

      // 算出应该被定位的权益位置并滚动到该位置
      let countRights = this.queryData.length;
      setTimeout(() => {
        let scrollX = dragUl.scrollWidth * (Number(index) / countRights);
        dragUl.parentElement.scrollTo(scrollX, 0);
      }, 0);
    }
  },

  created() {
    this.getRightsList();
    this.vipRankNum = this.$route.params.vipRank;
    console.log(this.vipRankNum);
  }

  //    beforeRouteEnter (to, from, next){
  //      console.log(to)
  //    }
};
</script>

<style lang="scss">
#vip-rights {
  .rights-box {
    padding-top: 1rem;
    background-color: #e9e9e9;
    height: 8rem;
    .rights-title {
      overflow: hidden;
      li {
        float: left;
        text-align: center;
        div {
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          display: inline-block;
          background-size: cover;
        }
        div.active {
          width: 4rem;
          height: 4rem;
        }
        .triangle {
          border-radius: 0;
          width: 0;
          height: 0;
          border: 1rem solid;
          border-color: transparent transparent #fff transparent;
        }
      }
    }
  }
  .rights-content {
    margin-top: 8rem;
    .list-content {
      padding-top: 1rem;
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
      }
    }
  }
}
</style>

