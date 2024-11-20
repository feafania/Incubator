import {Response} from 'express'
import {OutputErrorsType, RequestWithBody} from '../../../db/types'
import {HTTP_STATUSES} from "../../../db/utils";
import {CreateBlogInputModel} from "../modeles/CreateModels";
import {ViewBlogModel} from "../modeles/ViewModels";
import {blogsRepository} from "../repositories/blogsRepository";

export const createBlogController = async (req: RequestWithBody<CreateBlogInputModel>, res: Response<ViewBlogModel | OutputErrorsType>) => {
    try {
        const inputResult = await blogsRepository.create(req.body);
    if ('errors' in inputResult) { // если есть ошибки - отправляем ошибки
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(inputResult.errors)
        return
    }
    res
        .status(HTTP_STATUSES.CREATE_201)
        .json(inputResult.blog)
} catch (error) {
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
}
}