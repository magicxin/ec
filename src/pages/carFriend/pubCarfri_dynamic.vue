<style>
  #pubCarfri_dynamic .content {
    background-color: #fff;
  }
  #pubCarfri_dynamic .content textarea {
    padding: 10px;
    font-size: 16px;
    line-height: 24px;
    border: none;
    resize: none;
    outline: none;
    overflow: auto;
    width: 100%;
    height: 200px;
  }
  #pubCarfri_dynamic .content textarea.active {
    border: none;
  }
  #pubCarfri_dynamic .content textarea.focus {
    border: none;
  }
</style>
<template>
  <div id="pubCarfri_dynamic">
    <publish main-text="发动态"
      bg-color="#F7F7F7" text-color="#000"></publish>
    <div class="content">
      <textarea placeholder="分享新鲜事" />
      
    </div>
  </div>
</template>

<script>
  import publish from 'components/publish'

  export default {
    data () {
      return {

      }
    },
    components: {
      publish
    }
  }
</script>