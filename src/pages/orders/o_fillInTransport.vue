<template id="fillInTransport">
  <div id="fillInTransport">
    <is-header mainText="填写物流信息" bgColor="#F7F7F7" textColor="#474747">
      <img :src="left">
    </is-header>
    <model :isShow="isShow" title=" " v-on:closeIsModel="close">
      {{whatHappen}}
    </model>
    <model :isShow="chose.isShow" v-on:closeIsModel="choseDelivery" title="请选择物流公司">
      <slideChose :value="chose.value" @chose="choseWhich"></slideChose>
      <a @click="choseDelivery('')" flex slot="work">取消</a>
    </model>

    <div class="text_cantainer">
      <cells>
        <cell label="物流公司"  v-tap="{methods: fillIn, type: 'delivery'}" :value="queryData.delivery"></cell>
        <cell label="物流单号"  v-tap="{methods: fillIn, type: 'trackingNo'}" :value="queryData.trackingNo"></cell>
        <cell label="联系电话"  v-tap="{methods: fillIn, type: 'mobile'}" :value="queryData.mobile"></cell>
        <cell label="退款说明"  v-tap="{methods: fillIn, type: 'explain'}" :value="queryData.explain"></cell>
      </cells>
      <upload v-tap="{methods: uploadFile}"></upload>
      <!--<div class="imgBox" v-show="imgList.length > 0">
        <a v-for="(item, index) in imgList">
          <mu-icon value="close" v-tap="{methods: cancelUploadByIndex, index: index}"></mu-icon>
          <img :src="item.data" alt="" height="100%">
        </a>
      </div>-->
      <div class="imgBox" v-if="imgList.length > 0">
        <fieldset v-for="(item, index) in imgList">
          <mu-icon value="cancel" v-tap="{methods: cancelUploadByIndex, index: index}"></mu-icon>
          <div class="innerImage">
            <img :src="item.data" alt="图片" height="100%" width="70px">
          </div>
        </fieldset>
      </div>
    </div>
    <mu-flat-button label="确定" class="button" :disabled="finish" backgroundColor="#F98700" v-tap="{methods: submit}" color="#FFF"/>
  </div>
</template>

