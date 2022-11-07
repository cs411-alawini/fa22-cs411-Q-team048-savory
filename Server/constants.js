export const advQueriesDic = {"avg_clauses": `SELECT s.QuestionID,
COUNT(*)/COUNT(DISTINCT s.ID) as avg_clauses
FROM Submission s
JOIN Clause c ON (s.ID=c.SubmissionID)WHERE s.IsSuccess = 1
GROUP BY s.QuestionID;`,

"avg_attempts": `SELECT tmp1.QuestionID, AVG(attempt_count) as avg_attempts
FROM
(SELECT s.UserID,
s.QuestionID,
count(s.ID) AS attempt_count
FROM Submission s
JOIN
(SELECT min(Timestamp) AS min_ts,
QuestionID,
UserID
FROM Submission st
WHERE st.IsSuccess = 1
GROUP BY st.QuestionID,
st.UserID) AS tmp ON (s.QuestionID = tmp.QuestionID AND s.UserID = tmp.UserID)
WHERE s.Timestamp <= tmp.min_ts
GROUP BY s.QuestionID,
s.UserID) AS tmp1
GROUP BY tmp1.QuestionID;`
};
