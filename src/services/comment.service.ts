import { toData } from "../common/mappers";
import { CommentDto } from "../dtos/comment/comment.dto";
import { Comment, User } from "../models";

interface ICommentService {}

class CommentServive implements ICommentService {
  private commentModel = Comment;

  async getCommentsOfAgency(agencyId: number): Promise<Comment[]> {
    const comments = await this.commentModel.findAll({
      where: {
        agencyId,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email", "imageUrl"],
        },
      ],
    });
    return comments;
  }

  async create(userId: number, commentDto: CommentDto): Promise<Comment> {
    const comment = await this.commentModel.create({
      ...toData(commentDto),
      userId,
    });
    return comment;
  }

  async delete(userId: number, commentId: number) {
    const comment = await this.commentModel.findOne({
      where: {
        id: commentId,
        userId,
      },
    });
    await comment.destroy({ force: true });
  }
}

export const CommentService = new CommentServive();
