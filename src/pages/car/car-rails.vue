<template>
	<section id="car-rails">
		<!-- <appbar :link="{name:'car-map'}"/> -->
		<magic-header titleName="围栏设置"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
			<mu-raised-button secondary fullWidth>
				<router-link :to="{name:'car-rails-edit',query:{longitude:$route.query.longitude,latitude:$route.query.latitude}}">
					添加围栏
				</router-link>
			</mu-raised-button>


		<mu-list v-if="!!rails.length">
			<template v-for="rail in rails">
			<mu-divider/>
			<mu-list-item>
				<router-link :to="{name:'car-rails-edit',query:{id:rail.id,longitude:$route.query.longitude,latitude:$route.query.latitude}}">
					{{rail.name}}
				</router-link>
			</mu-list-item>
			</template>
			<mu-divider/>
		</mu-list>

		<!-- </content-with-loading> -->
	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	// import MuRaisedButton from 'muse-components/raisedButton'
	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
	// import MuDivider from 'muse-components/divider'
	import carRailsData from 'services/car-rails-data'
	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuRaisedButton,
			// MuList,
			// MuListItem,
			// MuDivider
		},
		data(){
			return {
				loaded:false,
				rails:[]
			}
		},
		watch:{
			'$route':function(to,from){
				if(to.name=='car-rails'){
					this.getData()
				}
			}
		},
		created(){
			this.getData()
		},
		methods:{
			getData(){
				carRailsData.getList.bind(this)({},(railsData)=>{
					this.rails=railsData
					this.loaded=true
				},(err)=>{

				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#car-rails{
		.mu-raised-button{
			margin:$spaceSmall auto $spaceMedium*0.7;
		}
		.mu-raised-button a{
			color:#fff;
			display:block;
			width:100%;
			position:relative;
			z-index:1;
		}
		.mu-item{
			padding-top:0;
			padding-bottom:0;
			height:48px;
			.mu-item-content{
				height:100%;
				a{
					display:block;
					position:relative;
					z-index:1;
					height:100%;
					line-height:48px;
				}
			}
		}
	}
</style>
