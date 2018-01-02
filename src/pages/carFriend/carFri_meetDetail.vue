
<template>
  <div id="carfri_meetDetail">
    <magic-header titleName="车友会">
    		<div slot="title-right" v-if="meetDetail.type !== '2'" v-tap="{methods: signOut, id: meetDetail.id}">退出</div>
    </magic-header>
    <div class="main scroll-box main-container-class" style="height: 100%; overflow: auto">
      <mu-sub-header>{{ meetDetail.name }}</mu-sub-header>
      <mu-row class="detail" gutter>
        <mu-col width="40" class="img">
          <!--<img :src="meetDetail.head" height="100%" width="100%">-->
          <img :src="meetDetail.head ? addPath(meetDetail.head) : defaultImg" heigh="100px" width="100%" />
          <p class="memberCount">会员数：{{ meetDetail.memberCount }}</p>
          <!-- <p v-if="meetDetail.fleetType === '1'" class="memberCount">车辆数：{{ meetDetail.carCount }}</p> -->
        </mu-col>
        <mu-col width="60" class="content">
          <!--<div><p>{{ meetDetail.remark }}</p></div>-->
          <div><p>{{ meetDetail.remark }}</p></div>
        </mu-col>
      </mu-row>
      <empty v-if="dynamicList.length === 0" message="暂时没有车友动态"></empty>
      <loadmore :getMore="loadMore">
      	<div v-if="dynamicList.length>0" v-for="item in dynamicList">
						<dynamic :itemData="item"></dynamic>
				</div>
			</loadmore>
      <full-button name="立即加入" v-if="meetDetail.type === '2'" v-tap="{methods: join, id: meetDetail.id}"></full-button>
      <full-button name="群聊" v-if="meetDetail.type !== '2'" v-tap="{ methods: selfClick }"></full-button>
    </div>
<!--

    <model :isShow="isShow" v-on:closeIsModel="join" title=" ">
      确定加入该车友会?
    </model>

    <model :isShow="isSignOut" v-on:closeIsModel="signOut" title=" ">
      确定退出该车友会?
    </model>-->

  </div>
</template>

<script>
import magicHeader from 'components/magicHeader'
import left from 'assets/left-gray.svg'
import dynamic from 'components/dynamic/dynamic'
import empty from 'components/empty-page.vue'
import fullButton from 'components/button/full_button'
import defaultImg from 'assets/default_user_icon.png'
import loadmore from 'components/loadmore'

let loading
let carfrimeetId
let carfriFleetId
let query = {
  index: 10,
  count: 10
}

export default {
  name: 'carfri_meetDetail',
  data () {
    return {
      left,
      defaultImg,
      screenHeight: document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight,
      meetDetail: {},
      dynamicList: [],
      nickName: '',
      allLoaded: true,
//    isSignOut: false,
//    isUpdateData: null
    }
  },
	
  methods: {
    // 下来刷新
    loadMore () {
      this.getDetail()
    },
    // 获取车友动态
    getDetail () {
      if (loading) {
        return
      }
      loading = true
      return this.$.get({
        methodName: 'QueryFleetMemberSpace',
        index: query.index.toString(),
        count: query.index.toString(),
        fleetId: this.$route.params.meetId
      }).then(res => {
        loading = true
        if (res.data.resultCode === '100') {
        	console.log(res)
        	//车友会动态
						let returnCarMeet = res.data.spaces
						returnCarMeet.length && returnCarMeet.forEach((item, index) => {
							this.dynamicList.push({
								id: item.id,
								avatar: item.fleet.head ? this.addPath(item.fleet.head) : this.defaultImg,
								name: item.fleet.name,
								userId:item.member.id,
								publishDate: item.publishDate,
								content: item.content,
								share: item.share,
								audios: item.audios,
								images: item.images,
								topics: item.topics,
								videos: item.videos,
								commentCount: item.commentCount,
								supportCount: item.supportCount,
								comments: item.comments,
								isSupport: item.isSupport
							})
						})
//        query.index += query.count
//        resp.data.spaces.forEach(val => {
//          this.dynamicList.push(val)
//        })
//        if (this.dynamicList.length < query.count) {
//          this.allLoaded = false
//        }
        }
      })
    },
    // 删除自己发布的动态
    deleteCarfriDyn: function (index) {
      this.dynamicList.splice(index, 1)
    },
    // 加入车友会
    joinMeet (params) {
    	console.log(params)
      return this.$.get({
        methodName: 'AddFleetMember',
        fleetId: params.id
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          this.meetDetail.type = '1'
          this.meetDetail.memberCount++
        }
      })
    },
    join (params) {
    	this.joinMeet({
          id: params.id
        })
//    if (params && params.id) {
//      carfrimeetId = params.id
//      this.isShow = true
//    }
//    if (params === 'true') {
//      this.isShow = false
//      this.joinMeet({
//        id: carfrimeetId
//      })
//    }
//    if (!params) {
//      this.isShow = false
//    }
    },
    // 退出车友会
    signOutMeet (params) {
      return this.$.get({
        methodName: 'ExitFleet',
        FleetId: params.id
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          this.meetDetail.type = '2'
          this.meetDetail.memberCount--
        }
      })
    },
    signOut (params) {
      // 用户未加入该车友会弹出提示
      if (this.meetDetail.type === '2') {
        this.$.toast({
          message: '您还未加入该车友会',
          duration: 2000
        })
        return
      }
      // 用户已加入该车友会
      if (this.meetDetail.type !== '2') {
      	this.signOutMeet({
            id: params.id
          })
//      if (params && params.id) {
//        carfriFleetId = params.id
//        this.isSignOut = true
//      }
//      if (params === 'true') {
//        this.isSignOut = false
//        this.signOutMeet({
//          id: carfriFleetId
//        })
//      }
//      if (!params) {
//        this.isSignOut = false
//      }
      }
    },
    // 用户已加入车友会，点击群聊跳至原生页面
    selfClick () {
      this.$.push('route_group_chat', {
        imGroupId: this.meetDetail.imGroupId,
        imGroupTitle: this.meetDetail.name
      }, (response) => {
        console.log(response)
      })
    },
    // 返回车友会列表页
    cancel () {
      // this.$router.push({
      //   name: 'carfri_meetLists'
      // })
      this.$router.go(-1)
    },
    fetchData () {
      this.$.get({
        methodName: 'QueryFleetMemberSpace',
        index: '0',
        count: '10',
        fleetId: this.$route.params.meetId
      }).then(res => {
        if (res.data.resultCode === '100') {
          // next(this => {
            this.$.get({
              methodName: 'QueryUserInfo'
            }).then(resp => {
              if (resp.data.resultCode === '100') {
                this.nickName = resp.data.userNickname
              }
            })
            this.meetDetail = res.data.fleetData
//          vm.dynamicList = resp.data.spaces
//          if (resp.data.spaces.length < 10) {
//            vm.allLoaded = false
//          }
//车友会动态
						let returnCarMeet = res.data.spaces
						returnCarMeet.length && returnCarMeet.forEach((item, index) => {
							this.dynamicList[index] = {
								id: item.id,
								avatar: item.fleet.head ? this.addPath(item.fleet.head) : this.defaultImg,
								name: item.fleet.name,
								userId:item.member.id,
								publishDate: item.publishDate,
								content: item.content,
								share: item.share,
								audios: item.audios,
								images: item.images,
								topics: item.topics,
								videos: item.videos,
								commentCount: item.commentCount,
								supportCount: item.supportCount,
								comments: item.comments,
								isSupport: item.isSupport
							}
						})
          // })
        }
      })
    }
  },
  activated () {
    this.fetchData()
  },
