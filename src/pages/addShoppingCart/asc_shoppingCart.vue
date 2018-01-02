<template>
  <div class="background-gray" id="shoppingCar">
    <magic-header titleName="购物车" :returnNative="$route.params.native"> 
      <div slot="title-right">
        <a  @click="edit" class="right finish" v-if="queryData.length > 0 && !isEdit">
          编辑
        </a>
        <a  @click="edit" v-if="isEdit" class="right finish">
          完成
        </a>
      </div>
    </magic-header>
    <empty v-if="queryData.length === 0" message="您的购物车空空如也">

    </empty>
    <div v-else>

      <shoppingcar-edit ref="shopCarEdit" v-if="isEdit" :value="queryData" v-on:DeleteCartItem="reGet" v-on:update="reGet"></shoppingcar-edit>

      <div v-else class="box">
        <scroll>
          <template v-for="cart in queryData" >
            <mu-divider shallowInset/>
            <div layout="row" layout-align="flex-start center" class="shop-content">
              <mu-checkbox slot="chose" v-model="cart.isShopSelected" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
              <img :src="cart.shop.logo?addPath(cart.shop.logo):favicon" alt="" width="20" height="20">
              <p>{{cart.shop.name}}</p>
              <i class="mu-icon material-icons">keyboard_arrow_right</i>
              <p flex align-self="flex-end" class="text-right" v-if="cart.hasCoupons==='1'?true:false" @click="getCoupon(cart.shop)">领券</p>
            </div>
            <mu-divider shallowInset/>
            <panel v-for="(item,index) in cart.cartItems" :isValid="item.isValid==='0'" :key="index" :value="item.product" :link="true" :service="item.product.categoryType==='2'?true:false">
              <!-- 因 mu-checkbox 的 nativeValue 值不能为对象 随意用 JSON.stringify 转成字符串 在使用的时候转换回来-->
              <mu-checkbox slot="chose" :disabled="item.isValid==='1'?false:true" v-if="item.product.categoryType!=='2'&&item.isValid==='1'" v-model="isSelected" name="group" :nativeValue="JSON.stringify(item)" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
              <mu-checkbox slot="chose" :disabled="item.isValid==='1'?false:true" v-if="item.product.categoryType==='2'&&item.isValid==='1'" v-model="isServiceSelected" name="group" :nativeValue="JSON.stringify(item)" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
              <p slot="chose" v-if="item.isValid==='0'" class="validTag">无效</p>
              <div slot="desc" class='desc'>
                {{item.desc}}
              </div>
              <div slot="service" class="text-right">
                可预约
              </div>
              <price slot="price" :value="item.product && item.product.price">
              </price>
              <div slot="number" class="text-right">
                X{{item.quantity}}
              </div>
            </panel>
          </template>
        </scroll>
        <foot class="text-right">
          <mu-checkbox label="全选" name="group" v-model="isSelectAll" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
          <a class="primary-button" v-tap="{methods: orderConfirm}">结算({{isSelected.length+isServiceSelected.length}})</a>
          <a class="primary-button secondly" v-tap="{methods: orderServiceConfirm}">预约({{isServiceSelected.length}})</a>
          <a class="sum">
            合计:<span>¥{{priceAll}}</span>
            <p>(含运费: 包邮)</p>
          </a>
        </foot>
      </div>
    </div>
    <coupon :bottomSheet="bottomSheet" @close="couponClose" :shopId="selectedGoodsShopId" :shopName="selectedGoodsShopName" v-if="selectedGoodsShopId"></coupon>
  </div>
</template>

