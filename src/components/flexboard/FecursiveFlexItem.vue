<template>
  <div
    class="layout-item"
    :style="layout.style"
    :class="[
      layout.direction === 'H' ? 'flexH' : 'flexV',
      layout.parts === undefined ? 'leaf' : '',
      layout.class || ''
    ]"
  >
    <!-- <img class="corner corner1 hide" src="~@/assets/img/daping/new/left-top.png" alt="">
    <img class="corner corner2 hide" src="~@/assets/img/daping/new/right-top.png" alt="">
    <img class="corner corner3 hide" src="~@/assets/img/daping/new/right-bottom.png" alt="">
    <img class="corner corner4 hide" src="~@/assets/img/daping/new/left-bottom.png" alt=""> -->
    <slot :name="layout.name" v-if="layout.parts === undefined"></slot>
    <!-- 子布局 -->
    <FecursiveFlexItem
      v-for="item in layout.parts"
      :key="item.name"
      :layout="item"
    >
      <template v-for="slotItem in layout.slots" v-slot:[slotItem]>
        <slot :name="slotItem"></slot>
      </template>
    </FecursiveFlexItem>
  </div>
</template>

<script>
export default {
  name: 'FecursiveFlexItem',
  props: ['layout'],
  watch: {
    layout: {
      handler(newVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>
