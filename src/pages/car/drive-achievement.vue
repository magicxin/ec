<template>
  <section id="drive-achievement" class="background-light">
    <!-- <appbar :link="{name:'car-map',query:{id:this.$route.query.id}}"/> -->
    <magic-header titleName="驾驶成就"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->
        <template>
          <mu-flexbox class="flexbox-bg">
            <mu-flexbox-item class="flex-date" id="day">
              <li @click="dayDate"><span>日</span></li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-date" id="week">
              <li @click="weekDate" class="data-border"><span>周</span></li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-date" id="month">
              <li @click="monthDate"><span>月</span></li>
            </mu-flexbox-item>
          </mu-flexbox>
          <div class="date" id="date">
            <div class="arrow-left" @click="beforeDate(dtype)"></div>
            <div class="date-font" ref="dateTab"><mu-date-picker  v-model="formatDate" @change="dateChange" :shouldDisableDate="shouldDisable"/></div>
            <div class="date-font-other" ref="tab">{{date}}</div>
            <div class="arrow-right" @click="afterDate(dtype)"></div>
          </div>
          <mu-flexbox>
            <mu-flexbox-item class="flex-demo">
              <li class="guiji_img"><span>总里程</span></li>
              <li>{{totalMiles}}</li>
              <li>km</li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo">
              <li class="shic_img"><span>行驶时长</span></li>
              <li>{{driveTimes}}</li>
              <li>h</li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo">
              <li class="oil_img"><span>总油耗</span></li>
              <li>{{totalOil}}</li>
              <li>L</li>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-flexbox  class="mt8">
            <mu-flexbox-item class="flex-demo">
              <li class="avgOil_img"><span>平均油耗</span></li>
              <li>{{avgOil}}</li>
              <li>km/100</li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo">
              <li class="speed_img"><span>平均车速</span></li>
              <li>{{avgSpeed}}</li>
              <li>km/h</li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo">
              <li class="money_img"><span>参考油费</span></li>
              <li>{{oilCost}}</li>
              <li>元</li>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-flexbox  class="mt10">
            <mu-flexbox-item class="flex-demo">
              <li  v-if="deceleration>0" class="jiansu_img_nor"></li>
              <li  v-else class="jiansu_img"></li>
              <li>
              <span>急减速</span>
              <span v-if="deceleration>0" class="guiji_font" >{{deceleration}}</span><span v-else>{{deceleration}}</span><span>次</span>
              </li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo-1">
              <li  v-if="acceleration>0" class="jiasu_img_nor"></li>
              <li  v-else class="jiasu_img"></li>
              <li><span>急加速</span><span v-if="acceleration>0" class="guiji_font">{{acceleration}}</span><span v-else>{{acceleration}}</span><span>次</span></li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo-1">
              <li  v-if="sharpTurn>0" class="zw_img_nor"></li>
              <li  v-else class="zw_img"></li>
              <li><span>急转弯</span><span v-if="sharpTurn>0"  class="guiji_font">{{sharpTurn}}</span><span v-else>{{sharpTurn}}</span><span>次</span></li>
            </mu-flexbox-item>
          </mu-flexbox>
          <mu-flexbox>
            <mu-flexbox-item class="flex-demo">
              <li  v-if="rapidBrake>0" class="sc_img_nor"></li>
              <li  v-else class="sc_img"></li>
              <li><span>急刹车</span><span v-if="rapidBrake>0" class="guiji_font">{{rapidBrake}}</span><span v-else>{{rapidBrake}}</span><span>次</span></li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo-1">
              <li  v-if="overRotateSpeed>0" class="zs_img_nor"></li>
              <li  v-else class="zs_img"></li>
              <li><span>高转速</span><span v-if="overRotateSpeed>0" class="guiji_font">{{overRotateSpeed}}</span><span v-else>{{overRotateSpeed}}</span><span>次</span></li>
            </mu-flexbox-item>
            <mu-flexbox-item class="flex-demo-1">
              <li  v-if="idleSpeed>0" class="ds_img_nor"></li>
              <li  v-else class="ds_img"></li>
              <li><span>长怠速</span><span v-if="idleSpeed>0" class="guiji_font">{{idleSpeed}}</span><span v-else>{{idleSpeed}}</span><span>次</span></li>
            </mu-flexbox-item>
          </mu-flexbox>
          <canvas id="oilChart" width="100%" height="100%"></canvas>
          <canvas id="milesChart" width="100%" height="100%"></canvas>
          <canvas id="timeChart" width="100%" height="100%"></canvas>
          <div>
            <mu-snackbar class="center" v-if="snackbar" message="不能大于当前日期" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
          </div>
        </template>  
      <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import {flexbox as MuFlexbox,flexboxItem as MuFlexboxItem} from 'muse-components/flexbox'
  // import ContentWithLoading from 'components/content-with-loading'
  import driveAchievement from 'services/drive-achievement'
  // import MuDatePicker from 'muse-components/datePicker'
  import Chart from 'chart.js'
  export default {
    components: {
      // Appbar,
      // ContentWithLoading,
      // MuFlexbox,
      // MuFlexboxItem,
      // MuSnackbar,
      // MuDatePicker,
      magicHeader,
      Chart
    },
    data() {
      return {
        loaded:false,
        snackbar: false,
        type:'line',
        oilData:[],  
        milesData:[], 
        timeData:[], 
        xaxis:[],
        date:'',
        formatDate:'',
        year:'',
        month:'',
        week:'',
        day:'',
        dtype:'day', 
        totalMiles:'',
        driveTimes:'',
        avgOil:'',
        avgSpeed:'',
        oilCost:'',
        acceleration:'',
        deceleration:'',
        sharpTurn:'',
        rapidBrake:'',
        overRotateSpeed:'',
        idleSpeed:'',
        beginDate:'',
        endDate:''
      }
    },
    created(){
      var date=new Date();   
      var year=date.getFullYear();
      var month=date.getMonth()+1;
      var day=date.getDate();
      this.date=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
      this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day)
      this.year=year;
      this.month=month;
      this.day=day;
      driveAchievement.bind(this)({
        carId:this.$route.query.id,
        beginTime:this.formatDate+' '+'00:00:00',
        endTime:this.formatDate+' '+'23:59:59',
        type:'4',
      },(data)=>{
        this.totalMiles=data.totalMiles,
        this.driveTimes=data.driveTimes,
        this.totalOil=data.totalOil,
        this.avgOil=data.avgOil,
        this.avgSpeed=data.avgSpeed,
        this.oilCost=data.oilCost,
        this.acceleration=data.drivingActionCount[3],
        this.deceleration=data.drivingActionCount[4],
        this.sharpTurn=data.drivingActionCount[8],
        this.rapidBrake=data.drivingActionCount[5], 
        this.overRotateSpeed=data.drivingActionCount[9],
        this.idleSpeed=data.drivingActionCount[4],
        this.loaded=true
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    methods:{
      shouldDisable (date) {
        return date > new Date()
      },
        dateChange(value){
          driveAchievement.bind(this)({
          carId:this.$route.query.id,
          beginTime:value+' '+'00:00:00',
          endTime:value+' '+'23:59:59',
          type:'4',
        },(data)=>{
          this.totalMiles=data.totalMiles,
          this.driveTimes=data.driveTimes,
          this.totalOil=data.totalOil,
          this.avgOil=data.avgOil,
          this.avgSpeed=data.avgSpeed,
          this.oilCost=data.oilCost,
          this.acceleration=data.drivingActionCount[3],
          this.deceleration=data.drivingActionCount[4],
          this.sharpTurn=data.drivingActionCount[8],
          this.rapidBrake=data.drivingActionCount[5], 
          this.overRotateSpeed=data.drivingActionCount[9],
          this.idleSpeed=data.drivingActionCount[4],
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      formatDateWeek(date) { 
        var myyear = date.getFullYear(); 
        var mymonth = date.getMonth()+1; 
        var myweekday = date.getDate(); 
        if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
        } 
        if(myweekday < 10){ 
        myweekday = "0" + myweekday; 
        } 
        return (myyear+"/"+mymonth + "/" + myweekday); 
      },
      formatDateDay(date) { 
        var myyear = date.getFullYear(); 
        var mymonth = date.getMonth()+1; 
        var myweekday = date.getDate(); 
        if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
        } 
        if(myweekday < 10){ 
        myweekday = "0" + myweekday; 
        } 
        return (myyear+"-"+mymonth + "-" + myweekday); 
      },
      formatDateMonth(date) { 
        var myyear = date.getFullYear(); 
        var mymonth = date.getMonth()+1; 
        if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
        } 
        return (myyear+"-"+mymonth); 
      },
      dayDate(){
        document.getElementById("oilChart").style.display="none";
        document.getElementById("milesChart").style.display="none";
        document.getElementById("timeChart").style.display="none";
        document.getElementById('day').style.borderBottom="1px solid #f98700";  
        document.getElementById('week').style.borderBottom="none";
        document.getElementById('month').style.borderBottom="none";
        this.$refs.tab.style.display="none"
        this.$refs.dateTab.style.display="block"      
        var date=new Date();   
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        var day=date.getDate();
        this.date=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
        this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day)
        this.year=year;
        this.month=month;
        this.day=day;
        this.dtype='day';
        driveAchievement.bind(this)({
        carId:this.$route.query.id,
        beginTime:this.formatDate+' '+'00:00:00',
        endTime:this.formatDate+' '+'23:59:59',
        type:'4',
        },(data)=>{
          this.totalMiles=data.totalMiles,
          this.driveTimes=data.driveTimes,
          this.totalOil=data.totalOil,
          this.avgOil=data.avgOil,
          this.avgSpeed=data.avgSpeed,
          this.oilCost=data.oilCost,
          this.acceleration=data.drivingActionCount[3],
          this.deceleration=data.drivingActionCount[4],
          this.sharpTurn=data.drivingActionCount[8],
          this.rapidBrake=data.drivingActionCount[5], 
          this.overRotateSpeed=data.drivingActionCount[9],
          this.idleSpeed=data.drivingActionCount[4],
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      weekDate(){        
        document.getElementById("oilChart").style.display="block";
        document.getElementById("milesChart").style.display="block";
        document.getElementById("timeChart").style.display="block";
        document.getElementById('week').style.borderBottom="1px solid #f98700";  
        document.getElementById('day').style.borderBottom="none"; 
        document.getElementById('month').style.borderBottom="none";
        this.$refs.tab.style.display="block"
        this.$refs.dateTab.style.display="none"    
        var now = new Date(); //当前日期 
        var nowDayOfWeek = now.getDay(); //今天本周的第几天 
        var nowDay = now.getDate(); //当前日 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
        this.date= this.formatDateWeek(weekStartDate)+"-"+this.formatDateWeek(weekEndDate);
        this.dtype='week';
        this.beginDate=this.formatDateDay(weekStartDate);
        this.endDate=this.formatDateDay(weekEndDate);
        driveAchievement.bind(this)({
          carId:this.$route.query.id,
          beginTime:this.beginDate+' '+'00:00:00',
          endTime:this.endDate+' '+'23:59:59',
          type:'1',
        },(data)=>{
          this.totalMiles=data.totalMiles,
          this.driveTimes=data.driveTimes,
          this.totalOil=data.totalOil,
          this.avgOil=data.avgOil,
          this.avgSpeed=data.avgSpeed,
          this.oilCost=data.oilCost,
          this.acceleration=data.drivingActionCount[3],
          this.deceleration=data.drivingActionCount[4],
          this.sharpTurn=data.drivingActionCount[8],
          this.rapidBrake=data.drivingActionCount[5], 
          this.overRotateSpeed=data.drivingActionCount[9],
          this.idleSpeed=data.drivingActionCount[4],
          this.oilData=data.hundredConsumption,
          this.milesData=data.driveRange,
          this.timeData=data.driveTime
          var ctx = document.getElementById("oilChart");
          var ctx1 = document.getElementById("milesChart");
          var ctx2 = document.getElementById("timeChart");
          var oildata = {
              labels: ["1", "2", "3", "4", "5", "6","7"],
              datasets: [{
                  label: '百公里油耗图',
                  data:this.oilData ,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          }
          var myChart = new Chart(ctx, {
          xLabel: '日期(日)',
          yLabel: '里程(千米)',
          type: this.type,
          data:oildata,
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
                }
            }
          });
          var milesdata = {
              labels: ["1", "2", "3", "4", "5", "6","7"],
              datasets: [{
                  label: '行驶里程图',
                  data:this.milesData ,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          }
          var myChart1 = new Chart(ctx1, {
          type: this.type,
          data:milesdata,
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
                }
            }
          });
          var timedata = {
              labels: ["1", "2", "3", "4", "5", "6","7"],
              datasets: [{
                  label: '行驶时间图',
                  data:this.timeData ,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          }
          var myChart2 = new Chart(ctx2, {
          type: this.type,
          data:timedata,
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
                }
            }
          });
            this.loaded=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })       
      },
      monthDate(){       
        document.getElementById("oilChart").style.display="block";
        document.getElementById('month').style.borderBottom="1px solid #f98700";  
        document.getElementById('day').style.borderBottom="none"; 
        document.getElementById('week').style.borderBottom="none";
        this.$refs.tab.style.display="block"
        this.$refs.dateTab.style.display="none" 
        var date=new Date();   
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        this.date=year+'年'+(month>9?month:'0'+month)+'月';
        this.beginDate=year+'-'+(month>9?month:'0'+month)+'-'+'01',
        this.endDate=year+'-'+(month>9?month:'0'+month)+'-'+'31',
        this.year=year;
        this.month=month;
         if(month=="1"||month=="3"||month=="5"||month=="7"||month=="8"||month=="10"||month=="12"){
              this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
            }else if(month=="2"&&(year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){
              this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
            }else if(month=="4"||month=="6"||month=="9"||month=="11"){
              this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
            }else{
              this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
            }
        this.dtype='month'
        driveAchievement.bind(this)({
        carId:this.$route.query.id,
        beginTime:this.beginDate+' '+'00:00:00',
        endTime:this.endDate+' '+'23:59:59',
        type:'2',
        },(data)=>{
          this.totalMiles=data.totalMiles,
          this.driveTimes=data.driveTimes,
          this.totalOil=data.totalOil,
          this.avgOil=data.avgOil,
          this.avgSpeed=data.avgSpeed,
          this.oilCost=data.oilCost,
          this.acceleration=data.drivingActionCount[3],
          this.deceleration=data.drivingActionCount[4],
          this.sharpTurn=data.drivingActionCount[8],
          this.rapidBrake=data.drivingActionCount[5], 
          this.overRotateSpeed=data.drivingActionCount[9],
          this.idleSpeed=data.drivingActionCount[4],
          this.oilData=data.hundredConsumption,
          this.milesData=data.driveRange,
          this.timeData=data.driveTime
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
        var ctx = document.getElementById("oilChart");
        var ctx1 = document.getElementById("milesChart");
        var ctx2 = document.getElementById("timeChart");
        var oildata = {
            labels: this.xaxis,
            datasets: [{
                label: '百公里油耗图',
                data:this.oilData ,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
        var myChart = new Chart(ctx, {
        xLabel: '日期(日)',
        yLabel: '里程(千米)',
        type: this.type,
        data:oildata,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
              }
          }
        });       
        var milesdata = {
            labels: this.xaxis,
            datasets: [{
                label: '行驶里程图',
                data:this.milesData ,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
        var myChart1 = new Chart(ctx1, {
        type: this.type,
        data:milesdata,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
              }
          }
        });
        var timedata = {
            labels: this.xaxis,
            datasets: [{
                label: '行驶时间图',
                data:this.timeData ,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
        var myChart2 = new Chart(ctx2, {
        type: this.type,
        data:timedata,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
              }
          }
        });
      },
      beforeDate(type){             
        var year=this.year;
        var month=this.month;
        var day=this.day;
        if(type=="day"){
          if(month=="1"&&day=="1"){
            year=year-1;
          }
          if(day>1){
            day= day-1
          }else{
            if(month>1){
              month=month-1
            }else{
              month=12
            }
            if(month=="1"||month=="3"||month=="5"||month=="7"||month=="8"||month=="10"||month=="12"){
              day=31
            }else if(month=="2"&&(year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){
              day=29
            }else if(month=="4"||month=="6"||month=="9"||month=="11"){
              day=30
            }else{
              day=28
            }
          }
          this.date=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
          this.day=day;
          this.year=year;
          this.month=month;
          this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
          driveAchievement.bind(this)({
            carId:this.$route.query.id,
            beginTime:this.formatDate+' '+'00:00:00',
            endTime:this.formatDate+' '+'23:59:59',
            type:'4',
          },(data)=>{
            this.totalMiles=data.totalMiles,
            this.driveTimes=data.driveTimes,
            this.totalOil=data.totalOil,
            this.avgOil=data.avgOil,
            this.avgSpeed=data.avgSpeed,
            this.oilCost=data.oilCost,
            this.acceleration=data.drivingActionCount[3],
            this.deceleration=data.drivingActionCount[4],
            this.sharpTurn=data.drivingActionCount[8],
            this.rapidBrake=data.drivingActionCount[5], 
            this.overRotateSpeed=data.drivingActionCount[9],
            this.idleSpeed=data.drivingActionCount[4],
            this.loaded=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })
        }else if(type=="week"){
          var nowDayDate = new Date(); //当前日 
          var now1 = new Date(this.beginDate); //当前日期 
          var nowDayOfWeek1 = now1.getDay(); //今天本周的第几天 
          var nowDay1 = now1.getDate(); //当前日 
          var nowMonth1 = now1.getMonth(); //当前月 
          var nowYear1 = now1.getFullYear(); //当前年 
          var weekStartDate1 = new Date(nowYear1, nowMonth1, nowDay1 - nowDayOfWeek1); 
          var weekEndDate1 = new Date(nowYear1, nowMonth1, nowDay1 + (6 - nowDayOfWeek1)); 
          var now = weekStartDate1; //当前日期 
          var nowDayOfWeek = 7; //今天本周的第几天 
          var nowDay = now.getDate(); //当前日 
          var nowMonth = now.getMonth(); //当前月 
          var nowYear = now.getFullYear(); //当前年 
          var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
          this.date= this.formatDateWeek(weekStartDate)+"-"+this.formatDateWeek(weekEndDate);
          this.dtype='week';
          this.beginDate=this.formatDateDay(weekStartDate);
          this.endDate=this.formatDateDay(weekEndDate);
          driveAchievement.bind(this)({          
          carId:this.$route.query.id,
          beginTime:this.beginDate+' '+'00:00:00',
          endTime:this.endDate+' '+'23:59:59',
          type:'1',
          },(data)=>{ 
            this.totalMiles=data.totalMiles,
            this.driveTimes=data.driveTimes,
            this.totalOil=data.totalOil,
            this.avgOil=data.avgOil,
            this.avgSpeed=data.avgSpeed,
            this.oilCost=data.oilCost,
            this.acceleration=data.drivingActionCount[3],
            this.deceleration=data.drivingActionCount[4],
            this.sharpTurn=data.drivingActionCount[8],
            this.rapidBrake=data.drivingActionCount[5], 
            this.overRotateSpeed=data.drivingActionCount[9],
            this.idleSpeed=data.drivingActionCount[4],
            this.data=data.hundredConsumption,
            this.oilData=data.hundredConsumption,
            this.milesData=data.driveRange,
            this.timeData=data.driveTime
            var ctx = document.getElementById("oilChart");
            var ctx1 = document.getElementById("milesChart");
            var ctx2 = document.getElementById("timeChart");
            var oildata = {
                labels: this.xaxis,
                datasets: [{
                    label: '百公里油耗图',
                    data:this.oilData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart = new Chart(ctx, {
            xLabel: '日期(日)',
            yLabel: '里程(千米)',
            type: this.type,
            data:oildata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });       
            var milesdata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶里程图',
                    data:this.milesData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart1 = new Chart(ctx1, {
            type: this.type,
            data:milesdata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            var timedata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶时间图',
                    data:this.timeData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart2 = new Chart(ctx2, {
            type: this.type,
            data:timedata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            this.loaded=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })          
        }else if(type=="month"){
          if(month>1){
            month=month-1
            this.date=year+'年'+(month>9?month:'0'+month)+'月';
            this.year=year;
            this.month=month;
          }else{
            year=year-1
            month=12
            this.date=year+'年'+(month>9?month:'0'+month)+'月';
            this.year=year;
            this.month=month;
          }
          this.beginDate=year+'-'+(month>9?month:'0'+month)+'-'+'01',
          this.endDate=year+'-'+(month>9?month:'0'+month)+'-'+'31',
          this.year=year;
          this.month=month;
          if(month=="1"||month=="3"||month=="5"||month=="7"||month=="8"||month=="10"||month=="12"){
                this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
              }else if(month=="2"&&(year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){
                this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
              }else if(month=="4"||month=="6"||month=="9"||month=="11"){
                this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
              }else{
                this.xaxis=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
          }
          driveAchievement.bind(this)({          
          carId:this.$route.query.id,
          beginTime:this.beginDate+' '+'00:00:00',
          endTime:this.endDate+' '+'23:59:59',
          type:'2',
          },(data)=>{ 
            this.totalMiles=data.totalMiles,
            this.driveTimes=data.driveTimes,
            this.totalOil=data.totalOil,
            this.avgOil=data.avgOil,
            this.avgSpeed=data.avgSpeed,
            this.oilCost=data.oilCost,
            this.acceleration=data.drivingActionCount[3],
            this.deceleration=data.drivingActionCount[4],
            this.sharpTurn=data.drivingActionCount[8],
            this.rapidBrake=data.drivingActionCount[5], 
            this.overRotateSpeed=data.drivingActionCount[9],
            this.idleSpeed=data.drivingActionCount[4],
            this.data=data.hundredConsumption,
            this.oilData=data.hundredConsumption,
            this.milesData=data.driveRange,
            this.timeData=data.driveTime
            var ctx = document.getElementById("oilChart");
            var ctx1 = document.getElementById("milesChart");
            var ctx2 = document.getElementById("timeChart");
            var oildata = {
                labels: this.xaxis,
                datasets: [{
                    label: '百公里油耗图',
                    data:this.oilData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart = new Chart(ctx, {
            xLabel: '日期(日)',
            yLabel: '里程(千米)',
            type: this.type,
            data:oildata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });       
            var milesdata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶里程图',
                    data:this.milesData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart1 = new Chart(ctx1, {
            type: this.type,
            data:milesdata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            var timedata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶时间图',
                    data:this.timeData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart2 = new Chart(ctx2, {
            type: this.type,
            data:timedata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            this.loaded=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })          
        }
      },
      afterDate(type){
        if(type=="day"){
          var nowDate=new Date();       
          var year=this.year;
          var month=this.month;
          var day=this.day;     
          this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
          if(this.formatDateDay(nowDate)==this.formatDate){
            this.showSnackbar();
            return false;
          }    
          if(month=="12"&&day=="31"){
            year=year+1;
          }
          if(month=="1"||month=="3"||month=="5"||month=="7"||month=="8"||month=="10"||month=="12"){
            if(day<31){
              day=day+1
            }else{
              day=1
              if(month<12){
                month=month+1
              }else{
                month=1
              }
            }
          }else if(month=="2"&&(year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)){
            if(day<29){
              day=day+1
            }else{
              day=1
              month=month+1
            }
          }else if(month=="4"||month=="6"||month=="9"||month=="11"){
            if(day<30){
              day=day+1
            }else{
              day=1
              month=month+1
            }
          }else{
            if(day<28){
              day=day+1
            }else{
              day=1
              month=month+1
            }
          }
          this.date=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
          this.day=day;
          this.year=year;
          this.month=month;      
          this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
            driveAchievement.bind(this)({
              carId:this.$route.query.id,
              beginTime:this.formatDate+' '+'00:00:00',
              endTime:this.formatDate+' '+'23:59:59',
              type:'4',
            },(data)=>{
              this.totalMiles=data.totalMiles,
              this.driveTimes=data.driveTimes,
              this.totalOil=data.totalOil,
              this.avgOil=data.avgOil,
              this.avgSpeed=data.avgSpeed,
              this.oilCost=data.oilCost,
              this.acceleration=data.drivingActionCount[3],
              this.deceleration=data.drivingActionCount[4],
              this.sharpTurn=data.drivingActionCount[8],
              this.rapidBrake=data.drivingActionCount[5], 
              this.overRotateSpeed=data.drivingActionCount[9],
              this.idleSpeed=data.drivingActionCount[4],
              this.loaded=true
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })
          }else if(type=="week"){
          var nowDayDate = new Date(); //当前日 
          if(this.formatDateDay(nowDayDate)<=this.endDate){
            this.showSnackbar();
            return false;
          }  
          var now1 = new Date(this.endDate); //当前日期   
          var nowDayOfWeek1 = now1.getDay(); //今天本周的第几天 
          var nowDay1 = now1.getDate(); //当前日 
          var nowMonth1 = now1.getMonth(); //当前月 
          var nowYear1 = now1.getFullYear(); //当前年 
          var weekStartDate1 = new Date(nowYear1, nowMonth1, nowDay1 - nowDayOfWeek1); 
          var weekEndDate1 = new Date(nowYear1, nowMonth1, nowDay1 + (6 - nowDayOfWeek1)); 
          var now = weekStartDate1; //当前日期 
          var nowDayOfWeek = 7; //今天本周的第几天 
          var nowDay = now.getDate(); //当前日 
          var nowMonth = now.getMonth(); //当前月 
          var nowYear = now.getFullYear(); //当前年 
          var weekStartDate = new Date(nowYear, nowMonth, nowDay + nowDayOfWeek); 
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 + nowDayOfWeek)); 
          this.date= this.formatDateWeek(weekStartDate)+"-"+this.formatDateWeek(weekEndDate);
          this.dtype='week';
          this.beginDate=this.formatDateDay(weekStartDate);
          this.endDate=this.formatDateDay(weekEndDate);
          driveAchievement.bind(this)({          
          carId:this.$route.query.id,
          beginTime:this.beginDate+' '+'00:00:00',
          endTime:this.endDate+' '+'23:59:59',
          type:'1',
          },(data)=>{ 
            this.totalMiles=data.totalMiles,
            this.driveTimes=data.driveTimes,
            this.totalOil=data.totalOil,
            this.avgOil=data.avgOil,
            this.avgSpeed=data.avgSpeed,
            this.oilCost=data.oilCost,
            this.acceleration=data.drivingActionCount[3],
            this.deceleration=data.drivingActionCount[4],
            this.sharpTurn=data.drivingActionCount[8],
            this.rapidBrake=data.drivingActionCount[5], 
            this.overRotateSpeed=data.drivingActionCount[9],
            this.idleSpeed=data.drivingActionCount[4],
            this.data=data.hundredConsumption,
            this.oilData=data.hundredConsumption,
            this.milesData=data.driveRange,
            this.timeData=data.driveTime
            var ctx = document.getElementById("oilChart");
            var ctx1 = document.getElementById("milesChart");
            var ctx2 = document.getElementById("timeChart");
            var oildata = {
                labels: this.xaxis,
                datasets: [{
                    label: '百公里油耗图',
                    data:this.oilData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart = new Chart(ctx, {
            xLabel: '日期(日)',
            yLabel: '里程(千米)',
            type: this.type,
            data:oildata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });       
            var milesdata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶里程图',
                    data:this.milesData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart1 = new Chart(ctx1, {
            type: this.type,
            data:milesdata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            var timedata = {
                labels: this.xaxis,
                datasets: [{
                    label: '行驶时间图',
                    data:this.timeData ,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var myChart2 = new Chart(ctx2, {
            type: this.type,
            data:timedata,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                  }
              }
            });
            this.loaded=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })          
        }else if(type=="month"){            
            var nowDate=new Date();       
            var year=this.year;
            var month=this.month;
            this.formatDate=year+'-'+(month>9?month:'0'+month);
            if(this.formatDateMonth(nowDate)==this.formatDate){
              this.showSnackbar();
              return false;
            } 
            if(month<12){
                month=month+1
              }else{
                month=1
                year=year+1;
            }        
            this.date=year+'年'+(month>9?month:'0'+month)+'月';
            this.year=year;
            this.month=month; 
            this.beginDate=year+'-'+(month>9?month:'0'+month)+'-'+'01',
            this.endDate=year+'-'+(month>9?month:'0'+month)+'-'+'31',
            driveAchievement.bind(this)({          
            carId:this.$route.query.id,
            beginTime:this.beginDate+' '+'00:00:00',
            endTime:this.endDate+' '+'23:59:59',
            type:'2',
            },(data)=>{
              this.totalMiles=data.totalMiles,
              this.driveTimes=data.driveTimes,
              this.totalOil=data.totalOil,
              this.avgOil=data.avgOil,
              this.avgSpeed=data.avgSpeed,
              this.oilCost=data.oilCost,
              this.acceleration=data.drivingActionCount[3],
              this.deceleration=data.drivingActionCount[4],
              this.sharpTurn=data.drivingActionCount[8],
              this.rapidBrake=data.drivingActionCount[5], 
              this.overRotateSpeed=data.drivingActionCount[9],
              this.idleSpeed=data.drivingActionCount[4],
              this.oilData=data.hundredConsumption,
              this.milesData=data.driveRange,
              this.timeData=data.driveTime
              var ctx = document.getElementById("oilChart");
              var ctx1 = document.getElementById("milesChart");
              var ctx2 = document.getElementById("timeChart");
              var oildata = {
                  labels: this.xaxis,
                  datasets: [{
                      label: '百公里油耗图',
                      data:this.oilData ,
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255,99,132,1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                  }]
              }
              var myChart = new Chart(ctx, {
              xLabel: '日期(日)',
              yLabel: '里程(千米)',
              type: this.type,
              data:oildata,
              options: {
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                    }
                }
              });       
              var milesdata = {
                  labels: this.xaxis,
                  datasets: [{
                      label: '行驶里程图',
                      data:this.milesData ,
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255,99,132,1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                  }]
              }
              var myChart1 = new Chart(ctx1, {
              type: this.type,
              data:milesdata,
              options: {
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                    }
                }
              });
              var timedata = {
                  labels: this.xaxis,
                  datasets: [{
                      label: '行驶时间图',
                      data:this.timeData ,
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255,99,132,1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                  }]
              }
              var myChart2 = new Chart(ctx2, {
              type: this.type,
              data:timedata,
              options: {
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                    }
                }
              });
              this.loaded=true
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })      
          }  
      },
      showSnackbar() {
        this.snackbar = true
        if (this.snackTimer) clearTimeout(this.snackTimer)
        this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000)
      },
      hideSnackbar() {
        this.snackbar = false
        if (this.snackTimer) clearTimeout(this.snackTimer)
      },
    }
  }
</script>

<style lang="scss">
  @import "../../scss/common-styles.scss";
  @import "../../scss/variables.scss";
  // .bg{
  //  background-color:#efeff4!important;
  // }
  #drive-achievement{
    .flex-demo {
      text-align: center;
      background-color:#ffffff;
      height:66px;
    }
    .flex-demo-1 {
      text-align: center;
      background-color:#ffffff;
      height:66px;
      margin-left:0px!important
    }
    &.background-light{
      background-color:$backgroudLight;   
    }
    .date-font{
      text-align: center;
      margin-right: 20px
    }
    .date-font-other{
      text-align: center;
      margin-right: 20px;
      display: none
    }
    .mu-date-picker{
      width:100px;
      .mu-text-field{
        font-size: 16px;
        width: 120px;
        height: 20px;
        line-height: 20px;
        text-align: -webkit-auto;
        color: rgba(0, 0, 0, 0.54);
        margin-bottom: 8px;
        min-height: 0px
      }
    }
    .flexbox-bg{
      background-color: #ffffff
    }
    .flex-date {
      text-align: center;
      background-color:#ffffff;
      height:26px;
      line-height: 26px;
      margin:4px 0px 4px 0px!important
    }
    .date{
      height:40px;
      line-height: 40px;
      width:190px;
      margin:0 auto
    }
    .data-border{
      border-left:1px solid #ededed;
      border-right:1px solid #ededed;
    }
    .guiji_img{
      background-image: url(../../assets/icon_distance.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .shic_img{
      background-image: url(../../assets/icon_time.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .money_img{
      background-image: url(../../assets/icon_cost.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .oil_img{
      background-image: url(../../assets/icon_oil.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .speed_img{
      background-image: url(../../assets/icon_avespeed.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .avgOil_img{
      background-image: url(../../assets/icon_aveoil.png);
      background-repeat: no-repeat;
      width: 100%;
      height:22px;
      background-size: 1.2em;
      margin-top: 2px;
      background-position-x:5px 
    }
    .jiansu_img{
        background-image: url(../../assets/icon1_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }
    .jiansu_img_nor{
        background-image: url(../../assets/icon1_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }  
    .jiasu_img{
        background-image: url(../../assets/icon2_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      } 
    .jiasu_img_nor{
        background-image: url(../../assets/icon2_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }   
    .zw_img{
        background-image: url(../../assets/icon3_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      } 
    .zw_img_nor{
        background-image: url(../../assets/icon3_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }  
    .sc_img{
        background-image: url(../../assets/icon4_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      } 
    .sc_img_nor{
        background-image: url(../../assets/icon4_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }  
    .zs_img{
        background-image: url(../../assets/icon5_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }  
    .zs_img_nor{
        background-image: url(../../assets/icon5_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }
    .ds_img{
        background-image: url(../../assets/icon6_grey.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      } 
    .ds_img_nor{
        background-image: url(../../assets/icon6_nor.png);
        background-repeat: no-repeat;
        background-position:center;
        width:100%;
        height:42px;
        background-size:2.5em
      }      
    .guiji_font{
      color:red;
    }
    .mt8 {
      margin-top: 8px;
    }
    .mt10 {
      margin-top: 12px;
    }
    .arrow-left {
      width:20; 
      height:0; 
      border-top:10px solid transparent;
      border-bottom:10px solid transparent; 
      border-right:10px solid #888888; 
      float:left;
      margin:10px 10px 0px 0px
    }
    .arrow-right {
      width:20; 
      height:0; 
      border-top:10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #888888;
      float:right;
      margin-top:-32px
    }
  }
</style>

