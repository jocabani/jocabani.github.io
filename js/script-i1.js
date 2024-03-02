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

function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}


const currentDate = changeTimeZone(new Date(), 'Europe/Madrid'); // Zona Horaria España
// const currentDate = changeTimeZone(new Date(), 'America/Lima'); // Zona Horaria Perú

const day = currentDate.getDate().toString().padStart(2, "0");
// const day_end = (currentDate.getDate() + 1).toString().padStart(2, "0");
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const year = currentDate.getFullYear().toString();
const hours = currentDate.getHours().toString().padStart(2, "0");
const minutes = currentDate.getMinutes().toString().padStart(2, "0");
const seconds = currentDate.getSeconds().toString().padStart(2, "0");
const init_date_show = `${day}-${month}-${year} 00:00:00`
const init_date_query = `${year}-${month}-${day}`
const current_date_show = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
const current_date_query = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

console.log(`Ahora: ${current_date_show}`);

const init_week = getMonday(currentDate)
const iw_day = init_week.getDate().toString().padStart(2, "0");
const iw_month = (init_week.getMonth() + 1).toString().padStart(2, "0");
const iw_year = init_week.getFullYear().toString();
const init_week_date_show = `${iw_day}-${iw_month}-${iw_year} 00:00:00 - ${current_date_show}`
const init_week_date_query = `${iw_year}-${iw_month}-${iw_day}`

const init_month = getFirstDayOfMonth(currentDate);
const im_day = init_month.getDate().toString().padStart(2, "0");
const im_month = (init_month.getMonth() + 1).toString().padStart(2, "0");
const im_year = init_month.getFullYear().toString();
const init_month_date_show = `${im_day}-${im_month}-${im_year} 00:00:00 - ${current_date_show}`
const init_month_date_query = `${im_year}-${im_month}-${im_day}`

const one_day_ms = 60 * 60 * 24 * 1000;
const end_date = new Date(currentDate.getTime() + one_day_ms)

// end_date.setDate(currentDate.getDate()+1)
const end_day = end_date.getDate().toString().padStart(2, "0");
const end_month = (end_date.getMonth() + 1).toString().padStart(2, "0");
const end_year = end_date.getFullYear().toString();
const end_date_show = `${end_day}-${end_month}-${end_year}`
const end_date_query = `${end_year}-${end_month}-${end_day}`
// const end_date_query = `2024-03-03`

console.log(`Inicio Hoy: ${init_date_show}` ); // e.g. Mon Nov 08 2010
console.log(`Inicio Semana: ${init_week_date_show}` ); // e.g. Mon Nov 08 2010
console.log(`Inicio Semana query: ${init_week_date_query}` ); // e.g. Mon Nov 08 2010
console.log(`Inicio Mes: ${init_month_date_show}` ); // e.g. Mon Nov 08 2010
console.log(`Inicio Mes query: ${init_month_date_query}` ); // e.g. Mon Nov 08 2010
console.log(`Fin DATE: ${end_date}` ); // e.g. Mon Nov 08 2010
console.log(`Fin: ${end_date_show}` ); // e.g. Mon Nov 08 2010
console.log(`Fin query: ${end_date_query}` ); // e.g. Mon Nov 08 2010
console.log(`Fin mes: ${end_month}` ); // e.g. Mon Nov 08 2010

const sheetId = '1lXRDXTcJNicHN6hJUbL5vO9tNmFqL5D8gI5XwW8E3EI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Respuestas de formulario 1';

// const query = encodeURIComponent('Select C, count(C) group by C')
const query = encodeURIComponent(`Select C, count(C) where A > date '${init_date_query}' and A < date '${end_date_query}' group by C label C 'Correlativo', count(C) 'Cantidad'`)
const url = `${base}&sheet=${sheetName}&tq=${query}`

const query_week = encodeURIComponent(`Select C, count(C) where A > date '${init_week_date_query}' and A < date '${end_date_query}' group by C label C 'Correlativo', count(C) 'Cantidad'`)
const url_week = `${base}&sheet=${sheetName}&tq=${query_week}`

const query_month = encodeURIComponent(`Select C, count(C) where A > date '${init_month_date_query}' and A < date '${end_date_query}' group by C label C 'Correlativo', count(C) 'Cantidad'`)
const url_month = `${base}&sheet=${sheetName}&tq=${query_month}`

let data = []
document.addEventListener('DOMContentLoaded', init)

const id_today_datetime = document.getElementById("id-today-datetime");
const id_today_amount = document.getElementById("id-today-count");
const id_today_table = document.getElementById('id-today-table');
const id_week_datetime = document.getElementById("id-week-datetime");
const id_week_amount = document.getElementById("id-week-count");
const id_week_table = document.getElementById('id-week-table');
const id_month_datetime = document.getElementById("id-month-datetime");
const id_month_amount = document.getElementById("id-month-count");
const id_month_table = document.getElementById('id-month-table');

let today_amount = 0

function processRows(json, section_table) {
  json.forEach((row) => {
      let table_temp = section_table
      const tr = document.createElement('tr');
      const keys = Object.keys(row);
  
      keys.forEach((key) => {
          const td = document.createElement('td');
          td.textContent = row[key];
          tr.appendChild(td);
      })
      table_temp.appendChild(tr);
  })
}

function createSection(url, section_date, section_amount, section_table, date_show) {
  console.log("Function createSection")
  
  fetch(url)
      .then(res => res.text())
      .then(rep => {
          data = []
          let table_temp = section_table
          today_amount = 0;
          //Remove additional text and extract only JSON:
          const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
          // console.log(rep)
          const colz = [];
          const tr = document.createElement('tr');
          //Extract column labels
          jsonData.table.cols.forEach((heading) => {
              if (heading.label) {
                  let column = heading.label;
                  colz.push(column);
                  const th = document.createElement('th');
                  th.innerText = column;
                  tr.appendChild(th);
              }
          })
          table_temp.appendChild(tr);
          //extract row data:
          jsonData.table.rows.forEach((rowData) => {
              const row = {};
              colz.forEach((ele, ind) => {
                  row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                  if (ele == "Cantidad") {
                      // console.log("ELE>>"+ele)
                      // console.log(row[ele])
                      today_amount += row[ele]  
                  }
                  
              })
              // console.log("today_amount>>"+today_amount)
              data.push(row);
          })
          processRows(data, table_temp);
          section_date.innerHTML = `${date_show}`;
          section_amount.innerHTML = `${today_amount}`;
      })
}

function init() {
  createSection(url, id_today_datetime, id_today_amount, id_today_table, current_date_show)
  createSection(url_week, id_week_datetime, id_week_amount, id_week_table, init_week_date_show)
  createSection(url_month, id_month_datetime, id_month_amount, id_month_table, init_month_date_show)
  
}
