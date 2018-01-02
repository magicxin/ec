<template>
  <section id="create-bill" class="background-light">
    <magic-header titleName="添加账单"></magic-header>
        <template>
        <div class="content" id="content">           
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                用户名：
              </mu-flexbox-item>
              <mu-flexbox-item>
                {{userName}}
              </mu-flexbox-item>
            </mu-flexbox>              
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item> 
                车牌号：
              </mu-flexbox-item>
              <mu-flexbox-item>
                <mu-dropDown-menu :value="carValue" @change="carHandleChange">
                  <mu-menu-item  value="" title="请选择"/>
                  <mu-menu-item  v-for="car in this.cars" :key="car"  :value="car.id" :title="car.plateNumber"/>
                </mu-dropDown-menu> 
              </mu-flexbox-item>
            </mu-flexbox>  
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                车队：
              </mu-flexbox-item>
              <mu-flexbox-item>
                <mu-dropDown-menu :value="fleetValue" @change="fleetHandleChange">
                  <mu-menu-item value="" title="请选择"/>
                  <mu-menu-item v-for="fleet in this.fleets" :key="fleet" :value="fleet.id" :title="fleet.name"/>
                </mu-dropDown-menu> 
              </mu-flexbox-item>
            </mu-flexbox>  
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                日期：
              </mu-flexbox-item>
              <mu-flexbox-item>
                <mu-date-picker v-model="happenDate" :maxDate="maxDate" container="inline"/>
              </mu-flexbox-item>
            </mu-flexbox>   
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                费用类型：
              </mu-flexbox-item>
              <mu-flexbox-item>
                <mu-dropDown-menu :value="costValue" @change="costHandleChange">
                  <mu-menu-item value="0" title="油费"/>
                  <mu-menu-item value="1" title="电费"/>
                  <mu-menu-item value="2" title="整车费"/>
                  <mu-menu-item value="3" title="车品费"/>
                  <mu-menu-item value="4" title="保险费"/>
                  <mu-menu-item value="5" title="保养费"/>
                  <mu-menu-item value="6" title="维修费"/>
                  <mu-menu-item value="7" title="救援费"/>
                  <mu-menu-item value="8" title="洗车费"/>
                  <mu-menu-item value="9" title="违章罚款费"/>
                  <mu-menu-item value="10" title="停车费"/>
                  <mu-menu-item value="11" title="路桥费"/>
                  <mu-menu-item value="12" title="年检费"/>
                  <mu-menu-item value="13" title="自定义费用"/>
                </mu-dropDown-menu> 
              </mu-flexbox-item>
            </mu-flexbox>   
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                费用金额：
              </mu-flexbox-item>
              <mu-flexbox-item>
                <mu-text-field v-model="cost"/>
              </mu-flexbox-item>
            </mu-flexbox>  
            <mu-flexbox  class="flex-demo">
              <mu-flexbox-item>
                上传凭证：                
              </mu-flexbox-item>  
              <mu-flexbox-item>  
                <div class="add_icon" @click="addIcon"></div>
              </mu-flexbox-item>
            </mu-flexbox> 
            <magic-image :bigImage="image" :smallImage="image"></magic-image>
          </div>
          <mu-raised-button label="确定"  @click="submit" secondary fullWidth/>
          <mu-snackbar class="center" v-if="snackbar" :message="message"/>
        </template>        
  </section>
</template>
<script>
  import magicHeader from 'components/magicHeader'
  import Chart from 'chart.js'
  import carBill from 'services/car-bill'
  import createBill from 'services/create-bill'
  import queryUserInfo from 'services/query-user-info'
  import magicImage from 'components/image/ma_image'
  export default {
    components: {
      magicHeader,
      magicImage
    },
    data() {
      return {
        loaded:true,
        snackbar: false,
        message:'',
        costValue: '0',
        carValue:'',
        fleetValue:'',
        cost:'',
        happenDate:'',
        image:[],
        datas:[],
        cars:[],
        fleets:[],
        dataImages:[],
        carId:'',
        userName:'',
        maxDate:''
      }
    },
    created(){
      alert(localStorage.getItem('user'));
        this.initData();
        this.maxDate = this.getNowFormatDate()
    },
    methods:{
      initData(){
        //获取用户信息
        queryUserInfo.getUserInfo.bind(this)({
        },(data)=>{
          this.userName = data.userNickname
        },(error)=>{
        })
        createBill.getListCarByMember.bind(this)({
          },(data)=>{
            this.cars = data.cars
            console.log(this.cars);
          },(error)=>{
            this.message=error
            this.showMessage=true
        })                
      },
      addIcon(){
          this.$.push("router_takePhoto",{maxNum:10},resp => {
            this.$.loading(true)
            if(this.image.length == 0){
              this.image = []
            }
            this.datas = JSON.parse(resp)
             createBill.commonFileUpload.bind(this)({
              images:this.datas
              },(data)=>{
                alert(this.image.length);
                this.image = this.image.concat(data.urls)
                this.$.loading()
              },(error)=>{
                this.message=error
                this.showMessage=true
              })  
          })                       
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
      carHandleChange (value) {
        this.carValue = value
        createBill.listFleetByCar.bind(this)({
              carId:this.carValue
              },(data)=>{
                this.fleets = data.fleets
              },(error)=>{
                this.message=error
                this.showMessage=true               
            })
      },
      fleetHandleChange (value) {
        this.fleetValue = value
      },
      costHandleChange (value) {
        this.costValue = value
      },
      getNowFormatDate() {
          var date = new Date();
          var seperator1 = "-";
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
              month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          return currentdate;
      },
      submit(){
         createBill.createCarCost.bind(this)(
          {carCost:({
                car:({
                  id:this.carValue
                }),
                fleet:({
                  id:this.fleetValue
                }),
                happenDate:this.happenDate,
                type:this.costValue,
                cost:this.cost,
                images:this.image
                })},(res)=>{
                  alert(res);
                    this.showSnackbar();
                    this.$.toast('保存成功')
                    this.happenDate=""
                    this.cost=""
                    this.datas=[]
                    this.costValue="0"
                    this.carValue=""
                    this.fleetValue="" 
                    this.dataImages = []
                    this.$router.push({name:'car-bill',query:{
                     }})
                  },(errorMessage)=>{
                    this.message=errorMessage
                    this.showSnackbar();
            })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/common-styles.scss";
  @import "../../scss/variables.scss";
  #create-bill{  
    .content{
      padding:20px;
      overflow: auto
    } 
    .flex-demo{
      margin-top: 10px
    }
    .mu-dropDown-menu{
      width:100%
    }
    .mu-dropDown-menu-text{
      padding-left: 0px
    }
    .mu-dropDown-menu-line{
      margin:0px
    }
    .mu-flexbox .mu-flexbox-item:first-child{
      flex: 0.4 1 auto!important;
    }
    .mu-text-field{
      padding: 0px;
      width:100%
    }
    .mu-date-picker{
      width:100%
    }
    .add_icon{
      background:url(../../assets/icon_add.png);
      margin: 20px;
      width:36px;
      height:36px;
      background-size: 3em;
      float:left
    }
    .mu-raised-button-full{
      margin:0 auto
    }
    .content{
      overflow:auto
    }
    .mu-raised-button{
      margin-bottom: 15px
    }
}
</style>

