<template>
  <div class="flow-package">
    <div class="description"></div>
    <div class="package-wrap">
      <div class="package" @click="selectdPackage(_package.index)" 
                           :class="{ active: _package.active }" 
                           v-for="_package of packages" 
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
  name: "FlowPackage",
  components: {
    payment
  },
  data() {
    return {
      bottomPopup: false,
      progress: {
        strokeColor: "#ff8d00",
        width: 50,
        striped: true,
        percentage: 26
      },
      packages: [
        // {
        //   active: false,
        //   index: 0,
        //   name: "100M",
        //   price: "售价：80.00元"
        // }
      ],
      orderId : '',
      sum:'',
      rechargePackageId:'',
      packageText:''
    };
  },
  props: {
    simId: {
      type: [String, Number],
      default() {
        return "";
      }
    }
  },
  created() {
    // 动态设置圆形进度条的大小
    this.progress.width = Math.min(document.body.clientWidth / 4);
    this.getPackages()
  },
  methods: {
    createOrder(params, payway) {
      if (!params) {
        this.bottomPopup = false;
        return;
      }
      console.log('orderId: '+this.orderId)
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
    getPackages() {
      this.$.get({
          methodName: "ListRechargePackage",
          packageType: "1",
          simId: this.simId
        })
        .then(resp => {
          resp = resp.data;
          if (resp.resultCode === "100") {
            resp.rechargePackageDatas.forEach((data,item)=>{
              this.packages.push({
                id:data.id,
                active: false,
                index: item,
                rechargePackageSn:data.rechargePackageSn,
                name: data.name,
                price: data.price,
                notice:data.notice || ''
              })
            })
          } else {
            this.$.toast(resp.errorMessage);
          }
        });
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
        if(resp.data.resultCode === '100'){
          this.bottomPopup = true;
          this.orderId = resp.data.id
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
    // 选择套餐种类
    selectdPackage(index) {
      this.packages.map(p => {
        p.active = false;
      });
      
      this.packages[index].active = true;
      this.rechargePackageId =  this.packages[index].id
      this.sum = this.packages[index].price
      this.packageText = this.packages[index].notice
      console.log(this.packageText)
    }
  }
};
</script>

<style lang="scss">
.flow-package {
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
    background-color: #ff8d00;
  }
}

.call-package-popuo {
  .mu-appbar-title {
    display: flex;
    justify-content: center;
  }
}
</style>
