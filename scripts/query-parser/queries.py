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
                "FROM Enrollments e JOIN Courses c USING(CRN) " \
                "GROUP BY CRN) AS courses USING(CRN) WHERE courses.CourseAvgScore >=80 AND e.Score >85 " \
                "ORDER BY e.CRN DESC, e.Score DESC"

# https://stackoverflow.com/questions/72087411/simple-way-to-parse-sql-subqueries
"""

"""

import sqlparse

sub_query_idx = 0
inner_level = -1
PARANTHESIS_KEYWORDS = ['SUM', 'HAVING', 'MAX', 'AVG']


#  does not work for 'USING' as its parent is select statement

def check_if_sub_query_paranthesis(parsed_stmnt):
    is_sqp = False
    if parsed_stmnt.parent is not None:
        is_sqp = False if parsed_stmnt.parent.value.startswith(tuple(PARANTHESIS_KEYWORDS)) else True
    return is_sqp


def get_queries(parsed_stmnt, height=0):
    """
        sub_stmnt_tokens = [
                            (<Name 'e' at 0x7F90580D9420>, []),
                            (<Punctuation '.' at 0x7F90580D9480>, []),
                            (<Name 'CRN' at 0x7F90580D94E0>, [])
                           ]
        sub_stmnt = e.CRN

        sub_queries = ['SELECT CRN, SUMe.Score*e.Credits/SUMe.Credits AS CourseAvgScore FROM Enrollments e JOIN Courses c ON e.CRN==c.CRN GROUP BY CRN']
    """
    global sub_query_idx
    if type(parsed_stmnt) != sqlparse.sql.Token:
        is_parenthesis = isinstance(parsed_stmnt, sqlparse.sql.Parenthesis)

        is_sub_query_paran = False
        if is_parenthesis:
            is_sub_query_paran = check_if_sub_query_paranthesis(parsed_stmnt)

        print("Sub statement Tokens")
        # for token in (parsed_stmnt if not (is_parenthesis and is_sub_query_paran) else parsed_stmnt[1:-1])
        sub_stmnt_tokens = [get_queries(token) for token in
                            (parsed_stmnt if not (is_parenthesis and is_sub_query_paran) else parsed_stmnt[1:-1])]
        print(sub_stmnt_tokens)
        # sub_stmnt_tokens = [get_queries(token) for token in
        #                     (parsed_stmnt if not is_parenthesis else parsed_stmnt[1:-1])]

        name_idx = 0
        print("Statement")
        sub_stmnt = ''.join(str(token[name_idx]) for token in sub_stmnt_tokens)
        print(sub_stmnt)
        print("Sub queries")
        sub_queries = [query for token, queries in sub_stmnt_tokens for query in queries]
        print(sub_queries)

        token_idx = 1 if is_parenthesis else 0
        if parsed_stmnt[token_idx].value == 'SELECT':
            sub_query_idx += 1
            # inner_level += 1
            return f'<subquery_{sub_query_idx}>', [sub_stmnt] + sub_queries
        # depth = sub_query_id
        return sub_stmnt, sub_queries

    return parsed_stmnt, []


subquery1 = """SELECT name, email
     FROM (SELECT * FROM user WHERE email IS NOT NULL)
     WHERE id IN (SELECT cID FROM customer WHERE points > 5)
"""

a = sqlparse.parse(subquery1)[0]
stmnt, queries = get_queries(sqlparse.parse(from_subquery)[0])
print("success")
