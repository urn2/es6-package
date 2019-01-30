const urlencoded = (body) => typeof body === "object"
	?Object.keys(body).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(body[k])).join("&")
	:body + "";
/**
 * fetch 封装 https://developer.mozilla.org/zh-CN/docs/Web/API/Request/Request
 * @param url 请求地址
 * @param method 请求方式
 * @param body 请求内容 get head 时自动转换成query
 * @param headers 请求头
 * @param mode 默认cors
 * @param credentials 认证方式 include 带cookie
 * @param cache 缓存模式
 * @param redirect 跳转模式
 * @param referrer 来源设置
 * @param referrerPolicy 来源策略
 * @param bodyJson
 * @returns {*}
 */
const xhr = function(url, method = "get", body = "", {
	headers = {},
	mode = "cors",
	credentials = "omit",
	cache = "default",
	redirect = "follow",
	referrer = "client",
	referrerPolicy = "no-referrer",//'no-referrer-when-downgrade',
	bodyJson = true,
} = {}){
	if(!("fetch" in window)) return new Promise((resolve, reject) => reject("您的浏览器不支持fetch，无法继续执行"));
	else if(!("Promise" in window)) return new Promise((resolve, reject) => reject("您的浏览器不支持Promise，无法继续执行"));

	method = method.toUpperCase();
	switch(method){
		case "GET":
		case "HEAD":
			let b = urlencoded(body);
			if(b.length > 0) url = url + (url.search(/\?/) !== -1 ?"&" :"?") + b;
			body = null;
			break;
		case "POST":
			if(body.constructor.name !== "Object") break;
		case "PUT":
		case "PATCH":
		case "DELETE":
			if(typeof body === "object"){
				if(!bodyJson){
					headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
					body = urlencoded(body);
				}else{
					headers["Content-Type"] = "application/json; charset=UTF-8";
					body = JSON.stringify(body);
				}
			}
			break;
	}
	return fetch(url, {
		method,
		headers,
		body,
		mode,
		credentials,//cookie
		cache,
		redirect,
		referrer,
		referrerPolicy,
		// integrity,
	});
};

export default (url, setting2 = {}) =>{
	return {
		get:(body = "", setting = {}) => xhr(url, "get", body, Object.assign({}, setting2, setting)),
		post:(body = "", setting = {}) => xhr(url, "post", body, Object.assign({}, setting2, setting)),
		put:(body = "", setting = {}) => xhr(url, "put", body, Object.assign({}, setting2, setting)),
		delete:(body = "", setting = {}) => xhr(url, "delete", body, Object.assign({}, setting2, setting)),
		normal:(body = "", setting = {}, method = "get") => xhr(url, method, body, Object.assign({}, setting2, setting)),
	};
};