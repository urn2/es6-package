'use strict';
/**
 * ajax 模块
 * @param url
 * @param type [fetch|xhr]
 * @returns {{get: (function(*=): (Promise)), post: (function(*=): (Promise)), put: (function(*=): (Promise)), delete: (function(*=): (Promise)), request: (function(*=, *=): (Promise))}}
 */


let DEBUG={};

const parse_default={
	fetch:{
		text:(response, resolve, reject)=>{
			response.text().then((text)=>{
				resolve(text);
			}).catch(()=>{
				reject({err:1, msg:'服务器返回失败，无法解析返回内容'});
			});
		},
		api:(response, resolve, reject)=>{
			response.json().then((json)=>{
				let {err, data, msg}=json;
				if(err==0){
					resolve(data);
				}else{
					return reject({err, msg});
				}
			}).catch(()=>{
				reject({err:1, msg:'服务器返回失败，无法解析返回内容'});
			});
		},
		blob:(response, resolve, reject)=>{
			response.blob().then((blob)=>{
				resolve(blob);
			}).catch(()=>{
				reject({err:1, msg:'服务器返回失败，无法解析返回内容'});
			});
		},
		img:(response, resolve, reject)=>{
			DEBUG.log && console.log('parse.img[f]', 'in');
			response.blob().then((blob)=>{
				let img=document.createElement('img');
				let src=window.URL.createObjectURL(blob);
				img.addEventListener('load', function(){
					DEBUG.log && console.log('parse.img[f]', 'load');
					resolve({width:this.width, height:this.height, src:src, img:this});
				}, true);
				img.addEventListener('error', function(){
					DEBUG.log && console.log('parse.img[f]', 'error');
					reject({err:1, msg:'图片格式错误，加载图片失败'});
				});
				DEBUG.log && console.log('parse.img[f]', 'src');
				img.src=src;
			}).catch(()=>{
				reject({err:1, msg:'服务器返回失败，无法解析返回内容'});
			});
		},
	},
	xhr:{
		api:(response, resolve, reject)=>{
			try{
				let {err, data, msg} = JSON.parse(response.responseText);
				if(err==0) resolve(data);
				else return reject({err, msg});
			}catch(e){
				reject({err:1, msg:'服务器返回失败，无法解析返回内容'});
			}
		},
		text:(response, resolve)=>{
			resolve(response.responseText);
		},
		blob:(response, resolve)=>{
			resolve(response.response);
		},
		img:(response, resolve, reject)=>{
			DEBUG.log && console.log('parse.img', 'in');
			return new Promise((resolve1, reject1)=>{
				DEBUG.log && console.log('parse.img', 'start');
				let img=document.createElement('img');
				let src=URL.createObjectURL(response.response);
				img.addEventListener('load', function(){
					DEBUG.log && console.log('parse.img', 'load');
					resolve1({width:this.width, height:this.height, src:src, img:this});
				}, true);
				img.addEventListener('error', function(){
					DEBUG.log && console.log('parse.img', 'error');
					reject1({err:1, msg:'图片格式错误，加载图片失败'});
				});
				DEBUG.log && console.log('parse.img', 'src');
				img.src=src;
			}).catch((e)=>reject(e));
		},
	},
};

const urlencoded=(body)=>typeof body==='object' ?Object.keys(body).map((k)=>encodeURIComponent(k)+'='+encodeURIComponent(body[k])).join('&') :body+'';

