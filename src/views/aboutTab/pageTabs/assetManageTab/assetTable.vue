<template>
  <div class="assetTable-page">
    <tableForm
      ref="tableformRef"
      @searchEvent="searchEvent"
      @resetEvent="resetEvent"
    ></tableForm>
    <div class="default-table-title-style">
      <div class="left">资产列表（{{ total }}）</div>
      <div class="right">
        <el-button size="small" type="primary" @click="addHandle">
          新增
        </el-button>
        <el-button size="small" type="primary" @click="batchDelete"
          >批量删除
        </el-button>
      </div>
    </div>
    <tableMain ref="tableRef" :tableFormRef="$refs.tableformRef" rowKey="id">
      <template v-slot:options="slotProps">
        <el-button type="text" @click="viewHandle(slotProps.tableScope.row)"
          >查看
        </el-button>
        <el-button type="text" @click="editHandle(slotProps.tableScope.row)"
          >编辑
        </el-button>
        <el-button type="text" @click="deleteHandle(slotProps.tableScope.row)"
          >删除
        </el-button>
      </template>
    </tableMain>
  </div>
</template>

<script>
import tableForm from '@/components/table/tableForm.vue'
import tableMain from '@/components/table/tableMain.vue'
import tableMixin from '@/components/table/tableMixin'
import { getAssetManageList } from '@/api/request/aboutTab'
import allDict, { setdictKey } from '@/utils/dict'

export default {
  name: 'assetTable',
  mixins: [tableMixin],
  components: { tableForm, tableMain },
  data() {
    return {
      assetTypeTree: '',
      assetSearch: '',
      assetActiveTagDict: allDict.assetActiveTagDict,
      ifFilterDict: setdictKey(allDict.ifDict, 'label', 'text')
    }
  },
  mounted() {
    this.initForm()
    this.initTable()
    this.getDatas()
  },
  methods: {
    searchByAside(params) {
      this.assetTypeTree = params.assetTypeTree
      this.assetSearch = params.assetSearch
      this.searchInfo.activeTag = ''
      this.$refs.tableformRef.reset()
      this.$refs.tableRef.clearSelection()
      this.$refs.tableRef.resetKey()
    },
    initForm() {
      const arr = [{ label: '全部', value: '' }]
      const option = {
        formList: [
          {
            label: '',
            prop: 'activeTag',
            type: 'el-select',
            optionList: arr.concat(this.assetActiveTagDict),
            default: ''
          },
          {
            prop: 'keyword',
            type: 'el-input',
            placeholder: '请输入资产名称关键字',
            default: ''
          }
        ]
      }
      if (this.$refs.tableformRef) {
        this.$refs.tableformRef.init(option)
      }
    },
    initTable() {
      this.searchInfo.assetTypeTree = this.assetTypeTree
      this.searchInfo.assetSearch = this.assetSearch || 0
      const option = {
        tableTop: 56,
        pageSize: 20,
        rowKey: 'id',
        showSelection: true,
        theadList: [
          {
            prop: 'id',
            label: '资产ID',
            minWidth: 130
          },
          {
            prop: 'assetName',
            label: '资产名称',
            minWidth: 150
          },
          {
            prop: 'ip',
            label: 'IP地址',
            minWidth: 130
          },
          {
            prop: 'mac',
            label: 'MAC地址',
            minWidth: 130
          },
          {
            prop: 'assetType',
            label: '资产类别',
            minWidth: 120
          },
          {
            prop: 'assetDistrict',
            label: '所属分区',
            minWidth: 120
          },
          {
            prop: 'isFall',
            label: '是否失陷',
            filters: this.ifFilterDict,
            minWidth: 120
          },
          {
            prop: 'assetWorth',
            label: '资产价值',
            minWidth: 120
          },
          {
            prop: 'assetNature',
            label: '资产性质',
            minWidth: 140
          },
          {
            prop: 'assetStatus',
            label: '资产状态',
            minWidth: 120
          },
          {
            prop: 'isDataAsset',
            label: '是否数据资产',
            filters: this.ifFilterDict,
            minWidth: 120
          },
          {
            prop: 'isConnect',
            label: '是否允许接入互联网',
            filters: this.ifFilterDict,
            minWidth: 180
          },
          {
            prop: 'dataAssetType',
            label: '数据资产分类',
            minWidth: 150
          },
          {
            prop: 'dataAssetLevel',
            label: '数据资产分级',
            minWidth: 150
          },
          {
            prop: 'url',
            label: 'URL',
            minWidth: 160
          },
          {
            prop: 'assetUser',
            label: '资产使用人',
            minWidth: 120
          },
          {
            prop: 'assetPosition',
            label: '资产位置',
            minWidth: 130
          },
          {
            prop: 'safeLevel',
            label: '安全等级',
            minWidth: 120
          },
          {
            prop: 'createTime',
            label: '资产入库时间',
            minWidth: 130
          },
          {
            prop: 'updateTime',
            label: '资产更新时间',
            minWidth: 130
          },
          {
            prop: 'options',
            label: '操作',
            fixed: 'right',
            isSlot: true,
            minWidth: 150
          }
        ],
        url: getAssetManageList,
        param: this.searchInfo
      }
      if (this.$refs.tableRef) {
        this.$refs.tableRef.init(option)
      }
    },
    viewHandle(dataRow) {},
    addHandle() {},
    editHandle(dataRow) {},
    batchDelete() {},
    deleteHandle(dataRow) {}
  }
}
</script>

<style lang="less">
.assetTable-page {
  width: 100%;
  height: 100%;
}
</style>
