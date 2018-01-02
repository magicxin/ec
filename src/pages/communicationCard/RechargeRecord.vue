<template>
  <div style="height:100%;display:flex;flex-direction:column;">
    <magic-header  titleName="充值记录"></magic-header>

    <div class="recharge-package">
      <div class="one-month-record">
        <!-- <div class="montn-name">2016年12月</div> -->
        <record-item v-for="item in records"
                     :key="item"
                     :date="item.date" 
                     :time="item.time"
                     :desc="item.desc"
                     :status="item.status"
                     :amount="item.amount">
        </record-item>
      </div>
      <!-- <div class="one-month-record">
        <div class="montn-name">2016年12月</div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import icarHeader from 'components/my-header';
import magicHeader from "components/magicHeader";
import recordItem from './RecordItem';

export default {
  name: 'FlowPackage',
  components: {
    magicHeader,
    recordItem
  },
  data() {
    return {
      progress: {
        strokeColor: '#ff8d00',
        width: 50,
        striped: true,
        percentage: 26
      },
      records:[],
      simId:''
    };
  },
  created() {
    // 动态设置圆形进度条的大小
    this.progress.width = Math.min(document.body.clientWidth / 4);
    this.simId = this.$route.params.simId
    this.getRecords()
  },
  methods: {
    getRecords(){
      this.$.get({
        methodName:'ListSimRechargeRecord',
        simId:this.simId
      }).then(resp=>{
        resp = resp.data
        if(resp.resultCode === '100'){
          resp.simRechargeRecordDatas.forEach(data=>{
            this.records.push({
              amount:data.balance || '',
              date:data.rechargeTime.split(' ')[0],
              time:data.rechargeTime.split(' ')[1],
              desc:data.rechargePackageName,
              status:data.state === '1'? '充值成功':'充值失败'
            })
          })
          console.log('records: ',this.records)
        }
      })
    }
  }
};
</script>

<style lang="scss">
.recharge-package {
  flex-grow: 1;
  background-color: #efeff4 !important;
  padding-top: 50px;
  flex-direction: column;
  align-items: center;
  .one-month-record {
    width: 100%;
    background-color: #efeff4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .montn-name {
      padding-left: 5vw;
      color: #1a1a1a;
      font-size: 15px;
      height: 5vh;
      line-height: 5vh;
    }
  }
}
</style>
