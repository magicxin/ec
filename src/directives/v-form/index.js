/* eslint-disable */
import {$vFormSet} from './util.js'
import FormController from './vForm.js'

let vForm = {}
function getOptions (el, binding, vnode) {
  return {
    formName: binding.arg,
    vm: vnode.context,
    name: el.getAttribute('name')
  }
}

function debounce (fn, vm) {
  let timer
  return function () {
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(vm, args)
    }, 500)
  }
}

// let requireUpdateFun  = debounce(fn)
// register some directives from directives pools
// add set attr 
// 没什么思路 先放着吧

vForm.install = function (Vue) {
  Vue.directive('form', {
    priority: 1001,
    bind: function (el, binding, vnode) {
      // vm === this
      let vm = vnode.context
      // get form name
      let formName = el.getAttribute('name')
      // get the form instance
      let fromInstance = new FormController()

      vm[formName] = fromInstance
    }
  })

  Vue.directive('require', {
    priority: 1000,
    bind: function (el, binding, vnode, oldnode) {

    }
  })
}

export {vForm}
