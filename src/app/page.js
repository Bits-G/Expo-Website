'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import LangSwitcher from '@/components/LangSwitcher'
import Countdown from '@/components/Countdown'
import StatCounter from '@/components/StatCounter'
import '@/i18n'

const SECTORS = [
  'Food & Beverage', 'Real Estate', 'Healthcare & Ayurveda', 'Travel & Tourism',
  'FinTech & Banking', 'IT & Digital Services', 'Agriculture & Dairy', 'Retail & E-Commerce',
]

const STALL_PLANS = [
  { name: '3x3 Standard', price: '₹25,000', desc: 'Basic setup, ideal for startups & MSMEs' },
  { name: '4x3 Business', price: '₹45,000', desc: 'Extra space for product display' },
  { name: '6x4 Premium', price: '₹85,000', desc: 'Prime location, higher footfall zone' },
  { name: 'Island / Custom', price: 'On Request', desc: 'Fully custom branded pavilion space' },
]

const SPONSOR_TIERS = ['Title Sponsor', 'Gold Partner', 'Silver Partner', 'Hospitality Partner', 'Digital Partner']

export default function Home() {
  const { t } = useTranslation()

  // Visitor registration form state
  const [visitor, setVisitor] = useState({ full_name: '', mobile: '', email: '', city: '', category: 'Visitor' })
  const [visitorDone, setVisitorDone] = useState(false)

  // Exhibitor inquiry form state
  const [exhibitor, setExhibitor] = useState({ company_name: '', contact_person: '', mobile: '', email: '', business_category: '', stall_type: '3x3', message: '' })
  const [exhibitorDone, setExhibitorDone] = useState(false)

  // Contact form state
  const [contact, setContact] = useState({ name: '', mobile: '', email: '', message: '' })
  const [contactDone, setContactDone] = useState(false)

  const submitVisitor = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('visitors').insert([visitor])
    if (!error) setVisitorDone(true)
  }

  const submitExhibitor = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('exhibitor_inquiries').insert([exhibitor])
    if (!error) setExhibitorDone(true)
  }

  const submitContact = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('contact_messages').insert([contact])
    if (!error) setContactDone(true)
  }

  return (
    <main>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-secondary text-white sticky top-0 z-50">
        <span className="font-heading font-bold text-lg md:text-xl">Business Expo 2026</span>
        <div className="hidden md:flex gap-6 items-center text-sm">
          <a href="#about">{t('nav_about')}</a>
          <a href="#expo">{t('nav_expo')}</a>
          <a href="#exhibit">{t('nav_exhibit')}</a>
          <a href="#sponsors">{t('sponsors_title')}</a>
          <a href="#contact">{t('nav_contact')}</a>
        </div>
        <LangSwitcher />
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-primary/10 to-bg">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-4 max-w-4xl mx-auto">
          {t('hero_title')}
        </h1>
        <p className="text-lg md:text-xl text-primary font-medium mb-2">{t('hero_subtitle')}</p>
        <Countdown />
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <a href="#register" className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:brightness-110 transition">
            {t('cta_register')}
          </a>
          <a href="#exhibit" className="bg-accent text-secondary px-8 py-3 rounded-full font-semibold shadow-lg hover:brightness-95 transition">
            {t('cta_book_stall')}
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-3xl mx-auto text-center py-16 px-4">
        <h2 className="text-3xl font-heading font-bold text-secondary mb-4">{t('about_title')}</h2>
        <p className="text-gray-700 leading-relaxed">{t('about_text')}</p>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCounter target={1500000} label={t('stats_visitors')} />
          <StatCounter target={500} label={t('stats_exhibitors')} />
          <StatCounter target={200} label={t('stats_investors')} />
          <StatCounter target={15} label={t('stats_countries')} />
        </div>
      </section>

      {/* SECTORS */}
      <section id="expo" className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-secondary mb-8 text-center">{t('sectors_title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SECTORS.map((s) => (
            <div key={s} className="bg-white rounded-xl shadow-sm p-5 text-center font-medium text-secondary hover:shadow-md transition">
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* WHY EXHIBIT + STALL PRICING */}
      <section id="exhibit" className="bg-secondary text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-heading font-bold mb-3">{t('why_exhibit_title')}</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">{t('why_exhibit_text')}</p>
        </div>
        <h3 className="text-2xl font-heading font-semibold text-center mb-6">{t('stalls_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {STALL_PLANS.map((p) => (
            <div key={p.name} className="bg-white text-secondary rounded-2xl p-6 text-center shadow-lg">
              <h4 className="font-heading font-bold text-lg mb-1">{p.name}</h4>
              <p className="text-primary text-2xl font-bold mb-2">{p.price}</p>
              <p className="text-sm text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXHIBITOR INQUIRY FORM */}
      <section className="max-w-xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-heading font-bold text-secondary mb-6 text-center">{t('cta_book_stall')}</h2>
        {exhibitorDone ? (
          <p className="text-success text-center text-lg font-medium">{t('thank_you')}</p>
        ) : (
          <form onSubmit={submitExhibitor} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
            <input required placeholder={t('form_company')} className="w-full border p-3 rounded-lg"
              value={exhibitor.company_name} onChange={e => setExhibitor({ ...exhibitor, company_name: e.target.value })} />
            <input placeholder={t('form_contact_person')} className="w-full border p-3 rounded-lg"
              value={exhibitor.contact_person} onChange={e => setExhibitor({ ...exhibitor, contact_person: e.target.value })} />
            <input required placeholder={t('form_mobile')} className="w-full border p-3 rounded-lg"
              value={exhibitor.mobile} onChange={e => setExhibitor({ ...exhibitor, mobile: e.target.value })} />
            <input placeholder={t('form_email')} className="w-full border p-3 rounded-lg"
              value={exhibitor.email} onChange={e => setExhibitor({ ...exhibitor, email: e.target.value })} />
            <input placeholder={t('form_category')} className="w-full border p-3 rounded-lg"
              value={exhibitor.business_category} onChange={e => setExhibitor({ ...exhibitor, business_category: e.target.value })} />
            <select className="w-full border p-3 rounded-lg" value={exhibitor.stall_type}
              onChange={e => setExhibitor({ ...exhibitor, stall_type: e.target.value })}>
              {STALL_PLANS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <textarea placeholder={t('form_message')} className="w-full border p-3 rounded-lg" rows="3"
              value={exhibitor.message} onChange={e => setExhibitor({ ...exhibitor, message: e.target.value })} />
            <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:brightness-110 transition">
              {t('form_submit')}
            </button>
          </form>
        )}
      </section>

      {/* VISITOR REGISTRATION FORM */}
      <section id="register" className="max-w-xl mx-auto py-16 px-4 bg-white/50">
        <h2 className="text-2xl font-heading font-bold text-secondary mb-6 text-center">{t('cta_register')}</h2>
        {visitorDone ? (
          <p className="text-success text-center text-lg font-medium">{t('thank_you')}</p>
        ) : (
          <form onSubmit={submitVisitor} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
            <input required placeholder={t('form_name')} className="w-full border p-3 rounded-lg"
              value={visitor.full_name} onChange={e => setVisitor({ ...visitor, full_name: e.target.value })} />
            <input required placeholder={t('form_mobile')} className="w-full border p-3 rounded-lg"
              value={visitor.mobile} onChange={e => setVisitor({ ...visitor, mobile: e.target.value })} />
            <input placeholder={t('form_email')} className="w-full border p-3 rounded-lg"
              value={visitor.email} onChange={e => setVisitor({ ...visitor, email: e.target.value })} />
            <input placeholder={t('form_city')} className="w-full border p-3 rounded-lg"
              value={visitor.city} onChange={e => setVisitor({ ...visitor, city: e.target.value })} />
            <select className="w-full border p-3 rounded-lg" value={visitor.category}
              onChange={e => setVisitor({ ...visitor, category: e.target.value })}>
              <option>Visitor</option>
              <option>Business</option>
              <option>Investor</option>
              <option>Student</option>
            </select>
            <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:brightness-110 transition">
              {t('form_submit')}
            </button>
          </form>
        )}
      </section>

      {/* SPONSORSHIP TIERS */}
      <section id="sponsors" className="py-16 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-heading font-bold text-secondary mb-8">{t('sponsors_title')}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {SPONSOR_TIERS.map((s) => (
            <span key={s} className="bg-accent text-secondary px-6 py-3 rounded-full font-semibold">{s}</span>
          ))}
        </div>
      </section>

      {/* GALLERY placeholder */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-secondary mb-8 text-center">{t('gallery_title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-200 rounded-xl aspect-square flex items-center justify-center text-gray-400 text-sm">
              Image {i}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-secondary text-white py-16 px-4">
        <h2 className="text-3xl font-heading font-bold mb-8 text-center">{t('contact_title')}</h2>
        <div className="max-w-xl mx-auto">
          {contactDone ? (
            <p className="text-accent text-center text-lg font-medium">{t('thank_you')}</p>
          ) : (
            <form onSubmit={submitContact} className="space-y-4 bg-white text-secondary p-8 rounded-2xl">
              <input required placeholder={t('form_name')} className="w-full border p-3 rounded-lg"
                value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
              <input required placeholder={t('form_mobile')} className="w-full border p-3 rounded-lg"
                value={contact.mobile} onChange={e => setContact({ ...contact, mobile: e.target.value })} />
              <input placeholder={t('form_email')} className="w-full border p-3 rounded-lg"
                value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
              <textarea placeholder={t('form_message')} className="w-full border p-3 rounded-lg" rows="4"
                value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })} />
              <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:brightness-110 transition">
                {t('form_submit')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-secondary/95 text-gray-300 text-center py-6 text-sm border-t border-white/10">
        {t('footer_org')}
      </footer>
    </main>
  )
}
