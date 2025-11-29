type CreatePostRequestPayload = {
  /**
   * title of the creating post
   * maxLength: 30
   */
  title: string;
  /**
   * brief content of the creating post
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
};

export default CreatePostRequestPayload;
