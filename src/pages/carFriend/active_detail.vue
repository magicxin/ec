
<template>
  <div id="active_detail">
    <ma-header titleName="活动详情"></ma-header>
    <scroll :getMore="dargUpAddData">
    	
      <!--<my-header main-text="活动详情" bg-color="#F7F7F7" text-color="#000">
        <img :src="left" alt="">
      </my-header>-->
      <img class="actImg" :src="activeDetail.cover ? addPath(activeDetail.cover) : defaultImg" width="100%">
      <div class="content">
        <h2>{{ activeDetail.title }}</h2>
        <div class="iconCon">
          <div class="i_class"><i class="iconfont icon-time01"></i></div>
          <span
            class="activity_time">活动日期：{{activeDetail.beginDate | sliceDatebegOne}}/{{activeDetail.beginDate | sliceDatebegTwo}}/{{activeDetail.beginDate | sliceDatebegThree}} {{activeDetail.beginDate | sliceDatebegFour}} ~ {{ activeDetail.endDate | sliceDateendOne
            }}/{{ activeDetail.endDate | sliceDateendTwo }}/{{ activeDetail.endDate | sliceDateendThree
            }} {{ activeDetail.endDate | sliceDateendFour }}</span>
        </div>
        <div class="iconCon actDeadTime">
          <i class="iconfont icon-jiezhiriqi"></i>
          <span class="dataCon">报名截止日期：{{ activeDetail.deadline | sliceDateDeadOne
            }}/{{ activeDetail.deadline | sliceDateDeadTwo }}/{{ activeDetail.deadline | sliceDateDeadThree
            }} {{activeDetail.deadline | sliceDateDeadFour}}</span>
        </div>
        <div class="iconCon" v-if="activeDetail.amount">
          <span class="renminbi"></span>
          <span>
                报名费用：¥ {{ activeDetail.amount | thousandth }}
            </span>
        </div>
        <div class="iconCon vue-map ">
          <div>

            <router-link :to='{
                    name :"Baidumap",
                    params:{
                        address: `lngBaidu=${activeDetail.lngBaidu}&latBaidu=${activeDetail.latBaidu}`
                    }
                }'>
              <mu-icon value="room" color="#F98700"/>
            </router-link>
            <router-link :to='{
                    name :"Baidumap",
                    params:{
                        address: `lngBaidu=${activeDetail.lngBaidu}&latBaidu=${activeDetail.latBaidu}`
                    }
                }'>
              <span class="dataCon">{{ activeDetail.address }}</span>
            </router-link>
          </div>
          <router-link :to='{
                    name :"Baidumap",
                    params:{
                        address: `lngBaidu=${activeDetail.lngBaidu}&latBaidu=${activeDetail.latBaidu}`
                    }
                }'>
            <i class="iconfont icon-right"></i>
          </router-link>
          <router-view></router-view>
        </div>
        <div class="iconCon lead">
          <i class="iconfont icon-flag"></i>
          <span class="dataCon">主办方：{{activeDetail.fleet?activeDetail.fleet.name:''}}</span>
        </div>
      </div>
      <div class="join">
        <div class="attNum">
          已报名<span>&nbsp;{{ activeDetail.attendNumber }}&nbsp;</span>人/限额{{ activeDetail.limitNumber }}人
        </div>
        <div v-show="activeDetail.attendNumber != 0" v-tap="{methods: checkAttendDet, activeId: activeDetail.id}">
          <img class="memberHead" v-for="item in attendList"
               :src="item.memberHead ? addPath(item.memberHead) : defaultImg"/>
          <i class="iconfont icon-right" v-if="attendList.length > 0 "></i>
        </div>
      </div>
      <div class="dragUpInfo" v-if="!activeInfoContent">
        向上拖动查看活动详情
        <span>
              <i class="iconfont icon-right"></i>
          </span>
      </div>
      <div :id="activeInfoContentBox" :class="{drag_active_info:activeInfoContent}" v-html="activeInfoContent">

      </div>
        <!--<mu-raised-button
          v-if="isIn === 0 && activeDetail.attendNumber < activeDetail.limitNumber"
          v-tap="{methods: attend, activeId: activeDetail.id}"
          style="background-color: #F98700;"
          class="active-d-repaired-h-item"
          label="立即报名"
          fullWidth />
        <mu-raised-button
          v-if="isIn === 1"
          v-tap="{methods: cancel, activeId: activeDetail.id}"
          style="background-color: #F98700;"
          class="active-d-repaired-h-item"
          label="取消报名"
          fullWidth />
        <mu-raised-button
          v-if="(activeDetail.attendNumber === activeDetail.limitNumber) && (isIn === 0)"
          class="active-d-repaired-h-item"
          label="活动满员"
          disabled fullWidth />-->

    </scroll>
    <full-button v-if="isIn === 0 && activeDetail.attendNumber < activeDetail.limitNumber" name="立即报名" v-tap="{methods: attend, activeId: activeDetail.id}"></full-button>
    <full-button v-if="isIn === 1" name="取消报名" v-tap="{methods: cancel, activeId: activeDetail.id}"></full-button>
    <full-button v-if="(activeDetail.attendNumber === activeDetail.limitNumber) && (isIn === 0)" name="活动满员"></full-button>
    <!--<model :isShow="isCancel" v-on:closeIsModel="cancel" title=" ">
      	确定取消报名?
    </model>-->
  </div>
