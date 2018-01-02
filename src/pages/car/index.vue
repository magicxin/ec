<template>
	<section id="index" @touchstart="handleTouchStart">
		index page
		<mu-raised-button label="立即查询" class="submit" @click="submit" secondary fullWidth/>			
	</section>
</template>

<script>
	// import MuRaisedButton from 'muse-components/raisedButton'
	// import hybridRouter from 'settings/hybrid-router'
	export default {
		components:{
	    	MuRaisedButton			
		},
		data(){
			return {
				start:''
			}
		},
		methods:{
			handleTouchStart(){
					// this.start=Date.now()
			},
			submit(){
				// document.write(Date.now()-this.start)
				this.$.push({name:'index'})
			}
		}
	}
</script>

