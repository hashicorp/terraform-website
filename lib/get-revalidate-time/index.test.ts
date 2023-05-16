import { convertPrimitiveToNumber, previewRevalidateTime as fallback } from '.'

describe('convertPrimitiveToNumber', () => {
  it('coerces a string with an integer into number', () => {
    const time = convertPrimitiveToNumber('52')
    expect(time).toBe(52)
  })
  it('returns fallback if string does not include integer', () => {
    const time = convertPrimitiveToNumber('imastringwithoutaninteger')
    expect(time).toBe(fallback)
  })
  it('returns number if type is number', () => {
    const time = convertPrimitiveToNumber(23)
    expect(time).toBe(23)
  })
  it('returns fallback if falsy', () => {
    const time = convertPrimitiveToNumber(undefined)
    expect(time).toBe(fallback)
  })
})
