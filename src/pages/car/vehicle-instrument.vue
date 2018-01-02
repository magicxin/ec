<template>
  <section id="vehicle-instrument">
    <!-- <appbar :link="{name:'car-map'}"/> -->
    <magic-header titleName="车辆仪表"></magic-header>
    <!-- <content-with-loading :loaded="loaded">  -->
    <mu-flexbox class="flexbox-button">    
      <mu-flexbox-item class="flex-HUD">
         <router-link  :to="{name:'vehicle-instrument-hud',query:{id:this.$route.query.id}}"><span>HUD模式</span></router-link>
      </mu-flexbox-item>
    </mu-flexbox>  
    <div id="container" ref="container" style="width:55%;height:200px;float:left"></div>
    <div id="container1" ref="container1"  style="width:45%;height:200px;float:left"></div>
    <mu-flexbox class="flexbox">
      <mu-flexbox-item class="flex-demo">
        <li><span>瞬时油耗</span></li>
        <li><span class="span">{{oil}}</span></li>
        <li><span>L/100km</span></li>
      </mu-flexbox-item>
      <mu-flexbox-item class="flex-demo">
        <li><span>平均油耗</span></li>
        <li><span class="span">{{avgOil}}</span></li>
        <li><span>L/100km</span></li>
      </mu-flexbox-item>
      <mu-flexbox-item class="flex-demo">
        <li><span>剩余油量</span></li>
        <li><span class="span">{{remainingOil}}</span></li>
        <li><span>%</span></li>
      </mu-flexbox-item>
    </mu-flexbox>
    <mu-flexbox class="flexbox">
      <mu-flexbox-item class="flex-demo">
        <li><span>当前里程</span></li>
        <li><span class="span">{{totalMiles}}</span></li>
        <li><span>km</span></li>
      </mu-flexbox-item>
      <mu-flexbox-item class="flex-demo">
        <li><span>电瓶电压</span></li>
        <li><span class="span">{{voltage}}</span></li>
        <li><span>v</span></li>
      </mu-flexbox-item>
      <mu-flexbox-item class="flex-demo">
        <li><span>冷却液温度</span></li>
        <li><span class="span">{{engineWaterTemperature}}</span></li>
        <li><span>℃</span></li>
      </mu-flexbox-item>
    </mu-flexbox>
    <div class="detail"><router-link  :to="{name:'vehicle-instrument-detail',query:{id:this.$route.query.id}}">查看详细信息></router-link></div>
    <div class="description"> 车辆仪表实时数据受4G信号影响，传输可能会有一定延时</div>
  <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import vehicleInstrument from 'services/vehicle-instrument'
  // import {flexbox as MuFlexbox,flexboxItem as MuFlexboxItem} from 'muse-components/flexbox'
  import Highcharts from 'highcharts'
  let HighchartsMore=require('highcharts/highcharts-more')(Highcharts)
  export default {
    components: {
      magicHeader,
      // Appbar,
      // ContentWithLoading,
      // MuFlexbox,
      // MuFlexboxItem,
      Highcharts,
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
        intervalid1:'',
        loaded:true,
      }
    },
    computed:{
    },
    mounted(){
      this.containerChart=Highcharts.chart('container', { 
          chart: {
                    type : "gauge",  
                    plotBorderWidth : 0,  
                    plotBackgroundColor : "#000000",  
                    plotBackgroundImage : null,  
                    backgroundColor:"#000000"
          },
          credits: {  
            enabled: false  //不显示LOGO 
          }, 
          title: {
              text: '',
          },          
          pane : [ {  
                    startAngle : -120,  
                    endAngle : 120,  
                    background : null,  
                    // 极坐标图或角度测量仪的中心点，像数组[x,y]一样定位。位置可以是以像素为单位的整数或者是绘图区域的百分比  
                    center : [ '50%', '60%' ],
                    size:'100%'   
                } ],
          yAxis: {
              min: 0,
              max: 240,
              lineWidth:0,
              minorTickInterval: 'auto',
              minorTickWidth: 1,
              minorTickLength: 5,
              minorTickPosition: 'inside',
              minorTickColor: '#00fff6',     
              tickPixelInterval: 30,
              tickWidth: 2,
              tickPosition: 'inside',
              tickLength: 10,
              tickColor: '#00fff6',
              labels : {  
                        // 刻度值旋转角度  
                        rotation : 0, 
                    step:1,
                        style: {  
                            color: '#00fff6',  
                            fontWeight: 'normal'  
                        }
              },
              title: {
                  text: 'km/h',
                    style: {
                        color: '#00fff6'
                    },
                  align: 'low', 
                  y:60,
                  x:-10 
              },                 
          },
          plotOptions : {  
                    gauge : {  
                        dataLabels : {  
                            color : '#00fff6',
                            borderWidth:0,          
                        style: {
                            fontSize: "26px",
                          },
                        },  
                        dial : {  
                             backgroundColor: 'red',  
                            // 半径：指针长度  
                            radius : '100%',  
                        },
                        pivot : {
                          borderColor:'red',
                          borderWidth:2
                        }  
                    }  
                },  
          series: [{
              name: 'Speed',
              data: [0],
              tooltip: {
                  valueSuffix: ' km/h'
              }
          }]      
      });

      this.container1Chart=Highcharts.chart('container1', { 
        chart: {
                  type : "gauge",  
                  plotBorderWidth : 0,  
                  plotBackgroundColor : "#000000",  
                  plotBackgroundImage : null,  
                  backgroundColor:"#000000"
        },
        
        title: {
            text: '',
        },
        credits: {  
            enabled: false  //不显示LOGO 
        }, 
        pane : [ {  
                  startAngle : -120,  
                  endAngle : 120,  
                  background : null,  
                  // 极坐标图或角度测量仪的中心点，像数组[x,y]一样定位。位置可以是以像素为单位的整数或者是绘图区域的百分比  
                  center : [ '50%', '60%' ],   
                  size:'100%'   
              } ],
           
        yAxis: {
            min: 0,
            max: 8,
            lineWidth:0,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 5,
            minorTickPosition: 'inside',
            minorTickColor: '#00fff6',
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#00fff6',
            labels : {  
                      // 刻度值旋转角度  
                      rotation : 0, 
                  step:1,
                      style: {  
                          color: '#00fff6',  
                          fontWeight: 'normal'  
                      }
            },
            title: {
                text: 'kr/min',
                  style: {
                      color: '#00fff6'
                  },
                align: 'low', 
                y:60,
                x:-15  
            },
              plotBands: [{
                from: 6,
                to: 8,
                color: '#DF5353' // red
            }]       
        },
       plotOptions : {  
                    gauge : {  
                        dataLabels : {  
                            color : '#00fff6',
                            borderWidth:0,          
                        style: {
                            fontSize: "26px",
                          },
                        },  
                        dial : {  
                             backgroundColor: 'red',                             
                            // 半径：指针长度  
                            radius : '100%',  
                        },
                        pivot : {
                          borderColor:'red',
                          borderWidth:2
                        } 
                    }  
                },  
          series: [{
              name: 'rotatedSpeed',
              data: [0],
              tooltip: {
                  valueSuffix: ' kr/min'
              }
          }]
      });   
    },
    created(){
      this.getData();
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='vehicle-instrument'){  
          setInterval(() => {        
            this.getData();
          }, 5000)
        }
      }
    },
    methods: {
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
          
          if(data.speed=="--"){       
            this.speed.push(0);
          }else{
            this.speed.push(parseFloat(data.speed));
          }
          if(data.rotatedSpeed=="--"){ 
            this.rotatedSpeed.push(0);
          }else{  
            this.rotatedSpeed.push(parseFloat(data.rotatedSpeed/1000));
          }
          this.containerChart.series[0].setData(this.speed);
          this.container1Chart.series[0].setData(this.rotatedSpeed); 
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
  #vehicle-instrument{
    background-color: #000000!important;
    .flexbox{
      margin-top: 8px;
      .flex-demo {
      text-align: center;
      height:66px;
      border:1px solid #838383;
      border-radius: 5px;
      color:#666666;
      font-size: 12px;
        .span{
          color:#00fff6;
          font-size:18px
        }
      }
    }
    .mu-flexbox .mu-flexbox-item:first-child{
      margin-left:8px!important
    }
    .mu-flexbox .mu-flexbox-item:last-child{
      margin-right:8px!important
    }
    .detail{
      color:#ffffff;
      height:30px;
      line-height: 30px;
      text-align: right;
      margin:8px 8px 0px 0px;
      a{
        color:#ffffff
      }
    }
    .description{
      color:#666666;
      height:30px;
      line-height: 30px;
      font-size: 12px;
      text-align: center;
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .flexbox-button{
      .flex-HUD{
        text-align: right;
        a{
          color:#f98700;
        }
      }
    }
  }
</style>

