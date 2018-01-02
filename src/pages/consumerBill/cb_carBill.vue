<template>
  <div id="cb_carBill">
    <div class="cb_box_title">
      <mu-tabs :value="activeTab" @change="handleTabChange" class="test">
        <mu-tab value="tab1" title="日"/>
        <mu-tab value="tab2" title="月"/>
        <mu-tab value="tab3" title="年"/>
      </mu-tabs>
    </div>
    <model title="提示" @closeIsModel="closePrompt" :isShow="ifPromptShow">
      <h4 slot>不能大于当前日期</h4>
    </model>
    <div v-if="activeTab === 'tab1'" layout="row" layout-align="center space-round" class="bill_head">
      <a  @click="changeDate('day', 'minus')" flex align-self="flex-end" class="text-right">
        <img src="../../assets/last-gray.svg">
      </a>
      <h2 flex class="text-center">
        {{dateOptions.day}}
      </h2>
      <a  @click="changeDate('day', 'add')" flex>
        <img src="../../assets/next-gray.svg">
      </a>
    </div>

    <div v-if="activeTab === 'tab2'" layout="row" layout-align="center space-round" class="bill_head">
      <a  @click="changeDate('month', 'minus')" flex align-self="flex-end" class="text-right">
        <img src="../../assets/last-gray.svg">
      </a>
      <h2 flex class="text-center">
        {{dateOptions.month}}
      </h2>
      <a   @click="changeDate('month', 'add')" flex>
        <img src="../../assets/next-gray.svg">
      </a>
    </div>

    <div v-if="activeTab === 'tab3'" layout="row" layout-align="center space-round" class="bill_head">
      <a  @click="changeDate('year', 'minus')" flex align-self="flex-end" class="text-right">
        <img src="../../assets/last-gray.svg">
      </a>
      <h2 flex class="text-center">{{dateOptions.year}}</h2>
      <a  @click="changeDate('year', 'add')" flex>
        <img src="../../assets/next-gray.svg">
      </a>
    </div>
    <div layout="column" class="cb_box_body">
      <div flex layout="row" layout-align="space-between center" class="cb_body_title">
        <h4 flex class="text-center" layout="column">
          <p flex>大约总花费(元)</p>
          <p flex>{{billData.totalCost}}</p>
        </h4>
        <h4 flex class="text-center" layout="column">
          <p flex>总里程(km)</p>
          <p>{{billData.totalMileage}}</p>
        </h4>
      </div>
      <div flex>
        <div class="cb_body_center" layout="column" style="text-align: center" :style="{height: centerHeight}">
          <div layout="row" flex >
            <div flex layout="row" layout-align="space-around center" style="margin-left: 30px">
              <img :src="imgData.time" alt="" flex="nogrow" style="left: -13px">
              <div flex layout="column" class="text-left">
                <h4 flex="nogrow">驾驶时间</h4>
                <span flex>{{billData.driverTimes}}</span>
              </div>
            </div>
            <div flex layout="row" layout-align="space-around center" style="margin-right: 30px">
              <div flex layout="column" style="text-align: right; margin-right: 10px">
                <h4 flex="nogrow">驾驶得分</h4>
                <span flex >{{billData.avgOil}}</span>
              </div>
              <img :src="imgData.score" alt="" flex="nogrow" style="right: -13px">
            </div>
          </div>
          <div layout="row" flex>
            <div flex layout="row" layout-align="space-around center">
              <img :src="imgData.distance" alt="" flex="nogrow" style="left: -17px">
              <div flex layout="column" class="text-left">
                <h4 flex="nogrow">行驶里程</h4>
                <span flex>{{billData.totalMileage}}</span>
              </div>
            </div>
            <div flex="nogrow" layout="row" layout-align="space-around center">
              <img :src="imgData.cost" alt="" flex="nogrow">
            </div>
            <div flex layout="row" layout-align="space-around center">
              <div flex layout="column" style="text-align: right; margin-right: 10px">
                <h4 flex="nogrow">平均速度</h4>
                <span flex >{{billData.avgSpeed}}</span>
              </div>
              <img :src="imgData.speed" alt="" flex="nogrow" style="right: -17px">
            </div>
          </div>
          <div layout="row" flex>
            <div flex layout="row" layout-align="space-around center" style="margin-left: 30px">
              <img :src="imgData.aveoil" alt="" flex="nogrow" style="left: -10px">
              <div flex layout="column" class="text-left">
                <h4 flex="nogrow">平均油耗</h4>
                <span flex>{{billData.avgOil}}</span>
              </div>
            </div>
            <div flex layout="row" layout-align="space-around center" style="margin-right: 30px">
              <div flex layout="column" style="text-align: right; margin-right: 10px">
                <h4 flex="nogrow">油耗量</h4>
                <span flex >{{billData.totalOil}}</span>
              </div>
              <img :src="imgData.oil" alt="" flex="nogrow" style="right: -10px">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="line" :style="{width:screenWidth + 'px', height:screenHeight + 'px'}" v-show="activeTab !== 'tab1'"></div>
  </div>
