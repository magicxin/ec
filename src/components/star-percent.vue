<template>
	<section class="star-percent">
		<section class="star-wrapper" v-for="star in stars">
			<span v-if="star.width==100"><i class="mu-icon material-icons star-back">star</i></span>
			<span v-if="star.width==50"><i class="mu-icon material-icons star-back">star_half</i></span>
			<span v-if="!star.width"><i class="mu-icon material-icons star-cover">star_outline</i></span>
		</section>
	</section>
</template>

<script>
	export default {
		props:{
			percent:{
				default:100
			},
			starCount:{
				default:5
			}
		},
		computed:{
			stars(){
				let coverPercent=100/this.starCount,
					coverStarCount=Math.floor(this.percent/coverPercent),
					leftPercent=this.percent%coverPercent,
					stars=[],i=0,leftPercentFilled=false
				while(i<this.starCount){
					if(i<coverStarCount){
						stars.push({width:100})
					}else{
						if(leftPercentFilled){
							stars.push({width:0})
						}else{
							leftPercent ? stars.push({width:50}) : stars.push({width:0})
							leftPercentFilled=true							
						}
					}
					i++
				}
				console.log(stars)
				return stars
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
	.star-percent{
		color:$colorSecondary;
		display:inline-block;
		.star-wrapper{
			display:inline-block;
			vertical-align:top;
			width:2.5rem;
			height:2.5rem;
			position:relative;
			span{
				position:absolute;
				display:block;
				width:2rem;
				height:2rem;
				font-size:2rem;
				left:0;
				right:0;
				top:0;
				bottom:0;
				margin:auto;
				overflow:hidden;
				i{
					display:block;
					text-align:center;
					width:100%;
					height:100%;
					font-size:2rem;
					line-height:2rem;
				}
			}
		}
	}
</style>