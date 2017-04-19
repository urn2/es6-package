import widget from '../../widget';
import tpl from './template.html';

let cls=widget({
	template:tpl,
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