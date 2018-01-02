<template>
  <div class="background-gray" id="shoppingCar-edit">
    <scroll>
      <template v-for="cart in value">
        <mu-divider shallowInset/>
        <div layout="row" layout-align="flex-start center" class="shop-content">
          <mu-checkbox slot="chose" v-model="cart.isShopSelected" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
          <img :src="cart.shop.logo?addPath(cart.shop.logo):favicon" alt="" width="20" height="20">
          <p>{{cart.shop.name}}</p>
        </div>
        <mu-divider shallowInset/>
        <panel v-for="(item,index) in cart.cartItems" :key="index" :value="item.product">
          <mu-checkbox slot="chose" v-model="isSelected" :nativeValue="JSON.stringify(item)" class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
          <div slot="desc" class='desc edit' v-tap="{methods: update, item: item}" v-if="item.desc">
            {{item.desc}}
            <!-- <img :src="down"> -->
          </div>
          <number slot="price" :number="item.quantity" :stock="item.product.stock" v-model="item.quantity" ref="number"></number>
        </panel>
      </template>
    </scroll>

    <mu-divider class="bottom" shallowInset/>
    <foot class="text-right">
      <div slot>
        <mu-checkbox label="全选" v-model="isSelectAll"  class="checkbox" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        <a class="primary-button warn" v-tap="{ methods: deleteShopCar }">删除</a>
        <a class="primary-button" v-tap=" { methods: moveToFavorite } ">移到收藏</a>
      </div>
    </foot>

    <foot-sheet :isBottomSheetOpen="isOpen" v-on:close="close" :value="goodItem" :preview="preview" :ifAnmition="false"></foot-sheet>
  </div>
</template>

<script>
  /* eslint-disable */
  import panel from 'components/panel'
  import icarHeader from 'components/my-header'
  import icarCheckbox from 'components/icar-checkbox'
  import left from 'assets/left-blank.svg'
  import editIcon from 'assets/edit.svg'
  import down from 'assets/down.svg'
  import foot from 'components/foot'
  import icarButton from 'components/order-button'
  import number from 'components/number'
  import footSheet from 'components/bottom-sheet'

  import scroll from 'components/scroll'
  import favicon from 'assets/default_user_icon.png'

  export default {
    name: 'asc_shoppingCart_edit',
    props: {
      value: {
        type: Array
      }
    },
    components: {
      scroll,
      panel,
      icarHeader,
      icarCheckbox,
      foot,
      icarButton,
      number,
      footSheet
    },
    watch:{
      value:{
        deep:true,
        immediate:true,
        handler:function (newValue,oldValue) {
            this.value.map((cart)=>{
              if(cart.isShopSelected){
                cart.cartItems.map((item)=>{
                  if (this.isSelected.indexOf(item) < 0) {
                    item = JSON.stringify(item)
                    this.isSelected.push(item)
                  }
                });
              }else{
                cart.cartItems.map((item)=>{
                  item = JSON.stringify(item)
                  if (this.isSelected.indexOf(item) > -1) {
                    this.isSelected.splice(this.isSelected.indexOf(item),1)
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
              console.log('11111')
              this.value.map((cart)=>{
                cart.isShopSelected = true;
                cart.cartItems.forEach(val => {
                    val = JSON.stringify(val)
                  if (this.isSelected.indexOf(val) < 0) {
                    this.isSelected.push(val)
                  }
                })
              });
            } else {
              this.value.map((cart)=>{
                cart.isShopSelected = false;
              });
              this.isSelected = []
            }
          
        }
      }
    },
    data () {
      return {
        left,
        editIcon,
        down,
        isEdit: false,
        // isSelectAll: false,
        isSelected: [],
        isShopSelected :[],
        isOpen: false,
        goodItem: {},
        preview: {},
        favicon,
        isSelectAll : false
      }
    },
    methods: {
      changeNumber (val) {
        console.log(val)
      },
      edit () {
        this.isEdit = !this.isEdit
      },
      deleteShopCar () {
        if (this.isSelected.length <= 0) {
          this.$.toast('请选择商品')
          return
        }
        let ids = []
        this.isSelected.forEach((val, key) => {
          val = JSON.parse(val)
          ids.push(val.id)
        })
        let req = {
          methodName: 'DeleteCartItem',
          ids: ids
        }
        this.$.get(req).then(resp => {
          if (resp.data.resultCode === '100') {
            ids.forEach((val, key) => {
              val = JSON.stringify(val)
              let index = this.isSelected.indexOf(val)
              this.isSelected.splice(index, 1)
            })
            this.$emit('DeleteCartItem')
          }
        })
      },
      update (params) {
        let id = params.item.product.id
        this.preview = params.item
        this.$.get({
          methodName: 'QueryProductInfo',
          productId: id
        }).then(resp => {
          resp.data.product.specifications.forEach(type => {
            type.value = []
            resp.data.product.specificationValues.forEach(val => {
              if (val.specificationId === type.id) {
                type.value.push(val)
              }
            })
          })
          this.goodItem = resp.data.product
          this.isOpen = true
        })
      },
      close (ifUpdate) {
        if (ifUpdate) {
          this.submit(JSON.parse(ifUpdate))
        }
        this.isOpen = false
      },
      moveToFavorite () {
        if (this.isSelected.length === 0) {
          this.$.toast('请选择商品')
          return
        }
        let ids = []
        this.isSelected.forEach(val => {
          val = JSON.parse(val)
          ids.push(val.id)
        })
        let req = {
          methodName: 'MoveToFavorite',
          ids: ids
        }
        this.$.get(req).then(resp => {
          if (resp.data.resultCode === '100') {
            this.$.toast('收藏成功')
          } else {
            // bug 11014
            this.$.toast(resp.data.errorMessage)
          }
          setTimeout(() => {
            this.$emit('update')
          }, 500)
        })
      },
      submit (val) {
        val.forEach(value => {
          value.product = {
            id: value.product.id
          }
        })
        let req = {
          methodName: 'UpdateCartItem',
          cartItems: val
        }
        // console.log(req)
        this.$.get(req).then(resp => {
          this.$emit('update')
        })
      }
    }
  }
</script>

<style>

  #shoppingCar-edit .foot{
    height: 44px;
    padding-top: 0px;
  }

  #shoppingCar-edit .foot .checkbox{
    margin-top: 8px;
  }

  #shoppingCar-edit .warn{
    background-color: #f02b2b;
  }

  #shoppingCar-edit .checkbox{
    display: inline;
    margin-left: 10px;
    float: left;
    margin-right: 6px;
  }

  #shoppingCar-edit .primary-button{
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

  #shoppingCar-edit .edit {
    border: 1px solid #ccc;
    padding-bottom: 2px;
    margin-top: 3px;
    margin-bottom: 16px;
    padding-right: 5px;
    display: inline-block;
    padding-left: 5px;
    font-size: 1rem;
  }

  #shoppingCar-edit .edit img {
    width: 12px;
  }
  #shoppingCar-edit .shop-content{
    padding: 10px;
  }
  #shoppingCar-edit .shop-content p{
    margin-left: 10px;
    line-height: 25px;
  }
  #shoppingCar-edit .shop-content img{
    margin-left: 10px;
    line-height: 25px;
  }
</style>
