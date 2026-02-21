import request from 'supertest'
import app from '../server/index.js'

describe('API endpoints (users, jobs, matches)', () => {
  let userA, tokenA
  let userB, tokenB
  let job
  let match

  it('should signup two users and login', async () => {
    const resA = await request(app).post('/auth/signup').send({ name: 'Alice', email: 'alice@test.com', password: 'pass1234' })
    expect(resA.status).toBe(201)
    expect(resA.body).toHaveProperty('token')
    userA = resA.body.user
    tokenA = resA.body.token

    const resB = await request(app).post('/auth/signup').send({ name: 'Bob', email: 'bob@test.com', password: 'pass1234' })
    expect(resB.status).toBe(201)
    userB = resB.body.user
    tokenB = resB.body.token
  })

  it('should list users and get a single user', async () => {
    const list = await request(app).get('/api/users')
    expect(list.status).toBe(200)
    expect(Array.isArray(list.body)).toBe(true)
    const single = await request(app).get(`/api/users/${userA._id}`)
    expect(single.status).toBe(200)
    expect(single.body).toHaveProperty('_id', userA._id)
    expect(single.body).not.toHaveProperty('password')
  })

  it('should update userA profile when authenticated', async () => {
    const res = await request(app)
      .put(`/api/users/${userA._id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ bio: 'Hello world' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('bio', 'Hello world')
  })

  it('should create a job when authenticated', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Engineer', company: 'Acme' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('title', 'Engineer')
    job = res.body
    expect(job.postedBy).toBe(userA._id)
  })

  it('should list jobs', async () => {
    const res = await request(app).get('/api/jobs')
    expect(res.status).toBe(200)
    expect(res.body.some(j => j._id === job._id)).toBe(true)
  })

  it('should create a match and allow messages', async () => {
    const create = await request(app)
      .post('/api/matches')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ userIds: [userB._id] })
    expect(create.status).toBe(201)
    match = create.body
    expect(Array.isArray(match.users)).toBe(true)

    // Bob should see the match when listing his matches
    const listForB = await request(app).get('/api/matches').set('Authorization', `Bearer ${tokenB}`)
    expect(listForB.status).toBe(200)
    expect(listForB.body.some(m => m._id === match._id)).toBe(true)

    // Add a message as Bob
    const msg = await request(app)
      .post(`/api/matches/${match._id}/messages`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ text: 'Hi Alice' })
    expect(msg.status).toBe(200)
    expect(msg.body.messages.some(m => m.text === 'Hi Alice')).toBe(true)
  })
})
