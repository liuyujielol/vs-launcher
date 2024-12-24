import { motion, useInView } from "motion/react"
import { RefObject, useRef } from "react"

function InViewItem({ children, className, parent }: { children: React.ReactNode; className?: string; parent?: RefObject<Element> }): JSX.Element {
  const ref = useRef(null)
  const isInView = useInView(ref, { root: parent })

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={{ opacity: isInView ? 1 : 0 }} className={className}>
      {children}
    </motion.div>
  )
}

export default InViewItem
