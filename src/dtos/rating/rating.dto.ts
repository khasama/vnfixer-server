import { IRating, RatingPoint } from "../../constants";

export class RatingDto implements IRating {
  id?: number;
  agencyId: number;
  userId: number;
  rating: RatingPoint;
}
