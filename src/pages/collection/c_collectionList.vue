<template>
  <div id="collection" class="background-gray">
    <magic-header titleName="收藏" :returnNative="$route.params.native"> 
      <div slot="title-right">
        <a slot="right" @click="edit" v-if="isEdit" class="right finish">
        完成
      </a>
       <a slot="right" @click="edit" class="right finish" v-if="!isEdit && queryData.length > 0">
        编辑
      </a>
      </div>
    </magic-header>

    <empty v-if="queryData.length === 0" message="您的收藏夹空空如也">
    </empty>

    <div v-else>
      <collection-edit v-if="isEdit" :value="queryData" v-on:deleteFavorite="reGet()"></collection-edit>

      <scroll :bottom="true" :marginBottom="0" v-else>
        <panel v-for="(item,index) in queryData" :key="index" :value="item.product" v-tap="{methods: go, item: item}">
          <!--<div slot="desc" class="_desc">原厂配件</div>-->
          <price slot="price" :value="item.product.price"></price>
          <!--<origin :value="item.product.marketPrice" slot="number"></origin>-->
        </panel>
      </scroll>
    </div>

  </div>
</template>

<script>
import Vue from "vue";
import panel from "components/panel";
import icarHeader from "components/my-header";
import left from "assets/left-gray.svg";
import price from "components/price";
import editIcon from "assets/edit.svg";
import collectionEdit from "components/collection-edit";

import origin from "components/origin";
import defaultEmpty from "assets/default_empty_icon.png";
import empty from "components/empty-page.vue";
import scroll from "components/scroll";
  import magicHeader from 'components/magicHeader'

function getCollection() {
  return Vue.prototype.$.get({
    methodName: "ListFavorite",
    type: "1",
    index: 0,
    count: 100
  });
}
export default {
  name: "collection",
  components: {
    magicHeader,
    empty,
    panel,
    icarHeader,
    price,
    collectionEdit,
    origin,
    scroll
  },
  methods: {
    edit() {
      // if (this.queryData.length <= 0) {
      //   return
      // }
      this.isEdit = !this.isEdit;
    },
    reGet() {
      getCollection().then(resp => {
        this.queryData = resp.data.favorites;
      });
    },
    go(params) {
      if (params.item.categoryType === "1") {
        this.$router.push({
          name: "sg_goods",
          params: { id: params.item.product.id, name: "1" }
        });
      } else {
        this.$router.push({
          name: "sg_goods_car",
          params: { id: params.item.product.id, name: "1" }
        });
      }
    }
  },
  data() {
    return {
      defaultEmpty,
      left,
      editIcon,
      queryData: {},
      isEdit: false
    };
  },
  beforeRouteEnter(to, from, next) {
    getCollection().then(resp => {
      next(vm => {
        vm.queryData = resp.data.favorites;
      });
    });
  }
};
</script>

<style>
#collection [flex="grow"] {
  flex: 0 1 auto !important;
  box-sizing: border-box !important;
}

#collection ._desc {
  display: inline-block;
  margin-bottom: 6px;
  background-color: #ffb400;
  color: #fff;
  padding: 1px 2px;
  border-radius: 3px;
  padding: 2px 10px;
}

#collection .result_empty {
  margin-top: 40px;
}

#collection .finish {
  color: #f98b0f;
  font-size: 1.2rem;
  position: relative;
  right: 10px;
  /*margin-left: 20px;*/
}

#collection .material-icons {
  line-height: 50px;
}
</style>
