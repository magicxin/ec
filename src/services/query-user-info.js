export default {
    /**
* @author wanghaitao
* @params  不需要传递参数目前
* @example 
* @requires 用户信息
* @return   目前使用了用户名如果需要其他参数需要在输出的data中添加
*/
    getUserInfo(params, success, fail) {
        this.$.get({
                methodName: 'QueryUserInfo'
        }).then((response) => {
            console.log(response.data.resultCode === '100')
            if (response.data.resultCode === '100'){
                let data ={
                    userNickname: response.data.userNickname
                }
                success && success(data)
            }
        }, (response) => {
            fail && fail(response.errorMessage || '错误：' + response.resultCode)
        }) 
    }
}
