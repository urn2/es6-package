'use strict';

import ready from 'web-es6/ready';
import todo from './index'

ready(()=>{
	new todo({el:'body'});
});