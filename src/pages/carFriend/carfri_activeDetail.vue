<style>
  #carfri_activeDetail {
    height: 95%;
  }
  #carfri_activeDetail .content, #carfri_activeDetail .join {
    background-color: #fff;
    margin-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 15px;
    color: #A0A0A0;
  }
  #carfri_activeDetail .content h2 {
    padding-top: 13px;
    padding-bottom: 13px;
    border-bottom: 1px solid #F7F7F9;
    color: #1A1A1A;
  }
  #carfri_activeDetail .content div {
    border-bottom: 1px solid #F7F7F9;
    padding-top: 10px;
    padding-bottom: 10px;
    /*font-size: 15px;*/
  }
  #carfri_activeDetail .content .mu-icon {
    margin-left: -6px;
    /*margin-top: 8px;*/
  }
  #carfri_activeDetail .content .iconfont {
    color: #F98700;
  }
  #carfri_activeDetail .content .iconfont>span {
    color: #A0A0A0;
    font-size: 15px;
    position: relative;
    top: -2px;
    left: 7px;
  }
  #carfri_activeDetail .content .iconfont.icon-time01 {
    font-size: 19px;
    margin-left: -2px;
  }
  #carfri_activeDetail .content .iconfont.icon-flag {
    margin-left: -1px;
  }
  #carfri_activeDetail .content span {
    position: relative;
    top: -7px;
  }
  #carfri_activeDetail .join div {
    padding-top: 13px;
    padding-bottom: 13px;
    border-bottom: 1px solid #F7F7F9;
  }
  #carfri_activeDetail .join div>span {
    font-size: 18px;
    color: #F98700;
  }
  #carfri_activeDetail .more {
    text-align: center;
    color: #A0A0A0;
    font-size: 16px;
    margin-top: 13px;
  }
  #carfri_activeDetail .mu-raised-button {
    position: fixed;
    bottom: 50px;
  }
  #carfri_activeDetail .mu-raised-button.joinAn {
    bottom: 0px;
  }
</style>
<template>
  <div id="carfri_activeDetail">
    <div>
      <my-header main-text="活动详情" bg-color="#F7F7F7" text-color="#000">
        <img :src="left" alt="" v-tap="{methods: goBack}">
      </my-header>
      <img :src="activeDetail.cover ? addPath(activeDetail.cover) : defaultImg" height="180px" width="100%">
      <div class="content">
        <h2>{{ activeDetail.title }}</h2>
        <div>
          <i class="iconfont icon-time01">
            <span>{{activeDetail.beginDate | sliceDatebegOne}}日{{activeDetail.beginDate | sliceDatebegTwo}} ~ {{ activeDetail.endDate | sliceDateendOne }}日{{ activeDetail.endDate | sliceDateendTwo }}
            </span>
          </i>

        </div>
        <div>
          <mu-icon value="room" color="#F98700" />
          <span>{{ activeDetail.address }}</span>
        </div>
        <div>
          <i class="iconfont icon-flag"><span>主办方：{{shopName}}</span></i>
        </div>
      </div>
      <div class="join">
        <div>
          已报名<span>&nbsp;{{ activeDetail.attendNumber }}&nbsp;</span>人/限额{{ activeDetail.limitNumber }}人
        </div>
          <!-- <img :src="data.userImg" v-for="item in activeDetail.fleetActivityOptionDatas"/> -->

      </div>
      <!-- <div class="more">
        向上拖动查看活动详情
      </div> -->
      <mu-raised-button v-bind:class="{joinAn: isAndroid}" v-if="isCanjia" label="已参加"
        disabled fullWidth/>
      <mu-raised-button v-bind:class="{joinAn: isAndroid}" label="已报名" v-else
        disabled fullWidth/>
    </div>

  </div>
</template>

<script>
	import Vue from 'vue'
  import myHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import cells from 'components/cells'
  import fullButton from 'components/full-button'

  import defaultImg from 'assets/default_user_icon.png'


  export default {
    data () {
      return {
        left,
        defaultImg,
        activeDetail: {},
        isCanjia: this.$route.params.status,
        shopName: this.$route.params.shopName
      }
    },

    filters: {
      sliceDatebegOne: function (value) {
        if (!value) return ''
        return value.slice(0, 10)
      },
      sliceDatebegTwo: function (value) {
        if (!value) return ''
        return value.slice(11, 16)
      },
      sliceDateendOne: function (value) {
        if (!value) return ''
        return value.slice(0, 10)
      },
      sliceDateendTwo: function (value) {
        if (!value) return ''
        return value.slice(11, 16)
      }
    },
    methods: {
      goBack () {
        this.$router.push({
          name: 'city_active'
        })
      },
      getDetail () {
        this.$.get({
          methodName: 'QueryFleetActivity',
          activityId: this.$route.params.activeId
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.activeDetail = resp.data
          }
        })
      }
    },
    beforeCreate () {
      let u = navigator.userAgent
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryFleetActivity',
        activityId: to.params.activeId
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          next(vm => {
            vm.activeDetail = resp.data.fleetActivityData
          })
        }
      })
    },
    components: {
      myHeader,
      cells,
      fullButton
    }
  }
</script>
