'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import axios from 'axios'
import dynamic from 'next/dynamic'
import DOMPurify from 'dompurify'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { IconBrandFacebook, IconBrandTwitterFilled, IconBrandLinkedin, IconLink } from '@tabler/icons-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import 'highlight.js/styles/github-dark.css'

const Markdown = dynamic(() => import('react-markdown'), { ssr: false })

const purify = (content) => DOMPurify.sanitize(content)

export default function BlogPost({ params }) {
  const { id } = params
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBlogData = useCallback(async () => {
    try {
      const response = await axios.get('/api/blog', { params: { id } })
      setData(response.data.blog)
    } catch (error) {
      setError('Failed to load blog post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const timer = setTimeout(fetchBlogData, 500)
    return () => clearTimeout(timer)
  }, [fetchBlogData])

  if (error) return notFound()
  if (loading) return <><NavBar /><LoadingSkeleton /></>
  if (!data) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-10">
        <article className="max-w-4xl mx-auto">
          <HeroSection data={data} />
          <Card className="mt-8">
            <CardContent className="p-6">
              <ArticleContent data={data} />
            </CardContent>
          </Card>
          <ShareSection title={data.title} />
        </article>
      </main>
      <Footer />
    </div>
  )
}

const HeroSection = ({ data }) => (
  <section className="text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
    <p className="text-xl text-muted-foreground mb-6">{data.description}</p>
    <div className="flex items-center justify-center space-x-4 mb-8">
      <Avatar className="h-12 w-12">
        <AvatarImage src={data.author.profileImg} alt={data.author.name} />
        <AvatarFallback>{data.author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="text-left">
        <p className="font-semibold">{data.author.name}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(data.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
    <Image
      src={data.image}
      width={1280}
      height={720}
      alt={data.title}
      className="w-full h-auto aspect-video object-cover rounded-lg shadow-lg"
    />
  </section>
)

const ArticleContent = ({ data }) => (
  <div className="prose dark:prose-invert max-w-none">
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        img: ({ node, ...props }) => (
          <Image
            src={props.src}
            alt={props.alt || ''}
            width={800}
            height={600}
            className="my-4 rounded-md max-w-full h-auto mx-auto"
          />
        ),
        code: ({ node, className, ...props }) => (
          <pre className={`${className} p-4 rounded-md my-4 overflow-x-auto`}>
            <code {...props} />
          </pre>
        ),
      }}
    >
      {purify(data.content)}
    </Markdown>
    <div className="flex flex-wrap gap-2 mt-8">
      {data.tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          #{tag}
        </Badge>
      ))}
    </div>
  </div>
)

const ShareSection = ({ title }) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform) => {
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`
        break
      default:
        navigator.clipboard.writeText(shareUrl)
        return
    }
    window.open(url, '_blank')
  }

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex space-x-4">
        <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
          <IconBrandFacebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
          <IconBrandTwitterFilled className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
          <IconBrandLinkedin className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
          <IconLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 mt-10">
    <Skeleton className="w-full h-14 mb-4 mx-auto" />
    <Skeleton className="w-3/4 h-6 mb-2 mx-auto" />
    <Skeleton className="w-2/4 h-6 mb-8 mx-auto" />
    <div className="flex items-center justify-center space-x-4 mb-8">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div>
        <Skeleton className="w-32 h-4 mb-2" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
    <Skeleton className="w-full h-96 rounded-lg mb-8" />
    <Skeleton className="w-full h-4 mb-2" />
    <Skeleton className="w-full h-4 mb-2" />
    <Skeleton className="w-2/3 h-4 mb-8" />
    <Skeleton className="w-full h-64" />
  </div>
)