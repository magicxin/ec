<template>
  <div id="texr_select_cotainer">
    <label class="label">{{label}}:</label>
    <div id="text_select">
      <slot>

      </slot>
    </div>
  </div>
  
</template>

<script>
  export default {
    name: 'text_select',
    props: {
      label: {
        type: String
      }
    }
  }
</script>

<style>
  #texr_select_cotainer {
    /*background-color: #fff;*/
  }

  #texr_select_cotainer .label{
    font-size: 1.2rem;
    display: block;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  #text_select{
    border: 1px solid #ccc;
    border-radius: 8px;
    padding-top: 4px;
    background-color: #fff;
  }


  #text_select .mu-text-field{
    width: 100%;
    margin-bottom: 0px;
    min-height: 0px;
  }

  #text_select .mu-text-field-content{
    padding-bottom: 0px;
    padding-top: 0px;
  }
</style>
