import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../features/blogs/domain/blogs";
import { Post } from "../features/posts/domain/posts";
import { SETTINGS } from "../core/settings/settings";
import { User } from "../features/users/domain/user";
import { CommentEntity } from "../features/comments/domain/comment";
import { RevokedToken } from "../features/auth/domain/revoked-token";
import { RateLimit } from "../features/rate-limit/domain/rate-limit";
import { SessionEntity } from "../features/auth/domain/session";

export let client: MongoClient;

export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<CommentEntity>;
export let revokedTokenCollection: Collection<RevokedToken>;
export let rateLimitCollection: Collection<RateLimit>;
export let sessionCollection: Collection<SessionEntity>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);

  try {
    // Connect the client to the server
    console.log("Connecting to MongoDB...", url);
    await client.connect();
    // Ініцыялізуем базу дадзеных пасля падключэння
    const db: Db = client.db(SETTINGS.DB_NAME);

    // Ініцыялізуем калекцыі
    blogCollection = db.collection<Blog>(SETTINGS.COLLECTIONS.BLOGS);
    postCollection = db.collection<Post>(SETTINGS.COLLECTIONS.POSTS);
    userCollection = db.collection<User>(SETTINGS.COLLECTIONS.USERS);
    commentCollection = db.collection<CommentEntity>(
      SETTINGS.COLLECTIONS.COMMENTS,
    );
    revokedTokenCollection = db.collection<RevokedToken>(
      SETTINGS.COLLECTIONS.REVOKED_TOKENS,
    );
    rateLimitCollection = db.collection<RateLimit>(
      SETTINGS.COLLECTIONS.RATE_LIMIT,
    );
    sessionCollection = db.collection<SessionEntity>(
      SETTINGS.COLLECTIONS.SESSIONS,
    );

    // Establish and verify connection
    await db.command({ ping: 1 }); // праверка сувязі, калі сувязь ok return { ok: 1 }

    console.log("Connected successfully to Mongo Server");
  } catch (e) {
    // Ensures that the client will close when you finish/error
    console.log("Can't connect to Mongo Server: ", e);
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }
  await client.close();
}
