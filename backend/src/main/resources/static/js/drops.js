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
