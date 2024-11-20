import {Response} from 'express'
import {OutputErrorsType, RequestWithParamsAndBody} from '../../../db/types'
import {HTTP_STATUSES} from "../../../db/utils";
import {UpdatePostInputModel, UpdatePostInputModelByID} from "../modeles/UpdateModels";
import {postsRepository} from "../postsRepository";
import {ViewPostModel} from "../modeles/ViewModels";

export const updatePostController = async (req: RequestWithParamsAndBody<UpdatePostInputModelByID,UpdatePostInputModel>, res: Response<ViewPostModel| OutputErrorsType>) => {
    const postIndex = await postsRepository.findIndex(req.params.id);
    if (postIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const inputResult = await postsRepository.update(postIndex,req.body);

    if (inputResult && 'errors' in inputResult)  { // если есть ошибки - отправляем ошибки
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json(inputResult.errors)
        return
    }

    res
        .sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return
}