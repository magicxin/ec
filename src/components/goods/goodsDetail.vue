
<template>
  <div id="goodsDetail">
    <div class="pos_rt">
      <magic-header>
        <badge :value="shoppingcarNumber" slot="title-right" v-tap="{methods: goshopcargo}">
          <img src="../../assets/shoppingcar.svg" class="badgeImg">
        </badge>
      </magic-header>
      <!-- <my-header bg-color="#fff" text-color="#000">
        <img src="../assets/left-gray.svg">
        <badge :value="shoppingcarNumber" slot="right" v-tap="{methods: goshopcargo}">
          <img src="../assets/shoppingcar.svg" class="badgeImg">
        </badge>
      </my-header> -->
      <div class="tab_title">
        <mu-tabs :value="activeTab" @change="handleTabChange">
          <mu-tab value="tab1" title="商品" class="mid_f"/>
          <mu-tab value="tab2" title="详情" class="mid_f"/>
          <mu-tab value="tab3" title="评价" class="mid_f"/>
        </mu-tabs>
      </div>
    </div>
    <scroll>
      <div class="container">
        <div v-if="activeTab === 'tab1'">
          <pull-down :getMore="jump" :allLoaded="flagJump">
            <swipe :auto="2000" class="my-swipe">
              <swipe-item v-for="(item,index) in product.productImages" :key="index" v-if="product.productImages.length !== 0 ">
                <div v-if="product.isHaveVr" @click="tryActivePanorama(product)" class="vricon"></div>
                <img @click="tryActivePanorama(product)" :src="item ? addPath(item) : defaultImg"
                     style="min-height: 200px;" height="100%">
              </swipe-item>
              <swipe-item v-if="product.productImages == ''">
                <div v-if="product.isHaveVr" @click="tryActivePanorama(product)" class="vricon"></div>
                <img @click="tryActivePanorama(product)" :src="defaultImg" height="100%">
              </swipe-item>
            </swipe>
            <div v-if="!timeSpikeDetails">
              <goods-header>
                <span slot="title" @click="tryActivePanorama(product)">{{ product.fullName }} </span>

                <span slot="nowPrice" v-if="isActivity">
                    <span>￥{{ activity.currentPrice }}</span><br>
                    <span class="col_gay sm_f original-price">原价￥{{ product.price}}</span>
                </span>
                <span slot="nowPrice" v-if="!isActivity && product.isSubscription == '1'">
                    <span class="hg_f col_red"><span>订金</span>￥{{ product.subscription }}</span>
                    <span v-if="Number(product.beanPercent) > 0"
                                  class="V-bean-rmb">V豆抵{{product.beanPercent}}%</span><br>
                    <span  class="col_gay sm_f">总价{{ product.price}}</span>
                </span>
                <span slot="nowPrice" v-if="!isActivity && product.isSubscription !== '1'">
                    <span >￥{{ product.price }}</span>
                    <span v-if="Number(product.beanPercent) > 0"
                          class="V-bean-rmb">V豆抵{{product.beanPercent}}%</span><br>
                    <span  class="col_gay sm_f original-price">指导价￥{{ product.marketPrice}}</span>
                </span>
                
                <span slot="collection" v-tap="{methods: package_collection}"
                      v-bind:class="{collection: selfIsCollect, collected: !selfIsCollect}">{{ collectState }}</span>
                <span slot="share" class="share" v-on:click="shareFun()">分享</span>
              </goods-header>
              <slot name="robBuy_actived_one">

              </slot>
              <div class="mini_f sg_border" layout="row" layout-align="space-between center">
                <span>运费：{{ isActivity ? activity.freight : product.freight }}</span>
                <span>已售{{ product.sales }}/余{{ product.stock || 0 }}件</span>
              </div>
              <slot name="car_fun">

              </slot>
              <!--<div class="divide" ></div>-->
              <!--<div class="discount-tips" v-if="discountTips">-->
              <!--<h6>促销</h6>-->
              <!--<div class="sm_f">暂无促销信息</div>-->
              <!--&lt;!&ndash;<div v-for="item in discount" class="sm_f"><span>{{item.tipsTag}}</span>{{item.tipsText}}</div>&ndash;&gt;-->
              <!--</div>-->
            </div>
            <div v-if="timeSpikeDetails">
              <div class="priceDetail">
                <ruby class="mini_f"><span class="sm_f">￥ </span><span class="hg_f">{{ activity.currentPrice }}</span>
                  <rt>
                    <del class="sm_f">原价:￥{{ product.price }}</del>
                  </rt>
                </ruby>
                <img src="../../assets/clock.png" height="30" width="30" alt="" class="pull-right">
                <label for="" class="pull-right time sm_f">距结束&nbsp;
                  <span v-if="surplusTime.endDays > 0">{{ surplusTime.endDays
                    }}天</span><span>{{ surplusTime.surplusHours }}</span>:<span>{{ surplusTime.surplusMinutes }}</span>:<span>{{ surplusTime.surplusSeconds
                    }}</span></label>
              </div>
              <slot name="eve_timeSpikeDetails">
              </slot>
            </div>
            <div>
              <div class="divide"></div>
              <cells class="options">
                <cell value="" v-tap="{methods: addShopCar}">
                  <p slot="label" class="options-label">请选择分类</p>
                </cell>
              </cells>
              <slot name="robBuy_actived_two"></slot>
              <slot name="bargainRecode"></slot>
            </div>

            <div v-if="product && product.couponPromotions">
              <div class="divide"></div>
              <cells class="options">
                <cell value="" v-tap="{methods: getCoupon,promotions:product.couponPromotions}">
                  <p slot="label" class="options-label">
                    {{product.couponPromotions.length == 0 ? '无可用优惠券' : '有可用优惠券'}}</p>
                </cell>
              </cells>
            </div>

           <div class="divide" v-if="!isActivity"></div>
            <div class="promotion" v-if="!isActivity">
              <h6>促销</h6>
              <section class="promotion-box" @click="promotionOpenBottomSheet">
                <div class="promotion-text" v-for=" (item,index) in promotionsData" :key="index" v-if="index<3">
                  <span v-if="item.type === '0'">包邮</span>
                  <span v-if="item.type === '1'">优惠券</span>
                  <span v-if="item.type === '2'">商品</span>
                  <span v-if="item.type === '3'">满减</span>
                  <span v-if="item.type === '4'">折扣</span>
                  <span v-if="item.type === '5'">满送</span>
                  <span v-if="item.type === '6'">套餐</span>
                  <p>{{item.title}}</p>
                </div>
              </section>
              <mu-icon class="promotion-right" value="keyboard_arrow_right"></mu-icon>
            </div>
            
            <div class="divide"></div>
            <div class="reputation">
              <h6>口碑</h6>
              <span v-for="(item,index) in reputationArray" :key="index">{{item.reputationItem}}</span>
            </div>


            <div class="divide"></div>
            <evaluation titleText="用户评论" :value="evalDataSomeIn" ref="evaluation" :evlIsShow="evlIsShow">
                      <span slot="praiseRate" @click="chooseTab2">
                        <span v-if="product.reviewCount > 0">好评率<span class="text_orange">{{ product.praiseRate
                          }}%</span>&nbsp;></span>
                        <span v-if="product.reviewCount == 0">暂无评价</span>
                      </span>
              <div class="divide"></div>
            </evaluation>

            <div class="divide"></div>

            <businessInfo :value="shop.mobile" :position="shop" :shopId="shop.id">
              <span slot="name">{{ shop.name }}</span>
              <span slot="address">{{ shop.address }}</span>
            </businessInfo>
            <div class="divide"></div>
            <buyknow :value="product.notice"></buyknow>
            <loadmore></loadmore>
          </pull-down>
        </div>
        <div v-if="activeTab === 'tab2'">
          <layout justify="space-around" class="choose">
            <flex>
              <span v-on:click="chooseSpan('pic_detail')"
                    v-bind:class="{ col_yellow: activSpan === 'pic_detail' }">图文详情</span>
            </flex>
            <flex class="choose_center">
              <span v-on:click="chooseSpan('pro_parameter')"
                    v-bind:class="{ col_yellow: activSpan === 'pro_parameter' }">产品参数</span>
            </flex>
            <flex>
              <span v-on:click="chooseSpan('pro_afterSales')"
                    v-bind:class="{ col_yellow: activSpan === 'pro_afterSales' }" class="pro_afterSales">产品售后</span>
            </flex>
          </layout>
          <div class="divide_no_bod"></div>
          <div v-if="activSpan === 'pic_detail'">
            <picDetail v-if="showTime">
              <iframe :src="product.showPath ? addPath(product.showPath) : defaultImg"
                      style="overflow:hidden;overflow-x:hidden;width:100%;top:109px;left:0px;right:0px;bottom:0px;border: 0px;"
                      slot="picDetail" id="introduction" :height="iframeHeight">
              </iframe>
            </picDetail>
          </div>
          <div v-if="activSpan === 'pro_parameter'">
            <proParameter :parameters="product.parameterGroups" :categoryType="product.categoryType"></proParameter>
            <div style="height:60px;" v-if="product.parameterGroups.length != 0"></div>
          </div>
          <div v-if="activSpan === 'pro_afterSales'">
            <div v-html="product.afterSale" id="pro_afterSales" v-if="product.afterSale != ''"
                 v-bind:style="{ height: iframeHeight + 'px' }"></div>
          </div>
        </div>
        <div v-if="activeTab === 'tab3'">
          <evaluation-top :value="evalArray" @sumbit="eveList"></evaluation-top>
          <div class="divide"></div>
          <pull-down :getMore="refresh" :allLoaded="allLoaded">
            <evaluation :value="evalDataIn" ref="evaluation" :evlIsShow="!evlIsShow" style="min-height: 500px">
            </evaluation>
          </pull-down>
          <!--<div style="height:48px;width:100%;background-color: #f3f3f3;">

          </div>-->
        </div>
      </div>
    </scroll>
    <foot class="foot_style mid_f">
      <section>
        <a class="service" v-tap="{methods: contactService}">&nbsp;</a>
        <span >
                <!--<a class="primary-button primary"  v-tap="product.isBuyOnLine !== '1'? {methods:voidFunction}: {methods: buyNow}" :class="{'text-right': product.categoryType !== '1', 'gray-button':product.isBuyOnLine !== '1'}" style="float:right">-->
                <a class="primary-button primary" v-tap=" {methods: buyNow}"
                   :class="{'text-right': product.categoryType !== '1'}" style="float:right">
                  {{isActivity || product.isSubscription == '0' ? '立即购买' : '支付订金'}}
                </a>
          <!--<a class="primary-button secondly" v-tap="{methods: addShopCar}" v-if="product.categoryType === '1' && isAddCar">加入购物车</a>-->
                <a class="primary-button secondly" v-tap="{methods: addShopCar}"
                   v-if="(product.categoryType === '1'||product.categoryType === '2' )&& !isActivity">加入购物车</a>
                <a class="primary-button secondly reservation-button" v-tap="{methods: reservation}"
                   v-if="product.categoryType === '2'" :class="{'text-right': product.categoryType !== '1'}"
                   style="float:right">
                  预约
                </a>
              </span>

        <!-- <span v-if="activity && activity.isAttend == '1' && activity.type != 4"
              style="display: inline-block;margin-left: 20%;color: #f98700;">
                该商品您已抢购~
              </span> -->
      </section>
    </foot>
    <bottom-sheet :isBottomSheetOpen="isOpen" v-on:close="close" :preview="preview" :value="product"
                  :activity="activity" :ifAnmition="true"></bottom-sheet>
    <coupon :bottomSheet="couponBottomSheet" :isStatic="true" :couponPromotions="product.couponPromotions"
            @close="couponClose" v-if="product.couponPromotions"></coupon>

    <mu-bottom-sheet :open="promotionBottomSheet" @close="promotionCloseBottomSheet">
    <mu-list @itemClick="promotionCloseBottomSheet">
      <mu-sub-header class="promotion-header">
        促销
      </mu-sub-header>
      <div class="promotion" v-if="!isActivity">
              <section class="promotion-box" @click="promotionOpenBottomSheet">
                <div class="promotion-text" v-for=" (item,index) in promotionsData" :key="index">
                  <span v-if="item.type === '0'">包邮</span>
                  <span v-if="item.type === '1'">优惠券</span>
                  <span v-if="item.type === '2'">商品</span>
                  <span v-if="item.type === '3'">满减</span>
                  <span v-if="item.type === '4'">折扣</span>
                  <span v-if="item.type === '5'">满送</span>
                  <span v-if="item.type === '6'">套餐</span>
                  <p>{{item.title}}</p>
                </div>
              </section>
            </div>
    </mu-list>
  </mu-bottom-sheet>
  </div>
