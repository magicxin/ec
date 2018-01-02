<template>
  <div id="collection" class="background-gray">
    <!-- header -->
    <icar-header main-text="收藏" bgColor="#F7F7F7" textColor="#242424">
      <img :src="left">
      <a slot="right" @click="operation_type = 1 - operation_type" class="right finish" v-show="queryData.length > 0">
        {{ operation_type == 0 ? '编辑' : '完成' }}
      </a>
    </icar-header>

    <!-- content empty -->
    <empty v-if="isEmpty" message="您的收藏夹空空如也"></empty>
    <!-- content -->
    <div v-else>
      <!-- 1. view -->
      <collection-view :collectionList="queryData" v-show="operation_type == 0"></collection-view>
      <!-- 2. edit -->
      <collection-edit :collectionList="queryData" v-show="operation_type == 1" @deleteFavorite="removeCallBack()"></collection-edit>
    </div>
  </div>
</template>

<script>
// module
import Vue            from "vue";
import icarHeader     from "components/my-header";
import empty          from "components/empty-page";
import collectionView from "./c_collectionView"
import collectionEdit from "./c_collectionEdit"

// image
import left from "assets/left-gray.svg";

const OPERATION_TYPE_VIEW = 0 // 视图模式
const OPERATION_TYPE_EDIT = 1 // 编辑模式

/**
 * get Collection List
 * @augments  
 */
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
  components: { icarHeader, empty, collectionEdit, collectionView },
  data() {
    return {
      left,
      queryData: [],
      operation_type: OPERATION_TYPE_VIEW,
      isEmpty: false
    };
  },
  methods: {
    removeCallBack() {
      getCollection().then(resp => {
        this.queryData = resp.data.favorites
        if (!this.queryData || this.queryData.length == 0) {
          this.operation_type = OPERATION_TYPE_VIEW
          this.isEmpty = true
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    getCollection().then(resp => {
      next(vm => {
        vm.queryData = resp.data.favorites;
        vm.isEmpty = vm.queryData.length === 0 ? true : false
      });
    })
  }
};
</script>

<style>
#collection .finish {
  color: #f98b0f;
  font-size: 1.2rem;
  position: relative;
  right: 10px;
}
#collection .material-icons {
  line-height: 50px;
}
</style>
