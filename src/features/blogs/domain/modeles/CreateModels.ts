type CreateBlogInputModel = {
  /**
   * name of the creating blog
   * maxLength: 15
   */
  name: string;
  /**
   * main purpose of the creating blog
   * maxLength: 500
   */
  description: string;
  /**
   * URL of the blog
   * maxLength: 100
   * pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
   */
  websiteUrl: string;
};

export default CreateBlogInputModel;
