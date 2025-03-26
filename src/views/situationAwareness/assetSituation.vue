<template>
  <div class="assetSituation-page">
    <FecursiveFlex :layout="layout">
      <component
        ref="componentRef"
        :is="item.name"
        v-for="(item, index) in componentList"
        :key="index"
        :slot="item.slot"
      ></component>
    </FecursiveFlex>
  </div>
</template>

<script>
import row1Col1 from './assetSituation/row1Col1.vue'
import row2Col1 from './assetSituation/row2Col1.vue'
import row3Col1 from './assetSituation/row3Col1.vue'
import mainChart from './assetSituation/mainChart.vue'
import row3Col2 from './assetSituation/row3Col2.vue'
import row1Col3 from './assetSituation/row1Col3.vue'
import row2Col3 from './assetSituation/row2Col3.vue'
import row3Col3 from './assetSituation/row3Col3.vue'

export default {
  name: 'assetSituation',
  components: {
    row1Col1,
    row2Col1,
    row3Col1,
    mainChart,
    row3Col2,
    row1Col3,
    row2Col3,
    row3Col3
  },
  data() {
    return {
      layout: {
        direction: 'H', // 布局 H--水平 V--垂直
        parts: [
          // 1
          {
            name: 'slot1',
            style: {
              width: '20%',
              height: '100%'
            },
            direction: 'V',
            parts: [
              {
                name: 'slot11',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)'
                }
              },
              {
                name: 'slot12',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)',
                  margin: '40px 0'
                }
              },
              {
                name: 'slot13',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)'
                }
              }
            ]
          },
          // 2
          {
            name: 'slot2',
            style: {
              width: 'calc(60% - 80px)',
              height: '100%',
              margin: '0 40px'
            },
            direction: 'V',
            parts: [
              {
                name: 'slot21',
                style: {
                  width: '100%',
                  height: 'calc((200% - 40px) / 3)'
                }
              },
              {
                name: 'slot22',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)',
                  margin: '40px 0 0 0'
                }
              }
            ]
          },
          // 3
          {
            name: 'slot3',
            style: {
              width: '20%',
              height: '100%'
            },
            direction: 'V',
            parts: [
              {
                name: 'slot31',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)'
                }
              },
              {
                name: 'slot32',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)',
                  margin: '40px 0'
                }
              },
              {
                name: 'slot33',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)'
                }
              }
            ]
          }
        ]
      },
      componentList: [
        { name: 'row1Col1', slot: 'slot11' },
        { name: 'row2Col1', slot: 'slot12' },
        { name: 'row3Col1', slot: 'slot13' },
        { name: 'mainChart', slot: 'slot21' },
        { name: 'row3Col2', slot: 'slot22' },
        { name: 'row1Col3', slot: 'slot31' },
        { name: 'row2Col3', slot: 'slot32' },
        { name: 'row3Col3', slot: 'slot33' }
      ]
    }
  }
}
</script>
