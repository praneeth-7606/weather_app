// Test your API key directly
fetch('https://api.openweathermap.org/data/2.5/weather?q=Kollam&appid=32c4c18d9b89fe52222feb587433c873&units=metric')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Key works!', data.name, data.main.temp + '°C');
    console.log(data);
  })
  .catch(error => {
    console.log('❌ Error:', error.message);
  });