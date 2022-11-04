import "./App.css";
import * as React from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";

import AlgorithmA from "./AlgorithmA";
import AlgorithmB from "./AlgorithmB";
import StudentData from "./StudentData";

// algorithm inputs
import algoAdata from "./data/output_algoA.json";
import algoBdata from "./data/sample_algoB.json";

// raw data
import grades from "./data/raw_autolab.json";
import oh from "./data/raw_oh.json";
import assignment from "./data/raw_assignments.json";

import { std } from "mathjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
};

const convertToIDNumberDict = (data) => {
  let dict = {};
  data.forEach((student) => {
    dict[student.IDNumber] = student;
  });
  return dict;
};

const convertToIDNumberDictOH = (data) => {
  let dict = {};
  data.forEach((student) => {
    if (!(student.IDNumber in dict)) {
      dict[student.IDNumber] = [];
    }
    dict[student.IDNumber].push(student);
  });
  return dict;
};

const convertToAssignmentDict = (data) => {
  let dict = {};
  data.forEach((assignment) => {
    dict[assignment.assignment_name] = assignment;
  });
  return dict;
};

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const getStatistics = (assignmentDict, grades) => {
  for (const [key, value] of Object.entries(assignmentDict)) {
    assignmentDict[key]["stats"] = {
      scores: [],
      average: 0,
      stddev: 0,
      min: 0,
      max: 0,
    };
  }

  grades.forEach((grade) => {
    for (const [key, value] of Object.entries(assignmentDict)) {
      if (grade[key] !== "not_submitted") {
        const score = grade[key] === "not_submitted" ? 0 : Number(grade[key]);
        value["stats"]["scores"].push(score);
      }
    }
  });

  for (const [key, _] of Object.entries(assignmentDict)) {
    assignmentDict[key]["stats"]["average"] = average(
      assignmentDict[key]["stats"]["scores"]
    );
    assignmentDict[key]["stats"]["stddev"] = std(
      assignmentDict[key]["stats"]["scores"]
    );
    assignmentDict[key]["stats"]["min"] = Math.min(
      ...assignmentDict[key]["stats"]["scores"]
    );
    assignmentDict[key]["stats"]["max"] = Math.max(
      ...assignmentDict[key]["stats"]["scores"]
    );
    delete assignmentDict[key]["stats"]["scores"];
  }
  return assignmentDict;
};

export const MAPTOSTATUS = {
  "-1": "Needs Help",
  0: "Maybe",
  1: "Okay",
};

export const MAPTOCOLOR = {
  "-1": "red",
  0: "orange",
  1: "black",
};

function App() {
  const [open, setOpen] = React.useState(false);
  const [student, setStudent] = React.useState(null);
  const handleOpen = (id) => {
    setStudent(id);
    setOpen(true);
  };
  const handleClose = (id) => {
    setStudent(null);
    setOpen(false);
  };

  console.log(algoAdata);
  console.log(algoBdata);

  const gradesDict = convertToIDNumberDict(grades);
  const ohDict = convertToIDNumberDictOH(oh);
  const assignmentDict = getStatistics(
    convertToAssignmentDict(assignment),
    grades
  );

  // console.log(gradesDict);
  // console.log(ohDict);
  // console.log(assignmentDict);

  // -1 is Needs help
  // 0 is Maybe
  // 1 is Good

  const rows = [];

  Object.keys(gradesDict).forEach(function (key) {
    rows.push({
      id: key,
      algoA: key in algoAdata ? algoAdata[key].isStruggling : null,
      algoB: key in algoBdata ? algoBdata[key].isStruggling : null,
    });
  });

  return (
    <div className="App">
      <CssBaseline />
      <header className="App-header">
        <Container maxWidth="lg">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Student ID</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Algorithm A</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Algorithm B</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    style={{ cursor: "pointer", backgroundColor: "white" }}
                    onClick={() => handleOpen(row.id)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "lightgrey")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ color: MAPTOCOLOR[row.algoA] }}
                    >
                      {MAPTOSTATUS[row.algoA]}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ color: MAPTOCOLOR[row.algoB] }}
                    >
                      {MAPTOSTATUS[row.algoB]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Container maxWidth="xl" style={style}>
            <Grid container>
              <Grid item xs={4}>
                <StudentData
                  studentID={student}
                  grades={gradesDict[student]}
                  oh={ohDict[student]}
                  stats={assignmentDict}
                />
              </Grid>
              <Grid item xs={4}>
                <AlgorithmA
                  studentID={student}
                  isStruggling={algoAdata[student]?.isStruggling}
                  rationale={algoAdata[student]?.rationale}
                />
              </Grid>
              <Grid item xs={4}>
                <AlgorithmB
                  studentID={student}
                  isStruggling={algoBdata[student]?.isStruggling}
                  rationale={algoBdata[student]?.rationale}
                />
              </Grid>
            </Grid>
          </Container>
        </Modal>
      </header>
    </div>
  );
}

export default App;
