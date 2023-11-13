import { Optional } from "sequelize";

export function toData(data): Optional<any, string> {
  return data as Optional<any, string>;
}
