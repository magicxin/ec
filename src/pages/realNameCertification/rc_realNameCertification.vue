<template>
  <div id="realName" class="background-gray">
    <magic-header titleName="实名认证"></magic-header>
    <!-- <icar-header main-text="实名认证" bgColor="#F7F7F7" textColor="#242424">
      <img :src="left" slot> 
    </icar-header> -->
    <form action="">
      <model :isShow="isShow" :title="'请输入' + title" v-on:closeIsModel="fillIn" ref="model">
        <form action="" onsubmit="return false">
          <icar-input :maxLength="20" v-if="title === '用户昵称'"v-model="queryData.idCard.nickName"></icar-input>
          <icar-input :maxLength="20" v-if="title === '真实姓名'" v-model="queryData.idCard.name"></icar-input>
          <icar-input :maxLength="20" v-if="title === '用户名'"   v-model="queryData.idCard.userName"></icar-input>
          <icar-input :maxLength="32" v-if="title === '证件号码'" v-model="queryData.idCard.number"></icar-input>
          <slideChose :value="typeList" @chose="chose" v-if="title === '证件类型'"></slideChose>
        </form>
      </model>
      <scroll marginBottom="0" :bottom="true">
      <cells>
        <!--<cell :value="queryData.idCard.userName" v-tap="{methods: fillIn, type: 'userName'}">
          <h4 slot='label'>用户名</h4>
        </cell>
        
        <cell :value="queryData.idCard.nickName" v-tap="{methods: fillIn, type: 'nickName'}">
          <h4 slot='label'>用户昵称</h4>
        </cell>-->
        <cell :value="queryData.idCard.name" v-tap="{methods: fillIn, type: 'name'}">
          <h4 slot='label'>真实姓名</h4>
        </cell>
        <cell :value="type" v-tap="{methods: fillIn, type: 'type'}">
          <h4 slot='label'>证件类型</h4>
        </cell>
        <cell :value="queryData.idCard.number" v-tap="{methods: fillIn, type: 'number'}">
          <h4 slot='label'>证件号码</h4>
        </cell>
      </cells>
      <!--<img :src="imgFront" width="100%" height="100%">-->
      <div layout="row" class="file">
        <div flex class="identification_label">
          上传证件照
        </div>
        <div flex class="identification_file">
          <div v-tap="{methods: upload, type: 'back'}">
            <img :src="imgBack"  v-if="imgBack" width="100%" height="100%">
            <a v-else>
              ＋ <span>反面照</span>
            </a>
          </div>
          <div v-tap="{methods: upload, type: 'front'}">
            <img :src="imgFront" v-if="imgFront" width="100%" height="100%">
            <a v-else>
              ＋ <span>正面照</span>
            </a>
          </div>
        </div>
      </div>
      <mu-divider shallowInset/>
      <mu-flat-button label="确定" class="demo-flat-button" backgroundColor="#a4c639"
        v-tap="{methods: submit}" color="#FFF"/>
      </scroll>
    </form>
  </div>
</template>

<script>
  /* eslint-disable */
