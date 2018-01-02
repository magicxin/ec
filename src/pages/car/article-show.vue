<template>
  <section id="article-show" class="bg">
    <!-- <appbar :link="{name:$route.query && $route.query.from ? $route.query.from : 'car-examination'}" :title="$route.query.title || ''"/>  -->
    <magic-header titleName="详细内容"></magic-header>
    <section ref="scrollContainer" class="scroll-container" style="height:100%;overflow:auto;-webkit-overflow-scrolling:touch;">
    <iframe ref="iframe" @load="setPosition" :class="[showIframe ? 'show-iframe' : '']" v-if="articleUrl" id="article-content" :src="articleUrl"></iframe>
    </section>
  </section>
</template>
<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'

  export default {
    components: {
      // Appbar
      magicHeader
    },
    data () {
      return {
        articleUrl: '',
        articlePageId:'',
        showIframe:false
      }
    },
    computed:{
      articleUri(){
        return this.articleUrl+'#'+this.articlePageId
      }
    },
    watch:{
      '$route':function(to,from){
        if(to.name=='article-show'){
          this.setPosition()
          // this.articleUrl=this.$route.query.articleUrl
          this.articlePageId=this.$route.query.articlePageId
        }else{
          this.showIframe=false
          // this.articleUrl=''
          // this.articlePageId=''
        }
      }
    },
    created(){
      this.articleUrl=this.$route.query.articleUrl
      this.articlePageId=this.$route.query.articlePageId
      this.setPosition()
    },
    methods:{
      setPosition(){
        // this.articleUri=this.articleUrl+'#'+this.articlePageId
        setTimeout(()=>{
          this.showIframe=true
          console.log(this.$refs)
        let $$target=this.$refs.iframe.contentWindow.document.getElementById(this.articlePageId)
        $$target ? $$target.scrollIntoView() : ''

        },500)
      }
    }
  }
</script>
<style lang="scss">
#article-show{
  // overflow:hidden!important;
}
  #article-content {
    min-height: 100%;
    width: 100%;
    border:none;
    opacity:0;
    &.show-iframe{
      opacity:1;
    }
    // overflow:auto;
    // -webkit-overflow-scrolling:touch;
  }
</style>
