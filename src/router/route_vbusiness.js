export default [
  {
		path: '/seeGoods',
		component:resolve => {resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/goodsList'));}, 'v_business')}}
	},{
		path: '/goodsDetails', // 商品详情
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_goodsDetails'));}, 'v_business')},
	}, {
		path: '/sg_goods/:id/:name', // 普通商品详情
		name: 'sg_goods',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_goods'));}, 'v_business')},
		meta: {}
	},  {
		path: '/sg_goods_car/:id/:name', // 整车商品详情
		name: 'sg_goods_car',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_goods_car'));}, 'v_business')},
		meta: {
			// keepAlive: true
		}
	}, {
		path: '/sg_goodsList', // 商品列表
		name: 'sg_goodsList',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_goodsList'));}, 'v_business')},
		meta: {
			keepAlive: true
		}
	},{
		path: '/sg_searchResult', // 搜索
		name: 'sg_searchResult',
//		component: resolve => require(['../pages/seeGoods/sg_searchResult'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/seeGoods/sg_searchResult'));}, 'v_business')},
		meta: {
			keepAlive: true
		}
	},{
		path: '/asc_shoppingCart', // 购物车
		name: 'asc_shoppingCart',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/addShoppingCart/asc_shoppingCart.vue'));}, 'v_business')},
		meta: {
			auth: true,
			keepAlive: false,
			native: true
		}
	},]