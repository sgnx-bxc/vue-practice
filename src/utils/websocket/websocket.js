import Heartbeat from './heartbeat.js'
import db from '@/utils/webStorage'
import moment from 'moment'
function ThisSocket() {
  const sysConfig = window.sysConfig || {}
  const isOpen = sysConfig.openWebsocket
  const Socket = function() {
    const self = this
    const websocketHost = window.location.host
    this.callbacks = {}
    let websocket = null
    let heart = null

    Socket.prototype.connect = function(host) {
      if ('WebSocket' in window) {
        if (websocket == null) {
          try {
            websocket = new WebSocket(host)
            heart = new Heartbeat(websocket)
            console.log('new websocket')
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log('websocket is exits')
        }
      } else {
        console.log('Error: WebSocket is not supported by this browser.')
      }
      websocket.onopen = function(event) {
        console.log('Info: WebSocket connection opened.')
        heart.start()
      }
      websocket.onclose = function(event) {
        console.log('Info: WebSocket closed.')
        heart.stop()
        websocket = null

        console.log('Info: WebSocket will be reconnect')
        self.connect(host)
      }
      websocket.onmessage = function(event) {
        heart.serverheart()
        if (event.data === 'heartbeat') {
          return
        }
        try {
          const jsono = JSON.parse(event.data)
          if (!jsono) {
            return
          }
          const type = jsono.type || '1000'
          const time = moment().format('YYYY-MM-DD HH:mm:ss')
          console.log('Info：WebSocket message.', time, jsono)
          if (type in self.callbacks) {
            const data = jsono
            if (self.callbacks[type] && self.callbacks[type].length > 0) {
              for (let obj of self.callbacks[type]) {
                obj.func(data)
              }
            }
          }
        } catch (e) {
          console.log(e)
          try {
            if (event.data instanceof Blob) {
              let headContent = event.data.slice(0, 7)
              let reader = new FileReader()
              reader.onload = function() {
                let head = reader.result
                let url = URL.createObjectURL(
                  event.data.slice(7, event.data.size)
                )
                if (head in self.callbacks) {
                  if (self.callbacks[head] && self.callbacks[head].length > 0) {
                    for (let obj of self.callbacks[head]) {
                      obj.func(url)
                    }
                  }
                }
              }
              reader.readAsText(headContent)
            }
          } catch (error) {
            console.log('Error: WebSocket onMessage wrong.', error)
          }
        }
      }
    }
    Socket.prototype.init = function() {
      const token = db.localGet('USER_TOKEN', '')
      const teamId = db.get('TEAM_ID', '')
      if (isOpen && token !== '' && teamId !== '') {
        let protocolType = ''
        if (window.location.protocol === 'http:') {
          protocolType = 'ws'
        } else {
          protocolType = 'wss'
        }
        const connectUrl = `${protocolType}://${websocketHost}/websocket?teamId=${teamId}&token=${token}`
        Socket.prototype.connect(connectUrl)
      }
    }
    Socket.prototype.clear = function() {
      if (websocket) {
        websocket.close()
      }
    }
    Socket.prototype.addCallback = function(type, func, name) {
      let samefunc = false
      const callbacksList = this.callbacks[type] || []
      if (callbacksList.length === 0) {
        this.callbacks[type] = []
      }
      for (let i = 0; i < callbacksList.length; i++) {
        if (callbacksList[i].name === name) {
          samefunc = true
          break
        }
      }
      if (!samefunc) {
        this.callbacks[type].push({ func, name })
      }
    }
    Socket.prototype.removeCallback = function(type, func, name) {
      if (this.callbacks[type]) {
        let index = -1
        const callbacksList = this.callbacks[type] || []
        for (let i = 0; i < callbacksList.length; i++) {
          if (callbacksList[i].name === name) {
            index = i
            break
          }
        }
        if (index !== -1) {
          this.callbacks[type].splice(index, 1)
        }
      }
    }
  }

  const LocalSocket = new Socket()
  // LocalSocket.init()
  return LocalSocket
}
export default ThisSocket()
