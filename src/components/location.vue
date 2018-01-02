<template>
  <div class="location" layout="row" layout-align="center center" id="location">
    <div class="location-icon" flex="nogrow">
      <!--<mu-icon value="location_on"></mu-icon>-->
      <img :src="location" alt="" width="30">
    </div>
    
    <div flex layout="column" layout-align="center flex-start" class="location_desc">
      <h4 flex>
        {{value.consignee}}  <span>{{value.phone}}</span>
      </h4>
      <p flex>
        {{value.areaName}}{{value.address}}
        <!--吉林省长春市高新技术产业开发区光谷大街2388号国家汽车产业园210室-->
      </p>
    </div>
    <mu-icon value="keyboard_arrow_right" v-if="link"></mu-icon>
  </div>
</template>

<script>
  // import location from 'assets/location.svg'
  import location from 'assets/location.png'
  import right from 'assets/right-gray.png'

  export default {
    name: 'location',
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      },
      link: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    data () {
      return {
        location,
        right
      }
    }
  }
</script>

<style>
  #location .right img {
    width: 12px;
    height: 12px;
  }

  #location .location_on , #location .keyboard_arrow_right{
    color: #7B7B7B;
  }

  #location {
    background-color: #fff;
    position: relative;
    overflow: hidden;
    /*font-size: 16px;*/
    line-height: 1.41176471;
    padding-bottom: 10px;
    padding-top: 10px;
  }

  #location .location-icon {
    margin-right: 10px;
    padding-left: 10px;
  }


  #location .location_desc h4{
    color:#FA9A29;
    font-size: 1.3rem;
    font-weight: normal;
  }

  #location .location_desc h4 span{
    margin-left: 20px;
    color:#FA9A29;
  }

  #location .location_desc p{
    font-size: 13px;
    line-height: 20px;
    color:#666666;
  }

  #location .right{
    width: 15px;
    margin-right: 4px;
  }
</style>