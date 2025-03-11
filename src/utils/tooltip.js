export function autoHover(myChart, index, num, time) {
  let count = 0
  let timeTicket = null
  function clearTimer() {
    if (timeTicket) {
      clearInterval(timeTicket)
      timeTicket = null
    }
  }
  function showInitialData() {
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: index
    })
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: index,
      dataIndex: 0
    })
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: index,
      dataIndex: 0
    })
  }
  function startAutoHover(startIndex) {
    clearTimer()
    count = startIndex
    timeTicket = setInterval(() => {
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: index,
        dataIndex: (count - 1 + num) % num
      })
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: index,
        dataIndex: count
      })
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: index,
        dataIndex: count
      })
      count++
      if (count >= num) {
        count = 0
      }
    }, time)
  }
  myChart.on('mouseover', function (params) {
    clearTimer()
    const { dataIndex } = params
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: index
    })
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: index,
      dataIndex: dataIndex
    })
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: index,
      dataIndex: dataIndex
    })
    count = dataIndex + 1
    if (count >= num) {
      count = 0
    }
  })
  myChart.on('mouseout', function () {
    startAutoHover(count)
  })
  showInitialData()
  setTimeout(() => {
    startAutoHover(1)
  }, 0)
}
