<template>
	<section id="sg_goods_panorama">

      <!-- header -->
	  <div class="header">
<!--            <input type="button" class="left" @click="selectProduct" value="车型">-->
            <div class="l-btn" @click="link">
                <img :src="reTurn" slot=""/>
            </div>
            <div class="middle">车辆展示</div>
<!--            <div style="width: 100px; height: 100%;"></div>-->
            <input type="button" class="right" @click="selectProduct" value="选择车型">
                <div class="items" v-show="show_items">
                    <div class="item" v-for="(item,index) in selectedFilters" :key="index" @click="naviToAnother" :id="item.id">
                        {{item.title}}
                    </div>
                </div>
          </input>
            </div>


        <!-- filters -->
<!--        <cascaded-menu slot="right" :options="filters" :selected="selectedFilters" @selected-change="filterChange"/>-->

	  </icar-header>

      <!-- tabs -->
      <template v-if="tabs && tabs.length">
          <mu-tabs :value="selectedTab" @change="tabChange">
            <mu-tab v-for="(tab,index) in tabs" :key="index" :value="tab.value" :title="tab.title"/>
          </mu-tabs>
          <section class="tabs-container">
            <template v-for="tab in tabs">
                <template v-if="selectedTab=='4'">
                    <iframe id="otherWin" v-if="selectedTab==tab.value" :src="tab.filePath" frameborder="0"></iframe>
                </template>
<template v-else-if="selectedTab=='3'">
                      <video v-if="selectedTab==tab.value" :src="tab.filePath" width="100%" height="100%" controls></video>
                </template>
<template v-else-if="selectedTab=='2'">
                <!--start 外观 -->
<!--                <button @click="bbb" v-if="selectedTab==tab.value">aaa</button>-->
                <div class="select-content">
                   <select class="select-color" @change="getKey" v-if="selectedTab==tab.value">
                    <option v-for="(item,index) in colors" :key="index" :value="item">
                        {{item}}</option>
                  </select>
                </div>
                <iframe v-if="selectedTab==tab.value" :src="addPath('/vrRotate/index.html')" ref="otherWin"></iframe>
<!--                <iframe v-if="selectedTab==tab.value" src="192.168.50.23:8080/vrRotate/index.html" id="otherWin"></iframe>-->
<!--
                   <div v-if="selectedTab==tab.value">
                        <div style="width:100%;">
                          <img id='rotateimage' src='../../../static/imageRotate/images/DSC_0754.jpg' width='100%'>
                          </div>
                        <div style="text-align:center;clear:both;">

                        <script src="/gg_bd_ad_720x90.js" type="text/javascript"></script>
                        <script src="/follow.js" type="text/javascript"></script>

                        </div>
                    </div>
-->
                <!--end 外观 -->
                </template>
<template v-else>
                    <img-gallery v-if="selectedTab==tab.value" :imgs="tab.thumbnail" :large="tab.filePath"/>
                </template>
</template>
</section>
</template>
</section>
</template>
<!--
    <script type="text/javascript" src="../../../static/imageRotate/jquery.js"></script>
    <script type="text/javascript" src="../../../static/imageRotate/scripts/loadImage.js"></script>
	<script type="text/javascript" src="../../../static/imageRotate/scripts/dopelessRotate.js">
    </script>
