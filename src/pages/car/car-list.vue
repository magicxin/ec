<template>
  <section id="car-list" class="background-light">
    <!-- <appbar :link="{name:'car-map'}"/> -->
      <magic-header titleName="车辆列表"></magic-header>
      <!-- <content-with-loading :loaded="loaded"> -->
       <mu-text-field class="filt-cars" hintText="输入车牌号搜索车辆" :value="filterKeyword" @change="setFilterKeyword" fullWidth/>

        <router-link class="submit" :to="{name:'car-add'}">
          <mu-raised-button label="添加车辆" secondary fullWidth/>          
        </router-link>  
        <mu-list class="listBg">
          <mu-sub-header v-if="!!filteredCars.length" class="background-light">我的车辆</mu-sub-header>
          <template v-for="car in filteredCars">
            <mu-list-item :title="car.brandCode" :afterText="car.state" @click="goToMap(car,!!car.terminals.length)">
              <mu-avatar :src="car.logo" slot="leftAvatar"/>
              <span class="bind-note" v-if="!car.terminals.length">未绑定</span>
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
            <mu-divider/>            
          </template>
          <mu-sub-header v-if="!!filteredFriendCars.length" class="background-light">好友车辆</mu-sub-header>
          <template v-for="friendCar in filteredFriendCars">
            <mu-list-item :title="friendCar.brandCode" :afterText="friendCar.state" @click="goToMap(friendCar,!!friendCar.terminals.length)">
              <mu-avatar :src="friendCar.logo" slot="leftAvatar"/>
              <span class="bind-note" v-if="!friendCar.terminals.length">未绑定</span>
              <mu-icon value="keyboard_arrow_right" slot="right"/>
            </mu-list-item>
            <mu-divider/>            
          </template>
      </mu-list>
    <!-- </content-with-loading> -->
     <mu-snackbar class="center" v-if="showError" :message="errorMessage" action="关闭" @actionClick="showError=false" @close="showError=false"/>
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuTextField from 'muse-components/textField'
  // import MuAvatar from 'muse-components/avatar'
  // import MuDivider from 'muse-components/divider'
  // import MuSubHeader from 'muse-components/subHeader'
  // import MuIcon from 'muse-components/icon'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'

  import bindedCarList from 'services/binded-car-list'

  export default {
    components: {
      magicHeader,
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuRaisedButton,
      // MuList,
      // MuAvatar,
      // MuDivider,
      // MuIcon,
      // MuSubHeader,
      // MuSnackbar,
      // MuTextField
    },
    data() {
      return {
        loaded:false,
        showError:false,
        errorMessage:'',
        cars:[],
        friendCars:[],
        filterKeyword:''
      }
    },
    computed:{
      filteredCars(){
        return this.filtCars(this.cars)
      },
      filteredFriendCars(){
        return this.filtCars(this.friendCars)
      }
    },
    created(){
      bindedCarList.bind(this)({},(data)=>{
        this.cars=data.cars
        this.friendCars=data.friendCars
        this.loaded=true
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    methods:{
      setFilterKeyword(value){
        this.filterKeyword=value
      },
      filtCars(carTargets){
        return carTargets.filter((car)=>{
          return car.brandCode.toLowerCase().search(this.filterKeyword.toLowerCase())!=-1
        })
      },
      goToMap(car,hasTerminal){
        if(hasTerminal){
          this.$router.push({name:'car-map',query:{id:car.id,hasTerminal:!!car.terminals.length}})          
        }else{
          this.$router.push({name:'car-add',query:{id:car.id}})
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  // .bg{
  //  background-color:#efeff4!important;
  // }
  #car-list{
    .mu-item.show-right{
      padding-right:32px;
    }
    .mu-item-right{
      right:0;
    }
    .bind-note{
      position: absolute;
      left: 16rem;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 1.5rem;
      font-size:12px;
      padding:0 0.5rem;
      color:#fff;
      background-color:rgba(0,0,0,0.2);
    }
    &.background-light{
      background-color:$backgroudLight;   
    }
    .mu-avatar{
      background:url(../../assets/favicon.png) center no-repeat;
      background-size:cover;
    }
  .input-wrapper{
    padding-top:$spaceMedium;
  .mu-text-field{
    padding:0 $spaceSmall;
  &.has-label .mu-text-field-label.float{
     color:$colorDark;
   }
  &.focus-state{
     color:$colorSecondary;
   }
  .mu-text-field-help{
    padding:0 $spaceSmall;
  }
  .mu-text-field-focus-line{
    background-color:$colorSecondary;
  }

  }
  .mu-text-field.false-input.focus-state .mu-text-field-focus-line{
    transform:scaleX(1);
  }
  } 
  .listBg{
    background:#ffffff;
  }
  .mu-list{
    padding:0;
  }
  .filt-cars{
    max-width:90%;
    margin:0 auto;
    display:block;
    .mu-text-field-hint{
      width:100%;
      left:0;
    }
    .mu-text-field-focus-line{
      transform:scaleX(1);
    }
    *{
      text-align:center;
    }
  }
  .mu-raised-button-full{
    margin:0 auto $spaceSmall;
  }
  .submit{
    display:block;
    max-width:100%!important;
    margin:0 auto;
    margin-top:$spaceSmall!important;
  &.mu-raised-button-secondary{
     background-color:$colorSecondary;
   }
  }

  }
</style>

