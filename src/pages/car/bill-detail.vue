<template>
  <section id="bill-detail" class="background-light">
        <template>
        <magic-header titleName="账单明细" :returnNative="$.isNative"></magic-header>
        <div class="content" id="content">
            <mu-flexbox class="flex-demo">
              <mu-flexbox-item v-if="detailBill.verifyState==2" class="font-color">
                {{({'0':'待审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}
              </mu-flexbox-item>
              <mu-flexbox-item v-else>
                {{({'0':'待审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}
              </mu-flexbox-item>
              <mu-flexbox-item v-if="detailBill.verifyState==2" class="font-color">
                 {{detailBill.verifyRemarks}}
              </mu-flexbox-item>
              <mu-flexbox-item v-else>
                 {{detailBill.verifyRemarks}}
              </mu-flexbox-item>
            </mu-flexbox> 
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                用户名
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.member.userName}}
              </mu-flexbox-item>
            </mu-flexbox>   
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                车牌号
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.car.plateNumber}}
              </mu-flexbox-item>
            </mu-flexbox> 
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                车队
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.fleet.name}}
              </mu-flexbox-item>
            </mu-flexbox>   
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                日期
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.happenDate}}
              </mu-flexbox-item>
            </mu-flexbox> 
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                费用类型
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.frontExpenseName}}
              </mu-flexbox-item>
            </mu-flexbox> 
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                费用金额
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{detailBill.cost}}
              </mu-flexbox-item>
            </mu-flexbox>
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                上传凭证
              </mu-flexbox-item>
              <mu-flexbox-item>
              </mu-flexbox-item>
            </mu-flexbox>
            <div v-for="image in this.images"  style="display: inline-block;padding:0px 5px" v-on:click="enlarge(image)">
              <img :src="image" width="100">
            </div>
          </div>
          <div @click="closeImg" class="overlay">
               <img :src="imageValue" :style="imgStyle"/>
          </div>
          <mu-raised-button label="删除" class="delete" @click="open()" primary fullWidth/>
          <mu-snackbar class="center" v-if="snackbar" :message="message" action="关闭" @actionClick="hideSnackbar"
                       @close="hideSnackbar"/>
          <mu-dialog :open="dialog" @close="close" :bodyClass="bodyClass">
            确定删除此账单么?
            <mu-flat-button slot="actions" @click="close" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="ok" label="确定"/>
          </mu-dialog>
		    </template>
      <!-- </content-with-loading> -->
  </section>
</template>
<script>
  import magicHeader from 'components/magicHeader'
  import viewBill from 'services/view-bill'
  import delbBill from 'services/del-bill'
  import clientInfo from 'utilities/client-info'
  export default {
    components: {
      magicHeader,
    },
    data() {
      return {
        loaded:true,
        snackbar: false,
        message:'',
        dialog: false,
        detailBill:[],
        images:[],
        isNativeWebView:false,
        imageValue:'',
        imgStyle:''
      }
    },
    created(){
      this.initData()
    },
     watch:{
      '$route':function(to,from){
        if(to.name==='bill-detail'){
          this.initData()  
        }
      }
    },
    methods:{
      initData(){
        console.log(this.$route.query.id)
        this.isNativeWebView=clientInfo.render.isNativeWebView
        this.images = [] 
        viewBill.bind(this)({
          id:this.$route.query.id,
        },(data)=>{        
            this.detailBill = data.carCost
            this.detailBill.images.forEach((item)=>{                    
              //  item = apiHost.dynamicHost.get() + item  
              item = this.addPath(item)
               this.images.push(item)   
            })
          },(error)=>{
            this.message=error
            this.showMessage=true
        })
      },
      closeImg () {
        document.querySelector(".overlay").style.display = "none"
      },
      //图片放大
      enlarge(item){
        document.querySelector(".overlay").style.display = "block"
        this.imageValue = item
        this.imgStyle = "position: absolute; width: 100vw; height:83vh;z-index:10"
      },
      open () {
        this.dialog = true
      },
      close () {
        this.dialog = false
      },
      ok () {
          delbBill.bind(this)({
          ids: [this.$route.query.id]
          }, (data) => {
          if (data.resultCode != "100") {
            this.message = data.errorMessage
            this.showSnackbar();
            return false;
          }
          this.$router.push({name:'car-bill'})
          }, (error) => {
          this.message = error
          this.showSnackbar();
          return false;
        })
        this.dialog = false
      },
      showSnackbar() {
        this.snackbar = true
        if (this.snackTimer) clearTimeout(this.snackTimer)
        this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000)
      },
      hideSnackbar() {
        this.snackbar = false
        if (this.snackTimer) clearTimeout(this.snackTimer)
      },
    }
  }
</script>

<style lang="scss">
  @import "../../scss/common-styles.scss";
  @import "../../scss/variables.scss";
  .mu-dialog-body {
    text-align: center
  }  
  .mu-dialog-footer{
    justify-content:space-around;
  } 
  #bill-detail{  
  overflow: auto;
    .content{
      padding:20px;
      min-height:65%
    } 
    .flex-demo{
      margin-top: 10px
    }
    .font-color{
      color:red
    }
    .overlay{
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      vertical-align: top;
      white-space: normal;
      top: 70px;
      z-index: 1000;
    }          
}
</style>

