<template>
  <div class="eve_list">
   		<magic-header v-if="!isWxPublic" titleName="近期活动" :returnNative="native"></magic-header>
   		<scroll :getMore="loadMore" :allLoaded="allLoaded" :showMsg="true">
   				<div class="item-container">
	   				<div class="item" v-for="(item, index) in activeList" :key="index" v-tap="{methods:go,type:item.type,id:item.id, title:item.title}">
	   						<div class="img" >
	   							<img :src="item.cover" />
	   						</div>
	   						<div class="name">
	   							{{item.title}}
	   						</div>
	   						<div class="info">
	   							<div class="time">
	   									{{item.beginDate}} 至  {{item.endDate}}
	   							</div>
	   							<div class="state">
	   									{{item.state}}
	   							</div>
	   						</div>
	   				</div>
	   		</div>
   		</scroll>
  </div>
</template>
<script>
  import magicHeader from 'components/magicHeader'
  import scroll from 'components/loadmore'
  export default {
    components: {
      magicHeader,scroll
    },
    data () {
      return {
      	activeList:'',
      	allLoaded:false,
      	query : {
			    index: 5,
			    count: 5
			  },
			  native:false,
        isWxPublic:false
      }
    },
    methods: {
      go(params){
      	console.log(params)
      	switch (params.type) {
          case '0':
            this.$router.push({name: 'eve_robRedPacket', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '1':
            this.$router.push({name: 'eve_shakes', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '2':
            this.$.get({
              'methodName': 'LotteryInitInfo',
              'category': '2',
              'id': params.id
            }).then(res => {
              if (res.data.shape === '0') {
                this.$router.push({name: 'eve_luckyDraw_two', params: {activityId: params.id}, query: {title: params.title}})
              } else {
                this.$router.push({name: 'eve_luckyDraw', params: {activityId: params.id}, query: {title: params.title}})
              }
            })
            break
          case '3':
            this.$router.push({name: 'eve_groupShopping', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '4':
            this.$router.push({name: 'eve_robBuy', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '5':
            this.$router.push({name: 'eve_timeSpike', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '6':
            this.$router.push({name: 'eve_helpBargain', params: {activityId: params.id}, query: {title: params.title}})
            break
          case '7':
            this.$router.push({name: 'eve_recommend', params: {activityId: params.id}, query: {title: params.title}})
            break
        }
      },
      loadMore () {
      	var that = this
        this.$.get({
          methodName: 'ListActivity',
          index: that.query.index,
          count: that.query.count
        }).then(resp => {
        	console.log(resp)
          that.query.index += that.query.count
          resp.data.activityExtDatas.forEach((item) => {
          		item.cover = that.addPath(item.cover)
          		item.beginDate = item.beginDate.slice(0,10)
        			item.endDate = item.endDate.slice(0,10)
        			item.state = item.state=='0'?'即将开始':'进行中'
            	this.activeList.push(item)
          }, this)
          if (resp.data.activityExtDatas.length < 5) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      // console.log(clientInfo)
//    if(to.meta.native){
//    	to.params.native = true
//    }
      next()
    },
    created () {
    	alert(this.$.env)
    	this.native = this.$route.params.native
    	if(this.$.env === 'wxPublic'){
    		this.isWxPublic = true
    	}
    	 
      this.$.get({
        methodName: 'ListActivity',
        index: 0,
        count: 5
      }).then(res => {
      	console.log(res)
        this.activeList = res.data.activityExtDatas
        if(this.activeList.length && this.activeList.length>0){
        	this.activeList.forEach((item,index)=>{
        			item.cover = this.addPath(item.cover)
        			item.beginDate = item.beginDate.slice(0,10)
        			item.endDate = item.endDate.slice(0,10)
        			item.state = item.state=='0'?'即将开始':'进行中'
        	})
        }
        /* eslint-disable */
      })
    },
    activated () {
      /* eslint-disable */
      let _offset = window.localStorage.getItem('offsetTop')
      window.scrollTo(0, _offset)
    }
  }
</script>
<style>
	.eve_list {
		width:100%;
		background:#f5f5f5;
	}
  .eve_list .item-container{
  	width:90%;
  	display:flex;
  	flex-flow:column;
  	margin:0 auto;
  }
  .eve_list .item{
  	display:flex;
  	flex-flow:column;
  	min-height: 200px;
    margin-top: 20px;
    border-radius: 10px;
    font-weight: 400;
    padding-bottom: 5px;
    background:#fff;
  }
  .eve_list .img {
  	position: relative;
  	width:100%;
    overflow: hidden;
    border-radius: 10px;
    padding-top: 45.45%;
    min-width: 288px;
    z-index:1;
  }
  .eve_list .img img {
  	position: absolute;
  	border-radius: 10px;
  	top:0;
  	width:100%;
  }
  .eve_list .name{
  	font-size: 18px;
    margin: 12px 12px;
    color: #000;
  }
  .eve_list .info{
  	display:flex;
  	flex-flow:row;
  	justify-content: space-between;
  	color: #929292;
    font-size: 13px;
    margin: 0 12px 12px 12px;
  }
</style>
