import React from 'react';
import { ScreenId, TransitionType } from '../types';
import employeeImage from  '../../assets/emple.jpg'
interface SustainabilityScreenProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: () => void;
}

// Registrations and memberships pulled directly from the company profile —
// no certifications are claimed here beyond what's actually documented.
const REGISTRATIONS = [
  { abbr: 'NEMA', name: 'National Environment Management Authority' },
  { abbr: 'UNBS', name: 'Uganda National Bureau of Standards' },
  { abbr: 'UIA', name: 'Uganda Investment Authority' },
  { abbr: 'URSB', name: 'Uganda Registration Services Bureau' },
  { abbr: 'URA', name: 'Uganda Revenue Authority' },
  { abbr: 'KCCA', name: 'Kampala Capital City Authority' },
];

const MEMBERSHIPS = [
  { abbr: 'UMA', name: 'Uganda Manufacturers Association' },
  { abbr: 'UPMRA', name: 'Uganda Plastic Manufacturers & Recyclers Association' },
];

const APPROACH_ITEMS = [
  'Industrial plastic waste collection',
  'Plastic recycling and reprocessing',
  'HDPE recycling',
  'LDPE recycling',
  'PP recycling',
  'Rigid plastic processing',
  'Processing of ABS, PVC, and raffia, where applicable',
  'Industrial pulverizing services for PVC and PE',
  'Reduced material waste through optimized packaging design',
  'Responsible use of recycled materials where suitable',
];

const NON_LAMINATED_ADVANTAGES = [
  'Simplified material structures',
  'Cost efficiency',
  'Faster production processes',
  'Suitable for many industrial, agricultural, retail, and general packaging applications',
  'Easier recycling opportunities when the packaging is made from a single polymer type',
];

