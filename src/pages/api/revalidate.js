export default async function handler(req, res) {

  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(500).json({ message: "Invalid token" })
  }

  try {
    await res.revalidate(req.query.path)
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send("Error revalidating")
  }
  
}