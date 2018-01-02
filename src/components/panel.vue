<template>
  <div id="panel" layout="row">
    <div flex="nogrow" class="chose">
      <slot name="chose"></slot>
    </div>
    <div flex="nogrow" class="panel_box_img" @click="goDetail">
      <img :src="addPath(value.image)" alt="" v-if="value.image">
      <img :src="defaultImg" alt="" v-else>
    </div>
    <div flex layout="column" class="panel_box_bd" @click="goDetail">
      <div flex>
        <h4 class="sm_f panel_h4">
          {{propValue}}
        </h4>
        <slot name="service" v-if="service"></slot>
      </div>
      <div flex="nogrow" style="padding-top:7px;">
        <slot name="desc"></slot>
      </div>
      <div flex="nogrow" style="padding-top:7px;">
        <slot name="check"></slot>
      </div>
      <div flex layout="row" layout-align="center center" class="discrbition">
        <div flex="grow">
          <slot name="price"></slot>
        </div>
        <div flex="noshrink">
          <slot name="number"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import defaultImg from 'assets/default_user_icon.png'
  // import mi
  export default {
    name: 'panel',
    data () {
      return {
//        propValue:"",
        defaultImg
      }
    },
    created(){
      // 由于声明周期问题，propValue不一定有值，改为computed方式来获取propValue，此处进行注释
//        let currentUrl = this.$router.history.current.name;
//            if(currentUrl=="channel"){
//               //修改后台编辑商品名称属性，但是这个组件在爱车频道也使用了，所以进行判断
//              this.propValue = this.value.name//爱车频道标题
//            }else{
//              this.propValue = this.value.fullName //商品列表
//            }
    },
    computed: {
      propValue() {
        let currentUrl = this.$router.history.current.name;
        if(currentUrl=="channel"){
          //修改后台编辑商品名称属性，但是这个组件在爱车频道也使用了，所以进行判断
          return this.value.name//爱车频道标题
        }else{
          return this.value.fullName //商品列表
        }
      }
    },
    methods: {
      goDetail () {
        if (!this.link) {
          return true
        }
        if(this.isValid){
          return
        }
        if (this.value.categoryType === '1') {
          this.$router.push({name: 'sg_goods', params: {id: this.value.id, name: '1'}})
        } else {
          this.$router.push({name: 'sg_goods_car', params: {id: this.value.id, name: '1'}})
        }
      }
    },

    props: {
      value: {
        type: Object,
        default () {
          return {
            name: 'hhahahah'
          }
        }
      },
      link: Boolean,
      service: {
        type: Boolean,
        default () {
          return false
        }
      },
      isValid:{ //判断是否失效
        type: Boolean,
        default () {
          return false
        }
      }
    }
  }
</script>

<style>

  #panel {
    background-color: #fff;
    padding-top: 8px;
    padding-bottom: 8px;
    position: relative;
    max-height: 110px;
  }

  #panel .chose {
    align-self: center;
    padding-left: 2px;
  }

  #panel .mu-checkbox {
    position: relative;
    left: 4px;
  }

  #panel img {
    width: 100%;
    position: relative;
    /*margin-top: 50%;*/
    top: 50%;
    transform: translateY(-50%);
    vertical-align: middle;
  }

  #panel .panel_box_img {
    width: 80px;
    height: 80px;
    margin-left: 15px;
    text-align: center;
    overflow: hidden;
  }

  #panel .panel_box_bd {
    padding-left: 3%;
  }

  #panel:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #panel i {
    font-size: 25px !important;
  }

  #panel .panel_h4 {
    line-height: 1.2em;
    height: 2.4em;
    overflow: hidden;
    position: relative;
    font-weight: normal;
    color: black;

    /*display: -webkit-box !important;
    width: 100%;
    overflow : hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: black;
    font-weight: 500;
    line-height: 1.2;*/
  }
</style>
