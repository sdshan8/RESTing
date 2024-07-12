/**
  * @constructs useFetch - makes a fetch request
  * @param {function} callback - funtion to callback. passes (header, status, data) as parameters
  * @param {function} onError - funtion to call on error. passes (error) as parameters
  */
function useFetch(callback, onError) {

  /**
    * @function send - sends the request.
    * @param {object} inputs - object of the inputs
    * @returns {void}
    */
  this.send = async (inputs) => {

    request_headers = new Headers();

    request_headers.append('Content-type', 'application/json')

    if(inputs.send_header && inputs.header){
      for (var key in JSON.parse(inputs.header)){
        request_headers.append(key, header[key]);
      };
    }
    let fetchinstance;
    if (inputs.method == ("HEAD" || "GET")) {
      fetchinstance = await fetch(inputs.url, {
        method: inputs.method,
        headers: request_headers
      }).catch(err => {
        onError(err);
      })
    } else {
      fetchinstance = await fetch(inputs.url, {
        method: inputs.method,
        headers: request_headers,
        body: inputs.data
      }).catch(err => {
        onError(err);
      })
    }
    this.response_header = '';
    fetchinstance.headers.forEach((value, key) => {
      this.response_header += key + ': ' + value + '\n'
    })
    this.response_json = await fetchinstance.json();

    callback(
      this.response_header,
      fetchinstance.status + ' ' + fetchinstance.statusText,
      this.response_json)

    return void(0);
  }
}
