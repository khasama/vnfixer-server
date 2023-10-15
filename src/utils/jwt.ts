import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/user/user.dto";
import { instanceToPlain } from "class-transformer";

export async function genAccessToken(user: UserDto): Promise<string> {
  return new Promise((resolve, rejects) => {
    const payload = instanceToPlain(user);

    const secret = process.env.ACCESS_TOKEN;

    const option = {
      expiresIn: "1d",
    };

    jwt.sign(payload, secret, option, (err, token) => {
      if (err) rejects(err);
      resolve(token);
    });
  });
}

export async function genRefreshToken(user: UserDto): Promise<string> {
  return new Promise((resolve, rejects) => {
    const payload = user;

    const secret = process.env.REFRESH_TOKEN;

    const option = {
      expiresIn: "7d",
    };

    jwt.sign(payload, secret, option, (err, token) => {
      if (err) rejects(err);
      resolve(token);
    });
  });
}

export async function validateAccessToken(token: string) {
  return new Promise((resolve, rejects) => {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
      if (err) rejects(err);
      resolve(payload);
    });
  });
}
