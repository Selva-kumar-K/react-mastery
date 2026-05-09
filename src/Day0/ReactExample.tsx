const codeSnippet = `function App() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}`;

export default function ReactExample() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "35px",
          fontWeight: "bold",
        }}
      >
        Count App
      </h1>
      <p
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          color: "#f38ba8",
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "left",
        }}
      >
        Why this component fails?
      </p>
      <pre
        style={{
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
        }}
      >
        <code>{codeSnippet}</code>
      </pre>

      <hr style={{ margin: "40px 0" }} />
      <div style={{ lineHeight: "1.8", textAlign: "left" }}>
        <h2 style={{ marginBottom: "12px" }}>Day 0 — What I Learned</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            React captures a <strong>snapshot</strong> of state at render time.
          </li>
          <li>
            Closures mean functions <em>"see" that snapshot</em>, not live
            state.
          </li>
          <li>
            Multiple <code>setCount</code> calls in one handler ={" "}
            <strong>one re-render</strong> (batching).
          </li>
          <li>
            State updates are <strong>scheduled</strong> — the new value is NOT
            available on the next line after <code>setCount</code>.
          </li>
          <li>
            Fix stale state: use <code>setCount(prev =&gt; prev + 1)</code> to
            work from the latest queued value, not the snapshot.
          </li>
        </ul>
      </div>
    </div>
  );
}
