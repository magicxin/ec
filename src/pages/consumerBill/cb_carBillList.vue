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
    <cells>
      <cell :link="false" v-for="(item,index) in billData.carBills" :key="index">
        <label slot="label" v-if="activeTab !== 'tab1'">{{item.index}} {{activeTab === 'tab3' ? '月' : '日'}}</label>
        <p slot="label" v-if="activeTab === 'tab1'" class="address">
          <span>{{item.beginAddress}}</span> - <span>{{item.endAddress}}</span>
          <br>
          <br>
          <span style="color: #888888">{{item.beginTime}}</span>
        </p>
        <span slot="value">¥{{item.oilCost}}</span>
      </cell>
    </cells>
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
  import cells from 'components/cells'
  import cell from 'components/cell'
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
        queryData: [],
        carID: '',
        activeTab: 'tab3',
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
          data: []
        }
      }
    },
    components: {
      model,
      cells,
      cell
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
          // this.carID
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
          this.billData = resp.data
        })
      }
    },
    computed: {
      screenHeight () {
        return this.screenWidth * 3 / 4
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

  #cb_billDiagram .cell_box {
    max-width: 70%;
    overflow: hidden;
  }

  #cb_billDiagram #cell {
    min-height: 60px;
  }

  #cb_billDiagram .address {
    font-size: 13px;
    line-height: 15px;
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
    border: 1px solid #c9c9c9;
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
  }

  #cb_carBill .text-left{
    text-align: left;
    margin-left: 10px;
  }

</style>
