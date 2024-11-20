import {OutputErrorsType, PostDBType} from "../../../db/types";
import {db} from "../../../db/db";
import {createError, setDB} from "../../../db/utils";
import {ViewPostModel} from "../modeles/ViewModels";
import {CreatePostInputModel} from "../modeles/CreateModels";
import {UpdatePostInputModel} from "../modeles/UpdateModels";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";

interface postReturnType {
    errors?: OutputErrorsType,
    post?: ViewPostModel
}

export const postsLocalDbRepository = {
    async findByID(id: string | number | undefined): Promise<PostDBType | null | undefined> {
        if (id) {
            return  db.posts.find((post: PostDBType) => post.id === +id);
        }
        return null;
    },
    async findIndex(id: string | number | undefined): Promise<number> {
        if (id) {
            return  db.posts.findIndex((post:PostDBType) => post.id === +id);
        }
        return -1;
    },
    async findPosts(title: string | null | undefined): Promise<ViewPostModel[]> {
        let foundPosts: PostDBType[] = [];
        if (title) {
            foundPosts = db.posts.filter(post => post.title.indexOf(title) > -1);
        }
        else { foundPosts = db.posts; }
        return Promise.all(foundPosts.map(post => this.mapToOutput(post)));
    },
    async findByIDForOutput(id: string | number | undefined): Promise<ViewPostModel | null> {
        const post = await this.findByID(id)
        if (!post) { return null }
        return this.mapToOutput(post)

    },
    async deleteAllPosts(): Promise<void> {
        await setDB('posts');
    },
    async deletePost(id: number): Promise<boolean> {
        if (id) {
            db.posts.splice(id, 1);
            return true;
        }
        return false;
    },
    async create (input: CreatePostInputModel): Promise<postReturnType> {
        const newPost: PostDBType = {
            ...input,
            id: Date.now() + Math.random(),
            title: input.title ? input.title.trim() : '',
            shortDescription: input.shortDescription ? input.shortDescription.trim() : '',
            content: input.content ? input.content.trim() : '',
            blogId: input.blogId ? Number(input.blogId.trim()) : 0,
            createdAt: new Date(),
        }
        try {
            db.posts = [...db.posts, newPost]
        } catch (err) {
            return {errors: createError(err,'')}
        }
        const mappedPost = await this.mapToOutput(newPost);
        return { post: mappedPost };
    },
    async update (index:number, input: UpdatePostInputModel): Promise<postReturnType> {
        const foundPost = db.posts[index];

        const updatedPost: PostDBType = {
            ...foundPost,
            title: input.title ? input.title.trim() : foundPost.title,
            shortDescription: input.shortDescription ? input.shortDescription.trim() : foundPost.shortDescription,
            content: input.content ? input.content.trim() : foundPost.content,
            blogId: input.blogId ? +input.blogId : foundPost.blogId,
        };

        db.posts[index] = updatedPost;

        return { post: await this.mapToOutput(updatedPost) };
    },
    async mapToOutput(model: PostDBType): Promise<ViewPostModel> {
        const foundBlog = db.blogs.filter((blog) => blog.id === model.blogId)[0];
        return {
            id: model.id.toString() ?? '', // або любыя значэнні па змаўчанні
            title: model.title,
            shortDescription: model.shortDescription,
            content: model.content,
            blogId: model.blogId.toString() ?? '',
            blogName: foundBlog?.name || '',
            createdAt: model.createdAt.toISOString(),
        }
    },

}