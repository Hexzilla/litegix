export default process.env.NODE_ENV === 'producton'
  ? String(process.env.SECRET)
  : 'secret'
