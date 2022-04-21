# Simple Ajax
A simple way to make ajax request. 

This allow you to make ajax calls with out having to define every value every time. You can either set the values you want in the file
or change as needed on each request with the built in functions. I built this as a easy way to make similar request with out having to clutter up the space in other javascript files and allow me to make various types of calls as needed.

Example:

```javascript

myRequest = new aRequest();

// Make async ajax call 
myRequest.call({url:'someurl.someplace'}).then(
  function(response){
    console.log(response)
  }
);

// Or get the response later by calling
myRequest.getResponse()

// Making none async call 
myRequest.call({url:'someurl'}, false);

// Get the response
myRequest.getResponse()

// If you want to return the previous response 
// on the next response you can by setting the third paramerter to true
myRequest.call({url:'https://goinvoiceit.co/'}, true, true)
.then(
  function(response){
    console.log(response.previous)
  }
);

// Passing in custom options
myRequest.call({
  url:'someurl',
  data:{
    someParam:'some_value'
    },
  headers:aRequest.getHeaders(),
  crossDomain:aRequest.getCrossDomain(),
  async:true, 
  timeout:0,
  method:'post'
  }, true, true)
  .then(
  function(response){
    console.log(response)
  })

```
I will add examples on other options soon!
