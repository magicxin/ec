<template>
  <section id="maintain-record" class="background-light">  
    <router-link :to="{ name: 'create-bill'}"><div class="staticIcon"></div></router-link>
    <!-- <appbar  :link="{name:'car-map',query:{id:this.$route.query.id}}"/> -->
    <magic-header titleName="维保记录"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->
        <template>
          <div class="dataBg">
            <div><img :src="carData.brandLogo" width="60px">
            {{carData.plateNumber}}</div>
          </div>   
          <div style="padding:0px 10px 10px 10px">   
            <div style="border:1px solid #dedede;background:#f7f7f7;display:inline-block;width:100%">
              <div style="float:left;padding:10px 0px 10px 50px">
                <span>当前里程(元)</span><span style="display:block;text-align:center;color:#f98700">{{carMaintain.drivingRange}}</span>
              </div>
              <div  style="float:right;padding:10px 50px 10px 0px">
                <span>下次保养里程(km)</span><span style="display:block;text-align:center;color:#f98700">{{carMaintain.nextDrivingRange}}</span>
              </div>
            </div>
          </div> 
          <div id="table">
            <div class="tabBg">
              费用明细
            </div>
            <div v-for="detailBill in this.detailBill.carCosts">
              <router-link :to="{ name: 'bill-detail',query: {id:detailBill.id}}">
                <mu-list-item :title="detailBill.frontExpenseName" :afterText="detailBill.cost" :describeText="detailBill.happenDate">
                    <span v-if="detailBill.verifyState==0&&detailBill.needVerify==1" slot="right"  class="one" v-else style="color:#fff">  
                      {{({'0':'未审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}             
                    </span>
                    <span v-if="detailBill.verifyState==0&&detailBill.needVerify==0" slot="right"  class="one" style="color:#fff">  
                      {{({'0':'未审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}             
                    </span>
                    <span  v-if="detailBill.verifyState==1&&detailBill.needVerify==1" slot="right"  class="two" >  
                      {{({'0':'未审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}             
                    </span>
                    <span  v-if="detailBill.verifyState==2&&detailBill.needVerify==1" slot="right" class="three">  
                      {{({'0':'未审核','1':'审核通过','2':'审核不通过'})[detailBill.verifyState]}}             
                    </span>
                    <mu-icon value="keyboard_arrow_right" slot="right"/>
                </mu-list-item>
                <mu-divider/>
              </router-link>
            </div>
         </div>         
        <div>
          <mu-snackbar class="center" v-if="snackbar" message="不能大于当前日期" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
        </div>           
		    </template>
      <!-- </content-with-loading> -->
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  // import {flexbox as MuFlexbox,flexboxItem as MuFlexboxItem} from 'muse-components/flexbox'
  // import MuIcon from 'muse-components/icon'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuDatePicker from 'muse-components/datePicker'
  // import dateFilters from 'filters/dateFilters.js'
  // import MuDivider from 'muse-components/divider'
  import Chart from 'chart.js'
  import maintainRecord from 'services/maintain-record'
  import billDetail from 'services/bill-detail'
  export default {
    components: {
      magicHeader,
      // ContentWithLoading,
      // MuFlexbox,
      // MuFlexboxItem,
      // MuSnackbar,
      // MuDatePicker,
      // MuList,
      // MuIcon,
      // MuListItem,
      // MuDivider,
      Chart
    },
    data() {
      return {
        loaded:true,
        snackbar: false,
        nextDrivingRange:'',
        carData:[],  
        carMaintain:[], 
        detailBill:[]
      }
    },
    created(){
      this.initData() 
    },
    methods:{     
      initData(){               
        maintainRecord.bind(this)({
          type:'1',
        },(data)=>{
            console.log(data)
            this.carData = data.car
            this.carMaintain = data.carMaintain
            this.nextDrivingRange = data.carMaintain.drivingRange+data.carMaintain.drivingRangeGap
          },(error)=>{
            this.message=error
            this.showMessage=true
        })
        billDetail.bind(this)({
          carId:'251',
          type:this.dtype,
          beginTime:this.beginDate,
          endTime:this.endDate
        },(data)=>{           
            this.detailBill = data
          },(error)=>{
            this.message=error
            this.showMessage=true
        })
      },
      dateChange(value){        
      },
      costCategrey(type){
        billDetail.bind(this)({
          carId:'251',
          type:this.dtype,
          carCostType:type,
          beginTime:this.beginDate,
          endTime:this.endDate
        },(data)=>{           
            this.detailBill = data
          },(error)=>{
            this.message=error
            this.showMessage=true
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
    }
  }
</script>

<style lang="scss">
  @import "../../scss/common-styles.scss";
  @import "../../scss/variables.scss";
  // .bg{
  //  background-color:#efeff4!important;
  // }
  #maintain-record{
	.left-font{
		padding:10px 0px 0px 10px;
		text-align:left
	}
	.center-font{
		text-align:center;
		font-size:2em
	}
	.right-font{
		padding:0px 10px 10px 0px;
		text-align:right
	}
  .mu-text-field-line{
    display:none
  }
  .mu-text-field-input{
    font-size: 14px
  }
  .data-border{
    border-left:1px solid #ededed;
    border-right:1px solid #ededed;
  } 
  .arrow-left {
    width:20; 
    height:0; 
    border-top:10px solid transparent;
    border-bottom:10px solid transparent; 
    border-right:10px solid #888888; 
    float:left;
    margin:10px 10px 0px 0px
  }
  .arrow-right {
    width:20; 
    height:0; 
    border-top:10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #888888;
    float:right;
    margin-top:-32px
  } 
  .mu-item-text,.mu-item-after{
    color:#000
  }
  .mu-item-right{
    width:100px
  }
  .dataBg{
    width:100%;
    height:80px;
    line-height: 80px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    img{
      vertical-align: middle;
      text-align: center;
    }
  }
  .tabBg{
    background:#f7f7f7;
    height:32px;
    line-height: 32px;
    text-align: center;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9
  }
  .add_icon{
    background:url(../../assets/icon_add.png);
    margin: 20px;
    width:40px;
    height:40px;
    background-size: 3em;
    float:right
  }
  .staticIcon{
    background:url(../../assets/icon_+_pressed.png) no-repeat;
    background-size: 1.5em;
    width: 21px;
    height: 21px;
    position: absolute;
    right: 10px;
    top:10px;
    z-index: 100;
  }
  .listIcon{
    background:url(../../assets/icon_list_car.png) no-repeat;
    background-size: 4em;
    width: 45px;
    height: 45px;
    position: absolute;
    right: 10px;
    z-index: 100;
  }
  .one{
    margin:20px 8px 0px 0px;color:#f98700
  }
  .two{
    margin:20px 8px 0px 0px;color:#90c67b
  }
  .tree{
    margin:20px 8px 0px 0px;color:#f85351
  }          
}
</style>

