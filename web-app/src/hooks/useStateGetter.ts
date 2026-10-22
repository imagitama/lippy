import { useCallback, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

export function useStateGetter<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, () => S]
export function useStateGetter<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
  () => S | undefined
]
export function useStateGetter<S>(initialState?: S | (() => S)) {
  const [state, setState] = useState<S | undefined>(initialState)
  const ref = useRef(state)

  const set = useCallback((value: SetStateAction<S | undefined>) => {
    const next =
      typeof value === 'function'
        ? (value as (prev: S | undefined) => S | undefined)(ref.current)
        : value
    ref.current = next // getState() is up to date immediately, before re-render
    setState(next)
  }, [])

  const get = useCallback(() => ref.current, [])

  return [state, set, get]
}
