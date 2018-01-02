<template>
  <section id="driving-record-list">
    <div class="record-date">
      <span>{{ recordDate }}</span>
    </div>
    <div class="record-item" v-for="recordContent in recordContents" @click="handleClick(recordContent)">
      <div class="thumbnail">
        <img class="thumbnail-img" :src="recordContent.picture" v-if="recordContent.type == 0" />
        <img class="thumbnail-img" :src="recordContent.cover" v-if="recordContent.type == 1" />
          <img class="video-play" src="../assets/driving_record_icon_video_play.png" v-if="recordContent.type == 1" />
      </div>
      <div class="record-time">
        <span>{{ recordContent.beginTime | getTime}}</span>
      </div>
      <div class="record-address">
        <span>{{ recordContent.beginAddress }}</span>
      </div>
    </div>
  </section>
</template>
<script>
  // import MuIcon from 'muse-components/icon'
  // import {list as MuList,listItem as MuListItem} from 'muse-components/list'
  // import MuAvatar from 'muse-components/avatar'
  export default {
    components:{
      // MuList,
      // MuListItem,
      // MuAvatar,
      // MuIcon
    },
    props:{
      recordDate: {
        required: true,
        type: String
      },
      recordContents: {
        required: true,
        type: Array
      }
    },
    data(){
      return {
      }
    },
    filters: {
      getTime: function (value) {
        return value.substring(11,19)
      }
    },
    created(){
    },
    watch:{
    },
    methods:{
      handleClick (e) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/variables.scss";
  #driving-record-list {
    width: 100%;
  }
  #driving-record-list .record-date {
    margin: 12px 0px -5px 12px;
  }
  #driving-record-list .record-item {
    width: 100%;
    height: 85px;
    position: relative;
  }
  #driving-record-list .thumbnail {
    position: absolute;
  }
  #driving-record-list .thumbnail-img{
    width: 100px;
    height: 75px;
    margin-top: 10px;
    margin-left: 10px;
  }
  #driving-record-list .record-time {
    position: absolute;
    left: 120px;
    top: 25px;
    font-size: 13px;
  }
  #driving-record-list .record-address {
    position: absolute;
    left: 120px;
    top: 45px;
    font-size: 13px;
  }
  #driving-record-list .video-play{
    position: absolute;
    width: 50px;
    height: 50px;
    top: 20px;
    bottom: 0px;
    left: 10px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
