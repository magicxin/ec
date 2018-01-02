<template>
	<section id="terminal-data-flow-select">
		<!-- <appbar :link="{name:'car-test'}"/> -->
		<magic-header titleName="选择数据流监测项"></magic-header>
		<!-- <content-with-loading :loaded="loaded" :isDelay="isDelay"> -->
			<mu-text-field class="filter-keyword" v-model="filterKeyword" hintText="输入名称搜索当前分类下指标项"/>
			<section class="filter-classifies">
				<mu-flat-button :class="[filterClassify==classify ? 'selected' : '']" v-for="classify in filterClassifies" :key="classify" :label="classify.text" @click="selectFilterClassify(classify)"/>
			</section>
			<mu-list>
			    <mu-list-item v-for="item in filteredItems" :key="item" :title="item.text" @click="toggleSelectItem(item)">
			      <mu-icon class="item-selected" v-show="item.belongs.search('selected')!=-1" slot="right" value="remove_circle"/>
			      <mu-icon v-show="item.belongs.search('selected')==-1" slot="right" value="add_circle"/>
			    </mu-list-item>
			</mu-list>
			<section class="button-wrapper">
				<mu-raised-button class="select-reset" label="重置" @click="resetSelectItem" secondary/>
				<mu-raised-button class="select-confirm" label="开始监测" @click="confirmSelectItem" primary/>
			</section>
		<!-- </content-with-loading> -->
	<mu-snackbar class="center" v-if="!!message" :message="message" action="我知道了" @actionClick="message=''" @close="message=''"/>

	</section>
</template>

<script>
	// import Appbar from 'components/appbar'
	import magicHeader from 'components/magicHeader'
	// import ContentWithLoading from 'components/content-with-loading'
	// import MuTextField from 'muse-components/textField'
	// import MuFlatButton from 'muse-components/flatButton'
	// import MuIcon from 'muse-components/icon'
	// import MuDivider from 'muse-components/divider'
	// import MuRaisedButton from 'muse-components/raisedButton'
  	// import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  	// import MuSnackbar from 'muse-components/snackbar'

  	import dataFlowItems from 'services/terminal-data-flow-items'

	export default {
		components:{
			magicHeader,
			// Appbar,
			// ContentWithLoading,
			// MuTextField,
			// MuFlatButton,
			// MuIcon,
			// MuDivider,
			// MuRaisedButton,
			// MuList,
			// MuListItem,
			// MuSnackbar
		},
		data(){
			return {
				loaded:false,
				filterKeyword:'',
				// {}
				filterClassify:'',
				filterClassifies:[],
				filteredItems:[],
				items:[],
				message:'',
        isDelay : true
			}
		},
		computed:{
			filteredItems(){
				let items=[]
				this.items.forEach((item)=>{
					(!this.filterKeyword || item.text.search(this.filterKeyword)!=-1) && (!this.filterClassify || item.belongs.search(this.filterClassify.id)!=-1) && items.push(item)
				})
				return items
			},
			selectedItems(){
				let items=[]
				this.items.forEach((item)=>{
					item.belongs.search('selected')!=-1 && items.push(item)
				})
				return items
			}
		},
		created(){
			dataFlowItems({},(itemsAndClassifies)=>{
				console.log(itemsAndClassifies)
				this.filterClassifies=itemsAndClassifies.classifies
				this.items=itemsAndClassifies.items
				this.filterClassify=this.filterClassifies[0]
				this.loaded=true
			},(err)=>{
				this.message=err
			})
		},
		methods:{
			selectFilterClassify(classify){
				this.filterClassify=classify
			},
			toggleSelectItem(item){
				if(item.belongs.search('selected')==-1){
					if(this.selectedItems.length<6){
					 	item.belongs+=',selected'
					}else{
						this.message='最多可选择6项指标同时监测！'
					}
				}else{
					item.belongs=item.belongs.replace(',selected','')
				}
			},
			resetSelectItem(){
				this.items.forEach((item)=>{
					item.belongs=item.belongs.replace(',selected','')
				})
				this.filterKeyword=''
				this.filterClassify=this.filterClassifies[0]
			},
			confirmSelectItem(){
				if(!!this.selectedItems.length){
					this.$router.push({name:'terminal-data-flow-show',query:{items:JSON.stringify(this.selectedItems)}})
				}else{
					this.message='请选择需要监测的数据流指标'
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "../../scss/variables.scss";
	#terminal-data-flow-select{
		overflow:hidden;
		.content-with-loading{
			height:100%;
			margin-top:0;
			padding-top:45px;
			overflow:hidden;
		}
		.content-wrapper{
			height:100%;
			overflow:hidden;
			position:relative;
		}

		.filter-classifies,.filter-keyword{
			width:100%;
		}
		.mu-text-field{
			padding:0;
			margin-bottom:0;
			min-height:0;
		}
		.filter-keyword *{
			font-size:1.5rem;
			// text-align:center;
		}
		.mu-text-field-content{
			position:relative;
			padding:0;
		}
		.mu-text-field-input{
			height:40px;
		}
		.mu-text-field-hint{
			line-height:42px
		}
		.mu-text-field-hint,input{
			width:100%;
			padding:0 1rem;
			line-height:42px;
		}
		.item-selected{
			color:#da0000;
		}
		.mu-list{
			padding:0;
			height:100%;
			padding-bottom:127px;
			background:rgb(248,248,248);
			overflow:auto;
			-webkit-overflow-scrolling:touch;
			> *{
				background:rgb(248,248,248);
				border-bottom:solid 1px rgba(0,0,0,0.1);
			}
		}
		.filter-classifies{
			display:flex;
			justify-content:space-between;
			border-bottom:solid 1px rgba(0,0,0,0.1);
			overflow:auto;
			-webkit-overflow-scrolling:touch;
			.mu-flat-button{
				flex:1;
				border-right:solid 1px rgba(0,0,0,0.1);
				font-weight:bold;
				&:last-child{
					border-right:none;
				}
				&.selected{
					color:#fff;
					background:$colorSecondary;
				}
			}
		}
		.button-wrapper{
			position:absolute;
			width:100%;
			height:50px;
			left:0;
			bottom:0;
			z-index:1;
			background:#fff;
			border-top:solid 1px rgba(0,0,0,0.1);
			text-align:center;
			padding:0.5rem 1rem;
			button{
				width:49%;
			}
		}
	}
</style>
