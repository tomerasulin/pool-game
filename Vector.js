// This object will help us deal with arithmetic operations between vectors

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  addTo(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  // dot product func --- vec * vec = scalar
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // this method returns the length of a given vector |v| = sqrt(x^2 + y^2)
  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
