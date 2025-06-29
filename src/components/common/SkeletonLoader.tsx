interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'form' | 'table-row';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ type = 'text', count = 1, className = '' }: SkeletonLoaderProps) {
  const getSkeletonClass = () => {
    switch (type) {
      case 'title':
        return 'h-8 w-3/4 skeleton-loader';
      case 'text':
        return 'h-4 w-full skeleton-loader';
      case 'card':
        return 'h-32 w-full skeleton-loader rounded-xl';
      case 'form':
        return 'space-y-4';
      case 'table-row':
        return 'h-12 w-full skeleton-loader';
      default:
        return 'skeleton-loader';
    }
  };

  if (type === 'form') {
    return (
      <div className={`${getSkeletonClass()} ${className}`}>
        <div className="h-4 w-1/4 skeleton-loader mb-2"></div>
        <div className="h-12 w-full skeleton-loader rounded-lg mb-4"></div>
        <div className="h-4 w-1/4 skeleton-loader mb-2"></div>
        <div className="h-12 w-full skeleton-loader rounded-lg mb-4"></div>
        <div className="h-4 w-1/4 skeleton-loader mb-2"></div>
        <div className="h-24 w-full skeleton-loader rounded-lg mb-4"></div>
        <div className="h-12 w-32 skeleton-loader rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={getSkeletonClass()}></div>
      ))}
    </div>
  );
}