import {Request, Response, Router} from 'express'
import {blogsRepository} from "../blogs/repositories/blogsRepository";
import {HTTP_STATUSES} from "../../db/utils";
import {postsLocalDbRepository} from "../posts/repositories/postsLocalDbRepository";

export const testRouter = Router();

export const deleteAllData = async (req: Request, res: Response) :Promise<void> => {
    await blogsRepository.deleteAllBlogs();
    await postsLocalDbRepository.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}

testRouter.delete('/',
    deleteAllData);


