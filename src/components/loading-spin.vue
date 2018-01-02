<template>
	<section :class="['loading-spin',fixed ? 'fixed' : '']">
		<section class="spin-wrapper">
	 		<mu-circular-progress v-if="!loaded" :size="40"/>	
	 		<p><slot></slot></p>		
		</section>
		<!-- <mu-icon value="filter_tilt_shift" :size="48"/> -->
	</section>
</template>

<script>
	// import MuIcon from 'muse-components/icon'
	// import MuCircularProgress from 'muse-components/circularProgress'
	export default{
		components:{
			// MuCircularProgress
			// MuIcon
		},
		props:{
			fixed:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				loaded:false
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
	.loading-spin{
		position:absolute;
		width:100%;
		height:100%;
		left:0;
		top:0;
		z-index:9;
		background-color:rgba(255,255,255,0.9);
		&.fixed{
			position:fixed;
		}
		.spin-wrapper{
			position:absolute;
			width:48px;
			height:48px;
			left:0;
			right:0;
			top:0;
			bottom:0;
			margin:auto;
			color:$colorSecondary;
			.mu-circle-spinner{
				border-color:$colorSecondary;			
			}
			p{
				margin-top:$spaceSmall;
				width:200px;
				margin-left:-80px;
				text-align:center;
				white-space:nowrap;
			}
			// .mu-icon{
			// 	display:block;
			// 	@include animationRotate;
			// }
		}
	}
</style>