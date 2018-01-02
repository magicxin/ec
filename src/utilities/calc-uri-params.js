import Vue from 'vue'

let defaultJoinMark = '&',
    defaultSetValueMark = '='

function getParams(str, joinMark, setValueMark) {
    var dataObj = {},
        splitedStrArr = str.split(joinMark)
    splitedStrArr.forEach((splitedStr) => {
        let splitedKeyAndValue = splitedStr.split(setValueMark)
        dataObj[splitedKeyAndValue[0]] = splitedKeyAndValue[1]
    })
    return dataObj;
}

function setParams(str, joinMark, setValueMark, options) {
    let key = '',
        valueStr = '',
        searchPosition
    for (key in options) {
        valueStr = joinMark + key + setValueMark + options[key] + joinMark
        searchPosition = str.search(key)
        if (searchPosition === -1) {
            str += valueStr
        } else {
            str = str.replace(new RegExp(joinMark + (searchPosition === 0 ? '?' : '+') + '(' + key + setValueMark + '.*)' + joinMark + '?', 'g'), valueStr)
        }
    }
    return str = str.replace(new RegExp(joinMark + joinMark, 'g'), joinMark).replace(new RegExp(joinMark + '$'), '').replace(new RegExp('^' + joinMark), '')
}

function getCleanHash() {
    return location.hash.replace('#', '')
}

function getCleanQuery() {
    return location.search.replace('?', '').replace('/','')
}

export default {
    	getUriQuery() {
            return getParams(getCleanQuery(), defaultJoinMark, defaultSetValueMark)
        },
        getUriHash() {
            return getParams(getCleanHash(), defaultJoinMark, defaultSetValueMark)
        },
        getCustom(options) {
            Vue.prototype.$.isObject.validate(options)
            Vue.prototype.$.isString.validate(options.fullStr)
            Vue.prototype.$.isString.validate(options.startPoint)
            Vue.prototype.$.isString.validate(options.joinMark)
            Vue.prototype.$.isString.validate(options.setValueMark)
            return getParams(options.fullStr.split(options.startPoint)[1], options.joinMark, options.setValueMark)
        },
        addUriQuery(options) {
            Vue.prototype.$.isObject.validate(options)
            return setParams(getCleanQuery(), defaultJoinMark, defaultSetValueMark, options)
        },
        addUriHash(options) {
            Vue.prototype.$.isObject.validate(options)
            return setParams(getCleanHash(), defaultJoinMark, defaultSetValueMark, options)
        },
        addCustom(options) { 
            Vue.prototype.$.isObject.validate(options)
            Vue.prototype.$.isString.validate(options.fullStr)
            Vue.prototype.$.isString.validate(options.startPoint)
            Vue.prototype.$.isString.validate(options.joinMark)
            Vue.prototype.$.isString.validate(options.setValueMark)
            Vue.prototype.$.isObject.validate(options.options)
            return options.fullStr.split(options.startPoint)[0]+options.startPoint+setParams(options.fullStr.split(options.startPoint)[1], options.joinMark, options.setValueMark, options.options)
        }
        // ,
        // setQuery(options){
        // 	location.search=this.addQuery(options)
        // }
}
