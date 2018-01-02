<template>
	<transition name="cascaded-menu">
	<section class="cascaded-menu" v-if="lists.length">
		<transition-group tag="section" name="cascaded-menu">
        <section class="menu" v-for="list,listIndex in lists" v-show="list" :key="listIndex">
        	<mu-appbar v-if="listTitles && listTitles.length" :title="listTitles[listIndex]">
	        	<!-- <mu-icon-button icon="navigate_before" slot="left" @click="menuClose(listIndex,list)"> -->
					<i aria-hidden="true"  slot="left" @click="menuClose(listIndex,list)" class="mu-icon material-icons navigate_before" style="font-size: 24px; width: 48px; height: 48px;line-height:48px;text-align:center;">navigate_before</i>
				<!-- </mu-icon-button>	 -->
        	</mu-appbar>

			<!-- <content-with-loading :loaded="!!list.length"> -->

			    <mu-list>
			    	<template v-for="item,itemIndex in list">
			    	<mu-sub-header v-if="item.type==='subHeader'">{{item.text}}</mu-sub-header>
					<mu-list-item v-else :title="item.text" @click="menuActive(listIndex,itemIndex,list,item)">
						<mu-avatar class="car-logo-icon" v-if="item.img" :style="'background:url('+item.img+') center no-repeat,url('+defaultIcon+') center no-repeat;'" slot="leftAvatar"/>
					    <mu-icon value="keyboard_arrow_right" slot="right"/>
					</mu-list-item>  
	          		<mu-divider/>		    		
			    	</template>
			    </mu-list>
			<!-- </content-with-loading> -->
		</section>
		</transition-group>
	</section>
	</transition>
</template>
<script>
	// import MuAvatar from 'muse-components/avatar'
	// import MuIconButton from 'muse-components/iconButton'
	// import MuAppbar from 'muse-components/appbar'
	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
	// import MuIcon from 'muse-components/icon'
	// import MuDivider from 'muse-components/divider'
	// import MuSubHeader from 'muse-components/subHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	import defaultIcon from 'assets/favicon.png'
	export default {
		components:{
			// MuList,
			// MuListItem,
			// MuIcon,
			// MuAppbar,
			// MuIconButton,
			// MuDivider,
			// ContentWithLoading,
			// MuSubHeader,
			// MuAvatar
		},
		data(){
			return {
				defaultIcon:defaultIcon
			}
		},
		props:{
			lists:{
				type:Array,
				required:true
			},
			listTitles:{
				type:Array,
				required:false
			}
		},
		methods:{
			menuActive(listIndex,itemIndex,list,item){
				this.$emit('menu-active',listIndex,itemIndex,list,item)
			},
			menuClose(listIndex,list){
				console.log('close menu')
				this.$emit('menu-close',listIndex,list)
			}
		}
	}
</script>

<style lang="scss">
@import "../scss/variables.scss";
	.cascaded-menu{
		position:fixed;
		width:100%;
		height:100%;
		overflow:hidden;
		left:0;
		top:0;
		z-index:10;
		box-shadow:$pageShadow;
		.car-logo-icon{
			background-size:cover!important;
		}
		>section{
			height:100%;
			position:relative;
			.menu{
				position:absolute;
				width:100%;
				height:100%;
				background-color:#fff;
				box-shadow:$pageShadow;
				.mu-appbar{
					// position:relative;
					// z-index:1;
				}
				.mu-appbar-title{
					text-align:center;
					text-indent:-48px;
				}
				.content-with-loading{
					margin-top:-45px;
					padding-top:45px;					
					height:100%;
				}
				.content-with-loading .content-wrapper{
					height:100%;
					>.mu-list{
						height:100%;
						overflow-y:auto;
						-webkit-overflow-scrolling:touch;	
					}
				}
				.mu-sub-header{
					padding:0 $spaceSmall;
				}
			}
		}
	}
	.cascaded-menu-enter,
	.cascaded-menu-leave,
	.cascaded-menu-enter-active,
	.cascaded-menu-leave-active{
		transition:transform 0.5s ease;
	}
	.cascaded-menu-enter-active{
		transform:translate3d(0,0,0);		
	}
	.cascaded-menu-enter{
		transform:translate3d(100%,0,0);
	}
	.cascaded-menu-leave{
		transform:translate3d(0,0,0);
	}
	.cascaded-menu-leave-active{
		transform:translate3d(100%,0,0);
	}
</style>