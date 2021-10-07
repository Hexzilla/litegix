import { Server, Channel } from 'models/server.model'

interface Payload {
  id: string
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
