<template>
  <div
    class="fecursive-flex-layout"
    :class="[convertLayout.direction === 'H' ? 'flexH' : 'flexV']"
  >
    <FecursiveFlexItem
      v-for="(item, index) in convertLayout.parts"
      :key="index"
      :layout="item"
    >
      <template v-for="slotItem in convertLayout.slots" v-slot:[slotItem]>
        <slot :name="slotItem"></slot>
      </template>
    </FecursiveFlexItem>
  </div>
</template>

<script>
/** 递归的flex布局组件 **/
import FecursiveFlexItem from './FecursiveFlexItem'
export default {
  name: 'FecursiveFlex',
  components: { FecursiveFlexItem },
  props: ['layout'],
  computed: {
    convertLayout() {
      const newLayout = JSON.parse(JSON.stringify(this.layout))
      const slots = this.getConvertLayout(newLayout)
      newLayout.slots = slots
      return newLayout
    }
  },
  methods: {
    getConvertLayout(layout) {
      const self = this
      let slots = []
      const parts = layout.parts || []
      parts.forEach(part => {
        const subparts = part.parts || []
        if (subparts.length > 0) {
          const subslots = self.getConvertLayout(part)
          slots = slots.concat(subslots)
          part.slots = subslots
        } else {
          slots.push(part.name)
        }
      })
      return slots
    }
  }
}
</script>

<style lang="less">
.fecursive-flex-layout {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  .hide {
    display: none;
  }
  .layout-item {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }
  &.flexH,
  .flexH {
    flex-direction: row;
  }
  &.flexV,
  .flexV {
    flex-direction: column;
  }
  .leaf {
    // background: url('~@/assets/img/daping/new/card-bg.png') no-repeat;
    // background-size: 100% 100%;
    position: relative;
    .corner {
      width: 10px;
      height: 10px;
      display: block;
      position: absolute;
      &.corner1 {
        left: 2px;
        top: 2px;
      }
      &.corner2 {
        right: 2px;
        top: 2px;
      }
      &.corner3 {
        right: 2px;
        bottom: 2px;
      }
      &.corner4 {
        left: 2px;
        bottom: 2px;
      }
    }
  }
}
</style>
