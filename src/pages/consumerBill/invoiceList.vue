<template>
  <div class="background-gray" id="e_transport">
    <model :isShow="isShow" v-on:closeIsModel="openModel">
      您确定要删除该收获地址吗?
    </model>
    <icar-header bgColor="#F7F7F7" mainText="收货地址" textColor="#474747">
      <img :src="left" >
    </icar-header>

    <mu-flat-button label="＋添加地址" class="flat-button" backgroundColor="#F98700" v-tap="{methods: edit}" color="#FFF"/>

    <div class="one_way" layout="column" v-for="item in addressList">
      <div flex layout="row">
        <h4 flex>{{item.consignee}} <span>{{item.phone}}</span></h4>
        <span flex="nogrow" class="static" v-if="item.isDefault === 'true'">默认</span>
      </div>
      <p flex>{{item.areaName}}{{item.address}}</p>
      <mu-divider shallowInset/>
      <div flex layout="row" layout-align="space-between center">
        <mu-radio  slot="value" flex name="payway" label="设为默认" v-model="isDefault" :nativeValue="item" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"/>
        <div flex class="text-right">
          <mu-icon value="launch" v-tap="{methods: edit, value: item}"></mu-icon>
          <mu-icon value="delete" v-tap="{methods: deleteReceiver, id: item.id}"></mu-icon>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'

  import model from 'components/model'


  export default {
    name: 'transport',
    data () {
      return {
        left,
        addressList: [],
        isShow: false,
        isDefault: {}
      }
    },
    methods: {
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
          this.addressList = resp.data.receivers
        })
      },
      openModel (val) {
        console.log(val)
      }
    },
    watch: {
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
              if (val.isDefault === 'true') {
                this.isDefault = val
              }
            })
          })
        }
      }
    },
    components: {
      icarHeader,
      model
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'listInvoice'
      }).then(resp => {
        console.log(resp)
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

  #e_transport .static {
   color: #F98700;
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
