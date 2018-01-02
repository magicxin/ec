export default [
  {
		path: '/eve_robRedPacket/:activityId', // 抢红包活动
		name: 'eve_robRedPacket',
//		component: resolve => require(['../pages/events/eve_robRedPacket'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_robRedPacket'));}, 'redpackage')},
	}, {
		path: '/rrp_index',
//		component: resolve => require(['../pages/robRedPacket/rrp_index'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/robRedPacket/rrp_index'));}, 'redpackage')},
	}, 
]