export default [
   {
		path: '/eve_timeSpike/:activityId', // 限时秒杀
		name: 'eve_timeSpike',
//		component: resolve => require(['../pages/events/eve_timeSpike'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_timeSpike'));}, 'timespike')},
		meta: {
			keepAlive: false
		}
	}, {
		path: '/eve_timeSpikeDetails/:id/:activityId', // 限时秒杀详情页
		name: 'eve_timeSpikeDetails',
//		component: resolve => require(['../pages/events/eve_timeSpikeDetails'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_timeSpikeDetails'));}, 'timespike')},
	}]