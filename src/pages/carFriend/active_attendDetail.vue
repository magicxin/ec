<style>
  #active_attendDetail .mu-list {
    background-color: #fff;
    padding: 0px;
  }
  #active_attendDetail .mu-list-item {
      padding-left: 68px;
  }
</style>
<template>
  <div id="active_attendDetail">
    <my-header main-text="报名详情" bg-color="#F7F7F7" text-color="#000">
        <img :src="left" alt="" v-tap="{methods: goBack}">
      </my-header>
    <mu-list v-for="(item,index) in attendList" :key="index">
      <mu-list-item :title="item.name" disabled>
        <mu-avatar slot="left" :src="item.memberHead ? addPath(item.memberHead) : defaultImg" />
      </mu-list-item>
      <mu-divider></mu-divider>
    </mu-list>
  </div>
</template>

<script>
	import Vue from 'vue'
  import myHeader from 'components/my-header'
  import left from 'assets/left-gray.svg'

  import defaultImg from 'assets/default_user_icon.png'


  export default {
    data () {
      return {
        left,
        defaultImg,
        attendList: []
      }
    },

    methods: {
      goBack () {
        this.$router.push({
          name: 'active_detail'
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.prototype.$.get({
        methodName: 'QueryFleetActivity',
        activityId: to.params.activeId
      }).then(resp => {
        if (resp.data.resultCode === '100') {
          next(vm => {
            vm.attendList = resp.data.fleetActivityAttendDatas
          })
        }
      })
    },
    components: {
      myHeader
    }
  }
</script>
