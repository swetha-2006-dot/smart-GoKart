import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  Scan, 
  Scale, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Radio, 
  Users, 
  TrendingUp, 
  ChevronRight, 
  Smartphone, 
  Clock, 
  MessageSquare, 
  Send,
  Lock,
  Layers,
  Heart
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function LandingPage({
  onOpenAuth,
  onDirectEnterCustomer,
  onDirectEnterAdmin
}) {
  // Testimonials Initial Dataset
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Sneha Kapur",
      role: "Daily Shopper, Indiranagar",
      avatar: "👩‍💼",
      rating: 5,
      quote: "Shopping is completely hassle-free now—no long lines! I just scanned my groceries, the cart verified the weight, and I paid via UPI in 5 seconds flat.",
      badge: "Verified Buyer"
    },
    {
      id: 2,
      name: "Rajesh Varma",
      role: "Operations VP, Spencer Superstores",
      avatar: "👨‍💼",
      rating: 5,
      quote: "The anti-theft accuracy for store admins is unmatched. The 4-point load cell sensors immediately catch any unscanned payload. Shrinkage dropped by 92%.",
      badge: "Enterprise Retailer"
    },
    {
      id: 3,
      name: "Ananya Deshmukh",
      role: "Tech Enthusiast & Parent",
      avatar: "👩‍🔬",
      rating: 5,
      quote: "My kids love seeing the green AI bounding box verify our groceries! It feels like shopping in 2035. Gokart AI has set a new benchmark.",
      badge: "Weekend Shopper"
    }
  ]);

  // Interactive Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackComment.trim() || !feedbackName.trim()) return;

    soundFX.playVerified();
    const newReview = {
      id: Date.now(),
      name: feedbackName,
      role: "Shopper Review",
      avatar: "🌟",
      rating: feedbackRating,
      quote: feedbackComment,
      badge: "Community Review"
    };

    setTestimonials([newReview, ...testimonials]);
    setFeedbackName('');
    setFeedbackComment('');
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-800 font-['Plus_Jakarta_Sans'] selection:bg-[#E0F7FA] selection:text-[#00838F]">
      
      {/* 1. TOP PASTEL NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Gradient Badge */}
            <div className="flex items-center space-x-3.5">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00838F] via-[#2E7D32] to-[#7B1FA2] p-0.5 shadow-md shadow-emerald-900/10">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-[#00838F]" />
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                    Gokart <span className="bg-gradient-to-r from-[#00838F] to-[#2E7D32] bg-clip-text text-transparent">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-[#E0F7FA] to-[#E8F5E9] text-[#00838F] rounded-full border border-[#B2EBF2]">
                    <Sparkles className="w-3 h-3 mr-1 text-[#00838F]" />
                    AI-Powered Smart Retail
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">
                  Next-Gen Autonomous Trolley Checkout Mesh
                </p>
              </div>
            </div>

            {/* Navigation Anchor Links */}
            <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600">
              <a href="#features" className="hover:text-[#00838F] transition">Features</a>
              <a href="#how-it-works" className="hover:text-[#00838F] transition">How It Works</a>
              <a href="#testimonials" className="hover:text-[#00838F] transition">Testimonials</a>
              <a href="#pricing-roi" className="hover:text-[#00838F] transition">Pricing & ROI</a>
            </nav>

            {/* Primary Action CTA Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenAuth('customer');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#00838F] font-bold text-xs transition border border-[#B2EBF2] shadow-xs flex items-center space-x-1.5"
              >
                <span>Customer Portal</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenAuth('admin');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        
        {/* Soft pastel ambient gradient orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#E0F7FA]/70 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#E8F5E9]/70 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-[#F3E5F5]/60 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white shadow-soft border border-slate-200/80 mb-6 text-xs font-semibold text-slate-700 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[#00838F] font-bold">Autonomous Smart Cart Checkout</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Live IoT Socket.io Bridge</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 font-['Outfit'] max-w-4xl mx-auto leading-tight sm:leading-none">
            The Future of <span className="bg-gradient-to-r from-[#00838F] via-[#2E7D32] to-[#7B1FA2] bg-clip-text text-transparent">Frictionless Smart Shopping</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate checkout queues with real-time barcode scanning, load-cell anti-theft verification, and AI computer vision integration.
          </p>

          {/* CTA Buttons Row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenAuth('customer');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00838F] to-[#2E7D32] hover:brightness-105 text-white font-extrabold text-sm tracking-wide shadow-pastel-cyan transition flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>Start Shopping (Customer View)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenAuth('admin');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm tracking-wide border border-slate-200 shadow-soft transition flex items-center justify-center space-x-2 active:scale-98"
            >
              <Cpu className="w-4 h-4 text-[#7B1FA2]" />
              <span>Explore Fleet Admin Console</span>
            </button>
          </div>

          {/* HIGH-IMPACT VISUAL CARDS HIGHLIGHTING (Requirement 1 Hero Cards) */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Card 1: Instant Mobile Scanning */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mb-2">
                1. Instant Mobile & Vision Scanning
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Point any smartphone or onboard camera at product barcodes. AI computer vision models confirm hand deposit trajectories with 99.4% precision.
              </p>
              <div className="flex items-center text-[11px] font-bold text-[#00838F]">
                <span>&lt;200ms optical latency</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Card 2: Load-Cell Weight Fraud Prevention */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mb-2">
                2. Load-Cell Anti-Theft Verification
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Four-corner HX711 strain gauges continuously cross-verify measured mass against the scanned manifest within a tight ±15g tolerance boundary.
              </p>
              <div className="flex items-center text-[11px] font-bold text-[#2E7D32]">
                <span>Automatic wheel lock brakes</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Card 3: Seamless UPI & QR Checkout */}
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] mb-2">
                3. Seamless UPI & QR Checkout
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Skip checkout cashiers completely. Scan the dynamic UPI QR code on the trolley, pay via PhonePe/GPay/BHIM, and roll straight out the gate.
              </p>
              <div className="flex items-center text-[11px] font-bold text-[#7B1FA2]">
                <span>Instant gate exit QR pass</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (Requirement 1 Step-by-Step Workflow) */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00838F] bg-[#E0F7FA] px-3 py-1 rounded-full border border-[#B2EBF2]">
              Workflow Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-3">
              How Gokart AI Works in 4 Simple Steps
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From shelf to parking lot in minutes with automated optical and gravitational security verification.
            </p>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1: Scan Item */}
            <div className="p-6 rounded-3xl bg-[#E0F7FA]/40 border border-[#B2EBF2] relative flex flex-col justify-between">
              <span className="text-4xl font-black text-[#00838F]/30 font-mono absolute top-4 right-4">01</span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E0F7FA] text-[#00838F] flex items-center justify-center text-xl mb-4 shadow-xs">
                  📷
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Outfit'] mb-2">
                  1. Scan Item
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hold any grocery product before the trolley camera or mobile phone scanner. Optical barcode is identified instantly.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-[#00838F]">Step 1 • Optical Trigger</span>
            </div>

            {/* Step 2: Weight Verified */}
            <div className="p-6 rounded-3xl bg-[#E8F5E9]/40 border border-[#C8E6C9] relative flex flex-col justify-between">
              <span className="text-4xl font-black text-[#2E7D32]/30 font-mono absolute top-4 right-4">02</span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xl mb-4 shadow-xs">
                  ⚖️
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Outfit'] mb-2">
                  2. Weight Verified
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drop item into basket. 4-corner load-cells verify mass matches catalog spec. Visual balance needle confirms green status.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-[#2E7D32]">Step 2 • Gravitational Tare</span>
            </div>

            {/* Step 3: Instant UPI Payment */}
            <div className="p-6 rounded-3xl bg-[#F3E5F5]/40 border border-[#E1BEE7] relative flex flex-col justify-between">
              <span className="text-4xl font-black text-[#7B1FA2]/30 font-mono absolute top-4 right-4">03</span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center text-xl mb-4 shadow-xs">
                  📱
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Outfit'] mb-2">
                  3. Instant UPI Payment
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click checkout to reveal dynamic UPI QR code. Pay securely in seconds via any Indian UPI app or contactless card.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-[#7B1FA2]">Step 3 • NPCI Payment</span>
            </div>

            {/* Step 4: Walk Out */}
            <div className="p-6 rounded-3xl bg-[#FFF3E0]/40 border border-[#FFE0B2] relative flex flex-col justify-between">
              <span className="text-4xl font-black text-amber-500/30 font-mono absolute top-4 right-4">04</span>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3E0] text-amber-700 flex items-center justify-center text-xl mb-4 shadow-xs">
                  🚪
                </div>
                <h4 className="text-base font-bold text-slate-900 font-['Outfit'] mb-2">
                  4. Walk Out
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trolley exit barcode is armed. Optical RFID gate recognizes verified invoice and opens automatically. Zero queues.
                </p>
              </div>
              <span className="mt-4 text-[11px] font-bold text-amber-700">Step 4 • Frictionless Exit</span>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CUSTOMER RATINGS, REVIEWS & FEEDBACK SECTION (Requirement 1) */}
      <section id="testimonials" className="py-20 bg-[#F8FAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header & Key Stats */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B1FA2] bg-[#F3E5F5] px-3 py-1 rounded-full border border-[#E1BEE7]">
              Customer & Admin Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-3">
              Trusted by Shoppers & Store Operators
            </h2>

            {/* 3 STATS CARDS (Requirement 1) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="text-2xl sm:text-4xl font-black text-amber-500 font-mono">4.9/5</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Average Customer Rating</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="text-2xl sm:text-4xl font-black text-emerald-600 font-mono">99.8%</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Fraud Detection Accuracy</div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft">
                <div className="text-2xl sm:text-4xl font-black text-[#00838F] font-mono">10x</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Faster Checkout Speed</div>
              </div>
            </div>
          </div>

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t) => (
              <div 
                key={t.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-xs">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{t.name}</h4>
                      <p className="text-[10px] text-slate-400">{t.role}</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE SUBMIT FEEDBACK FORM (Requirement 1) */}
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-[#E0F7FA] text-[#00838F]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-['Outfit']">
                  Submit Your Shopping Experience
                </h3>
                <p className="text-xs text-slate-500">
                  Share your thoughts on the autonomous trolley and weight verification system.
                </p>
              </div>
            </div>

            {feedbackSubmitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your review has been submitted and added above.</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                  <div className="flex items-center space-x-1.5 h-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= feedbackRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{feedbackRating}/5 Stars</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Comments & Suggestions</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you liked about the AI scanner, load cell balance, or UPI checkout..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00838F]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 5. PRICING & ROI SECTION */}
      <section id="pricing-roi" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
              Enterprise ROI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-3">
              Why Retailers Switch to Gokart AI
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Massive reduction in cashier overhead, floor congestion, and inventory shrinkage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Traditional Supermarket Checkout */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400">Old Model</span>
                <h3 className="text-lg font-bold text-slate-800 font-['Outfit'] mt-1 mb-4">
                  Traditional Cashier Conveyors
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center space-x-2 text-rose-700">
                    <span>❌</span>
                    <span>15–30 minute checkout queue wait times</span>
                  </li>
                  <li className="flex items-center space-x-2 text-rose-700">
                    <span>❌</span>
                    <span>High cashier staffing payroll overhead</span>
                  </li>
                  <li className="flex items-center space-x-2 text-rose-700">
                    <span>❌</span>
                    <span>3–5% revenue loss due to unregistered shrinkage</span>
                  </li>
                  <li className="flex items-center space-x-2 text-rose-700">
                    <span>❌</span>
                    <span>Floor bottlenecks during peak weekend hours</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200 text-slate-500 text-xs">
                Slow & Labor Intensive
              </div>
            </div>

            {/* Gokart AI Autonomous Solution */}
            <div className="p-7 rounded-3xl bg-gradient-to-tr from-[#E0F7FA]/70 via-[#E8F5E9]/70 to-[#F3E5F5]/70 border-2 border-emerald-400/80 shadow-soft-lg flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-gradient-to-r from-[#00838F] to-[#2E7D32] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs">
                Recommended Architecture
              </span>
              <div>
                <span className="text-xs font-bold uppercase text-[#00838F]">Smart Cart Mesh</span>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mt-1 mb-4">
                  Gokart AI Autonomous Fleet
                </h3>
                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <span>✓</span>
                    <span>Zero queue waiting: instant scan-as-you-shop</span>
                  </li>
                  <li className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <span>✓</span>
                    <span>Real-time load-cell fraud verification (±15g accuracy)</span>
                  </li>
                  <li className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <span>✓</span>
                    <span>Instant NPCI UPI QR code settlements</span>
                  </li>
                  <li className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <span>✓</span>
                    <span>Live fleet telemetry & remote wheel locking</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-300/60 flex items-center justify-between text-xs font-bold text-[#00838F]">
                <span>Payback period: &lt;4.5 months</span>
                <span className="text-emerald-700">92% Shrinkage Reduction</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. MODERN FOOTER SECTION (Requirement 1) */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            {/* Col 1: Brand & Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00838F] to-[#2E7D32] flex items-center justify-center text-white font-bold">
                  🛒
                </div>
                <span className="text-lg font-black text-white font-['Outfit']">Gokart AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous Smart Shopping Trolleys with Real-Time Computer Vision & Load-Cell Anti-Theft Verification.
              </p>

              {/* System Operational Status Badge (Prompt Requirement 1) */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Systems Operational (99.98% Uptime)</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><a href="#features" className="hover:text-white transition">Features & Vision YOLOv9</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works Workflow</a></li>
                <li><a href="#testimonials" className="hover:text-white transition">Customer Reviews & Ratings</a></li>
                <li><a href="#pricing-roi" className="hover:text-white transition">Supermarket ROI Analysis</a></li>
              </ul>
            </div>

            {/* Col 3: Portal Launchers */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Demo Launchers</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li>
                  <button onClick={() => onOpenAuth('customer')} className="hover:text-emerald-400 transition text-left">
                    ➜ Customer Trolley #04 Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenAuth('admin')} className="hover:text-purple-400 transition text-left">
                    ➜ Fleet Admin Analytics Dashboard
                  </button>
                </li>
                <li>
                  <a href="/mobile-scan" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">
                    ➜ Mobile Phone Scanner Bridge (:5000)
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Hardware Specs */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Hardware Spec</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ESP32 dual-core IoT microcontroller, HX711 24-bit strain gauge ADC, WebRTC optical stream, and NPCI UPI 2.0 Gateway.
              </p>
              <div className="mt-3 text-[10px] text-slate-500 font-mono">
                Socket.io Mesh v4.8 • Vite React 19
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Attribution */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
            <div>
              © 2026 Gokart AI Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-400 cursor-pointer">Hardware Diagnostics</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
