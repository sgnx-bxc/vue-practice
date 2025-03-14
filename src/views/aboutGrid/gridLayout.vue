<template>
  <div class="gridLayout-page">
    <!-- 头部操作区 -->
    <div class="edit_tool">
      <div class="time_btn">
        <div class="title">
          Dashboard
          <span v-show="editAble">编辑</span>
        </div>
        <!-- 时间选择 -->
        <timeRangeRadio
          v-show="!editAble"
          ref="timeRangeRadioRef"
          :hasPicker="false"
          :timeIndex.sync="timeIndex"
          :startTime.sync="startTime"
          :endTime.sync="endTime"
          :timeInterval.sync="timeInterval"
          @timeRangeChange="timeRangeChange"
        ></timeRangeRadio>
        <!-- 筛选卡片的选框 -->
        <div class="filter_card" v-show="editAble">
          <el-popover
            placement="bottom-start"
            trigger="click"
            popper-class="dashBoard-filter-card"
            @after-enter="showBoard"
            @hide="hideBoard"
          >
            <dashboardFilterBoard
              ref="filterBoards"
              @checkedCards="checkedCards"
            ></dashboardFilterBoard>
            <el-button slot="reference" size="small">
              图表筛选
              <i
                class="el-icon--right"
                :class="[
                  !showBoardFlag ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
                ]"
              ></i>
            </el-button>
          </el-popover>
        </div>
      </div>
      <div class="right-btn" v-show="!editAble">
        <el-button type="primary" size="small" @click="handleEdit"
          >编辑</el-button
        >
      </div>
      <div class="right-btn" v-show="editAble">
        <el-button type="primary" size="small" @click="save">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
    <!-- 工作台卡片展示区 -->
    <div class="workbench" id="workbench">
      <div class="layout_content">
        <GridLayout
          :layout="layout"
          :autoSize="false"
          :colNum="3"
          :rowHeight="cardHeight"
          :isDraggable="true"
          :isResizable="false"
          :verticalCompact="true"
          :margin="[10, 10]"
          :useCssTransforms="true"
          style="margin: -10px"
        >
          <GridItem
            v-for="(item, index) in layout"
            :key="item.i"
            :item="watchitem(item)"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            drag-allow-from=".move"
            @move="moveEvent"
            @moved="movedEvent"
          >
            <div class="card_item">
              <div class="head">
                <div class="title handle_icon">{{ item.title }}</div>
                <div class="title_tool" v-show="editAble">
                  <span class="move handle_icon">移动</span>
                  <span class="close handle_icon" @click="close(item.i)"
                    >关闭面板</span
                  >
                </div>
              </div>

              <component
                class="card-content"
                :ref="'cardRef' + index"
                :is="item.compentent"
              ></component>
            </div>
          </GridItem>
        </GridLayout>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import timeRangeRadio from '@/components/time/timeRangeRadio.vue'
import dashboardFilterBoard from './gridLayout/dashboardFilterBoard.vue'
import safeTrend from './gridLayout/components/safeTrend.vue'
import alarmEvent from './gridLayout/components/alarmEvent.vue'
import alarmType from './gridLayout/components/alarmType.vue'
import assetCount from './gridLayout/components/assetCount.vue'
import attackChain from './gridLayout/components/attackChain.vue'
import lostAssets from './gridLayout/components/lostAssets.vue'
import assetLeak from './gridLayout/components/assetLeak.vue'
import flawTrend from './gridLayout/components/flawTrend.vue'
import protocolSpread from './gridLayout/components/protocolSpread.vue'
import {
  getGridAllCardPort,
  getGridLayoutPort,
  saveDashboardLayoutPort
} from '@/api/request/aboutGrid'

