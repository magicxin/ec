<template>
  <section>
    <mu-bottom-sheet id="coupon-sheet" :open="bottomSheet" @close="close">
      <mu-list @itemClick="close" id="coupon">
        <mu-sub-header class="text-center">
          <h2>选择优惠</h2>
          <span v-if="shopName" class="shop-name">{{shopName}}</span>
        </mu-sub-header>
        <div class="background-gray">
          <cells v-for="(item,index) in coupons" :key="index">
            <cell :link="false">
              <div slot="label">
              <!-- {{item.couponList[0].name}} -->
                <div class="coupon-amount">{{item.name}}</div>
                <!-- <div class="coupon-name">{{item.couponList[0].desc}}</div> -->
                <!-- <div class="coupon-term">使用期限：{{item.couponList[0].beginDate}}至{{item.couponList[0].endDate}}</div> -->
                <mu-flat-button label="使用" class="demo-flat-button" 
                                backgroundColor="#F98700" 
                                v-tap="{methods: userCoupon,index:index,name:item.name}" color="#FFF"/>
              </div>
            </cell>
          </cells>
          <div class="button">
            <mu-flat-button label="关闭" class="demo-flat-button" backgroundColor="#F98700" v-tap="{methods: close}" color="#FFF"/>
          </div>
        </div>
      </mu-list>
    </mu-bottom-sheet>
  </section>
</template>

<script>
  // import icarHeader from 'components/my-header'
  import cells from 'components/cells'
  import cell from 'components/cell'
  // import icarCheckbox from 'components/icar-checkbox'
  import money from 'assets/money.png'
  // import left from 'assets/left-gray.svg'
  import Order from "tools/order.service.js";
  let order = Order.getInstance();





  export default {
    name: 'coupon',
    props: {
      bottomSheet: {
        type: Boolean,
        default () {
          return false
        }
      },
      shopId: {},
      shopName: {},
      isStatic: {
        type: Boolean,
        default () {
          return false
        }
      },
      couponPromotions :{}
    },
    watch: {
      shopId (val) {
        this.shopId = val;
        this.initData();
      }
    },
    components: {
      // icarHeader,
      cells,
      cell,
      // icarCheckbox
    },
    // 获取支付方式
    created () {
      this.initData();
    },
    methods: {
      initData(){
        if(this.isStatic){
          this.couponPromotions.forEach(val =>{
            let data = val
            data.name = ''
            // val.couponList.forEach(resp =>{
            //   data.name += resp.name + '+'
            // })
            for(var i = 0;i<val.couponList.length;i++){
              if(i<val.couponList.length-1){
                data.name += val.couponList[i].name + '+'
              }else{
                data.name += val.couponList[i].name
              } 
            }
            this.coupons.push(data)
          })
        }else{
          this.$.get({
            type: '1',
            shopId : this.shopId,
            methodName: 'ListPromotion'
          }).then(resp => {
            this.coupons = resp.data.promotions
          })
        }
      },
      close(){
          this.$emit('close');
      },
      userCoupon(params){
        // console.log(params.index)
        order.useCouponNew(params);
        this.$emit('close',params.index,params.name);
        
      }
    },
    data () {
      return {
        // left,
        coupons: []
      }
    }
  }
</script>

<style lang="scss">
  #coupon-sheet{
    max-height: 100%;
    overflow: scroll;
  }
  #coupon {
    padding: 1rem 0 0 0;
    font-size: 1.2rem;
  }
  #coupon .text-center {
    line-height: 150%;
  }
  #coupon .text-center h2 {
    line-height: 150%;
    font-weight: normal;
    font-size: 1.4rem;
    color: #333;
  }
  #coupon .text-center span {
    display: block;
    margin-bottom: 1rem;
    font-size: 1.15rem;
    color: #666;
  }
  #coupon #cell {
    height: auto !important;
    line-height: 150%;
    padding: 1rem 0 .7rem;
  }
  #coupon #cell .coupon-amount {
    color: #ff5000;
    font-size: 1.3rem;
    width: 75%;
  }
  #coupon #cell .cell_box > div {
    width: 100%;
  }
  #coupon #cell .coupon-name {
     color: #666;
     width: 70%;
     overflow:hidden;
     text-overflow:ellipsis;
     white-space:nowrap;

  }
  #coupon #cell .coupon-term {
    color: #9c9c9c;
    font-size: .8rem;
  }
  #coupon #cell .cell_box {
    width: 100%;
    padding-right: 1.4rem;
    position: relative;
  }
  #coupon #cell .cell_box button {
    position: absolute;
    right: 1.4rem;
    bottom: 0;
  }
  #coupon .button button {
    border-radius: 0;
    width: 100%;
  }
</style>
