const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-lg ${className}`}
      {...props}
    />
  )
}

export const CardSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden h-full">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between pt-4">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  </div>
)

export default Skeleton