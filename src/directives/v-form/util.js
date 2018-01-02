/* eslint-disable */
function $vFormSet (vm, name, options) {
  for (let attr in options) {
    vm.$set(name, attr, options[attr])
  }
}

// 如果input 输入框改变,
function $setDirty (el, binding, vnode, oldVnode) {
  // 传入具体是哪一个 input的对象, 因为是同一个对象嘛
}

export {
  $vFormSet
}
