import widget from '../../widget';
import fs from "fs";

let bind=widget({
	template:fs.readFileSync(__dirname + "/template.html", "utf8"),
	span:'s',
	input:'d',
	a:0,
	b:0,
	event:{
		init:function(){
			'use strict';
			this.span ='123';

			let c=this.el.querySelector('#computed');
			setInterval(()=>{
				c.innerHTML =this.c;
			}, 300);
		},
		getC:function(e){
			e.target.innerHTML =this.c;
		},
	},
	calc:{
		c:function(){
			return parseInt(this.a)+parseInt(this.b);
		}
	}
});

new bind({el:'body'});