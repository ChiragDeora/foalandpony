import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ShapeSpotterQuiz } from '@/components/quiz/ShapeSpotterQuiz'

export const metadata: Metadata = {
  title: 'Shape Spotter - Kids Vision Screening | Foal & Pony',
  description:
    'A quick, free at-home vision screening game for kids ages 3-10. Check each eye in about 4 minutes and see whether it’s worth booking an eye test. A screening tool, not a diagnosis.',
}

export default function VisionQuizPage() {
  return (
    <div className="fp-page">
      <Navbar />
      <ShapeSpotterQuiz />
      <Footer />
    </div>
  )
}
