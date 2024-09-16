import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, BookOpen, Users } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <BiographySection />
        <AchievementsSection />
      </main>
    </div>
  )
}

const HeroSection = () => (
  <section className="bg-gradient-to-r from-primary to-primary-foreground text-white py-20 min-h-screen flex flex-col justify-center">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Dr. Jane Smith</h1>
          <p className="text-xl mb-6">Leading biotechnology researcher and innovator</p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=400&width=400"
            width={400}
            height={400}
            alt="Dr. Jane Smith"
            className="rounded-full mx-auto"
          />
        </div>
      </div>
    </div>
  </section>
)

const BiographySection = () => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Biography</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            Dr. Jane Smith is a renowned biotechnology researcher with over 15 years of experience in genetic engineering and synthetic biology. She received her Ph.D. in Molecular Biology from Stanford University and has since led groundbreaking research teams at prestigious institutions and biotech companies.
          </p>
          <p className="mb-4">
            Her current work focuses on developing innovative solutions to global challenges in healthcare and agriculture through the application of CRISPR technology and advanced bioinformatics techniques.
          </p>
          <p>
            Dr. Smith is passionate about fostering the next generation of biotechnology researchers and frequently mentors graduate students and postdoctoral fellows in her lab.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Research Interests</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>CRISPR gene editing and its applications in medicine</li>
            <li>Synthetic biology for sustainable biofuel production</li>
            <li>Computational approaches in protein structure prediction</li>
            <li>Ethical implications of genetic engineering</li>
            <li>Bioremediation and environmental biotechnology</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
)

const AchievementsSection = () => (
  <section className="py-16 bg-secondary">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Achievements and Recognition</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AchievementCard
          icon={<Award className="w-12 h-12 mb-4" />}
          title="Awards"
          items={[
            "National Science Foundation Career Award",
            "BioInnovator of the Year 2022",
            "Outstanding Young Researcher in Biotechnology"
          ]}
        />
        <AchievementCard
          icon={<BookOpen className="w-12 h-12 mb-4" />}
          title="Key Publications"
          items={[
            "Nature Biotechnology: 'Novel CRISPR Applications in Crop Enhancement'",
            "Science: 'Synthetic Biology Approaches to Sustainable Biofuels'",
            "Cell: 'Computational Methods for Protein Structure Prediction'"
          ]}
        />
        <AchievementCard
          icon={<Users className="w-12 h-12 mb-4" />}
          title="Professional Affiliations"
          items={[
            "American Society for Microbiology",
            "International Society for Computational Biology",
            "Biotech Ethics Committee"
          ]}
        />
      </div>
    </div>
  </section>
)

const AchievementCard = ({ icon, title, items }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex flex-col items-center">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <ArrowRight className="h-5 w-5 mr-2 mt-1 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

export default AboutPage