<template>
  <div id="emoji">
    <ul class="emoji_body">
      <li v-for="(item, index) in emojiArr">
        <img :src="item" :alt="index" class="emojiDoc"  @click="imgSrc(index)">
      </li>
    </ul>
  </div>
</template>
<script>
import gif0 from 'assets/img/emoji/images/0.gif'
import gif1 from 'assets/img/emoji/images/1.gif'
import gif2 from 'assets/img/emoji/images/2.gif'
import gif3 from 'assets/img/emoji/images/3.gif'
import gif4 from 'assets/img/emoji/images/4.gif'
import gif5 from 'assets/img/emoji/images/5.gif'
import gif6 from 'assets/img/emoji/images/6.gif'
import gif7 from 'assets/img/emoji/images/7.gif'
import gif8 from 'assets/img/emoji/images/8.gif'
import gif9 from 'assets/img/emoji/images/9.gif'
import gif10 from 'assets/img/emoji/images/10.gif'
import gif11 from 'assets/img/emoji/images/11.gif'
import gif12 from 'assets/img/emoji/images/12.gif'
import gif13 from 'assets/img/emoji/images/13.gif'
import gif14 from 'assets/img/emoji/images/14.gif'
import gif15 from 'assets/img/emoji/images/15.gif'
import gif16 from 'assets/img/emoji/images/16.gif'
import gif17 from 'assets/img/emoji/images/17.gif'
import gif18 from 'assets/img/emoji/images/18.gif'
import gif19 from 'assets/img/emoji/images/19.gif'
import gif20 from 'assets/img/emoji/images/20.gif'
import gif21 from 'assets/img/emoji/images/21.gif'
import gif22 from 'assets/img/emoji/images/22.gif'
import gif23 from 'assets/img/emoji/images/23.gif'
import gif24 from 'assets/img/emoji/images/24.gif'
import gif25 from 'assets/img/emoji/images/25.gif'
import gif26 from 'assets/img/emoji/images/26.gif'
import gif27 from 'assets/img/emoji/images/27.gif'
import gif28 from 'assets/img/emoji/images/28.gif'
import gif29 from 'assets/img/emoji/images/29.gif'
import gif30 from 'assets/img/emoji/images/30.gif'
import gif31 from 'assets/img/emoji/images/31.gif'
import gif32 from 'assets/img/emoji/images/32.gif'
import gif33 from 'assets/img/emoji/images/33.gif'
import gif34 from 'assets/img/emoji/images/34.gif'
import gif35 from 'assets/img/emoji/images/35.gif'
import gif36 from 'assets/img/emoji/images/36.gif'
import gif37 from 'assets/img/emoji/images/37.gif'
import gif38 from 'assets/img/emoji/images/38.gif'
import gif39 from 'assets/img/emoji/images/39.gif'
import gif40 from 'assets/img/emoji/images/40.gif'
import gif41 from 'assets/img/emoji/images/41.gif'
import gif42 from 'assets/img/emoji/images/42.gif'
import gif43 from 'assets/img/emoji/images/43.gif'
import gif44 from 'assets/img/emoji/images/44.gif'
import gif45 from 'assets/img/emoji/images/45.gif'
import gif46 from 'assets/img/emoji/images/46.gif'
import gif47 from 'assets/img/emoji/images/47.gif'
import gif48 from 'assets/img/emoji/images/48.gif'
import gif49 from 'assets/img/emoji/images/49.gif'
import gif50 from 'assets/img/emoji/images/50.gif'
import gif51 from 'assets/img/emoji/images/51.gif'
import gif52 from 'assets/img/emoji/images/52.gif'
import gif53 from 'assets/img/emoji/images/53.gif'
import gif54 from 'assets/img/emoji/images/54.gif'
import gif55 from 'assets/img/emoji/images/55.gif'
import gif56 from 'assets/img/emoji/images/56.gif'
import gif57 from 'assets/img/emoji/images/57.gif'
import gif58 from 'assets/img/emoji/images/58.gif'
import gif59 from 'assets/img/emoji/images/59.gif'
import gif60 from 'assets/img/emoji/images/60.gif'
import gif61 from 'assets/img/emoji/images/61.gif'
import gif62 from 'assets/img/emoji/images/62.gif'
import gif63 from 'assets/img/emoji/images/63.gif'
import gif64 from 'assets/img/emoji/images/64.gif'
import gif65 from 'assets/img/emoji/images/65.gif'
import gif66 from 'assets/img/emoji/images/66.gif'
import gif67 from 'assets/img/emoji/images/67.gif'
import gif68 from 'assets/img/emoji/images/68.gif'
import gif69 from 'assets/img/emoji/images/69.gif'
import gif70 from 'assets/img/emoji/images/70.gif'
import gif71 from 'assets/img/emoji/images/71.gif'
import gif72 from 'assets/img/emoji/images/72.gif'
import gif73 from 'assets/img/emoji/images/73.gif'
import gif74 from 'assets/img/emoji/images/74.gif'
import gif75 from 'assets/img/emoji/images/75.gif'
import gif76 from 'assets/img/emoji/images/76.gif'
import gif77 from 'assets/img/emoji/images/77.gif'
import gif78 from 'assets/img/emoji/images/78.gif'
import gif79 from 'assets/img/emoji/images/79.gif'
import gif80 from 'assets/img/emoji/images/80.gif'
import gif81 from 'assets/img/emoji/images/81.gif'
import gif82 from 'assets/img/emoji/images/82.gif'
import gif83 from 'assets/img/emoji/images/83.gif'
import gif84 from 'assets/img/emoji/images/84.gif'
import gif85 from 'assets/img/emoji/images/85.gif'
import gif86 from 'assets/img/emoji/images/86.gif'
import gif87 from 'assets/img/emoji/images/87.gif'
import gif88 from 'assets/img/emoji/images/88.gif'
import gif89 from 'assets/img/emoji/images/89.gif'
import gif90 from 'assets/img/emoji/images/90.gif'
import gif91 from 'assets/img/emoji/images/91.gif'
import gif92 from 'assets/img/emoji/images/92.gif'
import gif93 from 'assets/img/emoji/images/93.gif'
import gif94 from 'assets/img/emoji/images/94.gif'
import gif95 from 'assets/img/emoji/images/95.gif'
import gif96 from 'assets/img/emoji/images/96.gif'
import gif97 from 'assets/img/emoji/images/97.gif'
import gif98 from 'assets/img/emoji/images/98.gif'
import gif99 from 'assets/img/emoji/images/99.gif'
import gif100 from 'assets/img/emoji/images/100.gif'
import gif101 from 'assets/img/emoji/images/101.gif'
import gif102 from 'assets/img/emoji/images/102.gif'
import gif103 from 'assets/img/emoji/images/103.gif'
import gif104 from 'assets/img/emoji/images/104.gif'
import gif105 from 'assets/img/emoji/images/105.gif'
import gif106 from 'assets/img/emoji/images/106.gif'
import gif107 from 'assets/img/emoji/images/107.gif'
import gif108 from 'assets/img/emoji/images/108.gif'
import gif109 from 'assets/img/emoji/images/109.gif'
import gif110 from 'assets/img/emoji/images/110.gif'
import gif111 from 'assets/img/emoji/images/111.gif'
import gif112 from 'assets/img/emoji/images/112.gif'
import gif113 from 'assets/img/emoji/images/113.gif'
import gif114 from 'assets/img/emoji/images/114.gif'
import gif115 from 'assets/img/emoji/images/115.gif'
import gif116 from 'assets/img/emoji/images/116.gif'
import gif117 from 'assets/img/emoji/images/117.gif'
import gif118 from 'assets/img/emoji/images/118.gif'
import gif119 from 'assets/img/emoji/images/119.gif'
import gif120 from 'assets/img/emoji/images/120.gif'
import gif121 from 'assets/img/emoji/images/121.gif'
import gif122 from 'assets/img/emoji/images/122.gif'
import gif123 from 'assets/img/emoji/images/123.gif'
import gif124 from 'assets/img/emoji/images/124.gif'
import gif125 from 'assets/img/emoji/images/125.gif'
import gif126 from 'assets/img/emoji/images/126.gif'
import gif127 from 'assets/img/emoji/images/127.gif'
import gif128 from 'assets/img/emoji/images/128.gif'
import gif129 from 'assets/img/emoji/images/129.gif'
import gif130 from 'assets/img/emoji/images/130.gif'
import gif131 from 'assets/img/emoji/images/131.gif'
import gif132 from 'assets/img/emoji/images/132.gif'
import gif133 from 'assets/img/emoji/images/133.gif'
import gif134 from 'assets/img/emoji/images/134.gif'
 /* eslint-disable */
