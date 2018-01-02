<template>
  <!--定制的一个输入框组件-->
  <!--满足特殊的样式需求-->
  <div id="text_filed">
    <!--<mu-text-field v-model="value" :type="type" :maxLength="20" :hintText="placeholder"/>-->
    <icarInput v-model="value" :type="type" :maxLength="maxLength" :placeholder="placeholder" :showNumber="showNumber"></icarInput>
  </div>
</template>

<script>
  import icarInput from 'components/icarInput.vue'
  export default {
    name: 'text_filed',
    data () {
      return {
        value: this.model
      }
    },
    components: {
      icarInput
    },
    props: {
      placeholder: {
        type: String
      },
      model: {
        type: String
      },
      maxLength: {
        type: Number
      },
      type: {
        type: String
      },
      showNumber: {
        type: Boolean
      }
    },
    watch: {
      value (val) {
        this.$emit('input', val)
      },
      model (val) {
        this.value = val
      }
    }
  }
</script>

<style>
  #text_filed {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: #fff;
  }

  #text_filed input {
    border: none !important;
    /*width: 98%;*/
  }

  #text_filed .mu-text-field{
    width: 100%;
  }

  #text_filed .mu-text-field-content{
    padding-bottom: 0;
    padding-top: 0;
  }

  #text_filed .mu-text-field{
    min-height: 25px;
    margin-bottom: 0px;
  }
</style>