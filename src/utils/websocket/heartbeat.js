function heartbeat(socket) {
  const timeOut = 50 * 1000
  let handle = null

  heartbeat.prototype.start = function () {
    sendHeartbeat()
  }

  heartbeat.prototype.stop = function () {
    if (handle != null && handle !== undefined) {
      clearTimeout(handle)
    }
  }

  heartbeat.prototype.serverheart = function () {
    if (handle != null && handle !== undefined) {
      clearTimeout(handle)
    }
    handle = setTimeout(sendHeartbeat, timeOut)
  }

  function sendHeartbeat() {
    socket.send('heartbeat-web')
    handle = setTimeout(sendHeartbeat, timeOut)
  }
}
export default heartbeat
