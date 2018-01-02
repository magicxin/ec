<template>
  <div id="sg_goodsList" class="background-gray" layout="column">
    <searchGoods bg-color="#f7f7f7">
      <img slot="left" src="../../assets/left-gray.svg" @click="goBack">
      <input v-if="isSearchBar" type="search" slot="search" style="margin-left:20px" class="search"
             placeholder="请输入商品名称" v-model="isGoodSearch" v-on:click="goSearch()" id="search">
      <img v-if="isShoppingcar" slot="right" src="../../assets/shoppingcar.svg" alt="" class="right_icon"
           v-tap="{methods: goshopCar}" v-show="!isSearch">
      <img v-if="isShoppingcar" slot="right" src="../../assets/sg_select.svg" alt="" class="right_icon_sg"
           v-tap="{methods: sgSlelectBtn}" v-show="!isSearch">
      <button class="cancel" slot="right" @click="cancel" v-show="isSearch">取消</button>
      <button v-if="isConfirmSelection" class="cancel" slot="right" @click="sendToApp">确认选择</button>
    </searchGoods>
    <!--遮罩-->
    <div class="shade" v-if="isCheckShow" v-tap="{methods:closeShade}"></div>
    <!--选择框-->
    <div class="check_box" v-if="isCheckShow">
      <!--三角形-->
      <div class="triangle"></div>
      <input type="button" v-tap="{methods: checkAll}" value="全部" :class="{active:checkIsActive}">
      <input type="button" v-tap="{methods: checkBean}" value="V豆抵扣" :class="{active:!checkIsActive}">
    </div>
    <div v-if="!isSearch">
      <scroll :bottom="true" marginBottom="0" :top="true">
        <div class="goodsList-tabs sm_f" v-if="isTab">
          <is-tabs :value="activeTab" v-if="productCategoryData.productCategorys" @change="handleTabChange"
                   class="text-center">
            <is-tab :value="'tab' + (index + 1)"
                    :title="item.name"
                    v-for="(item, index) in productCategoryData.productCategorys" :key="index">
            </is-tab>
          </is-tabs>
        </div>
        <div class="divide_no_bod"></div>
        <div layout layout-align="center start" class="goodsList-body">
          <div class="body-list scroller" :style="{height: height}" v-if="productList.products">
            <mu-tabs :value="activeItemTab"
                     v-if="productCategoryData.productCategorys">
              <mu-tab :value="'tab' + (index + 1)"
                      :title="item.name"
                      v-tap="{ methods: chooseProductItem, index: index, item: item }"
                      v-for="(item, index) in productCategoryData.productCategorys[itemTabIndex].series" :key="index"/>
            </mu-tabs>
          </div>
          <empty v-if="!productList.products" message="暂时没有商品">

          </empty>
          <Loadmore flex v-else class="body-content noscroll" :style="{height: height}" :getMore="getProductList"
                    :allLoaded="allLoad">
            <div layout="column">
              <div class="content-img text-center" :style="{height: imgHeight + 'px'}">
                <!--                <img :src="advertisementImage ? addPath(advertisementImage) : defaultImg" :height= "imgHeight + 'px'">-->
                <!--start 新增banner广告位 -->
                <swipe class="my-swipe">
                  <swipe-item v-if="banner.length==0">
                    <img class="swipe" :src="carFriend" width="100%" height="100%"/>
                  </swipe-item>
                  <swipe-item v-if="banner.length>0" v-for="(item,index) in banner" :key="index">
                    <img class="swipe" :src="item.image" :name="item.path" width="100%" height="100%"
                         @click="navToActive"/>
                  </swipe-item>
                </swipe>
                <!--end 新增banner广告位 -->
              </div>
              <div class="content-order-header" :class="{'noData': productList.products.length === 0}">
                <order-header @checked="checkedOrderHeader"
                              :textArray="theTitleHasChosed.type === '0' ? ['综合', '销量', '价格'] : ['综合', '销量']">

                </order-header>
                <img class="order-header-img" width="20" v-if="orderWay === 'column'" src="../../assets/grid.png"
                     alt="排序方式" v-tap="{ methods: orderWayChange }">
                <img class="order-header-img" width="20" style="top: 10px;" v-if="orderWay === 'row'"
                     src="../../assets/listPng.png" alt="排序方式" v-tap="{ methods: orderWayChange }">
              </div>
              <div layout="column" v-if="orderWay === 'column'">
                <panel class="content-main"
                       :value=item
                       v-tap="isServiceEnter ?{methods: selectProduct, productsProperty: item, productIndex:index}:{methods: go, id: item.id}"
                       v-for="(item, index) in productList.products" :key="index"
                       flex="noshrink">
                  <span slot="price" class="sm_f text_red"
                        v-if="item.isSubscription === '0'">￥<span
                    class="price">{{ item.price }}</span></span>
                  <!--<span slot="price" class="sm_f text_red"-->
                  <!--v-if="item.isSubscription !== '0'">￥<span-->
                  <!--class="price">{{ item.price }}</span></span>-->
                  <span slot="price" class="sm_f text_red"
                        v-if="item.isSubscription !== '0'">订金¥{{item.subscription || 0.00}}</span>
                  <span slot="number" class="hasMarket"> 已售{{item.sales ? item.sales : 0}}件</span>
                  <span v-if="isCheck" slot="check" class="check">
                      <mu-checkbox v-model="productArray" :nativeValue="item"></mu-checkbox>
                  </span>
                </panel>
              </div>
              <div class="content-main-row" v-if="orderWay === 'row'">
                <div class="content-main-row-bg" layout layout-wrap>
                  <panel-two :width=panelTwoWidth
                             :value=item
                             v-tap="isServiceEnter ?{methods: selectProduct, productsProperty: item, productIndex:index}:{methods: go, id: item.id}"
                             v-for="(item, index) in productList.products" :key="index">
                    <span slot="price" class="sm_f text_red"
                          v-if="item.isSubscription === '0'">￥<span
                      class="price">{{ item.price }}</span></span>
                    <!--<span slot="price" class="sm_f text_red"-->
                    <!--v-if="item.isSubscription !== '0'">￥<span-->
                    <!--class="price">{{ item.price }}</span></span>-->
                    <span slot="price" class="sm_f text_red"
                          v-if="item.isSubscription !== '0'">订金¥{{item.subscription || 0.00}}</span>
                    <!--<span slot="number" class="hasMarket">已售{{item.sales ? item.sales : 0}}件</span>-->
                    <span v-if="isCheck" slot="check" class="check">
                        <span v-if="item.selected">
                           <mu-checkbox v-model="productArray" :nativeValue="item"></mu-checkbox>
                        </span>
                      </span>
                  </panel-two>
                  <div v-if="productList.products && productList.products.length % 2 === 1"
                       :style="{width: panelTwoWidth + 4 + 'px', height: 1.4 * panelTwoWidth + 'px', 'background-color': '#fff', 'margin-left': 0}"></div>
                </div>
              </div>
            </div>
          </Loadmore>
        </div>
      </scroll>
    </div>
    <div v-show="isSearch">
      <searchResult :isGoodSearch="isGoodSearch"></searchResult>
    </div>
  </div>
