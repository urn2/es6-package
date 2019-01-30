import widget from './widget';
import Mustache from 'mustache';

const makeRender=function(el, str){
	Mustache.parse(str);
	return function(data){
		el.innerHTML=Mustache.render(str, data);
	}
};

widget.colon('mustache', function(instance, target, attr){
	let [key, tpl_id=false] =attr.value.split(':');
	let html='';
	if(tpl_id){
		if(widget.caches.template[tpl_id]) html =widget.caches.template[tpl_id];
		else{
			let tpl = document.querySelector(tpl_id);
			if(!tpl) throw "错误的模板文件，无法获取模板";
			html = widget.caches.template[tpl_id]=tpl.innerHTML;
			tpl.parentNode.removeChild(tpl);
		}
	}else html=target.innerHTML;

	let render=makeRender(target, html);
	render(instance[key]);
	instance.event('data:'+key, (e, value)=>{
		render(value);
	});
});

export default widget;