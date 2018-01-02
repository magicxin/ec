
<template>
<div id="goods-header">
    <layout justify="flex-start" class="top_style">
        <flex><span class="title mid_f"><slot name="title" class="mid_f"></slot><br><span><slot name="subtitle"></slot></span></span></flex>
    </layout>
    <layout justify="space-between" class="bottom_style">
        <layout justify="flex-start" class="min-wid_200">
            <flex><span class="hg_f col_red"><slot name="nowPrice" class="lg_f"></slot></span>
                <del class="col_gay sm_f">
                    <slot name="beforePrice" class="mini_f"></slot>
                </del>
            </flex>
        </layout>
        <layout justify="flex-end">
            <layout justify="space-between" class="span_style">
                <flex><slot name="collection"></slot></flex>
                <flex><slot name="share"></slot></flex>
            </layout>
        </layout>
    </layout>
</div>
</template>


<style>
#goods-header .title {
    color: #000;
    margin-right: 13px;
    display: inline-block;
    line-height: 22px;
}
#goods-header .top_style {
    margin-top: 14px;
    margin-left: 14px;
}
#goods-header .right_style {
    color: #929292;
}
#goods-header .bottom_style {
    margin-top: 4px;
    margin-left: 14px;
    /*margin-right: 14px;*/
}
#goods-header del {
    padding-left: 10px;
}
#goods-header .span_style span {
  padding-top:30px;
  display: inline-block;
  margin-bottom: 10px;
  color: #666;
}
#goods-header .share {
  background: url(../../assets/share.svg) no-repeat center top 2px;
}
</style>