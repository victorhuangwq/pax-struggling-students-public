import React from "react";
import Card from "@mui/material/Card";
import { CardContent } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import raw_autolab from "./data/raw_autolab.json";
import { MAPTOSTATUS, MAPTOCOLOR } from "./App";

import bellCurve from "highcharts/modules/histogram-bellcurve"; // module
bellCurve(Highcharts); // init module

class BellCurve extends React.Component {
  constructor(props) {
    // access data through props.data
    super(props);

    this.state = {
      config: {
        title: {
          text: null,
        },

        legend: {
          enabled: false,
        },

        xAxis: [
          {
            title: {
              text: "Score",
            },
            labels: { style: { color: "rgba(0,0,0,0.8)", fontSize: "12px" } },
            visible: true,
          },
          {
            title: {
              text: "Bell curve",
            },
            opposite: true,
            visible: true,
            plotLines: [
              {
                width: 1,
                axis: "x",
                markerType: "PLOTLINE",
                startValue: props.grade,
                color: "red",
                visible: true,
                value: props.grade,
              },
            ],
          },
        ],

        yAxis: [
          {
            title: {
              text: "Data",
            },
            visible: false,
          },
          {
            title: {
              text: "Bell curve",
            },
            opposite: true,
            visible: false,
          },
        ],

        series: [
          {
            name: "Bell curve",
            type: "bellcurve",
            xAxis: 1,
            yAxis: 1,
            intervals: 4,
            baseSeries: 1,
            zIndex: -1,
            marker: {
              enabled: true,
            },
          },
          {
            name: "Data",
            type: "scatter",
            data: props.data,
            visible: false,
            marker: {
              radius: 1.5,
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <HighchartsReact
        constructorType={"chart"}
        ref={this.chartComponent}
        highcharts={Highcharts}
        options={this.state.config}
      />
    );
  }
}

// Get int array of all the scores on this assignment
function getData(assignment_name, studentID) {
  console.log(assignment_name);
  let submitted = raw_autolab.filter(
    (stud) => stud[assignment_name] !== "not_submitted"
  );
  let u = submitted.map((stud) => {
    if (stud["IDNumber"] === studentID) {
      return {
        y: parseInt(stud[assignment_name]),
        color: "red",
      };
    } else {
      return parseInt(stud[assignment_name]);
    }
  });
  console.log(u);
  return u;
}

function AlgorithmA({ studentID, isStruggling, rationale }) {
  return (
    <div style={{ height: "95vh", overflow: "auto", padding: "0vw 1.5vw" }}>
      <h1>Algorithm A</h1>
      <h2>Student {studentID}</h2>
      <h3 style={{ color: MAPTOCOLOR[isStruggling] }}>
        {MAPTOSTATUS[isStruggling]}
      </h3>
      <p>
        The algorithm identified that the student is struggling* on{" "}
        {rationale.length} assignment(s).
      </p>
      <p style={{ fontSize: "0.75em" }}>
        * A student is deemed to be struggling on an assignment when they score
        lower than 2 standard deviations than the median score across the class.
      </p>
      <p>
        <b>Student is struggling on...</b>
      </p>
      <>
        {rationale.map(({ assignment_name, stdevs_below, grade }, index) => {
          if (stdevs_below === "not_submitted") {
            return (
              <Card
                variant="outlined"
                style={{ marginBottom: "7px" }}
                key={`${assignment_name}-${index}`}
              >
                <CardContent>
                  <b>{assignment_name}</b>
                  <p>The student did not submit this assignment.</p>
                </CardContent>
              </Card>
            );
          }
          let data = getData(assignment_name, studentID);
          return (
            <Card
              variant="outlined"
              style={{ marginBottom: "7px" }}
              key={`${assignment_name}-${index}`}
            >
              <CardContent>
                <b>{assignment_name}</b>
                <p>
                  The student scored {stdevs_below} standard deviations below
                  the median score across the class.
                </p>
                <BellCurve data={data} grade={grade} />
              </CardContent>
            </Card>
          );
        })}
      </>
    </div>
  );
}

export default AlgorithmA;
