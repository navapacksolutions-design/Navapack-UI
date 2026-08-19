import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ScreenId, TransitionType } from '../types';

const heroVideoUrl = new URL('../../assets/Brand_film_factory_manufacturing…_202607291942.mp4', import.meta.url).href;

interface HomePageProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: (productName?: string) => void;
}

const AnimatedStat: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const duration = 1600;
    const startTime = performance.now();
    let frameId = 0;

    const update = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, prefersReducedMotion, value]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onRequestQuote }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroVideoY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="w-full">
      {/* Hero Section with Ken Burns backdrop */}
      <section ref={heroRef} className="relative min-h-[850px] flex items-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.video
            className="absolute inset-0 w-full h-[160%] object-cover"
            style={{ y: heroVideoY }}
            src={heroVideoUrl}
            aria-label="Brand film of NavaPack's factory and manufacturing floor in operation"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/60 to-black/15 backdrop-brightness-75" />
          <div className="absolute inset-0 atmospheric-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e]/90 via-[#131b2e]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <div className="max-w-2xl text-white">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <span className="font-brand-body text-[0.78rem] sm:text-[0.85rem] font-semibold leading-relaxed tracking-[0.14em] uppercase">
                <span className="block text-white/90">Custom Flexible Packaging &</span>
                <span className="block text-[#6ffbbe]">Recycling Solutions</span>
              </span>
            </motion.div>

            <h1 className="hero-headline text-white mb-6">
              Custom Flexible Packaging Solutions for Every Industry
            </h1>

            <p className="hero-body-copy text-white/[0.85] mb-8">
              NavaPack Solutions manufactures customized HDPE, LDPE, PP, and unlaminated BOPP bags, liners, overwraps, and flexible packaging products for industrial, retail, agricultural, food, healthcare, FMCG, hospitality, and waste-management applications. We combine technical packaging expertise with responsible plastic recycling to deliver reliable, cost-effective, and customer-focused solutions.
            </p>

            <div className="flex flex-wrap gap-4 items-center mb-6">
              <button
                onClick={() => onRequestQuote()}
                className="font-brand-body bg-white/[0.10] text-[#8affca] px-8 py-3.5 rounded-full border border-[#6ffbbe]/55 backdrop-blur-md font-semibold text-sm tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(111,251,190,0.14)] hover:-translate-y-0.5 hover:bg-[#6ffbbe]/18 hover:border-[#6ffbbe]/80 hover:text-[#b0ffdc] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_12px_30px_rgba(111,251,190,0.28)] transition-all duration-300 cursor-pointer"
              >
                Get a Custom Quote
              </button>

              <button
                onClick={() => onNavigate('products', 'push')}
                className="font-brand-body bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full font-semibold text-sm tracking-[0.01em] transition-all backdrop-blur-md cursor-pointer"
              >
                Explore Our Products
              </button>
            </div>

            <div className="text-white/70 text-xs">
              <span className="font-semibold text-white/90 uppercase tracking-wider">Materials We Work With</span>
              <div className="mt-1">HDPE | LDPE | PP | Unlaminated BOPP</div>
              <div className="mt-1">Non-laminated flexible packaging solutions tailored to your requirements.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat Counter Grid */}
      <section className="py-12 bg-white border-y border-[#e0e3e5]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-[#e0e3e5] last:border-r-0">
              <div className="font-medium tabular-nums text-[#006c49] text-3xl sm:text-4xl mb-1"><AnimatedStat value={100} suffix="MT" /></div>
              <div className="font-semibold text-xs text-[#45464d] uppercase tracking-wider">Recycling / Month</div>
            </div>
            <div className="p-4 border-r border-[#e0e3e5] last:border-r-0">
              <div className="font-medium tabular-nums text-[#006c49] text-3xl sm:text-4xl mb-1"><AnimatedStat value={150} suffix="MT" /></div>
              <div className="font-semibold text-xs text-[#45464d] uppercase tracking-wider">Extrusion Capacity</div>
            </div>
            <div className="p-4 border-r border-[#e0e3e5] last:border-r-0">
              <div className="font-medium tabular-nums text-[#006c49] text-3xl sm:text-4xl mb-1"><AnimatedStat value={200} suffix="MT" /></div>
              <div className="font-semibold text-xs text-[#45464d] uppercase tracking-wider">Short-Term Target</div>
            </div>
            <div className="p-4">
              <div className="font-medium tabular-nums text-[#006c49] text-3xl sm:text-4xl mb-1"><AnimatedStat value={100} suffix="%" /></div>
              <div className="font-semibold text-xs text-[#45464d] uppercase tracking-wider">Capacity Increase by Dec 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Competencies */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#006c49] uppercase tracking-widest">Capabilities</span>
            <h2 className="font-extrabold text-3xl sm:text-4xl text-[#000000] mt-1 mb-3">Our Core Competencies</h2>
            <p className="text-[#45464d] text-base">
              Bridging the gap between industrial efficiency and environmental stewardship through state-of-the-art technological ecosystems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative h-[460px] rounded-2xl overflow-hidden border border-[#c6c6cd] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6">
            <div
              role="img"
              aria-label="Industrial plastic recycling machinery processing waste into pellets"
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://www.invoitplast.com/wp-content/uploads/2026/01/hdpe-pulverizer-machine-for-plastic-recycling-expert-guide-.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#002113] mb-4">
                <span className="material-symbols-outlined" aria-hidden="true">recycling</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Recycling & Industrial Pulverization</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Advanced circular systems that reclaim and transform waste into high-grade industrial feedstock.
              </p>
              <button
                onClick={() => onNavigate('sustainability', 'push')}
                className="flex items-center gap-2 text-[#6ffbbe] font-bold text-sm hover:text-white transition-colors cursor-pointer group/btn"
              >
                <span>Learn More</span>
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1.5 transition-transform" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="group relative h-[460px] rounded-2xl overflow-hidden border border-[#c6c6cd] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6">
            <div
              role="img"
              aria-label="Rolls of flexible plastic packaging film ready for conversion"
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://i.pinimg.com/736x/23/9d/19/239d19bc312d3a45d1277c491503ecd4.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#002113] mb-4">
                <span className="material-symbols-outlined" aria-hidden="true">package_2</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Flexible Packaging</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Multilayer extrusion solutions engineered for durability, shelf-life, and material efficiency.
              </p>
              <button
                onClick={() => onNavigate('products', 'push')}
                className="flex items-center gap-2 text-[#6ffbbe] font-bold text-sm hover:text-white transition-colors cursor-pointer group/btn"
              >
                <span>Learn More</span>
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1.5 transition-transform" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          <div className="group relative h-[460px] rounded-2xl overflow-hidden border border-[#c6c6cd] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6">
            <div
              role="img"
              aria-label="Polymer pulverizing and precision slitting equipment on the factory floor"
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://img.freepik.com/premium-photo/production-line-worker-standing-by-machine-controlling-plastic-bag-manufacture_308072-6201.jpg')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#002113] mb-4">
                <span className="material-symbols-outlined" aria-hidden="true">precision_manufacturing</span>
              </div>
              <h3 className="font-bold text-2xl text-white mb-2">Industrial Services</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                End-to-end logistics and technical support optimized for the complex African industrial landscape.
              </p>
              <button
                onClick={() => onNavigate('about', 'push')}
                className="flex items-center gap-2 text-[#6ffbbe] font-bold text-sm hover:text-white transition-colors cursor-pointer group/btn"
              >
                <span>Learn More</span>
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1.5 transition-transform" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section className="py-24 bg-[#131b2e] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#6ffbbe] uppercase tracking-widest">Future Scale</span>
            <h2 className="font-extrabold text-3xl sm:text-4xl mt-1 mb-3">The One to Two Year Strategic Roadmap</h2>
            <p className="text-[#7c839b] max-w-2xl mx-auto text-base">
              Phased capital investment expanding NavaPack into rigid plastics, label printing, and multilayer film extrusion, targeting 100% production capacity growth by August 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            

            <div className="bg-[#111c2d] border border-white/10 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="w-12 h-12 bg-[#006c49] text-white rounded-full flex items-center justify-center mb-6 font-bold text-lg shadow-lg">
                01
              </div>
              <h4 className="font-bold text-xl mb-2">Label Printing</h4>
              <p className="text-[#7c839b] text-sm mb-6 leading-relaxed">
                New label printing division supporting rigid container branding for FMCG, industrial, and food processing clients.
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb]/20 text-[#6ffbbe] text-xs font-semibold">
                Planned Years 1 and 2
              </span>
            </div>

            <div className="bg-[#111c2d] border border-white/10 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="w-12 h-12 bg-[#006c49] text-white rounded-full flex items-center justify-center mb-6 font-bold text-lg shadow-lg">
                02
              </div>
              <h4 className="font-bold text-xl mb-2">Multilayer Extrusion</h4>
              <p className="text-[#7c839b] text-sm mb-6 leading-relaxed">
                Multilayer blown film extruder for improved barrier properties and premium-grade FMCG and food packaging.
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb]/20 text-[#6ffbbe] text-xs font-semibold">
                Planned Year 2
              </span>
            </div>
            <div className="bg-[#111c2d] border border-white/10 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 relative">
              <div className="w-12 h-12 bg-[#006c49] text-white rounded-full flex items-center justify-center mb-6 font-bold text-lg shadow-lg">
                03
              </div>
              <h4 className="font-bold text-xl mb-2">Rigid Plastics</h4>
              <p className="text-[#7c839b] text-sm mb-6 leading-relaxed">
                Blow moulding installation for rigid containers, including jerry cans, serving edible oils, industrial chemicals, and agricultural inputs.
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#6cf8bb]/20 text-[#6ffbbe] text-xs font-semibold">
                Planned Year 1
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-10">
        <div className="bg-[#131b2e] rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
          <div className="max-w-xl relative z-10 text-white">
            <h2 className="font-extrabold text-3xl sm:text-4xl mb-4 leading-snug">
              Ready to scale your industrial footprint?
            </h2>
            <p className="text-white/80 text-base mb-8">
              Partner with NavaPack Solutions for integrated recycling, packaging, and industrial processing across East Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onRequestQuote()}
                className="bg-[#6ffbbe] text-[#005236] px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all shadow-lg cursor-pointer"
              >
                <span>Request Quote</span>
                <span className="material-symbols-outlined text-sm" aria-hidden="true">send</span>
              </button>

              <button
                onClick={() => onNavigate('products', 'push')}
                className="border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
              >
                View Product Catalog
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative z-10">
            <div className="w-64 h-64 bg-[#6ffbbe]/20 backdrop-blur-md rounded-full flex items-center justify-center p-8 border border-[#6ffbbe]/30 shadow-2xl">
              <span className="material-symbols-outlined text-8xl text-[#6ffbbe]" aria-hidden="true">eco</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
