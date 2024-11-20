import {postsLocalDbRepository} from "./postsLocalDbRepository";
import {postsMongoDbRepository} from "./postsMongoDbRepository";


// export const postsRepository = postsLocalDbRepository;
export const postsRepository = postsMongoDbRepository;
