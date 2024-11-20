import {Response} from 'express'
import {OutputErrorsType, RequestWithParamsAndBody} from '../../../db/types'
import {HTTP_STATUSES} from "../../../db/utils";
import {UpdateBlogInputModel, UpdateBlogInputModelByID} from "../modeles/UpdateModels";
import {ViewBlogModel} from "../modeles/ViewModels";
import {blogsRepository} from "../repositories/blogsRepository";

export const updateBlogController = async (req: RequestWithParamsAndBody<UpdateBlogInputModelByID,UpdateBlogInputModel>, res: Response<ViewBlogModel| OutputErrorsType>) => {
    try {
        const blogIndex = await blogsRepository.findIndex(req.params.id);
        if (blogIndex === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        const inputResult = await blogsRepository.update(blogIndex,req.body);
        if (inputResult && 'errors' in inputResult) { // если есть ошибки - отправляем ошибки
            res
                .status(HTTP_STATUSES.BAD_REQUEST_400)
                .json(inputResult.errors)
            return
        }

        res
            .status(HTTP_STATUSES.NO_CONTENT_204)
            .json(inputResult.blog)
        return
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}