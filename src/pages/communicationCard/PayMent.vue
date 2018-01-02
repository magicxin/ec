<template>
  <div class="payment-c">
    <div class="pay-way-wrap">
      <div class="pay-way">
        <mu-radio label="支付宝支付" fullWidth nativeValue="test" v-model="value2" labelLeft/>
        <mu-divider/>
      </div>
      <div class="pay-way">
        <mu-radio label="微信支付" fullWidth nativeValue="test1" v-model="value2" labelLeft/>
        <mu-divider/>
      </div>
    </div>
    <mu-raised-button label="确认支付" fullWidth/>
  </div>
</template>

<script>
import MuPaper from 'muse-components/paper';
import MuIcon from 'muse-components/icon';
import VmProgress from './progress';
import MuIconButton from 'muse-components/iconButton';
import MuDivider from 'muse-components/divider';
import { tabs as MuTabs, tab as MuTab } from 'muse-components/tabs';
import MuRaisedButton from 'muse-components/raisedButton';
import MuRadio from 'muse-components/radio';

export default {
  name: 'PayMent',
  components: {
    MuTabs,
    MuTab,
    MuDivider,
    MuPaper,
    MuIcon,
    VmProgress,
    MuIconButton,
    MuRaisedButton,
    MuRadio
  },
  data() {
    return {
      value2: '',
      progress: {
        strokeColor: '#ff8d00',
        width: 50,
        striped: true,
        percentage: 26
      },
      activeTab: 'tab1',
      payways: [
        {
          active: false,
          index: 0,
          name: '100M',
          price: '售价：80.00元'
        },
        {
          active: false,
          index: 1,
          name: '100M',
          price: '售价：80.00元'
        }
      ]
    };
  },
  created() {
    // 动态设置圆形进度条的大小
    this.progress.width = Math.min(document.body.clientWidth / 4);
  },
  methods: {
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
.payment-c {
  display: flex;
  flex-direction: column;
  align-items: center;
  .pay-way-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .pay-way {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 5vw;
      .mu-radio {
        width: 90%;
        height: 45px;
        .mu-radio-wrapper {
          height: 100%;
        }
      }
    }
  }
  .mu-raised-button {
    background-color: #ff8d00;
    .mu-raised-button-label {
      color: #fff;
    }
  }
}
</style>
