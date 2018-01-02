export default [
  {
		path: '/communication_card', // 通讯卡
		name: 'communication_card',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/communicationCard/CommunicationCard'));}, 'simcard')},
		meta: {
			native: true
		}
	},
	{
		path: '/recharge-centre/:simId/:number/:tab', // 充值中心
		name: 'recharge-centre',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/communicationCard/RechargeCentre'));}, 'simcard')},
	},
	{
		path: '/recharge-record/:simId', // 充值记录
		name: 'recharge-record',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/communicationCard/RechargeRecord'));}, 'simcard')},
	},
	{
		path: '/expenses-record/:simId', // 消费记录
		name: 'expenses-record',
		component:resolve => {require.ensure([], function(require){resolve(require('../pages/communicationCard/ExpensesRecord'));}, 'simcard')},
	}]