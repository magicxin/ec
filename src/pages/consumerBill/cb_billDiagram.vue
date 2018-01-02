<template>
  <div id="cb_billDiagram" class="background-gray">
    <my-header  bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
      <mu-tabs :value="sumTab" @change="handle" class="header" slot="center">
        <mu-tab value="tab1"  title="用车账单"/>
        <mu-tab value="tab2"  title="消费账单"/>
      </mu-tabs>
      <img slot="right" :src="listPng" width="40px" height="40px" v-tap="{methods: goListPage}" style="position: absolute; top:3px">
    </my-header>
    <model title="提示" @closeIsModel="close" :isShow="prompt">
      <h4 slot>不能大于当前日期</h4>
    </model>

    <scroll marginBottom="0" :bottom="true">
    <div v-if="sumTab === 'tab1'">
      <car-bill>

      </car-bill>
    </div>
    <div v-if="sumTab === 'tab2'">
      <div class="cb_box_title">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="test">
          <mu-tab value="tab1" title="日"/>
          <mu-tab value="tab2" title="月"/>
          <mu-tab value="tab3" title="年"/>
        </mu-tabs>
      </div>

      <div class="bill-body">

        <div v-if="activeTab === 'tab1'" layout="row" layout-align="center space-round" class="bill_head">
          <a  @click="changeDate('day', 'minus')" flex align-self="flex-end" class="text-right">
            <img src="../../assets/last-gray.svg">
          </a>
          <h2 flex class="text-center">
            {{dateOptions.day}}
          </h2>
          <a  @click="changeDate('day', 'add')" flex class="text-left">
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
          <a   @click="changeDate('month', 'add')" flex class="text-left">
            <img src="../../assets/next-gray.svg">
          </a>
        </div>

        <div v-if="activeTab === 'tab3'" layout="row" layout-align="center space-round" class="bill_head">

          <a  @click="changeDate('year', 'minus')" flex align-self="flex-end" class="text-right">
            <img src="../../assets/last-gray.svg">
          </a>
          <h2 flex class="text-center">{{dateOptions.year}}</h2>
          <a  @click="changeDate('year', 'add')" flex class="text-left">
            <img src="../../assets/next-gray.svg">
          </a>

        </div>

        <div class="total-content" layout="column">
          <div class="total-header" flex layout="row">
            <div flex class="total-header-item">
              <span class="total-top">订单(笔)</span>
              <br/>
              <span class="total-bottom">{{billData.orderCount}}</span>
            </div>
            <div flex class="total-header-item">
              <span class="total-top">消费(元)</span>
              <br/>
              <span class="total-bottom">{{billData.total}}</span>
            </div>
          </div>
        </div>
        <div id="pie" v-show="pieOptionData.data.length" :style="{width:screenWidth + 'px', height: screenHeight + 'px'}"></div>

        <div class="foot-content" >
          <div layout="column" class="foot-container text-right" v-if="activeTab !== 'tab1'">
            <div flex="nogrow" class="text-right">
              总消费(元)
              <img src="../../assets/down-gray.svg" alt="" class="foot-title-img">
            </div>
          </div>
          <div id="line" :style="{width:screenWidth  + 'px', height:screenHeight + 'px'}" v-if="activeTab !== 'tab1'"></div>
        </div>
      </div>
    </div>
    </scroll>
  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  import echarts from 'echarts'
  import tabs from 'components/tabs.vue'
  import tab from 'components/tab.vue'

  import carBill from './cb_carBill.vue'
  import model from 'components/model'

  import listPng from 'assets/icon_list_car.png'
  import scroll from 'components/scroll'


  let myChartPie
  function _echart (vm) {
    myChartPie = echarts.init(document.getElementById('pie'))
    let el = document.getElementById('line')
    let myChartLine = el && echarts.init(el)

    myChartPie.setOption(vm.pieOption)
    myChartLine && myChartLine.setOption(vm.lineOption)
    // myChartLine.resize({
    //   height: '550px'
    // })
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
    name: 'cb_billDiagram',
    data () {
      return {
        listPng,
        prompt: false,
        activeTab: 'tab2',
        sumTab: 'tab2',
        screenWidth: window.screen.width,
        dateOptions: {
          year: (new Date()).getFullYear(),
          month: (new Date()).getMonth() + 1,
          day: (new Date()).getDate()
        },
        billData: {},
        pieOptionData: {
          title: [],
          data: []
        },
        lineOptionData: {
          title: [],
          data: []
        }
      }
    },
    methods: {
      goListPage () {
        this.$router.replace({
          name: 'cb_billList',
          query: {
            status: this.sumTab
          }
        })
      },
      close (params) {
        this.prompt = false
      },
      handleTabChange (val) {
        this.activeTab = val
        this.getData(val)
      },
      handle (val) {
        this.sumTab = val
        if (val === 'tab2') {
          this.$nextTick(() => {
            _echart(this)
          })
        }
      },
      changeDate (type, status) {
        if (type === 'year') {
          if (this.dateOptions.year >= (new Date()).getFullYear() && status === 'add') {
            this.prompt = true
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
            this.prompt = true
            return
          }
          if (this.dateOptions.year !== (new Date()).getFullYear() && this.dateOptions.month >= 12 && status === 'add') {
            this.prompt = true
            return
          }
          addOrMinusDate('month', status, this)
          this.getData('tab2')
        }
        if (type === 'day') {
          if (this.dateOptions.day <= 1 && status === 'minus') {
            return
          }
          // console.log(this.dateOptions.day)
          if (this.dateOptions.year === (new Date()).getFullYear() && this.dateOptions.month === ((new Date()).getMonth() + 1) && status === 'add' && this.dateOptions.day >= new Date().getDate()) {
            this.prompt = true
            return
          }
          if ((this.dateOptions.year !== (new Date()).getFullYear() || this.dateOptions.month !== (new Date()).getMonth() + 1) && status === 'add' && this.dateOptions.day >= getDaysInOneMonth(this.dateOptions.year, this.dateOptions.month)) {
            this.prompt = true
            return
          }
          addOrMinusDate('day', status, this)
          this.getData('tab1')
        }
      },
      getData (val) {
        let data = {
          methodName: 'QueryConsumeList'
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
          if (resp.data.resultCode !== '100') {
            this.$.toast('服务器无响应')
          }
          this.billData = resp.data
          this.pieOptionData.title = []
          this.pieOptionData.data = []
          resp.data.categorys && resp.data.categorys.forEach(val => {
            if (val.amount == 0) {
              return
            }
            this.pieOptionData.title.push({
              name: val.name,
              icon: 'circle'
            })
            this.pieOptionData.data.push({
              value: Number(val.amount),
              name: val.name
            })
          })
          this.lineOptionData.data = []
          resp.data.consumeGraph.yCoordinate.forEach(val => {
            if (val === '0.00') {
              this.lineOptionData.data.push('0')
            } else {
              this.lineOptionData.data.push((Number(val) / 1000).toFixed(1))
            }
          })
          // this.lineOptionData.data = resp.data.consumeGraph.yCoordinate
          this.lineOptionData.xData = resp.data.consumeGraph.xCoordinate
          _echart(this)
        }, (err) => {
          if (err) {
            this.$.toast('获取数据失败')
          }
        })
      }
    },
    computed: {
      screenHeight () {
        return this.screenWidth * 3 / 4 + 40
      },
      pieOption () {
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {d}%'
          },
          legend: {
            show: true,
            name: '消费',
            x: 'center',
            y: 'bottom',
            data: this.pieOptionData.title,
            itemHeight: 12,
            itemGap: 2,
            padding: 0,
            top: '75%',
            textStyle: {
              fontSize: 8,
              fontWeight: 'lighter'
            }
          },
          series: [{
            type: 'pie',
            name: '消费',
            center: ['50%', '40%'],
            radius: ['27%', '65%'],
            label: {
              normal: {
                show: false,
                // position: 'center',
                formatter: '{d}%',
                textStyle: {
                  color: '#000'
                }
              },
              emphasis: {
                show: true,
                formatter: '{d}%',
                textStyle: {
                  color: '#000'
                }
              }
            },
            lableLine: {
              normal: {
                show: true,
                lineStyle: {
                  color: '#c7c7c7'
                }
              },
              emphasis: {
                show: true,
                lineStyle: {
                  color: '#c7c7c7'
                }
              }
            },
            data: this.pieOptionData.data,
            tooltip: {
              trigger: 'item',
              axisPointer: {
                type: 'line'
              }
            },
            color: ['#cb4043', '#fd5052', '#fc7709', '#fdc609', '#74bb81', '#89c5ea']
          }]
        }
      },
      lineOption () {
        return {
          tooltip: {
            trigger: 'axis',
            formatter: '{b} : {c}千元'
          },
          xAxis: [
            {
              type: 'category',
              name: this.activeTab === 'tab2' ? '日' : '月',
              boundaryGap: false,
              axisTick: {
                inside: true
              },
              data: this.lineOptionData.xData
            }
          ],
          legend: [{
            left: 30
          }],
          yAxis: [
            {
              type: 'value',
              name: '(千元)',
              axisTick: {
                show: false
              },
              nameGap: 5,
              boundaryGap: ['20%', '20%'],
              // offset: -20,
              splitLine: {
                show: false
              },
              min: 0
            }
          ],
          series: [
            {
              name: '总消费',
              type: 'line',
              stack: '总量',
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
    components: {
      myHeader,
      isTabs: tabs,
      isTab: tab,
      carBill,
      model,
      scroll
    },
    beforeRouteEnter: (to, from, next) => {
      // ...
      let status = to.query.status || 'tab2'
      next(vm => {
        vm.sumTab = status
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.getData(this.activeTab)
      })
    }
  }
</script>

<style>
  #cb_billDiagram .cb_box_title{
    padding: 0 10px;
  }

  #cb_billDiagram .bill_head{
    padding: 4px;
  }

  #cb_billDiagram .bill_head h2 {
    font-weight: normal;
    margin-top: 3px;
    font-size: 1.3rem;
    background-color: #EFEFF4;
  }

  #cb_billDiagram .cb_box_title .mu-ripple-wrapper {
    height: 41px;
    line-height: 35px;
    /*position: relative;*/
  }
  #cb_billDiagram .cb_box_title .mu-tab-link-highlight{
    display: inline;
  }

  #cb_billDiagram .cb_box_title .mu-ripple-wrapper::before{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 10px;
    right: 0;
    height: 30px;
    border-left: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #cb_billDiagram .test {
    height: 31px;
  }

  #cb_billDiagram .tab{
    font-size: 1.3rem;
  }

  #cb_billDiagram #pie, #cb_billDiagram #line {
    padding: 0 15px 8px;
    background-color: #fff!important;
  }

  #cb_billDiagram #tabs{
    line-height: 26px;
  }

  #cb_billDiagram #line {
    margin-top: 8px;
    padding: 0 15px;
    overflow: auto;
    background-color: #fff!important;
  }

  #cb_billDiagram .test {
    margin-bottom: 0;
    background-color: #fff;
  }

  #cb_billDiagram .mu-tab-link-highlight {
    background-color: #F8B871;
    display: none;
  }

  #cb_billDiagram .mu-tab-text{
    font-size: 16px;
  }

  #cb_billDiagram .mu-tab-active .mu-tab-text{
    color: #F8B871;
  }

  #cb_billDiagram .tab-title-class::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 0;
    width: 1px;
    height: 60%;
    background-color: #929292;
  }

  #cb_billDiagram .bill-head {
    height: 35px;
    line-height: 35px;
    width: 100%;
    background-color: #efeff4;
    position: relative;
    text-align: center;
  }

  #cb_billDiagram .bill-head h2 {
    font-size: 1.3rem;
    font-weight: normal;
    text-align: center;
    /*line-height: 45px;*/
  }

  #cb_billDiagram .icon-img-first {
    /*position: absolute;
    left: 20%;
    top: 32%;*/
  }

  #cb_billDiagram .icon-img-last {
    position: absolute;
    right: 20%;
    top: 32%;
  }

  #cb_billDiagram .total-content {
    width: 100%;
    background-color: #fff;
    padding: 15px 15px 2px 15px;
  }

  #cb_billDiagram .header-content {
    font-size: 1.2rem !important;
  }

  #cb_billDiagram .total-content>div {
    width: 100%;
  }

  #cb_billDiagram .total-header {
    width: 100%;
    background-color: #f7f7f7;
    border: 1px solid #c9c9c9;
    border-radius: 3px;
    display: flex;
    position: relative;
    padding-bottom: 5px;
  }

  #cb_billDiagram .total-header::before {
    content: '';
    width:1px;
    height: 70%;
    background-color: #c9c9c9;
    position: absolute;
    left: 50%;
    top: 15%;
    /*transform: scaleX(0.5);*/
  }

  #cb_billDiagram .total-header-item {
    text-align: center;
    padding-top: 5px;
  }

  #cb_billDiagram .total-top {
    font-size: 12px;
    line-height: 1.5;
    color: #0b0b0b;
  }

  #cb_billDiagram .total-bottom {
    font-size: 12px;
    line-height: 1.5;
    font-weight: 500;
    color: #F8AF61;
  }
  #cb_billDiagram .foot-content {
    background-color: #fff;
    position: relative;
  }

  #cb_billDiagram .foot-container {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
  }

  #cb_billDiagram .foot-title {
    font-size: 16px;
    color: #1b1b1b
  }

  #cb_billDiagram .foot-title-img {
    width: 18px;
    height: 18px;
    vertical-align: text-bottom;
  }

  #cb_billDiagram .foot-text {
    font-size: 14px;
    color: #af0000;
  }

  #cb_billDiagram .tab {
    padding: 10px 20px;
  }

  #cb_billDiagram .header{
    height: 48px;
    background-color: #F7F7F7;
  }
</style>
