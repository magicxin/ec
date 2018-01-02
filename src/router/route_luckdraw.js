export default [
  {
		path: '/eve_luckyDraw/:activityId', // 幸运大转盘 方
		name: 'eve_luckyDraw',
//		component: resolve => require(['../pages/events/eve_luckyDraw'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_luckyDraw'));}, 'luckdraw')},
		meta: {
			keepAlive: false
		}
	},
{
		path: '/eve_luckyDraw_two/:activityId', // 幸运大转盘 圆
		name: 'eve_luckyDraw_two',
//		component: resolve => require(['../pages/events/eve_luckyDraw_two'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/events/eve_luckyDraw_two'));}, 'luckdraw')},
		meta: {
			keepAlive: false
		}
	}
]