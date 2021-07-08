const getPatientStatus = (data: any) => {
  if (data.enabled) {
    if (data.outreach.complete) {
      return `Enrolled ✅`;
    } else {
      if (!data.outreach.outreach) {
        return `Not Sent 💤`;
      } else {
        if (data.outreach.yes) {
          return `Yes ❗️`;
        } else {
          return `No Response 🔴`;
        }
      }
    }
  } else {
    return "Disabled";
  }
};

export default getPatientStatus;
