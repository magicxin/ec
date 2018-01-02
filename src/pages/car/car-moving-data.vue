<template>
	<section id="car-moving-data">
		<!-- <appbar/> -->

			<section class="date-picker">
				<mu-date-picker @change="initData({startDate:$event})" :value="startTime" :maxDate="endDate || startDate" hintText="请选择开始时间"/>
				<mu-date-picker @change="initData({endDate:$event})" :value="endTime" :minDate="startDate || endDate" hintText="请选择结束时间"/>
				<mu-time-picker @change="initData({startHourMinute:$event})" style="display:none" ref="startTimePicker" v-model="startHourMinute" hintText="24小时制" format="24hr"/>
				<mu-time-picker @change="initData({endHourMinute:$event})" style="display:none" ref="endTimePicker" v-model="endHourMinute" hintText="24小时制" format="24hr"/>
			</section>

			<section class="data-info-wrapper" v-if="timeIsValid">
				<section class="data-info">
				    <p><span>总里程:</span>{{totalMovingRange || '--'}} km</p>
				    <p><span>日里程:</span>{{dayMovingRange || '--'}} km</p>
				    <p><span>总油耗:</span>{{totalFuelCost || '--'}} L</p>
				    <p><span>尿素液位:</span>{{ureaLevel || '--'}} %</p>	
				    <loading-spin v-show="!dataInfoLoaded"/>
 				</section>
				<section class="line">
				  <mu-select-field v-model="lineCategory" label="" :maxHeight="300" @change="initChartData('line',$event)">
				    <mu-menu-item v-for="item in lineCategories" :value="item.value" :key="item" :title="item.label" />
				  </mu-select-field>			  
 				  <section ref="lineChartContainer" class="data-chart-container">
				  	<canvas ref="lineChart"></canvas>
				  </section>
				   <loading-spin v-show="!lineDataLoaded"/>
				</section>

<!-- 				<section class="bar">
				  <mu-select-field v-model="barCategory" label="" :maxHeight="300" @change="initChartData('bar',$event)">
				    <mu-menu-item v-for="item in barCategories" :value="item.value" :title="item.label" />
				  </mu-select-field>
				  <section ref="barChartContainer" class="data-chart-container">
				  	<canvas ref="barChart"></canvas>
				  </section>
				  <loading-spin v-show="!barDataLoaded"/>
				</section>

				<section class="table">
					<p v-for="item in tableItems"><span>{{item.label}}</span><span>{{item.value}}</span></p>
				  	<loading-spin v-show="!tableDataLoaded"/>
				</section> -->

			</section>
			<p class="empty-note" v-else><span>选择时间范围后可查看行车数据~</span></p>
		 	<mu-snackbar class="center" v-if="message" :message="message" action="我知道了" @actionClick="message=''"/>
	</section>
</template>

