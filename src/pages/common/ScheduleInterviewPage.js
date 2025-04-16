import React, { Component } from "react";
import { AppBar, Container } from "@material-ui/core";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import ls from "local-storage";
import ScheduleInterviewComponent from "../../components/common/ScheduleInterviewComponent";
import ServiceConsumerMenu from "../../components/service_consumer/ServiceConsumerMenu";
import RecruiterMenu from "../../components/recruiter/RecruiterMenu";
import TraineeMenu from "../../components/trainee/TraineeMenu";

var jsonPayLoad = ls.get("jsonPayLoad");
class ScheduleInterviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div>
          <Header />
          {jsonPayLoad.primary_role=='SERVICE_CONSUMER' ?
            <ServiceConsumerMenu/>
            :
            ''
          }

         {jsonPayLoad.primary_role=='RECRUITER' ?
            <RecruiterMenu/>
            :
            ''
          }

        <ScheduleInterviewComponent />

        <Footer />
      </div>
    );
  }
}

export default ScheduleInterviewPage;