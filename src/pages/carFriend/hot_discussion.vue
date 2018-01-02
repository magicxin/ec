
<template>
  <div class="background-gray" id="hot_discussion">
    <icar-header bgColor="#F7F7F7" mainText="热门讨论" textColor="#474747">
      <img :src="left" v-go="'carFri_home'">
    </icar-header>
    <div></div>
    <form class="search" onsubmit="return false">
      <input type="search" id="searchTopic" v-model="searchValue" placeholder="搜索你感兴趣的话题" autocomplete="off">
    </form>
    <empty class="empty" v-if="topicList.length === 0" message="暂时没有话题讨论"></empty>
    <ul v-if="topicList.length !== 0">
      <li class="main" v-for="item in topicList" v-tap="{methods: checkDetail, topicId: item.id, topicTit: item.content}">
        <div class="row">
          <div class="img">
            <img :src="item.pic ? addPath(item.pic) : defaultImg" height="100%" width="100%">
          </div>
          <div class="content">
            <div><h4>#{{ item.content}}#</h4></div>
            <div >
              <p>{{ item.desp }}</p>
            </div>
            <div>
              <span>{{ item.count }}观点</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import empty from 'components/empty-page.vue'

  import defaultImg from 'assets/default_user_icon.png'


  export default {
    name: 'hot_discussion',
    data () {
      return {
        left,
        defaultImg,
        topicList: {},
        searchValue: ''
      }
    },

    methods: {
      goBack () {
        this.$router.push({
          name: 'carFri_home'
        })
      },
      getList (searchValue) {
        return this.$.get({
          methodName: 'QueryFleetTopic',
          searchValue: searchValue
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.topicList = []
            setTimeout(() => {
              this.topicList = resp.data.topicDatas
            }, 10)
            // this.topicList = resp.data.topicDatas
          }
        })
      },
      checkDetail (params) {
        this.$router.push({
          name: 'topic_detail',
          params: {
            topicId: params.topicId,
            topicTit: params.topicTit
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryFleetTopic'
        // searchValue: ''
        // searchType: 0
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          next(vm => {
            vm.topicList = resp.data.topicDatas
            console.log(vm.topicList)
          })
        }
      })
    },
    mounted () {
      let el = document.querySelector('#searchTopic')
      el && el.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
          document.getElementById('searchTopic').blur()
          this.getList(this.searchValue)
        }
      })
    },
    components: {
      icarHeader,
      empty
    }
  }
</script>

<style>
  #hot_discussion {
    position: relative;
    background-color: #EFEFF4;
    margin-bottom: 50px;
  }
  #hot_discussion .search {
    width: 100%;
    background-color: #C9C9CE;
    padding: 6px 10px;
  }
  #hot_discussion .search input {
    width: 100%;
    display: block;
    /*border-radius: 5px;*/
    height: 30px;
    line-height: 30px;
    outline: none;
    text-align: center;
    border:none;
    border-radius: 10px;
    background: url(../../assets/search.svg) no-repeat 15px;
    background-color: #fff;
  }
 
  #hot_discussion .main {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 7px 10px;
    padding-right: 5px;
  }
  #hot_discussion .main .content div {
    padding-top: 10px;
  }
  #hot_discussion .main .content div span {
    margin-right: 15px;
  }
  #hot_discussion .empty{
  	height:calc(100vh - 92px)
  }
  #hot_discussion .row{
  	flex-flow:row;
  	justify-content: flex-start;
  }
  #hot_discussion .img{
  	width:65px;
  	margin-right:24px;
    flex-shrink: 0;
  }
  
</style>