import {Request, Response, Router} from 'express'
import {blogsRepository} from "./blogs/blogsRepository";
import {HTTP_STATUSES} from "../db/utils";
import {postsRepository} from "./posts/postsRepository";

export const testRouter = Router();

export const deleteAllData = async (req: Request, res: Response) :Promise<void> => {
    await blogsRepository.deleteAllBlogs();
    await postsRepository.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}

testRouter.delete('/',
    deleteAllData);


