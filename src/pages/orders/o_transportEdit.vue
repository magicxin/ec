<template>
  <div class="background-gray" id="e_transportEdit">

    <model v-on:closeIsModel="openModel" :isShow="popup" :title="query.title">
      <icar-input v-if="query.title === '请输入姓名'" v-model="queryData.receiver.consignee" :maxLength='20'></icar-input>
      <icar-input v-if="query.title === '请输入手机号码'" v-model="queryData.receiver.phone" :maxLength='20'  type="tel"></icar-input>
      <icar-input v-if="query.title === '请输入详细地址'" v-model="queryData.receiver.address" :maxLength='120'></icar-input>
      <icar-input v-if="query.title === '请输入邮编'" v-model="queryData.receiver.zipCode" type="number" :maxLength='16'></icar-input>
    </model>

    <icar-header bgColor="#F7F7F7" mainText="编辑收货地址" textColor="#474747">
      <img :src="left">
    </icar-header>
    <cells>
      <cell v-tap="{methods: openOrclose, item: 'name'}" :value="queryData.receiver.consignee">
        <h4 slot="label">
          收货人姓名
        </h4>
      </cell>
      <cell  v-tap="{methods: openOrclose, item: 'phone'}" :value="queryData.receiver.phone">
        <h4 slot="label">
          手机号
        </h4>
      </cell>
      <cell  v-tap="{methods: openOrclose, item: 'zipCode'}" :value="queryData.receiver.zipCode">
        <h4 slot="label">
          邮编
        </h4>
      </cell>
      <cell v-tap="{methods: getNativeLocation}" :value="queryData.receiver.areaName">
        <h4 slot="label">
          省市
        </h4>
      </cell>
      <cell  v-tap="{methods: openOrclose, item: 'detail'}" :value="queryData.receiver.address">
        <h4 slot="label">
          详细地址
        </h4>
      </cell>
    </cells>

    <mu-bottom-sheet :open="bottomSheet" @close="close">
      <mu-list @itemClick="close">
        <mu-sub-header class="text-center">
          选择省市
        </mu-sub-header>
        <mu-picker :slots="addressSlots" :visible-item-count="5" @change="addressChange" :values="address"/>
      </mu-list>
    </mu-bottom-sheet>
    <mu-flat-button label="保存" v-tap = "{methods: save}" class="flat-button" backgroundColor="#F98700" color="#FFF"/>
  </div>
</template>

