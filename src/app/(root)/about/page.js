import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <header className='h-[60px]'>
        <NavBar />
      </header>
      <section className="min-h-screen">


        <main className="container mx-auto px-4 py-12">
          <h1 className="text-6xl font-bold text-center mb-8">ABOUT BLOGMOS</h1>
          <p className="text-xl text-center text-gray-400 mb-12">
            Discover our story, mission, and the team behind Blogmos.
          </p>

          <div className="max-w-3xl mx-auto space-y-12">
            <section>
              <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-300">
                Blogmos was born out of a passion for sharing knowledge and connecting people through the power of words. Founded in 2023, we{"'"}ve grown from a small personal blog to a thriving community of writers, thinkers, and curious minds from all walks of life.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-300">
                At Blogmos, we believe in the transformative power of ideas. Our mission is to create a platform where diverse voices can be heard, where knowledge is freely shared, and where conversations spark innovation. We strive to make complex topics accessible, inspire creativity, and foster a community of lifelong learners.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Meet the Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['John Doe', 'Jane Smith', 'Alex Johnson'].map((name) => (
                  <div key={name} className="text-center">
                    <Image src="/placeholder.svg" alt={name} width={120} height={120} className="rounded-full mx-auto mb-4" />
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-gray-400">Co-founder</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-gray-300 mb-4">
                Be part of our growing community. Subscribe to our newsletter for the latest insights, trends, and exclusive content.
              </p>
              <form className="flex space-x-2">
                <Input type="email" placeholder="Enter your email" className="flex-grow" />
                <Button type="submit">Subscribe</Button>
              </form>
            </section>
          </div>
        </main>

        <Footer />
      </section>
    </>
  )
}