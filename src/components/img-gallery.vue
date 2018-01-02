<template>
	<section class="img-gallery" v-if="imgs && imgs.length">
		<ul>
			<li v-for="(img,index) in imgs" @click="showDetail(img,index)">
				<picture :style="'background-image:url('+img+')'"></picture>
			</li>
		</ul>
		<mu-popup position="bottom" :overlayOpacity="0.8" popupClass="img-gallery-popup-bottom" :open="showDetailImg" @close="showDetailImg=false">
			<picture ref="tap" :id="index" @touchstart="tap" @touchmove="tapMove" @touchend="tapEnd" @click="showDetailImg=false" :style="'background-image:url('+large[index]+')'"></picture>
  		</mu-popup>
	</section>
</template>

<script>
	export default {
		props:{
			imgs:{
				default:[]
			},
            large : {
                default:[]
            }
		},
		data(){
			return {
				selectedImg:'',
				showDetailImg:false,
                index : '',
                startX : '',
                endX : '',
                total : 0,
                frontOrNext : ''
			}
		},
		methods:{
			showDetail(img , index){
				this.selectedImg=img
				this.showDetailImg=true
                this.index = index
                this.total = this.large.length
			},
            tap(e){
                this.startX = e.targetTouches[0].screenX
//                console.log(e.targetTouches[0].screenX)
            },
            tapMove(e){
                if(e.targetTouches[0].screenX - this.startX < -100 ){
                    this.frontOrNext = 'front'
                   }
                if(e.targetTouches[0].screenX - this.startX > 100 ){
                        this.frontOrNext = 'next'
                   }
//                console.log(e.targetTouches[0].screenX)
            },
            tapEnd(e){
                if(this.frontOrNext == 'front' && +this.index < this.total-1){
                        this.index = +this.index + 1
                    console.log(this.index)
                   }
                if(this.frontOrNext == 'next' && +this.index > 0){
                        this.index = +this.index - 1
                   }
            }
		}
	}
</script>

<style lang="scss">
	.img-gallery{
		ul{
			display:flex;
			flex-wrap:wrap;
			li{
				width:25%;
				picture {
					border:solid 2px rgb(240,240,240);
					display:block;
					width:100%;
					padding-top:100%;
					background-color:rgb(240,240,240);
					background-position:center;
					background-size:cover;
					background-repeat:no-repeat;
				}
			}
		}
	}
	.img-gallery-popup-bottom{
		width:100%;
		height:100%;
		background:transparent;
		picture {
			display:block;
			width:100%;
			height:100%;
			background-position:center;
			background-size:contain;
			background-repeat:no-repeat;
		}
	}
</style>
