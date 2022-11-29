import sqlparse

CLAUSE_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING']
EXECUTION_ORDER = {'SELECT': 5, 'FROM': 1, 'WHERE': 2, 'GROUP BY': 3, 'HAVING': 4, 'ORDER BY': 6}
UNKNOWN_STR = "UNKNOWN"
PARANTHESIS_KEYWORDS = ['SUM', 'HAVING', 'MAX', 'AVG']

CORRECT_ORDER = ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY']


class ClauseFinder(object):

    def __init__(self, query):
        self.query = query
        self.formatted_query = sqlparse.format(query, reindent=True, keyword_case='upper')

        # A dictionary with keyword and its corresponding clause statement
        #  in the query
        self.clauses = {}
        self.ordered_clauses = []
        self.clauses_list = []
        self.iqs_dict = {}

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
                    # To add a space before the Keywords like JOIN, RIGHT JOIN etc
                    if token.is_keyword:
                        self.clauses[clause_key] += ' ' + token.value
                    else:
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

    def set_order_of_clauses(self, cnt):
        self.ordered_clauses = list(sorted(self.clauses.keys(), key=lambda s: CORRECT_ORDER.index(s)))
        self.offset = cnt

    def find_all_clauses(self):
        self._find_clauses()
        self._find_where_clause()

    def generate_clause_data(self):
        all_clause_list = []
        for clause in self.clauses:
            clause_dict = {}
            clause_dict["executionOrder"] = self.ordered_clauses.index(clause) + 1 + self.offset
            # remove this
            # clause_dict["submissionId"] = sub_id
            clause_dict["type"] = clause
            clause_dict["relativeExecutionTime"] = 0.5
            clause_dict["Depth"] = 1
            clause_dict["statement"] = self.clauses[clause]
            all_clause_list.append(clause_dict)
        self.clauses_list = all_clause_list
        return all_clause_list

    def remove_additional_semicolon(self):
        # If more than 1 semicolon exists remove 2nd
        for (k,v) in self.iqs_dict.items():
            if ';' in v:
                self.iqs_dict[k] = v[:v.find(';')+1]
                #self.iqs_dict[k] = self.iqs_dict[k][:-1] + " LIMIT 10" + ";"

    def get_intermediate_queries(self):
        iqs = []
        self.iqs_dict = {}

        iq_1 = "SELECT * " + cf.clauses['FROM']
        self.iqs_dict["FROM"] = iq_1 + ";"
        iqs.append(iq_1)
        if "WHERE" in cf.clauses:
            iq_2 = iqs[-1] + " " + cf.clauses["WHERE"]
            iqs.append(iq_2)
            self.iqs_dict["WHERE"] = iq_2 + ";"

        if "GROUP BY" in cf.clauses:
            iq_3 = cf.clauses["SELECT"] + " " + iqs[-1].split("SELECT * ")[1] + " " + cf.clauses["GROUP BY"]
            iqs.append(iq_3)
            self.iqs_dict["GROUP BY"] = iq_3 + ";"

        if "HAVING" in cf.clauses:
            iq_4 = iqs[-1] + " " + cf.clauses["HAVING"]
            iqs.append(iq_4)
            self.iqs_dict["HAVING"] = iq_4 + ";"

        if "SELECT" in cf.clauses:
            # Case where there is no group by or having and select is not yet executed
            if "*" in iqs[-1]:
                iq_5 = cf.clauses["SELECT"] + " " + iqs[-1].split("SELECT * ")[1]
                iqs.append(iq_5)
            else:
                iq_5 = iqs[-1]
            self.iqs_dict["SELECT"] = iq_5

        if "ORDER BY" in cf.clauses:
            iq_6 = iqs[-1] + " " + cf.clauses["ORDER BY"]
            iqs.append(iq_6)
            self.iqs_dict["ORDER BY"] = iq_6 + ";"
        
        self.remove_additional_semicolon()

if __name__ == '__main__':
    #submitted_query = "SELECT c.CRN, Title FROM Students s RIGHT JOIN Enrollments e ON s.NetId = e.NetId JOIN Courses c ON e.CRN = c.CRN WHERE c.CRN BETWEEN 333 AND 602 AND c.Title NOT LIKE '%I' AND c.Title LIKE '%Data%' ORDER By e.Score ASC, s.LastName DESC"
    import sys
    import json
    submitted_query = sys.argv[1]
    #print("Query:", submitted_query)
    sub_query_idx = -1
    cnt = 0

    # Find all the clauses for a query
    cf = ClauseFinder(submitted_query)
    cf.find_all_clauses()
    cf.set_order_of_clauses(cnt)
    cnt += len(cf.ordered_clauses)

    cf.get_intermediate_queries()
    cf.generate_clause_data()

    for i, clause in enumerate(cf.clauses_list):
        if clause["type"] == "SELECT":
            if "SELECT" not in cf.iqs_dict:
                clause["iq"] = cf.iqs_dict["GROUP BY"]
            else:
                clause["iq"] = cf.iqs_dict["SELECT"]
        if clause["type"] == "GROUP BY":
            clause["iq"] = cf.iqs_dict["GROUP BY"]
        if clause["type"] == "WHERE":
            clause["iq"] = cf.iqs_dict["WHERE"]
        if clause["type"] == "HAVING":
            clause["iq"] = cf.iqs_dict["HAVING"]
        if clause["type"] == "ORDER BY":
            clause["iq"] = cf.iqs_dict["ORDER BY"]
        if clause["type"] == "FROM":
            clause["iq"] = cf.iqs_dict["FROM"]
        cf.clauses_list[i] = clause

    result = {
        "pretty_print": cf.formatted_query,
        "clauses": cf.clauses_list
    }

    print(json.dumps(result))
    sys.stdout.flush()