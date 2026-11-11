import { IPost } from "../interface/post.interface";
import { PostModel } from "../../DB/model/post.model";
import { DataBaseRepository } from "./base.repository";

export class PostRepository extends DataBaseRepository<IPost> {
  constructor() {
    super(PostModel);
  }
}
