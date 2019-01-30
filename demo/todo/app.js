'use strict';

import ready from '../../ready';
import todo from './index'

ready(()=>{
	new todo({el:'body'});
});