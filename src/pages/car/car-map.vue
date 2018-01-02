
<template>
	<section id="car-map" :class="[isInWechat ? 'in-wechat' : '']">
		<magic-header  v-if="$.env === 'native'" :headeHide="headeHide" titleName="爱车服务"></magic-header>
		
		
			<section id="car-map-container"></section>
			<section class="float-buttons">
				<a class="img-button" @click="toggleLocateTarget">
          <img :src="locateTargetImg" width="45" height="45" />
        </a>
				<a class="img-button">
					<router-link :to="{name:'car-list'}">
            <img src="../../assets/car_map_park_list_icon.png" width="45" height="45" />
					</router-link>
				</a>
				<a class="img-button">
					<router-link :to="{name:'car-rails',query:{longitude:longitude,latitude:latitude}}">
            <img src="../../assets/car_fence_icon_normal2.png" width="45" height="45" />
					</router-link>
				</a>
				<a class="img-button">
					<router-link :to="{name:'path-navigation',query:{longitude:longitude,latitude:latitude}}">
            <img src="../../assets/car_navi_icon_normal2.png" width="45" height="45" />
					</router-link>
				</a>
				<a class="img-button">
					<router-link :to="{name:'car-share-request'}">
            <img src="../../assets/car_secret_icon_normal2.png" width="45" height="45" />
					</router-link>
				</a>

			</section>
			<mu-popup position="bottom" class="popup-bottom" popupClass="popup-bottom" :open="!!selectedCar && $route.name=='car-map'" @close="selectedCar=''">
			    <mu-appbar :title="selectedCar.brandId">
			      <img class="car-logo" :src="selectedCar.logo || defaultCarLogo" slot="left"/>
			      <mu-flat-button slot="right" label="X" color="white" @click="selectedCar=''"/>
			    </mu-appbar>
				<section class="car-map-info-and-operation">
					<p><span>司机：{{selectedCar.driver}}</span><span>电话：{{selectedCar.mobile}}</span></p>
					<p><span>{{selectedCar.status}}</span><span>车速：{{selectedCar.speed}} km/h</span></p>
					<p>位置：{{selectedCar.address}}</p>
					<section class="car-operation">
						<router-link :to="{name:'running-tracks',query:{id:selectedCar.id}}">
							<img src="../../assets/popup_icon_guiji2.png" width="24" height="24" style="vertical-align: middle" />
							行车轨迹
						</router-link>
						<router-link :to="{name:'vehicle-instrument',query:{id:selectedCar.id}}">
              <img src="../../assets/popup_icon_yibiao2.png" width="24" height="24" style="vertical-align: middle" />
							车辆仪表
						</router-link>
						<router-link :to="{name:'drive-achievement',query:{id:selectedCar.id}}">
              <img src="../../assets/popup_icon_tongji2.png" width="24" height="24" style="vertical-align: middle" />
							驾驶成就
						</router-link>
						<router-link :to="{name:'car-location',query:{id:selectedCar.id}}">
              <img src="../../assets/popup_icon_dingwei2.png" width="24" height="24" style="vertical-align: middle" />
							实时定位
						</router-link>
						<router-link :to="{name:'driving-record',query:{id:selectedCar.id}}">
              <img src="../../assets/popup_icon_jiluyi2.png" width="24" height="24" style="vertical-align: middle" />
							行车记录
						</router-link>
						<router-link :to="{name:'car-examinationning',query:{id:selectedCar.id}}">
              <img src="../../assets/popup_icon_tijian2.png" width="24" height="24" style="vertical-align: middle" />
							全车体检
						</router-link>
						<router-link class="full-width" :to="{name:'car-add',query:{id:selectedCar.id}}">
							编辑车辆信息
						</router-link>
					</section>
				</section>
			</mu-popup>
		
		<loading-spin v-show="gettingPersonLocation">
			正在定位...
		</loading-spin>
		 <mu-snackbar class="center" v-if="showMessage" :message="message" action="关闭" @actionClick="showMessage=false"/>

	</section>
