import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button 
      variant={'ghost'} 
      type='button' 
      className='gap-1 px-2 hover:text-primary'
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={22}/>
    </Button>
  )
}
