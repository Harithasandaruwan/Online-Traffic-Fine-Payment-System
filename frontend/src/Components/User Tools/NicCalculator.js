// nicCalculator.js
export const calculateGenderAndDOB = (nic) => {
    if (!nic) return { gender: "Invalid NIC", dob: "Invalid NIC" };
  
    let gender = "";
    let dateOfBirth = "";
  
    // Remove any non-numeric characters except for old NIC format
    const nicNumber = nic.replace(/[^\d]/g, ""); 
  
    let year = "";
    let dayOfYear = 0;
  
    if (nic.length === 10) { // Old format: 790029871V
      year = "19" + nic.substring(0, 2);
      dayOfYear = parseInt(nic.substring(2, 5), 10);
    } else if (nic.length === 12) { // New format: 197900209871
      year = nic.substring(0, 4);
      dayOfYear = parseInt(nic.substring(4, 7), 10);
    } else {
      return { gender: "Invalid NIC", dob: "Invalid NIC" };
    }
  
    // Determine Gender
    if (dayOfYear > 500) {
      gender = "Female";
      dayOfYear -= 500; // Adjust to get the correct day
    } else {
      gender = "Male";
    }
  
    // Convert dayOfYear to MM-DD format
    const months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = 0;
    let day = dayOfYear;
  
    for (let i = 0; i < months.length; i++) {
      if (day <= months[i]) {
        month = i + 1;
        break;
      }
      day -= months[i];
    }
  
    dateOfBirth = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  
    return { gender, dob: dateOfBirth };
  };
  