</template>

<script>
  /* eslint-disable */
  import aveoil from 'assets/icon_account_aveoil.png'
  import cost from 'assets/icon_account_cost.png'
  import distance from 'assets/icon_account_distance.png'
  import oil from 'assets/icon_account_oil.png'
  import score from 'assets/icon_account_score.png'
  import speed from 'assets/icon_account_speed.png'
  import time from 'assets/icon_account_time.png'
  import echarts from 'echarts'
  import model from 'components/model'




  function _echart (vm) {
    let el = document.getElementById('line')
    let myChartLine = el && echarts.init(el)

    myChartLine && myChartLine.setOption(vm.lineOption)
  }
  function getDaysInOneMonth (year, month) {
    month = parseInt(month, 10)
    var d = new Date(year, month, 0)
    return d.getDate()
  }

  function frontAdd (val) {
    return val < 10 ? (0 + val) : val
  }

  function addOrMinusDate (type, how, vm) {
    how === 'add' ? vm.dateOptions[type] ++ : vm.dateOptions[type] --
  }
  export default {
    name: 'cb_carBill',
    data () {
      return {
        carID: '',
        activeTab: 'tab1',
        screenWidth: window.screen.width,
        centerHeight: window.screen.width - 60 + 'px',
        imgData: {
          aveoil,
          cost,
          distance,
          oil,
          score,
          speed,
          time
        },
        ifPromptShow: false,
        dateOptions: {
          year: (new Date()).getFullYear(),
          month: (new Date()).getMonth() + 1,
          day: (new Date()).getDate()
        },
        billData: {},
        lineOptionData: {
          data: [],
          _xData: []
        }
      }
    },
    components: {
      model
    },
    methods: {
      closePrompt () {
        this.ifPromptShow = false
      },
      handleTabChange (val) {
        this.activeTab = val
        this.getData(val)
      },
      changeDate (type, status) {
        if (type === 'year') {
          if (this.dateOptions.year >= (new Date()).getFullYear() && status === 'add') {
            this.ifPromptShow = true
            return
          }
          addOrMinusDate('year', status, this)
          this.getData('tab3')
        }
        if (type === 'month') {
          if (this.dateOptions.month <= 1 && status === 'minus') {
            return
          }
          if (this.dateOptions.year === (new Date()).getFullYear() && this.dateOptions.month >= (new Date().getMonth() + 1) && status === 'add') {
            this.ifPromptShow = true
            return
          }
          if (this.dateOptions.year !== (new Date()).getFullYear() && this.dateOptions.month >= 12 && status === 'add') {
            this.ifPromptShow = true
            return
          }
          addOrMinusDate('month', status, this)
          this.getData('tab2')
        }
        if (type === 'day') {
          if (this.dateOptions.day <= 1 && status === 'minus') {
            return
          }
          if (this.dateOptions.year === (new Date()).getFullYear() && this.dateOptions.month !== (new Date()).getMonth() + 1 && status === 'add' && this.dateOptions.day >= new Date().getDate()) {
            this.ifPromptShow = true
            return
          }
          if ((this.dateOptions.year !== (new Date()).getFullYear() || this.dateOptions.month !== (new Date()).getMonth() + 1) && status === 'add' && this.dateOptions.day >= getDaysInOneMonth(this.dateOptions.year, this.dateOptions.month)) {
            this.ifPromptShow = true
            return
          }
          addOrMinusDate('day', status, this)
          this.getData('tab1')
        }
      },
      getData (val) {
        let data = {
          methodName: 'ListCarBill',
          carId: this.carID
          //
        }
        if (val === 'tab3') {
          data.beginTime = this.dateOptions.year + '-01-01' + ' ' + '00:00:00'
          data.endTime = this.dateOptions.year + '-12-31' + ' ' + '23:59:59'
          data.type = '2'
        }
        if (val === 'tab2') {
          data.beginTime = this.dateOptions.year + '-' + frontAdd(this.dateOptions.month) + '-01' + ' ' + '00:00:00'
          let lastDay = getDaysInOneMonth(this.dateOptions.year, this.dateOptions.month)
          data.endTime = this.dateOptions.year + '-' + frontAdd(this.dateOptions.month) + '-' + lastDay.toString() + ' ' + '23:59:59'
          data.type = '1'
        }
        if (val === 'tab1') {
          data.type = '0'
          data.beginTime = this.dateOptions.year + '-' + frontAdd(this.dateOptions.month) + '-' + frontAdd(this.dateOptions.day) + ' ' + '00:00:00'
          data.endTime = this.dateOptions.year + '-' + frontAdd(this.dateOptions.month) + '-' + frontAdd(this.dateOptions.day) + ' ' + '23:59:59'
        }

        this.$.get(data).then(resp => {
          // console.log(resp)
          this.billData = resp.data
          let _xData = []
          resp.data.consumeGraph.forEach((val, key) => {
            _xData.push(key + 1)
          })
          this.lineOptionData._xDate = _xData
          this.lineOptionData.data = resp.data.consumeGraph
          _echart(this)
        })
      }
    },
    computed: {
      screenHeight () {
        return this.screenWidth * 3 / 4
      },
      lineOption () {
        return {
          xAxis: [
            {
              type: 'category',
              name: this.activeTab === 'tab2' ? '日' : '月',
              boundaryGap: false,
              axisTick: {
                inside: true
              },
              data: this.lineOptionData._xDate
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '(元)',
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '总消费',
              type: 'line',
              stack: '总量',
              label: {
                normal: {show: true, formatter: '{c}', textStyle: {color: '#000'}},
                emphasis: {show: true, formatter: '{c}', textStyle: {color: '#000'}}
              },
              lineStyle: {normal: {
                color: '#ff7a00'
              }},
              areaStyle: {normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#ff7a00' // 0% 处的颜色
                }, {
                  offset: 1, color: '#ffffff' // 100% 处的颜色
                }], false)
              }},
              // data: [120, 132, 101, 134, 90, 230, 210, 110, 310, 210, 220, 100]
              data: this.lineOptionData.data
            }
          ]
        }
      }
    },
    mounted () {
      this.$.push('data_loginStatus', null, (resp) => {
        let _data = JSON.parse(resp)
        if (!_data.carID) {
          this.$.toast('您暂时没有绑定车辆')
          return
        }
        this.carID = _data.carID
        this.$nextTick(() => {
          this.getData('tab3')
        })
      })
    }
  }
