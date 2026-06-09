<template>
  <div class="dagreG6Chart-page">
    <div id="container"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
let self

export default {
  name: 'DagreG6Chart',
  props: {
    // 原始数据
    initNodeDatas: {
      type: Array,
      default: () => []
    },
    // 副标题字段
    subTitle: {
      type: String,
      default: 'channelName'
    },
    // 节点状态字段
    nodeStatus: {
      type: String,
      default: 'linkOrderState'
    }
  },
  watch: {
    initNodeDatas: {
      deep: true,
      handler() {
        this.init()
      }
    }
  },
  data() {
    self = this
    return {
      graph: null,
      dataInfo: [],
      initialTransform: {},
      nodeWidth: 180,
      nodeHeight: 62,
      surplusPadding: 20
    }
  },
  mounted() {
    // 1. 自定义节点
    G6.registerNode('normal-node', {
      draw(cfg, group) {
        const width = self.nodeWidth
        const height = self.nodeHeight
        const maxWidth = width - 55
        const x = -width / 2
        const y = -height / 2
        let displayText = cfg.label
        // 测量一段文本在特定字体大小下的像素宽度
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.font = `14px Alibaba-PuHuiTi-Regular`
        const textWidth = context.measureText(cfg.label).width
        // 文本宽度超出预留宽度时手动截断并加上...（当前方法时间复杂度较高O(n)，推荐二分法O(log n)）
        if (textWidth > maxWidth) {
          for (let i = 1; i < cfg.label.length; i++) {
            const testText = cfg.label.slice(0, i) + '...'
            if (context.measureText(testText).width > maxWidth) {
              displayText = cfg.label.slice(0, i - 1) + '...'
              break
            }
            displayText = testText
          }
        }
        const map = {
          0: {
            shapeStroke: '#C9CDD4',
            shapeFill: '#f4f5f6',
            shapeShadowColor: 'rgba(0, 0, 0, 0.10)',
            shapeShadowOffsetX: 0,
            shapeShadowOffsetY: 4,
            shapeShadowBlur: 4,
            img: require('@/assets/img/aboutG6OrX6/unfinish_icon.png'),
            labelFill: '#5e6167'
          },
          O: {
            shapeStroke: '#3BB346',
            shapeFill: '#ecf8ed',
            shapeShadowColor: 'rgba(1, 70, 25, 0.10)',
            shapeShadowOffsetX: 0,
            shapeShadowOffsetY: 4,
            shapeShadowBlur: 6,
            img: require('@/assets/img/aboutG6OrX6/finish_icon.png'),
            labelFill: '#1D2129'
          },
          R: {
            shapeStroke: '#0077FA',
            shapeFill: '#e6f2ff',
            shapeShadowColor: 'rgba(1, 64, 133, 0.10)',
            shapeShadowOffsetX: 0,
            shapeShadowOffsetY: 4,
            shapeShadowBlur: 6,
            img: require('@/assets/img/aboutG6OrX6/going_icon.png'),
            labelFill: '#1D2129'
          },
          E: {
            shapeStroke: '#FFA901',
            shapeFill: '#fff7e6',
            shapeShadowColor: 'rgba(216, 7, 7, 0.15)',
            shapeShadowOffsetX: 0,
            shapeShadowOffsetY: 4,
            shapeShadowBlur: 6,
            img: require('@/assets/img/aboutG6OrX6/abnormal_icon.png'),
            labelFill: '#FF8838'
          },
          noDefault: {
            shapeStroke: '#73b4fc',
            shapeFill: '#e6f2ff',
            shapeShadowColor: 'none',
            shapeShadowOffsetX: 0,
            shapeShadowOffsetY: 0,
            shapeShadowBlur: 0,
            img: require('@/assets/img/aboutG6OrX6/normal_icon.png'),
            labelFill: '#1D2129'
          }
        }
        // 节点主形状（矩形）
        const rect = group.addShape('rect', {
          attrs: {
            x,
            y,
            width,
            height,
            radius: 8,
            stroke: map[cfg.nodeStatus]['shapeStroke'],
            fill: map[cfg.nodeStatus]['shapeFill'],
            lineWidth: 1.5,
            shadowColor: map[cfg.nodeStatus]['shapeShadowColor'], // 颜色 + 透明度
            shadowOffsetX: map[cfg.nodeStatus]['shapeShadowOffsetX'], // 水平偏移
            shadowOffsetY: map[cfg.nodeStatus]['shapeShadowOffsetY'], // 垂直偏移
            shadowBlur: map[cfg.nodeStatus]['shapeShadowBlur'] // 模糊程度
          },
          name: 'main-rect',
          draggable: true
        })
        // 节点标签（图标）
        group.addShape('image', {
          attrs: {
            x: -75,
            y: -22,
            width: 20,
            height: 20,
            img: map[cfg.nodeStatus]['img']
          },
          name: 'icon-image'
        })
        // 节点标签（文字）
        group.addShape('text', {
          attrs: {
            text: displayText,
            x: -50,
            y: -12,
            fill: map[cfg.nodeStatus]['labelFill'],
            fontSize: 14,
            textAlign: 'left',
            fontFamily: 'Alibaba-PuHuiTi-Regular',
            textBaseline: 'middle'
          },
          name: 'node-label',
          draggable: true
        })
        // 节点副标签（文字）
        group.addShape('text', {
          attrs: {
            text: cfg.subTitle,
            x: -75,
            y: 12,
            fill: '#9aa29e',
            fontSize: 13,
            textAlign: 'left',
            fontFamily: 'Alibaba-PuHuiTi-Medium',
            textBaseline: 'middle'
          },
          name: 'node-sub-title',
          draggable: true
        })
        // 添加 +/- 按钮（仅当有后续节点时）
        if (cfg.hasChildren !== false) {
          // 通过数据传入判断是否有子节点
          const button = group.addShape('text', {
            attrs: {
              x: 100,
              y: -10,
              text: cfg.collapsed ? '+' : '-',
              fill: '#a8aeba',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              textBaseline: 'middle',
              background: '#fff',
              padding: 2
            },
            name: 'collapse-button',
            draggable: false
          })
          // 绑定点击事件
          button.on('click', (e) => {
            e.stopPropagation()
            self.handleCollapse(cfg.id, cfg.collapsed)
          })
        }
        return rect
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5]
        ]
      }
    })
    // 2. 自定义边
    G6.registerEdge(
      'normal-edge',
      {
        runAnimate(group) {
          if (group.get('isAnimating')) return
          group.set('isAnimating', true)
          group.toFront()
          let index = 0
          const path = group.getFirst()
          const dashLine = group.addShape('path', {
            attrs: {
              offset: path.attrs.offset,
              path: path.attrs.path,
              lineWidth: 1.5,
              stroke: '#0077FA'
            },
            name: 'edge-dash'
          })
          dashLine.animate(
            (radio) => {
              index++
              return {
                lineDash: [4, 8, 4, 8],
                lineDashOffset: -index
              }
            },
            {
              repeat: true,
              duration: 6000
            }
          )
        },
        stopAnimate(group) {
          const path = group.find((item) => item.cfg.name === 'edge-dash')
          if (path) {
            group.removeChild(path)
            group.set('isAnimating', false)
          }
        },
        setState(name, value, item) {
          const group = item.getContainer()
          if (name === 'edgeState:active' && value) {
            this.runAnimate(group)
          } else {
            this.stopAnimate(group)
          }
        },
        afterUpdate(cfg, item) {
          const group = item.getContainer()
          const dashLine = group.find((shape) => shape.cfg.name === 'edge-dash')
          const mainPath = group.getFirst()
          if (dashLine && mainPath) {
            dashLine.attr('path', mainPath.attr('path'))
          }
        }
      },
      'polyline'
    )
    // 3. 自定义行为-边框动画
    G6.registerBehavior('edge-active', {
      getEvents() {
        return {
          'edge:mouseenter': 'onMouseEnter',
          'edge:mouseleave': 'onMouseLeave',
          'node:mouseenter': 'onNodeMouseEnter',
          'node:mouseleave': 'onNodeMouseLeave'
        }
      },
      onMouseEnter(e) {
        e.item.setState('edgeState:active', true)
      },
      onMouseLeave(e) {
        e.item.setState('edgeState:active', false)
      },
      onNodeMouseEnter(e) {
        const edges = e.item.getEdges()
        edges.forEach((edge) => {
          edge.setState('edgeState:active', true)
        })
      },
      onNodeMouseLeave(e) {
        const edges = e.item.getEdges()
        edges.forEach((edge) => {
          edge.setState('edgeState:active', false)
        })
      }
    })
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.graph && this.graph.destroy()
    this.graph = null
  },
  methods: {
    init() {
      this.graph && this.graph.destroy()
      this.graph = null
      console.log(this.initNodeDatas)
      this.dataInfo = this.transformFlowDataToGraphList(this.initNodeDatas)
      console.log(this.dataInfo)
      // 配置 minimap
      const minimap = new G6.Minimap({
        size: [220, 105],
        className: 'g6-minimap' // 添加类名便于调试
      })
      // 配置 tooltip
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        getContent(e) {
          const outDiv = document.createElement('div')
          const model = e.item.getModel()
          outDiv.className = 'tooltip-container'
          outDiv.innerHTML = `<div class='hover-title'>${model.label}</div>`
          return outDiv
        },
        shouldBegin: (e) => {
          return e.target.cfg.name !== 'collapse-button'
        },
        itemTypes: ['node']
      })
      this.graph = new G6.Graph({
        container: 'container',
        width: document.getElementById('container').clientWidth,
        height: document.getElementById('container').clientHeight,
        plugins: [minimap, tooltip],
        modes: {
          default: ['drag-node', 'drag-canvas', 'edge-active']
        },
        layout: {
          type: 'dagre',
          begin: [0, 0],
          rankdir: 'LR',
          align: 'UL',
          nodesep: 20,
          ranksep: 65,
          ranker: 'longest-path' // 尝试不同的布局算法:cite[3]
        },
        defaultNode: {
          type: 'normal-node'
        },
        defaultEdge: {
          type: 'normal-edge',
          style: {
            radius: 10,
            stroke: '#a8aeba',
            lineWidth: 1.5,
            lineDash: [3, 3],
            lineAppendWidth: 10,
            endArrow: {
              // 手动绘制一个 '>' 形状：两条斜线组成
              path: 'M 6,4 L 0,0 L 6,-4', // 类似 > 的线条
              stroke: '#a8aeba',
              fill: 'transparent', // 无填充，只显示线条
              lineWidth: 1.5,
              lineDash: [0] // 箭头实线
            }
          }
        }
      })
      this.graph.data(this.dataInfo)
      this.graph.render()
      this.mouseBehavior()
      this.graph.on('afterlayout', () => {
        this.adjustViewPosition() // 让画布水平靠左垂直居中
        this.setupCanvasDragTracking() // 拖拽边界问题
      })
    },
    getCanvasTransform() {
      /** matrix是一个 3*3 矩阵，列如
       * [ 1    0    110.75 ]
       * [ 0    1    283.5  ]
       * [ 0    0    1      ]
       * g6中将矩阵写作[1,0,0,0,1,0,110.75,280.75,1]
       * 分别代表[水平缩放,垂直倾斜,0,水平倾斜,垂直缩放,0,水平平移,垂直平移,齐次坐标分量]
       */
      return this.graph && this.graph.getGroup().getMatrix()
    },
    // 设置画布拖拽跟踪
    setupCanvasDragTracking() {
      // 记录初始位置
      this.initialTransform = this.getCanvasTransform()
      // 拖拽过程中计算偏移量
      this.graph.on('viewportchange', (e) => {
        const graphBBox = this.getGraphGroupParams()
        const currentTransform = this.getCanvasTransform()
        const offsetX = this.initialTransform[6] - currentTransform[6] // 画布：大于0往左，小于0往右
        const offsetY = this.initialTransform[7] - currentTransform[7] // 画布：大于0往上，小于0往下
        const newTransform = JSON.parse(JSON.stringify(currentTransform))
        if (graphBBox.width < this.graph.getWidth()) {
          if (offsetX > 0) {
            newTransform[6] = this.initialTransform[6]
            this.graph.getGroup().setMatrix(newTransform)
          }
          if (
            offsetX +
              this.graph.getWidth() -
              graphBBox.width -
              this.surplusPadding * 2 <
            0
          ) {
            newTransform[6] =
              this.initialTransform[6] +
              this.graph.getWidth() -
              graphBBox.width -
              this.surplusPadding * 2
            this.graph.getGroup().setMatrix(newTransform)
          }
        } else {
          if (offsetX < 0) {
            newTransform[6] = this.initialTransform[6]
          }
          if (
            offsetX -
              graphBBox.width +
              this.graph.getWidth() -
              this.surplusPadding * 2 >
            0
          ) {
            newTransform[6] =
              this.initialTransform[6] -
              graphBBox.width +
              this.graph.getWidth() -
              this.surplusPadding * 2
          }
        }
        if (graphBBox.height < this.graph.getHeight()) {
          if (
            offsetY +
              this.graph.getHeight() / 2 -
              graphBBox.height / 2 -
              this.surplusPadding <
            0
          ) {
            newTransform[7] =
              this.initialTransform[7] +
              this.graph.getHeight() / 2 -
              graphBBox.height / 2 -
              this.surplusPadding
          }
          if (
            offsetY -
              this.graph.getHeight() / 2 +
              graphBBox.height / 2 +
              this.surplusPadding >
            0
          ) {
            newTransform[7] =
              this.initialTransform[7] -
              this.graph.getHeight() / 2 +
              graphBBox.height / 2 +
              this.surplusPadding
          }
        } else {
          if (
            offsetY +
              graphBBox.height / 2 -
              this.graph.getHeight() / 2 +
              this.surplusPadding <
            0
          ) {
            newTransform[7] =
              this.initialTransform[7] +
              graphBBox.height / 2 -
              this.graph.getHeight() / 2 +
              this.surplusPadding
          }
          if (
            offsetY -
              graphBBox.height / 2 +
              this.graph.getHeight() / 2 -
              this.surplusPadding >
            0
          ) {
            newTransform[7] =
              this.initialTransform[7] -
              graphBBox.height / 2 +
              this.graph.getHeight() / 2 -
              this.surplusPadding
          }
        }
        this.graph.getGroup().setMatrix(newTransform)
      })
    },
    mouseBehavior() {
      const container = this.graph.getContainer()
      this.graph.on('node:mouseenter', (e) => {
        container.classList.add('node-hover')
      })
      this.graph.on('node:mouseover', (e) => {
        const shapeName = e.target.cfg.name
        if (shapeName && shapeName === 'collapse-button') {
          container.classList.add('collapse-hover')
        } else {
          container.classList.remove('collapse-hover')
        }
      })
      this.graph.on('node:mouseleave', (e) => {
        container.classList.remove('node-hover')
      })
      this.graph.on('edge:mouseenter', (e) => {
        container.classList.add('node-hover')
      })
      this.graph.on('edge:mouseleave', (e) => {
        container.classList.remove('node-hover')
      })
    },
    adjustViewPosition() {
      const height = this.graph.getHeight()
      // 获取图包围盒
      const graphBBox = this.getGraphGroupParams()
      // 计算水平方向位置（左侧对齐）
      const targetX = this.surplusPadding
      // 计算垂直方向居中位置（基于节点边界）
      const targetY = (height - graphBBox.height) / 2
      // 移动画布到目标位置
      this.graph.translate(-graphBBox.minX + targetX, -graphBBox.minY + targetY)
    },
    // 使用一种更加精确的方法计算graph包围盒的长宽
    getGraphGroupParams() {
      // 获取所有节点
      let graphBBox = {}
      const nodes = this.graph.getNodes()
      if (nodes.length > 0) {
        // 手动计算节点的边界框
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        nodes.forEach((node) => {
          const bbox = node.getBBox()
          minX = Math.min(minX, bbox.minX)
          maxX = Math.max(maxX, bbox.maxX)
          minY = Math.min(minY, bbox.minY)
          maxY = Math.max(maxY, bbox.maxY)
        })
        graphBBox = {
          width: maxX - minX,
          height: maxY - minY,
          minX: minX,
          maxX: maxX,
          minY: minY,
          maxY: maxY
        }
      }
      return graphBBox
    },
    // 数据转换为 antvG6 需要的数据格式
    transformFlowDataToGraphList(data) {
      if (!data || !Array.isArray(data)) {
        return []
      }
      // 创建映射关系
      const sortToNodeMap = new Map() // currentSort -> 节点信息
      const codeToNodeMap = new Map() // taskTemplateCode -> 节点信息
      // 第一步：构建节点映射
      data.forEach((item) => {
        const node = {
          id: item.taskTemplateCode,
          label: item.taskTemplateName,
          subTitle: item[this.subTitle] || 'title',
          nodeStatus: item[this.nodeStatus] || 'noDefault',
          data: item, // 保留原始数据
          collapsed: false, // 初始不折叠
          hasChildren: !!item.afterSort // 是否有后续节点
        }
        sortToNodeMap.set(item.currentSort, node)
        codeToNodeMap.set(item.taskTemplateCode, node)
      })
      // 第二步：构建边
      const edges = []
      data.forEach((item) => {
        const sourceNode = codeToNodeMap.get(item.taskTemplateCode)
        if (!sourceNode) return
        // 处理 afterSort（后续节点）
        if (item.afterSort) {
          const nextSorts = item.afterSort.split(',')
          nextSorts.forEach((nextSort) => {
            const nextSortTrimmed = nextSort.trim()
            if (nextSortTrimmed) {
              const targetNode = sortToNodeMap.get(nextSortTrimmed)
              if (targetNode) {
                edges.push({
                  source: sourceNode.id,
                  target: targetNode.id,
                  id: `edge-${sourceNode.id}-${targetNode.id}` // 给边加唯一 ID，便于删除
                })
              }
            }
          })
        }
      })
      // 第三步：构建返回格式
      const nodes = Array.from(codeToNodeMap.values())
      return {
        nodes: nodes,
        edges: edges
      }
    },
    handleCollapse(nodeId, collapse) {
      const graph = this.graph
      const node = graph.findById(nodeId)
      if (!node) return
      // 获取所有后续节点
      const allSuccessors = this.findAllSuccessors(nodeId)
      // 设置节点和边的可见性
      allSuccessors.forEach((successorId) => {
        // 隐藏/显示节点
        /**
         * ※ 当collapse为fasle时，代表没被收起，dom显示-号，此时点击
         * 1.隐藏后续所有节点
         * /2/.将后续所有节点collapsed设置为true，代表已被收起，dom显示+号 // 其实可以不要，因为整个节点都不显示了
         * 3.获取后续已隐藏节点的所有前置节点
         * 4.将前置节点collapsed设置为true，代表已被收起，dom显示+号
         * ※ 当collapse为true时，代表已被收起，dom显示+号，此时点击
         * 1.显示后续所有节点
         * 2.将后续所有节点collapsed设置为false，代表没被收起，dom显示-号
         * 3.获取后续已显示节点的所有前置节点
         * 4.将前置节点collapsed设置为false，代表没被收起，dom显示-号
         */
        if (!collapse) {
          graph.hideItem(successorId)
          graph.updateItem(successorId, {
            collapsed: true
          })
          const prevNodes = graph.getNeighbors(successorId, 'source')
          prevNodes.forEach((node) => {
            graph.updateItem(node, {
              collapsed: true
            })
          })
        } else {
          graph.showItem(successorId)
          graph.updateItem(successorId, {
            collapsed: false
          })
          const prevNodes = graph.getNeighbors(successorId, 'source')
          prevNodes.forEach((node) => {
            graph.updateItem(node, {
              collapsed: false
            })
          })
        }
      })
      // 刷新图形
      graph.refresh()
    },
    // 查找节点的所有后续节点
    findAllSuccessors(nodeId) {
      const successors = new Set()
      const visited = new Set()
      const stack = [nodeId]
      while (stack.length > 0) {
        const current = stack.pop()
        if (visited.has(current)) continue
        visited.add(current)
        // 查找当前节点的直接后续节点
        const edges = this.graph.getEdges()
        edges.forEach((edge) => {
          const model = edge.getModel()
          if (model.source === current && !visited.has(model.target)) {
            successors.add(model.target)
            stack.push(model.target)
          }
        })
      }
      return Array.from(successors)
    }
  }
}
</script>

<style scoped lang="less">
.dagreG6Chart-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/aboutG6OrX6/process_bg.svg');
  /deep/ #container {
    width: 100%;
    height: 100%;
    > canvas {
      position: relative;
      cursor: grab !important;
      z-index: 9;
    }
    &.node-hover {
      > canvas {
        cursor: default !important;
      }
    }
    &.collapse-hover {
      > canvas {
        cursor: pointer !important;
      }
    }
    .g6-minimap {
      position: absolute;
      bottom: 0px;
      right: 0;
      border-radius: 6px;
      background: linear-gradient(180deg, #ebf8ff 0%, #fff 100%);
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
      z-index: 9;
    }
    .g6-component-tooltip {
      background-color: #fff;
      z-index: 99;
      .tooltip-container {
        .hover-title {
          font-family: 'Alibaba-PuHuiTi-Regular';
          font-size: 14px;
        }
      }
    }
  }
}
</style>
