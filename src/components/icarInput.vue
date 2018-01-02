<template>
  <div id="icarInput" layout="column" layoit-align="center center">
    <input :type="type" :placeholder="placeholder" flex 
      v-on:input="update($event.target.value)" class="input" 
      :value="inputVal" 
      :maxlength="maxLength ? maxLength : false" 
      :minlength="minLength">
    <div flex class="text-right" v-if="showNumber">
      <span :class="{error: overflow}" v-if="maxLength">{{charLength}}/{{maxLength}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        inputVal: this.value,
        overflow: false
      }
    },
    methods: {
      update (value) {
        let _cahce = value
        value = Array.from(value)
        if (this.maxLength && value && value.length > this.maxLength) {
          return
        }
        this.inputVal = _cahce
        this.$emit('input', _cahce.trim())
      }
    },
    computed: {
      charLength () {
        let stringArr = this.inputVal ? Array.from(this.inputVal) : ''
        // window.alert(stringArr.length)
        let _cacheLength = stringArr.length || 0
        this.overflow = _cacheLength > this.maxLength || _cacheLength < this.minLength
        return _cacheLength
      }
    },
    props: {
      type: {
        type: String,
        default () {
          return 'text'
        }
      },
      value: {},
      maxLength: {
        type: Number
      },
      placeholder: {
        type: String
      },
      minLength: {
        type: Number
      },
      showNumber: {
        type: Boolean,
        default () {
          return true
        }
      }
    }
  }
</script>

<style>
  #icarInput input {
    width: 100%;
    outline: none;
    border: 1px solid #ccc;
    /*display: block;*/
  }

  #icarInput .error {
    color: red;
  }

  #icarInput {
    position: relative;
  }

  /*#icarInput .text-right{
    position: absolute;
    right: 10px;
    bottom: -15px;
  }*/
</style>