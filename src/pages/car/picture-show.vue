<template>
  <section id="picture-show" class="bg">
    <!-- <appbar :link="linkName"/> -->
    <magic-header titleName="显示照片"></magic-header>
    <!-- <magic-header :titleName="linkName"></magic-header> -->
    <img class="picture-content" :src="pictureUrl"></img>
  </section>
</template>
<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'

  export default {
    components: {
      magicHeader
    },
    data () {
      return {
        pictureUrl: '',
        linkName: '试试'
      }
    },
    computed:{
      articleUrl: function () {
        return this.pagePath;
      }
    },
    created(){
      this.pictureUrl = this.$route.params.pictureUrl
      this.linkName = {name:this.$route.params.linkName}
    },
    watch:{
      '$route':function(routeUri){
        this.pictureUrl = routeUri.params.pictureUrl
        this.linkName = {name:routeUri.params.linkName}
      }
    }
  }
</script>
<style lang="scss">
  #picture-show .picture-content{
    width: 100%;
    border: 0px;
  }
</style>
