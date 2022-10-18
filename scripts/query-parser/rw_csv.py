import csv


def get_submitted_queries_from_csv(csv_file_path):
    submitted_queries = []
    submitted_query_col = 6
    submission_id_col = 0
    with open(csv_file_path, newline='') as csvfile:
        submission_info = csv.reader(csvfile, delimiter=',')
        for row in submission_info:
            submitted_queries.append((row[submission_id_col], row[submitted_query_col]))
    # Remove the header info
    return submitted_queries[1:]


def dump_to_csv(data, csv_file, headers=None, mode='w'):
    if headers is None:
        headers = []

    with open(csv_file, mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        if mode == 'w':
            writer.writeheader()
        writer.writerows(data)
