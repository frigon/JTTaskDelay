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


var t = new Task();
t.wait(()=> alert('hi'),100);
setTimeout(()=> t.delay(2000),100);
