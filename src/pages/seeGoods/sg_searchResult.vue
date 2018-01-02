
<template>
  <div id="search-result">
    <!--<searchGoods bg-color="#f7f7f7">
      <img slot="left" src="../../assets/left-gray.svg" @click="goBack()">
      <form action="" name="search" slot="search" onsubmit="return false">
        <input type="search" style="margin-left:20px" class="search search-bar" v-model="isGoodSearch"  placeholder="请输入商品名称" maxlength="100" id="search" autofocus="autofocus" autocomplete="off" >
      </form>
      <button class="cancel" slot="right" @click="cancel">取消</button>
    </searchGoods>-->
    <div v-if="sg_view == 'searchOk'" class="sear-body-content">
      <div>
        <order-header @checked="checkedOrderHeader" ></order-header>
      </div>
      <scroll :bottom="true" marginBottom="0" ref="scroll">
        <Loadmore :getMore="getProductList" :allLoaded="allLoad">
          <div layout="column" :style="{overflow: 'scroll', height: insert}">
            <panel  class="content-main"
                    :value = "item"
                    v-tap = "{methods: go, id: item.id, categoryType: item.categoryType}"
                    v-for="(item, index) in productList.products" :key="index"
                    flex="noshrink">
              <span slot="fullName">{{ item.name }}</span>
              <span slot="desc" class="col_gay desc" v-if="item.categoryType != '0'"><del>原价:{{ item.marketPrice }}</del></span>
              <span slot="price" class="sm_f text_red" v-if="item.categoryType != '0'">￥{{ item.price }}</span>
              <span slot="price" class="sm_f text_red" v-if="item.categoryType == '0'">订金￥{{ item.subscription || '0.00'}}</span>
              <span slot="number">销量：{{ item.sales || '0' }}</span>
            </panel>
          </div>
        </Loadmore>
      </scroll>
    </div>
    <div v-if="sg_view == 'noSearch'">
      <img src="../../assets/default_empty_icon.png" alt="" class="noResult_img">
      <p class="noResult_p sm_f">没有搜索到此结果!</p>
    </div>
  </div>
</template>
<script>
import panel from 'components/panel.vue'
import Loadmore from 'components/loadmore'
import searchGoods from 'components/searchGoods'
import orderHeader from 'components/order-header'


import scroll from 'components/scroll'
import vue from 'vue'
//

// 获取商品列表接口

function getProductList (vue) {
  const _scroll = vue.$refs.scroll
  document.getElementById('search').blur()

  vue.productData.selectValue = vue.isGoodSearch
  vue.$.get(vue.productData).then(res => {
    vue.productData.index += vue.productData.count
    // window.alert('length:' + res.data.products.length)
    // window.alert('index:' + vue.productData.index)
    // window.alert('count:' + vue.productData.count)
    if (res.data.resultCode !== '100') {
      vue.sg_view = 'noSearch'
    }
    if (res.data.products) {
      if (res.data.products.length === 0) {
        vue.sg_view = 'noSearch'
      } else {
        vue.sg_view = 'searchOk'
        res.data.products.forEach((element) => {
          vue.productList.products.push(element)
        }, this)
      }
    }
    if (res.data.products.length < Number(vue.productData.count)) {
      vue.allLoad = true
    }
    _scroll.customGetMaxDistance()
  })
}

export default {
  data () {
    return {
      productList: {
        products: []
      },
      sg_view: '',
      allLoad: false,
      // insert: document.documentElement.scrollHeight - 100 + 'px'
    }
  },
  methods: {
    goshopCar () {
      this.$router.push({
        name: 'asc_shoppingCart'
      })
    },
    cancel () {
      this.isGoodSearch = ''
      this.$router.push({
        name: 'sg_goodsList'
      })
    },
    go (parmas) {
      /* eslint-disable */
      if (parmas.categoryType == 0) {
        this.$router.push({name: 'sg_goods_car', params: {id: parmas.id, name: '1'}})
      } else {
        this.$router.push({name: 'sg_goods', params: {id: parmas.id, name: '1'}})
      }
    },

    // 点击排序列表，调用接口
    checkedOrderHeader (parmas) {
      this.productData.type = parmas
      this.reset()
      getProductList(this)
    },
    goBack () {
      this.sg_view = ''
      this.isGoodSearch = ''
      let els = document.querySelector('input')
      handToblur(els)
      this.$router.go(-1)
    },
    // 下拉刷新
    getProductList () {
      getProductList(this)
    },
    reset () {
      this.productData.index = 0
      this.allLoad = false
      this.productList.products = []
    }
  },
  props: {
    isGoodSearch: {
      type: String
    }
  },
  computed: {
    productData () {   // 存储获取商品列表的要发送的数据
      return {
        methodName: 'QueryProductList',
        seriesId: null,
        categoryId: this.activeId,
        type: '0',
        index: 0,
        count: 10,
        selectValue: this.isGoodSearch
      }
    },
    insert () {
      return document.documentElement.scrollHeight - 100 + 'px'
    }
  },
  mounted () {
    /* eslint-disable */
    // this.$nextTick(function() {
    //   let el = document.querySelector('.search-bar')
    //   window.alert(el)
    //   el.click()
    // })

    document.addEventListener('keyup', (event) => {
      if (event.keyCode == '13'){
        document.getElementById('search').blur()
        if (!this.isGoodSearch.trim()){
          return
        }
        this.reset()
        getProductList(this)
      } else {
        // document.getElementById('search').focus()
      }
    })
  },
  components: {
    searchGoods,
    orderHeader,
    panel,
    Loadmore,
    scroll
  }
}
</script>
<style scoped>
.right_icon {
    margin-right: 12px;
}
.search {
  border-radius: 100px;
  border-style: none;
  outline: none;
  background: url(../../assets/search.svg) no-repeat 15px;
  background-color: #eaeaea;
  background-size: 17px;
  font-size: 14px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 40px;
  padding-right: 20px;
}
#order_header {
    -webkit-align-item: center;
    position: relative;
    background-color: #fff;
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #d6d6d6;
}
#panel {
  padding-right: 10px;
}
.noResult_img {
    z-index:9999;
    top:50%;
    left:50%;
    width:50%; /* 按需改变数值 */
    margin-top:25%; /* height数值的一半 */
    margin-left:25%; /* width数值的一半 */
}
.noResult_p {
  text-align: center;
  margin-top: 1em;
}

form {
  position: relative;
}

.cancel{
  outline: none;
  border: none;
  margin-right: 12px;
  display: inline-block;
  margin-top:5px;
  font-size: 1.1rem;
  background-color: #F7F7F7;
}
#search-result .sear-body-content::-webkit-scrollbar, .noscroll::-webkit-scrollbar {
  display: none;
  /*overflow-x: hidden;*/
  width: 100%
}
/*search-result  .noscroll*/
</style>