-->
<!--<link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>-->
<script>
    //    alert('in goods pano page')
    import IcarHeader from 'components/my-header'
    import iconPath from 'assets/left-gray.svg'
    import reTurn from 'assets/left-gray.svg'
    import ImgGallery from 'components/img-gallery'
    import CascadedMenu from 'components/cascaded-menu'

    //    const apiHost = require('settings/api-host')
    import axios from 'axios'

    export default {
        components: {
            IcarHeader,
            ImgGallery,
            CascadedMenu
        },
        data() {
            return {
                iconPath: iconPath,
                tabs: [],
                filter: [],
                selectedFilters: [],
                selectedTab: "",
                productId: "",
                show_items: false,
                reTurn: reTurn,
                userInfo: "",
                colors: [],
                selectColor: '',
                colorName: {
                    red: '红色',
                    yellow: '黄色',
                    white: '白色',
                    black: '黑色',
                    grey: '灰色'
                },
                hideVr : false
            }

        },
        watch: {
            '$route': {
                immediate: true,
                handler: function(to, from) {
                    if (to.name == 'sg_goods_panorama') {
                        this.initData()
                    }
                }
            },
            selectedTab: function(v) {
                var that = this;
                let data = {
                    "methodName": "QueryVrMedia",
                    "shopId": this.userInfo.shop.id,
                    "userId": this.userInfo.userId,
                    "showProductId": this.productId,
                    "color": this.colors[0]
                }
                if (this.selectedTab == 2) {
                    setTimeout(function() {
                        console.log(that.$refs)
                        that.$refs.otherWin[0].contentWindow
                            .postMessage(
                                JSON.stringify(data),
                                that.$.host+'/');
                    }, 2000)
                }
            }
        },
        created() {
            //            alert(location.host)
            let that = this;

                that.userInfo = {
                	userId:this.$.userId,
                	shop:{
                		id:this.$.shopId
                	}
                }
                //            alert(info.shop.id)
                that.productId = that.$route.query.id
                //            console.log(this.productId)
                that.fillTabs(that.productId)
                that.searchOtherProduct()

        },
        mounted() {
//            axios.get("/rest/json.jhtml?req=" + JSON.stringify({
//                "clientType": 2,
//                "methodName": "QueryVrMedia",
//                "shopId": "18",
//                "userId": "1392",
//                "showProductId": "1667"
//            }), {
//                headers: {
//                    token: "24302887-5345-42ee-b20a-0c8f5175c7a9"

//                }
//            }).then((res) => {
//                let imagelist = []
//                let zoomlist =[]
//                console.log(res)
//                res.data && res.data.data.forEach(function(item, index) {
//                    if (item.mediaType === "appearance" && item.color === 'red') {
//
//                        if (item.hasOwnProperty('thumbnail')) {
//                            imagelist.push( item.thumbnail);
//                        } else {
//                            imagelist.push(item.filePath);
//                        }
//                        zoomlist.push( item.filePath);
//                    }
//                })
//                console.log(imagelist)
//            })
        },
        methods: {
            //            bbb(){
            //                // 通过 postMessage 向子窗口发送数据
            //            console.log(this.$refs)
            //		 		this.$refs.otherWin[0].contentWindow
            //			 	.postMessage(
            //				 	"1",
            //					"http://192.168.50.23:8080/");
            //
            //            },
            initData() {
                this.filters = []
                //                this.filterChange([this.$route.query.id], -1, 0)
            },
            searchOtherProduct() {
                var that = this;
                let filterTitle = '';
                this.$.get({
                    "methodName": "QuerySeriesProduct",
                    "shopId": that.userInfo.shop.id,
                    "userId": that.userInfo.userId,
                    "productId": that.productId
                }).then((res) => {
                    console.log(res)
                    //                      alert(res[0])
                    this.makeFilterData(res.data.data, (result) => {
                        result.forEach((item, index) => {
//                            if(result[index].title.length>7){
//                                filterTitle = result[index].title.slice(0,7) + '...'
//
//                            }else {
//                                filterTitle = result[index].title
//                            }
                            this.filter = '';
                            this.selectedFilters.push({
                                title: result[index].selectFilter,
                                id: result[index].value
                            })
                        })
                    })
                })
            },
            selectProduct() {
                this.show_items = !this.show_items;
            },
            fillTabs(productId) {
                var that = this;
                //                this.tabs = []
                //                this.selectedTab = "";
                //               product.get.bind(this)({},(data)=>{
                //                 this.tabs=data
                //                 this.selectedTab=this.tabs[0].value
                //               },(err)=>{
                //                 console.log(err)
                //               })

                //                插入tab选项
                this.$.get({
                    "methodName": "QueryVrMedia",
                    "shopId": that.userInfo.shop.id,
                    "userId": that.userInfo.userId,
                    "showProductId": productId
                }).then((res) => {
//                                        console.log(JSON.stringify(res.data))
                    if (res.data.data.length == 0) {
                        this.$.toast("该产品暂无vr资源")
                        return false
                    } else {
                         this.makeData(res.data.data, (result) => {
//                                 for (var item in result) { console.log(result)
									console.log(result[0].filePath)
                                    axios.get(result[0].filePath)
                                    .then((res)=>{
                                        console.log(res.message)
                                        if(res.message&&res.message.indexOf('404')>-1){
//                                          result.shift()
                                            that.tabs = result
//                                          console.log(that.tabs)
                                            that.selectedTab = that.tabs[0].value
                                        }else {
                                            that.tabs = result
                                            that.selectedTab = that.tabs[0].value
                                        }
                                     })
                                    .catch((e)=>{
                                        console.log(e)
                                        that.tabs = result
                                        that.selectedTab = that.tabs[0].value
                                    })
//                               }
                        //                    console.log(that.tabs)
                       })
                    }
                })

            },
            tabChange(selectedTab) {
                this.selectedTab = selectedTab
                if (this.selectedTab == 2) {

                }
            },
            naviToAnother(e) {
                console.log(e.target.id)
                this.fillTabs(e.target.id)
                this.show_items = !this.show_items;
            },
            link() {
                this.$router.replace({
                    name: 'sg_goods_car',
                    params: {
                        id: this.productId,
                        name: '1'
                    }
                })
            },
            makeData(data, success) {
                var that = this;
                //    var i = 0;
                console.log(data)
                let retData = []
                if (data.length == 0) return success(retData)
                let vr, testdrive, appearance, interiors, space, diagram;
                vr = {
                    title: "",
                    value: "",
                    filePath: []
                }
                testdrive = {
                    title: "",
                    value: "",
                    filePath: []
                }
                appearance = {
                    title: "",
                    value: "",
                    filePath: [],
                    thumbnail: []
                }
                interiors = {
                    title: "",
                    value: "",
                    filePath: [],
                    thumbnail: []
                }
                space = {
                    title: "",
                    value: "",
                    filePath: [],
                    thumbnail: []
                }
                diagram = {
                    title: "",
                    value: "",
                    filePath: [],
                    thumbnail: []
                }

                data.forEach((item, index) => {
//                                        console.log(item.title)
                    if (item.mediaType === "vr") {
                        vr.title = item.title;
                        vr.value = 4;
                        vr.filePath = item.filePath + "/index.html";
                    }
                    if (item.mediaType === "testdrive") {
                        testdrive.title = item.title;
                        testdrive.value = 3;
                        testdrive.filePath = this.addPath(item.filePath);
                    }
                    if (item.mediaType === "appearance") {
                        appearance.title = item.title;
                        appearance.value = 2;
//                        if (!that.colors.hasOwnProperty(item.color)) {
//                            that.colors[item.color] = that.getNameByKey(item.color);
//                        }
                        if(that.colors.indexOf(item.color) == -1){
                            that.colors.push(item.color)
                           }
//                        console.log(this.colors)
                        if (item.hasOwnProperty('thumbnail')) {
                            appearance.thumbnail.push(this.addPath(item.thumbnail));
                        } else {
                            appearance.thumbnail.push(this.addPath(item.filePath));
                        }
                        appearance.filePath.push(this.addPath(item.filePath));
//                      alert(this.addPath(item.filePath))
                    }
                    if (item.mediaType === "interiors") {
                        interiors.title = item.title;
                        interiors.value = 1;

                        if (item.hasOwnProperty('thumbnail')) {
                            interiors.thumbnail.push(this.addPath(item.thumbnail));
                        } else {
                            interiors.thumbnail.push(this.addPath(item.filePath));
                        }
                        //                       console.log(interiors.thumbnail)
                        interiors.filePath.push(this.addPath(item.filePath));
                    }
                    if (item.mediaType === "space") {
                        space.title = item.title;
                        space.value = 5;

                        if (item.hasOwnProperty('thumbnail')) {
                            space.thumbnail.push(this.addPath(item.thumbnail));
                        } else {
                            space.thumbnail.push(this.addPath(item.filePath));
                        }
                        space.filePath.push(this.addPath(item.filePath));
                    }
                    if (item.mediaType === "diagram") {
                        diagram.title = item.title;
                        diagram.value = 0;

                        if (item.hasOwnProperty('thumbnail')) {
                            diagram.thumbnail.push(this.addPath(item.thumbnail));
                        } else {
                            diagram.thumbnail.push(this.addPath(item.filePath));
                        }
                        diagram.filePath.push(this.addPath(item.filePath));
                    }
                })
//              alert(JSON.stringify(appearance))
//				console.log(interiors)
				retData.push(vr)
				retData.push(testdrive)
				retData.push(appearance)
				retData.push(interiors)
				retData.push(space)
				retData.push(diagram)
//              retData = retData.concat(vr, testdrive, appearance, interiors, space, diagram)
                console.log(retData)
                that.getName(retData)
                success(that.getName(retData))
            },
            makeFilterData(data, success) {
                let retData = []
                console.log(data)
                if (data && data.length > 0) {
                    data.forEach((item, index) => {
                        retData.push({
                            title: item.name.split(" ")[0],
//                            selectFilter: item.name.split(" ").splice(1).toString(),
                            selectFilter: item.name,
                            value: item.id
                        })
                    })
                }
                success(retData)
            },
            getName(o) {
                //    console.log(o)
                if (o.length > 0) {
                    o.forEach((item, index) => {
                        if (!item.title) {
                            //                console.log(item)
                            o.splice(index, 1)
                        }
                    })
                }
                return o
            },
            getKey(e) {
                this.selectColor = e.target.value
                console.log(e.target.value)
                let data = {
                    "methodName": "QueryVrMedia",
                    "shopId": this.userInfo.shop.id,
                    "userId": this.userInfo.userId,
                    "showProductId": this.productId,
                    "color": e.target.value
                }
                if (this.selectedTab == 2) {
                    //                        console.log(this.$refs)
                    this.$refs.otherWin[0].contentWindow
                        .postMessage(
                            JSON.stringify(data),
                            this.$.host+'/');
                }
            },
            getNameByKey(str) {
                return this.colorName[str]
            },
            getFirstKey(){
                for(var key in this.colors){
                    console.log(key)
                    return key
                }
            }
        }
    }


