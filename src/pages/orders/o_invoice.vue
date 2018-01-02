<template>
  <div id="invoice">
    <is-header bgColor="#F7F7F7" textColor="#474747" mainText="添加发票资质">
      <img :src="left">
      <a slot="right" class="finish" v-tap="{methods: add}">保存</a>
    </is-header>
    <div class="divide"></div>
    <cells>
      <cell label="发票抬头" :value="queryData.invoice.invoiceTitle" v-tap="{methods: showModel, title: '请输入公司名称或个人名称', value: 'invoiceTitle', maxlength: '100'}"></cell>
      <cell label="单位名称" :value="queryData.invoice.company" v-tap="{methods: showModel, title: '请输入单位名称', value: 'company', maxlength: '100'}"></cell>
      <cell label="纳税人识别码" :value="queryData.invoice.code" v-tap="{methods: showModel, title: '请输入纳税人识别码', value: 'code', maxlength: '100'}"></cell>
      <cell label="注册地址" :value="queryData.invoice.registerAddress" v-tap="{methods: showModel, title: '请输入注册地址', value: 'registerAddress', maxlength: '120'}"></cell>
      <cell label="注册电话" :value="queryData.invoice.registerMobile" v-tap="{methods: showModel, title: '请输入注册电话', value: 'registerMobile', maxlength: '32'}"></cell>
      <cell label="开户银行" :value="queryData.invoice.bank" v-tap="{methods: showModel, title: '请输入开户银行', value: 'bank', maxlength: '32'}"></cell>
      <cell label="银行账号" :value="queryData.invoice.account" v-tap="{methods: showModel, title: '请输入银行账号', value: 'account', maxlength: '32'}"></cell>
    </cells>
    <div class="divide"></div>
    <cells>
      <cell label="联系人"   :value="queryData.invoice.contacts" v-tap="{methods: showModel, title: '请输入联系人姓名', value: 'contacts', maxlength: '20'}"></cell>
      <cell label="联系电话" :value="queryData.invoice.mobile"   v-tap="{methods: showModel, title: '请输入联系人电话', value: 'mobile', maxlength: '32'}"></cell>
      <cell label="所在地区" :value="queryData.invoice.areaName" v-tap="{methods: getNativeLocation}"></cell>
      <cell label="详细地址" :value="queryData.invoice.address"  v-tap="{methods: showModel, title: '请输入详细地址', value: 'address', maxlength: '120'}"></cell>
    </cells>
  </div>
</template>
<script>
  import isHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import isInput from 'components/is-input'

  import cells from 'components/cells'
  import cell from 'components/cell'
  import Model from 'components/model/model.js'
  //

  import {address} from 'tools/area.js'



  export default {
    name: 'invoice',
    data () {
      return {
        left,
        bottomSheet: false,
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
        addressCity: '北京',
        queryData: {
          invoice: {
            invoiceTitle: '',
            company: '',
            code: '',
            registerAddress: '',
            registerMobile: '',
            bank: '',
            account: ''
          }
        },
        isUpdate: false,
        isDisable: false
      }
    },
    methods: {
      getNativeLocation () {
        this.$.push('route_location', null, (resp) => {
          try {
            this.queryData.invoice.areaName = resp === '---' ? '' : resp
          } catch (error) {
            window.alert(error)
          }
        })
      },
      showModel (params) {
        Model({
          type: 'model',
          title: params.title,
          maxlength: params.params,
          value: this.queryData.invoice[params.value]
        }).then(resp => {
          this.queryData.invoice[params.value] = resp
        })
      },
      close () {
        this.bottomSheet = !this.bottomSheet
      },
      add () {
        let _self = this
        function _ajax () {
          if (_self.isUpdate === 'true') {
            _self.queryData.methodName = 'UpdateInvoice'
          } else {
            _self.queryData.methodName = 'AddInvoice'
          }
          let _waitJudge = _self.queryData.invoice
          for (let name in _waitJudge) {
            let _result = _self.$.isEmojiCharacter(_waitJudge[name])
            if (_result) {
              this.$.toast('不能含有表情，请重新输入')
              return
            }
          }

          this.$.get(_self.queryData).then(resp => {
            if (resp.data.resultCode === '100') {
              _self.$router.go(-1)
              return
            }
          })
        }
        if (!this.isDisable) {
          this.isDisable = true
          setTimeout(() => {
            this.isDisable = false
          }, 500)
          let ifComplete = this.judgeInfoComplete()
          if (ifComplete === true) {
            _ajax()
          } else {
            this.$.toast(ifComplete)
          }
        }
      },

      // 判断信息填写是否完整
      judgeInfoComplete () {
        if (!this.queryData.invoice.invoiceTitle) {
          return '请填写发票抬头'
        }
        if (!this.queryData.invoice.contacts) {
          return '请填写联系人姓名'
        }
        if (!this.queryData.invoice.mobile) {
          return '请填写联系人电话'
        }
        if (!this.queryData.invoice.areaName) {
          return '请填写联系人地区'
        }
        if (!this.queryData.invoice.address) {
          return '请填写联系人地址'
        }
        return true
      }
    },
    beforeRouteEnter (to, from, next) {
      let invoice = to.query.invoice && JSON.parse(to.query.invoice)
      next(vm => {
        vm.queryData.invoice = invoice || {
          areaName: '',
          invoiceTitle: '',
          company: '',
          code: '',
          registerAddress: '',
          registerMobile: '',
          bank: '',
          account: '',
          contacts: '',
          mobile: '',
          address: ''
        }
        vm.isUpdate = invoice ? 'true' : 'false'
      })
    },
    components: {
      isHeader,
      isInput,
      cells,
      cell
    }
  }
</script>
<style>
  #invoice .finish{
    font-size: 1.2rem;
    color: #F98700;
    right: 10px;
    position: relative;
  }

  #invoice input {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
  }
</style>
