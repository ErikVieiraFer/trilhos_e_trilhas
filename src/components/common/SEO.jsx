import { useEffect } from 'react'

const SEO = ({
  title = 'Trilhos & Trilhas',
  description = 'Turismo de aventura no Espírito Santo. Trilhas, praias, campings e expedições noturnas nos estados ES, RJ, MG e BA.',
  image = '/og-image.jpg',
  url = ''
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://trilhosetrilhas.com.br'
  const fullUrl = `${siteUrl}${url}`
  const fullTitle = title === 'Trilhos & Trilhas' ? title : `${title} | Trilhos & Trilhas`

  useEffect(() => {
    document.title = fullTitle

    // Update meta tags
    const updateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`) ||
                 document.querySelector(`meta[name="${property}"]`)

      if (!meta) {
        meta = document.createElement('meta')
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    updateMeta('description', description)
    updateMeta('og:title', fullTitle)
    updateMeta('og:description', description)
    updateMeta('og:image', `${siteUrl}${image}`)
    updateMeta('og:url', fullUrl)
    updateMeta('og:type', 'website')
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', fullTitle)
    updateMeta('twitter:description', description)
    updateMeta('twitter:image', `${siteUrl}${image}`)
  }, [fullTitle, description, image, fullUrl, siteUrl])

  return null
}

export default SEO
