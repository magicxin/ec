<template>
  <div id="channel">
    <icar-header main-text="爱车频道" textColor="#474747" bgColor="#F7F7F7" :ifNativeGoBack="true">
      <img :src="left" alt="" v-tap="{methods: nativeGoBack}" class="back">
    </icar-header>

    <scroll :bottom="true" marginBottom="0">
      <!-- 频道下拉菜单 -->
      <div layout="row" layout-align="space-between center" class="channel-harder-bar">
        <span flex></span>
        <span flex></span>
        <mu-select-field flex v-model="type" v-if="queryData.articleCategorys">
          <mu-menu-item :title="item.name" v-for="(item,index) in queryData.articleCategorys" :key="index" :value="item.id" />
        </mu-select-field>
      </div>
      <!-- 文章列表 -->
      <Loadmore class="channel-all-box" :getMore="getArticle" :allLoaded="allLoaded">
        <a class="channel-for-all">
          <span class="channel-title" v-show="emptyShow">{{emptyTitle}}</span>
        </a>
        <a v-for="(value, key) in currentValue" :key="key" class="channel-for-all">
          <span class="channel-title">{{key}}</span>
          <panel :value="item" v-for="(item,index) in value" :key="index" v-tap="{methods: goDetail, item: item}">
            <span slot="desc" class="desc">{{item.desc}}</span>
            <span slot="number" class="date">{{item.publishDate}}</span>
          </panel>
        </a>
      </Loadmore>
      <empty v-show="emptyShow" message="当前频道下还没有新文章, 去别的地方看看吧"></empty>
    </scroll>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from "vue";
import icarHeader from "components/my-header";
import left from "assets/left-gray.svg";
import panel from "components/panel";
import empty from "components/empty-page"
import Loadmore from "components/loadmore";
import scroll from "components/scroll.vue";

//let baseUrl = main._configProvider().baseUrl
let _cache = {};
let isLoading;
let query = {
  index: 0,
  count: 6
};

export default {
  name: "channel",
  data() {
    return {
      left,
      queryData: {},
      type: {},
      allLoaded: false,
      currentValue: null,
      emptyShow: false,
      emptyTitle: '',
      categoryMaps: new Map()
      // lastDate: ""
    };
  },
  props: {
    categoryId: null
  },
  components: {
    icarHeader,
    panel,
    scroll,
    Loadmore,
    empty
  },
  methods: {
    // back
    nativeGoBack() {
      this.$.push("router_back", null, resp => {
        console.log("调用成功");
      });
    },
    // 跳转到文章详情
    goDetail(params) {
      this.$router.push({
        name: "channelDetail",
        query: {
          channel: JSON.stringify(params.item)
        }
      });
    },
    // 获取文章list
    getArticle(type) {
      if (!isLoading) {
        isLoading = true;
        this.emptyMessage = ''

        // req
        let req = {
          methodName: "ListCarForum",
          categoryId: type,
          index: query.index.toString(),
          count: query.count.toString()
        };

        // invoke request 
        this.$.get(req).then(resp => {
          isLoading = false;
          this.emptyShow = false;

          // 全部加载完, 无新数据
          if (!resp.data.carForums || resp.data.carForums.length < query.count) {
            this.allLoaded = true;
          }

          // 翻页
          query.index = query.index + query.count;

          // 数据处理
          resp.data.carForums &&
            resp.data.carForums.forEach(item => {
              // this.lastDate = item.publishDate;
              if (!_cache[item.categoryName]) {
                _cache[item.categoryName] = [];
              }
              _cache[item.categoryName].push({
                id: item.id,
                name: item.title,
                image: item.logo,
                url: this.addPath(item.path),
                publishDate: item.publishDate,
                desc: item.desc
              });
              this.currentValue = _cache;
              // this.$forceUpdate();
            });
        }).then(()=>{
          // 确保empty信息, 不会在切换频道的时候一闪而过
          this.emptyShow = this.currentValue ? false : true
          this.emptyTitle = this.categoryMaps.get(type)
        });
      }
    }
  },
  watch: {
    // 频道信息该表时, 获取数据, 切换展示
    type(newVal, oldVal) {
      this.currentValue = null;
      this.allLoaded = false;
      // this.lastDate = "";
      query.index = 0;
      query.count = 6;
      _cache = {};
      this.getArticle(newVal);

      // 切换路由的param, 与categoryId同步
      this.$router.replace({
        name: "channel",
        params: {
          categoryId: newVal
        }
      });
    }
  },
  beforeRouteEnter: (to, from, next) => {
    Vue.prototype.$
      .get({
        methodName: "ListArticleCategory"
      })
      .then(resp => {
        next(vm => {
          vm.$nextTick(() => {
            vm.queryData = resp.data;
            vm.type = vm.categoryId
              ? vm.categoryId
              : vm.queryData.articleCategorys[0].id;

            for (let articleCate of vm.queryData.articleCategorys) {
              vm.categoryMaps.set(articleCate.id, articleCate.name)
            }
          });
        });
      });
  },
  // 在当前路由改变，但是该组件被复用时调用
  beforeRouteUpdate(to, from, next) {
    // 目录id更新
    this.type = to.params.categoryId
      ? to.params.categoryId
      : this.queryData.articleCategorys[0].id;
    next();
  }
};
</script>
<style>
.channel-harder-bar {
  height: 42px;
  position: relative;
  z-index: 2323323;
}

#channel .back {
  position: relative;
  left: 5px;
}

.channel-title {
  font-size: 1.3rem;
  margin-left: 10px;
  border-left: 2px solid #fbad59;
  padding-left: 8px;
  display: inline-block;
  margin-top: -4px;
  position: relative;
  top: -14px;
  z-index: 203212;
  color: #1a1a1a;
}

#channel .date {
  color: #929292;
  font-size: 1.1rem;
}

#channel .desc {
  display: inline-block;
  margin-top: 0.4em;
}

#channel .loading span {
  display: inline-block;
  margin-top: 40px;
}

#channel .desc,
#channel .desc p {
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
  display: block;
  width: 140px;
}

#channel .panel_box_img {
  width: 100px;
}

#channel .panel_h4 {
  font-size: 1.3rem;
}
.mu-menu-item-wrapper.active {
  color: #fbad59;
}

.mu-dropDown-menu-text {
  text-align: right;
}

#channel .mu-text-field {
  margin-top: 14px;
  font-size: 1.3rem;
}

#channel .mu-text-field-line {
  display: none;
}

.channel-all-box {
  position: relative;
  margin-top: -40px;
}

.channel-for-all {
  margin-top: 30px;
  display: block;
}
</style>
