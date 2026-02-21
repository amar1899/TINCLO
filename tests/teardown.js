export default async function teardown() {
  if (global.__MONGOD__) await global.__MONGOD__.stop()
}
