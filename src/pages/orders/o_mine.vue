<template>
  <cells>
    <cell>
      <div slot="label">个人信息</div>
    </cell>
    <cell>
      <div slot="label">车辆信息</div>
    </cell>
    <cell>
      <div slot="label">订单管理</div>
    </cell>
    <cell>
      <div slot="label">提醒服务设置</div>
    </cell>
    <cell>
      <div slot="label">系统设置</div>
    </cell>
  </cells>
  
</template>

<script>
  import cells from 'components/cells'
  import cell from 'components/cell'
  export default {
    name: 'mine',
    components: {
      cells,
      cell
    }
  }
</script>

<style>
  
</style>