/* Usage:
const a = new Vector(3, 4);
const b = new Vector(1, 2);

Vector.add(a, b);     // Returns New Vector   
Vector.mult(a, 2);    // Returns New Vector
Vector.addTo(a, b);   // Retuns a, no change to b.
Vector.getMagnitude(a);  
Vector.normalize(a);     
Vector.dot(a, b);        
a.clone();             // Creates perfect copy of a.

*/

 export class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // --- IMMUTABLE STATIC METHODS (Return a new Vector) ---

  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static mult(v: Vector, scalar: number): Vector {
    return new Vector(v.x * scalar, v.y * scalar);
  }

  static div(v: Vector, scalar: number): Vector {
    if (scalar === 0) return new Vector(0, 0);
    return new Vector(v.x / scalar, v.y / scalar);
  }

  static normalize(v: Vector): Vector {
    const mag = Vector.getMagnitude(v);
    if (mag === 0) return new Vector(0, 0);
    return Vector.div(v, mag);
  }

  //Mod By Scalar
    static mod(v: Vector, scalar: number): Vector {
    if (scalar === 0) return new Vector(0, 0);
    return new Vector(
      ((v.x % scalar) + scalar) % scalar,
      ((v.y % scalar) + scalar) % scalar
    );
  }

  // --- MUTABLE STATIC METHODS (Modify the first argument in place) ---

  static addTo(v1: Vector, v2: Vector): Vector {
    v1.x += v2.x;
    v1.y += v2.y;
    return v1;
  }

  static subFrom(v1: Vector, v2: Vector): Vector {
    v1.x -= v2.x;
    v1.y -= v2.y;
    return v1;
  }

  static multBy(v: Vector, scalar: number): Vector {
    v.x *= scalar;
    v.y *= scalar;
    return v;
  }

  // --- UTILITY STATIC METHODS ---

  static distance(v1: Vector, v2: Vector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static getMagnitude(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static getDirection(v: Vector): number {
    return Math.atan2(v.y, v.x);
  }

  static dot(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  // --- INSTANCE METHOD ---

  clone(): Vector {
    return new Vector(this.x, this.y);
  }
}