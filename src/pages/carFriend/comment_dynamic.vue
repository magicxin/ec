<style>
  #comment_dynamic.border_bottom {
    border-bottom: 1px solid #929292;
  }

  #comment_dynamic {
    background-color: #fff;
    min-height: 100%;
    position: fixed;
    top: 0px;
    line-height: 50px;
    width: 100%;
    z-index: 9111289;
  }

  #comment_dynamic .header-right-img {
    width: 50px;
  }

  #comment_dynamic .header-content {
    text-align: center;
    font-size: 1.6rem;
  }

  #comment_dynamic .mu-flat-button {
    position: relative;
    top: 8px;
    left: -15px;
    font-size: 16px;
  }
  #comment_dynamic .mu-raised-button.disSend {
    position: relative;
    top: 10px;
    right: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 13px;
    background-color: #F7F7F7;
    border: solid 1px #C0C0C0;
  }
  #comment_dynamic .mu-raised-button.send {
    position: relative;
    top: 10px;
    right: 30px;
    height: 30px;
    min-width: 30px;
    font-size: 13px;
    background-color: #F98700;
    color: #fff;
  }

  #comment_dynamic .left {
    padding-left: 10px;
  }

  #comment_dynamic .content {
    background-color: #fff;
  }
  #comment_dynamic .content textarea {
    padding: 10px;
    font-size: 16px;
    line-height: 24px;
    border: none;
    resize: none;
    outline: none;
    overflow: auto;
    width: 100%;
    height: 200px;
  }
  #comment_dynamic .content textarea.active {
    border: none;
  }
  #comment_dynamic .content textarea.focus {
    border: none;
  }
</style>
<template>
  <div id="comment_dynamic">
    <form>
      <div layout="row" layout-align="center baseline " class="header-bar border_bottom" >
        <div layout="row" layout-align="flex-start center" class="header-right-img left">
          <mu-flat-button label="取消" v-tap="{methods: cancel}"/>
        </div>
        <div flex class="header-content">
          评论
          <slot name="center"></slot>
        </div>
         <div v-if="queryData.content.length == 0" class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow">
          <slot name="right"></slot>
          <mu-raised-button class="disSend" label="发送" disabled/>
        </div>
        <div class="header-right-img" layout-align="flex-end center" layout="row" flex="nogrow" v-else>
          <slot name="right"></slot>
          <mu-raised-button v-tap="{methods: submit}" class="send" label="发送"/>
        </div>
      </div>
      <div class="content">
        <textarea v-model="queryData.content" placeholder="说点什么吧"></textarea>
      </div>
    </form>
  </div>
</template>

<script>
  import publish from 'components/publish'


  export default {
    data () {
      return {
        queryData: {
          content: ''
        }
      }
    },
    methods: {
      cancel () {
        this.$router.go(-1)
        return
      },
      submit () {
        this.$.get({
          methodName: 'CreateSpaceComment',
          content: this.queryData.content,
          spaceId: this.$route.params.dynamicId
        }).then(resp => {
          if (resp.data.resultCode === '100') {
            this.$router.go(-1)
            return
          }
        })
      }
    },
    // watch: {
    //   content (val) {
    //     let content = val
    //   }
    // },
    components: {
      publish
    }
  }
</script>
