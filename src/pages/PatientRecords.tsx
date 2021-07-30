import React, { useRef } from "react";
import "../styles/image-gallery.css";
import styled, { createGlobalStyle } from "styled-components";
import { Column, TableOptions } from "../components/Table";
import ResultsTable from "../components/ResultsTable";
import {
  getPatientOutcomes,
  getPatient,
  getPatientMessages,
} from "../api/patientApi";
import { useQuery } from "react-query";
import auth from "../api/core/auth";
import { useParams } from "react-router-dom";
import { SMSTile, Texter } from "../components/SMSTile";
import AppointmentForm from "../components/AppointmentForm";

const PatientRecords: React.FC = () => {
  const patientName = useRef("");
  const id = useParams<{ id: string }>();

  const { data: patient, isLoading: loadingPatient } = useQuery(
    [id.id, { accessToken: auth.getAccessToken() }, "Patient Loading"],
    getPatient,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: outcomes, isLoading: loadingOutcomes } = useQuery(
    [id.id, { accessToken: auth.getAccessToken() }, "Outcomes Loading"],
    getPatientOutcomes,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: messages, isLoading: loadingMessages } = useQuery(
    [id.id, { accessToken: auth.getAccessToken() }, "Messages Loading"],
    getPatientMessages,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (!loadingMessages && messages) {
    for (const row of messages as any) {
      if (row.sender === "PATIENT") {
        row.type = Texter.PATIENT;
      } else if (row.sender === "COACH") {
        row.type = Texter.COACH;
      } else {
        row.type = Texter.BOT;
      }
    }
  }

  const loadHeader = (res: any) => {
    patientName.current = `${res.firstName} ${res.lastName}`;
    return (
      <Title>
        {res.firstName} {res.lastName}'s Patient Records
      </Title>
    );
  };

  return (
    <DashboardContainer>
      <GlobalStyle />
      <div className="columns">
        <div className="column">
          {loadingPatient && <div>Loading...</div>}
          {patient && loadHeader(patient)}
          <Subtitle>Weekly Reports, Measurements, and SMS Chat logs</Subtitle>
          <div style={{ marginBottom: "10px" }}>
            <AppointmentForm
              patientName={patientName.current}
              patientID={id.id}
            />
          </div>

          {loadingOutcomes && <div>Loading...</div>}
          {outcomes && (
            <ResultsTable
              options={table1Options}
              title=""
              data={outcomes as any}
              columns={cols}
            ></ResultsTable>
          )}
          {!loadingOutcomes && !outcomes && <p>No measuremnts found.</p>}
        </div>
        <div className="column">
          {loadingMessages && loadingPatient && <div>Loading...</div>}
          {messages && patient && (
            <SMSTile messages={messages as any} patient={patient as any}>
              {" "}
            </SMSTile>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};

// options for sorting the tables on the right
const table1Options: TableOptions = {
  sortOptions: [],
  sortsChoiceEnabled: false,
};

// columns for the right side of the page
const cols: Column[] = [
  {
    name: "Indicator",
    data: (row) => <React.Fragment>Blood Glucose</React.Fragment>,
    key: "indicator",
  },
  {
    name: "Measure",
    data: "value",
    key: "value",
  },
  {
    // need to create logic for the text color, possible do it down in activetext
    name: "Analysis",
    data: (row) =>
      classifyNumeric(row.value) === "Green" ? (
        <ActiveTextG>{classifyNumeric(row.value)}</ActiveTextG>
      ) : classifyNumeric(row.value) === "Yellow" ? (
        <ActiveTextY>{classifyNumeric(row.value)}</ActiveTextY>
      ) : classifyNumeric(row.value) === "Red" ? (
        <ActiveTextR>{classifyNumeric(row.value)}</ActiveTextR>
      ) : (
        <ActiveTextB>{classifyNumeric(row.value)}</ActiveTextB>
      ),
    key: "analysis",
  },
  {
    name: "Time Recorded",
    data: (row) => (
      <React.Fragment>{new Date(row.date).toString()}</React.Fragment>
    ),
    key: "date",
  },
];

// CSS for the page

const Title = styled.h1`
  font-family: Avenir;
  font-style: normal;
  font-weight: 800;
  font-size: 36px;
  line-height: 49px;

  color: #404040;
`;

const Subtitle = styled.p`
  font-family: Avenir;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 20px;

  color: #404040;

  padding: 30px 0;
`;

const DashboardContainer = styled.div`
  padding: 20px;
`;

const GlobalStyle = createGlobalStyle`
    body {
        background-color: #E5E5E5;
        padding-top: 20px !important;
    }
`;

const ActiveTextG = styled.p`
  color: #b4d983;
  font-weight: 800;
`;
const ActiveTextY = styled.p`
  color: #fbf36f;
  font-weight: 800;
`;
const ActiveTextR = styled.p`
  color: #c92c1a;
  font-weight: 800;
`;
const ActiveTextB = styled.p`
  color: #1f1e1d;
  font-weight: 800;
`;

function classifyNumeric(input: any) {
  var number = parseInt(input);
  if (number < 70) {
    return "Too Low";
  } else if (70 <= number && number <= 79) {
    return "<80";
  } else if (80 <= number && number <= 130) {
    return "Green";
  } else if (131 <= number && number <= 180) {
    return "Yellow";
  } else if (181 <= number && number <= 300) {
    return "Red";
  } else {
    return ">=301";
  }
}

export default PatientRecords;
