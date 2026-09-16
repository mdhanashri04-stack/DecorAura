import React, { useState } from 'react';
import { X, Calendar, ShieldCheck, RefreshCw, MapPin, CheckCircle, Map } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null); // 'appointments' | 'shipping' | 'returns' | 'sitemap'
  const [appointmentSent, setAppointmentSent] = useState(false);

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    setAppointmentSent(true);
    setTimeout(() => {
      setAppointmentSent(false);
      setActiveModal(null);
    }, 2500);
  };

  return (
    <footer className="bg-charcoal-900 text-white pt-20 pb-10 border-t border-charcoal-800 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="mb-4 block hover:opacity-90 transition-opacity text-left"
              title="DecorAura Home"
            >
              <img
                src="/images/decoraura-logo-footer.png"
                alt="DecorAura"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </button>
            <p className="text-xs font-sans text-white/60 leading-relaxed max-w-xs">
              Objects that make spaces feel like home. A fusion of 3D WebGL storytelling and modern luxury interior design.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-500 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-bronze-500 transition-colors text-left">Shop</button></li>
              <li><button onClick={() => onNavigate('collections')} className="hover:text-bronze-500 transition-colors text-left">Collections</button></li>
              <li><button onClick={() => onNavigate('spaces')} className="hover:text-bronze-500 transition-colors text-left">Spaces</button></li>
              <li><button onClick={() => onNavigate('journal')} className="hover:text-bronze-500 transition-colors text-left">Journal</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-bronze-500 transition-colors pt-1 block text-left">Admin Studio</button></li>
            </ul>
          </div>

          {/* Links 2: Support & Care */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-500 mb-4">Support & Care</h4>
            <ul className="space-y-2 text-xs font-sans text-white/70">
              <li>
                <button
                  onClick={() => setActiveModal('appointments')}
                  className="hover:text-bronze-500 transition-colors text-left font-medium"
                >
                  Showroom Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('shipping')}
                  className="hover:text-bronze-500 transition-colors text-left font-medium"
                >
                  Insured Shipping
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('returns')}
                  className="hover:text-bronze-500 transition-colors text-left font-medium"
                >
                  Returns Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('sitemap')}
                  className="hover:text-bronze-500 transition-colors text-left font-medium"
                >
                  XML Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-500 mb-4">JOIN THE DECORAURA JOURNAL</h4>
            <p className="text-xs font-sans text-white/60 mb-4">Receive exclusive previews of 3D releases, editorial guides, and private releases.</p>
            <form onSubmit={e => { e.preventDefault(); alert('Subscribed to DecorAura Journal!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Email address..."
                required
                className="px-3 py-2 bg-charcoal-800 border border-charcoal-700 rounded-full text-xs text-white placeholder-white/40 flex-1 outline-none focus:border-bronze-500"
              />
              <button type="submit" className="px-4 py-2 bg-bronze-500 hover:bg-bronze-600 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-white/40 gap-4">
          <div>&copy; 2026 DecorAura Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Pinterest</a>
            <a href="https://houzz.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Houzz</a>
          </div>
        </div>
      </div>

      {/* --- SUPPORT MODALS --- */}

      {/* 1. Showroom Appointments Modal */}
      {activeModal === 'appointments' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-charcoal-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-ivory-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-ivory-200 text-charcoal-600 transition-colors"
            >
              <X size={18} />
            </button>

            {appointmentSent ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-bronze-500/10 text-bronze-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-serif text-charcoal-900">Appointment Request Sent</h3>
                <p className="text-xs font-sans text-charcoal-600 max-w-xs mx-auto leading-relaxed">
                  Our NYC flagship design advisor will review your preferred date and contact you within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-bronze-500/10 text-bronze-600 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-charcoal-900">Book Showroom Appointment</h3>
                    <p className="text-[11px] font-sans text-bronze-600 uppercase tracking-widest font-semibold flex items-center gap-1">
                      <MapPin size={10} /> 5th Avenue Flagship • NYC
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAppointmentSubmit} className="space-y-4 text-xs font-sans text-left">
                  <div>
                    <label className="font-semibold block text-charcoal-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl outline-none focus:border-bronze-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block text-charcoal-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl outline-none focus:border-bronze-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block text-charcoal-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl outline-none focus:border-bronze-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-charcoal-700 mb-1">Space Curation</label>
                      <select className="w-full px-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl outline-none focus:border-bronze-500 text-xs">
                        <option>Living Room</option>
                        <option>Bedroom</option>
                        <option>Dining</option>
                        <option>Home Office</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full font-semibold uppercase tracking-widest text-xs transition-colors duration-300 shadow-md"
                  >
                    Confirm Appointment Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Insured Shipping Modal */}
      {activeModal === 'shipping' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-charcoal-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-ivory-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-ivory-200 text-charcoal-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-bronze-500/10 text-bronze-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-charcoal-900">Insured White-Glove Shipping</h3>
                <p className="text-[11px] font-sans text-bronze-600 uppercase tracking-widest font-semibold">Global Logistics Guarantee</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-charcoal-600 leading-relaxed text-left">
              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">100% Transit Coverage</h4>
                <p>Every single DecorAura architectural piece—including delicate mouth-blown glass diffusers and solid stone vessels—is fully insured against damage from dispatch to placement.</p>
              </div>

              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">Custom Wooden Crating</h4>
                <p>Fragile items ship in custom-built eco-friendly timber packaging with shock-absorbing foam inserts tailored to each piece's exact CAD geometry.</p>
              </div>

              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">Room-of-Choice Delivery</h4>
                <p>Our specialized courier partners unpack, inspect, and position your lighting or furniture in your desired room, removing all packaging materials.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full font-semibold uppercase tracking-widest text-xs transition-colors duration-300"
            >
              Close Logistics Info
            </button>
          </div>
        </div>
      )}

      {/* 3. Returns Policy Modal */}
      {activeModal === 'returns' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-charcoal-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-ivory-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-ivory-200 text-charcoal-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-bronze-500/10 text-bronze-600 flex items-center justify-center">
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-charcoal-900">30-Day Returns Policy</h3>
                <p className="text-[11px] font-sans text-bronze-600 uppercase tracking-widest font-semibold">Satisfaction Guarantee</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-charcoal-600 leading-relaxed text-left">
              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">30 Days Return Window</h4>
                <p>If an object does not harmoniously integrate into your sanctuary, you may request a return within 30 days of white-glove arrival.</p>
              </div>

              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">Prepaid Return Freight</h4>
                <p>We provide prepaid freight labels and coordinate home pickup for all standard returns. Objects must remain in original pristine condition.</p>
              </div>

              <div className="p-4 bg-ivory-100/80 rounded-2xl border border-ivory-300">
                <h4 className="font-bold text-charcoal-900 mb-1">Full Refund Inspection</h4>
                <p>Refunds are credited back to your original payment method within 3 business days following physical receipt and quality inspection at our studio.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full font-semibold uppercase tracking-widest text-xs transition-colors duration-300"
            >
              Close Policy Info
            </button>
          </div>
        </div>
      )}

      {/* 4. XML Sitemap Modal */}
      {activeModal === 'sitemap' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-charcoal-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-ivory-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-ivory-200 text-charcoal-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-bronze-500/10 text-bronze-600 flex items-center justify-center">
                <Map size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-charcoal-900">DecorAura Directory Sitemap</h3>
                <p className="text-[11px] font-sans text-bronze-600 uppercase tracking-widest font-semibold">Indexed Routes & Sections</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-sans text-left">
              <button
                onClick={() => { setActiveModal(null); onNavigate('home'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Homepage</div>
                <div className="text-[10px] opacity-70">/ (Landing & 3D Hero)</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('shop'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Shop Section</div>
                <div className="text-[10px] opacity-70">/#shop</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('collections'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Collections Section</div>
                <div className="text-[10px] opacity-70">/#collections</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('spaces'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Spaces Curation</div>
                <div className="text-[10px] opacity-70">/#spaces</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('journal'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Journal Section</div>
                <div className="text-[10px] opacity-70">/#journal</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('shop-page'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Full Product Catalogue</div>
                <div className="text-[10px] opacity-70">/shop</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('journal-page'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Full Journal Index</div>
                <div className="text-[10px] opacity-70">/journal</div>
              </button>

              <button
                onClick={() => { setActiveModal(null); onNavigate('admin'); }}
                className="p-3 bg-ivory-100 rounded-xl hover:bg-bronze-500 hover:text-white transition-colors text-left"
              >
                <div className="font-bold">Admin Studio</div>
                <div className="text-[10px] opacity-70">/admin</div>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full font-semibold uppercase tracking-widest text-xs transition-colors duration-300"
            >
              Close Sitemap
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
