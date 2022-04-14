;(function (){ 
	
'use strict';

var aRequest = (function(){
	
	var // Request Timeout
		timeout = 0,
		// Cross Domain
		crossDomain = false,
		// Request Method
		method = "POST",
		// Asyncornous
		async = true,
		// Request URL
		url = '',
		// Post Data
		postData = null,
		// Request Headers
		headers = {'X-Requested-With': 'XMLHttpRequest'},
		// Request is complete ?
		isComplete = true,
		// Response Error
		responseError = false,
		// Response Status
		responseStatus = undefined,
		// Response XHR Data
		responseXhr = undefined,
		// Response Error Data
		responseData = undefined,
		// Response Error Messages
		responseErrorMsg = [],
		// Response Object		
		requestObject = {},
		// Previous Request
		previousRequest = null;
		
	var f={};

	f.isComplete = isComplete;
	
	// Request Timeout
	f.setTimeout = (timoutLimit)=>{
		timeout = timoutLimit; 
	}
	f.getTimeout = ()=>{
		return timeout;
	}

	// Allow Cross Domain
	f.setCrossDomain = (isCrossDomain)=>{
		crossDomain = isCrossDomain; 
	}
	f.getCrossDomain = ()=>{
		return crossDomain;
	}
	
	// Is Async
	f.setAsync = (isAsync)=>{
		async = isAsync; 
	}
	f.getAsync = ()=>{
		return async;
	}
	
	// Request Method	
	f.setMethod = (requestMethod)=>{
		method = requestMethod; 
	}
	f.getUrl = ()=>{
		return method;
	}
	
	// Url	
	f.setUrl = (locationUrl)=>{
		url = locationUrl; 
	}
	f.getUrl = ()=>{
		return url;
	}
	
	// Request Data	
	f.setData = (data)=>{
		postData = data; 
	}
	f.getData = ()=>{
		return postData;
	}
	
	// Headers
	f.setHeaders = (headersObject)=>{
		headers = headersObject; 
	}
	f.getHeaders = ()=>{
		return headers;
	}
			
	f.setOptions = (options)=>{
		if(typeof options == "object" 
		&& typeof options !== "undefined"){
			requestObject = {};
			$.each(options, function(i,e){
				requestObject[i] = e;
			})
		}else{
		   requestObject = {
        	 timeout:timeout,
        	 crossDomain:crossDomain,
             method: method,
             async: async,
             url: url,
             data: postData,
             headers: headers,
             statusCode: {
			   404: function(data) {
				 error = true;
				 data = data;				
			   }
			 }
           }	
		}
	}
	f.getOptions = ()=>{
		return requestObject;
	}	
	
	f.getResponse = (previous)=>{
		return {
			error: responseError,
			status:responseStatus,
			xhr:responseXhr,
			data:responseData,
			errorMsg:responseErrorMsg,
			previous:previous
		}	
	}
	
	f.tryParseJSON = (data) => {
		try{
			var o = JSON.parse(data);
	        if (o && typeof o === "object") {
	            return o;
	        }		
		}catch(e){}
		return false;
	}	
	/**
	 * Simple call does not wrap the ajax request in a promise
	 */
	f.callSimple = ()=>{
	  try{
	    $.ajax(f.getOptions())
		.done(function(data, status, xhr){
			responseData = data;
			responseStatus = status;
			responseXhr = xhr;
		})
		.fail(function(data_fail, status_fail, xhr_fail){
			responseError = true;
			responseData = data_fail;
			responseStatus = status_fail;
			responseXhr = xhr_fail;						
		})
		.always(function(data_always, status_always, xhr_always){
			responseData = data_always;
			responseStatus = status_always;
			responseXhr = xhr_always;
			isComplete = true;
		}).catch(function(error){
			console.log('Error: ajax request error!');
			responseError = true;
			responseErrorMsg = error;
			isComplete = true;
		})
		
	  }catch(Error){
		console.log(Error);
		responseError = true;
		responseErrorMsg = error;
		isComplete = true;
	  }				
	} 
	/**
	 * Wraps the ajax request in a promise
	 */	
	f.callPromise = async ()=>{
	  try{
		
		return new Promise(function(resolve, reject){
			
		   //aRequest.doSubmit(url, postData);
		   $.ajax(f.getOptions())
			.done(function(data, status, xhr){
				responseData = data;
				responseStatus = status;
				responseXhr = xhr;
			})
			.fail(function(data_fail, status_fail, xhr_fail){
				responseError = true;
				responseData = data_fail;
				responseStatus = status_fail;
				responseXhr = xhr_fail;						
			})
			.always(function(data_always, status_always, xhr_always){
				responseData = data_always;
				responseStatus = status_always;
				responseXhr = xhr_always;	
				
				isComplete = true;
				
				if(responseError){
					console.log('Reject');
					reject(f.getResponse(previousRequest));
				}else{
					console.log('Resolve');
					resolve(f.getResponse(previousRequest));
				}					
			}).catch(function(error){
				console.log('Error: ajax request error!');
				responseError = true;
				responseErrorMsg = error;
			})
			
		}).catch(function(error){
			console.log('Error: Could not resolve promise!');
			responseError = true;
			responseErrorMsg = error;
			isComplete = true;
    	});
	  }catch(Error){
		console.log(Error);
		responseError = true;
		responseErrorMsg = error;
		isComplete = true;
	  }
	} 
	
	f.call = (options, isPromise=true, lastRequest=false)=>{
		try{
			
			// Request Complete ?
			isComplete = false;
			
			// Set options ?
			if(Object.keys(requestObject).length == 0
			   || ( typeof options !== "undefined" 
			   && Object.keys(options).length !== 0 ) )
			{
			  f.setOptions(options);
			}
			
			// Return Last Request 
			if(lastRequest){
			  previousRequest = f.getResponse();
			}else{
			  previousRequest = null;
			}
				
			if(isPromise){
				// Return the promise
				return f.callPromise();
			}else{
				// Simple Call
				f.callSimple();
			}				
			
			// Return the previous request or null
			return previousRequest;
			
		}catch(Error){
			console.log(Error);
		}
	}	
	
	function init(){
    // Return the functions
		return = f;
	}
	
  // Initialize & return
	return init();
	
})// End aRequest()

window.aRequest = aRequest();

})();
