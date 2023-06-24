import { res } from "@/_lib/utils"
import { Client, Databases, ID } from "appwrite"

const client = new Client();
const databases = new Databases(client);

client.setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('6494a8fd4af3d9263a38')

export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for')
  
  try {
    const response = await databases.createDocument('6494ab33bb6a1dedfc3d', '6494b12e78d1b617712c', ID.unique(), {
      test: ip
    })
    return res(response, 200)
  } catch (error) {
    return res(error, 400)
  }
  // setTimeout(() => {
  //   console.log('user inactive for 5s');
  // }, 5000)
  // setTimeout(() => {
  //   console.log('user inactive for 10s');
  // }, 10000)
  // setTimeout(() => {
  //   console.log('user inactive for 15s');
  // }, 15000)
  // setTimeout(() => {
  //   console.log('user inactive for 5min');
  // }, 5 * 60 * 1000)
}