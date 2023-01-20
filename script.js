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
const loading_bar = getQuery('#loading');
const output_div = getQuery('.output-div');
const data_div = getQuery('.data');
const response_element = getQuery('#response');
const response_status = getQuery('#status');

document.body.onload = ()=>{
  data_field.placeholder = `Example:\n{\n\b\b"key":"value",\n\b\b"secret":"403"\n}`
}
method_selector.onchange = ()=>{
  if(!((method_selector.value == 'GET')||(method_selector.value == 'DELETE')||(method_selector.value == 'HEAD'))) {
    data_div.style.display = "initial";
  } else {
    data_div.style.display = "none";
  }
}

const xhttp = new XMLHttpRequest();
const send = async (header) => {
  xhttp.open(method_selector.value, url.value, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  for (var key in header){
    xhttp.setRequestHeader(key, header[key]);
    console.log(key + ' -> ' +  data[key]);
  };
  if ((method_selector.value == 'GET')||(method_selector.value == 'DELETE')||(method_selector.value == 'HEAD')) {
    xhttp.send();
  } else {
    xhttp.send(data_field.value)
  }
}
xhttp.addEventListener("progress", ()=>{
  loading.style.display = "initial";
});
xhttp.addEventListener("load", ()=>{
  setTimeout(listenter(false), 100);
});
xhttp.addEventListener("error", ()=>{
  setTimeout(listenter(true), 100);
});

const listenter = (err)=>{
  send_btn.ariaBusy = "false";
  output_div.style.display = "initial";
  loading.style.display = "none";
  rx_header_field.innerText = xhttp.getAllResponseHeaders();
  response_status.innerText = xhttp.status + ' ' + xhttp.statusText;
  response_element.innerText = "";
  //response_element.innerText = xhttp.responseText;
  response_element.innerText = JSON.stringify(JSON.parse(xhttp.responseText), null, 2)
  PR.prettyPrint();
}

input_form.onsubmit = async (e)=>{
  e.preventDefault();
  send_btn.ariaBusy = "true";
  if (header_field.value) {
    await send(JSON.parse(header_field.value));
  } else {
    await send();
  }
}

