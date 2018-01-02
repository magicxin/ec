<template>
  <div id="collectionView" class="background-gray">
    <scroll :bottom="true" :marginBottom="0">
      <panel v-for="(item,index) in collectionList" :key="index" :value="item.product" v-tap="{methods: go, item: item}">
        <price slot="price" :value="item.product.price"></price>
      </panel>
    </scroll>
  </div>
</template>

<script>
// module
import Vue    from "vue";
import panel  from "components/panel";
import price  from "components/price";
import scroll from "components/scroll";

export default {
  name: "collection-view",
  components: { panel, price, scroll },
  props: {
    collectionList: {
      type: Array,
      default(){
        return new Array()
      }
    }
  },
  methods: {
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
  }
}; 
</script>

<style>
</style>
