import {HTTP_STATUSES} from "../../../db/utils";
import {Response, Request} from 'express'
import {postsRepository} from "../postsRepository";
import {ViewPostModel} from "../modeles/ViewModels";

export const getPostsController = async (req:Request, res:Response<ViewPostModel[]>):Promise<void> => {
    try {
        const posts: ViewPostModel[] = await postsRepository.findPosts(undefined);
        res
            .status(HTTP_STATUSES.OK_200)
            .json(posts);
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}
