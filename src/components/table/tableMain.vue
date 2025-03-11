<template>
  <div class="salaxy-table">
    <!-- 一、表格 -->
    <el-table
      ref="tableRef"
      :key="tableKey"
      :row-key="rowKey === '' ? defaultOption.rowKey : rowKey"
      :data="curListData"
      :border="defaultOption.border"
      :stripe="defaultOption.stripe"
      :height="defaultOption.tableHeight"
      :row-class-name="tableRowClassName"
      :header-cell-class-name="headerCellClassName"
      :highlight-current-row="defaultOption.showCurrentRow"
      :current-row-key="curRow[defaultOption.rowKey] || ''"
      :expand-row-keys="expandList"
      @select="selectHandler"
      @select-all="selectAllHandler"
      @selection-change="tableSelectionChange"
      @expand-change="tableExpandChange"
      @sort-change="tableSortChange"
      @filter-change="filterChange"
      @current-change="handleCurrentChange"
      @header-dragend="doLayout"
    >
      <!-- 1. 多选框列 -->
      <template v-if="defaultOption.showSelection">
        <el-table-column
          fixed="left"
          align="center"
          type="selection"
          width="55"
        ></el-table-column>
      </template>
      <!-- 2. 自定义展开行内容 具名+作用域 插槽名为expand -->
      <template v-if="defaultOption.showExpand">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <slot name="expand" v-bind:tableScope="scope"></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 3. 根据theadList依次展示每列 -->
      <el-table-column
        v-for="(item, index) in curTheadList"
        :key="item.prop"
        :column-key="item.prop + '_' + index"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="
          item.showTooltip === undefined ? true : item.showTooltip
        "
        :align="item.align ? item.align : 'center'"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :width="item.width ? item.width : 'auto'"
        :min-width="item.minWidth ? item.minWidth : 'auto'"
        :filters="filerItem(item)"
        :filter-method="filterMethodItem(item)"
        :filter-multiple="
          item.filterMultiple === undefined ? false : item.filterMultiple
        "
        :filtered-value="
          item.filtersChecked === undefined ? undefined : item.filtersChecked
        "
      >
        <!-- 3.1 自定义表头筛选 -->
        <template #header>
          <span
            :class="{
              'filter-highlight':
                item.filtersChecked && item.filtersChecked.length > 0
            }"
            :title="item.label"
          >
            {{ item.label }}
          </span>
          <el-popover
            ref="filterPopRef"
            placement="bottom"
            trigger="click"
            popper-class="table-filters-popper"
            :visible-arrow="false"
            @after-enter="headerFiltersClick(item, index)"
            @hide="filtersListMouseleave(index)"
          >
            <!-- 筛选内容 -->
            <div class="table-filters-list">
              <!-- 列表过滤 -->
              <el-input
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                size="mini"
                v-model.trim="filtersInput"
                clearable
              >
              </el-input>
              <!-- 多选框 -->
              <el-checkbox-group
                v-model="filtersChecked"
                @change="filtersCheckedChange"
              >
                <el-checkbox
                  v-for="(item, index) in newfiltersList"
                  :key="index"
                  :label="item.value"
                  :title="item.text"
                  >{{ item.text }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="none-data" v-show="newfiltersList.length === 0">
                无数据
              </div>
              <!-- 操作按钮 -->
              <div class="opt">
                <div class="opt-left">
                  <el-checkbox
                    :indeterminate="isIndeterminate"
                    v-model="filtersCheckAll"
                    @change="filtersCheckAllChange"
                    >全选
                  </el-checkbox>
                </div>
                <div class="opt-right">
                  <div class="opt-btn" @click="filtersOkEvent">筛选</div>
                  <div class="opt-btn" @click="filtersResetEvent">重置</div>
                </div>
              </div>
            </div>
            <!-- 按钮 -->
            <span
              v-if="
                item.filters !== undefined &&
                item.filterMultiple === true &&
                defaultOption.showSlotFilterHeader
              "
              :class="{
                'filter-highlight':
                  item.filtersChecked && item.filtersChecked.length > 0
              }"
              class="el-table__column-filter-trigger"
              slot="reference"
            >
              <i class="el-icon-arrow-down"></i>
            </span>
          </el-popover>
        </template>
        <!-- 3.2 自定义列内容的显示 -->
        <template slot-scope="scope">
          <!-- (1) 自定义列 具名+作用域 插槽名为列prop -->
          <template v-if="item.isSlot">
            <slot :name="item.prop" v-bind:tableScope="scope"></slot>
          </template>
          <!-- (2) 默认显示列值 -->
          <span
            v-else-if="
              scope.row[item.prop] !== '' &&
              scope.row[item.prop] !== null &&
              scope.row[item.prop] !== undefined
            "
            :class="item.tdClass"
            >{{ scope.row[item.prop] }}</span
          >
          <!-- (3) 默认没有数据默认显示‘--’ -->
          <span v-else>--</span>
        </template>
      </el-table-column>
      <!-- 4. 操作列 -->
      <template v-if="defaultOption.showOperate">
        <el-table-column
          fixed="right"
          align="center"
          :label="defaultOption.optLabel"
          :width="curOperateRowWidth"
        >
          <template slot-scope="scope">
            <el-button
              v-if="defaultOption.showView"
              type="text"
              class="table-opt-btn"
              @click="operateEvent('viewEvent', scope.row, scope.$index)"
            >
              查看
            </el-button>
            <el-button
              v-if="defaultOption.showEdit"
              type="text"
              class="table-opt-btn"
              @click="operateEvent('editEvent', scope.row, scope.$index)"
            >
              编辑
            </el-button>
            <el-button
              v-if="defaultOption.showDelete"
              type="text"
              class="table-opt-btn"
              @click="operateEvent('deleteEvent', scope.row, scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 二、分页 -->
    <div class="salaxy-table-pagination">
      <!-- 当前选中 -->
      <div class="div-selection" v-if="defaultOption.showSelection">
        当前选中条数：
        <div class="show-count">{{ selectionList.length }}</div>
        <div
          class="clear-btn"
          v-if="selectionList.length > 0"
          @click="clearSelection"
        >
          清除选中
        </div>
      </div>
      <!-- 占位，保证分页在右边 -->
      <div v-else></div>
      <!-- 分页 -->
      <el-pagination
        v-if="showPagination && defaultOption.showPagination"
        @current-change="pageChange"
        @size-change="sizeChange"
        :background="defaultOption.showPaginationBg"
        :current-page="currentPage"
        :page-sizes="defaultOption.pageSizes"
        :page-size="defaultOption.pageSize"
        :layout="curPageinationLayout"
        :total="curTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/** 表格主体，包括分页 **/
