<template>
  <div id="cb_bill">
    <my-header main-text="使用记录" bg-color="#f7f7f7" text-color="#030303" line-color="#d8d8d8">
      <img src="../../assets/left-gray.svg" alt="">
    </my-header>
  
    <!--<mu-tabs :value="activeTab" @change="handleTabChange" class="test">
      <mu-tab value="tab1"  title="日" class="tab-title-class"/>
      <mu-tab value="tab2"  title="月" class="tab-title-class"/>
      <mu-tab value="tab3"  title="年"/>
    </mu-tabs>-->

    <!--<div class="bill-body">
      <div v-if="activeTab === 'tab3'" class="bill-head">
        <span class="icon-img-first">
          <img src="../../assets/last-gray.svg">
        </span>
        <h2>2016</h2>
        <span class="icon-img-last">
          <img src="../../assets/next-gray.svg">
        </span>
      </div>-->

      <!--<div class="bill-main" v-if="activeTab === 'tab3'">-->
        <div class="purse-content">
          <!-- <div class="content-year">2016年</div> -->
          <layout justify="space-between" class="content-main">
            <flex basis="none" shrink="0" grow="0" class="main-left">
              <span class="main-name">阿打发士大夫的撒地方撒旦法上的是打发第三方</span>
              <br/>
              <span class="main-time">02-58 11.36</span>
            </flex>
            <flex class="main-price" basis="none" shrink="0" grow="0">
              ¥ 999元
            </flex>
          </layout>
          <layout justify="space-between" class="content-main content-main-noborder">
            <flex basis="none" shrink="0" grow="0" class="main-left">
              <span class="main-name">撒地方打折呀</span>
              <br/>
              <span class="main-time">02-58 11.36</span>
            </flex>
            <flex class="main-price" basis="none" shrink="0" grow="0">
              ¥ 999元
            </flex>
          </layout>
        </div>

        <div class="purse-content">
          <div class="content-year">2017年</div>
          <layout justify="space-between" class="content-main">
            <flex basis="none" shrink="0" grow="0" class="main-left">
              <span class="main-name">阿打发士大夫的撒地方</span>
              <br/>
              <span class="main-time">02-58 11.36</span>
            </flex>
            <flex class="main-price" basis="none" shrink="0" grow="0">
              ¥ 999元
            </flex>
          </layout>
          <layout justify="space-between" class="content-main content-main-noborder">
            <flex basis="none" shrink="0" grow="0" class="main-left">
              <span class="main-name">hello盛开的积分地方</span>
              <br/>
              <span class="main-time">02-58 11.36</span>
            </flex>
            <flex class="main-price" basis="none" shrink="0" grow="0">
              ¥ 999元
            </flex>
          </layout>
      </div>

  </div>
</template>
<script>
  import myHeader from 'components/my-header'
  export default {
    name: 'cb_bill',
    data () {
      return {
        activeTab: 'tab3'
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      }
    },
    components: {
      myHeader
    }
  }
</script>

<style>
  #cb_bill .test {
    margin-bottom: 0;
  }

  #cb_bill .mu-tab-link-highlight {
    background-color: #be0000;
  }

  #cb_bill .mu-tab-text{
    font-size: 16px;
  }

  #cb_bill .mu-tab-active .mu-tab-text{
    color: #be0000;
  }

  #cb_bill .tab-title-class::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 0;
    width: 1px;
    height: 60%;
    background-color: #929292;
  }

  #cb_bill .bill-head {
    height: 60px;
    width: 100%;
    background-color: #efeff4;
    position: relative;
  }

  #cb_bill .bill-head h2 {
    font-size: 20px;
    text-align: center;
    line-height: 60px;
  }

  #cb_bill .icon-img-first {
    position: absolute;
    left: 20%;
    top: 32%;
    transform: 
  }

  #cb_bill .icon-img-last {
    position: absolute;
    right: 20%;
    top: 32%;
  }

  #cb_bill .purse-content {
    background-color: #efeff4;
  }

  #cb_bill .content-year {
    font-size: 16px;
    color: #858584;
    /*font-weight: 300;*/
    padding: 18px 0 8px 15px;
  }

  #cb_bill .content-main {
    padding: 15px;
    background-color: #fff;
    border-bottom: 1px solid #bebebe;
    max-width: 100%;
  }

  #cb_bill .content-main-noborder {
    border-bottom: none;
  }

  #cb_bill .main-left {
    width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #cb_bill .main-name {
    font-size: 14px;
    color: #030303;
    line-height: 1.87;
  }

  #cb_bill .main-time {
    font-size: 14px;
    color: #858584;
  }

  #cb_bill .main-price {
    font-size: 16px;
    /*color: #f01919;*/
  }
</style>
