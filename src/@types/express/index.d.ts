import { Server, Channel } from 'models/server.model'

interface Payload {
  id: string
  username: string
  exp: number
  iat: number
}

declare global {
  namespace Express {
    interface Request {
      server: Server
      payload: Payload
      channel: Channel
    }
  }
}
