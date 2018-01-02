<template>
  <section id="car-examinationning" class="bg">
    <!-- <appbar link="car-map" /> -->
    <magic-header titleName="全车体检"></magic-header>
    <div class="results-show">
      <div class="draw-score">
        <mu-circular-progress mode="determinate" :size="120" :strokeWidth="10" :value="score | toNumber" color="#99CC00" />
        <mu-paper class="innermost-layer-paper" circle :zDepth="1">
          <div class="score-top">{{ score }}%</div>
        </mu-paper>
      </div>
      <div class="carbon-emission">
        <span>正在检测中，请耐心等待... ...</span>
      </div>
    </div>
    <div class="results-details" :style="resultsDetailsStyle">
      <mu-list >
        <template v-for="diagFault in diagFaults">
          <mu-list-item :title="diagFault.faultCode" :afterText="diagFault.definition" disabled>
          </mu-list-item>
        </template>
      </mu-list>
    </div>
    <mu-dialog :open="dialogDeviceState" title="温馨提示" @close="dialogDeviceClose">
      绑定设备后才能进行全车体检，您是否现在去绑定设备？
      <mu-flat-button slot="actions" @click="dialogDeviceClose" primary label="放弃操作"/>
      <mu-flat-button slot="actions" primary @click="goBindDevice" label="绑定设备"/>
    </mu-dialog>
    <mu-dialog :open="dialogState" title="温馨提示" @close="dialogClose">
      卡猫建议您在怠速状态下进行车辆检测，您想继续检测吗？
      <mu-flat-button slot="actions" @click="dialogClose" primary label="放弃"/>
      <mu-flat-button slot="actions" primary @click="dialogTrue" label="继续"/>
    </mu-dialog>
    <mu-dialog :open="alertDialogState" title="温馨提示">
      车辆在熄火状态，您将获得最近一次的检测结果。
      <mu-flat-button label="确定" slot="actions" primary @click="alertDialogClose"/>
    </mu-dialog>
    <mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuIcon from 'muse-components/icon'
  // import MuPaper from 'muse-components/paper'
  // import MuCircularProgress from 'muse-components/circularProgress'

  import ListDiagFault from 'services/list-diag-fault'
  import startCarCheck from 'services/start-car-check'
  
  // import MuDialog from 'muse-components/dialog'
  // import MuFlatButton from 'muse-components/flatButton'
  import clientInfo from 'utilities/client-info'
  export default {
    components: {
      magicHeader,
      // MuSnackbar,
      // Appbar,
      // MuList,
      // MuListItem,
      // MuIcon,
      // MuPaper,
      // MuCircularProgress,
      ListDiagFault,
      startCarCheck,
      // MuDialog,
      // MuFlatButton
    },
    data () {
      const countNumber = '1000'
      return {
        countNumber,
        showError:false,
        errorMessage:'',
        score: 0,
        diagFaults: [],
        diagFaultsAll: [],
        carId: '',
        tmpIdx: 0,
        dialogDeviceState: false,
        dialogState: false,
        alertDialogState: false,
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
      carExaminationStart() {
        ListDiagFault.bind(this)({count: this.countNumber},(data)=>{
          this.diagFaultsAll = data.ListDiagFault
          this.runTimer()
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      dialogDeviceClose() {
        this.dialogDeviceState = false
        this.$router.push({
          name: 'car-map'
        });
      },
      goBindDevice() {
        this.dialogDeviceState = false
        this.$router.push({
          name: 'bind-device',
          query: {
            id: this.carId
          }
        });
      },
      dialogTrue() {
        this.dialogState = false
        ListDiagFault.bind(this)({count: this.countNumber},(data)=>{
          this.diagFaultsAll = data.ListDiagFault
          this.runTimer()
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      dialogClose() {
        this.dialogState = false
        this.$router.push({
          name: 'car-map'
        });
      },
      alertDialogClose() {
        this.alertDialogState = false
        this.$router.push({
          name: 'car-examination',
          query: {
            id: this.carId
          }
        });
      },
      runTimer() {
        this.tmpIdx = 0
        this.callIdx = 0
        this.timer = setInterval(() => {
          this.tmpIdx += 1
          this.callIdx += 1
          if (this.tmpIdx == 5) {
            this.score += 1
            this.tmpIdx = 0
          }
          if ((this.callIdx%100) == 0) {
            startCarCheck.bind(this)({carId: this.carId,type: '1'},(data)=>{
              console.log(data)
              if (data.resultCode == '100') {
                clearInterval(this.timer)
                this.$router.push({
                  name: 'car-examination',
                  query: {
                    id: this.carId
                  }
                });
              }
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })
          }
          this.diagFaults.unshift(this.diagFaultsAll.shift())
          if (this.score > 99) clearInterval(this.timer)
        }, 10)
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    },
    filters: {
      toNumber: function (val) {
        return Number(val)
      }
    },
    computed:{
    },
    created(){
      this.score = 0
      this.diagFaults = []
      this.carId = this.$route.query.id
      
      startCarCheck.bind(this)({carId: this.carId,type: '0'},(data)=>{
        console.log(data)
        if (data.resultCode == '140' || data.resultCode == '142' || data.resultCode == '143') {
          // 如果车辆没有绑定设备
          this.dialogDeviceState = true
        } else if (data.resultCode == '281') {
          // 如果车辆在行驶中
          this.dialogState = true
        } else if (data.resultCode == '202') {
          // 如果车辆在熄火状态
          this.alertDialogState = true
        } else if (data.resultCode == '100') {
          // 车辆Check正常
          this.carExaminationStart()
        }

      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
        this.dialogState = false
        this.$router.push({
          name: 'car-map'
        });
      })
    },
    watch:{
      '$route':function(to,from){
        if ((from.name != 'car-examination' && from.name != 'test') && to.name == 'car-examinationning') {
          this.score = 0
          this.diagFaults = []
          this.carId = this.$route.query.id
          startCarCheck.bind(this)({carId: this.carId,type: '0'},(data)=>{
            console.log(data)
            if (data.resultCode == '140' || data.resultCode == '142' || data.resultCode == '143') {
              // 如果车辆没有绑定设备
              this.dialogDeviceState = true
            } else if (data.resultCode == '281') {
              // 如果车辆在行驶中
              this.dialogState = true
            } else if (data.resultCode == '202') {
              // 如果车辆在熄火状态
              this.alertDialogState = true
            } else if (data.resultCode == '100') {
              // 车辆Check正常
              this.carExaminationStart()
            }
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
            this.dialogState = false
            this.alertDialogState = false
            this.$router.push({
              name: 'car-map'
            });
          })
        }
        if ((from.name == 'car-examination' || from.name == 'test') && to.name == 'car-examinationning') {
          this.$router.push({
            name: 'car-map'
          });
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../scss/variables.scss";
  #car-examinationning .results-show {
    width:100%;
    height:300px;
    background:#548CD1;
    z-index:200;
    position:fixed;
    text-align: center;
  }
  // #car-examinationning .results-details {
  //   padding-top: 355px;
  // }
  #car-examinationning .mu-list {
    padding-left: 10px;
  }
  #car-examinationning .mu-item {
    padding: 0rem 0rem 0rem 1rem;
    min-height: 30px;
  }
  #car-examinationning .mu-item-title {
    color: rgba(0, 0, 0, 0.54);
    font-size: 15px;
  }
  #car-examinationning .mu-item-after {
    position: absolute;
    margin-left: 60px;
  }
  #car-examinationning .innermost-layer-paper {
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
  #car-examinationning .score-top {
    margin-top: 25px;
    font-size: 35px;
  }
  #car-examinationning .draw-score {
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
  #car-examinationning .mu-circular-progress-determinate {
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
  #car-examinationning .mu-circular-progress-determinate-path {
    stroke-linecap: butt;
  }
  #car-examinationning .carbon-emission {
    position: absolute;
    top: 0px;
    bottom:0px;
    left:0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 230px;
    color: #ffffff;
  }

</style>
