<template>
  <div class="allcomment" v-show="discussShow">
    <magic-header titleName="详情"></magic-header>
    <!-- 动态详情 -->
    <dynamic v-if="itemData" :itemData="itemData" :showBottom="false" :showDetail="false"></dynamic>

    <!-- 评价 0-评论 1-点赞 -->
    <tabs :tabData="tabData">
      <div slot="tab0">
        <div class="item-container" v-for="(item,index) in commentData" :key="index">
          <!-- 用户简单信息  -->
          <div class="top">
            <div class="left top">
              <div class="left">
                <!-- 头像 -->
                <img :src="item.avatar" />
              </div>
              <div class="right">
                <!-- 名字与时间 -->
                <div class="text grey-text">{{item.nickname}}</div>
                <div class="text grey-text">{{item.sendData}}</div>
              </div>
            </div>
            <!-- 按钮-展开操作栏 -->
            <img v-if="item.id == $.userId" :src="down" class="righter" v-tap="{methods: showBottomSheet, removeData: item, removeIndex: index}" />
          </div>
          <!-- 评论内容 -->
          <div class="bottom">
            <div class="left"></div>
            <div class="right text">{{item.content}}</div>
          </div>
        </div>
      </div>
      <div slot="tab1">
        <div class="top" v-for="(item,index) in supportData" :key="index">
          <div class="left">
            <img :src="item.avatar" @error="setError" />
          </div>
          <div class="right">
            {{item.nickname}}
          </div>
        </div>
      </div>
    </tabs>
    <!-- 下方弹出框, 删除个人评论操作 -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet">
        <mu-list-item title="删除" class="bottom-btn" v-tap="{methods:delSpaceComment}"/>
        <mu-list-item class="padding-btn" />
        <mu-list-item title="取消" class="bottom-btn cancel-btn" />
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>
<script>
// components
import dynamic from "components/dynamic/dynamic";
import magicHeader from "components/magicHeader";
import tabs from "components/tab/tabs";
// img
import defaultAvatar from "assets/default_user_icon.png";
import down from "assets/down-gray.svg";

export default {
  name: "allcomment",
  data() {
    return {
      itemData: "",
      // 设置tab切换
      tabData: [
        {
          title: "评论",
          redMsg: false
        },
        {
          title: "喜欢",
          redMsg: false
        }
      ],
      commentData: [],
      supportData: [],
      removeData: {},
      // 渲染控制
      discussShow: false,
      bottomSheet: false,
      // img
      defaultAvatar: defaultAvatar,
      down
    };
  },
  components: { dynamic, magicHeader, tabs },
  methods: {
    setError(event) {
      let e = event || window.event;
      let target = e.target || e.srcElement;
      target.src = this.defaultAvatar;
    },
    // Init 初始化操作
    init(id) {
      // 避免页面渲染展示旧数据
      this.discussShow = false;
      this.$
        .get({
          methodName: "QuerySpace",
          spaceId: id
        })
        .then(res => {
          this.commentData = [];
          this.supportData = [];
          if (res.data.resultCode === "100") {
            // 动态详情
            this.itemData = this.getDynamicData(res.data.space);
            // 评论
            this.commentData = this.getCommentData(res.data.space);
            // 喜欢
            this.supportData = this.getSupportData(res.data.space);

            // tab标题
            this.tabData[0].title = "评论" + res.data.space.comments.length;
            this.tabData[1].title = "喜欢" + res.data.space.supports.length;

            // 避免页面渲染展示旧数据
            this.discussShow = true;
          }
        });
    },
    // [动态]数据处理
    getDynamicData(spaceData) {
      return {
        id: spaceData.id,
        avatar:
          spaceData.fleet && spaceData.fleet.head
            ? this.addPath(spaceData.fleet.head)
            : spaceData.member && spaceData.member.head
              ? this.addPath(spaceData.member.head)
              : this.defaultAvatar,
        name:
          spaceData.fleet && spaceData.fleet.nickname
            ? spaceData.fleet.nickname
            : spaceData.member.nickname,
        userId: spaceData.member.id,
        publishDate: spaceData.publishDate,
        content: spaceData.content,
        share: spaceData.share,
        audios: spaceData.audios,
        images: spaceData.images,
        topics: spaceData.topics,
        videos: spaceData.videos,
        commentCount: spaceData.commentCount,
        supportCount: spaceData.supportCount,
        comments: spaceData.comments,
        isSupport: spaceData.isSupport
      };
    },
    // [评论]数据处理
    getCommentData(spaceData) {
      let commentData = [];
      spaceData.comments.forEach((item, index) => {
        commentData.push({
          avatar: item.member.head
            ? this.addPath(item.member.head)
            : defaultAvatar,
          nickname: item.member.nickname,
          sendData: item.commentDatetime,
          content: item.content,
          id: item.member.id,
          commentId: item.id
        });
      });

      return commentData;
    },
    // [喜欢]数据处理
    getSupportData(spaceData) {
      let supportData = [];
      spaceData.supports.forEach((item, index) => {
        supportData.push({
          avatar: item.member.head
            ? this.addPath(item.member.head)
            : defaultAvatar,
          nickname: item.member.nickname
        });
      });

      return supportData;
    },
    // 展示操作栏
    showBottomSheet(params) {
      this.bottomSheet = true;
      this.removeData = params.removeData;
      this.removeIndex = params.removeIndex;
    },
    // 隐藏操作栏
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    // 删除评论
    delSpaceComment() {
      // @TODO: 二次确认
      let request = {
        methodName: "DeleteSpaceComment",
        ids: [Number(this.removeData.commentId)]
      };
      this.$.get(request).then(resp => {
        if (resp.data.resultCode == "100") {
          this.commentData.splice(this.removeIndex, 1);
        } else {
          this.$.toast("删除评论失败");
        }
      });
      // 关闭操作框
      this.closeBottomSheet()
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.init(this.$route.query.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.item-container {
  border-bottom: 1px solid #ececec;
}
.top,
.bottom {
  display: flex;
  align-items: center;
  padding: 4px;
}
.left {
  flex: 1 1 0;
}
.left img {
  width: 30px;
  height: 30px;
}
.right {
  flex: 6 1 0;
}
.righter {
  flex: 0 1 0;
  padding-bottom: 17px;
  padding-right: 10px;
}
.text {
  padding: 0.4em 0;
}
.grey-text {
  color: #666;
}
.bottom-btn {
  text-align: center;
  &.cancel-btn {
    color: #9e9e9e
  }
}
.padding-btn {
  padding: 5px;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  height: 1px;
}
</style>