import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Calendar, 
  Users, 
  Award, 
  Headphones,
  Building,
  Plane
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SEO from '../components/SEO';
import { CBSI_CONTACT } from '../data/safariData';
import styles from '../styles/ContactPage.module.css';

const TRIP_TYPES = [
  'Luxury Wildlife Safari',
  'Great Migration Air Charter',
  'Corporate Conference & MICE Summit',
  'Private Family Bush Villa',
  'Honeymoon & Romantic Retreat',
  'Gorilla Trekking (Uganda/Rwanda)',
  'Mount Kenya & Kilimanjaro Climbing'
];

const DESTINATIONS_LIST = [
  'Masai Mara',
  'Serengeti',
  'Amboseli / Kilimanjaro',
  'Ngorongoro Crater',
  'Samburu & Buffalo Springs',
  'Lake Nakuru & Naivasha',
  'Diani Beach & Coast',
  'Bwindi Impenetrable Gorillas',
  'Tsavo East & West'
];

const FAQS = [
  {
    question: 'How quickly will I receive a customized itinerary and quotation?',
    answer: 'Our Nairobi head office team prepares fully customized safari itineraries with live lodge availability and transparent pricing within 2 to 4 business hours. If you contact us via WhatsApp, our on-duty safari architect responds immediately.'
  },
  {
    question: 'Can you arrange private charter flights directly to bush airstrips?',
    answer: 'Yes. We partner with premier aviation operators at Wilson Airport (Nairobi) and Arusha Airport to provide scheduled and private chartered flights (Cessna Grand Caravan & Beechcraft) landing directly in the Masai Mara, Serengeti, Amboseli, and coastal airstrips.'
  },
  {
    question: 'Do you manage complete corporate conferences and summit delegate logistics?',
    answer: 'Absolutely. CBSI specializes in corporate MICE (Meetings, Incentives, Conferences, and Exhibitions) services across East Africa. We manage venue contracting, audiovisual setups, airport VIP transfers, translation logistics, and post-conference safari extensions for global delegates.'
  },
  {
    question: 'What payment methods and currency options are supported?',
    answer: 'We accept international SWIFT bank wire transfers, major credit cards (Visa, MasterCard, American Express) via secure encrypted checkout, and local mobile money (M-Pesa Global). We quote and invoice in USD, EUR, GBP, and KES.'
  },
  {
    question: 'Are CBSI safari guides certified and multi-lingual?',
    answer: 'All CBSI safari driver-guides are certified by the Kenya Professional Safari Guides Association (KPSGA) with Silver/Gold ratings and over 10+ years of bush tracking experience. We offer guides fluent in English, French, German, Spanish, Italian, and Swahili.'
  }
];

