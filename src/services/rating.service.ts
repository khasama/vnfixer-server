import { toData } from "../common/mappers";
import { RatingDto } from "../dtos/rating/rating.dto";
import { Rating } from "../models";

interface IRatingService {}

class RatingServive implements IRatingService {
  private ratingModel = Rating;

  async create(ratingDto: RatingDto): Promise<Rating> {
    const rating = await this.ratingModel.findOne({
      where: {
        userId: ratingDto.userId,
        agencyId: ratingDto.agencyId,
      },
    });
    if (rating) {
      const newRating = await this.ratingModel.update(
        {
          rating: ratingDto.rating,
        },
        {
          where: {
            id: rating.id,
          },
        }
      );
      return;
    }
    const newRating = await this.ratingModel.create(toData(ratingDto));
    return newRating;
  }
}

export const ratingService = new RatingServive();
