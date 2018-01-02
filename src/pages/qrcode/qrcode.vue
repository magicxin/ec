
<template>
  <div id="qrcode">
  		<ma-header titleName="扫码挪车"></ma-header>
        <section>
			<article class="scan">
				<img id="logo" :src="flagImg"/>
				<img id="wxLogo" :src="vfhz"/>
				<div id="wrapper">
					<button class="mui-btn mui-btn-block mui-btn-yellow" id="scan" @click="scan">
    					开启扫码挪车
    				</button>
					<a class="mui-btn mui-btn-block mui-btn-yellow" :href="tel" id='tel' style="display: none;">
						确认拨打挪车电话
					</a>
					<button class="mui-btn mui-btn-block mui-btn-yellow" id='go_down_vfhz' style="display: none;">
						长按二维码关注V服惠众
					</button>
				</div>
			</article>
		</section>
        <section>
			<div id="phoneModel">
				<div class="modal-content">
					<h3 id="title">您已绑定挪车码,是否绑定新码</h3>
					<ul class="buttonBox">
						<li><input id="cancel" class="mui-pull-left" type="button" value="取消" @click="cancel"></li>
						<li><input id="apply" class="mui-pull-right" type="button" value="确认" @click="apply"></li>
					</ul>
				</div>
			</div>
		</section>
  </div>
</template>

<script>
	  import maHeader from 'components/magicHeader'
      import flagImg from 'assets/flagImg.png'
      import vfhz from 'assets/vfhz.png'
      import wx from 'weixin-js-sdk'
    export default {
        data() {
            return {
                tel:12345678912,
                codeMobile:123456789123,
                sendCode:''
            }
        },
        created() {
            let codeId = window.location.search.split("=")[2];
            hasMobile(codeId).then(res => {
                if(codeId.length == 1) {
                    scan.style.display = 'block';
                    document.getElementById('logo').style.display = 'block'
                } else {
                    if(res.mobile.length == 11) {
                        scan.style.display = 'none';
                        tel.style.display = 'block';
                        document.getElementById('logo').style.display = 'block'
                        tel = res.mobile;
                    } else {
                        document.getElementById('go_down_vfhz').style.display = 'block'
                        document.getElementById('wxLogo').style.display = 'block'
                    }
                }
		    })
        },
        methods: {
            cancel(){
                model.style.display = 'none';
            },
            apply() {
			    hasMoveCarCode(this.sendCode, this.codeMobile).then(function(res) {
				if(res[0].resultCode == '100') {
					alert('您已成功绑定挪车码')
					    window.location.href = host + '/vfuhuizhong/html/qrcode_mine.html?phone=' + this.codeMobile;
				    }
			    });
		    },
            //扫码功能
            scan(){
                wx.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: function(res) {
						var code = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
						this.sendCode = code.split('=')[2];
						hasMobile(this.sendCode).then(res => {
							if(res.mobile == '') {
                                //mobile为用户手机号判断是否注册
								if(mobile == '' || mobile == null || mobile == undefined) {
									window.location.href = host + '/vfuhuizhong/html/login.html?from=code'
								} else {
									getMobile().then(res => {
										if(res.mobile == '') {
                                //codeMobile为挪车码绑定手机
											this.codeMobile = mobile;
											model.style.display = 'flex';
											title.innerText = '您尚未绑定挪车码,是否绑定该挪车码'
										} else {
											this.codeMobile = res.mobile;
											model.style.display = 'flex';
											title.innerText = '您已绑定其他挪车码，需解绑并绑定此挪车码？'
											apply.innerText = '绑定新码'
										}
									})
								}
							} else if(res.mobile.length == 11) {
									this.codeMobile = res.mobile;
									window.location.href = host + '/vfuhuizhong/html/wxCallphoneNumber.html?phone=' + res.mobile;
								}
						})
					}
				});
            },
            getSign(){
                let signHref = location.href.split("#")[0];
                let signOpenId = window.location.search.split("=")[2].substring(0, 1);
                let signUrlInfo = encodeURIComponent(signHref);
                let signData = {
                    "clientType": 3,
                    "methodName": "QueryJssdkConfig",
                    "shopId": "",
                    "userId": "",
                    "urlInfo": signUrlInfo,
                    "wechatOpenId": signOpenId
                }
                 this.$.get(signData).then(res => {
                    res = res.data
                    console.log('res: ', res)
                    wx.config({
                    debug: false,
                    appId: 'wxe01a681cdc2d5985',
                    timestamp: res.timestamp,
                    nonceStr: res.nonceStr,
                    signature: res.signature,
                    jsApiList: [
                        'scanQRCode'
                    ]
                    })
                })
            },
            //挪车码查询手机号
		    hasMobile(moveCarCode) {
			    return new Promise(function(resolve, reject) {
				    this.$.get({
                        "clientType": "3",
                        "moveCarCode": moveCarCode,
                        "methodName": "QueryMoveCarMobile",
                        "shopId": shopId || '',
		            },function(res) {
					    resolve(res)
                    })
                })
            },
		//绑定修改电话
		hasMoveCarCode(moveCarCode, mobile) {
			return new Promise(function(resolve, reject) {
				this.$.get({
                    "clientType": "3",
				    "mobile": mobile,
			        "moveCarCode": moveCarCode,
			        "methodName": "UpdateMoveCarBinding",
			        "shopId": shopId || '',
                    "userId": userId || '',
                },function(res) {
					resolve(res)
                })
			}).catch();
		},
		//获取用户挪车信息
		getMobile() {
			return new Promise(function(resolve, reject) {
				this.$.get({
                    "clientType": "3",
				    "methodName": "QueryMoveCar",
				    "shopId": shopId || '',
				    "userId": userId || '',
                },function(res) {
					resolve(res)
                })
			}).catch();
		},
		getMoveCarCode() {
			return new Promise(function(resolve, reject) {
				this.$.get({
                    "clientType": "3",
                    "mobile": this.codeMobile,
                    "methodName": "QueryMoveCar",
                    "shopId": shopId || '',
                    "userId": userId || '',
                },function(res) {
					resolve(res)
                })
			}).catch();
        },
        
        },
        components: {
			maHeader
        }
    }

