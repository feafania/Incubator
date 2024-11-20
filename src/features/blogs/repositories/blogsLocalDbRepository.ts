import {BlogDBType, blogReturnType} from "../../../db/types";
import {db} from "../../../db/db";
import {ViewBlogModel} from "../modeles/ViewModels";
import {createError, setDB} from "../../../db/utils";
import {CreateBlogInputModel} from "../modeles/CreateModels";
import {UpdateBlogInputModel} from "../modeles/UpdateModels";

export function blogsLocalDbRepository() {
    const blogsRepository = {
        async findByID(id: string | number | undefined): Promise<BlogDBType | null | undefined> {
            if (id) {
                return  db.blogs.find((blog: BlogDBType) => blog.id === +id);
            }
            return null;
        },
        async findIndex(id: string | number | undefined): Promise<number> {
            if (id) {
                return  db.blogs.findIndex((blog:BlogDBType) => blog.id === +id);
            }
            return -1;
        },
        async findBlogs(name: string | null | undefined): Promise<ViewBlogModel[]> {
            if (name) {
                return db.blogs.filter(blog => blog.name.indexOf(name) > -1).map(this.mapToOutput);
            }
            else
            {
                return db.blogs.map(this.mapToOutput);
            }
        },
        async findByIDForOutput(id: string | number | undefined): Promise<ViewBlogModel | null> {
            const blog = await this.findByID(id)
            if (!blog) { return null }
            return this.mapToOutput(blog)

        },
        async deleteAllBlogs(): Promise<void> {
            await setDB('blogs');
        },
        async deleteBlog(id: number): Promise<boolean> {
            if (id) {
                db.blogs.splice(id, 1);
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
                db.blogs = [...db.blogs, newBlog]
            } catch (err) {
                return {errors: createError(err,'')}
            }

            return {blog: this.mapToOutput(newBlog)}
        },
        async update (index:number, input: UpdateBlogInputModel): Promise<blogReturnType> {
            const foundBlog = db.blogs[index];

            if (!foundBlog) {
                return { errors: createError(new Error('Blog not found'), '') };
            }

            // Обновляем пост, используя деструктуризацию для сохранения старых значений
            const updatedBlog: BlogDBType = {
                ...foundBlog, // Першапачатковыя значэнні
                name: input.name ? input.name.trim() : '',
                description: input.description ? input.description.trim() : '',
                websiteUrl: input.websiteUrl ? input.websiteUrl.trim() : '',
                // isMembership: input.isMembership || false,
            };
            db.blogs[index] = updatedBlog;

            return {blog: this.mapToOutput(db.blogs[index])}
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