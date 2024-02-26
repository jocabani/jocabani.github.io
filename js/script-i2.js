let table = document.getElementById("csv-data");
let table2 = document.getElementById("csv-data2");
let id_datetime = document.getElementById("id-datetime");
let id_datetime2 = document.getElementById("id-datetime2");
let sheetId = '1lXRDXTcJNicHN6hJUbL5vO9tNmFqL5D8gI5XwW8E3EI';
let base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;


function changeTimeZone(date, timeZone) {
  if (typeof date === 'string') {
    return new Date(
      new Date(date).toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

  return new Date(
    date.toLocaleString('en-US', {
      timeZone,
    }),
  );
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}


const currentDate = changeTimeZone(new Date(), 'Europe/Madrid'); // Zona Horaria España
// const currentDate = changeTimeZone(new Date(), 'America/Lima'); // Zona Horaria Perú

const day = currentDate.getDate().toString().padStart(2, "0");
const day_end = (currentDate.getDate() + 1).toString().padStart(2, "0");
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const year = currentDate.getFullYear().toString();
const hours = currentDate.getHours().toString().padStart(2, "0");
const minutes = currentDate.getMinutes().toString().padStart(2, "0");
const seconds = currentDate.getSeconds().toString().padStart(2, "0");
const full_datetime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
console.log(`Ahora: ${full_datetime}`);
const init_week = getMonday(currentDate)
const iw_day = init_week.getDate().toString().padStart(2, "0");
const iw_day_end = (init_week.getDate() + 7).toString().padStart(2, "0");
const iw_month = init_week.getMonth().toString().padStart(2, "0");
const iw_year = init_week.getFullYear().toString();
const day_init = `${iw_day}-${iw_month}-${iw_year}`
console.log(`Inicio Semana: ${day_init}` ); // e.g. Mon Nov 08 2010
console.log(`Fin: ${full_datetime}` ); // e.g. Mon Nov 08 2010

let query = encodeURIComponent(`Select * where A > date '${year}-${month}-${day}' and A < date '${year}-${month}-${day_end}'`)
let url = `${base}&tq=${query}`;


id_datetime.innerHTML = `Hoy: ${full_datetime}`;
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

// -----
/* TODO: Para el día fin se debe sumar el periodo de un dia la fecha completa */
let query2 = encodeURIComponent(`Select * where A > date '${iw_year}-${iw_month}-${iw_day}' and A < date '${year}-${month}-${day_end}'`)
let url2 = `${base}&tq=${query2}`;


id_datetime2.innerHTML = `Semana: ${day_init} al ${full_datetime}`;
fetch(url)
  .then(response => response.text())
  .then(data => {
    let rows = data.split("\n");
    for (let i = 0; i < rows.length; i++) {
      let cells = rows[i].split(",");
      let row = table2.insertRow();
      for (let j = 0; j < cells.length; j++) {
        let cell = row.insertCell();
        cell.innerText = cells[j];
      }
    }
  })
  .catch(error => console.log(error));