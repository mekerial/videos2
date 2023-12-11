import request from 'supertest'
import {app} from '../../src'

describe('/videos', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })



    it('should return 404', async () => {
        await request(app)
            .get('/videos/' + -1)
            .expect(404)
    })

    it(`shouldn't create video with incorrect input data`, async () => {
        await request(app)
            .post('/videos')
            .send({ title: ''})
            .expect(400)

        await request(app)
            .get('/videos')
            .expect(200)
    })

    it('should create video with corrent input data', async () => {
        const res = await request(app)
            .post('/videos')
            .send({ title: 'new video', author: 'Georgiy', availableResolutions: ["P144"]})
            .expect(201)

        expect(res.body).toEqual({
            title: 'new video',
            author: 'Georgiy',
            availableResolutions: ["P144"],
            //// todo add params
        })
        // get require
    })


})