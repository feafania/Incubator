import {PostDBType, postReturnType} from "../../../db/types";
import {db} from "../../../db/db";
import {createError} from "../../../db/utils";
import {ViewPostModel} from "../modeles/ViewModels";
import {CreatePostInputModel} from "../modeles/CreateModels";
import {UpdatePostInputModel} from "../modeles/UpdateModels";
import {postCollection} from "../../../db/mongo-db";
import {WithId} from "mongodb";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";



export const postsMongoDbRepository = {
    async findByID(id: string | number | undefined): Promise<PostDBType | null | undefined> {
        if (id) {
            return await postCollection.findOne({id: +id}, {projection: {_id: 0 } }) as PostDBType;
        }
        return null;
    },
    async findIndex(id: string | number | undefined): Promise<number> {
        if (id) {
            //выключаем усе палі, акрамя id
            const foundPost = await postCollection.findOne({id: +id}, {projection: { id: 1, _id: 0 } });
            if (foundPost) {
                return foundPost.id;
            }
        }
        return -1;
    },
    async findPosts(title: string | null | undefined): Promise<ViewPostModel[]> {
        const filter = title ? { title: { $regex: title, $options: "i" } } : {};
        // 'i' робіць неадчувальным для рэгістру
        const foundPosts = await postCollection.find(filter).toArray() as PostDBType[];
        return Promise.all(foundPosts.map(post => this.mapToOutput(post)));
    },
    async findByIDForOutput(id: string | number | undefined): Promise<ViewPostModel | null> {
        const foundPost = await this.findByID(id)
        if (!foundPost) { return null }
        return this.mapToOutput(foundPost)

    },
    async deleteAllPosts(): Promise<void> {
        await postCollection.deleteMany({});
    },
    async deletePost(id: number): Promise<boolean> {
        if (id) {
            postCollection.deleteOne({id: id});
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
            await postCollection.insertOne(newPost);
        } catch (err) {
            return {errors: createError(err,'')}
        }
        const mappedPost = await this.mapToOutput(newPost);
        return { post: mappedPost };
    },
    async update (index:number, input: UpdatePostInputModel): Promise<postReturnType> {
        const foundPost = await postCollection.findOne({id: index});

        if (!foundPost) {
            return { errors: createError(new Error('Post not found'), '') };
        }

        const updatedPost: WithId<PostDBType> = {
            ...foundPost,
            title: input.title ? input.title.trim() : foundPost.title,
            shortDescription: input.shortDescription ? input.shortDescription.trim() : foundPost.shortDescription,
            content: input.content ? input.content.trim() : foundPost.content,
            blogId: input.blogId ? +input.blogId : foundPost.blogId,
        };

        await postCollection.updateOne({_id: updatedPost._id},
            { $set:
                    { title: updatedPost.title,
                        shortDescription: updatedPost.shortDescription,
                        content: updatedPost.content,
                        blogId: updatedPost.blogId,
                    }});


        return { post: await this.mapToOutput(updatedPost) };
    },
    async mapToOutput(model: PostDBType): Promise<ViewPostModel> {
        const foundBlog = await blogsRepository.findByID(model.blogId);
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