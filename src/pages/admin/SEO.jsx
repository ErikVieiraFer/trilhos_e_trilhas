import { Helmet } from 'react-helmet-async'

const SEO = ({ title, description, image, url }) => {
  const siteTitle = 'Trilhos & Trilhas'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const defaultDescription = 'Turismo de aventura, trilhas e expedições no Espírito Santo e região.'
  const metaDescription = description || defaultDescription
  const metaImage = image || 'https://trilhosetrilhas.com.br/og-image.jpg'
  const metaUrl = url || window.location.href

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
    </Helmet>
  )
}

export default SEO