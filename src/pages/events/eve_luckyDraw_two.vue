
<template>

<div>
    <magic-header :isEve="true" :titleName="LotteryInitInfo.activity && LotteryInitInfo.activity.title ? LotteryInitInfo.activity.title: '幸运大转盘'" :returnNative="$route.params.native"></magic-header>
  <div id="eve_luckyDraw_two" class="eve_two" :style="{marginTop: isWeChatTop + 'px'}">
    <!-- <my-header main-text="幸运大转盘" bg-color="#fff" text-color="#000" :shop="shop">
      <img slot="" src="../../assets/left-gray.svg">
    </my-header> -->
    <div class="title">
      <h1>还有 {{ LotteryInitInfo.leaveTimes }}次抽奖机会</h1>
    </div>
    <div class="body">
      <!--       <img :src="'http://carowl.cn' + lottery.image" alt="" v-for="lottery in LotteryInitInfo.lotterys" width="30" height="30" > -->
      <div class="banner">
        <div class="turnplate">
          <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas>
          <img class="pointer" id="pointer" src="../../assets/pointer.png" />
        </div>
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
          <mu-raised-button label="我的奖品" backgroundColor="#f98700" :fullWidth="istrue" class="demo-raised-button" v-tap="{methods: go}"
          />
        </div>
        <div class="bottom_foot">
          <h5 class="bottom_foot_title">活动规则</h5>
          <div v-for="(item,index) in LotteryInitInfo.rule" :key="index">{{item}}</div>
        </div>
        <shopDetail v-if="!isWxPublic" :value="shop.mobile" :position="shop" :shopId="shop.id">
          <span slot="name">{{ shop.name }}</span>
          <span slot="address">{{ shop.address }}</span>
        </shopDetail>
        <div v-if="isWxPublic" class="footer">
        	<div class="left">
        		<div class="info-top">{{ shop.name }}</div>
        		<div class="info-bottom">{{ shop.address }}</div>
        	</div>
        </div>
      </div>
    </div>
    <mu-popup position="top" :overlay="false" :popupClass="classArr" :open="topPopup">
      <div class="popup">
        <span class="close" v-tap="{methods: close}">&times;</span>
        <h4>恭喜您获得</h4>
        <h1>{{ prizaContent }}</h1>
        <button v-tap="{methods: go}" class="btn_two">点击查看</button>
        <h5>奖品已放入您的卡券包中</h5>
      </div>
    </mu-popup>
    <img :src="picVbeans" width="15px" id="vbeans-img" style="display:none;" />
    <img :src="picGoods" width="15px" id="goods-img" style="display:none;" />
    <img :src="picCoupon" width="15px" id="coupon-img" style="display:none;" />
    <img :src="picOnemore" width="15px" id="more-img" style="display:none;" />
    <img :src="picNone" width="15px" id="none-img" style="display:none;" />
    <img :src="picCash" width="15px" id="cash-img" style="display:none;" />
    <img :src="addPath(img.image)" width="50px" :id="'active-img' + index" v-for="img, index in LotteryInitInfo.lotterys" style="display:none;"/>
  </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import Vue from 'vue'


  import magicHeader from 'components/magicHeader'

  import shopDetail from 'components/shop-detail'
  import picCash from 'assets/pic_cash.png'
  import picCoupon from 'assets/pic_coupon.png'
  import picGoods from 'assets/pic_goods.png'
  import picNone from 'assets/pic_none.png'
  import picOnemore from 'assets/pic_onemore.png'
  import picVbeans from 'assets/pic_vbeans.png'

  //
  // console.log(main, 3)
  let _urls = []
  export default {
    components: {
      magicHeader,
      shopDetail
    },
    data () {
      return {
        topPopup: false,
        ListLotteryWinner: {},
        LotteryInitInfo: {},
        queryLotteryDate: {},
        prizaContent: '',
        activityId: this.$route.params.activityId,
        shop: {},
        istrue: true,
        classArr: ['demo-popup', 'luckyDraw_two'],
        picCash: picCash,
        picCoupon: picCoupon,
        picGoods: picGoods,
        picNone: picNone,
        picOnemore: picOnemore,
        picVbeans: picVbeans,
        activeImg: '',
        isWeChatTop: 0,
        isWxPublic:false
      }
    },
		created(){
			//屏蔽
			if(this.$.env === 'wxPublic'){
					this.isWxPublic = true
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
        if(this.$.userId){
        	this.$router.push({ name: 'eve_myPrize', params: { id: this.activityId } })
        }else{
        	this.$.goLogin({
              	name:'login'
              })
        }
      }
    },
    beforeRouteEnter (to, from, next) {

      Promise.all([
        Vue.prototype.$.get({
          methodName: 'LotteryInitInfo',
          category: '2',
          id: to.params.activityId
        }),
        Vue.prototype.$.get({
          methodName: 'ListLotteryWinner',
          category: '2',
          id: to.params.activityId
        })
      ])
      .then(result => next(vm => {
          vm.LotteryInitInfo = result[0].data
          if(vm.LotteryInitInfo.rule){
        	 vm.LotteryInitInfo.rule = vm.LotteryInitInfo.rule.split('；')
        }
          vm.shop = result[0].data.shop
          vm.ListLotteryWinner = result[1].data
          if (vm.LotteryInitInfo.leaveTimes < 0) {
            vm.LotteryInitInfo.leaveTimes = 0
          }
          _urls = []
          vm.LotteryInitInfo.lotterys.forEach((ele, index) => {
            if (ele.image) {
              _urls.push(vm.addPath(ele.image))
            }
          }, vm)
        }))
    },
    /* eslint-disable */
    mounted() {
      window.scrollTo(0, 0)
      if (this.$.isWechat) {
        this.isWeChatTop = 0
      }
      try {
        this.$nextTick(() => {
          let allAngle = []
          let rot = 10
          let aa = 0
          let flag = 0
          let _self = this
          function hy_rotate(obj, rotate) {
            if (obj) {
              function rotate_set_style(obj, key, value) {
                obj.style[key] = value;
              }
              var css3 = 'rotate(' + rotate + 'deg)',
                css3key = 'transform';
              rotate_set_style(obj, css3key, css3);
            }
          }
          let rou = 10
          var turnplate = {
            restaraunts: [],    //大转盘奖品名称
            colors: [],         //大转盘奖品区块对应背景颜色
            outsideRadius: 192, //大转盘外圆的半径
            textRadius: 155,     //大转盘奖品位置距离圆心的距离
            insideRadius: 68,    //大转盘内圆的半径
            startAngle: 0,       //开始角度
            bRotate: false       //false:停止;ture:旋转
          }

          function drawRouletteWheel () {
            var canvas = document.getElementById("wheelcanvas")
            var realContext = canvas.getContext("2d")
            var cacheCanvas = document.createElement("canvas")
            cacheCanvas.width = 422
            cacheCanvas.height = 422
            if (canvas.getContext) {

              //根据奖品个数计算圆周角度
              var arc = Math.PI / (turnplate.restaraunts.length / 2)
              var ctx = cacheCanvas.getContext("2d")

              //在给定矩形内清空一个矩形
              ctx.clearRect(0, 0, 422, 422);

              //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
              ctx.strokeStyle = "#FFBE04";

              //font 属性设置或返回画布上文本内容的当前字体属性
              ctx.font = '16px Microsoft YaHei';
              for (var i = 0; i < turnplate.restaraunts.length; i++) {
                var angle = turnplate.startAngle + i * arc;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();

                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();

                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //----绘制奖品开始----
                ctx.fillStyle = "#E5302F";
                var text = turnplate.restaraunts[i];
                var line_height = 17;

                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);

                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if (text.length > 6) {
                  text = text.substring(0, 6) + '||' + text.substring(6);
                  var texts = text.split('||');
                  for (var j = 0; j < texts.length; j++) {
                    ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                  }
                } else {
                  ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }
                if (_self.LotteryInitInfo.lotterys[i].image && text.length > 1) {
                  // console.log(_self.LotteryInitInfo.lotterys[i].image)
                  let imgName = 'active-img' + i
                  setImg(ctx, imgName)
                } else {
                  if (text.indexOf('金') > 0) {
                    setImg(ctx, 'cash-img')
                  } else if (text.indexOf('豆') > 0) {
                    setImg(ctx, 'vbeans-img')
                  } else if (text.indexOf('券') > 0) {
                    setImg(ctx, 'coupon-img')
                  } else if (text.indexOf('一次') > 0) {
                    setImg(ctx, 'more-img')
                  } else if (text.indexOf('参与') > 0) {
                    setImg(ctx, 'none-img')
                  } else {
                    setImg(ctx, 'goods-img')
                  }
                }

                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();
                //----绘制奖品结束----
              }
            }
            realContext.drawImage(cacheCanvas, 0, 0)
          }

          //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
          let newArr = []
          this.LotteryInitInfo.lotterys.forEach((x) => {
            newArr.push(x.name)
          }, this)
          turnplate.restaraunts = newArr;
          turnplate.colors = ["RGB(255,244,210)", "RGB(255,255,251)", "RGB(255,244,212)", "RGB(255,255,253)", "RGB(255,244,214)", "RGB(255,255,255)", "RGB(255,244,216)", "RGB(255,255,257)", "RGB(255,244,218)", "RGB(255,255,259)"]

          // 图片预加载
          function loadImage (urls, callback) {
            let length = urls.length
            console.log(length)
            let _index = 0
            // 判断是否有图片
            if (length > 0) {
              urls.forEach((ele) => {
                let img = new Image()
                img.src = ele
                if (img.complete) {
                  _index ++
                  if (length === _index) {
                    setTimeout(() => {
                      callback()
                    }, 100)
                  }
                } else {
                  img.onload = function () {
                    _index ++
                    if (length === _index) {
                      callback()
                      setTimeout(() => {
                        callback()
                      }, 50)
                    }
                  }
                }
              })
            } else {
              callback()
            }
          }
          function setImg(ctx, imgName) {
            let img = document.getElementById(imgName);
            if (img && img.complete) {
              img.onload = function () {
                ctx.drawImage(img, -15, 10, 35, 35);
              };
              ctx.drawImage(img, -15, 10, 35, 35);
            } else {
              setTimeout(() => {
                setImg(ctx, imgName)
              }, 50)
            }
          }

          document.querySelector('#pointer').addEventListener('click', () => {
//        	goLogin({
//              query: {
//                shopId: this.shop.id
//              }
//            })
            if(this.$.userId){
            	let shopId = this.$.shopId
                if (this.LotteryInitInfo.state == '0') {
                  this.$.toast('稍等片刻，活动即将开始~')
                } else if (this.LotteryInitInfo.state == '2') {
                  this.$.toast('本次抽奖已结束')
                } else {
                  if (flag === 0 && this.LotteryInitInfo.leaveTimes > 0) {
                    flag = 1
                    let prizeCount = turnplate.restaraunts.length
                    let deviationAngle = 360 / prizeCount
                    let queryLottery = { 'methodName': 'AttendLottery', 'type': '1', 'category': '2', 'id': this.activityId, loading:'false' }

                    this.LotteryInitInfo.leaveTimes--
                    //中奖信息
                    this.$.get(queryLottery).then(res => {
                      if (res.data.resultCode === '100') {
                        this.queryLotteryDate = res.data.prize
                        let resultId = null
                        this.LotteryInitInfo.lotterys.forEach((ele, idx) => {
                          if (ele.id == Number(this.queryLotteryDate.id)) {
                            resultId = idx + 1
                          }
                        }, this)
                        //根据不同的位置进行设置旋转不同的角度
                        if (prizeCount >= 7 && prizeCount <= 8) {
                          allAngle = [360 - (resultId + 2) * deviationAngle + 5, 360 - (resultId + 2) * deviationAngle + 10]
                        } else if (prizeCount == 3) {
                          let random = parseInt(Math.random() * 150);
                          allAngle = [360 - (resultId) * deviationAngle, 360 - (resultId) * deviationAngle + deviationAngle]
                        } else {
                          let random = parseInt(Math.random() * 10);
                          allAngle = [360 - (resultId + 1) * deviationAngle, 360 - (resultId + 1) * deviationAngle + 5]
                        }
                        // 3 是旋转3圈
                        let minAngle = allAngle[0] + 3 * 360
                        let maxAngle = allAngle[1] + 3 * 360

                        aa = setInterval(() => {
                          hy_rotate(document.getElementById('wheelcanvas'), rot)
                          if (minAngle - 360 * 2 < rot) {
                            rot = rot + (rot * 2 + 1000) / rot
                          } else {
                            rot = rot + 7
                          }
                          if (minAngle + 20 < rot && rot < maxAngle + 20) {
                            clearInterval(aa)
                            setTimeout(() => {
                              this.prizaContent = turnplate.restaraunts[resultId - 1]
                              this.topPopup = true
                              flag = 0
                              rot = 10
                              if (this.queryLotteryDate.name.indexOf('一次') > 0) {
                                this.LotteryInitInfo.leaveTimes++
                              }
                            }, 500)
                          }
                        }, 10)
                      } else {
                        this.LotteryInitInfo.leaveTimes++
                        flag = 0
                      }
                    }, err => {
                      flag = 0
                    })
                  } else {
                    if (flag === 1) {
                      this.$.toast('奖品马上出来，别急~！')
                    } else {
                      this.$.toast('抽奖次数用完啦！')
                    }
                  }
                }
            }else {
              this.$.goLogin({
              	name:'login'
              })
            }
          })

          // 执行图片预加载方法
          loadImage(Array.from(_urls), drawRouletteWheel)
        })
      } catch (e) {
        window.alert(e)
      }
    }
  }

