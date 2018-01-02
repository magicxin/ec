<template>
	<section id="terminal-data-flow-show">
		<!-- <appbar :link="{name:'terminal-data-flow-select'}"/> -->
		<magic-header titleName="数据流监测"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
			<section class="data-items-wrapper">
			 	<mu-flat-button :class="[selectedItemId==item.id ? 'selected' : '']" v-for="item in items" :key="item" @click="drawChart(item)">
					<span class="value">{{item.value && item.value.length ? (item.type=='value' ? item.value[item.value.length-1].y : (item.values ? item.values[item.value[item.value.length-1].y] || '--' : item.value[item.value.length-1].y || '--')) : '--'}}</span>
					<span class="unit">{{item.unit}}</span>
					<span>{{item.text}}</span>
				</mu-flat-button>
			</section>
			<section ref="chartContainer" class="data-chart">
				<p v-show="!selectedItemId">点击上方检测项，可查看数据趋势图。</p>
				<canvas ref="chart" id="data-flow-chart"></canvas>
			</section>
			<mu-raised-button label="上传数据流" @click="uploadDataFlow" primary fullWidth/>											
		<!-- </content-with-loading> -->
	<mu-snackbar class="center" v-if="!!message" :message="message" action="我知道了" @actionClick="message=''" @close="message=''"/>
	<loading-spin v-if="posting">
		{{postingMessage}}
	</loading-spin>
	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	// import MuFlatButton from 'muse-components/flatButton'
	// import MuRaisedButton from 'muse-components/raisedButton'
	// import MuSnackbar from 'muse-components/snackbar'
	import LoadingSpin from 'components/loading-spin'
	import dataFlowData from 'services/terminal-data-flow-data'
	import dataFlowDataUpload from 'services/terminal-data-flow-upload'
	import dataFlowDataCancel from 'services/terminal-data-flow-cancel'
	import Chart from 'chart.js'

	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuFlatButton,
			// MuRaisedButton,
			// MuSnackbar,
			LoadingSpin
		},
		data(){
			return {
				// loaded:false,
				loaded:false,
				posting:false,
				items:[],
				selectedItemId:'',
				message:''
			}
		},
		created(){
			this.initData()
		},
		watch:{
			'$route':function(to,from){
				if(to.name=='terminal-data-flow-show'){
					this.loaded=false
					this.initData()
				}
			}
		},
		beforeRouteLeave(to,from,next){
			dataFlowDataCancel()
  			next()
  		},
		methods:{
			initData(){


				let items=this.$route.query.items
				dataFlowData({items:items},(dataFlowItems)=>{

					this.items=dataFlowItems
					this.loaded=true

					if(this.selectedItemId){
						var selectedItem=null
						dataFlowItems.some((dataFlowItem)=>{
							if(dataFlowItem.id==this.selectedItemId){
								selectedItem=dataFlowItem
								return true
							}
						})
						this.drawChart(selectedItem)
					}

				},(err)=>{
					this.message=err
				})
			},
			colorMaker(value){
				this.colors=this.colors || {}
				this.colors[value]=this.colors[value] || 'rgb(255,141,'+Math.ceil(Math.random()*255)+')'
				return this.colors[value]
			},
			drawChart(item){
				this.selectedItemId=item.id
				this.$refs.chart.width=this.$refs.chartContainer.clientWidth-10
				this.$refs.chart.height=this.$refs.chartContainer.clientHeight-20
				let ctx=this.$refs.chart

				if(item.type=='value'){
					console.log('draw line')
					var chart = new Chart(ctx, {
					    type: 'line',
					    data: {
					        datasets: [{
					            label: item.text,
								lineTension: 0.1,
					            backgroundColor: "rgba(255,141,0,0.4)",
					            borderColor: "rgba(255,141,0,1)",
					            borderCapStyle: 'butt',
					            borderDash: [],
					            // steppedLine:true,
					            // showLine:false,
					            borderDashOffset: 0.0,
					            borderJoinStyle: 'miter',
					            pointBorderColor: "rgba(255,141,0,1)",
					            pointBackgroundColor: "#fff",
					            borderWidth:1,
					            // pointBorderWidth: 1,
					            // pointHoverRadius: 5,
					            pointHoverBackgroundColor: "rgba(255,141,0,1)",
					            pointHoverBorderColor: "rgba(220,220,220,1)",
					            pointHoverBorderWidth: 1,
					            pointRadius: 1,
					            pointStyle:'rect',
					            // pointHitRadius: 10,
					            data: item.value
					        }]
					    },
					    options: { 
					    	animation:false,
					        scales: {
					            xAxes: [{
					                type: 'linear',
					                position: 'bottom',
					                scaleLabel:{
						             	display: true,
								        labelString: '点数'
					                }
					            }],
					            yAxes: [{
							      scaleLabel: {
							        display: true,
							        labelString: item.unit,
							        fontSize:14
							      }
							    }]
					        }
					    }
					})
				}else if(item.type=='status'){
					console.log('status chart')
					var chart = new Chart(ctx, {
					    type: 'line',
					    data: {
					        datasets: [{
					            label: item.text,
								// lineTension: 0.1,
					            backgroundColor: "rgba(255,141,0,0.4)",
					            borderCapStyle: 'butt',
					            borderDash: [],
					            // steppedLine:true,
					            showLine:false,
					            borderDashOffset: 0.0,
					            borderJoinStyle: 'miter',
					            pointBorderColor: "rgba(255,141,0,1)",
					            pointBackgroundColor:"rgba(255,141,0,1)",
					            borderWidth:1,
					            pointRadius: 2,
					            pointStyle:'rect',
					            data: item.value
					        }]
					    },
					    options: {
					    	animation:false,
					        scales: {
					            xAxes: [{
					                type: 'linear',
					                position: 'bottom',
					             	scaleLabel:{
						             	display: true,
								        labelString: '点数'
					                }
					            }],
					            yAxes:[{
					            	ticks:{
					            		callback: function (tick, index, ticks) {
					            			if(item.values){
					            				return item.values[tick]					            				
					            			}else{
					            				return tick
					            			}
									        // Return string here.
									        // Return empty string to have no label with a grid line
									        // Return null or undefined to hide the gridline
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
			uploadDataFlow(){
				dataFlowDataCancel()
				this.posting=true
				this.postingMessage='正在上传，请稍后 ...'
				dataFlowDataUpload({items:this.items},()=>{
					this.message='上传成功'
					this.posting=false
					this.postingMessage=''
				},(err)=>{
					this.message=err
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#terminal-data-flow-show{
		overflow:hidden!important;
		.content-with-loading{
			// height:100%;
			// margin-top:0;
			// padding-top:45px;
			// overflow:hidden;
			.content-wrapper{
				// height:100%;
				// overflow:hidden;
			}
			.mu-flat-button{
				height:auto;
				&.selected{
					background:$colorSecondary;
					span{
						color:#fff!important;
					}
				}
			}

			.data-items-wrapper {
				font-size:0;
				> *{
					font-size:1rem;
					display:inline-block;
					width:33.333%;
					padding:0.5rem;
					text-align:center;
					vertical-align:top;
					border-right:solid 1px rgba(0,0,0,0.1);
					border-bottom:solid 1px rgba(0,0,0,0.1);
					&:nth-child(3n){
						border-right:none;
					}

					.mu-flat-button-wrapper{
						display:block;
					}
					span{
						display:block;
						width:100%;
						line-height:1.5;
						overflow:hidden;
						white-space: nowrap;
						text-overflow:ellipsis;
						min-height:18px;
						&.value{
							font-size:1.6rem;
							color:$colorSecondary;
							font-weight:bold;
							// padding-bottom:0.5rem;
						}
						&.unit{
							color:$colorSecondary;
							font-weight:bold;
						}
					}
				}	
			}
			.mu-raised-button{
				margin-top:3rem;
			}
			.data-chart{
				height:20rem;
				padding:1rem;
				padding-left:0;
				overflow:hidden;
				margin:2rem auto;
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
				#data-flow-chart{
					// display:block;
					// width:100%;
					// height:100%;
					margin:0;
				}
			}

		}
	}
</style>