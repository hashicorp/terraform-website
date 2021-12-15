import Head from 'next/head'

function PageHeadTags({ tags, titleOverride, descriptionOverride }) {
  // The keys here enable Head to dedupe elements. This allows page specific meta tags to override
  // global meta tags. See https://github.com/zeit/next.js/#populating-head

  if (!tags || !tags.length) {
    console.warn(
      'Page level <head> tags (<title>, <meta>) not found. Double check that this is intentional. You may have missed including the seoMetaTags fragment in your page query'
    )
    return <Head>{false}</Head>
  }

  // NOTE: keys are used to prevent these tags from being duplicated
  const updatedTags = [
    ...tags,
    ...(titleOverride
      ? [
          { tag: 'title', content: titleOverride },
          {
            tag: 'meta',
            attributes: { property: 'og:title', content: titleOverride },
          },
          {
            tag: 'meta',
            attributes: { name: 'twitter:title', content: titleOverride },
          },
        ]
      : []),
    ...(descriptionOverride
      ? [
          {
            tag: 'meta',
            attributes: {
              name: 'description',
              content: descriptionOverride,
            },
          },
          {
            tag: 'meta',
            attributes: {
              property: 'og:description',
              content: descriptionOverride,
            },
          },
          {
            tag: 'meta',
            attributes: {
              name: 'twitter:description',
              content: descriptionOverride,
            },
          },
        ]
      : []),
  ]

  return (
    <Head>
      {updatedTags.map((item) => {
        if (item.tag === 'title') {
          return <title key="title">{item.content}</title>
        } else if (item.tag === 'meta') {
          return (
            <meta
              {...item.attributes}
              key={
                item.attributes.property
                  ? item.attributes.property
                  : item.attributes.name
              }
            />
          )
        }
      })}
    </Head>
  )
}

export default PageHeadTags
