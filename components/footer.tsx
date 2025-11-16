import Link from 'next/link'
import { ExternalLink, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string; external?: boolean }> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[rgb(var(--text-primary))]">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link 
              href={link.href}
              className="text-[13px] text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))] transition-colors inline-flex items-center gap-1"
            >
              {link.label}
              {link.external && <ExternalLink className="h-3 w-3" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#0a0318] border-t border-[rgb(var(--surface))] mt-16">
      {/* Social Media Icons */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-12">
          <a href="#" className="p-2 rounded-full bg-transparent hover:bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-disabled))] hover:text-[rgb(var(--primary))] transition-all">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="p-2 rounded-full bg-transparent hover:bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-disabled))] hover:text-[rgb(var(--primary))] transition-all">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="p-2 rounded-full bg-transparent hover:bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-disabled))] hover:text-[rgb(var(--primary))] transition-all">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="p-2 rounded-full bg-transparent hover:bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-disabled))] hover:text-[rgb(var(--primary))] transition-all">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="p-2 rounded-full bg-transparent hover:bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-disabled))] hover:text-[rgb(var(--primary))] transition-all">
            <Youtube className="h-6 w-6" />
          </a>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          <FooterColumn
            title="Casino"
            links={[
              { label: 'Casino Games', href: '/casino' },
              { label: 'Slots', href: '/slots' },
              { label: 'Live Casino', href: '/live-casino' },
              { label: 'Roulette', href: '/roulette' },
              { label: 'Blackjack', href: '/blackjack' },
              { label: 'Poker', href: '/poker' },
              { label: 'Publishers', href: '/publishers' },
            ]}
          />
          <FooterColumn
            title="Sports"
            links={[
              { label: 'Sportsbook', href: '/sports' },
              { label: 'Live Sports', href: '/sports/live' },
              { label: 'Soccer', href: '/sports/soccer' },
              { label: 'Basketball', href: '/sports/basketball' },
              { label: 'Tennis', href: '/sports/tennis' },
              { label: 'eSports', href: '/sports/esports' },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { label: 'Help Center', href: '/help', external: true },
              { label: 'Fairness', href: '/fairness' },
              { label: 'Gambling Helpline', href: '/helpline', external: true },
              { label: 'Live Support', href: '/support' },
              { label: 'Self Exclusion', href: '/self-exclusion' },
            ]}
          />
          <FooterColumn
            title="About Us"
            links={[
              { label: 'VIP Club', href: '/vip' },
              { label: 'Affiliate', href: '/affiliate' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ]}
          />
          <FooterColumn
            title="Payment Info"
            links={[
              { label: 'Deposits & Withdrawals', href: '/payments' },
              { label: 'Currency Guide', href: '/currency' },
              { label: 'Crypto Guide', href: '/crypto' },
              { label: 'Supported Crypto', href: '/crypto/supported' },
            ]}
          />
          <FooterColumn
            title="FAQ"
            links={[
              { label: 'How-to Guides', href: '/guides' },
              { label: 'Online Casino Guide', href: '/guides/casino' },
              { label: 'Sports Betting Guide', href: '/guides/sports' },
              { label: 'Nest VIP Guide', href: '/guides/vip' },
            ]}
          />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgb(var(--surface))]">
          <div className="text-center space-y-3 text-[11px] text-[rgb(var(--text-disabled))]">
            <p>© 2025 Nest.com | All Rights Reserved.</p>
            <p>
              Nest is committed to responsible gambling. For more information visit{' '}
              <Link href="#" className="text-[rgb(var(--primary))] hover:underline">
                GamblingTherapy.org
              </Link>
            </p>
            <p className="text-[rgb(var(--text-muted))]">1 BTC = $95,877.27</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
