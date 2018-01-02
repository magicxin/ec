<template>
	<section id="car-add" class="bg">
    <!-- <appbar :link="{name:'car-list'}"/>  -->
    <magic-header titleName="编辑车辆"></magic-header>
      <mu-list class="listBg">
	    <mu-list-item title="吉ARD266" describeText="宝马5系 2004款 520i">
	      <mu-avatar :src="avatar1" slot="leftAvatar"/>
	      <mu-icon value="keyboard_arrow_right" slot="right"/>
	    </mu-list-item>
	  </mu-list>
	  <mu-divider class="headDivider"/>
	  <mu-list class="listBg">
	    <mu-list-item title="绑定设备" afterText="已绑定">
	      <mu-icon value="keyboard_arrow_right" slot="right"/>
	    </mu-list-item>
	    <mu-divider/>
    </mu-list>  
    <mu-list class="listBg" id="listHeader">  
	    <mu-list-item title="保养信息" afterText="完整度30%">
	      <mu-icon value="keyboard_arrow_right" slot="right"/>
	    </mu-list-item>
	    <mu-divider/>
	    <mu-list-item title="保险信息" afterText="完整度30%">
	      <mu-icon value="keyboard_arrow_right" slot="right"/>
	    </mu-list-item>
	    <mu-divider/>
	    <mu-list-item title="年检信息" afterText="完整度30%">
	      <mu-icon value="keyboard_arrow_right" slot="right"/>
	    </mu-list-item>
  	</mu-list> 		
  	<mu-list>
  		<mu-list-item afterText="完善以上信息可以获得更多增值服务">
	    </mu-list-item>
  	</mu-list>
    <div class="delete">
      <mu-checkbox label="设为默认车辆" v-model="single" labelRight>
      </mu-checkbox>
    </div>
    <mu-raised-button label="删除车辆" class="delete" @click="submit" secondary fullWidth/>
  </section>
</template>
<script>
  // import MuSnackbar from 'muse-components/snackbar'
  // // import MuAppbar from 'muse-components/appbar'
  // import MuFlatButton from 'muse-components/flatButton'
  // import MuPopup from 'muse-components/popup'
  // import MuRaisedButton from 'muse-components/raisedButton'
  // import MuTextField from 'muse-components/textField'
  // import MuPicker from 'muse-components/picker'
  // import MuAvatar from 'muse-components/avatar'
  // import MuDivider from 'muse-components/divider'
  // import MuSubHeader from 'muse-components/subHeader'
  // import MuIcon from 'muse-components/icon'
  // import MuCheckbox from 'muse-components/checkbox'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import Appbar from 'components/appbar'
  import magicHeader from 'components/magicHeader'
  // import ContentWithLoading from 'components/content-with-loading'
  import queryAddress from 'services/peccancy-query-cities'
  import avatar1 from 'assets/avatar1.jpg'
  import avatar2 from 'assets/avatar2.jpg'
  import avatar3 from 'assets/avatar3.jpg'
  import avatar4 from 'assets/avatar4.jpg'
  import avatar5 from 'assets/avatar5.jpg'
  import favicon from 'assets/favicon.png'
  export default {
    components: {
      magicHeader,
      // Appbar,
      // ContentWithLoading,
      // MuList,
      // MuListItem,
      // MuSnackbar,
      // MuAppbar,
      // MuFlatButton,
      // MuPopup,
      // MuRaisedButton,
      // MuTextField,
      // MuPicker,
      // MuList,
      // MuAvatar,
      // MuDivider,
      // MuIcon,
      // MuCheckbox,
      avatar1,
      avatar2,
      avatar3,
      avatar4,
      avatar5,
      favicon,
      // MuSubHeader
    },
    data() {
      return {
        loaded:false,
        single: false,
        avatar1,
      	avatar2,
      	avatar3,
      	avatar4,
      	avatar5,
      	favicon
      }
    },
    computed:{
    },
    created(){
    },
    methods: {
    	submit(){
	    }
    }
  }
</script>

<style lang="scss">
  @import "../../scss/variables.scss";
  #car-add{
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
  	background:#fff
  }
  #listHeader .mu-item-after{
  	color:#f98700
  }
  .headDivider{
  	height:10px
  }
  .delete{
    display:block;
    max-width:95%;
    margin:0 auto;
    margin-top:1rem;
  &.mu-raised-button-secondary{
     background-color:#c60007;
   }
  }

  }
</style>

