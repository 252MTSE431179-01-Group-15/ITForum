import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message)
}

import http from 'http'
import app from './src/app'
import connectDB from './src/config/database'
import env from './src/config/environment'
import { initSocket } from './src/socket/socket.js'

// ====================================================================
// SERVER ENTRY POINT
// ====================================================================

const startServer = async () => {
  try {
    // Kết nối MongoDB
    await connectDB()

    const httpServer = http.createServer(app)
    initSocket(httpServer)

    // Khởi động Express + Socket.IO server
    httpServer.listen(env.PORT, () => {
      console.log('====================================')
      console.log(`🚀 Server đang chạy tại: http://localhost:${env.PORT}`)
      console.log(`📡 API: http://localhost:${env.PORT}/api`)
      console.log(`🔔 Socket.IO: ws://localhost:${env.PORT}`)
      console.log(`🔑 Health: http://localhost:${env.PORT}/api/health`)
      console.log('====================================')
    })
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    process.exit(1)
  }
}

startServer()
