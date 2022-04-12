import { useEffect, useRef } from 'react'

function useFilterEffect(callback, dependencies) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    return callback()
  }, [dependencies])
}

export default useFilterEffect
