import postsLocaldbRepository from "./posts.localdb.repository";
import postsMongodbRepository from "./posts.mongodb.repository";
import { useDatebase } from "../../../settings";

const postsRepository =
  useDatebase === "mongodb" ? postsMongodbRepository : postsLocaldbRepository;
export default postsRepository;
