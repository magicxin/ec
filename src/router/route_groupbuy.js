export default [
  {
		path: '/eve_groupShopping/:activityId', // 团拼购
		name: 'eve_groupShopping',
//		component: resolve => require(['../pages/events/eve_groupShopping'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_groupShopping'));}, 'ebay')},
		meta: {
			keepAlive: false,
			native: true
		}
	},{
		path: '/eve_groupShoppingDetails/:id/:activityId', // 团拼购详情
		name: 'eve_groupShoppingDetails',
//		component: resolve => require(['../pages/events/eve_groupShoppingDetails'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_groupShoppingDetails'));}, 'ebay')},
	},]