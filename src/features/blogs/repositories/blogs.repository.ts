import blogsLocalDbRepository from "./blogs.localdb.repository";
import blogsMongodbRepository from "./blogs.mongodb.repository";
import { useDatebase } from "../../../settings";

const blogsRepository =
  useDatebase === "mongodb"
    ? blogsMongodbRepository()
    : blogsLocalDbRepository();

export default blogsRepository;
