<template>
  <div class="addOrEditBaseDialog-page">
    <el-dialog
      v-loading="loading"
      v-dialogDrag
      class="default-dialog-style"
      width="768px"
      :title="title"
      v-if="visible"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="false"
      @close="handleClose"
    >
      <el-form
        class="default-form-style lineform row2Form"
        label-width="100px"
        label-position="top"
        :model="formData"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item prop="assetName" label="资产名称">
          <el-input
            v-model.trim="formData.assetName"
            placeholder="请输入资产名称"
            :maxlength="30"
            show-word-limit
            class="show-word-limit-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="assetType" label="资产类别">
          <el-cascader
            style="width: 100%"
            v-model="formData.assetType"
            placeholder="请选择资产类别"
            :props="defaultProps"
            :options="assetTypeDict"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="assetIp" label="IP地址（填写后不可更改）">
          <el-input
            v-model.trim="formData.assetIp"
            placeholder="请输入IP地址，格式：XXX.XXX.XXX.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="MAC地址（填写后不可修改）" prop="assetMac">
          <el-input
            v-model.trim="formData.assetMac"
            placeholder="请输入MAC地址，格式：XX-XX-XX-XX-XX-XX"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否允许接入互联网" prop="allowConnect">
          <el-radio-group v-model="formData.allowConnect">
            <el-radio
              v-for="(item, index) in ifDict"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="黑名单状态" prop="blackListStatus">
          <div class="switch-row-form">
            <el-switch
              v-model="formData.blackListStatus"
              active-color="#5587ff"
              inactive-color="#c0c4cc"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <div class="startBtn" v-if="formData.blackListStatus === 1">
              启用
            </div>
            <div class="stopBtn" v-else>停用</div>
          </div>
        </el-form-item>
        <el-form-item
          label="开始生效日期"
          prop="startDateTime"
          class="formItemDateFlex"
        >
          <el-cascader
            v-model="formData.startDate"
            placeholder="请选择具体执行日期"
            :options="dateDict"
          ></el-cascader>
          <el-select
            v-model="formData.startTime"
            placeholder="请选择具体执行时间"
          >
            <el-option
              v-for="(item, index) in timeDict"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特征标签" prop="featureTag">
          <multipleSelect
            :inputValue.sync="formData.featureTag"
            :options="timeDict"
            placeholder="请选择特征标签"
            label="label"
            value="value"
          ></multipleSelect>
        </el-form-item>
        <el-form-item label="生成拦截日志时段" prop="interceptTime">
          <el-date-picker
            v-model="formData.interceptTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="expireTimeOption"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行范围" prop="excuteRange">
          <el-cascader
            style="width: 100%"
            v-model="formData.excuteRange"
            placeholder="请选择执行范围"
            :props="defaultProps2"
            :options="executeRangeDict"
            collapse-tags
          ></el-cascader>
        </el-form-item>
        <el-form-item label="黑名单域名" prop="blackDomain" class="full">
          <el-input
            v-model.trim="formData.blackDomain"
            placeholder="请输入黑名单域名"
            :maxlength="255"
            show-word-limit
            class="show-word-limit-input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="防护的IP/IP段"
          prop="defenseIpOrIpRange"
          class="formItemIpFlex"
        >
          <div
            v-for="(item, index) in formData.defenseIpOrIpRange"
            :key="index"
            class="defenseTotalDiv"
          >
            <el-select
              v-model="formData.defenseIpOrIpRange[index].ipWay"
              placeholder="请选择"
              @change="defenseIpOrIpRangeChange(index)"
            >
              <el-option
                v-for="(item, index) in ipWayDict"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-if="item.ipWay === 1"
              v-model.trim="formData.defenseIpOrIpRange[index].allowIp"
              placeholder="请输入IP"
            ></el-input>
            <el-input
              v-else
              v-model.trim="formData.defenseIpOrIpRange[index].allowIpRange"
              placeholder="请输入IP段"
            ></el-input>
            <div class="main-icon">
              <span
                v-if="formData.defenseIpOrIpRange.length < 5"
                class="el-icon-circle-plus-outline"
                @click="addDefenseRow"
              ></span>
              <span
                v-if="formData.defenseIpOrIpRange.length > 1"
                class="el-icon-circle-close"
                @click="removeDefenseRow(index)"
              ></span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="允许的对端的IP/IP段"
          prop="allowIpOrIpRange"
          class="formItemIpFlex"
        >
          <div
            v-for="(item, index) in formData.allowIpOrIpRange"
            :key="index"
            class="allowTotalDiv"
          >
            <el-select
              v-model="formData.allowIpOrIpRange[index].ipWay"
              placeholder="请选择"
              @change="allowIpOrIpRangeChange(index)"
            >
              <el-option
                v-for="(item, index) in ipWayDict"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-if="item.ipWay === 1"
              v-model.trim="formData.allowIpOrIpRange[index].allowIp"
              placeholder="请输入IP"
            ></el-input>
            <el-input
              v-else
              v-model.trim="formData.allowIpOrIpRange[index].allowIpRange"
              placeholder="请输入IP段"
            ></el-input>
            <div class="main-icon">
              <span
                v-if="formData.allowIpOrIpRange.length < 5"
                class="el-icon-circle-plus-outline"
                @click="addAllowRow"
              ></span>
              <span
                v-if="formData.allowIpOrIpRange.length > 1"
                class="el-icon-circle-close"
                @click="removeAllowRow(index)"
              ></span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="full">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注（0/500）"
            type="textarea"
            :rows="4"
            resize="none"
            :maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="commitForm"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkIp, checkIpRange } from '@/utils/ipv4Util'
