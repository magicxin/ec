<template>
  <div class="record-item">
    <div class="date-time">
      <div class="date">{{date}}</div>
      <div class="time">{{time}}</div>
    </div>
    <div class="img">
      <img :src="recordItem" alt="">
    </div>
    <div class="amount">
      <div class="value">{{amount}}</div>
      <div class="desc">{{desc}}</div>
    </div>
    <div class="status">
      {{status}}
    </div>
  </div>
</template>

<script>
import recordItem from '../../assets/record-item.png'
export default {
  name: 'RecordItem',
  data() {
    return {
      recordItem:recordItem
    };
  },
  props: {
    date: {
      default: '03-02',
      type: String,
      required: true
    },
    time: {
      default: '13:12',
      type: String,
      required: true
    },
    amount: {
      default: '-100.00',
      type: Number,
      required: true
    },
    desc: {
      default: '流量到期续交扣费',
      type: String,
      required: true
    },
    status: {
      default: '扣费成功',
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.record-item {
  margin-bottom: 2px;
  height: 9vh;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-grow: 1;
  .date-time {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #a5a5a5;
    font-size: 14px;
    margin: 0 2vw 0 4vw;
    .time {
      margin-top: 1vh;
      font-size: 12px;
    }
  }
  .img {
    width: 40px;
    height: 40px;
    margin: 0 2vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .amount {
    margin: 0 2vw;
    color: #333333;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    .value {
      font-size: 15px;
      font-weight: 700;
    }
    .desc {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .status {
    margin-right: 4vw;
    position: absolute;
    right: 1vw;
    color: #a5a5a5;
  }
}
</style>
