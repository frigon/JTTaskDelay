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
            that.finallyCallbacks[i]();
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
d.finally(() => alert("finally success call"));
setTimeout(()=> d.delay(4000), 999);

//EXAMPLE CATCH
var d2 = new DeferredPromise();
d2.then((a)=> {console.log("THEN FX", a); return "changed data";}).then((a) => console.log("after then", a));
d2.catch(console.warn);
d2.wait(() => {alert("passed FX"); throw "i returned data";}, 1000);
d2.finally(() => alert("finally error call"));
setTimeout(()=> d2.delay(4000), 999);
