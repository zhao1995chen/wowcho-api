import crypto from "crypto"

export const { MerchantID, HASHKEY, HASHIV, Version } = process.env
export const RespondType = 'JSON'

// 字串組合
export function genDataChain(order) {
  console.log('MerchantID',MerchantID)
  return `MerchantID=${MerchantID}&RespondType=${RespondType}&TimeStamp=${
    order.TimeStamp
  }&Version=${Version}&MerchantOrderNo=${order.MerchantOrderNo}&Amt=${
    order.Amt
  }&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${
    encodeURIComponent(order.Email)
  }&CREDIT=${order.CREDIT}&CVSCOM=${Number(order.CVSCOM)
  }&ReturnURL=${order.ReturnURL}&NotifyURL=${order.NotifyURL}`;
}

// 對應文件 P16：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
export function create_mpg_aes_encrypt(TradeInfo) {
  console.log('create_mpg_aes_encrypt TradeInfo',TradeInfo)
  const encrypt = crypto.createCipheriv('aes256', HASHKEY, HASHIV);
  // console.log('encrypt',encrypt)
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}
  
// 對應文件 P17：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
export function create_mpg_sha_encrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 將 aes 解密
export function create_mpg_aes_decrypt(TradeInfo) {
  console.log('create_mpg_aes_decrypt TradeInfo',TradeInfo)
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  console.log('create_mpg_aes_decrypt result', result)
  return JSON.parse(result);
}

export default {
  create_mpg_aes_encrypt,
  create_mpg_sha_encrypt,
  create_mpg_aes_decrypt
}
