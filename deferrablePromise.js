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
   catchCallbacks = [];
   finallyCallbacks = [];
   
  then(fx){
      this.thenCallback.push(fx);
      return this;
  }  

  catch(fx){
    this.catchCallbacks.push(fx);
    return this;
  }

   finally(fx){      
      this.finallyCallbacks.push(fx);
      return this;
   }

  wait(fx, milliseconds){
      this.callback = fx;
      var that = this;
      this.timeout = setTimeout(() => {
         try{
            var results = that.callback();
            for(var i=0; i<that.thenCallback.length; i++){
               console.log(i);
               results = that.thenCallback[i](results);
            }            
         }catch(ex){
            for(var i=0; i<that.catchCallbacks.length; i++){
               that.catchCallbacks[i](ex);
            }            
         }
         for(var i=0; i<that.finallyCallbacks.length; i++){
            that.finallyCallback();
         }
      }, milliseconds);
  }

  delay(milliseconds){
      clearTimeout(this.timeout);
      this.wait(this.callback, milliseconds);
  }   
}

//EXAMPLE THEN
var d = new DeferredPromise();
d.then((a)=> {console.log("THEN FX", a); return "changed data";}).then((a) => console.log("after then", a));
d.catch(console.warn);
d.wait(() => {alert("passed FX"); return "i changed data";}, 1000);
setTimeout(()=> d.delay(4000), 999);

//EXAMPLE CATCH
var d = new DeferredPromise();
d.then((a)=> {console.log("THEN FX", a); return "changed data";}).then((a) => console.log("after then", a));
d.catch(console.warn);
d.wait(() => {alert("passed FX"); throw "i returned data";}, 1000);
setTimeout(()=> d.delay(4000), 999);
