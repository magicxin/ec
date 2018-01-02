export default [
  {
		path: '/eve_shakes/:activityId', // 摇一摇活动
		name: 'eve_shakes',
//		component: resolve => require(['../pages/events/eve_shakes'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_shakes'));}, 'handshake')},
	},]