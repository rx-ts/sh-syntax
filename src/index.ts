import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import './shim.js'
import '../vendors/wasm_exec.js'
import { getProcessor } from './processor.js'
import type { File, ShOptions, ShPrintOptions } from './types.js'

/* istanbul ignore next */
const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

export const processor = getProcessor(() =>
  fs.promises.readFile(path.resolve(_dirname, '../main.wasm')),
)

export const parse = (text: string, options?: ShOptions) =>
  processor(text, options)

export function print(text: string, options?: ShOptions): Promise<string>
export function print(ast: File, options?: ShPrintOptions): Promise<string>
export function print(
  textOrAst: File | string,
  options?: ShOptions & {
    originalText?: string
  },
) {
  if (typeof textOrAst === 'string') {
    return processor(textOrAst, {
      ...options,
      print: true,
    })
  }
  return processor(textOrAst, options as ShPrintOptions)
}

export * from './processor.js'
export * from './types.js'
