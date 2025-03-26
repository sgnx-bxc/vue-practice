<template>
  <div class="interAttackSituation-page">
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
import mainChart from './interAttackSituation/mainChart.vue'
import row2Col1 from './interAttackSituation/row2Col1.vue'
import row1Col2M1 from './interAttackSituation/row1Col2M1.vue'
import row1Col2M2 from './interAttackSituation/row1Col2M2.vue'
import row2Col2 from './interAttackSituation/row2Col2.vue'

export default {
  name: 'interAttackSituation',
  components: {
    mainChart,
    row2Col1,
    row1Col2M1,
    row1Col2M2,
    row2Col2
  },
  data() {
    return {
      layout: {
        direction: 'H',
        parts: [
          // 1
          {
            name: 'slot1',
            style: {
              width: '70%',
              height: '100%'
            },
            direction: 'V',
            parts: [
              {
                name: 'slot11',
                style: {
                  width: '100%',
                  height: 'calc((200% - 40px) / 3)'
                }
              },
              {
                name: 'slot12',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)',
                  margin: '40px 0 0 0'
                }
              }
            ]
          },
          // 2
          {
            name: 'slot2',
            style: {
              width: 'calc(30% - 40px)',
              height: '100%',
              margin: '0 0 0 40px'
            },
            direction: 'V',
            parts: [
              {
                name: 'slot21',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)'
                }
              },
              {
                name: 'slot22',
                style: {
                  width: '100%',
                  height: 'calc((100% - 80px) / 3)',
                  margin: '40px 0'
                }
              },
              {
                name: 'slot23',
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
        { name: 'mainChart', slot: 'slot11' },
        { name: 'row2Col1', slot: 'slot12' },
        { name: 'row1Col2M1', slot: 'slot21' },
        { name: 'row1Col2M2', slot: 'slot22' },
        { name: 'row2Col2', slot: 'slot23' }
      ]
    }
  }
}
</script>
