<template>
  <div id="return">
    <is-header mainText="申请退款" bgColor="#F7F7F7" textColor="#474747">
      <img :src="left">
    </is-header>
    <model :isShow="isShow" title=" " v-on:closeIsModel="close">
      {{whatHappen}}
    </model>
    <model :isShow="chose.isShow" v-on:closeIsModel="closeChose" title=" ">
      <slideChose :value="chose.value" @chose="choseWhich"></slideChose>
      <a @click="closeChose('')" flex slot="work">取消</a>
    </model>

    <div class="return_container">
      <cells>
        <cell label="退款类型" v-tap="{methods: closeChose, type: 'type'}" :value="type" :isRequire="true"></cell>
        <cell label="退款原因" v-tap="{methods: closeChose, type: 'reason'}" :value="this.queryData.reason" :isRequire="true"></cell>
        <cell label="退款金额" v-tap="{methods: fillIn, type: 'money'}" :value="queryData.amount" :isRequire="true"></cell>
        <cell label="退款说明" v-tap="{methods: fillIn, type: 'explain'}" :value="queryData.explain"></cell>

      </cells>
      <upload v-tap="{methods: uploadFile}"></upload>
      <div class="imgBox" v-show="imgList.length > 0">
        <fieldset v-for="(item, index) in imgList">
          <mu-icon value="cancel" v-tap="{methods: cancelUploadByIndex, index: index}"></mu-icon>
          <div class="innerImage">
            <img :src="item.data" alt="图片" height="100%" width="70px">
          </div>
        </fieldset>
      </div>
    </div>
    <mu-flat-button label="确定" class="button" :disabled="finish" v-tap="{methods: submit}" backgroundColor="#F98700" color="#FFF"/>
  </div>
</template>

