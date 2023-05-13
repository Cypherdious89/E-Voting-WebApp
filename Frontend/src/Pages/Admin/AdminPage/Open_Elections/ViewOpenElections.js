import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../Styles/view_elections.module.css";
import AdminNavbar from "../Components/AdminNavbar";

function ViewElections() {
  const [electionList, setElectionList] = useState([]);
  const navigate = useNavigate();
  const phaseMap = {
    0: "Creation phase",
    1: "Registration phase",
    2: "Voting phase",
    3: "Result Phase",
  };

  useEffect(() => {
    fetch("http://localhost:5500/api/election/open/get", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((elections) => {
        setElectionList(elections.data);
      });
  }, []);

  async function closeElection(electionID) {
    const response = await fetch(
      `http://localhost:5500/api/election/${electionID}/close`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (data.status === "OK") {
      toast.success("Election is Complete!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      setTimeout(() => {
        navigate(`/admin/dashboard`);
      }, 500);
    } else {
      toast.error("Some error occurred, please try again !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  }

  const PropertiesGrid = ({ election }) => {
    const properties = [
      { title: "Area", value: election.area },
      { title: "Candidates", value: election.maxCandidates },
      { title: "Seats", value: election.maxWinners },
      { title: "Phase", value: phaseMap[election.phase] },
      {
        title: "Status",
        value: election.active === true ? "Active" : "Closed",
      },
    ];

    return (
      <div className={styles.grid_container}>
        {properties.map((property, index) => (
          <div key={index} className={styles.grid_item}>
            <div className={styles.grid_title}>{property.title}</div>
            <div className={styles.grid_value}>{property.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const ElectionCard = ({ election }) => {

    const phaseToLink = {
      0: { path: `/admin/elections/edit/open/${election._id}/`, text: "Modify Election Details"},
      1: { path: `/admin/elections/${election._id}/voters`, text: "Registered Voters" },
      2: { path: `/admin/elections/${election._id}/voters`, text: "Registered Voters" },
      3: { path: `/admin/elections/${election._id}/results`, text: "Results" },
    };

    const { path, text } = phaseToLink[election.phase] || {};

    return (
      <div className={styles.card}>
        <div className={styles.header}>{election.title}</div>
        <div className={styles.body}>
          <h4 className={styles.description}>{election.description}</h4>
          <PropertiesGrid election={election} />
          <div className={styles.btn_container}>
            {election.phase > 0 ? (
              <Link
                to={`/admin/elections/${election._id}/candidates`}
                state={{ data: { ...election } }}
              >
                <button className={styles.cardBtn}>Candidate List</button>
              </Link>
            ) : (
              ""
            )}
            {election.phase >= 0 && election.phase <= 3 && (
              <Link to={path} state={{ data: { ...election } }}>
                <button className={styles.cardBtn}>{text}</button>
              </Link>
            )}
            {election.phase < 3 ? (
              <Link
                to={`/admin/elections/${election._id}/phase`}
                state={{ data: { ...election } }}
              >
                <button className={styles.cardBtn}>
                  Change Election Phase
                </button>
              </Link>
            ) : (
              <button
                className={styles.cardBtn}
                onClick={() => closeElection(election._id)}
              >
                Close Election
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ElectionList = () => {
    return (
      <div className={styles.listContainer}>
        {electionList?.map((election) => (
          <ElectionCard key={election._id} election={election} />
        ))}
      </div>
    );
  };
  return (
    <>
      <AdminNavbar />
      <div className={styles.mainbody}>
        <h1 className={styles.title}>Active Open Elections</h1>
        {electionList.length > 0 ? <ElectionList electionList={electionList} />: <h3 className={styles.subheading}>No election found !</h3>}
      </div>
    </>
  );
}

export default ViewElections;
