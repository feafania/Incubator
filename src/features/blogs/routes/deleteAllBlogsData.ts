import {Request,Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {blogsRepository} from "../repositories/blogsRepository";

export const deleteAllBlogsData = async (req: Request, res: Response) :Promise<void> => {
    try {
        await blogsRepository.deleteAllBlogs();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}
