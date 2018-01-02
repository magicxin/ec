<style>
  #order_status_title{
    position: relative;
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
  }
  #order_status_title::after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  #order_status_title h4{
    font-weight: normal;
    font-size: 1.2rem;
  }

</style>
<template>
  <div layout="row" id="order_status_title">
    <h4 flex flex="grow" class="col_666">{{label}}</h4>
  </div>
</template>
<script>
  export default {
    name: 'order-title',
    props: {
      label: {
        type: String,
        required: true
      }
    }
  }
</script>