<script>
  /* eslint-disable */
 import Vue from 'vue'
  import isHeader from 'components/my-header'
  import model from 'components/model'
  import left from 'assets/left-gray.svg'
  import upload from 'components/upload'


  import slideChose from 'components/slide-chose.vue'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import Model from 'components/model/model.js'


  let cache = {}
  let choseImageLength
  let type
  let loading = false
  let _reasonForNoGoods = ['多拍/拍错/不想要', '快递无跟踪记录', '空包裹/少货', '未按约定时间发货', '快递一直未到','商家未按约定安排服务','维修/保养后车辆出现新故障','维修后短时间内故障再次发生','维修保养用件为假冒伪劣产品','维修保养用件与约定品牌不符', '其他']
  let _reasonForGoods = ['质量问题', '颜色/款式/图案与描述不符', '商家发错货', '商品少件/破损/污迹/生锈/等', '商品功能缺失或故障', '做工粗糙/有瑕疵', '尺寸不符', '尺码拍错/不喜欢/效果不好', '假冒品牌', '材质成分含量与描述不符','维修/保养后车辆出现新故障','维修后短时间内故障再次发生','维修保养用件为假冒伪劣产品','维修保养用件与约定品牌不符', '其他']


  export default {
    name: 'return',
    components: {
      slideChose,
      isHeader,
      upload,
      model,
      cells,
      cell
    },

    data () {
      return {
        chose: {
          isShow: false,
          value: []
        },
        imgList: [],
        isText: 'hello',
        left,
        whatHappen: '',
        queryData: {
          type: '',
          methodName: 'AddRefunds',
          orderItem: {},
          amount: '',
          explain: '',
          images: [],
          reason: ''
        },
        finish: false,
        isShow: false,
        isUpdate: false
      }
    },
    computed: {
      type () {
        switch (this.queryData.type) {
          case 0:
            return '我要退款(无需退货)'
          case 1:
            return '我要退货'
        }
      }
    },
    methods: {
      reasonFilter(val) {
        switch (val) {
          case 0:
            return '质量问题'
          case 1:
            return '颜色/款式/图案与描述不符'
          case 2:
            return '商家发错货'
          case 3:
            return '商品少件/破损/污迹/生锈/等'
          case 4:
            return '商品功能缺失或故障'
          case 5:
            return '做工粗糙/有瑕疵'
          case 6:
            return '尺寸不符'
          case 7:
            return '尺码拍错/不喜欢/效果不好'
          case 8:
            return '假冒品牌'
          case 9:
            return '材质成分含量与描述不符'
          case 10:
            return '其他'
        }
      },
      //
      beforeChose () {

        console.log(type)
        if (type === 'type') {
          this.chose.value = ['我要退款(无需退货)', '我要退货']
        }
        if (type === 'reason') {
          if (!this.queryData.type && this.queryData.type !== 0) {
            this.$.toast('请先选择退款类型')
            return
          }
          if (this.queryData.type === 0) {
            this.chose.value = _reasonForNoGoods
          }
          if (this.queryData.type === 1) {
            this.chose.value = _reasonForGoods
          }
        }
        this.chose.isShow = true
      },
      // 关闭选择弹出框
      closeChose (params) {
        if (params && params.type) {
          type = params.type
          this.beforeChose()
        }
        if (!params) {
          this.chose.isShow = false
        }
      },
      fillIn(params) {
        let title = `请输入${params.type === 'money' ? '退款金额' : '退款说明'}`
        let type = params.type === 'money' ? 'number' : 'text'
        Model({
          title,
          type,
          maxLength: params.type === '退款说明' ? 200 : 20
        }).then(resp => {
          if (params.type === 'money') {
            this.queryData.amount = resp
          } else {
            this.queryData.explain = resp
          }
        })
      },
      // 选择哪一个
      choseWhich (params) {
        let index = this.chose.value.indexOf(params.name)
        this.chose.isShow = false
        if (type === 'type') {
          if (this.queryData.type === index) {
            return
          }
          this.queryData.type = index
          this.queryData.reason = ''
          this
        } else {
          this.queryData.reason = this.chose.value[index]
        }
      },
      cancelUploadByIndex (params) {
        let index = params.index
        let whichToSplice = this.imgList.splice(index, 1)[0]
        let type = whichToSplice.type
        let cancelIndex = cache[type].indexOf(whichToSplice.data)
        cache[type].splice(cancelIndex, 1)
      },
      uploadFile () {
        let maxLength = 3
        if (this.imgList.length >= maxLength) {
          this.$.toast(`您最多可以选择${maxLength}张图片`)
          return
        }
        this.$.push('router_takePhoto', {
          maxNum: maxLength - this.imgList.length
        }, (resp) => {
          try {
            resp = JSON.parse(resp)
            resp.forEach(val => {
              if (this.imgList.length < maxLength) {
                this.imgList.push(val)
                if (!cache[val.type]) {
                  cache[val.type] = []
                }
                cache[val.type].push(val.data)
              }
            })
          } catch (e) {
            window.alert(e)
          }
        })
      },
      close (params) {
        this.isShow = false
      },
      beforeSubmit() {
         try {
          let els = document.querySelectorAll('input')
          this.$.handToblur(els)
        } catch (e) {
          this.$.toast('操作失败')
        }
        if (!this.queryData.type && this.queryData.type !== 0) {
          this.$.toast('请选择退款类型')
          loading = false;
          return
        }
        if (!this.queryData.reason && this.queryData.reason !== 0 ) {
          this.$.toast('请选择退货理由')
          loading = false;
          return
        }
        if (!this.queryData.amount) {
          this.$.toast('请输入退款金额')
          loading = false;
          return
        }
        if (this.queryData.orderItem.amount && Number(this.queryData.amount) > Number(this.queryData.orderItem.amount)) {
          this.$.toast('您最多可以退款' + this.queryData.orderItem.amount + '元')
          loading = false;
          return
        }
        if (Number(this.queryData.amount) <= 0) {
          this.$.toast('请输入合法金额')
          loading = false;
          return
        }
        if (this.isUpdate) {
          this.queryData.images = []
          this.imgList.forEach(val => {
            if (val.baseUrl) {
              this.queryData.images.push(val.baseUrl)
            }
          })
        }
        return 'canSubmit'
      },
      submit () {
        if (loading) {
          return
        }
        loading = true
        try {
          if (!this.beforeSubmit()) {
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
          let _promise = promises.length > 0 ? Promise.all(promises) : Promise.all([1])
          _promise.then(([result]) => {
            if (result && result !== 1) {
              this.queryData.images = this.queryData.images.concat(result.urls)
            }
            Vue.prototype.$.get(this.queryData).then(resp => {
              loading = false
              if (resp.data.resultCode === '100') {
                cache = {}
                this.finish = true
                this.$router.replace({
                  name: 'orderDetail',
                  params: {
                    orderId: this.queryData.orderId
                  }
                })
              }
            })
          })
        } catch (e) {
          window.alert(e)
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      let orderItem = JSON.parse(to.query.orderItem)
      // 判断是否是更新
      if (orderItem.update) {
        Vue.prototype.$.get({
          methodName: 'QueryRefunds',
          orderId: orderItem.orderId,
          orderItemId: orderItem.id
        }).then(resp => {
          next(vm => {
            // 判断是否有已存在的退货退款信息
            if (resp.data.id) {
              vm.isUpdate = true
              vm.queryData.amount = resp.data.amount
              vm.queryData.explain = resp.data.explain
              vm.queryData.type = Number(resp.data.type)
              let _cacheReason = Number(resp.data.reason)
              if (_cacheReason || _cacheReason === 0) {
                if (resp.data.type == 0) {
                  vm.queryData.reason = _reasonForNoGoods[_cacheReason]
                } else {
                  vm.queryData.reason = _reasonForGoods[_cacheReason]
                }
              } else {
                vm.queryData.reason = resp.data.reason
              }
              vm.queryData.methodName = 'UpdateRefunds'
              vm.queryData.refundsId = resp.data.id
              vm.queryData.orderItem.price = to.query.amount
              vm.queryData.orderId = orderItem.orderId
              if (Array.isArray(resp.data.images)) {
                resp.data.images.forEach(val => {
                  if (!val) {
                    return
                  }
                  vm.imgList.push({
                    data: vm.addPath(val),
                    type: 'jpg',
                    baseUrl: val
                  })
                })
              }
            }
          })
        })
      } else {
        // 对数据进行一些处理
        next(vm => {
          vm.queryData.orderId = orderItem.orderId
          vm.queryData.orderItem = {
            id: orderItem.id,
            quantity: orderItem.quantity,
            price: orderItem.amount,
            product: {
              id: orderItem.product.id
            }
          }
        })
      }
    }
  }
</script>

<style>
  #return {
    position: relative;
  }

  .return_container{
    background-color: #fff;
    padding-bottom: 20px;
  }

  #return .text_cantainer {
    padding: 10px 15px;
  }

  #return .is_label{
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: block;
    margin-top: 10px;
  }

  #return .innerImage{
    display: inline-block;
    height: 100px;
    width: 70px;
    overflow: hidden;
    background-size: 100px 70px;
    background-size: cover;
  }

  #return .innerImage img{
    /*position: absolute;*/
    /*clip: rect(0px 70px 100px 0px);*/
    clip-path: margin-box;
  }

  #return .close{
    color: #FBAD59;
  }

  #return .select {
    width: 100%;
    height: 34px;
    background-color: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #CCCCCC;
    line-height: 34px;
  }

  #return #upload, #return #upload input {
    background-color: #fff;
  }

  #return #upload {
    width: 92%;
    margin-left: 4%;
  }


  #return .button {
    width: 80%;
    margin-left: 10%;
    margin-top: 30px;
    border-radius: 8px;
  }

  #return .imgBox {
    height: 100px;
    margin-top: 10px;
    padding-left: 16px;
  }

  #return .imgBox fieldset {
    border: none;
    position: relative;
    display: inline-block;
    margin-right: 5px;
    width: 70px !important;
    height: 100px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #return .imgBox i {
    position: absolute;
    right: -10px;
    bottom: 85px;
    color: black;
    z-index: 2;

  }

</style>
