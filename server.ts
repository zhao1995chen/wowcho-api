import http from 'http'

import './connections'
import app from './app'

const server = http.createServer(app)
const port = process.env.PORT || 80
server.listen(port)