<template>
  <div id="checkbox">
    <input type="checkbox" :id="name">
    <label :for="name">{{value}}</label>
  </div>
</template>
<script>
  export default {
    name: 'checkbox',
    props: {
      name: {
        type: String
      },
      value: {
        type: String
      }
    }
  }
</script>

<style>
  #checkbox input[type='checkbox'] {
    position: absolute;
    clip: rect(0,0,0,0);
    vertical-align: middle;
  }

  #checkbox input[type='checkbox'] + label::before{
    content: ''; /* non-break space */
    display: inline-block;
    text-align: center;
    padding-top: 3px;
    width: 28px;
    height: 28px;
    margin-right: .2em;
    border-radius: 50%;
    text-indent: .15em;
    line-height: .65;
    border:2px solid #929292;
    vertical-align: middle;
  }

  #checkbox input[type="checkbox"]:checked + label::before{
    content:url(../assets/chose.svg);
    background-color: #548CD1;
    border:2px solid #548CD1;
  }

  #checkbox label{
    color: #727272;
    font-weight: 300;
    font-size: 16px;
  }
</style>