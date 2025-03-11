<template>
  <div class="assetFreqTop10Chart-page">
    <g6ChartTool
      :class="{ 'edr-nonechartdata': nochartdatas }"
      :id="id"
      ref="assetFreqTop10ChartRef"
      :graph="graph"
    ></g6ChartTool>
  </div>
</template>

<script>
export default {
  name: 'assetFreqTop10Chart',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nochartdatas: true,
      graph: null
    }
  },
  methods: {
    initCharts(data) {
      if (Object.keys(data).length > 0) {
        this.nochartdatas = false
        const width = document.getElementById(
          'assetFreqTop10ChartId'
        ).clientWidth
        const height = document.getElementById(
          'assetFreqTop10ChartId'
        ).clientHeight
        this.graph = new this.$g6.Graph({
          container: 'assetFreqTop10ChartId',
          width,
          height,
          minZoom: 1.15,
          modes: {
            default: ['drag-canvas', 'zoom-canvas', 'click-select']
          },
          layout: {
            type: 'force',
            nodeStrength: 1500,
            nodeSpacing: 10,
            preventOverlap: true,
            onTick: () => {
              const centerNode = this.graph.findById('flow')
              const centerX = this.graph.getWidth() / 2
              const centerY = this.graph.getHeight() / 2
              const obj = {
                x: centerX,
                y: centerY
              }
              centerNode.updatePosition(obj)
              this.graph.fitView()
            }
          },
          defaultNode: {
            type: 'circle',
            size: 80
          }
        })
        this.graph.data(data)
        this.graph.render()
        this.graph.on('node:click', (e) => {
          const node = e.item
          this.updateGraph(node, false)
          if (node.hasState('selected')) {
            this.updateGraph(node, true)
          }
        })
      } else {
        this.graph && this.graph.destroy()
        this.nochartdatas = true
      }
    },
    updateGraph(node, flag) {
      if (flag) {
        const model = node.getModel()
        model.otherData.nodes.forEach((node) => {
          this.graph.addItem('node', node)
        })
        model.otherData.edges.forEach((edge) => {
          this.graph.addItem('edge', edge)
        })
      } else {
        const nodes = this.graph.getNodes()
        nodes.forEach((node) => {
          const getNeighborsNode = node.getNeighbors()
          getNeighborsNode.forEach((item) => {
            this.graph.removeItem(item)
          })
        })
      }
      this.graph.layout()
    }
  }
}
</script>

<style lang="less">
.assetFreqTop10Chart-page {
  width: 100%;
  height: 100%;
}
</style>
