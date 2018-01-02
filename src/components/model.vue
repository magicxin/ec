<template>
  <div id="model">
    <div class="model_layer"  v-show="isOpen">
      <!--v-tap="{methods: close}"-->
    </div>
    <div class="model_box" layout="row">
      <transition name="bounce">
        <div class="model_slot text-center" v-if="isOpen" flex layout="column">
          <h4 flex>{{title}}</h4>
          <slot>登入后可以使用此功能</slot>
          <div flex layout="row" class="work">
            <slot name="work">
              <a @click="close" flex>取消</a>
              <a @click="close({confirm: true})" flex>确定</a>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import modelLayer from 'components/model-layer'
  export default {
    name: 'model',
    props: {
      isShow: {
        type: Boolean,
        default () {
          return false
        }
      },
      title: {
        type: String
      }
    },
    computed: {
      isOpen () {
        if (this.isShow) {
          let height = document.body.clientHeight
          let el = document.querySelector('.model_layer')
          el.style.height = height + 'px'
        }
        document.body.scrollTop = 0
        return this.isShow
      }
    },
    mounted () {
      window.addEventListener('hashchange', () => {
        this.close({})
      })
    },
    methods: {
      close (params) {
        if (this.isOpen) {
          this.$emit('closeIsModel', JSON.stringify(params.confirm))
        }
      }
    },
    components: {
      modelLayer
    }
  }
</script>

<style>
  #model{
    overflow: hidden;
    min-height: 100%;
    height: auto;
    max-width: 100%;
  }

  .not-scoll{
    overflow: hidden;
  }

  #model h4 {
    font-size: 1.2rem;
  }

  #model .model_layer {
    min-height: 100%;
    width: 100%;
    height: auto;
    background-color: black;
    position: fixed;
    top: 0;
    opacity: 0.5;
    z-index: 9111290;
  }

  #model .work {
    font-size: 1.1rem;
  }

  #model .model_slot{
    max-width: 90%;
    min-width: 80%;
    opacity: 1;
    min-height: 40px;
    height: auto;
    background-color: #fff;
    z-index: 9111291;
    position: fixed;
    border-radius: 6px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 50% 50% 0;
    padding: 10px 20px;
    line-height: 30px;
  }

  #model a{
    color: #F98700;
  }

  .bounce-enter-active{
    animation-duration: .4s;
    animation-name: bounce;
  }

  @keyframes bounce {
    from {
      transform: scale(.97) translate(-50%, -50%);
      transform-origin: left top;
    }
    30% {
      transform: scale(1.15) translate(-50%, -50%);
      transform-origin: left top;
    }
    to {
      transform: scale(1) translate(-50%, -50%);
      transform-origin: left top;
    }
}
</style>
