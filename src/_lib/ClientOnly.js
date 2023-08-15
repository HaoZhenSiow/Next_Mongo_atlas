'use client'
import { useEffect, useState, createElement } from 'react'

const ClientOnly = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return createElement("div", delegated, children);
};

export default ClientOnly;


// https://stackoverflow.com/questions/58293542/next-js-warning-expected-server-html-to-contain-a-matching-a-in-div-how-to