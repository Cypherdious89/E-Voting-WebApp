import React, {useState} from 'react'
import { useLocation } from 'react-router-dom';
import CandidateModal from './Components/CandidateModal';
function CandidateList() {
  const location = useLocation();
  const election = location.state?.data


  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <h1>Candidate List for {election.title} - {election.area}</h1>
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Age</th>
            <th>Candidate Photo</th>
            <th>Candidate ID</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
      <button className='primaryBtn' onClick={() => setIsOpen(true)}>Add Candidate</button>
      {isOpen && <CandidateModal setIsOpen={setIsOpen} />}
    </>
  )
}

export default CandidateList