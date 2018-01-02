<template>
  <section id="vehicle-instrument-hud">
    <magic-header titleName="hud模式"></magic-header>
    <!-- <content-with-loading :loaded="loaded">  -->
    <div class="jingx" ref="jxDiv">  
      <mu-flexbox class="flexbox">
        <mu-flexbox-item class="flex-demo">
          <li>{{oil}}</li>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <span>瞬时油耗L/100km</span>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-flexbox class="flexbox">
        <mu-flexbox-item class="flex-demo">
          <li>{{speed}}</li>
          <span>车速km/h</span>
        </mu-flexbox-item>
        <mu-flexbox-item class="flex-demo">
          <li>{{rotatedSpeed}}</li>
          <span>转速r/min</span>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-flexbox class="flexbox">
        <mu-flexbox-item class="flex-demo">
          <li>{{avgOil}}</li>
          <span>平均油耗L/100km</span>
        </mu-flexbox-item>
      </mu-flexbox>
      <mu-flexbox class="flexbox">
        <mu-flexbox-item class="flex-demo">
          <li>{{totalMiles}}</li>
          <span>行驶里程km</span>
        </mu-flexbox-item>
      </mu-flexbox>
    </div>
    <mu-flexbox class="flexbox-last"> 
      <mu-flexbox-item class="flex-demo">
      </mu-flexbox-item>  
      <mu-flexbox-item class="flex-button">
       <span @click="jx" ref="jx">镜像</span>
       <span @click="zw" ref="zw" class="zwSpan">正向</span>
      </mu-flexbox-item>   
      <mu-flexbox-item class="flex-button">
        <router-link  :to="{name:'vehicle-instrument',query:{id:this.$route.query.id}}"><span>退出</span></router-link>
      </mu-flexbox-item>   
      <mu-flexbox-item class="flex-demo">
      </mu-flexbox-item>
    </mu-flexbox>
  <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import vehicleInstrument from 'services/vehicle-instrument'
  // import {flexbox as MuFlexbox,flexboxItem as MuFlexboxItem} from 'muse-components/flexbox'
  export default {
    components: {
      magicHeader
      // Appbar,
      // ContentWithLoading,
      // MuFlexbox,
      // MuFlexboxItem,
    },
    data() {
      return {
        avgOil:'',
        engineRunningTime:'',
        engineWaterTemperature:'',
        oil:'',
        remainingOil:'',
        rotatedSpeed:'',
        speed:'',
        totalMiles:'',
        totalOil:'',
        voltage:'',
        intervalid1:'',
        loaded:true,
      }
    },
    created(){
      this.getData();
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='vehicle-instrument-hud'){      
          this.getData();
        }
      }
    },
    methods: {
      jx(){
        this.$refs.jxDiv.className="zw";
        this.$refs.jx.style.display="none";
        this.$refs.zw.style.display="block";
      },
      zw(){
        this.$refs.jxDiv.className="jingx";
        this.$refs.jx.style.display="block";
        this.$refs.zw.style.display="none";
      },
      getData(){
         vehicleInstrument.bind(this)({
          carId:this.$route.query.id,
        },(data)=>{
          console.log(data);
          this.oil=data.oil;
          this.avgOil=data.avgOil;
          this.engineWaterTemperature=data.engineWaterTemperature;
          this.engineRunningTime=data.engineRunningTime;
          this.remainingOil=data.remainingOil;
          this.totalOil=data.totalOil;
          this.voltage=data.voltage;
          this.totalMiles=data.totalMiles; 
          this.speed=data.speed;
          this.rotatedSpeed=data.rotatedSpeed;
          this.loaded=true;
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
  #vehicle-instrument-hud{
    background-color: #000000!important;
    .jingx{
      transform:rotate(0deg);
    }
    .zw{
      transform:rotate(180deg);
    }
    .zwSpan{
      display: none
    }
    .flexbox{
      margin-top: 10px;
      .flex-demo {
      text-align: center;
      color:#00fff6;     
        li{
          font-size: 48px;
        }
        span{
          color:#00fff6;
          font-size:14px
        }
      }  
    }            
    .flexbox-last{
      position: absolute;
      bottom: 20px;
      .flex-button{
        text-align: center;
        font-weight: bold;
        font-size:14px;
        height:40px;
        line-height: 40px;
        border:1px solid #666666;
        border-radius: 5px;
        color:#666666;
        a{
          color:#666666
        }
      }    
    } 
    .mu-flexbox .mu-flexbox-item:first-child{
      margin-left:8px!important
    }
    .mu-flexbox .mu-flexbox-item:last-child{
      margin-right:8px!important
    }
  }
</style>

