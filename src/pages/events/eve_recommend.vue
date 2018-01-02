<template>
  <!--推荐有礼-->
  <div id="eve_recommend">
    <!-- <my-header main-text="邀请好友" bg-color="#fff" text-color="#000">
      <img src="../../assets/left-gray.svg">
      <span slot="right" class="span_right" @click="goInvitation">
        我的邀请
      </span>
    </my-header> -->
    <magic-header :titleName="$route.query.title ? $route.query.title : '邀请好友'" returnNative="$route.params.native">
      <span slot="title-right" class="span_right" @click="goInvitation">
        我的邀请
      </span>
    </magic-header>
    <div class="body_height">
      <section class="banner">
        <img :src="initInfo.image ? addPath(initInfo.image) : defaultImg" alt="" height="100%">
      </section>
      <div class="rule">
        <h2 class="mid_f" style=" margin-bottom: 10px;">·奖品规则</h2>
        <div v-html="initInfo.rule"></div>
      </div>
      <div class="draw_btn">
          <mu-raised-button label="立即邀请" backgroundColor="#f98700" :fullWidth="isTrue" @click="invitation"/>
      </div>
    </div>
    <shopDetail :value="shop.mobile" :position="shop" :shopId="shop.id">
      <span slot="name">{{ shop.name }}</span>
      <span slot="address">{{ shop.address }}</span>
    </shopDetail>
  </div>
</template>
<script>
	import Vue from 'vue'
  import magicHeader from 'components/magicHeader'
  import defaultImg from 'assets/default_user_icon.png'


  import shopDetail from 'components/shop-detail'


  export default {
    data () {
      return {
        defaultImg,
        rule: '',
        isTrue: true,
        activityId: this.$route.params.activityId,
        initInfo: {},
        shop: {}
      }
    },
    methods: {
      invitation () {
      	if(this.$.userId){
      		let shareThumImage = this.initInfo.image || '/upload/image/default_user_icon.png'
            this.$.push('route_share', {
              shareTitle: '推荐有礼活动',
              shareContent: '这个app很有趣，快来注册下载吧~',
              shareThumImage: shareThumImage,
              shareType: '9',
              shareUrl: '/register/' + this.$.userId + '/' + this.activityId,
              needOAuth: '0',
              shareId: this.activityId
          })
      	}else{
      		 this.$.goLogin({
              shopId: this.$.shopId
          })
      	}
      },
      goInvitation () {
      	if(this.$.userId){
      		this.$router.push({name: 'eve_Invitation', params: {activityId: this.activityId}})
      	}else{
      		this.$.goLogin({
              shopId: this.shop.id
          })
      	}
      }
    },

    components: {
      magicHeader,
      shopDetail
    },
    beforeRouteEnter (to, from, next) {
      Promise.all([
        Vue.prototype.$.get({
          methodName: 'RecommondInitInfo',
          id: to.params.activityId
        })
      ])
      .then(result => next(vm => {
        vm.initInfo = result[0].data
        vm.shop = result[0].data.shop
        window.scroll(0, 0)
      }))
    }
  }
</script>
<style>
  #eve_recommend .span_right {
    position: fixed;
    width: 100px;
    right: -33px;
    font-size: 14px;
    color: #f98700;
  }
  #eve_recommend .banner {
    height: 150px;
    width: 100%;
    text-align: center;
    padding-top: 15px;
  }
  #eve_recommend .rule {
    margin-top: 15px;
    padding-left: 15px;
  }
  #eve_recommend .draw_btn {
    width: 88%;
    margin: auto;
    margin-top: 20px;
  }
  #eve_recommend .draw_btn button {
    font-size: 16px;
  }
  #eve_recommend .body_height {
    min-height: 550px;
  }
</style>
