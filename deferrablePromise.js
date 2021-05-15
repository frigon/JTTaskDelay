class Task{ 
   _timeout;
   _fx;
  wait(fx, milliseconds){
      this._fx = fx;
      this._timeout = setTimeout(fx,milliseconds);
  }

  delay(milliseconds){
      clearTimeout(this._timeout);
      this._timeout = setTimeout(this._fx,milliseconds);
  }
   
}

//EXAMPLE
var t = new Task();
t.wait(()=> alert('hi'),100);
setTimeout(()=> t.delay(2000),100);


class DeferredPromise{
   callback;
   timeout;
   thenCallback = [];
   
   constructor(){
   }
   
  then(fx){
      this.thenCallback.push(fx);
      return this;
  }

  wait(fx, milliseconds){
      this.callback = fx;
      var that = this;
      this.timeout = setTimeout(() => {
         var results = that.callback();
         for(var i=0; i<that.thenCallback.length; i++){
            that.thenCallback[i](results);
         }
      },milliseconds);
  }

  delay(milliseconds){
      clearTimeout(this.timeout);
      this.wait(this.callback, milliseconds);
  }   
}
//EXAMPLE
var d = new DeferredPromise();
d.then((a)=> console.log("THEN FX", a)).then((a) => console.log("after then", a));
d.wait(() => {alert("passed FX"); return "i returned data";}, 1000);
setTimeout(()=> d.delay(4000), 999);
