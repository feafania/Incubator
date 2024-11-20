import {Request,Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {blogsRepository} from "../blogsRepository";

export const deleteAllBlogsData = async (req: Request, res: Response) :Promise<void> => {
    await blogsRepository.deleteAllBlogs();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}
