import React from 'react'
import styles from '../Styles/details.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Typography } from "@mui/material";
import UserNavbar from './Components/UserNavbar';

function ElectionDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const election = location.state?.data;
    const electionType = election.open === true ? 'open' : 'closed';

    const phaseMap = {
      0: {
        head: "Creation phase",
        body: "Election is being created in this phase. It is not hosted for user interaction",
      },
      1: {
        head: "Registration phase",
        body: "This is the registration phase of the election. Please register to participate in the election.",
      },

      2: {
        head: "Voting phase",
        body: "This is the voting phase of the election. Please vote now for your candidate(s).",
      },

      3: {
        head: "Result phase",
        body: "This is the result phase of the election. You can see the winners in the results page.",
      },
      4: {
        head: "Close Election",
        body: "Election has ended successfully, and is changed to inactive.",
      },
    };

    return (
      <>
        <UserNavbar />
        <div className={styles.container}>
          <div className={styles.textContainer}>
            <Typography variant="h4" component="h1" className={styles.title}>
              {election.title}
            </Typography>
            <Typography variant="body1" className={styles.description}>{election.description}</Typography>
            {election.open ? (
              <Typography variant="body1" className={styles.area}>
                This election is for {election.area} area.
              </Typography>
            ) : (
              <Typography variant="body1" className={styles.department}>
                This election is for {election.department} department.
              </Typography>
            )}
            <Typography variant="body1" className={styles.candidates}>
              There can be a maximum of {election.maxCandidates} candidates in
              this election. Currently there are {election.candidates.length}{" "}
              candidates registered.
            </Typography>
            <Typography variant="body1" className={styles.voters}>
              There can be a maximum of {election.maxVoter} voters in
              thiselection.
            </Typography>
            {election.maxWinners > 1 ? (
              <Typography variant="body1" className={styles.winners}>
                This election can have multiple winners. There can be a maximum
                of {election.maxWinners} winners in this election.
              </Typography>
            ) : (
              <Typography variant="body1" className={styles.winners}>
                This election can have only one winner.
              </Typography>
            )}
            {election.ageRestriction ? (
              <Typography variant="body1" className={styles.ageRestriction}>
                This election is age restricted. You must be 18 years or above
                to register and vote.
              </Typography>
            ) : (
              <Typography variant="body1" className={styles.ageRestriction}>
                This election is not age restricted. Anyone of the department
                can register and vote.
              </Typography>
            )}
            <Typography variant="body1" className={styles.phase}>
              Currently, this election is in {phaseMap[election.phase].head}{" "}
              phase.
            </Typography>
            <Typography variant="body1" className={styles.phase}>
              {phaseMap[election.phase].body}
            </Typography>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              onClick={() =>
                navigate(`/user/elections/view/${electionType}`, {
                  state: { data: { ...election } },
                })
              }
            >
              Go Back
            </Button>
          </div>
        </div>
      </>
    );
}

export default ElectionDetails