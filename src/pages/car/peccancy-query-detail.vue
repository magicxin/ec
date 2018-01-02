<template>
	<section id="peccancy-query-detail">
		<magic-header titleName="查询结果"></magic-header>
			<template v-if="!errorMessage">
			  <section v-if="peccancies && peccancies.length">
				<h3 class="car-id">
					{{carId}}
				</h3> 
				<ul class="summary">
					<li>
						<p>违章（次）</p>
						<p>{{peccanciesCount}}</p>
					</li>
					<li>
						<p>扣分（分）</p>
						<p>{{peccanciesScoreAndMoney.scores}}</p>
					</li>
					<li>
						<p>罚款（元）</p>
						<p>{{peccanciesScoreAndMoney.money}}</p>
					</li>
				</ul>
				<ul class="detail">
					<li v-for="peccancy in peccancies">
						<p><span>违章时间：</span>{{peccancy.date}}</p>
						<p><span>违章地点：</span>{{peccancy.area}}</p>
						<p><span>违章行为：</span>{{peccancy.act}}</p>
						<p><span>违章处理：</span>{{peccancy.fen}}分+{{peccancy.money}}元</p>
					</li>
				</ul>
				<p>信息仅供参考，如有出入，请以交管部门为准。</p>

			</section>
			<section class="query-empty" v-else>
				<img src="../../assets/peccancy-query-empty.png" alt="no peccancies">
				<p v-if="queryTimesLimit">本周已使用询执行违章查询功能，该功能一周只能使用一次。</p>
				<p v-else>恭喜您~没有违章记录，继续加油哦！</p>
			</section>
			</template>


			<!-- <p v-if="usedInAWeek" style="padding:1rem;text-align:center;">本周已使用询执行违章查询功能，现在显示的是您上一次查询结果。</p> -->
		
		 <mu-snackbar class="center" v-if="showError && $route.name=='peccancy-query-detail'" :message="errorMessage" action="返回重填" @actionClick="reFillForm" @close="reFillForm"/>
	</section>
</template>

<script>

	// import MuSnackbar from 'muse-components/snackbar'
	// import ContentWithLoading from 'components/content-with-loading'
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	import peccancyQuery from 'services/peccancy-query'
	import validate from 'utilities/validate-car-info'
	export default {
		components:{
			magicHeader
		},
		data(){
			return {
				loaded:false,
				carId:'',
				peccancies:[],
				errorMessage:'',
				showError:false,
				queryTimesLimit:false,
				usedInAWeek:false
			}
		},
		computed:{
			peccanciesCount(){
				return this.peccancies.length
			},
			peccanciesScoreAndMoney(){
				var scores=0,money=0
				this.peccancies.map((peccancy)=>{
					scores+=this.$.toInteger(peccancy.fen)
					money+=this.$.toInteger(peccancy.money)
				})
				return {
					scores:scores,
					money:money
				}
			}
		},
		watch:{
			'$route':function(to,from){
				console.log(to)
				console.log(from)
				if(from.name==='peccancy-query'){
					this.loaded=false
					this.errorMessage=''
					this.showError=false
					this.queryTimesLimit=false
					this.getData()					
				}
			}
		},
		created(){
			this.getData()
		},
		methods:{
			reFillForm(){
				this.$router.push({name:'peccancy-query'})
				this.showError=false
			},
			getData(){
				var carId=this.$route.query.carId,
					carCode=this.$route.query.carCode,
					carEngine=this.$route.query.carEngine,
					province=this.$route.query.province,
					city=this.$route.query.city,
					carCodeNeededLength=this.$.toInteger(this.$route.query.carCodeNeededLength),
					carEngineNeededLength=this.$.toInteger(this.$route.query.carEngineNeededLength)
				if(!validate.carIdInvalidMessage(carId) && 
					!validate.carCodeInvalidMessage(carCode,carCodeNeededLength) &&
					!validate.carEngineInvalidMessage(carEngine,carEngineNeededLength) &&
					!validate.addressInvalidMessage(province,city)){
					peccancyQuery.bind(this)({
						carId,
						carCode,
						carEngine,
						province,
						city
					},(peccancies,usedInAWeek)=>{

						console.log(this.peccancies)
						this.usedInAWeek=usedInAWeek
						this.peccancies=peccancies
						this.carId=carId
						this.loaded=true
					},(errorMessage,errorCode)=>{
						if(errorCode==307){
							this.queryTimesLimit=true
							this.loaded=true
						}else{
							this.errorMessage=errorMessage
							this.showError=true	
							this.loaded=true						
						}
					})	
				}else{
					this.errorMessage='参数错误'
					this.showError=true
					this.loaded=true
				}
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#peccancy-query-detail{

		.content-with-loading{
			padding:$spaceSmall;
		}
		h3{
			text-align:center;
			&.car-id{
				text-transform:uppercase;
			}
		}
		.summary{
			border:solid 1px $colorSecondary;
			display:flex;
			justify-content:space-between;
			padding:$spaceSmall;
			border-radius:$borderRadiusMedium;
			li{
				flex:1;
				text-align:center;
				&:nth-of-type(2){
					border:solid 1px $colorLighten;
					border-top:none;
					border-bottom:none;
				}
				p:last-child{
					color:$colorSecondary;
				}
			}
		}
		.detail{
			line-height:$lineHeightMedium;
			li{
				padding:$spaceSmall 0;
				border-bottom:solid 1px $colorLighten;
				&:last-child{
					// border:none;
				}
			}
			p{
				margin:0.5rem 0;
				color:$colorDark;
				span{
					font-weight:bold;
				}
				&:last-child{
					color:$colorSecondary;
					span{
						color:$colorDark;
					}
				}
			}

		}
		.detail	+ p{
				text-align:center;
				font-size:$fontSmall;
				color:$colorSecondary;
				margin-top:$spaceMedium;
			}
		.query-empty{
			img{
				width:55%;
				display:block;
				margin:$spaceBig auto 0;
				position:relative;
				left:-1rem;
			}
			p{
				text-align:center;
				margin-top:-$spaceSmall;
			}
		}

	}

</style>