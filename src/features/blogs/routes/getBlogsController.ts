import {HTTP_STATUSES} from "../../../db/utils";
import {Response, Request} from 'express'
import {ViewBlogModel} from "../modeles/ViewModels";
import {blogsRepository} from "../repositories/blogsRepository";


export const getBlogsController = async (req:Request, res:Response<ViewBlogModel[]>):Promise<void> => {
    try {
        const blogs: ViewBlogModel[] = await blogsRepository.findBlogs(undefined);
        res
            .status(HTTP_STATUSES.OK_200)
            .json(blogs);
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    }
}
