import React, { Component } from "react";
import "./SearchTrainingComponent.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import axios from "axios";
import ls from "local-storage";
import { Button } from "reactstrap";
import { endpoints_properties } from "../../properties/EndPointsProperties";
import { api_properties } from "../../properties/APIProperties";
import { DateTimePicker } from "@syncfusion/ej2-calendars";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  PopupOpenEventArgs,
  ActionEventArgs,
  EventRenderedArgs,
  Resize,
  DragAndDrop,
  Inject,
  TimelineViews,
} from "@syncfusion/ej2-react-schedule";
import { extend } from "@syncfusion/ej2-base";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Calendar from "react-calendar";
import Moment from "moment";
import ShowMoreText from "react-show-more-text";
import { Form } from "react-bootstrap";

var token = ls.get("token");
var jsonPayLoad = ls.get("jsonPayLoad");
var userPersonalDetails = ls.get("userPersonalDetails");

class ScheduleInterviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interviewTitle: "",
      interviewType: "",
      coordinatorName: "",
      coordinatorCountryCode: "",
      coordinatorConatct: "",
      coordinatorEmail: "",
      user: [],
      interviewerDetails: [],
      interviewerName: "",
      interviewerCountryCode: "",
      interviewerConatct: "",
      interviewerEmail: "",
      candidateDetails: [],
      candidateName: [],
      candidateCountryCode: "",
      candidateConatct: "",
      candidateEmail: "",
      when: "",
      from: "",
      to: "",
      zone: "",
      zoneId: "",
      interviewLocation: "",
      interviewMeetingLink: "",
      interviewDescription: "",
      ScheduleInterviewSuccessMessage: "",
      ScheduleInterviewErrorMessage: "",
      scheduleInterviewTimeZones: [],
      scheduleInterviewTimeZonesName: [],
      scheduleInterviewCities: [],
      scheduleInterviewCitiesName: [],
      scheduleInterviewTitles: [],
      scheduleInterviewTitlesName: [],
      validated: false,
      titleError: "",
      interviewTypeError: "",
      coordinatorNameError: "",
      coordinatorEmailError: "",
      coordinatorContactError: "",
      coordinatorContactNumberError: "",
      coordinatorCodeError: "",
      interviewerNameError: "",
      interviewerEmailError: "",
      interviewerContactError: "",
      interviewerContactNumberError: "",
      interviewerCodeError: "",
      candidateNameError: "",
      candidateEmailError: "",
      candidateContactError: "",
      candidateContactNumberError: "",
      candidateCodeError: "",
      whenError: "",
      fromError: "",
      toError: "",
      zoneError: "",
      meetingError: "",
      locationError: "",
    };

    this.localData = [
      {
        Id: "1",
        Subject: "John",
        StartTime: new Date(2021, 10, 20, 6, 0),
        EndTime: new Date(2021, 10, 20, 7, 0),
      },
    ];
  }

  componentDidMount() {
    console.log(userPersonalDetails);
    //Interviewer's and Candidate's
    axios
      .get(
        endpoints_properties.ENDPOINT_IDENTITY_LOCAL +
          api_properties.API_GET_ACTIVE_USER,
        { headers: { Auth_Token: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data);

        res.data.forEach((details) => {
          if (
            details.gts_role_name == "SERVICE_CONSUMER" &&
            details.gts_user_email_is_validated &&
            details.gts_primary_contact_is_validated
          ) {
            this.state.interviewerDetails.push({
              user_id: details.gts_user_id,
              user_name: details.gts_user_name,
              user_email: details.gts_user_email,
              user_contact: details.gts_primary_contact_number,
              user_email_validated: details.gts_user_email_is_validated,
              user_contact_validated: details.gts_primary_contact_is_validated,
              user_country_code: details.gts_user_country_code,
            });
          } else if (
            details.gts_role_name == "SERVICE_PROVIDER" &&
            details.gts_user_email_is_validated &&
            details.gts_primary_contact_is_validated
          ) {
            this.state.candidateDetails.push({
              user_id: details.gts_user_id,
              user_name: details.gts_user_name,
              user_email: details.gts_user_email,
              user_contact: details.gts_primary_contact_number,
              user_email_validated: details.gts_user_email_is_validated,
              user_contact_validated: details.gts_primary_contact_is_validated,
              user_country_code: details.gts_user_country_code,
            });
          }
        });
      });

    //Cooridinator
    this.state.coordinatorName =
      userPersonalDetails.gts_user_first_name +
      " " +
      userPersonalDetails.gts_user_last_name;

    if (userPersonalDetails.gts_user_email_is_validated) {
      this.state.coordinatorEmail = userPersonalDetails.gts_user_email;
    } else {
      this.state.coordinatorEmailError =
        "Please validate your email id in manage profile page";
    }

    if (userPersonalDetails.gts_primary_contact_is_validated) {
      this.state.coordinatorCountryCode =
        userPersonalDetails.gts_user_primary_country_code;
      this.state.coordinatorConatct =
        userPersonalDetails.gts_primary_contact_number;
    } else {
      this.state.coordinatorConatct =
        "Please validate your contact number in manage profile page";
    }

    //Timezone Name
    axios
      .get(
        endpoints_properties.ENDPOINT_TIMEZONES_LOCAL +
          api_properties.API_GET_TIMEZONES_ACTIVE,
        { headers: { Auth_Token: `Bearer ${token}` } }
      )
      .then((res) => {
        this.setState({ scheduleInterviewTimeZones: res.data });
        this.state.scheduleInterviewTimeZones.forEach((timeZone) => {
          this.state.scheduleInterviewTimeZonesName.push(
            timeZone.gts_timezone_name
          );
        });
      });

    //City Name
    axios
      .get(
        endpoints_properties.ENDPOINT_CITIES_LOCAL +
          api_properties.API_GET_ACTIVE_CITIES,
        { headers: { Auth_Token: `Bearer ${token}` } }
      )
      .then((res) => {
        this.setState({ scheduleInterviewCities: res.data });
        this.state.scheduleInterviewCities.forEach((city) => {
          this.state.scheduleInterviewCitiesName.push(city.gts_city_name);
        });
      });

    //Title Name
    axios
      .get(
        endpoints_properties.ENDPOINT_JOB_TITLES_LOCAL +
          api_properties.API_GET_ACTIVE_JOB_TITLES,
        { headers: { Auth_Token: `Bearer ${token}` } }
      )
      .then((res) => {
        this.setState({ scheduleInterviewTitles: res.data });
        this.state.scheduleInterviewTitles.forEach((title) => {
          this.state.scheduleInterviewTitlesName.push(title.gts_job_title_name);
        });
      });
  }

  saveInterviewTimeZoneId = (event, value) => {
    this.state.scheduleInterviewTimeZones.forEach((timeZone) => {
      if (value === timeZone.gts_timezone_name) {
        this.state.zone = timeZone.gts_timezone_id;
      }
    });
  };

  saveInterviewCityId = (event, value) => {
    this.state.scheduleInterviewCities.forEach((city) => {
      if (value === city.gts_city_name) {
        this.state.interviewLocation = city.gts_city_id;
      }
    });
  };

  saveInterviewtitleId = (event, value) => {
    if (value !== null) {
      this.state.scheduleInterviewTitles.forEach((title) => {
        if (value === title.gts_job_title_name) {
          this.state.interviewTitle = title.gts_job_title_id;
        }
      });
    } else {
      this.state.interviewTitle = "";
    }
  };

  interviewChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  validateTitle = () => {
    if (this.state.interviewTitle == "") {
      this.setState({
        titleError: "Please select interview title.",
        validated: false,
      });
    } else {
      this.setState({
        titleError: "",
        validated: true,
      });
    }
  };

  validateType = () => {
    if (this.state.interviewType == "") {
      this.setState({
        interviewTypeError: "Please select interview type.",
        validated: false,
      });
    } else {
      this.setState({
        interviewTypeError: "",
        validated: true,
      });
    }
  };

  validateCoordinatorEmail = () => {
    if (this.state.coordinatorEmail == "") {
      this.setState({
        coordinatorEmailError: "Please enter coordinator email.",
        validated: false,
      });
    } else {
      this.setState({
        coordinatorEmailError: "",
        validated: true,
      });
    }

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(this.state.coordinatorEmail)) {
      this.setState({
        coordinatorEmailError: "Please enter valid coordinator email.",
        validated: false,
      });
    } else {
      this.setState({
        coordinatorEmailError: "",
        validated: true,
      });
    }
  };

  validateCoordinatorContact = () => {
    console.log(this.state.coordinatorCountryCode);
    console.log(this.state.coordinatorConatct);
    if (
      this.state.coordinatorCountryCode == "" &&
      this.state.coordinatorConatct == ""
    ) {
      this.setState({
        coordinatorContactError:
          "Please validate coordinator contact number in manage profile page.",
        validated: false,
      });
    } else {
      this.setState({
        coordinatorContactError: "",
        validated: true,
      });
    }
  };
  validateCoordinatorCode = () => {
    var countryCodePattern = new RegExp(/^[0-9]$/);
    if (!countryCodePattern.test(this.state.coordinatorCountryCode)) {
      this.setState({
        coordinatorCodeError: "Enter valid contact country code.",
        validated: false,
        coordinatorContactError: "",
      });
    } else {
      this.setState({
        coordinatorCodeError: "",
        validated: true,
      });
    }

    if (
      this.state.coordinatorCountryCode.length < 1 ||
      this.state.coordinatorCountryCode.length > 4
    ) {
      this.setState({
        coordinatorCodeError: "Enter valid contact country code.",
        validated: false,
        coordinatorContactError: "",
      });
    } else {
      this.setState({
        coordinatorCodeError: "",
        validated: true,
      });
      this.state.coordinatorCodeError = "";
    }
  };

  validateCoordinatorContactNumber = () => {
    var contactPattern = new RegExp(
      /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/
    );
    if (!contactPattern.test(this.state.coordinatorConatct)) {
      this.setState({
        coordinatorContactNumberError: "Enter valid contact number.",
        validated: false,
        coordinatorContactError: "",
      });
    } else {
      this.setState({
        coordinatorContactNumberError: "",
        validated: true,
      });
    }

    if (
      this.state.coordinatorConatct.length < 7 ||
      this.state.coordinatorCountryCode.length > 14
    ) {
      this.setState({
        coordinatorContactNumberError: "Enter valid contact country code.",
        validated: false,
        coordinatorContactError: "",
      });
    } else {
      this.setState({
        coordinatorContactNumberError: "",
        validated: true,
      });
    }
  };

  validateInterviewerName = () => {
    if (this.state.interviewerName == "") {
      this.setState({
        interviewerNameError: "Please select interviewer name.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerNameError: "",
        validated: true,
      });
    }
  };

  validateInterviewerEmail = () => {
    if (this.state.interviewerEmail == "") {
      this.setState({
        interviewerEmailError: "Please enter interviewer email.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerEmailError: "",
        validated: true,
      });
    }

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(this.state.interviewerEmail)) {
      this.setState({
        interviewerEmailError: "Please enter valid interviewer email.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerEmailError: "",
        validated: true,
      });
    }
  };

  validateInterviewerContact = () => {
    if (
      this.state.interviewerCountryCode == "" &&
      this.state.interviewerConatct == ""
    ) {
      this.setState({
        interviewerContactError: "Please enter interviewer contact.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerContactError: "",
        validated: true,
      });
    }
  };

  validateInterviewerCode = () => {
    var countryCodePattern = new RegExp(/^[0-9]|1[1-4]$/);
    if (!countryCodePattern.test(this.state.interviewerCountryCode)) {
      this.setState({
        interviewerCodeError: "Enter valid contact country code.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerCodeError: "",
        validated: true,
      });
    }
  };

  validateInterviewerContactNumber = () => {
    var contactPattern = new RegExp(
      /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/
    );
    if (!contactPattern.test(this.state.interviewerConatct)) {
      this.setState({
        interviewerContactNumberError: "Enter valid contact number.",
        validated: false,
      });
    } else {
      this.setState({
        interviewerContactNumberError: "",
        validated: true,
      });
    }
  };

  validateCandidateName = () => {
    var pattern = new RegExp(/^[a-zA-Z]+(?:-[a-zA-Z]+)*$/);
    if (this.state.candidateName == "") {
      this.setState({
        candidateNameError: "Please select candidate name.",
        validated: false,
      });
    } else {
      this.setState({
        candidateNameError: "",
        validated: true,
      });
    }
  };

  validateCandidateEmail = () => {
    if (this.state.candidateEmail == "") {
      this.setState({
        candidateEmailError: "Please enter candidate email.",
        validated: false,
      });
    } else {
      this.setState({
        candidateEmailError: "",
        validated: true,
      });
    }

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(this.state.candidateEmail)) {
      this.setState({
        candidateEmailError: "Please enter valid candidate email.",
        validated: false,
      });
    } else {
      this.setState({
        candidateEmailError: "",
        validated: true,
      });
    }
  };

  validateCandidateContact = () => {
    if (
      this.state.candidateCountryCode == "" &&
      this.state.candidateConatct == ""
    ) {
      this.setState({
        candidateContactError: "Please enter candidate contact.",
        validated: false,
      });
    } else {
      this.setState({
        candidateContactError: "",
        validated: true,
      });
    }
  };

  validateCandidateCode = () => {
    var countryCodePattern = new RegExp(/^[0-9]|1[1-4]$/);
    if (!countryCodePattern.test(this.state.candidateCountryCode)) {
      this.setState({
        candidateCodeError: "Enter valid contact country code.",
        validated: false,
      });
    } else {
      this.setState({
        candidateCodeError: "",
        validated: true,
      });
    }
  };

  validateCandidateContactNumber = () => {
    var contactPattern = new RegExp(
      /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/
    );
    if (!contactPattern.test(this.state.candidateConatct)) {
      this.setState({
        candidateContactNumberError: "Enter valid contact number.",
        validated: false,
      });
    } else {
      this.setState({
        candidateContactNumberError: "",
        validated: true,
      });
    }
  };

  validateWhen = () => {
    if (this.state.when == "") {
      this.setState({
        whenError: "Please select interview date.",
        validated: false,
      });
    } else {
      this.setState({
        whenError: "",
        validated: true,
      });
    }
  };

  validateFrom = () => {
    if (this.state.from == "") {
      this.setState({
        fromError: "Please select interview start date.",
        validated: false,
      });
    } else {
      this.setState({
        fromError: "",
        validated: true,
      });
    }
  };

  validateTo = () => {
    if (this.state.to == "") {
      this.setState({
        toError: "Please select interview end date.",
        validated: false,
      });
    } else {
      this.setState({
        toError: "",
        validated: true,
      });
    }
  };

  validateZone = () => {
    if (this.state.zone == "") {
      this.setState({
        zoneError: "Please select timezone.",
        validated: false,
      });
    } else {
      this.setState({
        zoneError: "",
        validated: true,
      });
    }
  };

  validateMeetingLink = () => {
    if (
      this.state.interviewType == "ONLINE" &&
      this.state.interviewMeetingLink == ""
    ) {
      this.setState({
        meetingError: "Please enter meeting link.",
        validated: false,
      });
    } else {
      this.setState({
        meetingError: "",
        validated: true,
      });
    }
  };

  validateLocation = () => {
    if (
      this.state.interviewType == "ONSITE" &&
      this.state.interviewLocation == ""
    ) {
      this.setState({
        locationError: "Please select location.",
        validated: false,
      });
    } else {
      this.setState({
        locationError: "",
        validated: true,
      });
    }
  };

  validation = () => {
    this.validateTitle();
    this.validateType();
    this.validateCoordinatorEmail();
    this.validateCoordinatorContact();
    this.validateInterviewerName();
    this.validateInterviewerEmail();
    this.validateInterviewerContact();
    this.validateCandidateName();
    this.validateCandidateEmail();
    this.validateCandidateContact();
    this.validateWhen();
    this.validateFrom();
    this.validateTo();
    this.validateZone();
    this.validateLocation();
    this.validateMeetingLink();
  };

  submitScheduleInterview = () => {
    if (this.state.validated == true) {
      var from = "";
      if (this.state.from !== "") {
        var startTime = this.state.from.split(":"),
          starthours,
          startminutes,
          startmeridian;
        starthours = startTime[0];
        startminutes = startTime[1];
        if (starthours > 12) {
          startmeridian = "PM";
          starthours -= 12;
        } else if (starthours < 12) {
          startmeridian = "AM";
          if (starthours == 0) {
            starthours = 12;
          }
        } else {
          startmeridian = "PM";
        }

        from = starthours + ":" + startminutes + " " + startmeridian;
      }

      var to = "";
      if (this.state.to !== "") {
        var endTime = this.state.to.split(":"),
          endhours,
          endminutes,
          endmeridian;
        endhours = endTime[0];
        endminutes = endTime[1];
        if (endhours > 12) {
          endmeridian = "PM";
          endhours -= 12;
        } else if (endhours < 12) {
          endmeridian = "AM";
          if (endhours == 0) {
            endhours = 12;
          }
        } else {
          endmeridian = "PM";
        }

        to = endhours + ":" + endminutes + " " + endmeridian;
      }

      var createInterviewScheduleURL =
        endpoints_properties.ENDPOINT_INTERVIEW_SCHEDULAR_LOCAL +
        api_properties.API_SCHEDULE_INTERVIEW;
      var createInterviewSchedulePayload = {
        gts_interview_coordinator_id: jsonPayLoad.user_id,
        gts_coordinator_country_code: this.state.coordinatorCountryCode,
        gts_coordinator_contact_number: this.state.coordinatorConatct,
        gts_interviewer_id: this.state.interviewerName,
        gts_interviewer_country_code: this.state.interviewerCountryCode,
        gts_interviewer_contact_number: this.state.interviewerConatct,
        gts_candidate_id: this.state.candidateName,
        gts_candidate_country_code: this.state.candidateCountryCode,
        gts_candidate_contact_number: this.state.candidateConatct,
        gts_interview_date: Moment(this.state.when).format("DD-MM-yyyy"),
        gts_interview_start_time: Moment(from, ["h:mm A"]).format("HH:mm"),
        gts_interview_end_time: Moment(to, ["h:mm A"]).format("HH:mm"),
        gts_interview_location_id: this.state.interviewLocation,
        gts_interviewer_title_id: this.state.interviewTitle,
        gts_interview_coordinator_timezone_id: this.state.zone,
        gts_interview_description: this.state.interviewDescription,
        gts_coordinator_email_id: this.state.coordinatorEmail,
        gts_interviewer_email_id: this.state.interviewerEmail,
        gts_candidate_email_id: this.state.candidateEmail,
        gts_meeting_link: this.state.interviewMeetingLink,
        gts_interview_type: this.state.interviewType,
      };

      console.log(createInterviewSchedulePayload);
      axios
        .post(createInterviewScheduleURL, createInterviewSchedulePayload, {
          headers: { Auth_Token: `Bearer ${token}` },
        })
        .then((response) => {
          this.setState({
            ScheduleInterviewSuccessMessage:
              "Interview scheduled successfully.",
            ScheduleInterviewErrorMessage: "",
          });
          // this.reset();
        })
        .catch((error) => {
          this.setState({
            ScheduleInterviewSuccessMessage: "",
            ScheduleInterviewErrorMessage: "Not able to schedule interview.",
          });
        });
    }
  };

  reset = () => {
    this.setState({
      interviewerName: "",
      interviewerCountryCode: "",
      interviewerConatct: "",
      candidateName: "",
      candidateCountryCode: "",
      candidateConatct: "",
      when: "",
      from: "",
      to: "",
      interviewLocation: "",
      interviewTitle: "",
      zone: "",
      interviewDescription: "",
      interviewerEmail: "",
      candidateEmail: "",
      interviewMeetingLink: "",
      interviewType: "",
    });
  };

  clearError = () => {
    this.setState({
      ScheduleInterviewSuccessMessage: "",
      ScheduleInterviewErrorMessage: "",
    });
  };

  interviewer = (event, value) => {
    if (value !== null) {
      this.state.interviewerName = value.user_id;
      if (value.user_email_validated) {
        this.state.interviewerEmail = value.user_email;
        this.setState({
          interviewerEmail: value.user_email,
        });
      } else {
        this.state.interviewerEmail = "";
        this.setState({
          interviewerEmail: "",
        });
      }
      if (value.user_contact_validated) {
        this.setState({
          interviewerCountryCode: value.user_country_code,
        });
        this.state.interviewerConatct = value.user_contact;
      } else {
        this.setState({
          interviewerCountryCode: "",
        });
        this.state.interviewerConatct = "";
      }
    } else {
      this.setState({
        interviewerConatct: "",
        interviewerCountryCode: "",
        interviewerEmail: "",
      });
    }
  };

  candidate = (event, value) => {
    if (value !== null) {
      this.state.candidateName = value.user_id;
      if (value.user_email_validated) {
        this.state.candidateEmail = value.user_email;
        this.setState({
          candidateEmail: value.user_email,
        });
      } else {
        this.state.candidateEmail = "";
        this.setState({
          candidateEmail: "",
        });
      }
      if (value.user_contact_validated) {
        this.setState({
          candidateCountryCode: value.user_country_code,
        });
        this.state.candidateConatct = value.user_contact;
      } else {
        this.setState({
          candidateCountryCode: "",
        });
        this.state.candidateConatct = "";
      }
    } else {
      this.setState({
        candidateConatct: "",
        candidateCountryCode: "",
        candidateEmail: "",
      });
    }
  };

  render() {
    return (
      <div className="container align-items-center">
        <div className="container align-items-center">
          <div className="mt-3">
            <div className="border border-dark rounded-lg">
              <h5>
                <strong>
                  <center>SCHEDULE FOR INTERVIEW</center>
                </strong>
              </h5>
              {/* <div className = "container"> */}
              <div className="row">
                <div className="col">
                  <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                    <strong>
                      Interview Title<span style={{ color: "red" }}>*</span>
                      &nbsp;:&nbsp;
                    </strong>
                  </label>
                  <Autocomplete
                    options={this.state.scheduleInterviewTitlesName}
                    style={{
                      width: 140,
                      outlineColor: "black",
                      display: "inline-block",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="interviewTitle"
                        onFocus={this.clearError}
                        name="interviewTitle"
                        variant="outlined"
                        style={{ color: "black" }}
                        size="small"
                      />
                    )}
                    onChange={this.saveInterviewtitleId}
                    defaultValue={this.state.interviewTitle}
                    noOptionsText="No options"
                    onBlur={this.validateTitle}
                  />
                </div>
              </div>
              {this.state.titleError ? (
                <div className="row">
                  <div className="col">
                    <span style={{ color: "red" }}>
                      {this.state.titleError}
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div class="row">
                <div className="col">
                  <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                    <strong>
                      Interview Type<span style={{ color: "red" }}>*</span>
                      &nbsp;:&nbsp;
                    </strong>
                  </label>
                  <select
                    style={{ border: "1px solid black", width: "140px" }}
                    id="interviewType"
                    onFocus={this.clearError}
                    onBlur={this.validateType}
                    name="interviewType"
                    value={this.state.interviewType}
                    onChange={this.interviewChangeHandler}
                  >
                    <option hidden selected>
                      Select
                    </option>
                    <option name="ONLINE">ONLINE</option>
                    <option name="ONSITE">ONSITE</option>
                  </select>
                </div>
              </div>
              {this.state.interviewTypeError ? (
                <div className="row">
                  <div className="col">
                    <span style={{ color: "red" }}>
                      {this.state.interviewTypeError}
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}

              <br />
              <br />
              <div className="row">
                <div className="col-4">
                  <span>
                    <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                      <strong>
                        Coordinator<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;
                      </strong>
                    </label>
                    <input
                      type="select"
                      id="coordinatorName"
                      disabled
                      name="coordinatorName"
                      value={this.state.coordinatorName}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 140,
                      }}
                      onChange={this.interviewChangeHandler}
                    ></input>

                    <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                      <strong>
                        Interviewer<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;
                      </strong>
                    </label>
                    <Autocomplete
                      options={this.state.interviewerDetails}
                      getOptionLabel={(option) => option.user_name}
                      style={{
                        width: 140,
                        outlineColor: "black",
                        display: "inline-block",
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          id="interviewerName"
                          name="interviewerName"
                          variant="outlined"
                        />
                      )}
                      onChange={this.interviewer}
                      defaultValue={this.state.interviewerName}
                      noOptionsText="No options"
                      onBlur={this.validateInterviewerName}
                      onFocus={this.clearError}
                      font-colour="red"
                      size="small"
                    />

                    {this.state.interviewerNameError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.interviewerNameError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}

                    <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                      <strong>
                        Candidate<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                      </strong>
                      <Autocomplete
                        options={this.state.candidateDetails}
                        getOptionLabel={(option) => option.user_name}
                        style={{
                          width: 140,
                          outlineColor: "black",
                          display: "inline-block",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            id="candidateName"
                            name="candidateName"
                            variant="outlined"
                          />
                        )}
                        onChange={this.candidate}
                        defaultValue={this.state.candidateName}
                        noOptionsText="No options"
                        onBlur={this.validateCandidateName}
                        onFocus={this.clearError}
                        size="small"
                      />
                    </label>
                    {this.state.candidateNameError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.candidateNameError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>

                <div className="col-4 pl-0">
                  <span>
                    <label style={{ fontSize: "15px" }}>
                      <strong>
                        Coordinator&nbsp;Contact
                        <span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;
                      </strong>
                    </label>
                    <input
                      type="text"
                      placeholder="+"
                      value="+"
                      disabled
                      style={{
                        border: "1px solid black",
                        width: "15px",
                        color: "black",
                      }}
                    ></input>
                    <input
                      type="text"
                      disabled
                      onFocus={this.clearError}
                      style={{
                        border: "1px solid black",
                        width: "35px",
                        color: "red",
                      }}
                      onBlur={this.validateCoordinatorCode}
                      id="coordinatorCountryCode"
                      name="coordinatorCountryCode"
                      value={this.state.coordinatorCountryCode}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    &nbsp;
                    <input
                      type="text"
                      disabled
                      id="coordinatorConatct"
                      onFocus={this.clearError}
                      name="coordinatorConatct"
                      onBlur={this.validateCoordinatorContact}
                      value={this.state.coordinatorConatct}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 130,
                      }}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    {this.state.coordinatorContactError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.coordinatorContactError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.coordinatorCodeError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.coordinatorCodeError}
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.coordinatorContactNumberError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.coordinatorContactNumberError}
                      </span>
                    ) : (
                      ""
                    )}
                    <label style={{ fontSize: "15px" }}>
                      <strong>
                        Interviewer Contact
                        <span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;
                      </strong>
                    </label>
                    <input
                      type="text"
                      placeholder="+"
                      value="+"
                      disabled
                      onFocus={this.clearError}
                      style={{
                        border: "1px solid black",
                        width: "15px",
                        color: "black",
                      }}
                    ></input>
                    <input
                      type="text"
                      disabled={this.state.interviewerCountryCode}
                      onFocus={this.clearError}
                      onBlur={this.validateInterviewerCode}
                      style={{
                        border: "1px solid black",
                        width: "35px",
                        color: "red",
                      }}
                      id="interviewerCountryCode"
                      name="interviewerCountryCode"
                      value={this.state.interviewerCountryCode}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    &nbsp;
                    <input
                      type="text"
                      disabled={this.state.interviewerConatct}
                      onFocus={this.clearError}
                      onBlur={(e) => {
                        this.validateInterviewerContact(e);
                        this.validateInterviewerContactNumber(e);
                      }}
                      id="interviewerConatct"
                      name="interviewerConatct"
                      value={this.state.interviewerConatct}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 130,
                      }}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    {this.state.interviewerContactError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.interviewerContactError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.interviewerCodeError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.interviewerCodeError}
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.interviewerContactNumberError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.interviewerContactNumberError}
                      </span>
                    ) : (
                      ""
                    )}
                    <label style={{ fontSize: "15px" }}>
                      <strong>
                        Candidate Contact<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                      </strong>
                    </label>
                    <input
                      type="text"
                      placeholder="+"
                      value="+"
                      onFocus={this.clearError}
                      disabled
                      style={{
                        border: "1px solid black",
                        width: "15px",
                        color: "black",
                      }}
                    ></input>
                    <input
                      type="text"
                      disabled={this.state.candidateCountryCode}
                      onFocus={this.clearError}
                      onBlur={this.validateCandidateCode}
                      style={{
                        border: "1px solid black",
                        width: "35px",
                        color: "red",
                      }}
                      id="candidateCountryCode"
                      name="candidateCountryCode"
                      value={this.state.candidateCountryCode}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    &nbsp;
                    <input
                      type="text"
                      disabled={this.state.candidateConatct}
                      onFocus={this.clearError}
                      onBlur={this.validateCandidateContactNumber}
                      id="candidateConatct"
                      name="candidateConatct"
                      value={this.state.candidateConatct}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 130,
                      }}
                      onChange={this.interviewChangeHandler}
                    ></input>
                    {this.state.candidateContactError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.candidateContactError}
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.candidateCodeError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.candidateCodeError}
                      </span>
                    ) : (
                      ""
                    )}
                    {this.state.candidateContactNumberError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.candidateContactNumberError}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>

                <div className="col-4 pl-1">
                  <span>
                    {" "}
                    <label style={{ fontSize: "15px", paddingLeft: "50px" }}>
                      <strong>
                        Coordinator Email<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;
                      </strong>
                    </label>
                    <input
                      type="text"
                      disabled
                      id="coordinatorEmail"
                      name="coordinatorEmail"
                      onFocus={this.clearError}
                      onBlur={this.validateCoordinatorEmail}
                      value={this.state.coordinatorEmail}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 140,
                      }}
                    ></input>
                    {this.state.coordinatorEmailError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.coordinatorEmailError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                    <label style={{ fontSize: "15px", paddingLeft: "50px" }}>
                      <strong>
                        Interviewer Email<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;
                      </strong>
                    </label>
                    <input
                      id="interviewerEmail"
                      disabled={this.state.interviewerEmail}
                      onFocus={this.clearError}
                      onBlur={this.validateInterviewerEmail}
                      name="interviewerEmail"
                      defaultValue={this.state.interviewerEmail}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 140,
                      }}
                    ></input>
                    {this.state.interviewerEmailError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.interviewerEmailError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                    <label style={{ fontSize: "15px", paddingLeft: "50px" }}>
                      <strong>
                        Candidate Email<span style={{ color: "red" }}>*</span>
                        &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                      </strong>
                    </label>
                    <input
                      size="19"
                      type="text"
                      onBlur={this.validateCandidateEmail}
                      onFocus={this.clearError}
                      disabled={this.state.candidateEmail}
                      id="candidateEmail"
                      name="candidateEmail"
                      value={this.state.candidateEmail}
                      style={{
                        border: "1px solid black",
                        color: "red",
                        width: 140,
                      }}
                    ></input>
                    {this.state.candidateEmailError ? (
                      <span style={{ color: "red" }}>
                        <br />
                        {this.state.candidateEmailError}
                        <br />
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </div>

              <br />
              <div className="row">
                <div className="col">
                  <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                    <strong>
                      When<span style={{ color: "red" }}>*</span>
                      &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </strong>
                  </label>
                  <input
                    type="date"
                    id="when"
                    onFocus={this.clearError}
                    name="when"
                    value={this.state.when}
                    onBlur={this.validateWhen}
                    style={{
                      border: "1px solid black",
                      color: "red",
                      width: 140,
                    }}
                    onChange={this.interviewChangeHandler}
                  ></input>
                </div>
              </div>

              {this.state.whenError ? (
                <div className="row">
                  <div className="col">
                    <span style={{ color: "red" }}>{this.state.whenError}</span>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="row">
                <div className="col" style={{ paddingTop: "10px" }}>
                  <br />
                  <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                    <strong>
                      From<span style={{ color: "red" }}>*</span>
                      &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </strong>
                  </label>
                  <input
                    type="time"
                    id="from"
                    name="from"
                    value={this.state.from}
                    onFocus={this.clearError}
                    onBlur={this.validateFrom}
                    style={{
                      border: "1px solid black",
                      color: "red",
                      width: "120px",
                    }}
                    onChange={this.interviewChangeHandler}
                  ></input>
                  {this.state.fromError ? (
                    <span style={{ color: "red" }}>
                      <br />
                      {this.state.fromError}
                    </span>
                  ) : (
                    ""
                  )}
                  <br />
                  <br />
                  <label style={{ fontSize: "15px", paddingLeft: "10px" }}>
                    <strong>
                      Location&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </strong>
                  </label>
                  <Autocomplete
                    options={this.state.scheduleInterviewCitiesName}
                    disabled={this.state.interviewType == "ONLINE"}
                    style={{
                      width: 120,
                      outlineColor: "black",
                      display: "inline-block",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="interviewLocation"
                        name="interviewLocation"
                        variant="outlined"
                        style={{ color: "black" }}
                        size="small"
                      />
                    )}
                    onChange={this.saveInterviewCityId}
                    defaultValue={this.state.interviewLocation}
                    onBlur={this.validateLocation}
                    onFocus={this.clearError}
                    noOptionsText="No options"
                  />
                  {this.state.locationError ? (
                    <span style={{ color: "red" }}>
                      <br />
                      {this.state.locationError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col pl-0">
                  <br />
                  <label style={{ fontSize: "15px" }}>
                    <strong>
                      To<span style={{ color: "red" }}>*</span>&nbsp;:&nbsp;
                    </strong>
                  </label>
                  <input
                    type="time"
                    id="to"
                    name="to"
                    onBlur={this.validateTo}
                    onFocus={this.clearError}
                    value={this.state.to}
                    style={{
                      border: "1px solid black",
                      color: "red",
                      width: "120px",
                    }}
                    onChange={this.interviewChangeHandler}
                  ></input>

                  <Button
                    type="button"
                    disabled
                    style={{ width: "120px" }}
                    color="primary"
                    data-toggle="modal"
                    data-target="#calendar"
                  >
                    <span style={{ fontSize: "12px" }}>View Calendar</span>
                  </Button>
                  {this.state.toError ? (
                    <span style={{ color: "red" }}>
                      <br />
                      {this.state.toError}
                    </span>
                  ) : (
                    ""
                  )}

                  <br />
                  <br />
                  <label style={{ fontSize: "15px" }}>
                    <strong>Meeting Link&nbsp;:&nbsp;</strong>
                  </label>
                  <input
                    type="text"
                    id="interviewMeetingLink"
                    onFocus={this.clearError}
                    onBlur={this.validateMeetingLink}
                    name="interviewMeetingLink"
                    value={this.state.interviewMeetingLink}
                    style={{
                      border: "1px solid black",
                      color: "red",
                      width: 180,
                    }}
                    disabled={this.state.interviewType == "ONSITE"}
                    onChange={this.interviewChangeHandler}
                  ></input>
                  {this.state.meetingError ? (
                    <span style={{ color: "red" }}>
                      <br />
                      {this.state.meetingError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col">
                  <br />
                  <label
                    style={{
                      fontSize: "15px",
                      paddingLeft: "50px",
                      paddingTop: "10px",
                    }}
                  >
                    <strong>
                      Timezone<span style={{ color: "red" }}>*</span>
                      &nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </strong>
                  </label>
                  <Autocomplete
                    options={this.state.scheduleInterviewTimeZonesName}
                    style={{
                      width: 158,
                      outlineColor: "black",
                      display: "inline-block",
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="zone"
                        name="zone"
                        variant="outlined"
                        style={{ color: "black" }}
                        size="small"
                      />
                    )}
                    onChange={this.saveInterviewTimeZoneId}
                    defaultValue={this.state.zone}
                    onBlur={this.validateZone}
                    noOptionsText="No options"
                    onFocus={this.clearError}
                  />
                  {this.state.zoneError ? (
                    <span style={{ color: "red" }}>
                      <br />
                      {this.state.zoneError}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <br />
              <br />
              <div className="row" style={{ paddingLeft: "375px" }}>
                <label for="interviewDescription">
                  <strong>Description&nbsp;:&nbsp;</strong>
                </label>
                <br />
                <Form.Control
                  as="textarea"
                  className="border border-dark rounded"
                  rows={"auto"}
                  style={{
                    height: "100%",
                    width: "50%",
                    color: "black",
                    backgroundColor: "no color",
                    color: "red",
                  }}
                  onChange={this.interviewChangeHandler}
                  name="interviewDescription"
                  id="interviewDescription"
                  onFocus={this.clearError}
                />
                <Button
                  color="primary"
                  style={{ width: "120px", height: "100%" }}
                  onClick={this.submitScheduleInterview}
                  onFocus={this.validation}
                >
                  <span style={{ fontSize: "12px" }}>Schedule</span>
                </Button>
              </div>
              <div class="errorMsg">
                {this.state.ScheduleInterviewErrorMessage}
              </div>
              <div class="successMsg">
                {this.state.ScheduleInterviewSuccessMessage}
              </div>
              <br />

              <div id="calendar" class="modal fade" role="dialog">
                <div class="modal-dialog model-xl">
                  <div class="modal-content">
                    <div class="modal-body">
                      <div className="container">
                        <h5>
                          <strong>
                            <center>CALENDAR</center>
                          </strong>
                        </h5>
                        {/* <Calendar
                        startAccessor="start"
                        endAccessor="end"
                      /> */}
                        <ScheduleComponent
                          diabled
                          height="550px"
                          selectedDate={Moment(new Date()).format("YYYY-MM-DD")}
                          eventSettings={{ dataSource: this.localData }}
                          views={[
                            "Day",
                            "Week",
                            "Month",
                            "TimelineDay",
                            "TimelineWeek",
                          ]}
                        >
                          <Inject
                            services={[Day, Week, Month, TimelineViews]}
                          />
                        </ScheduleComponent>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScheduleInterviewComponent;
