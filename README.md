# Affiliate Marketing Platform

A lightweight, self-hosted affiliate marketing website built with Next.js and Convex.

## Purpose

This platform allows content creators to organize and share affiliate product recommendations through curated collections. It provides a simple dashboard for managing product links and a clean public-facing interface for visitors to browse recommendations.

## Features

- **Dashboard Management**: Create and organize product collections (sections) with titles and descriptions
- **Product Management**: Add affiliate links with product details including name, price, platform, and images
- **Multi-Platform Support**: Works with Amazon, Flipkart, Nykaa, Meesho, and other affiliate networks
- **Secure Authentication**: Password-protected admin dashboard with session management
- **Direct Linking**: One-click access to affiliate products for visitors
- **Responsive Design**: Mobile-friendly interface for both admin and public pages

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Database**: Convex (real-time backend)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

## Use Cases

- Personal shopping recommendation sites
- Niche product curation blogs
- Influencer affiliate storefronts
- Product review websites
- Gift guide collections

## Setup

1. Install dependencies: `npm install`
2. Set up Convex: `npx convex dev`
3. Create admin user via Convex dashboard
4. Configure image domains in `next.config.js` for product images
5. Run development server: `npm run dev`

## Why Use This

- No monthly subscription fees
- Full control over your data and design
- Easy to customize and extend
- Built for performance and SEO
- Secure credential storage on the backend
