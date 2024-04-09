import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AddUser() {
  document.body.style.setProperty("background-color", "gainsboro");

  // values passed from App component by context provider was declared to access in this component.
  const {users,setUsers} = useContext(UserContext);
  //useNavigate implemented for Back to userData page when operations were done.
  const navigate = useNavigate();

  //datas send from another component as state was accesed by useLocation.
  const location = useLocation();

  const [isEdit, setIsEdit] = useState(false);
  //datas send from another component as (id & data) state was declared as location.state to access.
  const { id } = location.state;
  const { data } = location.state;
  //value edited in the inputfield for existing user was dynamically maintained by a state variable(editableValue).
  const [editableValue, setEditableValue] = useState(data);
  // variable created for page validation by status of boolean.
  const [pageValid, setPageValid] = useState(true);
  // for email and phone validation in inputfield RegExp was used and that is declared to a variable.
  const emailRegExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);
  const phoneRegExp = RegExp(/((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}/);
 
  useEffect(() => {
    if(id == undefined) {
      setIsEdit(true);
    }
  },[]);
// state(inputs) variable declared to create newUser and to get entereddata from inputfield.
  const[inputs,setInputs] = useState({
    "id": id,
    "name": '',
    "username": '',
    "email": '',
    "address":{
      "city": ''
    },
    "phone": '',
    "website": '',
    "company":{
      "name": ''
    }
  });
//state(formValidation) variable declared to get entered value for newUser in inputfield for validation .
  const [formValidation, setFormValidation] = useState({
    "name": '',
    "username": '',
    "email": '',
    "address": '',
    "phone": '',
    "website": '',
    "company": ''
  });
//handleChange function implemented for handle the changes made in inputfield for add or edit user & also switch case implemented inside to validate the inputfield
  const handleChange = (e) => {
    //to get entered value in inputfield e.target used and assinged to a variable as name & value.
    const { name, value } = e.target;
    //new user input value was stored in this variable dynimically to validate it.
    let isError = {"name": formValidation.name, "username": formValidation.username, "email": formValidation.email,"address": formValidation.address, "phone": formValidation.phone, "website": formValidation.website, "company": formValidation.company};

    //switch case used to validate input field.
    switch (name) {
      case "name":
        isError.name = value.length <= 4 ? "Please provide a valid Name. Name should atleast have 4 characters." : ""
        break
      case "username":
        isError.username = value.length <= 4 ? "Please provide a valid Username. Username should atleast have 4 characters." : ""
        break
      case "email":
        isError.email = emailRegExp.test(value) ? "" : "Please provide a valid E-Mail."
        break
      case "address":
        isError.address = value.length <= 4 ? "Please provide a valid Address. Address should atleast have 4 characters." : ""
        break
      case "phone":
        isError.phone = phoneRegExp.test(value) ? "" : "Please provide a valid Phone Number."
        break
      case "website":
        isError.website = value.length <= 4 ? "Please provide a valid Website Name." : ""
        break
      case "company":
        isError.company = value.length <= 4 ? "Please provide a valid Company Name. Company Name should atleast have 4 characters." : ""
        break
      default:
        break;
    }
    //values are set to state(formValidation) variable for validate the inputs using switch,case. 
    setFormValidation(isError);
//adding new user and edit existing user was updated with usin if,else condition.
    if (isEdit) {
      setEditableValue((previous) => {
      if(name == 'address') {
        previous[0][name]["city"] = value;
      } else if(name == 'company') {
        previous[0][name]["name"] = value;  
      } else {
        previous[0][name] = value;
      }
      return previous;
      })
    } else {
      setInputs((previous) => {
        if(name == 'address') {
          previous[name]["city"] = value;
        } else if(name == 'company') {
          previous[name]["name"] = value;  
        } else {
          previous[name] = value;
        }
        return previous;
      })
    }
  }

  const updateUser = (e) => {
    let pageValid = false;
    if(formValidation.name == "" && formValidation.username == "" && formValidation.email == "" && formValidation.address == "" && formValidation.phone == "" && formValidation.website == "" &&  formValidation.company == "") {
      pageValid = true;
      setPageValid(true);
    } else {
      setPageValid(false);
    }
    if (pageValid) {
      if (e.target.innerHTML == "Add User") {
        setUsers((previous) => {
          return [...previous, inputs];
          
        });
        //to add newuser in api axios.put implemented
        axios.put('https://jsonplaceholder.typicode.com/posts/1', {
        "id": inputs.id,
        "name": inputs.name,
        "username": inputs.username,
        "email": inputs.email,
        "address":{
          "city": inputs.address
        },
        "phone": inputs.phone,
        "website": inputs.website,
        "company":{
          "name": inputs.company
        }
    }).then(response => {
      console.log(response)
    });
        navigate(-1);
      } else {
        setUsers((previous) => {
          // console.log(editableValue[0].id)
          previous.splice(editableValue[0].id-1,1,editableValue[0])
          console.log(previous)
          // console.log(data[0].id,1,inputs);
          return previous
        })
        navigate(-1);
      }
    }
    
  }

  return (
    <div>
      <header className='bg-black text-white text-center fs-3 fw-bold'>Manage Users</header>
      
      <form className='m-5'>
        {!pageValid && <div class="w-50 mx-auto alert alert-danger" role="alert">
        Please fill all the fields with correct values to proceed.
      </div>}
      
        <div className="container w-50 bg-white rounded-3">

          {/* to add newUser and edit existing userdata all inputField was used dynimically by setting boolean*/}
          {/* for each inputfield formvalidation was set to validate the inputfield*/}
  
          <label for="id" className="form-label mt-3">ID</label>
          <input type="text" className="form-control mb-3 " disabled  value={isEdit ? editableValue[0].id : id}/>

          {/* each inputfield was set with id to update the target value to variables using onchange attribute with handleChange function */}
          <label for="name" className="form-label">Name</label>
          <input type="text" name="name" id="name" className={formValidation.name.length > 0 ? "form-control is-invalid" : "form-control mb-3"} onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].name : ""}/>
          {formValidation.name.length > 0 && (
            <span className="invalid-feedback">{formValidation.name}</span>
          )}

          <label for="username" className="form-label">UserName</label>
          <input type="text" name='username' id='username' className={formValidation.username.length > 0 ? "form-control is-invalid" : "form-control mb-3"} onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].username : ""}/>
          {formValidation.username.length > 0 && (
            <span className="invalid-feedback">{formValidation.username}</span>
          )}
          
          <label for="email" className="form-label">E-mail</label>
          <input type="text-mail" name='email' id='email' className={formValidation.email.length > 0 ? "form-control is-invalid" : "form-control"} onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].email : ""}/>
          <div id="emailHelp" className={formValidation.email.length > 0 ? "form-text" : "form-text mb-3"}>We'll never share your email with anyone else.</div>
          {formValidation.email.length > 0 && (
            <span className="invalid-feedback">{formValidation.email}</span>
          )}

          <label for="address" className="form-label">Address</label>
          <input type="text" name='address' id='address' className={formValidation.address.length > 0 ? "form-control is-invalid" : "form-control mb-3"}  onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].address.city : ""}/>
          {formValidation.address.length > 0 && (
            <span className="invalid-feedback">{formValidation.address}</span>
          )}

          <label for="phone" className="form-label">Phone</label>
          <input type="text" name='phone' id='phone' className={formValidation.phone.length > 0 ? "form-control is-invalid" : "form-control mb-3"} onChange={(e) => handleChange(e)}  defaultValue={isEdit ? editableValue[0].phone : ""}/>
          {formValidation.phone.length > 0 && (
            <span className="invalid-feedback">{formValidation.phone}</span>
          )}

          <label for="website" className="form-label">Website</label>
          <input type="text" name='website' id='website' className={formValidation.website.length > 0 ? "form-control is-invalid" : "form-control mb-3"} onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].website : ""}/>
          {formValidation.website.length > 0 && (
            <span className="invalid-feedback">{formValidation.website}</span>
          )}

          <label for="company" className="form-label">Company</label>
          <input type="text" name='company' id='company' className={formValidation.company.length > 0 ? "form-control is-invalid" : "form-control mb-3"} onChange={(e) => handleChange(e)} defaultValue={isEdit ? editableValue[0].company.name : ""}/>
          {formValidation.company.length > 0 && (
            <span className="invalid-feedback">{formValidation.company}</span>
          )}

          <span className='d-flex justify-content-center m-1'>
            {/*to add newuser and update existing user same element was implemented by setting boolean  */}
          <button type="button" className=" btn btn-secondary m-3" onClick={(e) => updateUser(e)}>{isEdit ? "Update User" : "Add User"}</button>
          </span>
        </div>
      </form>
    </div>
  )
}

export default AddUser