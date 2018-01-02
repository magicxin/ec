export default [
    {
		path: '/cb_card',
		name: 'cb_card', // 卡券
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_card'));}, 'card')},
		meta: {
			native: true
		}
	}, {
		path: '/cb_cardDetail', // 卡券详情
		name: 'cb_cardDetail',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_cardDetail'));}, 'card')},
	}, 
	{
		path: '/cb_couponInfo', // 优惠券详情
		name: 'cb_couponInfo',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_couponInfo'));}, 'list')},
	}
]