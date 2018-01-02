
<template>
  <div id="banner_vr">
  			<ma-header titleName="展厅" :returnNative="true"></ma-header>
        <iframe ref="shop" :src="url" width="100%"></iframe>
        <div ref="text" class="info">
            <span>文件解压中，10分钟内生效</span>
        </div>
      <div class="hotpot"></div>
      <img ref="img" class="err-img" :src="errorImg" />
  </div>
</template>

<script>
	  import maHeader from 'components/magicHeader'
    import axios from 'axios'
    import errorImg from 'assets/successBg.png'
    export default {
        data() {
            return {
                errorImg : errorImg,
//              returnImg: returnImg,
                url: '',
                isBridge : true
            }
        },
        created() {
            axios.get(this.$route.query.shop + '/index.html')
                .then((res) => {
                    console.log(res.message)
                    if (res.message && res.message.indexOf('404') > -1) {
                        this.$refs.img.style.display = 'none'
                        this.$refs.shop.style.display = 'flex'
                        this.$refs.text.style.display = 'flex'
                    } else {
//                      this.$refs.img.style.display = 'none'
//                      this.$refs.text.style.display = 'none'
                        this.url = this.$route.query.shop + '/index.html'
                        console.log(this.$route.query.shop)
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
            
            
        },
        beforeRouteEnter(to, from, next) {
//            alert(from.name)
            if(from.name != null){
                 next(function(vm){
                    vm.isBridge = false
                })
            }else {
                next(function(vm){
                    vm.isBridge = true
                })
            }
        },
        mounted() {
            this.$refs.shop.height = window.innerHeight;
        },
        methods: {
            
        },
        //   
        //    beforeRouteEnter (to, from, next) {
        //     
        //    },
        components: {
					maHeader
        }
    }

</script>
<style>
    iframe {
        border: none;
        margin: 0;
        padding: 0;
    }
    
    #banner_vr .header {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 4em;
        z-index: 10;
    }
    
    #banner_vr .return {
        position: absolute;
        top: 1em;
        left: 1em;
        width: 2em;
    }
    
    .hotpot {
        position: absolute;
        top: 10em;
        left: 4em;
        z-index: 1000;
    }
    #banner_vr .info {
        position : relative;
        padding-top : 20em;
        z-index : 6;
        display : flex;
        justify-content: center;
        font-size: 1.4em;
        color : #f5f5f5;
    }
    #banner_vr .err-img {
        width : 100%;
        position : absolute;
        top: 4em;
        left : 0;
        z-index : 5;
    }
    .err-img {
    	display : none;
    }
    .info {
    	display : none;
    }
</style>