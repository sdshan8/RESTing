function getQuery(query) {
  return document.querySelector(query)
}
const method_selector = getQuery('#method');
const send_btn = getQuery('#send');
const input_form = getQuery('#inputs');
const url = getQuery('#url');
const header_field = getQuery('#header');
const rx_header_field = getQuery('#rx-header');
const data_field = getQuery('#data');
const output_div = getQuery('.output-div');
const data_div = getQuery('.data');
const response_element = getQuery('#response');
const use_fetch = getQuery('#fetch');
const response_status = getQuery('#status');

document.body.onload = ()=>{
  header.value = `{
  "Content-type":"application/json",
  "Accepts":"application/json"
}`
}
method_selector.onchange = ()=>{
  if(!((method_selector.value == 'GET')||(method_selector.value == 'HEAD'))) {
    data_div.style.display = "initial";
  } else {
    data_div.style.display = "none";
  }
}

const xhttp = new XMLHttpRequest();
const send = async (header) => {
  xhttp.open(method_selector.value, url.value, true);
  for (var key in JSON.parse(header)){
    xhttp.setRequestHeader(key, header[key]);
  };
  if ((method_selector.value == 'GET')||(method_selector.value == 'HEAD')) {
    xhttp.send();
  } else {
    xhttp.send(data_field.value)
  }
}
const send_fetch = async(header) => {
  if ((method_selector.value == 'GET')||(method_selector.value == 'HEAD')) {
    let response = await fetch(url.value, {
      headers: JSON.parse(header),
      method: method_selector.value
    });
    let response_header = '';
    response.headers.forEach((value, key) => {
      response_header += key + ': ' + value + '\n'
    })
    let response_json = await response.json();
    listenter( response_header, response.status + ' ' + response.statusText, response_json )
  } else {
    let response = await fetch(url.value, {
      headers: JSON.parse(header),
      method: method_selector.value,
      body: data_field.value
    });
    let response_json = await response.json();
    let response_header = '';
    response.headers.forEach((value, key) => {
      response_header += key + ': ' + value + '\n'
    })
    listenter( response_header, response.status + ' ' + response.statusText, response_json)
  }
}

xhttp.addEventListener("progress", (event)=>{
});
xhttp.addEventListener("load", ()=>{
  listenter(xhttp.getAllResponseHeaders(), xhttp.status + ' ' + xhttp.statusText, JSON.parse(xhttp.responseText))
});
xhttp.addEventListener("error", ()=>{
  send_btn.ariaBusy = "false"
  output_div.style.display = "none";
  alert('Failed to send request')
});

const listenter = (header, status, data)=>{
  send_btn.ariaBusy = "false";
  output_div.style.display = "initial";
  rx_header_field.innerText = header;
  response_status.innerText = status;
  response_element.innerText = "";
  //response_element.innerText = xhttp.responseText;
  response_element.innerText = JSON.stringify(data, null, 2)
}

input_form.onsubmit = async (e)=>{
  e.preventDefault();
  send_btn.ariaBusy = "true";
  try {
    if (use_fetch.checked) {
      await send_fetch(header_field.value);
    } else {
      await send(header_field.value);
    }
  } catch (e) {
    send_btn.ariaBusy = "false";
    output_div.style.display = "none";
    alert(e.message);
    console.log(e);
  }
}

