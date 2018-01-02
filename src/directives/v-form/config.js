let config = {

}

// 如果一个表单验证指令存在, 就给对应的name 属性, 加上这个options对象, 
function $set (name) {
  let options = {
    $dirty: false, // 是否修改
    $pristine: true,
    $name: name, // 表单名字
    $invalid: true, // 是否合法,
    $valid: false,
    $error: {}
  }
  return options
}