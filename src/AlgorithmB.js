import { MAPTOSTATUS, MAPTOCOLOR } from "./App";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function AlgorithmB({ studentID, isStruggling, rationale }) {
  const {
    struggling,
    maybe,
    grades,
    stats,
    within_avg,
    recent,
    upward_trend,
    malloc_upward,
  } = rationale;
  const data = stats.mean.map((entry, index) => {
    const { assignment, grade } = entry;
    const studentGrade = grades[index].grade;

    return {
      x: index,
      Student: (Math.abs(studentGrade) * 100).toFixed(2),
      "Class Average": (Math.abs(grade) * 100).toFixed(2),
      assignment,
    };
  });

  const listify = (arr) => {
    if (arr.length === 1) {
      return arr[0];
    } else if (arr.length === 2) {
      return `${arr[0]} and ${arr[1]}`;
    } else {
      const lastEle = arr[arr.length - 1];
      return arr.slice(0, arr.length - 1).join(", ") + ", and " + lastEle;
    }
  };

  const generateRationale = () => {
    // doing very well
    if (
      isStruggling === 1 &&
      struggling.length === 0 &&
      maybe.length === 0 &&
      within_avg
    ) {
      return "The student is currently performing okay in the course overall. The algorithm identified no assignments that the student may be struggling on.";
    } else if (
      isStruggling === 0 &&
      struggling.length > 0 &&
      !within_avg &&
      upward_trend
    ) {
      return `The student struggled quite a bit early on with ${listify(
        [...struggling, ...maybe].map(({ assignment }) => assignment)
      )}, but the student's grades have shown an upward trend with more recent assignments.`;
    } else if (isStruggling === 1 && within_avg && !recent) {
      return `The student struggled a bit on ${listify(
        [...struggling, ...maybe].map(({ assignment }) => assignment)
      )}, but the student is now back on track and is currently performing okay in the course overall. `;
    } else if (isStruggling === 0 && within_avg && recent) {
      return `The student is currently performing okay in the course overall. However, the algorithm has identified that the student's grades have recently dipped. You may want to check in on the student's knowledge on ${listify(
        [...struggling, ...maybe].map(({ assignment }) => assignment)
      )}.`;
    } else if (isStruggling === 0 && maybe.length > 0 && !within_avg) {
      return `The algorithm has identified that the student might be struggling* on ${listify(
        maybe.map(({ assignment }) => assignment)
      )}.`;
    } else if (isStruggling === -1 && struggling.length > 0 && !within_avg) {
      return `The algorithm has identified that the student is struggling* on ${listify(
        struggling.map(({ assignment }) => assignment)
      )}${
        maybe.length > 0
          ? ` and might** be struggling on ${listify(
              maybe.map(({ assignment }) => assignment)
            )}`
          : ""
      }.`;
    } else if (isStruggling === 0 && malloc_upward) {
      return `The student struggled quite a bit with ${listify(
        [...struggling, ...maybe].map(({ assignment }) => assignment)
      )}, but the student's grades have improved with malloclab.`;
    } else {
      return `The algorithm identified that the student is struggling* on ${
        struggling.length
      } assignment(s)
      ${
        struggling.length === 0 && maybe.length > 0
          ? ` and might** be struggling on ${maybe.length} assignment(s).`
          : ""
      }`;
    }
  };

  // console.log(rationale);
  return (
    <div style={{ height: "95vh", overflow: "auto", padding: "0vw 1.5vw" }}>
      <h1>Algorithm B</h1>
      <h2>Student {studentID}</h2>
      <h3 style={{ color: MAPTOCOLOR[isStruggling] }}>
        {MAPTOSTATUS[isStruggling]}
      </h3>
      <p>{generateRationale()}</p>
      <h3>Student's Cumulative Grade Progression</h3>
      <LineChart data={data} width={450} height={400}>
        <CartesianGrid />
        <XAxis dataKey="x" />
        <YAxis yAxisId="left-axis" />
        <Line
          yAxisId="left-axis"
          type="dashed"
          dataKey="Student"
          stroke="blue"
        />
        <Line
          yAxisId="left-axis"
          type="dashed"
          dataKey="Class Average"
          stroke="darkblue"
        />
        <Tooltip labelFormatter={(d) => grades[d].assignment} />
      </LineChart>
      {struggling.length > 0 && (
        <>
          <h3>Student is struggling on...</h3>
          {struggling.map(
            ({ assignment, grade, change, drop, avg_grade_change }) => {
              return (
                <Card variant="outlined" style={{ marginBottom: "7px" }}>
                  <CardContent>
                    <b>{assignment.toUpperCase()}</b>
                    <br />
                    <p>
                      Student's cumulative grade dropped{" "}
                      {(Math.abs(change) * 100).toFixed(2)}% after this
                      assignment, leading to a new grade of{" "}
                      {(Math.abs(grade) * 100).toFixed(2)}
                      %. This drop is {Math.abs(drop).toFixed(2)} times the
                      class's average grade drop of{" "}
                      {(Math.abs(avg_grade_change) * 100).toFixed(2)}% on this
                      assignment.
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </>
      )}
      {maybe.length > 0 && (
        <>
          <h3>Student might be struggling on...</h3>
          {maybe.map(
            ({ assignment, grade, change, drop, avg_grade_change }) => {
              return (
                <Card variant="outlined" style={{ marginBottom: "7px" }}>
                  <CardContent>
                    <b>{assignment.toUpperCase()}</b>
                    <br />
                    <p>
                      Student's cumulative grade dropped{" "}
                      {(Math.abs(change) * 100).toFixed(2)}% after this
                      assignment, leading to a new grade of{" "}
                      {(Math.abs(grade) * 100).toFixed(2)}%. This drop is{" "}
                      {Math.abs(drop).toFixed(2)} times the class's average
                      grade drop of{" "}
                      {(Math.abs(avg_grade_change) * 100).toFixed(2)}% on this
                      assignment.
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </>
      )}
      <p style={{ fontSize: "0.75em" }}>
        * A student is deemed to be struggling on an assignment when the
        assignment produces a grade drop greater than half a letter grade and
        when the grade drop is at least 5x greater than the average class-wide
        grade drop produced by this assignment.
      </p>
      <p style={{ fontSize: "0.75em" }}>
        ** A student might be struggling on an assignment when the assignment
        produces a grade drop greater than half a letter grade, but the grade
        drop is within 5x the average class-wide grade drop produced by this
        assignment.
      </p>
    </div>
  );
}

export default AlgorithmB;
