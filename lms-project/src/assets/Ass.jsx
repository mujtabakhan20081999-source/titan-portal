import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faArrowRight, faBell, faCode, faPenRuler, faFileCode, faLaptopCode, faLayerGroup, faFile } from "@fortawesome/free-solid-svg-icons";
function Ass() {
const [filter, setFilter] = useState("All");

const assignmentsData = [
  {
    id: 1,
    icon: faCode,
    title: "React JS Assignment",
    desc: "Build a responsive web app using React.",
    dueDate: "29 May 2026",
    status: "Pending",
  },
  {
    id: 2,
    icon: faFileCode,
    title: "JavaScript Basics",
    desc: "Solve the given JavaScript problems.",
    dueDate: "18 May 2026",
    status: "Submitted",
  },
  {
    id: 3,
    icon: faPenRuler,
    title: "UI/UX Design Task",
    desc: "Create a modern dashboard UI in Figma.",
    dueDate: "15 May 2026",
    status: "Pending",
  },
  {
    id: 4,
    icon: faLaptopCode,
    title: "HTML & CSS Assignment",
    desc: "Build a personal portfolio using HTML & CSS.",
    dueDate: "10 May 2026",
    status: "Completed",
  },
  {
    id: 5,
    icon: faLayerGroup,
    title: "Bootstrap Assignment",
    desc: "Build a responsive website using Bootstrap.",
    dueDate: "05 May 2026",
    status: "Submitted",
  },
  {
    id: 6,
    icon: faCode,
    title: "Node JS Assignment",
    desc: "Create a simple REST API using Node.js.",
    dueDate: "02 May 2026",
    status: "Completed",
  },
  {
    id: 7,
    icon: faCode,
    title: "ES6 Features",
    desc: "Practice arrow functions, promises, and async/await.",
    dueDate: "28 April 2026",
    status: "Pending",
  },
];
  const filteredData = assignmentsData.filter((item) => {
  if (filter === "All") {
    return true;
  }

  if (filter === "Submitted") {
    return (
      item.status === "Submitted" ||
      item.status === "Completed"
    );
  }

  return item.status === filter;
});

  return (
    <>
      <header>
        <nav>
          <div className="left">
            <h1>Assignments</h1>
            <div className="bottom">
              <span>
                Dashboard
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "10px", color: "var(--text-muted)" }} />
                Assignments
              </span>
            </div>
          </div>

          <div className="right">
            <div className="img">
              <FontAwesomeIcon icon={faBell} style={{ fontSize: "18px", color: "var(--text-main)" }} />
              <span className="notif-badge">3</span>
            </div>

            <div className="img">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_x6NNYAH91WrxPQxhwGYyP1__DcgwqftUeGfjIPhcew&s=10"
                alt="profile"
              />
            </div>

            <div className="text">
              <h4>Ali Raza</h4>
              <h4>Student</h4>
            </div>
          </div>
        </nav>
      </header>

      <div className="tabs-container">
        <button className={`tab-btn ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")} >All Assignments</button>

        <button className= {`tab-btn ${filter === "Pending" ? "active" : ""}`}  onClick={ () => setFilter("Pending")
        }>
          Pending <span className="tab-count">(2)</span>
        </button>

        <button className= {`tab-btn ${filter === "Submitted" ? "active" : ""}`}  onClick={() => setFilter("Submitted")}>
          Submitted <span className="tab-count">(1)</span>
        </button>
      </div>
      <div className="assigmentscard">
        
        
                <div className="container">
  {filteredData.map((item) => (
    <div className="card" key={item.id}>
      <div className="left-card">
        <div className="icon">
          <span><FontAwesomeIcon icon={item.icon} /></span>
        </div>
        <div className="content">
          <span>{item.title}</span>
          <p>{item.desc}</p>
        </div>
      </div>

      <div className="right-card">
        <div className="right-content">
          <h4>Due Date</h4>
          <h4>{item.dueDate}</h4>
        </div>

        <div className="btn">
          <button className={`status-${item.status.toLowerCase()}`}>
            {item.status}
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
             
        
       
      </div>
    </>
  );
}

export default Ass;