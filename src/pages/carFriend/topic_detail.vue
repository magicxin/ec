

<template>
  <div class="background-gray" id="topic_detail">
			<magic-header titleName="话题详情"></magic-header>
      <div class="scroll-box">
        <div class="topic">
          <mu-row gutter>
            <mu-col width="35" class="img">
              <img :src="topicDetail.pic ? addPath(topicDetail.pic) : defaultImg" height="100%" width="100%"
                   v-if="topicDetail">
            </mu-col>
            <mu-col width="65" class="detail">
              <div>
                <h4>
                  #{{ topicDetail.content }}#
                </h4>
              </div>
              <div>
                <p>{{ topicDetail.desp }}</p>
              </div>
              <div>
                <span>{{ topicDetail.count }}观点</span>
              </div>
            </mu-col>
          </mu-row>
        </div>
        <p class="introduction" v-if="topicDetail">
          导语：{{ topicDetail.introduction }}
        </p>
        <h4 class="discussion">热门讨论</h4>
        <empty v-if="dynamicList.length === 0" message="暂时没有讨论详情"></empty>
        <loadmore>
        	<div  v-if="dynamicList.length !== 0" v-for="(item,index) in dynamicList" :key="index">
	        	<dynamic :itemData="item" @removeSuccess="deleteTocDyn(index)"></dynamic>
	        </div>
        </loadmore>
        <full-button v-tap="{methods: discus}" name="参与讨论"></full-button>
      </div>

      <!--<form>
        <div layout="row" layout-align="center baseline " class="header-bar border_bottom">
          <div layout="row" layout-align="flex-start center" class="header-right-img left">
            <i class="iconfont icon-left" v-tap="{methods: cancel}"></i>
          </div>
          <div flex class="header-content">
            话题讨论
            <slot name="center"></slot>
          </div>
          <div v-if="queryData.content.length == conLength && imgList.length == 0" class="header-right-img"
               layout-align="flex-end center" layout="row" flex="nogrow">
            <slot name="right"></slot>
            <mu-flat-button class="disSend" label="发送" disabled/>
          </div>
          <div v-else class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow">
            <slot name="right"></slot>
            <mu-flat-button v-tap="{methods: submit}" class="send" label="发送"/>
          </div>
        </div>
        <div class="content">
          <textarea v-model="queryData.content" placeholder="说点什么吧"></textarea>
          <div>
            <span v-for="(item, index) in imgList" class="content-img img-container">
               <mu-icon value="close" v-tap="{methods: cancelUploadByIndex, index: index}"></mu-icon>
              <img :src="item.data" :height="imgHeight" :width="imgWidth">
            </span>
            <img class="upImg" v-tap="{methods: upload}" v-show="imgList.length < 6" src="../../assets/add-img.png"
                 :height="imgHeight" :width="imgWidth">
          </div>
        </div>
      </form>-->
  </div>
</template>

<script>
  import magicHeader from 'components/magicHeader'
  import left from 'assets/left-gray.svg'
  import dynamic from 'components/dynamic/dynamic'
  import loadmore from 'components/loadmore'
  import fullButton from 'components/button/full_button'
  import empty from 'components/empty-page.vue'
  import defaultImg from 'assets/default_user_icon.png'


  let pageable = {
    pageNumber: 2,
    pageSize: 10
  }
  
  let _tit
  let loading

  export default {
    name: 'topic_detail',
    data () {
      return {
        left,
        defaultImg,
        nickName: '',
        topicDetail: {},
        dynamicList: [],
        allLoaded: true,
        conLength: '',
        topicId: null
      }
    },
    deactivated () {
      //不是你期望的数据 则销毁组件
      if (this.topicId !== this.$route.params.topicId) {
        this.$destroy()
      }
    },
    methods: {
      goBack () {
        this.$router.push({
          name: 'hot_discussion'
        })
      },
      // 下来刷新
      loadBottom () {
        this.getDetail()
      },
      getDetail () {
        if (loading) {
          return
        }
        loading = true
        return this.$.get({
          methodName: 'QueryFleetTopicInfo',
          pageable: {
            pageNumber: pageable.pageNumber,
            pageSize: pageable.pageSize
          },
          topicId: this.$route.params.topicId
        }).then(resp => {
          loading = true
          if (resp.data.resultCode === '100') {
            pageable.pageNumber++
            resp.data.spaceDatas.forEach(val => {
              this.dynamicList.push(val)
            })
            if (this.dynamicList.length >= 10) {
              this.allLoaded = false
            }
          }
        })
      },
      deleteTocDyn: function (index) {
        this.dynamicList.splice(index, 1)
      },
      discus () {
        this.$router.push({
          name:'carFri_pubDynamic',
          query: {
            topicTitle: this.topicDetail.content,
            topicId: this.topicDetail.id
          }
        })
      }
    },
    created () {
      // let this = this
      window.scrollTo(0,0)
      this.$.get({
        methodName: 'QueryFleetTopicInfo',
        pageable: {
          pageNumber: 1,
          pageSize: 10
        },
        topicId: this.$route.params.topicId
      }).then(resp => {
      	console.log(resp)
        if (resp.data.resultCode === '100') {
          _tit = this.$route.params.topicTit
          this.$.get({
            methodName: 'QueryUserInfo'
          }).then(resp => {
            if (resp.data.resultCode === '100') {
              this.nickName = resp.data.userNickname
            }
          })
        }
        //dynamic 数据
        resp.data.spaceDatas.forEach((item,index)=>{
        	console.log(item)
        	this.dynamicList.push({
								id: item.id,
								avatar: (item.fleet && item.fleet.head) || (item.member && item.member.head) || this.defaultImg,
								name: item.fleet ? item.fleet.name : item.member.nickname,
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
        this.topicDetail = resp.data.topicData
        console.log(this.topicDetail)
//      this.conLength = this.queryData.content.length
      })
    },
    components: {
      magicHeader,
      dynamic,
      empty,
      loadmore,
      fullButton
    }
  }
</script>
<style scoped="scoped">
  #topic_detail {
    /*margin-bottom: 85px;
    height: 250px;*/
  }

  #topic_detail.topic_detail {
    margin-bottom: 85px;
    height: 250px;
  }

  #topic_detail .topic, .introduction, .discussion {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 7px 10px;
    padding-right: 5px;
  }

  #topic_detail .result_empty img {
    margin-top: 23%
  }

  #topic_detail .topic .detail div {
    padding-top: 10px;
  }

  #topic_detail .topic .detail div span {
    margin-right: 15px;
  }

  #topic_detail .introduction {
    line-height: 18px;
  }

  #topic_detail .discussion {
    background-color: #EFEFF4;
    font-size: 15px;
    /*padding: 5px;
    padding-top: 0px;
    padding-bottom: 3px;*/
  }

</style>
