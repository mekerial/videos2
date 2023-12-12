import request from 'supertest'
import { app } from '../../src/settings'
import dotenv from 'dotenv'
import {VideoType} from "../../src/routes/videos.routes";
import any = jasmine.any;

dotenv.config()


const dbName = 'back'

describe('/videos', () => {
    let newVideo: VideoType | null = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })



    it('GET products = []', async () => {
        await request(app).get('/videos/').expect([])
    })

    it('- POST does not create the video with incorrect data (no title, no author)', async () => {
        await request(app)
            .post('/videos/')
            .send({ title: '', author: '' })
            .expect(400, {
                errorsMessages: [
                    { message: "Invalid title", field: 'title' },
                    { message: "Invalid author", field: 'author' },
                ],
            })

        const res = await request(app).get('/videos/')
        expect(res.body).toEqual([])
    })

    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/videos/helloWorld').expect(404)
    })

    it('+ GET product by ID with correct id', async () => {
        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(200, newVideo)
    })

    it('- PUT product by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/' + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(404)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual(newVideo)
    })

    it('+ PUT product by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + newVideo!.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(204)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual({
            ...newVideo,
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z',
        })
        newVideo = res.body[0]
    })

    it('- DELETE product by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876328')
            .expect(404)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual(newVideo)
    })
    it('+ DELETE product by correct ID, auth', async () => {
        await request(app)
            .delete('/videos/' + newVideo!.id)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        const res = await request(app).get('/videos/')
        expect(res.body.length).toBe(0)
    })
})
