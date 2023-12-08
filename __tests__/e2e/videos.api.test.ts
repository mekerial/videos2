import request from 'supertest'
import {app} from '../../src'
describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return empty massive', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/videos/1')
            .expect(404)
    })

    it(`should'nt create video with incorrect input data`, async () => {
        await request(app)
            .post('/videos')
            .send({ title: ''})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200)
    })

    it('should create video with corrent input data', async () => {
        await request(app)
            .post('/videos')
            .send({ title: 'new video', author: 'Bobius', availableResolutions: ["P144"]})
            .expect(201)




    })


})