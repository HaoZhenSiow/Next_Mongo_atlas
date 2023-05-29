import axios from "axios"
axios.defaults.validateStatus = false
const path = `${process.env.BACKEND_SERVER}/api/workouts/`

export async function POST(req) {
  const { origin } = new URL(req.url);
  const body = await req.json()
  const { status = 400, data = '' } = await axios.post(path, body)
  if (status === 201) { await revalidateIndex(origin) }
  return new Response(JSON.stringify(data), {
    status: status
  })
}

export async function DELETE(req) {
  const { origin, searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { status = 400, data = '' } = await axios.delete(path + id)
  if (status === 200) { await revalidateIndex(origin) }
  return new Response(JSON.stringify(data), {
    status: status
  })
}

// DELETE and GET handler cannot access req.body, use searchParams instead

async function revalidateIndex(origin) {
  await axios.get(`${origin}/api/revalidate?path=/&secret=${process.env.REVALIDATE_SECRET}`)
}