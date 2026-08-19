import React, { useState } from 'react';
import { QuoteFormData } from '../types';
import { appsScriptApi } from '../services/appsScriptApi';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialProduct = '' }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    productInterest: initialProduct || 'Shrink and Stretch Films',
    estimatedVolume: '10 - 50 MT',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await appsScriptApi.submitQuote(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your quote request.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#c6c6cd] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f2f4f6] text-[#45464d] hover:text-[#000000] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#6cf8bb]/30 rounded-full flex items-center justify-center mx-auto text-[#006c49]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-bold text-[#000000]">Quote Request Submitted</h3>
            <p className="text-[#45464d] text-sm max-w-sm mx-auto">
              Thank you for contacting Navapack Solutions. Our technical logistics team will review your specifications and contact you within 24 hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006c49] bg-[#6cf8bb]/20 px-3 py-1 rounded-full">
                Custom Quote
              </span>
              <h3 className="text-2xl font-bold text-[#000000] mt-2">Request Industrial Quote</h3>
              <p className="text-[#45464d] text-xs">
                Provide your supply chain requirements and our technical engineers will generate a tailored proposal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs text-red-800">{error}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">COMPANY *</label>
                  <input
                    type="text"
                    required
                    placeholder="Global Industries Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#191c1e] mb-1">PHONE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">PRODUCT CATEGORY</label>
                <select
                  value={formData.productInterest}
                  onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none cursor-pointer"
                >
                  <option value="Shrink and Stretch Films">Shrink and Stretch Films</option>
                  <option value="Gabbage Bags (Heavy Duty)">Gabbage Bags (Heavy Duty)</option>
                  <option value="RP Sheeting Rolls">RP Sheeting Rolls</option>
                  <option value="Ice Bags">Ice Bags</option>
                  <option value="Caution / Warning Tapes">Caution / Warning Tapes</option>
                  <option value="LD Carrier Bags">LD Carrier Bags</option>
                  <option value="Plain Bags / Kaveera">Plain Bags / Kaveera</option>
                  <option value="Printed Bar Soap Bags">Printed Bar Soap Bags</option>
                  <option value="Printed Bread Bags">Printed Bread Bags</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">ESTIMATED VOLUME</label>
                <select
                  value={formData.estimatedVolume}
                  onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                  className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none cursor-pointer"
                >
                  <option value="Under 10 MT">Under 10 MT</option>
                  <option value="10 - 50 MT">10 - 50 MT</option>
                  <option value="50 - 200 MT">50 - 200 MT</option>
                  <option value="200+ MT">200+ MT / Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">TECHNICAL SPECIFICATIONS / NOTES</label>
                <textarea
                  rows={3}
                  placeholder="Specify micron requirements, color printing, barrier properties..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#f2f4f6] border border-[#c6c6cd] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#006c49] outline-none"
                />
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-[#006c49] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#005236] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{submitting ? 'Sending…' : 'Submit Quote Request'}</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
