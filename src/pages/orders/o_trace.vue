<template>
  <section id="order-trace">
    <icar-header bgColor="#F7F7F7" mainText="订单追踪" textColor="#474747">
      <img :src="left" alt="">
    </icar-header>
    <ul class="trace-info">
      <template v-for="log in logs">
        <li :class="log.status">
          <p>{{log.content}}</p>
          <span>{{log.createTime}}</span>
        </li>
      </template>
    </ul>
  </section>
</template>

<script>
	import Vue from 'vue'
  import icarHeader from 'components/my-header.vue'

  import left from 'assets/left-gray.svg'

  export default {
    data () {
      return {
        logs: {},
        left
      }
    },
    methods: {
    },
    components :{
      icarHeader
    },
    beforeRouteEnter (to, from, next) {
      let carItem = JSON.parse(to.query.orderItem)
      let type = carItem.type;
      let method = carItem.method;
      let isReviewed = carItem.isReviewed;
      Vue.prototype.$.get({
        orderId: carItem.id,
        methodName: 'QueryOrderLog'
      }).then(resp => {
        next(vm => {
          let logs = resp.data.logs;
          for(let i=0;i<logs.length;i++){
            if(logs[i].createTime){
              if(logs[i+1]){
                if(!logs[i+1].createTime){
                  logs[i].status = 'cur'
                }
              }else{
                logs[i].status = 'cur'
              }
            }else{
              logs[i].status = 'no-started'
            }
          }
          vm.logs = logs

        })
      })
    }
  }
</script>

<style>
  #order-trace .trace-info {
    padding:0 20px 0 50px;
    font-size:14px;
  }
  #order-trace .trace-info li {
    border-bottom:#e5e5e5 solid 1px;
    height:65px;
    position:relative;
    padding:10px 0;
  }
  #order-trace .trace-info li:before {
    background:#ccc;
    border-radius:50%;
    display:block;
    content:' ';
    width:14px;
    height:14px;
    position:absolute;
    top:13px;
    left:-30px;
  }
  #order-trace .trace-info li:after {
    background:#ccc;
    display:block;
    content:' ';
    width:2px;
    height:100%;
    position:absolute;
    top:16px;
    left:-24px;
  }
  #order-trace .trace-info li:last-child {
    border-bottom:none;
  }
  #order-trace .trace-info li:last-child:after {
    display:none !important;
  }
  #order-trace .trace-info li.cur {
    color:#f98700;
  }
  #order-trace .trace-info li.cur:before {
    background:#f98700;
    border:#ffc37c solid 3px;
    border-radius:50%;
    display:block;
    content:' ';
    width:20px;
    height:20px;
    position:absolute;
    top:11px;
    left:-33px;
    z-index:1;
  }
  #order-trace .trace-info li.cur:after {
    background:#ccc;
    display:block;
    content:' ';
    width:2px;
    height:100%;
    position:absolute;
    top:16px;
    left:-24px;
  }
  #order-trace .trace-info li span {
    font-size:12px;
  }
  #order-trace .trace-info li.no-started p {
    color:#aaa;
  }
  #order-trace .trace-info li.no-started span {
    display:none
  }

</style>
