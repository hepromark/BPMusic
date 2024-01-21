// Defining API URL
const apiUrl = "https://localhost:3001/api/heartrate/65ac5ea8e1a9bc3f088d1350"


function getBPM1() {
    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            console.log(response);
            if(response.status === 404) {
                throw new Error('Data not found');
            } else if (response.status === 500) {
                throw new Error('Server error');
            } else {
                throw new Error('Network response was not ok');
                }
            }
            return response.json();
    })

.then(data => {
    outputElement.textContent = JSON.stringify(data, null, 2)
})
.catch(error => {
    console.error('Error:', error);
});


}