export default {
  name: 'gridLayout',
  components: {
    timeRangeRadio,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    dashboardFilterBoard,
    safeTrend,
    alarmEvent,
    alarmType,
    assetCount,
    attackChain,
    lostAssets,
    assetLeak,
    flawTrend,
    protocolSpread
  },
  data() {
    return {
      editAble: false,
      // 时间选择
      timeIndex: 1, // 显示012，接口123
      timeInterval: 0, // 颗粒度间隔秒数
      startTime: '',
      endTime: '',
      // 布局
      layout: [],
      cardHeight: 0,
      historyLayout: [], // 记录上一次的布局， 用于移动card时替换位置
      curBox: null,
      // 筛选
      showBoardFlag: false,
      allCardList: []
    }
  },
  computed: {
    isCollapse() {
      return this.$store.getters['system/getIsCollapse']
    }
  },
  watch: {
    isCollapse() {
      this.resize()
    }
  },
  mounted() {
    this.$refs.timeRangeRadioRef.initTimeRangeRadio()
    this.resize()
    window.addEventListener('resize', this.resize)
    this.getGridLayout()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    timeRangeChange() {
      this.getGridLayout()
    },
    // 设置卡片高度
    resize() {
      // 每页两行卡片
      const height = document.getElementById('workbench').offsetHeight - 10
      this.cardHeight = height / 2
    },
    async getGridLayout() {
      this.layout = []
      const params = {
        timeIndex: this.timeIndex,
        timeInterval: this.timeInterval,
        startTime: this.startTime,
        endTime: this.endTime
      }
      Promise.all([getGridAllCardPort(params), getGridLayoutPort(params)])
        .then((values) => {
          const info1 = values[0].data.list || []
          const info2 = values[1].data.list || []
          if (info1 && info2) {
            info1.forEach((a) => {
              info2.forEach((b) => {
                if (a.cardId === b.cardId) {
                  a.isChecked = true // 标示card 集合该卡片被选中了
                  this.layout.push({
                    x: b.col,
                    y: b.row,
                    w: 1,
                    h: 1,
                    i: b.cardId,
                    compentent: a.cardValue,
                    title: a.cardName
                  })
                }
              })
            })
            this.historyLayout = JSON.parse(JSON.stringify(this.layout))
            this.allCardList = info1
          } else {
            this.$message.error('获取数据失败')
          }
        })
        .catch((e) => {
          console.error(e)
        })
    },
    // 编辑 dashboard 布局
    handleEdit() {
      this.editAble = true
    },
    // 取消 dashboard 布局
    cancel() {
      this.editAble = false
      // 初始化时间选择组件
      this.$refs.timeRangeRadioRef.initTimeRangeRadio()
      this.$nextTick(() => {
        // 重新查询页面的布局
        this.getGridLayout()
      })
    },
    // 保存 dashboard 布局
    async save() {
      let params = []
      this.layout.forEach((item) => {
        const obj = {
          col: item.x,
          row: item.y,
          cardId: item.i,
          cardName: item.title,
          cardValue: item.compentent
        }
        params.push(obj)
      })
      if (params.length === 0) {
        this.$message.warning('请选择要展示的卡片')
        return
      }
      const res = await saveDashboardLayoutPort(params)
      if (res && res.data && res.data.errorCode === 110000) {
        this.$message.success('保存成功')
        this.cancel()
      } else {
        this.$message.error(res.data.msg || '保存失败')
      }
    },
    // 此代码可以优化，将:item响应式更新放进moveEvent中可提高大量性能
    watchitem(item) {
      // 如果不是当前移动的 使其位置保持不变
      if (this.curBox !== item.i) {
        for (let j = 0; this.historyLayout[j] !== undefined; j++) {
          if (this.historyLayout[j].i === item.i) {
            item.x = this.historyLayout[j].x
            item.y = this.historyLayout[j].y
          }
        }
      }
      return item
    },
    // 获取被拖拽的对象的 i
    moveEvent(i, newX, newY, e) {
      this.curBox = i
    },
    // 拖拽结束后的位置
    movedEvent(i, newX, newY, e) {
      this.curBox = ''
      let layout = this.layout
      let hisLayout = this.historyLayout
      // 移动的目标对象
      let sourceItem = null
      let sourceHisItem = null
      // 需要被替换的目标对象
      let targetItem = null
      let targetHisItem = null
      let targetIndex = hisLayout.findIndex((v) => v.x === newX && v.y === newY)
      // 判断是否拖拽出边界了
      if (targetIndex !== -1) {
        sourceItem = layout.find((v) => v.i === i)
        targetItem = layout.find((v) => v.i === layout[targetIndex].i)
        sourceHisItem = hisLayout.find((v) => v.i === i)
        targetHisItem = hisLayout.find((v) => v.i === targetItem.i)
        // 需要根据历史记录找到它们以前的布局x y 进行互换
        let sourceBeforeX = sourceHisItem.x
        let sourceBeforeY = sourceHisItem.y
        let targetBeforeX = targetHisItem.x
        let targetBeforeY = targetHisItem.y
        sourceItem.x = targetBeforeX
        sourceItem.y = targetBeforeY
        targetItem.x = sourceBeforeX
        targetItem.y = sourceBeforeY
        this.historyLayout = JSON.parse(JSON.stringify(this.layout))
      } else {
        this.layout = JSON.parse(JSON.stringify(this.historyLayout))
      }
    },
    close(i) {
      let deleteList = this.layout.filter((item) => item.i === i)
      this.allCardList.forEach((item) => {
        if (item.cardId === i) {
          item.isChecked = false
        }
      })
      this.deleteByCurrentOrder(deleteList)
    },
    deleteByCurrentOrder(deleteList) {
      deleteList.forEach((deleteItem) => {
        // 1 首先从历史记录里面找到被删除的元素，也要把它删除了
        let delIndex = this.historyLayout.findIndex(
          (item) => item.i === deleteItem.i
        )
        this.historyLayout.splice(delIndex, 1)
        // 2 历史记录 item，比较 item 的x1 和y1 与被删除元素的x 和 y 的关系
        // 如果 y1 >y || (y1 = y && x1>x)  则对这些元素进行操作
        for (let l = 0; l < this.historyLayout.length; l++) {
          let hisObj = this.historyLayout[l]
          if (
            hisObj.y > deleteItem.y ||
            (hisObj.y === deleteItem.y && hisObj.x > deleteItem.x)
          ) {
            // 需要判断此时的 x1 的值 如果 x1 -1 <0 则说明 改需要移动的元素在最左侧， 此时需要 y1 -1 ，x1 = 2(暂时写死，布局目前是一行三列)
            // 否则 直接 x1 - 1, 向左移动一格就可以了
            if (hisObj.x - 1 < 0) {
              hisObj.x = 2
              hisObj.y -= 1
            } else {
              hisObj.x -= 1
            }
          }
        }
      })
      // 将历史记录更新到展示的列表中
      this.layout = JSON.parse(JSON.stringify(this.historyLayout))
    },
    showBoard() {
      this.showBoardFlag = true
      this.$refs.filterBoards.initData(this.allCardList)
    },
    hideBoard() {
      this.showBoardFlag = false
    },
    // 接受筛选框选择事件，获取当前选择的cards
    checkedCards({ checkedKeys, checkedNodes }) {
      // 0 更新卡片集合的选中状态
      this.allCardList.forEach(
        (item) => (item.isChecked = checkedKeys.indexOf(item.cardId) !== -1)
      )
      // 1 获取要删除的 cards
      const deleteList = this.layout.filter(
        (item) => checkedKeys.indexOf(item.i) === -1
      )
      this.deleteByCurrentOrder(deleteList)
      // 2 获取新增的 cards 集合
      // 2.1 获取页面工作台已经存在的 卡片 id 集合
      const onShowCardSet = []
      this.layout.forEach((item) => onShowCardSet.push(item.i))
      // 2.2 比较选中的和当前工作区的卡片 id 集合
      const newAddCardIds = []
      const newAddCards = []
      checkedKeys.forEach((key) => {
        if (key !== -1 && !onShowCardSet.includes(key)) {
          // 表明是新增的情况
          newAddCardIds.push(key)
        }
      })
      // 2.3 组装新增对象list
      this.allCardList.forEach((item) => {
        newAddCardIds.forEach((smitem) => {
          if (item.cardId === smitem) {
            const obj = {
              i: item.cardId,
              compentent: item.cardValue,
              title: item.cardName
            }
            newAddCards.push(obj)
          }
        })
      })
      // 3 调用方法新增卡片
      this.addXY2AppendItems(newAddCards)
    },
    addXY2AppendItems(addList) {
      // 1. 获取当的布局中右下角的元素的 （X,Y）
      // 2. 根据获取的右下角的坐标，进行依次的最加
      let X = -1
      let Y = -1
      // 获取最下面一排的 item
      this.layout.forEach((item) => {
        if (Y < item.y) {
          Y = item.y
        }
      })
      let list = this.layout.filter((v) => {
        return v.y === Y
      })
      // 获取最下面一排，最右侧的 item
      list.forEach((item) => {
        if (X < item.x) {
          X = item.x
        }
      })
      // 分2步：step1先让新增的card位于当前布局最后一个card的位置，然后对位置进行调整
      addList.forEach((addItem, index) => {
        if (index === 0) {
          addItem.x = X
          addItem.y = Y
        } else {
          addItem.x = addList[index - 1].x
          addItem.y = addList[index - 1].y
        }
        if (addItem.x + 1 > 2) {
          addItem.x = 0
          addItem.y += 1
        } else {
          addItem.x += 1
          addItem.y = addItem.y === -1 ? 0 : addItem.y
        }
        // 补充 w 和 h
        addItem.w = 1
        addItem.h = 1
      })
      // 将处理好的 item 放入到 layout 中去
      this.layout = [...this.layout, ...addList]
      // 需要更新备份数据
      this.historyLayout = JSON.parse(JSON.stringify(this.layout))
    }
  }
}
</script>

