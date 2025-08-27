import React, { useState, useMemo } from "react";
import { addDays, format } from "date-fns";
import "./App.css";

const initialEmployees = [
  "BABU MD SOHAG", "KABIR MD ALAMGIR", "PALANIVEL MANIMARAN",
  "MULLAINATHAN GNANAPRAKASAM", "BARMON ONEMIS", "MIAH MD SUJON",
  "MATUBBAR MD SHAHADAT", "SHAHADOT MOHAMMAD", "KANNAN TAMILKUMARAN",
  "SIVAKUMAR MADHAVAN", "NAEEM MD", "MIAH EDUL", "SHEIKH MD SHAMIM",
  "ISLAM TARIQUL", "HOSSAIN MD RAKIB", "SHAHPARAN", "ARUMUGAM NAGARATH",
  "DURAIBHARATHI LOGESHWARAN", "BORA HARI PRASAD", "SINDHASHA ABULKASIMJUNAITHUL",
  "NEELAKANDAN SURESH", "KAZI SAJIB", "BHUIYAN MD TAMIM", "BEPARI MD RAHMAN",
  "KUPPUSAMY SEMBAN", "MURUGESEN NIVAS", "WIN ZAW OO",
  "GUNASEKARAN PURUSHOTHAMAN", "BHUIYAN NADIM", "KARUPPIAH KANAGARAJ",
  "DHIRAVIDA SELVAM SELVAGANAPATHI", "BALAKRISHNAN CHELLADURAI",
  "RAMAMOORTHY VISHWA", "SEPENA JANARDHANA RAO", "MOLLA MD ASIF",
  "MARUF MD", "KUMAR PRABHAKAR", "PRANTO JUBAYER HOSSEN",
  "CHITRARASAN KALAIYARASAN", "MRIDHA ROBIN", "HASAN ATIK", "SIDDIK MD ABU BAKKAR"
];

// Fixed Drivers
const drivers = [
  { id: "driver1", name: "VELLAISAMY PRASANTH", vehicle: "YQ1179B LORRY FOLLOW" },
  { id: "driver2", name: "SHANTHAKUMAR", vehicle: "YR3364P LORRY FOLLOW" }
];

