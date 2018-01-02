<template>
  <section id="auto-forum" class="bg">
    <template v-if="this.$route.query.categoryId">
        <!-- <appbar :link="{name:'auto-forum'}"/> -->
        <magic-header titleName="爱车频道"></magic-header>
    </template>
    <template v-else>
        <!-- <appbar/> -->
    </template>
    <!-- <content-with-loading :loaded="loaded"> -->
      <mu-dropDown-menu :maxHeight="300" :value="articleClassId" @change="articleClassify">
        <mu-menu-item v-for="articleClass in articleClassList" :value="String(articleClass.id)" :key="articleClass" :title="articleClass.name"/>
      </mu-dropDown-menu>
      <mu-list :value="articlePath" @change="itemSelected">
        <template v-for="article in articleList">
          <mu-list-item :value="article.path" :title="article.title">
            <mu-avatar :src="article.logo" slot="leftAvatar"/>
            <span slot="right">
              <span slot="describe">{{ article.publishDate | getDate}}</span>
            </span>
          </mu-list-item>
        </template>
      </mu-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
    <!-- </content-with-loading> -->
    <mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>
  </section>
</template>

<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import {menu as MuMenu,menuItem as MuMenuItem} from 'muse-components/menu'
  // import MuDropDownMenu from 'muse-components/dropDownMenu'
  // import MuAvatar from 'muse-components/avatar'
  import autoForumClassList from 'services/auto-forum-class-list'
  import autoForumArticleList from 'services/auto-forum-article-list'
  // import ContentWithLoading from 'components/content-with-loading'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import MuInfiniteScroll from 'muse-components/infiniteScroll'

  export default {
    components: {
      // Appbar,
      magicHeader,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuAvatar,
      // MuDropDownMenu,
      // MuMenu,
      // MuMenuItem,
      // MuSnackbar,
      // MuInfiniteScroll
    },
    data () {
      const articleClassList = []
      const pageCount = '10'
      return {
        pageCount,
        loaded:false,
        categorySuccessful:false,
        articleSuccessful:false,
        showError:false,
        errorMessage:'',
        articlePath: '',
        articleClassId: '',
        articleClassList: [],
        articleList:[],
        loading: false,
        scroller: null,
        uriShopId:'',
      }
    },
    mounted () {
      this.scroller = this.$el
    },
    computed:{
      // loaded(){
      //   return this.categorySuccessful && this.articleSuccessful;
      // }
    },
    watch:{
      '$route':function(to,from){
        if(to.name==='auto-forum'||from.name==='auto-forum'){
          this.uriShopId=this.$route.query.shopId
          console.log(this.uriShopId)
          autoForumClassList.bind(this)({
            shopId:this.uriShopId
          },(data)=>{
            this.articleClassList=data.articleCategorys
            console.log(data.articleCategorys[0].id)
            this.articleClassId=data.articleCategorys[0].id
            this.categorySuccessful=true
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })
          if(this.$route.query.categoryId){
            this.articleClassId = this.$route.query.categoryId
          }else{
            this.articleClassId = ''
          }
          autoForumArticleList.bind(this)({
            categoryId: this.articleClassId,
            beginTime: '',
            count: this.pageCount,
            shopId:this.uriShopId
          },(data)=>{
            this.articleList=data.carForums
            this.articleSuccessful=true
            if(this.$route.query.categoryId){
              this.articleClassId = this.$route.query.categoryId
            }
          },(errorMessage)=>{
            this.errorMessage=errorMessage
            this.showError=true
          })
            }
        }
    },
    created(){
      this.uriShopId=this.$route.query.shopId
      console.log(this.uriShopId)
      autoForumClassList.bind(this)({
        shopId:this.uriShopId
      },(data)=>{
        this.articleClassList=data.articleCategorys
        this.articleClassId=data.articleCategorys[0].id
        this.categorySuccessful=true
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
      if(this.$route.query.categoryId){
        this.articleClassId = this.$route.query.categoryId
      }
      autoForumArticleList.bind(this)({
        categoryId: this.articleClassId,
        beginTime: '',
        count: this.pageCount,
        shopId:this.uriShopId
      },(data)=>{
        this.articleList=data.carForums
        this.articleSuccessful=true
        if(this.$route.query.categoryId){
          this.articleClassId = this.$route.query.categoryId
        }
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    filters: {
      getDate: function (value) {
        return value.substring(0,10)
      }
    },
    methods: {
      loadMore () {
        if (this.loading == false) {
          this.loading = true
          setTimeout(() => {
            var beginTimeVal = this.articleList[this.articleList.length - 1].publishDate
            autoForumArticleList.bind(this)({
              categoryId: this.articleClassId,
              beginTime: beginTimeVal,
              count: this.pageCount,
              shopId:this.uriShopId
            },(data)=>{
              if (data.length != 0) {
                for (var i=0;i<data.carForums.length;i++) {
                  this.articleList.push(data.carForums[i])
                }
              }
              this.loading = false
            },(errorMessage)=>{
              this.errorMessage=errorMessage
              this.showError=true
            })
            this.loading = false
          }, 2000)
        }
      },
      articleClassify (val) {
        this.articleClassId = val;
        autoForumArticleList.bind(this)({
          categoryId: val,
          beginTime: '',
          count: this.pageCount,
          shopId:this.uriShopId
        },(data)=>{
          this.articleList=data.carForums
          this.articleSuccessful=true
        },(errorMessage)=>{
          this.errorMessage=errorMessage
          this.showError=true
        })
      },
      itemSelected (val) {
        this.articlePath = val;
        console.log('url params::'+this.articlePath)
        this.$router.push({
          name: 'article-show',
          query: {
            articleUrl: val,
            from: 'auto-forum',
            categoryId: this.articleClassId,
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #auto-forum{
    .mu-list {
      overflow-x:inherit;
      padding-top:45px;
    }
    .mu-item-right {
      width:85px;
      top:16px;
    }
    .mu-dropDown-menu {
      position:fixed;
      right:0px;
      z-index:200;
      width:100%;
      background:#fff;
      height:45px;
      border-bottom:1px solid #cbcbcb;
    }
    .mu-dropDown-menu-line {
      width:0px;
    }
    .mu-item-wrapper {
      border-bottom:1px solid #cbcbcb;
    }
    .demo-infinite-container{
      width:256px;
      height:300px;
      overflow:auto;
      -webkit-overflow-scrolling: touch;
      border:1px solid #d9d9d9;
    }
  }
</style>