<script>
  /* eslint-disable */
  import Vue from 'vue'
  import shoppingcarEdit from './asc_cartEdit'
  import panel from 'components/panel'
  import icarHeader from 'components/my-header'
  import icarCheckbox from 'components/icar-checkbox'
  import left from 'assets/left-gray.svg'
  import editIcon from 'assets/edit.svg'
  import price from 'components/price'
  import origin from 'components/origin'
  import foot from 'components/foot'
  import icarButton from 'components/order-button'
  import number from 'components/number'
  import defaultEmpty from 'assets/default_empty_icon.png'
  import empty from 'components/empty-page.vue'
  import scroll from 'components/scroll'
  import favicon from 'assets/default_user_icon.png'
  import coupon from "../payment/p_coupon.vue";
  import magicHeader from 'components/magicHeader'



  // let _cacheQueryDataForEdit = null

  // function getShopCar () {
    
  // }
  export default {
    name: 'asc_shoppingCart',

    components: {
      magicHeader,
      coupon,
      scroll,
      shoppingcarEdit,
      panel,
      icarHeader,
      icarCheckbox,
      price,
      origin,
      foot,
      icarButton,
      number,
      empty
    },
    data () {
      return {
        cacheQueryDataForEdit: [],
        defaultEmpty,
        left,
        editIcon,
        isEdit: false,
        queryData: [],
        isSelected: [],
        isServiceSelected: [],
        favicon,
        bottomSheet : false,
        selectedGoodsShopId : '',
        selectedGoodsShopName : '',
        isSelectAll : false
      }
    },
    watch:{
      queryData:{
        deep:true,
        immediate:true,
        handler:function (newValue,oldValue) {
            this.queryData.map((cart)=>{
              if(cart.isShopSelected){
                cart.cartItems.map((item)=>{
                    if(item.isValid==='1'){
                      if(item.product.categoryType==='2'){
                          item = JSON.stringify(item)
                        if (this.isServiceSelected.indexOf(item) < 0) {
                          this.isServiceSelected.push(item)
                        }
                      }else{
                          item = JSON.stringify(item)
                        if (this.isSelected.indexOf(item) < 0) {
                          this.isSelected.push(item)
                        }
                      }
                    }
                });
              }else{
                cart.cartItems.map((item)=>{
                  if(item.product.categoryType==='2'){
                    item = JSON.stringify(item)
                    if (this.isServiceSelected.indexOf(item) > -1) {
                      this.isServiceSelected.splice(this.isServiceSelected.indexOf(item),1)
                    }
                  }else{
                    item = JSON.stringify(item)
                    if (this.isSelected.indexOf(item) > -1) {
                      this.isSelected.splice(this.isSelected.indexOf(item),1)
                    }
                  }

                });
              }
            });
          
        }
      },
      isSelectAll:{
        deep:true,
        immediate:true,
        handler:function (newValue,oldValue) {
            if (newValue) {
              this.queryData.map((cart)=>{
                cart.isShopSelected = true;
                cart.cartItems.forEach(val => {
                  // val = JSON.stringify(val)
                  if(val.isValid==='1'){
                    if(val.product.categoryType==='2'){
                      if (this.isServiceSelected.indexOf(val) < 0) {
                        val = JSON.stringify(val)
                        this.isServiceSelected.push(val)
                      }
                    }else{
                      if (this.isSelected.indexOf(val) < 0) {
                        val = JSON.stringify(val)
                        this.isSelected.push(val)
                      }
                    }
                  }
                })
              });
            } else {
              this.queryData.map((cart)=>{
                cart.isShopSelected = false;
              });
              this.isSelected = []
              this.isServiceSelected = []
            }
          
        }
      }
    },
    computed: {
      priceAll () {
        let _price = 0
        this.isSelected.forEach(val => {
          val = JSON.parse(val)
          _price = _price + val.quantity * val.product.price
        })
        this.isServiceSelected.forEach(val => {
           val = JSON.parse(val)
          _price = _price + val.quantity * val.product.price
        })
        return Number(_price).toFixed(2)
      },
      hasExit () {
        // this.isSelected
        let _selected = this.isSelected
        if (this.queryData) {
          return this.queryData.indexOf(_selected) > -1
        } else {
          return false
        }
      }
    },
    created(){
      this.getShopCar().then(resp => {
          this.queryData = resp.data.carts.map((cart)=>{
            cart.isShopSelected = false;
            return cart;
          });
        })
    },
    methods: {
      getShopCar(){
        return this.$.get({methodName: 'QueryCart'}).then(resp => {
          resp.data.cartItems.forEach(val => {
            let desc = ''
            let child = val.product.specificationValues
            child.length > 0 && child.forEach(type => {
              desc = desc + type.specificationData.name + ':' + type.name + ' '
            })
            val.desc = desc
          })
          return resp
        })
      },
      test () {
        this.$router.push({
          name: 'orderManage'
        })
      },
      goDetail (params) {
        if (params.item.categoryType === '1') {
          this.$router.push({name: 'sg_goods', params: {id: params.item.product.id, name: '1'}})
        } else {
          this.$router.push({name: 'sg_goods_car', params: {id: params.item.product.id, name: '1'}})
        }
      },
      isMultiShop(cartItems){
        let shopidFlag = JSON.parse(cartItems[0]).product.shopId;
        let result = false;
        cartItems.map((item)=>{
            item = JSON.parse(item)
            if(shopidFlag!==item.product.shopId){
              result = true;
            }
        })
        console.log(result)
        return result;
      },
      orderConfirm () {
        let allSelected = this.isSelected.concat( this.isServiceSelected)
        if (allSelected.length === 0) {
          return
        } else {
            if(this.isMultiShop(allSelected)){
              this.$.toast('不允许多个店铺一起结算！')
            }else{
              let newAllSelected = []
              allSelected.forEach(item =>{
                newAllSelected.push(JSON.parse(item))
              })
              this.$router.push({name: 'o_orderConfirm', query: {cartItems: JSON.stringify(newAllSelected)}})
            }
        }
      },
      orderServiceConfirm () {
        if (this.isServiceSelected.length === 0) {
          return
        } else {
            if(this.isMultiShop(this.isServiceSelected)){
              this.$.toast('不允许多个店铺一起预约！')
            }else{
              let cartItems = []
              let flgItem = [];
              let allSelected = this.isSelected.concat( this.isServiceSelected)
              allSelected.map((item)=>{
                  item = JSON.parse(item)
                  console.log(item)
                  if(item.product.isBuyAtShop==='0'||item.product.categoryType !== '2'){
                    flgItem.push(item);
                  }
              })
              if(flgItem&&flgItem.length>0){
                let notsupport = ''
                flgItem.map((item)=>{
                  notsupport += item.product.name + ','
                })
                this.$.toast('部分商品不支持预约：' + notsupport.substring(0,notsupport.length-1))
              }else{
                let _ServiceSelected = []
                this.isServiceSelected.forEach(val =>{
                  _ServiceSelected.push(JSON.parse(val))
                })
                console.log(_ServiceSelected)
                this.$.push('router_makeAppointmentOrder', {
                  type:'0',
                  cartItems: _ServiceSelected
                })
              }
            }
        }
      },
      edit () {
        let childEdit = this.$refs.shopCarEdit
        let numberResults = []
        if (childEdit) {
          let numbers = childEdit.$refs.number
          if (Array.isArray(numbers)) {
            numbers.forEach(val => {
              numberResults.push(val.test())
            })
          }
          if (numberResults.indexOf(undefined) > -1) {
            return
          }
        }
        this.isSelected = []
        this.isServiceSelected = []
        this.isEdit = !this.isEdit
        if (!this.isEdit) {
          this.submit()
        }
      },
      reGet () {
        this.getShopCar().then(resp => {
          this.queryData = resp.data.carts.map((cart)=>{
            cart.isShopSelected = false;
            return cart;
          });
        })
      },
      diff () {
        // this.cacheQueryDataForEdit.forEach(val => {
        //   if
        // })
        let queryDataHasChange = []
        this.queryData.map((cart)=>{
          cart.cartItems.forEach(val => {
            this.cacheQueryDataForEdit.forEach(value => {
              if (val.id === value.id) {
                if (val.quantity != value.quantity) {
                  queryDataHasChange.push(val)
                }
              }
            })
          })
        });

        return queryDataHasChange
      },
      submit (val) {
        if (this.queryData.length === 0) {
          return
        }
        // let _value = this.diff()
        // if (_value.length === 0) {
        //   return
        // }
        let cartItems = [];
        this.queryData.map((cart)=>{
          cart.cartItems.forEach(val => {
            val.product = {
              id: val.product.id
            }
          })
          cart.cartItems.map((item)=>{
            cartItems.push(item);
          })
        });
        let req = {
          methodName: 'UpdateCartItem',
          cartItems: cartItems
        }
        this.$.get(req).then(resp => {
          this.getShopCar().then(resp => {
            this.cacheQueryDataForEdit = []
            this.queryData = resp.data.carts.map((cart)=>{
              cart.isShopSelected = false;
              return cart;
            });
          })
        })
      },
      checkIfExit (value) {
        if (this.queryData) {
          return this.queryData.indexOf(value) > -1
        } else {
          return false
        }
      },
      getCoupon(shop){
        this.selectedGoodsShopId = shop.id;
        this.selectedGoodsShopName = shop.name;
        this.bottomSheet = true;
      },
      couponClose(){
        this.bottomSheet = false;
      }
    },
    // beforeRouteEnter (to, from, next) {
    //   this.getShopCar().then(resp => {
    //     next(vm => {
    //       vm.queryData = resp.data.carts.map((cart)=>{
    //         cart.isShopSelected = false;
    //         return cart;
    //       });
    //     })
    //   })
    // }
  }
