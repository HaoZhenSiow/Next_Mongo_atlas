import connectDB from "../../_mongoDB/connectDB";
import { res } from "../../_lib/utils";
import chalk from "chalk";

const conn = connectDB(),
      sessionModel = conn.model('session')


export async function GET(req) {
  try {
    const sessions = await sessionModel.find()
    console.log(chalk.bgYellow(typeof sessions[0].events))
    return res(sessions, 200)
  }
  
  catch {
    return res('error', 400)
  }
}