export default [
  
	/**
	 * H5 新加的 页面
	 */
	// {
	//   path: '/my_pages', // 我的
	//   name: 'my_pages',
	//   component: resolve => require(['../pages/myPages/my_pages'], resolve),
	// },
	//YYYYYYYYYYYYYYYYYYYYYYYY
	{
		path: '/car-list', //车辆列表
		name: 'car-list',
//		component: resolve => require(['../pages/car/car-list'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-list'));}, 'h5project')},
		meta: {
			auth: true
		}
	},

	{
		path: '/car-add',
		name: 'car-add',
		// component: require('pages/car-add'),
//		component: resolve => require(['../pages/car/car-add'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-add'));}, 'h5project')},
		meta: {
			// title: '添加车辆',
			auth: true
		}
	},
	// {
	//   path: '/car-bill',
	//   name: 'car-bill',
	//   // component: require('pages/car-bill'),
	//   component: resolve => require(['../pages/car/car-bill'], resolve), 
	//   meta: {
	//     // title: '用车账单',
	//     auth: true
	//   }
	// },
	{
		path: '/car-edit',
		name: 'car-edit',
		// component: require('pages/car-edit'),
//		component: resolve => require(['../pages/car/car-edit'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-edit'));}, 'h5project')},
		meta: {
			// title: '编辑车辆',
			auth: true
		}
	},
	{
		path: '/car-edit-basic-info',
		name: 'car-edit-basic-info',
//		component: resolve => require(['../pages/car/car-edit-basic-info'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-edit-basic-info'));}, 'h5project')},
		// component: require('pages/car-edit-basic-info'),
		meta: {
			// title: '基本信息',
			auth: true
		}
	},

	{
		path: '/add-friend-car', // 添加好友车辆
		name: 'add-friend-cars',
//		component: resolve => require(['../pages/car/add-friend-car'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/add-friend-car'));}, 'h5project')},
	},
	{
		path: '/car-moving-data',
		name: 'car-moving-data',
//		component: resolve => require(['../pages/car/car-moving-data'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-moving-data'));}, 'h5project')},
		// component: require('pages/car-moving-data'),
		meta: {
			// title: '行车数据',
			auth: true
		}
	},
	{
		path: '/car-rails',
		name: 'car-rails',
		// component: require('pages/car-rails'),
//		component: resolve => require(['../pages/car/car-rails'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-rails'));}, 'h5project')},
		meta: {
			// title: '围栏设置',
			auth: true
		}
	},
	{
		path: '/car-rails-edit',
		name: 'car-rails-edit',
		// component: require('pages/car-rails-edit'),
//		component: resolve => require(['../pages/car/car-rails-edit'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-rails-edit'));}, 'h5project')},
		meta: {
			// title: '设置围栏',
			auth: true
		}
	},
	{
		path: '/car-share-request',
		name: 'car-share-request',
		// component: require('pages/car-share-request'),
//		component: resolve => require(['../pages/car/car-share-request'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-share-request'));}, 'h5project')},
		meta: {
			// title: '共享申请',
			auth: true
		}
	},
	{
		path: '/car-test',
		name: 'car-test',
		// component: require('pages/car-test'),
//		component: resolve => require(['../pages/car/car-test'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-test'));}, 'h5project')},
		meta: {
			// title: '全车体检',
			auth: true,
			noTransition: true
		}
	},

	{
		path: '/car-location',
		name: 'car-location',
		// component: require('pages/car-location'),
//		component: resolve => require(['../pages/car/car-location'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-location'));}, 'h5project')},
		meta: {
			// title: '实时定位',
			auth: true
		}
	},

	{
		path: '/car-examination',
		name: 'car-examination',
		// component: require('pages/car-examination'),
//		component: resolve => require(['../pages/car/car-examination'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-examination'));}, 'h5project')},
		meta: {
			// title: '全车体检',
			auth: true
		}
	},
	{
		path: '/car-examinationning',
		name: 'car-examinationning',
		// component: require('pages/car-examinationning'),
//		component: resolve => require(['../pages/car/car-examinationning'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-examinationning'));}, 'h5project')},
		meta: {
			// title: '全车体检',
			auth: true
		}
	},

	{
		path: '/article-show',
		name: 'article-show',
		// component: require('pages/article-show'),
//		component: resolve => require(['../pages/car/article-show'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/article-show'));}, 'h5project')},
		meta: {
			title(currentRoute) {
				if(currentRoute.query.title) {
					return currentRoute.query.title
				} else {
					return '详细内容'
				}
			},
			noTransition: true
		}
	},

	{
		path: '/auto-forum',
		name: 'auto-forum',
		// component: require('pages/auto-forum'),
//		component: resolve => require(['../pages/car/auto-forum'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/auto-forum'));}, 'h5project')},
		// meta: {
		//   title: '爱车频道'
		// }
	},

	{
		path: '/bind-device',
		name: 'bind-device',
		// component: require('pages/bind-device'),
//		component: resolve => require(['../pages/car/bind-device'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/bind-device'));}, 'h5project')},
		meta: {
			// title: '绑定设备',
			auth: true
		}
	},

	{
		path: '/bill-detail',
		name: 'bill-detail',
		// component: require('pages/bill-detail'),
//		component: resolve => require(['../pages/car/bill-detail'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/bill-detail'));}, 'h5project')},
		meta: {
			// title: '账单明细',
			auth: true
		}
	},

	//优惠券
	{
		path: '/router-coupon',
		name: 'router-coupon',
		// component: require('pages/router-coupon'),
//		component: resolve => require(['../pages/car/router-coupon'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/router-coupon'));}, 'h5project')},
		meta: {
			// title: '优惠券',
			auth: true
		}
	},
	//领取优惠券   （首页进入）
	{
		path: '/get-coupon',
		name: 'get-coupon',
		// component: require('pages/get-coupon'),
//		component: resolve => require(['../pages/car/get-coupon'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/get-coupon'));}, 'h5project')},
		meta: {
			// title: '优惠券',
			auth: true
		}
	},
	//优惠券详情页
	{
		path: '/coupon-info',
		name: 'coupon-info',
//		component: resolve => require(['../pages/car/coupon-info'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/coupon-info'));}, 'h5project')},
		meta: {
			// title: '优惠券详情',
			auth: true
		}
	},

	// {
	//   path: '/drive-achievement',
	//   name: 'drive-achievement',
	//   // component: require('pages/drive-achievement'),
	//   component: resolve => require(['../pages/car/drive-achievement'], resolve),
	//   meta: {
	//     // title: '驾驶成就',
	//     auth: true
	//   }
	// }, 

	{
		path: '/driving-record',
		name: 'driving-record',
		// component: require('pages/driving-record'),
//		component: resolve => require(['../pages/car/driving-record'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/driving-record'));}, 'h5project')},
		meta: {
			title: '行车记录',
			auth: true
		}
	},

	{
		path: '/iframe-content',
		name: 'iframe-content',
		// component: require('pages/iframe-content'),
//		component: resolve => require(['../pages/car/iframe-content'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/iframe-content'));}, 'h5project')},
		meta: {
			// title: '详细内容'
		}
	},

	{
		path: '/insurance-company',
		name: 'insurance-company',
//		component: resolve => require(['../pages/car/insurance-company'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/insurance-company'));}, 'h5project')},
		meta: {
			// title: '保险公司',
			auth: true
		}
	},
	{
		path: '/insurance-information',
		name: 'insurance-information',
//		component: resolve => require(['../pages/car/insurance-information'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/insurance-information'));}, 'h5project')},
		meta: {
			// title: '保险信息',
			auth: true
		}
	},

	{
		path: '/insurance-list',
		name: 'insurance-list',
//		component: resolve => require(['../pages/car/insurance-list'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/insurance-list'));}, 'h5project')},
		meta: {
			// title: '车辆保险',
			auth: true
		}
	},

	{
		path: '/maintain-information',
		name: 'maintain-information',
//		component: resolve => require(['../pages/car/maintain-information'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/maintain-information'));}, 'h5project')},
		meta: {
			// title: '保养信息',
			auth: true
		}
	},

	// {
	//   path: '/maintain-record',
	//   name: 'maintain-record',
	//   component: resolve => require(['../pages/car/maintain-record'], resolve),
	//   meta: {
	//     // title: '维保记录',
	//     auth: true
	//   }
	// },

	{
		path: '/create-bill',
		name: 'create-bill',
//		component: resolve => require(['../pages/car/create-bill'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/create-bill'));}, 'h5project')},
		meta: {
			// title: '添加账单',
			auth: true
		}

	},

	{
		path: '/map',
		name: 'map',
//		component: resolve => require(['../pages/car/map'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/map'));}, 'h5project')},
		meta: {
			// title: '地图',
			auth: true
		}
	},

	{
		path: '/mot-information',
		name: 'mot-information',
//		component: resolve => require(['../pages/car/mot-information'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/mot-information'));}, 'h5project')},
		meta: {
			// title: '年检信息',
			auth: true
		}
	},

	// {
	// 	path: '/onekey-help',
	//   name: 'onekey-help',
	//   component: resolve => require(['../pages/car/onekey-help'], resolve),
	//   meta:{
	//       title:'一键救援',
	//       auth:true
	//    }
	//  },

	{
		path: '/path-navigation',
		name: 'path-navigation',
//		component: resolve => require(['../pages/car/path-navigation'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/path-navigation'));}, 'h5project')},
		meta: {
			// title: '出行导航',
			auth: true
		}
	},

	{
		path: '/picture-show',
		name: 'picture-show',
//		component: resolve => require(['../pages/car/picture-show'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/picture-show'));}, 'h5project')},
		meta: {
			// title: '显示照片'
		}
	},

	//促销详情页
	{
		path: '/promotion-info',
		name: 'promotion-info',
//		component: resolve => require(['../pages/car/promotion-info'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/promotion-info'));}, 'h5project')},
		meta: {
			// title: '活动详情',
			auth: true
		}
	},

	{
		path: '/running-tracks',
		name: 'running-tracks',
//		component: resolve => require(['../pages/car/running-tracks'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/running-tracks'));}, 'h5project')},
		meta: {
			// title: '行车轨迹',
			auth: true
		}
	},

	{
		path: '/running-tracks-detail',
		name: 'running-tracks-detail',
//		component: resolve => require(['../pages/car/running-tracks-detail'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/running-tracks-detail'));}, 'h5project')},
		meta: {
			// title: '轨迹详情',
			auth: true
		}
	},

	{
		path: '/running-tracks-stop',
		name: 'running-tracks-stop',
//		component: resolve => require(['../pages/car/running-tracks-stop'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/running-tracks-stop'));}, 'h5project')},
		meta: {
			title: '停车信息',
			auth: true
		}
	},

	//  促销列表页
	{
		path: '/sales-promotion',
		name: 'sales-promotion',
//		component: resolve => require(['../pages/car/sales-promotion'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/sales-promotion'));}, 'h5project')},
		meta: {
			// title: '最新促销',
			auth: true
		}
	},

	{
		path: '/terminal-data-flow-show',
		name: 'terminal-data-flow-show',
//		component: resolve => require(['../pages/car/terminal-data-flow-show'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/terminal-data-flow-show'));}, 'h5project')},
		meta: {
			// title: '数据流监测',
			auth: true,
			noTransition: true
		}
	},

	{
		path: '/terminal-data-flow-select',
		name: 'terminal-data-flow-select',
		// component: require('pages/terminal-data-flow-select'),
//		component: resolve => require(['../pages/car/terminal-data-flow-select'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/terminal-data-flow-select'));}, 'h5project')},
		meta: {
			// title: '选择数据流监测项',
			auth: true,
			noTransition: true
		}
	},

	{
		path: '/terminal-params-update',
		name: 'terminal-params-update',
		// component: require('pages/terminal-params-update'),
//		component: resolve => require(['../pages/car/terminal-params-update'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/terminal-params-update'));}, 'h5project')},
		meta: {
			// title: '参数编辑',
			auth: true,
			noTransition: true
		}
	},
	{
		path: '/terminal-file-update',
		name: 'terminal-file-update',
		// component: require('pages/terminal-file-update'),
//		component: resolve => require(['../pages/car/terminal-file-update'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/terminal-file-update'));}, 'h5project')},
		meta: {
			// title: '文件升级',
			auth: true,
			noTransition: true
		}
	},

	{
		path: '/video-show',
		name: 'video-show',
		// component: require('pages/video-show'),
//		component: resolve => require(['../pages/car/video-show'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/video-show'));}, 'h5project')},
		meta: {
			// title: '显示视频'
		}
	},

	{
		path: '/vehicle-instrument',
		name: 'vehicle-instrument',
//		component: resolve => require(['../pages/car/vehicle-instrument'], resolve),
		component:resolve => {require.ensure([], function(){resolve(require('../pages/car/vehicle-instrument'));}, 'h5project')},
		meta: {
			// title: '车辆仪表',
			auth: true
		}
	},
	{
		path: '/vehicle-instrument-detail',
		name: 'vehicle-instrument-detail',
//		component: resolve => require(['../pages/car/vehicle-instrument-detail'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/vehicle-instrument-detail'));}, 'h5project')},
		meta: {
			// title: '详细信息',
			auth: true
		}
	},
	{
		path: '/vehicle-instrument-hud',
		name: 'vehicle-instrument-hud',
//		component: resolve => require(['../pages/car/vehicle-instrument-hud'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/vehicle-instrument-hud'));}, 'h5project')},
		meta: {
			// title: 'hud模式',
			auth: true
		}
	},
	///////yyyyyyyyyyyyyy
	{
		path: '/peccancy-query', // 违章查询
		name: 'peccancy-query',
//		component: resolve => require(['../pages/car/peccancy-query'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/peccancy-query'));}, 'h5project')},
		meta: {
			auth: true
		}
	},
	{
		path: '/peccancy-query-detail', // 违章查询结果
		name: 'peccancy-query-detail',
//		component: resolve => require(['../pages/car/peccancy-query-detail'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/peccancy-query-detail'));}, 'h5project')},
	},
	{
		path: '/car-map', // 爱车服务
		name: 'car-map',
//		component: resolve => require(['../pages/car/car-map'], resolve),
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/car/car-map'));}, 'h5project')},
	},
	// {
	//   path: '/test', // 
	//   name: 'test',
	//   component: resolve => require(['../pages/test'], resolve),
	// },
	// {
	//   path: '/vehicle-instrument', // 车辆仪表
	//   name: 'vehicle-instrument',
	//   component: resolve => require(['../pages/vehicle/vehicle-instrument'], resolve),
	// },
	]