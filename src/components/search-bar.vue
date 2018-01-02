<template>
	<section class="search-bar">
		<mu-text-field :value="value" :hintText="placeholder" :errorText="errorMessage" @input="change" @focus="focus"/>
		<mu-raised-button :label="searchButtonText" @click="searchActive" secondary/>
	</section>
</template>

<script> 
	// import MuTextField from 'muse-components/textField'
	// import MuRaisedButton from 'muse-components/raisedButton'
	export default {
		components:{
			// MuTextField,
			// MuRaisedButton
		},
		props:{
			placeholder:{
				default:'请输入关键字'
			},
			value:{

			},
			errorMessage:{

			},
			searchButtonText:{
				default:'搜索'
			}
		},
		data(){
			return {
				valueRaw:''
			}
		},
		methods:{
			focus(){
				this.$emit('focus')
			},
			change(value){
				this.valueRaw=value
				this.$emit('change',this.valueRaw)
			},
			searchActive(){
				this.$emit('search-active',this.valueRaw)
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
	.search-bar{
		display:flex;
		justify-content:space-between;
		margin-bottom:$spaceMedium;
		.mu-text-field{
			width:100%;
		}
		button{
			height:40px;
			line-height:40px;
		}
	}
</style>