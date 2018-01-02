<template>
  <section id="running-tracks-detail">
    <!-- <appbar :link="{name:'running-tracks',query:{carId:this.$route.query.id}}"/> -->
    <magic-header titleName="轨迹详情"></magic-header>
    <div class="img_div" id="imgDiv">
      <div ref="drivingAction" class="drivingActionDiv">
        <div v-if="drivingActionCount[3]>0">
          <li class="jiansu_img" ref="jiansu" @click="jians">
            <div class="number">{{drivingActionCount[3]}}</div>
            <span class="span">急减速</span>
          </li>
        </div>
        <div v-else>
          <li class="jiansu_img">
            <span class="span">急减速</span>
          </li>
        </div>
        <div v-if="drivingActionCount[2]>0">
          <li class="jiasu_img" ref="jiasu" @click="jias">
            <div class="number">{{drivingActionCount[2]}}</div>
            <span class="span">急加速</span>
          </li>
        </div>
        <div v-else>
          <li class="jiasu_img">
            <span class="span">急加速</span>
          </li>
        </div>
        <div v-if="drivingActionCount[7]>0">
          <li class="zw_img" ref="zw" @click="zw">
            <div class="number">{{drivingActionCount[7]}}</div>
            <span class="span">急转弯</span>
          </li>
        </div>
        <div v-else>
          <li class="zw_img">
            <span class="span">急转弯</span>
          </li>
        </div>
        <div v-if="drivingActionCount[5]>0">
          <li class="sc_img" ref="sc" @click="sc">
            <div class="number">{{drivingActionCount[5]}}</div>
            <span class="span">急刹车</span>
          </li>
        </div>
        <div v-else>
          <li class="sc_img">
            <span class="span">急刹车</span>
          </li>
        </div>
        <div v-if="drivingActionCount[9]>0">
          <li class="zs_img" ref="zs" @click="zs">
            <div class="number">{{drivingActionCount[9]}}</div>
            <span class="span">高转速</span>
          </li>
        </div>
        <div v-else>
          <li class="zs_img">
            <span class="span">高转速</span>
          </li>
        </div>
        <div v-if="drivingActionCount[4]>0">
          <li class="ds_img" ref="ds" @click="ds">
            <div class="number">{{drivingActionCount[4]}}</div>
            <span class="span">长怠速</span>
          </li>
        </div>
        <div v-else>
          <li class="ds_img">
            <span class="span">长怠速</span>
          </li>
        </div>
      </div>
      <div class="index">
        <li class="distance_img"><span>里程：{{mileage}}km</span></li>
        <li class="time_img_black"><span>行驶时长：{{totalTime}}h</span></li>
        <li class="oil_img_black"><span>耗油量：{{totalOil}}L</span></li>
        <li class="avgOil_img_black"><span>平均油耗：{{avgOil}}L/100km</span></li>
        <li class="speed_img_black"><span>平均车速：{{avgSpeed}}km/h</span></li>
        <li class="money_img_black"><span>参考油费：{{oilCost}}元</span></li>
      </div>
      <div class="swichDiv">
        <div class="triangle-down" ref="triangle" @click="swichClick"></div>
      </div>
    </div>
    <div id="map-container"></div>
    <div class="position" ref="position">
      <div class="playBtn" ref="playBtn" @click="play"></div>
      <div ref="pauseBtn" class="pauseBtn" @click="pause"></div>
    </div>
    <div class="ptDiv" ref="ptDiv">
      <li class="pt_img" @click="pt" ref="pt"></li>
      <li class="pt_list" ref="ptList" @click="list"></li>
    </div>
  </section>
