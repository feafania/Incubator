type UpdatePostRequestPayload = {
  /**
   * id of the updating post
   */
  id?: string;
  /**
   * title of the updating post
   * maxLength: 30
   */
  title: string;
  /**
   * brief content of the updating post
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

export default UpdatePostRequestPayload;
