import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const MarkedExamsList = () => {
    const [candidateExams, setCandidateExams] = useState([]); //set marked exam array state
    const { auth } = useAuth(); //retrieve logged in user's data
    const navigate = useNavigate(); //navigate function to automatically redirect page
    const axiosPrivate = useAxiosPrivate(); //custom axios function with user credentials in header


    //
    //Summary: Get all marked exams by logged-in marker
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`/api/CandidateExams/markedexams/${auth.userName}`);
            setCandidateExams(response.data);
        }

        fetchData();
    }, []);


    //
    //Summary: Redirect to Candidate Exam Details page with chosen candidate exam
    const handleReview = async (candidateExamId) => {
        try {
            const response = await axiosPrivate.get(`/api/CandidateExams/${candidateExamId}`);
            const candidateExam = response.data;
            navigate("/MarkerUI/MarkedExamDetails", { state: { candidateExam: candidateExam } });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container-lg">
        <h2 className="mb-5">Marked Exams</h2>
            {candidateExams.length === 0 ? <div>You do not have any marked exams.</div> :
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Candidate Exam ID</th>
                            <th>Certificate Type</th>
                            <th>Candidate First Name</th>
                            <th>Candidate Last Name</th>
                            <th>Exam Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidateExams.map(candidateExam => (
                            <tr key={candidateExam.candidateExamId}>
                                <td>{candidateExam.candidateExamId}</td>
                                <td>{candidateExam.exam.certificate.title}</td>
                                <td>{candidateExam.candidate.firstName}</td>
                                <td>{candidateExam.candidate.lastName}</td>
                                <td>{new Date(candidateExam.examDate).toDateString()}</td>
                                <td>{candidateExam.isMarked == true ? "Marked" : "Unmarked"}</td>
                                <td><button
                                    className="btn btn-outline-success"
                                    onClick={() => handleReview(candidateExam.candidateExamId)}>View Exam</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
        </div>
    )
}

export default MarkedExamsList;