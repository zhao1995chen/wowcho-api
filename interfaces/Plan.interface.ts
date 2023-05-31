import { Document, Types } from 'mongoose'

interface IPlan extends Document {
  _id?: Types.ObjectId,
  // 募資活動(主表) id
  proposalUrl: string
	//圖片網址
  image:string, 
	//方案名稱
	name:string,
	//活動簡介
	summary:string,
	// 募資方案原價
	originalPrice:number | null,
	//募資方案折扣價格 (實際價格)
	actualPrice:number,
	//募資商品數量
	quantity: number | null,
	// 該方案已賣出數量
	nowBuyers: number,
	// 出貨日期
	pickupDate:number | null,
  // 給贊助者的話
  toSponsor: string,
  // 募資方案 - 規格，規格標題、選項
  specification:[{ title:string, option:Array<string> }]

	// 本島運費
	freightMainIsland:number | null,
	// 離島運費
	freightOuterIsland:number | null,
	// 其他國家運費
	freightOtherCountries:number | null,
}

interface IPlanDocument extends IPlan {
  sponsorToPlan: () => IPlanDocument;
}

export {
  IPlan,
  IPlanDocument
}