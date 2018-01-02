<template>
  <form v-form="name">
    <slot></slot>
  </form>
</template>

<script>
  export default {
    name: 'v-form',
    data () {
      return {
        $error: {

        }
      }
    },
    props: {
      name: {
        type: String
      }
    }
  }
</script>