const App = () => {
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  const formattedDate = useMemo(() => format(tomorrow, "dd/MM/yyyy EEEE"), [tomorrow]);

  const [employees, setEmployees] = useState(initialEmployees);
  const [assignments, setAssignments] = useState({ driver1: {}, driver2: {} });
  const [selectedLocation, setSelectedLocation] = useState({ driver1: "", driver2: "" });
  const [searchQuery, setSearchQuery] = useState({ driver1: "", driver2: "" });
  const [times, setTimes] = useState({ driver1: "06:30", driver2: "06:30" });

  // 🔎 Filter employees by search
// 🔎 Filter employees by search & exclude employees already assigned to the other driver
const getFilteredEmployees = (driver) => {
  const otherDriver = driver === "driver1" ? "driver2" : "driver1";
  const assignedOther = Object.values(assignments[otherDriver]).flat();

  return employees.filter(emp =>
    emp.toLowerCase().includes(searchQuery[driver].toLowerCase()) &&
    !assignedOther.includes(emp) // 🚫 exclude if in other driver's list
  );
};


  const toggleEmployee = (driver, emp, loc) => {
    if (!loc.trim()) {
      alert("⚠️ Please enter a location before selecting employees!");
      return;
    }

    setAssignments(prev => {
      const current = prev[driver][loc] || [];
      let updated;
      if (current.includes(emp)) {
        updated = current.filter(e => e !== emp);
      } else {
        updated = [...current, emp];
      }
      return { ...prev, [driver]: { ...prev[driver], [loc]: updated } };
    });

    // ✅ Clear search after selection
    setSearchQuery(prev => ({ ...prev, [driver]: "" }));
  };
function toBold(text) {
  const map = {
    A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",
    K:"𝗞",L:"𝗟",M:"𝗠",N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",
    U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭"
  };
  return text.split("").map(ch => map[ch] || ch).join("");
}
  // Add new employee
  const addEmployee = (name, permanent = false) => {
    if (!name.trim()) return;
    if (!employees.includes(name)) {
      setEmployees(prev => [...prev, name]);
      if (permanent) {
        alert(`${name} added permanently!`);
      }
    }
  };

  // Remove employee
  const removeEmployee = (name, permanent = false) => {
    setAssignments(prev => {
      const newAssign = { driver1: {}, driver2: {} };
      for (const d of ["driver1", "driver2"]) {
        for (const loc in prev[d]) {
          newAssign[d][loc] = prev[d][loc].filter(e => e !== name);
        }
      }
      return newAssign;
    });

    if (permanent) {
      setEmployees(prev => prev.filter(e => e !== name));
      alert(`${name} removed permanently!`);
    }
  };

  // Build summary with totals
  const buildSummary = () => {
    let summary = `\n${formattedDate}\n`;

    drivers.forEach(d => {
      const driverAssignments = assignments[d.id];
      const totalEmployees = Object.values(driverAssignments).flat().length;
      const totalWithDriver = totalEmployees + 1;

      summary += `\n${d.name} — ${d.vehicle} — ${times[d.id]}AM\n`;
      summary += `Total: ${totalWithDriver} (${totalEmployees} Employees + 1 Driver)\n`;

      Object.keys(driverAssignments).forEach(loc => {
        if (driverAssignments[loc]?.length > 0) {
          // summary += `\n**${loc.toUpperCase()}**\n`; 
          summary += `\n${toBold(loc.toUpperCase())}\n`;
          summary += driverAssignments[loc]
            .map((emp, i) => `${i + 1}. ${emp}`)
            .join("\n");
          summary += "\n";
        }
      });

      summary += "\n------------------------------------\n";
    });

    return summary;
  };

  return (
    <div className="app">
      <h2 className="header">Transportation — {formattedDate}</h2>

      {drivers.map(d => (
        <div key={d.id} className="driver-card">
          <h3>
            {d.name} — {d.vehicle}
          </h3>

          {/* Time Picker */}
          <label>Pickup Time:</label>
          <input
            type="time"
            value={times[d.id]}
            onChange={(e) => setTimes({ ...times, [d.id]: e.target.value })}
          />

          {/* Location input */}
          <label>Enter Location:</label>
          <input
            type="text"
            placeholder="Type site name..."
            value={selectedLocation[d.id]}
            onChange={(e) =>
              setSelectedLocation({ ...selectedLocation, [d.id]: e.target.value })
            }
          />

          {/* Search + Employee list */}
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery[d.id]}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, [d.id]: e.target.value })
            }
          />

          <div className="scroll-box">
  {getFilteredEmployees(d.id).map(emp => {
    const isAssigned = Object.values(assignments[d.id]).flat().includes(emp);
    return (
      <label key={emp} className="emp-check">
        <input
          type="checkbox"
          checked={isAssigned}
          onChange={() => toggleEmployee(d.id, emp, selectedLocation[d.id])}
        />
        <span>{emp}</span>
      </label>
    );
  })}
</div>


          {/* Show selected employees per driver */}
          <div className="card">
            <h4>
              Selected Employees ({d.name}) = {Object.values(assignments[d.id]).flat().length} Pickup
            </h4>
            {Object.keys(assignments[d.id]).map(loc => (
              <div key={loc}>
         <div>
  <strong>{loc}</strong> ({assignments[d.id][loc].length})
</div>

                <ul>
                  {assignments[d.id][loc].map(emp => (
                    <li key={emp}>
                      {emp}{" "}
                      <button onClick={() => removeEmployee(emp)}>❌ Temp Remove</button>{" "}
                      <button onClick={() => removeEmployee(emp, true)}>🗑 Perm Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add employee */}
      <div className="card">
        <h3>Add Employee</h3>
        <input
          type="text"
          id="newEmployee"
          placeholder="Enter employee name"
        />
        <button
          onClick={() => {
            const name = document.getElementById("newEmployee").value;
            addEmployee(name, false);
          }}
        >
          Add Temporary
        </button>
        <button
          onClick={() => {
            const name = document.getElementById("newEmployee").value;
            addEmployee(name, true);
          }}
        >
          Add Permanent
        </button>
      </div>

      {/* Copy Summary */}
      <button
        className="copy"
        onClick={() => {
          navigator.clipboard.writeText(buildSummary());
          alert("Summary copied to clipboard!");
        }}
      >
        Copy Summary
      </button>
    </div>
  );
};

export default App;
