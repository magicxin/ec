
<template>
  <div class="background-gray" id="carfri_meetLists">
    <!--<icar-header bgColor="#F7F7F7" mainText="车友会" textColor="#474747">
      <img :src="left" v-tap="{methods: goBack}">
    </icar-header>-->
    <magic-header titleName="车友会"></magic-header>
    <div></div>
    <form class="search" onsubmit="return false">
      <input type="search" id="searchFleet" v-model="searchValue" placeholder="搜索" v-on:click="goSearch()" autocomplete="off">
    </form>
    <empty v-if="meetLists.length === 0" message="暂时没有车友会"></empty>
    <ul v-else>
      <li class="main" v-for="item in meetLists">
        <mu-row gutter  v-tap="{methods: checkDetail, meetId: item.id}">
          <mu-col width="35" class="img">
            <img :src="item.head ? addPath(item.head) : defaultImg" height="100px" width="100%">
          </mu-col>
          <mu-col width="65" class="content">
            <div><h4>{{item.name}}</h4></div>
            <div >
              <p>简介：{{item.remark}}</p>
            </div>
            <div v-if="item.fleetType === '0'">
              <span>会员数：{{item.memberCount}}</span>
            </div>
            <div v-if="item.fleetType === '1'">
              <span>车辆数：{{item.carCount}}</span>
            </div>
          </mu-col>
        </mu-row>
        <mu-raised-button v-if="item.type==1"  @click="sign(item.id)" :id="'fleetId_'+item.id"   :label="(item.signState==1)?'已签到':'签到'" :disabled="(item.signState==1)?true:false"></mu-raised-button>
      </li>
    </ul>
  </div>
</template>

<script>
  import magicHeader from 'components/magicHeader'
  import left from 'assets/left-gray.svg'
  import empty from 'components/empty-page.vue'
  import defaultImg from 'assets/default_user_icon.png'
  import Loadmore from 'components/loadmore'
  export default {
    name: 'carfri_meetLists',
    components: {
      magicHeader,
      empty,
      loadMore: Loadmore
    },
    data () {
      return {
        left,
        defaultImg,
        meetLists: [],
        allLoaded: false,
        searchValue: '',
        id:'',
        hasSign:false,
        memberPosition:'',
        disbaled:false
      }
    },
    methods: {
      sign(id){
      		this.$.mark()
      		.then(res=>{
      				this.memberPosition = JSON.parse(res)
              this.signState(id)
      		})
      },
      signState(id){
        this.id=id,
        this.$.get({
        	methodName: 'Sign',
        	searchValue: '',
        	fleetId:id,
        	memberPosition : this.memberPosition.address,
        	pageable: {
          	pageNumber: 1,
         	  pageSize: 100
       	 }
        })
        .then(resp => {
          if (resp.data.resultCode === '100') {
            console.log(document.getElementById("fleetId_"+this.id))
            document.getElementById("fleetId_"+this.id).children[0].innerText="已签到"
            this.hasSign = true
            console.log("签到成功")
            this.refList()
          }
        })
     },
      // 下拉刷新
      loadBottom () {
        this.getList()
      },
      // 获取车友会列表数据
      getList (searchValue) {
        let _self = this
        return this.$.get({
          methodName: 'QueryFleetList',
          searchValue: searchValue
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            // pageable.pageNumber++
            _self.meetLists = []
            console.log(resp.data.fleets)
            setTimeout(() => {
              _self.meetLists = resp.data.fleets
            }, 10)
          }
        })
      },
      refList () {
        let _self = this
        return this.$.get({
          methodName: 'QueryFleetList',
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            // pageable.pageNumber++
            _self.meetLists = []
            console.log(resp.data.fleets)
              _self.meetLists = resp.data.fleets
          }
        })
      },
      // 查看车友会详情
      checkDetail (params) {
        this.isSearch = true
        window.localStorage.setItem('issearch', JSON.stringify(this.isSearch))
        window.localStorage.setItem('issearchValue', JSON.stringify(this.searchValue))
        this.$router.push({
          name: 'carFri_meetDetail',
          params: {
            meetId: params.meetId
          }
        })
      },
      // 搜索车友会
      goSearch () {
        let el = document.querySelector('#searchFleet')
        el && el.addEventListener('keyup', (event) => {
          if (event.keyCode === 13) {
            document.getElementById('searchFleet').blur()
            this.getList(this.searchValue)
            window.localStorage.setItem('issearchValue', JSON.stringify(this.searchValue))
          }
        })
      }
    },
    mounted () {
      // 判断是否进行搜索
      if (JSON.parse(window.localStorage.getItem('issearch')) === null || JSON.parse(window.localStorage.getItem('issearch')) === false) {
        this.$.get({
          methodName: 'QueryFleetList',
          searchValue: ''
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.meetLists = resp.data.fleets
          }
        })
      } else {
        this.$.get({
          methodName: 'QueryFleetList',
          searchValue: JSON.parse(window.localStorage.getItem('issearchValue'))
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.meetLists = resp.data.fleets
          }
        })
      }
    }
  }
</script>
<style scoped>
  #carfri_meetLists {
    margin-bottom: 50px;
    position: relative;
  }
  #carfri_meetLists .search {
    width: 100%;
    background-color: #C9C9CE;
    padding: 6px 10px;
  }
  #carfri_meetLists .search input {
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
  #carfri_meetLists .main {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 7px 10px;
    padding-right: 5px;
    position: relative;
  }
  #carfri_meetLists .main button {
    position: absolute;
    top: 67%;
    right: 5%;
    border: solid 1px #ABAAA8;
    width: 55px;
    height: 30px;
    background-color: #fff;
  }
  #carfri_meetLists .main button {
    position: absolute;
    top: 67%;
    right: 5%;
    border: solid 1px #ABAAA8;
  }
  #carfri_meetLists .main .content div {
    padding-top: 10px;
  }
  #carfri_meetLists .main .content div span {
    margin-right: 15px;
  }
  #carfri_meetLists h4 {
    font-size: 15px;
    color: #414141;
  }
  #carfri_meetLists p {
    color: #666666;
    font-family: Arial, Helvetica, sans-serif;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>