</template>

<script>
	import Vue from 'vue'
  import maHeader from 'components/magicHeader'
  import fullButton from 'components/button/full_button'
  import left from 'assets/left-gray.svg'
  import cells from 'components/cells'
  import defaultImg from 'assets/default_user_icon.png'
  import Baidumap from 'components/Baidumap'
  import model from 'components/model'
  import scroll from 'components/loadmore'
  let activeId

  export default {
    data() {
      return {
        left,
        defaultImg,
        activeDetail: {},
        attendList: [],
        shopName: this.$route.params.shopName,
        isIn: '',
        userInfo: '',
        addActiveInfo: true,
        changActiveData: false,
        touchStartY: "",
        touchEndY: '',
        activeInfoContent: "",
        activeInfoContentBox: "activeInfoContentBox"
      }
    },
    created() {
      let that = this;
        that.userInfo = {
                	userId:this.$.userId,
                	shop:{
                		id:this.$.shopId
                	}
               }
        
      this.$.get({
        methodName: 'QueryFleetActivity',
        activityId: this.$route.params.activeId
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          console.log(resp.data)
            // 判断用户是否报名该活动的字段
            this.isIn = resp.data.isin
            this.activeDetail = resp.data.fleetActivityData

            // 只截取6个报名该活动的人员头像显示
            this.attendList = resp.data.fleetActivityAttendDatas.splice(0, 6)
        }
      })
    },

    // 过滤时间
    filters: {
      // 活动开始日期
      sliceDatebegOne: function (value) {
        if (!value) return ''
        return value.substring(0, 4)
      },
      sliceDatebegTwo: function (value) {
        if (!value) return ''
        return value.substring(5, 7)
      },
      sliceDatebegThree: function (value) {
        if (!value) return ''
        return value.substring(8, 10)
      },
      sliceDatebegFour: function (value) {
        if (!value) return ''
        return value.substring(11, 16)
      },
      // 活动结束日期
      sliceDateendOne: function (value) {
        if (!value) return ''
        return value.substring(0, 4)
      },
      sliceDateendTwo: function (value) {
        if (!value) return ''
        return value.substring(5, 7)
      },
      sliceDateendThree: function (value) {
        if (!value) return ''
        return value.substring(8, 10)
      },
      sliceDateendFour: function (value) {
        if (!value) return ''
        return value.substring(11, 16)
      },
      // 报名截止日期
      sliceDateDeadOne: function (value) {
        if (!value) return ''
        return value.substring(0, 4)
      },
      sliceDateDeadTwo: function (value) {
        if (!value) return ''
        return value.substring(5, 7)
      },
      sliceDateDeadThree: function (value) {
        if (!value) return ''
        return value.substring(8, 10)
      },
      sliceDateDeadFour: function (value) {
        if (!value) return ''
        return value.substring(11, 16)
      },
      thousandth: (num) => { // 千分符过滤器
        return (parseInt(num).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      }
    },

    methods: {
      // 查看报名详情
      checkAttendDet(params) {
        this.$router.push({
          name: 'active_attendDetail',
          params: {
            activeId: params.activeId
          }
        })
      },
      // 报名活动
      attend(params) {
        this.$router.push({
          name: 'active_attend',
          params: {
            activeId: params.activeId
          }
        })
      },
      //取消活动
      cancelActive(params) {
        var that = this;
        return this.$.get({
          methodName: 'QuitFleetActivity',
          activityId: params.activeId
        })
          .then(res => {
            if (res.data.resultCode === "100") {
              this.isIn = 0;
//                            this.$.toast.bind(this)("取消成功！")
              this.$.get({
                clientType: this.$.getClientType,
                shopId: this.userInfo.shop.id,
                userId: this.userInfo.userId,
                methodName: 'QueryFleetActivity',
                activityId: this.activeDetail.id
              }).then(resp => {
                that.activeDetail = resp.data.fleetActivityData
              })
            }
          })
      },
      cancel (params) {
        this.$.confirm({
        	msg:'确定取消报名?'
        },()=>{
        	this.cancelActive(params)
        })
      },
//    touchStart(e){
//      this.touchStartY = parseInt(e.targetTouches[0].pageY);
//    },
//    touchEnd(e){
//      //回滚的容器高度
//      var h = document.querySelector("#active_detail").scrollHeight;
//      this.touchEndY = parseInt(e.changedTouches[0].pageY);
//      this.touchStartY - this.touchEndY > 7 && this.addActiveInfo ? this.dargUpAddData(h) : console.log('已经加载数据')
//    },
      dargUpAddData(h){
        if (!this.changActiveData) { //判断用户是否已经加载过数据
          this.$.get({
            clientType: this.$.getClientType,
            shopId: this.userInfo.shop.id,
            userId: this.userInfo.userId,
            methodName: 'QueryFleetActivity',
            activityId: this.activeDetail.id
          })
            .then(res => {
              if (res.data.resultCode === "100") {
                this.activeInfoContent = res.data.fleetActivityData.content
                //设置获取内容，回滚动画
//              let scrollAnimation = () => {
//                var oTop = document.body.scrollTop || document.documentElement.scrollTop;
//                if (h - 150 > oTop > 0) {
//                  document.body.scrollTop += 10
//                  requestAnimationFrame(scrollAnimation)
//                }
//                else {
//                  document.body.scrollTop = h
//                  cancelAnimationFrame(scrollAnimation)
//                }
//              }
//              requestAnimationFrame(scrollAnimation)
              }
              this.changActiveData = true;//已经加载的数据，关闭再次加载
            })
        }
      },

    },
//  beforeRouteEnter(to, from, next) {
//    
//  },
    components: {
      maHeader,
      cells,
      fullButton,
      Baidumap,
      model,
      scroll
    }
  }
