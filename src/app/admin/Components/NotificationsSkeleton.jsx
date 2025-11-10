import { AnimatedContainer, AnimatedCard, SkeletonLoader } from './animation-component'

export default function NotificationsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/20 p-6">
      <AnimatedContainer animation="fadeInUp" className="max-w-4xl mx-auto">
        {/* Скелетон заголовка */}
        <div className="mb-8 space-y-3">
          <SkeletonLoader type="title" className="w-64 h-8" />
          <SkeletonLoader type="text" className="w-96 h-4" />
        </div>

        {/* Скелетон статистики */}
        <AnimatedCard className="p-6 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonLoader type="avatar" className="w-10 h-10" />
                  <div className="space-y-2">
                    <SkeletonLoader type="text" className="w-24 h-3" />
                    <SkeletonLoader type="text" className="w-16 h-4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {[...Array(2)].map((_, i) => (
                <SkeletonLoader key={i} type="button" className="w-36 h-9" />
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Скелетон фильтров */}
        <AnimatedCard className="p-5 mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonLoader key={i} type="button" className="w-28 h-8" />
            ))}
          </div>
        </AnimatedCard>

        {/* Скелетон уведомлений */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <AnimatedCard key={i} className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SkeletonLoader type="avatar" className="w-8 h-8" />
                    <SkeletonLoader type="title" className="w-56 h-5" />
                  </div>
                  <SkeletonLoader type="text" className="w-24 h-4" />
                </div>
                <SkeletonLoader type="text" className="w-full h-3" />
                <SkeletonLoader type="text" className="w-3/4 h-3" />
                <div className="flex justify-between items-center">
                  <SkeletonLoader type="text" className="w-20 h-6" />
                  <div className="flex gap-2">
                    <SkeletonLoader type="button" className="w-24 h-8" />
                    <SkeletonLoader type="button" className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </AnimatedContainer>
    </div>
  )
}