</template>
<script>
	import Vue from 'vue'
  import magicHeader from 'components/magicHeader'
  import pic20 from 'assets/pic_20.png'
  import pic21 from 'assets/pic_21.png'
  import pic22 from 'assets/pic_22.png'
  import share from 'assets/share.svg'
  import collection from 'assets/collection.svg'
  import 'vue-swipe/dist/vue-swipe.css'
  // import myHeader from 'components/my-header'
  import goodsHeader from './goods-header'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import businessInfo from 'components/detail_businessInfo'
  import picDetail from './pic_detail'
  import proParameter from './pro_parameter'
  import evaluation from 'components/evaluation'
  import evaluationTop from 'components/evaluation-top'
  import buyknow from 'components/detail_buyKnow'
  import loadmore from 'components/detail_loadMore'
  import pullDown from 'components/loadmore'
  import foot from 'components/foot'
  import bottomSheet from 'components/bottom-sheet'
  import { Swipe, SwipeItem } from 'vue-swipe'

  import badge from 'components/badge'

  import scroll from 'components/scroll.vue'
  import defaultImg from 'assets/default_user_icon.png'
  import coupon from "../../pages/payment/p_coupon.vue"
  import right from 'assets/right-gray.png'

  let query = {
    index: 10,
    count: 3,
    type: 0
  }
  let debounceCollect
  function getEvaluation (vm, type, paramsId, status) {
    query.type = type // 设置 评价的类型
    Vue.prototype.$.get({
      methodName: 'QueryProductReview',
      type: type,
      index: '0',
      count: '10',
      productId: paramsId
    }).then(resp => {
      // 判断当前页 是 商品页 还是 评价页
      if (status === 'tab1') {
        vm.evalDataSomeIn = resp.data
        vm.evalDataSomeIn.reviews = vm.evalDataSomeIn.reviews.slice(0, 2)
      } else {
        vm.evalDataIn.reviews = []
        vm.evalDataIn = resp.data
      }

      // 判断评论数量
      if (resp.data.reviews.length === 10) {
        vm.allLoaded = false
      } else {
        vm.allLoaded = true
      }
    })
  }
  export default {
    components: {
      magicHeader,
      goodsHeader,
      Swipe,
      SwipeItem,
      cells,
      cell,
      businessInfo,
      buyknow,
      loadmore,
      pullDown,
      picDetail,
      proParameter,
      evaluation,
      evaluationTop,
      bottomSheet,
      foot,
      badge,
      scroll,
      coupon
    },
    data () {
      return {
        defaultImg,
        activeTab: 'tab1',
        activSpan: 'pic_detail',
        collection,
        iframeHeight: window.screen.height - 155,
        share,
        showTime: false,
        items: [
          {
            src: pic20
          }, {
            src: pic21
          }, {
            src: pic22
          }
        ],
        isOpen: false,
        isStock: true,
        picDetail: false,
        preview: {
          quantity: '1',
          product: {}
        },
        shoppingcarNumber: 0,
        surplusTime: {
          surplusHours: '00',
          surplusMinutes: '00',
          surplusSeconds: '00',
          endDays: 0
        },
        evalDataIn: {},
        evalDataSomeIn: {},
        selfIsCollect: null,
        allLoaded: false, // 判断是否还有内容 继续 加载
        flagJump: false,
        isAddCar: true,
        evlIsShow: true, // 评论是否出现
//      isHaveVr:false,  // vr图标是否出现
        reputationArray: [],
        selectedGoodsShopId: '',
        selectedGoodsShopName: '',
        couponBottomSheet: false,
        couponText: '',
        discountTips: true,
        collectState: '收藏',
        discount: [
          {
            tipsTag: '满减',
            tipsText: '每满199.00元可减100.00现金',
          },
          {
            tipsTag: '多买优惠',
            tipsText: '满2减，立减最低1件商品价格',
          },
          {
            tipsTag: '限制',
            tipsText: '此价格不与套装优惠同时享受',
          }
        ],
        promotionBottomSheet:false
      }
    },

    props: {
      product: { // 产品参数对象
        type: Object
      },
      activity: { // 活动参数
        type: Object
      },
      shop: { // 商家信息参数对象
        type: Object
      },
      favorId: {  // 收藏id
        type: String
      },
      evalData: { // 评价参数对象
        type: Object
      },
      evalDataSome: {
        type: Object //
      },
      evalArray: {  // 评价数组
        type: Array
      },
      isCollect: {  // 是否收藏
        type: Boolean
      },
      endTime: {  // 结束数据
        type: Number
      },  // 判断是否是限时秒杀
      timeSpikeDetails: {
        type: Boolean,
        default () {
          return false
        }
      },  // 判断是否是活动进来的
      isActivity: {
        type: Boolean,
        default () {
          return false
        }
      },
      couponData:{
        type:Object,
        default (){
          return {}
        }
      },
      promotionsData:{
        type:Array
      }
    },
    created(){
//    this.vrIcon();

      //this.getReputation()
    },
    methods: {
      promotionOpenBottomSheet(){
        this.promotionBottomSheet = true
      },
      promotionCloseBottomSheet(){
        this.promotionBottomSheet = false
      },
      voidFunction () {

      },

//    vrIcon (product) {
//        alert(this.product.isHaveVr)
//      if(this.product.isHaveVr == 1) {
//          this.isHaveVr = true
//      } else if (this.product.isHaveVr == 0 || this.product.isHaveVr == null) {
//        this.isHaveVr = false
//      }
//    },
      // 购物券

      getCoupon(params){
        if (params.promotions && params.promotions.length > 0) {
          this.couponBottomSheet = true;
          this.couponText = "123"
        } else {

          this.$.toast('无可用优惠券')
        }
      },
      // 商品口碑接口
      getReputation () {
        this.$nextTick(() => {
          //this.reputationArray = this.product.id.split(",")
          //let aaarray = '11,22,33,44,55'
          //let tempArray = aaarray.split(",")

          if (this.$.isEmpty(this.product.reputation)) {
            var tempArray = this.product.reputation.split(",")
          } else {
            var tempArray = []
          }

          if (tempArray == '' || tempArray == null || tempArray == undefined) {
            this.reputationArray.push({'reputationItem': '暂无口碑'})
          } else {
            for (let i = 0; i < tempArray.length; i++) {
              let reputationItem = {
                reputationItem: tempArray[i]
              }
              this.reputationArray.push(reputationItem)
            }
          }

        })
      },
      cancelBounce () {
        document.querySelector('.container').addEventListener('touchmove', (event) => {
          event.stopPropagation()
        }, false)
      },
      // 商品评价列表接口
      eveList (val) {
        // 每次选择评价类型，初始化查询的页数
        query.index = 10
        query.count = 3
        getEvaluation(this, val, this.$route.params.id, this.activeTab)
        setTimeout(() => {
          this.$refs.evaluation.init()
        }, 200)
      },

      // 联系客服
      contactService () {
        this.$.push('router_callCustomerService', {
          customerServiceId: this.$.userId,
          clentId: this.$.userId
        }, (resp) => {
        })
      },

      // 跳转到详情页
      jump () {
        this.activeTab = 'tab2'
        setTimeout(() => {
          this.showTime = true
        }, 200)
        this.activSpan = 'pic_detail'
        window.scrollTo(0, '100')
      },

      // 评论下拉刷新
      refresh () {
        // 商品评价列表接口
        this.$.get({
          methodName: 'QueryProductReview',
          type: query.type,
          index: query.index,
          count: query.count,
          productId: this.$route.params.id
        }).then(resp => {
          query.index = query.index + query.count
          resp.data.reviews.forEach((x) => {
            this.evalDataIn.reviews.push(x) // 将新的数组添加
            setTimeout(() => {
              if (this.$refs.evaluation) {
                this.$refs.evaluation.init()
              }
            }, 10)
          })
          if (resp.data.reviews.length === 3) {
            this.allLoaded = false
          } else {
            this.allLoaded = true
          }
        })
      },

      // 立刻购买
      buyNow () {
        if (this.activity && Number(this.activity.total) === Number(this.activity.attendCount) && this.activity.type !== '5') {
          this.$.toast('活动人数已满')
        } else if (this.activity && Number(this.activity.maxProduct) <= Number(this.activity.soldProd) && this.activity.type === '5') {
          this.$.toast('商品已秒杀完')
        } else {
          console.log(this.$.userId)
          if(this.$.userId){
            if (!this.product.stock || this.product.stock === '0') {
              this.$.toast('该商品已售完')
              return
            }
            this.addShopCar({
              buyNow: true
            })
          }else{
            this.$.goLogin({
                name:'login'
              })
          }
        }
      },

      // 预约
      reservation () {
        if (this.activity && Number(this.activity.total) === Number(this.activity.attendCount) && (this.activity&&this.activity.type) !== '5') {
          this.$.toast('活动人数已满')
        } else if (this.activity && Number(this.activity.maxProduct) <= Number(this.activity.soldProd) && this.activity.type === '5') {
          this.$.toast('商品已秒杀完')
        } else {
          if(this.$.userId){
            if (!this.product.stock || this.product.stock === '0') {
              this.$.toast('该商品已售完')
              return
            }
            console.log(this.product)
            this.$.push('router_makeAppointmentOrder',{
              type:'0',
              cartItems:[{
                product:this.product,
                quantity:'1',
                amount:'0',
                isValid:'1'
              }]
            })
            // this.addShopCar({
            //   reservation: true
            // })
          }else{
            this.$.goLogin({
                  name:'login'
                })
          }
        }
      },

      goshopcargo () {
        this.$router.push({
          name: 'asc_shoppingCart'
        })
      },

      // 分享
      shareFun () {
        let shareThumImage = this.product.image || '/upload/image/default_user_icon.png'
        this.$.push('route_share', {
          shareTitle: this.product.fullName,
          shareContent: '我在V服发现了一个不错的商品，过来看看吧',
          shareThumImage: shareThumImage,
          shareType: '12',
          needOAuth: '0',
          shareId: this.product.id
        }, (resp) => {
          // window.alert(resp)
          console.log(1231)
        })
      },
      handleTabChange (val) {
        this.evalDataSomeIn = this.evalDataSome
        this.activeTab = val
        setTimeout(() => {
          if (this.$refs.evaluation) {
            this.$refs.evaluation.init()
          }
        }, 1000)
        if (val === 'tab2') {
          setTimeout(() => {
            this.showTime = true
          }, 200)
        } else {
          this.showTime = false
        }
      },
      chooseSpan (val) {
        this.activSpan = val
      },

      // 点击评论调整至评论界面
      chooseTab2 () {
        getEvaluation(this, '0', this.$route.params.id, 'tab3')
        this.activeTab = 'tab3'
        this.picDetail = false
        setTimeout(() => {
          this.$refs.evaluation.init()
        }, 1000)
      },
      close (val) {
        if (this.activity) {
          if (this.activity.type === '4') {
            let canBuyNum = Number(this.activity.total) - Number(this.activity.attendCount)
            if (val && (canBuyNum < JSON.parse(val)[0].quantity)) {
              this.$.toast('已超过最大购买数量')
              return
            }
          } else {
            if (val && (JSON.parse(val)[0].quantity > 1)) {
              this.$.toast('该商品只能购买一个')
              return
            }
          }
        }
        this.isOpen = false
        if (val) {
          if (this.preview.buyNow) {
            delete this.product.parameterGroups
            delete this.product.specificationValues
            delete this.product.specificationGroups
            delete this.product.specifications
            let value = JSON.parse(val)
            this.$nextTick(() => {
              this.product.id = value[0].product.id
              this.product.quantity = value[0].quantity
              if (this.activity) {
                this.activity.activityId = this.$route.params.activityId
              }
              if (this.isAddCar) {
                this.$router.push({
                  name: 'o_orderConfirm',
                  query: {
                    cartItems: JSON.stringify(this.product)
                  }
                })
              } else {
                console.log(this.activity)
                this.$router.push({
                  name: 'o_orderConfirm',
                  query: {
                    cartItems: JSON.stringify(this.product),
                    activity: JSON.stringify(this.activity),
                    couponData:JSON.stringify(this.couponData)
                  }
                })
              }
            })
          } else if (this.preview.reservation) {
            let value = JSON.parse(val)
            this.$nextTick(() => {
              let cartItems = [];
              this.product.id = value[0].product.id
              this.quantity = value[0].quantity
              cartItems.push({product: this.product, quantity: this.quantity});
              this.$.push('router_makeAppointmentOrder', {
                type: '0',
                cartItems: cartItems
              })
              console.log(cartItems)
            })
          } else {
            let value = JSON.parse(val)
            this.$.get({
              methodName: 'AddCartItem',
              productId: value[0].product.id,
              quantity: value[0].quantity
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                this.$.toast('商品成功加入购物车')
                this.shoppingcarNumber++
              }
              this.isOpen = false
            })
          }
        } else {
          if (!this.isStock) {
            this.$.toast('该商品已售完')
          }
          this.isOpen = false
        }
      },

      // 加入购物车
      addShopCar (params) {
        if(this.$.userId){
          this.preview.quantity = '1'
          this.preview.buyNow = params.buyNow
          this.preview.reservation = params.reservation
          this.product.specifications.forEach(type => {
            type.value = []
            this.product.specificationValues.forEach(val => {
              if (val.specificationId === type.id) {
                type.value.push(val)
              }
            })
          })
          this.isOpen = true
        }else{
          this.$.goLogin({
                name:'login'
              })
        }
      },
      package_collection () {
        debounceCollect()
      },
      // 收藏
      submit_collection () {
        if(this.$.userId){
          if (!this.selfIsCollect) {
            this.$.get({
              ids: [this.favorId],
              methodName: 'DeleteFavorite',
              loading:'false'
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                this.$.toast('取消收藏成功')
                this.selfIsCollect = true
                this.collectState = '收藏'
              }
            })
          } else {
            this.$.get({
              productId: this.$route.params.id,
              type: '1',
              methodName: 'AddFavorite',
              loading:'false'
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                this.$.toast('收藏成功')
                this.collectState = '已收藏'
                this.selfIsCollect = false
                this.$.get({
                  productId: this.$route.params.id,
                  methodName: 'QueryProductInfo',
                  loading:'false'
                }).then(resp => {
                  this.favorId = resp.data.product.favorId
                })
              }else{
                this.$.toast(resp.data.errorMessage)
              }
            })
          }
        }else{
           this.$.goLogin({
                name:'login'
              })
        }
      },
      tryActivePanorama (product) {
//      alert(product.id)
        product.isHaveVr == 1 && (this.$router.push({name: 'sg_goods_panorama', query: {id: product.id}}))
//        try{
//            alert('start activing route')
//
//        console.log('route actived')
//            alert('route actived')
//        }catch(err){
//            alert(err)
//        }
//
      },
      couponClose(){
        this.couponBottomSheet = false;
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    mounted () {
      window.scrollTo(0, 0)
      setTimeout(() => {
        this.selfIsCollect = this.isCollect
      }, 0)
      console.log(this.isCollect)
      // this.cancelBounce()
      setTimeout(() => {
        this.evalDataSomeIn = this.evalDataSome
        this.evalDataIn = this.evalData
      }, 100)
      // this.package_collection()
      debounceCollect = this.$.debounce(this.submit_collection, this)
      setTimeout(() => {
        this.$refs.evaluation.init()
      }, 200)

      if (this.$route.params.activityId) {
        this.isAddCar = false
      } else {
        this.isAddCar = true
      }
      // 倒计时
      setInterval(() => {
        let nowTime = new Date().getTime()
        let differTime = this.endTime - nowTime
        let endDays, surplusHours, surplusMinutes, surplusSeconds
        // if (differTime > 0) {
        endDays = Math.floor(differTime / 86400000)
        differTime -= endDays * 86400000
        surplusHours = Math.floor(differTime / 3600000)
        differTime -= surplusHours * 3600000
        surplusMinutes = Math.floor(differTime / 60000)
        differTime -= surplusMinutes * 60000
        surplusSeconds = Math.floor(differTime / 1000)
        if (surplusHours < 10) {
          surplusHours = '0' + surplusHours
        }
        if (surplusMinutes < 10) {
          surplusMinutes = '0' + surplusMinutes
        }
        if (surplusSeconds < 10) {
          surplusSeconds = '0' + surplusSeconds
        }
        // let strTime = endDays + '天' + surplusHours + '小时' + surplusMinutes + '分钟' + surplusSeconds + '秒'
        // console.log(endDays)
        this.surplusTime.surplusHours = surplusHours
        this.surplusTime.surplusMinutes = surplusMinutes
        this.surplusTime.surplusSeconds = surplusSeconds
        this.surplusTime.endDays = endDays
      }, 500)
      this.$nextTick(() => {
        this.getReputation()

      })

    }
  }
