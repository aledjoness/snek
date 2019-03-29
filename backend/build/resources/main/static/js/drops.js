function createFood() {
  return new Circle(10, "#f23737", "#a31515"); // 37x37 max
}

function createSpeedup() {
  let t1 = new Triangle(20, 20, 25, "orange", "white");
  let t2 = new Triangle(20, 20, 25, "orange", "white");
  let base = new Rectangle(1, 1);

  t1.center(base);
  t1.mov(-10, -1);
  t2.center(base);
  t2.mov(0, -1);
  t1.rot(-40);
  t2.rot(-40);

  return base;
}

function createSlowdown() {
  let t1 = new Triangle(20, 20, 25, "red", "white");
  let t2 = new Triangle(20, 20, 25, "red", "white");
  let base = new Rectangle(1, 1);

  t1.center(base);
  t1.mov(10, 2);
  t2.center(base);
  t2.mov(0, 2);
  t1.rot(140);
  t2.rot(140);

  return base;
}

function createSelfEat() {
  let c = new Circle(10, "black");
  let c2 = new Circle(8, "white");
  let c3 = new Circle(4, "purple");

  c2.center(c);
  c3.center(c2);

  return c;
}

function createMiniSelfEat() {
  let c = new Circle(8, "black");
  let c2 = new Circle(6, "white");
  let c3 = new Circle(3, "purple");

  c2.center(c);
  c3.center(c2);

  return c;
}

function createReflection() {
  let r = new Rectangle(20, 20, "blue", "white");
  let r2= new Rectangle(10, 10, "orange", "white");
  let r3 = new Rectangle(7, 7, "green");

  r3.rot(45);
  r3.center(r2);
  r2.rot(45);
  r2.center(r);
  r.rot(45);

  return r;
}
