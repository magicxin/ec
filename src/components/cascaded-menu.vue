<template>
	<section class="cascaded-menu" v-if="options && options.length">
		<template v-for="option,index in options">
		    <mu-flat-button :ref="'cascaded-menu_'+index" :label="option.label" @click="option.open=true"/>
            <mu-popover v-if="domReady" :trigger="$refs['cascaded-menu_'+index][0].$el" :open="option.open" @close="option.open=false">
                <mu-menu :value="selected[index]">
                  <mu-menu-item v-for="subOption in option.options" :key="subOption" :value="subOption.value" :title="subOption.label" @click="option.open=false;menuChange(index,subOption.value)"/>
                </mu-menu>
            </mu-popover>
		</template>
	</section>
</template>

<script>
	export default {
		props:{
			options:{
				default:[]
			},
			selected:{
				default:[]
			}
		},
		data(){
			return {
				domReady:false
			}
		},
		watch:{
			options:{
				immediate:true,
				handler:function(newVal,oldVaL){
					this.domReady=false
					this.$nextTick(()=>{
						this.domReady=true
					})
				}
			}
		},
		methods:{
			menuChange(index,selectedValue){
				this.selected.splice(index,1,selectedValue)
				this.options.forEach((option,optionIndex)=>{
					if(optionIndex>index){
						this.options.splice(optionIndex,1,{})
						// option.options=[]
						this.selected.splice(optionIndex,1,'')
					}
				})
				this.$emit('selected-change',this.selected,index)
			}
		}
	}
</script>

<style lang="scss">
	    .cascaded-menu{
            display:flex;
            .mu-flat-button{
                min-width:auto;
                width:50px;
                padding:0;
                height:50px;
                line-height:50px;
                .mu-flat-button-label{
                    padding:0;
                }
            }
        }
</style>
