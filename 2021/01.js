// go to https://adventofcode.com/2021/day/1/input and run in the browser console

n = document.body.innerText.split('\n').map(Number);
console.log(n.filter((m, i) => i > 0 && m > n[i - 1]).length);
console.log(n.filter((m, i) => i > 2 && m > n[i - 3]).length);
