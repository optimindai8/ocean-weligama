const res = await fetch("http://localhost:8080/v1/matrix-pricing");
console.log(res.status);
const txt = await res.text();
console.log(txt.substring(0, 200));
