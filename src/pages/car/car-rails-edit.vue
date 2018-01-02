<template>
	<section id="car-rails-edit">
		<!-- <appbar :link="{name:'car-rails'}"/> -->
		<magic-header titleName="设置围栏"></magic-header>
		<!-- <content-with-loading :loaded="loaded"> -->
			<mu-text-field label="围栏名称" hintText="请输入围栏名称" :errorText="railNameError" v-model="railName" @focus="railNameError=''" @blur="railNameIsInvalid" labelFloat fullWidth/>
			<mu-text-field type="number" :max="400" label="车速限制（km/h）" hintText="请输入车速上限" :errorText="carSpeedError" v-model="carSpeed" @focus="carSpeedError=''" @blur="carSpeedIsInvalid" @input="carSpeedInputValidate" labelFloat fullWidth/>
			<false-input label="围栏类型" :focused="railTypeFocused" :value="railType=='area' ? railTypes[railType]+' '+railAreaText : railTypes[railType]" placeholder="请选择围栏类型" :errorText="railTypeError" @focus="railTypeFocused=true"/>
			<false-input label="触发方式" :focused="railRemindTypeFocused" :value="railRemindTypes[railRemindType]" placeholder="请选择触发方式" :errorText="railRemindTypeError" @focus="railRemindTypeFocused=true"/>
			<false-input label="时间设置" :focused="railRemindTimeFocused" :value="railRemindTimeText" placeholder="请选择监控时间" :errorText="railRemindTimeError" @focus="railRemindTimeFocus"/>
			<false-input label="监控车辆" :focused="railCarsFocused" :value="railCarsText" placeholder="请选择监控车辆" :errorText="railCarsError" @focus="railCarsFocused=true"/>
			<section class="rail-status">
				<span>围栏开关</span><mu-switch :label="'围栏已'+(railIsOpen ? '开启' : '关闭')" v-model="railIsOpen"/>
			</section>
			<section class="button-wrapper">
				<mu-raised-button v-if="railId" label="删除围栏" class="delete-data" @click="deleteData" primary/>			
				<mu-raised-button label="保存设置" class="save-data" @click="saveData" secondary/>			
			</section>
			<loading-spin v-show="isPosting"/>
			<mu-popup position="bottom" class="rail-type-select" popupClass="popup-bottom" :open="railTypeFocused && $route.name=='car-rails-edit'" @close="closeRailTypeSelect">
				<mu-appbar title="选择围栏类型">
				    <mu-flat-button slot="right" label="确定" color="white" @click="closeRailTypeSelect"/>
				</mu-appbar> 
				<template v-for="railTypeText,railTypeKey in railTypes">
					<mu-list-item @click="selectRailType(railTypeKey)">
					{{railTypeText}}
					</mu-list-item>
					<mu-divider/>
				</template>
			</mu-popup>
			<mu-popup position="bottom" class="rail-remind-type-select" popupClass="popup-bottom" :open="railRemindTypeFocused && $route.name=='car-rails-edit'" @close="closeRailRemindSelect">
				<mu-appbar title="选择触发方式">
				    <mu-flat-button slot="right" label="确定" color="white" @click="closeRailRemindSelect"/>
				</mu-appbar>
				<template v-for="railRemindTypeText,railRemindTypeKey in railRemindTypes">
					<mu-list-item @click="selectRailRemindType(railRemindTypeKey)">
					{{railRemindTypeText}}
					</mu-list-item>
					<mu-divider/>
				</template>
			</mu-popup>
			<mu-popup position="bottom" class="rail-remind-time-select" popupClass="popup-bottom" :open="railRemindTimeFocused && $route.name=='car-rails-edit'" @close="closeRailTimeSelect">
				<mu-appbar title="选择触发时间">
				    <mu-flat-button slot="right" label="确定" color="white" @click="closeRailTimeSelect"/>
				</mu-appbar>
				<section class="car-rails-edit-slider-wrapper">
					<p>{{railRemindTimeText}}</p>
					<double-slider v-if="railRemindTime.start || railRemindTime.end" :start="railRemindTime.start" :end="railRemindTime.end" :min="railRemindTimeMin" :max="railRemindTimeMax" :minLength="60" @change="railRemindTimeChange"/>					
				</section>
			</mu-popup>
			<mu-popup position="bottom" popupClass="popup-bottom car-rails-edit-rail-car-select" :open="railCarsFocused && $route.name=='car-rails-edit'" @close="closeRailCarsSelect">
				<mu-appbar title="选择监控车辆">
				    <mu-flat-button slot="right" label="确定" color="white" @click="closeRailCarsSelect"/>
				</mu-appbar>
       			 <mu-text-field style="margin-bottom:0;" class="filt-cars" hintText="输入车牌号搜索车辆" :value="filterKeyword" @change="setFilterKeyword" fullWidth/>
				<template v-for="car in filteredCars">
					<mu-list-item @click="selectRailCar(car)">
					<img :src="car.logo"/>
					{{car.brandId}}
					<mu-checkbox label="" :value="car.selected" slot="right"/>
					</mu-list-item>
					<mu-divider/>
				</template>
			</mu-popup>
			<section class="car-rails-type-setting" v-show="openCarRailsMap && $route.name=='car-rails-edit'">
				<mu-appbar title="设置围栏范围">
				    <mu-flat-button slot="right" label="确定" color="white" @click="setCarRails"/>
				</mu-appbar>
				<section id="car-rails-edit-map" :class="[railType=='square' ? 'square' : 'circle']">
				</section>					
			</section>	
      	<cascaded-menu :lists="cascadedMenu" :listTitles="menuTitles" @menu-active="menuActive" @menu-close="menuClose"/>
		<!-- </content-with-loading> -->
		 <mu-snackbar class="center" v-if="showMessage" :message="message" action="关闭" @actionClick="showMessage=false"/>

	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	
	import LoadingSpin from 'components/loading-spin'
	//下面这个并未使用
	// import DoubleSlider from 'components/double-slider'
	import FalseInput from 'components/false-input'
	import CascadedMenu from 'components/cascaded-menu-h5'
	// import MuTextField from 'muse-components/textField'
	// import MuPopup from 'muse-components/popup'
	// import MuAppbar from 'muse-components/appbar'
	// import MuFlatButton from 'muse-components/flatButton'
	// import MuRaisedButton from 'muse-components/raisedButton'
	// import MuDivider from 'muse-components/divider'
	// import MuCheckbox from 'muse-components/checkbox'
	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
	// import MuSnackbar from 'muse-components/snackbar'
	// import MuSwitch from 'muse-components/switch'
	import railData from 'services/car-rails-data'
	import toInteger from 'utilities/to-integer'
	import isPositiveInteger from 'utilities/is-positive-integer' 
	import areaInfo from 'services/area-info'
	// import isInteger from 'utilities/is-integer'

	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// DoubleSlider,
			LoadingSpin,
			// MuTextField,
			FalseInput,
			// MuPopup,
			// MuAppbar,
			// MuFlatButton,
			// MuSwitch,
			// MuList,
			// MuListItem,
			// MuDivider,
			// MuSnackbar,
			// MuCheckbox,
			// MuRaisedButton,
			CascadedMenu
		},
		data(){
			return {
				railId:'',
				loaded:false,
				railName:'',
				railNameError:'',
				carSpeed:'',
				carSpeedError:'',
				railType:'',
				railTypeError:'',
				railData:{},
				railTypeFocused:false,
				railRemindType:'',
				railRemindTypeError:'',
				railRemindTypeFocused:false,
				railRemindTime:{},
				railRemindTimeError:'',
				railRemindTimeFocused:false,
				railCarsFocused:false,
				railCars:[],
				railCarsError:'',
				railIsOpen:true,
				message:'',
				showMessage:false,
				isPosting:false,
				openCarRailsMap:false,
				longitude:'',
				latitude:'',
				baseMapKa:15,

				railRemindTimeMin:0,
				railRemindTimeMax:1439,
				railRemindTimeStep:1,
				railTypes:{
					square:'矩形围栏',
					circle:'圆形围栏',
					area:'行政区围栏'
				},
				railRemindTypes:{
					in:'进围栏提醒',
					out:'出围栏提醒',
					'in-out':'进出围栏提醒'
				},
				filterKeyword:'',

				cascadedMenu:[],
        		menuTitles:['选择省','选择市','选择区'],
        		selectedArea:[],
        		selectedAreaText:''

			}
		},
		computed:{
			railRemindTimeText(){
				if(this.railRemindTime.start || this.railRemindTime.end){
				function calcTime(minutes){
					return {
						hour:Math.floor(minutes/60),
						minute:minutes%60
					}
				}
				function makeDoubleNumber(number){
					return number<10 ? '0'+number : number	
				}
				let start=this.railRemindTime.start,
					end=this.railRemindTime.end,
					startTime=calcTime(start),
					endTime=calcTime(end),
					startTimeText=makeDoubleNumber(startTime.hour)+':'+makeDoubleNumber(startTime.minute),
					endTimeText=makeDoubleNumber(endTime.hour)+':'+makeDoubleNumber(endTime.minute)
				return startTimeText + '-' + endTimeText
				}else{
					return ''
				}
			},
			railCarsText(){
				let selectedCount=0
				this.railCars.forEach((car)=>{
					if(car.selected){
						selectedCount+=1
					}
				})
				if(selectedCount){
					return selectedCount+'辆'					
				}else{
					return ''
				}
			},
			filteredCars(){
				return this.filtCars(this.railCars)
			},
			railAreaText(){
				let settedText=this.selectedAreaText,
					joinedText=(()=>{
						let str=''
						this.selectedArea.forEach((area)=>{
							str+=area.text
						})
						return str
					})()
				return settedText || joinedText || ''
			}
		},
		created(){
			this.getData()
		},
		watch:{
			'$route':function(to,from){
				if(to.name=='car-rails-edit'){
					if(this.railId!=this.$route.query.id){
						this.getData()
					}
				}
			}
		},
		methods:{
			getData(){
				this.railId=this.$route.query.id || ''
				this.longitude=this.railId ? '' : this.$route.query.longitude
				this.latitude=this.railId ? '' : this.$route.query.latitude
				this.loaded=false
				this.railName=''
				this.railNameError=''
				this.carSpeed=''
				this.carSpeedError=''
				this.railType=''
				this.railData={}
				this.railTypeError=''
				this.railTypeFocused=false
				this.railRemindType=''
				this.railRemindTypeError=''
				this.railRemindTypeFocused=false
				this.railRemindTime={}
				this.railRemindTimeError=''
				this.railRemindTimeFocused=false
				this.railCarsFocused=false
				this.railCars=[]
				this.railCarsError=''
				this.railIsOpen=true
				this.message=''
				this.showMessage=false
				this.isPosting=false
				this.openCarRailsMap=false

				this.selectedArea=[]
				this.selectedAreaText=''				
				this.cascadedMenu=[]
			
				// if(this.railId){
					railData.get.bind(this)({id:this.railId},(railSettings)=>{
						this.railName=this.railId ? railSettings.railName : ''
						this.carSpeed=this.railId ? railSettings.carSpeed : ''
						this.railType=this.railId ? railSettings.railType : ''
						this.selectedArea=this.railId ? railSettings.selectedArea : []
						this.selectedAreaText=this.railId ? railSettings.selectedAreaText : ''
						this.railRemindType=this.railId ? railSettings.railRemindType : ''
						this.railRemindTime=this.railId ? railSettings.railRemindTime : {}
						this.railCars=railSettings.railCars
						this.railIsOpen=this.railId ? railSettings.railIsOpen : true
						this.railData=this.railId ? railSettings.railData : {}
						this.longitude=this.railId ? railSettings.longitude : this.$route.query.longitude 
						this.latitude=this.railId ? railSettings.latitude : this.$route.query.latitude
						this.loaded=true
					},(err)=>{

					})
				// }else{
				// 	this.loaded=true
				// }
			},
			setFilterKeyword(value){
        		this.filterKeyword=value
			},
			filtCars(carTargets){
		        return carTargets.filter((car)=>{
		          return car.brandId.toLowerCase().search(this.filterKeyword.toLowerCase())!=-1
		        })
		    },
			railNameIsInvalid(){
				if(!this.railName){
					return this.railNameError='请输入围栏名称' 
				}
				return this.railNameError=''
			},
			carSpeedIsInvalid(){
				if(!this.carSpeed){
					return this.carSpeedError='请输入车速限制'
				}
				if(!isPositiveInteger(this.carSpeed)){
					return this.carSpeedError='请输入正整数车速'
				}
				if(~~this.carSpeed>400){
					this.carSpeed=400
					return this.carSpeedError='车速过高！请合理设置限速。'
				}
				return this.carSpeedError=''
			},
			carSpeedInputValidate(){
				if(~~this.carSpeed>=400){
					this.carSpeedIsInvalid()
				}
			},
			railTypeIsInvalid(){
				if(!this.railType){
					return this.railTypeError='请选择围栏类型'
				}
				if(this.railType=='area'){
					if(!this.selectedArea.length){
						return this.railTypeError='请选择行政区'
					}else{
						return this.railTypeError=''
					}
				}else{
					return this.railTypeError=''					
				}
			},
			selectRailType(type){
				this.railType=type
				if(this.railType=='area'){
					console.log('area rail')
					this.menuOpen()
				}else{
					this.openCarRailsMap=true
					this.closeRailTypeSelect()
					function calcPoint(){
						this.railData={
							leftTop:this.map.pixelToPoint(new BMap.Pixel(this.leftTop.x,this.leftTop.y)),
							rightTop:this.map.pixelToPoint(new BMap.Pixel(this.rightTop.x,this.rightTop.y)),
							leftBottom:this.map.pixelToPoint(new BMap.Pixel(this.leftBottom.x,this.leftBottom.y)),
							rightBottom:this.map.pixelToPoint(new BMap.Pixel(this.rightBottom.x,this.rightBottom.y)),
							center:this.map.pixelToPoint(new BMap.Pixel(this.center.x,this.center.y)),
							rightCenter:this.map.pixelToPoint(new BMap.Pixel(this.rightCenter.x,this.rightCenter.y))
						}
						this.railData.radiusMeters=this.map.getDistance(this.railData.center,this.railData.rightCenter)

						console.log(this.railData)
					}
					setTimeout(()=>{
						let fullWidth=window.innerWidth,
							fullHeight=window.innerHeight,
							shapeLength=fullWidth*0.6,
							shapeLeft=(fullWidth-shapeLength)/2,
							shapeRight=shapeLeft+shapeLength,
							shapeTop=(fullHeight-shapeLength)/2,
							shapeBottom=shapeTop+shapeLength
						this.leftTop={x:shapeLeft,y:shapeTop}
						this.rightTop={x:shapeRight,y:shapeTop}
						this.leftBottom={x:shapeLeft,y:shapeBottom}
						this.rightBottom={x:shapeRight,y:shapeBottom}
						this.center={x:shapeBottom-shapeLength/2,y:shapeRight-shapeLength/2}
						this.rightCenter={x:shapeRight,y:shapeRight-shapeLength/2}
						!this.mapInited && (this.map = new BMap.Map("car-rails-edit-map"))
						let point=new BMap.Point(this.longitude, this.latitude)
						this.map.centerAndZoom(point, this.baseMapKa)
						!this.mapInited && this.map.addControl(new BMap.NavigationControl())
						!this.mapInited && this.map.addEventListener('dragend',(event)=>{
							calcPoint.bind(this)()
						})
						!this.mapInited && this.map.addEventListener('zoomend',(event)=>{
							calcPoint.bind(this)()
						})
						this.mapInited=true
						calcPoint.bind(this)()
					},600)
				}
			},
			closeRailTypeSelect(){
				this.railTypeFocused=false
				this.railTypeIsInvalid()
			},
			setCarRails(){
				this.openCarRailsMap=false
			},
			railRemindTypeIsInvalid(){
				if(!this.railRemindType){
					return this.railRemindTypeError='请选择提醒方式'
				}
				return this.railRemindTypeError=''
			},
			selectRailRemindType(type){
				this.railRemindType=type
				this.closeRailRemindSelect()
			},
			closeRailRemindSelect(){
				this.railRemindTypeFocused=false
				this.railRemindTypeIsInvalid()				
			},
			railRemindTimeFocus(){
				(this.railRemindTime.start || this.railRemindTime.end) ? '' : this.railRemindTime={start:0,end:1439}
				this.railRemindTimeFocused=true
			},
			railRemindTimeIsInvalid(){
				if(!this.railRemindTime.start && !this.railRemindTime.end){
					return this.railRemindTimeError='请设置提醒时间'
				}
				return this.railRemindTimeError=''
			},
			closeRailTimeSelect(){
				this.railRemindTimeFocused=false
				this.railRemindTimeIsInvalid()
			},
			railRemindTimeChange(start,end){
				this.railRemindTime={
					start:start,
					end:end
				}
			},
			selectRailCar(car){
				car.selected=!car.selected
			},
			railCarsIsInvalid(){
				let isValid=false
				this.railCars.some((car)=>{
					if(car.selected){
						isValid=true
						return true
					}
				})
				if(!isValid){
					return this.railCarsError='请选择监控车辆'
				}
				return this.railCarsError=''
			},
			closeRailCarsSelect(){
				this.railCarsFocused=false
				this.railCarsIsInvalid()
			},
			fillAreaMenuData(level,item){
		          this.cascadedMenu.splice(level,1,[])
		          areaInfo.bind(this)({level:level,item:item},(data)=>{
		            if(data && data.length){
		              setTimeout(()=>{
		                this.cascadedMenu.splice(level,1,data)        
		              },500)
		            }else{
		              this.menuClose()
		            }
		          },(error)=>{

		          })          
		    },
		    menuOpen(){
		    	this.railTYpeError=''
		    	this.selectedArea=[]
		    	this.selectedAreaText=''
		    	this.closeRailTypeSelect()
        		this.fillAreaMenuData(0)
      		},
			menuActive(listIndex,itemIndex,list,item){
		          this.selectedArea.splice(listIndex,1,item)
		          this.selectedArea.splice(listIndex+1)
		          if(listIndex===2){
		            return this.menuClose()          
		          }
		          this.fillAreaMenuData(listIndex+1,item)
		          console.log(this.selectedArea)
		    },
		    menuClose(listIndex,list){
		          if(isInteger(listIndex)){
		            this.cascadedMenu.splice(listIndex,1)          
		          }else{
		            this.cascadedMenu=[]
		          }
		          this.railTypeIsInvalid()
		          console.log(this.selectedArea)
		    },
			saveData(){
				if(!this.railNameIsInvalid() && !this.carSpeedIsInvalid() && !this.railTypeIsInvalid() && !this.railRemindTypeIsInvalid() && !this.railRemindTimeIsInvalid() && !this.railCarsIsInvalid()){
					console.log('posting')
					this.isPosting=true 
					railData.post.bind(this)({
						railId:this.railId,
						railName:this.railName,
						carSpeed:this.carSpeed,
						railType:this.railType,
						railData:this.railData,
						railRemindType:this.railRemindType,
						railRemindTime:this.railRemindTimeText,
						railCars:this.railCars,
						railIsOpen:this.railIsOpen,
						railAreaId:this.railType=='area' ? this.selectedArea[this.selectedArea.length-1].id : ''
					},(id)=>{
						this.railId=id
						this.isPosting=false
						this.$router.push({
							name:'car-rails'
						})
					},(err)=>{
						this.isPosting=false
						this.message=err
						this.showMessage=true
					})
				}else{
					console.log('invalid')
				}
			},
			deleteData(){
				this.isPosting=true
				railData.delete.bind(this)({
					railId:this.railId
				},()=>{
					this.isPosting=false
					this.$router.push({
						name:'car-rails'
					})
				},(err)=>{
					this.isPosting=false
					this.message=err
					this.showMessage=true
				})
			}
		}
	}
