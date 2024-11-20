import {db, setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {HTTP_STATUSES, Resolutions} from "../src/utils";
import {app} from '../src/app'
import {agent} from 'supertest'
import {CreateVideoInputModel} from "../src/videos/modeles/CreateModels";
import {VideoDBType} from "../src/types";
import {UpdateVideoInputModel} from "../src/videos/modeles/UpdateModels";
import {dataset1} from "./datasets";

export const req = agent(app)

describe('tests for /videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)
       // expect(res.body.length).toBe(1)
        expect(res.body.length).toBe(dataset1.videos.length)
        expect(res.body[0]).toEqual(dataset1.videos[0])



    })

    it('should create', async () => {
        setDB()
        const newVideo: CreateVideoInputModel = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(HTTP_STATUSES.CREATE_201)

        console.log(res.body)

        expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
    })

    it("shouldn't create with wrong title", async () => {
        setDB()
        const newVideo: CreateVideoInputModel = {
                "title": null,
                "author": "valid author",
                "availableResolutions":[Resolutions.P144,Resolutions.P240,Resolutions.P720]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body,res.status)

    })

    it("shouldn't find", async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        console.log(res.body)
    })

    it('should update', async () => {
        setDB(dataset1)
        const updateVideo: VideoDBType = {
            ...db.videos[0],
            title: 't1434',
            author: 'a14242',
            availableResolutions: [Resolutions.P480,Resolutions.P1080],
            minAgeRestriction: 18,
            publicationDate: new Date().toISOString(),
            canBeDownloaded: true,
        }

        const res = await req
            .put(SETTINGS.PATH.VIDEOS+"/"+updateVideo.id)
            .send(updateVideo) // отправка данных
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it("shouldn't update", async () => {
        const updateVideo: UpdateVideoInputModel = {
            id: -1,
            title: 't1434',
            author: 'a14242',
        }

        const res = await req
            .put(SETTINGS.PATH.VIDEOS+"/"+updateVideo.id)
            .send(updateVideo) // отправка данных
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("should delete existing video", async () => {
        setDB(dataset1)
     //   console.log('db before delete: ',db.videos)
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS+"/"+db.videos[1].id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    //    console.log('db after delete: ',db.videos)

    })

    it("shouldn't delete not-existing video", async () => {
        const res = await req
            .delete(SETTINGS.PATH.VIDEOS+"/-1")
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("should delete all video", async () => {
        setDB(dataset1);
        console.log('before delete', db.videos)
        const res = await req
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        console.log('after delete', db.videos,res.status)

    })


})

