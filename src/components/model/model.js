/* eslint-disable */
import Vue from 'vue'

const ModelConstructor = Vue.extend(require('./model.vue'))

let getInstance = () => {
  return new ModelConstructor({
    el: document.createElement('div')
  })
}

let removeDom = event => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
}

// ModelConstructor.prototype.close = function () {
//   this.isShow = false
// }

// 如果把子组件传进来呢
let Model = (options = {}) => {
  let instance = getInstance()
  instance.closed = false
  instance.title = typeof options === 'string' ? options : options.title
  instance.type = options.type,
  instance.modelValue = options.value
  instance.modelType = options.modelType || 'model'
  if (instance.modelType === 'model') {
    instance.maxLength = options.maxLength || 32
  }
  document.body.appendChild(instance.$el)

  Vue.nextTick(function () {
    instance.isShow = true
  })
  let promise = new Promise((resolve, reject) => {
    console.log(resolve)
    instance.resolve = resolve
    instance.reject = reject
  })

  return promise
}

export default Model