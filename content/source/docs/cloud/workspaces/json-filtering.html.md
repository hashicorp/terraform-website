---
layout: "cloud"
page_title: "JSON Filtering - Terraform Cloud and Terraform Enterprise"
---

# About JSON Data Filtering

Certain pages where JSON data is displayed, such as the [state
viewer](/docs/cloud/workspaces/state.html) and [policy check JSON data
viewer](/docs/cloud/sentinel/json.html), allow you to filter the results. This
enables you to see just the data you need, and even create entirely new datasets
to see data in the way you want to see it!

![entering a json filter](/assets/images/guides/sentinel/json-viewer-intro.png)

-> **NOTE:** _Filtering_ the data in the JSON viewer is separate from
_searching_ it. To search, press Control-F (or Command-F on MacOS). You can
search and apply a filter at the same time.

## Entering a Filter

Filters are entered by putting the filter in the aptly named **filter** box in
the JSON viewer. After entering the filter, pressing **Apply** or the enter key
on your keyboard will apply the filter. The filtered results, if any, are
displayed in result box. Clearing the filter will restore the original JSON
data.

![entering a json filter](/assets/images/guides/sentinel/sentinel-json-enter-filter.png)

## Filter Language

The JSON filter language is a small subset of the
[jq](https://stedolan.github.io/jq/) JSON filtering language. Selectors,
literals, indexes, slices, iterators, and pipes are supported, as are also array
and object construction. At this time, parentheses, and more complex operations
such as mathematical operators, conditionals, and functions are not supported.

Below is a quick reference of some of the more basic functions to get you
started.

### Selectors

Selectors allow you to pick an index out of a JSON object, and are written as
`.KEY.SUBKEY`. So, as an example, given an object of
`{"foo": {"bar": "baz"}}`, and the filter `.foo.bar`, the result would be
displayed as `"baz"`.

A single dot (`.`) without anything else always denotes the current value,
unaltered.

### Indexes

Indexes can be used to fetch array elements, or select non-alphanumeric object
fields. They are written as `[0]` or `["foo-bar"]`, depending on the purpose.

Given an object of `{"foo-bar": ["baz", "qux"]}` and the filter of
`.["foo-bar"][0]`, the result would be displayed as `"baz"`.

### Slices

Arrays can be sliced to get a subset an array. The syntax is `[LOW:HIGH]`.

Given an array of `[0, 1, 2, 3, 4]` and the filter of
`.[1:3]`, the result would be displayed as `[1, 2]`. This also illustrates that
the result of the slice operation is always of length HIGH-LOW.

Slices can also be applied to strings, in which a substring is returned with the
same rules applied, with the first character of the string being index 0.

### Iterators

Iterators can iterate over arrays and objects. The syntax is `[]`.

Iterators iterate over the _values_ of an object only. So given a object of
`{"foo": 1, "bar": 2}`, the filter `.[]` would yield an iteration of `1, 2`.

Note that iteration results are not necessarily always arrays. Iterators are
handled in a special fashion when dealing with pipes and object creators (see
below).

### Array Construction

Wrapping an expression in brackets (`[ ... ]`) creates an array with the
sub-expressions inside the array. The results are always concatenated.

For example, for an object of `{"foo": [1, 2], "bar": [3, 4]}`, the construction
expressions `[.foo[], .bar[]]` and `[.[][]]`, are the same, producing the
resulting array `[1, 2, 3, 4]`.

### Object Construction

Wrapping an expression in curly braces `{KEY: EXPRESSION, ...}` creates an
object.

Iterators work uniquely with object construction in that an object is
constructed for each _iteration_ that the iterator produces.

As a basic example, Consider an array `[1, 2, 3]`. While the expression
`{foo: .}` will produce `{"foo": [1, 2, 3]}`, adding an iterator to the
expression so that it reads `{foo: .[]}` will produce 3 individual objects:
`{"foo": 1}`, `{"foo": 2}`, and `{"foo": 3}`.

### Pipes

Pipes allow the results of one expression to be fed into another. This can be
used to re-write expressions to help reduce complexity.

Iterators work with pipes in a fashion similar to object construction, where the
expression on the right-hand side of the pipe is evaluated once for every
iteration. 

As an example, for the object `{"foo": {"a": 1}, "bar": {"a": 2}}`, both the
expression `{z: .[].a}` and `.[] | {z: .a}` produce the same result: `{"z": 1}`
and `{"z": 2}`.
