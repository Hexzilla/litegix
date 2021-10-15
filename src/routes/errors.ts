export default (error: any) => {
  if (error?.code === 11000) {
    return {
      code: error.code,
      message: 'duplicated',
    }
  }
  return {
    code: -1,
    message: error?.message,
  }
}