import { checkMac, checkUrl } from '@/utils/validateUtils'
import allDict from '@/utils/dict'
import { generateDateOptions } from '@/utils/dataFunction'
import multipleSelect from '@/components/form/multipleSelect.vue'
import {
  addBlackListPort,
  getOriginBlackInfoPort,
  editBlackListPort
} from '@/api/request/aboutTable'
let self

export default {
  name: 'addOrEditBaseDialog',
  components: { multipleSelect },
  data() {
    self = this
    return {
      loading: false,
      visible: false,
      title: '',
      type: '',
      assetTypeDict: [],
      ifDict: allDict.ifDict,
      dateDict: generateDateOptions(new Date().getFullYear()),
      timeDict: allDict.timeDict,
      executeRangeDict: [],
      ipWayDict: allDict.ipWayDict,
      defaultProps: {
        label: 'typeName',
        value: 'id',
        children: 'childrenTypeList'
      },
      expireTimeOption: {
        disabledDate(date) {
          const curdate = self
            .$moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          const curdateTime = new Date(curdate).getTime()
          const monthdata = self
            .$moment()
            .subtract(6, 'months')
            .format('YYYY-MM-DD')
          const monthdataTime = new Date(monthdata).getTime()
          const dateTime = date.getTime()
          return dateTime > curdateTime || dateTime < monthdataTime
        }
      },
      defaultProps2: {
        multiple: true,
        label: 'label',
        value: 'groupID'
      },
      originTableRow: {},
      formData: {
        assetName: '',
        assetType: '',
        assetIp: '',
        assetMac: '',
        allowConnect: 1,
        blackListStatus: 1,
        startDateTime: 'defaultEmpty',
        startDate: '',
        startTime: '',
        featureTag: [],
        interceptTime: '',
        excuteRange: '',
        blackDomain: '',
        defenseIpOrIpRange: [
          {
            ipWay: 1,
            allowIp: '',
            allowIpRange: ''
          }
        ],
        allowIpOrIpRange: [
          {
            ipWay: 1,
            allowIp: '',
            allowIpRange: ''
          }
        ],
        remark: ''
      },
      rules: {
        assetName: [
          {
            required: true,
            message: '请输入资产名称',
            trigger: ['blur', 'change']
          }
        ],
        assetType: [
          {
            required: true,
            message: '请选择资产类别',
            trigger: 'change'
          }
        ],
        assetIp: [
          {
            required: true,
            message: '请输入IP地址',
            trigger: ['blur', 'change']
          },
          { validator: this.checkAssetIp, trigger: ['blur', 'change'] }
        ],
        assetMac: [
          {
            required: true,
            message: '请输入MAC地址',
            trigger: ['blur', 'change']
          },
          { validator: this.checkAssetMac, trigger: ['blur', 'change'] }
        ],
        allowConnect: [
          {
            required: true,
            message: '请选择是否允许接入互联网',
            trigger: 'change'
          }
        ],
        blackListStatus: [
          {
            required: true,
            message: '请选择黑名单状态',
            trigger: 'change'
          }
        ],
        startDateTime: [
          { required: true, message: '请选择开始生效日期', trigger: 'change' },
          { validator: this.checkStartDateTime, trigger: 'change' }
        ],
        featureTag: [
          {
            required: true,
            message: '请选择特征标签',
            trigger: 'change'
          }
        ],
        interceptTime: [
          {
            required: true,
            message: '请选择生成拦截日志时段',
            trigger: 'change'
          }
        ],
        excuteRange: [
          {
            required: true,
            message: '请选择执行范围',
            trigger: 'change'
          }
        ],
        blackDomain: [
          { required: true, message: '请输入黑名单域名', trigger: 'change' },
          { validator: this.checkBlackDomain, trigger: 'change' }
        ],
        defenseIpOrIpRange: [
          { required: true, message: '请输入IP或IP段', trigger: 'change' },
          { validator: this.checkDefenseIpOrIpRange, trigger: 'change' }
        ],
        allowIpOrIpRange: [
          { required: true, message: '请输入IP或IP段', trigger: 'change' },
          { validator: this.checkAllowIpOrIpRange, trigger: 'change' }
        ],
        remark: [
          {
            required: true,
            message: '请请输入备注',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    checkAssetIp(rule, value, callback) {
      if (!checkIp(this.formData.assetIp)) {
        callback(new Error('IP地址格式不正确'))
      } else {
        callback()
      }
    },
    checkAssetMac(rule, value, callback) {
      if (!checkMac(this.formData.assetMac)) {
        callback(new Error('MAC地址格式不正确'))
      } else {
        callback()
      }
    },
    checkStartDateTime(rule, value, callback) {
      if (this.formData.startDate && this.formData.startTime) {
        callback()
      } else {
        callback(new Error('请选开始生效日期'))
      }
    },
    checkBlackDomain(rule, value, callback) {
      if (!checkUrl(this.formData.blackDomain)) {
        callback(new Error('url域名格式不正确'))
      } else {
        callback()
      }
    },
    checkDefenseIpOrIpRange(rule, value, callback) {
      let isPass = true
      for (let i = 0; i < this.formData.defenseIpOrIpRange.length; i++) {
        const currentItem = this.formData.defenseIpOrIpRange[i]
        if (
          (currentItem.ipWay === 1 && !checkIp(currentItem.allowIp)) ||
          (currentItem.ipWay === 2 && !checkIpRange(currentItem.allowIpRange))
        ) {
          isPass = false
        }
      }
      if (!isPass) {
        callback(new Error('地址格式不正确'))
      } else {
        callback()
      }
    },
    checkAllowIpOrIpRange(rule, value, callback) {
      let isPass = true
      for (let i = 0; i < this.formData.allowIpOrIpRange.length; i++) {
        const currentItem = this.formData.allowIpOrIpRange[i]
        if (
          (currentItem.ipWay === 1 && !checkIp(currentItem.allowIp)) ||
          (currentItem.ipWay === 2 && !checkIpRange(currentItem.allowIpRange))
        ) {
          isPass = false
        }
      }
      if (!isPass) {
        callback(new Error('地址格式不正确'))
      } else {
        callback()
      }
    },
    defenseIpOrIpRangeChange(index) {
      this.formData.defenseIpOrIpRange[index].allowIp = ''
      this.formData.defenseIpOrIpRange[index].allowIpRange = ''
    },
    allowIpOrIpRangeChange(index) {
      this.formData.allowIpOrIpRange[index].allowIp = ''
      this.formData.allowIpOrIpRange[index].allowIpRange = ''
    },
    addAllowRow() {
      const obj = {
        ipWay: 1,
        allowIp: '',
        allowIpRange: ''
      }
      this.formData.allowIpOrIpRange.push(obj)
    },
    removeAllowRow(index) {
      this.formData.allowIpOrIpRange.splice(index, 1)
    },
    addDefenseRow() {
      const obj = {
        ipWay: 1,
        allowIp: '',
        allowIpRange: ''
      }
      this.formData.defenseIpOrIpRange.push(obj)
    },
    removeDefenseRow(index) {
      this.formData.defenseIpOrIpRange.splice(index, 1)
    },
    handleOpen(params) {
      this.visible = true
      this.type = params.type
      this.assetTypeDict = params.assetTypeDict
      this.executeRangeDict = params.executeRangeDict
      if (this.type === 'add') {
        this.title = '新增'
      } else if (this.type === 'edit') {
        this.title = '编辑'
        this.originTableRow = params.dataRow
        this.getOriginBlackInfo()
      }
    },
    async getOriginBlackInfo() {
      try {
        this.loading = true
        const res = await getOriginBlackInfoPort()
        if (res && res.data && res.data.errorCode === 110000) {
          const info = res.data.list[0] || {}
          const excuteRange = info.excuteRange.map((item) => [0, ...item])
          let featureTag = []
          if (info.featureTag.length === this.timeDict.length) {
            featureTag = ['全选', ...info.featureTag]
          } else {
            featureTag = info.featureTag
          }
          this.formData = {
            assetName: info.assetName,
            assetType: info.assetType,
            assetIp: info.assetIp,
            assetMac: info.assetMac,
            allowConnect: info.allowConnect,
            blackListStatus: info.blackListStatus,
            startDateTime: 'defaultEmpty',
            startDate: info.startDate,
            startTime: info.startTime,
            featureTag,
            interceptTime: info.interceptTime,
            excuteRange,
            blackDomain: info.blackDomain,
            defenseIpOrIpRange: info.defenseIpOrIpRange,
            allowIpOrIpRange: info.allowIpOrIpRange,
            remark: info.remark
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    commitForm() {
      this.$refs.dialogForm.validate(this.commitValidate)
    },
    commitValidate(valid) {
      if (valid) {
        if (this.type === 'add') {
          this.addBlackList()
        } else if (this.type === 'edit') {
          this.editBlackList()
        }
      }
    },
    async addBlackList() {
      try {
        this.loading = true
        const params = this.getParams()
        const res = await addBlackListPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('新增成功')
          this.handleClose()
          this.$emit('getDatas')
        } else {
          this.$message.error(res.data.msg || '新增失败')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async editBlackList() {
      try {
        this.loading = true
        const params = this.getParams()
        params.id = this.originTableRow.id
        console.log(params)
        const res = await editBlackListPort(params)
        if (res && res.data && res.data.errorCode === 110000) {
          this.$message.success('编辑成功')
          this.handleClose()
          this.$emit('getDatas')
        } else {
          this.$message.error(res.data.msg || '编辑失败')
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    getParams() {
      const noReactionForm = JSON.parse(JSON.stringify(this.formData))
      const featureTag = noReactionForm.featureTag.filter(
        (item) => item !== '全选'
      )
      const excuteRange = noReactionForm.excuteRange.map((item) =>
        item.slice(1)
      )
      const obj = {
        assetName: noReactionForm.assetName,
        assetType: noReactionForm.assetType,
        assetIp: noReactionForm.assetIp,
        assetMac: noReactionForm.assetMac,
        allowConnect: noReactionForm.allowConnect,
        blackListStatus: noReactionForm.blackListStatus,
        startDateTime: 'defaultEmpty',
        startDate: noReactionForm.startDate,
        startTime: noReactionForm.startTime,
        featureTag,
        interceptTime: noReactionForm.interceptTime,
        excuteRange,
        blackDomain: noReactionForm.blackDomain,
        defenseIpOrIpRange: noReactionForm.defenseIpOrIpRange,
        allowIpOrIpRange: noReactionForm.allowIpOrIpRange,
        remark: noReactionForm.remark
      }
      return obj
    },
    handleClose() {
      this.visible = false
      this.$refs.dialogForm.clearValidate()
      this.$refs.dialogForm.resetFields()
      this.formData = {
        assetName: '',
        assetType: '',
        assetIp: '',
        assetMac: '',
        allowConnect: 1,
        blackListStatus: 1,
        startDateTime: 'defaultEmpty',
        startDate: '',
        startTime: '',
        featureTag: [],
        interceptTime: '',
        excuteRange: '',
        blackDomain: '',
        defenseIpOrIpRange: [
          {
            ipWay: 1,
            allowIp: '',
            allowIpRange: ''
          }
        ],
        allowIpOrIpRange: [
          {
            ipWay: 1,
            allowIp: '',
            allowIpRange: ''
          }
        ]
      }
    }
  }
}
</script>

<style lang="less">
.addOrEditBaseDialog-page {
  .row2Form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: calc((100% - 40px) / 2);
    }
    .full {
      width: 100%;
    }
  }
  .switch-row-form {
    display: flex;
    align-items: center;
    .startBtn {
      margin-left: 12px;
      color: #29b641;
    }
    .stopBtn {
      margin-left: 12px;
    }
  }
  .formItemDateFlex {
    .el-form-item__content {
      display: flex;
      align-items: center;
      & > div {
        width: calc((100% - 10px) / 2);
      }
      & > .el-select {
        margin-left: 10px;
      }
    }
  }
  .formItemIpFlex {
    .allowTotalDiv,
    .defenseTotalDiv {
      display: flex;
      align-items: center;
      & > .el-select {
        width: 100px;
      }
      & > .el-input {
        margin-left: 10px;
        width: calc(100% - 110px - 60px);
      }
      .main-icon {
        width: 60px;
        .el-icon-circle-plus-outline,
        .el-icon-circle-close {
          font-size: 20px;
          margin-left: 10px;
          margin-top: 15px;
          color: #5587ff;
          cursor: pointer;
          &:hover {
            opacity: 0.85;
          }
        }
      }
    }
  }
}
</style>
