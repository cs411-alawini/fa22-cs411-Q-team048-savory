import sqlparse

CLAUSE_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING']
UNKNOWN_STR = "UNKNOWN"


class ClauseFinder(object):

    def __init__(self, query):
        self.query = query
        self.formatted_query = sqlparse.format(query, reindent=True, keyword_case='upper')

        # A dictionary with keyword and its corresponding clause statement
        #  in the query
        self.clauses = {}

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

    def find_all_clauses(self):
        self._find_clauses()
        self._find_where_clause()

    @staticmethod
    def generate_clause_data(clause_data):
        all_clause_list = []
        for clause in clause_data:
            clause_dict = {}
            clause_dict["executionOrder"] = 1
            clause_dict["submissionId"] = 1
            clause_dict["type"] = clause
            clause_dict["relativeExecutionTime"] = 0.5
            clause_dict["Depth"] = 1
            clause_dict["statement"] = clause_data[clause]
            all_clause_list.append(clause_dict)
        return all_clause_list


if __name__ == '__main__':
    from queries import query
    from rw_csv import dump_to_csv

    # Find all the clauses for a query
    cf = ClauseFinder(query)
    cf.find_all_clauses()

    clause_list = ClauseFinder.generate_clause_data(cf.clauses)
    headers = ["executionOrder", "submissionId", "type", "relativeExecutionTime", "Depth", "statement"]
    dump_to_csv(headers, clause_list, 'clauses.csv')

