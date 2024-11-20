
export type ViewBlogModel = {
    /**
     * id of the blog
     */
    id: string;
    /**
     * name of the blog
     * maxLength: 15
     */
    name: string;
    /**
     * main purpose of the blog
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
