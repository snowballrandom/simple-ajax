;(function (){ 
	
'use strict';

var previousRequest = [];

var aRequest = (function(){
	
	var saveRequest = false;
	
	var options = {
		// Request Timeout
		timeout : 0,
		// Cross Domain
		crossDomain : false,
		// Request Method
		method : "POST",
		// Asyncornous
		async : true,
		// Request URL
		url : '',
		// Post Data
		postData : null,
		// Request Headers
		headers : {'X-Requested-With': 'XMLHttpRequest'},
		// Cache (default: true, false for dataType 'script' and 'jsonp')
		cache : false,
		// Content Type (default: 'application/x-www-form-urlencoded; charset=UTF-8') 
                contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		// Process 
                processData : true,
		// Status Code
		statusCode : {
			   404: function(data) {
				 error = true;
				 data = data;				
			   }
			 }
		}
		
	var response = {	
		// Request is complete ?
		isComplete : true,
		// Response Error
		Error : false,
		// Response Status
		Status : undefined,
		// Response XHR Data
		Xhr : undefined,
		// Response Error Data
		Data : undefined,
		// Response Error Messages
		ErrorMsg : [],
		// Previous Request
		Previous : null
		}
		
	// Response Object		
	var	requestObject = {};
			
	var f={};

	f.isComplete = response.isComplete;
	
	// Request Timeout
	f.setTimeout = (timoutLimit)=>{
		options.timeout = timoutLimit; 
	}
	f.getTimeout = ()=>{
		return options.timeout;
	}

	// Allow Cross Domain
	f.setCrossDomain = (isCrossDomain)=>{
		options.crossDomain = isCrossDomain; 
	}
	f.getCrossDomain = ()=>{
		return options.crossDomain;
	}
	
	// Is Async
	f.setAsync = (isAsync)=>{
		options.async = isAsync; 
	}
	f.getAsync = ()=>{
		return options.async;
	}
	
	// Request Method	
	f.setMethod = (requestMethod)=>{
		options.method = requestMethod; 
	}
	f.getMethod = ()=>{
		return options.method;
	}
	
	// Url	
	f.setUrl = (locationUrl)=>{
		options.url = locationUrl; 
	}
	f.getUrl = ()=>{
		return options.url;
	}
	
	// Request Data	
	f.setData = (data)=>{
		options.postData = data; 
	}
	f.getData = ()=>{
		return options.postData;
	}
	
	// Headers
	f.setHeaders = (headersObject)=>{
		options.headers = headersObject; 
	}
	f.getHeaders = ()=>{
		return options.headers;
	}
	
	// Set Cache
	f.setCache = (isCache)=>{
		options.cache = isCache;
	}	
	f.getCache = ()=>{
		return options.cache;
	}	

	/** 
	 * Set ContentType
	 * Type: Boolean or String
	 * default: 'application/x-www-form-urlencoded; charset=UTF-8'
	 *
	 */
	f.setContentType = (type)=>{
		options.contentType = type;
	}	
	f.getContentType = ()=>{
		return options.contentType;
	}
	
	/**
	 * Set processData
	 *
	 * Type: Boolean
	 * By default, data passed in to the data option as 
	 * an object (technically, anything other than a string) 
	 * will be processed and transformed into a query string, 
	 * fitting to the default 
	 * content-type "application/x-www-form-urlencoded". 
	 * If you want to send a DOMDocument, or other non-processed data, 
	 * set this option to false.
	 */
	f.setProcessData = (bool)=>{
		options.processData = bool;
	}	
	f.getProcessData = ()=>{
		return options.processData;
	}	
	
	f.setStatusCode = (object)=>{
		options.statusCode = object;
	}
	f.getStatusCode = ()=>{
		return options.statusCode;
	}
	
	f.setOptions = (o)=>{
		if(typeof o == "object" 
		&& typeof o !== "undefined"){
			requestObject = {};
			$.each(o, function(i,e){
			  requestObject[i] = e;
			})
		}else{
	     requestObject = {
             timeout:options.timeout,
             crossDomain:options.crossDomain,
             method: options.method,
             async: options.async,
             url: options.url,
             data: options.postData,
             headers: options.headers,
	     cache: options.cache,
	     contentType: options.contentType,
	     processData: options.processData,
             statusCode: options.statusCode
           }	
		}
	}
	f.getOptions = ()=>{
		return requestObject;
	}	
	/**
	 * Resets the ajax options to the default values	
	 */
	f.resetOptions = ()=>{
		
		options.timeout = 0,
		// Cross Domain
		options.crossDomain = false,
		// Request Method
		options.method = "POST",
		// Asyncornous
		options.async = true,
		// Request URL
		options.url = '',
		// Post Data
		options.postData = null,
		// Request Headers
		options.headers = {'X-Requested-With': 'XMLHttpRequest'},
		// Cache (default: true, false for dataType 'script' and 'jsonp')
		options.cache = false,
		// Content Type (default: 'application/x-www-form-urlencoded; charset=UTF-8') 
        	options.contentType = "application/x-www-form-urlencoded; charset=UTF-8",
		// Process 
        	options.processData = true,
		// Status Code
		options.statusCode = {
			   404: function(data) {
				 error = true;
				 data = data;				
			   }
			 }
	}
	
	f.getResponse = (previous)=>{
		return {
			error: response.Error,
			status:response.Status,
			xhr:response.Xhr,
			data:response.Data,
			errorMsg:response.ErrorMsg,
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
	 * Saves Last Request 
 	 * this will save the current request 
	 * and the following request. On the 3rd request the 
	 * oldest request will be removed from the array.
	 *   	
	 */
	f.saveLastRequest = ()=>{
		// Return Last Request 
		if(saveRequest){
		  // Remove first item
		  if(previousRequest.length >= 2){
			previousRequest.shift();
		  }	
		  previousRequest.push(f.getResponse());
		  response.Previous = previousRequest;
		}else{
		  response.Previous = [];
		}		
	}
	/**
	 * Simple call does not wrap the ajax request in a promise
	 */
	f.callSimple = ()=>{
	  try{
	    $.ajax(f.getOptions())
		.done(function(data, status, xhr){
			response.Data = data;
			response.Status = status;
			response.Xhr = xhr;
		})
		.fail(function(data_fail, status_fail, xhr_fail){
			response.Error = true;
			response.Data = data_fail;
			response.Status = status_fail;
			response.Xhr = xhr_fail;
			f.saveLastRequest()						
		})
		.always(function(data_always, status_always, xhr_always){
			response.Data = data_always;
			response.Status = status_always;
			response.Xhr = xhr_always;
			response.isComplete = true;
			f.saveLastRequest()
		}).catch(function(error){
			console.log('Error: ajax request error!');
			response.Error = true;
			response.ErrorMsg = error;
			response.isComplete = true;
		})
		
	  }catch(Error){
		console.log(Error);
		response.Error = true;
		response.ErrorMsg = error;
		response.isComplete = true;
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
				response.Data = data;
				response.Status = status;
				response.Xhr = xhr;
			})
			.fail(function(data_fail, status_fail, xhr_fail){
				response.Error = true;
				response.Data = data_fail;
				response.Status = status_fail;
				response.Xhr = xhr_fail;
				f.saveLastRequest()						
			})
			.always(function(data_always, status_always, xhr_always){
				response.Data = data_always;
				response.Status = status_always;
				response.Xhr = xhr_always;	
				
				response.isComplete = true;
				
				f.saveLastRequest()
				
				if(response.Error){
					console.log('Reject');
					reject(f.getResponse(response.Previous));
				}else{
					console.log('Resolve');
					resolve(f.getResponse(response.Previous));
				}					
			}).catch(function(error){
				console.log('Error: ajax request error!');
				response.Error = true;
				response.ErrorMsg = error;
			})
			
		}).catch(function(error){
			console.log('Error: Could not resolve promise!');
			response.Error = true;
			response.ErrorMsg = error;
			isComplete = true;
    	});
	  }catch(Error){
		console.log(Error);
		response.Error = true;
		response.ErrorMsg = error;
		response.isComplete = true;
	  }
	} 
	
	f.call = (options, async=true, lastRequest=false)=>{
		try{
			
			// Request Complete ?
			response.isComplete = false;
			saveRequest = lastRequest;
			
			// Set options ?
			if(Object.keys(requestObject).length == 0
			   || ( typeof options !== "undefined" 
			   && Object.keys(options).length !== 0 ) )
			{
			  f.setOptions(options);
			}
				
			if(async){
				// Return the promise
				return f.callPromise();
			}else{
				f.setAsync(false);
				// Simple Call
				f.callSimple();
			}				
			
			// Return the previous request or null
			return response.Previous;
			
		}catch(Error){
			console.log(Error);
		}
	}	
		
	function init(){
	  return f;
	}
	
	return init();
	
})// End Customers Function

window.aRequest = aRequest;

})();