</template>

<script>
import magicHeader from "components/magicHeader";
import LoadingSpin from "components/loading-spin";
// 	import MuFloatButton from 'muse-components/floatButton'
// 	import MuFlatButton from 'muse-components/flatButton'
// 	import ContentWithLoading from 'components/content-with-loading'
// 	import MuSnackbar from 'muse-components/snackbar'
// 	import MuAppbar from 'muse-components/appbar'
// 	import MuPopup from 'muse-components/popup'
import getDeviceStatus from "services/binded-device-status";
// 	import getLocation from 'utilities/get-location'
import gpsConvertor from "utilities/gps-convertor";
import localSavedLocation from "services/location-data";
import carGreenIcon from "../../assets/car_green_tiny.png";
import carGrayIcon from "../../assets/car_gray_tiny.png";
import carOrangeIcon from "../../assets/car_orange_tiny.png";
import defaultCarLogo from "../../assets/favicon.png";
import carPositionIconNormal from "../../assets/car_position_icon_normal2.png";
import carPhonePositionIconNormal from "../../assets/car_phone_position_icon_normal2.png";

export default {
  components: {
    magicHeader,
    // ContentWithLoading,
    // MuFloatButton,
    // MuFlatButton,
    // MuAppbar,
    // MuPopup,
    // MuSnackbar,
    LoadingSpin
  },
  data() {
    return {
      loaded: false,
      showMessage: false,
      message: "",
      locateTarget: "car",
      locateTargetImg: carPositionIconNormal,
      longitude: "",
      latitude: "",
      cars: [],
      selectedCar: "",
      defaultLongitude: 116.404,
      defaultLatitude: 39.915,
      carIcon: "http://developer.baidu.com/map/jsdemo/img/car.png",
      userHead: "",
      defaultUserHead: defaultCarLogo,
      isDrawing: false,
      carIcons: {
        gray: carGrayIcon,
        orange: carOrangeIcon,
        green: carGreenIcon
      },
      defaultCarLogo: defaultCarLogo,
      searchInputError: "",
      hasBindedDevice: false,
      // bindDeviceNote:'请添加车辆并绑定设备',
      bindDeviceNote: "绑定设备将为您提供车辆服务。",

      gettingPersonLocation: false,
      isInWechat: false,
      headeHide: false
    };
  },
  created() {
    if (this.$.env === "wxPublic") {
      this.headeHide = true;
      this.isInWechat = true;
    } else {
      this.isInWechat = false;
    }
  },
  mounted() {
    this.initData();
  },
  watch: {
    $route: function(to, from) {
      if (to.name == "car-map") {
        if (to.query.refresh) {
          this.initData();
          return this.$router.replace({ name: "car-map" });
        }
        if (to.query.id) {
          return this.drawCarsLocation(to.query.id, to.query.hasTerminal);
        }
      }
    },
      locateTarget:{
          deep:true,
          immediate:true,
          handler:function(newVal,oldVal){
            console.log('trigger')
            if(!this.$.isEmpty(newVal)){
                if(this.locateTarget == 'car'){
                  this.locateTargetImg = carPositionIconNormal;
                }else{
                  this.locateTargetImg = carPhonePositionIconNormal;
                }
            }
          }
        }
      
    
  },
  methods: {
    initData() {
      getDeviceStatus.bind(this)(
        {},
        data => {
          if (data.hasBindedDevice) {
            this.hasBindedDevice = true;
            this.cars = data.cars;
            this.locateTarget = "car";
            this.userHead = data.userInfo.headPhoto;
            // this.selectedCar=this.cars[0]
            console.log(this.userHead);
            this.loaded = true;
            this.drawCarsLocation();
          } else {
            this.hasBindedDevice = false;
            this.locateTarget = "person";
            this.userHead = data.userInfo.headPhoto;
            console.log(this.userHead);
            this.loaded = true;
            this.drawPersonLocation();
            this.showMessageNote(this.bindDeviceNote);
          }
        },
        err => {
          this.showMessageNote(err);
        }
      );
    },
    showMessageNote(message) {
      this.message = message;
      this.showMessage = true;
    },
    toggleLocateTarget() {
      if (!this.isDrawing) {
        if (this.hasBindedDevice) {
          if (this.locateTarget == "car") {
            this.locateTarget = "person";
            this.drawPersonLocation();
          } else {
            this.locateTarget = "car";
            this.drawCarsLocation();
          }
        } else {
          this.showMessageNote(this.bindDeviceNote);
        }
      } else {
        this.message = "您的切换频率过快，请稍后切换。";
        this.showMessage = true;
      }
    },
    cleanOverlay() {
      this.map && this.marker && this.map.removeOverlay(this.marker);
      this.map &&
        this.markers &&
        this.markers.length &&
        this.markers.forEach(marker => {
          this.map.removeOverlay(marker);
        });
    },
    drawMap() {
      !this.mapInited && (this.map = new BMap.Map("car-map-container"));
      this.point = new BMap.Point(this.longitude, this.latitude);
      this.map.centerAndZoom(this.point, 15);
      let trafficControl = new BMapLib.TrafficControl({ showPannel: false });
      !this.mapInited && this.map.addControl(new BMap.NavigationControl());
      !this.mapInited && this.map.addControl(trafficControl);
      !this.mapInited && trafficControl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);

      this.mapInited = true;
    },
    drawCarsLocation(carId, hasTerminal) {
      this.isDrawing = true;
      let targetCar = null;
      if (carId) {
        this.cars.forEach(car => {
          if (car.id == carId && hasTerminal) {
            targetCar = car;
          }
        });
        if (!targetCar) {
          if ((targetCar = this.cars[0])) {
            // this.message='您选择的车辆未绑定设备，已定位到默认车辆。'
            this.message = "绑定设备将为您提供车辆服务。";
            this.showMessage = true;
          } else {
            targetCar = null;
            this.hasBindedDevice = false;
            this.locateTarget = "person";
            this.drawPersonLocation();
            // this.message='您的车辆未绑定设备，请绑定。'
            this.message = "绑定设备将为您提供车辆服务。";
            this.showMessage = true;
            return;
          }
          // targetCar=this.cars[0]
          // this.message='您选择的车辆未绑定设备，已定位到默认车辆。'
          // this.showMessage=true
        } else {
          this.selectedCar = targetCar;
        }
      } else {
        targetCar = this.cars[0];
      }

      this.loaded = true;
      this.cleanOverlay();
      this.longitude = targetCar.longitude;
      this.latitude = targetCar.latitude;
      setTimeout(() => {
        this.drawMap();
        let points = this.cars.map(car => {
          return new BMap.Point(car.longitude, car.latitude);
        });

        this.markers = points.map((point, index) => {
          // return new BMap.Marker(point,{icon:new BMap.Icon(this.carIcon,new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),rotation:this.cars[index].rotation})
          // return new BMap.Marker(point,{icon:new BMap.Icon(this.carIcons[this.cars[index].statusColor],new BMap.Size(30,52),{anchor : new BMap.Size(27, 13)}),rotation:this.cars[index].rotation})
          return new BMap.Marker(point, {
            icon: new BMap.Icon(
              this.carIcons[this.cars[index].statusColor],
              new BMap.Size(20, 35),
              { anchor: new BMap.Size(27, 13) }
            ),
            rotation: this.cars[index].rotation
          });
        });

        this.markers.forEach((marker, index) => {
          this.map.addOverlay(marker);
          marker.addEventListener("click", () => {
            console.log(this.cars[index]);
            this.selectedCar = this.cars[index];
          });
        });
        this.isDrawing = false;
      }, 500);
    },
    drawPersonLocation() {
      this.isDrawing = true;
      function drawPerson() {
        this.loaded = true;
        setTimeout(() => {
          this.drawMap();
          this.marker = new BMap.Marker(this.point);
          this.map.addOverlay(this.marker);
          this.marker.enableDragging();
          this.isDrawing = false;
        }, 500);
      }
      this.cleanOverlay();
      this.gettingPersonLocation = true;
      getLocation(
        {},
        position => {
          gpsConvertor({
            points: [{ lng: position.longitude, lat: position.latitude }]
          }).then(
            points => {
              this.longitude = points[0].lng;
              this.latitude = points[0].lat;
              localSavedLocation.set({
                longitude: points[0].lng,
                latitude: points[0].lat
              });
              this.gettingPersonLocation = false;
              drawPerson.bind(this)();
            },
            err => {
              let localSavedUserLocation = localSavedLocation.get();
              this.longitude = localSavedUserLocation
                ? localSavedUserLocation.longitude
                : this.defaultLongitude;
              this.latitude = localSavedUserLocation
                ? localSavedUserLocation.latitude
                : this.defaultLatitude;
              this.gettingPersonLocation = false;
              drawPerson.bind(this)();
              this.showMessageNote(err);
            }
          );
        },
        err => {
          let localSavedUserLocation = localSavedLocation.get();
          this.longitude = localSavedUserLocation
            ? localSavedUserLocation.longitude
            : this.defaultLongitude;
          this.latitude = localSavedUserLocation
            ? localSavedUserLocation.latitude
            : this.defaultLatitude;
          this.gettingPersonLocation = false;
          drawPerson.bind(this)();
          this.showMessageNote(err);
        }
      );
    }
  }
};
</script>

