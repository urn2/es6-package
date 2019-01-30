/**
 * Created by Vea on 16/12/13 013.
 */

import widget from '../../widget';
import todo from './todo';
import fs from "fs";

export default widget({
	template:fs.readFileSync(__dirname + "/template.html", "utf8"),
	new:'',
	list:{},
	event:{
		'data:new':function(e,v){
			console.log(v, this);
		},
		init:function(){
			this.list =todo.list();
		},
		add:function(e){
			let id =todo.add(this.new);
			this.list =todo.list();
			this.new ='';
		},
		delete:function(e, id){
			todo.del(id);
			this.list =todo.list();
		},
		toggle:function(e, id){
			todo.toggle(id);
			this.list =todo.list();
		}
	}


});