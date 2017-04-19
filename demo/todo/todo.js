/**
 * Created by Vea on 16/12/14 014.
 */
'use strict';

let todo =function(){
	let list=JSON.parse(localStorage['todo'] ?localStorage['todo'] :'{}');

	function save(){
		localStorage['todo'] =JSON.stringify(list);
		return true;
	}

	return {
		add(text){
			let id =(new Date()).getTime();
			list[id] ={
				id:id,
				text:text,
				done:false,
			};
			save();
			return id;
		},
		toggle(id){
			list[id]['done'] =!list[id]['done'];
			save();
		},
		del(id){
			delete list[id];
			save();
		},
		list(){
			return list;
		},
	}
}();

export default todo;