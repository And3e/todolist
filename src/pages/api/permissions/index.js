export default (req, res) => {
  // Permissions-Policy header
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
  res.status(200).end()
}
