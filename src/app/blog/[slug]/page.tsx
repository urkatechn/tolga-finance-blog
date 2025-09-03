import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

export const revalidate = 3600; // Revalidate every hour

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: string;
  slug: string;
  author: string;
  featured: boolean;
}

// Mock function to get post by slug - in real app, fetch from API
async function getPostBySlug(slug: string): Promise<Post | null> {
  const mockPosts: Record<string, Post> = {
    "understanding-market-volatility": {
      id: "post-1",
      title: "Understanding Market Volatility",
      excerpt: "Learn how market volatility works and strategies to navigate turbulent times.",
      content: `# Understanding Market Volatility

Market volatility refers to the rate at which the price of assets increases or decreases for a given set of returns. It's a statistical measure of the dispersion of returns for a given security or market index.

## What Causes Market Volatility?

Several factors contribute to market volatility:

### Economic Indicators
- **GDP Growth**: Changes in economic growth rates
- **Inflation Rates**: Rising or falling inflation expectations
- **Employment Data**: Job market strength indicators

### Market Sentiment
Market psychology plays a crucial role in volatility. Fear and greed drive many investment decisions, often leading to:

- Panic selling during market downturns
- Euphoric buying during bull markets
- Herd mentality in investment decisions

## Measuring Volatility

The most common measure of volatility is the **VIX (Volatility Index)**, often called the "fear gauge" of the market.

\`\`\`javascript
// Example: Calculating simple volatility
function calculateVolatility(prices) {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2)) / returns.length;
  
  return Math.sqrt(variance);
}
\`\`\`

## Strategies for Volatile Markets

### 1. Diversification
Don't put all your eggs in one basket. Spread investments across:
- Different asset classes
- Geographic regions  
- Industry sectors

### 2. Dollar-Cost Averaging
Invest a fixed amount regularly, regardless of market conditions. This strategy helps:
- Reduce the impact of volatility
- Lower average cost per share over time
- Remove emotion from investment decisions

### 3. Long-Term Perspective
Remember that volatility is normal and temporary. Historical data shows that markets tend to recover over time.

> "In the short run, the market is a voting machine but in the long run, it is a weighing machine." - Benjamin Graham

## Risk Management

| Strategy | Description | Risk Level |
|----------|-------------|------------|
| Stop-Loss Orders | Automatically sell when price drops to predetermined level | Medium |
| Hedging | Use derivatives to offset potential losses | Low |
| Cash Reserves | Keep portion of portfolio in cash | Low |

## Conclusion

Market volatility is an inherent part of investing. While it can be unsettling, understanding its causes and having a solid strategy can help you navigate turbulent times successfully.

Remember: **Time in the market beats timing the market.**`,
      category: "investing",
      readTime: 5,
      publishedAt: "2025-08-15",
      slug: "understanding-market-volatility",
      author: "Admin User",
      featured: true
    },
    "building-emergency-fund": {
      id: "post-2",
      title: "Building Your Emergency Fund",
      excerpt: "A comprehensive guide to building and maintaining an emergency fund for financial security.",
      content: `# Building Your Emergency Fund

An emergency fund is one of the most important financial safety nets you can create. It's money set aside specifically for unexpected expenses or financial emergencies.

## Why You Need an Emergency Fund

Life is unpredictable. Here are common situations where an emergency fund becomes crucial:

- **Job loss** or reduced income
- **Medical emergencies** not covered by insurance
- **Major home repairs** (roof, HVAC, plumbing)
- **Car repairs** or replacement
- **Family emergencies** requiring travel

## How Much Should You Save?

The general recommendation is to save **3-6 months** of living expenses. However, your target amount depends on:

### Personal Factors
- Job stability and industry
- Number of dependents
- Health conditions
- Insurance coverage

### Economic Conditions
- Current job market
- Economic uncertainty
- Interest rates

## Where to Keep Your Emergency Fund

Your emergency fund should be:
- **Easily accessible** (liquid)
- **Safe** from market volatility
- **Earning some interest** (but not the priority)

### Best Options
1. **High-yield savings accounts** - Easy access, FDIC insured
2. **Money market accounts** - Slightly higher rates, check-writing ability
3. **Short-term CDs** - Higher rates, but less liquid

### Avoid These Options
- Stock market investments
- Long-term CDs
- Retirement accounts (penalties apply)

## Building Your Fund Step by Step

### Step 1: Start Small
Begin with a goal of $1,000. This covers most minor emergencies and builds the habit of saving.

### Step 2: Automate Your Savings
Set up automatic transfers from checking to your emergency fund:
- Start with $25-50 per week
- Increase as your income grows
- Treat it like a non-negotiable bill

### Step 3: Use Windfalls
Direct unexpected money to your emergency fund:
- Tax refunds
- Work bonuses
- Gift money
- Side hustle income

## Maintaining Your Emergency Fund

### When to Use It
Only use your emergency fund for true emergencies:
- ✅ Unexpected medical bills
- ✅ Job loss
- ✅ Major home repairs
- ❌ Vacation
- ❌ Holiday gifts
- ❌ New gadgets

### Replenishing After Use
If you use your emergency fund:
1. **Stop all non-essential spending**
2. **Redirect money** from other budget categories
3. **Consider temporary side income**
4. **Rebuild as quickly as possible**

## Common Mistakes to Avoid

- **Not starting** because the goal seems too big
- **Investing** emergency funds in risky assets
- **Using it for non-emergencies**
- **Not replenishing** after use
- **Keeping too much** (opportunity cost)

## Conclusion

Building an emergency fund takes time and discipline, but it's one of the best investments in your financial security. Start small, be consistent, and watch your peace of mind grow along with your savings.

Remember: **An emergency fund isn't about getting rich—it's about staying financially stable when life happens.**`,
      category: "saving",
      readTime: 7,
      publishedAt: "2025-07-28",
      slug: "building-emergency-fund",
      author: "Admin User",
      featured: false
    }
  };

  return mockPosts[slug] || null;
}

// Compile MDX content to React component
async function compileMDX(content: string) {
  try {
    const compiledMdx = await compile(content, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
      format: 'mdx',
    });

    const { default: MDXComponent } = await run(compiledMdx, {
      ...runtime,
      baseUrl: import.meta.url,
    });

    return MDXComponent;
  } catch (error) {
    console.error("Error compiling MDX:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const MDXContent = await compileMDX(post.content);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="space-y-4">
              <Badge variant="secondary">{post.category}</Badge>
              <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {MDXContent ? (
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:px-4 prose-blockquote:py-2 prose-table:text-sm">
                <MDXContent />
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Sorry, there was an error loading this article.
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Footer */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Separator className="mb-8" />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold mb-2">Enjoyed this article?</h3>
                <p className="text-muted-foreground">Check out more finance insights on our blog.</p>
              </div>
              <Button asChild>
                <Link href="/blog">View More Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params for known posts
export async function generateStaticParams() {
  return [
    { slug: 'understanding-market-volatility' },
    { slug: 'building-emergency-fund' },
  ];
}
