  import React, { useState, useMemo } from "react";
  import { addDays, subDays, format } from "date-fns";
  import "./App.css";

  const initialEmployees = [
    "BABU MD SOHAG",
    "KABIR MD ALAMGIR",
    "PALANIVEL MANIMARAN",
    "MULLAINATHAN GNANAPRAKASAM",
    "BARMON ONEMIS",
    "MIAH MD SUJON",
    "MATUBBAR MD SHAHADAT",
    "SHAHADOT MOHAMMAD",
    "KANNAN TAMILKUMARAN",
    "SIVAKUMAR MADHAVAN",
    "NAEEM MD",
    "MIAH EDUL",
    "SHEIKH MD SHAMIM",
    "ISLAM TARIQUL",
    "HOSSAIN MD RAKIB",
    "SHAHPARAN",
    "ARUMUGAM NAGARATH",
    "DURAIBHARATHI LOGESHWARAN",
    "BORA HARI PRASAD",
    "SINDHASHA ABULKASIMJUNAITHUL",
    "NEELAKANDAN SURESH",
    "KAZI SAJIB",
    "BHUIYAN MD TAMIM",
    "BEPARI MD RAHMAN",
    "KUPPUSAMY SEMBAN",
    "MURUGESEN NIVAS",
    "WIN ZAW OO",
    "GUNASEKARAN PURUSHOTHAMAN",
    "BHUIYAN NADIM",
    "KARUPPIAH KANAGARAJ",
    "DHIRAVIDA SELVAM SELVAGANAPATHI",
    "BALAKRISHNAN CHELLADURAI",
    "RAMAMOORTHY VISHWA",
    "SEPENA JANARDHANA RAO",
    "MOLLA MD ASIF",
    "MARUF MD",
    "KUMAR PRABHAKAR",
    "PRANTO JUBAYER HOSSEN",
    "CHITRARASAN KALAIYARASAN",
    "MRIDHA ROBIN",
    "HASAN ATIK",
    "SIDDIK MD ABU BAKKAR",
  ];

  const initialLocations = [
    "MSD",
    "CORA", 
    "IWMF",
    "MEP OFFICE",
    "MEP WORKSHOP",
  ];

  // Fixed Drivers
  const drivers = [
    {
      id: "driver1",
      name: "VELLAISAMY PRASANTH",
      vehicle: "YQ1179B LORRY FOLLOW",
    },
    { id: "driver2", name: "SHANTHAKUMAR", vehicle: "YR3364P LORRY FOLLOW" },
  ];

  function toBold(text) {
    const map = {
      A: "𝗔",
      B: "𝗕",
      C: "𝗖",
      D: "𝗗",
      E: "𝗘",
      F: "𝗙",
      G: "𝗚",
      H: "𝗛",
      I: "𝗜",
      J: "𝗝",
      K: "𝗞",
      L: "𝗟",
      M: "𝗠",
      N: "𝗡",
      O: "𝗢",
      P: "𝗣",
      Q: "𝗤",
      R: "𝗥",
      S: "𝗦",
      T: "𝗧",
      U: "𝗨",
      V: "𝗩",
      W: "𝗪",
      X: "𝗫",
      Y: "𝗬",
      Z: "𝗭",
    };
    return text
      .split("")
      .map((ch) => map[ch] || ch)
      .join("");
  }

  // Separate components for inputs to prevent re-rendering issues
  const LocationInput = ({ driverId, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || "");
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(driverId, newValue);
    };

    return (
      <input
        type="text"
        placeholder="Type site name..."
        value={localValue}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', fontSize: '1rem', margin: '6px 0' }}
      />
    );
  };

  const SearchInput = ({ driverId, value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || "");
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(driverId, newValue);
    };

    return (
      <input
        type="text"
        placeholder="Search employee..."
        value={localValue}
        onChange={handleChange}
        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', fontSize: '1rem', margin: '6px 0' }}
      />
    );
  };



  const App = () => {
    const [page, setPage] = useState("main"); // main | manage | yesterday | locations
    const tomorrow = useMemo(() => addDays(new Date(), 1), []);
    const yesterday = useMemo(() => subDays(new Date(), 1), []);
const [activeDate, setActiveDate] = useState(tomorrow);


    // Load saved data from localStorage
    const loadSavedData = (date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const saved = localStorage.getItem(`transport-${dateKey}`);
      return saved ? JSON.parse(saved) : { assignments: { driver1: {}, driver2: {} }, times: { driver1: "06:30", driver2: "06:00" } };
    };

    // Save data to localStorage
    const saveData = (date, assignments, times) => {
      const dateKey = format(date, "yyyy-MM-dd");
      localStorage.setItem(`transport-${dateKey}`, JSON.stringify({ assignments, times }));
    };

    const [employees, setEmployees] = useState(initialEmployees);
    const [locations, setLocations] = useState(initialLocations);
    const [assignments, setAssignments] = useState(loadSavedData(activeDate).assignments);
    const [selectedLocation, setSelectedLocation] = useState({
      driver1: "",
      driver2: "",
    });
    const [searchQuery, setSearchQuery] = useState({ driver1: "", driver2: "" });
    const [times, setTimes] = useState(loadSavedData(activeDate).times);

    // filter + sort employees
    const getFilteredEmployees = (driver) => {
      const otherDriver = driver === "driver1" ? "driver2" : "driver1";
      const assignedOther = Object.values(assignments[otherDriver]).flat();
      const query = searchQuery[driver] || "";
      return [...employees] // copy so we can sort
        .filter(
          (emp) =>
            emp.toLowerCase().includes(query.toLowerCase()) &&
            !assignedOther.includes(emp) &&
            !Object.values(assignments[driver]).flat().includes(emp)
        )
        .sort((a, b) => a.localeCompare(b));
    };

    // Handler functions for inputs
    const handleLocationChange = (driverId, value) => {
      setSelectedLocation(prev => ({ ...prev, [driverId]: value }));
    };

  //   const handleSearchChange = React.useCallback((driverId, value) => {
  //   setSearchQuery((prev) => {
  //     const updated = { ...prev, [driverId]: value };
  //     return updated;
  //   });
  // }, []);
  const handleSearchChange = React.useCallback((driverId, value) => {
  setSearchQuery(prev => ({ ...prev, [driverId]: value }));
}, []);

const removeEmployee = (driver, emp, loc) => {
  setAssignments((prev) => {
    const updatedLoc = (prev[driver][loc] || []).filter((e) => e !== emp);
    const newAssignments = {
      ...prev,
      [driver]: { ...prev[driver], [loc]: updatedLoc },
    };
    saveData(tomorrow, newAssignments, times);
    return newAssignments;
  });
};
  

    const selectEmployee = (driver, emp, loc) => {
      if (!loc.trim()) {
        alert("⚠️ Please enter a location before selecting employees!");
        return;
      }
      setAssignments((prev) => {
        const current = prev[driver][loc] || [];
        const newAssignments = {
          ...prev,
          [driver]: { ...prev[driver], [loc]: [...current, emp] },
        };
        // Save to localStorage
        saveData(tomorrow, newAssignments, times);
        return newAssignments;
      });
      // Keep search query - don't clear it
    };
    const buildSummary = (date, driverFilter = null) => {
      return buildSummaryWithData(date, assignments, times, driverFilter);
    };

    const buildSummaryWithData = (date, assignmentsData, timesData, driverFilter = null) => {
      let summary = `\n${format(date, "dd/MM/yyyy EEEE")}\n`;

      drivers
        .filter((d) => !driverFilter || d.id === driverFilter)
        .forEach((d) => {
          const driverAssignments = assignmentsData[d.id] || {};
          const totalEmployees = Object.values(driverAssignments).flat().length;
          const totalWithDriver = totalEmployees + 1;

          summary += `\n${d.name} — ${d.vehicle} — ${timesData[d.id] || "06:30"}AM\n\n`;

          Object.keys(driverAssignments).forEach((loc) => {
            if (driverAssignments[loc]?.length > 0) {
              summary += `${toBold(loc.toUpperCase())}\n`;
              summary += driverAssignments[loc]
                .map((emp, i) => `${i + 1}. ${emp}`)
                .join("\n");
              summary += "\n\n";
            }
          });
          summary += `Total: ${totalWithDriver} (${totalEmployees} Employees + 1 Driver)\n\n`;
          summary += "------------------------------------\n";
        });

      return summary;
    };

    const EmployeeManagePage = () => {
      const [newName, setNewName] = useState("");
      return (
        <div className="card">
          <h2>Employee Management</h2>
          <input
            type="text"
            placeholder="Enter employee name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={() => {
              if (newName.trim() && !employees.includes(newName)) {
                setEmployees([...employees, newName]);
                setNewName("");
              }
            }}
          >
            ➕ Add Employee
          </button>
          <ul>
            {employees
              .sort((a, b) => a.localeCompare(b))
              .map((emp) => (
                <li key={emp}>
                  {emp}
                  <button
                    onClick={() =>
                      setEmployees(employees.filter((e) => e !== emp))
                    }
                  >
                    🗑 Remove
                  </button>
                </li>
              ))}
          </ul>
          <button onClick={() => setPage("main")}>⬅ Back</button>
        </div>
      );
    };

    // Location Management Page
    const LocationManagePage = () => {
      const [newLocation, setNewLocation] = useState("");
      return (
        <div className="card">
          <h2>Location Management</h2>
          <input
            type="text"
            placeholder="Enter location name"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <button
            onClick={() => {
              if (newLocation.trim() && !locations.includes(newLocation.trim())) {
                setLocations([...locations, newLocation.trim()]);
                setNewLocation("");
              }
            }}
          >
            ➕ Add Location
          </button>
          <ul>
            {locations
              .sort((a, b) => a.localeCompare(b))
              .map((loc) => (
                <li key={loc}>
                  {loc}
                  <button
                    onClick={() =>
                      setLocations(locations.filter((l) => l !== loc))
                    }
                  >
                    🗑 Remove
                  </button>
                </li>
              ))}
          </ul>
          <button onClick={() => setPage("main")}>⬅ Back</button>
        </div>
      );
    };

   const YesterdayPage = () => {
  const yesterdayData = loadSavedData(yesterday);

  return (
    <div className="card">
      <h2>Yesterday — {format(yesterday, "dd/MM/yyyy EEEE")}</h2>
      <pre>{buildSummaryWithData(yesterday, yesterdayData.assignments, yesterdayData.times)}</pre>

      <button
        onClick={() => navigator.clipboard.writeText(
          buildSummaryWithData(yesterday, yesterdayData.assignments, yesterdayData.times)
        )}
      >
        📋 Copy Yesterday (All)
      </button>

      <button
        onClick={() => {
          setActiveDate(yesterday);
          setAssignments(yesterdayData.assignments);
          setTimes(yesterdayData.times);
          setPage("main"); // open main editor but with yesterday's data
        }}
      >
        ✏ Edit Yesterday
      </button>

      <br />
      <button onClick={() => setPage("main")}>⬅ Back</button>
    </div>
  );
};

    // Main Page
    const MainPage = () => (
      <div className="app">
        <h2 className="header">
          Transportation — {format(tomorrow, "dd/MM/yyyy EEEE")}
        </h2>
        <button onClick={() => setPage("manage")}>⚙ Manage Employees</button>
        <button onClick={() => setPage("locations")}>📍 Manage Locations</button>
        <button onClick={() => setPage("yesterday")}>⬅ Yesterday’s Record</button>

        {drivers.map((d) => (
          <div key={d.id} className="driver-card">
            <h3>
              {d.name} — {d.vehicle}
            </h3>

            <label>Pickup Time:</label>
            <input
              key={`time-${d.id}`}
              type="time"
              value={times[d.id] || "06:30"}
              onChange={(e) => {
                const newTimes = { ...times, [d.id]: e.target.value };
                setTimes(newTimes);
                saveData(tomorrow, assignments, newTimes);
              }}
            />
            {/* Location input */}
            <label>Select or Enter Location:</label>
            <select
              key={`location-select-${d.id}`}
              value={selectedLocation[d.id] || ""}
              onChange={(e) => handleLocationChange(d.id, e.target.value)}
            >
              <option value="">-- Select Location --</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <input
              key={`location-${d.id}`}
              type="text"
              placeholder="Or type new location..."
              defaultValue=""
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  handleLocationChange(d.id, e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
<div style={{ display: "flex", alignItems: "center", background: "#f1f1f1", borderRadius: "8px", padding: "6px 5px", margin: "4px 0" }}>
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
</div>



            <div className="scroll-box">
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
            </div>

            <div className="card">
              <h4>Selected Employees ({d.name})</h4>
              {Object.keys(assignments[d.id]).map((loc) => (
                <div key={loc}>
                  <strong>{loc}</strong> ({assignments[d.id][loc].length})
                 <ul>
  {assignments[d.id][loc].map((emp) => (
    <li key={emp} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>{emp}</span>
      <button 
        onClick={() => removeEmployee(d.id, emp, loc)} 
        style={{ marginLeft: "8px", color: "red", border: "none", background: "transparent", cursor: "pointer" }}
      >
        ❌
      </button>
    </li>
  ))}
</ul>

                </div>
              ))}
            </div>

            {/* Copy buttons per driver */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(buildSummary(tomorrow, d.id));
                alert(`Tomorrow’s Summary copied for ${d.name}`);
              }}
            >
              📋 Copy Tomorrow ({d.name})
            </button>
          </div>
        ))}

        {/* Copy Summary for all drivers */}
        <button
          className="copy"
          onClick={() => {
            navigator.clipboard.writeText(buildSummary(tomorrow));
            alert("Tomorrow’s Summary copied (All Drivers)!");
          }}
        >
          📋 Copy Tomorrow (All Drivers)
        </button>
      </div>
    );

    return page === "manage" ? (
      <EmployeeManagePage />
    ) : page === "locations" ? (
      <LocationManagePage />
    ) : page === "yesterday" ? (
      <YesterdayPage />
    ) : (
      <MainPage />
    );
  };

  export default App;
