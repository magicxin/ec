<template>
  <div id="upload" layout="row">
    <mu-icon value="local_see" flex="nogrow"></mu-icon>
    <input type="text" flex placeholder="您最多可以选择3张照片" readonly >
  </div>
</template>
<script>
  export default {
    name: 'upload',
    props: {
      value: {
        type: Array
      }
    }
  }
</script>

<style>
  #upload {
    background-color: #EFEFF4;
    border-radius: 8px;
    border: 1px dashed #9A9A9B;
    margin-top: 20px;
    line-height: 34px;
    height: 34px;
  }

  #upload .local_see{
    color: #666666;
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
    margin-top: 4px;
  }

  #upload a{
    width: 40px;
    height: 40px;
  }

  #upload input{
    outline: none;
    border: none;
    background: #EFEFF4;
    display: block;
    /*text-indent: 120px;*/
  }
</style>