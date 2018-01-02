<style>
.goodsList-tabs, .goodsList-body{
  background-color: #fff
}

#goodlist_home ._desc{
  display: inline-block;
  margin-bottom: 6px;
  background-color: #FFB400;
  color: #fff;
  padding: 1px 2px;
  border-radius: 3px;
  padding: 2px 10px;
}

#goodlist_home h4.label{
  padding-bottom: 4px;
  padding-top: 4px;
}

#goodlist_home h4.label::before{
  content: "丨";
  color: #C60007;
  width: 20px;
  font-weight: 600;
}

#goodlist_home .number{
  text-align: right;
  display:block;
  margin-right: 20px;
  color: #A6A6A6;
}

</style>
<template>
    <div id="goodlist_home" class="background-gray">
      <div class="goodsList-tabs">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="test">
          <mu-tab value="tab1"  title="汽车"/>
          <mu-tab value="tab2"  title="汽车装饰"/>
          <mu-tab value="tab3"  title="车载电器"/>
          <mu-tab value="tab4"  title="安全自驾"/>
          <mu-tab value="tab5"  title="美容清洗"/>
        </mu-tabs>
      </div>
      <div class="goodsList-body">
        <div v-if="activeTab === 'tab1'">
          <grids :dataList="queryData">
            <grid v-for="(item,index) in queryData" :key="index">
              <div class="grid-icon">
                <img :src="item.icon" alt="">
              </div>
              <p class="grid-label">
                {{item.name}}
              </p>
            </grid>
          </grids>
        </div>

        <div v-if="activeTab === 'tab2'">
          <h2>Tab Two</h2>
          <mu-icon value="home"/>
          <mu-icon value="flight_takeoff" color="red"/>
          <mu-icon value="cloud_download" color="orange"/>
          <mu-icon value="videogame_asset" color="blue"/>
        </div>
        <div v-if="activeTab === 'tab3'">
          <h2>Tab Three</h2>
          <p>
            这是第三个 tab
          </p>
        </div>
        <div v-if="activeTab === 'tab4'">
          <h2>Tab Three</h2>
          <p>
            这是第四个 tab
          </p>
        </div>
        <div v-if="activeTab === 'tab5'">
          <h2>Tab Three</h2>
          <p>
            这是第五个 tab
          </p>
        </div>
      </div>
      <div class='divide_no_bod'></div>
      <order-header widthVal="30%">
        <h4 slot="label" class="label">热销商品</h4>
      </order-header>

      <panel v-go="'sg_goods({id:1, name:2})'">
        <a class="_desc" slot="desc">原厂配件</a>
        <price slot="price">
        </price>
        <span slot="number" class="number">已售:3件 /余10件</span>
      </panel>

      <panel v-go="'sg_goods({id:1, name:2})'">
        <a class="_desc" slot="desc">原厂配件</a>
        <price slot="price">
        </price>
        <span slot="number" class="number">已售:3件 /余10件</span>
      </panel>
    </div>
</template>
<script>
  import pickind01 from 'assets/pic_kind_01.png'
  import pickind02 from 'assets/pic_kind_02.png'
  import pickind03 from 'assets/pic_kind_03.png'
  import pickind04 from 'assets/pic_kind_04.png'
  import pickind05 from 'assets/pic_kind_05.png'
  import pickind06 from 'assets/pic_kind_06.png'
  import pickind07 from 'assets/pic_kind_07.png'
  import pickind08 from 'assets/pic_kind_08.png'
  import pickind09 from 'assets/pic_kind_09.png'
  import pickind10 from 'assets/pic_kind_10.png'
  import pickind11 from 'assets/pic_kind_11.png'
  import pickind12 from 'assets/pic_kind_12.png'
  import shopcar from 'assets/shoppingcar.svg'
  import left from 'assets/left-gray.svg'
  import panel from 'components/panel.vue'
  import searchGoods from 'components/searchGoods'
  import grids from 'components/grids'
  import grid from 'components/grid'
  import price from 'components/price'
  import icarCheckbox from 'components/icar-checkbox'
  import orderHeader from 'components/order-header.vue'
  import origin from 'components/origin'
  import icarHeader from 'components/my-header'
  //


  export default {
    data () {
      return {
        activeTab: 'tab1',
        shopcar,
        left,
        queryData: [{
          icon: pickind01,
          name: '脚垫'
        }, {
          icon: pickind02,
          name: '座垫'
        }, {
          icon: pickind03,
          name: '后背垫箱'
        }, {
          icon: pickind04,
          name: '头枕腰靠'
        }, {
          icon: pickind05,
          name: '方向盘套'
        }, {
          icon: pickind06,
          name: '香水'
        }, {
          icon: pickind07,
          name: '车内装饰'
        }, {
          icon: pickind08,
          name: '车衣'
        }, {
          icon: pickind09,
          name: '空气净化'
        }, {
          icon: pickind10,
          name: '贴膜'
        }, {
          icon: pickind11,
          name: '车身装饰品'
        }, {
          icon: pickind12,
          name: '功能小件'
        }]
      }
    },
    methods: {
      handleTabChange (val) {
        this.activeTab = val
      }
    },
    components: {
      panel,
      searchGoods,
      grids,
      price,
      icarCheckbox,
      orderHeader,
      grid,
      origin,
      icarHeader
    }

  }
</script>
