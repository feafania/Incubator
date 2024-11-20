import {Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {RequestWithParams} from "../../../db/types";
import {postsRepository} from "../postsRepository";
import {GetPostModelById} from "../modeles/ReadModels";
import {ViewPostModel} from "../modeles/ViewModels";


export const findPostController = async (req: RequestWithParams<GetPostModelById>, res: Response<ViewPostModel>):Promise<void> => {
    try {
        const foundPost = await postsRepository.findByIDForOutput(req.params.id);
        if (!foundPost) {
            res
                .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }
        res
            .status(HTTP_STATUSES.OK_200)
            .json(foundPost)

    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}
