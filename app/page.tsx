import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Users, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center dark:bg-purple-700">
              <span className="text-white font-bold text-sm">LH</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">LinkHaven</span>
          </div>
          <div className="space-x-4 flex items-center">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 dark:text-white">
          Your Link-in-Bio,
          <span className="text-blue-600 dark:text-purple-400"> Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
          Create a beautiful, customizable page to showcase all your important links. Perfect for creators, businesses,
          and professionals.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link href="/auth/login">Start Free</Link>
          </Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Everything you need to share your links</h2>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
            LinkHaven provides all the tools you need to create a professional link-in-bio page
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2 dark:text-purple-400" />
              <CardTitle className="dark:text-white">Easy Setup</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Get started in minutes with our intuitive dashboard and customizable templates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2 dark:text-purple-400" />
              <CardTitle className="dark:text-white">Analytics</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Track your page views and link clicks to understand your audience better
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <Star className="h-8 w-8 text-blue-600 mb-2 dark:text-purple-400" />
              <CardTitle className="dark:text-white">Custom Templates</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Choose from beautiful templates designed for creators, shops, and coaches
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Simple, transparent pricing</h2>
          <p className="text-gray-600 dark:text-gray-300">Start free, upgrade when you need more features</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">
                $0<span className="text-sm font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Unlimited links
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />3 templates
                </li>
                <li className="flex items-center text-gray-500">LinkHaven branding</li>
              </ul>
              <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 relative dark:bg-gray-900 dark:border-gray-800">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Popular</span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious creators and businesses</CardDescription>
              <div className="text-3xl font-bold">
                $9<span className="text-sm font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Remove LinkHaven branding
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Custom domains
                </li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <Link href="/auth/login">Start Pro Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LH</span>
              </div>
              <span className="text-xl font-bold">LinkHaven</span>
            </div>
            <p className="text-gray-400">© 2024 LinkHaven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
