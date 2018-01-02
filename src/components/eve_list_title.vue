<style scoped>
.more_bg {
    padding-top: 15px;
    padding-bottom: 6px;
    background-color: #ebebeb;
    color: #666666;
    margin-top: 8px;
    padding-left: 14px;
}

.title {
    color: #000;
    font-size: 14px;
}

.top_style {
    margin-top: 14px;
    margin-left: 14px;
}

.right_style {
    color: #929292;
}

.bottom_style {
    margin-top: 4px;
    margin-left: 14px;
}

.origin {
  width: 29%;
}

del {
    padding-left: 2%;
}

</style>
<template>
  <div>
    <p style="text-align:center">
      <slot name="imageShow"></slot>
    </p>
    <layout justify="flex-start" class="top_style">
      <flex>
        <span class="title">
          <slot name="title"></slot>
        </span>
      </flex>
    </layout>
    <layout justify="space-between" class="bottom_style">
      <flex class="origin" grow="2">
        <span class="col_red">
          <slot name="nowPrice"></slot>
        </span><br>
        <del class="col_gay f14">
          <slot name="beforePrice"></slot>
        </del>
      </flex>
      <flex class="text-right">
        <slot name="needNum"></slot>
        <slot name="clickEvent"></slot>
      </flex>
    </layout>
     <layout justify="flex-strat" class="more_bg">
         <flex><slot name="more_content"></slot></flex>
         <layout justify="flex-end">
            <slot name="overTime">

            </slot>
         </layout>
     </layout>
    </div>
</template>
<script>
import myHeader from 'components/my-header'
export default {
  name: 'eveListTitle',
  components: {
    myHeader
  }
}
</script>
