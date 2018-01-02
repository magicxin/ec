<template>
	<section id="map">
		<div id="map-container"></div>
    <div style="position:absolute;top:10px;right:0px">
    <span style="display:block">
      <img src="../../assets/car_phone_position_icon_normal.png">
    </span>  
    <span style="display:block" @click="carList">
      <img src="../../assets/car_list_icon_normal.png">
    </span>
    <span style="display:block">
      <img src="../../assets/car_fence_icon_normal.png">
    </span>
    <span style="display:block">
      <img src="../../assets/car_navi_icon_normal.png">
    </span>
    <div class="hidden" id="hidden">
      <table width='100%' border='0' cellspacing='0' cellpadding='0'>
          <tbody>
         <div class='zbtn'><div onclick=''><i class='icon-lightbulb'></i></div></div>
            <tr>
              <td></td>
              <td>
               <div class='map_ceng_box'>
            <table class='map_ceng_tittle' width='100%' border='0' cellspacing='0' cellpadding='0'>
              <tbody>
                <tr>
                   <td width='30'>&nbsp;&nbsp;<img src=''></td><td>123456</td>
                </tr>
              </tbody>
            </table></div>
            <table class='map_ceng_text'  width='100%' border='0' cellspacing='0' cellpadding='0'>
          <tbody>
            <tr>
              <td>车主：11111</td>
              <td>电话：1234567890</td>
            </tr>
            <tr>
              <td>状态</td>
              <td>车速：120km/h</td>
            </tr>
            <tr>
              <td>经度：1111111</td>
              <td>纬度：22222</td>
            </tr>
            <tr>
              <td colspan='2'>位置：213131321321313</td>
              </tr>
            <tr>
              <td>
                    <a href='' target='_blank'>
                        <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
           </table></a></td> </tr></tbody>
           <tbody>
            <tr>
              <td><img src='../../assets/popup_icon_guiji.png' width='23' height='21' alt=''/></td>
              <td style='font-size:12px;padding-right:10px'>行车轨迹</td>
            </tr>
          </tbody>
                </table>
                    </a>
              </td>
              <td><a href='javascript:;' onclick='' onmouseout='heightchange4()'>
                <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
                  <tbody>
                    <tr>
                      <td style='padding-left:30px'><img src='../../assets/popup_icon_yibiao.png' width='23' height='21' alt=''/></td>
                      <td style='font-size:12px;padding-left:0px'>车辆仪表</td>
                    </tr>
                  </tbody>
                </table>
              </a></td>
            </tr>
            <tr>
              <td><a href='javascript:;' onclick=''>
                <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
                  <tbody>
                    <tr>
                      <td><img src='../../assets/popup_icon_jiluyi.png' width='23' height='21' alt=''/></td>
                      <td style='font-size:12px;padding-right:10px'>记录仪</td>
                    </tr>
                  </tbody>
                </table>
              </a></td>
              <td><a href='' target='_blank'>
                <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
                  <tbody>
                    <tr>
                      <td style='padding-left:30px'><img src='../../assets/popup_icon_dingwei.png' width='23' height='21' alt=''/></td>
                      <td style='font-size:12px;padding-left:0px'>实时定位</td>
                    </tr>
                  </tbody>
                </table>
              </a></td>
            </tr>
             <tr>
              <td><a href='javascript:;' onclick='' onmouseout='heightchange5()'>
                <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
                  <tbody>
                    <tr>
                      <td><img src='../../assets/popup_icon_tongji.png' width='23' height='21' alt=''/></td>
                      <td style='font-size:12px;padding-right:10px'>统计分析</td>
                    </tr>
                  </tbody>
                </table>
              </a></td>
              <td><a href='javascript:;' onclick=''>
                <table  class='map_btn01' width='100%' border='0' cellspacing='0' cellpadding='0'>
                  <tbody>
                    <tr>
                      <td style='padding-left:30px'><img src='../../assets/popup_icon_tijian.png' width='23' height='21' alt=''/></td>
                      <td style='font-size:12px;padding-left:0px'>车辆体检</td>
                    </tr>
                  </tbody>
                </table>
              </a></td>
            </tr>
          </tbody>
      </table>
    </div>
  </div>
	</section>
</template>
<script>
// import AMap from 'AMap'
// console.log(AMap)
// import ContentWithLoading from 'components/content-with-loading'
export default {
  components: {
    // ContentWithLoading,
  },
  data() {
    return {
      opts: {},
      loaded: true
    };
  },
  mounted() {
    console.log("**********************");
    const map = new BMap.Map("map-container");
    const point = new BMap.Point(116.417854, 39.921988);
    const marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.centerAndZoom(point, 15);
    const infoWindow = new BMap.InfoWindow(this.opts); // 创建信息窗口对象
    marker.addEventListener(
      "click",
      function(e) {
        const p = e.target;
        //document.getElementById('hidden').style.display='block';
        const content = document.getElementById("hidden").innerHTML;
        const point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        const infoWindow = new BMap.InfoWindow(content, this.opts); // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
        //this.openInfo("111",e);
      }.bind(this)
    );
  },
  methods: {
    carList() {
      this.$router.push({ name: "car-list" });
    }
  }
};
</script>
<style lang="scss">
@import "../../scss/style.scss";
#map {
  #map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    font-family: "微软雅黑";
  }
  .hidden {
    display: none;
  }
}
</style>