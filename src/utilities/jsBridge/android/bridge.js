
var androidBridge = null

//初始化安卓WebView
function initAndroidWebView() {
	//建立桥接
    function connectWebViewJavascriptBridge(callback) {
        // alert('start init android bridge')
        console.log("%c ----connect android webview ---- ","color:green")
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady',function() {
                    callback(WebViewJavascriptBridge)
               },false) 
        }
    }
    try{
		console.log("%c ----init android webview ---- ","color:green")
        return new Promise(function(resolve, reject){
            window.onerror = function(err) {
                reject && reject(err)
				console.log("err")
            }
            // alert('start initing android bridge')
            connectWebViewJavascriptBridge(function(bridge) {
//              alert('android bridge callback')
                console.log("%c ----callback run ---- ","color:green")
                androidBridge = bridge
                resolve && resolve(androidBridge)
            })
        }) 
    }catch(err){
        alert(err)
        reject && reject(err)
    }

}


export default function() {
    console.log('start init android bridge')
    if (androidBridge) {
        console.log('android bridge cached')
        return Promise.resolve(androidBridge)
    } else {
        return initAndroidWebView()
    }
}
