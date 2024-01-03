import { IComment } from "../../constants";

export class CommentDto implements IComment {
  id?: number;
  agencyId: number;
  userId: number;
  comment: string;
}
