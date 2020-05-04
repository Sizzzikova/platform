//
// Copyright © 2020 Andrey Platov <andrey.v.platov@gmail.com>
// 
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
//


/*

function toString(this: Obj, plural?: number) { 
  return this.getClass().toString(plural)
}

translates to:

THIS // [this]
DUP // [this, this]
getClass // [this, this, getClass]
GET  // stack: [this, <function>getClass]
APPLY0 // stack: [<class' this>]
DUP // stack: [<class' this>, <class' this>]
toString // stack: [<class' this>, <class' this>, 'toString']
GET // stack [<class' this>, <function>toString]
ARG0 // stack [<class' this>, <function>toString, plural]
APPLY1 // stack [<result>]

*/

export const THIS = '#0'
export const DUP = '#1'
export const GET = '#2'
export const APPLY0 = '#3'
export const APPLY1 = '#4'
export const ARG0 = '#5'

export function execute(code: string, thisArg: object, args: any[]) {
  const split = code.split(',')
  const stack: any[] = []
  const len = split.length

  function apply(args: any[]) {
    const f = stack.pop()
    const _this = stack.pop()
    if (typeof f !== 'function') {
      throw new Error('APPLY: f must be a function.')
    }
    stack.push((f as Function).apply(_this, args))
  }

  for (let pc = 0; pc < len; pc++) {
    const word = split[pc]
    switch (word) {
      case THIS:
        stack.push(thisArg)
        break
      case DUP:
        const x = stack.pop()
        stack.push(x)
        stack.push(x)
        break
      case GET:
        const key = stack.pop()
        const obj = stack.pop()
        if (typeof key !== 'string')
          throw new Error('GET: key must be a string.')
        stack.push(obj[key])
        break
      case APPLY0:
        apply([])
        break
      case APPLY1:
        apply([stack.pop()])
        break
      case ARG0:
        stack.push(args[0])
        break
      default:
        stack.push(word)
    }
  }

  if (stack.length !== 1) {
    throw new Error('stack size != 1')
  }
  return stack.pop()

}