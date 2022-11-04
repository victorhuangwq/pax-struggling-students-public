import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "Name", width: 120 },
  { field: "score", headerName: "Score", width: 70 },
  { field: "classMax", headerName: "Max", width: 70 },
  { field: "classAverage", headerName: "Average", width: 70 },
  { field: "classStddev", headerName: "Std Dev", width: 100 },
];

const oh_columns = [
  { field: "name", headerName: "Assignment", width: 120 },
  { field: "questions", headerName: "Questions", width: 500 },
];

function StudentData({ studentID, grades, oh, stats }) {
  console.log("OH data");
  console.log(oh);
  console.log(stats);
  const due_at_to_assignment = [];

  for (const [key, value] of Object.entries(stats)) {
    due_at_to_assignment.push({ id: key, due_at: Date.parse(value["due_at"]) });
  }

  due_at_to_assignment.sort((a, b) => (a.due_at > b.due_at ? 1 : -1));

  console.log(due_at_to_assignment);

  const assignment_to_questions = [];

  let i = 0;

  if (oh != null) {
    oh = oh.sort((a, b) =>
      Date.parse(a["Timstamp"]) > Date.parse(b["Timstamp"]) ? 1 : -1
    );
    let id = 0;

    oh.forEach((instance) => {
      while (
        i < 7 &&
        Date.parse(instance["Timstamp"]) > due_at_to_assignment[i]["due_at"]
      ) {
        i++;
      }
      if (instance["Action"] === "ADD" && i < 7) {
        assignment_to_questions.push({
          id,
          name: due_at_to_assignment[i]?.id ?? "After tshlab",
          questions: instance["Reason"],
          time: Date.parse(instance["Timstamp"]),
        });
        id++;
      }
    });
  }
  console.log(assignment_to_questions);

  let rows = [];
  for (const [key, value] of Object.entries(stats)) {
    rows.push({
      id: key,
      score: grades[key],
      classMax: value["stats"]["max"].toFixed(0),
      classAverage: value["stats"]["average"].toFixed(2),
      classStddev: value["stats"]["stddev"].toFixed(2),
    });
  }
  rows = rows.slice(0, 7);

  return (
    <div>
      <h4>Assignment Grades </h4>
      <div style={{ height: 350, width: "95%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          density="compact"
        />
      </div>
      <h4> OH Questions </h4>
      <div style={{ height: 350, width: "95%" }}>
        <DataGrid
          rows={assignment_to_questions}
          columns={oh_columns}
          pageSize={10}
          density="compact"
        />
      </div>
    </div>
  );
}

export default StudentData;