export default {
  name: 'emoji',
  data () {
    return {
      emojiArr: [
          gif0,
          gif1,
          gif2,
          gif3,
          gif4,
          gif5,
          gif6,
          gif7,
          gif8,
          gif9,
          gif10,
          gif11,
          gif12,
          gif13,
          gif14,
          gif15,
          gif16,
          gif17,
          gif18,
          gif19,
          gif20,
          gif21,
          gif22,
          gif23,
          gif24,
          gif25,
          gif26,
          gif27,
          gif28,
          gif29,
          gif30,
          gif31,
          gif32,
          gif33,
          gif34,
          gif35,
          gif36,
          gif37,
          gif38,
          gif39,
          gif40,
          gif41,
          gif42,
          gif43,
          gif44,
          gif45,
          gif46,
          gif47,
          gif48,
          gif49,
          gif50,
          gif51,
          gif52,
          gif53,
          gif54,
          gif55,
          gif56,
          gif57,
          gif58,
          gif59,
          gif60,
          gif61,
          gif62,
          gif63,
          gif64,
          gif65,
          gif66,
          gif67,
          gif68,
          gif69,
          gif70,
          gif71,
          gif72,
          gif73,
          gif74,
          gif75,
          gif76,
          gif77,
          gif78,
          gif79,
          gif80,
          gif81,
          gif82,
          gif83,
          gif84,
          gif85,
          gif86,
          gif87,
          gif88,
          gif89,
          gif90,
          gif91,
          gif92,
          gif93,
          gif94,
          gif95,
          gif96,
          gif97,
          gif98,
          gif99,
          gif100,
          gif101,
          gif102,
          gif103,
          gif104,
          gif105,
          gif106,
          gif107,
          gif108,
          gif109,
          gif110,
          gif111,
          gif112,
          gif113,
          gif114,
          gif115,
          gif116,
          gif117,
          gif118,
          gif119,
          gif120,
          gif121,
          gif122,
          gif123,
          gif124,
          gif125,
          gif126,
          gif127,
          gif128,
          gif129,
          gif130,
          gif131,
          gif132,
          gif133,
          gif134
      ],
    }
  },
  methods: {
    imgSrc(val) {
      let emojiC = null
      emojiC = document.querySelectorAll('.emojiDoc')[val]
      this.$emit('emojiDoc', emojiC)
    }
  }
}
</script>
<style>
 #emoji {
    background-color: #fff;
    z-index: 9999;
  }
 #emoji .emoji_body li {
    display: inline-block;
    width: inherit;
    padding: 0px 2px;
    line-height: normal;
    float: left;
 }
</style>
