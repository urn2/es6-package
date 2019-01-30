import widget from '../../widget';
import fs from "fs";

let cls=widget({
	template:fs.readFileSync(__dirname + "/template.html", "utf8"),
	class:'',
	bool:false,
	bool2:false,
	event:{
		changeClass:function(e){
			this.class='red';
		},
		changeBool:function(e){
			this.bool =!this.bool;
		},
		changeBool2:function(e){
			this.bool2 =!this.bool2;
		},
	},
});

new cls({el:'body'});