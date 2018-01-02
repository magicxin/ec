<template>
  <div id="el_selfEvaluation">
    <!-- header -->
    <magic-header :titleName="titleName" class="header"></magic-header>

    <!-- content -->
    <div class="content" layout="column" layout-align="space-between stretch">
      <div>
        <div class="order-items" v-for="(evaluationItem, index) in evaluationItems" :key="index">
          <!-- 商品信息 -->
          <panel :value="evaluationItem.evalProduct.productDetail">
            <div slot="desc" class='desc'>
              {{evaluationItem.evalProduct.desc}}
            </div>
            <price slot="price" :value="evaluationItem.evalProduct.price"></price>
          </panel>

          <!-- 商品评价 -->
          <div layout="column" layout-align="center flex-start" class="evaluation-content" v-if="evaluationItem.evalProduct.productDetail">
            <!-- 商品评分 -->
            <div flex class="content-score">
              商品评分
              <mu-radio v-for="(proScoreItem, proScoreIndex) in evalProductScoreList" :key="proScoreIndex" :label="proScoreItem.title" :nativeValue="proScoreItem.score" v-model="evaluationItem.evalProductScore" uncheckIcon="panorama_fish_eye" checkedIcon="check_circle"></mu-radio>
            </div>

            <!-- 文字说明 -->
            <div flex class="content-text">
              <textarea type="text" placeholder="来分享您的使用感受吧..." class="content-text-area" v-model="evaluationItem.evalProductDesc" maxlength="100"></textarea>
              <span class="text-help-block">100字</span>
            </div>

            <!-- 图片说明 -->
            <div flex layout layout-wrap="wrap" layout-align="start center">
              <!-- view -->
              <div v-for="(item, imageIndex) in evaluationItem.evalProductImage.nativeImages" class="content-img img-container" :key="imageIndex">
                <mu-icon value="cancel" v-tap="{methods: cancelUploadByIndex, index: imageIndex, evalProductImage: evaluationItem.evalProductImage}"></mu-icon>
                <img :src="item.data" alt="" height="100%" width="80px">
              </div>
              <!-- upload -->
              <div class="content-img" v-tap="{methods: upload, index: index, evalProductImage: evaluationItem.evalProductImage}">
                <img src="../../assets/add-img.png" height="100%" width="100%">
              </div>
            </div>
          </div>
        </div>

        <!-- 店铺评分 -->
        <div layout="column" layout-align="center flex-start" class="evaluation-content service-score">
          <div flex class="content-score">店铺评分</div>
          <div flex class="content-score" v-for="(shopEvaluation, index) in evalShopScores" :key="index">
            {{shopEvaluation.title}}
            <span v-for="(res, startIndex) in shopEvaluation.result" :key="startIndex">
              <mu-icon :value="res ? 'star' : 'star_border'" @click="shopEvaluation.result = starOperate(startIndex);shopEvaluation.score = startIndex+1"></mu-icon>
            </span>
          </div>
        </div>
      </div>
      <!-- button 提交评价 -->
      <foot class="text-right">
        <order-button class="foot-button" color="#eaa524" border="#eaa524" v-tap="{methods: submitEval}">提交评价</order-button>
      </foot>
    </div>

    <!-- alert -->
    <model :isShow="isShow" v-on:closeIsModel="close" title=" " class="no-height" modelType="alert">
      评论失败
    </model>
  </div>
</template>

<script>
// components
import magicHeader from "components/magicHeader";
import model from "components/model/model.vue";
import panel from "components/panel";
import foot from "components/foot";
import price from "components/price";
import orderButton from "components/order-button";
// image
import left from "assets/left-gray.svg";

const MAX_IMAGE_COUNT = 6; // 最多可以添加${MAX_IMAGE_COUNT}张图片

// 产品评分数据
const EVAL_PRODUCT_SCORE = [
  { score: "5", title: "好评" },
  { score: "3", title: "中评" },
  { score: "1", title: "差评" }
];

// 店铺评分数据
const SERVICE_ATTITUDE = "serviceAttitude"
const SERVICE_SPEED = "serviceSpeed"
const SERVICE_PROFESSIONAL = "professional"
const EVAL_SHOP_SCORE = [
  {
    id: SERVICE_ATTITUDE,
    title: "服务态度"
  },
  {
    id: SERVICE_SPEED,
    title: "服务速度"
  },
  {
    id: SERVICE_PROFESSIONAL,
    title: "专业技能"
  }
]