</script>
<style>
  #goodsDetail {
    background-color: #fff;
  }

  #goodsDetail .right_icon {
    margin-right: 10px;
  }

  #goodsDetail .tab_title {
    position: fixed;
    top: -1px;
    left: 20%;
    width: 60%;
    z-index: 101;
  }

  #goodsDetail .mu-tabs {
    background-color: #F7F7F7;
  }

  #goodsDetail .mu-tab-link-highlight {
    background-color: #f98700;
  }

  #goodsDetail .my-swipe {
    height: 200px;
  }

  #goodsDetail .sg_border {
    padding-left: 14px;
    padding-top: 10px;
    padding-right: 14px;
    padding-bottom: 8px;
    color: #929292;
    border-top: 1px dotted #929292;
  }

  #goodsDetail .choose {
    border-top: 1px solid #bcbcbc;
    padding: 14px 0px;
    color: #929292;
  }

  #goodsDetail .choose_center {
    border-left: 1px solid #bcbcbc;
    border-right: 1px solid #bcbcbc;
  }

  #goodsDetail .choose span {
    display: inline-table;
    vertical-align: middle;
    text-align: center;
    width: 100%;
    padding-bottom: 1px;
  }

  #goodsDetail .mu-tab-active {
    color: #f98700;
  }

  #goodsDetail .service {
    border: 1px solid #929292;
    background-color: #fff;
    width: 15%;
    background: url(../../assets/service.svg) no-repeat center center;
    margin-left: 10px;
  }

  #goodsDetail .joinCar {
    border: 1px solid #f98700;
    background-color: #fff;
    width: 30%;
    color: #f98700;
  }

  #goodsDetail .nowRub {
    border: 1px solid #f98700;
    background-color: #f98700;
    color: #fff;
    width: 45%;
  }

  #goodsDetail .secondly {
    border: 1px solid #f98700;
    background-color: #fff;
    color: #f98700;
  }

  #goodsDetail .primary {
    border: 1px solid #f98700;
    background-color: #f98700;
    color: #fff;
  }

  #goodsDetail .primary-button {
    float: right;
    display: inline-block;
    margin-top: 2px;
    height: 32px;
    line-height: 32px;
    margin-top: 6px;
    margin-bottom: 6px;
    margin-right: 1%;
    padding: 0px;
    font-size: 16px;
  }

  #goodsDetail .foot_style {
    background-color: #fff;
    margin-top: 100px;
  }

  #goodsDetail .service {
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    margin-right: 1%;
    padding: 6px 0px;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  #goodsDetail .futile {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  #goodsDetail .right_icon img {
    display: inline-block;
    margin-top: 11px;
  }

  #goodsDetail .badge {
    margin-top: 20px;
  }

  #goodsDetail .badgeImg {
    position: absolute;
    top: 13px;
    right: 24px;
  }

  #goodsDetail .collection {
    border-right: 1px solid #dadada;
    background: url(../../assets/icon_shop_fav_emp.png) no-repeat center top 2px;
    text-align: center;
    background-size: 21px;
    width: 55px;
    padding-top: 30px;
    display: inline-block;
    margin-bottom: 10px;
    color: #666;
  }

  #goodsDetail .collected {
    border-right: 1px solid #dadada;
    background: url(../../assets/icon_shop_fav_full.png) no-repeat center top 2px;
    text-align: center;
    width: 55px;
    background-size: 21px;
    padding-top: 30px;
    display: inline-block;
    margin-bottom: 10px;
    color: #666;
  }

  #goodsDetail .share {
    background: url(../../assets/share.png) no-repeat center top 5px;
    text-align: center;
    width: 55px;
    background-size: 21px;
    padding-top: 30px;
    display: inline-block;
    margin-bottom: 10px;
    color: #666;
  }

  /*限时秒杀*/
  #goodsDetail .priceDetail {
    width: 100%;
    background-color: #f12b2c;
    color: #fff;
    padding: 10px 14px;
  }

  #goodsDetail .priceDetail img {
    margin-left: 3%;
    margin-top: 7px;
  }

  #goodsDetail .priceDetail rt {
    text-align: center;
  }

  #goodsDetail .priceDetail ruby {
    margin-left: 1%;
  }

  #goodsDetail .priceDetail del {
    color: #988f90;
    padding-top: 10px
  }

  #goodsDetail .priceDetail .time {
    color: #fbeb00;
    padding-top: 18px;
  }

  #goodsDetail .subscription {
    font-size: 1.4rem;
  }

  .mint-swipe, .mint-swipe-items-wrap {
    text-align: center;
  }

  #goodsDetail #foot {
    border-top: 1px solid #bcbcbc;
  }

  #goodsDetail .loading span {
    position: absolute;
    bottom: -20px;
  }

  #goodsDetail .text-right {
    float: right;
  }

  #goodsDetail .options-label {
    font-size: 1.2rem;
    color: #797979;
  }

  #goodsDetail .divide {
    border: none;
  }

  #goodsDetail .foot {
    height: 44px;
    padding-bottom: 0px;
  }

  #goodsDetail .vricon {
    background: url(../../assets/vr-icon.png) no-repeat;
    background-size: 100% 100%;
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    line-height: 3rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.1rem;
    color: #fff;
    z-index: 200;
  }

  .reputation,
  .coupon {
    padding: 10px 14px 15px;
    position: relative;
  }

  .reputation h6,
  .coupon h6 {
    margin-bottom: 10px;
    font-size: 1.3rem;
    color: #797979;
    font-weight: normal;
  }

  .reputation span {
    background: #f0f2f5;
    border-radius: 3px;
    color: #a4a6a9;
    font-size: 1.15rem;
    text-align: center;
    padding: 2px 4px;
    margin-right: 5px;
  }

  .hg_f .col_red span {
    font-size: 1.2rem;
  }

  .foot_style .primary-button {
    width: 100px;
  }

  .reservation-button {
    width: 70px !important;
  }

  .gray-button {
    background: #eee !important;
    border: #ddd solid 1px !important;
    color: #999 !important;
    position: relative;
  }

  .gray-button:after {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }

  .original-price {
    text-decoration: line-through;
  }

  /*优惠提示*/
  .discount-tips {
    padding: 8px 14px;
    position: relative;
  }

  .discount-tips h6 {
    font-size: 1rem;
    color: #aaa;
    font-weight: normal;
    position: absolute;
    top: 11px;
    left: 14px;
  }

  .discount-tips > div {
    line-height: 180%;
    color: #797979;
    font-size: .9rem;
    padding-left: 3rem;
  }

  .discount-tips > div > span {
    border: #f02b2b solid 1px;
    border-radius: 3px;
    margin-right: 5px;
    padding: 0 3px;
    color: #f02b2b;
  }

  .swiper .swiper-pagination .swiper-pagination-bullet.active,
  .swiper .swiper-pagination .swiper-pagination-bullet {
    background: #F98700;
  }

  /*设置V豆抵扣的样式*/
  .V-bean-rmb {
    font-size: 1rem;
    color: #888;
    margin-left: 1rem;
    position: relative;
    top: -0.5rem;
    border: 1px solid #888;
    padding: 3px 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
 .promotion{
    min-height: 45px;
    position: relative;
  }
  .promotion h6{
    float: left;
    font-size: 1.2rem;
    color: #797979;
    font-weight: normal;
    line-height: 45px;
    padding-left: 14px;
  }
  .promotion-box{
    overflow: hidden;
    padding: 10px 10px 5px 20px;
  }
  .promotion-box .promotion-text{
    padding: 8px 0;
  }
  .promotion-box .promotion-text span{
    border: 1px solid red;
    padding: 2px 6px;
    border-radius: 5px;
  }
  .promotion-box .promotion-text p{
    display: inline;
    padding-left: 5px;
  }
 .promotion-right{
    color:#6C6C6C;
    position: absolute;
    right: 10px;
    top: 8px;
  }
  .promotion-header{
    text-align: center;
  }
</style>
