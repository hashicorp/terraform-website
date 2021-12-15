import fs from 'fs'
import path from 'path'
import highlightData from '@hashicorp/platform-code-highlighting/highlight-data'

export default async function loadCodeSamples(directory) {
  const codeSamplesDir = path.join(process.cwd(), directory)
  const rawCodeSamples = fs
    .readdirSync(codeSamplesDir)
    .map((f) => path.join(codeSamplesDir, f))
    .reduce((acc, filepath) => {
      //  Read the sample file in to get the code to highlight
      const code = fs.readFileSync(filepath, 'utf-8')
      //  Use the file's extension as the code language
      const language = path.extname(filepath).slice(1)
      //  Accumulate { code, language } objects to be highlighted
      acc[path.basename(filepath)] = { code, language }
      return acc
    }, {})
  //  Highlight all code samples in our accumulated data object
  return await highlightData(rawCodeSamples)
}
