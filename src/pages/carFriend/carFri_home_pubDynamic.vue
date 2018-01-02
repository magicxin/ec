<template>
  <!-- 发动态 -->
  <div id="publish-dynamic">
    <!-- header -->
    <magic-header :titleName="titleName">
      <span slot="title-right">
        <a href="javascript:void(0)" class="pub-btn" :class="{'active':content.length != 0 || imgUrls.length != 0}" v-tap="{ methods: send }">
          {{rightTitleName}}
        </a>
      </span>
    </magic-header>
    <div class="content">
      <section>
        <article>
          <textarea :placeholder="textAreaHolder" autofocus="autofocus" v-model="content"></textarea>
        </article>
      </section>
      <section>
        <!-- img -->
        <div flex layout layout-wrap="wrap" layout-align="start center">
          <!-- view -->
          <div v-for="(item, imageIndex) in nativeImages" class="content-img img-container" :key="imageIndex">
            <mu-icon value="cancel" v-tap="{methods: cancelUploadByIndex, index: imageIndex}"></mu-icon>
            <img :src="item.data" alt="" height="100%" width="80px">
          </div>
          <!-- upload -->
          <div class="content-img" v-tap="{methods: upload}">
            <img src="../../assets/add-img.png" height="100%" width="100%">
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import magicHeader from "components/magicHeader";
// import a from "assets/add-img.png";
// import b from "assets/add-gray.svg";

const HEADER_TITLE_NAME = "发动态";
const HEADER_TITLE_NAME2 = "话题讨论";
const HEADER_RIGHT = "发送";
const TEXTAREA_PLACEHOLDER = "分享新鲜事";
const MAX_IMAGE_COUNT = 6;
const FROMPAGE_CARFRI_HOME = "carFri_home";
const FROMPAGE_TOPIC_DETAIL = "topic_detail";

let topicReg;

/**
 * @description 上传选中的图片到服务器
 * @augments promises 请求方法
 * @augments evalProductImage view-model
 * @augments resp 本地缓存
 * @argument vm Vue instance
 */
function upload2Server(promises, resp, vm) {
  Promise.all(promises).then(
    results => {
      let promiseResult = results.every(result => {
        return result.urls && result.resultCode === "100";
      });

      // 如果图片上传成功 就将之前缓存的图片 展示出来
      if (promiseResult) {
        resp.forEach(val => {
          if (vm.nativeImages.length < MAX_IMAGE_COUNT) {
            vm.nativeImages.push(val);
          }
        });
        results.forEach(result => {
          vm.imgUrls.push(...result.urls);
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

export default {
  name: "pub-dynamic",
  components: { magicHeader },
  data() {
    return {
      titleName: HEADER_TITLE_NAME,
      rightTitleName: HEADER_RIGHT,
      textAreaHolder: TEXTAREA_PLACEHOLDER,
      nativeImages: [],
      imgUrls: [],
      topicId: "",
      // nativeImages: [{ data: a }, { data: b }],
      // imgUrls: [a, b],
      content: ""
    };
  },
  methods: {
    /* 删除图片 */
    cancelUploadByIndex(params) {
      let index = params.index;
      try {
        this.nativeImages.splice(index, 1);
        this.imgUrls.splice(index, 1);
      } catch (e) {
        window.alert(e);
      }
    },
    /* 图片上传 */
    upload(params) {
      // 最多支持添加的图片数量
      if (this.nativeImages.length >= MAX_IMAGE_COUNT) {
        this.$.toast(`您最多可以添加${MAX_IMAGE_COUNT}张图片`);
        return;
      }

      // bridge, 选择相册中的图片
      this.$.push(
        "router_takePhoto",
        {
          maxNum: MAX_IMAGE_COUNT - this.nativeImages.length
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
          promises.length > 0 && upload2Server(promises, resp, this);
        }
      );
    },
    /* 请求前处理 */
    beforeSend() {
      // this.content.replace(topicReg, "");
    },
    /* 发送内容 */
    send() {
      if (this.content.length != 0 || this.imgUrls.length != 0) {
        this.$
          .get({
            methodName: "CreateSpace",
            content: encodeURIComponent(this.content.replace(topicReg, "")),
            images: this.imgUrls,
            position: "",
            topics: this.topicId ? [this.topicId] : []
          })
          .then(
            resp => {
              if (resp.data.resultCode == "100") {
                // 跳转回carFri_home
                this.$router.back();
              } else {
                this.$.toast({
                  message: "请求失败",
                  duration: 1500
                });
              }
            },
            err => {
              this.$.toast({
                message: "请求失败",
                duration: 1500
              });
            }
          );
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 从社区进入 carFri_home   从话题讨论进入 topic_detail
    let fromPage = from.name;
    next(vm => {
      // 判断进入的页面不同, 展示不同的title
      if (fromPage == FROMPAGE_TOPIC_DETAIL) {
        vm.titleName = HEADER_TITLE_NAME2;
        topicReg = vm.content = `#${to.query.topicTitle}#`;
        vm.topicId = to.query.topicId;
      } else {
        vm.titleName = HEADER_TITLE_NAME;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.pub-btn {
  color: #b9b9b9;
  font-size: 14px;
  &.active {
    color: #f98700;
  }
}
.content {
  background: #fff;
  textarea {
    width: 100%;
    height: 150px;
    border: none;
    outline: none;
    padding: 10px;
    line-height: 24px;
    font-size: 16px;
    resize: none;
    overflow: auto;
  }
  .content-img {
    width: 20%;
    padding: 8px 0 3px 0;
    margin-right: 1.33%;
    position: relative;
    i {
      position: absolute;
      right: -10px;
      top: -5px;
      color: black !important;
      z-index: 2;
      /*background-color: black;*/
    }
    img {
      border: 1px solid #98bae4;
    }
  }
  .img-container {
    width: 80px;
    height: 120px;
  }
  section {
    padding: 5px 10px;
  }
}
</style>

