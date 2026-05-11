import React from "react";

const codeSnippet = `function makeCounter() {
  let count = 0;

  return function increment() {
    count = count + 1;
    console.log(count);
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3`;

const staleClosureSnippet = `// BAD — setInterval closes over query="" at mount and never updates
useEffect(() => {
  const timer = setInterval(() => {
    console.log(query); // always ""
  }, 1000);
  return () => clearInterval(timer);
}, []);

// FIX — use a ref; the interval closes over the ref object (stable),
// while a separate effect keeps ref.current in sync with latest state
const queryRef = useRef(query);
useEffect(() => { queryRef.current = query; }, [query]);

useEffect(() => {
  const timer = setInterval(() => {
    console.log(queryRef.current); // always latest value
  }, 1000);
  return () => clearInterval(timer);
}, []); // still safe to omit query here`;

const functionalUpdateSnippet = `// BAD — addNotification closes over the notifications array at render time;
// rapid clicks will use a stale snapshot
const addNotification = () => {
  setNotifications([...notifications, newItem]); // stale closure over notifications
};

// FIX — functional update receives the guaranteed latest state from React,
// bypassing the closure entirely
const addNotification = () => {
  setNotifications((prev) => [...prev, newItem]);
};`;

const depArraySnippet = `// BAD — timer never restarts when notifications are added/removed;
// auto-clear only works the first time
useEffect(() => {
  const timer = setTimeout(() => setNotifications([]), 5000);
  return () => clearTimeout(timer);
}, []); // missing dependency — stale length in closure

// FIX — add notifications.length as dependency so the effect
// re-runs (and the timer resets) whenever the count changes
useEffect(() => {
  if (notifications.length === 0) return;
  const timer = setTimeout(() => setNotifications([]), 5000);
  return () => clearTimeout(timer);
}, [notifications.length]);`;

const preStyle: React.CSSProperties = {
  textAlign: "left",
  background: "#1e1e2e",
  color: "#cdd6f4",
  padding: "20px 24px",
  borderRadius: "8px",
  overflowX: "auto",
  fontSize: "14px",
  lineHeight: "1.6",
  fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
  border: "1px solid #313244",
};

const sectionHeadingStyle: React.CSSProperties = {
  marginTop: "40px",
  marginBottom: "12px",
  color: "#f38ba8",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "left",
};

export default function Closure() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "35px", fontWeight: "bold" }}>Closures</h1>

      <p style={sectionHeadingStyle}>What is a closure?</p>

      <p style={{ textAlign: "left", lineHeight: "1.8", marginBottom: "24px" }}>
        A closure is when a function <strong>remembers the variables from
        where it was created</strong>, even after that outer scope has finished
        running. The inner function carries a reference to its surrounding
        environment — not a copy of the values, but a live link to them.
      </p>

      <pre style={preStyle}>
        <code>{codeSnippet}</code>
      </pre>

      <hr style={{ margin: "40px 0" }} />

      <div style={{ lineHeight: "1.8", textAlign: "left" }}>
        <h2 style={{ marginBottom: "12px" }}>Basics — What I Learned</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <code>makeCounter</code> returns <code>increment</code>, but{" "}
            <code>count</code> stays alive inside the closure.
          </li>
          <li>
            Each call to <code>counter()</code> mutates the <em>same</em>{" "}
            <code>count</code> — it is not reset between calls.
          </li>
          <li>
            Closures capture <strong>variables by reference</strong>, not by
            value — so mutations persist across calls.
          </li>
          <li>
            In React, stale closures happen when a callback closes over an
            old snapshot of state — the same mechanism, different context.
          </li>
        </ul>
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* ClosureExample1 learnings */}
      <p style={sectionHeadingStyle}>Stale closure in setInterval — fix with useRef</p>

      <p style={{ textAlign: "left", lineHeight: "1.8", marginBottom: "16px" }}>
        When <code>setInterval</code> is created inside a <code>useEffect</code> with
        an empty dependency array, the callback <strong>closes over the initial
        state value and never sees updates</strong>. The fix: store the latest value
        in a <code>ref</code> and read <code>ref.current</code> inside the interval.
        The ref object itself is stable (same reference every render), so the
        closure stays valid while <code>ref.current</code> always reflects the
        newest value.
      </p>

      <pre style={preStyle}>
        <code>{staleClosureSnippet}</code>
      </pre>

      <div style={{ lineHeight: "1.8", textAlign: "left", marginTop: "20px" }}>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <code>useRef</code> returns the <em>same object</em> on every render —
            closing over it is always safe.
          </li>
          <li>
            A companion <code>useEffect([query])</code> keeps <code>ref.current</code>{" "}
            in sync after every render where <code>query</code> changed.
          </li>
          <li>
            This pattern is the standard escape hatch whenever a long-lived callback
            (interval, socket handler, event listener) needs fresh state.
          </li>
        </ul>
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* ClosureExample2 — functional updates */}
      <p style={sectionHeadingStyle}>Stale closure in state updates — fix with functional update</p>

      <p style={{ textAlign: "left", lineHeight: "1.8", marginBottom: "16px" }}>
        When a state setter receives a value directly (e.g.{" "}
        <code>setState([...arr, item])</code>), it relies on <code>arr</code> being
        current in the closure. Under rapid events the closure may hold a stale
        snapshot. Passing a <strong>function</strong> to the setter (<code>prev =&gt; [...prev, item]</code>)
        bypasses the closure entirely — React guarantees <code>prev</code> is always
        the latest committed state.
      </p>

      <pre style={preStyle}>
        <code>{functionalUpdateSnippet}</code>
      </pre>

      <div style={{ lineHeight: "1.8", textAlign: "left", marginTop: "20px" }}>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            Always prefer <code>setState(prev =&gt; ...)</code> when the new value
            depends on the previous one.
          </li>
          <li>
            <code>dismiss</code> (filter by id) also uses functional update for the
            same reason — it must see the array <em>at click time</em>, not at
            render time.
          </li>
        </ul>
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* ClosureExample2 — dependency array */}
      <p style={sectionHeadingStyle}>Missing dependency = stale closure in useEffect</p>

      <p style={{ textAlign: "left", lineHeight: "1.8", marginBottom: "16px" }}>
        Every variable a <code>useEffect</code> callback reads is a potential stale
        closure if omitted from the dependency array. The auto-clear timer must
        restart each time the notification count changes — listing{" "}
        <code>notifications.length</code> as a dependency makes React re-run the
        effect (and reset the timer) when the count changes.
      </p>

      <pre style={preStyle}>
        <code>{depArraySnippet}</code>
      </pre>

      <div style={{ lineHeight: "1.8", textAlign: "left", marginTop: "20px" }}>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            The dependency array is not just for performance — it defines{" "}
            <strong>which closure</strong> the effect runs with.
          </li>
          <li>
            Omitting a dep that the effect reads is always a stale-closure bug
            waiting to happen.
          </li>
          <li>
            Using <code>notifications.length</code> (a primitive) instead of the
            full <code>notifications</code> array avoids triggering the effect on
            every reference change when the length hasn't actually changed.
          </li>
        </ul>
      </div>
    </div>
  );
}
