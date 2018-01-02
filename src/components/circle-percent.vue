<template>
	<section class="circle-percent">
		<section class="left-circle">
			<section class="circle"></section>
			<section class="cover" :style="{transform:'rotate('+angle.left+'deg) translateZ(0)'}"></section>
		</section>
		<section class="right-circle">
			<section class="circle"></section>
			<section class="cover" :style="{transform:'rotate('+angle.right+'deg) translateZ(0)'}"></section>
		</section>
		<section class="center-circle">
			<slot></slot>
		</section>
	</section>
</template>

<script>
	export default {
		props:{
			percent:{
				default:100
			}
		},
		computed:{
			angle(){
				let angle={left:180,right:180}
				if(this.percent>50){
					angle.right=180
					angle.left=180/50*(this.percent-50)
				}else{
					angle.right=180/50*this.percent
					angle.left=0
				}
				return angle
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
	.circle-percent{
		width:7rem;
		height:7rem;
		overflow:hidden;
		font-size:0;
		display:inline-block;
		position:relative;
		border-radius: 7rem;
	    border: solid 2px rgba(255,255,255,0.9);
		> section{
			display:inline-block;
			vertical-align:top;
			width:50%;
			height:100%;
			overflow:hidden;
			position:relative;
			&.center-circle{
				position:absolute;
				width:80%;
				height:80%;
				text-align:center;
				left:0;
				right:0;
				top:0;
				bottom:0;
				margin:auto;
				border-radius:7rem;
				background-color:#fff;
				z-index:2;
				font-size:1.6rem;
				line-height:5.5rem;
				font-weight:bold;
				color:rgb(153, 204, 0);
			}
			.cover,.circle{
				width:100%;
				height:100%;
				position:absolute;
				left:0;
				top:0;
				border-width:1.5rem;
				border-style:solid;
				border-color:rgb(153, 204, 0);
			}
			.cover{
				z-index:1;
				background-color:#fff;
				border-color:#548CD1;
				transition:transform 0.5s linear;
				transform-origin:0 50%;
			}
			&.left-circle .cover{
				transform-origin:100% 50%;
				transition-delay:0.5s;
			}
			// .circle{
			// 	background-color:rgb(153, 204, 0);
			// }
			&.left-circle > *{
				border-top-left-radius:7rem;
				border-bottom-left-radius:7rem;
				border-right:none;				
			}

			&.right-circle > *{
				border-top-right-radius:7rem;
				border-bottom-right-radius:7rem;
				border-left:none;
			}
		}

	}
</style>