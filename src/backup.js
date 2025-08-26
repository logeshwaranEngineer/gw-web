import React, { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import "./App.css";

const STORAGE_KEYS = {
  EMPLOYEES: "employees",
  ASSIGNMENTS: "assignments",
  DRIVER: "selectedDriver",
  SECOND_DRIVER: "selectedSecondDriver",
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
  const [selectedSecondDriver, setSelectedSecondDriver] = useState("");
  const [selectedTime, setSelectedTime] = useState("06:30");

  const [newEmployee, setNewEmployee] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // Driver options
  const driverCandidates = employees
    .filter(e => e.includes("(Driver)"));

  // Second driver options (exclude first driver)
  const secondDriverCandidates = driverCandidates
    .filter(d => d !== selectedDriver);

  // Workers list (exclude drivers + chosen drivers)
  const workers = employees
    .filter(e => !e.includes("(Driver)"))
    .filter(e => e !== selectedDriver && e !== selectedSecondDriver)
    .sort((a, b) => a.localeCompare(b));

  // Load saved data
  useEffect(() => {
    const savedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));

    const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

    const savedDriver = localStorage.getItem(STORAGE_KEYS.DRIVER);
    if (savedDriver) setSelectedDriver(savedDriver);

    const savedSecondDriver = localStorage.getItem(STORAGE_KEYS.SECOND_DRIVER);
    if (savedSecondDriver) setSelectedSecondDriver(savedSecondDriver);

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
    localStorage.setItem(STORAGE_KEYS.DRIVER, selectedDriver);
  }, [selectedDriver]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECOND_DRIVER, selectedSecondDriver);
  }, [selectedSecondDriver]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME, selectedTime);
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
    if (selectedDriver === emp) setSelectedDriver("");
    if (selectedSecondDriver === emp) setSelectedSecondDriver("");
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
      `Second Driver : ${selectedSecondDriver || "N/A"}\n` +
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

      {/* Driver 1 */}
      <label>Driver :</label>
      <select value={selectedDriver} onChange={(e) => {
        setSelectedDriver(e.target.value);
        if (selectedSecondDriver === e.target.value) setSelectedSecondDriver("");
      }}>
        <option value="">Select Driver</option>
        {driverCandidates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {selectedDriver && (
        <button onClick={() => setSelectedDriver("")}>Clear Driver</button>
      )}

      {/* Driver 2 */}
      <label>Second Driver :</label>
      <select
        value={selectedSecondDriver}
        onChange={(e) => setSelectedSecondDriver(e.target.value)}
        disabled={!selectedDriver || !selectedTime}
      >
        <option value="">Select Second Driver</option>
        {secondDriverCandidates.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      {selectedSecondDriver && (
        <button onClick={() => setSelectedSecondDriver("")}>Clear Second Driver</button>
      )}

      {/* Time */}
      <label>Time :</label>
      <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />

      <div className="cards">
        {/* Employee Card */}
        <div className="card">
          <h3>Employees</h3>
          {
            (selectedDriver && selectedTime) ? (
              <>
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="scroll-box">
                  {workers
                    .filter(emp => emp.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((emp) => (
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
              </>
            ) : (
              <p>Please select both a driver and a time before assigning employees.</p>
            )
          }
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
