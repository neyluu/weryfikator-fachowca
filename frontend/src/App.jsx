import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className={"bg-red-500"}>test</h1>
      <div className="bg-red-100">testdnw</div>
      <div className="text-2xl text-blue-300">test</div>
    </>
  );
}

export default App;
