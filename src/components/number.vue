<template>
  <div id="number">

    <mu-raised-button class="button" :disabled="value <= 1" color="#F98700" v-tap="{methods: minus}" label="-"/>
    <div class="number-box">
      <form class="search" onsubmit="return false">
        <input type="number" v-model="currentValue" max="10" >
      </form>
    </div>
    <mu-raised-button class="button" color="#F98700" v-tap="{methods: add}" label="+"/>
  </div>
</template>
<script>



  export default {
    name: 'number',
    components: {
      
    },
    props: {
      number: {
        default () {
          return '1'
        }
      },
      stock: {
        type: String
      },
      activity: {
        type: Object
      }
    },
    data () {
      return {
        currentValue: this.number
      }
    },
    methods: {
      add () {
        if (!this.activity) {
          if (this.stock && Number(this.value) >= Number(this.stock)) {
            console.log(Number(this.value), Number(this.stock))
            this.$.toast('已超过最大购买数量')
            return
          }
          this.currentValue = Number(this.value) + 1
          this.$emit('input', Number(this.value))
        } else {
          if (this.activity.type === '4') {
            if (this.stock && Number(this.activity.total) <= (Number(this.value) + Number(this.activity.attendCount))) {
              this.$.toast('已超过最大购买数量')
              return
            }
            this.currentValue = Number(this.value) + 1
            this.$emit('input', Number(this.value))
          } else {
            this.$.toast('该商品只能购买一个')
          }
        }
      },
      minus () {
        if (this.value > 1) {
          this.currentValue = this.value - 1
          this.$emit('input', Number(this.value))
        }
      },
      test () {
        let value = this.currentValue
        if (value <= 0) {
          this.$.toast('请输入合法数量')
          this.currentValue = value = 1
          return
        }
        if (Number(value) > Number(this.stock)) {
          this.$.toast('已超过最大购买数量')
          this.currentValue = this.number
          return
        }
        let els = document.querySelector('input')
        this.$.handToblur(els)
        this.$emit('input', value)
        return 'end'
      }
    },
    watch: {
      number (val) {
        this.currentValue = val
      }
    },
    computed: {
      value () {
        // this.currentValue = this.number
        return this.currentValue
      }
    }
  }
</script>

<style>
  #number{
    margin-bottom: 2px;
  }

  #number input{
    width: 100%;
    height: 100%;
    text-align: center;
    border: none;
    outline: none;
  }

  #number .number-box {
    border: 1px solid #E5E5E5;
    width: 50px;
    height: 35px;
    line-height: 28px;
    margin-top: -11px;
    text-align: center;
    float: left;
    border-radius: 2px;
    /*box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);*/
  }

  #number .operate{
    font-size: 25px;
    color: #548CD1;
  }

  #number .button {
    min-width: 45px;
    line-height: 28px;
    height: 32px;
    float: left;
    display: inline-block;
    margin-top: -10px;
    font-size: 1.5rem;
  }

</style>

