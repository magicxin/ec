<style scoped>
.pro_parameter_title {
  margin-top: 16px;
  margin-bottom: 5px;
  margin-right: 8px;
}
.pro_parameter_title span:before {
  content: '丨';
  color: #f99200;
}
.pro_parameter_title span {
  margin-left: 14px;
}
.pro_parameter_table table {
  width: 100%;
}
.pro_parameter_title label {
  float: right;
  padding-right: 10px;
}
.pro_parameter_table table tr td {
  border-top: 1px solid #d7d7d7;
  padding: 8px;
}
.pro_parameter_table table:last-child tr td{
  border-bottom: 1px solid #d7d7d7;
}
.pro_parameter_table table tr td:nth-child(1) {
  background-color: #f7f7f7;
  width: 40%;
  text-align: right;
  border-right: 1px solid #d7d7d7;
}
.pro_parameter_table table tr td:nth-child(2) {
  background-color: #fff;
  color: #929292;
  width: 55%;
  text-align: center;
}
</style>
<template>
  <div id="parameters">
    <div v-for="item in parameters">
      <div class="pro_parameter_title sm_f">
        <span>{{ item.name }}</span>
        <label v-if="categoryType == '0'">
          <label class="ion-ios-minus-empty"> 无 </label>
          <label> ○选配 </label>
          <label> ●标配 </label>
        </label>
      </div>
      <div class="pro_parameter_table mini_f">
        <table v-for="parameter in item.parameters">
          <tr>
            <td>{{ parameter.name }}</td>
            <td>{{ parameter.value | choiceFilter(parameter.type) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bbb',
  props: {
    parameters: {
      type: Array,
      default () {
        return []
      }
    },
    categoryType: {
      type: String,
      default () {
        return '0'
      }
    }
  },
  computed: {
    number () {
      console.log(this.parameters)
      return this.parameters
    }
  },
  filters: {
    /* eslint-disable */
    choiceFilter: function (value, type) {
      if (typeof (value) !== 'undefined') {
        if (type != 0) {
          value = value.replace('1', '●')
          value = value.replace('1', '●')
          value = value.replace('0', '—')
          value = value.replace('0', '—')
          value = value.replace('2', '○')
          value = value.replace('2', '○')
          value = value.replace(';', ' / ')
          value = value.replace(',', '')
          value = value.replace(',', '')
          return value
        } else {
          return value
        }
      } else {
        return '无'
      }
    }
  }
  // mounted () {
  //   let setHeigt = setInterval(() => {
  //     if (document.getElementById('parameters')) {
  //       document.getElementById('parameters').style.height = document.documentElement.clientHeight === 0 ? document.body.clientHeight : document.documentElement.clientHeight - 180 + 'px'
  //       clearInterval(setHeigt)
  //     }
  //   }, 40)
  // }
}
</script>
