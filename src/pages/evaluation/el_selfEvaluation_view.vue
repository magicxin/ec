<template>
  <div id="el_selfEvaluation_view" class="background-gray">
    <my-header mainText="我的评价" textColor="#474747" bgColor="#F7F7F7">
      <img :src="left" alt="返回">
    </my-header>
    <form action="">
      <div v-for="(item, index) in queryList.orderItems" :key="index">
        <panel :value="item.product">
          <div slot="desc" class='desc'>
            {{item.desc}}
          </div>
          <price slot="price" :value="item.price"></price>
        </panel>
        <div layout="column" layout-align="center flex-start" class="evaluation-content" v-if="item.product">
          <div flex class="content-score">
            商品评分
            <mu-radio label="好评" nativeValue="5" v-model="queryList.reviews[index].score"
                      uncheckIcon="panorama_fish_eye" checkedIcon="check_circle" disabled/>
            <mu-radio label="中评" nativeValue="3" v-model="queryList.reviews[index].score"
                      uncheckIcon="panorama_fish_eye" checkedIcon="check_circle" disabled/>
            <mu-radio label="差评" nativeValue="1" v-model="queryList.reviews[index].score"
                      uncheckIcon="panorama_fish_eye" checkedIcon="check_circle" disabled/>
          </div>
          <div flex class="content-text">
            <textarea type="text" placeholder="来分享您的使用感受吧..." class="content-text-area"
                      v-model="queryList.reviews[index].content" maxlength="100" disabled></textarea>
            <span class="text-help-block">100字</span>
          </div>
          <ul class="img-box">
            <li v-for="(item,key) in queryList.reviews[index].images" :key="key">
              <!-- 图片可点击放大 -->
              <magic-image :bigImage="[removeHost(item)]"></magic-image>
            </li>
          </ul>
        </div>
      </div>
      <div layout="column" layout-align="center flex-start" class="evaluation-content service-score">
          <div flex class="content-score">
            店铺评分
          </div>
          <div flex class="content-score">
            服务态度
            <a v-for="(val, key) in queryList.serviceAttitudeStartList" :key="key">
              <mu-icon value="star" v-if="val"></mu-icon>
              <mu-icon value="star_border" v-else></mu-icon>
            </a>
          </div>
          <div flex class="content-score">
            服务速度
            <a v-for="(val, key) in queryList.serviceSpeedStartList" :key="key">
              <mu-icon value="star" v-if="val"></mu-icon>
              <mu-icon value="star_border" v-else></mu-icon>
            </a>
          </div>
          <div flex class="content-score">
            专业技能
            <a v-for="(val, key) in queryList.professionalStartList" :key="key">
              <mu-icon value="star" v-if="val"></mu-icon>
              <mu-icon value="star_border" v-else></mu-icon>
            </a>
          </div>
        </div>
    </form>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  import model from 'components/model'
  import panel from 'components/panel'
  import foot from 'components/foot'
  import price from 'components/price'
  import orderButton from 'components/order-button'
  import left from 'assets/left-gray.svg'
  import starYellow from 'assets/star-yellow.svg'
  import borderYellow from 'assets/star-border-yellow.svg'
  import magicImage from 'components/image/ma_image'

  import closeImg from 'assets/close.svg'


  let cache = {}
  let cacheBase64


  let startList = [true, true, true, true, true, false, false, false, false, false]
  export default {
    name: 'el_selfEvaluation_view',
    data () {
      return {
        closeImg,
        left,
        starYellow,
        borderYellow,
        startList: [true, true, true, true, true, false, false, false, false, false],
        queryList: {},
        isShow: false,
        test: []
      }
    },
    // this.queryList.reviews[params.index].images = resp.data.urls

    methods: {
      // 为了兼容magic-image组件中对图片地址的addpath处理, 此处追加一个去除host的方法
      removeHost(hostPreUrl){
        let a = document.createElement('a')
        a.href = hostPreUrl
        return a.pathname
      }
    },
    mounted () {
      this.startList = startList.slice(5)
    },
    beforeRouteEnter (to, from, next) {
      let carItem = JSON.parse(to.query.orderItem)
      let desc
      carItem.reviews = []
      carItem.orderItems.forEach(order => {
        desc = ''
        let child = order.product ? order.product.specificationValues : []
        child.length > 0 &&
        child.forEach(type => {
          desc = desc + type.specificationData.name + ':' + type.name + ' '
        })
        // order.desc = desc
        order.desc = desc == "" ? order.name : order.product.desc;
        carItem.reviews.push({
          startList: startList.slice(0, 5),
          score: '5'
        })
      })
      next(vm => {
        vm.queryList = carItem
      })
    },
    created () {
      this.$nextTick(() => {
        let orderId = this.queryList.id
        this.$.get({
          orderId: orderId,
          methodName: 'QueryOrderReview'
        }).then(resp => {
          if (resp.data.reviews.length > 0) {
            resp.data.reviews.map((item) => {
              item.score = item.score + ''
            })
            this.queryList.reviews = resp.data.reviews
            this.queryList.reviews.forEach((item) => {
              item.images.forEach((value, index) => {
                item.images[index] = this.addPath(value)
              })
            })
          }
          if (resp.data.serviceAttitude) {
            this.queryList.serviceAttitude = resp.data.serviceAttitude
            startList.splice(this.queryList.serviceAttitude, 5)
            this.queryList.serviceAttitudeStartList = startList
            startList = [true, true, true, true, true, false, false, false, false, false]
          }
          if (resp.data.serviceSpeed) {
            this.queryList.serviceSpeed = resp.data.serviceSpeed
            startList.splice(this.queryList.serviceSpeed, 5)
            this.queryList.serviceSpeedStartList = startList
            startList = [true, true, true, true, true, false, false, false, false, false]
          }
          if (resp.data.professional) {
            this.queryList.professional = resp.data.professional
            startList.splice(this.queryList.professional, 5)
            this.queryList.professionalStartList = startList
            startList = [true, true, true, true, true, false, false, false, false, false]
          }
        })
      })
    },
    components: {
      myHeader,
      panel,
      foot,
      orderButton,
      price,
      model,
      magicImage
    }
  }
