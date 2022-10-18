import sqlparse

CLAUSE_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING']
EXECUTION_ORDER = {'SELECT': 5, 'FROM': 1, 'WHERE': 2, 'GROUP BY': 3, 'HAVING': 4, 'ORDER BY': 6}
UNKNOWN_STR = "UNKNOWN"
PARANTHESIS_KEYWORDS = ['SUM', 'HAVING', 'MAX', 'AVG']

CORRECT_ORDER = ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY']


def check_if_sub_query_paranthesis(parsed_stmnt):
    is_sqp = False
    if parsed_stmnt.parent is not None:
        is_sqp = False if parsed_stmnt.parent.value.startswith(tuple(PARANTHESIS_KEYWORDS)) else True
    return is_sqp


def get_queries(parsed_stmnt):
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

        sub_stmnt_tokens = [get_queries(token) for token in
                            (parsed_stmnt if not (is_parenthesis and is_sub_query_paran) else parsed_stmnt[1:-1])]

        name_idx = 0
        sub_stmnt = ''.join(str(token[name_idx]) for token in sub_stmnt_tokens)
        sub_queries = [query for token, queries in sub_stmnt_tokens for query in queries]

        token_idx = 1 if is_parenthesis else 0
        if parsed_stmnt[token_idx].value == 'SELECT':
            sub_query_idx += 1
            return f'<subquery_{sub_query_idx}>', [sub_stmnt] + sub_queries
        return sub_stmnt, sub_queries

    return parsed_stmnt, []


class ClauseFinder(object):

    def __init__(self, query):
        self.query = query
        self.formatted_query = sqlparse.format(query, reindent=True, keyword_case='upper')

        # A dictionary with keyword and its corresponding clause statement
        #  in the query
        self.clauses = {}
        self.ordered_clauses = []

    def _find_clauses(self):
        """
        This function finds all the keywords and their statement except WHERE.
        Parses the query and updates the clauses dict.
        SELECT : SELECT CustomerId,FirstName,PhoneNumber
        FROM : FROM Customers
        ORDER BY : ORDER BY FirstName DESC, PhoneNumber DESC;
        WHERE : WHERE (FirstName LIKE "%a" OR LastName LIKE "b%") AND Phonenumber LIKE "217%"
        """
        clause_key = UNKNOWN_STR
        parse_obj = sqlparse.parse(self.formatted_query)[0]
        for token in parse_obj.tokens:
            if token.value != '\n':
                if token.is_keyword and token.value in CLAUSE_KEYWORDS:
                    clause_key = token.value
                    if token.value not in self.clauses:
                        self.clauses[clause_key] = clause_key
                else:
                    # Since the parser returns the data in a sequence, we assume
                    # that the clause key is followed by its statements.
                    self.clauses[clause_key] += token.value

    def _find_where_clause(self):
        """Finds the WHERE Keyword and its statement. If found, then it updates the clauses dictionary"""
        from_clause_stmnt = self.clauses['FROM']
        where_idx = from_clause_stmnt.find('WHERE')
        where_clause = ''
        # if where is found
        if where_idx != -1:
            where_clause = from_clause_stmnt[where_idx:]
            self.clauses['WHERE'] = where_clause
            # Remove the 'WHERE' clause from the 'FROM' Clause
            self.clauses['FROM'] = self.clauses['FROM'].replace(where_clause, '')

    def set_order_of_clauses(self):
        self.ordered_clauses = list(sorted(self.clauses.keys(), key=lambda s: CORRECT_ORDER.index(s)))


    def find_all_clauses(self):
        self._find_clauses()
        self._find_where_clause()

    def generate_clause_data(self, sub_id):
        all_clause_list = []
        for clause in self.clauses:
            clause_dict = {}
            clause_dict["executionOrder"] = self.ordered_clauses.index(clause) + 1
            clause_dict["submissionId"] = sub_id
            clause_dict["type"] = clause
            clause_dict["relativeExecutionTime"] = 0.5
            clause_dict["Depth"] = 1
            clause_dict["statement"] = self.clauses[clause]
            all_clause_list.append(clause_dict)
        return all_clause_list


if __name__ == '__main__':
    from rw_csv import dump_to_csv, get_submitted_queries_from_csv

    submissions = get_submitted_queries_from_csv('submissions_processed.csv')

    headers = ["executionOrder", "submissionId", "type", "relativeExecutionTime", "Depth", "statement"]
    dump_to_csv(data=[], headers=headers, csv_file='clauses.csv', mode='w')

    for idx, submitted_query in submissions:
        try:
            sub_query_idx = -1
            stmnt, queries = get_queries(sqlparse.parse(submitted_query)[0])
            for query in queries:
                # Find all the clauses for a query
                cf = ClauseFinder(query)
                cf.find_all_clauses()
                cf.set_order_of_clauses()

                clause_list = cf.generate_clause_data(idx)
                dump_to_csv(data=clause_list, csv_file='clauses.csv', mode='a', headers=headers)
                print(f"Successfully parsed the query with id: {idx}")
        except Exception as e:
            print(f"Failed to parse query at id: {idx}. Query: {submitted_query}")
