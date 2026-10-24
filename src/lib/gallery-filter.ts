/** Query parameter that switches `/` to business mode: `/?mode=business`. */
export const GALLERY_MODE_PARAM = 'mode'
export const BUSINESS_MODE_VALUE = 'business'

type SearchParamValue = string | string[] | undefined

export function isBusinessMode(value: SearchParamValue): boolean {
  const mode = Array.isArray(value) ? value[0] : value
  return mode === BUSINESS_MODE_VALUE
}

/** Returns the query string (with `?`, or empty) for the given mode, keeping other params. */
export function buildGalleryModeSearch(currentSearch: string, businessOnly: boolean): string {
  const params = new URLSearchParams(currentSearch)
  if (businessOnly) {
    params.set(GALLERY_MODE_PARAM, BUSINESS_MODE_VALUE)
  } else {
    params.delete(GALLERY_MODE_PARAM)
  }
  const search = params.toString()
  return search ? `?${search}` : ''
}
