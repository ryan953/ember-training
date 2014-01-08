/*global xml2json */

window.FreshBooksAPI = (function() {
	"use strict";

	// methods from underscore.js
	var ArrayProto = Array.prototype,
		slice = ArrayProto.slice,
		nativeForEach = ArrayProto.forEach,
		breaker = {},

		isObject = function(obj) {
			return obj === Object(obj);
		},

		has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
		},

		// The cornerstone, an `each` implementation, aka `forEach`.
		// Handles objects with the built-in `forEach`, arrays, and raw objects.
		// Delegates to **ECMAScript 5**'s native `forEach` if available.
		each = function(obj, iterator, context) {
			if (obj == null) return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i++) {
					if (iterator.call(context, obj[i], i, obj) === breaker) return;
				}
			} else {
				for (var key in obj) {
					if (has(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === breaker) return;
					}
				}
			}
		},

		// Extend a given object with all the properties in passed-in object(s).
		extend = function(obj) {
			each(slice.call(arguments, 1), function(source) {
				if (source) {
					for (var prop in source) {
						obj[prop] = source[prop];
					}
				}
			});
			return obj;
		};

	var urls = {
		resourceUrl: function(credentials) {
			return internal.getUrl(credentials, '/api/2.1/xml-in');
		},

		requestTokenUrl: function(credentials) {
			return internal.getUrl(credentials, '/oauth/oauth_request.php');
		},

		authorizeTokenUrl: function(credentials, token) {
			return internal.getUrl(credentials, '/oauth/oauth_authorize.php?oauth_token=' + token);
		},

		accessTokenUrl: function(credentials) {
			return internal.getUrl(credentials, '/oauth/oauth_access.php');
		},
	};

	var internal = {
		getUrl: function(credentials, path) {
			return (credentials && credentials.url !== '' ? 'https://' + credentials.url : '') + path;
		},

		qsParse: function(queryString) {
			var data = {};

			var parts = queryString.split('&');
			each(parts, function(part) {
				var pairs = part.split('=');
				data[pairs[0].toLowerCase()] = pairs[1];
			});
			return data;
		},

		checkNoneEmpty: function(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (!obj[key]) {
						return false;
					}
				}
			}
			return obj;
		},

		getOAuthCallbackParams: function(obj) {
			if (obj.oauth_token && obj.oauth_verifier) {
				return {
					oauth_token: obj.oauth_token,
					oauth_verifier: obj.oauth_verifier
				};
			} else {
				return null;
			}
		},

		buildBasicAuthHeader: function(username, password) {
			var tok = username + ':' + password;
			var hash = window.btoa(tok);
			return "Basic " + hash;
		},

		buildOAuthHeader: function(consumerKey, consumerSecret, accessToken, accessTokenSecret, callback, verifier) {
			var components = ['OAuth realm=""'],
				keyVals = {
					'oauth_version': '1.0',
					'oauth_consumer_key': consumerKey,
					'oauth_timestamp': internal.getTimestamp(),
					'oauth_nonce': internal.getNonce(),
					'oauth_signature_method': 'PLAINTEXT',
					'oauth_signature': consumerSecret + '%2526' + accessTokenSecret,
					'oauth_token': accessToken,
					'oauth_callback': callback,
					'oauth_verifier': verifier
				};

			each(keyVals, function(val, key) {
				components.push(key + '="' + val + '"');
			});
			return components.join(',');
		},

		buildXml: function(method, fieldTree) {
			if (method === "") {
				return '';
			}

			return [
				'<?xml version="1.0" encoding="utf-8"?>',
				'<request method="' + method + '">',
				internal.buildXmlTags(fieldTree),
				'</request>'
			].join('');
		},

		buildXmlTags: function(tree) {
			if (isObject(tree)) {
				var xml = '';
				each(tree, function(nodes, tag) {
					var start = '<' + tag + '>',
						end = '</' + tag + '>';
					if (Array.isArray(nodes)) {
						each(nodes, function(node) {
							xml += start + internal.buildXmlTags(node) + end;
						});
					} else {
						xml += start + nodes + end;
					}
				});
				return xml;
			}
			return tree;
		},

		request: function(url, authorization, xml, onSuccess, onError, contentType, responseType) {
			onSuccess = onSuccess || function() {};
			onError = onError || function() {};
			contentType = internal.defaultContentType(contentType);
			responseType = internal.defaultResponseType(responseType);

			// if jquery is around then use it!
			if ($.ajax) {
				return this.jqRequest(url, authorization, xml, onSuccess, onError, contentType, responseType);
			} else {
				return this.xhrRequest(url, authorization, xml, onSuccess, onError, contentType, responseType);
			}
		},

		xhrRequest: function(url, authorization, xml, onSuccess, onError, contentType, responseType) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('FB-User-Agent', 'FreshBooks Easy Api');
			xhr.setRequestHeader('Authorization', authorization);
			xhr.setRequestHeader('content-type',  contentType);

			if (typeof responseType !== '') {
				xhr.responseType = responseType;
			}
			xhr.onreadystatechange = function(progress) {
				var target = progress.target;
				if (target.readyState < 4) {
					return; // wait for the request to finish
				}

				if (200 <= target.status && target.status < 300) {
					var payload = target.response;
					if (xml2json && {'xml':1, '':1}[responseType]) {
						payload = xml2json(payload);
					}

					onSuccess.call(target,
						payload,
						target.status,
						target.statusText,
						target
					);
				} else {
					onError.call(target);
				}
			};
			xhr.onError = onError;
			xhr.send(xml);

			return xhr;
		},

		jqRequest: function(url, authorization, xml, onSuccess, onError, contentType, responseType) {
			return $.ajax({
				url: url,
				type: 'POST',
				headers: {
					'FB-User-Agent': 'FreshBooks Easy Api',
					'Authorization': authorization
				},
				contentType: contentType,
				processData: false,
				data: xml,
				accepts: responseType,
				success: function(response, status, jqXHR) {
					var payload = jqXHR.responseText;
					if (xml2json && {'xml':1, '':1}[responseType]) {
						payload = xml2json(payload);
					}
					jqXHR.response = jqXHR.responseText;
					onSuccess.call(this.xhr,
						payload,
						jqXHR.status,
						jqXHR.statusText,
						jqXHR
					);
				},
				error: onError
			});
		},

		defaultContentType: function(type) {
			return typeof type !== 'undefined' || type !== '' ? type  : 'application/x-www-form-urlencoded';
		},

		defaultResponseType: function(type) {
			return type || '';
		},

		getTimestamp: function() {
			var t = (new Date()).getTime();
			return Math.floor(t / 1000);
		},

		// From Netflix's oauth implementation
		getNonce: function() {
			var i, rnum,
				nonceLength = 15,
				chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
				result = '';
			for (i = 0; i < nonceLength; ++i) {
				rnum = Math.floor(Math.random() * chars.length);
				result += chars.substring(rnum, rnum+1);
			}
			return result;
		}
	};

	var staticTokenApi = {
		requestAuth: function(creds) {
			return internal.buildBasicAuthHeader(creds.token, 'X');
		},

		curlAuth: function(creds) {
			return 'curl -k -u ' + creds.token + ':X';
		},

		curlCommand: function(creds, body) {
			body = body || '';
			return staticTokenApi.curlAuth(creds) + ' ' + urls.resourceUrl(creds) + " -d '" + body + "'";
		}
	};

	var staticOAuthApi = {
		requestAuth: function(creds, returnUrl) {
			return internal.buildOAuthHeader(
				creds.consumerKey,
				creds.consumerSecret,
				creds.accessToken,
				creds.accessSecret,
				returnUrl,
				''
			);
		},

		curlAuth: function(creds, returnUrl) {
			return [
				'curl',
				'-k',
				'-H',
				"'Authorization: " + staticOAuthApi.requestAuth(creds, returnUrl) + "'"
			].join(' ');
		},

		curlCommand: function(creds, returnUrl, body) {
			body = body || '';
			return staticOAuthApi.curlAuth(creds, returnUrl) + ' ' + urls.resourceUrl(creds) + " -d '" + body + "'";
		},

		requestVerifierUrl: function(url, consumerKey, consumerSecret, returnUrl, onSuccess, onError) {
			return internal.request(
				urls.requestTokenUrl({url: url}),
				internal.buildOAuthHeader(
					consumerKey,
					consumerSecret,
					'',
					'',
					returnUrl || '',
					''
				),
				'', // xml body is empty
				function(response, status, statusText, xhr) {
					var keys = internal.qsParse(xhr.responseText);
					if (keys.oauth_token) {
						onSuccess.call(this, urls.authorizeTokenUrl({url: url}, keys.oauth_token, xhr));
					} else {
						onError.call(this, xhr);
					}
				},
				onError
			);
		},

		afterCallbackHydrate: function(url, consumerKey, consumerSecret, queryString, onSuccess, onError) {
			var data = internal.getOAuthCallbackParams(
				internal.qsParse(queryString)
			);
			if (!data) {
				return;
			}
			return staticOAuthApi.requestPermToken(
				url,
				consumerKey,
				consumerSecret,
				data.oauth_token,
				data.oauth_verifier,
				onSuccess,
				onError
			);
		},

		requestPermToken: function(url, consumerKey, consumerSecret, token, verifier, onSuccess, onError) {
			return internal.request(
				urls.accessTokenUrl({url: url}),
				internal.buildOAuthHeader(
					consumerKey,
					consumerSecret,
					token,
					'',
					'/',
					verifier
				),
				'',
				function(response, status, statusText, xhr) {
					var data = internal.qsParse(xhr.responseText);
					if (data.oauth_token && data.oauth_token_secret) {
						onSuccess.call(this, data.oauth_token, data.oauth_token_secret, xhr);
					} else {
						onError.call(this, xhr);
					}
				},
				onError
			);
		}
	};

	var setCredentials = function(creds) {
		this.credentials = internal.checkNoneEmpty(creds);
		if (!this.credentials) {
			throw new Error('Invalid params');
		}
		return true;
	};

	function FreshBooksTokenApi(credentials) {
		this.setCredentials(credentials);
	}
	function FreshBooksOAuthApi(credentials) {
		this.setCredentials(credentials);
	}

	FreshBooksTokenApi.prototype = extend(
		FreshBooksTokenApi.prototype,
		{resourceUrl: urls.resourceUrl},
		{
			setCredentials: function(credentials) {
				return setCredentials.call(this, extend({
					url: '',
					token: ''
				}, credentials));
			},

			curlCommand: function(body) {
				return staticTokenApi.curlCommand(this.credentials, body);
			},

			request: function(method, data, onSuccess, onError, contentType, responseType) {
				return internal.request(
					urls.resourceUrl(this.credentials),
					staticTokenApi.requestAuth(this.credentials),
					internal.buildXml(method, data),
					onSuccess,
					onError,
					contentType,
					responseType
				);
			}
		}
	);

	FreshBooksOAuthApi.prototype = extend(
		FreshBooksOAuthApi.prototype,
		urls,
		{
			setCredentials: function(credentials) {
				return setCredentials.call(this, extend({
					url: '',
					consumerKey: '',
					consumerSecret: '',
					accessToken: '',
					accessSecret: ''
				}, credentials));
			},

			curlCommand: function(body) {
				return staticOAuthApi.curlCommand(this.credentials, '', body);
			},

			request: function(method, data, onSuccess, onError, contentType, responseType) {
				return internal.request(
					urls.resourceUrl(this.credentials),
					staticOAuthApi.requestAuth(this.credentials),
					internal.buildXml(method, data),
					onSuccess,
					onError,
					contentType,
					responseType
				);
			}
		}
	);

	return {
		resourceUrl: urls.resourceUrl,
		buildXml: internal.buildXml,

		Token: extend(
			function(credentials) {
				return new FreshBooksTokenApi(credentials);
			},
			{
				resourceUrl: urls.resourceUrl,
				request: function(creds, method, data, onSuccess, onError, contentType, responseType) {
					return internal.request(
						urls.resourceUrl(creds),
						staticTokenApi.requestAuth(creds),
						internal.buildXml(method, data),
						onSuccess,
						onError,
						contentType,
						responseType
					);
				}
			},
			staticTokenApi
		),

		OAuth: extend(
			function(credentials) {
				return new FreshBooksOAuthApi(credentials);
			},
			urls,
			{
				request: function(creds, method, data, onSuccess, onError, contentType, responseType) {
					return internal.makeRequest(
						urls.resourceUrl(creds),
						staticOAuthApi.requestAuth(creds),
						internal.buildXml(method, data),
						onSuccess,
						onError,
						contentType,
						responseType
					);
				}
			},
			staticOAuthApi
		)
	};
})();
