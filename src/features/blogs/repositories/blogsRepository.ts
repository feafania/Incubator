import {blogsLocalDbRepository} from "./blogsLocalDbRepository";
import {blogsMongoDbRepository} from "./blogsMongoDbRepository";

// export const blogsRepository = blogsLocalDbRepository();
export const blogsRepository = blogsMongoDbRepository();