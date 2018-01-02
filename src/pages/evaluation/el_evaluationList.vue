<template>
  <div id="el_evaluationList">
    <my-header mainText="用户评论" textColor="#fff">
      <img :src="leftReturn" alt="返回">
    </my-header>

    <div layout class="evaluation-result">
      <img class="evaluation-img" :src="pic_2" alt="">
      <div layout="column" layout-align="space-between start" :full="true">
        <div flex class="result-text">好评：
          <span class="result-text-ctrl">15</span>
        </div>
        <div flex class="result-text">中评：
          <span class="result-text-ctrl">0</span>
        </div>
        <div flex class="result-text">差评：
          <span class="result-text-ctrl">0</span>
        </div>
      </div>
    </div>

    <evaluation titleText="用户评论"></evaluation>
  </div>
</template>
<script>
import myHeader from "components/my-header";
import evaluation from "components/evaluation";
import leftReturn from "assets/left-blank.svg";
import pic_2 from "assets/pic_2.png";
export default {
  name: "el_evaluationList",
  data() {
    return {
      leftReturn,
      pic_2
    };
  },
  components: {
    myHeader,
    evaluation
  }
};
</script>

<style>
#el_evaluationList {
  background-color: #efeff4;
}

#el_evaluationList .evaluation-result {
  padding: 15px;
  margin-bottom: 8px;
  background-color: #fff;
}

#el_evaluationList .evaluation-result > div {
  height: 75px;
}

#el_evaluationList .evaluation-img {
  width: 80px;
  height: 75px;
  line-height: 75px;
  text-align: center;
  margin-right: 0.8em;
}

#el_evaluationList .result-text {
  font-size: 16px;
  line-height: 25px;
  color: #3f3f3f;
}

#el_evaluationList .result-text-ctrl {
  color: #3c7dcc;
}
</style>
