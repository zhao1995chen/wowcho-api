interface IRegister {
    name: string //使用者名稱
    account?: string // 帳號
    password: string // 密碼
    confirmPassword: string // 確認密碼
    email: string // 信箱
    createdAt: Date
  }
  
  export {
    IRegister
  }