</script>

<style>
  #shoppingCar{
    height: 100%;
  }

  #shoppingCar .box{
    margin-bottom: 40px;
  }
  #shoppingCar .bottom {
    margin-bottom: 40px;
  }

  #shoppingCar .result_empty{
    margin-top: 40px;
  }

  #shoppingCar .panorama_fish_eye{
    color: #939393;
    font-size: 40px;
  }

  #shoppingCar .mu-checkbox-icon-uncheck{
    color: #939393;
  }

  #shoppingCar .check_circle{
    color: #548CD1;
  }

  #shoppingCar i {
    font-size: 25px !important;
  }

  #shoppingCar .desc{
    color:#B0B0B0;
    margin-bottom: 9px;
  }

  #shoppingCar .sum{
    color: #7D7D7D;
    font-size: 1rem;
    line-height: 16px;
    margin-right: 15px;
    float: right;
    margin-top: 6px;
  }

  #shoppingCar .sum span{
    color: #E2441D;
  }

  #shoppingCar .sum p{
    font-size: 1rem;
  }


  #shoppingCar .right {
    color: #F98B0F;
    font-size: 1.2rem;
    position: relative;
    right: 10px;
  }

  #shoppingCar .foot{
    height: 44px;
  }

  #shoppingCar .foot .checkbox{
    margin-top: 8px;
    font-size: 14px;
    position: relative;
    left: 6px;
  }

  #shoppingCar .checkbox{
    display: inline;
    margin-left: 10px;
    float: left;
    margin-right: 6px;
  }

  #shoppingCar .primary-button{
    margin-top: 2px;
    float: right;
    background-color: #F98700;
    text-align-last: center;
    height: 32px;
    line-height: 32px;
    margin-top: 6px;
    margin-bottom: 6px;
    margin-right: 1%;
    font-size:16px;
    width: 80px;
  }

  #shoppingCar .secondly{
    border: 1px solid #f98700;
    background-color: #fff;
    color: #f98700;
    width: 70px;
  }

  #shoppingCar .text-right{
    margin-right: 10px;
    color: #969696;
    /*margin-top: 2px;*/
  }
  #shoppingCar .shop-content{
    padding: 10px;
  }
  #shoppingCar .shop-content p{
    margin-left: 10px;
    line-height: 25px;
  }
  #shoppingCar .shop-content img{
    margin-left: 10px;
    line-height: 25px;
  }
  #shoppingCar .shop-content .checkbox{
    position: relative;
    left: -4px;
  }
  #shoppingCar .validTag{
    width: 31px;
    text-align: center;
    margin-left: 6px;
    background: #eee;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    font-size: 9px;
    float: left;
    margin-right: 3px;
/*     display: inline;
margin-left: 10px;
float: left;
margin-right: 6px; */
  }
</style>
