import csv


def get_submitted_queries_from_csv(csv_file_path):
    submitted_queries = []
    with open(csv_file_path, newline='') as csvfile:
        submission_info = csv.reader(csvfile, delimiter=',')
        for row in submission_info:
            submitted_queries.append(row[2])
    # Remove the header info
    return submitted_queries[1:]


def dump_to_csv(headers, data, csv_file):
    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)
