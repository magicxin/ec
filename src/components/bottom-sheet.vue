<template>
  <mu-bottom-sheet :open="bottomSheetValue" @close="closeBottomSheet()">
    <mu-list id="bottom-sheet">
      <mu-sub-header>
        <div class="top-img">
          <img :src="currentValue.image ? addPath(currentValue.image) : defaultImg" alt="" height="120px"
               width="120px" id="bottom-sheet-img" class="test">
        </div>
        <div class="top-content" layout="row" layout-align="center flex-start">
          <div flex layout="column">
            <div flex class="top-price" v-if="!activity &&currentValue.isSubscription ==='0'">
              ¥ {{ currentValue.price}}
            </div>
            <div flex class="top-price" v-if="!activity &&currentValue.isSubscription !=='0'">
              ¥ {{currentValue.subscription || currentValue.price}}
            </div>
            <div flex class="top-price" v-if="activity">¥ {{ activity.currentPrice }}</div>
            <div flex class="top-num">余{{currentValue.stock}}件</div>
            <div flex class="top-choose">选择 分类</div>
          </div>
          <img src="../assets/close-circle.svg" alt="关闭" @click="closeBottomSheet()"
               style="position: relative; top:-20px">
        </div>
      </mu-sub-header>

      <div class="choose-area" layout="column" v-for="item in currentValue.specifications">
        <mu-divider/>
        <div class="choose-head" flex>
          {{item.name}}
        </div>
        <div flex layout-wrap layout="row">
          <div flex class="not-choose"
               :class="{active: chose.indexOf(group.name) > -1, disable: canChoseList.indexOf(group.name) === -1}"
               flex="nogrow" v-for="group in item.value" v-tap="{methods: choseType, item: group}">{{group.name}}
          </div>
        </div>
      </div>

      <div class="choose-area">
        <mu-divider/>
        <div layout="row" layout-align="space-between center">
          <div flex class="choose-head" flex="nogrow">购买数量</div>
          <div flex>
            <number :number="preview.quantity" :stock="value.stock" :activity="activity" v-model="preview.quantity"
                    ref="number"></number>
          </div>
        </div>
      </div>

      <div class="foot-button">
        <mu-flat-button label="确定" @click="closeBottomSheet('true')" class="check-button"
                        labelClass="check-button-label"/>
      </div>
    </mu-list>
  </mu-bottom-sheet>
</template>
<script>
  import number from 'components/number.vue'
  import pic20 from 'assets/pic_20.png'
  import defaultImg from 'assets/default_user_icon.png'

  export default {
    name: 'bottomSheet',
    data () {
      return {
        // bottomSheetValue: false,
        defaultImg,
        _update: false,
        currentValue: Object.assign({}, this.value),
        chose: [],
        canChoseList: [],
        oldCount: '1',
        pic20
      }
    },

    methods: {
      initAnmiation () {
        let el = document.querySelector('#bottom-sheet-img')
        // 获取到原来图片的位置,并赋值给新创建的图片
        let react = el.getBoundingClientRect()
        let img = new window.Image(120, 120)
        img.src = this.currentValue.image ? this.addPath(this.currentValue.image) : this.defaultImg
        img.style.left = react.left + 'px'
        img.style.top = react.top + 'px'
        img.classList.add('md-active')
        let parent = document.querySelector('.top-img')
        parent.appendChild(img)
        setTimeout(() => {
          parent.removeChild(img)
        }, 1000)
      },
      closeBottomSheet (params) {
        let cartItems
        if (params === 'true') {
          if (this.currentValue.stock !== '0') {
            let _numberComponents = this.$refs.number
            let _result = _numberComponents.test()
            if (_result !== 'end') {
              return
            }
          }
          if (this.currentValue.stock === '0' || !this.currentValue.stock) {
            this.$parent._data.isStock = false
            this.$emit('close')
            return
          }
          if (this.preview.product.id !== this.currentValue.id || this.oldCount !== this.preview.quantity) {
            cartItems = [{
              id: this.preview.id,
              quantity: this.preview.quantity,
              product: {
                id: this.currentValue.id
              }
            }]
          }
          if (this.ifAnmition && !this.preview.buyNow) {
            this.initAnmiation()
            setTimeout(() => {
              this.$emit('close', JSON.stringify(cartItems))
            }, 1000)
            return
          }
        }
        this.$emit('close', JSON.stringify(cartItems))
      },
      choseType (params) {
        if (this.canChoseList.indexOf(params.item.name) === -1) {
          return
        }
        let id = params.item.id
        let productId
        this.currentValue.specificationGroups.forEach(val => {
          val.specificationValue.forEach(_val => {
            if (_val.id === id) {
              productId = val.productId
            }
          })
        })

        this.$.get({
          methodName: 'QueryProductInfo',
          productId: productId
        }).then(resp => {
          resp.data.product.specifications.forEach(type => {
            type.value = []
            resp.data.product.specificationValues.forEach(val => {
              if (val.specificationId === type.id) {
                type.value.push(val)
              }
            })
          })
          this.currentValue = resp.data.product
          this.getChosed(this.currentValue.fullName)
          this._getOptions(productId)
        })
      },
      _getOptions (id) {
        this.canChoseList = []
        this.currentValue.specificationGroups && this.currentValue.specificationGroups.forEach(val => {
          for (let i = 0; i < val.specificationValue.length; i++) {
            if (i === 0) {
              this.canChoseList.push(val.specificationValue[i].name)
              if (this.chose.indexOf(val.specificationValue[i].name) === -1) {
                break
              }
            }
            if (i > 0 && this.canChoseList.indexOf(val.specificationValue[i].name) === -1) {
              this.canChoseList.push(val.specificationValue[i].name)
            }
          }
        })
      },
      getChosed (val) {
        if (val && val.indexOf('[') > -1) {
          this.chose = val && val.split('[')[1].split(']')[0].split(' ')
        }
      }
    },
    props: {
      isBottomSheetOpen: {
        type: Boolean, // 打开关闭buttomSheet的布尔值，默认false
        default () {
          return false
        }
      },
      value: {
        type: Object,
        default () {
          return {
            name: 'hello',
            price: '222',
            stock: 1
          }
        }
      },
      preview: {
        type: Object,
        default () {
          return {}
        }
      },
      ifAnmition: {
        type: Boolean,
        default () {
          return true
        }
      },
      activity: {
        type: Object
      }
    },
    computed: {
      bottomSheetValue () {
        return this.isBottomSheetOpen
      },
      imgSrc () {
        let _url = this.currentValue.image
        if (_url && _url.indexOf('carowl.cn') === -1) {
          _url = 'http://carowl.cn' + _url
        }
        if (!_url) {
          _url = pic20
        }
        return _url
      }
    },
    watch: {
      value (val) {
        this.currentValue = Object.assign({}, val)
        this.getChosed(this.currentValue.fullName)
        this._getOptions(this.currentValue.id)
      },
      preview (val) {
        this.oldCount = val.quantity
      }
    },
    components: {
      number
    }
  }
