import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DualListBox from "react-dual-listbox";
import htmlParse from "html-react-parser";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/src/scss/react-dual-listbox.scss";

function CreateExams() {
  const [count, setCount] = useState(0);
  const [exam, setExam] = useState({
    certificateId: "",
    passMark: "",
    maximumScore: "",
  });
  const [examQuestions, setExamQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/api/Certificates");
        setCertificates(response.data);
        const response2 = await axiosPrivate.get("/api/Questions");
        setQuestions(response2.data);
        console.log(response.data);
        console.log(questions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setExam({ ...exam, [name]: value });
  };
  const handleBoxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setExamQuestions((pre) => [...pre, value]);
      setCount(count + 1);
    } else {
      setExamQuestions((pre) => {
        return [...pre.filter((skill) => skill !== value)];
      });
      setCount(count - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosPrivate.post("/api/Exams", exam);
      console.log(response.data);
      const examId = response.data.examId;
      await axiosPrivate.post(
        `/api/ExamQuestions?examId=${examId}`,
        examQuestions
      );
      alert("Exam created successfully!");
      // console.log(questionId);
      navigate("/AdminUI/Exams");
    } catch (error) {
      console.error(error);
      alert("Error creating Exam");
    }
  };

  // filters the questions from the topics of the certificate
  const filteredQuestions = [];
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (question.topic.certificateId == exam.certificateId) {
      filteredQuestions.push(question);
    }
  };

  return (
    <>
      <h1>Create New Exam</h1>
      <form onSubmit={handleSubmit} className="row g-3 form-container">
        <div className="form-group">
          <label htmlFor="certificateId">Certificates</label>
          <select
            className="form-control"
            id="certificateId"
            name="certificateId"
            value={exam.certificateId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a Certificate
            </option>
            {certificates.map((certificate) => (
              <option
                key={certificate.certificateId}
                value={certificate.certificateId}
              >
                {certificate.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Add Exam Questions:</h3>

          <DualListBox
            options={filteredQuestions
              .map((question) => ({
                value: question.questionId,
                label: `${question.topic.topicDescription} : ${htmlParse(
                  question.descriptionStem
                )}`,
              }))}
            selected={examQuestions}
            onChange={(value) => {
              setExamQuestions(value);
              setCount(value.length);
            }}
            icons={{
              moveLeft: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              ),
              moveAllLeft: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              ),
              moveRight: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              ),
              moveAllRight: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chevron-double-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              ),
            }}
          />
        </div>
        <div className="col-md-6">
          <label for="passMark" className="form-label">
            {" "}
            Pass Mark :
          </label>
          <input
            id="passMark"
            name="passMark"
            type="number"
            className="form-control"
            value={exam.passMark}
            onChange={handleChange}
          ></input>
        </div>
        <div className="col-md-6">
          <label for="maximumScore" className="form-label">
            {" "}
            Maximum Mark :
          </label>
          <input
            id="maximumScore"
            name="maximumScore"
            type="number"
            className="form-control"
            value={exam.maximumScore}
            onChange={handleChange}
          ></input>
        </div>

        <button type="submit" className="btn btn-primary col-md-1 mx-auto">
          Create
        </button>
      </form>
    </>
  );
}
export default CreateExams;

// import React, { useState, useEffect } from "react";
// import { json, useNavigate } from "react-router-dom";
// import axios from "axios";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
// import htmlParse from 'html-react-parser';

// function CreateExams() {
//     const [count, setCount] = useState(0)
//     const [exam, setExam] = useState({
//         certificateId: "",
//         passMark: "",
//         maximumScore:"",
//       });
//     const [examQuestions, setExamQuestions] = useState([]);
//     const [questions, setQuestions] = useState([]);
//     const [certificates, setCertificates] = useState([]);
//     const navigate = useNavigate();
//     const axiosPrivate = useAxiosPrivate();

//       useEffect(() => {
//         const fetchData = async () => {
//           try {
//             const response = await axiosPrivate.get("/api/Certificates");
//             setCertificates(response.data);
//             const response2 = await axiosPrivate.get("/api/Questions");
//             setQuestions(response2.data);
//             console.log(response.data);
//             console.log(questions);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//     fetchData();
// }, []);
// const handleChange = (event) => {
//     const { name, value } = event.target;
//     setExam({ ...exam, [name]: value });
//       };
// const handleBoxChange =(event) => {
//   const {value,checked} = event.target
//   if (checked) {
//     setExamQuestions(pre => [...pre,value]);
//     setCount(count+1)
//   } else {
//     setExamQuestions(pre =>{
//       return[...pre.filter(skill=>skill!==value)]
//     });
//     setCount(count-1)
//   }
// };

// const handleSubmit = async (event) => {
//   event.preventDefault();
//   try {
//     const response = await axiosPrivate.post("/api/Exams",exam);
//      console.log(response.data);
//     const examId = response.data.examId;
//     await axiosPrivate.post(`/api/ExamQuestions?examId=${examId}`,examQuestions);
//     alert("Exam created successfully!");
//     // console.log(questionId);
//     navigate("/AdminUI/Exams");
//   } catch (error) {
//     console.error(error);
//     alert("Error creating Exam");
//   }
// };
//  return(
//      <>
//     <h1>Create New Exam</h1>
//  <form onSubmit={handleSubmit} className="row g-3 form-container">

//    <div className="form-group">

//      <label htmlFor="certificateId">Certificates</label>
//      <select
//        className="form-control"
//        id="certificateId"
//        name="certificateId"
//        value={exam.certificateId}
//        onChange={handleChange}
//        required
//        >
//       <option value="" disabled>
//          Select a Certificate
//        </option>
//        {certificates.map((certificate) => (
//          <option key={certificate.certificateId} value={certificate.certificateId}>
//            {certificate.title}
//          </option>
//            ))}

//     </select>
//    </div>
//   <div className="form-group">
//   <h3>Add Exam Questions:</h3>
//    {questions.map((question, index) => (
//     <div key={index}>
//      {question.topic.certificateId==exam.certificateId &&

//     <div className="form-group">
//       <input type="checkbox" id="questionId" name="questionId" value={question.questionId} onChange={handleBoxChange}/>
//     <label for="questionId"> <hr/> &nbsp;{question.topic.topicDescription} :{htmlParse(question.descriptionStem)} </label>
//     </div>
//       }
//     </div>
//     ))}
//   </div>
//     <div className="col-md-6">
//       <label for="passMark" className="form-label"> Pass Mark :</label>
//       <input id="passMark" name="passMark" type="number" className="form-control" value={exam.passMark} onChange={handleChange}></input>
//     </div>
//     <div className="col-md-6">
//       <label for="maximumScore" className="form-label"> Maximum Mark :</label>
//       <input id="maximumScore" name="maximumScore" type="number" className="form-control" value={exam.maximumScore} onChange={handleChange}></input>
//     </div>

//    <button type="submit" className="btn btn-primary col-md-1 mx-auto">
//      Create
//    </button>
//  </form>
// </>
//  );
// }
// export default CreateExams;