import magicHeader from 'components/magicHeader'
  import model from 'components/model'
  import cells from 'components/cells'
  import cell from 'components/cell'

  import left from 'assets/left-gray.svg'
  import icarInput from 'components/icarInput.vue'
  import slideChose from 'components/slide-chose.vue'

  import Model from 'components/model/model.js'

  import scroll from 'components/scroll'

  let cache
  function getClientInfo () {
    let isAndroidOrIos
    let u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
      isAndroidOrIos = '0'
    }
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      isAndroidOrIos = '1'
    }
    return isAndroidOrIos
  }
  export default {
    name: 'realName',
    components: {
      magicHeader,
      cells,
      cell,
      model,
      icarInput,
      slideChose,
      scroll
    },
    data () {
      return {
        file: {},
        hide: true,
        left,
        modelPromise: null,
        isShow: false,
        title: '',
        typeList: ['有效期内的身份证', '驾驶证', '护照', '军官证', '16岁以下户口簿'],
        queryData: {
          methodName: 'CreateCertification',
          idCard: {
            type: '99'
          }
        },
        imgFront: '',
        imgBack: ''
      }
    },
    computed: {
      type () {
        switch (this.queryData.idCard.type) {
          case 0:
            return '身份证'
          case 1:
            return '驾驶证'
          case 2:
            return '护照'
          case 3:
            return '军官证'
          case 4:
            return '户口簿'
        }
      }
    },
    mounted () {
      document.addEventListener('keyup', (event) => {
        if (event.keyCode == '13'){
          this.fillIn('true')
        }
      })
    },
    methods: {
      // 选中事件
      chose (params) {
        let index = this.typeList.indexOf(params.name)
        this.queryData.idCard.type = index
        this.fillIn('true')
      },
      test (val) {
        let reg = /\W/
        if (!reg.test(val)) {
          this.queryData.idCard.number = val
        }
      },
      selectGetFocus () {
        let el = document.querySelector('#select')
        el.focus()
      },
      submit () {
        let vm = this
        if (!this.queryData.idCard.name) {
          this.$.toast('请输入姓名')
          return
        }
        if ((!this.queryData.idCard.type && this.queryData.idCard.type !== 0) || this.queryData.idCard.type === '99') {
          this.$.toast('选择证件类型')
          return
        }
        if (!this.queryData.idCard.number) {
          this.$.toast('请输入证件号码')
          return
        }
        if (!this.queryData.idCard.positiveImg) {
          this.$.toast('请上传身份证正面')
          return
        }
        if (!this.queryData.idCard.backgroundImg) {
          this.$.toast('请上传身份证反面')
          return
        }
        // duiemoij 表情进行判断
        let __waitJudge = this.queryData
        for (let name in __waitJudge) {
          let _result = this.$.isEmojiCharacter(__waitJudge[name])
          if (_result) {
            this.$.toast('不能含有表情，请重新输入')
            return
          }
        }
        this.$.get(this.queryData).then(resp => {
          if (resp.data.resultCode === '100') {
            this.$.toast('已提交审核')
            this.$router.push({
              name: 'orderManage'
            })
          } else {
            this.$.toast('实名认证失败')
          }
        })
      },
      fillIn (params) {
        if (!params) {
          switch (this.title) {
            case '用户名':
            this.queryData.idCard.userName = cache
            break
            case '用户昵称':
            this.queryData.idCard.nickName = cache
            break
            case '真实姓名':
            this.queryData.idCard.name = cache
            break
            case '证件号码':
            this.queryData.idCard.number = cache
            break
            case '证件类型':
            this.queryData.idCard.type = cache
            break
          }
          let els = document.querySelectorAll('input')
          els.length > 0 && this.$.handToblur(els)
          this.isShow = false
          return
        }
        if (params.type === 'userName') {
          this.title = '用户名'
          this.isShow = true
          cache = this.queryData.idCard.userName
          return
        }
        if (params.type === 'type') {
          this.title = '证件类型'
          this.isShow = true
          cache = this.queryData.idCard.type
          return
        }
        if (params.type === 'nickName') {
          this.title = '用户昵称'
          this.isShow = true
          cache = this.queryData.idCard.nickName
          return
        }
        if (params.type === 'name') {
          this.title = '真实姓名'
          this.isShow = true
          cache = this.queryData.idCard.name
          return
        }
        if (params.type === 'number') {
          if (!this.type) {
            this.$.toast('请先选择证件类型')
            return
          }
          this.title = '证件号码'
          cache = this.queryData.idCard.number
          this.isShow = true
          return
        }
        if (params === 'true') {
          let els = document.querySelectorAll('input')
          els.length > 0 && this.$.handToblur(els)
          if (this.title === '用户名') {
            if (this.queryData.idCard.userName && this.queryData.idCard.userName.length > 20) {
              return
            }
          }
          if (this.title === '用户昵称') {
            if (this.queryData.idCard.nickName && this.queryData.idCard.nickName.length > 20) {
              return
            }
          }
          if (this.title === '真实姓名') {
            if (this.queryData.idCard.name && this.queryData.idCard.name.length > 20) {
              return
            }
          }
          if (this.title === '证件号码') {
            if (this.queryData.idCard.number && this.queryData.idCard.number.length > 32) {
              return
            }
          }
          this.isShow = false
        }
      },
      upload (params) {
        let req = {
          // type: getClientInfo(),
          // methodName: 'FileUpload'
        }
        let _self = this
        this.$.push('router_takePhoto', {
          maxNum: '1'
        }, (resp) => {
          // resp 是一个数组
          try {
            resp = JSON.parse(resp)
            if (params.type === 'front') {
              _self.imgFront = resp[0].data
            } else {
              _self.imgBack = resp[0].data
            }
            req.data = resp[0].data
            req.type =  '.' + resp[0].type
            if (req.data && req.type) {
              _self.$.postFileByFormData(req).then(resp => {
                if (params.type === 'front') {
                  _self.queryData.idCard.positiveImg = resp.urls[0]
                } else {
                  _self.queryData.idCard.backgroundImg = resp.urls[0]
                }
              }, (err) => {
                window.alert(err)
              })
            }
          } catch (e) {
            window.alert(e)
          }

        })
      }
    }
  }
</script>

<style>

  #realName button {
    margin-top: 40px;
    width: 90%;
    margin-left: 5%;
  }

  #realName .text-right{
    bottom: -22px;
  }

  #realName h4{
    font-weight: 500;
  }

  #realName .mu-radio{
    top: 6px;
  }

  #realName .file{
    background-color: #fff;
  }

  #realName .panorama_fish_eye{
    color: #937F7B;
  }

  #realName .check_circle{
    color: #F98700;
  }


  #realName .identification_label{
    min-height: 60px;
    line-height: 60px;
    padding-left: 13px;
    font-size: 1.1rem;
  }

  #realName select{
    outline: none;
    opacity: 0;
    border: none;
  }

  #realName .identification_file div{
    display: inline-block;
    width: 70px;
    height: 50px;
    border: 1px solid #9EBEE5;
    text-align: center;
    line-height: 20px;
    font-size: 20px;
    background-color: #F5F5F5;
    color: #FBAD59;
    margin-top: 4px;
    float: right;
    margin-right: 5px;
  }

  #realName .identification_file a {
    color: #666666;
  }

  #realName .identification_file span{
    font-size: 12px;
    top: 15px;
    display: block;
  }
</style>
