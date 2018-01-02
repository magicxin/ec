<template>
  <section id="driving-record" class="bg">
    <!-- <appbar link="car-map"/> -->
    <magic-header titleName="行车记录"></magic-header>
    <div class="driving-record-shots">
      <img class="pic-car" src="../../assets/driving_record_car.png" />
      <img class="line-left" src="../../assets/driving_record_line_left.png" />
      <img class="line-right" src="../../assets/driving_record_line_right.png" />
      <img class="icon-video-left" src="../../assets/driving_record_icon_video.png" @click="shootingFrontVideoStart" />
      <img class="icon-photo-left" src="../../assets/driving_record_icon_photo.png" @click="shootingFrontPictureStart" />
      <img class="icon-video-right" src="../../assets/driving_record_icon_video.png" @click="shootingBackVideoStart" />
      <img class="icon-photo-right" src="../../assets/driving_record_icon_photo.png" @click="shootingBackPictureStart" />
    </div>
    <div class="results-details-none" :style="resultsDetailsStyle" v-if="recordContents.length == 0">
      <div class="results-none">
        <img class="results-none-img" src="../../assets/result-list-none.png" />
        <span class="results-none-span">您还没有行车记录！</span>
      </div>
    </div>
    <div class="results-details" :style="resultsDetailsStyle" v-if="recordContents.length != 0">
      <driving-record-list v-for="recordContent in recordContents" :recordDate="recordContent.drivingRecordsDate" :key="recordContent" :recordContents="recordContent.drivingRecordDateList" @click="itemClick"  />
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
    </div>
    <div class="load-animation" :style="loadAnimationTopStyle" v-if="loaded">
      <div class="load-animation-message">
        <div class="load-animation-content">
          <mu-circular-progress :size="50" :strokeWidth="3" color="#fff"/>
          <span class="load-content">拍 摄 处 理 中 ...</span>
        </div>
      </div>
    </div>
    <mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>
  </section>
