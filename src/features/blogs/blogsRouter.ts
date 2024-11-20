import {Router} from 'express'
import {deleteBlogController} from "./routes/deleteBlogController";
import {findBlogController} from "./routes/findBlogController";
import {getBlogsController} from "./routes/getBlogsController";
import {createBlogController} from "./routes/createBlogController";
import {updateBlogController} from "./routes/updateBlogController";
import {blogInputValidators} from "./middlewares";
import {checkAuthorization, inputCheckErrorsMiddleware} from "../commonMiddlewares";
import {deleteAllBlogsData} from "./routes/deleteAllBlogsData";

export const blogsRouter = Router();
blogsRouter.get('/', getBlogsController);
blogsRouter.post('/',
    checkAuthorization,
    blogInputValidators,
    inputCheckErrorsMiddleware,
    createBlogController);
blogsRouter.get('/:id', findBlogController);
blogsRouter.put('/:id',
    checkAuthorization,
    blogInputValidators,
    inputCheckErrorsMiddleware,
    updateBlogController);
blogsRouter.delete('/:id',
    checkAuthorization,
    deleteBlogController);
blogsRouter.delete('/',
    checkAuthorization,
    deleteAllBlogsData);


