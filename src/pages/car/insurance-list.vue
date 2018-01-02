<template>
  <section id="insurance-list">
    <!-- <appbar/> -->
    <magic-header titleName="车辆保险"></magic-header>
    <!-- <content-with-loading :loaded="loaded"> -->
      <section class="insurance-item" v-for="item in items" @click="activeDetail(item)">
        <section class="img-wrapper" :style="'background-image:url('+item.image+')'">
        </section>
        <div class="text-wrapper">
          <h4>车险比价购买</h4>
          <p>五大车险比价，直接购买</p>
          <span>五大车险</span>
        </div>
      </section>
      <section class="insurance-item" v-for="item in lists" @click='getzhongAnUri'>
        <section class="img-wrapper" :style="'background-image:url('+item.image+')' ">
        </section>
        <div class="text-wrapper">
          <h4>最优车险方案</h4>
          <p>放心保险，安心用车</p>
          <span>保骉车险</span>
        </div>
      </section>
    <!-- </content-with-loading> -->
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import getUserInfo from 'services/user-info'
  import haibaoBanner from 'assets/haibao_banner.jpg'
  import zhonganBanner from 'assets/zhongan_banner.jpg'
  import insuranceData from 'services/insurance-data'
  // import hybridRouter from 'settings/hybrid-router'
  import calcMethod from 'utilities/calc-method'
  export default {
    components: {
      magicHeader,
      // ContentWithLoading
    },
    data(){
      return {
        items: [{
          // uri:'http://wxxtest.jbx188.com/index',
          uri: 'https://product.haibaobaoxian.com/index',
          image: haibaoBanner,
        }],
        lists: [{
          uri: '',
          //uri: 'https://ztg-uat.zhongan.com/promote/entrance/promoteEntrance.do?promotionCode=INST170686374001&redirectType=h5',
          image: zhonganBanner
        }],
        userInfo: {},
        loaded: false,
        AppKey: '17ce4fd7fb970e9777cf9fb530344c49',
        latitude: '',  //经度
        longitude: '',   //纬度
        hswname: ''
      }
    },
    created(){
      getUserInfo.bind(this)((data) => {
        this.userInfo = data
        this.loaded = true
      }, (err) => {
        console.log(err)
        this.loaded = true
      })
      console.log(this.userInfo.carId)
    },
    methods: {
      activeDetail(item){

        let uri = item.uri + '?pcode=vfac-h5-all&plate=' + this.userInfo.carId + '&ownerName=' + this.userInfo.realName +
          '&ownerPhone=' + this.userInfo.mobile + '&frameCode=' + this.userInfo.carCode + '&engineCode=' + this.userInfo.carEngine
        console.log(uri)
//        this.$router.push({
//          name: 'iframe-content',
//          query: {
//            iframeUri: encodeURIComponent(uri),
//            iframeTitle: '车辆保险',
//            backRouteName: 'insurance-list'
//          }
//        })
        calcMethod({
          native(){
            this.$.push({
              name: 'router_crossWebView',
              query: {
                project: 'threeparties',
                routeAndParams: uri,
                title: '车辆保险'
              }
            })
          },
          wechat(){},
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', item.uri)
          }
        })()
      },
      //向后台请求众安的URL地址
      getzhongAnUri(){
        this.getPosition();
      },
      //众安链接跳转
      activeZhongAn(item){

        calcMethod({
          native(){
            this.$.push({
              name: 'router_crossWebView',
              query: {
                project: 'threeparties',
                routeAndParams: item.uri,
                title: '车辆保险'
              }
            })
          },
          wechat(){},
          browser(){
            console.log('detected in browser, native router cannot be actived, params:', item.uri)
          }
        })()

      },
      getPosition(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.getPositionSuccess, (err) => {
            console.log(err)
            this.getZhongAn()
          }, {
            timeout: 500
          })

        } else {
          alert(' 当前不支持获取地理信息 ');
        }
      },
      //获取当前位置并赋值
      getPositionSuccess(position){
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(222);
        this.getZhongAn(this.latitude, this.longitude)
      },
      getZhongAn(lat, lng){
        var lat = lat || '';
        var lng = lng || ''
        insuranceData.getZhongAnUri.bind(this)({
          'lat': lat.toString(),
          'lng': lng.toString()
        }, (data) => {
          console.log(data)
//            给uri赋值
          this.lists[0].uri = data.uri
//          跳转到uri的页面
          this.activeZhongAn(this.lists[0])
        }, (err) => {
          console.log(err)
        })
      }
    }

  }
</script>

<style lang="scss">
  #insurance-list {
    background: rgb(239, 239, 244) !important;
    .content-wrapper {
      .insurance-item {
        padding-top: 1rem;
        margin-bottom: 1rem;
        background: #fff;
        /*box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);*/
        border-bottom: 1px solid #f8f9fc;
        .img-wrapper {
          margin: 1.5rem;
          padding-top: 45.3%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
        .text-wrapper {
          padding: 0 1.5rem 4rem;
          h4 {
            -webkit-margin-before: 1em;
            -webkit-margin-after: 0.3em;
            font-weight: normal;
            color: #282828;
            font-size: 17px;
          }
          p {
            color: #8f8f8f;
            float: left;
            font-size: 14px;
          }
          span {
            width: 6.5rem;
            height: 2.4rem;
            float: right;
            display: block;
            border: 2px solid #ffaa5e;
            font-size: 10px;
            text-align: center;
            line-height: 2.3rem;
            color: #ffaa5e;
            border-radius: 5px;
          }
        }
      }
    }
  }
</style>
