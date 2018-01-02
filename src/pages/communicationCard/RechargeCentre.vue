<template>
  <div>
    <magic-header  titleName="充值中心"></magic-header>
    
    <div class="recharge-centre">
      <mu-paper class="h-paper" :zDepth="1">
        <div class="number">{{userNumber}}</div>
        <div class="from">{{simType}}</div>
      </mu-paper>
      <mu-tabs :value="activeTab" @change="handleTabChange" class="tabs-h">
        <mu-tab value="tab1" title="话费" />
        <mu-tab value="tab2" title="流量" />
      </mu-tabs>
      <div class="tab-wrap">
        <call-package :simId="simId" v-if="activeTab === 'tab1'">
        </call-package>
        <flow-package :simId="simId" v-if="activeTab === 'tab2'">
        </flow-package>
      </div>
    </div>
  </div>
</template>

<script>
// import icarHeader from 'components/my-header';
import magicHeader from "components/magicHeader";
import CallPackage from './CallPackage';
import FlowPackage from './FlowPackage';

export default {
  name: 'RechargeCentre',
  components: {
    magicHeader,
    CallPackage,
    FlowPackage
  },
  data() {
    return {
      progress: {
        strokeColor: '#ff8d00',
        width: 50,
        striped: true,
        percentage: 26
      },
      activeTab: 'tab1',
      userNumber:'',
      simId:'',
      simType:''
    };
  },
  created() {
    // 动态设置圆形进度条的大小
    this.progress.width = Math.min(document.body.clientWidth / 4);
    this.userNumber = this.$route.params.number
    this.activeTab = this.$route.params.tab
    this.simId = this.$route.params.simId
    this.simType = this.$route.params.type
    console.log(this.simId)
  },
  methods: {
    handleTabChange(value) {
      this.activeTab = value;
    }
  }
};
</script>

<style lang="scss">
.recharge-centre {
  display: flex;
  flex-direction: column;
  align-items: center;
  .h-paper {
    margin-top: 2vh;
    width: 96vw;
    .number {
      font-size: 24px;
      margin-top: 2vh;
      margin-left: 4vw;
    }
    .from {
      margin-top: 1vh;
      margin-left: 4vw;
      margin-bottom: 2vh;
    }
  }
  .tabs-h {
    min-height: 20px;
    height: 4vh;
    width: 96vw;
    margin-top: 1vh;
    background-color: #fff;
    .mu-tab-link {
      padding-top: 2px;
      padding-bottom: 2px;
      min-height: 20px;
    }
    .mu-tab-text {
      color: #000;
    }
    .mu-tab-link-highlight {
      background-color: #ff8d00;
    }
  }
  .tab-wrap {
    width: 96vw;
    padding-top: 4vh;
    background-color: #fff;
  }
}
</style>
