<template>
  <section id="car-examination" class="bg">
    <!-- <appbar link="car-map" /> -->
    <magic-header titleName="全车体检"></magic-header>
    <div class="results-show">
      <div class="draw-score">
        <mu-circular-progress mode="determinate" :size="120" :strokeWidth="10" :value="examinationResult.score | toNumber" color="#99CC00" />
        <mu-paper class="innermost-layer-paper" circle :zDepth="1">
          <div class="score-top">{{ examinationResult.score }}</div>
          <div class="score-bottom">分</div>
        </mu-paper>
      </div>
      <div class="carbon-emission">
        <span>碳排放参考值：{{ examinationResult.carbonEmission }}Kg</span>
      </div>
      <div class="five-star">
        <five-star-assessment :score="examinationResult.score | toNumber" color="#FFAE00" :size="22"/>
      </div>
    </div>
    <div class="results-details" :style="resultsDetailsStyle">
      <mu-list  @change="itemSelected">
        <template v-for="fault in examinationResult.carFaults">
          <mu-list-item :value="fault" :title="fault.type | formatName" :herf="fault.path" v-if="fault.type!=6&&fault.type!=7&&fault.type!=8">
            <mu-badge v-if="fault.count!=0" :content="fault.count" circle secondary slot="right" color="red"></mu-badge>
            <mu-icon v-if="fault.count==0" value="check_circle" color="green"  slot="right" />
            <i class="mu-icon material-icons" slot="right" style="font-size: 24px; width: 24px; height: 24px;">keyboard_arrow_right</i>
          </mu-list-item>
          <mu-list-item :value="fault" :title="fault.type | formatName" :herf="fault.path" v-if="fault.type==6||fault.type==7||fault.type==8">
            <div class="mu-item-right item-message-right" v-if="fault.count==1"> <span>{{ fault.type | changeItemMessage }}</span></div>
            <mu-icon v-if="fault.count==0" value="check_circle" color="green"  slot="right" />
            <mu-icon v-if="fault.count==1" value="help" color="#BCBCBC"  slot="right" />
            <mu-icon v-if="fault.count==2" value="error" color="#FFB400"  slot="right" />
            <i class="mu-icon material-icons" slot="right" style="font-size: 24px; width: 24px; height: 24px;">keyboard_arrow_right</i>
          </mu-list-item>
        </template>
      </mu-list>
    </div>
    <mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuIcon from 'muse-components/icon'
  // import MuBadge from 'muse-components/badge'
  // import MuPaper from 'muse-components/paper'
  // import MuCircularProgress from 'muse-components/circularProgress'
  import carExaminationInfo from 'services/car-examination-info'
  import startCarCheck from 'services/start-car-check'
  import dateFormat from 'utilities/date-format'
  import getCarExaminationTypeName from 'utilities/get-car-examination-type-name'
  import FiveStarAssessment from 'components/five-star-assessment'
  import clientInfo from 'utilities/client-info'
  export default {
    components: {
      magicHeader,
      // MuSnackbar,
      // Appbar,
      // MuList,
      // MuListItem,
      // MuIcon,
      // MuBadge,
      // MuPaper,
      // MuCircularProgress,
      carExaminationInfo,
      startCarCheck,
      FiveStarAssessment
    },
    data () {
      return {
        showError:false,
        errorMessage:'',
        carFaultPath: '',
        examinationResult: {},
        carId: '',
        resultsDetailsStyle: {padding: 'initial'}
      }
    },
    mounted(){
      if(clientInfo.render.isWechatWebView){
        this.resultsDetailsStyle.padding = '300px 0px 0px 0px'
      } else {
        this.resultsDetailsStyle.padding = '356px 0px 0px 0px'
      }
    },
    methods: {
      itemSelected (val) {
        console.log(val)
        if (val.type == 5) {
          // 跳转到驾驶成就
          this.$router.push({
            name: 'drive-achievement',
            query: {
              id: this.carId
            }
          });
        } else if (val.type == 6) {
          if (val.count == 1) {
            // 跳转到车辆年检信息填写界面
            this.$router.push({
              name: 'mot-information',
              query: {
                id: 'car-examination'
              }
            });
          } else {
            // 跳转到车辆年检已过期提示界面
            this.$router.push({
              name: 'mot-information',
              query: {
                id: 'car-examination'
              }
            });
          }
        } else if (val.type == 7) {
          if (val.count == 1) {
            // 跳转到车辆保养信息填写界面
            this.$router.push({
              name: 'maintain-information',
              query: {
                id: this.carId
              }
            });
          } else {
            // 跳转到车辆保养已过期提示界面
            this.$router.push({
              name: 'maintain-information',
              query: {
                id: this.carId
              }
            });
          }
        } else if (val.type == 8) {
          if (val.count == 1) {
            // 跳转到车辆保险信息填写界面
            this.$router.push({
              name: 'insurance-information',
              query: {
                id: this.carId
              }
            });
          } else {
            // 跳转到车辆保险已过期提示界面
            this.$router.push({
              name: 'insurance-information',
              query: {
                id: this.carId
              }
            });
          }
        } else {
          let fullUrl=val.path,
              splitUrl=fullUrl.split('#')
          this.$router.push({
            name: 'article-show',
            query: {
              articleUrl: splitUrl[0],
              articlePageId:splitUrl[1] || '',
              title:'车辆体检报告'
            }
          });
        }
      }
    },
    filters: {
      toNumber: function (val) {
        return Number(val)
      },
      formatName: function (val) {
        return getCarExaminationTypeName(val)
      },
      changeItemMessage (val) {
        switch (Number(val)) {
          case 6:
            return '请完善年检信息'
          case 7:
            return '请完善保养信息'
          case 8:
            return '请完善保险信息'
          default:
            return ''
        }
      }
    },
    computed:{
    },
    created(){
      this.carId = this.$route.query.id
      var dateTime = dateFormat.getNowDateTime()
      carExaminationInfo.bind(this)({carId: this.carId,beginTime: dateTime,endTime: dateTime},(data)=>{
        this.examinationResult=data
        console.log(this.examinationResult)
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    watch:{
      '$route':function(to,from){
        if ((from.name != 'article-show' && from.name != 'test') && to.name == 'car-examination') {
          this.carId = this.$route.query.id
          var dateTime = dateFormat.getNowDateTime()
          carExaminationInfo.bind(this)({carId: this.carId,beginTime: dateTime,endTime: dateTime},(data)=>{
            this.examinationResult=data
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../scss/variables.scss";
  #car-examination .results-show {
    width:100%;
    height:300px;
    background:#548CD1;
    z-index:200;
    position:fixed;
    text-align: center;
  }
  // #car-examination .results-details {
  //   padding-top: 355px;
  // }
  #car-examination .mu-item-right {
    width: 60px;
  }
  #car-examination .mu-list {
    padding-left: 10px;
  }
  #car-examination .innermost-layer-paper {
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 13px;
    display: inline-block;
    height: 100px;
    width: 100px;
    text-align: center;
    color: #99CC00;
    position: absolute;
  }
  #car-examination .score-top {
    margin-top: 20px;
    font-size: 35px;
  }
  #car-examination .score-bottom {
    font-size: 15px;
    margin-top: -15px;
  }
  #car-examination .draw-score {
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    height: 136px;
    width: 136px;
    position: relative;
    text-align: center;
    border:5px solid #ffffff;
    margin-top: 60px;
    border-radius: 50%;
  }
  #car-examination .mu-circular-progress-determinate {
    position: absolute;
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3px;
    transform: rotate(-90deg);
  }
  #car-examination .mu-circular-progress-determinate-path {
    stroke-linecap: butt;
  }
  #car-examination .carbon-emission {
    position: absolute;
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 200px;
    color: #ffffff;
  }
  #car-examination .five-star {
    position: absolute;
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 220px;
  }
  #car-examination .item-message-right {
    color: #BCBCBC;
    width: 100px;
    right: 70px;
  }
</style>
