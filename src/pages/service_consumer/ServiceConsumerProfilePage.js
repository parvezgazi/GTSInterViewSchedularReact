
import React, { Component } from 'react'
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import 'bootstrap/dist/css/bootstrap.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faTrash,faEdit,faUpload} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    ScheduleComponent, Day, Week, WorkWeek, Month, PopupOpenEventArgs, ActionEventArgs, EventRenderedArgs, Resize, DragAndDrop, Inject, TimelineViews
} from '@syncfusion/ej2-react-schedule';
import Moment from 'moment';
import ServiceConsumerMenu from '../../components/service_consumer/ServiceConsumerMenu';
import {
  Button,Alert,FormGroup,Form,Input,InputGroupAddon,InputGroupText,InputGroup,Row,Col,Container
} from 'reactstrap';
import { FormControl, FormLabel, Card, CardBody,CardText } from 'react-bootstrap';


class ServiceConsumerProfilePage extends Component {



    render()
     {

        return (


           <div>
                <Header/>
                <ServiceConsumerMenu/>

<br></br>
  <Footer />


           </div>  //main end




        )
    }
}
export default ServiceConsumerProfilePage;