</script>

<style>

  .md-active {
    position: fixed;
    top: 0px;

    animation: ripple .8s ease-in-out;
  }

  @keyframes ripple {
    to {
      position: fixed;
      /*left: 200px;*/
      left: calc(100% - 100px);
      transform: scale(0.3) rotate(720deg);
      top: -50px;
    }
  }

  #bottom-sheet {
    overflow-x: visible;
    font-weight: 300;
    padding-bottom: 0;
  }

  #bottom-sheet mu-sub-header {
    position: relative;
  }

  #bottom-sheet .top-img {
    width: 120px;
    height: 120px;
    position: absolute;
    top: -20px;
    left: 10px;
  }

  #bottom-sheet .top-img::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    width: 121px;
    height: 121px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

  #bottom-sheet .top-img img {
    border: 3px solid #fff;
    border-radius: 5px;
  }

  #bottom-sheet .top-content {
    margin: 8px 10px 10px 135px;
  }

  #bottom-sheet .top-price {
    padding-top: 20px;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 500;
    color: #ee0202;
  }

  #bottom-sheet .top-num, #bottom-sheet .top-choose {
    font-size: 16px;
    color: #000;
    line-height: 1.4;
  }

  #bottom-sheet .choose-area {
    margin: 15px 15px 15px;
    font-size: 16px;
    padding-right: 8px;
    position: relative
  }

  #bottom-sheet #number {
    position: absolute;
    right: 0px;
    top: 16px;
  }

  #bottom-sheet .choose-area > div {
    width: 100%;
  }

  #bottom-sheet .choose-head {
    padding-top: 15px;
  }

  #bottom-sheet .btn_style {
    font-size: 1.2rem;
    margin: 12px 12px 0 0;
    border-radius: 5px;
  }

  #bottom-sheet .active {
    color: #fff !important;
    background-color: #F98700 !important;
    border-radius: 3px;
  }

  #bottom-sheet .not-choose {
    color: #000;
    background-color: #fff;
    position: relative;
    display: inline-block;
    padding: 7px;
    margin-right: 12px;
    margin-top: 12px;
    font-size: 1.1rem;
    color: #787878;
  }

  #bottom-sheet .disable {
    background-color: #FFF0F0;
    color: #7C7979;
  }

  #bottom-sheet .not-choose::before {
    content: '';
    position: absolute;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    transform: scale(0.5);
  }

  #bottom-sheet .foot-button {
    margin-top: 40px;
    margin-right: 0px;
  }

  #bottom-sheet .check-button {
    width: 100%;
    height: 50px;
    background-color: #f98700;
    color: #fff;
    border-radius: 3px;
  }

  #bottom-sheet .check-button-label {
    font-size: 18px;
    font-weight: 300;
  }

  #bottom-sheet .choose-num {
    padding-top: 15px;
  }

  #bottom-sheet .num-side {
    background-color: #fbfbfb;
    width: 28px;
    height: 28px;
    font-size: 26px;
    line-height: 28px;
    text-align: center;
    font-weight: 300;
    color: #c3c3c3;
    position: relative;
  }

  #bottom-sheet .num-side::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 56px;
    height: 56px;
    border: 1px solid #c3c3c3;
    transform: scale(0.5);
  }

  #bottom-sheet .num-center {
    background-color: #f5f5f5;
    width: 42px;
    height: 28px;
    font-size: 16px;
    color: #000;
    line-height: 28px;
    text-align: center;
    position: relative;
  }

  #bottom-sheet .num-center::before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 84px;
    height: 1px;
    background-color: #c3c3c3;
    transform: scale(0.5);
  }

  #bottom-sheet .num-center::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -50%;
    width: 84px;
    height: 1px;
    background-color: #c3c3c3;
    transform: scale(0.5);
  }

  #bottom-sheet .num-choose {
    color: #f98700;
  }

  @media screen and (max-width: 340px) {
    #bottom-sheet .btn_style {
      margin: 6px 6px 0 0;
      border-radius: 3px;
    }

    #bottom-sheet .foot-button {
      margin-top: 20px;
    }

    #bottom-sheet .choose-head, #bottom-sheet .choose-num {
      padding-top: 8px;
    }
  }
</style>