function ContactPage() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    tripType: 'Luxury Wildlife Safari',
    travelers: '2 Adults',
    travelDate: '',
    durationDays: '5-7 Days',
    budgetClass: 'Luxury Lodge & Bush Tents',
    notes: '',
    preferredChannel: 'WhatsApp'
  });

  const [selectedDestinations, setSelectedDestinations] = useState(['Masai Mara']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDestination = (dest) => {
    setSelectedDestinations((prev) => 
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || (!formData.email && !formData.phone)) {
      alert('Please provide your name and at least an email or WhatsApp number.');
      return;
    }

    setIsSubmitted(true);
    
    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.debug('Confetti effect skipped', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = `Hello CBSI Safaris! I'm submitting a safari inquiry:
*Name:* ${formData.fullName}
*Country:* ${formData.country || 'International'}
*Inquiry Type:* ${formData.tripType}
*Destinations:* ${selectedDestinations.join(', ') || 'East Africa Highlights'}
*Travelers:* ${formData.travelers}
*Target Travel Dates:* ${formData.travelDate || 'Flexible'}
*Duration:* ${formData.durationDays}
*Accommodation Class:* ${formData.budgetClass}
*Special Notes:* ${formData.notes || 'None'}

Please provide quotation & availability.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/254722774952?text=${encoded}`, '_blank');
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      tripType: 'Luxury Wildlife Safari',
      travelers: '2 Adults',
      travelDate: '',
      durationDays: '5-7 Days',
      budgetClass: 'Luxury Lodge & Bush Tents',
      notes: '',
      preferredChannel: 'WhatsApp'
    });
    setSelectedDestinations(['Masai Mara']);
  };

  return (
    <div className={styles.contactPage}>
      <SEO 
        title="Contact Our Nairobi Safari Architects & Booking Office"
        description="Get in touch with Conference Bookings & Safaris International. Call +254 722 774 952 or message our 24/7 Nairobi dispatch desk for bespoke Kenya & Tanzania safaris and corporate conference logistics."
        keywords="contact CBSI, Kenya safari inquiry, Nairobi safari booking office, custom safari quote, MICE conference planners Kenya"
      />

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.eyebrowBadge}>
            <Sparkles size={14} />
            <span>24/7 Nairobi Expedition Office</span>
          </div>
          <h1>Connect With Our Safari Architects</h1>
          <p className={styles.tagline}>
            Whether planning an iconic Great Migration expedition, a private fly-in safari, or international corporate summit logistics, our Nairobi concierge desk is at your service.
          </p>

          <div className={styles.quickPills}>
            <a 
              href="https://wa.me/254722774952?text=Hello%20CBSI%20Safaris,%20I%20would%20like%20to%20plan%20a%20safari." 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.pillBtn} ${styles.whatsappPill}`}
              id="hero-whatsapp-btn"
            >
              <MessageCircle size={18} />
              <span>Instant WhatsApp Concierge</span>
            </a>
            <a href="tel:+254722774952" className={`${styles.pillBtn} ${styles.phonePill}`} id="hero-phone-btn">
              <Phone size={18} />
              <span>+254 722 774 952</span>
            </a>
            <a href="mailto:safariscbsi@gmail.com" className={`${styles.pillBtn} ${styles.emailPill}`} id="hero-email-btn">
              <Mail size={18} />
              <span>safariscbsi@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE FORM & DISPATCH INFO */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            
            {/* Left: Safari & Conference Consultation Form */}
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>Request a Bespoke Proposal</h2>
                <p>Tell us your vision and our safari master naturalists will craft an individualized itinerary within hours.</p>
              </div>

              {isSubmitted ? (
                <div className={styles.successCard}>
                  <div className={styles.successIconBox}>
                    <CheckCircle2 size={38} />
                  </div>
                  <h3>Thank You, {formData.fullName}!</h3>
                  <p>
                    Your safari and conference inquiry has been received by our Nairobi operations desk. A senior safari specialist is preparing your proposal.
                  </p>

                  <div className={styles.successActions}>
                    <button onClick={handleOpenWhatsApp} className={styles.whatsappChatBtn} id="send-whatsapp-inquiry-btn">
                      <MessageCircle size={18} />
                      <span>Chat Immediately with Nairobi Lead</span>
                    </button>
                    <button onClick={handleResetForm} className={styles.resetBtn} id="reset-inquiry-form-btn">
                      Send Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="safari-contact-form">
                  
                  {/* Name & Country */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="fullName">Full Name *</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName" 
                        required 
                        placeholder="e.g. Dr. Eleanor Vance" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="country">Country of Residence</label>
                      <input 
                        type="text" 
                        id="country" 
                        name="country" 
                        placeholder="e.g. United Kingdom, USA, Germany..." 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        placeholder="e.g. eleanor@example.com" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="phone">WhatsApp / Phone *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        placeholder="e.g. +44 7911 123456" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* Trip Type & Duration */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="tripType">Expedition / Service Type</label>
                      <select 
                        id="tripType" 
                        name="tripType" 
                        value={formData.tripType} 
                        onChange={handleInputChange} 
                        className={styles.select}
                      >
                        {TRIP_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="travelers">Party Size</label>
                      <input 
                        type="text" 
                        id="travelers" 
                        name="travelers" 
                        placeholder="e.g. 2 Adults, 2 Children" 
                        value={formData.travelers} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>
                  </div>

                  {/* Destination Tag Multi-Select */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Destinations of Interest (Select all that apply)</label>
                    <div className={styles.destinationChips}>
                      {DESTINATIONS_LIST.map((dest) => {
                        const isSelected = selectedDestinations.includes(dest);
                        return (
                          <button
                            type="button"
                            key={dest}
                            onClick={() => toggleDestination(dest)}
                            className={`${styles.chipBtn} ${isSelected ? styles.chipSelected : ''}`}
                          >
                            {isSelected ? '✓ ' : '+ '} {dest}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Travel Date & Accommodation Tier */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="travelDate">Target Travel Season / Dates</label>
                      <input 
                        type="text" 
                        id="travelDate" 
                        name="travelDate" 
                        placeholder="e.g. August 2026 (Migration Peak)" 
                        value={formData.travelDate} 
                        onChange={handleInputChange} 
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="budgetClass">Accommodation Preference</label>
                      <select 
                        id="budgetClass" 
                        name="budgetClass" 
                        value={formData.budgetClass} 
                        onChange={handleInputChange} 
                        className={styles.select}
                      >
                        <option value="Ultra-Luxury Fly-in Bush Camps">Ultra-Luxury Fly-in Bush Camps</option>
                        <option value="Luxury Lodge & Bush Tents">Luxury Lodge & Bush Tents (Standard Premium)</option>
                        <option value="5-Star Conference Resort & Spa">5-Star Conference Resort & Spa</option>
                        <option value="Classic Comfortable Mid-Range">Classic Comfortable Mid-Range</option>
                        <option value="Tailor-Made Custom">Tailor-Made to Budget</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="notes">Special Requirements & Preferences</label>
                    <textarea 
                      id="notes" 
                      name="notes" 
                      rows={3} 
                      placeholder="Let us know about hot air balloon desires, dietary restrictions, photography equipment focus, or conference breakout requirements..." 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      className={styles.textarea}
                    />
                  </div>

                  {/* Preferred Reply Channel */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Preferred Response Channel</label>
                    <div className={styles.replyOptionGroup}>
                      {['WhatsApp', 'Email', 'Phone Call'].map((channel) => (
                        <button
                          type="button"
                          key={channel}
                          onClick={() => setFormData((prev) => ({ ...prev, preferredChannel: channel }))}
                          className={`${styles.replyBtn} ${formData.preferredChannel === channel ? styles.replyBtnActive : ''}`}
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className={styles.submitBtn} id="submit-contact-form-btn">
                    <Send size={18} />
                    <span>Submit Safari Consultation Request</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Nairobi Headquarters & Direct Dispatch Desk */}
            <div className={styles.sidebar}>
              
              {/* Dispatch Details Card */}
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>
                  <Compass size={22} />
                  <span>Nairobi Expedition HQ</span>
                </h3>

                <div className={styles.contactList}>
                  <div className={styles.contactRow}>
                    <div className={styles.iconWrapper}>
                      <Phone size={20} />
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Direct Line & WhatsApp</h4>
                      <a href="tel:+254722774952">+254 722 774 952</a>
                    </div>
                  </div>

                  <div className={styles.contactRow}>
                    <div className={styles.iconWrapper}>
                      <Mail size={20} />
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Booking & Inquiries</h4>
                      <a href="mailto:safariscbsi@gmail.com">safariscbsi@gmail.com</a>
                      <a href="mailto:info@cbsisafaris.com" style={{ display: 'block', marginTop: '2px' }}>info@cbsisafaris.com</a>
                    </div>
                  </div>

                  <div className={styles.contactRow}>
                    <div className={styles.iconWrapper}>
                      <MapPin size={20} />
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Head Office Location</h4>
                      <address>
                        P.O. Box 26247-00100, GPO<br />
                        Karen Road / Kenyatta Ave, Nairobi, Kenya
                      </address>
                    </div>
                  </div>

                  <div className={styles.contactRow}>
                    <div className={styles.iconWrapper}>
                      <Clock size={20} />
                    </div>
                    <div className={styles.contactDetails}>
                      <h4>Field Dispatch Hours</h4>
                      <p>Mon - Sun: 24/7 International Desk & Bush Radio Coordination</p>
                    </div>
                  </div>
                </div>

                {/* Regional Operations Hubs */}
                <div style={{ marginTop: '28px', borderTop: '1px solid #ebd9c2', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4a2810', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                    Regional East Africa Hubs
                  </h4>
                  <div className={styles.hubsGrid}>
                    <div className={styles.hubItem}>
                      <span className={styles.hubCity}>Nairobi, Kenya</span>
                      <span className={styles.hubRole}>Central Headquarters & MICE</span>
                    </div>
                    <div className={styles.hubItem}>
                      <span className={styles.hubCity}>Arusha, Tanzania</span>
                      <span className={styles.hubRole}>Serengeti & Crater Base</span>
                    </div>
                    <div className={styles.hubItem}>
                      <span className={styles.hubCity}>Mombasa & Diani</span>
                      <span className={styles.hubRole}>Coastal Marine Expeditions</span>
                    </div>
                    <div className={styles.hubItem}>
                      <span className={styles.hubCity}>Kigali, Rwanda</span>
                      <span className={styles.hubRole}>Volcanoes Gorilla Logistics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accreditations & Guarantees */}
              <div className={styles.guaranteeCard}>
                <h3>Our Field Guarantee</h3>
                <ul className={styles.guaranteeList}>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>Tourism Regulatory Authority (TRA) Registered Operator</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>Certified Kenya Association of Tour Operators (KATO) Member</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>VIP Airport Meet & Greet at Jomo Kenyatta & Wilson Airports</span>
                  </li>
                  <li>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>Flying Doctors (AMREF) Emergency Evacuation Insurance Included</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqHeader}>
            <span className={styles.eyebrowBadge}>
              <HelpCircle size={14} />
              <span>Safari Planning Advice</span>
            </span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about booking bespoke safaris, flight logistics, and corporate conferences in East Africa.</p>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div key={index} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => setActiveFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={20} color="#75421d" /> : <ChevronDown size={20} color="#75421d" />}
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;