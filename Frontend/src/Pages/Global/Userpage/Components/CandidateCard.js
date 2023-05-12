import React , {useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import VoteModal from './VoteModal'

function CandidateCard({ candidateList, electionID }) {
    const [voteModal, setVoteModal] = useState(false);
    const [candidate, setCandidate] = useState([]);
    async function findCandidate(electionID, candidateID) {
        const response = await fetch(`http://localhost:5500/api/candidate/${electionID}/find/${candidateID}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (data.status === "OK") {
            setCandidate(data.candidate);
            setVoteModal(true);
        } else {
            console.log(data.error);
        }
    }
    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "20px",
          }}
        >
          {candidateList?.map((candidate) => (
            <Card
              key={candidate._id}
              sx={{
                maxWidth: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  width="50%"
                  image={candidate.Photo.file}
                  alt="candidate photo"
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ paddingBottom: "0px" , alignItems: "center", textAlign: "center"}}>
                  <Typography gutterBottom variant="h5" component="div">
                    {candidate.Name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {candidate.UID}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Age: {candidate.Age}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{ justifyContent: "center", paddingBottom: "20px" }}
              >
                <Button
                  size="medium"
                  color="primary"
                  variant="outlined"
                  onClick={() => findCandidate(electionID, candidate._id)}
                >
                  Vote
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>

        {voteModal && (
          <VoteModal
            setVoteModal={setVoteModal}
            electionID={electionID}
            candidateID={candidate._id}
          />
        )}
      </>
    );
 }

export default CandidateCard
