export default [
  {
		path: '/orderlist/:status', // 订单列表
		name: 'orderlist',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_ordersList'));}, 'order')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/orderManage', // 订单管理
		name: 'orderManage',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_ordersManage'));}, 'order')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/integralMall',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_integralMall'));}, 'order')},
	}, {
		path: '/o_orderConfirm',
		name: 'o_orderConfirm', // 订单确认
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_orderConfirm'));}, 'order')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/o_return',
		name: 'o_return', // 退货信息
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_return'));}, 'order')},
	}, {
		path: '/o_coupon',
		name: 'o_coupon', // 优惠券 会员卡
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_coupon'));}, 'order')},
	}, {
		path: '/o_invoice',
		name: 'o_invoice', // 发票详情
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_invoice'));}, 'order')},
	}, {
		path: '/o_invoiceList', // 发票列表
		name: 'o_invoiceList',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_invoiceList'));}, 'order')},
		meta: {
			auth: true,
			keepAlive: true
		}
	}, {
		path: '/o_transport', // 收货地址
		name: 'o_transport',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_transport'));}, 'order')},
	}, {
		path: '/o_returnDetail',
		name: 'o_returnDetail',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_returnDetail'));}, 'order')},
	}, {
		path: '/o_transportEdit', // 编辑收货地址
		name: 'o_transportEdit',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_transportEdit'));}, 'order')},
	}, {
		path: '/o_fillInTransport',
		name: 'o_fillInTransport',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_fillInTransport'));}, 'order')},
	}, {
		path: '/o_trace',
		name: 'o_trace',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_trace'));}, 'order')},
	}, {
		path: '/orderDetail/:orderId', // 订单详情
		name: 'orderDetail',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_orderDetails'));}, 'order')},
		meta: {
			native: true
		}
	}, {
		path: '/result',
		name: 'result',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_result'));}, 'order')},
	}, {
		path: '/mine',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/orders/o_mine'));}, 'order')},
	}, ]