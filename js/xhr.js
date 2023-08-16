/**
  * @constructs XHR - makes a XMLHttprequest
  * @param {function} callback - funtion to callback. passes (header, status, data) as parameters
  * @param {function} onError - funtion to call on error. passes (error) as parameters
  */
function XHR(callback, onError) {
  this.xhttp = new XMLHttpRequest();
  this.callback = callback;
  this.onError = onError;

  /**
    * @function send - sends the request.
    * @param {object} inputs - object of the inputs
    * @returns {void}
    */
  this.send = async (inputs) => {

    this.xhttp.open(inputs.method, inputs.url, true);

    if(inputs.send_header && inputs.header){
      for (var key in JSON.parse(inputs.header)){
        this.xhttp.setRequestHeader(key, header[key]);
      };
    }

    this.xhttp.setRequestHeader('Content-type', 'application/json');
    if (inputs.method == ("HEAD" || "GET")) {
      this.xhttp.send();
    } else {
      this.xhttp.send(inputs.data)
    }
    return void(0);
  }
  /* 
  this.xhttp.addEventListener("progress", (event)=>{
    console.log(event)
  });
  */

  this.xhttp.addEventListener("load", ()=>{
    this.callback(
      this.xhttp.getAllResponseHeaders(),
      this.xhttp.status + ' ' + this.xhttp.statusText,
      (this.xhttp.responseText ? JSON.parse(this.xhttp.responseText) : false)
    )
  });
  this.xhttp.addEventListener("error", (err)=>{
    this.onError(err);
  });
}