</template>
<script>
  // import ContentWithLoading from 'components/content-with-loading'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  import runningTracksDetail from 'services/running-tracks-detail.js'
  import gpsConvertor from 'utilities/gps-convertor'
  import jias_img from 'assets/icon_map_2.png'
  import jians_img from 'assets/icon_map_1.png'
  import ds_img from 'assets/icon_map_6.png'
  import sc_img from 'assets/icon_map_4.png'
  import zw_img from 'assets/icon_map_3.png'
  import zs_img from 'assets/icon_map_5.png'
  import carIcon from 'assets/icon_car4.png'
  import pIcon from 'assets/icon_map_park_selected.png'
  export default {
    components: {
      // ContentWithLoading,
      // Appbar
      magicHeader
    },
    data(){
      return {
        trackId: '',
        drivingActionCount: [],
        drivingActions: [],
        parkings: [],
        points: [],
        gpsPoints: [],
        parkingPoints: [],
        pointsRedirect: [],
        mileage: '',
        totalOil: '',
        totalTime: '',
        avgSpeed: '',
        oilCost: '',
        avgOil: '',
        map: '',
        loaded: false,
        jias_img,
        jians_img,
        ds_img,
        sc_img,
        zw_img,
        zs_img,
        makerParkings: [],
        makerWarn: [],
        makeraddSpeed: [],
        makercutSpeed: [],
        makerturn: [],
        makerlock: [],
        makerhighSpeed: [],
        makerlongSlow: [],
        myIcon: '',
        carIcon,
        pIcon,
        timer: '',
        defaultPoints: [],
        index: 0,
        car: '',
      }
    },
    mounted () {
      this.map = new BMap.Map("map-container");
      var point = new BMap.Point(116.331398, 39.897445);
      /*this.map.enableScrollWheelZoom();
       this.map.addControl(new BMap.NavigationControl());
       this.map.addControl(new BMap.ScaleControl());*/
      this.map.centerAndZoom(point, 12);
      this.map.addControl(new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_ZOOM
      }))
      this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}))
    },
    created(){
    },
    watch: {
      '$route': function (to, from) {
        if (to.name === 'running-tracks-detail' && this.$route.query.trackId != this.trackId) {
          this.trackId = this.$route.query.trackId
          this.getData();
        }
      },
    },
    methods: {
      getData(){
        this.points.length = 0;
        runningTracksDetail.bind(this)({
          trackId: this.trackId,
          timeType: '4'
        }, (data) => {
          data.points.forEach((item) => {
            this.points.push(new BMap.Point(item.longitude, item.latitude));
            this.pointsRedirect.push(item);
          })
          gpsConvertor({
            points: this.points
          }).then((points) => {
            this.successHandler(points)
          }, (err) => {
            //errorHandler(err)
          })
          this.drivingActionCount = data.drivingActionCount;
          this.mileage = data.mileage;
          this.totalTime = data.totalTime;
          this.totalOil = data.totalOil;
          this.avgSpeed = data.avgSpeed;
          this.avgOil = data.avgOil;
          this.oilCost = data.oilCost;
          this.drivingActions = data.drivingActions;
          this.parkings = data.parkings;
          this.loaded = true
        }, (errorMessage) => {
          this.errorMessage = errorMessage
          this.showError = true
        });
      },
      successHandler(data){
        this.points.length = 0;
        this.points = data;
        this.map.centerAndZoom(data[0], 12);
        //通过DrivingRoute获取一条路线的point
        var driving = new BMap.DrivingRoute(this.map, {renderOptions: {map: this.map, autoViewport: true}});    //驾车实例
        driving.search(data[0], data[data.length - 1]);
        //this.map.clearOverlays();
        driving.setSearchCompleteCallback(function () {
          var pts = data;    //通过驾车实例，获得一系列点的数组
          var paths = pts.length;    //获得有几个点
          this.myIcon = new BMap.Icon(this.carIcon, new BMap.Size(66, 66));
          this.car = new BMap.Marker(pts[0], {icon: this.myIcon});
          this.map.addOverlay(this.car);
          //连接所有点
          this.map.addOverlay(new BMap.Polyline(data, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 1}));
        }.bind(this));
        this.map.clearOverlays();
      },
      swichClick(){
        if (this.$refs.drivingAction.style.display == "none") {
          this.$refs.drivingAction.style.display = "block"
          this.$refs.triangle.className = "triangle-up"
          this.$refs.position.style.top = 230 + "px"
          this.$refs.ptDiv.style.top = 270 + "px"
        } else {
          this.$refs.drivingAction.style.display = "none"
          this.$refs.triangle.className = "triangle-down"
          this.$refs.position.style.top = 180 + "px"
          this.$refs.ptDiv.style.top = 220 + "px"
        }
      },
      jias(){
        if (this.$refs.jiasu.className == "jiasu_img") {
          this.$refs.jiasu.className = "jiasuNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'acceleration') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.jiasu.className = "jiasu_img"
          for (var i in this.makeraddSpeed) {
            this.map.removeOverlay(this.makeraddSpeed[i]);
          }
        }
      },
      jians(){
        if (this.$refs.jiansu.className == "jiansu_img") {
          this.$refs.jiansu.className = "jiansuNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'deceleration') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.jiansu.className = "jiansu_img"
          for (var i in this.makercutSpeed) {
            this.map.removeOverlay(this.makercutSpeed[i]);
          }
        }
      },
      zw(){
        if (this.$refs.zw.className == "zw_img") {
          this.$refs.zw.className = "zwNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'sharpTurn') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.zw.className = "zw_img"
          for (var i in this.makerturn) {
            this.map.removeOverlay(this.makerturn[i]);
          }
        }
      },
      sc(){
        if (this.$refs.sc.className == "sc_img") {
          this.$refs.sc.className = "scNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'rapidBrake') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.sc.className = "sc_img"
          for (var i in this.makerlock) {
            this.map.removeOverlay(this.makerlock[i]);
          }
        }
      },
      ds(){
        if (this.$refs.ds.className == "ds_img") {
          this.$refs.ds.className = "dsNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'idleSpeed') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.ds.className = "ds_img"
          for (var i in this.makerlongSlow) {
            this.map.removeOverlay(this.makerlongSlow[i]);
          }
        }
      },
      zs(){
        if (this.$refs.zs.className == "zs_img") {
          this.$refs.zs.className = "zsNor_img"
          for (var i in this.drivingActions) {
            if (this.drivingActions[i].type == 'overRotateSpeed') {
              var point = new BMap.Point(this.drivingActions[i].longitude, this.drivingActions[i].latitude);
              this.addMarker(point, this.drivingActions[i].type, '', '', this.drivingActions[i].address, i);
            }
          }
        } else {
          this.$refs.zs.className = "zs_img"
          for (var i in this.makerhighSpeed) {
            this.map.removeOverlay(this.makerhighSpeed[i]);
          }
        }
      },
      pt(){
        if (this.$refs.pt.className == "pt_img") {
          this.$refs.ptList.style.display = "block";
          this.$refs.pt.className = "pt_img_normal";
          for (var i in this.parkings) {
            var text = this.parkings[i].beginTime + "-" + this.parkings[i].endTime;
            var point = new BMap.Point(this.parkings[i].longitude, this.parkings[i].latitude);
            var number = ++i
            this.addMarker(point, '', text, this.parkings[i - 1].totalTime, this.parkings[i - 1].address, number);
          }
        } else {
          this.$refs.pt.className = "pt_img"
          this.$refs.ptList.style.display = "none";
          for (var i in this.makerParkings) {
            this.map.removeOverlay(this.makerParkings[i]);
          }
        }
      },
      list(){
        this.$router.push({
          name: 'running-tracks-stop', query: {
            trackId: this.$route.query.trackId,
          }
        })
      },
      play() {
        var point = this.points[this.index];
        var pointDirect = this.pointsRedirect[this.index];
        if (this.index > 0) {
          this.map.addOverlay(new BMap.Polyline([this.points[this.index - 1], point], {
            strokeColor: "red",
            strokeWeight: 1,
            strokeOpacity: 1
          }));
        }
        this.car.setPosition(point);
        this.car.setRotation(pointDirect.direction);
        this.index++;
        this.$refs.playBtn.style.display = "none";
        this.$refs.pauseBtn.style.day = "block"
        if (this.index < this.points.length) {
          this.timer = window.setTimeout(() => {
            this.play(" + index + ")
          }, 200);
        } else {
          this.$refs.playBtn.style.display = "block";
          this.$refs.pauseBtn.style.display = "none";
          this.index = 0;
        }

      },
      pause() {
        if (this.timer) {
          window.clearTimeout(this.timer);
        }
        this.$refs.playBtn.style.display = "block";
        this.$refs.pauseBtn.style.display = "none"
      },

      //创建覆盖物
      addMarker(point, type, text, time, address, number){
        if (type == '')//停车
        {
          this.myIcon = new BMap.Icon(this.pIcon, new BMap.Size(29, 38));
        }
        else if (type == 'acceleration')//急加速
        {
          this.myIcon = new BMap.Icon(this.jias_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.accelerationAlarm")}';//急加速报警
        }
        else if (type == 'deceleration')//急减速
        {
          this.myIcon = new BMap.Icon(this.jians_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.decelerationAlarm")}';//急减速报警
        }
        else if (type == 'idleSpeed')//长怠速
        {
          this.myIcon = new BMap.Icon(this.ds_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.idleSpeedAlarm")}';//长怠速报警
        }
        else if (type == 'rapidBrake')//急刹车
        {
          this.myIcon = new BMap.Icon(this.sc_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.rapidBrakeAlarm")}';//急刹车报警
        }
        else if (type == 'sharpTurn')//急转弯
        {
          this.myIcon = new BMap.Icon(this.zw_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.sharpTurnAlarm")}';//急转弯报警
        }
        else if (type == 'overRotateSpeed')//高转速
        {
          this.myIcon = new BMap.Icon(this.zs_img, new BMap.Size(29, 38));
          text = '${message("icar.admin.location.driveHistory.overRotateSpeedAlarm")}';//高转速报警
        }
        var marker = new BMap.Marker(point, {icon: this.myIcon});
        this.map.addOverlay(marker);
        if (type == '')//停车
        {

          this.makerParkings.push(marker);
        }
        else if (type == 'acceleration')//急加速
        {
          this.makeraddSpeed.push(marker);
          this.makerWarn.push(marker);
        }
        else if (type == 'deceleration')//急减速
        {
          this.makercutSpeed.push(marker);
          this.makerWarn.push(marker);
        }
        else if (type == 'idleSpeed')//长怠速
        {
          this.makerlongSlow.push(marker);
          this.makerWarn.push(marker);
        }
        else if (type == 'rapidBrake')//急刹车
        {
          this.makerlock.push(marker);
          this.makerWarn.push(marker);
        }
        else if (type == 'sharpTurn')//急转弯
        {
          this.makerturn.push(marker);
          this.makerWarn.push(marker);
        }
        else if (type == 'overRotateSpeed')//高转速
        {
          this.makerhighSpeed.push(marker);
          this.makerWarn.push(marker);
        }
      },
      successMarker(data){
      }
    }
  }
</script>
<style lang="scss">
  @import "../../threeparties/map/style.scss";

  #running-tracks-detail {
    #map-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      margin: 0;
      font-family: "微软雅黑";
      .BMap_stdMpZoom {
        top: auto;
        bottom: 150px
      }
      .BMap_scaleCtrl {
        bottom: 180px !important;
        top: auto !important;
        left: 10px !important
      }
    }
    .position {
      position: absolute;
      top: 180px;
      right: 27px
    }
    .playBtn {
      float: right;
      background-image: url("../../assets/btn_play_pressed.png");
      width: 32px;
      margin-top: 5px;
      height: 32px;
      z-index: 10;
      background-size: 2.3em
    }
    .pauseBtn {
      float: right;
      background-image: url("../../assets/btn_pause_pressed.png");
      width: 32px;
      margin-top: 5px;
      height: 32px;
      z-index: 10;
      background-size: 2.3em;
      display: none
    }
    .hidden {
      display: none;
    }
    .img_div {
      float: left;
      width: 100%;
      li {
        background-repeat: no-repeat;
        background-position: center;
        width: 16.6%;
        height: 42px;
        background-size: 3em;
        float: left;
        position: relative;
        .span {
          position: absolute;
          bottom: -20px;
          left: 10px;
        }
      }
      .ds_img {
        background-image: url(../../assets/icon6_grey.png);
      }
      .zs_img {
        background-image: url(../../assets/icon5_grey.png);
      }
      .sc_img {
        background-image: url(../../assets/icon4_grey.png);
      }
      .zw_img {
        background-image: url(../../assets/icon3_grey.png);
      }
      .jiasu_img {
        background-image: url(../../assets/icon2_grey.png);
      }
      .jiansu_img {
        background-image: url(../../assets/icon1_grey.png);
      }
      .dsNor_img {
        background-image: url(../../assets/icon6_nor.png);
      }
      .zsNor_img {
        background-image: url(../../assets/icon5_nor.png);
      }
      .scNor_img {
        background-image: url(../../assets/icon4_nor.png);
      }
      .zwNor_img {
        background-image: url(../../assets/icon3_nor.png);
      }
      .jiasuNor_img {
        background-image: url(../../assets/icon2_nor.png);
      }
      .jiansuNor_img {
        background-image: url(../../assets/icon1_nor.png);
      }
    }
    .index {
      padding: 10px 0px 0px 10px;
      float: left;
      width: 100%;
      li {
        background-repeat: no-repeat;
        background-position: left;
        height: 26px;
        line-height: 26px;
        background-size: 1em;
        width: 50%;
        float: left;
        text-align: left;
        span {
          font-size: 12px;
          margin-left: 15px
        }
      }
      .distance_img {
        background-image: url(../../assets/icon_distance.png);
      }
      .money_img_black {
        background-image: url(../../assets/icon_cost.png);
      }
      .oil_img_black {
        background-image: url(../../assets/icon_oil.png);
      }
      .time_img_black {
        background-image: url(../../assets/icon_time.png);
      }
      .speed_img_black {
        background-image: url(../../assets/icon_avespeed.png);
      }
      .avgOil_img_black {
        background-image: url(../../assets/icon_aveoil.png);
      }
    }
    .icon_content {
      width: 100%
    }
    .number {
      height: 18px;
      width: 18px;
      background: red;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      position: absolute;
      left: 40px;
      top: -8px;
    }
    .swichDiv {
      height: 20px;
      width: 100%;
      background-color: #ebebeb;
      float: left;
      box-shadow: 0px 1px 0px #91908e;
      position: relative;
      z-index: 10
    }
    .drivingActionDiv {
      display: none;
      height: 60px;
      padding: 10px 0px
    }
    .triangle-up {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #538cd1;
      margin: 0 auto;
      margin-top: 5px
    }
    .triangle-down {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #538cd1;
      margin: 0 auto;
      margin-top: 5px
    }
    .ptDiv {
      position: absolute;
      top: 220px;
      right: 25px;
      width: 36px;
      li {
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        height: 42px;
        background-size: 2.5em;
        float: left;
        position: relative;
      }
      .pt_img {
        background-image: url(../../assets/car_map_park_normal.png);
      }
      .pt_img_normal {
        background-image: url(../../assets/car_map_park_select.png);
      }
      .pt_list {
        background-image: url(../../assets/car_map_park_list_icon.png);
        display: none
      }
    }
  }
</style>
