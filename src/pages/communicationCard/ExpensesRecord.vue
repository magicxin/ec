<template>
  <div>
    <magic-header  titleName="消费记录"></magic-header>
    <div class="expenses-package">
      <div class="one-month-record">
        <record-item v-for="item in records"
                     :key="item"
                     :date="item.date" 
                     :time="item.time"
                     :desc="item.desc"
                     :status="item.status"
                     :amount="item.amount">
        </record-item>
      </div>
    </div>
  </div>
</template>

<script>
// import icarHeader from 'components/my-header';
import magicHeader from "components/magicHeader";
import RecordItem from './RecordItem';

export default {
  name: 'ExpensesRecord',
  components: {
    magicHeader,
    RecordItem
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
        methodName:'ListSimConsumeRecord',
        simId:this.simId
      }).then(resp=>{
        resp = resp.data
        if(resp.resultCode === '100'){
          resp.simRechargeRecordDatas.forEach(data=>{
            this.records.push({
              amount:data.balance,
              date:data.rechargeTime.split(' ')[0],
              time:data.rechargeTime.split(' ')[1],
              desc:data.rechargePackageName,
              status:data.state === '1'? '扣费成功':'扣费失败'
            })
          })
          console.log('records: ',this.records)
        }
      })
    },
    order() {
      this.bottomPopup = true;
    },
    closeBottomPopup() {
      this.bottomPopup = false;
    },
    handleTabChange(value) {
      this.activeTab = value;
    },
    selectdPackage(index) {
      console.log(index);
      this.packages.map(p => {
        p.active = false;
      });
      this.packages[index].active = true;
    }
  }
};
</script>

<style lang="scss">
.expenses-package {
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