<script>
// import Appbar from 'components/appbar'
import magicHeader from 'components/magicHeader'
import LoadingSpin from 'components/loading-spin'
// import ContentWithLoading from 'components/content-with-loading'
// import MuDatePicker from 'muse-components/datePicker'
// import MuTimePicker from 'muse-components/timePicker'
// import MuTextField from 'muse-components/textField'
// import MuSelectField from 'muse-components/selectField'
// import MuSnackbar from 'muse-components/snackbar'
// import {menu as Menu,menuItem as MuMenuItem} from 'muse-components/menu'
// import MuDropDownMenu from 'muse-components/dropDownMenu'
import carMovingData from 'services/car-moving-data'
	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuDatePicker,
			// MuTimePicker,
			// MuTextField,
			// MuSelectField,
			// MuMenuItem,
			// MuSnackbar,
			// MuDropDownMenu,
			LoadingSpin
		},
		data(){
			var today=new Date(),
				todayStr=today.getFullYear() + '-' + (today.getMonth()+1<10 ? '0'+(today.getMonth()+1) : today.getMonth()) + '-' + (today.getDate()<10 ? '0'+today.getDate() : today.getDate())
			return {
				startDate:todayStr,
				endDate:todayStr,
				startHourMinute:'00:00',
				endHourMinute:'23:59',
				message:'',

				dataInfoLoaded:false,
				totalMovingRange:'',
				dayMovingRange:'',
				totalFuelCost:'',
				ureaLevel:'',

				lineDataLoaded:false,
				defaultlineCategory:carMovingData.staticData.defaultLineCategory,
				lineCategory:'',
				lineUnitX:'',
				lineUnitY:'',
				lineCategories:carMovingData.staticData.lineCategories || [],
				lineData: [],
				lineLabelsX:[],
				lineType:'',

				barDataLoaded:false,
				defaultbarCategory:carMovingData.staticData.defaultBarCategory,
				barCategory:'',
				barUnitX:'',
				barUnitY:'',
				barCategories:carMovingData.staticData.barCategories || [],
				barData: [],
				barLabelsX:[],

				tableDataLoaded:false,
				tableItems:[]


			}
		},
		computed:{
			startTime(){
				if(this.startDate && this.startHourMinute){
					return this.startDate+' '+this.startHourMinute+':00'
				}else{
					return ''
				}
			},
			endTime(){
				if(this.endDate && this.endHourMinute){
					return this.endDate+' '+this.endHourMinute+':59'
				}else{
					return ''
				}
			},
			timeIsValid(){
				if(this.startDate && this.endDate && this.startHourMinute && this.endHourMinute){
					// if(this.startDate==this.endDate){
					// 	 if(parseInt(this.endHourMinute.split(':')[0],10)*60 + parseInt(this.endHourMinute.split(':')[1],10)>=parseInt(this.startHourMinute.split(':')[0],10)*60 + parseInt(this.startHourMinute.split(':')[1],10)){
     //                        return true
					// 	 }else{
					// 	 	return false
					// 	 }
					// }else{
					// 	return true
					// }
					// return true
					if(new Date(this.endTime).getTime()-new Date(this.startTime).getTime()>30*24*60*60*1000){
						return false
					}else{
						return true
					}
				}else{
					return false
				}
			}
		},
		created(){
			this.initData()
		},
		methods:{
			initData(parsedinTime){
				let time=parsedinTime || {}
				this.message=''
				this.startDate=time.startDate || this.startDate
				this.startHourMinute=time.startHourMinute || this.startHourMinute
				this.endDate=time.endDate || this.endDate
				this.endHourMinute=time.endHourMinute || this.endHourMinute
				if('startDate' in time){
					this.startHourMinute=''
					this.$refs.startTimePicker.handleClick()
				}else if('endDate' in time){
					this.endHourMinute=''
					this.$refs.endTimePicker.handleClick()
				}
				console.log(this.startTime,this.endTime)
				if(this.timeIsValid){
					this.message=''
					this.initDataInfo()
					this.initChartData('line')
					// this.initChartData('bar')
					// this.initTableData()	
				}else{
					if(this.startTime && this.endTime){
						this.message='结束时间须大于开始时间且最大间隔为30天'
					}
				}
			},
			initDataInfo(){
				this.dataInfoLoaded=false
				this.totalMovingRange=''
				this.dayMovingRange=''
				this.totalFuelCost=''
				this.ureaLevel=''
				carMovingData.get.bind(this)({type:'info',start:this.startTime,end:this.endTime},(data)=>{
					this.totalMovingRange=data.totalMovingRange
					this.dayMovingRange=data.dayMovingRange
					this.totalFuelCost=data.totalFuelCost
					this.ureaLevel=data.ureaLevel
					this.dataInfoLoaded=true
				},(err)=>{
					this.message=err
				})
			},
			initChartData(chartType,dataCategory){
				this[chartType+'DataLoaded']=false
				this[chartType+'Category']=dataCategory || this['default'+chartType+'Category']
				this[chartType+'UnitX']=''
				this[chartType+'UnitY']=''
				// this[chartType+'Categories']=[]
				this[chartType+'Data']= []
				this[chartType+'LabelsX']=[]
				this[chartType+'Chart'] && this[chartType+'Chart'].destroy()
				carMovingData.get.bind(this)({type:chartType,category:this[chartType+'Category'],start:this.startTime,end:this.endTime},(data)=>{
					this[chartType+'UnitX']=data[chartType+'UnitX']
					this[chartType+'UnitY']=data[chartType+'UnitY']
					// this[chartType+'Categories']=data[chartType+'Categories']
					this[chartType+'Data']=data[chartType+'Data']
					this[chartType+'LabelsX']=data[chartType+'LabelsX']
					this[chartType+'Type']=data[chartType+'Type']
					this[chartType+'DataLoaded']=true
					this['draw'+chartType]()
				},(err)=>{
					this.message=err
				})
			},
			initTableData(){
				this.tableDataLoaded=false
				this.tableItems=[]
				carMovingData.get.bind(this)({type:'table',start:this.startTime,end:this.endTime},(data)=>{
					this.tableItems=data.tableItems
					this.tableDataLoaded=true
				},(err)=>{
					this.message=err
				})
			},
			setCanvas(type){
				this.$refs[type+'Chart'].width=this.$refs[type+'ChartContainer'].clientWidth-10
				this.$refs[type+'Chart'].height=this.$refs[type+'ChartContainer'].clientHeight-20
			},
			drawline(){
				this.setCanvas('line')
				let ctx=this.$refs.lineChart,
					_this=this
				this.lineChart && this.lineChart.destroy()
				if(this.lineType=='value'){
					console.log('draw line')
				this.lineChart = new Chart(ctx, {
					    type: 'line',
					    data: {
					        datasets: [{
								lineTension: 0.1,
					            backgroundColor: "rgba(255,141,0,0.4)",
					            borderColor: "rgba(255,141,0,1)",
					            borderCapStyle: 'butt',
					            borderDash: [],
					            borderDashOffset: 0.0,
					            borderJoinStyle: 'miter',
					            pointBorderColor: "rgba(255,141,0,1)",
					            pointBackgroundColor: "#fff",
					            borderWidth:1,
					            pointHoverBackgroundColor: "rgba(255,141,0,1)",
					            pointHoverBorderColor: "rgba(220,220,220,1)",
					            pointHoverBorderWidth: 1,
					            pointRadius: 1,
					            pointStyle:'rect',
					            data: _this.lineData
					        }]
					    },
					    options: { 
					    	animation:false,
					    	legend:{display:false},
					        scales: {
					            xAxes: [{
					                type: 'linear',
					                position: 'bottom',
					                scaleLabel:{
						             	display: true,
								        labelString: _this.lineUnitX
					                }
					            }],
					            yAxes: [{
							      scaleLabel: {
							        display: true,
							        labelString: _this.lineUnitY
							      }
							    }]
					        }
					    }
					})
				}else if(this.lineType=='state'){
					console.log('state')
					this.lineChart = new Chart(ctx, {
					    type: 'line',
					    data: {
					        datasets: [{
					            backgroundColor: "rgba(255,141,0,0.4)",
					            borderCapStyle: 'butt',
					            borderDash: [],
					            showLine:false,
					            borderDashOffset: 0.0,
					            borderJoinStyle: 'miter',
					            pointBorderColor: "rgba(255,141,0,1)",
					            pointBackgroundColor:"rgba(255,141,0,1)",
					            borderWidth:1,
					            pointRadius: 2,
					            pointStyle:'rect',
					            data: _this.lineData
					        }]
					    },
					    options: {
					    	animation:false,
					    	legend:{display:false},
					        scales: {
					            xAxes: [{
					                type: 'linear',
					                position: 'bottom',
					             	scaleLabel:{
						             	display: true,
								        labelString: _this.lineUnitX
					                }
					            }],
					            yAxes:[{
					            	ticks:{
					            		callback: function (tick, index, ticks) {
					            			if(_this.lineLabelsX){
					            				return _this.lineLabelsX[tick]					            				
					            			}else{
					            				return tick
					            			}
									    }
					            	}
					            }]
					        }
					    }
					})
				}else{
					console.log('not supported chart type')
				}	
			},
			drawbar(){
				this.setCanvas('bar')
				let ctx=this.$refs.barChart,
					_this=this
				this.barChart && this.barChart.destroy()
				this.barChart = new Chart(ctx, {
					    type: 'bar',
					    data: {
					    	labels:_this.barLabelsX,
					        datasets: [{
					        	backgroundColor: "rgba(255,141,0,0.4)",
					            borderColor: "rgba(255,141,0,1)",
					            borderWidth:1,
					            data: _this.barData
					        }]
					    },
					    options: { 
					    	animation:false,
					    	legend:{display:false},
					        scales: {
					            xAxes: [{
					                position: 'bottom',
					                scaleLabel:{
						             	display: true,
								        labelString: _this.barUnitX
					                }
					            }],
					            yAxes: [{
							      scaleLabel: {
							        display: true,
							        labelString: _this.barUnitY
							      }
							    }]
					        }
					    }
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#car-moving-data{
		background:rgb(245,245,245)!important;

		.date-picker,.data-info{
			padding:$spaceSmall;
			.mu-text-field-hint,.mu-text-field-input{
				color:#fff;
			}
			.mu-text-field-line{
				background-color:#fff;
			}
		}
		.date-picker{
			padding:0 $spaceSmall;
			background:lighten($colorSecondary,5%);
		}

		.data-info{
			padding:$spaceSmall;
			position:relative;
			background:#fff;
			border-top:solid 1px rgb(235,235,235);
			border-bottom:solid 1px rgb(235,235,235);
		}
		.mu-date-picker,.mu-text-field{
			width:49%;
			display:inline-block;
			vertical-align:top;
		}
		.mu-date-picker .mu-text-field,.line .mu-text-field,.bar .mu-text-field,.mu-dropDown-menu{
			width:100%;
		}
		.mu-text-field{
			padding:0;
		}
		.data-info{
			margin-top:$spaceSmall;
			font-size:16px;
			p{
				width:49%;
				display:inline-block;
				vertical-align:top;
				line-height:1.5;
				overflow:hidden;
				white-space:nowrap;
				text-overflow:ellipsis;
			}
		}

		.line,.bar,.table{
			margin-top:$spaceSmall;
			padding:$spaceSmall;
			background:#fff;
			border-top:solid 1px rgb(235,235,235);
			border-bottom:solid 1px rgb(235,235,235);
			position:relative;
		}
		.table {
			min-height:5rem;
			p{
				font-size:16px;
				margin:0;
				display:flex;
				border:solid 1px rgb(230,230,230);
				margin:-1px 0;
				span{
					width:100%;
					padding:$spaceSmall*0.5;
				}
				span:first-child{
					width:6em;
					background:$colorSecondary;
					color:#fff
				}
			}
			.loading-spin p{
				border:none;
			}
		}
		.data-chart-container{
				height:20rem;
				padding:1rem;
				padding-left:0;
				overflow:hidden;
				position:relative;
				> p{
					position:absolute;
					left:0;
					right:0;
					top:0;
					bottom:0;
					margin:auto;
					width:100%;
					height:3rem;
					padding:3rem;
					text-align:center;
				}
				canvas{
					// display:block;
					// width:100%;
					// height:100%;
					margin:0;
				}
			}
			.empty-note{
				text-align:center;
				padding:$spaceBig*2.2 $spaceSmall $spaceSmall;
				background-image:url(../../assets/peccancy-query-empty.png);
				background-position:45% 50%;
				background-repeat:no-repeat;
				background-color:#fff;
				background-size:contain;
				position:relative;
					border-top:solid 1px rgb(235,235,235);

				span{
					position:absolute;
					display:block;
					width:100%;
					left:0;
					bottom:-2.5em;
					opacity:0.618;
					padding-bottom:2rem;
					border-bottom:solid 1px rgb(235,235,235);
					background-color:#fff;
				}
			}
	}
</style>