import Sortable from 'sortablejs'
export default {
  name: 'TableMain',
  props: {
    // 数据主键
    rowKey: {
      type: String,
      default: ''
    },
    // 查询表单对象（若表单会出现换行的场景，表格高度需要动态根据表单高度来计算，则该参数必传，并且defaultOption.tableTop不需要包含表单的高度，使用：:tableFormRef="$refs.tableformRef"）
    tableFormRef: {
      default: null
    }
  },
  data() {
    return {
      /** 1.可配置参数 **/
      defaultOption: {
        rowKey: 'id', // 多选框必填，主键，类型为字符串String
        theadList: [], // 表头内容，支持参数 prop，label，isSlot，sortable，width，filters，filterMultiple，fixed
        url: null, // 查询接口请求方法
        param: {}, // 查询接口请求参数
        additionalParam: {}, // 查询接口附加的请求参数
        requestCallback: null, // 设置请求返回时回调父组件处理返回数据的方法
        isPagingByFE: false, // 是否使用前端分页
        isSortByFE: false, // 是否使用前端排序
        isFilterByFE: false, // 是否使用前端过滤
        border: true, // 是否可改变列宽表格
        stripe: true, // 是否显示斑马纹样式
        showPagination: true, // 是否显示分页
        showPaginationBg: false, // 是否显示分页背景
        changePageinationSizes: true, // 是否可调整每页显示条数
        showTotal: false, // 是否显示总条数
        pageSize: 10, // 初始每页条数
        pageSizes: [10, 20, 30, 50, 100], // 每页条数选项
        resizeByContent: true, // 是否高度根据父容器自适应表格高度，为true时，tableHeight将失效
        tableHeight: null, // 表格定高，设置后表头会固定
        tableTop: 0, // 表格主体以外的内容在父容器内留出的高度
        tableheadH: 40, // 表头的高度
        pagenationH: 30, // 分页的高度
        showSelection: false, // 是否使用行多选框，rowKey必填
        showExpand: false, // 是否使用展开行，rowKey必填
        showOperate: false, // 是否显示内嵌操作列，为true时才能显示查看、编辑、删除
        optLabel: '操作', // 内嵌操作列名称
        showView: false, // 是否显示内嵌操作列的查看按钮
        showEdit: false, // 是否显示内嵌操作列的编辑按钮
        showDelete: false, // 是否显示内嵌操作列的删除按钮
        operateWidth: 0, // 自定义设置操作列宽度
        changeRowEnable: false, // 是否开启拖拽改变行顺序
        changeColEnable: false, // 是否开启拖拽改变列顺序
        showCurrentRow: false, // 是否开启单行选中功能
        currentRowChangeCallback: null, // 单行选中的回调事件
        changeRowEnableCallback: null, // 行顺序改变回调事件
        showSlotFilterHeader: false // 是否使用自定义表头筛选
      },
      /** 2.内部参数 **/
      tableKey: Date.parse(new Date()), // 列表的key
      reqParam: {}, // 当前请求接口时的参数
      sortParam: {}, // 排序参数
      filtersParam: {}, // 过滤参数
      currentPage: 1, // 当前页码
      listData: [], // 当前展示的数据
      oldListData: [], // 原始数据
      total: 0, // 当前数据总数
      showPagination: true, // 显示分页，控制数据请求加载时是否显示，解决分页不渲染问题
      collapseTimer: null, // 菜单收起展开事件触发重新布局的定时器
      expandList: [], // 需要展开的行
      selectionList: [], // 多选当前选中行的rowKey列表
      selectionRowList: [], // 多选选中的所有行对象
      curRow: {}, // 单选选中的行
      /** 自定义表头筛选功能 **/
      filtersColIndex: -1, // 筛选列的序号
      filtersList: [], // 筛选下拉列表的数据
      filtersChecked: [], // 选中的数据
      filtersInput: '', // 下拉列表过滤输入框内容
      isIndeterminate: false, // 全选按钮的半选状态
      filtersCheckAll: false // 全选按钮的全选状态
    }
  },
  computed: {
    // 左侧菜单展开收起状态
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    },
    // 实际展示的动态自定义表头数据
    curTheadList() {
      let theadList = this.defaultOption.theadList
      theadList = theadList.filter((item) => {
        if (
          (item.selected === undefined ? true : item.selected) &&
          item.prop !== null
        ) {
          return true
        } else {
          return false
        }
      })
      return theadList
    },
    // 实际展示的表头数据
    curShowTheadList() {
      let theadList = this.defaultOption.theadList
      theadList = theadList.filter((item) => {
        if (item.selected === undefined ? true : item.selected) {
          return true
        } else {
          return false
        }
      })
      return theadList
    },
    // 当前页显示数据
    curListData() {
      const isPagingByFE = this.defaultOption.isPagingByFE
      const pageSize = this.defaultOption.pageSize
      const currentPage = this.currentPage
      const listData = this.listData
      return isPagingByFE
        ? listData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : listData
    },
    // 数据总条数
    curTotal() {
      const isPagingByFE = this.defaultOption.isPagingByFE
      const listData = this.listData
      return isPagingByFE ? listData.length : this.total
    },
    // 当前分页布局
    curPageinationLayout() {
      const changePageinationSizes = this.defaultOption.changePageinationSizes
      const showTotal = this.defaultOption.showTotal
      let layout = ['total', 'prev', 'pager', 'next', 'sizes', 'jumper']
      if (!changePageinationSizes) {
        // 可调整每页显示条数
        layout = layout.filter((item) => {
          return item !== 'sizes'
        })
      }
      if (!showTotal) {
        // 展示数据总数
        layout = layout.filter((item) => {
          return item !== 'total'
        })
      }
      return layout.join(',')
    },
    // 操作按钮列宽度
    curOperateRowWidth() {
      if (this.defaultOption.operateWidth === 0) {
        // 根据按钮数设置列宽
        let optFlags = [
          this.defaultOption.showView,
          this.defaultOption.showEdit,
          this.defaultOption.showDelete
        ]
        optFlags = optFlags.filter((flag) => {
          return flag
        })
        return `${optFlags.length * 50 + 30}px`
      } else {
        // 自定义设置列宽
        return `${this.defaultOption.operateWidth}px`
      }
    },
    // 自定义表头筛选的下拉列表过滤
    newfiltersList() {
      if (this.filtersInput === '') {
        return this.filtersList
      } else {
        const list = this.filtersList.filter((item) => {
          return item.text.indexOf(this.filtersInput) !== -1
        })
        return list
      }
    }
  },
  watch: {
    // 监听菜单展开收起状态，对表格进行重新布局
    isCollapse() {
      if (this.collapseTimer === null) {
        this.$nextTick(() => {
          this.resizeTable()
          window.clearTimeout(this.collapseTimer)
          this.collapseTimer = null
        })
      }
    }
  },
  /** 组件挂载成功 **/
  mounted() {
    // 阻止鼠标放下默认行为
    document.body.ondrop = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    // 监听窗口改变事件
    window.addEventListener('resize', this.resizeTable)
  },
  /** 组件销毁前 **/
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeTable)

    window.clearInterval(this.timeInterval)
    this.timeInterval = null

    window.clearTimeout(this.collapseTimer)
    this.collapseTimer = null
  },
  /** 组件激活 **/
  activated() {
    this.$nextTick(() => {
      this.doLayout()
    })
  },
  /** 方法 **/
  methods: {
    // 初始化配置项
    init(option) {
      // 进行配置项option的覆盖式合并
      this.defaultOption = Object.assign(this.defaultOption, option)
      // 设置主键
      if (this.rowKey !== '') {
        this.defaultOption.rowKey = this.rowKey
      }
      // 可调整每页显示条数，需处理每页条数的条数选项，保证初始每页条数在条数选项内
      if (this.defaultOption.changePageinationSizes) {
        const pageSize = this.defaultOption.pageSize
        this.defaultOption.pageSizes.push(pageSize)
        const pageSizes = this.defaultOption.pageSizes
        const pagesizeSet = new Set(pageSizes)
        this.defaultOption.pageSizes = [...pagesizeSet]
        this.defaultOption.pageSizes.sort((a, b) => {
          return a - b
        })
      }

      // 初始化全量表头配置
      let selectionHead = []
      let expandHead = []
      let operateHead = []
      if (this.defaultOption.showSelection) {
        selectionHead = [{ label: '多选', prop: null }]
      }
      if (this.defaultOption.showExpand) {
        expandHead = [{ label: '展开', prop: null }]
      }
      if (this.defaultOption.showOperate) {
        operateHead = [{ label: '操作', prop: null }]
      }
      let allTheadList = [
        ...selectionHead,
        ...expandHead,
        ...this.defaultOption.theadList,
        ...operateHead
      ]
      this.defaultOption.theadList = allTheadList

      // 初始化表头的筛选条件展示数据
      this.defaultOption.theadList.forEach((thead) => {
        if (thead.filtersChecked && thead.filters) {
          if (thead.filterMultiple) {
            if (thead.filterIsArr) {
              this.filtersParam[thead.prop] = thead.filtersChecked
            } else {
              this.filtersParam[thead.prop] = thead.filtersChecked.join(',')
            }
          } else {
            this.filtersParam[thead.prop] = thead.filtersChecked.join('')
          }
        }
      })
      // 收起自定义表头筛选下拉列表
      if (this.defaultOption.showSlotFilterHeader) {
        this.defaultOption.isFilterByFE = false // 自定义表头筛选时filter-method不生效，所以强制设为后端过滤
        this.filtersListMouseleave()
      }
      // 根据配置判断是否开启行/列拖拽功能
      this.setDropStatus()
      return this.$refs.tableRef
    },
    // 获取数据并展示。flag为ture，强制跳转第一页，如初始化、查询、重置、保存成功时都需要跳转第一页；pageNum 强制跳转到指定页
    async getDatas(flag = false, pageNum = null) {
      // 设置跳转的页码
      let currentPage = this.currentPage
      if (flag) {
        currentPage = 1
      }
      if (pageNum !== null) {
        currentPage = pageNum
        this.showPagination = false
      }
      this.currentPage = currentPage
      // 设置查询参数
      this.reqParam = {
        pageNum: currentPage, // 当前页码
        pageSize: this.defaultOption.pageSize, // 每页条数
        ...this.defaultOption.param, // 合并查询参数
        ...this.defaultOption.additionalParam, // 合并附加请求参数
        ...this.sortParam, // 合并排序参数
        ...this.filtersParam // 合并过滤参数
      }
      // 前端分页，去掉pageNum和pageSize参数
      if (this.defaultOption.isPagingByFE) {
        Reflect.deleteProperty(this.reqParam, 'pageNum')
        Reflect.deleteProperty(this.reqParam, 'pageSize')
        // 前端分页清除选中
        this.clearSelection()
      }
      // 将已展开的列表关闭
      this.expandList = []
      // 调用接口获取数据
      let listData = []
      let total = 0
      try {
        const params = JSON.parse(JSON.stringify(this.reqParam))
        console.log('table searchInfo: ', params)
        const ret = await this.defaultOption.url(this.reqParam)
        const retData = ret.data || {}
        if (retData.errorCode !== 110000) {
          this.$message.error(retData.msg)
        } else {
          if (this.defaultOption.requestCallback !== null) {
            // 请求返回数据回调方法，用于对数据格式进行处理，需将最后处理的数据，返回list和total
            const obj = this.defaultOption.requestCallback(ret, this.reqParam)
            listData = obj.list || []
            total = obj.total || retData.total || 0
          } else {
            listData = retData.list || []
            total = retData.total || 0
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        // 设置表格展示数据
        this.listData = listData
        this.oldListData = JSON.parse(JSON.stringify(listData))
        this.total = total
        this.showPagination = this.defaultOption.showPagination && true
        this.$nextTick(() => {
          // 处理选中
          this.checkSelectionList()
          // 表格自适应
          this.resizeTable()
        })
      }
    },
    // ！！！注意：重新设置key会影响整个表格筛选、排序、多选等效果，即筛选、排序、多选数据需要清空，需谨慎操作。但是不重置的话，更新表头字段显示会有问题？
    resetKey() {
      this.tableKey = Date.parse(new Date()) + Math.random()
      this.sortParam = {}
      this.filtersParam = {}
      this.clearSelection()
      this.$nextTick(() => {
        this.setDropStatus()
      })
    },
    // 重置制定配置项参数
    resetDefaultOptionParam(key, param) {
      if (key === 'theadList') {
        // 新配置表头属性会导致布局错乱，需要重新布局
        this.doLayout()
      }
      this.defaultOption[key] = param
    },
    // 获取当前表格数据的查询参数
    getReqParam() {
      const param = {
        ...this.reqParam,
        pageNum: this.currentPage
      }
      return param
    },
    // 设置表格数据
    setListData(list) {
      this.listData = list
      this.oldListData = JSON.parse(JSON.stringify(list))
      this.total = list.length
      this.currentPage = 1
      this.expandList = []
      this.sortParam = {}
      this.filtersParam = {}
      this.clearSelection()
      this.resizeTable()
    },
    // 每页显示条数改变事件
    sizeChange(val) {
      this.defaultOption.pageSize = val
      if (!this.defaultOption.isPagingByFE) {
        // 后台分页，动态的需要请求数据
        this.getDatas(true)
      } else {
        // 前端分页，需要处理多选的选中状态
        this.$nextTick(() => {
          this.checkSelectionList()
        })
      }
    },
    // 页码点击改变事件
    pageChange(val) {
      this.currentPage = val
      if (!this.defaultOption.isPagingByFE) {
        // 后台分页，动态的需要请求数据
        this.getDatas()
      } else {
        // 前端分页，需要处理多选的选中状态
        this.$nextTick(() => {
          this.checkSelectionList()
        })
      }
    },
    // 排序改变事件
    tableSortChange({ prop, order }) {
      if (!this.defaultOption.isSortByFE) {
        // 后端排序
        const obj = {
          // 对应后台接口值
          ascending: 'asc', // 升序，从小到大
          descending: 'desc' // 降序，从大到小
        }
        if (prop === undefined || order === null) {
          this.sortParam = {}
        } else {
          this.sortParam = {
            sortField: prop, // 排序字段
            sortType: obj[order] // ascending升序，descending降序
          }
        }
        this.getDatas()
      } else {
        // 前端排序
        if (prop === undefined || order === null) {
          this.listData = JSON.parse(JSON.stringify(this.oldListData))
        } else {
          this.listData = this.listData.sort((a, b) => {
            const aValue = a[prop]
            const bValue = b[prop]
            if (order === 'ascending') {
              // 升序
              return aValue - bValue
            } else {
              // 降序
              return bValue - aValue
            }
          })
        }
      }
    },
    // ----------------行多选功能的处理 start--------------
    // 列表多选框选项改变事件
    tableSelectionChange(rows) {
      this.$emit('tableSelectionChange', rows)
    },
    // 触发全选事件
    selectAllHandler(selection) {
      // 静态列表的selection为所有页选中的行，动态列表的selection为当前页选中的行
      let listset = new Set(this.selectionList)
      if (selection.length === 0) {
        this.listData.forEach((item) => {
          const id = item[this.defaultOption.rowKey] || ''
          listset.delete(id)
          this.selectionRowList = this.selectionRowList.filter((item) => {
            const itemid = item[this.defaultOption.rowKey] || ''
            return itemid !== id
          })
        })
      } else {
        if (this.defaultOption.isPagingByFE) {
          listset = new Set()
        }
        selection.forEach((item) => {
          const id = item[this.defaultOption.rowKey] || ''
          listset.add(id)
          this.selectionRowList.push(JSON.parse(JSON.stringify(item)))
        })
      }
      this.selectionList = Array.from(listset)
      this.$emit('selectChange', this.selectionList)
    },
    // 触发单行勾选事件
    selectHandler(selection, row) {
      const rowid = row[this.defaultOption.rowKey] || ''
      let selected = selection.filter((item) => {
        const itemid = item[this.defaultOption.rowKey] || ''
        return itemid === rowid
      })
      let listset = new Set(this.selectionList)
      if (selected.length > 0) {
        listset.add(rowid)
        this.selectionRowList.push(JSON.parse(JSON.stringify(row)))
      } else {
        listset.delete(rowid)
        this.selectionRowList = this.selectionRowList.filter((item) => {
          const itemid = item[this.defaultOption.rowKey] || ''
          return itemid !== rowid
        })
      }
      this.selectionList = Array.from(listset)
      this.$emit('selectChange', this.selectionList)
    },
    // 将已选择的行置为选中状态
    checkSelectionList() {
      if (this.selectionList.length > 0) {
        this.listData.forEach((row) => {
          const id = row[this.defaultOption.rowKey] || ''
          if (this.selectionList.indexOf(id) !== -1) {
            this.$refs.tableRef.toggleRowSelection(row, true)
          }
        })
      }
      this.$emit('selectChange', this.selectionList)
    },
    // 提供外部获取选中列表的方法
    getSelectionList() {
      return this.selectionList
    },
    // 提供外部获取所有选中行对象的方法
    getSelectionRowList() {
      return this.selectionRowList
    },
    // 清除选中
    clearSelection() {
      this.selectionList = []
      this.selectionRowList = []
      this.$refs.tableRef.clearSelection()
      this.$emit('selectChange', this.selectionList)
    },
    // ----------------行多选功能的处理 end----------------
    // ----------------行展开功能的处理 start--------------
    // 行展开/收起事件
    tableExpandChange(row, expandedRows) {
      const rowKeyValue = row[this.defaultOption.rowKey]
      // 控制每次只展开一行
      if (this.expandList.includes(rowKeyValue)) {
        this.expandList = this.expandList.filter((val) => val !== rowKeyValue)
      } else {
        if (this.expandList.length !== 0) {
          this.expandList.splice(0, this.expandList.length)
          this.expandList.push(rowKeyValue)
        } else {
          this.expandList.push(rowKeyValue)
        }
      }
      // 获取当前行的序号
      let rowIndex = -1
      this.curListData.forEach((item, index) => {
        if (item[this.defaultOption.rowKey] === rowKeyValue) {
          rowIndex = index
        }
      })
      // 高亮展开行
      this.curRow = row
      // 展开/收起标识
      const isExpand = expandedRows.indexOf(row) !== -1
      // 通知父组件
      this.$emit('tableExpandChange', { row, expandedRows, rowIndex, isExpand })
    },
    // ----------------行展开功能的处理 end----------------
    // 操作列表事件，optName为操作类型
    operateEvent(optName, row, index) {
      // 通知父组件
      this.$emit(optName, { row, index })
    },
    // 自适应
    resizeTable() {
      if (this.defaultOption.resizeByContent) {
        this.resizeHeight()
      }
      this.doLayout()
    },
    // 根据父容器的宽高，改变表格的height
    resizeHeight() {
      try {
        // 父容器高度
        const contentH = this.$el.parentElement.offsetHeight
        // 分页的高度
        const pagenationH = this.defaultOption.showPagination
          ? this.defaultOption.pagenationH
          : 0
        // 表头的高度
        const tableheadH = this.defaultOption.tableheadH
        // 表格主体以外的内容在父容器内留出的高度
        let tableTop = this.defaultOption.tableTop
        if (this.tableFormRef !== null) {
          // 动态获取表单组件高度
          const formHeight = this.tableFormRef.$el.offsetHeight
          tableTop = tableTop + formHeight
        }
        // 设置el-table的高度属性height
        const tableHeight = contentH - pagenationH - tableheadH - tableTop
        this.defaultOption.tableHeight = tableHeight
      } catch (e) {}
    },
    // 重新布局
    doLayout() {
      this.$nextTick(() => {
        if (this.$refs.tableRef) {
          this.$refs.tableRef.doLayout()
        }
        // 隐藏筛选列表
        this.filtersListMouseleave()
      })
    },
    // ----------------自定义表头筛选功能 start----------------
    // 设置列筛选相关配置项，判断表头过滤功能用element自带下拉列表还是自定义的下拉列表
    filerItem(item) {
      if (this.defaultOption.showSlotFilterHeader && item.filterMultiple) {
        return undefined
      } else return item.filters || undefined
    },
    // 设置列筛选相关配置项，判断是否设置filter-method参数
    filterMethodItem(item) {
      if (
        this.defaultOption.isFilterByFE &&
        item.filters &&
        !this.defaultOption.showSlotFilterHeader
      ) {
        return this.filterMethod
      } else {
        return undefined
      }
    },
    // 自定义过滤下拉按钮点击查看事件
    headerFiltersClick(item, index) {
      // 展示下拉列表，还原选中状态
      this.filtersColIndex = index
      this.filtersList = item.filters || []
      this.filtersInput = ''
      this.filtersChecked = item.filtersChecked || []
      this.filtersCheckedChange(this.filtersChecked)
    },
    // 自定义过滤下拉列表隐藏事件
    filtersListMouseleave(index = -1) {
      if (index === this.filtersColIndex || index === -1) {
        this.filtersColIndex = -1
        this.filtersList = []
        this.filtersInput = ''
        this.filtersChecked = []
        this.filtersCheckAll = false
        this.isIndeterminate = false
      }
      if (index === -1) {
        const ref = this.$refs.filterPopRef
        if (ref) {
          ref.forEach((item) => {
            item.showPopper = false
          })
        }
      }
    },
    // 自定义过滤列表选全选事件
    filtersCheckAllChange(val) {
      // 控制全选按钮状态
      const checked = this.filtersList.map((item) => {
        return item.value
      })
      this.filtersChecked = val ? checked : []
      this.isIndeterminate = false
    },
    // 自定义过滤列表选中改变事件
    filtersCheckedChange(value) {
      // 控制全选按钮状态，处理选中列表状态
      const allLen = this.filtersList.length
      const checkedCount = value.length
      this.filtersCheckAll = allLen > 0 && checkedCount === allLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < allLen
    },
    // 自定义过滤列表重置按钮事件
    filtersResetEvent() {
      this.filtersChecked = []
      this.filtersOkEvent()
    },
    // 自定义过滤列表筛选按钮事件
    filtersOkEvent() {
      const filtersChecked = JSON.parse(JSON.stringify(this.filtersChecked))
      const item = this.curTheadList[this.filtersColIndex]
      // 缓存选中
      item.filtersChecked = filtersChecked
      // 触发查询
      const param = {}
      param[item.prop + '_' + this.filtersColIndex] = filtersChecked
      this.filterChange(param)
      // 隐藏筛选列表
      this.filtersListMouseleave()
    },
    // ----------------自定义表头筛选功能 end----------------
    // 过滤方法（动态）- element自带
    filterChange(filters) {
      if (Object.keys(filters).length > 0) {
        for (const key in filters) {
          if (Object.prototype.hasOwnProperty.call(filters, key)) {
            const arr = filters[key]
            const tableHeadKey = key.split('_')[0]
            let isMultiple = false // 多选
            let filterIsArr = false
            this.curTheadList.forEach((head) => {
              if (head.prop === tableHeadKey && head.filterMultiple === true) {
                // 判断过滤列的参数是多选还是单选
                isMultiple = true
                if (head.filterIsArr === true) {
                  // 多选过滤列的参数是以","拼接的字符串还是数组
                  filterIsArr = true
                }
              }
            })
            // 设置接口查询参数
            if (filterIsArr) {
              this.filtersParam[tableHeadKey] = arr
            } else if (isMultiple) {
              this.filtersParam[tableHeadKey] = arr.join(',')
            } else {
              this.filtersParam[tableHeadKey] = arr.join('')
            }
          }
        }
      } else {
        this.filtersParam = {}
      }
      if (!this.defaultOption.isFilterByFE) {
        this.getDatas(true)
      }
    },
    // 过滤方法（静态）- element自带
    filterMethod(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // ----------------自定义行/列拖拽交换顺序功能 start--------------
    // 根据配置判断是否开启行/列拖拽功能
    setDropStatus() {
      // 开启拖拽改变行顺序功能
      if (this.defaultOption.changeRowEnable) {
        this.rowDrop()
      }
      // 开启拖拽改变列顺序功能
      if (this.defaultOption.changeColEnable) {
        this.colDrop()
      }
    },
    // 拖拽改变行顺序
    rowDrop() {
      const self = this
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody, {
        filter: '.drapDisable', // 不允许进行拖动的元素
        onEnd(event) {
          console.log('rowDrop', event)
          const { newIndex, oldIndex } = event
          if (newIndex !== oldIndex) {
            // 更新排序后的表格数据
            const currRow = self.listData.splice(oldIndex, 1)[0]
            self.listData.splice(newIndex, 0, currRow)
            // 执行父组件定义的回调事件
            if (self.defaultOption.changeRowEnableCallback !== null) {
              self.defaultOption.changeRowEnableCallback(self.listData)
            }
          }
        }
      })
    },
    // 拖拽改变列顺序
    colDrop() {
      const self = this
      const tbody = document.querySelector('.el-table__header-wrapper tr')
      Sortable.create(tbody, {
        onEnd(event) {
          console.log('colDrop', event)
          const { newIndex, oldIndex } = event
          if (newIndex !== oldIndex) {
            const tempTheadList = [...self.defaultOption.theadList]
            // 获取实际展示的列数据在全量表头配置中的索引
            const oldCol = self.curShowTheadList[oldIndex]
            const newCol = self.curShowTheadList[newIndex]
            const oldI = tempTheadList.findIndex(
              (item) => item.prop === oldCol.prop
            )
            const newI = tempTheadList.findIndex(
              (item) => item.prop === newCol.prop
            )
            // 更新排序后的表格数据
            const currCol = tempTheadList.splice(oldI, 1)[0]
            tempTheadList.splice(newI, 0, currCol)
            self.$set(self.defaultOption, 'theadList', tempTheadList)
            // 重新渲染表格
            self.resetKey()
          }
        }
      })
    },
    // ----------------自定义行拖拽交换顺序功能 end----------------
    // 为表格中的数据行行添加样式类class
    tableRowClassName({ row }) {
      const styleList = ['salaxy-table-row']
      if (row.drapDisable === true) {
        styleList.push('drapDisable')
      }
      if (row.hideExpand === true) {
        styleList.push('hideExpand')
      }
      return styleList.join(' ')
    },
    // 为表格中的表头列添加样式类class
    headerCellClassName({ column }) {
      return `col_${column.property || 'default'}`
    },
    // 单行选中事件
    handleCurrentChange(row) {
      this.curRow = row
      if (this.defaultOption.currentRowChangeCallback !== null) {
        this.defaultOption.currentRowChangeCallback(row)
      }
    },
    // 表格滚动条滚动到指定行，将指定行置顶
    scrollToRow(rowIndex = 0) {
      const containerObj = this.$el.getElementsByClassName(
        'el-table__body-wrapper'
      )[0]
      let jumps = document.querySelectorAll('.salaxy-table-row')
      let jumpObj = jumps[rowIndex] || {}
      containerObj.scrollTop = jumpObj.offsetTop - 2
    }
  }
}
</script>

<style lang="less">
.salaxy-table {
  position: relative;
  padding: 0 30px;
  /** 表格主体样式 **/
  .el-table {
    width: 100%;
  }
  .el-table th {
    padding: 0px;
    line-height: 40px;
    background: rgb(242, 245, 252);
  }
  .el-table td {
    padding: 6px 0;
    font-size: 12px;
    background: #fff;
  }
  .el-table thead {
    color: #333;
    font-weight: normal;
    font-size: 12px;
  }
  .el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .el-table__empty-block {
    min-height: 36px;
  }
  .el-table__empty-text {
    line-height: 36px;
  }
  .el-button {
    padding: 0;
  }
  .el-table--border {
    border-bottom: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0;
  }
  .el-table__column-filter-trigger {
    width: 24px;
  }
  .el-table__body tr.current-row > td.el-table__cell {
    background-color: #ecf5ff !important;
  }
  .hideExpand {
    .el-table__expand-column .cell {
      display: none;
    }
  }
  /** 展开行样式 **/
  .el-table__row.expanded {
    td {
      border-top: 1px solid #409eff !important;
      border-bottom: 1px solid #409eff !important;
      &:first-child {
        border-left: 1px solid #409eff !important;
      }
      &:last-child {
        border-right: 1px solid #409eff !important;
      }
    }
  }
  /** 分页 **/
  .salaxy-table-pagination {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    user-select: none;
    .div-selection {
      font-weight: 400;
      color: #606266;
      font-size: 13px;
      display: flex;
      align-items: center;
      line-height: 28px;
      .show-count {
        font-weight: bold;
      }
      .clear-btn {
        cursor: pointer;
        margin: 0 0 0 10px;
        color: #409eff;
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .el-pagination {
      padding: 0;
      .el-pagination__jump {
        margin-left: 5px;
      }
    }
  }
  /** 自定义表头筛选 **/
  .filter-highlight {
    color: #409eff;
    i {
      color: #409eff;
      font-weight: bold;
    }
  }
}
/** 自定义筛选悬浮列表 **/
.table-filters-list {
  .el-input--mini {
    font-size: 12px;
    margin: 5px 10px;
    width: calc(100% - 20px);
  }
  .el-checkbox-group {
    border-top: 1px solid #ebeef5;
    max-height: 180px;
    max-width: 250px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-checkbox {
    display: flex;
    align-items: center;
    margin: 8px 10px;
  }
  .el-checkbox__input {
    height: 14px;
  }
  .el-checkbox__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .none-data {
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    padding-left: 10px;
    color: #606266;
  }
  .opt {
    width: 100%;
    height: 30px;
    border-top: 1px solid rgb(235, 238, 245);
    .opt-left {
      float: left;
    }
    .opt-right {
      float: right;
    }
    .opt-btn {
      display: inline-block;
      width: 30px;
      line-height: 35px;
      margin: 0 5px 0 5px;
      cursor: pointer;
      font-size: 14px;
      color: #606266;
      &:hover {
        color: #409eff;
      }
    }
  }
}
.table-filters-popper {
  padding: 0;
  margin-top: 2px !important;
}
</style>
