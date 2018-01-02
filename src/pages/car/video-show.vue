<template>
  <section id="video-show" class="bg">
    <!-- <appbar :link="linkName"/> -->
    <magic-header titleName="显示视频"></magic-header>
    <video class="video-content" :src="videoUrl" controls="controls">
    </video>
  </section>
</template>
<script>
  import magicHeader from 'components/magicHeader'
  export default {
    components: {
      magicHeader
    },
    data () {
      return {
        videoUrl: '',
        linkName: ''
      }
    },
    computed:{
      articleUrl: function () {
        return this.pagePath;
      }
    },
    created(){
      this.videoUrl = this.$route.params.videoUrl
      this.linkName = {name:this.$route.params.linkName}
    },
    watch:{
      '$route':function(routeUri){
        this.videoUrl = routeUri.params.videoUrl
        this.linkName = {name:routeUri.params.linkName}
      }
    }
  }
</script>
<style lang="scss">
  #video-show .video-content{
    width: 100%;
    border: 0px;
  }
</style>
