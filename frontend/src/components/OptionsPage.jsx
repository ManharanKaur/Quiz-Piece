import React from "react";

function OptionsPage({ options, selectedOptionId, onSelect }) {
  return (
    <div className="options-container" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
      {options.map((option) => {
        const isSelected = String(selectedOptionId) === String(option.id);
        
        return (
          <button
            key={option.id}
            className={`option-button ${isSelected ? "selected" : ""}`}
            onClick={() => onSelect(option.id)}
            style={{
              padding: "16px 24px",
              background: isSelected ? "rgba(176, 0, 0, 0.15)" : "#111",
              border: `1px solid ${isSelected ? "#b00000" : "#2b2b2b"}`,
              borderRadius: "12px",
              color: "#fff",
              textAlign: "left",
              fontSize: "1.05rem",
              transition: "all 0.2s ease",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "#b00000";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = "#2b2b2b";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
}

export default OptionsPage;
