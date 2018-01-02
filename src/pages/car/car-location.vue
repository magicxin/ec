<template>
  <section id="car-location">
    <!-- <appbar link="car-map" /> -->
    <magic-header titleName="实时定位"></magic-header>
    <!-- <content-with-loading :loaded="loaded"> -->
      <div id="car-location-container" :style="carLocationContainerStyle"></div>
    <!-- </content-with-loading> -->
     <mu-snackbar class="center" v-if="showMessage" :message="message" action="关闭" @actionClick="showMessage=false" @close="showMessage=false"/>
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import QueryCarState from 'services/query-car-state'
  import clientInfo from 'utilities/client-info'
  // import carGreenIcon from '../assets/img/car_green_small.png'
  // import carGrayIcon from '../assets/img/car_gray_small.png'
  // import carOrangeIcon from '../assets/img/car_orange_small.png'
  import carGreenIcon from 'assets/car_green_tiny.png'
  import carGrayIcon from 'assets/car_gray_tiny.png'
  import carOrangeIcon from 'assets/car_orange_tiny.png'
  import objectCompare from 'utilities/object-compare'
  export default {
    components:{
      magicHeader,
      // Appbar,
      // ContentWithLoading,
      QueryCarState
    },
    data(){
      const defaultLongitude = 116.404
      const defaultLatitude = 39.915
      return {
        defaultLongitude,
        defaultLatitude,
        loaded: false,
        showMessage: false,
        message: '',
        infoWindowContent: '',
        longitude: '',
        latitude: '',
        rotation: 0,
        carIcon: 'http://developer.baidu.com/map/jsdemo/img/car.png',
        carId: '',
        carLocationContainerStyle: {height: 'auto'},
        points:[]
      }
    },
    mounted(){
      if(clientInfo.render.isWechatWebView){
        this.carLocationContainerStyle.height = window.screen.height + 'px'
      } else {
        this.carLocationContainerStyle.height = (window.screen.height - 56) + 'px'
      }
      this.startDraw()
    },
    methods:{
      startDraw() {
        this.carId = this.$route.query.id
        QueryCarState.bind(this)({carId: this.carId},(data)=>{
          let oldLongitude=this.longitude,
              oldLatitude=this.latitude
          // console.log(data)
          this.loaded = true
          // this.longitude = parseFloat(data.longitude)
          // this.latitude = parseFloat(data.latitude)
          
          this.longitude = parseFloat(data.lngBaidu)
          this.latitude = parseFloat(data.latBaidu)


          this.infoWindowContent = this.createInfoWindowContent(data.deviceStatus, data.runningStatus,data.speed, data.happenDate)
          this.rotation = parseInt(data.direction, 10)
          // this.latitude = this.defaultLatitude
          // this.longitude = this.defaultLongitude
          // this.infoWindowContent = this.createInfoWindowContent('1','3',45, '2016-12-08 16:49:33')
          // this.rotation = 245
          if(this.longitude!=oldLongitude || this.latitude!=oldLatitude){
            this.points.push(new BMap.Point(this.longitude,this.latitude))
          }
          this.drawCarLocation()
          !this.timerStarted && this.runTimer()
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      cleanOverlay() {
        this.map && this.marker && this.map.removeOverlay(this.marker)
        this.map && this.polyline && this.map.removeOverlay(this.polyline)
      },
      drawMap() {
        !this.mapInited && (this.map = new BMap.Map("car-location-container"))
        this.point=new BMap.Point(this.longitude, this.latitude)
        this.map.centerAndZoom(this.point, 15)
        !this.mapInited && this.map.addControl(new BMap.NavigationControl())
        this.mapInited=true
      },
      drawCarLocation() {
        setTimeout(()=>{
          this.mapInited && this.cleanOverlay()
          console.log(this.points)
          this.polyline=new BMap.Polyline(this.points,{strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5})    
          if (this.marker) {
            // 绘制地图
            this.drawMap()
            // 设置并打开窗口提示框
            this.map.closeInfoWindow()
            this.map.openInfoWindow(new BMap.InfoWindow(this.infoWindowContent, {enableCloseOnClick: false,offset: {width: 0, height: 0}}), this.map.getCenter());
            // 创建并添加车辆marker
            this.cleanOverlay()
            this.marker=new BMap.Marker(this.point,{icon:new BMap.Icon(this.carIcon,new BMap.Size(20,35),{anchor : new BMap.Size(27, 13)}),rotation:this.rotation})
            this.map.addOverlay(this.marker)
            this.map.addOverlay(this.polyline)
          } else {
            // 绘制地图
  					this.drawMap()
            // 禁止拖拽
            this.map.disableDragging()
            // 设置并打开窗口提示框
            this.map.openInfoWindow(new BMap.InfoWindow(this.infoWindowContent, {enableCloseOnClick: false,offset: {width: 0, height: 0}}), this.map.getCenter());
            // 创建并添加车辆marker
            this.marker=new BMap.Marker(this.point,{icon:new BMap.Icon(this.carIcon,new BMap.Size(20,35),{anchor : new BMap.Size(27, 13)}),rotation:this.rotation})
            this.map.addOverlay(this.marker)
            this.map.addOverlay(this.polyline)
          }
				},500)
      },
      createInfoWindowContent(deviceStatus, runningStatus, speed, happenDate) {
        let sDeviceStatus = deviceStatus=='1'?'在线':'离线',
            sRunningStatus = ''
        if (deviceStatus == '0') {
          sRunningStatus = '未知'
          this.carIcon = carGrayIcon
        } else {
          switch (runningStatus) {
      			case '0':
              sRunningStatus = '行驶'
              this.carIcon = carGreenIcon
              break
      			case '1':
      				sRunningStatus = '停止'
              this.carIcon = carGreenIcon
              break
      			case '2':
      				sRunningStatus = '熄火'
              this.carIcon = carOrangeIcon
              break
      			case '3':
      				sRunningStatus = '怠速'
              this.carIcon = carGreenIcon
              break
      			default:
      				sRunningStatus = '未知'
              this.carIcon = carGrayIcon
          }
        }
        return sDeviceStatus+'：'+sRunningStatus+'<br>速度：'+speed+'km/h<br>'+happenDate
      },
      runTimer() {
        this.timerStarted = true
        this.timer = setInterval(() => {
          this.startDraw()
        }, 3000)
      }
    },
    watch:{
      '$route':function(to,from) {
        if (to.name != 'car-location') {
          clearInterval(this.timer)
          this.cleanOverlay()
          this.points=[]
          this.timerStarted = false
        } else {
          this.startDraw()
        }
      }
    }
  }
</script>

<style lang="scss">
@import "../../scss/variables.scss";
  #car-location{
    .content-with-loading{
      .content-wrapper{
        position:relative;
        #car-location-container{
          width:100%;
        }
      }
    }
    .BMap_pop img:nth-child(10) {
      visibility: hidden;
    }
  }
  .car-logo{
    width:40px;
    height:auto;
  }
</style>
