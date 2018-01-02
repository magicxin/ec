<template>
  <section id="running-tracks" class="background-light">
    <!-- <appbar  :link="{name:'car-map',query:{id:this.$route.query.id}}"/> -->
		<magic-header titleName="行车轨迹"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->
        <template>
          <div class="date" id="date">
            <div class="arrow-left" @click="beforeDate()"></div>
             <div class="date-font"><mu-date-picker  v-model="formatDate" @change="dateChange"/></div>
            <div class="arrow-right" @click="afterDate()"></div>
          </div>
          <mu-flexbox class="mt8">
		    <mu-flexbox-item class="flex-demo">
		      <li class="left-font">行驶里程</li>
		      <li class="center-font">{{mileage}}</li>
		      <li class="right-font">km</li>
		    </mu-flexbox-item>
		    <mu-flexbox-item class="flex-demo">
		      <li class="left-font">平均油耗</li>
		      <li class="center-font">{{avgOil}}</li>
		      <li class="right-font">L/100km</li>
		    </mu-flexbox-item>
		  </mu-flexbox>
		  <mu-flexbox class="mt1">
		    <mu-flexbox-item class="flex-demo-bottom">
          <li class="time_img"><span>{{totalTime}}</span>h</li>
		      <li class="oil_img"><span>{{totalOil}}</span>L</li>
		      <li class="speed_img"><span>{{avgSpeed}}</span>km/h</li>
		      <li class="money_img"><span>{{oilCost}}</span></li>
		    </mu-flexbox-item>
		  </mu-flexbox>
		  <div class="description">
		  	所有花费均为估算值，仅供参考
		  </div>
		  <template v-for="carTrack in carTracks">
        <router-link  :to="{name:'running-tracks-detail',query:{trackId:carTrack.id,carId:this.carId}}">
  			  <div class="icon_div">
  			  <div class="icon_star"></div>
  				  <div class="icon_content">
  					<li>{{carTrack.beginTime}}{{carTrack.beginAddress}}</li>
  					<li class="count">驾驶得分：<span class="icon_font">{{carTrack.score}}</span>分<span class="nbsp"></span>百公里油耗：<span class="icon_font">{{carTrack.avgOil}}</span>L</li>
  					<div class="index">
  						<li class="distance_img"><span>{{carTrack.mileage}}km</span></li><li class="oil_img_black"><span>{{carTrack.totalOil}}L</span></li><li class="money_img_black"><span>{{carTrack.oilCost}}元</span></li>
  					  	<li class="time_img_black"><span>{{carTrack.totalTime}}h</span></li><li class="speed_img_black"><span>{{carTrack.avgSpeed}}km/h</span></li>
  				  	</div>
  				  	<div class="img_div">
  				  		<div v-if="carTrack.drivingActionMap[3]>0">
  							<li class="jiansuNor_img"><div class="number">{{carTrack.drivingActionMap[3]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="jiansu_img"></li>
  					  	</div>
  					  	<div v-if="carTrack.drivingActionMap[2]>0">
  							<li class="jiasuNor_img"><div class="number">{{carTrack.drivingActionMap[2]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="jiasu_img"></li>
  					  	</div>
  						<div v-if="carTrack.drivingActionMap[7]>0">
  							<li class="zwNor_img"><div class="number">{{carTrack.drivingActionMap[7]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="zw_img"></li>
  					  	</div>
  					  	<div v-if="carTrack.drivingActionMap[5]>0">
  							<li class="scNor_img"><div class="number">{{carTrack.drivingActionMap[5]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="sc_img"></li>
  					  	</div>
  						<div v-if="carTrack.drivingActionMap[9]>0">
  							<li class="zsNor_img"><div class="number">{{carTrack.drivingActionMap[9]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="zs_img"></li>
  					  	</div>
  					  	<div v-if="carTrack.drivingActionMap[4]>0">
  							<li class="dsNor_img"><div class="number">{{carTrack.drivingActionMap[4]}}</div></li>
  					  	</div>
  					  	<div v-else>
  							<li class="ds_img"></li>
  					  	</div>
  				  	</div>
  				  	<li class="end_address">{{carTrack.endTime}}{{carTrack.endAddress}}</li>
  				  </div>
  				  <div class="icon_end"></div>
  			  </div>
  			  <div class="icon_border"></div>
        </router-link>
		  </template>
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
  // import MuDatePicker from 'muse-components/datePicker'
  import runningTracks from 'services/running-tracks.js'
  // import dateFilters from 'filters/dateFilters.js'
  import Chart from 'chart.js'
  export default {
    components: {
			magicHeader,
      // Appbar,
      // ContentWithLoading,
      // MuFlexbox,
      // MuFlexboxItem,
      // MuSnackbar,
      // MuDatePicker,
    },
    data() {
      return {
        loaded:false,
        snackbar: false,
        nowDate:'',
        formatDate:'',
        mileage:'',
        avgOil:'',
        totalTime:'',
        totalOil:'',
        oilCost:'',
        avgSpeed:'',
        year:'',
        month:'',
        week:'',
        day:'',
        carTracks:[],
        carTrack:'',
        trackId:'',
        carId:''
      }
    },
    created(){
      var date=new Date();
      var year=date.getFullYear();
      var month=date.getMonth()+1;
      var day=date.getDate();
      this.nowDate=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
      this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
      this.year=year;
      this.month=month;
      this.day=day;
      this.carId=this.$route.query.id;
      runningTracks.bind(this)({
        	carId:this.$route.query.id,
        	beginTime:this.formatDate+' '+'00:00:00',
        	endTime:this.formatDate+' '+'23:59:59',
        	timeType:'4'
        },(data)=>{
        	this.mileage=data.mileage,
        	this.avgOil=data.avgOil,
        	this.avgSpeed=data.avgSpeed,
        	this.totalOil=data.totalOil,
        	this.totalTime=data.totalTime,
        	this.oilCost=data.oilCost,
        	this.carTracks =data.carTracks,
        	this.loaded=true
        },(errorMessage)=>{
        	this.errorMessage=errorMessage
        	this.showError=true
        });
    },
    methods:{
      dateChange(value){
        runningTracks.bind(this)({
          carId:this.$route.query.id,
          beginTime:value+' '+'00:00:00',
          endTime:value+' '+'23:59:59',
          timeType:'4'
        },(data)=>{
          this.mileage=data.mileage,
          this.avgOil=data.avgOil,
          this.avgSpeed=data.avgSpeed,
          this.totalOil=data.totalOil,
          this.totalTime=data.totalTime,
          this.oilCost=data.oilCost,
          this.carTracks =data.carTracks,
          this.loaded=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        });
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
    beforeDate(){
        var year=this.year;
        var month=this.month;
        var day=this.day;
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
          this.nowDate=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
          this.day=day;
          this.year=year;
          this.month=month;
          this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
          runningTracks.bind(this)({
        	carId:this.$route.query.id,
        	beginTime:this.formatDate+' '+'00:00:00',
        	endTime:this.formatDate+' '+'23:59:59',
        	timeType:'4'
	        },(data)=>{
	        	this.mileage=data.mileage,
	        	this.avgOil=data.avgOil,
	        	this.avgSpeed=data.avgSpeed,
	        	this.totalOil=data.totalOil,
	        	this.totalTime=data.totalTime,
	        	this.oilCost=data.oilCost,
	        	this.carTracks =data.carTracks,
	        	this.loaded=true
	        },(errorMessage)=>{
	        	this.errorMessage=errorMessage
	        	this.showError=true
	        });
      },
      afterDate(){
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
          this.nowDate=year+'年'+(month>9?month:'0'+month)+'月'+(day>9?day:'0'+day)+'日';
          this.day=day;
          this.year=year;
          this.month=month;
          this.formatDate=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);
          runningTracks.bind(this)({
        	carId:this.$route.query.id,
        	beginTime:this.formatDate+' '+'00:00:00',
        	endTime:this.formatDate+' '+'23:59:59',
        	timeType:'4'
	        },(data)=>{
	        	this.mileage=data.mileage,
	        	this.avgOil=data.avgOil,
	        	this.avgSpeed=data.avgSpeed,
	        	this.totalOil=data.totalOil,
	        	this.totalTime=data.totalTime,
	        	this.oilCost=data.oilCost,
	        	this.carTracks =data.carTracks,
	        	this.loaded=true
	        },(errorMessage)=>{
	        	this.errorMessage=errorMessage
	        	this.showError=true
	      	});
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
  #running-tracks{
  	.flex-demo {
	  height: 96px;
	  background-color: $colorSecondary;
	  text-align: center;
	  color:#fff
	}
	.mu-flexbox .mu-flexbox-item:last-child{
		margin-left:1px!important
	}
	.flex-demo-bottom{
	  height: 22px;
	  background-color: $colorSecondary;
	  text-align: center;
	  color:#fff
	}
	.left-font{
		padding:10px 0px 0px 10px;
		text-align:left
	}
	.center-font{
		text-align:center;
		font-size:2em
	}
	.right-font{
		padding:0px 10px 10px 0px;
		text-align:right
	}
    .date-font{
      	text-align: center;
      	margin-right: 20px
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
    .index{
    	li{
    		background-repeat: no-repeat;
      		background-position:left;
      		height:22px;
          line-height: 22px;
      		background-size:1.7em;
      		width:33%;
      		float:left;
      		text-align:center
    	}
    	.distance_img{
    		background-image: url(../../assets/icon_distance.png);
    	}
      .money_img_black{
        background-image: url(../../assets/icon_cost.png);
      }
    	.oil_img_black{
      		background-image: url(../../assets/icon_oil.png);
    	}
    	.time_img_black{
      		background-image: url(../../assets/icon_time.png);
    	}
    	.speed_img_black{
      		background-image: url(../../assets/icon_avespeed.png);
    	}
    }
    .description{
    	height:30px;
    	line-height:30px;
    	background:#ebebeb;
    	font-size:0.1em;
    	color:#888888;
    	padding-right:10px;
    	text-align:right
    }
    .guiji_font{
      	color:$colorSecondary
    }
    .mt1 {
      	margin-top: 1px;
      	li{
	      	background-repeat: no-repeat;
	      	background-position:left;
	      	height:22px;
	      	float:left;
	      	background-size:1.2em;
      	}
      .money_img{
      		background-image: url(../../assets/icon_cost_w.png);
      		width:20%;
    	}
    	.speed_img{
      		background-image: url(../../assets/icon_speed1.png);
      		width:32%;
    	}
    	.time_img{
      		background-image: url(../../assets/icon_time1.png);
      		width:24%;
    	}
    	.oil_img{
      		background-image: url(../../assets/icon_oil1.png);
      		width:24%;
    	}
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
    .icon_div{
    	position:relative;
    	border-left:1px solid #ebebeb;
    	width:95%;
    	height:165px;
    	top:10px;
    	left:10px
    }
    .icon_star{
    	width: 10px;
	    height: 10px;
	    font-family: 'ecoico';
	    speak: none;
	    font-style: normal;
	    font-weight: normal;
	    font-variant: normal;
	    text-transform: none;
	    font-size: 1.4em;
	    line-height: 40px;
	    -webkit-font-smoothing: antialiased;
	    color: #fff;
	    background: #5fa900;
	    border-radius: 50%;
	    box-shadow: 0 0 0 3px #ebebeb;
	    text-align: center;
	    position:absolute;
	    top:0;
	    left:-5px
    }
    .icon_end{
    	width: 10px;
	    height: 10px;
	    font-family: 'ecoico';
	    speak: none;
	    font-style: normal;
	    font-weight: normal;
	    font-variant: normal;
	    text-transform: none;
	    font-size: 1.4em;
	    line-height: 40px;
	    -webkit-font-smoothing: antialiased;
	    color: #fff;
	    background: #dea700;
	    border-radius: 50%;
	    box-shadow: 0 0 0 3px #ebebeb;
	    text-align: center;
	    position:absolute;
	    bottom:0;
	    left:-5px
    }
    .icon_border{
    	border-bottom:1px solid #ebebeb;
    	width:90%;
    	margin:0 auto;
    	padding:10px
    }
    .icon_content{
    	position:absolute;
    	left:10px;
    	top:-5px;
    	font-size:0.8em;
    	width:100%
    }
    .icon_font{
    	color:red;
    	padding:0 10px;
    	font-size:16px
    }
    .nbsp{
    	padding: 0 10px
    }
    .img_div{
    	float:left;
    	width:100%;
    	padding:10px 0px;
    	li{
	    	background-repeat: no-repeat;
	        background-position:left;
	        width:15%;
	        height:42px;
	        background-size:3em;
	        float:left;
	        position: relative;
    	}
    	.ds_img{
	        background-image: url(../../assets/icon6_grey.png);
	    }
	    .zs_img{
        	background-image: url(../../assets/icon5_grey.png);
      	}
      	.sc_img{
        	background-image: url(../../assets/icon4_grey.png);
      	}
      	.zw_img{
        	background-image: url(../../assets/icon3_grey.png);
      	}
      	.jiasu_img{
        	background-image: url(../../assets/icon2_grey.png);
      	}
      	.jiansu_img{
        	background-image: url(../../assets/icon1_grey.png);
      	}
      	.dsNor_img{
	        background-image: url(../../assets/icon6_nor.png);
	    }
	    .zsNor_img{
        	background-image: url(../../assets/icon5_nor.png);
      	}
      	.scNor_img{
        	background-image: url(../../assets/icon4_nor.png);
      	}
      	.zwNor_img{
        	background-image: url(../../assets/icon3_nor.png);
      	}
      	.jiasuNor_img{
        	background-image: url(../../assets/icon2_nor.png);
      	}
      	.jiansuNor_img{
        	background-image: url(../../assets/icon1_nor.png);
      	}
    }
    .count{
    	padding:5px 0px
    }
    .end_address{
    	float:left
    }
    .number{
    	height: 15px;
	    width: 15px;
	    background: red;
	    border-radius: 50%;
	    color: #fff;
	    text-align: center;
	    position: absolute;
	    left: 30px;
	    top: -5px;
    }
  }
</style>

