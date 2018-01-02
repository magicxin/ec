<style>
#hb_list .lab_style {
    position: absolute;
    top: 33px;
    right: 12px;
    color: #929292;
}
#hb_list .tab_list {
  width: 100%;
  overflow-x: scroll;
  margin-bottom: 1px;
}
#hb_list .tab_list ul{
  overflow:scroll;
  white-space: nowrap;
}

#hb_list .tab_list::-webkit-scrollbar {
  width: 3px;
}
#hb_list .tab_list ul li {
  display: inline-block;
  padding: 10px 14px;
  font-size: 16px;
}
#hb_list .tab_actived {
  color: #f88701;
  border-bottom: 1px solid #f88701;
}

#hb_list .tab_list ul{
  overflow: initial;
  position: relative;
}

#hb_list .original{
  margin-top: 5px;
}
#hb_list .text-right {
  color: #B7B7B7;
  margin-right: 10px;
}
</style>
<template>
<div id="hb_list">
    <my-header main-text="帮砍价" bg-color="#f7f7f7" text-color="#000">
      <img src="../../assets/left-gray.svg" slot="">
      <label slot="right" class="lab_style">活动明细</label>
    </my-header>
  <div class="tab_list">
    <ul ref="wrap">
      <li v-for="tab in tabs" class="tab_li">{{ tab.name }}</li>
    </ul>
  </div>
  <div>
    <eveListTitle>
        <div slot="title">
            {{ title.name }}
        </div>
        <span slot="nowPrice" class="f20">
            ￥{{ title.nowPrice }}
        </span>
        <span slot="beforePrice">
            原价:￥{{ title.beforePrice }}
        </span>
        <span slot="clickEvent">
            {{ title.clickEvent }}
        </span>
        <span slot="more_content">
            更多推荐
        </span>
    </eveListTitle>

    <panel>
      <origin slot="desc" class="origin"></origin>
      <price slot="price"></price>
      <div slot="number" class="text-right">
        还需<span>269</span>人
        <a class="btn_style">去抢购</a>
      </div>
    </panel>
    <panel>
      <origin slot="desc" class="origin"></origin>
      <price slot="price"></price>
      <div slot="number" class="text-right">
        还需<span>269</span>人
        <a class="btn_style">去抢购</a>
      </div>
    </panel>
    <i class="material-icons icon">arrow_drop_down</i>
  </div>
</div>
</template>
<script>
import myHeader from 'components/my-header'
import eveListTitle from 'components/eve_list_title'
import panel from 'components/panel'
import origin from 'components/origin'
import RMB from 'assets/RMB.svg'
import price from 'components/price'
export default {
  data () {
    return {
      title: {
        name: '帮砍价的物品', // 商品名称
        nowPrice: '2', // 目前价格
        beforePrice: '599', // 原来价格
        clickEvent: '再优惠' // 点击事件
      },
      tabs: [{
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }, {
        name: '汽车'
      }]
    }
  },
  components: {
    myHeader,
    eveListTitle,
    panel,
    origin,
    RMB,
    price
  },
  /* eslint-disable */
  methods: {
    initEvents () {
      let el = this.$refs.wrap
      let start, end, disY
      el.addEventListener('touchstart', (e) => {
        start = e.touches[0].screenX
        // console.log(start)
      }, false)

      el.addEventListener('touchmove', (e) => {
        disY = e.touches[0].screenX - start
        el.style.left = disY + 'px'
        // end = e.touches[0].screenX
        // console.log(end)

      }, false)
    }
  }
}
// $(function () {
//   $('.tab_li').first().addClass('tab_actived')
//   $('.tab_li').click(function () {
//     $('.tab_li').removeClass('tab_actived')
//     $(this).addClass('tab_actived')
//   })
// })
</script>

