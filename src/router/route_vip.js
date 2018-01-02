export default [
  {
		path: '/vb_integralRule', // 积分规则
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_integralRule'));}, 'vip')},
	}, {
		path: '/vb_integralList', // 积分明细
		name: 'vb_integralList',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_integralList'));}, 'vip')},
	}, {
		path: '/vb_vipRights/:vipRank', // 会员权益
		name: 'vb_vipRights',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_vipRights'));}, 'vip')},
	}, {
		path: '/vb_vBeanList', // V豆明细
		name: 'vb_vBeanList',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_vBeanList'));}, 'vip')},
	}, {
		path: '/vb_beanCardRule', // 卡豆规则
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_beanCardRule'));}, 'vip')},
	}, {
		path: '/vb_vipRule', // 会员等级
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_vipRule'));}, 'vip')},
		meta: {
			auth: true,
			keepAlive: false
		}
	}, {
		path: '/vb_integralMall', // V豆换购
		name: 'vb_integralMall',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/vb_integralMall'));}, 'vip')},
		meta: {
			auth: true,
			keepAlive: true
		}
	}, {
		path: '/cb_forRight', // 会员权益
		name: 'cb_forRight',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_forRight'));}, 'vip')},
	}, {
		path: '/cb_VDetail',
		name: 'cb_VDetail', // V豆详情
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_VDetail'));}, 'vip')},
		meta: {
			keepAlive: true
		}
	}, {
		path: '/cb_recharge',
		name: 'cb_recharge',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_recharge'));}, 'vip')},
	}, {
		path: '/cb_record', // V豆使用记录
		name: 'cb_record',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/consumerBill/cb_record'));}, 'vip')},
	}, ]