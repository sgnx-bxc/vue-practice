/** 表格组件与查询条件组件的混入 **/
export default {
  // 数据对象以组件优先
  data() {
    return {
      setSearchAndGetDatas: true, // 设置查询条件的同时获取数据
      searchInfo: {}, // 查询条件
      tableRef: null
    }
  },
  computed: {
    // 表格数据总数
    total() {
      if (this.tableRef) {
        return this.tableRef.total
      } else {
        return 0
      }
    }
  },
  // 钩子合并为数组，都会被调用
  mounted() {},
  // 值对象methods、components、directives，取组件对象的键值对
  methods: {
    // tableForm查询事件
    searchEvent(formModel) {
      this.setSearchInfo(formModel)
    },
    // tableForm重置事件
    resetEvent(formModel) {
      this.setSearchInfo(formModel)
    },
    // 设置查询条件
    setSearchInfo(formModel) {
      // 设置查询条件
      this.searchInfo = JSON.parse(JSON.stringify(formModel))
      // 将查询条件表单数据转换成查询条件数据
      if (this.convertSearchInfo) {
        // 若组件中定义了同名方法convertSearchInfo，则调用
        this.convertSearchInfo(formModel)
      }
      // 设置表格参数
      this.initTable() // NNNN 该行代码会导致查询/重置时表格自定义下拉框的选中值清空，会再次触发tableMain.vue的init()方法，因此需要对这种情况再次处理。更好的方法是在具体的业务组件中对此种情况处理？？不，还是在组件中封装更加合理，减少开发时对组件的依赖程度和参数传递。
      // 获取表格数据
      if (this.setSearchAndGetDatas) {
        this.getDatas()
      }
    },
    // 获取数据，flag为ture强制跳转第一页，pageNum跳转到指定页
    getDatas(flag = true, pageNum = null) {
      if (this.$refs.tableRef) {
        this.tableRef = this.$refs.tableRef
        // 调用tableMain方法获取表格数据
        this.$refs.tableRef.getDatas(flag, pageNum)
      }
    }
  }
}
