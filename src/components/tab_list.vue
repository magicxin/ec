<style>
  #tab_list {
    overflow:scroll;
    width: 100%;
    word-break:keep-all;           /* 不换行 */
    white-space:nowrap;
    font-size: 1.2rem;
  }

  /*#tab_list .actived {
    color: #F98700;
    border-bottom: 2px solid #F98700;
  }*/

  #tab_list::-webkit-scrollbar {
    width: 0px;
  }

  #tab_list .tabs_wrapper{
    display: inline-block;
    width: auto;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 2px 8px;
    position: relative;
  }

  #tab_list .tabs_text{
    position: relative;
    color: #868686;
    text-align: center;
  }

  #tab_list .active .tabs_offline{
    width: 100%;
    height: 2px;
    background-color: #F98700;
    position: relative;
    bottom: 0;
    z-index: 9999;
    transition: all .3s;
  }

  /*#tab_list .tabs_text.active::after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: -4px;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #F98700;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scale(1, 2);
    transform: scale(1, 2);
    transition: all .5s;
  }*/

</style>
<template>
  <div>
    <is-tabs :value="activeTab" @change="handle">
      <is-tab title="50元优惠券" value="tab1">
      </is-tab>
      <is-tab title="50元优惠券" value="tab2">
      </is-tab>
      <is-tab title="50元优惠券" value="tab3">
      </is-tab>
      <is-tab title="50元优惠券" value="tab4">
      </is-tab>
      <is-tab title="50元优惠券" value="tab5">
      </is-tab>
    </is-tabs>

    <div v-if="activeTab === 'tab1'">
      hello
    </div>
    <div v-if="activeTab === 'tab2'">
      world
    </div>
    <div v-if="activeTab === 'tab3'">
      hello
    </div>
    <div v-if="activeTab === 'tab4'">
      world
    </div>
    <div v-if="activeTab === 'tab5'">
      hello
    </div>
  </div>
</template>
<script>
  import tabs from 'components/tabs.vue'
  import tab from 'components/tab.vue'
  export default {
    components: {
      isTabs: tabs,
      isTab: tab
    },
    data () {
      return {
        activeTab: 'tab1',
        tabs: [{
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }, {
          name: '50元优惠券'
        }],
        isActive: true,
        activeTabs: '1'
      }
    },
    methods: {
      handle (val) {
        this.activeTab = val
      },
      init () {
        let els = document.querySelectorAll('.tabs_wrapper')
        els.forEach((el) => {
          console.log(11)
          el.addEventListener('click', registeredClickFunction)
        })
        // let el = els[2]
        // let offest = el.getBoundingClientRect().left
        function registeredClickFunction (event) {
          console.log('heheh')
          let offest = els.getBoundingClientRect()
          let left = event.pageX - offest.left - document.body.scrollLeft
          console.log(left)
        }
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
