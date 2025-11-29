type BlogOutput = {
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
  /**
   * Date of creation
   * pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
   */
  createdAt: string;
  /**
   * True if user has not expired membership subscription to blog
   */
  isMembership: boolean;
};

export default BlogOutput;
