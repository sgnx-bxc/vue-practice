<template>
  <div class="roleManageTab-page">
    <div style="height: 1px"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script>
export default {
  name: 'roleManageTab',
  data() {
    return {
      ellipseConfig: {
        a: 250, // x轴半径（长轴）
        b: 100, // y轴半径（短轴）
        speed: 0.01, // 运动速度（角度增量）
        centerX: 300, // 容器中心X
        centerY: 200 // 容器中心Y
      },
      phaseOffset: (Math.PI * 2) / 6 // 相位差 (360°/6)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      const dots = document.querySelectorAll('.dot')
      let angle = 0
      // 核心动画函数
      function animate() {
        dots.forEach((dot, index) => {
          // 计算当前相位 (基础角度 + 相位差)
          const currentAngle = angle + self.phaseOffset * index
          // 计算椭圆坐标（修正后的标准椭圆方程）
          const x = self.ellipseConfig.a * Math.cos(currentAngle)
          const y = self.ellipseConfig.b * Math.sin(currentAngle)
          // 应用位移 + 透视变换
          dot.style.transform = `
        translate(${x + self.ellipseConfig.centerX}px, ${y + self.ellipseConfig.centerY}px)
        scale(${1 + Math.sin(currentAngle) * 0.2})` // 近大远小效果
        })
        angle += self.ellipseConfig.speed
        requestAnimationFrame(animate)
      }
      animate()
    }
  }
}
</script>

<style lang="less">
.roleManageTab-page {
  width: 100%;
  height: 100%;
  .dot {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: pink;
    position: absolute;
  }
}
</style>
