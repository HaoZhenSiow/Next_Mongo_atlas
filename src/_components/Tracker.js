'use client'

import { useEffect } from "react"
import axios from "axios"

const Tracker = ({ children }) => {
  useEffect(() => {
    // window.addEventListener('beforeunload', fetcher);
    fetcher()
    // console.log(location);
    // return () => {
    //   window.removeEventListener('beforeunload', fetcher);
    // };
  }, []);
  return children
}

async function fetcher() {
  // axios.get('http://localhost:3000/api/tracker/')
  console.log(location.pathname);
}

export default Tracker