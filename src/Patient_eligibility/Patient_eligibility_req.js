import React, { useState } from 'react';

class PatientEligibilityRequest {
  static instanceCount = 0; 
    constructor(formData) {
      PatientEligibilityRequest.instanceCount += 1;
      this.index = PatientEligibilityRequest.instanceCount;
      this.submissionDate = new Date().toISOString().split('T')[0]; 
      this.lastName = formData.lastName;
      this.membershipNumber = formData.membershipNumber;
      this.principalProvider = formData.principalProvider;
      this.admissionDate = formData.admissionDate;
      this.status = this.getRandomElement();
    }

    getRandomElement() {
      const status= ["Draft", "Submitted", "Processing", "Finalized"];
      const randomIndex = Math.floor(Math.random() * 3);
      return status[randomIndex];
    }
  }
  
  export default PatientEligibilityRequest;