
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => (
  <div style={{ fontFamily: 'Arial', padding: '2rem' }}>
    <h1>Exercise Recommender</h1>
    <p>This is the deployable version.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
