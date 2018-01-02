<template>
  <section id="iframe-content">
    <!-- <appbar :link="{name:$route.query.backRouteName,title:title}"/> -->
    <magic-header titleName="详细信息"></magic-header>
    <iframe v-if="$route.name=='iframe-content'" :src="src" frameborder="0"></iframe>
  </section>
</template>

<script>
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  import calcUriParams from 'utilities/calc-uri-params'
  export default{
    components: {
      magicHeader
    },
    computed: {
      src(){
//        众安保险的比较特效
        if (this.$route.query.isSpecial) {
//          let decodedUri = this.$route.query.iframeUri,
//            finalUri = calcUriParams.addCustom({
//              fullStr: decodedUri,
//              startPoint: '?',
//              joinMark: '&',
//              setValueMark: '=',
//              options: {
//                timestamp: Date.now()
//              }
//            })
//          console.log(finalUri)
//          return finalUri
          alert(this.$route.query.iframeUri)
          return this.$route.query.iframeUri
        }
        let decodedUri = decodeURIComponent(this.$route.query.iframeUri),
          finalUri = calcUriParams.addCustom({
            fullStr: decodedUri,
            startPoint: '?',
            joinMark: '&',
            setValueMark: '=',
            options: {
              timestamp: Date.now()
            }
          })
        console.log(finalUri)
        return finalUri
      },
      title(){
        return this.$route.query.iframeTitle
      }
    }
  }
</script>

<style lang="scss">
  #iframe-content {
    .appbar:not(.hide) + *:not(.loading-spin) {
      margin-top: 0;
    }
    padding-top: 45px;
    iframe {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
