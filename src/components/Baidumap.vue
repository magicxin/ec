<template>
	<div>
		<my-header main-text="活动地址" bg-color="#F7F7F7" text-color="#000">
       		<img :src="left" alt="">
   		</my-header>
		<div id="allmap"></div>
	</div>
</template>
<script>
	// 百度地图API功能
	import myHeader from 'components/my-header'
	import left from '../assets/left-gray.svg'
	import  {MP} from "../utilities/map"; //请求地图
	export default {
		name:"Baidumap",
		props:["mapAddress"],
		data(){
			return{
				left
			}
		},
		components:{
			myHeader,
			left
		},
		mounted(){
			MP("TKRROZRGxrxzdSAp0jGu0C8r").then(BMap=>{
				var map = new BMap.Map("allmap");            // 创建Map实例
	            var point =  this.$router.app._route.params.address.split("&")
	            let lngBaidu = parseFloat(point[0].split("=")[1]) //经度
	            let latBaidu = parseFloat(point[1].split("=")[1]) //纬度
	            point = new BMap.Point(lngBaidu,latBaidu); //实力化地图 
	            //console.log(point) 车友会活动地址
	            map.centerAndZoom(point,11);
	            map.enableScrollWheelZoom(true);
	            var marker = new BMap.Marker(point);  // 创建标注
				map.addOverlay(marker); // 将标注添加到地图中
	            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			})
		}
	}
</script>
<style scoped>
	body, html,#allmap {width: 100%;height: 100vh;overflow: hidden;margin:0;font-family:"微软雅黑";}
</style>
