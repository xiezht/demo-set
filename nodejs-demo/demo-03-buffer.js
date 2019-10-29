// const arr = Uint32Array.from([1, 2, 3, 4, 5])
// console.log(arr)

// const buf = Buffer.from(arr.buffer, 0, 20)
// console.log(buf)

// const buf = Buffer.alloc(1, 512, 'utf-8')
// console.log(buf)

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');
console.log(buf.toString('base64'))
