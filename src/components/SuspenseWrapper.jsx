import { Suspense } from 'react'
import LoadingFallback from './LoadingFallback'

const SuspenseWrapper = ({children}) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export default SuspenseWrapper