export default {
  name: "el_selfEvaluation",
  components: { magicHeader, panel, foot, orderButton, price, model },
  data() {
    return {
      evalProductScoreList: EVAL_PRODUCT_SCORE, // 评分数据
      evaluationItems: [],
      evalShopScores: shopEvalDataInit(),
      isShow: false,
      orderId: null,
      titleName: '我的评价',
      left
    };
  },
  methods: {
    /**图片上传 */
    upload(params) {
      let evalProductImage = params.evalProductImage;
      // 最多支持添加的图片数量
      if (evalProductImage.nativeImages.length >= MAX_IMAGE_COUNT) {
        this.$.toast(`您最多可以添加${MAX_IMAGE_COUNT}张图片`);
        return;
      }

      // bridge, 选择相册中的图片
      this.$.push(
        "router_takePhoto",
        {
          maxNum: MAX_IMAGE_COUNT - evalProductImage.nativeImages.length
        },
        resp => {
          resp = JSON.parse(resp);
          let promises = [];

          // 按type缓存图片地址
          let imgDataCache = new Map();
          resp.forEach(img => {
            promises.push(
              this.$.postFileByFormData({
                type: "." + img.type,
                data: [img.data]
              })
            );
          });

          // upload imgs 2 server
          promises.length > 0 &&
            upload2Server(promises, evalProductImage, resp, this);
        }
      );
    },
    /* 删除图片 */
    cancelUploadByIndex(params) {
      let index = params.index;
      let images = params.evalProductImage;
      try {
        this.images.nativeImages.splice(index, 1);
        this.images.urls.splice(index, 1);
      } catch (e) {
        window.alert(e);
      }
    },
    /* 关闭提示框,评论失败并跳转到orderManage */
    close(params) {
      this.isShow = false;
      this.$router.replace({
        name: "orderManage"
      });
    },
    submitEval() {
      // 获取请求数据
      let request = getCreateProductReviewReq(this);
      // 请求数据校验
      if (requestValidate(request, this)) {
        // invoke
        this.$.get(request).then(resp => {
          if (resp.data.resultCode === "100") {
            // 成功直接替换当前history
            this.$router.replace({
              name: "orderDetail",
              params: {
                orderId: this.orderId
              }
            });
          } else {
            this.isShow = true;
          }
        });
      } else {
        this.$.toast({
          message: "请求失败",
          duration: 1500
        });
      }
    },
    /* 评星操作 */
    starOperate
  },
  beforeRouteEnter(to, from, next) {
    // route next
    next(vm => {
      // Init
      metaDataInit(JSON.parse(to.query.orderItem), vm);

      // evalType true-商品评价 false-店铺评价
      // let evalType = JSON.parse(to.query.orderItem).every(item=>{
      //   return item.product != undefined
      // })
    });
  }
};


/* 
  view-model 说明
  一份订单中可能有多个商品, 以每个商品为维度做评价操作, 每个维度可以拆分为4个部分
  # evaluationItems > evaluationItem
  1. 商品信息, 作展示          evalProduct
  2. 评价评分                 evalProductScore
  3. 评价描述                 evalProductDesc
  4. 评价配图                 evalProductImage
  # evalShopScores 店铺评分
*/

/**
 * @description 元数据处理(订单详情)
 * @augments orderDetail 原始数据
 */
function metaDataInit(orderDetail, vm) {
  // 订单id
  vm.orderId = orderDetail.id;
  // 取出订单数据中的待评价数据集合(可能有多个)
  for (let orderItem of orderDetail.orderItems) {
    let evaluationItem = {
      evalProduct: productDataInit(orderItem),
      evalProductScore: "5", // 1-差评 3-中评 5-好评
      evalProductDesc: "",
      evalProductImage: {
        nativeImages: [],
        urls: []
      }
    };
    vm.evaluationItems.push(evaluationItem);
  }
}

/**
 * @description 产品数据初始化
 * @augments product 产品对象
 */
function productDataInit(orderItem) {
  let evalProduct = {
    productDetail: orderItem.product,
    desc: "",
    price: orderItem.price
  };

  // desc 处理
  if (orderItem.product && orderItem.product.specificationValues) {
    orderItem.product.specificationValues.forEach(item => {
      evalProduct.desc =
        evalProduct.desc + item.specificationData.name + ":" + item.name + " ";
    });
  }
  evalProduct.desc = evalProduct.desc == "" ? orderItem.name : evalProduct.desc;

  return evalProduct;
}

/**
 * @description 数据初始化操作
 * @augments null
 */
function shopEvalDataInit() {
  let shopEvaluationList = [];
  for (let index of new Array(...EVAL_SHOP_SCORE)) {
    let shopEvaluationObj = {
      id: index.id,
      title: index.title,
      result: starOperate(4),
      score: 5
    };
    shopEvaluationList.push(shopEvaluationObj);
  }
  return shopEvaluationList;
}

/**
 * @description 评分操作
 * @augments statusArr 关联的评分数据
 * @augments index 点击对应星级的索引
 */
function starOperate(index) {
  // star status
  let statusArr = new Array(
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false
  );
  // start-end 共取5个值, 表示当前的打分状态
  return statusArr.slice(4 - index, 9 - index);
}

