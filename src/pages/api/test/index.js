export default function handler(req,res) {
  let ip

  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0]
  }

  ip = { ip: ip.split(':')[ip.split(':').length - 1] } 
  
  res.status(200).json(ip)
}