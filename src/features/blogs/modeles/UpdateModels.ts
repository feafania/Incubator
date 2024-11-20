
export type UpdateBlogInputModel = {
    /**
     * id of the updating blog
     */
    id?: string;
    /**
     * name of the updating blog
     * maxLength: 15
     */
    name: string;
    /**
     * main purpose of the updating blog
     * maxLength: 500
     */
    description: string;
    /**
     * URL of the blog
     * maxLength: 100
     * pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
     */
    websiteUrl: string;
}

export type UpdateBlogInputModelByID = {
    /**
     * id of the updating blog
     */
    id: string;
}

