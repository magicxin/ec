<template>
  <!--推荐有礼-->
  <div id="eve_invitation">
    <!-- <my-header main-text="我的邀请" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
    </my-header> -->
    <magic-header titleName="我的邀请"></magic-header>
    <!--<section class="selectTime mid_f" @click="open">
      <label for="">时间：{{ newDate }}</label><img src="../../assets/triangle.svg" alt="" class="icon_img">
      <mu-date-picker hintText="竖屏模式选择" class="hiddenTime" disableDaySelection=true @change="changeTime" format="YYYY-MM"/>
    </section>-->
    <div class="rule">
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" title="奖励" />
        <mu-tab value="tab2" title="明细" />
      </mu-tabs>
      <div v-if="activeTab == 'tab1'" class="tab1">
        <ul v-if="inviteInfo.length > 0">
          <li class="sm_f clear" v-for="item in inviteInfo">
            <label class="eve_left">推荐用户注册</label><label class="eve_right">{{ item.prize }}</label>
          </li>
        </ul>
        <emptyPage message="暂无记录" class="emptyPage" v-if="inviteInfo.length == 0">

        </emptyPage>
      </div>
      <div v-if="activeTab == 'tab2'" class="tab2">
        <ul v-if="inviteInfo.length > 0">
          <li class="sm_f clear" v-for="item in inviteInfo">
            <label class="eve_left">{{ item.userName }}</label><label class="eve_right text_dark">通过手机{{ item.inviteWay }}好友邀请</label><br>
            <br><span class="mini_f">已完成：注册</span> <small class="mini_f time">{{ item.happenDate }}</small>
          </li>
        </ul>
        <emptyPage message="暂无记录" class="emptyPage" v-if="inviteInfo.length == 0">

        </emptyPage>
      </div>
    </div>
  </div>
</template>
<script>
	import Vue from 'vue'
  import magicHeader from 'components/magicHeader'
  import defaultImg from 'assets/default_user_icon.png'
  import emptyPage from 'components/empty-page'
  import { DatetimePicker } from 'mint-ui'



        /* eslint-disable */
  function zhDigitToArabic(digit) {
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['千', '百', '十'];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
    let result = 0, quotFlag;

    for (let i = digit.length - 1; i >= 0; i--) {
      if (zh.indexOf(digit[i]) > -1) { // 数字
        if (quotFlag) {
          result += quotFlag * getNumber(digit[i]);
        } else {
          result += getNumber(digit[i]);
        }
      } else if (unit.indexOf(digit[i]) > -1) { // 十分位
        if (quotFlag) {
          result += quotFlag * getUnit(digit[i]) * getNumber(digit[i - 1]);
        } else {
          result += getUnit(digit[i]) * getNumber(digit[i - 1]);
        }
        --i;
      } else if (quot.indexOf(digit[i]) > -1) { // 万分位
        if (unit.indexOf(digit[i - 1]) > -1) {
          if (getNumber(digit[i - 1])) {
            result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          } else {
            result += getQuot(digit[i]) * getUnit(digit[i - 1]) * getNumber(digit[i - 2]);
            quotFlag = getQuot(digit[i]);
            --i;
          }
        } else {
          result += getQuot(digit[i]) * getNumber(digit[i - 1]);
          quotFlag = getQuot(digit[i]);
        }
        --i;
      }
    }

    return result;

    // 返回中文大写数字对应的阿拉伯数字
    function getNumber(num) {
      for (let i = 0; i < zh.length; i++) {
        if (zh[i] == num) {
          return i;
        }
      }
    }

    // 取单位
    function getUnit(num) {
      for (let i = unit.length; i > 0; i--) {
        if (num == unit[i - 1]) {
          return Math.pow(10, 4 - i);
        }
      }
    }

    // 取分段
    function getQuot(q) {
      for (var i = 0; i < quot.length; i++) {
        if (q == quot[i]) {
          return Math.pow(10, (i + 1) * 4);
        }
      }
    }
  }
  export default {
    data () {
      return {
        defaultImg,
        rule: '',
        isTrue: true,
        activeTab: 'tab1',
        newDate: '',
        searchDate: '',
        inviteInfo: [],
        activityId: this.$route.params.activityId
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      },
      open () {

      },
      changeTime (val) {
        this.$.get({
          methodName: 'QueryInviteInfo',
          activityId: this.activityId,
          searchDate: this.searchDate
        }).then(res => {
          this.inviteInfo = res.data
          if (this.inviteInfo.length > 0) {
            this.inviteInfo.forEach((element, index) => {
              if (element.inviteWay === '0') {
                this.inviteInfo[index].inviteWay = '二维码'
              } else if (element.inviteWay === '1') {
                this.inviteInfo[index].inviteWay = '微信'
              } else if (element.inviteWay === '2') {
                this.inviteInfo[index].inviteWay = 'QQ'
              } else {
                this.inviteInfo[index].inviteWay = '其他方式'
              }
            }, this)
          }
        })
      }
    },
    components: {
      magicHeader,
      emptyPage,
      DatetimePicker
    },
    mounted () {
      let oDate = new Date()
      this.newDate = oDate.getFullYear() + '年' + (Number(oDate.getMonth()) + 1) + '月'
      this.searchDate = oDate.getFullYear() + '-' + (Number(oDate.getMonth()) + 1)
    },
    beforeRouteEnter (to, from, next) {
      let oDate = new Date()
      Promise.all([
        Vue.prototype.$.get({
          methodName: 'QueryInviteInfo',
          activityId: to.params.activityId
          // searchDate: oDate.getFullYear() + '-0' + (Number(oDate.getMonth()) + 1)
        })
      ])
      .then(result => next(vm => {
        console.log(result[0].data)
        vm.inviteInfo = result[0].data.inviteInfo
        vm.inviteInfo.forEach((element, index) => {
          if (element.inviteWay === '0') {
            vm.inviteInfo[index].inviteWay = '二维码'
          } else if (element.inviteWay === '1') {
            vm.inviteInfo[index].inviteWay = '微信'
          } else if (element.inviteWay === '2') {
            vm.inviteInfo[index].inviteWay = 'QQ'
          } else {
            vm.inviteInfo[index].inviteWay = '其他方式'
          }
        }, vm)
      }))
    }
  }
