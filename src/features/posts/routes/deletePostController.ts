import {Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {RequestWithParams} from "../../../db/types";
import {GetPostModelById} from "../modeles/ReadModels";
import {postsRepository} from "../repositories/postsRepository";

export const deletePostController = async (req: RequestWithParams<GetPostModelById>, res: Response) :Promise<void> => {
    try {
        const postIndex = await postsRepository.findIndex(req.params.id);
        if (postIndex === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        await postsRepository.deletePost(postIndex);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;

    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }

}
