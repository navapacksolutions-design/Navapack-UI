import React from 'react';
import { ScreenId, TransitionType } from '../types';

interface AboutUsScreenProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: () => void;
}

const CORE_VALUES = [
  'Quality',
  'Innovation',
  'Sustainability',
  'Integrity',
  'Customer Focus',
  'Continuous Improvement',
  'Technical Excellence',
  'Responsible Manufacturing',
];

export const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ onNavigate, onRequestQuote }) => {
  return (
    <div className="w-full pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">

        {/* Hero */}
        <section className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center bg-[#131b2e] p-8 md:p-14 text-white shadow-xl">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src="https://img.magnific.com/free-photo/plastic-recycling-plant_23-2151951191.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Plastic manufacturing and packaging production line"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#6cf8bb]/20 rounded-full mb-6 border border-[#6ffbbe]/30">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]" aria-hidden="true" />
              <span className="text-[#6ffbbe] font-bold text-xs tracking-widest uppercase">About NavaPack Solutions</span>
            </div> */}

            <h1 className="font-extrabold text-3xl sm:text-5xl mb-6 leading-tight">
              A Growing Manufacturer of <br />
              <span className="text-[#4edea3]">Customized Flexible Packaging</span>
            </h1>

            <p className="text-white text-base sm:text-lg mb-8 leading-relaxed">
              NavaPack Solutions is a growing manufacturer of customized flexible packaging products and a
              committed partner in plastic waste management and recycling. We manufacture plastic bags,
              liners, overwraps, packaging films, and customized printed packaging products using HDPE,
              LDPE, PP, and unlaminated BOPP materials — serving agriculture, healthcare, retail, FMCG,
              food processing, hospitality, waste management, textiles, garments, and industrial manufacturing.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onRequestQuote}
                className="bg-[#10B981] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                Request a Quote
              </button>
              <button
                onClick={() => onNavigate('sustainability', 'push')}
                className="border border-white/30 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                View Sustainability
              </button>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Our Story</span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000] mt-1">
              From Plastic Waste Management to Value-Added Packaging
            </h2>
          </div>

          <div className="bg-[#f2f4f6] rounded-3xl p-6 md:p-10 border border-[#c6c6cd] space-y-4">
            <p className="text-[#131b2e] font-semibold text-lg leading-relaxed italic">
              "Most packaging companies talk about recycling. We started as recyclers."
            </p>
            <p className="text-[#45464d] text-sm leading-relaxed">
              NavaPack Solutions commenced production on 1 April 2021, with a primary focus on addressing
              the growing challenge of plastic waste management. Our initial objective was to collect,
              process, and recycle plastic waste into reusable materials, contributing to a more responsible
              and circular approach to plastic use.
            </p>
            <p className="text-[#45464d] text-sm leading-relaxed">
              As the business developed, we identified an opportunity to create greater value by converting
              recycled plastic materials into useful, value-added finished products. In 2022, NavaPack
              expanded its operations by introducing a virgin-grade material product line alongside its
              recycled-material products, enabling us to serve a broader range of customer requirements.
            </p>
            <p className="text-[#45464d] text-sm leading-relaxed">
              Over the past five years, NavaPack has evolved from a recycling-focused company into a
              trusted customized flexible packaging manufacturer, investing in modern printing technology,
              packaging production capability, and a technically skilled team. Our team members bring
              between 10 and 30 years of experience in flexible packaging — their product knowledge and
              problem-solving skills enable practical packaging solutions tailored to each customer's requirements.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-2xl border border-[#c6c6cd] p-8 space-y-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-widest">Our Mission</span>
            <p className="text-[#45464d] text-sm leading-relaxed">
              To provide innovative, reliable, and customized flexible packaging solutions that create
              value for our customers while promoting responsible plastic waste management and recycling.
            </p>
          </div>

          <div className="bg-[#131b2e] text-white rounded-2xl p-8 space-y-3">
            <span className="text-xs font-bold text-[#6ffbbe] uppercase tracking-widest">Our Vision</span>
            <p className="text-[#a9afc3] text-sm leading-relaxed">
              To become a preferred manufacturer of customized flexible and rigid packaging and sustainable
              plastic solutions in Africa through innovation, quality, technical expertise, and customer satisfaction.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">What Drives Us</span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000] mt-1">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CORE_VALUES.map((v) => (
              <div
                key={v}
                className="bg-white rounded-2xl border border-[#c6c6cd] p-5 text-center hover:shadow-lg transition-all duration-300"
              >
                <span className="font-bold text-sm text-[#000000]">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Strength */}
        <section className="bg-[#f2f4f6] rounded-3xl p-6 md:p-10 border border-[#c6c6cd]">
          <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Technical Strength</span>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000] mt-1 mb-4">
            More Than Just a Bag or a Film
          </h2>
          <p className="text-[#45464d] text-sm leading-relaxed max-w-3xl">
            At NavaPack, we understand that packaging is not only about supplying a bag or film. It is about
            ensuring that the material, size, thickness, sealing method, printing, handling strength, and
            product presentation meet the customer's operational requirements. Our technical team works
            closely with customers to recommend practical packaging options based on product weight,
            handling conditions, display requirements, storage conditions, printing needs, and budget.
          </p>
        </section>

        {/* Final CTA */}
        <section className="bg-[#000000] text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-extrabold text-3xl sm:text-4xl mb-4">
              Need custom packaging?
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed">
              Speak to our technical team for the right material, thickness, design, and printing solution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onRequestQuote}
                className="bg-[#10B981] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                Request a Custom Quote
              </button>
              <button
                onClick={() => onNavigate('products', 'push')}
                className="border border-white/30 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                View Product Portfolio
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
