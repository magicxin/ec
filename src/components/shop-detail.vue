<template>
  <div id="shop_detail">
    <layout justify="space-between">
      <layout justify="flex-start" class="p_lf_14">
          <flex v-tap="{methods: goShop}">
            <span class="mini_f"><slot name="name"></slot></span><br><br>
            <span class="mini_f"><slot name="address"></slot></span>
          </flex>
      </layout>
      <layout justify="flex-end">
          <layout justify="space-between" class="span_style">
              <!--<flex><span class="shop" v-on:click="goShop()">店铺</span></flex>-->
              <flex><span class="position" v-tap="{methods:navigation,data:position}">位置</span></flex>
              <flex><span v-tap="{methods:call}" class="call">电询</span></flex>
          </layout>
      </layout>
    </layout>
  </div>
</template>
<style>
  #shop_detail {
    background-color: #bc3833;
    color: #fff;
    padding: 8px;
  }
 #shop_detail .span_style {
    margin-left: 10px;
    margin-top: 10px;
    margin-right: 10px;
    /*width: 155px;*/
  }
 #shop_detail .span_style span {
    padding-top:35px;
    display: inline-block;
    margin-bottom: 10px;
    color: #fff;
  }
 #shop_detail .position {
    border-right: 1px solid #dadada;
    background: url(../assets/location_3.svg) no-repeat center top 2px;
    text-align: center;
    padding-left:15px;
    padding-right: 15px;
  }
  /*店铺样式*/
 #shop_detail .shop {
    border-right: 1px solid #dadada;
    background: url(../assets/icon_shop_w.png) no-repeat center top 2px;
    background-size: 24px 26px;
    text-align: center;
    padding-left:15px;
    padding-right: 15px;
  }
 #shop_detail .call {
    padding-left: 15px;
    background: url(../assets/call_2.svg) no-repeat right top 2px;
  }
 #shop_detail .info {
    margin-top: 14px;
    padding-left: 14px;
    color: #fff;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
  }
  #shop_detail .line {
    line-height: 25px;
  }
  #shop_detail .info {
    padding-right: 10px;
  }
  .p_lf_14  {
    padding-left: 14px;
    text-align: left;
  }
</style>
<script>

import Vue from 'vue'
  export default {
    props: {
      value: {
        type: String,
        default () {
          return '1'
        }
      },
      position: {
        type: Object,
        default () {
          return {}
        }
      },
      shopId: String
    },
    methods: {
      call () {
        this.$.push('router_callOthers',{
        		phone: this.value
        },()=>{
        	console.log('调用成功')
        })
      },
      navigation: function (msg) {
      	console.log(msg)
        let lat = msg.data.latitude
        let lon = msg.data.longitude
        let name = msg.data.name
        console.log('lat:' + lat + ';lon:' + lon + ';name:' + name)
        this.$.push('router_naviToShop', {
          location: {
            lat: lat,
            lon: lon
          },
          name: name
        }, (resp) => {
          window.alert(resp)
        })
      },
      goShop () {
        if (this.shopId !== this.$.shopId) {
          try {
              Vue.prototype.$.setAttr('shopId',this.shopId)
              this.$router.push({
                name: 'sg_goodsList',
                query: {
                  toChild: true
                }
              })
          } catch (e) {
            console.log(e)
            this.$router.push({
              name: 'sg_goodsList',
              query: {
                toChild: true
              }
            })
          }
        } else {
          this.$router.push({
            name: 'sg_goodsList'
          })
        }
        // window.alert('点击店铺')
      }
    }
  }
</script>
