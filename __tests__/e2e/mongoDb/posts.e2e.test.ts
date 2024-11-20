import {app} from "../../../src/app";
import request from 'supertest';
import {SETTINGS} from "../../../src/settings";
import {HTTP_STATUSES} from "../../../src/db/utils";
import {config} from "dotenv";
import {db, runDB} from "../../../src/db/db";
import {postsLocalDbRepository} from "../../../src/features/posts/repositories/postsLocalDbRepository";
import {CreatePostInputModel} from "../../../src/features/posts/modeles/CreateModels";
import {PostDBType} from "../../../src/db/types";
import {MongoMemoryServer} from "mongodb-memory-server";
import {blog1, datasetBlogValid, datasetPostValid, post1, post7, setMongoDB} from "../datasets";
import {blogCollection, client, postCollection} from "../../../src/db/mongo-db";

const agent = request.agent(app);//для захаваньня сэссый паміж запытамі, іначай  request(app)
let mongoServer: MongoMemoryServer; // Общий сервер для всех тестов

// // работа с ид
// new ObjectId(req.params.id)
// createdInfo.id.toString()


describe('tests for /posts', () => {
    beforeAll(async () => {
        // Стварыць часовы сервер MongoDB
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        // process.env.MONGO_URI = uri;

        // Падключэнне да часовага MongoDB
        SETTINGS.MONGO_URL = uri;
        await runDB();
        // console.log(await postCollection.find().toArray())
        const info = await setMongoDB(postCollection, []);
    });

    afterAll(async () => {
        if (client) await client.close(); // Закрыць MongoClient
        if (mongoServer) await mongoServer.stop({ doCleanup: true });
    });

    const bufferContent = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuthorization = bufferContent.toString('base64')


    it('should get empty posts array', async () => {

        const res = await agent
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)
        expect(res.body.length).toBe(0)
    })

    it('should get not empty posts array', async () => {
        await setMongoDB(postCollection, datasetPostValid) // заполнение базы данных начальными данными если нужно
        const res = await agent
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        // console.log(JSON.stringify(res.body[0]),'\n',JSON.stringify(datasetBlogValid[0]))
        // expect(res.body.length).toBe(1)
        expect(res.body.length).toBe(datasetPostValid.length)
        expect(res.body[0]).toEqual(await postsLocalDbRepository.mapToOutput(datasetPostValid[0]))

    })

    const newPost: CreatePostInputModel = {
        "title": 'Animals',
        "shortDescription": "All you want to know...",
        "content": "About everything",
        "blogId": blog1.id.toString(),
    }


    it("shouldn't create posts without authorization", async () => {

        const res = await agent
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)
            console.log(res.body,res.status)

    })

    it('should create', async () => {
        await setMongoDB(blogCollection, datasetBlogValid)
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.POSTS)
            .send(newPost) // отправка данных
            .expect(HTTP_STATUSES.CREATE_201)

        console.log(res.body)

        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
    })

    it("shouldn't create post with wrong title", async () => {
        const newWrongPost: CreatePostInputModel = {
            "title": '',
            "shortDescription": "All you want to know...",
            "content": "About everything",
            "blogId": blog1.id.toString(),
        }
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.POSTS)
            .send(newWrongPost) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body,res.status)

    })

    it("shouldn't create post with wrong description", async () => {
        const newWrongPost: CreatePostInputModel = {
            title: post7.title,
            shortDescription: post7.shortDescription,
            content: post7.content,
            blogId: post7.blogId.toString(),
        }
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .post(SETTINGS.PATH.POSTS)
            .send(newWrongPost) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body,res.status)

    })

    it("shouldn't find post", async () => {
        await setMongoDB(postCollection, datasetPostValid)

        const res = await agent
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        console.log(res.body)
    })

    it('should update post', async () => {
        await setMongoDB(blogCollection, datasetBlogValid);
        await setMongoDB(postCollection, datasetPostValid);

        const updatePost: PostDBType = {
            ...datasetPostValid[0],
            title: 'Stories',
            shortDescription: 'Stories about my life',
            content: 'about stories',

        }
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .put(SETTINGS.PATH.POSTS+"/"+updatePost.id)
            .send(updatePost) // отправка данных
            .expect(HTTP_STATUSES.NO_CONTENT_204)

    })

    it("shouldn't update post", async () => {
        await setMongoDB(blogCollection,datasetBlogValid);
        const updatePost: PostDBType = {
            id: -1,
            title: 'Stories',
            shortDescription: 'Stories about my life',
            content: 'about stories',
            blogId: blog1.id,
            createdAt: new Date("2024-11-10T14:30:00Z"),
        }

        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .put(SETTINGS.PATH.POSTS+"/"+updatePost.id)
            .send(updatePost) // отправка данных
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("shouldn't update post with wrong title", async () => {
        await setMongoDB(blogCollection, datasetBlogValid);
        await setMongoDB(postCollection, datasetPostValid);
        const updatePost: PostDBType = {
            id: post1.id,
            title: 'Stories dfsdfsk dsfsfs sdfsfsf fdsfsd dsfsfs',
            shortDescription: 'Stories about my life',
            content: 'about stories',
            blogId: blog1.id,
            createdAt: new Date("2024-11-10T14:30:00Z"),
        }

        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .put(SETTINGS.PATH.POSTS+"/"+updatePost.id)
            .send(updatePost) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

    })

    it("should not delete post unauthorized", async () => {
        await setMongoDB(postCollection, datasetPostValid)

        await agent
            .set('Authorization', '')
            .delete(SETTINGS.PATH.POSTS+"/"+datasetPostValid[1].id)
            .expect(HTTP_STATUSES.NOT_AUTHORIZED_401)

    })

    it("should delete existing post", async () => {
        await setMongoDB(postCollection, datasetPostValid)
        const currentId = datasetPostValid[1].id;
        await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .delete(SETTINGS.PATH.POSTS+"/"+currentId)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        await agent
            .get(SETTINGS.PATH.POSTS+"/"+currentId)
            .expect(HTTP_STATUSES.NOT_FOUND_404)


    })

    it("shouldn't delete not-existing post", async () => {
        const res = await agent
            .set('Authorization', 'Basic ' + codedAuthorization)
            .delete(SETTINGS.PATH.POSTS+"/-1")
            .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it("should delete all posts", async () => {
        await setMongoDB(postCollection, datasetPostValid);
        const res = await agent
            .delete(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.NO_CONTENT_204)
        console.log('after delete', db.blogs,res.status)

    })

})