const ajax=(url, type='xhr')=>{
	const fun={
		/**
		 * 获取指定接口内容
		 * @param method 请求使用的方法，如 GET、POST。
		 * @param body 可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
		 * @param headers 请求的头信息，形式为 Headers 对象或 ByteString。
		 * @param mode 请求的模式，如 cors、 no-cors 或者 same-origin。
		 * @param cache 请求的 cache 模式: default, no-store, reload, no-cache, force-cache, or only-if-cached.
		 * @param credentials 请求的 credentials，如 omit、same-origin 或者 include。
		 * @param cookie
		 * @param bodyJson
		 * @param parse
		 * @param before
		 * @returns {Promise}
		 */
		fetch(method='get', body='', {headers={}, mode='cors', cache='default', credentials=null, cookie=false, bodyJson=false, parse='api', before=false}={}){
			if(!("fetch" in window)) return new Promise((resolve, reject)=>reject('您的浏览器不支持fetch，无法继续执行'));
			else if(!("Promise" in window)) return new Promise((resolve, reject)=>reject('您的浏览器不支持Promise，无法继续执行'));

			method=method.toUpperCase();
			let data={method, headers, mode, cache, credentials};
			switch(method){
				case 'GET':
				case 'HEAD':
					let b=urlencoded(body);
					if(b.length>0) url=url+(url.search(/\?/)!= -1 ?'&' :'?')+b;
					break;
				case 'POST':
					if(body.constructor.name!=='Object') break;
				case 'PUT':
				case 'DELETE':
					if(typeof body=='object'){
						if(!bodyJson){
							data.headers['Content-Type']="application/x-www-form-urlencoded";
							data.body=urlencoded(body);
						}else data.body=JSON.stringify(body);
					}else data.body=body;
					break;
				default:
					data.body=body;
			}
			if(cookie) data.credentials='include';
			if(typeof parse=='string' && parse_default[type][parse]) parse=parse_default[type][parse];

			return new Promise((resolve, reject)=>{
				DEBUG.log && console.log('ajax.fetch', 'start');
				let f=fetch(url, data);
				if(typeof before=='function') before(f, resolve, reject);
				if(typeof parse=='function') f.then(response=>parse(response, resolve, reject));
				else f.then((response)=>resolve(response));
				f.catch(msg=>{
					err:1, msg
				});
			});
		},
		/**
		 *
		 * @param method
		 * @param body
		 * @param headers
		 * @param user
		 * @param password
		 * @param bodyJson
		 * @param progress
		 * @param parse
		 * @param before
		 * @returns {Promise}
		 */
		xhr(method='get', body='', {headers={}, user='', password='', bodyJson=false, progress=false, parse='api', before=false}={}, async=true){
			if(!("XMLHttpRequest" in window)) return new Promise((resolve, reject)=>reject('您的浏览器不支持XMLHttpRequest，无法继续执行'));
			method=method.toUpperCase();
			switch(method){
				case 'GET':
				case 'HEAD':
					let b=urlencoded(body);
					if(b.length>0) url=url+(url.search(/\?/)!= -1 ?'&' :'?')+b;
					break;
				case 'POST':
					if(body.constructor.name!=='Object') break;
				case 'PUT':
				case 'DELETE':
					if(typeof body=='object'){
						if(!bodyJson){
							headers['Content-Type']="application/x-www-form-urlencoded; charset=UTF-8";
							body=urlencoded(body);
						}else body=JSON.stringify(body);
					}
					break;
			}
			let parseType='';
			if(typeof parse=='string' && parse_default[type][parse]){
				parseType=parse;
				parse=parse_default[type][parse];
			}

			return new Promise((resolve, reject)=>{
				DEBUG.log && console.log('ajax.xhr', 'start');
				let xhr=new XMLHttpRequest();
				xhr.open(method, url, async, user, password);
				Object.keys(headers).forEach((k)=>xhr.setRequestHeader(k, headers[k]));
				if(progress.constructor.name=='Function') xhr.addEventListener('progress', progress);
				xhr.onload=function(){
					if(this.status>=200 && this.status<400){
						if(typeof parse=='function'){
							let p=parse(this, resolve, reject);
							if(p && p.constructor.name=='Promise') return p.then((x)=>resolve(x)).catch((e)=>reject(e));
						}
						resolve(this);
					}else reject({err:1, msg:this.statusText});
				};
				xhr.onerror=function(){
					reject({err:1, msg:this.statusText});
				};
				if(parseType.toLowerCase()=='blob' || parseType.toLowerCase()=='img') xhr.responseType='blob';
				if(typeof before=='function') before(xhr, resolve, reject);
				xhr.send(body);
			});
		}
	};
	return {
		get:(body='', setting={})=>fun[type]('get', body, setting),
		post:(body='', setting={})=>fun[type]('post', body, setting),
		put:(body='', setting={})=>fun[type]('put', body, setting),
		delete:(body='', setting={})=>fun[type]('delete', body, setting),
		request:(body='', setting={}, method='get')=>fun[type](method, body, setting),
	}
};

export default ajax;
