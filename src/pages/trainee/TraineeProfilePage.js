import React, { Component } from 'react'
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import 'bootstrap/dist/css/bootstrap.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser,faTrash,faEdit,faUpload} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import TraineeMenu from '../../components/trainee/TraineeMenu';
import {
  Button,Alert,FormGroup,Form,Input,InputGroupAddon,InputGroupText,InputGroup,Row,Col,Container
} from 'reactstrap';
import { FormControl, FormLabel, Card, CardBody,CardText } from 'react-bootstrap';


class TraineeProfilePage extends Component {
  
  
  
    render()
     {
      
        return (
  
     
           <div>
                <Header/>
                <TraineeMenu/>
<br></br>
  <Footer /> 


           </div>  //main end



                
        )
    }
}
export default TraineeProfilePage;

  
  
