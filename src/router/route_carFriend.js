export default [
  {
    // 车友首页 社区
    path: '/carFri_home',
    name: 'carFri_home',
//  component: resolve => require(['../pages/carFriend/carFri_home'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carFri_home'));}, 'community')},
    meta: {
      keepAlive: true
    }
  }, {
    // 发状态 参与话题讨论
    path: '/carFri_pubDynamic',
    name: 'carFri_pubDynamic',
//  component: resolve => require(['../pages/carFriend/carFri_home_pubDynamic'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carFri_home_pubDynamic'));}, 'community')},
  }, {
    // 关于自己的车友新消息提醒
    path: '/new_message/:lastMessTime/:usernickName', 
    name: 'new_message',
//  component: resolve => require(['../pages/carFriend/new_message'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/new_message'));}, 'community')},
  }, {
    path: 'comment', // 关于自己的车友新消息提醒
    name: 'comment',
//  component: resolve => require(['../pages/carFriend/comment'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/comment'));}, 'community')},
  }, {
    path: '/allcomment', // 社区评论
    name: 'allcomment',
//  component: resolve => require(['../pages/carFriend/comment_detail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/comment_detail'));}, 'community')},
    meta: {
      keepAlive: true
    }
  }, {
    path: '/comment_dynamic/:dynamicId', // 评论动态页面
    name: 'comment_dynamic',
//  component: resolve => require(['../pages/carFriend/comment_dynamic'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/comment_dynamic'));}, 'community')},
  },
  //{
  //  path: '/dynamic_detail/:dynamicId/:usernickName', // 动态详情
  //  name: 'dynamic_detail',
  //  component: resolve => require(['../pages/carFriend/dynamic_detail'], resolve),
  //},
  {
    path: '/carfri_meetLists', // 车友会列表
    name: 'carfri_meetLists',
//  component: resolve => require(['../pages/carFriend/carfri_meetLists'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carfri_meetLists'));}, 'community')},
  }, {
    path: '/carFri_meetDetail/:meetId', // 车友会详情
    name: 'carFri_meetDetail',
//  component: resolve => require(['../pages/carFriend/carFri_meetDetail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carFri_meetDetail'));}, 'community')},
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/big_images', // 查看大图
    name: 'big_images',
//  component: resolve => require(['../pages/carFriend/big_images'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/big_images'));}, 'community')},
  },
  {
    path: '/city_active', // 同城活动列表
    name: 'city_active',
//  component: resolve => require(['../pages/carFriend/city_active'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/city_active'));}, 'community')},
  }, {
    path: '/active_detail/:activeId/:status/:shopName', // 活动详情
    name: 'active_detail',
//  component: resolve => require(['../pages/carFriend/active_detail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/active_detail'));}, 'community')},
  }, {
    path: '/active_attend/:activeId', // 报名参加活动
    name: 'active_attend',
//  component: resolve => require(['../pages/carFriend/active_attend'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/active_attend'));}, 'community')},
  }, {
    path: '/active_attendDetail/:activeId', // 报名活动人员详情
    name: 'active_attendDetail',
//  component: resolve => require(['../pages/carFriend/active_attendDetail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/active_attendDetail'));}, 'community')},
  }, {
    path: '/hot_discussion', // 热门讨论列表
    name: 'hot_discussion',
//  component: resolve => require(['../pages/carFriend/hot_discussion'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/hot_discussion'));}, 'community')},
  }, {
    path: '/topic_detail/:topicId/:topicTit', // 热门讨论详情
    name: 'topic_detail',
//  component: resolve => require(['../pages/carFriend/topic_detail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/topic_detail'));}, 'community')},
    meta: {
      keepAlive: false
    }
  }, {
    path: '/hair_dynamic', // 热门讨论详情
    name: 'hair_dynamic',
//  component: resolve => require(['../pages/carFriend/hair_dynamic'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/hair_dynamic'));}, 'community')},
    meta: {
      keepAlive: false
    }
  }, {
    path: '/carfri_active', // 我的--车友活动
    name: 'carfri_active',
//  component: resolve => require(['../pages/carFriend/carfri_active'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carfri_active'));}, 'community')},
  }, {
    path: '/carfri_activeDetail/:activeId/:status/:shopName', // 我的--车友活动详情
    name: 'carfri_activeDetail',
//  component: resolve => require(['../pages/carFriend/carfri_activeDetail'], resolve),
    component:resolve => {require.ensure([], function(require){resolve(require('../pages/carFriend/carfri_activeDetail'));}, 'community')},
  }
]