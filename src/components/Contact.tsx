import React, { useState } from 'react';
import { ScreenId, TransitionType } from '../types';
import { appsScriptApi } from '../services/appsScriptApi';

const aboutLogoUrl = new URL('../../assets/Nava-logo.png', import.meta.url).href;

interface ContactScreenProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: () => void;
}

const FAQS = [
  {
    q: 'Can NavaPack print on HDPE, LDPE, PP, and BOPP?',
    a: 'Yes. NavaPack provides customized flexographic printing for selected HDPE, LDPE, PP, and BOPP packaging products. Printing quality and colour performance depend on the material, ink system, artwork, and product specification.',
  },
  {
    q: 'Which material is best for heavy-duty packaging?',
    a: 'LDPE is often preferred for flexible heavy-duty liners, covers, and industrial packaging. HDPE can also offer strong load performance, depending on the bag thickness and design.',
  },
  {
    q: 'Which material is best for retail display packaging?',
    a: 'PP and unlaminated BOPP are commonly selected when product visibility, clarity, gloss, and printed presentation are important.',
  },
  {
    q: 'Are HDPE, LDPE, PP, and BOPP recyclable?',
    a: 'These materials can be recycled. However, actual recyclability depends on factors such as material type, contamination, printing, thickness, collection systems, and local recycling infrastructure.',
  },
  {
    q: 'Can NavaPack help select the correct thickness?',
    a: 'Yes. Our technical team can recommend suitable material and thickness based on product weight, bag size, handling conditions, storage, printing requirements, and budget.',
  },
];

