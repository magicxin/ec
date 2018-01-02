<template>
  <div class="container">
    <magic-header  titleName="物流信息"></magic-header>
    <div layout="row" class="logistics-result">
      <img class="logistics-img" :src="queryData.shippingItems[0].image ? addPath(queryData.shippingItems[0].image) : defaultImg" alt="">
      <div flex layout="column">
        <p flex class="result-text">
          物流状态：<span class="result-text-ctrl">{{state}}</span>
        </p>
        <p flex class="result-text">
          物流公司：{{queryData.logistics}}
        </p>
        <p flex class="result-text">
          快递单号：{{queryData.expressSn}}
        </p>
      </div>
    </div>

    <div class="logistics-content">
      <div class="logistics-item" :class="{'first-item': index === 0}" layout="column" layout-align="center flex-start" v-for="(item, index) in queryData.shippingTraces">
        <p flex class="item-text" :class="{'first-text': index === 0}">{{item.station}}</p>
        <span class="item-time" :class="{'first-time': index === 0}">{{item.happenTime}}</span>
        <span class="logistics-item-point" :class="{'first-point': index === 0}"></span>
        <mu-divider/>
      </div>
    </div>
  </div>
</template>
<script>
	import Vue from 'vue'
  import magicHeader from 'components/magicHeader'
  import defaultImg from 'assets/default_user_icon.png'


  export default {
    name: 'l_logistics',
    data () {
      return {
        defaultImg,
        queryData: {
          shippingItems: [{}]
        }
      }
    },

    components: {
      magicHeader
    },
    computed: {
      state () {
        switch (this.queryData && this.queryData.state) {
          case '0':
            return '无轨迹'
          case '1':
            return '已揽收'
          case '2':
            return '在途中'
          case '3':
            return '已签收'
          case '4':
            return '问题件'
          case '5':
            return '问题件'
        }
      }
    },
    created(){
      this.$.get({
        shippingSn: this.$route.params.shippingSn,
        methodName: 'QueryLogistics'
      }).then(res =>{
        //校验返回是否为100否则提示错误
        if(res.resultCode == '100'){
          res.data.shipping.shippingTraces = res.data.shipping.shippingTraces.reverse()
          this.queryData = resp.data.shipping
        }else{
          this.$.toast('服务器错误')  
        }
      })
    }
  }
</script>

<style scoped>
  .container {
    background-color: #efeff4;
  }
  .logistics-result {
    margin-top: 10px;
    padding: 15px;
    background-color: #fff;
  }

  .logistics-result>div {
    height: 75px;
  }

  .logistics-img {
    width: 80px;
    height: 75px;
    line-height: 75px;
    text-align: center;
    margin-right: 0.8em;
  }

  .result-text {
    font-size: 1.1rem;
    line-height: 25px;
    color: #3f3f3f;
    word-break: keep-all;
    white-space: nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .result-text-ctrl {
    color: #c60007;
  }

  .logistics-content .logistics-item:last-child::before{
    height: 30%;
  }

  .logistics-content {
    background-color: #fff;
    margin-top: 10px;
  }

  .logistics-item {
    padding-left: 50px;
    position: relative;
  }

  .logistics-item::before {
    content: '';
    width: 1px;
    height: 100%;
    background-color: #b7b7b7;
    position: absolute;
    left: 28px;
    transform: scaleX(0.5);
  }

  .logistics-item.first-item::before {
    top: 22px;
  }

  .logistics-item-point {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #b7b7b7;
    position: absolute;
    left: 24px;
    top: 20px;
  }

  .first-item .logistics-item-point {
    width:11px;
    height: 11px;
    left: 23px;
    background-color: #c60007;
  }
  .first-item::after {
    content: '';
    width: 33px;
    height: 33px;
    border: 3px solid #e07377;
    border-radius: 50%;
    transform: scale(0.5);
    position: absolute;
    left: 12px;
    top:9px;
  }

  .item-text {
    font-size: 1rem;
    line-height: 1.87;
    color: #939393;
    padding-top: 8px;
  }

  .first-text {
    color: #c60007;
  }

  .item-time {
    font-size: 1.1rem;
    line-height: 1.87;
    color: #939393;
    padding: 5px;
    padding-left: 0;
  }

  .first-time {
    color: #363636;
  }
</style>
