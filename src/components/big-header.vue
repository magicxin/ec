<template>
  <div layout="column" class="big-header" :style="{backgroundColor: bgColor}" id="bigHeader">
    <div flex layout layout-align="center center" class="header-top">
      <img src="../assets/left-blank.svg" class="header-back-img" alt="返回" v-tap="{methods: goBack}">
      <div flex layout="column">
        <div class="main-img">
          <!-- 头像图片，图片宽高均为75px,并需加样式border-radius: 50%; -->
          <slot name="main-img"></slot>
        </div>
        <p class="center-text">{{name}}</p>
        <section flex layout="row" class="desc">
          <section flex class="text-right" @click="goToIntegralList">
            积分: {{growthValue}}
          </section>
          <section flex @click="goToVBeanList">
            V豆: {{vbean}}
          </section>
        </section>
      </div>
      <div class="right-text">
        <!-- 右侧文本按钮，可以写在p,div等标签内 -->
        <slot name="right-text"></slot>
      </div>
    </div>
    <div flex class="header-progress" v-if="scoreText.length">

      <!--新增的进度条上方的百分比-->
      <div class="header-progress-score"><span>{{growthValue}}</span>/{{vipRank}}</div>
      <mu-linear-progress mode="determinate" :max="Number(scoreText[scoreText.length - 1].score)" :value="value"
                          color="#ffcc00"/>
    </div>
    <div flex layout layout-align="space-between" class="score-content">
      <div flex="nogrow"
           class="score-text"
           v-for="(item, index) in scoreText" :key="index"
           basis="36px" shrink="0" grow="0"
           :style="{ color: item.color }">
        <!--{{ item.score }}-->
        <!--<br/>-->
        {{ item.name }}
      </div>
    </div>
    <p class="vip-rule-distance">距下一等级还需{{distenceNumber}}成长值</p>
    <!--<div flex>
      <p class="header-bottom">当前成长值: <span class="header-bottom-score">{{ growthValue }}</span></p>
    </div>-->
  </div>
</template>

<script>

  export default {
    /* eslint-disable */
    watch: {
      // value变化时根据value值改变会员等级颜色
      value (newVal) {
        this.scoreText.forEach(function (value) {
          value.color = '#fff'
        })
      }
    },
    data(){
      return {
        distenceNumber: 0,   // 距离下一等级需要多少成长值
        growthValueNew:0
      }
    },
    methods: {
      goBack (params) {
        if (this.$parent.fromRoute === 'orderManage') {
          this.$router.go(-1)
        } else {
          this.$.push('router_back', null, (resp) => {
            console.log('调用成功')
          })
          // history.go(-1)
        }
      },
      goToIntegralList(){
        this.$router.push({
          name:'vb_integralList'
        })
      },
      goToVBeanList(){
        this.$router.push({
          name:'vb_vBeanList'
        })
      }
    },
    computed: {
      value () {
        // return Math.round(this.growthValue)
        if (!this.scoreText.length) {
          return 0
        }
        let _grid = this.scoreText.length - 1
        if(this.growthValue>=this.scoreText[_grid].score){
          this.growthValueNew = this.scoreText[_grid].score-1
        }else {
          this.growthValueNew = this.growthValue
        }
        let _index
        let _value
        let _max = this.scoreText[_grid].score
        let _offest
        for (let i = 0; i < _grid + 1; i++) {
          if (Number(this.scoreText[i].score) >= this.growthValueNew) {
            _index = i - 1
            break
          }
        }
        console.log(_index + 1)
        // 不明白这段代码是判断什么的   注释掉了 暂时解决了 index = 0 时候的bug

//        if (_index + 1 > this.scoreText.length || !_index) {
//          alert('this.scoreText[_grid].score'+this.scoreText[_grid].score)
//          return this.scoreText[_grid].score
//        }
//        在 会员积分为0 _index值 就为-1 进行判断 直接给_offest 和_super 赋值
        let _super
        if (_index == -1) {
          _offest = 500    //大于0即可
          _super = 0
          //计算
          this.distenceNumber = this.scoreText[_index + 2].score
        } else {
//          正常情况下进行运算
          _offest = this.scoreText[_index + 1].score - this.scoreText[_index].score
          _super = this.growthValue - Number(this.scoreText[_index].score)
          // 计算差距成长值
          this.distenceNumber = (this.scoreText[_index + 1].score - this.growthValueNew) ||(this.scoreText[_index+2].score - this.scoreText[_index+1].score)

        }
        if(this.growthValue>=this.scoreText[_grid].score){
          this.distenceNumber = 0
        }
        _value = _index * _max / _grid + (_super / _offest) * _max / _grid
        return _value
      }
    },
    props: {
      bgColor: {
        type: String,  // big-header的背景颜色,默认蓝色
        default () {
          return '#5487d1'
        }
      },
      isScoreShow: {
        type: Boolean, // 判断是否显示积分,默认显示
        default () {
          return true
        }
      },
      integral: {
        type: Number, // 积分分数,默认为0
        default () {
          return 0
        }
      },
      growthValue: {
        type: Number, // 当前成长值,默认为0
        default () {
          return 0
        }
      },
      vbean: {
        default () {
          return 0
        }
      },
      name: {},
      scoreText: {},
      vipRank: {
        default(){
          return 0
        }
      }
    }
  }
</script>

<style lang="scss">
  #bigHeader {
    .header-top {
      width: 100%;
      position: relative;
    }

    .desc {
      color: #fff;
      height: 30px;
      line-height: 30px;
      font-size: 1.2rem;
      section {
        padding-left: 10px;
        padding-right: 10px;
      }
    }

    .header-back-img {
      width: 28px;
      height: 28px;
      position: absolute;
      left: 10px;
      top: 20px;
    }

    .main-img {
      width: 75px;
      height: 75px;
      margin: 15px auto 0;
    }

    .center-text {
      color: #fff;
      font-size: 1.3rem;
      font-weight: 300;
      margin: 12px auto 0;
      text-align: center;
    }

    .center-text-score {
      color: #ffcc00;
      font-size: 1.4rem;
      vertical-align: center;
    }

    .right-text {
      width: 85px;
      position: absolute;
      right: 0px;
      top: 20px;
      font-size: 1.2rem;
      line-height: 32px;
      font-weight: 300;
      color: #fff;
    }

    .header-progress {
      margin-top: 16px;
    }

    .mu-linear-progress {
      height: 12px;
      border-radius: 8px;
      background-color: #fff;
      width: 90%;
      margin: 0 auto;
      border: 2px solid #fff;
    }

    .score-content {
      width: 92%;
      margin: 0 auto;
    }

    .score-text {
      color: #fff;
      font-size: 12px;
      font-weight: 300;
      text-align: center;
      line-height: 1.6;
    }

    .header-bottom {
      margin: 15px 0 5px 0;
      padding-left: 20px;
      font-size: 16px;
      color: #fff;
      font-weight: 300;
      line-height: 1.87;
    }

    .header-bottom-score {
      /*font-size: 18px;*/
      color: #ffcc00;
    }
  }

</style>
