<template>
  <section id="car-bill" class="background-light">
    <magic-header  titleName="用车账单"></magic-header>
    <div class="staticIcon" @click="showChart" id="icon"></div>
      <template>
        <mu-flexbox class="flexbox-bg">
          <mu-flexbox-item class="flex-date" id="day">
            <li @click="dayDate"><span>日</span></li>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-date" id="month">
            <li @click="monthDate" class="data-border"><span>月</span></li>
          </mu-flexbox-item>
          <mu-flexbox-item class="flex-date" id="year">
            <li @click="yearDate"><span>年</span></li>
          </mu-flexbox-item>
        </mu-flexbox>
        <div class="dataBg">
          <div class="date" id="date">
            <div class="arrow-left" @click="beforeDate(dtype)"></div>
            <div class="date-font" ref="dateTab">
              <mu-date-picker v-model="formatDate" @input="dateChange" @change="dateChange" :maxDate="nowDate"/>
            </div>
            <div class="date-font-other" ref="tab">{{date}}</div>
            <div class="arrow-right" @click="afterDate(dtype)" id="arrow"></div>
          </div>
        </div>
        <div style="padding:10px 10px">
          <div style="border:1px solid #dedede;background:#f7f7f7;display:inline-block;width:100%">
            <div style="float:left;padding:10px 0px 10px 50px">
              <span>总花费(元)</span><span
              style="display:block;text-align:center;color:#f98700">{{billData.totalCost}}</span>
            </div>
            <div style="float:right;padding:10px 50px 10px 0px">
              <span>总里程(km)</span><span
              style="display:block;text-align:center;color:#f98700">{{billData.totalMileage}}</span>
            </div>
          </div>
        </div>
        <div id="table">
          <div style="margin-top:12px">
            <ul id="circularMenu">
              <li class="home" @click="costCategrey(3)"><span class="span3">养护费</span><span
                class="span3">￥{{billData.maintenance}}</span></li>
              <li class="chat" @click="costCategrey(1)"><span class="span1">车辆购置费</span><span
                class="span2">￥{{billData.vehicle}}</span></li>
              <li class="email" @click="costCategrey(2)"><span class="span1">升级改造费</span><span
                class="span2">￥{{billData.carProduct}}</span></li>
              <li class="address" @click="costCategrey(0)"><span class="span6">油(电)费</span><span
                class="span7">￥{{billData.oilElectricityEvaluate}}(估)</span><span
                class="span8">￥{{billData.oilElectricity}}</span></li>
              <li class="upload" @click="costCategrey(4)"><span class="span3">杂费</span><span
                class="span3">￥{{billData.incidentals}}</span></li>
              <li class="center" @click="costCategrey(99)"><span class="span4">总花费</span><span class="span5">{{billData.totalCost}}元</span></li>
            </ul>
          </div>
          <div class="tabBg">
            费用明细
          </div>
          <div v-for="detailBill in this.detailBill.carCosts">
          <template v-if="detailBill.dataSource==1" >
              <mu-list-item :title="detailBill.frontExpenseName" :afterText="detailBill.cost"
                          :describeText="detailBill.happenDate" @click="activeToOrderDetail(params,detailBill.order.id)">          
              <span v-if="detailBill.verifyState==0&&detailBill.needVerify==1" slot="right" class="one">
                      {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                    </span>    
              <span v-if="detailBill.verifyState==0&&detailBill.needVerify==0" slot="right" class="four"
                    style="color:#fff">                    
                    </span>
              <span v-if="detailBill.verifyState==1&&detailBill.needVerify==1" slot="right" class="two">
                      {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                    </span>
              <span v-if="detailBill.verifyState==1&&detailBill.needVerify==0" slot="right" class="four"
                    style="color:#fff">                      
                    </span>
              <span v-if="detailBill.verifyState==2&&detailBill.needVerify==1" slot="right" class="three">
                      {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                    </span>
              <span v-if="detailBill.verifyState==2&&detailBill.needVerify==0" slot="right" class="four"
                    style="color:#fff">                    
                    </span>
                <mu-divider/>
            </mu-list-item>
          </template>
          <template v-else>
               <router-link :to="{ name: 'bill-detail', query: { id: detailBill.id }}">
                  <mu-list-item :title="detailBill.frontExpenseName" :afterText="detailBill.cost"
                                :describeText="detailBill.happenDate">          
                    <span v-if="detailBill.verifyState==0&&detailBill.needVerify==1" slot="right" class="one">
                            {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                          </span>    
                    <span v-if="detailBill.verifyState==0&&detailBill.needVerify==0" slot="right" class="four"
                          style="color:#fff">                    
                          </span>
                    <span v-if="detailBill.verifyState==1&&detailBill.needVerify==1" slot="right" class="two">
                            {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                          </span>
                    <span v-if="detailBill.verifyState==1&&detailBill.needVerify==0" slot="right" class="four"
                          style="color:#fff">                      
                          </span>
                    <span v-if="detailBill.verifyState==2&&detailBill.needVerify==1" slot="right" class="three">
                            {{({'0': '未审核', '1': '审核通过', '2': '审核不通过'})[detailBill.verifyState]}}
                          </span>
                    <span v-if="detailBill.verifyState==2&&detailBill.needVerify==0" slot="right" class="four"
                          style="color:#fff">                    
                    </span>
                  <mu-divider/>
                 </mu-list-item>
            </router-link>
          </template>
          </div>
          <router-link :to="{ name: 'create-bill'}">
            <div class="add_icon"></div>
          </router-link>
        </div>
        <div id="abc">      
          <canvas id="myChart" width="100%" height="100%"></canvas>   
        </div>      
      </template>
  </section>
</template>
<script>
  import magicHeader from 'components/magicHeader'
  import Chart from 'chart.js'
  import billInfo from 'services/bill-info'
  import billDetail from 'services/bill-detail'
  export default {
    components: {
      magicHeader,
    },
    data() {
      return {
        loaded: true,
        snackbar: false,
        isDate:false,
        date: '',
        formatDate: '',
        year: '',
        month: '',
        week: '',
        day: '',
        dtype: '1',
        beginDate: '',
        endDate: '',
        billData: [],
        detailBill: [],
        isOpen:false,
        params: {
          title: '订单详情',
          uri: '#orderDetail',
          toUri: 'ec',
        },
      }
    },
    created(){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      this.nowDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
      this.formatDate = year + '-' + (month > 9 ? month : '0' + month);
      this.year = year;
      this.month = month;
      this.day = day;
      this.dtype = "1";
      this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '01' + " " + "00:00:00" ,
      this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '31' + " " + "23:59:59",
      this.initData()
      this.date = this.formatDate;
    },
     watch:{
      '$route':function(to,from){
        if(to.name==='car-bill'){
          this.initData()
        }
      }
    },
    mounted(){
      document.getElementById('table').style.height = window.screen.height-210 + 'px'
    },
    methods: {      
      showChart(){
        if (document.getElementById("icon").className == "staticIcon") {
          document.getElementById("myChart").style.display = ""
          document.getElementById("table").style.display = "none"
          document.getElementById("icon").className = "listIcon"
        } else {
          document.getElementById("myChart").style.display = "none"
          document.getElementById("table").style.display = ""
          document.getElementById("icon").className = "staticIcon"
        }
        this.initChart()
      },  
      initChart(){
        var ctx = document.getElementById("myChart").getContext('2d');   
        if (document.getElementById("icon").className == "listIcon") {
          document.getElementById("myChart").style.display = ""
          document.getElementById("table").style.display = "none"
          document.getElementById("icon").className = "listIcon"
        } else {
          document.getElementById("myChart").style.display = "none"
          document.getElementById("table").style.display = ""
          document.getElementById("icon").className = "staticIcon"
        }     
        console.log(Math.round(this.billData.oilElectricity/this.billData.totalCost*100)==='NaN')
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [(this.billData.oilElectricity=='0')?'油电费 0':'油电费'+(this.billData.oilElectricity/this.billData.totalCost*100).toFixed(2)+'%',
                     (this.billData.carProduct=='0')?'升级改装费 0':'升级改装费'+(this.billData.carProduct/this.billData.totalCost*100).toFixed(2)+'%',
                     (this.billData.vehicle=='0')?'车辆购置费 0':'车辆购置费'+(this.billData.vehicle/this.billData.totalCost*100).toFixed(2)+'%',
                     (this.billData.incidentals=='0')?'杂费 0':'杂费'+(this.billData.incidentals/this.billData.totalCost*100).toFixed(2)+'%',
                     (this.billData.maintenance=='0')?'养护费 0':'养护费'+(this.billData.maintenance/this.billData.totalCost*100).toFixed(2)+'%'],
            datasets: [{
              responsive: true,
              data: [this.billData.oilElectricity,this.billData.carProduct,this.billData.vehicle,this.billData.incidentals,this.billData.maintenance],
              backgroundColor: [
                '#fa5257',
                '#fb7726',
                '#fcc530',
                '#76ba83',
                '#8bc6e8',
              ],
              highlight: [
                '#fa5257',
                '#fb7726',
                '#fcc530',
                '#76ba83',
                '#8bc6e8',
              ],
            }]
          },
        });
      },
      freshData(){
        billInfo.bind(this)({
          type: this.dtype,
          beginTime: this.beginDate,
          endTime: this.endDate,
          loading:'false'
        }, (data) => {
          this.billData = data
          this.initChart()
        }, (error) => {
          this.$.toast(error)
          return false;
        })
        billDetail.bind(this)({
          type: this.dtype,
          beginTime: this.beginDate,
          endTime: this.endDate,
          loading:'false',
          pageable: {
            pageNumber: 1,
            pageSize: 1000
          },
        }, (data) => {
          this.detailBill = data
        }, (error) => {
          this.$.toast(error)
          return false;
        })
      },
      initData(){
         billInfo.bind(this)({
          type: this.dtype,
          beginTime: this.beginDate,
          endTime: this.endDate
        }, (data) => {
          this.billData = data
          this.initChart()
        }, (error) => {
          this.$.toast(error)
          return false;
        })
        billDetail.bind(this)({
          type: this.dtype,
          beginTime: this.beginDate,
          endTime: this.endDate
        }, (data) => {
          console.log(data);
          this.detailBill = data
        }, (error) => {
          this.$.toast(error)
          return false;
        })
      },
      dateChange(){
        this.beginDate = this.formatDate + " " + "00:00:00"
        this.endDate = this.formatDate + " " + "23:59:59"
        this.date = this.formatDate;
        this.year = this.formatDate.substring(0,4)
        this.month = this.formatDate.substring(5,7)
        this.day = this.formatDate.substring(8,10)
        this.initData()
      },
      formatDateYear(date) {
        var myyear = date.getFullYear();
        return (myyear);
      },
      formatDateDay(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
          mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
          myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
      },
      formatDateMonth(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        if (mymonth < 10) {
          mymonth = "0" + mymonth;
        }
        return (myyear + "-" + mymonth);
      },
      dayDate(){
        this.isDate = true
        document.getElementsByClassName('mu-text-field-input')[0].style.display = 'block';
        document.getElementById('day').style.borderBottom = "1px solid #f98700";
        document.getElementById('year').style.borderBottom = "none";
        document.getElementById('month').style.borderBottom = "none";
        document.getElementById('arrow').style.marginTop='-33px';     
        this.$refs.tab.style.display = "none"
        this.$refs.dateTab.style.display = "block"
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        this.date = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
        this.formatDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
        this.year = year;
        this.month = month;
        this.day = day;
        this.dtype = "0";
        this.beginDate = this.formatDate + " " + "00:00:00"
        this.endDate = this.formatDate + " " + "23:59:59"
        document.getElementById('myChart').remove()
        document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
        this.freshData()
      },
      yearDate(){
        this.isDate = false
        document.getElementById('year').style.borderBottom = "1px solid #f98700";
        document.getElementById('day').style.borderBottom = "none";
        document.getElementById('month').style.borderBottom = "none";
        document.getElementById('arrow').style.marginTop='-30px';
        this.$refs.tab.style.display = "block"
        this.$refs.dateTab.style.display = "none"
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        this.date = year
        this.beginDate = year + '-' + '01' + '-' + '01' + " " + "00:00:00" ,
        this.endDate = year + '-' + '12' + '-' + '31' + " " + "23:59:59",
        this.year = year;
        this.month = month;
        this.day = day;
        this.dtype = "2";
        document.getElementById('myChart').remove()
        document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
        this.freshData()      
      },
      monthDate(){
        this.isDate = false
        document.getElementById('month').style.borderBottom = "1px solid #f98700";
        document.getElementById('day').style.borderBottom = "none";
        document.getElementById('year').style.borderBottom = "none"; 
        document.getElementById('arrow').style.marginTop='-30px';     
        this.$refs.tab.style.display = "block"
        this.$refs.dateTab.style.display = "none"
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        this.date = year + '-' + (month > 9 ? month : '0' + month);
        this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '01' + " " + "00:00:00" 
        if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
          this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '31' + " " + "23:59:59" 
        } else if (month == "2" && (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
          this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '29' + " " + "23:59:59" 
        } else if (month == "4" || month == "6" || month == "9" || month == "11") {
          this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '30' + " " + "23:59:59" 
        }else{
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '28' + " " + "23:59:59" 
        }
        this.year = year;
        this.month = month;
        this.dtype = "1"
        document.getElementById('myChart').remove()
        document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
        this.freshData()
      },
      beforeDate(type){
        //月份css修改
        if(this.formatDate.length == '7'){
          document.getElementById('arrow').style.marginTop='-30px';
        }
        var year = this.year;
        var month = this.month;
        var day = this.day;
        console.log(year,month,day);
        if (type == "0") {
          if (month == "1" && day == "1") {
            year = year - 1;
          }
          if (day > 1) {
            day = day - 1
          } else {
            if (month > 1) {
              month = month - 1
            } else {
              month = 12
            }
            if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
              day = 31
            } else if (month == "2" && (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
              day = 29
            } else if (month == "4" || month == "6" || month == "9" || month == "11") {
              day = 30
            } else {
              day = 28
            }
          }
          this.date = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
          this.day = day;
          this.year = year;
          this.month = month;
          this.formatDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
          this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + " " + "00:00:00"
          this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + " " + "23:59:59"          
          document.getElementById('myChart').remove();
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        } else if (type == "2") {
          var year = this.year - 1;
          var month = this.month;
          var day = this.day;
          this.date = year
          this.day = day;
          this.year = year;
          this.month = month;
          this.beginDate = year + '-' + '01' + '-' + '01' + " " + "00:00:00" ,
          this.endDate = year + '-' + '12' + '-' + '31' + " " + "23:59:59",
          document.getElementById('myChart').remove()
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        } else if (type == "1") {
          this.$refs.tab.style.display = "block"
          this.$refs.dateTab.style.display = "none"
          if (month > 1) {
            month = month - 1
            this.date = year + '-' + (month > 9 ? month : '0' + month);
            this.year = year;
            this.month = month;
          } else {
            year = year - 1
            month = 12
            this.date = year + '-' + (month > 9 ? month : '0' + month);
            this.year = year;
            this.month = month;
          }
          this.date = year + '-' + (month > 9 ? month : '0' + month);
          this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '01' + " " + "00:00:00" 
          if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '31' + " " + "23:59:59" 
          } else if (month == "2" && (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '29' + " " + "23:59:59" 
          } else if (month == "4" || month == "6" || month == "9" || month == "11") {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '30' + " " + "23:59:59" 
          }else{
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '28' + " " + "23:59:59" 
          }
          this.year = year;
          this.month = month;
          document.getElementById('myChart').remove();
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        }
      },
      afterDate(type){
        if (type == "0") {
          var nowDate = new Date();
          var year = this.year;
          var month = this.month;
          var day = this.day;
          
          this.formatDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
          if (this.formatDateDay(nowDate) == this.formatDate) {
            this.$.toast('不能大于当前日期')
            return false;
          }
          if (month == "12" && day == "31") {
            year ++;
          }
          if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
            if (day < 31) {
              day ++
            } else {
              day = 1
              if (month < 12) {
                month ++
              } else {
                month = 1
              }
            }
          } else if (month == "2" && (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            if (day < 29) {
              day ++
            } else {
              day = 1
              month ++
            }
          } else if (month == "4" || month == "6" || month == "9" || month == "11") {
            if (day < 30) {
              day ++
            } else {
              day = 1
              month ++
            }
          } else {
            if (day < 28) {
              day ++
            } else {
              day = 1
              month ++
            }
          }
          this.date = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
          this.day = day;
          this.year = year;
          this.month = month;
          this.formatDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
          this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + " " + "00:00:00"
          this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + " " + "23:59:59"
          document.getElementById('myChart').remove();
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        } else if (type == "2") {
          var nowDate = new Date();
          var year = this.year;
          this.date = year;
          if (this.formatDateYear(nowDate) == this.date) {
            this.$.toast('不能大于当前日期')
            return false;
          }
          var year = this.year + 1;
          var month = this.month;
          var day = this.day;
          this.date = year
          this.day = day;
          this.year = year;
          this.month = month;
          this.beginDate = year + '-' + '01' + '-' + '01' + " " + "00:00:00" ,
          this.endDate = year + '-' + '12' + '-' + '31' + " " + "23:59:59" ,
          document.getElementById('myChart').remove();
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        } else if (type == "1") {
          var nowDate = new Date();
          var year = this.year;
          var month = this.month;
          this.formatDate = year + '-' + (month > 9 ? month : '0' + month);
          if (this.formatDateMonth(nowDate) == this.formatDate) {
            this.$.toast('不能大于当前日期')
            return false;
          }
          if (month < 12) {
            month ++ 
          } else {
            month = 1
            year = year + 1;
          }
          if (month == "1" || month == "3" || month == "5" || month == "7" || month == "8" || month == "10" || month == "12") {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '31' + " " + "23:59:59" 
          } else if (month == "2" && (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '29' + " " + "23:59:59" 
          } else if (month == "4" || month == "6" || month == "9" || month == "11") {
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '30' + " " + "23:59:59" 
          }else{
            this.endDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '28' + " " + "23:59:59" 
          }
          this.date = year + '-' + (month > 9 ? month : '0' + month);
          this.formatDate = year + '-' + (month > 9 ? month : '0' + month);
          this.year = year;
          this.month = month;
          this.beginDate = year + '-' + (month > 9 ? month : '0' + month) + '-' + '01' + " " + "00:00:00"
          document.getElementById('myChart').remove();
          document.getElementById('abc').innerHTML='<canvas id="myChart" width="100%" height="100%"></canvas>'
          this.freshData()
        }
      },
      costCategrey(type){
        billDetail.bind(this)({
          type: this.dtype,
          carCostType: type,
          beginTime: this.beginDate,
          endTime: this.endDate
        }, (data) => {
          this.detailBill = data
        }, (error) => {
          this.$.toast(error)
          return false;
        })
      },
      showSnackbar() {
        this.snackbar = true
        if (this.snackTimer) clearTimeout(this.snackTimer)
        this.snackTimer = setTimeout(() => {
          this.snackbar = false
        }, 2000)
      },
      hideSnackbar() {
        this.snackbar = false
        if (this.snackTimer) clearTimeout(this.snackTimer)
      },
    }
  }
</script>

<style lang="scss">
  @import "../../scss/common-styles.scss";
  @import "../../scss/variables.scss";
  #car-bill {
    .left-font {
      padding: 10px 0px 0px 10px;
      text-align: left
    }
    #myChart {
      display: none
    }
    #table{
      overflow: auto
    }
    .center-font {
      text-align: center;
      font-size: 2em
    }
    .right-font {
      padding: 0px 10px 10px 0px;
      text-align: right
    }
    .date-font {
      text-align: center;
      margin-right: 20px;
      display: none;
      .mu-date-picker{
        top:-4px
      }
    }
    .date-font-other {
      text-align: center;
      margin-right: 20px;
      font-size:14px;
    }
    .mu-text-field-line {
      display: none
    }
    .mu-text-field-input {
      font-size: 14px;
      display: inline-block;
      margin-top: 2px;
      display: none;
    }
    .date {
      height: 40px;
      line-height: 40px;
      width: 190px;
      margin: 0 auto
    }
    .data-border {
      border-left: 1px solid #ededed;
      border-right: 1px solid #ededed;
    }
    .arrow-left {
      width: 20;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 10px solid #888888;
      float: left;
      margin: 10px 10px 0px 0px
    }
    .arrow-right {
      width: 20;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #888888;
      float: right;
      margin-top: -30px
    }
    .flex-date {
      text-align: center;
      background-color: #ffffff;
      height: 26px;
      line-height: 26px;
      margin: 4px 0px 4px 0px !important
    }
    .mu-date-picker {
      width: 100px;
      .mu-text-field {
        font-size: 16px;
        width: 120px;
        height: 20px;
        line-height: 20px;
        text-align: -webkit-auto;
        color: rgba(0, 0, 0, 0.54);
        margin-bottom: 8px;
        min-height: 0px
      }
    }
    .mu-item-text, .mu-item-after {
      color: #000
    }
    .mu-item-right {
      width: 140px;
      right: 0px;
    }
    .mu-item.show-right{
      padding:1em
    }
    .dataBg {
      background: #f0eff4;
      width: 100%
    }
    .tabBg {
      background: #f7f7f7;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9
    }
    .add_icon {
      background: url(../../assets/icon_add.png);     
      margin: 20px;
      width: 26px;
      height: 26px;
      background-size: 2.2em;
      float: right;
      position: fixed;
      bottom: 33px;
      right: -3px;
    }
    #month {
      border-bottom: 1px solid #f98700
    }
    .staticIcon {
      background: url(../../assets/icon_chart_car.png) no-repeat;
      background-size: 2.5em;
      width: 33px;
      height: 33px;
      position: fixed;
      right: 10px;
      top: 8px;
      z-index: 100;
    }
    .listIcon {
      background: url(../../assets/icon_list_car.png) no-repeat;
      background-size: 2.5em;
      width: 34px;
      height: 34px;
      position: fixed;
      right: 10px;
      top: 5px;
      z-index: 100;
    }
    .one {
      margin: 20px 0px 0px 68px;
      color: #f98700
    }
    .two {
      margin: 20px 0px 0px 58px;
      color: #90c67b
    }
    .three {
      margin: 20px 04px 0px 48px;
      color: #f85351
    }
    .four {
      margin: 20px 38px 0px 38px;
    }
    #circularMenu {
      padding: 0;
      margin: 0 auto;
      list-style: none;
      position: relative;
      width: 280px;
      height: 280px;
      border: dashed;
      border-radius: 50%;
      border-top-color: #929292;
      border-bottom-color: #fff;
      border-right-color: #929292;
      border-left-color: #929292;
      font-size: 12px
    }
    #circularMenu li {
      display: block;
      width: 50px;
      height: 50px;
      position: absolute;
    }
    #circularMenu li.home {
      background: url(../../assets/bill_carmaintain.png) no-repeat center center;
      background-size: 2.5em;
      top: 93px;
      left: 247px
    }
    #circularMenu li.chat {
      background: url(../../assets/bill_shoppingcars.png) no-repeat center center;
      background-size: 2.5em;
      top: 200px
    }
    #circularMenu li.upload {
      background: url(../../assets/bill_extras.png) no-repeat center center;
      background-size: 2.5em;
      left: 220px;
      top: 200px
    }
    #circularMenu li.email {
      background: url(../../assets/bill_upgrade.png) no-repeat center center;
      background-size: 2.5em;
      top: 93px;
      left: -23px
    }
    #circularMenu li.address {
      background: url(../../assets/bill_oil.png) no-repeat center center;
      background-size: 2.5em;
      top: -25px;
      left: 115px
    }
    #circularMenu li.center {
      background: url(../../assets/icon_account_cost.png) no-repeat center center;
      height: 50px;
      width: 60px;
      left: 110px;
      top: 90px;
      background-size: 2.5em
    }
    #circularMenu li span.span1 {
      position: relative;
      left: 50px;
      top: 10px;
      white-space: nowrap;
    }
    #circularMenu li span.span2 {
      position: relative;
      left: 50px;
      top: 10px;
      display: block;
      white-space: nowrap;
    }
    #circularMenu li span.span3 {
      position: relative;
      left: -50px;
      top: 10px;
      display: block;
      white-space: nowrap;
    }
    #circularMenu li span.span4 {
      position: relative;
      top: 50px;
      left: 10px;
      white-space: nowrap;
    }
    #circularMenu li span.span5 {
      position: relative;
      top: 50px;
      display: block;
      text-align: center;
      white-space: nowrap;
    }
    #circularMenu li span.span6 {
      position: relative;
      left: 0px;
      top: 50px;
      white-space: nowrap;
    }
    #circularMenu li span.span7 {
      position: relative;
      left: 0px;
      top: 50px;
      display: block;
      white-space: nowrap;
    }
    #circularMenu li span.span8 {
      position: relative;
      left: 0px;
      top: 50px;
      display: block;
      white-space: nowrap;
    }
  }
</style>

