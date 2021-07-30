import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import secureAxios from "../api/core/apiClient";
import ICoach from "../interfaces/coach";

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

  const handleSubmit = async (data: any, { resetForm }: any) => {
    const selectedCoach: ICoach[] = coachDropdown.filter((coach: ICoach) => {
      return coach?.name === data.appointmentCoachName;
    });

    const appointmentCoachID = selectedCoach[0]?._id;
    try {
      await secureAxios.post("/api/appointments/", {
        patientID,
        scheduledFor: data.scheduledFor,
        appointmentCoachID,
      });
      setMessage(
        `Schedule for ${patientName} at ${data.scheduledFor.toLocaleString()} added successfully`
      );
      setError(false);
      resetForm();
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
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
      <p style={{ fontWeight: "bold", fontSize: "22px" }}>
        Schedule an appointment
      </p>

      <p>Please enter appointment information below</p>
      {message != null && (
        <p style={{ color: isError ? "red" : "#637792" }}>{message}</p>
      )}
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Coach name</Form.Label>
                <Field
                  className="form-control"
                  list="select-coach-name"
                  id="appointmentCoachName"
                  name="appointmentCoachName"
                  type="text"
                  required
                />
                <datalist id="select-coach-name">
                  {coachDropdown.map((coach: ICoach, index: number) => (
                    <option value={`${coach?.name}`} key={index} />
                  ))}
                </datalist>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Appointment date</Form.Label>
                <Field
                  className="form-control"
                  type="datetime-local"
                  id="scheduledFor-id"
                  name="scheduledFor"
                  required
                />
              </Form.Group>
            </Row>
            <Button type="submit">Create Appointment</Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AppointmentForm;
