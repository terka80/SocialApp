import { IComment } from "../interface/comment.interface";
import { CommentModel } from "../../DB/model/comment.model";
import { DataBaseRepository } from "./base.repository";

export class CommentRepository extends DataBaseRepository<IComment> {
  constructor() {
    super(CommentModel);
  }
}
