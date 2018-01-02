<template>
  <div>
    <ul layout layout-wrap id="evaluation-top">
      <li flex="nogrow" :class="{'dvalluation-top-item': true, 'item-active': item.active}" v-for="(item, index) in value" v-tap="{ methods: call, index: index, item:item }">
        {{ item.text + ' ' + item.num}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'evaluation-top',
    props: {
      value: {
        type: Array,
        default () {
          return [
          {text: '全部', num: '125', active: true, type: 0},
          {text: '好评', num: '89', active: false, type: 1},
          {text: '中评', num: '2', active: false, type: 2},
          {text: '差评', num: '0', active: false, type: 3},
          {text: '有图', num: '7', active: false, type: 4}
          ]
        }
      }
    },
    methods: {
      call (params) {
        this.value.forEach((value, key) => {
          value.active = false
          if (params.item.text === value.text) {
            value.active = true
            this.$emit('sumbit', value.type)
          }
        })
      }
    },
    mounted () {
      console.log(this.value)
    }
  }
</script>

<style>
  #evaluation-top {
    background-color: #fff;
    padding: 7px;
  }

  .dvalluation-top-item {
    background-color: #e6e6e6;
    color: #828282;
    padding: 4px 8px;
    margin: 4px 6px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 300;
    transition: background-color .2s linear,
      color .2s linear;
  }

  .item-active {
    background-color: #f98700;
    color: #fff;
  }
</style>
