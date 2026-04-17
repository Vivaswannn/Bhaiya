import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/ui/Badge'

describe('StatusBadge', () => {
  it('renders KHULA for open=true', () => {
    render(<StatusBadge open={true} />)
    expect(screen.getByText('KHULA')).toBeInTheDocument()
  })
  it('renders BAND for open=false', () => {
    render(<StatusBadge open={false} />)
    expect(screen.getByText('BAND')).toBeInTheDocument()
  })
  it('applies green class for open', () => {
    render(<StatusBadge open={true} />)
    const badge = screen.getByText('KHULA')
    expect(badge).toHaveClass('text-open-green')
  })
})
