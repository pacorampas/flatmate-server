Array.prototype.next = function() {
  this.current++;

  if(this.current >= this.length) {
    this.current = 0;
  }

  return this[this.current];
};

Array.prototype.current = 0;

Array.prototype.lastItem = function() {
  return this[this.length-1];
}
