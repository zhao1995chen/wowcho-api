// 確認訂單
interface IMoneyFlowCreateOrder {
  ItemDesc: string  //商品品名
  Amt: number  //訂單金額
  Email: string  //付款人信箱 （非收件人
  TimeStamp: Date    //時間戳記
  MerchantOrderNo: string  //商店訂單編號
  ReturnURL: string    //支付完成 返回商店網址
  NotifyURL: string    //支付通知網址
  EncryptType: boolean   //加密模式 AES256方式加密參帶0, AES GCM方式加密帶1
  CVSCOM: number   //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
  CREDIT: number  //信用卡一次付清啟用 1=啟用 0=不啟用
  TradeSha: string  //SHA256加密 給藍新必填欄位 參數名不可變動
  TradeInfo: string  //AES加密 給藍新必填欄位 參數名不可變動
  MerchantID: string  //商店代號 給藍新必填欄位 參數名不可變動
  Version: string  //版本號 給藍新必填欄位 參數名不可變動
  // aesEncrypt: string;
  // shaEncrypt: string;
}

// 藍新交易成功回傳
interface IMoneyFlowSuccessOrder {
  //============交易成功基本參數============
  MerchantID: string  //商店代號 給藍新必填欄位 參數名不可變動
  Amt: number  //訂單金額
  TradeNo: number //藍新金流交易序號
  MerchantOrderNo: string  //商店訂單編號
  RespondType: string //回傳格式
  IP: string  //付款人交易IP
  EscrowBank: string //款項保管銀行
  PaymentType: string //支付方式

  //============信用卡一次付清============
  RespondCode: string //金融機構回應碼
  Auth: string //收單機構授權碼
  Card6No: string //卡號前六碼
  Card4No: string //卡號末四碼
  Exp: string //?
  AuthBank: string //收單金融機構
  TokenUseStatus: number //分期-首期金額
  InstFirst: number //分期-首期金額
  InstEach: number //分期-每期金額
  Inst: number //分期-期別
  ECI: string //ECI值 eci=1,2,5,6，代表為 3D 交易,空值為失敗
  PayTime: string //支付完成時間 回傳格式為:2014-06-25 16:43:49, 超商取貨以空值回傳
  PaymentMethod: string //交易類別

  //============物流店到店============
  StoreCode: string //超商取貨門市編號
  StoreType: string //超商類別名稱
  StoreName: string //超商取貨門市名稱
  TradeType: string //取件交易方式
  StoreAddr: string //取貨人姓名
  CVSCOMName: string //取貨人姓名
  CVSCOMPhone: string //取貨人手機號碼
  LgsType: string //物流型態 'B2C','C2C'
  LgsNo: string //物流寄件單號(寄件代碼)
}

export {
  IMoneyFlowCreateOrder,
  IMoneyFlowSuccessOrder
}