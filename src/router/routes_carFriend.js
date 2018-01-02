export default [
  {
    // 车友首页 社区
    path: '/carFri_home',
    name: 'carFri_home',
    component: resolve => require(['../pages/carFriend/carFri_home'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    // 发状态 参与话题讨论
    path: '/carFri_pubDynamic',
    name: 'carFri_pubDynamic',
    component: resolve => require(['../pages/carFriend/carFri_home_pubDynamic'], resolve),
  }, {
    // 关于自己的车友新消息提醒
    path: '/new_message/:lastMessTime/:usernickName',
    name: 'new_message',
    component: resolve => require(['../pages/carFriend/new_message'], resolve),
  }, {
    // 评论 动态
    path: 'comment',
    name: 'comment',
    component: resolve => require(['../pages/carFriend/comment'], resolve),
  }, {
    // 社区评论 动态详情
    path: '/allcomment',
    name: 'allcomment',
    component: resolve => require(['../pages/carFriend/comment_detail'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    // 评论动态页面 评论
    path: '/comment_dynamic/:dynamicId', 
    name: 'comment_dynamic',
    component: resolve => require(['../pages/carFriend/comment_dynamic'], resolve),
  }, {
    // 车友会列表
    path: '/carfri_meetLists',
    name: 'carfri_meetLists',
    component: resolve => require(['../pages/carFriend/carfri_meetLists'], resolve),
  }, {
    // 车友会详情
    path: '/carFri_meetDetail/:meetId',
    name: 'carFri_meetDetail',
    component: resolve => require(['../pages/carFriend/carFri_meetDetail'], resolve),
    meta: {
      keepAlive: true
    }
  }, {
    // 查看大图
    path: '/big_images',
    name: 'big_images',
    component: resolve => require(['../pages/carFriend/big_images'], resolve),
  }, {
    // 同城活动列表
    path: '/city_active',
    name: 'city_active',
    component: resolve => require(['../pages/carFriend/city_active'], resolve),
  }, {
    // 活动详情
    path: '/active_detail/:activeId/:status/:shopName',
    name: 'active_detail',
    component: resolve => require(['../pages/carFriend/active_detail'], resolve),
  }, {
    // 报名参加活动
    path: '/active_attend/:activeId',
    name: 'active_attend',
    component: resolve => require(['../pages/carFriend/active_attend'], resolve),
  }, {
    // 报名活动人员详情
    path: '/active_attendDetail/:activeId',
    name: 'active_attendDetail',
    component: resolve => require(['../pages/carFriend/active_attendDetail'], resolve),
  }, {
    // 热门讨论列表
    path: '/hot_discussion',
    name: 'hot_discussion',
    component: resolve => require(['../pages/carFriend/hot_discussion'], resolve),
  }, {
    // 热门讨论详情
    path: '/topic_detail/:topicId/:topicTit',
    name: 'topic_detail',
    component: resolve => require(['../pages/carFriend/topic_detail'], resolve),
    meta: {
      keepAlive: false
    }
  }, {
    // 热门讨论详情
    path: '/hair_dynamic',
    name: 'hair_dynamic',
    component: resolve => require(['../pages/carFriend/hair_dynamic'], resolve),
    meta: {
      keepAlive: false
    }
  }, {
    // 我的--车友活动
    path: '/carfri_active',
    name: 'carfri_active',
    component: resolve => require(['../pages/carFriend/carfri_active'], resolve),
  }, {
    // 我的--车友活动详情
    path: '/carfri_activeDetail/:activeId/:status/:shopName',
    name: 'carfri_activeDetail',
    component: resolve => require(['../pages/carFriend/carfri_activeDetail'], resolve),
  }
]