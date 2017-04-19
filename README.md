
#widget
dosomething.js
```javascript
import widget from 'web-es6/widget'

export default widget({
  event:{
    init:function(){
      this.doSomething()
    }
  },
  doSomething:function(){
    this.el.innerHTML ='do something';
  }
})
```

run.js
```javascript
import ds from `dosomething.js`;

new ds({el:body});
```

#ready

```javascript
import ready from 'web-es6/ready'

ready(()=>{
  console.log("it's document ready.");
}, {
  'hi':()=>{
    console.log("hash is #hi");
  }
});
```

#ajax

```javascript
import ajax from 'web-es6/ajax';

let getUser =ajax('/user').get({page:1, max:10});
getUser().then((data)=>{
  //doAnythingYouWant();
});
```