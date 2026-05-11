import { useEffect, useRef, useState } from "react";

export const ClosureExample1 = () => {
  const [query, setQuery] = useState("");
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Current query:", queryRef.current); // always prints ''
      // fetch suggestions for query...
    }, 1000);

    return () => clearInterval(timer);
  }, []); // empty deps — runs once

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
