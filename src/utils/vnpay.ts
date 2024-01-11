import dotenv from "dotenv";
import crypto from "crypto";
import * as querystring from "qs";
dotenv.config({
  path: ".env",
});

export function genVnpayUrl(
  ipAddr,
  bankCode: string,
  amount: number,
  orderInfo: string,
  returnUrl: string,
  orderType = "billpayment",
  locale = "vn"
) {
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnpUrl = process.env.VNP_URL;
  // const returnUrl = process.env.VNP_RETURNURL;

  const date = new Date();

  const createDate = formatDateToCustomString(date);
  const orderId = formatDateToCustomStringID(date);
  if (locale === null || locale === "") {
    locale = "vn";
  }
  const currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  return `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
}

export function checkVnpayPayment(vnpParams: Record<any, any>) {
  const secureHash = vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHash"];
  delete vnpParams["vnp_SecureHashType"];
  vnpParams = sortObject(vnpParams);
  const secretKey = process.env.VNP_HASHSECRET;

  const signData = querystring.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
}

function sortObject(obj: object) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

function formatDateToCustomString(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
function formatDateToCustomStringID(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}${minutes}${seconds}`;
}
