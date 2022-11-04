import csv
import json
import statistics

raw_data_json_path = 'data/raw_autolab.json'
raw_asgmts_json_path = 'data/raw_assignments.json'
midpoint_asgmt = 'tshlab'
output_path = 'data/output_algoA.json'
struggling_asgmt_threshold = 2
result = dict()

# Initialize output dictionary
def initialize_results(data):
    for stud in data:
        result[stud] = dict()
        result[stud]["isStruggling"] = 0
        result[stud]["rationale"] = []

# Convert json file to dictionary {id: {data: value}} and convert string ints to ints
def preprocess_data(json_file_path):
    data = dict()

    with open(json_file_path) as json_file:
        data_arr = json.load(json_file)
        for row in data_arr:
            key = row['IDNumber']
            row.pop('IDNumber')

            # Convert strings of digits to digits
            for col in row:
                if row[col].isdigit():
                    row[col] = float(row[col])

            row["Lab Average"] = float(row["Lab Average"])
            data[int(key)] = row

    return data

# Convert assignments JSON file to array
def asgmts_json_to_arr(json_file_path):
    with open(json_file_path) as json_file:
        return json.load(json_file)

# Find the students that scored two stdevs below the median on given asgmt
def find_struggling_students_for_asgmt(asgmt, data):
    # Calculate stdev and med
    grades = []
    for stud in data:
        grade = data[stud][asgmt]
        if (grade != 'not_submitted'):
            grades.append(float(data[stud][asgmt]))
    stdev = statistics.stdev(grades)
    med = statistics.median(grades)

    # Compare each student to stdev and med
    for stud in data:
        grade = data[stud][asgmt]
        if (grade == "not_submitted"):
            result[stud]["rationale"].append(
                {
                    "assignment_name": asgmt,
                    "stdevs_below": "not_submitted",
                    "grade": grade
                })
        elif (isinstance(grade, float) and grade < med - 2 * stdev):
            result[stud]["rationale"].append(
                {
                    "assignment_name": asgmt,
                    "stdevs_below": round((med - grade) / stdev),
                    "grade": grade
                })

def algorithm2():
    data = preprocess_data(raw_data_json_path)
    asgmts = asgmts_json_to_arr(raw_asgmts_json_path)

    initialize_results(data)

    # Find struggling students for each assignment
    for asgmt in asgmts:
        asgmt_name = asgmt['assignment_name']
        if asgmt_name == midpoint_asgmt:
            break
        find_struggling_students_for_asgmt(asgmt_name, data)

    # Label isStruggling
    for stud in result:
        asgmts = len(result[stud]["rationale"])
        if asgmts == 0:
            result[stud]["isStruggling"] = 1
        elif 1 <= asgmts < struggling_asgmt_threshold:
            result[stud]["isStruggling"] = 0
        else:
            result[stud]["isStruggling"] = -1

    # Turn result dict to output JSON file
    with open(output_path, "w") as outfile:
        json.dump(result, outfile, indent=4)

algorithm2()