<style lang="scss">
@import "../../scss/variables.scss";
#car-map {
  overflow: hidden !important;
  height: 100%;
  position: relative;
  #car-map-container {
    width: 100%;
    height: 100%;
  }
  .float-buttons {
    position: fixed;
    right: $spaceSmall;
    top: $spaceSmall;
    .img-button {
      display: block;
      margin-top: $spaceSmall;
      width: 40px;
      height: 40px;
      i {
        color: $colorSecondary;
      }
      a {
        display: block;
        width: 100%;
        height: 100%;
        color: #fff;
        i {
          width: 100%;
          height: 100%;
          line-height: 40px;
          text-align: center;
          text-indent: 2px;
        }
      }
    }
  }

  &:not(.in-wechat) {
    .content-with-loading {
      .content-wrapper {
        padding-bottom: 45px;
        .float-buttons {
          top: 45px;
        }
      }
    }
  }
  .BMap_stdMpType4 .BMap_stdMpZoom {
    right: -0.5rem;
  }
  #tcBtn {
    bottom: 91px !important;
    right: 1.5rem !important;
    width: 35px !important;
    height: 35px !important;
    border: none;
    border-bottom: solid 1px rgba(0, 0, 0, 0.1);
    // transform: scale(1.16);
    box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.5);
    // opacity: 0.7;
    &.maplibTcBtn_mobile {
      background-size: 66px auto !important;
    }
    &.maplibTcBtnOff_mobile {
      background-position: 2px 0 !important;
    }
  }
}
.car-logo {
  width: 40px;
  height: auto;
}
.car-map-info-and-operation {
  padding: $spaceSmall;
  p span {
    display: inline-block;
    min-width: 40%;
  }
  .car-operation {
    text-align: justify;
    padding-top: $spaceSmall;
    a {
      padding: $spaceSmall*0.5;
      display: inline-block;
      width: 48%;
      border: solid 2px $colorSecondary;
      border-radius: 2px;
      margin-bottom: $spaceSmall*0.5;
      text-align: center;
      &.full-width {
        width: 100%;
        margin-bottom: 0;
        color: #fff;
        padding: $spaceSmall;
        background-color: $colorSecondary;
      }
    }
  }
}
</style>
