/**
 * Utility function that converts a primitive into a number. If it can't convert
 * the argument into a number, it will return a fallback number.
 *
 * @param primitive - The primitive for conversion
 * @param fallback - Fallback return value if the primitive can't be converted into a number
 *
 * @returns The converted number or the fallback
 */

export const convertPrimitiveToNumber = (
  primitive: string | number | boolean,
  fallback = 10
): number => {
  if (!primitive) return fallback

  const isNumber = typeof primitive === 'number'
  const isStr = typeof primitive === 'string'
  const parsesToInteger = isStr ? !!Number.parseInt(primitive, 10) : false

  if (isNumber) {
    return primitive
  } else if (isStr && parsesToInteger) {
    return Number.parseInt(primitive, 10)
  } else {
    return fallback
  }
}

// The shorter revalidate interval allows authors allows for
// near-real-time ISR for content authors when drafting
// content via Preview Mode
export const previewRevalidateTime = 10

/**
 * Wrapper function for `convertPrimitiveToNumber` that converts the value of
 * `process.env.GLOBAL_REVALIDATE` into a number. This can then be used to set the
 * `revalidate` key in `getStaticProps`. Since `process.env` properties are
 * typed as strings but `getStaticProps` expects `revalidate`to be a number, we
 * need to convert the type into a number.
 *
 * @returns The converted number or the fallback
 */

export const getRevalidateTime = () => {
  return convertPrimitiveToNumber(
    process.env.GLOBAL_REVALIDATE,
    previewRevalidateTime
  )
}
