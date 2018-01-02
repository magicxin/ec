<template>
  <section id="vehicle-instrument-detail" class="background-light">
    <!-- <appbar :link="{name:'vehicle-instrument',query:{id:this.$route.query.id}}"/> -->
    <magic-header titleName="详细信息"></magic-header>
      <!-- <content-with-loading :loaded="loaded">      -->
        <mu-list class="listBg">
          <template>
            <mu-list-item title="百公里油耗(L/100km)" :afterText="this.avgOil">
            </mu-list-item>
            <mu-divider/>  
            <mu-list-item title="耗油量(L)" :afterText="this.totalOil">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="行驶里程(km)" :afterText="this.totalMiles">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="剩余油量(%)" :afterText="this.remainingOil">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="电瓶电压(V)" :afterText="this.voltage">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="当前车速(km/h)" :afterText="this.speed">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="发动机转速(RPM)" :afterText="this.rotatedSpeed">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="发动机运行时间(s)" :afterText="this.engineRunningTime">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="发动机水温(℃)" :afterText="this.engineWaterTemperature">
            </mu-list-item>
            <mu-divider/>   
            <mu-list-item title="瞬时油耗(L/km)" :afterText="this.oil">
            </mu-list-item>
            <mu-divider/>             
          </template>
      </mu-list>
    <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import MuDivider from 'muse-components/divider'
  import magicHeader from 'components/magicHeader'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  // import ContentWithLoading from 'components/content-with-loading'
  import vehicleInstrument from 'services/vehicle-instrument'
  export default {
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuDivider
    },
    data() {
      return {
        avgOil:'',
        engineRunningTime:'',
        engineWaterTemperature:'',
        oil:'',
        remainingOil:'',
        rotatedSpeed:[],
        speed:[],
        totalMiles:'',
        totalOil:'',
        voltage:'',
        loaded:false,
      }
    },
    computed:{
    },
    created(){
      this.getData();
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='vehicle-instrument-detail'){          
          this.getData();
        }
      }
    },
    methods: {
      getData(){
         vehicleInstrument.bind(this)({
          carId:this.$route.query.id,
        },(data)=>{
          this.oil=data.oil;
          this.avgOil=data.avgOil;
          this.engineWaterTemperature=data.engineWaterTemperature;
          this.engineRunningTime=data.engineRunningTime;
          this.remainingOil=data.remainingOil;
          this.totalOil=data.totalOil;
          this.voltage=data.voltage;
          this.speed=data.speed;
          this.rotatedSpeed=data.rotatedSpeed;
          this.totalMiles=data.totalMiles;
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
  @import "../../scss/variables.scss";
  // .bg{
  //  background-color:#efeff4!important;
  // }
  #vehicle-instrument-detail{
  }
</style>

