'use strict';
/**
 * 等待文档加载完毕
 * @param fn
 */
export default (fn, map={})=>{
	if(typeof fn!=='function'){
		map=fn;
		fn=()=>{};
	}
	let match=()=>{
		let hash=location.hash.substr(1);
		if(hash==='' && map['default']) map['default']();
		else{
			let match=false;
			for(let i in map){
				let m=location.hash.substr(1).match(i);
				if(m && m.length>0){
					m.shift();
					map[i](...m);
					match=true;
				}
			}
			if(match==false && map[404]) map[404]();
		}
	};
	let done=()=>{
		fn();
		match();
	};
	if(Object.keys(map).length>0) window.addEventListener("hashchange", match, false);
	if(document.readyState!='loading') done();
	else document.addEventListener('DOMContentLoaded', done);
};

export const reset=()=>{
	let e=new CustomEvent('hashchange', {bubbles:true, cancelable:true});
	window.dispatchEvent(e);
};