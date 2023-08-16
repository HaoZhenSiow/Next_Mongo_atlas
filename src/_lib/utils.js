import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import axios from 'axios'
axios.defaults.validateStatus = false

export function res(res, status) {
  return NextResponse.json(res, { status: status })
}

export async function revalidateIndex(origin) {
  await axios.get(`${origin}/api/revalidate?path=/&secret=${process.env.REVALIDATE_SECRET}`)
}

export function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

export function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}