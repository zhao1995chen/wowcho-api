// 贊助相關
// 不同 interface 想拆開也可以，這裡先做多個 interface 的示範

enum OrderStatus {
  Null = -1, // null
  Established = 0, // 已成立
  Cancel = 1, // 已取消
  Paid = 2, // 已付款
}

enum ShippingStatus {
  Null = -1, // null
  Shipped = 0, // 已出貨
  NotShipped = 1, // 未出貨
}

interface ISponsor {
  id: string // 贊助訂單編號
  date: number // 訂單成立日期
  projectTitle: string // 贊助專案名稱
  orderPlanId: string // 贊助方案 id
  orderSpecification: ISpecification[] // 贊助方案規格
  freight: number // 運費
  totalMoney: number // 贊助金額
  orderStatus: 0 | 1 | 2 // 訂單狀態
  shippingStatus: 0 | 1 // 出貨狀態
  messageIdList: string[] // 訊息列表
  payWay: string // 付款方式
  logistics: string // 物流方式 
  note: string // 備註
  recipientName: string // 收件人姓名
  recipientPhone: string // 收件人電話
  recipientWay: string // 收件方式
  recipientShop: string // 收件門市
  recipientShopId: string // 收件門市 id
  recipientTrackingId: string // 收件追蹤編號
  recipientAddress: string // 收件地址
}

interface ISpecification {
  title: string // 規格標題
  option: Array<string> // 規格內容
}

export {
  ISponsor,
}