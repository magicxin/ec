export default [
  {
		path: '/channel/:categoryId?',
		name: 'channel', // 我的文章 爱车频道
		props: true,
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/channel.vue'));}, 'icar_article')},
		meta: {
			keepAlive: false
		}
	}, {
		path: '/channelDetail', // 文章详情
		name: 'channelDetail',
//		component: resolve => require(['../pages/VBuy/channelDetail.vue'], resolve)
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/VBuy/channelDetail.vue'));}, 'icar_article')},
	}, ]