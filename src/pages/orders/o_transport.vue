<template>
  <div class="background-gray" id="e_transport">
    <model :isShow="isShow" v-on:closeIsModel="openModel" title="">
      您确定要删除该收货地址吗?
    </model>
    <icar-header bgColor="#F7F7F7" mainText="收货地址" textColor="#474747">
      <img :src="left" v-tap="{methods: goBack}">
    </icar-header>

    <mu-flat-button label="＋添加地址" class="flat-button" backgroundColor="#F98700" v-tap="{methods: edit}" color="#FFF"/>

    <empty v-if="addressList.length === 0" message="暂时没有收货地址信息, 快去添加吧~">

    </empty>
    <div v-else class="scroll">
      <div class="one_way" layout="column" v-for="item in addressList">
        <a v-tap="{methods: chose, item: item}">
          <div flex layout="row">
            <h4 flex>{{item.consignee}} <span>{{item.phone}}</span></h4>
            <span flex="nogrow" class="static" v-if="item.isDefault === '1'">默认</span>
          </div>
          <p flex>{{item.areaName}}{{item.address}}</p>
        </a>
        <mu-divider shallowInset/>
        <div flex layout="row" layout-align="space-between center">
          <mu-radio  slot="value" flex name="payway" label="设为默认" v-model="isDefault" :nativeValue="item" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
          <div flex class="text-right">
            <img :src="edit1" v-tap="{methods: edit, value: item}" height="22" class="edit">
            <img :src="rubbish" v-tap="{methods: openModel, id: item.id}" height="16">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'

  import Order from 'tools/order.service.js'
  import empty from 'components/empty-page.vue'
  import model from 'components/model'
  import rubbish from 'assets/rubbish.svg'
  import edit1 from 'assets/edit1.svg'
  let transportForUse

  let order = Order.getInstance()
  let cache
  export default {
    name: 'transport',
    data () {
      return {
        fromRoute: '',
        left,
        addressList: [],
        isShow: false,
        isDefault: {},
        rubbish,
        edit1,
        isUpdate: true
      }
    },
    methods: {
      chose (params) {
        if (this.isUpdate) {
          order.useTransport(params.item)
          this.$router.go(-1)
        } else {
          this.edit(params)
        }
      },
      goBack () {
        if (cache) {
          this.$.push('router_back', null, () => {
            console.log('调用成功')
          })
          return
        }
        if (this.fromRoute) {
          this.$router.go(-1)
        }
      },
      edit (params) {
        this.$router.push({
          name: 'o_transportEdit',
          query: params.value ? {
            address: JSON.stringify(params.value)
          } : ''
        })
      },
      deleteReceiver (params) {
        this.$.get({
          methodName: 'DeleteReceiver',
          ids: [params.id]
        }).then(resp => {
          order.clearTransport()
          this.isShow = false
          this.addressList = []
          setTimeout(() => {
            this.addressList = resp.data.receivers
          }, 0)
        })
      },
      openModel (params) {
        if (params && params.id) {
          transportForUse = params.id
          this.isShow = true
        }
        if (params === 'true') {
          this.deleteReceiver({
            id: transportForUse
          })
        }
        if (!params) {
          this.isShow = false
        }
      }
    },
    watch: {
      addressList (newVal) {
        if (newVal.length === 1) {
          let transpostCache = newVal[0]
          if (transpostCache.isDefault === '0') {
            let req = {
              receiver: {}
            }
            Object.assign(req.receiver, newVal[0])
            req.receiver.isDefault = '1'
            req.methodName = 'UpdateReceiver'
            this.$.get(req).then(resp => {
              this.addressList = resp.data.receivers
              this.isDefault = this.addressList[0]
            })
          }
        }
      },
      isDefault (newVal) {
        if (newVal.isDefault === '0') {
          let req = {
            receiver: {}
          }
          Object.assign(req.receiver, newVal)
          req.receiver.isDefault = '1'
          req.methodName = 'UpdateReceiver'
          this.$.get(req).then(resp => {
            this.addressList = resp.data.receivers
            this.addressList.forEach(val => {
              if (val.isDefault === '1') {
                this.isDefault = val
              }
            })
          })
        }
      }
    },
    components: {
      icarHeader,
      model,
      empty
    },
    beforeRouteEnter (to, from, next) {
      let isUpdate = true
      function getTransportByAjax () {
        isUpdate = false
        return Vue.prototype.$.get({
          methodName: 'ListReceiver'
        }).then(resp => {
          return resp.data.receivers
        })
      }
      function getTransportByQuery () {
        return to.query.address ? Promise.resolve(JSON.parse(to.query.address)) : ''
      }
      let _promise = getTransportByQuery() || getTransportByAjax()
      _promise.then(resp => {
        next(vm => {
          vm.fromRoute = from.name
          if (!from.name && !cache) {
            cache = true
          }
          vm.isUpdate = isUpdate
          vm.addressList = resp || []
          resp && resp.forEach(val => {
            if (val.isDefault === '1') {
              vm.isDefault = val
            }
          })
        })
      })
    }
  }
</script>

<style>
  #e_transport .flat-button{
    width: 94%;
    margin-left: 3%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  #e_transport .one_way{
    background-color: #fff;
    padding: 10px 14px;
    margin-top: 10px;
  }
  #e_transport .scroll {
    overflow: hidden;
  }
  #e_transport .static {
   color: #F98700;
  }

  #e_transport .edit{
    vertical-align: sub;
  }

  #e_transport h4 {
    color: #808080;
    font-size: 1.2rem;
    font-weight: normal;
    margin-bottom: 10px;
  }

  #e_transport h4 span{
    margin-left: 20px;
  }

  #e_transport p {
    line-height: 20px;
    color: #8D8D8D;
    margin-bottom: 10px;
  }

  #e_transport .mu-radio-icon-uncheck{
    color: #9B9B9B;
  }

  #e_transport .mu-radio-icon-checked{
    color: #F98700;
  }

  #e_transport .panorama_fish_eye{
    color: #9B9B9B;
  }

  #e_transport i {
    font-size: 1.8rem !important;
  }

  #e_transport label {
    margin-top: 4px;
    vertical-align: middle
  }

  #e_transport .mu-radio-icon {
    margin-right: 5px;
  }

  #e_transport .mu-radio-label{
    color: #8D8D8D;
    font-size: 1.2rem;
  }

  #e_transport .launch, #e_transport .delete{
    color: #AEAEAE;
    margin-top: 6px;
    font-weight: lighter;
  }

  #e_transport .check_circle {
    color: #F98700;
  }
</style>
