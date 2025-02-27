import React from "react";

function StreamlitDashboard() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="http://localhost:8501"
        title="Streamlit Dashboard"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      ></iframe>
    </div>
  );
}

export default StreamlitDashboard;