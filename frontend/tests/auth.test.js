import request from 'supertest'
import app from '../server/index.js'

describe('Auth + health endpoints', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('POST /auth/signup and /auth/login', async () => {
    const user = { name: 'Test', email: 't@test.com', password: 'pass1234' }
    const signup = await request(app).post('/auth/signup').send(user)
    expect(signup.status).toBe(201)
    expect(signup.body).toHaveProperty('token')

    const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password })
    expect(login.status).toBe(200)
    expect(login.body).toHaveProperty('token')
  })
})
