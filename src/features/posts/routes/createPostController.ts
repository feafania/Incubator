import {Response} from 'express'
import {OutputErrorsType, RequestWithBody} from '../../../db/types'
import {HTTP_STATUSES} from "../../../db/utils";
import {postsRepository} from "../postsRepository";
import {CreatePostInputModel} from "../modeles/CreateModels";
import {ViewPostModel} from "../modeles/ViewModels";

export const createPostController = async (req: RequestWithBody<CreatePostInputModel>, res: Response<ViewPostModel | OutputErrorsType>) => {
    const inputResult = await postsRepository.create(req.body);
    if ('errors' in inputResult) { // если есть ошибки - отправляем ошибки
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(inputResult.errors)
        return
    }
    res
        .status(HTTP_STATUSES.CREATE_201)
        .json(inputResult.post)
}