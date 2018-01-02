
<template>
<div>
    <magic-header :isEve="true" :titleName="LotteryInitInfo.activity && LotteryInitInfo.activity.title ? LotteryInitInfo.activity.title: '幸运大转盘'"></magic-header>
  
  <div id="eve_luckyDraw" :style="{marginTop: isWeChatTop + 'px'}">
    <!-- <my-header main-text="幸运大转盘" bg-color="#fff" text-color="#000" :shop="shop">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <div class="title">
      <h1>还有 {{ LotteryInitInfo.leaveTimes }}次抽奖机会</h1>
    </div>
    <div class="body">
      <div class="body_content_1">
        <ul id="lotterys">
          <li v-for="item in LotteryInitInfo.lotterys" class="li_item">
            <img :src="item.image ? addPath(item.image) : defaultImg(item)" alt="" width="45" height="35" class="imgContent">
            <span :class="{'prize_contentPC': !isNative,'prize_contentWX': isNative}">{{ item.lotteryInfo }}</span>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <span class="bottom_title">恭喜中奖者</span>
        <div class="bottom_body">
          <table>
            <tr v-for="lottery in ListLotteryWinner.lotterys">
              <td>{{ lottery.name.length>5?lottery.name.substring("0","5")+"...":lottery.name}}</td>
              <td>{{ lottery.mobile }}</td>
              <td>{{ lottery.lotteryInfo }}</td>
            </tr>
          </table>
        </div>
        <div class="draw_btn">
          <mu-raised-button label="我的奖品" backgroundColor="#f98700" :fullWidth="isTrue" class="demo-raised-button" v-tap="{methods: go}"
          />
        </div>
        <div class="bottom_foot">
          <h5 class="bottom_foot_title">抽奖细则</h5>
          <div v-html="LotteryInitInfo.rule "></div>
        </div>
        <shopDetail :value="shop.mobile" :position="shop" :shopId="shop.id">
          <span slot="name">{{ shop.name }}</span>
          <span slot="address">{{ shop.address }}</span>
        </shopDetail>
      </div>
    </div>
    <mu-popup position="top" :overlay="false" :popupClass="classArr" :open="topPopup">
      <div class="popup">
        <span class="pop_close" v-on:click="close()">&Chi;</span>
        <p class="title sm_f"> {{ prompt }}</p>
        <p><img :src="popImage ? addPath(popImage) : defaultImg(ListLotteryWinner)" height="45" width="45" alt=""></p>
        <p class="prize mid_f">{{ prize }}</p>
        <button v-tap="{methods: go}" class="sm_f btn" v-if="prizeFlag">点击查看</button>
      </div>
    </mu-popup>
  </div>