</script>
<style>
  #eve_luckyDraw_two {
    background: url(../../assets/luckDrawBg_two.png) no-repeat center top;
    background-size: 100%;
    width: 100%;
    padding-top: 42%;
    background-color: #f74a44;
  }

  #eve_luckyDraw_two .title {
    padding: 8px;
    width: 170px;
    border-radius: 35px;
    margin: auto;
    text-align: center;
    background-color: #fef2b8;
    background: rgba(254, 242, 185, 0.5);
    font-size: 8px;
  }

  #eve_luckyDraw_two .banner .turnplate {
    width: 350px;
    margin: auto;
    height: 350px;
    margin-top: 6.5%;
    background: url(../../assets/luck_disk.png) no-repeat center top;
    background-size: 90%;
    text-align: center;
    position: relative;
  }

  #eve_luckyDraw_two .banner .turnplate canvas.item {
    width: 296px;
    margin-top: 9px;
  }

  #eve_luckyDraw_two .banner .turnplate .pointer {
    position: absolute;
    left: 50%;
    top: 45%;
    z-index: 6;
    transform: translate(-50%, -50%);
    width: 160px;
    height: 160px;
  }

  @media screen and (max-width: 375px) {
    #eve_luckyDraw_two .banner .turnplate {
      width: 330px;
      margin: auto;
      height: 330px;
      margin-top: 6.5%;
      background: url(../../assets/luck_disk.png) no-repeat center top;
      background-size: 90%;
      text-align: center;
      position: relative;
    }
    #eve_luckyDraw_two .banner .turnplate canvas.item {
      width: 276px;
      margin-top: 9px;
    }
    #eve_luckyDraw_two .banner .turnplate .pointer {
      position: absolute;
      left: 50%;
      top: 45%;
      z-index: 6;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
    }
  }

  @media screen and (max-width: 320px) {
    #eve_luckyDraw_two .banner .turnplate {
      width: 270px;
      margin: auto;
      height: 270px;
      margin-top: 6.5%;
      background: url(../../assets/luck_disk.png) no-repeat center top;
      background-size: 90%;
      text-align: center;
      position: relative;
    }
    #eve_luckyDraw_two .banner .turnplate canvas.item {
      width: 225px;
      margin-top: 8px;
    }
    #eve_luckyDraw_two .banner .turnplate .pointer {
      position: absolute;
      left: 50%;
      top: 45%;
      z-index: 6;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
    }
  }

  #eve_luckyDraw_two .bottom {
    margin-top: 7%;
    text-align: center;
  }

  #eve_luckyDraw_two .bottom_title {
    color: #fde25f;
    font-size: 16px;
  }

  #eve_luckyDraw_two .bottom_body {
    width: 88%;
    margin: auto;
    margin-top: 15px;
    background-color: #bc3833;
    color: #fff;
    font-size: 12px;
    padding: 10px;
  }

  #eve_luckyDraw_two .bottom_body table tr td {
    text-align: left;
    width: 26%;
    font-size: 14px;
    padding-bottom: 5px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }

  #eve_luckyDraw_two .bottom_body table tr td:nth-child(2) {
    text-align: center;
  }

  #eve_luckyDraw_two .bottom_body table tr td:nth-child(3) {
    text-align: right;
    white-space: nowrap;
  }

  #eve_luckyDraw_two .bottom_foot {
    margin-top: 18px;
    width: 100%;
    padding: 0px 10%;
    font-size: 12px;
    color: #fff;
    text-align: left;
    min-height: 100px;
  }

  #eve_luckyDraw_two .bottom_foot_title {
    color: #ffe461;
    font-size: 14px;
    margin-bottom: 5px;
  }

  #eve_luckyDraw_two .bottom_foot p {
    line-height: 25px;
    padding-bottom: 20px;
  }

  #eve_luckyDraw_two .draw_btn {
    width: 88%;
    margin: auto;
    margin-top: 20px;
  }

  #eve_luckyDraw_two .draw_btn button {
    font-size: 16px;
  }

  .demo-popup {
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
  }

  .luckyDraw_two .popup {
    width: 70%;
    margin: auto;
    margin-top: 50%;
    opacity: 1;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px #8a8a8a;
    background-image: none;
  }

  .luckyDraw_two .popup .close {
    display: block;
    width: 20px;
    height: 20px;
    float: right;
    margin-right: 9px;
    margin-top: 8px;
    border-radius: 50%;
    border: 1px solid #929292;
    font-size: 16px;
  }

  .luckyDraw_two .popup h4 {
    color: #000;
    font-size: 14px;
    padding-top: 15px;
    padding-left: 30px;
  }

  .luckyDraw_two .popup h1 {
    color: #ef2b2c;
    font-size: 20px;
    margin-top: 20px;
  }

  .luckyDraw_two .popup .btn_two {
    border-radius: 30px;
    padding: 4px 8px;
    color: #f98700;
    border: 1px solid #f98700;
    background-color: #fff;
    margin-top: 20px;
    outline-style: none;
  }

  .luckyDraw_two .popup h5 {
    color: #929292;
    font-size: 12px;
    margin-top: 10px;
    padding-bottom: 20px;
  }
  #wheelcanvas {
    /*opacity: 0;*/
  }
  .luckyDraw_two .footer{
  	background-color: #bc3833;
    color: #fff;
    padding: 8px;
    display:flex;
    justify-content: space-between;
  }
  .eve_two .footer .left{
  	padding:8px;
    color: #fff;
    background-color: #bc3833;
    height: 80px;
    line-height: 30px;
  }
  .eve_two .footer .left .info-top{
    text-align: left;
    padding-left: 10px
  }
  .eve_two .footer .left .info-bottom{
    text-align: left;
    padding-left: 10px
  }
  
</style>
