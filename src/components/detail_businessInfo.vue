
<template>
<div>
  <h2 class="info mid_f">商家信息</h2>
  <layout justify="space-between">
    <layout justify="flex-start" class="p_lf_14">
        <flex>
          <span class="mini_f name"><slot name="name"></slot></span><br>
          <label class="col_gay mini_f block"><slot name="address"></slot></label>
        </flex>
    </layout>
    <layout justify="flex-end">
        <layout justify="space-between" class="span_style">
            <flex>
              <span class="shop" v-on:click="goShop()">店铺</span>
            </flex>
            <flex>
              <span class="position" v-on:click="navigation(position)">位置</span>
            </flex>
            <flex>
              <span class="call" v-on:click="call">电询</span>
            </flex>
        </layout>
    </layout>
  </layout>
</div>
</template>
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
        console.log('phone: '+ this.value)
        this.$.push('router_callOthers', {
          phone: this.value
        }, () => {
          console.log('调用成功')
        })
      },
      navigation: function (msg) {
        let lat = msg.latitude
        let lon = msg.longitude
        let name = msg.name
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
              this.$router.replace({
                name: 'sg_goodsList',
                query: {
                  toChild: true
                }
              })
          } catch (e) {
            this.$router.replace({
              name: 'sg_goodsList',
              query: {
                toChild: true
              }
            })
          }
        } else {
          this.$router.replace({
            name: 'sg_goodsList'
          })
        }
        // window.alert('点击店铺')
      }
    }
  }
</script>
<style scoped>
.span_style {
  margin-left: 10px;
  margin-top: 10px;
  margin-right: 10px;
  width: 155px;
}
.span_style span {
  padding-top:35px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
}
.position {
  border-right: 1px solid #dadada;
  background: url(../assets/icon_position.png) no-repeat center top 2px;
  text-align: center;
  background-size: 24px;
  padding-left:15px;
  padding-right: 15px;
}
/*店铺样式*/
.shop {
  border-right: 1px solid #dadada;
  background: url(../assets/icon_shop.png) no-repeat center top 3px;
  background-size: 24px 25px;
  text-align: center;
  padding-left:15px;
  padding-right: 15px;
}
.call {
  padding-left: 15px;
  background: url(../assets/call.svg) no-repeat right top 2px;
}
.info {
  margin-top: 14px;
  padding-left: 14px;
  color: #929292;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 10px;
}
.line {
  line-height: 25px;
}
.info {
  padding-right: 10px;
}
.p_lf_14  {
  padding-left: 14px;
}
h2 {
  font-weight: 500
}
a {
  color: #666;
}
.block {
  display: block;
  margin-top: 6px;
}
.name{
  font-size:1.1rem !important;
}
</style>