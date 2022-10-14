query = """
   SELECT CustomerId, FirstName, PhoneNumber
   FROM Customers
   WHERE (FirstName LIKE "%a" OR LastName LIKE "b%") AND Phonenumber LIKE "217%"
   ORDER BY FirstName DESC, PhoneNumber DESC;
   """
subquery = "SELECT s.NetId, Score " \
           "FROM Enrollments e LEFT JOIN Students s ON e.NetId = s.NetId" \
           "WHERE s.Department = 'STAT' AND Score = (select max(Score) from Score) OR Score = (select min(Score) from Score)" \
           "GROUP BY CRN ORDER BY s.NetId ASC, e.Score DESC"

# Subquery in From
from_subquery = "SELECT e.CRN, courses.CourseAvgScore, " \
                "s.NetId, e.Score FROM Students s NATURAL JOIN Enrollments e " \
                "JOIN (SELECT CRN, SUM(e.Score*e.Credits)/SUM(e.Credits) AS CourseAvgScore " \
                "FROM Enrollments e JOIN Courses c USING(CRN)" \
                "GROUP BY CRN) AS courses USING(CRN) WHERE courses.CourseAvgScore >=80 AND e.Score >85 " \
                "ORDER BY e.CRN DESC, e.Score DESC"