</script>

<style>
  body {
  }

  #active_detail {
  height:100vh;
  }
 /*#active_detail.actIos{padding-bottom:86px}*/
  #active_detail .content,
  #active_detail .join {
    background-color: #fff;
    margin-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 15px;
    color: #A0A0A0;
  }

  #active_detail .actImg {
    object-fit: cover;
  }

  #active_detail .content h2 {
    padding-top: 11px;
    padding-bottom: 11px;
    border-bottom: 1px solid #F7F7F9;
    color: #1A1A1A;
  }

  #active_detail .content .iconCon {
    border-bottom: 1px solid #F7F7F9;
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 15px;
  }

  #active_detail .content .actDeadTime,
  #active_detail .content .lead {
    padding-top: 13px;
    padding-bottom: 13px;
  }

  #active_detail .content .mu-icon {
    margin-left: -4px;
  }

  #active_detail .content .iconfont {
    color: #F98700;
  }

  #active_detail .content .iconfont.icon-time01 {
    font-size: 20px;
    margin-left: -2px;
  }

  #active_detail .content .iconfont.icon-flag {
    font-size: 17px;
    margin-left: -1px;
  }

  #active_detail .content .iconfont.icon-jiezhiriqi {
    font-size: 17px;
  }

  #active_detail .join .attNum {
    padding-top: 13px;
    padding-bottom: 13px;
    border-bottom: 1px solid #F7F7F9;
  }

  #active_detail .join .attNum > span {
    font-size: 18px;
    color: #F98700;
  }

  #active_detail .join .memberHead {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-top: 5px;
  }

  #active_detail .join .icon-right {
    font-size: 24px;
    position: relative;
    top: -16px;
    right: -10px;
  }

  #active_detail .more {
    text-align: center;
    color: #A0A0A0;
    font-size: 16px;
    margin-top: 13px;
  }

  #active_detail .mu-raised-button {
    position: fixed;
    bottom: 49px;
    background-color: #827d77;
    color: #fff;
  }

  #active_detail .mu-raised-button.fullAndroid {
    bottom: 0px;
  }

  #active_detail .activity_time {
    display: inline-block;
    width: 90%;
    line-height: 21px;
    margin-left: -5px;
  }

  #active_detail .i_class {
    float: left;
    padding-top: 10px;
    padding-right: 8px;
  }

  .dragUpInfo {
    display: flex;
    justify-content: center;
    padding: 20px 0;
    color: #A0A0A0;
    font-size: 1rem;
    border-bottom: 1px solid #F7F7F9;
  }

  .dragUpInfo span {
    margin-top: -1px;
    margin-left: 5px;
    display: block;
    transform: rotateZ(-90deg);
  }

  .drag_active_info {
    padding: 30px;
    text-align: left;
    padding-left: 10%; /* 文本居左 肯定要频繁修改了 */
    background-color: #fff;
    padding-bottom:0
  }

  .drag_active_info p {
    margin-bottom: 10px;
  }

  .vue-map {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vue-map div {
    display: flex;
    justify-content: center;
  }

  .vue-map div a {
    color: #A0A0A0;
  }

  .vue-map div span {
    line-height: 150%;
  }

  .vue-map .iconfont {
    color: #999 !important;
  }

  .renminbi {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    float: left;
    background: url('../../assets/yuan.png') no-repeat;
    -webkit-background-size: 100%;
    background-size: 100%;
  }

  .active-d-repaired-h.androidclass{
    bottom: 0;
  }

  .active-d-repaired-h-item{
    position: static !important;
    justify-content: center;
    align-items: center;
  }
</style>