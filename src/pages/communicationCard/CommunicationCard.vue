<template>
  <div>
    <magic-header  titleName="我的通讯卡" :returnNative="$route.params.native"></magic-header>
    <empty-page v-if="simDatas.length == '0'" message="您暂时没有通讯卡"></empty-page>
    <div class="communication-card" v-if="simDatas.length != '0'">
      <mu-paper class="h-paper" :zDepth="1" v-for="sim of simDatas" :key="sim.id">
        <div class="phone-number">
          <div class="img">
            <img src="../../assets/communication-card-user.png" alt="">
          </div>
          <div class="number">{{sim.number}}</div>
          <div class="status">{{getStatus(sim.status)}}</div>
        </div>
        <div class="remaining">
          <div class="call">
            <div class="label">剩余话费</div>
            <div class="value">
              {{sim.balance}}
              <span>元</span>
            </div>
          </div>
          <div class="flow">
            <vm-progress type="circle" 
                         :width="progress.width" 
                         :stroke-color="progress.strokeColor" 
                         :show-text="progress.showPercent" 
                         :striped="progress.striped" 
                         :percentage="getProgressPercent(sim.remainingData,sim.totalData)"></vm-progress>
            <div class="remain">
              <div class="label">剩余流量</div>
              <div class="value">
                {{sim.remainingData}}
                <span>MB</span>
              </div>
              <div class="percent">剩余{{getProgressPercent(sim.remainingData,sim.totalData)}}%</div>
            </div>
          </div>
          <div class="total-flow">
            <div class="label">总流量</div>
            <div class="value">
              {{sim.totalData}}
              <span>MB</span>
            </div>
          </div>
        </div>
        <div class="handle-btn">
          <div v-for="item in cardInfo" :key="item.name">
            <div class="handle-icon" @click="handle(item.name,sim)">
              <img :class="item.name" :src="item.img" alt="">
            </div>
            <div class="label">{{item.title}}</div>
          </div>

        </div>
      </mu-paper>
    </div>
  </div>
</template>

<script>
// import icarHeader from 'components/my-header';
import VmProgress from './progress';
import magicHeader from "components/magicHeader";
import emptyPage from 'components/empty-page'

//引入图片
import iconChf from "../../assets/communication-card-chf.png"
import iconCll from "../../assets/communication-card-cll.png"
import iconCzjl from "../../assets/communication-card-czjl.png"
import iconXfjl from "../../assets/communication-card-xfjl.png"

export default {
  name: 'CommunicationCard',
  components: {
    VmProgress,
    magicHeader,
    emptyPage
  },
  data() {
    return {
      progress: {
        strokeColor: '#ff8d00',
        width: 40,
        striped: true,
        showPercent: false,
        percentage: 26
      },
      simDatas: [],
      cardInfo:[
        {
          name:'chf',
          title:'充话费',
          img:iconChf
        },
        {
          name:'cll',
          title:'充流量',
          img:iconCll
        },
        {
          name:'czjl',
          title:'充值记录',
          img:iconCzjl
        },
        {
          name:'xfjl',
          title:'消费记录',
          img:iconXfjl
        },
      ]
    };
  },
  created() {
    // 动态设置圆形进度条的大小
    this.progress.width = Math.floor(document.body.clientWidth / 3);
    this.getSimList();
  },
  methods: {
    handle(name,sim) {
      switch(name){
        case 'chf':
            this.$router.push({
              name:'recharge-centre',
              params:{
                simId:sim.id,
                number:sim.number,
                type:sim.type,
                tab:'tab1'
              }
            })
            break
        case 'cll':
            this.$router.push({
              name:'recharge-centre',
              params:{
                simId:sim.id,
                number:sim.number,
                type:sim.type,
                tab:'tab2'
              }
            })
            break
        case 'czjl':
            this.$router.push({
              name:'recharge-record',
              params:{
                simId:sim.id
              }
            })
            break
        case 'xfjl':
            this.$router.push({
              name:'expenses-record',
              params:{
                simId:sim.id
              }
            })
            break
        
      }
    },
    getStatus(status) {
      switch(status){
        case '0':
            return '停用'
            break
        case '1':
            return '启用'
            break
        case '2':
            return '未审核'
            break
      }
    },
    getProgressPercent(remain, total) {
      if(total == '0'){
        return 0 
      }
      return Math.floor(100 * remain / total);
    },
    getSimList() {
      let params = {
        methodName:'ListSim'
      }
      this.$.get(params).then(resp =>{
        let simDatas = resp.data.simDatas
        simDatas.forEach(data =>{
          this.simDatas.push({
            id: data.id || '',
            number: data.number || '',
            iccid: data.iccid || '',
            type: data.type || '',
            balance: data.balance || '0',
            status: data.status || '1',
            totalData: data.totalData || '0',
            remainingData: data.remainingData || '0'
          })
        })
      })
      // this.simDatas = [
      //   {
      //     id: '319',
      //     number: '13596406921',
      //     iccid: '89860617030055782711',
      //     type: '联通',
      //     balance: 56.0,
      //     status: '1',
      //     totalData: '974.83',
      //     remainingData: '274.83'
      //   },
      //   {
      //     id: '322',
      //     number: '15143105241',
      //     iccid: '89860617030055782713',
      //     type: '联通',
      //     balance: 10.23,
      //     status: '0',
      //     totalData: '974.83',
      //     remainingData: '474.83'
      //   },
      //   {
      //     id: '323',
      //     number: '13112345678',
      //     iccid: '89860617030055782714',
      //     type: '联通',
      //     balance: 123.2,
      //     status: '2',
      //     totalData: '974.83',
      //     remainingData: '774.83'
      //   }
      // ];
    }
  }
};
</script>

<style lang="scss">
.communication-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0eff4;
  .h-paper {
    margin-top: 2vh;
    width: 100%;
    text-align: center;
    .phone-number {
      display: flex;
      justify-content: flex-start;
      margin: 2vh 5vw;
      align-items: center;
      position: relative;
      .img {
        width: 25px;
        margin: 0 2vw;
        img {
          width: 100%;
        }
      }
      .number {
        color: #1a1a1a;
        font-size: 20px;
      }
      .status {
        color: #666666;
        margin-right: 2vw;
        position: absolute;
        right: 4vw;
      }
    }
    .remaining {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 5px;
      .flow {
        .remain {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          top: -15vh;
          .label {
            font-size: 12px;
          }
          .value {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            span {
              font-size: 12px;
              font-weight: 400;
            }
          }
          .percent {
            margin-top: 1vh;
            font-size: 12px;
          }
        }
      }
      .label {
        margin: 1vh 0;
        font-size: 12px;
      }
      .value {
        margin: 1vh 0;
        font-size: 18px;
        font-weight: 530;
        span {
          font-size: 12px;
        }
      }
    }
    .handle-btn {
      display: flex;
      justify-content: space-around;
      margin: -8vh 2vw 4vh 2vw;
      .handle-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 45px;
        .chf {
          width: 16px;
        }
        .cll {
          width: 16px;
        }
        .czjl {
          width: 22px;
        }
        .xfjl {
          width: 20px;
        }
      }
    }
  }
}
</style>
