import type { IconNode, LucideProps } from 'lucide-react'

import { Icon } from 'lucide-react'

const XIcon: React.FC<LucideProps> = (props) => {
  const customIcon: IconNode = [
    [
      'path',
      {
        d: 'M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z',
      },
    ],
  ]
  return (
    <Icon
      aria-label="X Icon"
      fill="currentColor"
      iconNode={customIcon}
      size={24}
      stroke="none"
      viewBox="0 0 16 16"
      {...props}
    />
  )
}
export default XIcon
