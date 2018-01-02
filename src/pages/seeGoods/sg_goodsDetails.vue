<style scoped>
.lab_style {
  color: #000;
  font-size: 16px;
  margin-left: 10px;
  margin-top: 10px;
}
.p_style {
    border: 2px solid #CC1B21;
    padding: 7px;
    text-indent: 2em;
    color: #483e3e;
    font-size: 16px;
    line-height: 16px;
    background-color: #fcf2f2;
    margin: 5px 10px;
    line-height: 24px;
}
.h3_style {
  background-color: #c60007;
  color: #fff;
  text-align: center;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 20px;
}
.tab_style tr td {
  padding-top:5px
}
.tab_style tr td:nth-child(1) {
  color: #1a1a1a;
  font-size: 16px;
  text-align: right;
  width: 5em;
  vertical-align: text-top;
}
.tab_style tr td:nth-child(2) {
  color: #666666;
  font-size: 16px;
  text-align: left;
  padding-left: 4px;
  line-height: 24px;
  vertical-align: text-top;
}
.btn-group button {
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  margin-left: 5px;
  text-align: center;
  border-style:none;
  padding: 10px 0px;
  float: left;
}
.btn1_style {
  background-color: #e79800;
  width: 33%;
}
.btn2_style {
  background-color: #c60007;
  width: calc(67% - 15px);
  margin-right: 5px;
}
</style>
<template>
    <div>
        <!-- <comTitle></comTitle> -->
        <label class="lab_style">活动：</label>
        <p class="p_style" title="">
            凡购买本款坐垫的客户将一律赠送方向盘一只，插我的亲亲气温去玩了困难亲气温玩！ <br>　　气温问违法违法违法王二额去气温气温大旗网前端气温大旗网去权威的问问，问访问问问。
        </p>
        <h3 class="h3_style">产品参数</h3>
        <table class="tab_style">
            <tr>
              <td>坐垫风格:</td>
              <td>简约</td>
            </tr>
            <tr>
              <td>品牌:</td>
              <td>宏飞</td>
            </tr>
            <tr>
              <td>型号:</td>
              <td>123</td>
            </tr>
            <tr>
              <td>表层材质:</td>
              <td>去看望看气温</td>
            </tr>
            <tr>
              <td>适用季节:</td>
              <td>四季组合</td>
            </tr>
            <tr>
              <td>形式:</td>
              <td>五座骑车</td>
            </tr>
            <tr>
              <td>坐垫类型:</td>
              <td>普通坐垫</td>
            </tr>
            <tr>
              <td>颜色分类:</td>
              <td>标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/标准版黑白/</td>
            </tr>
        </table>
        <h3 class="h3_style">详情介绍</h3>
        <p>
          <img src="../../assets/pic_2.png" width="100%" alt="">
        </p>
        <div class="btn-group">
          <button class="btn1_style">加入购物车</button>
          <button class="btn2_style">立即购买</button>
        </div>
    </div>
</template>
<script>
import comTitle from 'components/com-title'
export default {
  data () {
    return {}
  },
  components: {
    comTitle
  }
}
</script>
