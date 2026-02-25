import { MongoMemoryServer } from 'mongodb-memory-server'

/** Start an in-memory MongoDB instance before tests */
const mongod = await MongoMemoryServer.create()
process.env.MONGO_URI = mongod.getUri()
global.__MONGOD__ = mongod