</template>
<script>
  import Loadmore from 'components/loadmore'
  import panel from 'components/panel.vue'
  import panelTwo from 'components/panel-two.vue'
  import orderHeader from 'components/order-header'
  import searchGoods from 'components/searchGoods'
  import price from 'components/price'
  import tabs from 'components/tabs.vue'
  import tab from 'components/tab.vue'
  import empty from 'components/empty-page.vue'
  import scroll from 'components/scroll.vue'
  import searchResult from './sg_searchResult.vue'


  import defaultImg from 'assets/default_user_icon.png'
  import defaultEmpty from 'assets/default_empty_icon.png'
  import listPng from 'assets/list.png'
  import Order from 'tools/order.service.js'
  //swiper
  import carFriend from 'assets/carFriend.png'
  import 'vue-swipe/dist/vue-swipe.css'
  import Vue from 'vue'
  import {
    Swipe,
    SwipeItem
  } from 'vue-swipe'
  Vue.component('swipe', Swipe);
  Vue.component('swipe-item', SwipeItem);

  //end banner

  let order = Order.getInstance()
  /* eslint-disable */
  function getProductList(vue) {
    Vue.prototype.$.get(vue.productData).then(res => {
      vue.productData.index += vue.productData.count
      for (let i = 0; i < res.data.products.length; i++) {
        res.data.products[i].selected = false
      }
      setTimeout(() => {
        vue.productList.products = vue.productList.products.concat(res.data.products)
        vue.advertisementImage = vue.productList.products[0] && vue.productList.products[0].brandLogo
      }, 10)
      if (res.data.products.length < Number(vue.productData.count)) {
        vue.allLoad = true
      }
    })
  }

  function getServiceProductList(vue) {
    Vue.prototype.$.get(vue.productData).then(res => {
      vue.productData.index += vue.productData.count
      vue.advertisementImage = vue.productList.products[0] && vue.productList.products[0].brandLogo
      for (let i = 0; i < res.data.products.length; i++) {
        res.data.products[i].selected = false
      }
      setTimeout(() => {
        vue.productList.products = []
        vue.productList.products = vue.productList.products.concat(res.data.products)
      }, 20)
      if (res.data.products.length < Number(vue.productData.count)) {
        vue.allLoad = true
      }
    })
  }
  export default {
    name: 'sg_goodsList',

    data() {
      return {
        allLoad: false,
        listPng,
        defaultEmpty,
        defaultImg,
        fromState: '',
        activeTab: 'tab1',
        activeId: '0',
        activeItemTab: 'tab1',
        itemTabIndex: 0,
        imgHeight: (window.screen.width * 0.75 - 30) * 0.375,
        imgWidth: window.screen.width * 0.75 - 30,
        panelTwoWidth: (window.screen.width * 0.75 - 30 - 4) * 0.5,
        orderWay: 'column', // 商品排列方式，默认竖状排列
        productCategoryData: {
          productCategorys: ''
        }, // 主要的横向tabs的数据
        productList: {
          products: []
        }, // 左侧的tabs的数据,
        theTitleHasChosed: {},
        isGoodSearch: '',
        // 全部商品列表
        productData: {
          methodName: 'QueryProductList',
          seriesId: '',
          categoryId: '',
          type: '0',
          index: 0,
          count: 10,
          isBeanExchange: '0'
          // coun
        },
        advertisementImage: '',
        isSearch: false, // 搜索页是否出现
        isSearchBar: true, // 搜索条是否出现
        isShoppingcar: true, // 购物车图标是否出现
        isTab: true, // 上方主tabs是否出现
        isServiceEnter: '',
        productArray: [],
        ids: [],
        isCheck: '',
        isCheckBtn: '',
        productChecked: false,
        selectedIndex: 0,
        selectedTab: '',
        isConfirmSelection: false,
        //start banner广告位
        banner: [],
        carFriend: carFriend,
        //end banner广告位
        checkIsActive: true,  // 选择全部 or V豆换购
        isCheckShow: false,      // 是否显示弹出层
        fromFullPath: ''      // 来的页面的标签名
      }
    },
    created() {
      //this.getRouteParams()
      // 调用原生预约维保界面示例，正式代码完成后 此处注释掉
      // this.goToNativeAppointmentPage([{productId:1},{productId:2}])
      let that = this;
        this.$.get({
          "clientType": this.$.getClientType,
          "methodName": "QueryAdPosition",
          "shopId": that.$.shopId,
          "userId": that.$.userId,
          "type": "6"
        })
          .then(res => {
            console.dir(res)
            this.banner = res.data.ads;
            this.banner.forEach((item, index) => {
              this.banner[index].image = this.addPath(item.image);
            })
          })
    },
    mounted() {
      this.$nextTick(() => {
        this.getRouteParams()
      })
      //this.getRouteParams()
    },
    methods: {
      //点击显示选择V豆换购和全部商品
      sgSlelectBtn(){
        this.isCheckShow = !this.isCheckShow
      },
      //关闭弹出按钮
      closeShade(){
        this.isCheckShow = false
      },
      //  筛选时选择 全部
      checkAll(){
        if (this.checkIsActive) {
          // 如果当前为选择全部则关闭弹出
          this.closeShade()
          return
        }
        this.productData.isBeanExchange = '0'
        this.closeShade()
        this.chooseProductItem({index: 0})
        this.checkIsActive = true;
      },
      //  筛选时选择 V豆
      checkBean(){
        if (!this.checkIsActive) {
          // 如果当前为选择换购则关闭弹出
          this.closeShade()
          return
        }
        this.productData.isBeanExchange = '1'
        this.closeShade()
        this.chooseProductItem({index: 0})
        this.checkIsActive = false;
      },
      navToActive(){

      },
      goToNativeAppointmentPage(params) {
      	let that = this
        let nativeParams = params || []
        
            that.$.go({
              name: 'router_makeAppointmentOrder',
              query: nativeParams
            })
      },
      getRouteParams() {
        this.routeSource = this.$route.query.routeSource
        this.ids = this.$route.query.ids

        if (this.routeSource == "serviceSelect") {
          //alert(this.selectedIndex)
          this.selectedTab = "tab" + (this.selectedIndex / 1 + 1)
          //this.initServiceTab(this.selectedTab)
          setTimeout(() => {
            //this.initServiceTab(this.selectedTab)
            this.initServiceTab(this.selectedTab)
          }, 20)

          this.isServiceEnter = true
        }

        //      let queryResult=JSON.parse(JSON.stringify(this.$route.query))
        //      if(!isEmpty(queryResult.id)){
        //        queryResult.id = this.$route.query.id || ''
        //      }
      },
      goshopCar() {
        this.$router.push({
          name: 'asc_shoppingCart'
        })
      },
      handleTabChange(val) {
        order.userActiviteTab(val)
        this.activeTab = val
        let index = val.split('tab')[1] - 1
        this.theTitleHasChosed = this.productCategoryData.productCategorys[index]
        this.chooseProduct({
          index,
          item: this.productCategoryData.productCategorys[index]
        })
      },
      initServiceTab(val) {
        order.userActiviteTab(val)
        this.activeTab = val
        let index = val.split('tab')[1] - 1
        this.theTitleHasChosed = this.productCategoryData.productCategorys[index]
        this.chooseServiceProduct({
          index,
          item: this.productCategoryData.productCategorys[index]
        })
        //this.isTab = false
        this.isSearchBar = false
        this.isShoppingcar = false
        this.isCheck = true
        this.isConfirmSelection = true

      },
      selectProduct(params) {
        this.productList.products[params.productIndex].selected = !this.productList.products[params.productIndex].selected
        let product = this.productList.products[params.productIndex];
        if (product.selected) {
          if (!this.$.isArrayContains(this.productArray, product)) {
            this.productArray.push(product)
          }
        } else {
          if (this.$.isArrayContains(this.productArray, product)) {
            this.productArray.splice(this.productArray.indexOf(product), 1)
          }
        }

        //        if (this.productArray.length == 0) {
        //          this.productArray.push(params.productsProperty)
        //          console.log(this.productArray)
        //        } else if(this.productArray.indexOf(params.productsProperty) == -1) {
        //          this.productArray.push(params.productsProperty)
        //          console.log(this.productArray)
        //        } else {
        //          this.productArray.splice(this.productArray.indexOf(params.productsProperty), 1)
        //          console.log(this.productArray)
        //        }
        (params.show)
      },

      reset() {
        this.productData.index = 0
        this.allLoad = false
        this.productList.products = []
      },

      goBack(params) {
        console.log(this.fromState)
        if (this.fromFullPath && this.fromFullPath === '/vb_vipRule') {
          this.$router.go(-1)
          return
        }
        if (this.fromState && this.fromState !== 'sg_goods' && this.fromState !== 'sg_goods_car' && this.fromState !== 'asc_shoppingCart') {
          this.$router.go(-1)
          return
        } else {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
        }
      },
      isMultiShop(cartItems) {
        let shopidFlag = cartItems[0].shopId;
        let result = false;
        cartItems.map((item) => {
          if (shopidFlag !== item.shopId) {
            result = true;
          }
        })
        return result;
      },
      sendToApp() {
        //
        //        for( let i=0; i < this.productArray.length; i++) {
        //          this.productArray[i].push()
        //        }
        if (this.isMultiShop(this.productArray)) {
          this.$.toast('不允许多个店铺一起预约！')
        } else {
          let cartItems = [];
          let flgItem = [];
          this.productArray.map((item) => {
            if (item.isBuyAtShop === '0' || item.categoryType !== '2') {
              flgItem.push(item);
            }
          })
          if (flgItem && flgItem.length > 0) {
            let notsupport = ''
            flgItem.map((item) => {
              notsupport += item.name + ','
            })
            this.$.toast('部分商品不支持预约：' + notsupport.substring(0, notsupport.length - 1))
          } else {
            this.productArray.map((product) => {
              let cartItem = {};
              cartItem.quantity = '1';
              cartItem.product = product;
              cartItems.push(cartItem);
            })
            let productsObjArray = {
              type: '1',
              cartItems: cartItems
            }
            this.goToNativeAppointmentPage(productsObjArray)
          }
        }
      },
      goSearch() {
        this.isSearch = true
      },
      cancel() {
        this.isSearch = false
        // this.isGoodSearch = ''
      },
      // 点击上方主tabs
      getProductList() {
        getProductList(this)
      },
      chooseProduct(params) {
        this.reset()
        this.productData.categoryId = params.item.id
        this.itemTabIndex = params.index
        this.activeItemTab = 'tab1'
        // 如果存在，获取该块下第一个商品列表,如果不存在，清除之前的数据
        if (this.productCategoryData.productCategorys[this.itemTabIndex].series[0]) {
          this.productList.products = []
          this.productData.seriesId = this.productCategoryData.productCategorys[this.itemTabIndex].series[0].id
          let abc = getProductList(this)
        } else {
          this.productData.seriesId = ''
          this.productList.products = []
        }
      },
      chooseServiceProduct(params) {
        this.reset()
        this.productData.categoryId = params.item.id
        this.itemTabIndex = params.index
        this.activeItemTab = 'tab1'
        // 如果存在，获取该块下第一个商品列表,如果不存在，清除之前的数据
        if (this.productCategoryData.productCategorys[this.itemTabIndex].series[0]) {
          this.productList.products = []
          this.productData.seriesId = this.productCategoryData.productCategorys[this.itemTabIndex].series[0].id
          let abc = getServiceProductList(this)
        } else {
          this.productList.products = []
        }

        //
        //        let idArry = []
        //        idArry = this.ids.split('-')
        //        idArry.indexOf()
        //        if(let i = 0; i < this.productList.products.length; i) {
        //
        //        }
        //        console.log()
        //        debugger

      },

      // 点击左侧tabs调用接口
      chooseProductItem(params) {
        this.reset()
        let _cacheActiveItemTab = 'tab' + (params.index + 1)
        order.userSubActiviteTab(_cacheActiveItemTab)
        if (this.activeItemTab === _cacheActiveItemTab) {

          //return
        }
        this.activeItemTab = 'tab' + (params.index + 1)
        let index = this.activeTab.split('tab')[1]
        this.productData.seriesId = this.productCategoryData.productCategorys[index - 1].series[params.index].id
        getProductList(this)
      },
      // 点击排序列表，调用接口
      checkedOrderHeader(parmas) {
        this.reset()
        this.productData.type = parmas
        if (this.productCategoryData.productCategorys[this.itemTabIndex].series[0]) {
          getProductList(this)
        } else {
          this.productList.products = []
        }
        //alert(this.productData.categoryId + '、' + this.productData.seriesId + '、' + this.productData.type + '、')
      },
      go(parmas) {
        if (this.theTitleHasChosed.type === '1' || this.theTitleHasChosed.type === '2') {
          this.$router.push({
            name: 'sg_goods',
            params: {
              id: parmas.id,
              name: '1'
            }
          })
        } else {
//      	alert(parmas.id)
          this.$router.push({
            name: 'sg_goods_car',
            params: {
              id: parmas.id,
              name: '1'
            }
          })
        }
      },
      orderWayChange() {
        this.orderWay = this.orderWay === 'row' ? 'column' : 'row'
      }
    },
    watch: {
      // 判断是否调整搜索页
      isGoodSearch(val) {
        // this.$router.push({name: 'sg_searchResult'})
      }
    },
    computed: {
      height() {
        return document.documentElement.clientHeight - 110 + 'px'
      }
      // insert() {
      //     return document.documentElement.clientHeight - 240 + 'px'
      // }
    },
    beforeRouteEnter(to, from, next) {
      //微信分享不进入V商
      if (Vue.prototype.$.isWechat) {
        location.href = "/index.html"
      } else {
        // 获取商品分类


        // 在参数中判断是不是从会员权益页面过来的
        let isFromvRule = to.params && to.params.isVBean || false

        Vue.prototype.$.get({
          methodName: 'QueryProductCategoryList',
          type: to.query.typeId,
        }).then(res => {
          next(vm => {

            // 如果切换店铺, 就回到原来选中的tab页
            if (!to.query.toChild) {
              vm.activeTab = order.userActiviteTab()
              let _cacheSubTab = vm.activeItemTab
              let _serviceType = vm.serviceType
              vm.activeItemTab = order.userSubActiviteTab() || _cacheSubTab

            }
            // 一是获取上方分类, 二是获取商品
            let index = vm.activeTab.split('tab')[1] - 1
            vm.itemTabIndex = index
            let subIndex = vm.activeItemTab.split('tab')[1] - 1
            vm.productCategoryData.productCategorys = res.data.productCategorys
            vm.selectedIndex = res.data.selectedIndex

            // 判断是否从会员权益进入的页面
            console.log(from.fullPath)
            if (isFromvRule) {
              vm.productData.isBeanExchange = '1'
              vm.checkIsActive = false;
              vm.fromState = from.name
            }
            vm.fromFullPath = from.fullPath
            if (vm.productCategoryData.productCategorys[index].series[subIndex]) {
              vm.theTitleHasChosed = vm.productCategoryData.productCategorys[index]
              vm.productData.seriesId = vm.productCategoryData.productCategorys[index].series[subIndex].id
              vm.productData.categoryId = vm.productCategoryData.productCategorys[index].id

              vm.fromState = from.name
              getProductList(vm)
            }
            //vm.getRouteParams()
          })
        }, () => {
          next()
        })
      }

    },
    components: {
      panel,
      searchGoods,
      price,
      orderHeader,
      panelTwo,
      isTabs: tabs,
      isTab: tab,
      empty,
      scroll,
      searchResult,
      Loadmore
    }
  }