</script>
<style scoped="scoped">
    .scan {
			padding: 1rem;
			display: flex;
			flex-flow: column wrap;
			justify-content: center;
			align-content: center;
			padding-top: 1rem;
		}
		
		#scan {
			display: none;
		}
		
		#scan {
			display: none;
		}
		
		.scan #logo {
			display: none;
			width: 50%;
			margin: auto;
			margin-bottom: 1rem;
			border-radius: 100%;
		}
		
		.scan #wxLogo {
			display: none;
			width: 90%;
			margin: auto;
			margin-bottom: 1rem;
		}
		
		#phoneModel {
			display: none;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 1000;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 0 5%;
		}
		
		#phoneModel .modal-content {
			flex: auto;
			width: 90%;
			padding-bottom: 5px;
			border-radius: 10px;
			background-color: #fff;
			text-align: center;
		}
		
		#phoneModel .modal-content h3 {
			padding: 10px;
			font-weight: bold;
			font-size: 16px;
		}
		
		#phoneModel .modal-content .inputBox li {
			width: 90%;
			margin: 5px auto;
		}
		
		#phoneModel .modal-content .inputBox li input {
			height: 34px;
			line-height: 34px;
			border-radius: 5px;
			border: 1px solid #909090;
			padding: 0 5px!important;
		}
		
		#phoneModel .modal-content .buttonBox {
			width: 90%;
			margin: 5px auto;
			display: flex;
		}
		
		#phoneModel .modal-content .buttonBox li {
			flex: 1;
		}
		
		#phoneModel .modal-content .buttonBox li input {
			height: 30px;
			line-height: 30px;
			width: 90%;
			border: none;
			text-align: center;
			color: #F78800;
			background-color: #ffffff;
			border-radius: 5px;
			padding: 0!important;
		}
        .mui-btn-block{
            font-size: 18px;
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 15px 0;
        }
        .mui-btn-yellow{
            color: #fff;
            border: 1px solid #f0ad4e;
            background-color: #f0ad4e;
        }
        .mui-btn{
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42;
            position: relative;
            display: inline-block;
            margin-bottom: 0;
            padding: 6px 12px;
            cursor: pointer;
            -webkit-transition: all;
            transition: all;
            -webkit-transition-timing-function: linear;
            transition-timing-function: linear;
            -webkit-transition-duration: .2s;
            transition-duration: .2s;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 3px;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
            border-bottom-left-radius: 3px;
            background-color: #fff;
            background-clip: padding-box;
        }
        .mui-pull-left{
            float: left;
        }
        .mui-pull-right{
            float: right;
        }
</style>