</template>
<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuIcon from 'muse-components/icon'
  // import MuCircularProgress from 'muse-components/circularProgress'
	// import MuSnackbar from 'muse-components/snackbar'
  import DrivingRecordList from 'components/driving-record-list'
  import ListDrivingRecord from 'services/list-driving-record'
  import DrivingRecordShot from 'services/driving-record-shot'
  // import MuInfiniteScroll from 'muse-components/infiniteScroll'
  import clientInfo from 'utilities/client-info'
  import funckingErrorMessage from 'services/fucking-error-message'
  export default {
    components: {
      magicHeader,
      // MuList,
      // MuListItem,
      // MuIcon,
      // MuCircularProgress,
      // MuSnackbar,
      DrivingRecordList,
      ListDrivingRecord,
      DrivingRecordShot,
      // MuInfiniteScroll,
      funckingErrorMessage
    },
    data () {
      const pageCount = '10'
      return {
        pageCount,
        recordDate: '',
        oldRecordList: [],
        recordContents: [],
        showError:false,
        errorMessage:'',
        loading: false,
        scroller: null,
        carId: '',
        loaded: true,
        resultsDetailsStyle: {margin: 'initial'},
        loadAnimationTopStyle: {top: '0px'}
      }
    },
    mounted () {
      this.scroller = this.$el
      if(clientInfo.render.isWechatWebView){
        this.resultsDetailsStyle.margin = '130px 0px 0px 0px'
        this.loadAnimationTopStyle.top = '0px'
      } else {
        this.resultsDetailsStyle.margin = '186px 0px 0px 0px'
        this.loadAnimationTopStyle.top = '45px'
      }
    },
    methods: {
      loadMore() {
        if (this.loading == false) {
          this.loading = true
          setTimeout(() => {
            ListDrivingRecord.bind(this)({carId: this.carId,beginTime: this.recordDate,count: this.pageCount},(data)=>{
              if (data.length != 0 && data.listDrivingRecord.length != 0) {
                for (var i=0;i<data.listDrivingRecord.length;i++) {
                  this.oldRecordList.push(data.listDrivingRecord[i])
                }
                this.recordContents =this.formatReturnList(this.oldRecordList)
                this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
              }
              this.loading = false
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })
            this.loading = false
          }, 2000)
        }
      },
      formatReturnList(originalData){
        var oldDate = ''
        var drivingRecords = []
        var drivingRecordItem = {
          drivingRecordsDate: '',
          drivingRecordDateList: []
        }
        for (var i=0;i<originalData.length;i++)
        {
          if (oldDate != originalData[i].beginTime.substring(0,10)) {
            if (oldDate != '') {
              drivingRecords.push(drivingRecordItem)
              drivingRecordItem = {
                drivingRecordsDate: '',
                drivingRecordDateList: []
              }
            }
            drivingRecordItem.drivingRecordsDate = originalData[i].beginTime.substring(0,10)
            drivingRecordItem.drivingRecordDateList.push(originalData[i])
            oldDate = drivingRecordItem.drivingRecordsDate
          } else {
            drivingRecordItem.drivingRecordDateList.push(originalData[i])
          }
        }
        drivingRecords.push(drivingRecordItem)
        return drivingRecords
      },
      shootingFrontVideoStart() {
        console.log('开始拍摄前方视频')
        this.loaded = true
        DrivingRecordShot.bind(this)({carId: this.carId,type: '1',channelType: '0'},(data)=>{
          this.indexTmp = 0
          if (data.resultCode == '100') {
            this.intervalid1 = setInterval(() => {
              this.indexTmp++
              // console.log(this.indexTmp)
              ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
                // console.log(data.listDrivingRecord[0])
                if (data.listDrivingRecord.length == 0) {
                  // this.recordContents = []
                  if (this.indexTmp == 5) {
                    clearInterval(this.intervalid1)
                    this.loaded = false
                    this.errorMessage='前方视频拍摄超时'
                    this.showError=true
                  }
                } else {
                  if (this.oldRecordList[0].beginTime != data.listDrivingRecord[0].beginTime) {
                    clearInterval(this.intervalid1)
                    this.loaded = false
                    this.oldRecordList = data.listDrivingRecord
                    this.recordContents = this.formatReturnList(data.listDrivingRecord)
                    this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
                  } else if (this.indexTmp == 5) {
                    clearInterval(this.intervalid1)
                    this.loaded = false
                    this.errorMessage='前方视频拍摄超时'
                    this.showError=true
                  }
                }
              },(errorMessage)=>{
                clearInterval(this.intervalid1)
                this.loaded = false
                this.errorMessage=errorMessage
                this.showError=true
              })
            }, 15000)
            // setTimeout(() => {
            //   ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
            //     this.loaded = false
            //     if (data.listDrivingRecord.length == 0) {
            //       this.recordContents = []
            //     } else {
            //       this.oldRecordList = data.listDrivingRecord
            //       this.recordContents =this.formatReturnList(data.listDrivingRecord)
            //       this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
            //     }
            //   },(errorMessage)=>{
            //     this.loaded = false
            //     this.errorMessage=errorMessage
            //     this.showError=true
            //   })
            // }, 5000)
          } else {
            this.loaded = false
            this.errorMessage=funckingErrorMessage[data.resultCode]
            this.showError=true
          }
        },(errorMessage)=>{
          this.loaded = false
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      shootingBackVideoStart() {
        console.log('开始拍摄后方视频')
        this.loaded = true
        DrivingRecordShot.bind(this)({carId: this.carId,type: '1',channelType: '1'},(data)=>{
          this.indexTmp = 0
          if (data.resultCode == '100') {
            this.intervalid2 = setInterval(() => {
              this.indexTmp++
              // console.log(this.indexTmp)
              ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
                if (data.listDrivingRecord.length == 0) {
                  // this.recordContents = []
                  if (this.indexTmp == 5) {
                    clearInterval(this.intervalid2)
                    this.loaded = false
                    this.errorMessage='后方视频拍摄超时'
                    this.showError=true
                  }
                } else {
                  if (this.oldRecordList[0].beginTime != data.listDrivingRecord[0].beginTime) {
                    clearInterval(this.intervalid2)
                    this.loaded = false
                    this.oldRecordList = data.listDrivingRecord
                    this.recordContents = this.formatReturnList(data.listDrivingRecord)
                    this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
                  } else if (this.indexTmp == 5) {
                    clearInterval(this.intervalid2)
                    this.loaded = false
                    this.errorMessage='后方视频拍摄超时'
                    this.showError=true
                  }
                }
              },(errorMessage)=>{
                clearInterval(this.intervalid2)
                this.loaded = false
                this.errorMessage=errorMessage
                this.showError=true
              })
            }, 15000)
            // setTimeout(() => {
            //   ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
            //     this.loaded = false
            //     if (data.listDrivingRecord.length == 0) {
            //       this.recordContents = []
            //     } else {
            //       this.oldRecordList = data.listDrivingRecord
            //       this.recordContents =this.formatReturnList(data.listDrivingRecord)
            //       this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
            //     }
            //   },(errorMessage)=>{
            //     this.loaded = false
            //     this.errorMessage=errorMessage
            //     this.showError=true
            //   })
            // }, 5000)
          } else {
            this.loaded = false
            this.errorMessage=funckingErrorMessage[data.resultCode]
            this.showError=true
          }
        },(errorMessage)=>{
          this.loaded = false
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      shootingFrontPictureStart() {
        console.log('开始拍摄前方照片')
        this.loaded = true
        DrivingRecordShot.bind(this)({carId: this.carId,type: '0',channelType: '0'},(data)=>{
          this.indexTmp = 0
          if (data.resultCode == '100') {
            this.intervalid3 = setInterval(() => {
              this.indexTmp++
              // console.log(this.indexTmp)
              ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
                if (data.listDrivingRecord.length == 0) {
                  // this.recordContents = []
                  if (this.indexTmp == 3) {
                    clearInterval(this.intervalid3)
                    this.loaded = false
                    this.errorMessage='前方照片拍摄超时'
                    this.showError=true
                  }
                } else {
                  if (this.oldRecordList[0].beginTime != data.listDrivingRecord[0].beginTime) {
                    clearInterval(this.intervalid3)
                    this.loaded = false
                    this.oldRecordList = data.listDrivingRecord
                    this.recordContents = this.formatReturnList(data.listDrivingRecord)
                    this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
                  } else if (this.indexTmp == 3) {
                    clearInterval(this.intervalid3)
                    this.loaded = false
                    this.errorMessage='前方照片拍摄超时'
                    this.showError=true
                  }
                }
              },(errorMessage)=>{
                clearInterval(this.intervalid3)
                this.loaded = false
                this.errorMessage=errorMessage
                this.showError=true
              })
            }, 3000)
              // setTimeout(() => {
              //   ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
              //     this.loaded = false
              //     if (data.listDrivingRecord.length == 0) {
              //       this.recordContents = []
              //     } else {
              //       this.oldRecordList = data.listDrivingRecord
              //       this.recordContents = this.formatReturnList(data.listDrivingRecord)
              //       this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
              //     }
              //   },(errorMessage)=>{
              //     this.errorMessage=errorMessage
              //     this.showError=true
              //   })
              // }, 3000)
          } else {
            this.loaded = false
            this.errorMessage=funckingErrorMessage[data.resultCode]
            this.showError=true
          }
        },(errorMessage)=>{
          this.loaded = false
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      shootingBackPictureStart() {
        console.log('开始拍摄后方照片')
        this.loaded = true
        DrivingRecordShot.bind(this)({carId: this.carId,type: '0',channelType: '1'},(data)=>{
          this.indexTmp = 0
          if (data.resultCode == '100') {
            this.intervalid4 = setInterval(() => {
              this.indexTmp++
              // console.log(this.indexTmp)
              ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
                if (data.listDrivingRecord.length == 0) {
                  // this.recordContents = []
                  if (this.indexTmp == 3) {
                    clearInterval(this.intervalid4)
                    this.loaded = false
                    this.errorMessage='后方照片拍摄超时'
                    this.showError=true
                  }
                } else {
                  if (this.oldRecordList[0].beginTime != data.listDrivingRecord[0].beginTime) {
                    clearInterval(this.intervalid4)
                    this.loaded = false
                    this.oldRecordList = data.listDrivingRecord
                    this.recordContents = this.formatReturnList(data.listDrivingRecord)
                    this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
                  } else if (this.indexTmp == 3) {
                    clearInterval(this.intervalid4)
                    this.loaded = false
                    this.errorMessage='后方照片拍摄超时'
                    this.showError=true
                  }
                }
              },(errorMessage)=>{
                clearInterval(this.intervalid4)
                this.loaded = false
                this.errorMessage=errorMessage
                this.showError=true
              })
            }, 3000)
            // setTimeout(() => {
            //   ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
            //     this.loaded = false
            //     if (data.listDrivingRecord.length == 0) {
            //       this.recordContents = []
            //     } else {
            //       this.oldRecordList = data.listDrivingRecord
            //       this.recordContents =this.formatReturnList(data.listDrivingRecord)
            //       this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
            //     }
            //   },(errorMessage)=>{
            //     this.errorMessage=errorMessage
            //     this.showError=true
            //   })
            // }, 3000)
          } else {
            this.loaded = false
            this.errorMessage=funckingErrorMessage[data.resultCode]
            this.showError=true
          }
        },(errorMessage)=>{
          this.loaded = false
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      itemClick(val) {
        console.log('item-click:::')
        console.log(val)
        if (val.type == '0'){
          this.$router.push({
            name: 'picture-show',
            params: {
              pictureUrl: val.picture,
              linkName: 'driving-record'
            }
          });
        } else if (val.type == '1'){
          this.$router.push({
            name: 'video-show',
            params: {
              videoUrl: val.file,
              linkName: 'driving-record'
            }
          });
        }
      }
    },
    filters: {
    },
    computed:{
    },
    created(){
      this.carId = this.$route.query.id
      ListDrivingRecord.bind(this)({carId: this.carId,beginTime: '',count: this.pageCount},(data)=>{
        this.loaded = false
        if (data.listDrivingRecord.length == 0) {
          this.recordContents = []
        } else {
          this.oldRecordList = data.listDrivingRecord
          this.recordContents =this.formatReturnList(data.listDrivingRecord)
          this.recordDate = data.listDrivingRecord[data.listDrivingRecord.length-1].beginTime
        }
      },(errorMessage)=>{
        this.loaded = false
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    watch:{
      '$route':function(to,from){
        if ((from.name != 'article-show') && to.name == 'driving-record') {
          this.carId = this.$route.query.id
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../scss/variables.scss";
  #driving-record.bg {
    background: #F7F7F7;
  }
  #driving-record .driving-record-shot {
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    z-index: 200;
    position: fixed;
    text-align: center;
    padding-top: 15px;
  }
  #driving-record .results-details {
    width: 100%;
    height: 100%;
    padding-top: 1px;
  }
  #driving-record .driving-record-shots {
    width: 100%;
    height: 130px;
    background: #FFFFFF;
    z-index: 200;
    position: fixed;
    text-align: center;
  }
  #driving-record .pic-car {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
    height: 100px;
    margin-top: 15px;
  }
  #driving-record .line-left {
    position: absolute;
    height: 100px;
    left: 35px;
    top: 15px;
  }
  #driving-record .line-right {
    position: absolute;
    height: 100px;
    right: 35px;
    top: 15px;
  }
  #driving-record .icon-video-left {
    position: absolute;
    width: 33px;
    height: 33px;
    left: 25px;
    top: 25px;
  }
  #driving-record .icon-video-right {
    position: absolute;
    width: 33px;
    height: 33px;
    right: 25px;
    top: 25px;
  }
  #driving-record .icon-photo-left {
    position: absolute;
    width: 33px;
    height: 33px;
    left: 25px;
    bottom: 25px;
  }
  #driving-record .icon-photo-right {
    position: absolute;
    width: 33px;
    height: 33px;
    right: 25px;
    bottom: 25px;
  }
  #driving-record .results-details-none .results-none {
    position: relative;
  }
  #driving-record .results-details-none .results-none .results-none-img {
    position: absolute;
    width: 158px;
    height: 158px;
    top: 50px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
  }
  #driving-record .results-details-none .results-none .results-none-span {
    position: absolute;
    font-size: 20px;
    width: 180px;
    top: 225px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
  }
  #driving-record .load-animation {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }
  #driving-record .load-animation .load-animation-message {
    text-align: center;
    margin-top: 270px;
  }
  #driving-record .load-animation .load-animation-message .load-animation-content {
    position: absolute;
    width: 130px;
    height: 100px;
    top: 200px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    background: #000;
    border-radius: 10%;
    filter:alpha(opacity=70);
      -moz-opacity:0.7;
      -khtml-opacity: 0.7;
      opacity: 0.7;
  }
  #driving-record .load-animation .load-animation-message .mu-circular-progress {
    top: 15px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
  }
  #driving-record .load-animation .load-animation-message .load-content {
    position: absolute;
    top: 75px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    color: #fff;
    font-size: 13px;
  }
</style>
