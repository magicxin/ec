
<template>
  <div id="city_active">
    <magic-header titleName="同城活动"></magic-header>
    <img src="../../assets/img.png" width="100%">
    <empty v-if="activeList.length === 0" message="暂时没有活动"></empty>
    <ul v-if="activeList.length !== 0">
    	<loadmore :getMore="loadMore">
	      <li class="main" v-for="item in activeList" v-tap="{methods: checkDetail, activeId: item.id, status: item.isbaoming, shopName: item.shop.name}">
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
	            <img :src="item.cover ? addPath(item.cover) : defaultImg" width="100%" height="135px" />
	          </mu-col>
	        </mu-row>
	
	        <div class="attend" v-show="item.isbaoming">
	          <span>已报名</span>
	        </div>
	        <div class="attend-1" v-show="!item.isbaoming">
	          <span>未报名</span>
	        </div>
	      </li>
      </loadmore>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import magicHeader from 'components/magicHeader'
  import loadmore from 'components/loadmore'
  import left from 'assets/left-gray.svg'
  import empty from 'components/empty-page.vue'
  import defaultImg from 'assets/default_user_icon.png'


  export default {
    data () {
      return {
        left,
        defaultImg,
        activeList: [],
        query : {
			    index: 2,
			    count: 5
			  }
      }
    },
//
    // 截取日期字符串
    filters: {
      sliceDate: function (value) {
        if (!value) return ''
        return value.slice(5, 10)
      }
    },
    created(){
    	Vue.prototype.$.get({
        methodName: 'QueryFleetActivityList',
        "pageable" : { 
          "pageNumber" : '1', 
          "pageSize" : '5'
     		},
        fleetId: ''
     }).then(resp => {
        if (resp.data.resultCode === '100') {
            this.activeList = resp.data.fleetActivityDatas
            resp.data.fleetActivityDatas.forEach(
              (item, index) => {
                item.isbaoming = item.attends.some(
                  (_item, _index) => {
                    return _item.memberId === this.$.userId
                  }
                )
              }
            )
        }
      })
    },
    methods: {
    	loadMore(){
    		this.$.get({
	        methodName: 'QueryFleetActivityList',
	        "pageable" : { 
	          "pageNumber" : this.query.index, 
	          "pageSize" : this.query.count
	     		},
	        fleetId: ''
	     }).then(res => {
	        if (res.data.resultCode === '100') {
	        	this.query.index ++
	        	res.data.fleetActivityDatas.forEach(
	              (item, index) => {
	                item.isbaoming = item.attends.some(
	                  (_item, _index) => {
	                    return _item.memberId === this.$.userId
	                  }
	                )
	              }
	            )
	        this.activeList = this.activeList.concat(res.data.fleetActivityDatas)
	        }
	      })
    	},
      goBack () {
        this.$router.push({
          name: 'carFri_home'
        })
      },
      // 查看活动详情
      checkDetail (params) {
        this.$router.push({
          name: 'active_detail',
          params: {
            activeId: params.activeId,
            status: params.status,
            shopName: params.shopName
          }
        })
      }
    },
//  beforeRouteEnter (to, from, next) {
//
//  },
    components: {
      magicHeader,
      empty,
      loadmore
    }
  }
</script>
 <style>
  #city_active {
    margin-bottom: 50px;
  }
  #city_active .main {
    background-color: #fff;
    margin-top: 10px;
    padding: 15px;
    padding-right: 10px;
    padding-left: 10px;
    position: relative;
  }
  #city_active .content {
    margin-top: 10px;
  }
  #city_active .result_empty {
    background-color: #F8F8F8;
  }
  #city_active .col-50 img {
    object-fit: cover;
  }
  #city_active .iconfont {
    color: #F98700;
    margin-left: -6px;
    padding-right: 3px;
  }

  #city_active .iconfont.icon-location {
    font-size: 28px;
  }
  #city_active .iconfont>span {
    font-size: 16px;
    position: relative;
    color: #999;
    top: -3px;
    left: -3px;
  }
  #city_active .iconfont>span.area {
    left: -11px;
  }
  #city_active .iconfont>.date {
    position: relative;
    top: -3px;
    left: 3px;
  }
  #city_active .iconfont.icon-time01 {
    font-size: 22px;
    /*display: inline-block;
    padding-right: 4px;*/
  }
  #city_active p {
    font-size: 14px;
  }
  #city_active .attend {
    width: 85px;
    height: 70px;
    background-image: url('../../assets/label.png');
    text-align: center;
    position: absolute;
    top: -10px;
    right: 10px;
  }
  #city_active .attend span {
    display: inline-block;
    margin-top: 44px;
    margin-left: 10px;
  }
  #city_active .attend-1 {
    width: 85px;
    height: 69px;
    background-image: url('../../assets/label-1.png');
    text-align: center;
    position: absolute;
    top: -10px;
    right: 10px;
  }
  #city_active .attend-1 span {
    display: inline-block;
    margin-top: 44px;
    margin-left: 10px;
  }
</style>
