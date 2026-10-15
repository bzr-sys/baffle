import { onBeforeUnmount, ref } from 'vue'

/** Seconds since start, until stopped */
export function useTimer() {
  const seconds = ref(0)
  let handle: number | undefined = window.setInterval(() => seconds.value++, 1000)

  function stop() {
    window.clearInterval(handle)
    handle = undefined
  }

  function restart() {
    stop()
    seconds.value = 0
    handle = window.setInterval(() => seconds.value++, 1000)
  }

  onBeforeUnmount(stop)
  return { seconds, stop, restart }
}
