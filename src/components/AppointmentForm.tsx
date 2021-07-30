import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import styled from "styled-components";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import secureAxios from "../api/core/apiClient";
import ICoach from "../interfaces/coach";
import { AddPatientHeader } from "./AddPatientForm";

const FormContainer = styled.div`
  box-shadow: 5px 5px 10px rgba(221, 225, 231, 0.5);
  padding: 30px;
  background-color: white;
  text-align: center;
  margin: auto;
  border-radius: 20px;
`;

const initialValues = {
  appointmentCoachName: "",
  scheduledFor: "",
};

const AppointmentForm = ({
  patientName,
  patientID,
}: {
  patientName: string;
  patientID: string;
}) => {
  const [coachDropdown, setCoachDropdown] = useState([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setError] = useState(false);
  const [appointmentCoachID, setAppointmentCoachID] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await secureAxios.post("/api/appointments/", {
        patientID,
        scheduledFor,
        appointmentCoachID,
      });
      setMessage(
        `Schedule for ${patientName} at ${scheduledFor.toLocaleString()} added successfully`
      );
      setError(false);
    } catch (e) {
      const error = (e as Error).message;
      if (error === "Request failed with status code 400") {
        setMessage("Missing data in form");
      } else {
        setMessage(error);
      }
      setError(true);
    }
  };

  useEffect(() => {
    const getCoachesDropdown = async () => {
      const query = " ";
      const coachesData = await secureAxios.get("/api/coaches/search", {
        params: {
          query,
        },
      });
      if (coachesData.data.coaches) {
        setCoachDropdown(coachesData.data.coaches);
      }
    };

    getCoachesDropdown();
  }, []);

  return (
    <FormContainer>
      <AddPatientHeader>
        Schedule an appointment with {patientName}
      </AddPatientHeader>
      <p>Please enter appointment information below</p>
      {message != null && (
        <p style={{ color: isError ? "red" : "#637792" }}>{message}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label style={{ marginTop: "10px", marginBottom: "-4px" }}>
                Coach name
              </Form.Label>
              <Form.Control
                list="select-coach-name"
                id="appointmentCoachName"
                name="appointmentCoachName"
                type="text"
                style={{ width: "70%", textAlign: "center", margin: "auto" }}
                onChange={(e) => {
                  coachDropdown.forEach((coach: ICoach) => {
                    if (coach?.name === e.target.value) {
                      setAppointmentCoachID(coach._id);
                    }
                  });
                }}
              />
              <datalist id="select-coach-name">
                {coachDropdown.map((coach: ICoach, index: number) => (
                  <option value={`${coach?.name}`} key={index} />
                ))}
              </datalist>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label style={{ marginTop: "15px", marginBottom: "-4px" }}>
                Appointment date
              </Form.Label>
              <Form.Control
                type="datetime-local"
                id="scheduledFor-id"
                name="scheduledFor"
                className="form-field"
                onChange={(e) => {
                  setScheduledFor(e.target.value);
                }}
                style={{
                  width: "50%",
                  textAlign: "center",
                  margin: "auto",
                  marginBottom: "10px",
                }}
              />
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            type="submit"
            style={{
              backgroundColor: "#f29da4",
              border: "solid",
              borderRadius: "15px",
            }}
          >
            Create Appointment
          </Button>
        </Form>
      </Formik>
    </FormContainer>
  );
};

export default AppointmentForm;