</script>
<style>
  #eve_invitation {
    background-color: #fff;
    min-height: 677px;
  }
  #eve_invitation .mu-tabs {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
  }
  #eve_invitation .mu-tabs button:nth-child(1) {
    border-right: 1px solid #ccc;
  }
  #eve_invitation .mu-tabs .mu-tab-active {
    color: #f98700;
  }
  #eve_invitation .tab1, #eve_invitation .tab2 {
    width: 88%;
    margin: auto;
    color: #757575;
  }
  #eve_invitation li {
    padding: 10px 0px;
    border-bottom: 1px dashed #ccc;
  }
  #eve_invitation .eve_left {
    float: left
  }
  #eve_invitation .eve_right {
    float: right
  }
  #eve_invitation .tab2 .eve_left {
    color: #000;
  }
  #eve_invitation .tab2 .eve_right {
    color: #929292;
  }
  #eve_invitation .clear:after {
    content: '';
    display: table;
    clear: both;
  }
  #eve_invitation .time {
    color: #ccc;
    margin-left: 13px;
  }
  #eve_invitation .result_empty {
    margin-top: 0px;
  }
  #eve_invitation .selectTime {
    text-align: center;
    padding: 15px;
    background-color: rgba(249, 135, 0, 0.45);
  }
  #eve_invitation .icon_img {
    width: 12px;
    margin-left: 7px;
  }
  .hiddenTime {
    opacity: 0;
    position: fixed;
    top: 50px;
    left: 50px;
  }
  /*.mu-date-picker-dialog .mu-calendar-week {
    display: none;
  }
  .mu-date-picker-dialog .mu-calendar-monthday {
    display: none;
  }*/
  .mu-date-picker-dialog .mu-day-button-bg {
    background-color: #f98700;
  }
  .mu-date-picker-dialog .mu-dialog-body {
    min-height: inherit;
  }
  /*.mu-date-picker-dialog .mu-date-display-monthday-title{
    display: none
  }*/
  .mu-date-picker-dialog .mu-date-display {
    background-color: #f98700
  }
  .mu-date-picker-dialog .mu-flat-button-primary {
    color: #f98700;
  }
  .mu-date-picker-dialog .mu-calendar-actions {
        justify-content: space-around;
  }
  .mu-date-picker-dialog .mu-year-button.selected .mu-year-button-text {
    color: #f98700
  }
</style>
