<template>
  <cells id="isInput">
    <cell :link="false">
      <label slot="label">{{label}}</label>
      <input ref="input" :type="type" slot="value" 
        :placeholder="placeholder" v-bind:value="value" 
        v-on:input="updateValue($event.target.value)" 
        :maxlength="maxlength" id='is-input-filed'>
    </cell>
  </cells>

</template>

<script>
  import cells from 'components/cells'
  import cell from 'components/cell'
  let input
  /* eslint-disable */
  export default {
    name: 'isInput',
    components: {
      cells,
      cell
    },
    data () {
      return {
        oldValue: ''
      }
    },
    mounted () {
      input = document.querySelector('#is-input-filed')
    },
    methods: {
      updateValue (value) {
        if (this.type === 'tel') {
          // 只能输入数字
          let reg = /\D/g
          value = value.replace(reg, '')
        }
        if (this.recharge) {
          let reg = /^\d*(?:.\d{0,2})?$/
          if (!reg.test(value)) {
            console.log(input.value)
            input.value = this.oldValue
            return
          }
        }
        this.oldValue = value
        this.$emit('input', value.trim())
      }
    },
    props: {
      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      value: {
        type: [String, Number]
      },
      type: {
        type: String,
        default () {
          return 'text'
        }
      },
      maxlength: {
        type: Number
      },
      pattern: {
        type: String
      },
      recharge: Boolean
    }
  }
</script>

<style>
  #isInput input {
    border: none;
    outline: none;
    width: 100%;
    line-height: 34px;
    height: 34px;
    font-size: 1.2rem;
    background-size:100%;
    color: #999999;
  }

  #isInput label {
    font-size: 1.3rem;
    min-width: 4em;
    color: #767676;
    text-align: justify;
    text-align-last: justify;
  }

  #isInput .link {
    flex: 1 1 auto;
  }
</style>