</script>

<style>
  #cb_billDiagram #tabs .offline {
    display: inline !important;
  }

  #cb_carBill .cb_box_title{
    padding: 0 10px;
  }

  #cb_carBill .test {
    height: 35px;
  }

  #cb_carBill .cb_box_body{
    background-color: #fff;
  }

  #cb_carBill .text-center {
    text-align: center;
    background-color: #F7F7F7;
  }

  #cb_carBill .cb_body_title{
    margin-left: 25px;
    margin-right: 25px;
    margin-top: 20px;
    /*border: 1px solid #EEEEEE;*/
    border: 1px solid #c9c9c9;
    /*border-radius: 4px;*/
  }

  #cb_carBill .cb_body_title h4{
    font-weight: normal;
  }

  #cb_carBill .cb_body_title p {
    line-height: 25px;
  }

  #cb_carBill .cb_body_title p:nth-child(2) {
    color: #F8B062;
  }

  #cb_carBill .cb_body_center{
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
    height: 240px;
    border-radius: 50%;
    /*overflow: hidden;*/
    border: 1px dashed #ccc;
  }

  #cb_carBill .cb_body_center img {
    width: 38px;
    height: 38px;
    position: relative;
  }

  #cb_carBill .text-left{
    text-align: left;
    margin-left: 10px;
  }

</style>
