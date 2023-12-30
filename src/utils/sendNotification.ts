import { INotificationContent } from "../constants";
import { decryptData } from "./hashToken";
import axios from "axios";

export async function sendNotificationMobile(
  hashToken: string | null,
  content: INotificationContent
) {
  if (!hashToken) {
    return;
  }
  const token = decryptData(hashToken);
  console.log({ token });
  return await axios.post(
    `https://exp.host/--/api/v2/push/send`,
    { ...content, to: token, sound: "default" },
    {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    }
  );
}