</div>
</template>
<script>
	import Vue from 'vue'

  import magicHeader from 'components/magicHeader'
  import goDraw from 'assets/goDraw.png'
  import picCash from 'assets/pic_cash.png'
  import picCoupon from 'assets/pic_coupon.png'
  import picGoods from 'assets/pic_goods.png'
  import picNone from 'assets/pic_none.png'
  import picOnemore from 'assets/pic_onemore.png'
  import picVbeans from 'assets/pic_vbeans.png'

  import shopDetail from 'components/shop-detail'



  export default {
    data () {
      return {
        topPopup: false,
        prize: '暂无',
        ListLotteryWinner: {},
        LotteryInitInfo: {},
        goDraw: goDraw,
        picCash: picCash,
        picCoupon: picCoupon,
        picGoods: picGoods,
        picNone: picNone,
        picOnemore: picOnemore,
        picVbeans: picVbeans,
        prompt: '',
        popImage: '',
        prizeFlag: true,
        activityId: this.$route.params.activityId,
        shop: {},
        isTrue: true,
        classArr: ['demo-popup-top', 'luckyDraw'],
        isWeChatTop: 49,
        isNative: true
      }
    },

    methods: {
      open (position) {
        this[position + 'Popup'] = true
      },
      close () {
        this.topPopup = false
      },
      go () {
        // this.$router.push({ name: 'eve_myPrize', params: { id: this.activityId } })
        if(this.$.userId){
          this.$router.push({ name: 'eve_myPrize', params: { id: this.activityId } })
        }else{
          this.$.goLogin({
                name:'login'
              })
        }
        
      },
      /* eslint-disable */
      defaultImg (val) {
        switch (val.type) {
          case '0':
            return this.picVbeans
            break
          case '1':
            return this.picGoods
            break
          case '2':
            return this.picCoupon
            break
          case '3':
            return this.picOnemore
            break
          case '4':
            return this.picNone
            break
          case '5':
            return this.picGoods
            break
          case '6':
            return this.picCash
            break
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      Promise.all([
        Vue.prototype.$.get({
          methodName: 'LotteryInitInfo',
          type: '0',
          category: '2',
          id: to.params.activityId
        }),
        Vue.prototype.$.get({
          methodName: 'ListLotteryWinner',
          type: '0',
          category: '2',
          id: to.params.activityId
        })
      ])
        .then(result => next(vm => {
          window.scrollTo(0, 0)
          vm.LotteryInitInfo = result[0].data
          vm.shop = result[0].data.shop
          vm.ListLotteryWinner = result[1].data
          if (vm.LotteryInitInfo.leaveTimes < 0) {
            vm.LotteryInitInfo.leaveTimes
          }
          console.log(vm.LotteryInitInfo)
          console.log(vm.ListLotteryWinner)
        }))
    },
    mounted() {
      /* eslint-disable */
      if (this.$.isWechat) {
        this.isWeChatTop = 0
      }
      if (!this.$.isAnroid || !this.$.isIos) {
        this.isNative = false
      } else {
        this.isNative = true
      }

      // window.load = () => {
      setTimeout(() => {
        let flag = 0
        let log = document.createElement('li')
        log.className = 'li_item'
        let img = new Image()
        img.src = this.goDraw
        log.appendChild(img)
        document.querySelectorAll('.li_item')[3].appendChild(log)
        let len = document.getElementById('lotterys').innerHTML += ''
        document.querySelectorAll('.li_item')[4].addEventListener('click', () => {
          if(this.$.userId){

          
          // this.$.getLoginStatus(this.LotteryInitInfo.activity.isScan).then((shopId) => {
            if (this.LotteryInitInfo.state == '0') {
              this.$.toast('稍等片刻，活动即将开始~')
            } else if (this.LotteryInitInfo.state == '2') {
              this.$.toast('本次抽奖已结束')
            } else {
              this.prizeFlag = true
              if (flag === 0 && this.LotteryInitInfo.leaveTimes > 0) {
                flag = 1
                this.LotteryInitInfo.leaveTimes--  //次数减1
                let i = 1
                let resultId = '' //中奖id
                let queryLottery = { 'methodName': 'AttendLottery', 'type': '0', 'category': '2', 'id': this.activityId}

                //中奖信息，根据返回的中奖id调整为页面对应的奖品id
             			this.$.get(queryLottery).then(res => {
                  if (res.data.resultCode === '100') {
                    let resId = null // 中奖id 2
                    this.ListLotteryWinner.type = res.data.prize.type
                    this.LotteryInitInfo.lotterys.forEach((ele, idx) => {
                      if (ele.id == Number(res.data.prize.id)) {
                        resId = idx
                      }
                    }, this)
                    this.popImage = res.data.prize.image
                    if (resId == 4) {
                      resultId = 3
                    } else if (resId == 7) {
                      resultId = 4
                    } else if (resId == 6) {
                      resultId = 5
                    } else if (resId == 5) {
                      resultId = 6
                    } else if (resId == 3) {
                      resultId = 7
                    } else {
                      resultId = resId
                    }
                    // 新建一个数组 把页面上相应的位置添上相应的奖品
                    let arr = [{
                      id: 0,
                      content: this.LotteryInitInfo.lotterys[0]
                    }, {
                      id: 1,
                      content: this.LotteryInitInfo.lotterys[1]
                    }, {
                      id: 2,
                      content: this.LotteryInitInfo.lotterys[2]
                    }, {
                      id: 5,
                      content: this.LotteryInitInfo.lotterys[4]
                    }, {
                      id: 8,
                      content: this.LotteryInitInfo.lotterys[7]
                    }, {
                      id: 7,
                      content: this.LotteryInitInfo.lotterys[6]
                    }, {
                      id: 6,
                      content: this.LotteryInitInfo.lotterys[5]
                    }, {
                      id: 3,
                      content: this.LotteryInitInfo.lotterys[3]
                    }]

                    // 给第一个奖品添加边框颜色
                    document.querySelectorAll('.li_item')[arr[0].id].className = 'li_item box-shadow'

                    // 定时循环
                    let start1 = setInterval(() => {
                      Array.from(document.querySelectorAll('.li_item')).forEach((x) => {
                        x.className = 'li_item'
                      })
                      document.querySelectorAll('.li_item')[arr[i].id].className = 'li_item box-shadow'
                      i++
                      if (i > 7) {
                        i = 0
                      }
                    }, 100)

                    // 一段时间后减缓速度
                    setTimeout(() => {
                      clearInterval(start1)
                      let start2 = setInterval(() => {
                        Array.from(document.querySelectorAll('.li_item')).forEach((x) => {
                          x.className = 'li_item'
                        })
                        document.querySelectorAll('.li_item')[arr[i].id].className = 'li_item box-shadow'
                        i++
                        if (i > 7) {
                          i = 0
                        }
                      }, 300)

                      // 再一次减速
                      setTimeout(() => {
                        clearInterval(start2)
                        let start3 = setInterval(() => {
                          Array.from(document.querySelectorAll('.li_item')).forEach((x) => {
                            x.className = 'li_item'
                          })
                          document.querySelectorAll('.li_item')[arr[i].id].className = 'li_item box-shadow'
                          i++
                          if (i > 7) {
                            i = 0
                          }
                        }, 500)
                        let rand = parseInt(Math.random() * 4000)
                        setTimeout(() => {
                          let start4 = setInterval(() => {
                            if (resultId == 7) {
                              if (Number(i) == Number(resultId) - 7) {
                                clearInterval(start3)
                                clearInterval(start4)
                                this.prize = arr[resultId].content.lotteryInfo
                                if (this.prize.indexOf('谢谢') > -1) {
                                  this.prizeFlag = false
                                  this.prompt = '很遗憾'
                                } else {
                                  this.prompt = '恭喜您获得'
                                }
                                if (this.prize.indexOf('一次') > -1) {
                                  this.LotteryInitInfo.leaveTimes++
                                }
                                setTimeout(() => {
                                  this.topPopup = true
                                }, 500)
                                flag = 0
                              } else {
                              }
                            } else {
                              if (Number(i) == Number(resultId) + 1) {
                                clearInterval(start3)
                                clearInterval(start4)
                                this.prize = arr[resultId].content.lotteryInfo
                                if (this.prize.indexOf('谢谢') > -1) {
                                  this.prizeFlag = false
                                  this.prompt = '很遗憾'
                                } else {
                                  this.prompt = '恭喜您获得'
                                }
                                if (this.prize.indexOf('一次') > -1) {
                                  this.LotteryInitInfo.leaveTimes++
                                }
                                setTimeout(() => {
                                  this.topPopup = true
                                }, 500)
                                flag = 0
                              } else {
                              }
                            }
                          }, 500)
                        }, rand)
                      }, 3000)
                    }, 1000)
                  } else {
                    flag = 0
                    this.LotteryInitInfo.leaveTimes++
                  }
                })
              } else {
                if (flag === 1) {
                  this.$.toast('奖品马上出来，别急~！')
                } else {
                  this.$.toast('抽奖次数用完啦！')
                }
              }
            }
          }else{
            this.$.goLogin({
                name:'login'
              })
          }
          // }, () => {
             
            // goLogin({
            //   query: {
            //     shopId: this.shop.id
            //   }
            // })
          // })
        })
      }, 20)
    },
    components: {
      magicHeader,
      shopDetail
    }
  }

</script>
<style>
  #eve_luckyDraw {
    background: url(../../assets/luckDrawBg.png) no-repeat center top;
    background-size: 100%;
    width: 100%;
    padding-top: 42%;
    background-color: #f74a44;
  }

  #eve_luckyDraw .title {
    padding: 8px;
    width: 170px;
    border-radius: 35px;
    margin: auto;
    text-align: center;
    background-color: #fef2b8;
    background: rgba(254, 242, 185, 0.5);
    font-size: 8px;
  }

  #eve_luckyDraw .body_content_1 {
    width: 82%;
    margin: auto;
    margin-top: 15px;
    background: url(../../assets/turntableBG.png) no-repeat center top;
    background-size: 90%;
    padding: 6% 11.8%;
    text-align: center;
  }

  #eve_luckyDraw .body_content_1:after {
    content: ' ';
    display: block;
    clear: both;
  }

  #eve_luckyDraw .body_content_1 ul li {
    display: inline-table;
    width: 31%;
    height: 17.5vw;
    margin-bottom: 3%;
    margin-right: 3%;
    margin-top: 2%;
    vertical-align: top;
    background-color: #fff4a4;
    border-radius: 10px;
    padding-top: 3%;
    text-align: center;
    line-height: 20px;
  }

  #eve_luckyDraw .draw_btn {
    width: 88%;
    margin: auto;
    margin-top: 20px;
  }

  #eve_luckyDraw .draw_btn button {
    font-size: 16px;
  }

  @media screen and (max-width: 320px) {
    #eve_luckyDraw .body_content_1 ul li {
      display: inline-table;
      width: 31%;
      height: 17.5vw;
      margin-bottom: 1%;
      margin-right: 3%;
      margin-top: 2%;
      vertical-align: top;
      background-color: #fff4a4;
      border-radius: 10px;
      padding-top: 3%;
      text-align: center;
      line-height: 20px;
    }
  }

  #eve_luckyDraw .body_content_1 ul li img {
    width: 45%;
  }

  #eve_luckyDraw .body_content_1 ul li:nth-child(5) {
    background-color: #fb4b26;
  }

  #eve_luckyDraw .body_content_1 ul li:nth-child(5) img {
    width: 65%;
    padding-top: 10%;
  }

  #eve_luckyDraw .body_content_1 ul li p {
    text-overflow: ellipsis;
  }

  #eve_luckyDraw .body_content_1 ul li:nth-child(3),
  #eve_luckyDraw .body_content_1 ul li:nth-child(6),
  #eve_luckyDraw .body_content_1 ul li:nth-child(9) {
    margin-right: 0px;
  }

  #eve_luckyDraw .body_content_1 ul .box-shadow {
    /*box-shadow: 0 0 3px 3px #a78c14;*/
    background-color: #fb4b26
  }

  .bottom {
    margin-top: 7%;
    text-align: center;
  }

  .bottom_title {
    color: #fde25f;
    font-size: 16px;
  }

  .bottom_body {
    width: 88%;
    margin: auto;
    margin-top: 15px;
    background-color: #bc3833;
    color: #fff;
    font-size: 12px;
    padding: 10px;
  }

  .bottom_body table tr td {
    text-align: left;
    width: 100px;
    font-size: 14px;
    padding-bottom: 5px;
  }

  .bottom_body table tr td:nth-child(2) {
    text-align: center;
  }

  .bottom_body table tr td:nth-child(3) {
    text-align: right;
  }

  .bottom_foot {
    margin-top: 18px;
    width: 100%;
    padding: 0px 10%;
    font-size: 12px;
    color: #fff;
    text-align: left;
  }

  .bottom_foot_title {
    color: #ffe461;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .bottom_foot p {
    line-height: 25px;
    padding-bottom: 20px;
  }

  .demo-popup-top {
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
  }

  .luckyDraw .popup {
    width: 70%;
    margin: auto;
    margin-top: 50%;
    opacity: 1;
    background: url(../../assets/winBg.png) no-repeat;
    background-size: 100%;
    position: relative;
    padding-bottom: 10px;
    box-shadow: 0 0 0 0 #8a8a8a;
  }

  .luckyDraw .popup .title {
    color: #fff;
    font-size: 16px;
    padding-top: 25px;
    font-weight: 100;
    margin-bottom: 5px;
  }

  .luckyDraw .popup .prize {
    color: #fff;
    margin-top: 5px;
    padding-bottom: 5px;
  }

  .luckyDraw .popup .image {
    margin-top: 15px;
  }

  .luckyDraw .popup .btn {
    border-radius: 4px;
    padding: 6px 12px;
    color: #f44e38;
    border: 1px solid #f98700;
    background-color: #fff964;
    margin-bottom: 15px;
    outline-style: none;
  }

  .luckyDraw .popup h5 {
    color: #929292;
    font-size: 12px;
    margin-top: 10px;
    padding-bottom: 20px;
  }

  .pop_close {
    position: absolute;
    right: -8px;
    top: 2px;
    display: block;
    width: 25px;
    height: 25px;
    background-color: #fff;
    border-radius: 50%;
    line-height: 23px;
    color: red;
    border: 1px solid red;
    font-size: 14px;
  }

  @media screen and (max-width: 320px) {
    #eve_luckyDraw .body_content_1 {
      width: 90%;
    }
    #eve_luckyDraw .body_content_1 ul li {
      height: 20.5vw;
    }
  }
  #eve_luckyDraw .prize_contentWX {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 5em;
  }
  #eve_luckyDraw .prize_contentPC {
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>