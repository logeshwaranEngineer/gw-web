import React, { useMemo, useState } from "react";
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

const initialLocations = [
  "IWMF", "CORA", "VSMC SITE", "MSD",
  "1ESS SOONLEE", "CYE OFFICE", "MEP WORKSHOP",
  "MEP OFFICE", "CDA PIPING (MEP WORKSHOP)",
  "SITE LAYDOWN BANYAN", "WAN CHENG(OFFICE COME)"
];

// Fixed drivers
const DRIVER1 = "SHANTHAKUMAR - YR3364P (Driver)";
const DRIVER2 = "VELLAISAMY PRASANTH -  YQ1179B  (Driver)";
const App = () => {
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  const formattedDate = useMemo(() => format(tomorrow, "dd/MM/yyyy EEEE"), [tomorrow]);

  const [locations] = useState(initialLocations);

  const [assignments1, setAssignments1] = useState({});
  const [assignments2, setAssignments2] = useState({});
  const [selectedLocation1, setSelectedLocation1] = useState("");
  const [selectedLocation2, setSelectedLocation2] = useState("");

  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  const [time1, setTime1] = useState("06:00");
  const [time2, setTime2] = useState("06:30");

  const usedInDriver1 = Object.values(assignments1).flat();
  const usedInDriver2 = Object.values(assignments2).flat();

  const unassignedEmployees1 = initialEmployees.filter(
    e => !usedInDriver1.includes(e) && !usedInDriver2.includes(e)
  );
  const unassignedEmployees2 = initialEmployees.filter(
    e => !usedInDriver2.includes(e) && !usedInDriver1.includes(e)
  );

  const toggleEmployee = (emp, loc, driver) => {
    if (driver === 1) {
      setAssignments1(prev => {
        const current = prev[loc] || [];
        return current.includes(emp)
          ? { ...prev, [loc]: current.filter(e => e !== emp) }
          : { ...prev, [loc]: [...current, emp] };
      });
    } else {
      setAssignments2(prev => {
        const current = prev[loc] || [];
        return current.includes(emp)
          ? { ...prev, [loc]: current.filter(e => e !== emp) }
          : { ...prev, [loc]: [...current, emp] };
      });
    }
  };

  const buildSummary = (driver, time, assignments) => {
    const header =
      `Date : ${formattedDate}\n` +
      `Time : ${time}\n` +
      `Driver : ${driver}\n`;

    const blocks = Object.keys(assignments)
      .filter(loc => assignments[loc]?.length > 0)
      .map(loc => {
        const list = assignments[loc];
        const lines = list.map((emp, i) => `${i + 1}. ${emp}`).join("\n");
        return `\n*${loc}* (${list.length})\n${lines}`;
      });

    const firstLoc = Object.keys(assignments)[0];
    let footer = "";
    if (firstLoc) {
      const count = assignments[firstLoc]?.length || 0;
      footer = `\nTotal in first vehicle: ${count} Employees + 1 Driver`;
    }

    return [header, ...blocks, footer].join("\n");
  };

  const renderAssignedList = (assignments) => (
    <div className="assigned-list">
      {Object.keys(assignments).length === 0 && <p>No employees selected yet.</p>}
      {Object.entries(assignments).map(([loc, list]) => (
        list.length > 0 && (
          <div key={loc} className="assigned-block">
            <h4>{loc} ({list.length})</h4>
            <ul>
              {list.map((emp, i) => (
                <li key={emp}>{i + 1}. {emp}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );

  return (
    <div className="app">
      <h2 className="header">Transportation Assignment</h2>
      <p><strong>Date:</strong> {formattedDate}</p>

      {/* DRIVER 1 */}
      <div className="card">
        <h3>Driver 1 — {DRIVER1}</h3>

        <label>Pickup Time:</label>
        <input
          type="time"
          value={time1}
          onChange={(e) => setTime1(e.target.value)}
        />

        <label>Choose Site:</label>
        <select value={selectedLocation1} onChange={(e) => setSelectedLocation1(e.target.value)}>
          <option value="">Select Site</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {selectedLocation1 && (
          <>
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery1}
              onChange={(e) => setSearchQuery1(e.target.value)}
            />
            <div className="scroll-box">
              {unassignedEmployees1
                .filter(emp => emp.toLowerCase().includes(searchQuery1.toLowerCase()))
                .map(emp => (
                  <label key={emp} className="emp-check">
                    <input
                      type="checkbox"
                      checked={assignments1[selectedLocation1]?.includes(emp) || false}
                      onChange={() => toggleEmployee(emp, selectedLocation1, 1)}
                    />
                    {emp}
                  </label>
                ))}
            </div>
          </>
        )}

        <h4>Selected Employees (Driver 1) - {DRIVER1}</h4>
        {renderAssignedList(assignments1)}

        <button
          onClick={() => {
            navigator.clipboard.writeText(buildSummary(DRIVER1, time1, assignments1));
            alert("Driver 1 summary copied!");
          }}
        >
          Copy Driver 1 Summary
        </button>
      </div>

      {/* DRIVER 2 */}
      <div className="card">
        <h3>Driver 2 — {DRIVER2}</h3>

        <label>Pickup Time:</label>
        <input
          type="time"
          value={time2}
          onChange={(e) => setTime2(e.target.value)}
        />

        <label>Choose Site:</label>
        <select value={selectedLocation2} onChange={(e) => setSelectedLocation2(e.target.value)}>
          <option value="">Select Site</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {selectedLocation2 && (
          <>
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery2}
              onChange={(e) => setSearchQuery2(e.target.value)}
            />
            <div className="scroll-box">
              {unassignedEmployees2
                .filter(emp => emp.toLowerCase().includes(searchQuery2.toLowerCase()))
                .map(emp => (
                  <label key={emp} className="emp-check">
                    <input
                      type="checkbox"
                      checked={assignments2[selectedLocation2]?.includes(emp) || false}
                      onChange={() => toggleEmployee(emp, selectedLocation2, 2)}
                    />
                    {emp}
                  </label>
                ))}
            </div>
          </>
        )}

        <h4>Selected Employees (Driver 2) -  {DRIVER2}</h4>
        {renderAssignedList(assignments2)}

        <button
          onClick={() => {
            navigator.clipboard.writeText(buildSummary(DRIVER2, time2, assignments2));
            alert("Driver 2 summary copied!");
          }}
        >
          Copy Driver 2 Summary
        </button>
      </div>
    </div>
  );
};

export default App;