</script>

<style lang="scss">
@import "../../scss/variables.scss";
	#car-rails-edit{
		.rail-status{
			padding:$spaceMedium*1.1 $spaceSmall $spaceSmall*0.1;
			border-bottom:solid 1px rgba(0, 0, 0, 0.12);
			display:flex;
			justify-content:space-between;
			span{
				font-size:16px;
			}
		}
		.button-wrapper{
			padding:$spaceBig $spaceSmall;
			display:flex;
			justify-content:space-between;
			>*{
				flex:1;
				margin:0 $spaceSmall*0.5;
			}
		}
	}
	.car-rails-edit-slider-wrapper{
		p{
			font-size:16px;
			text-align:center;
			margin-bottom:$spaceMedium;
		}
		padding:$spaceSmall;
	}
	.car-rails-edit-rail-car-select{

			.mu-item-content{
				img{
					width:35px;
					display:inline-block;
					vertical-align:middle;
					margin-right:$spaceSmall;
				}

				font-size:16px;
			}
			.mu-checkbox{
				pointer-events:none;
				input[type="checkbox"]:checked + .mu-checkbox-wrapper .mu-checkbox-ripple-wrapper,
				input[type="checkbox"]:checked + .mu-checkbox-wrapper .mu-checkbox-icon-uncheck,
				.mu-checkbox-icon-checked{
					color:$colorSecondary;
				}
			}
	}
	.car-rails-type-setting{
		height:100%;
		width:100%;
		position:absolute;
		left:0;
		top:0;
		z-index:10;
		.mu-appbar{
			position:relative;
			z-index:3;
		}

			#car-rails-edit-map{
				background-color:#fff;
				height:100%;
				position:relative;
				margin-top:-45px;
				&:before{
					content:"";
					display:block;
					position:absolute;
					width:60%;
					height:0;
					padding-top:60%;
					background-color:$colorSecondary;
					opacity:0.5;
					left:0;
					right:0;
					top:0;
					bottom:0;
					margin:auto;
					z-index:10;
					pointer-events:none;
				}
				&.circle:before{
					border-radius:999rem;
				}
			}			

	}
</style>