'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, LineChart, Wallet, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Real-time Trading',
    description: 'Advanced charting and real-time market data for informed trading decisions'
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: 'Secure Wallet',
    description: 'Safe and secure digital asset management with multi-layer protection'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Protected Trading',
    description: 'Trade with confidence using our advanced security measures'
  }
]

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-6xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">Trade Crypto in Buynance</h1>
              <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-8">
                Experience the next generation of crypto trading with our advanced platform. Real-time data, secure
                transactions, and professional tools at your fingertips.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" onClick={() => router.push('/en/trade/BTCUSDT')} className="group">
                  Start Trading
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open('https://magnificent-pail-568.notion.site/Kronon-Labs-Frontend-Recruitment-Task-150aab50e67e8065a4edd683d11423e3?pvs=74', '_blank', 'noopener,noreferrer')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Trade Smarter</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for successful trading
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-card rounded-lg p-6 shadow-sm"
                >
                  <dt className="text-base font-semibold leading-7">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-center text-xs leading-5 text-muted-foreground">
              &copy; 2024 Buynance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
