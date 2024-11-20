
import {SETTINGS} from "../settings";
import {Collection, Db, MongoClient} from "mongodb";
import {BlogDBType, PostDBType} from "./types";

// Аб'явім пераменныя для кліента, базы дадзеных і калекцый
export let client: MongoClient;
let db: Db;
export let blogCollection: Collection<BlogDBType>;
export let postCollection: Collection<PostDBType>;

export async function connectToMongoDB(): Promise<boolean> {
    try {
        // Connect the client to the server
        const client = new MongoClient(SETTINGS.MONGO_URL);
        console.log('Connecting to MongoDB...',SETTINGS.MONGO_URL);
        await client.connect();

        // Ініцыялізуем базу дадзеных пасля падключэння
        db = client.db(SETTINGS.DB_NAME);

        // Ініцыялізуем калекцыі
        blogCollection = db.collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME);
        postCollection = db.collection<PostDBType>(SETTINGS.POST_COLLECTION_NAME);

        // Establish and verify connection
        await db.command({ ping: 1 });// праверка сувязі, калі сувязь ok return {ok: 1}

        console.log("Connected successfully to Mongo Server");
        return true;
    } catch (e) {
        // Ensures that the client will close when you finish/error
        console. log ("Can't connect to Mongo Server: ", e);
        await client.close();
        return false;
    }
}
