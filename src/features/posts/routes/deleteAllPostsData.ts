import {Request,Response} from 'express'
import {HTTP_STATUSES} from "../../../db/utils";
import {postsRepository} from "../postsRepository";

export const deleteAllPostsData = async (req: Request, res: Response) :Promise<void> => {
    await postsRepository.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}