</script>
<style>
  #sg_goodsList a {
    color: #000;
    overflow: hidden;
  }

  #sg_goodsList .shade {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 100000;
    background-color: rgba(0, 0, 0, .6);
  }

  #sg_goodsList .check_box {
    border-radius: 10px 0 10px 10px;
    position: absolute;
    right: 10px;
    top: 60px;
    width: 100px;
    height: 80px;
    background-color: #fff;
    z-index: 100001;
    padding-top: 5px;
  }

  #sg_goodsList .check_box input {
    width: 80%;
    border-radius: 3px;
    height: 24px;
    margin: 5px 10%;
    border: 1px solid #777;
  }

  #sg_goodsList .check_box input.active {
    background-color: #fc3;
  }

  #sg_goodsList .check_box .triangle {
    width: 0;
    height: 0;
    position: absolute;
    border: 15px solid;
    border-color: transparent transparent #fff transparent;
    z-index: 100001;
    right: 0;
    top: -29px;
  }

  #sg_goodsList .right_icon {
    margin-right: 12px;
    position: relative;
    /*right: 14px;*/
  }

  #sg_goodsList .right_icon_sg {
    width: 22px;
    height: 22px;
    margin-right: 5px;
    position: relative;
  }

  #sg_goodsList .search {
    border-radius: 100px;
    border-style: none;
    outline: none;
    background: url(../../assets/search.svg) no-repeat 15px;
    background-size: 17px;
    background-color: #eaeaea;
    font-size: 14px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 40px;
    padding-right: 20px;
  }

  #sg_goodsList .mu-tab-link {
    color: black;
  }

  #sg_goodsList .mu-tab-active {
    color: #f98700;
  }

  #sg_goodsList .goodsList-tabs {
    background-color: #fff;
    width: 100%;
    overflow: auto;
    padding: 0;
    height: 35px;
  }

  #sg_goodsList .mu-tabs {
    background-color: #fff;
  }

  #sg_goodsList .mu-tab-link-highlight {
    background-color: #f98700;
  }

  #sg_goodsList .goodsList-body {
    background-color: #fff;
    margin-top: 7px;
    max-width: 100%;
    /*-webkit-overflow-scrolling: touch;*/
    overflow: hidden;
  }

  #sg_goodsList .body-list {
    width: 25%;
    overflow: scroll;
    border-right: 1px solid #DEDEDE;
    background-color: #F8F8F8;
  }

  #sg_goodsList .body-list .mu-tabs {
    flex-direction: column;
  }

  #sg_goodsList .body-list .mu-tab-link {
    width: 100%;
    background-color: #f8f8f8;
    position: relative;
  }

  #sg_goodsList .body-list .mu-tab-link.mu-tab-active {
    background-color: #fff;
  }

  #sg_goodsList .body-list .mu-tab-link::before {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    left: -50%;
    top: -51%;
    /*border-right: 1px solid #bdbdbd;*/
    border-bottom: 1px solid #bdbdbd;
    transform: scale(0.5);
    transition: border linear 0.2s;
  }

  #sg_goodsList .body-list::-webkit-scrollbar {
    display: none;
  }

  /*#sg_goodsList .body-list .mu-tab-link.mu-tab-active::before {
    border-right: 1px solid #fff;
  }*/

  #sg_goodsList .body-list .mu-tab-text {
    color: #8e8e8e;
  }

  #sg_goodsList .body-list .mu-tab-active .mu-tab-text {
    color: #f98700;
  }

  #sg_goodsList .body-list .mu-tab-link-highlight {
    display: none;
  }

  #sg_goodsList .body-content {
    overflow: scroll;
    overflow-x: hidden;
    width: 75%;
    background-color: #fff;
  }

  #sg_goodsList .body-content::-webkit-scrollbar, .noscroll::-webkit-scrollbar {
    display: none;
  }

  #sg_goodsList .content-img {
    padding: 8px 15px;
    position: relative;
  }

  #sg_goodsList .content-order-header {
    width: 100%;
    padding: 5px 35px 3px;
    position: relative;
  }

  #sg_goodsList .order-header-img {
    position: absolute;
    right: 15px;
    top: 8px;
  }

  #sg_goodsList .content-main {
    padding: 8px 15px;
    padding-left: 0px;
    position: relative;
    padding-right: 10px;
  }

  #sg_goodsList .content-main:first-child::before {
    border-top: 1px solid #bdbdbd;
  }

  #sg_goodsList .content-main:last-child::before {
    border-bottom: none;
  }

  #sg_goodsList .content-main-row {
    padding: 8px 15px;
    background-color: #fff;
    position: relative;
  }

  .content-main-row-bg {
    background-color: #F3F3F3;
    /*margin-bottom: 200px;*/
  }

  #sg_goodsList .content-img::after,
  #sg_goodsList .content-order-header::after,
  #sg_goodsList .content-main::after,
  #sg_goodsList .content-main-row::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: #bdbdbd;
    transform: scaleX(0.5);
    left: -1px;
    top: 0;
  }

  #sg_goodsList .content-main-row::before {
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #bdbdbd;
    transform: scaleY(0.5);
    left: 0px;
    top: 0;
  }

  #sg_goodsList .content-main::before {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    left: -50%;
    top: -50%;
    border-bottom: 1px solid #bdbdbd;
    transform: scale(0.5);
  }

  #sg_goodsList .panel_h4 {
    font-size: 1.1rem;
  }

  #sg_goodsList .content-main-row > div > div:nth-child(2n+1) {
    margin: 4px 0 0 0;
  }

  #sg_goodsList .content-main-row > div > div:nth-child(2n) {
    margin: 4px 0 0 4px;
  }

  #sg_goodsList .content-main-row > div > div:nth-child(1),
  #sg_goodsList .content-main-row > div > div:nth-child(2) {
    margin-top: 0;
  }

  #sg_goodsList .desc {
    display: inline-block;
    margin-top: 0.5em;
  }

  #sg_goodsList .content-desc {
    font-size: 12px;
    color: #F98700;
  }

  #sg_goodsList .contetn-price {
    font-size: 18px;
    color: #f02b2b;
    line-height: 1.6;
  }

  #sg_goodsList .check {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    position: absolute;
    top: 2rem;
    right: 2rem;
    color: #000;
    text-align: center;
  }

  #sg_goodsList .check label {
    left: -28px;
  }

  .hasMarket {
    color: #B1B1B1;
    position: relative;
    top: 5px;
  }

  .deposit {
    color: orange
  }

  #sg_goodsList .result_empty {
    height: 100%;
    text-align: center;
    width: 100%;
    background-color: #fff;
    position: relative;
    /*background-color: #EFEFF4;*/
    margin-top: 0px;
  }

  #sg_goodsList .cancel {
    outline: none;
    border: none;
    margin-right: 12px;
    display: inline-block;
    margin-top: 5px;
    font-size: 1.1rem;
    background-color: #F7F7F7;
  }

  #sg_goodsList .result_empty img {
    width: 50%;
  }

  #sg_goodsList .result_empty p {
    /*float: right*/
    font-weight: bold;
  }

  #sg_goodsList .mu-ripple-wrapper {
    position: relative;
  }

  #sg_goodsList .discrbition {
    position: relative;
    margin-top: -13px;
  }

  #sg_goodsList .scroll-box {
    bottom: 1px;
  }

  #sg_goodsList .price {
    font-size: 1.3rem;
  }

  .noData {
    position: relative;
  }

  .noData::before {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    left: -50%;
    top: -50%;
    border-bottom: 1px solid #bdbdbd;
    transform: scale(0.5);
  }

  .background-shear {
    background-repeat: no-repeat;
    background-size: cover;
  }

</style>