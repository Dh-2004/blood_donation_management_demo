// Validate Donor Function
function validateDonor(data) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const today = new Date().toISOString().split('T')[0];

    if (data.age < 18) {
        return { valid: false, message: "Try to donate after completing 18 years." };
    }
    if (data.age > 60) {
        return { valid: false, message: "You cannot donate blood." };
    }
    if (!validBloodTypes.includes(data.blood_type.toUpperCase())) {
        return { valid: false, message: "Invalid blood type." };
    }
    if (data.last_donation_date > today) {
        return { valid: false, message: "Last donation date cannot be in the future." };
    }
    data.blood_type = data.blood_type.toUpperCase(); // Convert to uppercase if valid
    return { valid: true, data: data };
}

// Add donor functionality
document.getElementById('add-donor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const blood_type = document.getElementById('blood_type').value;
    const last_donation_date = document.getElementById('last_donation_date').value;
    
    const donorData = { name, age: parseInt(age), blood_type, last_donation_date };
    const validationResult = validateDonor(donorData);
    
    if (!validationResult.valid) {
        alert(validationResult.message);
        return;
    }
    
    fetch('http://localhost:5000/add_donor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(validationResult.data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('add-donor-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// View donors functionality
function viewDonors() {
    fetch('http://localhost:5000/view_donors')
    .then(response => response.json())
    .then(donors => {
        const donorList = document.getElementById('donor-list');
        donorList.innerHTML = '';
        donors.forEach(donor => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${donor[0]}, Name: ${donor[1]}, Age: ${donor[2]}, Blood Type: ${donor[3]}, Last Donation Date: ${donor[4]}`;
            donorList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('update-donor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('update_id').value;
    const name = document.getElementById('update_name').value;
    const age = document.getElementById('update_age').value;
    const blood_type = document.getElementById('update_blood_type').value;
    const last_donation_date = document.getElementById('update_last_donation_date').value;

    const donorData = {};
    if (name) donorData.name = name;
    if (age) donorData.age = parseInt(age);
    if (blood_type) donorData.blood_type = blood_type;
    if (last_donation_date) donorData.last_donation_date = last_donation_date;

    if (Object.keys(donorData).length > 0) {
        fetch(`http://localhost:5000/update_donor/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(donorData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('update-donor-form').reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please provide at least one field to update.');
    }
});

// Delete donor functionality
document.getElementById('delete-donor-form').addEventListener('submit', function(e){
    e.preventDefault();
    
    const id = document.getElementById('delete_id').value;
    
    fetch(`http://localhost:5000/delete_donor/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('delete-donor-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Count donors functionality
function countDonors() {
    fetch('http://localhost:5000/count_donors')
    .then(response => response.json())
    .then(data => {
        document.getElementById('donor-count').textContent = `Total Donors: ${data.count}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Search donors by blood type functionality
document.getElementById('search-donor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const blood_type = document.getElementById('search_blood_type').value;
    
    fetch(`http://localhost:5000/search_donors/${blood_type.toUpperCase()}`)
    .then(response => response.json())
    .then(donors => {
        const donorList = document.getElementById('search-donor-list');
        donorList.innerHTML = '';
        if (Array.isArray(donors)) {
            donors.forEach(donor => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${donor[0]}, Name: ${donor[1]}`;
                donorList.appendChild(listItem);
            });
        } else {
            donorList.innerHTML = `<li>${donors.message}</li>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