</script>

<style lang="scss">
    @import "../../scss/theme.scss";
    #sg_goods_panorama {
        height: 100%;
        #myHeader .header-right-img {
            width: 100px;
        }
        .mu-tabs {
            background: $gray-bg;
        }
        .tabs-container {
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            height: 101vh;
            padding-top: 100px;
            margin-top: -100px;
            iframe {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        }
        .header {
            font-size: 1.6em;
            color: #333;
            height: 50px;
            position : relative;
            z-index:1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #666;
            background: $gray-bg;
        }
        .right {
            position: relative;
            color: #666;
            font-size: .7em;
            width: 100px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: $gray-bg;
            border: none;
        }
        .l-btn {
            position: relative;
            min-width: 100px;
            height: 50px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            z-index: 10;
            padding: 0 1em;
        }
        .left img {
            width: 30px;
            height: 30px;
        }
        .right:hover {
            cursor: pointer;
        }
        .right:focus {
            outline: none;
        }
        .items {
            min-width: 100px;
            max-height: 500px;
            position: absolute;
            display: flex;
            flex-flow: column;
            top: 52px;
            right: 0;
            z-index: 2000;
            background: #333;
            color: #fff;
            font-size: .7em;
            border-radius: 5px;
            padding: 0 1em;
            overflow-y: auto;
        }
        .item {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2em;
            border-bottom: 1px solid #999;
        }
        video {
            height: 300px;
        }
        iframe {
            border: none;
            margin: 0;
            padding: 0;
        }
        .select-content {
            display: flex;
            justify-content: flex-end;
        }
        .select-color {
            margin: 1em 1em 1em 0;
        }
    }

</style>
