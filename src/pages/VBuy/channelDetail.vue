<template>
  <div id="chanelDetail" style="height:100%;">
    <icar-header main-text="爱车频道" textColor="#474747" bgColor="#F7F7F7">
      <img :src="left" alt="">
      <img :src="share" slot="right" v-tap="{methods: shareTo}" class="share">
    </icar-header>
    <iframe :src="url" frameborder="0" width="100%" :height="height"></iframe>
  </div>
</template>

<script>
import icarHeader from "components/my-header";
import left from "assets/left-gray.svg";
import share from "assets/share1.svg";

export default {
  name: "channelDetail",
  data() {
    return {
      left,
      url: "",
      share,
      height: window.screen.height + "px",
      queryData: {}
    };
  },
  methods: {
    shareTo() {
      this.$.push(
        "route_share",
        {
          shareTitle: this.queryData.name,
          shareType: "1",
          shareId: this.queryData.id,
          shareThumImage: this.queryData.image,
          shareContent: this.queryData.desc
        },
        () => {
          console.log("分享成功");
        }
      );
    }
  },
  components: {
    icarHeader
  },
  beforeRouteEnter: (to, from, next) => {
    let channel = JSON.parse(to.query.channel);
    let url = channel.url;
    next(vm => {
      vm.url = url;
      vm.queryData = channel;
    });
  }
};
</script>

<style>
#chanelDetail .share {
  position: relative;
  top: -2px;
}

#chanelDetail iframe {
  height: 100%;
  padding-top: 50px;
  position: fixed;
  bottom: 0px;
}
</style>
