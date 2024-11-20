import {Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {RequestWithParams} from "../../../db/types";
import {GetBlogModelById} from "../modeles/ReadModels";
import {ViewBlogModel} from "../modeles/ViewModels";
import {blogsRepository} from "../blogsRepository";


export const findBlogController = async (req: RequestWithParams<GetBlogModelById>, res: Response<ViewBlogModel>):Promise<void> => {
    try {
        const foundBlog = await blogsRepository.findByIDForOutput(req.params.id);
        if (!foundBlog) {
            res
                .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }
        res
            .status(HTTP_STATUSES.OK_200)
            .json(foundBlog)

    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}
