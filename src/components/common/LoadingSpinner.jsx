const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin`}
      />
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-white/60">Carregando...</p>
      </div>
    </div>
  )
}

export const SectionLoader = () => {
  return (
    <div className="py-20 flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export default LoadingSpinner
