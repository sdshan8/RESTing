function getQuery(query) {
  return document.querySelector(query)
}
// Inputs
const method_selector = getQuery('#method');
const send_btn = getQuery('#send');
const send_header = getQuery('#send_header');
const header_field = getQuery('#header');
const data_field = getQuery('#data');

// Outputs
const rx_header_field = getQuery('#rx-header');
const output_div = getQuery('.output-div');
const response_element = getQuery('#response');
const response_status = getQuery('#status');


method_selector.onchange = ()=>{
  if(!((method_selector.value == 'GET')||(method_selector.value == 'HEAD'))) {
    data_field.disabled = false;
  } else {
    data_field.disabled = true;
  }
}
send_header.onchange = ()=>{
  if(send_header.checked) {
    header_field.disabled = false;
  } else {
    header_field.disabled = true;
  }
}

const xhttp = new XMLHttpRequest();
const send = async (inputs) => {
  xhttp.open(inputs.method, inputs.url, true);
  if(inputs.send_header && inputs.header){
    for (var key in JSON.parse(inputs.header)){
      xhttp.setRequestHeader(key, header[key]);
    };
  }
  xhttp.setRequestHeader('Content-type', 'application/json');
  if (inputs.method == ("HEAD" || "GET")) {
    xhttp.send();
  } else {
    xhttp.send(inputs.data)
  }
}


xhttp.addEventListener("progress", (event)=>{
  console.log(event)
});
xhttp.addEventListener("load", ()=>{
  listenter(
    xhttp.getAllResponseHeaders(),
    xhttp.status + ' ' + xhttp.statusText,
    (xhttp.responseText ? JSON.parse(xhttp.responseText) : false)
  )
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
  response_element.innerText = data ? JSON.stringify(data, null, 2) : ""
}

const send_requst = async (e)=>{
  e.preventDefault();
  var formData = new FormData(e.target)
  var inputs = {};
  formData.forEach(function(value, key){
    inputs[key] = value;
  });
  send_btn.ariaBusy = "true";
  try {
    await send(inputs);
  } catch (err) {
    send_btn.ariaBusy = "false";
    output_div.style.display = "none";
    alert(err.message);
    console.log(err);
  }
}

