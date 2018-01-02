export default [
  {
		path: '/eve_recommend/:activityId', // 推荐有礼
		name: 'eve_recommend',
//		component: resolve => require(['../pages/events/eve_recommend'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_recommend'));}, 'recommond')},
	},{
		path: '/eve_Invitation/:activityId', // 推荐有礼 我的邀请
		name: 'eve_Invitation',
//		component: resolve => require(['../pages/events/eve_Invitation'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_Invitation'));}, 'recommond')},
	},]