<template>
  <!-- 会员中心 -->
  <div class="community">
    <magic-header titleName="社区" :hideReturn="true"></magic-header>
    <!--start swiper 图片轮播 -->
    <swipe class="my-swipe" v-if="banner.length">
      <swipe-item v-for="(item,index) in banner" :key="index" class="swiper">
        <img class="swipe-img" :src="item.image" v-tap="{methods:go,path:item.path}" />
      </swipe-item>
    </swipe>
    <div v-else class="defaultImg">
      <img :src="carFriend" />
    </div>
    <!--end swiper -->

    <!--start 带颜色选择按钮 -->
    <div class="select-btn">
      <div class="carfriend-meet" v-tap="{methods:goMeet}">
        车友会
        <div v-if="newFleet" class="red-msg"></div>
      </div>
      <div class="city-active" v-tap="{methods:goActive}">
        同城活动
        <div v-if="newActive" class="red-msg"></div>
      </div>
      <div class="hot-discuss" v-tap="{methods:goDiscussion}">
        热门讨论
        <div v-if="newDiscuss" class="red-msg"></div>
      </div>
      <div class="carfriend" v-tap="{methods:goNative}">
        车友
        <div v-if="newCarfri" class="red-msg"></div>
      </div>
    </div>
    <!--end 带颜色选择按钮 -->

    <!--start tabs-->
    <tabs :tabData="tabData" class="tab-title" @removeRed="removeRed" @changeTab="init">
      <!-- 新动态提醒: 评论,点赞等操作 -->
      <!-- <div class="newmsg-btn"> -->
      <div class="newmsg-btn" v-if="newMessageList && newMessageList.length > 0">
        <button v-tap="{methods: goNewMessage, name: nickName}">
          您有{{newMessageList.length}}条未读消息
        </button>
      </div>

      <!-- 车友会动态 -->
      <div class="" slot="tab0">
        <loadmore :getMore="loadMore">
          <div v-if="carMeetDynamic.length>0" v-for="(item, index) in carMeetDynamic" :key="index">
            <dynamic :itemData="item"></dynamic>
          </div>
        </loadmore>
      </div>

      <!-- 车友动态 -->
      <div class="" slot="tab1">
        <!-- 发状态按钮 -->
        <div class="btn-addDynamic">
          <i class="iconfont icon-edit" v-tap="{methods: pubDynamic}"></i>
        </div>
        <loadmore :getMore="loadMoreCarFriend">
          <div v-for="(item, index) in carFriendDynamic" :key="index">
            <dynamic :itemData="item" @removeSuccess="removeDynamic(index,carFriendDynamic)"></dynamic>
          </div>
        </loadmore>
      </div>
    </tabs>
  </div>
</template>

<script>
import Vue from "vue";
import magicHeader from "components/magicHeader";
import dynamic from "components/dynamic/dynamic";
import tabs from "components/tab/tabs";
import loadmore from "components/loadmore";
import carFriend from "assets/carFriend.png";
import defaultAvatar from "assets/default_user_icon.png";

let befTime = null;
let aftTime = null;

