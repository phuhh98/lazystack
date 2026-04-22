import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// @ts-expect-error
global.IS_REACT_ACT_ENVIRONMENT = true

class ResizeObserver {
  disconnect() {
    // no-op for jsdom tests
  }

  observe() {
    // no-op for jsdom tests
  }

  unobserve() {
    // no-op for jsdom tests
  }
}

// @ts-expect-error - test shim assignment
globalThis.ResizeObserver = ResizeObserver

afterEach(() => {
  cleanup()
})