export const ContactScreen: React.FC<ContactScreenProps> = ({ onNavigate, onRequestQuote }) => {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    company: '',
    email: '',
    inquiryType: 'Supply Chain Partnership',
    message: '',
  });
  const [inquirySent, setInquirySent] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail.trim()) {
      try { await appsScriptApi.subscribe(subscribeEmail); setSubscribed(true); setSubscribeEmail(''); setTimeout(() => setSubscribed(false), 3500); }
      catch { setSubscribed(false); }
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await appsScriptApi.submitInquiry(inquiryForm); setInquirySent(true); }
    catch { return; }
    setTimeout(() => {
      setInquirySent(false);
      setInquiryForm({
        fullName: '',
        company: '',
        email: '',
        inquiryType: 'Supply Chain Partnership',
        message: '',
      });
    }, 3500);
  };

  const handlePageLink = (target: ScreenId) => {
    if (target === 'about') return;
    const transition: TransitionType = target === 'home' ? 'push_back' : 'none';
    onNavigate(target, transition);
  };

  return (
    <div className="w-full pt-28 pb-20">
      <section className="relative min-h-screen flex items-center pb-12 overflow-hidden px-6 md:px-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="ken-burns-bg w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQRH9ws2MFCikmbJhCi3X1YVurvIWfw2GKjHAVa6mwsEceumRskn4S9Y&s=10')`,
            }}
          />
          <div className="absolute inset-0 bg-[#000000]/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
          <div className="bg-white rounded-[2rem] p-8 md:p-14 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <img src={aboutLogoUrl} alt="NavaPack logo" className="h-10 object-contain" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000000] leading-tight mb-6">
                We believe <span className="text-[#45464d] font-normal">real change</span> starts deep within the supply chain.
              </h1>

              <p className="text-[#45464d] text-base sm:text-lg mb-8">
                Join our eco-supply community and receive continuous updates on sustainable packaging innovations.
              </p>

              <form onSubmit={handleSubscribe} className="relative max-w-md">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#f2f4f6] border-none rounded-full py-4 px-6 pr-36 text-xs sm:text-sm focus:ring-2 focus:ring-[#006c49] outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#6ffbbe] text-[#005236] px-6 rounded-full font-bold text-xs sm:text-sm hover:brightness-105 transition-all cursor-pointer"
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>
              {subscribed && (
                <p className="text-[#006c49] text-xs font-semibold mt-2">Welcome to the NavaPack network!</p>
              )}
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 md:p-12 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 text-[#191c1e]">
            <div>
              <h3 className="text-2xl font-bold text-[#000000] mb-6">Pages</h3>
              <ul className="space-y-3 text-sm text-[#45464d]">
                <li>
                  <button
                    onClick={() => handlePageLink('home')}
                    className="hover:text-[#006c49] transition-colors cursor-pointer font-medium"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <span className="text-[#006c49] font-bold">About Us</span>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink('products')}
                    className="hover:text-[#006c49] transition-colors cursor-pointer font-medium"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePageLink('sustainability')}
                    className="hover:text-[#006c49] transition-colors cursor-pointer font-medium"
                  >
                    Sustainability
                  </button>
                </li>
                <li>
                  <a href="#contact-section" className="hover:text-[#006c49] transition-colors font-medium">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#000000] mb-6">Address</h3>
              <div className="text-xs text-[#45464d] space-y-4 leading-relaxed">
                <p>
                  <strong>Kampala Facility:</strong><br />
                  P.O. Box 117814, Plot#22, Ring Road, Nalukolongo Ind Area<br />
                  Kampala, Uganda
                </p>
                
              </div>
            </div>

            <div className="pt-6 border-t border-[#c6c6cd]">
              <h3 className="text-2xl font-bold text-[#000000] mb-4">Contact</h3>
              <div className="text-xs text-[#45464d] space-y-1.5 font-medium">
                <p>info@navapack.co.ug</p>
                <p>+256 753 349228</p>
                <p>+256 740 617764</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#c6c6cd]">
              <h3 className="text-2xl font-bold text-[#000000] mb-4">Social Media</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#000000] text-white flex items-center justify-center hover:bg-[#006c49] transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#000000] text-white flex items-center justify-center hover:bg-[#006c49] transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">hub</span>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#000000] text-white flex items-center justify-center hover:bg-[#006c49] transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">public</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block px-4 py-1 rounded-full border border-[#c6c6cd] text-[#45464d] font-semibold text-xs uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#000000] leading-tight">
              Frequently asked <span className="text-[#45464d] font-normal">questions</span>
            </h2>
            <p className="text-[#45464d] text-sm leading-relaxed">
              Common questions about materials, printing, and choosing the right packaging for your product.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((item, i) => (
              <div
                key={item.q}
                className="bg-white rounded-2xl border border-[#c6c6cd] shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left p-5 cursor-pointer"
                >
                  <span className="font-bold text-sm text-[#000000]">{item.q}</span>
                  <span
                    className="material-symbols-outlined text-[#006c49] shrink-0 transition-transform"
                    style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}
                  >
                    add
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-[#45464d] text-xs leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto" id="contact-section">
        <div className="bg-[#f2f4f6] rounded-[2rem] shadow-2xl border border-[#c6c6cd] overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 md:p-14">
            <h2 className="text-3xl font-extrabold text-[#000000] mb-3">Connect with Our Strategy Team</h2>
            <p className="text-[#45464d] text-sm mb-8">
              Whether you are looking for a supply chain partner or industrial packaging consultation, our experts are ready to assist.
            </p>

            {inquirySent ? (
              <div className="p-8 bg-white rounded-2xl border border-[#6cf8bb] text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#006c49]">check_circle</span>
                <h4 className="font-bold text-lg text-[#000000]">Inquiry Transmitted</h4>
                <p className="text-xs text-[#45464d]">
                  Thank you! Our technical strategy team will review your inquiry and respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#000000] mb-1 uppercase tracking-wide">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.fullName}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white border border-[#c6c6cd] focus:border-[#006c49] focus:ring-0 rounded-xl p-3 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000000] mb-1 uppercase tracking-wide">
                      COMPANY
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.company}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                      placeholder="Global Logistics Ltd"
                      className="w-full bg-white border border-[#c6c6cd] focus:border-[#006c49] focus:ring-0 rounded-xl p-3 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000000] mb-1 uppercase tracking-wide">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full bg-white border border-[#c6c6cd] focus:border-[#006c49] focus:ring-0 rounded-xl p-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000000] mb-1 uppercase tracking-wide">
                    INQUIRY TYPE
                  </label>
                  <select
                    value={inquiryForm.inquiryType}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, inquiryType: e.target.value })}
                    className="w-full bg-white border border-[#c6c6cd] focus:border-[#006c49] focus:ring-0 rounded-xl p-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="Supply Chain Partnership">Supply Chain Partnership</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Corporate Governance">Corporate Governance</option>
                    <option value="Press &amp; Media">Press &amp; Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000000] mb-1 uppercase tracking-wide">
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="How can we help your business achieve circularity?"
                    className="w-full bg-white border border-[#c6c6cd] focus:border-[#006c49] focus:ring-0 rounded-xl p-3 text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#000000] text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#006c49] transition-all shadow-lg cursor-pointer"
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            )}
          </div>

          <div className="lg:w-1/2 relative min-h-[450px]">
            <div className="absolute inset-0 bg-[#131b2e] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                alt="Kampala Industrial Map"
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              />
            </div>

            <div className="absolute bottom-8 left-8 right-8 bg-[#131b2e]/95 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white shadow-2xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6ffbbe]">location_on</span>
                Headquarters
              </h4>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                P.O. Box 117814, Plot#22, Ring Road, Nalukolongo Ind Area<br />
                Kampala, Uganda
              </p>
              <div className="flex flex-col gap-2 text-xs">
                <a href="tel:+256753349228" className="flex items-center gap-2 font-medium hover:text-[#6ffbbe] transition-colors">
                  <span className="material-symbols-outlined text-sm">call</span>+256 753 349228
                  <span className="material-symbols-outlined text-sm">call</span>+256 740617764
                </a>
                <a href="mailto:info@navapack.co.ug" className="flex items-center gap-2 font-medium hover:text-[#6ffbbe] transition-colors">
                  <span className="material-symbols-outlined text-sm">mail</span> info@navapack.co.ug
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
