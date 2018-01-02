<template>
  <section id="running-tracks-stop" class="background-light">
    <!-- <appbar :link="{name:'running-tracks-detail',query:{trackId:this.$route.query.trackId}}"/> -->
    <magic-header titleName="行车轨迹"></magic-header>
      <!-- <content-with-loading :loaded="loaded">   -->
        <mu-list>
          <template v-for="parking,index in parkings">
            <router-link  :to="{name:'running-tracks-detail'}">
              <mu-list-item title="">
                <mu-avatar slot="left" color="#fff" backgroundColor="#538cd1">{{index}}</mu-avatar>
                <span slot="describe">
                  <span style="color: rgba(0, 0, 0, .87)">时间:{{parking.beginTime}}</span>
                  <span style="color: rgba(0, 0, 0, .87)">停留:{{parking.totalTime}}</span>              
                  <span style="color: rgba(0, 0, 0, .87)">状态:{{parking.state}}</span><br/>
                  <span style="color: rgba(0, 0, 0, .87)">地点:{{parking.address}}</span>
                </span>
              </mu-list-item>
            </router-link>
            <mu-divider/>            
          </template>
      </mu-list>
    <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import MuAvatar from 'muse-components/avatar'
  // import MuDivider from 'muse-components/divider'
  // import MuIcon from 'muse-components/icon'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  // import ContentWithLoading from 'components/content-with-loading'
  import magicHeader from 'components/magicHeader'
  import runningTracksDetail from 'services/running-tracks-detail.js'
  export default {
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuAvatar,
      // MuDivider,
    },
    data() {
      return {
        loaded:true,
        parkings:[],
        errorMessage:'',
      }
    },
    computed:{
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='running-tracks-stop'){
          this.getData();
        }
      },
    },  
    created(){
        runningTracksDetail.bind(this)({
          trackId:this.$route.query.trackId,
          timeType:'4'
          },(data)=>{
          this.parkings=data.parkings;
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        });           
    },
    methods: {
      getData(){
        runningTracksDetail.bind(this)({
          trackId:this.$route.query.trackId,
          timeType:'4'
          },(data)=>{
          this.parkings=data.parkings;
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        });  
      }
    }
  }
</script>

<style lang="scss">
  #running-tracks-stop{
    .mu-avatar{
      border-radius: 50%
    }
  }
</style>