<script>
  /* eslint-disable */
  import isText from 'components/text-filed'
  import isHeader from 'components/my-header'
  import isSelect from 'components/is-select'
  import left from 'assets/left-gray.svg'
  import model from 'components/model'
  import upload from 'components/upload'


  import slideChose from 'components/slide-chose.vue'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import Model from 'components/model/model.js'


  let cache = {}


  export default {
    name: 'o_fillInTransport',
    components: {
      isText,
      isHeader,
      isSelect,
      upload,
      model,
      slideChose,
      cells,
      cell
    },
    computed: {
      delivery () {
        switch (this.queryData.deliveryId) {
          case 0:
            return '圆通快递'
          case 1:
            return '中通快递'
          case 2:
            return '申通E物流'
          case 3:
            return '顺丰快递'
          case 4:
            return '韵达快递'
        }
      }
    },
    methods: {
      // 关闭选择框
      choseDelivery (params) {
        if (params) {
          this.chose.isShow = true
        } else {
          this.chose.isShow = false
        }
      },
      choseWhich (params) {
        let index = this.chose.value.indexOf(params.name)
        this.queryData.deliveryId = index
        this.chose.isShow = false
      },
      fillIn (params) {
        let title
        let maxLength
        switch (params.type) {
          case 'delivery':
            title = '请输入物流公司'
            maxLength: 32
            break
          case 'trackingNo':
            title = '请输入物流单号'
            maxLength = 32
            break
          case 'mobile':
            title = '请输入联系电话'
            maxLength = 32
            break
          case 'explain':
            title = '请输入退款说明'
            maxLength = 200
            break
        }
        Model({
          title,
          type: title === '请输入联系电话' ? 'tel' : 'text',
          maxLength
        }).then(resp => {
          console.log(params.type)
          this.queryData[params.type] = resp
        })
      },
      cancelUploadByIndex (params) {
        try {
          let index = params.index
          let whichToSplice = this.imgList.splice(index, 1)[0]
          let type = whichToSplice.type
          let cancelIndex = cache[type].indexOf(whichToSplice.data)
          cache[type].splice(cancelIndex, 1)
        } catch (e) {
          window.alert(e)
        }
      },
      close (params) {
        this.isShow = false
      },
      uploadFile () {
        // let req = {}
        this.$.push('router_takePhoto', {
          maxNum: '3'
        }, (resp) => {
          resp = JSON.parse(resp)
          resp.forEach(val => {
            if (this.imgList.length < 3) {
              this.imgList.push(val)
              if (!cache[val.type]) {
                cache[val.type] = []
              }
              cache[val.type].push(val.data)
            }
          })
        })
      },
      submit () {
        let els = document.querySelectorAll('input')
        this.$.handToblur(els)
        if (!this.queryData.delivery) {
          this.$.toast('请选择物流公司')
          return
        }
        if (!this.queryData.trackingNo) {
          this.$.toast('请输入物流单号')
          return
        }
        let promises = []
        for (let name in cache) {
          if (cache[name].length > 0) {
            promises.push(
              this.$.postFileByFormData({
                type: '.' + name,
                data: cache[name]
            }))
          }
        }
        if (promises.length > 0) {
          Promise.all(promises).then(([result]) => {
            this.queryData.images = result && this.queryData.images.concat(result.urls)
            this.$.get(this.queryData).then(resp => {
              if (resp.data.resultCode === '100') {
                this.finish = true
                this.$router.replace({
                  name: 'orderDetail',
                  params: {
                    orderId: this.queryData.orderItemId
                  }
                })
              }
            })
          })
        } else {
          this.$.get(this.queryData).then(resp => {
            if (resp.data.resultCode === '100') {
              this.$router.replace({
                name: 'orderDetail',
                params: {
                  orderId: this.queryData.orderItemId
                }
              })
            }
          })
        }
      }
    },
    data () {
      return {
        chose: {
          isShow: false,
          value: ['圆通快递', '中通快递', '申通E物流', '顺丰快递', '韵达快递']
        },
        imgList: [],
        left,
        finish: false,
        whatHappen: '',
        isText: 'hello',
        queryData: {
          // deliveryId: '',
          trackingNo: '',
          mobile: '',
          orderItem: {},
          methodName: 'AddReturns',
          explain: '',
          images: [],
          delivery: ''
        },
        carItem: {},
        isShow: false,
        isUpdate: false
      }
    },
    beforeRouteEnter (to, from, next) {
      let carItem = JSON.parse(to.query.orderItem)
      next(vm => {
        vm.queryData.orderItemId = carItem.orderId
        vm.queryData.refundsId = to.query.refundsId
        vm.queryData.orderItem = {
          id: carItem.id,
          quantity: carItem.quantity,
          product: {
            id: carItem.product.id
          }
      }
      })
      // this.$.get({
      //   methodName: 'QueryRefunds',
      //   orderItemId: carItem.id
      // }).then(resp => {
      //   next(vm => {
      //     if (resp.data.trackingNo) {
      //       vm.queryData.trackingNo = resp.data.trackingNo
      //       vm.queryData.mobile = resp.data.mobile
      //       vm.queryData.deliveryId = resp.data.delivery
      //       vm.queryData.explain = resp.data.explain
      //     }
      //     vm.queryData.orderItemId = carItem.orderId

      //     vm.queryData.orderItem = {
      //       id: carItem.id,
      //       quantity: carItem.quantity,
      //       product: {
      //         id: carItem.product.id
      //       }
      //     }
      //   })
      // })
    }
  }
</script>

<style>
  #fillInTransport .text_cantainer{
    padding: 10px 15px;
    background-color: #fff;
  }
  #fillInTransport .innerImage{
    display: inline-block;
    height: 100px;
    width: 70px;
    overflow: hidden;
    background-size: 100px 70px;
    background-size: cover;
  }

  #fillInTransport .innerImage img{
    clip-path: margin-box;
  }

  #fillInTransport .is_label{
    margin-top: 10px;
    margin-bottom: 10px;
    display: block;
  }

  #fillInTransport .select {
    width: 100%;
    height: 34px;
    line-height: 34px;
    border-radius: 6px;
    border-color: #CCCCCC;
  }

  #fillInTransport .imgBox {
    height: 100px;
    margin-top: 10px;
  }

  #fillInTransport .imgBox fieldset {
    border: none;
    position: relative;
    display: inline-block;
    margin-right: 5px;
    width: 70px !important;
    height: 100px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #fillInTransport .close {
    position: absolute;
    right: -10px;
    bottom: 90px;
    color: #FBAD59;
  }

  #fillInTransport .imgBox i {
    position: absolute;
    right: -10px;
    bottom: 85px;
    color: black;
    z-index: 2;
  }

  #fillInTransport .button {
    width: 90%;
    margin-left: 5%;
    margin-top: 20px;
    border-radius: 8px;
  }
</style>
