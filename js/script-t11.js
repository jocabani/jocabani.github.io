let table = document.getElementById("csv-data");
let url = "https://docs.google.com/spreadsheets/d/1lXRDXTcJNicHN6hJUbL5vO9tNmFqL5D8gI5XwW8E3EI/gviz/tq?tqx=out:csv&tq=select%20*";
 
fetch(url)
  .then(response => response.text())
  .then(data => {
    let rows = data.split("\n");
    for (let i = 0; i < rows.length; i++) {
      let cells = rows[i].split(",");
      let row = table.insertRow();
      for (let j = 0; j < cells.length; j++) {
        let cell = row.insertCell();
        cell.innerText = cells[j];
      }
    }
  })
  .catch(error => console.log(error));