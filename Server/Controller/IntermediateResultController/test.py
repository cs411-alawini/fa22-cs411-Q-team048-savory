import sys
print("HI", flush=True,end='')

    #submitted_query = "SELECT c.CRN, Title FROM Students s RIGHT JOIN Enrollments e ON s.NetId = e.NetId JOIN Courses c ON e.CRN = c.CRN WHERE c.CRN BETWEEN 333 AND 602 AND c.Title NOT LIKE '%I' AND c.Title LIKE '%Data%' ORDER By e.Score ASC, s.LastName DESC"

    #submitted_query = sys.argv[1]
    
#sys.stdout.flush()