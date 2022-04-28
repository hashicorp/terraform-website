/**
 * NOTE: also used in hashicorp/dev-portal
 */

import semverSatisfies from 'semver/functions/satisfies'
import semverMajor from 'semver/functions/major'
import semverMinor from 'semver/functions/minor'
import semverPatch from 'semver/functions/patch'

import { Products as HashiCorpProduct } from '@hashicorp/platform-product-meta'

export type OperatingSystem =
  | 'darwin'
  | 'freebsd'
  | 'openbsd'
  | 'netbsd'
  | 'archlinux'
  | 'linux'
  | 'windows'

export type Version = string

export interface ReleaseVersion {
  name: HashiCorpProduct
  version: Version
  shasums: string
  shasums_signature: string
  builds: {
    name: HashiCorpProduct
    version: Version
    os: OperatingSystem
    arch: string
    filename: string
    url: string
  }[]
}
export interface ReleasesAPIResponse {
  name: HashiCorpProduct
  versions: {
    [versionNumber: string]: ReleaseVersion
  }
}

/**
 * Filter versions based on a semver range,
 * and also only return the latest patch releases
 * (rather than every single patch release).
 *
 * Note: also used in dev-portal
 */
function filterVersions(
  versions: ReleasesAPIResponse['versions'],
  versionRange: string
): ReleasesAPIResponse['versions'] {
  // Filter by arbitrary & reasonable version cutoff
  const filteredVersions = Object.keys(versions).filter(
    (versionNumber: string) => {
      return semverSatisfies(versionNumber, versionRange)
    }
  )

  /**
   * Computes the latest patch versions for each major/minor
   * e.g. given [1.1.2, 1.1.1, 1.1.0, 1.0.9, 1.0.8]
   * return [1.1.2, 1.0.9]
   */
  const tree: { [x: number]: { [y: number]: number } } = {}
  filteredVersions.forEach((v: string) => {
    const x = semverMajor(v)
    const y = semverMinor(v)
    const z = semverPatch(v)

    if (!tree[x]) {
      tree[x] = { [y]: z }
    } else if (!tree[x][y]) {
      tree[x][y] = z
    } else {
      tree[x][y] = Math.max(tree[x][y], z)
    }
  })

  // Turn the reduced tree of latest patches only into an array
  const latestPatchesOnly = []
  Object.entries(tree).forEach(([x, xObj]) => {
    Object.entries(xObj).forEach(([y, z]) => {
      latestPatchesOnly.push(`${x}.${y}.${z}`)
    })
  })

  // Turn the array of latest patches only into an object with release data
  const filteredVersionsObj = {}
  latestPatchesOnly.forEach((versionNumber: string) => {
    filteredVersionsObj[versionNumber] = versions[versionNumber]
  })
  return filteredVersionsObj
}

export default filterVersions
