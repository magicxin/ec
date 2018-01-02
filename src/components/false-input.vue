<template>
	<section class="false-input">
		<mu-text-field :class="[focused ? 'focus-state' : '',!!value ? 'has-value' : '']" :label="label" :hintText="placeholder" :errorText="errorText" :value="value" @focus="focus($event)" labelFloat fullWidth/>		
	</section>
</template>

<script>
	// import MuTextField from 'muse-components/textField'
	export default {
		components:{
			// MuTextField
		},
		props:{
			focused:{
				default:false
			},
			label:{

			},
			placeholder:{

			},
			errorText:{

			},
			value:{

			}
		},
		methods:{
			focus(event){
				event.target.blur()
				this.$emit('focus')
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
.false-input{
	.mu-text-field.focus-state{
		 .mu-text-field-focus-line{
			transform:scaleX(1);		 	
		 }
		 .mu-text-field-hint{
		 	opacity:1;
		 }
		 .mu-text-field-label{
		 	color:$colorSecondary!important;
		 	transform:translate3d(0,0,0) scale(0.75);
		 }
		 &.has-value .mu-text-field-hint{
		 	opacity:0;
		 }
	}	
}
</style>