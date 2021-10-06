export default (error: any) => {
  if (error?.code === 11000) {
    return {
      code: error.code,
      text: 'duplicated',
    }
  }
  return {}
}
