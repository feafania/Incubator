export type SetLikeRequestPayload = {
  /**
   * like status
   * Send None if you want to unlike\undislike
   * [ None, Like, Dislike ]
   */
  likeStatus: string;
};