</script>

<style>
  #el_selfEvaluation_view .close {
    position: absolute;
    right: -10px;
    top: -5px;
    border: none;
  }

  /*#el_selfEvaluation_view i{
    color: #FFE434;
  }*/

  #el_selfEvaluation_view i {
    color: #FFAD00 !important;
  }

  #el_selfEvaluation_view textarea[placeholder] {
    font-size: 14px;
    text-indent: 0px
  }

  #el_selfEvaluation_view .evaluation-content {
    margin-top: 8px;
    padding: 18px;
    background-color: #fff;
  }

  #el_selfEvaluation_view .evaluation-content .img-box {
    padding: 10px;
  }

  #el_selfEvaluation_view .evaluation-content .img-box li {
    width: 30%;
    float: left;
    margin: 0 3px;
  }

  #el_selfEvaluation_view .evaluation-content .img-box li img {
    width: 100%;
  }

  #el_selfEvaluation_view .content-score {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  #el_selfEvaluation_view .content-score img {
    padding-left: 10px;
  }

  #el_selfEvaluation_view .content-text {
    position: relative;
    width: 100%;
  }

  #el_selfEvaluation_view .content-text-area {
    width: 100%;
    min-height: 100px;
    border: 1px solid #7fa9dd;
    padding: 8px;
    margin: 16px 0 8px 0;
    resize: none;
  }

  #el_selfEvaluation_view .text-help-block {
    position: absolute;
    right: 10px;
    bottom: 18px;
    font-size: 14px;
    color: #929292;
  }

  #el_selfEvaluation_view .content-img {
    width: 20%;
    padding: 8px 0 3px 0;
    margin-right: 1.33%;
    position: relative;
  }

  #el_selfEvaluation_view .content-img i {
    position: absolute;
    right: -10px;
    top: -5px;
    color: black !important;
    z-index: 2;
    /*background-color: black;*/
  }

  #el_selfEvaluation_view .content-img img {
    border: 1px solid #98bae4;
  }

  #el_selfEvaluation_view .no-margin {
    margin-right: 0;
  }

  #el_selfEvaluation_view .foot-button {
    margin-right: 10px;
    font-weight: 300;
  }

  #el_selfEvaluation_view .img-container {
    width: 80px;
    /*overflow: hidden;*/
    height: 120px;
  }

  #el_selfEvaluation_view .service-score {
    margin: 16px 0 8px 0;
  }

  #el_selfEvaluation_view .service-score .content-score:first-child {
    margin-bottom: 8px;
  }

  #el_selfEvaluation_view .content-score .mu-radio .mu-radio-icon {
    margin: 0px;
  }

  #el_selfEvaluation_view .content-score .mu-radio {
    margin-left: 20px;
  }

  #el_selfEvaluation_view #foot {
    position: static;
  }
</style>
