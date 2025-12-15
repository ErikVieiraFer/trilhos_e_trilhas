import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SEO = ({ title, description, image, type = 'website' }) => {
  const location = useLocation()
  const siteUrl = window.location.origin
  const fullUrl = `${siteUrl}${location.pathname}`

  useEffect(() => {
    // Title
    const pageTitle = title ? `${title} | Trilhos & Trilhas` : 'Trilhos & Trilhas - Turismo de Aventura'
    document.title = pageTitle

    // Meta tags configuration
    const metaTags = [
      { selector: 'name="description"', name: 'description', content: description || 'Agência de turismo de aventura especializada em trilhas e expedições.' },
      
      // Open Graph
      { selector: 'property="og:title"', property: 'og:title', content: pageTitle },
      { selector: 'property="og:description"', property: 'og:description', content: description || 'Agência de turismo de aventura especializada em trilhas e expedições.' },
      { selector: 'property="og:image"', property: 'og:image', content: image || `${siteUrl}/og-default.jpg` },
      { selector: 'property="og:url"', property: 'og:url', content: fullUrl },
      { selector: 'property="og:type"', property: 'og:type', content: type },
      
      // Twitter
      { selector: 'name="twitter:card"', name: 'twitter:card', content: 'summary_large_image' },
      { selector: 'name="twitter:title"', name: 'twitter:title', content: pageTitle },
      { selector: 'name="twitter:description"', name: 'twitter:description', content: description || 'Agência de turismo de aventura especializada em trilhas e expedições.' },
      { selector: 'name="twitter:image"', name: 'twitter:image', content: image || `${siteUrl}/og-default.jpg` },
    ]

    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[${tag.selector}]`)

      if (!element) {
        element = document.createElement('meta')
        if (tag.name) element.setAttribute('name', tag.name)
        if (tag.property) element.setAttribute('property', tag.property)
        document.head.appendChild(element)
      }

      element.setAttribute('content', tag.content)
    })

  }, [title, description, image, fullUrl, type, siteUrl])

  return null
}

export default SEO