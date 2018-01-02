<style scoped>
    /*车型对比样式*/

    .choose_contrast {
        background: url(../../assets/icon_pk.png) no-repeat left 8px center;
    }

    .choose_count {
        background: url(../../assets/icon_count.png) no-repeat left 8px center;
    }

    .choose_drive {
        background: url(../../assets/icon_drive.png) no-repeat left 8px center;
    }

    .choose_change {
        background: url(../../assets/icon_change.png) no-repeat left 8px center;
    }

    .choose_one {
        border-top: 1px solid #bcbcbc;
        padding: 14px 0px;
        color: #929292;
    }

    .choose_one span {
        display: inline-table;
        vertical-align: middle;
        text-align: center;
        width: 100%;
        padding: 6px;
        background-size: 17%;
        padding-left: 25px;
        line-height: 25px;
        height: 25px;
    }

    .choose_left {
        border-left: 1px solid #bcbcbc;
        border-right: 1px solid #bcbcbc;
    }

    .choose_right {
        border-right: 1px solid #bcbcbc;
    }


</style>
<template>
    <div id="sg_goods">
        <goodsDetail :product="product" :shop="shop" :evalData="evalData" :evalArray="evalArray" :favorId="favorId" :isCollect="isCollect" :collectState="collectState" :evalDataSome="evalDataSome">
            <div slot="car_fun" v-if="product.categoryType==='0'">
                <layout justify="space-around" class="choose_one">
                  <flex>
                    <span class="choose_contrast" v-tap="{methods: compare}">车型对比</span>
                  </flex>
                  <flex class="choose_left">
                    <span class="choose_count" v-tap="{methods: calculate}">购车计算</span>
                  </flex>
                  <flex class="choose_right">
                    <span class="choose_change" v-tap="{methods: makeChange}">预约置换</span>
                  </flex>
                  <flex>
                    <span class="choose_drive" v-tap="{methods: makeAppointment}">预约试驾</span>
                  </flex>
                </layout>
            </div>
        </goodsDetail>
    </div>
</template>
<script>
	import Vue from 'vue'
    import goodsDetail from 'components/goods/goodsDetail'



    export default {
        data() {
            return {
                product: {}, // 产品参数对象
                shop: {}, // 商家信息参数对象
                evalData: {}, // 评价参数对象
                evalDataSome: {}, // 列表默认展示 三条评价
                evalArray: [], // 评价数组
                isCollect: true, // 是否收藏
                favorId: '', // 收藏id
                collectState: '收藏'
            }
        },
        methods: {
            compare() {
                this.$.push('router_compareProduct', {
                    ProductID: this.product.id
                })
            },
            calculate() {
                this.$.push('router_calculateCarPrice', {
                    ProductID: this.product.id
                })
            },
            makeChange() {
                this.$.push('router_replacement', {
                    ProductID: this.product.id
                })
            },
            makeAppointment() {
                this.$.push('router_driveAppointment', {
                    ProductID: this.product.id
                })
            }
        },
        beforeRouteEnter(to, from, next) {
            Promise.all([

                    // 查看商品接口
                    Vue.prototype.$.get({
                        methodName: 'QueryProductInfo',
                        productId: to.params.id
                    }),

                    // 商品评价列表接口
                    Vue.prototype.$.get({
                        methodName: 'QueryProductReview',
                        type: '0',
                        index: '0',
                        count: '10',
                        productId: to.params.id
                    })
                ])
                .then(result => next(vm => {
                    console.log("------------product------------")
                    console.log(vm.product)
                    vm.product = result[0].data.product
                    vm.shop = result[0].data.shop
                    vm.favorId = result[0].data.product.favorId
                    vm.evalData = result[1].data
                    vm.evalDataSome = result[1].data
                    vm.evalDataSome.reviews = vm.evalDataSome.reviews.slice(0, 3)
                    vm.evalArray = [{
                            text: '全部',
                            num: vm.evalData.all,
                            active: true,
                            type: 0
                        },
                        {
                            text: '好评',
                            num: vm.evalData.positive,
                            active: false,
                            type: 1
                        },
                        {
                            text: '中评',
                            num: vm.evalData.moderate,
                            active: false,
                            type: 2
                        },
                        {
                            text: '差评',
                            num: vm.evalData.negative,
                            active: false,
                            type: 3
                        },
                        {
                            text: '有图',
                            num: vm.evalData.imageCount,
                            active: false,
                            type: 4
                        }
                    ]
                    if (vm.product.isFavor === '1') {
                        vm.isCollect = false
                        vm.collectState = '已收藏'
                    } else {
                        vm.isCollect = true
                        vm.collectState = '收藏'
                    }
                    //        alert(result[0].data.product.productImages)
                }))
        },
        components: {
            goodsDetail
        }
    }

</script>
