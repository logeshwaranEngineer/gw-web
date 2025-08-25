import React, { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import "./App.css";

const STORAGE_KEYS = {
  EMPLOYEES: "employees",
  ASSIGNMENTS: "assignments",
  DRIVER: "selectedDriver",
  TIME: "selectedTime",
  LOCATIONS: "locations",
};

const initialEmployees = [
  "BABU MD SOHAG", "KABIR MD ALAMGIR", "PALANIVEL MANIMARAN",
  "MULLAINATHAN GNANAPRAKASAM", "BARMON ONEMIS", "MIAH MD SUJON",
  "MATUBBAR MD SHAHADAT", "SHAHADOT MOHAMMAD", "KANNAN TAMILKUMARAN",
  "SIVAKUMAR MADHAVAN", "NAEEM MD", "MIAH EDUL", "SHEIKH MD SHAMIM",
  "ISLAM TARIQUL", "HOSSAIN MD RAKIB", "SHAHPARAN", "ARUMUGAM NAGARATH",
  "DURAIBHARATHI LOGESHWARAN", "BORA HARI PRASAD", "SINDHASHA ABULKASIMJUNAITHUL",
  "NEELAKANDAN SURESH", "KAZI SAJIB", "BHUIYAN MD TAMIM", "BEPARI MD RAHMAN",
  "KUPPUSAMY SEMBAN", "VELLAISAMY PRASANTH - YQ1179B (Driver)",
  "SHANTHAKUMAR - YR3364P (Driver)", "MURUGESEN NIVAS", "WIN ZAW OO",
  "GUNASEKARAN PURUSHOTHAMAN", "BHUIYAN NADIM", "KARUPPIAH KANAGARAJ",
  "DHIRAVIDA SELVAM SELVAGANAPATHI", "BALAKRISHNAN CHELLADURAI", "RAMAMOORTHY VISHWA",
  "SEPENA JANARDHANA RAO", "MOLLA MD ASIF", "MARUF MD", "KUMAR PRABHAKAR",
  "PRANTO JUBAYER HOSSEN", "CHITRARASAN KALAIYARASAN", "MRIDHA ROBIN",
  "HASAN ATIK", "SIDDIK MD ABU BAKKAR"
];

const initialLocations = [
  "IWMF", "CORA", "VSMC SITE", "MSD",
  "IESS SOONLEE", "CYE OFFICE", "MEP WORKSHOP", "MEP OFFICE",
  "CDA PIPING (MEP WORKSHOP)", "SITE LAYDOWN BANYAN", "WAN CHENG(OFFICE COME)"
];

const App = () => {
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  const formattedDate = useMemo(() => format(tomorrow, "dd/MM/yyyy EEEE"), [tomorrow]);

  const [employees, setEmployees] = useState(initialEmployees);
  const [locations, setLocations] = useState(initialLocations);
  const [assignments, setAssignments] = useState({});
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedTime, setSelectedTime] = useState("06:30");

  const [newEmployee, setNewEmployee] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const driverCandidates = employees.filter(e => e.includes("(Driver)"));
  const workers = employees.filter(e => !e.includes("(Driver)")).sort((a, b) => a.localeCompare(b));

  // Load saved data
  useEffect(() => {
    const savedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

    const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

    const savedDriver = localStorage.getItem(STORAGE_KEYS.DRIVER);
    if (savedDriver) setSelectedDriver(savedDriver);

    const savedTime = localStorage.getItem(STORAGE_KEYS.TIME);
    if (savedTime) setSelectedTime(savedTime);

    const savedLocations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (savedLocations) setLocations(JSON.parse(savedLocations));
  }, []);

  // Save automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    if (selectedDriver) localStorage.setItem(STORAGE_KEYS.DRIVER, selectedDriver);
  }, [selectedDriver]);
  useEffect(() => {
    if (selectedTime) localStorage.setItem(STORAGE_KEYS.TIME, selectedTime);
  }, [selectedTime]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  }, [locations]);

  // Add employee
  const addEmployee = () => {
    const name = newEmployee.trim();
    if (!name || !newLocation) {
      alert("Enter employee name and select location!");
      return;
    }
    if (employees.includes(name)) {
      alert("This employee already exists.");
      return;
    }
    setEmployees([...employees, name]);
    setAssignments(prev => ({
      ...prev,
      [newLocation]: [...(prev[newLocation] || []), name]
    }));
    setNewEmployee("");
    setNewLocation("");
  };

  // Remove employee
  const removeEmployee = (emp) => {
    setEmployees(employees.filter(e => e !== emp));
    const updatedAssignments = {};
    Object.entries(assignments).forEach(([loc, list]) => {
      const filtered = list.filter(e => e !== emp);
      if (filtered.length) updatedAssignments[loc] = filtered;
    });
    setAssignments(updatedAssignments);
  };

  // Assign employee to location
  const assignToLocation = (emp, loc) => {
    setAssignments(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        next[k] = prev[k].filter(x => x !== emp);
      });
      if (loc) {
        if (!next[loc]) next[loc] = [];
        next[loc].push(emp);
      }
      return next;
    });
  };

  // Add new location
  const addLocation = () => {
    const loc = locationInput.trim();
    if (!loc) return;
    if (locations.includes(loc)) {
      alert("Location already exists!");
      return;
    }
    setLocations([...locations, loc]);
    setLocationInput("");
  };

  // Remove location
  const removeLocation = (loc) => {
    setLocations(locations.filter(l => l !== loc));
    const updatedAssignments = { ...assignments };
    delete updatedAssignments[loc];
    setAssignments(updatedAssignments);
  };

  const buildSummary = () => {
    const header =
      `Date : ${formattedDate}\n` +
      `Driver : ${selectedDriver || "N/A"}\n` +
      `Time : ${selectedTime || "N/A"}\n`;

    const blocks = Object.keys(assignments)
      .filter(loc => assignments[loc]?.length > 0)
      .sort()
      .map(loc => {
        const list = assignments[loc];
        const lines = list.map((emp, i) => `${i + 1}. ${emp}`).join("\n");
        return `\n*${loc}* (${list.length})\n${lines}`;
      });

    return [header, ...blocks].join("\n");
  };

  return (
    <div className="app">
      <h2 className="header">Transportation — {formattedDate}</h2>

      {/* Driver */}
      <label>Driver :</label>
      <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
        <option value="">Select Driver</option>
        {driverCandidates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {selectedDriver && (
        <button onClick={() => setSelectedDriver("")}>Clear Driver</button>
      )}

      {/* Time */}
      <label>Time :</label>
      <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />

      <div className="cards">
        {/* Employee Card */}
        <div className="card">
          <h3>Employees</h3>
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="scroll-box">
            {workers
              .filter(emp => emp.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((emp, idx) => (
                <div key={emp} className="emp-card">
                  <span>{emp}</span>
                  <select
                    value={Object.entries(assignments).find(([loc, list]) => list.includes(emp))?.[0] || ""}
                    onChange={(e) => assignToLocation(emp, e.target.value)}
                  >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <button onClick={() => removeEmployee(emp)}>Remove</button>
                </div>
              ))}
          </div>
          <div className="add-row">
            <input
              type="text"
              placeholder="Add employee"
              value={newEmployee}
              onChange={(e) => setNewEmployee(e.target.value)}
            />
            <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)}>
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <button onClick={addEmployee}>Add</button>
          </div>
        </div>

        {/* Location Card */}
        <div className="card">
          <h3>Locations</h3>
          <div className="scroll-box">
            {locations.map(loc => (
              <div key={loc} className="loc-card">
                {loc} <button onClick={() => removeLocation(loc)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="add-row">
            <input
              type="text"
              placeholder="New Location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            <button onClick={addLocation}>Add</button>
          </div>
        </div>
      </div>

      {/* Copy Summary */}
      <button className="copy" onClick={() => {
        navigator.clipboard.writeText(buildSummary());
        alert("Summary copied to clipboard!");
      }}>Copy Summary</button>
    </div>
  );
};

export default App;



// import React, { useEffect, useMemo, useState } from "react";
// import { addDays, format } from "date-fns";
// import "./App.css";

// // ====== CONSTANTS ======
// const STORAGE_KEYS = {
//   EMPLOYEES: "employees",
//   ASSIGNMENTS: "assignments",
//   DRIVER: "selectedDriver",
//   TIME: "selectedTime",
//   LOCATIONS: "locations",
// };

// // Default data
// const initialEmployees = [
//   "BABU MD SOHAG", "KABIR MD ALAMGIR", "PALANIVEL MANIMARAN",
//   "MULLAINATHAN GNANAPRAKASAM", "BARMON ONEMIS", "MIAH MD SUJON",
//   "MATUBBAR MD SHAHADAT", "SHAHADOT MOHAMMAD", "KANNAN TAMILKUMARAN",
//   "SIVAKUMAR MADHAVAN", "NAEEM MD", "MIAH EDUL", "SHEIKH MD SHAMIM",
//   "ISLAM TARIQUL", "HOSSAIN MD RAKIB", "SHAHPARAN", "ARUMUGAM NAGARATH",
//   "DURAIBHARATHI LOGESHWARAN", "BORA HARI PRASAD", "SINDHASHA ABULKASIMJUNAITHUL",
//   "NEELAKANDAN SURESH", "KAZI SAJIB", "BHUIYAN MD TAMIM", "BEPARI MD RAHMAN",
//   "KUPPUSAMY SEMBAN", "VELLAISAMY PRASANTH - YQ1179B (Driver)",
//   "SHANTHAKUMAR - YR3364P (Driver)", "MURUGESEN NIVAS", "WIN ZAW OO",
//   "GUNASEKARAN PURUSHOTHAMAN", "BHUIYAN NADIM", "KARUPPIAH KANAGARAJ",
//   "DHIRAVIDA SELVAM SELVAGANAPATHI", "BALAKRISHNAN CHELLADURAI", "RAMAMOORTHY VISHWA",
//   "SEPENA JANARDHANA RAO", "MOLLA MD ASIF", "MARUF MD", "KUMAR PRABHAKAR",
//   "PRANTO JUBAYER HOSSEN", "CHITRARASAN KALAIYARASAN", "MRIDHA ROBIN",
//   "HASAN ATIK", "SIDDIK MD ABU BAKKAR"
// ];

// const initialLocations = [
//   "IWMF", "CORA", "VSMC SITE", "MSD",
//   "IESS SOONLEE", "CYE OFFICE", "MEP WORKSHOP", "MEP OFFICE",
//   "CDA PIPING (MEP WORKSHOP)", "SITE LAYDOWN BANYAN", "WAN CHENG(OFFICE COME)"
// ];

// // ====== MAIN ======
// const App = () => {
//   const tomorrow = useMemo(() => addDays(new Date(), 1), []);
//   const formattedDate = useMemo(() => format(tomorrow, "dd/MM/yyyy EEEE"), [tomorrow]);

//   const [employees, setEmployees] = useState(initialEmployees);
//   const [locations, setLocations] = useState(initialLocations);
//   const [assignments, setAssignments] = useState({});
//   const [selectedDriver, setSelectedDriver] = useState("");
//   const [selectedTime, setSelectedTime] = useState("06:30");

//   const [newEmployee, setNewEmployee] = useState("");
//   const [newLocation, setNewLocation] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [locationInput, setLocationInput] = useState("");

// const driverCandidates = employees
//   .filter(e => e.includes("(Driver)"))
//   .filter(d => !selectedDriver || d === selectedDriver);
//   const workers = employees.filter(e => !e.includes("(Driver)"))
//                            .sort((a, b) => a.localeCompare(b));

//   // Load saved data
//   useEffect(() => {
//     const savedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
//     if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

//     const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
//     if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

//     const savedDriver = localStorage.getItem(STORAGE_KEYS.DRIVER);
//     if (savedDriver) setSelectedDriver(savedDriver);

//     const savedTime = localStorage.getItem(STORAGE_KEYS.TIME);
//     if (savedTime) setSelectedTime(savedTime);

//     const savedLocations = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
//     if (savedLocations) setLocations(JSON.parse(savedLocations));
//   }, []);

//   // Save automatically
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
//   }, [employees]);
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
//   }, [assignments]);
//   useEffect(() => {
//     if (selectedDriver) localStorage.setItem(STORAGE_KEYS.DRIVER, selectedDriver);
//   }, [selectedDriver]);
//   useEffect(() => {
//     if (selectedTime) localStorage.setItem(STORAGE_KEYS.TIME, selectedTime);
//   }, [selectedTime]);
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
//   }, [locations]);

//   // Add employee
//   const addEmployee = () => {
//     const name = newEmployee.trim();
//     if (!name || !newLocation) {
//       alert("Enter employee name and select location!");
//       return;
//     }
//     if (employees.includes(name)) {
//       alert("This employee already exists.");
//       return;
//     }
//     setEmployees([...employees, name]);
//     setAssignments(prev => ({
//       ...prev,
//       [newLocation]: [...(prev[newLocation] || []), name]
//     }));
//     setNewEmployee("");
//     setNewLocation("");
//   };

//   // Remove employee
//   const removeEmployee = (emp) => {
//     setEmployees(employees.filter(e => e !== emp));
//     const updatedAssignments = {};
//     Object.entries(assignments).forEach(([loc, list]) => {
//       const filtered = list.filter(e => e !== emp);
//       if (filtered.length) updatedAssignments[loc] = filtered;
//     });
//     setAssignments(updatedAssignments);
//   };

//   // Assign employee to location
//   const assignToLocation = (emp, loc) => {
//     setAssignments(prev => {
//       const next = {};
//       Object.keys(prev).forEach(k => {
//         next[k] = prev[k].filter(x => x !== emp);
//       });
//       if (loc) {
//         if (!next[loc]) next[loc] = [];
//         next[loc].push(emp);
//       }
//       return next;
//     });
//   };

//   // Add new location
//   const addLocation = () => {
//     const loc = locationInput.trim();
//     if (!loc) return;
//     if (locations.includes(loc)) {
//       alert("Location already exists!");
//       return;
//     }
//     setLocations([...locations, loc]);
//     setLocationInput("");
//   };

//   // Remove location
//   const removeLocation = (loc) => {
//     setLocations(locations.filter(l => l !== loc));
//     const updatedAssignments = { ...assignments };
//     delete updatedAssignments[loc];
//     setAssignments(updatedAssignments);
//   };

//   const buildSummary = () => {
//     const header =
//       `Date : ${formattedDate}\n` +
//       `Driver : ${selectedDriver || "N/A"}\n` +
//       `Time : ${selectedTime || "N/A"}\n`;

//     const blocks = Object.keys(assignments)
//       .filter(loc => assignments[loc]?.length > 0)
//       .sort()
//       .map(loc => {
//         const list = assignments[loc];
//         const lines = list.map((emp, i) => `${i + 1}. ${emp}`).join("\n");
//         return `\n*${loc}* (${list.length})\n${lines}`;
//       });

//     return [header, ...blocks].join("\n");
//   };

//   return (
//     <div className="app" style={{ color: "blue" }}>
//       <h2 className="header">Transportation — {formattedDate}</h2>

//       {/* Driver */}
//       <label>Driver :</label>
// <select
//   value={selectedDriver}
//   onChange={(e) => setSelectedDriver(e.target.value)}
// >
//   <option value="">Select Driver</option>
//   {driverCandidates.map((d) => (
//     <option key={d} value={d}>{d}</option>
//   ))}
// </select>
// {selectedDriver && (
//   <button onClick={() => setSelectedDriver("")}>Clear Driver</button>
// )}


//       {/* Time Picker */}
//       <label>Time :</label>
//       <input
//         type="time"
//         value={selectedTime}
//         onChange={(e) => setSelectedTime(e.target.value)}
//       />

//       {/* Add Employee */}
//       <div className="add-row">
//         <input
//           type="text"
//           placeholder="Add employee (Name only)"
//           value={newEmployee}
//           onChange={(e) => setNewEmployee(e.target.value)}
//         />
//         <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)}>
//           <option value="">Select Location</option>
//           {locations.map(loc => (
//             <option key={loc} value={loc}>{loc}</option>
//           ))}
//         </select>
//         <button onClick={addEmployee}>Add</button>
//       </div>

//       {/* Add/Remove Location */}
//       <div className="add-row">
//         <input
//           type="text"
//           placeholder="New Location"
//           value={locationInput}
//           onChange={(e) => setLocationInput(e.target.value)}
//         />
//         <button onClick={addLocation}>Add Location</button>
//       </div>
//       <div className="loc-list">
//         {locations.map(loc => (
//           <div key={loc}>
//             {loc} <button onClick={() => removeLocation(loc)}>Remove</button>
//           </div>
//         ))}
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search employee..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       {/* Employee List */}
//       <div className="emp-list">
//         {workers
//           .filter(emp =>
//             emp.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//           .map((emp, idx) => (
//             <div
//               key={emp}
//               className="emp-card"
//               style={{ background: idx % 2 === 0 ? "#e0f0ff" : "#ffffff" }}
//             >
//               <span>{emp}</span>
//               <select
//                 value={
//                   Object.entries(assignments).find(([loc, list]) =>
//                     list.includes(emp)
//                   )?.[0] || ""
//                 }
//                 onChange={(e) => assignToLocation(emp, e.target.value)}
//               >
//                 <option value="">Select Location</option>
//                 {locations.map(loc => (
//                   <option key={loc} value={loc}>{loc}</option>
//                 ))}
//               </select>
//               <button className="remove" onClick={() => removeEmployee(emp)}>Remove</button>
//             </div>
//           ))}
//       </div>

//       {/* Copy Summary */}
//       <button
//         className="copy"
//         onClick={() => {
//           navigator.clipboard.writeText(buildSummary());
//           alert("Summary copied to clipboard!");
//         }}
//       >
//         Copy Summary
//       </button>
//     </div>
//   );
// };

// export default App;




// import React, { useEffect, useMemo, useState } from "react";
// import { addDays, format } from "date-fns";
// import "./App.css";

// // ====== CONSTANTS ======
// const STORAGE_KEYS = {
//   EMPLOYEES: "employees",
//   ASSIGNMENTS: "assignments",
//   DRIVER: "selectedDriver",
//   TIME: "selectedTime",
// };

// // Employee names (designation removed)
// const initialEmployees = [
//   "BABU MD SOHAG", "KABIR MD ALAMGIR", "PALANIVEL MANIMARAN",
//   "MULLAINATHAN GNANAPRAKASAM", "BARMON ONEMIS", "MIAH MD SUJON",
//   "MATUBBAR MD SHAHADAT", "SHAHADOT MOHAMMAD", "KANNAN TAMILKUMARAN",
//   "SIVAKUMAR MADHAVAN", "NAEEM MD", "MIAH EDUL", "SHEIKH MD SHAMIM",
//   "ISLAM TARIQUL", "HOSSAIN MD RAKIB", "SHAHPARAN", "ARUMUGAM NAGARATH",
//   "DURAIBHARATHI LOGESHWARAN", "BORA HARI PRASAD", "SINDHASHA ABULKASIMJUNAITHUL",
//   "NEELAKANDAN SURESH", "KAZI SAJIB", "BHUIYAN MD TAMIM", "BEPARI MD RAHMAN",
//   "KUPPUSAMY SEMBAN", "VELLAISAMY PRASANTH - YQ1179B (Driver)",
//   "SHANTHAKUMAR - YR3364P (Driver)", "MURUGESEN NIVAS", "WIN ZAW OO",
//   "GUNASEKARAN PURUSHOTHAMAN", "BHUIYAN NADIM", "KARUPPIAH KANAGARAJ",
//   "DHIRAVIDA SELVAM SELVAGANAPATHI", "BALAKRISHNAN CHELLADURAI", "RAMAMOORTHY VISHWA",
//   "SEPENA JANARDHANA RAO", "MOLLA MD ASIF", "MARUF MD", "KUMAR PRABHAKAR",
//   "PRANTO JUBAYER HOSSEN", "CHITRARASAN KALAIYARASAN", "MRIDHA ROBIN",
//   "HASAN ATIK", "SIDDIK MD ABU BAKKAR"
// ];

// const initialLocations = [
//   "IWMF", "CORA", "VSMC SITE", "MSD",
//   "IESS SOONLEE", "CYE OFFICE", "MEP WORKSHOP", "MEP OFFICE",
//   "CDA PIPING (MEP WORKSHOP)", "SITE LAYDOWN BANYAN", "WAN CHENG(OFFICE COME)"
// ];

// // ====== MAIN ======
// const App = () => {
//   const tomorrow = useMemo(() => addDays(new Date(), 1), []);
//   const formattedDate = useMemo(() => format(tomorrow, "dd/MM/yyyy EEEE"), [tomorrow]);

//   const [employees, setEmployees] = useState(initialEmployees);
//   const [assignments, setAssignments] = useState({});
//   const [selectedDriver, setSelectedDriver] = useState("");
//   const [selectedTime, setSelectedTime] = useState("06:30");

//   const [newEmployee, setNewEmployee] = useState("");
//   const [newLocation, setNewLocation] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   const driverCandidates = employees.filter(e => e.includes("(Driver)"));
//   const workers = employees.filter(e => !e.includes("(Driver)"));

//   // Load saved data
//   useEffect(() => {
//     const savedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
//     if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

//     const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
//     if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

//     const savedDriver = localStorage.getItem(STORAGE_KEYS.DRIVER);
//     if (savedDriver) setSelectedDriver(savedDriver);

//     const savedTime = localStorage.getItem(STORAGE_KEYS.TIME);
//     if (savedTime) setSelectedTime(savedTime);
//   }, []);

//   // Save automatically
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
//   }, [employees]);
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
//   }, [assignments]);
//   useEffect(() => {
//     if (selectedDriver) localStorage.setItem(STORAGE_KEYS.DRIVER, selectedDriver);
//   }, [selectedDriver]);
//   useEffect(() => {
//     if (selectedTime) localStorage.setItem(STORAGE_KEYS.TIME, selectedTime);
//   }, [selectedTime]);

//   // Add employee with location
//   const addEmployee = () => {
//     const name = newEmployee.trim();
//     if (!name || !newLocation) {
//       alert("Enter employee name and select location!");
//       return;
//     }
//     if (employees.includes(name)) {
//       alert("This employee already exists.");
//       return;
//     }
//     setEmployees([...employees, name]);
//     setAssignments(prev => ({
//       ...prev,
//       [newLocation]: [...(prev[newLocation] || []), name]
//     }));
//     setNewEmployee("");
//     setNewLocation("");
//   };

//   // Remove employee
//   const removeEmployee = (emp) => {
//     setEmployees(employees.filter(e => e !== emp));
//     const updatedAssignments = {};
//     Object.entries(assignments).forEach(([loc, list]) => {
//       const filtered = list.filter(e => e !== emp);
//       if (filtered.length) updatedAssignments[loc] = filtered;
//     });
//     setAssignments(updatedAssignments);
//   };

//   // Assign employee to location
//   const assignToLocation = (emp, loc) => {
//     setAssignments(prev => {
//       const next = {};
//       Object.keys(prev).forEach(k => {
//         next[k] = prev[k].filter(x => x !== emp);
//       });
//       if (loc) {
//         if (!next[loc]) next[loc] = [];
//         next[loc].push(emp);
//       }
//       return next;
//     });
//   };

//   const buildSummary = () => {
//     const header =
//       `Date : ${formattedDate}\n` +
//       `Driver : ${selectedDriver || "N/A"}\n` +
//       `Time : ${selectedTime || "N/A"}\n`;

//     const blocks = Object.keys(assignments)
//       .filter(loc => assignments[loc]?.length > 0)
//       .sort()
//       .map(loc => {
//         const list = assignments[loc];
//         const lines = list.map((emp, i) => `${i + 1}. ${emp}`).join("\n");
//         return `\n*${loc}* (${list.length})\n${lines}`;
//       });

//     return [header, ...blocks].join("\n");
//   };

//   return (
//     <div className="app">
//       <h2 className="header">Transportation — {formattedDate}</h2>

//       {/* Driver */}
//       <label>Driver :</label>
//       <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
//         <option value="">Select Driver</option>
//         {driverCandidates.map((d) => (
//           <option key={d} value={d}>{d}</option>
//         ))}
//       </select>

//       {/* Time Picker */}
//       <label>Time :</label>
//       <input
//         type="time"
//         value={selectedTime}
//         onChange={(e) => setSelectedTime(e.target.value)}
//       />

//       {/* Add Employee */}
//       <div className="add-row">
//         <input
//           type="text"
//           placeholder="Add employee (Name only)"
//           value={newEmployee}
//           onChange={(e) => setNewEmployee(e.target.value)}
//         />
//         <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)}>
//           <option value="">Select Location</option>
//           {initialLocations.map(loc => (
//             <option key={loc} value={loc}>{loc}</option>
//           ))}
//         </select>
//         <button onClick={addEmployee}>Add</button>
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search employee..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       {/* Employee List */}
//       <div className="emp-list">
//         {workers
//           .filter(emp =>
//             emp.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//           .map((emp, idx) => (
//             <div
//               key={emp}
//               className="emp-card"
//               style={{ background: idx % 2 === 0 ? "#e0f0ff" : "#ffffff" }}
//             >
//               <span>{emp}</span>
//               <select
//                 value={
//                   Object.entries(assignments).find(([loc, list]) =>
//                     list.includes(emp)
//                   )?.[0] || ""
//                 }
//                 onChange={(e) => assignToLocation(emp, e.target.value)}
//               >
//                 <option value="">Select Location</option>
//                 {initialLocations.map(loc => (
//                   <option key={loc} value={loc}>{loc}</option>
//                 ))}
//               </select>
//               <button className="remove" onClick={() => removeEmployee(emp)}>Remove</button>
//             </div>
//           ))}
//       </div>

//       {/* Copy Summary */}
//       <button
//         className="copy"
//         onClick={() => {
//           navigator.clipboard.writeText(buildSummary());
//           alert("Summary copied to clipboard!");
//         }}
//       >
//         Copy Summary
//       </button>
//     </div>
//   );
// };

// export default App;