export default {
  name: "community",
  components: {
    magicHeader,
    tabs,
    dynamic,
    loadmore
  },
  data() {
    return {
      banner: [], //轮播数据
      swiperDefault: [],
      carFriendDynamic: [], //车友会动态
      carMeetDynamic: [], //车友会动态
      tabData: [
        {
          title: "车友会动态",
          redMsg: false
        },
        {
          title: "车友动态",
          redMsg: false
        }
      ], //设置tab切换
      //	      redMsg:[true,true,true,true],
      newCarfri: "",
      newFleet: "",
      newActive: "",
      newDiscuss: "",
      newFleetDyn: "",
      newFriDyn: "",
      //        newMessage: '',
      replyDate: "10-17",
      carFriend: carFriend,
      defaultImg: defaultAvatar,
      refresh: false,
      query: {
        index: 5,
        count: 5
      },
      queryRidersSpace: {
        index: 5,
        count: 5
      },
      nickName: "",
      lastTime: "",
      newMessageList: []
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refresh = true;
      // 如果页面是从发动态操作返回的, 则滚动页面至顶端, 展示最新动态
      if (from.name == "carFri_pubDynamic") {
        setTimeout(() => window.scrollTo(0, {}), 0);
      }
      // 原生调用此方法，来控制车友小红点的显示
      //		        Vue.prototype.$.register('data_sendNewMessage', vm)
    });
  },
  created() {
    //	  	this.init()
  },
  watch: {
    refresh(newV, oldV) {
      if (newV === true) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      //请求车友会广告
      this.refresh = false;
      let $ = this.$;

      let getSwiper = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QueryAdPosition",
            type: "5"
          }).then(res => {
            resolve(res);
          });
        });
      };
      //获取用户昵称，用于显示删除动态的按钮
      let getNickname = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QueryUserInfo"
          }).then(res => {
            resolve(res);
          });
        });
      };
      //获取新消息红点，换肤
      let getNewMessage = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QueryNewEventAlarm"
          }).then(res => {
            resolve(res);
          });
        });
      };
      //获取车友会动态
      let getDynamicMeet = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QueryRidersSpace",
            index: "0",
            count: "5",
            type: "1"
          }).then(res => {
            resolve(res);
          });
        });
      };
      //获取车友动态
      let getDynamic = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QueryRidersSpace",
            index: "0",
            count: "5",
            type: "0"
          }).then(res => {
            resolve(res);
          });
        });
      };
      //查询车友动态
      let getCarFriend = function() {
        return new Promise(function(resolve, reject) {
          $.get({
            methodName: "QuerySpaceMessage",
            lastTime: window.localStorage.getItem("NewLastTime")
          }).then(res => {
            resolve(res);
          });
        });
      };

      let reqList = [
        getSwiper(),
        getNickname(),
        getNewMessage(),
        getDynamicMeet(),
        getDynamic(),
        getCarFriend()
      ];
      Promise.all(reqList).then(res => {
        console.log(res);
        // nickName
        this.nickName = res[1].data.userNickname;
        //swiper数据
        this.banner = res[0].data.ads;
        this.banner.forEach((item, index) => {
          item.image = this.addPath(item.image);
        });
        //红点显示
        if (res[2].data.resultCode === "100") {
          if (!window.localStorage.getItem("timeMap")) {
            window.localStorage.setItem(
              "timeMap",
              JSON.stringify(res[2].data.timeStampMap)
            );
          }
          befTime = JSON.parse(window.localStorage.getItem("timeMap"));
          aftTime = res[2].data.timeStampMap;
          //	            console.log(befTime)
          //	            console.log(aftTime)
          if (aftTime[6] !== befTime[6]) {
            this.newFleet = true;
          }
          if (aftTime[7] !== befTime[7]) {
            this.newActive = true;
          }
          if (aftTime[8] !== befTime[8]) {
            this.newDiscuss = true;
          }
          if (aftTime[9] !== befTime[9]) {
            this.tabData[0].redMsg = true;
          }
          if (aftTime[10] !== befTime[10]) {
            this.tabData[1].redMsg = true;
          }
        }
        //车友会动态
        let returnCarMeet = res[3].data.spaces;
        returnCarMeet.length &&
          returnCarMeet.forEach((item, index) => {
            this.carMeetDynamic[index] = {
              id: item.id,
              avatar: item.fleet.head
                ? this.addPath(item.fleet.head)
                : this.defaultImg,
              name: item.fleet.name,
              userId: item.member.id,
              publishDate: item.publishDate,
              content: item.content,
              share: item.share,
              audios: item.audios,
              images: item.images,
              topics: item.topics,
              videos: item.videos,
              commentCount: item.commentCount,
              supportCount: item.supportCount,
              comments: item.comments,
              isSupport: item.isSupport
            };
          });
        //车友动态
        let returnCarFriend = res[4].data.spaces;
        //          console.log(res[4].data.spaces[3])
        returnCarFriend.length &&
          returnCarFriend.forEach((item, index) => {
            this.carFriendDynamic[index] = {
              id: item.id,
              avatar: item.member.head
                ? this.addPath(item.member.head)
                : this.defaultImg,
              name: item.member.nickname,
              userId: item.member.id,
              publishDate: item.publishDate,
              content: item.content,
              share: item.share,
              audios: item.audios,
              images: item.images,
              topics: item.topics,
              videos: item.videos,
              commentCount: item.commentCount,
              supportCount: item.supportCount,
              comments: item.comments,
              isSupport: item.isSupport
            };
          });

        // 新动态
        // 1. NewLastTime中的数据只有每次去查看了未读消息才更新
        // 2. lastTime永远保存最新数据
        if (!window.localStorage.getItem("NewLastTime")) {
          window.localStorage.setItem("NewLastTime", res[5].data.lastestTime);
        }
        this.lastTime = res[5].data.lastestTime;
        this.newMessageList = res[5].data.spaceMessages;
      });
    },
    //swiper进入活动页
    go(params) {
      var arr = params.path.split("#");
      if (this.banner.length > 0) {
        this.$.go({
          name: "router_crossWebView",
          query: {
            project: "ec",
            routeAndParams: "#" + arr[1]
          }
        });
      }
    },
    //进入车友会
    goMeet() {
      this.$router.push({
        name: "carfri_meetLists"
      });
      if (this.newFleet === true) {
        this.newFleet = false;
        befTime[6] = aftTime[6];
        window.localStorage.setItem("timeMap", JSON.stringify(befTime));
      }
    },
    // 同城活动
    goActive() {
      this.$router.push({
        name: "city_active"
      });
      if (this.newActive === true) {
        this.newActive = false;
        befTime[7] = aftTime[7];
        window.localStorage.setItem("timeMap", JSON.stringify(befTime));
      }
    },
    // 热门讨论
    goDiscussion() {
      this.$router.push({
        name: "hot_discussion"
      });
      if (this.newDiscuss === true) {
        this.newDiscuss = false;
        befTime[8] = aftTime[8];
        window.localStorage.setItem("timeMap", JSON.stringify(befTime));
      }
    },
    // 进入原生车友页面
    goNative() {
      this.$.go({
        name: "route_carFriends"
      });
    },
    removeRed(count) {
      befTime[9 + count] = aftTime[9 + count];
      window.localStorage.setItem("timeMap", JSON.stringify(befTime));
    },
    loadMore() {
      this.$
        .get({
          methodName: "QueryRidersSpace",
          index: this.query.index,
          count: this.query.count,
          type: "1"
        })
        .then(res => {
          this.query.index += this.query.count;
          //车友会动态
          let returnCarMeet = res.data.spaces;
          returnCarMeet.length &&
            returnCarMeet.forEach((item, index) => {
              this.carMeetDynamic.push({
                id: item.id,
                avatar: item.fleet.head
                  ? this.addPath(item.fleet.head)
                  : this.defaultImg,
                name: item.fleet.name,
                userId: item.member.id,
                publishDate: item.publishDate,
                content: item.content,
                share: item.share,
                audios: item.audios,
                images: item.images,
                topics: item.topics,
                videos: item.videos,
                commentCount: item.commentCount,
                supportCount: item.supportCount,
                comments: item.comments,
                isSupport: item.isSupport
              });
            });

          console.log(this.carMeetDynamic);
        });
    },
    loadMoreCarFriend() {
      this.$
        .get({
          methodName: "QueryRidersSpace",
          index: this.queryRidersSpace.index,
          count: this.queryRidersSpace.count,
          type: "0"
        })
        .then(res => {
          this.queryRidersSpace.index += this.queryRidersSpace.count;
          //车友会动态
          let returnCarFriend = res.data.spaces;
          returnCarFriend.length &&
            returnCarFriend.forEach((item, index) => {
              this.carFriendDynamic.push({
                id: item.id,
                avatar: item.member.head
                  ? this.addPath(item.member.head)
                  : this.defaultImg,
                name: item.member.nickname,
                userId: item.member.id,
                publishDate: item.publishDate,
                content: item.content,
                share: item.share,
                audios: item.audios,
                images: item.images,
                topics: item.topics,
                videos: item.videos,
                commentCount: item.commentCount,
                supportCount: item.supportCount,
                comments: item.comments,
                isSupport: item.isSupport
              });
            });

          console.log(this.carFriendDynamic);
        });
    },
    // 发布动态
    pubDynamic() {
      this.$router.push({
        name: "carFri_pubDynamic"
      });
    },
    // 删除动态
    removeDynamic(index, list) {
      list.splice(index, 1);
    },
    // 查看新动态
    goNewMessage(params) {
      this.$router.push({
        name: "new_message",
        params: {
          lastMessTime: window.localStorage.getItem("NewLastTime"),
          usernickName: params.name
        }
      });
      window.localStorage.setItem("NewLastTime", this.lastTime);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-swipe {
  height: 180px;
  margin-bottom: 2em;
}

.swiper {
  height: 180px;
}

.swipe-img,
.defaultImg {
  width: 100%;
  margin-bottom: 1em;
}

.defaultImg img {
  width: 100%;
}

.select-btn {
  padding: 0 10px 0 10px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

.carfriend-meet,
.city-active,
.hot-discuss,
.carfriend {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 5px;
}

.carfriend-meet {
  position: relative;
  background: #f02b2b;
}

.city-active {
  position: relative;
  background: #548cd1;
}

.hot-discuss {
  position: relative;
  background: #f98700;
}

.carfriend {
  position: relative;
  background: #548cd1;
}

.red-msg {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(100%, -100%);
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: red;
}

.tab-title {
  position: relative;
}

.top .top .left img {
  border-radius: 0;
}
/*start 文章*/

.article-top {
  display: flex;
}

.article-top .article-left {
  padding: 4px;
}

.article-top .article-left img {
  width: 40px;
  height: 40px;
  flex: 1 1 0;
}

.article-top .article-right {
  flex: 4 1 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding: 4px;
}
/*end 文章*/

.btn-addDynamic {
  position: fixed;
  bottom: 5vh;
  right: 20px;
  i {
    width: 100px;
    height: 100px;
    background: #f98700;
    border-radius: 50%;
    color: #fff;
    font-size: 4vh;
    padding: 8px;
  }
}
.newmsg-btn {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  button {
    padding: 8px 20px;
    border-radius: 20px;
    box-shadow: none;
    border: 1px solid #f98700;
    background: #f98700;
    color: #fff;
  }
}
</style>