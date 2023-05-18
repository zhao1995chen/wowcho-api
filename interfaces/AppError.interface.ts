interface IAppError extends Error {
    statusCode: number
    isOperational: boolean
  }

  export {
    IAppError
  }