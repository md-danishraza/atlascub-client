# Atlascub — Premium E-Commerce Ecosystem

#### Atlascub is a full-stack e-commerce platform built for a premium clothing brand, combining a decoupled monolithic NestJS backend with a server-driven Next.js frontend. The platform handles catalog management, payment processing, logistics integration, and AI-powered search.

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Redux Toolkit, RTK Query
- **Animations**: Framer Motion, GSAP
- **Authentication**: Clerk
- **Form Handling**: React Hook Form, Zod
- **PWA**: @ducanh2912/next-pwa

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript
- **ORM**: Prisma 7
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Clerk Backend SDK
- **Payments**: Razorpay
- **Logistics**: Shiprocket
- **Email**: Resend
- **Storage**: Cloudinary
- **Cache**: Upstash Redis (ioredis)
- **AI**: Google Gemini 2.0

### DevOps & Infrastructure

- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS EC2
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx
- **SSL**: Certbot (Let's Encrypt)
- **DNS**: GoDaddy

---

## Key Features

### Authentication & Authorization

- Clerk-powered authentication with email/password + social login (Google, GitHub)
- Role-based access control (admin/customer) via Clerk public metadata
- Custom sign-in/sign-up pages with email verification
- Middleware-based route protection with admin route isolation
- SSO callback handling

### Product Catalog

- Dynamic category system with CRUD (admin only)
- Product management with Cloudinary image upload (unsigned presets)
- Size (XS–XXL) and color (hex picker) selection
- Tags support for improved search
- Soft delete & hard delete with Cloudinary cleanup
- Product collections with image upload + product assignment
- Multiple product images with drag-to-reorder

### Search & Discovery

- Hybrid search: PostgreSQL FTS + pgvector semantic search
- AI-powered RAG chatbot (Gemini 2.0) with product recommendations
- 768-D vector embeddings for semantic product matching
- Live search suggestions with debounced input
- Recent search history stored in localStorage
- Filters: gender, size, price range, availability
- Sorting: newest, price (asc/desc), popularity

### Cart & Checkout

- Redux-based cart state with localStorage persistence
- Cart sync with backend for authenticated users
- Address management (create, edit, delete)
- Order creation with inventory validation
- Price snapshot at checkout to prevent manipulation
- Razorpay payment integration with webhook handling
- Atomic transactions for payment + inventory update
- Success/failure pages with order confirmation

### Order Management

- Admin orders dashboard with status filtering
- Order status updates (PENDING → PAID → SHIPPED → DELIVERED)
- Tracking number management
- Order timeline visualization
- User order history with status filters
- Auto-generated barcodes (Code128)
- Printable shipping labels

### Logistics & Returns

- Shiprocket integration for AWB generation
- Courier name + tracking number storage
- Return request system with admin approval
- Razorpay refund processing
- Return status tracking (REQUESTED → APPROVED → REFUNDED)

### Admin Dashboard

- Real-time stats: revenue, orders, customers, conversion rate
- Recent orders list
- Low stock alerts (inventory ≤ 5)
- Store settings: order acceptance, shipping rates, taxes, COD
- Product, category, and collection management

### Email & Communication

- Resend/hostinger hybrid-based transactional/inbound emails
- Order confirmation emails
- Shipping confirmation with tracking link
- Contact form with email delivery
- Support desk integration

### SEO & Performance

- Dynamic XML sitemap (products, collections, categories)
- Robots.txt configuration
- OpenGraph + Twitter Card metadata
- JSON-LD structured data (Product, CollectionPage, Organization)
- PWA with offline fallback + Workbox caching
- 90+ Lighthouse scores
- Image optimization via Next.js Image + Cloudinary CDN

---

## Database Schema (Prisma)

### Models

- **User** — Synced with Clerk
- **Product** — Name, slug, price, images, sizes, colors, inventory, tags
- **Category** — Dynamic categories (men, women, kids)
- **Collection** — Curated collections with image + type
- **ProductCollection** — Junction table (many-to-many)
- **Orders** — Status, items (snapshot), shipping address, totals
- **OrderItem** — Product snapshot at checkout
- **Reviews** — Ratings, comments, user association
- **Cart** — User cart items (JSON)
- **Wishlist** — User wishlist items (JSON)
- **StoreSettings** — Global store configuration
- **Address** — User addresses with snapshot
- **ProductChunks** — Stores Products vector embedding
- **ChatHistory** — AI RAG chatbot history

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Frontend)                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Next.js 16 App (PWA, Edge Runtime)                        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS EC2 (Backend)                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Nginx (Reverse Proxy + SSL)                               ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │  Docker Container (NestJS)                            │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Supabase (PostgreSQL)                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  15+ models with pgvector extension                        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

```

### CI/CD Pipeline

1. Push to main branch triggers GitHub Actions workflow
2. Build and test NestJS application
3. Docker build multi-stage image
4. Push image to GitHub Container Registry (GHCR)
5. SSH into EC2 instance
6. Pull latest image from GHCR
7. Restart container with zero downtime

## Project Structure

### Backend (NestJS)

```
src/
├── common/           # Guards, decorators, utilities
├── modules/
│   ├── auth/         # Clerk authentication
│   ├── cart/         # Cart persistence
│   ├── categories/   # Dynamic categories
│   ├── cloudinary/   # Image management
│   ├── collections/  # Curated collections
│   ├── dashboard/    # Admin dashboard stats
│   ├── mail/         # Resend email
│   ├── orders/       # Order management + barcodes
│   ├── payments/     # Razorpay + webhooks
│   ├── products/     # Product CRUD + search
│   ├── rag/          # Gemini chatbot
│   ├── redis/        # Caching + cleanup
│   ├── reviews/      # Product reviews
│   ├── store-settings/ # Global config
│   └── uploads/      # Image tracking
├── prisma/           # Schema + migrations
└── cron/             # Scheduled jobs

```

### Frontend (Next.js)

```
app/
├── (auth)/           # Sign-in, sign-up
├── (public-pages)/   # About, contact, legal
├── account/          # User profile, orders
├── admin/            # Dashboard, products, orders
├── cart/             # Shopping cart
├── checkout/         # Payment flow
├── collections/      # Collection browsing
├── product/          # Product detail
├── search/           # Hybrid search
└── shop/             # Gender, category pages

```

## Key Architectural Decisions

1. **Decoupled Monolithic Backend**

   - NestJS modules are organized by domain.
   - Maintains codebase clarity while keeping monolithic simplicity for deployment.

2. **Atomic Payment Processing**

   - Webhook handling uses `Prisma.$transaction`.
   - Ensures order status updates and inventory decrements happen atomically.
   - Prevents overselling during concurrent checkouts.

3. **Hybrid Search**

   - Combines PostgreSQL Full-Text Search (FTS) for keyword matching.
   - Uses pgvector for semantic intent detection.
   - Provides relevant results across diverse query types.

4. **Price Snapshot**

   - Order items store a **price snapshot** at checkout.
   - Protects historical orders from future price changes.

5. **Redis Orphan Cleanup**

   - Uploaded images tracked in Redis with a 24-hour TTL.
   - Cron job cleans up images not linked to any product.

6. **PWA with Offline Support**
   - Workbox caches static assets and API responses.
   - Enables offline browsing of previously visited pages.

## License

#### UNLICENSED — Private project. All rights reserved.
