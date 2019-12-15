import A from './A.mjs'
import B from './B.mjs'
import C from './C.mjs'
import D from './D.js'

console.log('module script')
const insA = new A()
const insB = new B()
const insC = new C()
const insD = new D()

console.log(insA, insB, insC, insD)
