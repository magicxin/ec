<template>
  <div id="result">
    <is-header bgColor="#F7F7F7" mainText="确认收货成功" textColor="#474747">
      <img :src="left" alt="">
    </is-header>
    <div layout="column" class="result_box" layout-aling="center center">
      <div flex>
        <mu-icon value="assignment_turned_in"></mu-icon>
      </div>
      <p flex>确认收货成功!</p>
      <div flex>
        <mu-raised-button label="去评价" class="button"  v-tap="{methods: goEvaluate}" />
      </div>
    </div>
  </div>

</template>
<script>
  import isHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  export default {
    name: 'o_result',
    components: {
      isHeader
    },
    methods: {
      goEvaluate () {
        this.$router.replace({
          name: 'el_selfEvaluation',
          query: {
            orderItem: JSON.stringify(this.queryData)
          }
        })
      }
    },
    data () {
      return {
        left,
        queryData: {}
      }
    },
    beforeRouteEnter (to, from, next) {
      let carItem = JSON.parse(to.query.carItem)
      next(vm => {
        vm.queryData = carItem
      })
    }
  }
</script>

<style>
  #result .assignment_turned_in{
    color: #F98100;
    font-size: 50px !important;
  }

  .result_box{
    margin-top: 40px;
    text-align: center;
  }

  #result p{
    line-height: 50px;
    font-size: 1.3rem;
  }

  #result  .button {
    width: 50%;
    font-size: 1.4rem;
    border: 1px solid #515150;
    border-radius: 5px;
  } 
</style>