<template>
  <div id="collectionEdit" class="background-gray">
    <!-- content -->
    <scroll>
      <panel v-for="(item, index) in collectionList" :key="index" :value="item.product">
        <mu-checkbox slot="chose" v-model="isSelected" :nativeValue="item.id" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle" />
        <price slot="price" :value="item.product.price"></price>
      </panel>
    </scroll>
    <!-- foot -->
    <foot class="text-right">
      <div slot>
        <mu-checkbox label="全选" v-model="isSelectAll" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle" />
        <a class="primary-button" v-tap="{methods: showDeleteConfirm}">删除</a>
      </div>
    </foot>

    <!-- remove 二次确认 -->
    <model :isShow="isConfirmShow" model-type="prompt" @closeIsModel="deleteFavorite" title="">
      您确定要删除该收藏吗?
    </model>
  </div>
</template>

<script>
/* eslint-disable */
import panel  from "components/panel";
import price  from "components/price";
import foot   from "components/foot";
import scroll from "components/scroll";
import model  from "components/model/model.vue"

export default {
  name: "collection-edit",
  components: { panel, price, foot, scroll, model },
  props: {
    collectionList: {
      type: Array,
      default: function() {
        return new Array();
      }
    }
  },
  data() {
    return {
      isSelected: [],
      isConfirmShow: false
    }
  },
  computed: {
    isSelectAll: {
      get: function() {
        if (this.collectionList.length === 0) {
          return false;
        }
        return this.collectionList.every(item => {
          return this.isSelected.indexOf(item.id) > -1;
        });
      },
      set: function(value) {
        if (value) {
          this.collectionList.forEach(item => {
            if (this.isSelected.indexOf(item.id) < 0) {
              this.isSelected.push(item.id);
            }
          });
        } else {
          if (this.isSelected.length !== this.collectionList.length) {
            return;
          }
          this.isSelected = [];
        }
      }
    }
  },
  methods: {
    showDeleteConfirm() {
      if (this.isSelected.length === 0) {
        this.$.toast("请选择商品");
        return;
      }

      this.isConfirmShow = true;
    },
    deleteFavorite(params) {
      if (params) {
        this.$.get({
          methodName: "DeleteFavorite",
          ids: this.isSelected
        }).then(resp => {
          if (resp.data.resultCode === "100") {
            this.$emit("deleteFavorite");
            this.isSelected = [];
          }
        })
      }

      this.isConfirmShow = false;
    }
  }
};
</script>

<style>
#collectionEdit {
  padding-bottom: 40px;
}

#collectionEdit .mu-checkbox-icon-uncheck {
  color: #939393;
  font-size: 40px;
}

#collectionEdit .check_circle {
  color: #548cd1;
}

#collectionEdit .primary-button {
  background-color: #f02b2b;
}

#collectionEdit i {
  font-size: 25px !important;
}

#collectionEdit .checkbox {
  display: inline-block;
  margin-left: 5px;
  float: left;
  font-size: 1.2rem;
  margin-right: 6px;
  margin-top: -16px;
}

#collectionEdit .foot {
  height: 46px;
  /*padding-top: 6px;*/
}

#collectionEdit .foot .checkbox {
  margin-top: 0px;
  margin-left: 11px;
}

#collectionEdit .foot .mu-checkbox-label {
  margin-top: 20px;
}

#collectionEdit .primary-button {
  text-align-last: center;
  height: 32px;
  line-height: 32px;
  margin-top: 6px;
  margin-bottom: 6px;
  margin-right: 1%;
  font-size: 16px;
}
</style>
