import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  LineChart, 
  MessagesSquare,
} from 'lucide-react';

import ProductShowcase from './product-showcase';
import AboutSection from './about-section';
import HeroSection from './hero-section'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-3">
              <img
                src="/jakarta-insight-logo.png"
                alt="Insight Jakarta Logo"
                className="h-10 w-auto"
              />
              <span className="hidden font-bold sm:inline-block">
                Insight Jakarta 
              </span>
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/dashboard" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/analytics" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <LineChart className="mr-2 h-4 w-4" />
                      Analytics
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/citizen-engagement" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <MessagesSquare className="mr-2 h-4 w-4" />
                      Citizen Engagement
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-[#E86A33] hover:bg-[#D15A2B] text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection/>

      <AboutSection />

      <ProductShowcase />


      <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand and Description */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/jakarta-insight-logo.png" 
                alt="Insight Jakarta Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h3 className="font-bold text-xl">Insight Jakarta</h3>
                <p className="text-gray-600 text-sm">
                  Real-time monitoring and AI-powered citizen engagement for Jakarta
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-gray-600">
              <li>Data Integration</li>
              <li>Analytics Dashboard</li>
              <li>Network Analysis</li>
              <li>Chatbot Integration</li>
              <li>Machine Learning</li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <ul className="space-y-3 text-gray-600">
              <li>Elasticsearch</li>
              <li>Next.js</li>
              <li>Gen AI</li>
              <li>Python</li>
              <li>Node.js</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Team</h4>
            <ul className="space-y-3 text-gray-600">
              <li>Moch Aril Indra Permana</li>
              <li>Fadel Mohammad Farma</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              © 2024 Insight Jakarta. All rights reserved
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/in/moch-aril-indra-permana-52887b138/" className="text-gray-600 hover:text-[#E86A33]">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              <a href="https://www.instagram.com/moch_ariel/" className="text-gray-600 hover:text-[#E86A33]">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>

              <a href="mailto:arilindra21@gmail.com" className="text-gray-600 hover:text-[#E86A33]">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              <a href="https://github.com/Mocharil" className="text-gray-600 hover:text-[#E86A33]">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>

            {/* Links */}
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-[#E86A33]">Privacy Policy</a>
              <a href="#" className="hover:text-[#E86A33]">Terms of Service</a>
              <a href="#" className="hover:text-[#E86A33]">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};



const NewsCard = ({ 
  category, 
  title, 
  description, 
  date 
}: {
  category: string;
  title: string;
  description: string;
  date: string;
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-2 mb-3">
        <span className="bg-[#FFF1EC] text-[#E86A33] text-sm px-3 py-1 rounded-full">
          {category}
        </span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

const TrendingTopic = ({ 
  number, 
  topic, 
  count 
}: {
  number: string;
  topic: string;
  count: string;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <span className="text-gray-500">#{number}</span>
        <span className="font-medium">{topic}</span>
      </div>
      <span className="text-sm text-gray-500">{count}</span>
    </div>
  );
};

export default LandingPage;