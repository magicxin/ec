<template>
  <div class="call-package">
    <div class="description"></div>
    <div class="package-wrap">
      <div class="package" @click="selectdPackage(_package.index)" 
                          :class="{ active: _package.active }" 
                          v-for="_package of rechargePackageDatas" 
                          :key="_package.index">
        <div class="name">{{_package.name}}</div>
        <div class="price">{{_package.price}}元</div>
      </div>
    </div>
    <mu-divider/>
    <div class="description" v-if="packageText !== ''">说明：{{packageText}}</div>
    <mu-raised-button label="立即订购" @click="order" fullWidth class="demo-raised-button" />


    <mu-bottom-sheet :open="bottomPopup"
                     @close="closeBottomPopup">
      <mu-list @itemClick="closeBottomPopup">
        <mu-sub-header class="text-center">
          支付详情
        </mu-sub-header>
        <payment :sum="sum"
                 :callback="createOrder"
                 :orderId = "orderId"
                 type="recharge"></payment>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import payment from "../payment/p_payment.vue";
export default {
  name: 'CallPackage',
  components: {
    payment
  },
  data() {
    return {
      bottomPopup: false,
      rechargePackageId:'',
      rechargePackageDatas: [],
      orderId : '',
      sum:'',
      packageText:''
    };
  },
  props:{
    simId:{
      type:[String,Number],
      default(){
        return ''
      }
    }
  },
  created() {
    this.getRechargePackages();
  },
  methods: {
    createOrder(params, payway) {
      if (!params) {
        this.bottomPopup = false;
        return;
      }
      console.log('payway: '+payway)
      this.$.push("router_pay", {
          orderId: this.orderId,
          payType: payway
        },(response)=>{
          this.bottomPopup = false;
          if (response === '0') {
            this.$.toast('充值成功') 
            return
          }
          if (response === "1") {
            this.$.toast("支付失败");
            return
          }
          if (response === "2") {
            this.$.toast("支付取消");
            return
          }
          if (response === "3") {
            this.$.toast("请先安装微信");
            return
          }
          // this.$router.replace({
          //   name: "orderDetail",
          //   params: {
          //     orderId: this.orderId
          //   }
          // });
        })
    },
    getRechargePackages(){
      this.$.get({
        methodName:'ListRechargePackage',
        packageType:'0',
        simId:this.simId
      }).then( resp =>{
        resp = resp.data
        if(resp.resultCode === '100'){
          console.log(resp.rechargePackageDatas)
            resp.rechargePackageDatas.forEach((data,item)=>{
              this.rechargePackageDatas.push({
                id:data.id,
                active: false,
                index: item,
                rechargePackageSn:data.rechargePackageSn,
                name: data.name,
                price: data.price,
                notice:data.notice || ''
              })
            })
        }else{
          this.$.toast(resp.errorMessage)
        }
      })
    },
    order() {
      if(this.sum == ''){
        this.$.toast('请选择套餐')
        return
      }
      this.$.get({
        methodName:'CreateSimRechargeOrder',
        simId:this.simId,
        rechargePackageId:this.rechargePackageId
      }).then(resp=>{
        console.log(resp)
        if(resp.data.resultCode === '100'){
          this.orderId = resp.data.id
          this.bottomPopup = true;
        }else{
          this.$.toast(resp.data.errorMessage)
        }
      })
    },
    closeBottomPopup() {
      this.bottomPopup = false;
    },
    handleTabChange(value) {
      this.activeTab = value;
    },
    selectdPackage(index) {
      console.log(index);
      this.rechargePackageDatas.forEach(p => {
        p.active = false;
      });
      this.rechargePackageDatas[index].active = true;
      this.rechargePackageId =  this.rechargePackageDatas[index].id
      this.sum = this.rechargePackageDatas[index].price
      this.packageText = this.rechargePackageDatas[index].notice
      console.log(this.rechargePackageDatas[index])
    }
  }
};
</script>

<style lang="scss">
.call-package {
  display: flex;
  flex-direction: column;
  align-items: center;
  .description {
    padding-top: 1vw;
    align-self: flex-start;
    font-size: 14px;
    margin-left: 2vw;
  }

  .package-wrap {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1vh;
    .package {
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      border-width: 1px;
      color: #f98700;
      border-color: #f98700;
      border-style: solid;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1vw;
      padding: 3vw 3vw 2vw;
      .name {
        font-size: 14px;
      }
      .price {
        line-height: 20px;
        font-size: 11px;
      }
    }
    .package.active {
      color: #fff;
      background-color: #f98700;
    }
  }
  .mu-raised-button-full {
    display: block;
    width: 90%;
    margin: 2rem auto;
    color: #fff;
    background-color: #f98700;
  }
}

.call-package-popuo {
  .mu-appbar-title {
    display: flex;
    justify-content: center;
  }
}
</style>
