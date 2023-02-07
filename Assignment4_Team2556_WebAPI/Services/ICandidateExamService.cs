﻿using Assignment4_Team2556_WebAPI.Models;
using Assignment4_Team2556_WebAPI.Models.DTOModels;

namespace Assignment4_Team2556_WebAPI.Services
{
    public interface ICandidateExamService
    {
        Task<IList<Certificate>> GetActiveCertificateList();
        Task<CandidateExam> GetSubmitedCandidateExamById(int id);
        Task<IList<CandidateExam>> GetAccomplishedExamsByCandidateId(string candidateId);
        Task<CandidateExamResultsDTO> GetMarksOfTheSubmitedExam(int candidateExamId);
        Task<ExamForm> GenerateExamForm(string userId, int certificateId);
        Task<IList<CandidateExam>> GetAllCandidateExams();
        Task<IList<CandidateExam>> GetAllMarkedCandidateExamsByMarker(string markerId);
        Task<IList<CandidateExam>> GetAllUnMarkedCandidateExamsByMarker(string markerId);
        Task<IList<CandidateExam>> GetCandidateExam(int candidateExamId);
        Task<IList<CandidateExam>> GetAllUnmarkedCandidateExams();
        Task AddSaveChanges(CandidateExam candidateExam);


    }
}
