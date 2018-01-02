<template>
	<section id="path-navigation">

		<!-- <appbar :link="{name:'car-map'}"/> -->
		<magic-header titleName="出行导航"></magic-header>
		<search-bar placeholder="请输入地名" :value="searchText" :errorMessage="searchInputErrorMessage" @focus="searchInputErrorMessage=''" @search-active="searchActive"/>
		<section id="path-navigation-map-container"></section>
		<mu-list v-if="!!searchResults.length">
			<mu-sub-header>搜索结果</mu-sub-header>
			<template v-for="result in searchResults">
			<mu-divider/>
			<mu-list-item :title="result.title" @click="activeNavigation(result)">
				<span>{{result.address}}</span>
			</mu-list-item>
			</template>	
			<mu-divider/>
		</mu-list>

		<mu-list v-if="!!localSavedNavigation.length">
			<mu-sub-header>导航记录</mu-sub-header>
			<template v-for="location in localSavedNavigation">
				<mu-divider/>
				<mu-list-item :title="location.title" @click="activeNavigation(location)">
					<span>{{location.address}}</span>
				</mu-list-item>
			</template>
			<mu-divider/>
		</mu-list>
		
 		<p class="empty-saved-navigation" v-else>暂无导航记录</p>
		<loading-spin v-show="isSearching">
			正在搜索...
		</loading-spin>
		<mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>

	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	import SearchBar from 'components/search-bar'
	// import MuSubHeader from 'muse-components/subHeader'
	// import MuDivider from 'muse-components/divider'
	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
	// import MuSnackbar from 'muse-components/snackbar'
	import LoadingSpin from 'components/loading-spin'
	import navigationData from 'services/navigation-data'
	// import isEmpty from 'utilities/is-empty'
	import openLocation from 'utilities/open-location'
	export default {
		components:{
			magicHeader,
			// Appbar,
			SearchBar,
			// MuSubHeader,
			// MuList,
			// MuListItem,
			// MuDivider,
			LoadingSpin,
			// MuSnackbar
		},
		data(){
			return {
				localSavedNavigation:[],
				searchResults:[],
				searchText:'',
				searchInputErrorMessage:'',
				longitude:116.404,
				latitude:39.915,
				isSearching:false,
				showError:false,
				errorMessage:''
			}
		},
		created(){
			this.fillPointFromRouteQuery()
			this.localSavedNavigation=navigationData.get() ? navigationData.get() : []
		},
		watch:{
			searchText:function(newVal,oldVal){
				// this.isSearching=true
				// this.getSearchResults((results)=>{
				// 	this.isSearching=false
				// 	this.searchResults=results
				// },(errorMessage)=>{
				// 	this.isSearching=false
				// 	this.errorMessage=errorMessage
				// 	this.showError=true
				// })
			},
			'$route':function(to,from){
				if(to.name=='path-navigation'){
					this.fillPointFromRouteQuery()
				}
			}
		},
		methods:{
			searchActive(value){
				if(!this.$.isEmpty(value)){
					this.searchText=value
					this.isSearching=true
					this.getSearchResults((results)=>{
						this.isSearching=false
						this.searchResults=results
					},(errorMessage)=>{
						this.isSearching=false
						this.errorMessage=errorMessage
						this.showError=true
					})
				}else{
					this.searchInputErrorMessage='请输入地名'
				}
			},
			activeNavigation(location){
				console.log(location)
				navigationData.unshift(location)
				this.localSavedNavigation=navigationData.get()
				openLocation({ 
			      latitude: location.point.lat,
			      longitude: location.point.lng,
			      title: location.title,
			      address: location.address
			      // ,
			      // scale: 14,
			      // infoUrl: 'http://weixin.qq.com'
			    })
			},
			fillPointFromRouteQuery(){
				this.longitude=this.$route.query.longitude || this.longitude
				this.latitude=this.$route.query.latitude || this.latitude
			},
			getSearchResults(success,fail){
				!this.map && (this.map=new BMap.Map("path-navigation-map-container"))        
				this.map.centerAndZoom(new BMap.Point(this.longitude,this.latitude), 11)  
				let options={      
				      onSearchComplete: function(results){  
				          if (local.getStatus() == BMAP_STATUS_SUCCESS){      
				                let points = [],pointsLength=results.getCurrentNumPois(),i=0      
				                for (i = 0; i < pointsLength; i ++){      
				                    points.push(results.getPoi(i))
				                }    
				                success && success(points)
				          }else if(local.getStatus()== BMAP_STATUS_UNKNOWN_LOCATION){
				          	    fail && fail('地点不存在，请输入存在的地名。')
				          }
				      }      
				},
				local=new BMap.LocalSearch(this.map,options)
				local.search(this.searchText)     
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#path-navigation{
		#path-navigation-map-container{
			display:none;
		}

		.mu-list{
			padding:0;
		}
		.mu-list .mu-sub-header:first-child{
			margin-top:0;
		}
		.mu-sub-header{
			color:#fff;
			background-color:$colorSecondary;
		}
		.mu-item span{
			color:rgba(0, 0, 0, 0.54);
		}
		.empty-saved-navigation{
			text-align:center;
			padding:$spaceMedium $spaceSmall;
		}
	}
</style>