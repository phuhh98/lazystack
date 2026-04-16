import { cn } from '@/lib/utils/styles'

const Container: React.FC<React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren> = (props) => {
  return (
    <div {...props} className={cn('container mx-auto px-4', props.className)}>
      {props.children}
    </div>
  )
}

export default Container
