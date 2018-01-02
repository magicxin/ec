export default function(value){
  switch(Number(value)) 
  {
    case 0:
      return '故障诊断'
    case 1:
      return '发动机控制系统'
    case 2:
      return '电气系统'
    case 3:
      return '冷却系统'
    case 4:
      return '润滑系统'
    case 5:
      return '驾驶成就'
    case 6:
      return '车辆年检'
    case 7:
      return '车辆保养'
    case 8:
      return '车辆保险'
    case 9:
      return '进气系统'
    case 10:
      return '排放控制系统'
    case 11:
      return '燃油系统'
      break;
    case 12:
      return '点火系统'
    case 13:
      return '启动系统'
    default:
      return '未知'
  }
}