<script>
  import icarHeader from 'components/my-header'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import left from 'assets/left-gray.svg'
  import model from 'components/model'


  import icarInput from 'components/icarInput'
  import {address} from 'tools/area.js'

  import Order from 'tools/order.service.js'

  let order = Order.getInstance()

  let cache
  export default {
    name: 'transportEdit',
    data () {
      return {
        loading: false,
        fromRoute: '',
        isUpdate: 'false',
        isSHow: false,
        bottomSheet: false,
        queryData: {
          receiver: {
            areaName: ''
          }
        },
        query: {
          title: ''
        },
        type: 'name',
        popup: false,
        left,
        addressSlots: [
          {
            width: '100%',
            textAlign: 'right',
            values: Object.keys(address)
          }, {
            width: '100%',
            textAlign: 'left',
            values: ['北京']
          }
        ],
        address: ['北京', '北京'],
        addressProvince: '北京',
        addressCity: '北京'
      }
    },
    components: {
      icarHeader,
      cells,
      cell,
      model,
      icarInput
    },
    methods: {
      getNativeLocation () {
        this.$.push('route_location', null, (resp) => {
          try {
            let reg = /---/
            if (!reg.test(resp)) {
              this.queryData.receiver.areaName = resp
            }
          } catch (error) {
            window.alert(error)
          }
        })
      },
      save () {
        if (this.loading) {
          return
        }
        this.loading = true
        if (!this.queryData.receiver.consignee) {
          this.$.toast('请输入姓名')
          this.loading = false
          return
        }
        if (!this.queryData.receiver.phone) {
          this.$.toast('请输入手机号码')
          this.loading = false
          return
        }
        if (!this.queryData.receiver.zipCode) {
          this.$.toast('请输入邮编')
          this.loading = false
          return
        }
        if (!this.queryData.receiver.areaName) {
          this.$.toast('请选择地区')
          this.loading = false
          return
        }
        if (!this.queryData.receiver.address) {
          this.$.toast('请输入详细地址')
          this.loading = false
          return
        }
        let _waitJudge = this.queryData.receiver
        for (let name in _waitJudge) {
          let _result = this.$.isEmojiCharacter(_waitJudge[name])
          if (_result) {
            this.$.toast('不能含有表情，请重新输入')
            this.loading = false
            return
          }
        }

        if (this.isUpdate === 'true') {
          // 更新
          let req = Object.assign(this.queryData, {
            methodName: 'UpdateReceiver'
          })
          delete req.receiver.area
          this.$.get(req).then(resp => {
            if (Array.isArray(resp.data.receivers)) {
              resp.data.receivers.forEach(val => {
                if (this.queryData.receiver.id === val.id) {
                  order.useTransport(val)
                }
              })
            }
            // order.useTransport(this.queryData.receiver)
            this.$router.replace({
              name: 'o_orderConfirm',
              query: {
                cartItems: JSON.stringify(order.userCarItem())
              }
            })
          })
          this.loading = false
          return
        }
        // 新增
        this.$.get(Object.assign(this.queryData, {
          methodName: 'AddReceiver'
        })).then(resp => {
          this.loading = false
          if (resp.data.resultCode === '100') {
            this.$.toast('保存成功!')
            this.$router.go(-1)
            return
          } else if (resp.data.resultCode === '334') {
            this.$.toast('收货地址超过最大保存数!')
            return
          } else {
            this.$.toast('新增收货地址失败!')
            return
          }

//          if (resp.data.resultCode !== '100' || resp.data.resultCode !== '334') {
//            this.$.toast('新增收货地址失败!')
//            return
//          }
          order.useTransport(resp.data.receivers[0])
          this.$router.replace({
            name: 'o_orderConfirm',
            query: {
              cartItems: JSON.stringify(order.userCarItem())
            }
          })
        })
      },
      close () {
        this.bottomSheet = !this.bottomSheet
      },
      openModel (params) {
        let els = document.querySelectorAll('input')
        this.$.handToblur(els)
        if (params === 'true') {
          if (this.query.title === '请输入姓名' && this.queryData.receiver.consignee && this.queryData.receiver.consignee.length > 20) {
            return
          }
          if (this.query.title === '请输入手机号码' && this.queryData.receiver.phone && this.queryData.receiver.phone.length > 20) {
            return
          }
          if (this.query.title === '请输入详细地址' && this.queryData.receiver.address && this.queryData.receiver.address.length > 120) {
            return
          }
          if (this.query.title === '请输入邮编' && this.queryData.receiver.zipCode && this.queryData.receiver.zipCode.length > 12) {
            return
          }
        }
        if (!params) {
          switch (this.query.title) {
            case '请输入姓名':
              this.queryData.receiver.consignee = cache
              break
            case '请输入手机号码':
              this.queryData.receiver.phone = cache
              break
            case '请输入详细地址':
              this.queryData.receiver.address = cache
              break
            case '请输入邮编':
              this.queryData.receiver.zipCode = cache
              break
          }
        }
        this.popup = !this.popup
      },
      addressChange (value, index) {
        switch (index) {
          case 0:
            this.addressProvince = value
            const arr = address[value]
            this.addressSlots[1].values = arr
            this.addressCity = arr[0]
            break
          case 1:
            this.addressCity = value
            break
        }
        this.queryData.receiver.areaName = this.addressProvince + this.addressCity
      },
      openOrclose (params) {
        switch (params.item) {
          case 'name':
            this.query.title = '请输入姓名'
            cache = this.queryData.receiver.consignee
            break
          case 'phone':
            this.query.title = '请输入手机号码'
            cache = this.queryData.receiver.phone
            break
          case 'detail':
            this.query.title = '请输入详细地址'
            cache = this.queryData.receiver.address
            break
          case 'zipCode':
            this.query.title = '请输入邮编'
            cache = this.queryData.receiver.zipCode
            break
        }
        this.popup = !this.popup
      }
    },
    beforeRouteEnter (to, from, next) {
      let address = to.query.address && JSON.parse(to.query.address)
      next(vm => {
        vm.fromRoute = from.name
        vm.isUpdate = address ? 'true' : 'false'
        vm.queryData.receiver = address || {
          isDefault: '0',
          areaName: ''
        }
      })
    }
  }
</script>

<style>
  #e_transportEdit button {
    width: 94%;
    margin-left: 3%;
    margin-top: 20px;
  }

  #e_transportEdit h4 {
    font-size: 1.2rem;
    font-weight: normal
  }

  #e_transportEdit .keyboard_arrow_right {
    color: #8F9497;
  }

  .transportEdit_popup {
    margin-top: 50%;
    width: 80%;
    border-radius: 4px;
  }

  .transportEdit_popup .mu-text-field {
    width: 100% !important;
  }

  .transportEdit_popup .text-center {
    margin-top: 10px;
    color: #F99928;
  }

  .transportEdit_popup .title{
    font-weight: bold;
    color: black;
  }

  .mu-picker-item {
    font-size: 1.2rem;
    text-align: center !important;
  }
</style>
