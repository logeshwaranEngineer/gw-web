import { useState } from "react";

export function EmployeeSelector({ d, assignments, selectedLocation, selectEmployee, removeEmployee, getFilteredEmployees }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = getFilteredEmployees(d.id).filter((emp) =>
    emp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="search-box" style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      <div className="scroll-box">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div
              key={emp}
              className="emp-item"
              onClick={() => selectEmployee(d.id, emp, selectedLocation[d.id])}
            >
              {emp}
            </div>
          ))
        ) : (
          <div style={{ padding: "10px", color: "#999" }}>No employees found</div>
        )}
      </div>

      <div className="card">
        <h4>Selected Employees ({d.name})</h4>
        {assignments[d.id] && Object.keys(assignments[d.id]).length > 0 ? (
          Object.keys(assignments[d.id]).map((loc) => (
            <div key={loc}>
              <strong>{loc}</strong> ({assignments[d.id][loc]?.length || 0})
              {assignments[d.id][loc] && assignments[d.id][loc].length > 0 ? (
                <ul>
                  {assignments[d.id][loc].map((emp) => (
                    <li
                      key={emp}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>{emp}</span>
                      <button
                        onClick={() => removeEmployee(d.id, emp, loc)}
                        style={{
                          marginLeft: "8px",
                          color: "red",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer"
                        }}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ padding: "5px", color: "#999", fontSize: "0.9em" }}>
                  No employees assigned to this location yet.
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: "10px", color: "#999", fontStyle: "italic" }}>
            No locations created yet. Select a location and add employees.
          </div>
        )}
      </div>
    </>
  );
}




{/* <div style={{ display: "flex", alignItems: "center", background: "#f1f1f1", borderRadius: "8px", padding: "6px 5px", margin: "4px 0" }}>
  <span style={{ marginRight: "8px", color: "#888" }}>🔍</span>
  <input
    type="text"
    placeholder="Search employee..."
    value={searchQuery[d.id] || ""}
    onChange={(e) => handleSearchChange(d.id, e.target.value)}
    style={{
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "1rem"
    }}
  />
</div> */}

{/* Search + Employee list */}
{/* <div
  style={{
    display: "flex",
    alignItems: "center",
    background: "#f1f1f1",
    borderRadius: "8px",
    padding: "6px 5px",
    margin: "6px 0"
  }}
>
  <span style={{ marginRight: "8px", color: "#888" }}>🔍</span>
  <input
    type="text"
    placeholder="Search employee..."
    value={searchQuery[d.id] || ""}   // controlled by state
    onChange={(e) => handleSearchChange(d.id, e.target.value)}
    style={{
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "1rem"
    }}
  />
</div>
<div className="scroll-box">
  {getFilteredEmployees(d.id).map((emp) => (
    <div
      key={emp}
      className="emp-item"
      onClick={() => selectEmployee(d.id, emp, selectedLocation[d.id])}
    >
      {emp}
    </div>
  ))}
</div> */}
            {/* <div className="scroll-box">
              {getFilteredEmployees(d.id).map((emp) => (
                <div
                  key={emp}
                  className="emp-item"
                  onClick={() =>
                    selectEmployee(d.id, emp, selectedLocation[d.id])
                  }
                >
                  {emp}
                </div>
              ))}
            </div> */}
