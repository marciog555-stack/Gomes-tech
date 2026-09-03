import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/sections/Hero'
import Products from '../components/sections/Products'
import Custom from '../components/sections/Custom'
import HowItWorks from '../components/sections/HowItWorks'
import Maker from '../components/sections/Maker'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main>
      <Hero />
      <Products />
      <Custom />
      <HowItWorks />
      <Maker />
    </main>
  )
}
