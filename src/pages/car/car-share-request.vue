<template>
	<section id="car-share-request">
		<!-- <appbar :link="{name:'car-map'}"/> -->
		<magic-header titleName="共享申请"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
		  <template v-for="car in cars" v-if="!!cars.length">
            <mu-list-item class="car-title" :title="car.brandCode">
              <mu-avatar :style="'background:url('+car.logo+') center no-repeat,url('+defaultHead+') center no-repeat;'" slot="leftAvatar"/>

		      <mu-list-item class="not-agreed" v-for="(request,index) in car.requests.notAgreed" :key="index" slot="nested" @click="agreeAdd(car,request)">
              	<mu-avatar :style="'background:url('+request.userHead+') center no-repeat,url('+defaultHead+') center no-repeat;'" slot="leftAvatar"/>
              	<p class="item-content">{{request.userName}}请求添加您的车辆</br><span>{{request.requestDate}}</span></p>
              	<mu-raised-button label="添加" secondary/>
		      </mu-list-item>

		      <mu-list-item class="agreed" v-for="(request,index) in car.requests.agreed" :key="index" slot="nested" @click="disagreeAdd(car,request)">
              	<mu-avatar :style="'background:url('+request.userHead+') center no-repeat,url('+defaultHead+') center no-repeat;'" slot="leftAvatar"/>
              	<p class="item-content">您已同意{{request.userName}}添加您的车辆</br><span>{{request.requestDate}}</span></p>
              	<mu-raised-button label="取消" primary/>
		      </mu-list-item>

            </mu-list-item>
            <mu-divider/>            
          </template>

          <section class="empty-note" v-if="!cars.length">
				<img src="../../assets/peccancy-query-empty.png" alt="no peccancies">
				<p>还没有好友申请添加您的车辆。</p>				
		  </section>

		<!-- </content-with-loading> -->
		<mu-snackbar class="center" v-if="!!message" :message="message" action="关闭" @actionClick="message=''" @close="message=''"/>
		<!-- <content-with-loading :loaded="!isPosting"/> -->
	</section>
</template>

<script>
// import Appbar from 'components/appbar'
import magicHeader from 'components/magicHeader'
// import ContentWithLoading from 'components/content-with-loading'
// import MuSnackbar from 'muse-components/snackbar'
// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
// import MuAvatar from 'muse-components/avatar'
// import MuIcon from 'muse-components/icon'
// import MuRaisedButton from 'muse-components/raisedButton'
// import MuFlatButton from 'muse-components/flatButton'
// import MuDivider from 'muse-components/divider'
import requestedCarList from 'services/car-share-request-list'
import requestedCarManage from 'services/car-share-request-manage'
import defaultHead from 'assets/favicon.png'
	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuSnackbar,
			// MuList,
			// MuListItem,
			// MuAvatar,
			// MuIcon,
			// MuDivider,
			// MuFlatButton,
			// MuRaisedButton
		},
		data(){
			return {
				loaded:false,
				cars:[],
				message:'',
				isPosting:false,
				defaultHead:defaultHead
			}
		},
		created(){
			this.getData()
		},
		methods:{
			getData(){
				requestedCarList.bind(this)({},(carsData)=>{
					this.cars=carsData
					this.loaded=true
				},(err)=>{
					this.loaded=true
					this.message=err
				})
			},
			agreeAdd(car,request){
				console.log(car)
				this.isPosting=true
				requestedCarManage.add.bind(this)({id:request.applyId},(data)=>{
					car.requests.agreed.push(request)
					car.requests.notAgreed.splice(car.requests.notAgreed.indexOf(request),1)
					this.isPosting=false
				},(err)=>{
					this.isPosting=false
					this.message=err
				})
			},
			disagreeAdd(car,request){
				console.log(car)
				this.isPosting=true
				requestedCarManage.delete.bind(this)({id:request.applyId},(data)=>{
					car.requests.notAgreed.push(request)
					car.requests.agreed.splice(car.requests.agreed.indexOf(request),1)
					this.isPosting=false
				},(err)=>{
					this.isPosting=false
					this.message=err
				})

			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#car-share-request{
		.mu-avatar{
	      background:url(../../assets/favicon.png) center no-repeat;
	      background-size:cover!important;
	    }
	    .item-content{
			display: inline-block;
		    vertical-align: middle;
		    width: 100%;
		    padding-right: 100px;
		    margin-right: -92px;
	    }
	    .car-title > .mu-item-wrapper{
	    	background-color:$backgroudLight;
	    }
	    .empty-note{
	    	padding:$spaceMedium;
	    	text-align:center;
	    	img{
	    		display:block;
	    		margin:0 auto;
	    		width:60%;
	    		position:relative;
	    		left:-$spaceSmall;
	    	}
	    }
	}
</style>