export const SustainabilityScreen: React.FC<SustainabilityScreenProps> = ({ onNavigate, onRequestQuote }) => {
  return (
    <div className="w-full pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        {/* Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden min-h-[420px] flex items-center bg-[#131b2e] p-8 md:p-14 text-white shadow-xl">
          <div className="absolute inset-0 z-0 opacity-20">
            <img
              src="https://www.westecplastics.com/wp-content/uploads/2024/04/iStock-868792010.jpg"
              alt="Industrial plastic processing equipment on the factory floor"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#6cf8bb]/20 rounded-full mb-6 border border-[#6ffbbe]/30">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]" aria-hidden="true" />
              <span className="text-[#6ffbbe] font-bold text-xs tracking-widest uppercase">Sustainability</span>
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl mb-6 leading-tight">
              Sustainability and <br />
              <span className="text-[#4edea3]">Circular Packaging Solutions</span>
            </h1>

            <p className="text-white text-base sm:text-lg mb-8 leading-relaxed">
              NavaPack Solutions was established with a strong focus on addressing plastic waste-management
              challenges. Recycling remains an important part of our business and our commitment to
              responsible manufacturing. We collect and process selected industrial plastic waste and
              convert suitable materials into reusable recycled plastic materials and value-added products.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 min-w-[150px]">
                <div className="text-[#6ffbbe] font-extrabold text-2xl">100 MT</div>
                <div className="text-[#7c839b] text-xs font-medium">Recycling / Month</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20 min-w-[150px]">
                <div className="text-[#6ffbbe] font-extrabold text-2xl">120 MT</div>
                <div className="text-[#7c839b] text-xs font-medium">Blown Film Extrusion / Month</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Sustainability Approach */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Approach</span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000] mt-1">Our Sustainability Approach</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {APPROACH_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl border border-[#c6c6cd] p-4">
                <span className="material-symbols-outlined text-[#006c49] text-lg mt-0.5" aria-hidden="true">check_circle</span>
                <span className="text-[#45464d] text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recycled and Virgin-Grade Materials */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-2xl border border-[#c6c6cd] p-8 space-y-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-widest">Materials</span>
            <h3 className="font-extrabold text-xl text-[#000000]">Recycled and Virgin-Grade Materials</h3>
            <p className="text-[#45464d] text-sm leading-relaxed">
              NavaPack offers both recycled-material and virgin-grade material product options. The
              appropriate material depends on the application, performance requirement, product type,
              customer specification, and applicable standards. Some packaging applications may require
              virgin-grade materials, while recycled materials may be suitable for selected industrial,
              agricultural, waste-management, or non-food applications — balancing product performance,
              cost efficiency, and responsible material use.
            </p>
          </div>

          <div className="bg-[#131b2e] text-white rounded-2xl p-8 space-y-3">
            <span className="text-xs font-bold text-[#6ffbbe] uppercase tracking-widest">Non-Laminated Packaging</span>
            <h3 className="font-extrabold text-xl">Why Choose Non-Laminated Packaging?</h3>
            <ul className="text-[#a9afc3] text-sm leading-relaxed space-y-1.5 list-disc list-inside">
              {NON_LAMINATED_ADVANTAGES.map((adv) => (
                <li key={adv}>{adv}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Manufacturing Capabilities */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Infrastructure</span>
              <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000] mt-1">Manufacturing Capabilities</h2>
              <p className="text-[#45464d] text-sm">Vertically integrated recycling, extrusion, and finishing.</p>
            </div>
            <button
              onClick={onRequestQuote}
              className="text-[#006c49] flex items-center gap-1 font-bold text-xs hover:text-[#005236] transition-colors cursor-pointer"
            >
              <span>Request Facility Details</span>
              <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Blown Film Extrusion */}
            <div className="bg-white rounded-2xl border border-[#c6c6cd] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="h-64 relative overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/f6/fc/63/f6fc6363f279cd16fa61453d44239436.jpg"
                  alt="Blown film extrusion line producing flexible packaging film"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-[#006c49] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Core Capability
                  </span>
                  <h3 className="font-bold text-2xl mt-1.5">Recycling &amp; Film Extrusion</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[#45464d] text-sm leading-relaxed">
                  Post-consumer and post-industrial plastic waste converted into recycled pellets, then
                  processed through blown film extrusion into flexible packaging film.
                </p>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center border-b border-[#e0e3e5] pb-2">
                    <span className="text-[#45464d]">Recycling</span>
                    <span className="font-bold text-[#000000]">Industrial Crushers, Agglomeration Systems, Pelletizing Lines</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#e0e3e5] pb-2">
                    <span className="text-[#45464d]">Film Extrusion</span>
                    <span className="font-bold text-[#000000]">Blown Film Extrusion Plants</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#45464d]">Conversion</span>
                    <span className="font-bold text-[#006c49]">Automated Bag Conversion Lines</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flexographic Printing */}
            <div className="bg-white rounded-2xl border border-[#c6c6cd] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="h-64 relative overflow-hidden">
                <img
                  src={employeeImage}
                  alt="Flexographic printing press applying branded graphics to packaging film"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-[#006c49] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Printing &amp; Finishing
                  </span>
                  <h3 className="font-bold text-2xl mt-1.5">Flexographic Printing</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[#45464d] text-sm leading-relaxed">
                  Dual-press flexographic printing with precision slitting for custom branded and
                  commercial packaging finishing.
                </p>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between items-center border-b border-[#e0e3e5] pb-2">
                    <span className="text-[#45464d]">Press 1</span>
                    <span className="font-bold text-[#000000]">4-Color 800mm Stack-Type</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#e0e3e5] pb-2">
                    <span className="text-[#45464d]">Press 2</span>
                    <span className="font-bold text-[#000000]">6-Color 1200mm, Enclosed Doctor Blade Chamber</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#45464d]">Finishing</span>
                    <span className="font-bold text-[#006c49]">Precision Roll Slitting Equipment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Production Capacity */}
        <section className="bg-[#f2f4f6] rounded-3xl p-6 md:p-10 border border-[#c6c6cd]">
          <div className="mb-8">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Capacity</span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-[#000000]">Production Capacity</h2>
            <p className="text-[#45464d] text-xs sm:text-sm">Current output and near-term scaling target.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]">
              <div className="text-3xl font-extrabold text-[#006c49]">100 MT</div>
              <div className="text-[#45464d] text-xs font-semibold uppercase tracking-wide mt-1">Recycling / Month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]">
              <div className="text-3xl font-extrabold text-[#006c49]">120 MT</div>
              <div className="text-[#45464d] text-xs font-semibold uppercase tracking-wide mt-1">Extrusion / Month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]">
              <div className="text-3xl font-extrabold text-[#006c49]">150 MT</div>
              <div className="text-[#45464d] text-xs font-semibold uppercase tracking-wide mt-1">Short-Term Target</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]">
              <div className="text-3xl font-extrabold text-[#006c49]">100%</div>
              <div className="text-[#45464d] text-xs font-semibold uppercase tracking-wide mt-1">Capacity Increase by Aug 2026</div>
            </div>
          </div>
        </section>

        {/* Governance & Compliance — sourced directly from the company profile */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="space-y-6">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-wider">Compliance</span>
            <h2 className="font-extrabold text-3xl text-[#000000]">Governance &amp; Compliance</h2>
            <p className="text-[#45464d] text-sm leading-relaxed">
              NavaPack Solutions operates in full compliance with Uganda's environmental, manufacturing,
              and statutory regulatory framework, and holds active memberships in the country's leading
              manufacturing and recycling associations.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="bg-[#131b2e] p-3 rounded-xl text-white">
                  <span className="material-symbols-outlined" aria-hidden="true">gavel</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#000000]">Regulatory Registration</h4>
                  <p className="text-[#45464d] text-xs">Certified and registered with 6 national statutory bodies.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#131b2e] p-3 rounded-xl text-white">
                  <span className="material-symbols-outlined" aria-hidden="true">groups</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#000000]">Institutional Membership</h4>
                  <p className="text-[#45464d] text-xs">Active member of UMA and UPMRA.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#c6c6cd] p-6 space-y-8 shadow-sm">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#45464d] mb-4">
                  Certified &amp; Registered With
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  {REGISTRATIONS.map((r) => (
                    <div key={r.abbr} className="p-4 border border-[#c6c6cd] rounded-xl hover:border-[#006c49] transition-colors">
                      <div className="font-extrabold text-lg text-[#000000]">{r.abbr}</div>
                      <div className="text-[10px] text-[#45464d] font-medium mt-1">{r.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#e0e3e5]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#45464d] mb-4">
                  Institutional Memberships
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {MEMBERSHIPS.map((m) => (
                    <div key={m.abbr} className="p-4 border border-[#c6c6cd] rounded-xl hover:border-[#006c49] transition-colors">
                      <div className="font-extrabold text-lg text-[#000000]">{m.abbr}</div>
                      <div className="text-[10px] text-[#45464d] font-medium mt-1">{m.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#000000] text-white rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-extrabold text-3xl sm:text-4xl mb-4">
              Ready to optimize your supply chain footprint?
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed">
              Connect with our operations team to discuss manufacturing capacity, compliance documentation, and partnership requirements.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onRequestQuote}
                className="bg-[#10B981] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                Schedule Consultation
              </button>
              <button
                onClick={onRequestQuote}
                className="border border-white/30 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                Request Capacity Overview
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
