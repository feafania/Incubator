import {BlogDBType, blogReturnType} from "../../../db/types";
import {ViewBlogModel} from "../modeles/ViewModels";
import {createError, setDB} from "../../../db/utils";
import {CreateBlogInputModel} from "../modeles/CreateModels";
import {UpdateBlogInputModel} from "../modeles/UpdateModels";
import {blogCollection} from "../../../db/mongo-db";
import {WithId} from "mongodb";

export function blogsMongoDbRepository() {
    const blogsRepository = {
        async findByID(id: string | number | undefined): Promise<BlogDBType | null | undefined> {
            if (id) {
                return await blogCollection.findOne({id: +id}, {projection: {_id: 0 } }) as BlogDBType;
            }
            return null;
        },
        async findIndex(id: string | number | undefined ): Promise<number> {
            if (id) {
                //выключаем усе палі, акрамя id
                const foundBlog = await blogCollection.findOne({id: +id}, {projection: { id: 1, _id: 0 } });
                if (foundBlog) {
                    return foundBlog.id;
                }
            }
            return -1;
        },
        async findBlogs(name: string | null | undefined): Promise<ViewBlogModel[]> {
            const filter = name ? { name: { $regex: name, $options: "i" } } : {};
            // 'i' робіць неадчувальным для рэгістру
            const foundBlogs = await blogCollection.find(filter).toArray() as BlogDBType[];
            return foundBlogs.map(this.mapToOutput);

        },
        async findByIDForOutput(id: string | number | undefined): Promise<ViewBlogModel | null> {
            const foundBlog = await this.findByID(id)
            if (!foundBlog) { return null }
            return this.mapToOutput(foundBlog)

        },
        async deleteAllBlogs(): Promise<void> {
            await blogCollection.deleteMany({});
        },
        async deleteBlog(id: number): Promise<boolean> {
            if (id) {
                blogCollection.deleteOne({id: id});
                return true;
            }
            return false;
        },
        async create (input: CreateBlogInputModel): Promise<blogReturnType> {
            const newBlog: BlogDBType = {
                ...input,
                id: Date.now() + Math.random(),
                name: input.name ? input.name.trim() : '',
                description: input.description ? input.description.trim() : '',
                websiteUrl: input.websiteUrl ? input.websiteUrl.trim() : '',
                createdAt: new Date(),
                isMembership: false,
            }
            try {
                await blogCollection.insertOne(newBlog);
            } catch (err) {
                return {errors: createError(err,'')}
            }

            return {blog: this.mapToOutput(newBlog)}
        },
        async update (index:number, input: UpdateBlogInputModel): Promise<blogReturnType> {
            const foundBlog = await blogCollection.findOne({id: index});

            if (!foundBlog) {
                return { errors: createError(new Error('Blog not found'), '') };
            }

            // Обновляем пост, используя деструктуризацию для сохранения старых значений
            const updatedBlog: WithId<BlogDBType> = {
                ...foundBlog, // Першапачатковыя значэнні
                name: input.name ? input.name.trim() : '',
                description: input.description ? input.description.trim() : '',
                websiteUrl: input.websiteUrl ? input.websiteUrl.trim() : '',
                // isMembership: input.isMembership || false,
            };
            await blogCollection.updateOne({_id: updatedBlog._id},
                { $set:
                        { name: updatedBlog.name,
                        description: updatedBlog.description,
                        websiteUrl: updatedBlog.websiteUrl,
                }});

            return {blog: this.mapToOutput(updatedBlog)}
        },
        mapToOutput(model: BlogDBType): ViewBlogModel {
            return {
                id: model.id.toString() ?? '', // або любыя значэнні па змаўчанні
                name: model.name,
                description: model.description,
                websiteUrl: model.websiteUrl,
                createdAt: model.createdAt.toISOString(),
                isMembership: model.isMembership,
            }
        },
    }
    return blogsRepository;
}