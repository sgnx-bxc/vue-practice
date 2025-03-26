<template>
  <div class="exterAttackSituation-page">
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
import row1Col1 from './exterAttackSituation/row1Col1.vue'
import row2Col1 from './exterAttackSituation/row2Col1.vue'
import row3Col1 from './exterAttackSituation/row3Col1.vue'
import mainChart from './exterAttackSituation/mainChart.vue'
import row3Col2M1 from './exterAttackSituation/row3Col2M1.vue'
import row3Col2M2 from './exterAttackSituation/row3Col2M2.vue'

export default {
  name: 'exterAttackSituation',
  components: {
    row1Col1,
    row2Col1,
    row3Col1,
    mainChart,
    row3Col2M1,
    row3Col2M2
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
              width: 'calc((100% - 80px) / 3)',
              height: '100%',
              margin: '0 40px 0 0'
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
              width: 'calc((200% - 40px) / 3)',
              height: '100%'
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
                },
                direction: 'H',
                parts: [
                  {
                    name: 'slot221',
                    style: {
                      height: '100%',
                      width: 'calc((100% - 40) / 2)',
                      margin: '0 40px 0 0'
                    }
                  },
                  {
                    name: 'slot222',
                    style: {
                      height: '100%',
                      width: 'calc((100% - 40) / 2)'
                    }
                  }
                ]
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
        { name: 'row3Col2M1', slot: 'slot221' },
        { name: 'row3Col2M2', slot: 'slot222' }
      ]
    }
  }
}
</script>
