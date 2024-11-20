import {app} from "../../src/app";
import request from 'supertest';
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES, setDB} from "../../src/db/utils";
import {config} from "dotenv";
import {CreateBlogInputModel} from "../../src/features/blogs/modeles/CreateModels";
import {BlogDBType} from "../../src/db/types";
import {db} from "../../src/db/db";
import {blogsRepository} from "../../src/features/blogs/blogsRepository";
import {datasetBlogValid} from "./datasets";

const agent = request.agent(app);//для захаваньня сэссый паміж запытамі, іначай  request(app)


config() // добавление переменных из файла .env в process.env
console.log(process.env.NODE_ENV)

describe('tests for /blogs', () => {
    const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuthorization = bufferContent.toString('base64')

    beforeAll(async () => {
        setDB('blogs')
    })

    it('should get empty blogs array', async () => {

        const res = await agent
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)
        expect(res.body.length).toBe(0)
    })

    it('should get not empty blogs array', async () => {
        setDB('blogs',datasetBlogValid) // заполнение базы данных начальными данными если нужно

        const res = await agent
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200)

        // console.log(JSON.stringify(res.body[0]),'\n',JSON.stringify(datasetBlogValid[0]))
        // expect(res.body.length).toBe(1)
        expect(res.body.length).toBe(datasetBlogValid.length)
        expect(res.body[0]).toEqual(blogsRepository.mapToOutput(datasetBlogValid[0]))

    })

    const newBlog: CreateBlogInputModel = {
        "name": 'Animals',
        "description": "All you want to know...",
        "websiteUrl": "https://www.themoviedb.org/",
    }


    it("shouldn't create blogs without authorization", async () => {

        const res = await agent
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)

    })

    it('should create', async () => {

        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(HTTP_STATUSES.CREATE_201)

        console.log(res.body)

        expect(res.body.description).toEqual(newBlog.description)
    })

    it("shouldn't create blog with wrong name", async () => {
        const newWrongBlog: CreateBlogInputModel = {
            "name": '',
            "description": "All you want to know...",
            "websiteUrl": "https://www.themoviedb1.org/",
        }
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.BLOGS)
            .send(newWrongBlog) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body,res.status)

    })

    it("shouldn't create blog with wrong URL", async () => {
        const newWrongBlog: CreateBlogInputModel = {
            "name": 'fsfsdf',
            "description": "All you want to know...",
            "websiteUrl": "5777https://www.themoviedb1.org/",
        }
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.BLOGS)
            .send(newWrongBlog) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body,res.status)

    })

    it("shouldn't find blog", async () => {
        setDB('blogs',datasetBlogValid)

        const res = await agent
            .get(SETTINGS.PATH.BLOGS + '/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        console.log(res.body)
    })

    it('should update blog', async () => {
        setDB('blogs',datasetBlogValid)
        const updateBlog: BlogDBType = {
            ...datasetBlogValid[0],
            name: 'Stories',
            description: 'Stories about my life',
            websiteUrl: 'https://www.themoviedbdfdf.org/',

        }

        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .put(SETTINGS.PATH.BLOGS+"/"+updateBlog.id)
            .send(updateBlog) // отправка данных
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it("shouldn't update blog", async () => {
        const updateBlog: BlogDBType = {
            id: -1,
            name: 'Stories',
            description: 'Stories about my life',
            websiteUrl: 'https://www.themoviedbdfdf.org/',

        }

        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .put(SETTINGS.PATH.BLOGS+"/"+updateBlog.id)
            .send(updateBlog) // отправка данных
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("should not delete blog unauthorized", async () => {
        setDB('blogs',datasetBlogValid)

        await agent
            .set('Authorization', '')
            .delete(SETTINGS.PATH.BLOGS+"/"+datasetBlogValid[1].id)
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)

    })

    it("should delete existing blog", async () => {
        setDB('blogs',datasetBlogValid)
        const currentId = datasetBlogValid[1].id;

        await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .delete(SETTINGS.PATH.BLOGS+"/"+currentId)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await agent
            .get(SETTINGS.PATH.BLOGS+"/"+currentId)
            .expect(HTTP_STATUSES.NOT_FOUND_404)





    })

    it("shouldn't delete not-existing blog", async () => {
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .delete(SETTINGS.PATH.BLOGS+"/-1")
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("should delete all blogs", async () => {
        setDB('blogs',datasetBlogValid);
        const res = await agent
            .delete(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        console.log('after delete', db.blogs,res.status)

    })

})