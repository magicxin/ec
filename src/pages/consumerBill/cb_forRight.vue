<template>
  <div id="cbForRIght">
    <icar-header main-text="会员权益" bgColor="#F7F7F7" textColor="#242424" >
      <img :src="left" alt="" >
    </icar-header>
    <h3>{{name}}</h3>
    <mu-divider />
    <div layout="row" layout-align="center center" class="desc">
      <h4 flex="nogrow">详情说明</h4>
      <p flex>{{description}}</p>
    </div>
    <grids>
      <grid layout="column" layout-align="center center" v-for="(item,index) in rightsList" :key="index">
        <img :src="addPath(item.logo)">
        <figcaption :title="item.name">{{item.name}}</figcaption>
      </grid>
    </grids>
    <footer>以上内容由商家提供, 如有疑问请咨询商家</footer>
  </div>
</template>
<script>
  /* eslint-disable */
  import Vue from 'vue'
  import icarHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'
  import grids from 'components/grids.vue'
  import grid from 'components/grid.vue'
  import right1 from 'assets/right1.png'
  import right2 from 'assets/right2.png'
  import right3 from 'assets/right3.png'
  import right4 from 'assets/right4.png'
  import right5 from 'assets/right5.png'
  import right6 from 'assets/right6.png'
  import right7 from 'assets/right7.png'
  import right8 from 'assets/right8.png'
  import right9 from 'assets/right9.png'
  import right10 from 'assets/right10.png'
  import right11 from 'assets/right11.png'
  import right12 from 'assets/right12.png'




  export default {
    data () {
      return {
        left,
        name: '',
        description: '',
        rightsList: '',
        rights: [{
          icon: right1,
          name: '免费救援'
        }, {
          icon: right2,
          name: '免费洗车'
        }, {
          icon: right3,
          name: '免费检测'
        }, {
          icon: right4,
          name: '优先服务'
        }, {
          icon: right5,
          name: '生日赠礼'
        }, {
          icon: right8,
          name: '节日赠礼'
        }, {
          icon: right9,
          name: '原厂保障'
        }, {
          icon: right11,
          name: '两年质保'
        }, {
          icon: right6,
          name: '代办年检'
        }, {
          icon: right7,
          name: '代办保险'
        }, {
          icon: right2,
          name: '免费洗车'
        }, {
          icon: right3,
          name: '免费检测'
        }, {
          icon: right4,
          name: '优先服务'
        }, {
          icon: right11,
          name: '两年质保'
        }, {
          icon: right6,
          name: '代办年检'
        }]
      }
    },

    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryRights',
        shopId: to.query.shopId,
        type: '0'
      }).then(resp => {
        next(vm => {
          vm.description = resp.data.description
          vm.name = to.query.name
          vm.rightsList = resp.data.rightsCategorys
        })
      })

    },
    components: {
      icarHeader,
      grids,
      grid
    }
  }
</script>

<style lang="scss">
  #cbForRIght p {
    word-break:break-all;
  }

  #cbForRIght {
    .desc {
      margin-bottom: 20px;
      img{
        width: 70% !important;
      }
    }
    .grid{
      &::before, &::after{
        display: none
      }
    }
    figcaption{
      margin-top: 4px;
      color: black;
      height: 24px;
      line-height: 12px;
      overflow: hidden;
    }
    footer{
      position: absolute;
      width: 100%;
      text-align: center;
      /*bottom: 50px;*/
      margin-top: 40px;
      /*font-size: 1.1rem;*/
      color: #ccc;
    }
  }

  #cbForRIght h3 {
    margin: 20px 20px;
    font-weight: normal;
  }

  #cbForRIght h4 {
    margin: 20px;
    color: #959496;
  }

  #cbForRIght p {
    /*margin-top: 15px;*/
    color: #2D2D2D;
    margin-right: 10px;
    line-height: 15px;
  }

</style>
