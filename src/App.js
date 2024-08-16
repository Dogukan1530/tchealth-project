import React, { useState, useRef, useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from 'react-toastify';
import PatientEligibilityRequest from './Patient_eligibility/Patient_eligibility_req';
import logo from './Assets/logo.png';
import PatientTable from './Patient_table';
import './App.css';
import illnesses from './Assets/illness'
import providers from './Assets/providers'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    membershipNumber: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    countryCode: '+1',
    admissionDate: '',
    hospitalAdmissionNumber: Math.floor(100000 + Math.random() * 900000), 
    accident: false,
    emergencyAdmission: false,
    compensationClaim: false,
    preExistingCondition: false,
    sameDayAdmission: false,
    lengthOfStay: '',
    presentingIllness: '',
    mbsItemNumber: '',
    principalProvider: '',
  });

  const [errors, setErrors] = useState({});
  const [requests, setRequests] = useState([]);
  const [currentView, setCurrentView] = useState('form');
  const [activeButton, setActiveButton] = useState('form'); 

  const [illnessSearch, setIllnessSearch] = useState('');
  const [filteredIllnesses, setFilteredIllnesses] = useState(illnesses.Illness.map(illness => illness.name));
  const [selectedIllness, setSelectedIllness] = useState('');

  const [providerSearch, setProviderSearch] = useState('');
  const [filteredProviders, setFilteredProviders] = useState(providers.Providers.map(provider => provider.name));
  const [selectedProvider, setSelectedProvider] = useState('');

  const [openIllnessDropdown, setOpenIllnessDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const [openProviderDropdown, setOpenProviderDropdown] = useState(false);
  const timeoutRefProvider = useRef(null);
  const dropdownRefProvider = useRef(null);


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleOpenIllnessDropdown = () => {
    setOpenIllnessDropdown(true);
  }

  const handleOpenProviderDropdown = () => {
    setOpenProviderDropdown(true);
  }

  const validateForm = () => {
    let errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?\d{10,15}$/; 
    console.log(formData)

    if (/\d/.test(formData.firstName) || formData.firstName === '') {
      errors.firstName = 'First name cannot contain numbers and cannot be empty.';
    }

    if (/\d/.test(formData.middleName)) {
      errors.middleName = 'Middle name cannot contain numbers.';
    }

    if (/\d/.test(formData.lastName) || formData.lastName === '') {
      errors.lastName = 'Last name cannot contain numbers and cannot be empty.';
    }

    if (!emailPattern.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!phonePattern.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number.';
    }

    if (new Date(formData.admissionDate) < new Date() || new Date(formData.admissionDate) > new Date(new Date().setMonth(new Date().getMonth() + 6))) {
      errors.admissionDate = 'Admission date cannot be in the past or more than 6 months in the future.';   
    }

    if (!formData.presentingIllness && !formData.mbsItemNumber) {
      errors.presentingIllness = 'Either Presenting Illness or MBS Item Number must be filled.';
      errors.mbsItemNumber = 'Either Presenting Illness or MBS Item Number must be filled.';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      toast.success("Form Submitted Successfully!");
      const patientEligibilityReq = new PatientEligibilityRequest(formData);
      console.log('Form submitted successfully:', patientEligibilityReq);
      setRequests((prevRequests) => [...prevRequests, patientEligibilityReq]); 
    } else {
      toast.error("Please fix errors!");
      console.log('Form has errors:', errors);
    }
  };

  const handleButtonClick = (view) => {
    setCurrentView(view);
    setActiveButton(view);
  };


  const handleIllnessSearchChange = (e) => {
    const searchTerm = e.target.value;
    setIllnessSearch(searchTerm);
  
    if (searchTerm) {
      const filtered = illnesses.Illness.filter((illness) =>
        illness.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      setFilteredIllnesses(filtered.map(illness => illness.name));
    } else {
      setFilteredIllnesses(illnesses.Illness.map(illness => illness.name));
    }
  };

  useEffect(() => {
  }, [formData]);

  const handleIllnessSelect = (illness, event) => {
    setFormData(formData => ({
      ...formData,
      presentingIllness: illness
    }));

    event.stopPropagation(); 
    timeoutRef.current = setTimeout(() => {
    setSelectedIllness(illness);
    setIllnessSearch(''); 
    setOpenIllnessDropdown(false);
    setFilteredIllnesses(illnesses.Illness.map(illness => illness.name));
     }, 100);
  };


  const handleProviderSearchChange = (e) => {
    const searchTerm = e.target.value;
    setProviderSearch(searchTerm);

    if (searchTerm) {
      const filtered = providers.Providers.filter((provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredProviders(filtered.map(provider => provider.name));
    } else {
      setFilteredProviders(providers.Providers.map(provider => provider.name)); 
    }
  };

  const handleProviderSelect = (provider, event) => {
    setFormData(formData => ({
      ...formData,
      principalProvider: provider
    }));
    
    event.stopPropagation(); 
    timeoutRefProvider.current = setTimeout(() => {
    setSelectedProvider(provider);
    setProviderSearch(''); 
    setOpenProviderDropdown(false);
    setFilteredProviders(providers.Providers.map(provider => provider.name));
    
     }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIllnessDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 return (
    <div className="App">
      <header className="Main-header">
      <img src={logo} alt="Logo" />
        <h1>TCHEALTH</h1>
        <div className="header-buttons">
        <button
            className={`header-button ${activeButton === 'form' ? 'active' : ''}`}
            onClick={() => handleButtonClick('form')}
          >
            Patient Request Form
          </button>
          <button
            className={`header-button ${activeButton === 'table' ? 'active' : ''}`}
            onClick={() => handleButtonClick('table')}
          >
            Patient Table
          </button>
        </div>
        </header>
        
      {currentView === 'form' && (
      <header>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="patient-info-container">
          <div className="form-row">
          <h2 className="form-title">Patient Information</h2>
            <div className="form-group-short">
            <label className="form-label">
            a) First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Your first name"
                className="form-input"
              />
              <div>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>              
            </label>        
          </div>
          

          <div className="form-group-short">
            <label className="form-label">
              b) Middle Name:
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Your middle name"
                className="form-input"
              />
              <div>
              {errors.middleName && <span className="error-message">{errors.middleName}</span>}
              </div>
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              c) Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Your last name"
                className="form-input"
              />
              <div>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </label>
          </div>
          

          <div className="form-group-short">
            <label className="form-label">
              d) Fund Membership Number:
              <input
                type="text"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleChange}
                maxLength="8"
                pattern="\d{8}"
                title="Please enter an 8-digit number"
                required
                placeholder="8-digit membership number"
                className="form-input"
              />
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              e) Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group-short">
            <label className="form-label">
              f) Gender:
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              g) Email Address:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                className="form-input"
              />
              <div>
              {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </label>
          </div>
         

          <div className="form-group-short">
            <div className="form-label">
              h) Phone Number:
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+90">+90</option>

                </select>
                <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="enter phone number"
                className="form-input"
              />
              </div>
              <div>
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>
          </div>
         
          </div>

          <div className="patient-info-container">
          <div className="form-row">
          <h2 className="form-title">Admission Information</h2>
          <div className="form-group-short">
            <label className="form-label">
              a) Admission Date:
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className="form-input"
              />
              <div>
                 {errors.admissionDate && <span className="error-message">{errors.admissionDate}</span>}
              </div>
            </label>
          </div>
          
          <div className="form-group-short">
            <label className="form-label">
              b) Hospital Admission Number:
              <input
                type="text"
                name="hospitalAdmissionNumber"
                value={formData.hospitalAdmissionNumber}
                readOnly
                className="form-input"
              />
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              c) Accident?:
              <input
                type="checkbox"
                name="accident"
                checked={formData.accident}
                onChange={handleChange}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group-short">
            <label className="form-label">
              d) Emergency Admission?:
              <input
                type="checkbox"
                name="emergencyAdmission"
                checked={formData.emergencyAdmission}
                onChange={handleChange}
                className="form-input"
              />
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              e) Compensation Claim?:
              <input
                type="checkbox"
                name="compensationClaim"
                checked={formData.compensationClaim}
                onChange={handleChange}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group-short">
            <label className="form-label">
              f) Related to Pre-Existing Condition?:
              <input
                type="checkbox"
                name="preExistingCondition"
                checked={formData.preExistingCondition}
                onChange={handleChange}
                className="form-input"
              />
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              g) Same Day Admission?:
              <input
                type="checkbox"
                name="sameDayAdmission"
                checked={formData.sameDayAdmission}
                onChange={handleChange}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group-short">
            <label className="form-label">
            h) Estimated Length of Stay (days):
              <input
                type="number"
                name="lengthOfStay"
                value={formData.sameDayAdmission ? 1 : formData.lengthOfStay}
                onChange={handleChange}
                required
                disabled={formData.sameDayAdmission}
                className="form-input"
              />
            </label>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
          i) Presenting Illness:
      <div className="form-group" ref={dropdownRef}>
        <input
          type="text"
          id="presentingIllness"
          disabled={formData.mbsItemNumber !== ''}
          value={illnessSearch}
          onChange={handleIllnessSearchChange}
          onClick={handleOpenIllnessDropdown}
          placeholder={selectedIllness? selectedIllness : "Search illness..."}
          className={`form-input presenting-illness-dropdown ${selectedIllness ? 'placeholder-black' : 'placeholder-grey'}`}
        />
        {openIllnessDropdown && (
          <ul className="dropdown-list">      
            {filteredIllnesses.map((illness, index) => (
              <li
                key={index}
                onClick={(e) => handleIllnessSelect(illness, e)}
                className="dropdown-item"
              >
                {illness}
              </li>
            ))}
          </ul>
        )}
        <input
          type="hidden"
          name="selectedIllness"
          value={selectedIllness}
        />
      </div>
            </label>
            <div>
              {errors.presentingIllness && <span className="error-message">{errors.presentingIllness}</span>}
          </div>
          </div>

          <div className="form-group-short">
            <label className="form-label">
            j) MBS Item Number:


              <input
                type="text"
                name="mbsItemNumber"
                value={formData.mbsItemNumber}
                onChange={handleChange}
                placeholder="enter 5 digit item number"
                maxLength="5"
                disabled={formData.presentingIllness !== ''}
                className="form-input"
              />
            </label>
            <div>
              {errors.mbsItemNumber && <span className="error-message">{errors.mbsItemNumber}</span>}
          </div>
          </div>
          </div>

          <div className="form-row">
          <div className="form-group-short">
            <label className="form-label">
              k) Principal Provider:
              <div className="form-group" ref={dropdownRefProvider}>
        <input
          type="text"
          id="principalProvider"
          value={providerSearch}
          onChange={handleProviderSearchChange}
          onClick={handleOpenProviderDropdown}
          placeholder={selectedProvider? selectedProvider : "Search provider..."}
          className={`form-input presenting-illness-dropdown ${selectedProvider ? 'placeholder-black' : 'placeholder-grey'}`}
        />
      
        {openProviderDropdown && (
          <ul className="dropdown-list">      
            {filteredProviders.map((provider, index) => (
              <li
                key={index}
                onClick={(e) => handleProviderSelect(provider, e)}
                className="dropdown-item"
              >
                {provider}
              </li>
            ))}
          </ul>
        )}
        <input
          type="hidden"
          name="selectedProvider"
          value={selectedProvider}
        />
      </div>
            </label>
          </div>
          </div>
          </div>
          <div className="form-submit-container">
            <button type="submit">Submit</button>
            <ToastContainer/>
          </div>
        </form>
      </header>
      )}
      {currentView === 'table' && <PatientTable requests={requests} />}
    </div>
  );
}

export default App;