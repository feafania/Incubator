import {Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {blogsRepository} from "../blogsRepository";
import {RequestWithParams} from "../../../db/types";
import {GetBlogModelById} from "../modeles/ReadModels";

export const deleteBlogController = async (req: RequestWithParams<GetBlogModelById>, res: Response) :Promise<void> => {
    try {
        const blogIndex = await blogsRepository.findIndex(req.params.id);
        if (blogIndex === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        await blogsRepository.deleteBlog(blogIndex);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;

    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }

}
