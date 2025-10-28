type ViewPostModel = {
  /**
   * id of the post
   */
  id: string;
  /**
   * title of the post
   * maxLength: 30
   */
  title: string;
  /**
   * brief content of the post
   * maxLength: 100
   */
  shortDescription: string;
  /**
   * content of the post
   * maxLength: 1000
   */
  content: string;
  /**
   * id of the connected blog
   */
  blogId: string;
  /**
   * name of the connected blog
   * maxLength: 15
   */
  blogName: string;
  /**
   * Date of creation
   * pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
   */
  createdAt: string;
};

export default ViewPostModel;
