const ERROR_CODE = {
    101: '该账号已存在',


    102: '登录失败',


    103: '该账号不存在',


    104: '原密码错误',


    105: '用户名为空',


    106: '密码为空',


    108: '该账号已停用',


    109: '该账号是临时账号，已超过有效时间',


    114: '用户名或密码错误',


    115: '手机号为空',


    116: '类型为空',


    117: '验证码为空',


    121: '车辆已存在',


    122: 'Terminal已存在',


    123: 'SIM号已存在',


    124: '该用户同名车友圈已存在',


    131: 'Terminal序号为空',


    132: 'SIM号为空',


    133: '请求方法为空',


    134: '请求方法不存在',


    135: '车牌号为空',


    136: '车辆VIN码为空',


    137: '车辆ID为空',


    138: 'TerminalID为空',


    139: '该车辆不存在',


    140: '该Terminal不存在',


    141: '该车辆与Terminal已经绑定',


    142: '该车辆未与车载诊断设备绑定',


    143: '该Terminal未与SIM绑定',


    144: '无该车辆数据',


    145: '无该车辆GPS数据',


    146: '车友圈名称为空',


    147: '车友圈ID为空',


    148: '该车友圈不存在',


    149: '没有要添加的成员',


    150: '没有添加新的成员',


    151: '该用户没有车辆',


    152: '用户ID为空',


    153: '用户不存在',


    154: '手机号输入错误',


    155: '请求类型无效',


    156: 'Terminal不属于此用户',


    157: '该用户已添加该车辆',


    158: '该Terminal与其它车辆已经绑定',


    159: '用户昵称为空',


    160: '该Terminal已绑定',


    161: '账户为空',


    162: '头像路径为空',


    163: '上传文件格式或大小不正确',


    164: '上传文件出现错误',


    165: '日期格式出现错误',


    166: '行驶轨迹ID为空',


    167: '该行驶路径不存在',


    168: '消息ID为空',


    169: '故障码为空',


    170: '电子围栏ID为空',


    171: '该电子围栏不存在',


    172: '该用户没有电子围栏',


    173: '该名称的电子围栏已存在',


    174: '电子围栏为空',


    175: '添加车友失败',


    176: '删除添加请求失败',


    177: '已经申请过加该群',


    201: '该手机号已存在',


    202: '车辆未点火，车辆无法检测',


    203: '用户已禁用',


    204: '已经是车友',


    205: '车友类型不存在',


    206: '消息类别为空',


    207: '已发过请求，等待同意。',


    208: '好友申请为空',


    209: '好友申请不存在',


    210: '用户已被锁定',


    211: '消息类型为空',


    212: '群友ID为空',


    213: '车友ID为空',


    214: '车友没有有效车辆',


    215: '无有效的车辆和设备的绑定',


    216: '群友配置文件为空',


    217: '已经是群友',


    218: '群友不存在',


    219: '群ID为空',


    220: '该用户的车辆为空',


    221: '群公告不存在',


    222: '群公告内容为空',


    223: '车牌号或车架号或发动机号已存在',


    224: '模式匹配为纯定位',


    225: '围栏信息不完整',


    226: '日期格式错误',


    227: '该用户未激活，请激活后再登录。',


    228: '车辆申请发送成功。',


    229: '车辆申请ID为空。',


    230: '车辆申请不存在。',


    231: '车辆申请已存在。',


    232: '车辆已关注，请取消关注。',


    233: '该用户不是车主。',


    234: '车辆销售信息为空',


    235: '车辆保险信息为空',


    236: '销售公司名称和销售合同单号码不能为空',


    237: '保险公司名称不能为空',


    238: '该围栏区域不存在',


    239: '电子围栏名称为空',


    240: '该轨迹不存在',


    241: '电子围栏类别为空',


    242: '电子围栏类型为空',


    243: '今日已签到',


    244: '店铺ID为空',


    245: '店铺不存在',


    246: '品牌ID为空',


    247: '产品系列ID为空',


    248: '产品ID为空',


    249: '产品不存在',


    250: '产品系列不存在',


    251: '品牌不存在',


    252: '性别为空',


    253: '已有车辆未选择',


    254: '心仪车辆未选择',


    255: '微信ID为空',


    256: '微信ID已存在',


    257: '活动ID为空',


    258: '活动不存在',


    259: '空间id为空',


    260: '空间内容不存在',


    261: '留言内容为空',


    262: '留言id为空',


    263: '留言不存在',


    264: '保养日期为空',


    265: '保养里程为空',


    266: '预约项目不存在',


    267: '优惠券id为空',


    268: '优惠券不存在(数量为0)',


    269: '重复领取优惠券/重复报名活动',


    270: '促销活动领红包领优惠券 未添加红包或者优惠券',


    271: '爱车账本id为空',


    272: '爱车账本不存在',


    273: '保养记录id为空',


    274: '保养记录不存在',


    275: '保养项目不存在',


    276: '实名认证信息填写不完善(姓名或者证件号未填写)',


    277: '已经实名认证',


    278: '跳转引导页',


    279: '添加好友车辆不要添加自己车辆',


    280: '该车已被他人添加，不可再次添加',


    281: '车辆行驶中，建议不要进行车辆检测',


    282: '金融方案id为空',


    283: '会员等级数据为空，请联系管理员',


    284: '新密码同原密码相同',


    285: '用户名不可以为空',


    286: '不能含有表情,请重新输入',


    287: '4S店没有救援人员',


    288: '救援id为空',


    289: '救援记录不存在',


    290: '拒绝救援理由未填写',


    291: '救援说明(图品,音频)id为空',


    292: '救援状态为空',


    293: '已经有人接了本次救援',


    294: '车牌号输入格式错误',


    295: '车架号输入格式错误',


    296: '发动机号输入格式错误',


    297: '车友空间内容,已被管理员屏蔽',


    298: '救援任务已取消',


    299: '救援者已经到达不可取消救援',


    300: '不要添加自己为车友',


    301: '输入格式错误',


    302: '用户名格式不对(4-20位的或字母,或数字,或字母数字组合)',


    303: '救援任务已经派给其他人',


    304: '超速限制输入不合法(0-2147483647)',


    305: '功能编号为空',


    306: '功能不存在',


    307: '本周已使用询执行违章查询功能，该功能一周只能使用一次。',


    308: '未使用（稍后使用）',


    309: '分享id为空',


    310: 'WechatOpenId不存在',

    602:'升级文件不存在',
    603:'标定文件不存在',

    800:'缺少体检权限',

    900:'请求数据校验失败',

    901: '其它错误'


}

export default ERROR_CODE
