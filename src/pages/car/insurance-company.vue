<template>
  <section id="car-list" class="background-light">
    <!-- <appbar :link="{name:'insurance-information'}"/> -->
    <magic-header titleName="保险公司"></magic-header>
    <!-- <content-with-loading :loaded="loaded">       -->
        <mu-list class="listBg">
          <template v-for="insurance in insurances">
            <mu-list-item :title="insurance.name" v-bind:value="insurance.name"  @click="selectItem(insurance.name)">
              <mu-avatar :src="insurance.logo" slot="leftAvatar"/>
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
  import insuranceCompanyList from 'services/insurance-company'

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
      // MuSnackbar
    },
    data() {
      return {
        loaded:false,
        showError:false,
        errorMessage:'',
        insurances:[]
      }
    },
    computed:{
    },
    created(){
      insuranceCompanyList.bind(this)({},(data)=>{
        this.insurances=data.insuranceDatas
        this.loaded=true
      },(errorMessage)=>{
        this.errorMessage=errorMessage
        this.showError=true
      })
    },
    methods: {
      selectItem(companyName){
        this.$router.push({name:'insurance-information',query:{
          companyName:companyName,
          id:this.$route.query.id
        }})
        this.loaded=true         
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
    &.background-light{
      background-color:$backgroudLight;   
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
  .submit{
    display:block;
    max-width:95%;
    margin:0 auto;
    margin-top:$spaceBig;
  &.mu-raised-button-secondary{
     background-color:$colorSecondary;
   }
  }

  }
</style>

