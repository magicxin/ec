<template>
  <section id="eve_listAll">

  </section>
</template>
<script>
  /* eslint-disable */
  export default {
    data () {
      return {}
    },
    beforeRouteEnter(to, from, next){
       next(vm => {
      console.log(from)
      let str = from.name && from.name.substr(0, 3)
      // 判断是否从活动页面返回的，如果是就调用桥接的返回方法
      if (str === 'eve') {
           vm.$.back()
      } else {
          vm.go(to.params.type, to.params.id)
      }
       })
    },
    methods: {
      go (type, id, state) {
        switch (type) {
          case '0':
            this.$router.push({name: 'eve_robRedPacket', params: {activityId: id}})
            break
          case '1':
            this.$router.push({name: 'eve_shakes', params: {activityId: id}})
            break
          case '2':
            this.$.get({
              'methodName': 'LotteryInitInfo',
              'category': '2',
              'id': id
            }).then(res => {
              if (res.data.shape === '0') {
                this.$router.push({name: 'eve_luckyDraw_two', params: {activityId: id}})
              } else {
                this.$router.push({name: 'eve_luckyDraw', params: {activityId: id}})
              }
            })
            break
          case '3':
            this.$router.push({name: 'eve_groupShopping', params: {activityId: id}})
            break
          case '4':
            this.$router.push({name: 'eve_robBuy', params: {activityId: id}})
            break
          case '5':
            this.$router.push({name: 'eve_timeSpike', params: {activityId: id}})
            break
          case '6':
            this.$router.push({name: 'eve_helpBargain', params: {activityId: id}})
            break
          case '7':
            this.$router.push({name: 'eve_recommend', params: {activityId: id}})
            break
        }
      }
    }
  }
</script>
<style>

</style>