/**
 * @description 上传选中的图片到服务器
 * @augments promises 请求方法
 * @augments evalProductImage view-model
 * @augments resp 本地缓存
 * @argument vm Vue instance
 */
function upload2Server(promises, evalProductImage, resp, vm) {
  Promise.all(promises).then(
    results => {
      let promiseResult = results.every(result => {
        return result.urls && result.resultCode === "100";
      });

      // 如果图片上传成功 就将之前缓存的图片 展示出来
      if (promiseResult) {
        resp.forEach(val => {
          if (evalProductImage.nativeImages.length < MAX_IMAGE_COUNT) {
            evalProductImage.nativeImages.push(val);
          }
        });
        results.forEach(result => {
          evalProductImage.urls.push(...result.urls);
        });
      } else {
        vm.$.toast("上传图片失败");
      }
    },
    err => {
      if (err) {
        vm.$.toast("上传图片失败");
      }
    }
  );
}

/**
 * @description 获取CreateProductReview请求
 * @augments vm Vue instance
 */
function getCreateProductReviewReq(vm) {
  // evaluationItems:[],
  // evalShopScores: shopEvalDataInit(),
  let request = {
    methodName: "CreateProductReview",
    reviews: [],
    serviceAttitude: "", // 服务态度
    serviceSpeed: "", // 服务速度
    professional: "", // 专业技能
    orderId: vm.orderId
  };

  vm.evaluationItems.forEach(evaluation => {
    // 商品信息存在时, 放在请求参数review中; 不存在时, 当前实现[一键救援]评价操作, 没有商品信息
    if (evaluation.evalProduct.productDetail) {
      request.reviews.push({
        score: evaluation.evalProductScore,
        content: evaluation.evalProductDesc,
        productId: evaluation.evalProduct.productDetail
          ? evaluation.evalProduct.productDetail.id
          : "",
        reviewOrderId: vm.orderId,
        images: evaluation.evalProductImage.urls
      });
    }
  });

  vm.evalShopScores.forEach(item => {
    switch (item.id) {
      // 服务态度
      case SERVICE_ATTITUDE:
        request.serviceAttitude = item.score;
        break;
      // 服务速度
      case SERVICE_SPEED:
        request.serviceSpeed = item.score;
        break;
      // 专业技能
      case SERVICE_PROFESSIONAL:
        request.professional = item.score;
        break;
      default:
        break;
    }
  });

  return request;
}

/**
 * @description 请求参数校验
 * @augments vm Vue Instance
 */
function requestValidate(request, vm) {
  // 默认必传参数都存在, 暂时不做处理
  return true;
}

// function queryOrderDetail(vm) {
//   vm.$.get({
//     "methodName" : "QueryOrderDetail",
//   })
// }

</script>

<style lang="scss">
#el_selfEvaluation {
  height: 100%;
  .content {
    padding-top: 50px;
    height: 100%;
  }
  .header {
    position: fixed;
    z-index: 1;
  }
  .close {
    position: absolute;
    right: -10px;
    top: -5px;
    border: none;
  }
  i {
    color: #ffad00 !important;
  }

  textarea[placeholder] {
    font-size: 14px;
    text-indent: 0px;
  }

  .evaluation-content {
    margin-top: 8px;
    padding: 18px;
    background-color: #fff;
  }

  .content-score {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .content-score img {
    padding-left: 10px;
  }

  .content-text {
    position: relative;
    width: 100%;
  }

  .content-text-area {
    width: 100%;
    min-height: 100px;
    border: 1px solid #7fa9dd;
    padding: 8px;
    margin: 16px 0 8px 0;
    resize: none;
  }

  .text-help-block {
    position: absolute;
    right: 10px;
    bottom: 18px;
    font-size: 14px;
    color: #929292;
  }

  .content-img {
    width: 20%;
    padding: 8px 0 3px 0;
    margin-right: 1.33%;
    position: relative;
  }

  .content-img i {
    position: absolute;
    right: -10px;
    top: -5px;
    color: black !important;
    z-index: 2;
    /*background-color: black;*/
  }

  .content-img img {
    border: 1px solid #98bae4;
  }

  .no-margin {
    margin-right: 0;
  }

  .foot-button {
    margin-right: 10px;
    font-weight: 300;
  }

  .img-container {
    width: 80px;
    /*overflow: hidden;*/
    height: 120px;
  }
  .service-score {
    margin: 16px 0 8px 0;
  }
  .service-score .content-score:first-child {
    margin-bottom: 8px;
  }
  .content-score .mu-radio .mu-radio-icon {
    margin: 0px;
  }
  .content-score .mu-radio {
    margin-left: 20px;
  }
  #foot {
    position: initial;
    padding: 5px 0;
  }
  .order-items {
    margin-bottom: 20px;
  }
  .no-height {
    position: absolute;
  }
}
</style>
