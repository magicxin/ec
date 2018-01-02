<template>
  <div class="tab" @click="tabClick" :name="value" :class="{'active_tab': $parent.value === value}">
    {{title}}
  </div>
</template>

<script>
  export default {
    name: 'tab',
    props: {
      title: {
        type: String
      },
      value: {
        type: String
      }
    },
    data () {
      return {
        parent: 'tab1'
      }
    },
    methods: {
      tabClick (e) {
        if (this.$parent.handleTabClick) {
          this.$parent.handleTabClick(this.value, this)
        }
        this.$parent.active = this.value
        this.$emit('click', e)
      }
    }
  }
</script>

<style>
  .tab {
    display: inline-block;
    padding: 10px;
    position: relative;
    /*cursor: pointer;*/
  }

  .active_tab {
    color: #F98700;
  }
</style>