//beforeRouteEnter (to, from, next) {
//  let isUpdateData = true
//  if (from.name === 'big_images') {
//    isUpdateData = false
//  }
//  next(vm => {
//    vm.isUpdateData = isUpdateData
//  })
//},

  // beforeRouteLeave (to, from, next) {
  //   if (to.name === 'big_images') {
  //     window.localStorage.setItem('dynamicList', this.dynamicList)
  //   } else {
  //     window.localStorage.setItem('dynamicList', null)
  //    }
  //   next()
  // },
  components: {
    magicHeader,
    dynamic,
    empty,
    loadmore,
    fullButton
  }
}
</script>
<style>
  #carfri_meetDetail {
    margin-bottom: 50px;
    /*height: 200px;*/
  }
  #carfri_meetDetail.carfri_meetDetail {
    margin-bottom: 0px;
  }
  #carfri_meetDetail .main {
    background-color: #fff;
    padding-bottom: 20px;
    margin-bottom: 10px;
  }
  #carfri_meetDetail .scroll-box{
    position: unset;
  }
  #carfri_meetDetail .mu-sub-header {
    color: #000;
    font-size: 15px;
  }
  #carfri_meetDetail .row.detail {
    padding: 10px;
  }
  #carfri_meetDetail .memberCount {
    padding-top: 8px;
  }
  #carfri_meetDetail p {
    color: #383838;
    line-height: 17px;
    font-size: 13px;
  }
  #carfri_meetDetail .result_empty img {
    margin-top: 28%
  }
  #carfri_meetDetail .mu-raised-button {
    position: fixed;
    bottom: 49px;
  }
  #carfri_meetDetail .mu-raised-button.joinButton {
    bottom: 0px;
  }
  #carfri_meetDetail .headTit {
    background-color: #F7F7F7;
    min-height: 49px;
    position: fixed;
    top: 0px;
    line-height: 50px;
    width: 100%;
    z-index: 9111289;
  }
  #carfri_meetDetail .headTit.border_bottom {
    border-bottom: 1px solid #929292;
  }
  #carfri_meetDetail .header-right-img {
    width: 50px;
    line-height: 50px;
  }
  #carfri_meetDetail .header-content {
    text-align: center;
    font-size: 1.4rem;
    line-height: 50px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  #carfri_meetDetail .icon-left {
    position: relative;
    top: 0px;
    left: 8px;
    font-size: 23px;
  }
  #carfri_meetDetail .mu-flat-button.signOut {
    position: relative;
    top: 8px;
    right: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 14px;
    background-color: #F7F7F7;
  }
  #carfri_meetDetail #model {
    min-height: 0;
  }

</style>
