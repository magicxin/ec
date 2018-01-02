<template>
  <div id="submit" class="background-gray">
    <!-- <icar-header main-text="提交订单" bg-color="#F7F7F7" text-color="#1B1B1B">
      <img slot="" src="../../assets/left-gray.svg">
    </icar-header> -->
      <magic-header titleName="提交订单"></magic-header>
    <div class="divide_no_bod"></div>
    <cells>
      <cell :link="false" value="1元">
        <p slot="label">米琪林轮胎 205/55R16 PRIMACY 3ST</p>
      </cell>
      <cell :link="false">
        <p slot="label">数量</p>
        <number slot="value" class="number"></number>
      </cell>
      <cell :link="false" value="¥1">
        <p slot="label">小计</p>
      </cell>
    </cells>
    <div class="divide_no_bod"></div>
    <!-- </div> -->
    <cells>
      <cell>
        <p slot="label">抵用券</p>
      </cell>
      <cell value="¥1" :link="false">
        <p slot="label">订单总价</p>
      </cell>
    </cells>
    <div class="divide_no_bod"></div>
    <cells>
      <cell :link="false">
        <p slot="label">您绑定的手机号码</p>
      </cell>
      <cell value="绑定新号码">
        <p slot="label">137****2234</p>
      </cell>
    </cells>
    <div class="divide_no_bod"></div>
    <mu-flat-button label="提交订单" v-go="'/payment'" class="demo-flat-button" backgroundColor="#a4c639" color="#FFF"/>
  </div>
</template>

<script>
  // import icarHeader from 'components/my-header'
  import magicHeader from 'components/magicHeader'
  import cells from 'components/cells'
  import cell from 'components/cell'
  import number from 'components/number'
  export default {
    name: 'eve_submitOrder',
    components: {
      magicHeader,
      cells,
      cell,
      number
    }
  }
</script>
<style>
  #submit p{
    font-size: 14px;
  }

  #submit .number{
    float: right;
    display: inline-block;
    margin-top: 10px;
  }

  #submit button {
    width: 90%;
    margin-left: 5%;
  }
</style>