<style lang="less">
.gridLayout-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .edit_tool {
    border-radius: 4px;
    height: 60px;
    // width: calc(100% - 25px);
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    // margin-left: 10px;
    margin-left: 0;
    .time_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        margin: 0 30px;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
    .right-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-right: 24px;
    }
    .el-button--primary {
      min-width: 64px;
      color: #fff;
      background: #409eff;
      border-color: #409eff;
      box-shadow: 0px 3px 0px 0px #f3f3f3;
      &:focus,
      &:hover {
        opacity: 0.7;
      }
    }
    .el-button--default {
      min-width: 64px;
      color: #333;
      background: #fff;
      border-color: #409eff;
      box-shadow: 0px 3px 0px 0px #f3f3f3;
      &:focus,
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .workbench {
    width: 100%;
    height: calc(100% - 70px);
    margin-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    .layout_content {
      height: 100%;
      width: 100%;
    }
    .card_item {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      .head {
        height: 24px;
        padding: 12px 0 0 0;
        color: #333;
        font-size: 16px;
        font-family: Alibaba-PuHuiTi-Medium;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          &.handle_icon::before {
            display: inline-block;
            width: 25px;
            height: 25px;
            margin-right: 10px;
            margin-left: 20px;
            content: '';
            background: url('~@/assets/img/aboutGrid/cardTitleIcon.png') center
              no-repeat;
          }
          .assetLeak-style {
            display: flex;
            align-items: center;
            .tip-style {
              cursor: pointer;
              color: #5587ff;
              margin-top: 2px;
            }
          }
        }
        .title_tool {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 24px;
          font-size: 12px;
          font-weight: normal;
          color: #727e8d;
          .move {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: move;
            margin-right: 20px;
            &::before {
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-right: 5px;
              content: '';
              background: url('~@/assets/img/aboutGrid/move.png') center
                no-repeat;
              background-size: contain;
            }
          }
          .close {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &::before {
              display: inline-block;
              width: 14px;
              height: 14px;
              margin-right: 5px;
              content: '';
              background: url('~@/assets/img/aboutGrid/close.png') center
                no-repeat;
              background-size: contain;
            }
          }
        }
      }
      .card-content {
        padding: 0 15px;
        height: calc(100% - 46px);
        position: relative;
      }
    }
  }
}
</style>
