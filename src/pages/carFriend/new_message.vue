<style>
#new_message .mu-card-header .mu-avatar {
  width: 40px;
  height: 40px;
  margin-right: 6px;
  margin-top: -7px;
}

#new_message .row {
  border-bottom: solid 1px #ededed;
  padding-top: 10px;
  padding-bottom: 8px;
}

#new_message .userName {
  padding-top: 10px;
  font-size: 17px;
  color: #f98700;
}

#new_message .comcon {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 15px;
}

#new_message .supcon {
  padding-top: 3px;
  padding-bottom: 1px;
}

#new_message .col-40 .iconfont.icon-heart1 {
  color: #f98700;
}

#new_message .mu-card-header-title .mu-card-sub-title {
  font-size: 12px;
  margin-top: 6px;
}

#new_message .mu-card-title-container {
  padding: 0px;
}
</style>
<template>
  <div id="new_message">
    <magic-header titleName="评论"></magic-header>
    <mu-row v-for="(item,index) in newMessList" :key="index" v-tap="{methods: goDetail, id: item.spaceId, name: nickName}">
      <mu-col width="20">
        <mu-card-header title="" subTitle="">
          <mu-avatar :src="item.member.head ? addPath(item.member.head) : defaultImg" slot="avatar" />
        </mu-card-header>
      </mu-col>
      <mu-col width="40">
        <div class="userName">{{item.member.nickname}}</div>
        <div class="comcon" v-if="item.type === '1'" v-html="item.comment"></div>
        <div class="supcon" v-if="item.type === '0'">
          <i class="iconfont icon-heart1"></i>
        </div>
        <div class="comDate">{{ item.publishDate | sliceDate }}</div>
      </mu-col>
      <mu-col width="40">
        <div v-if="item.spaceImage"><img width="100px" height="65px" :src="addPath(item.spaceImage)" /></div>
        <div v-if="!item.spaceImage">{{ item.spaceContent }}</div>
      </mu-col>
    </mu-row>
  </div>
</template>
<script>
import left from "assets/left-gray.svg";
import defaultImg from "assets/default_user_icon.png";
import magicHeader from "components/magicHeader";
//

export default {
  data() {
    return {
      left,
      defaultImg,
      newMessList: [],
      nickName: this.$route.params.usernickName
    };
  },

  filters: {
    // 活动开始日期
    sliceDate: function(value) {
      return value.slice(5, 16);
    }
  },
  methods: {
    // 查看动态详情
    goDetail(params) {
      this.$router.push({
        name: "allcomment",
        query: {
          id: params.id
        }
      });
    },
    // 数据处理
    getDynamicData(spaceData) {
      return {
        id: spaceData.id,
        avatar:
          spaceData.fleet && spaceData.fleet.head
            ? this.addPath(spaceData.fleet.head)
            : spaceData.member && spaceData.member.head
              ? this.addPath(spaceData.member.head)
              : this.defaultImg,
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
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$
        .get({
          methodName: "QuerySpaceMessage",
          lastTime: to.params.lastMessTime
        })
        .then(resp => {
          if (resp.data.resultCode === "100") {
            vm.newMessList = resp.data.spaceMessages;
          }
        });
    });
  },
  components: {
    magicHeader
  }
};
</script>
