export default [
   {
		path: '/banner_vr', // vr广告
		name: 'banner_vr',
//		component: resolve => require(['../pages/bannerVr/banner_vr'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/bannerVr/banner_vr'));}, 'vr')},
	},{
		path: '/sg_goods_panorama',
		name: 'sg_goods_panorama',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_goods_panorama'));}, 'vr')},
		meta: {
			auth: true,
			keepAlive: false
		}
	},]