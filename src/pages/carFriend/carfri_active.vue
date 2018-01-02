 
<template>
  <div id="carfri_active">
    <my-header main-text="车友活动" bg-color="#F7F7F7" text-color="#000" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods: goBack}">
    </my-header>
    <img src="../../assets/img.png" width="100%">
    <empty v-if="activeList.length === 0" message="暂时没有活动"></empty>
    <ul v-if="activeList.length !== 0">
      <li class="main" v-for="item in activeList" v-tap="{methods: checkDetail, activeId: item.id, status: item.isCanjia, shopName: item.shop.name}">
        <mu-row gutter>
          <mu-col width="50">
            <h2>{{ item.title }}</h2>
            <div class="content">
              <i class="iconfont icon-location">
                <span v-if="item.area && item.area.parentParentAreaData">{{ item.area.parentParentAreaData.name }}</span>
                <span class="area" v-if="!item.area.parentParentAreaData && item.area.parentAreaData">{{ item.area.parentAreaData.name }}</span>
                <span class="area" v-if="!item.area.parentParentAreaData && !item.area.parentAreaData">{{ item.area.name }}</span>
              </i>
              <i class="iconfont icon-time01">
                <span class="date">{{ item.beginDate | sliceDate }}</span>
                <span> {{ item.beginDate | weekDay }}</span>
              </i>
            </div>
            <div class="content">
              <p>{{item.attendNumber}}人已报名</p>
            </div>
            <div class="content">
              <h3>主办方：{{item.shop.name}}</h3>
            </div>
          </mu-col>
          <mu-col width="50">
            <img :src="item.cover ? addPath(item.cover) : defaultImg" width="100%" />
          </mu-col>
        </mu-row>

        <div class="attend" v-show="!item.isCanjia">
          <span>已报名</span>
        </div>
        <div class="attend-1" v-show="item.isCanjia">
          <span>已参加</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
	import Vue from 'vue'
  import myHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import empty from 'components/empty-page.vue'

  //

  import defaultImg from 'assets/default_user_icon.png'

  // let week = new Date().getDay() // eslint-disable-line no-unused-vars

  export default {
    data () {
      return {
        left,
        defaultImg,
        activeList: [],
        endTime: ''
      }
    },

    filters: {
      sliceDate: function (value) {
        if (!value) return ''
        return value.slice(5, 10)
      },
      weekDay: function (value) {
        if (!value) return ''
        let week = ['周六', '周日', '周一', '周二', '周三', '周四', '周五']
        return week[new Date(Date.parse(value.replace(/-/g, '/')))]
      }
    },
    methods: {
      goBack (params) {
        this.$.push('router_back', null, (resp) => {
          console.log('调用成功')
        })
      },
      checkDetail (params) {
        this.$router.push({
          name: 'carfri_activeDetail',
          params: {
            activeId: params.activeId,
            status: params.status,
            shopName: params.shopName
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryMyFleetActivityAttend',
        index: '0',
        count: '15'
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          next(vm => {
            vm.activeList = resp.data.fleetActivityDatas
            let nowTime = new Date().getTime()
            resp.data.fleetActivityDatas.forEach(
              (item, index) => {
                vm.endTime = new Date(item.endDate).getTime()
                item.isCanjia = (vm.endTime < nowTime)
              }
            )
          })
        }
      })
    },
    components: {
      myHeader,
      empty
    }
  }
</script>

<style>
  #carfri_active {
    margin-bottom: 50px;
  }
  #carfri_active .main {
    background-color: #fff;
    margin-top: 10px;
    padding: 15px;
    padding-right: 10px;
    position: relative;
  }
  #carfri_active .content {
    margin-top: 10px;
  }
  #carfri_active .result_empty img {
    margin-top: 40%
  }
  #carfri_active .row {
    /*margin-left: -5px;*/
  }
  #carfri_active .iconfont {
    color: #999999;
    margin-left: -6px;
    padding-right: 3px;
  }
  #carfri_active .iconfont.icon-location {
    font-size: 28px;
  }
  #carfri_active .iconfont>span {
    font-size: 16px;
    position: relative;
    top: -3px;
    left: -3px;
  }
  #carfri_active .iconfont>span.area {
    left: -11px;
  }
  #carfri_active .iconfont>.date {
    position: relative;
    top: -3px;
    left: 3px;
  }
  #carfri_active .iconfont.icon-time01 {
    font-size: 22px;
    /*display: inline-block;
    padding-right: 4px;*/
  }
  #carfri_active p {
    font-size: 14px;
  }
  #carfri_active .attend {
    width: 85px;
    height: 70px;
    background-image: url('../../assets/label.png');
    text-align: center;
    position: absolute;
    top: -10px;
    right: 10px;
  }
  #carfri_active .attend span {
    display: inline-block;
    margin-top: 44px;
    margin-left: 10px;
  }
  #carfri_active .attend-1 {
    width: 85px;
    height: 69px;
    background-image: url('../../assets/label-1.png');
    text-align: center;
    position: absolute;
    top: -10px;
    right: 10px;
  }
  #carfri_active .attend-1 span {
    display: inline-block;
    margin-top: 44px;
    margin-left: 10px;
  }
</style>