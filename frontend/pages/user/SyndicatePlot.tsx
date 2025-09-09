import { CheckCircle, CreditCard, Download, Eye, FileText, MapPin, Plus, Shield, Users, XCircle } from "lucide-react";
import { FC, useState } from "react";

const TOTAL_PARTS = 6;

// Types
type Refer = {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  part: number;
};

type ReferForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

// Simulate admin-provided description
const ADMIN_DESCRIPTION =
  "This is a premium investment opportunity in a high-growth area. The syndicate model allows you to co-own a plot with others, sharing both the cost and the returns. All legal documents and land verification are provided. Please review the details and select your shares.";

const SyndicatePlot: FC = () => {
  // State management
  const [refers, setRefers] = useState<Refer[]>([]);
  const [referForm, setReferForm] = useState<ReferForm>({ name: '', email: '', phone: '', location: '' });
  // const [bookedParts, setBookedParts] = useState<number[]>([]); // Unused
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [showNoReference, setShowNoReference] = useState<boolean>(false);
  // Dummy location for map
  const plotLocation = "Chennai, India";
  // const mapCenter = { lat: 13.0827, lng: 80.2707 };
  // const mapZoom = 12;

  // MapMarker component
  // const MapMarker: FC<{ text: string }> = ({ text }) => (
  //   <div style={{ color: 'red', fontWeight: 'bold', fontSize: 24 }} title={text}>📍</div>
  // );

  // Add refer logic
  const handleAddRefer = () => {
    if (refers.length >= TOTAL_PARTS - selectedParts.length) return;
    if (!referForm.name || !referForm.email || !referForm.phone || !referForm.location) return;
    const nextPart = [1,2,3,4,5,6].find(p => !selectedParts.includes(p) && !refers.some(r => r.part === p));
    if (!nextPart) return;
    setRefers([...refers, { ...referForm, status: 'Pending', part: nextPart }]);
    setReferForm({ name: '', email: '', phone: '', location: '' });
  };

  // Remove refer
  const handleRemoveRefer = (idx: number) => {
    setRefers(refers.filter((_, i) => i !== idx));
  };

  // Continue Payment
  const handleContinuePayment = () => {
    if ((selectedParts.length + refers.length) < 6) {
      alert('All 6 parts must be booked to proceed.');
      return;
    }
    alert('Proceeding to payment...');
  };

  const slotsFilled = selectedParts.length + refers.length;
  const canAddRefer = refers.length < (TOTAL_PARTS - selectedParts.length) && !showNoReference;
  const userShare = Math.round(1000000 / 6 * selectedParts.length);

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 text-sm">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-200/30 to-green-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/20 to-green-200/20 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-l from-teal-200/20 to-emerald-200/20 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.7s'}}></div>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/60 rounded-full animate-ping"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${10 + Math.sin(i) * 60}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        {/* Moving gradient waves */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"></div>
            <div className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-60 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center py-4 px-2">
        <div className="w-full max-w-4xl">
          
          {/* Hero Header */}
          <div className="text-center mb-6 animate-fade-in">
            
            <div className="mt-2 flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                <span className="text-green-700 font-semibold text-xs">🏡 Premium Location • 📈 High ROI • 🤝 Shared Investment</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            
            {/* Left Column */}
            <div className="space-y-3">
              
              {/* Plot Details Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] group">
                <div className="text-center mb-3">
                  <div className="w-full h-32 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-xl border border-green-300 flex flex-col items-center justify-center text-green-600 font-bold text-base mb-3 relative overflow-hidden group-hover:border-green-400 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {/* Plot Image */}
                    <img
                      src="/images/PlotLayoutGrid/plot1.jpg"
                      alt="Plot"
                      className="w-20 h-20 object-cover rounded-lg border border-green-200 shadow mb-1 mx-auto"
                      style={{ zIndex: 2 }}
                    />
                    <div className="flex flex-col items-center gap-1 relative z-10">
                      <MapPin className="w-8 h-8" />
                      <span>Premium Plot</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-green-700 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Plot Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <span className="font-semibold text-gray-700 text-xs">📍 Location:</span>
                      <span className="text-green-700 font-bold text-xs">{plotLocation}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <span className="font-semibold text-gray-700 text-xs">💰 Total Value:</span>
                      <span className="text-emerald-700 font-bold text-base">₹10,00,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                      <span className="font-semibold text-gray-700 text-xs">👥 Total Parts:</span>
                      <span className="text-teal-700 font-bold text-xs">{TOTAL_PARTS} Shares</span>
                    </div>
                  </div>
                  
                  {/* Interactive Map View */}
                  <div className="w-full h-32 rounded-lg border border-blue-300 overflow-hidden relative group cursor-pointer hover:border-blue-400 transition-colors">
                    <iframe
                      title="Plot Location Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0, width: '100%', height: '100%' }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(plotLocation)}&output=embed`}
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <MapPin className="w-6 h-6 mx-auto mb-1 animate-bounce text-blue-600" />
                      <p className="font-bold text-xs text-blue-700">Interactive Map View</p>
                      <p className="text-xs opacity-75 text-blue-700">Click to explore location</p>
                    </div>
                  </div>
                  
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plotLocation)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-bold shadow hover:shadow-xl transform hover:scale-105 text-xs"
                  >
                    🗺️ View on Google Maps
                  </a>
                </div>
              </div>

              {/* Legal Documents & Verification (swapped order, smaller size) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Legal Documents (left) */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="font-bold text-xs text-green-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Legal Documents
                  </h3>
                  <p className="text-gray-600 text-[10px] mb-1">Registry, NOC, and compliance documents</p>
                  <div className="space-y-1">
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded font-semibold hover:shadow-md transition-all hover:scale-105 flex items-center justify-center gap-1 text-xs">
                      <Eye className="w-3 h-3" />
                      View Registry
                    </button>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded font-semibold hover:shadow-md transition-all hover:scale-105 flex items-center justify-center gap-1 text-xs">
                      <Download className="w-3 h-3" />
                      Download NOC
                    </button>
                  </div>
                </div>
                {/* Land Verification (right) */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="font-bold text-xs text-green-700 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Land Verification
                  </h3>
                  <p className="text-gray-600 text-[10px] mb-1">
                    Professional verification service for complete peace of mind before investment.
                  </p>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-1 rounded shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-1 text-xs">
                    <Shield className="w-3 h-3" />
                    Verify for ₹5,000
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              
              {/* Description Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-2 font-bold text-center mb-3 text-xs">
                  📋 Investment Plan Description
                </div>
                <textarea
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-green-500 focus:outline-none transition-colors resize-none bg-gray-100 cursor-not-allowed"
                  value={ADMIN_DESCRIPTION}
                  readOnly
                  rows={3}
                  aria-label="Admin Description"
                />
              </div>

              {/* Plot Split Section */}
              <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                
                <div className="text-center mb-3 relative z-10">
                  <h3 className="text-lg font-bold mb-1 flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    Plot Ownership Split
                  </h3>
                  <p className="text-green-100 text-xs">Select your ownership shares</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2 relative z-10">
                  {[...Array(TOTAL_PARTS)].map((_, i) => {
                    const partNum = i + 1;
                    const isUser = selectedParts.includes(partNum);
                    const isReferred = refers.some(r => r.part === partNum);
                    
                    return (
                      <button
                        key={i}
                        className={`rounded-lg p-2 font-bold border transition-all duration-300 flex flex-col items-center justify-center min-h-[60px] relative overflow-hidden group
                          ${isUser ? 'bg-blue-500 text-white border-blue-300 shadow-lg scale-105 ring-2 ring-blue-300' : 
                            isReferred ? 'bg-green-400 text-green-900 border-green-300 cursor-not-allowed' : 
                            'bg-white/90 text-green-700 border-green-300 hover:bg-white hover:shadow-xl hover:scale-105'}
                        `}
                        onClick={() => {
                          if (isReferred) return;
                          setSelectedParts(prev => 
                            prev.includes(partNum) ? 
                            prev.filter(p => p !== partNum) : 
                            [...prev, partNum]
                          );
                        }}
                        disabled={isReferred}
                      >
                        {(isUser || isReferred) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        )}
                        <div className="text-base font-bold mb-1">Part {partNum}</div>
                        <div className="text-xs opacity-90 mb-1">₹{Math.round(1000000/6).toLocaleString()}</div>
                        {isUser && (
                          <div className="text-xs flex items-center gap-1 font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            Your Share
                          </div>
                        )}
                        {isReferred && (
                          <div className="text-xs flex items-center gap-1 font-semibold">
                            <Users className="w-3 h-3" />
                            Reserved
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center relative z-10">
                  <div className="text-base font-bold mb-1">{slotsFilled} of {TOTAL_PARTS} shares reserved</div>
                  <div className="w-full bg-white/30 rounded-full h-2 mb-1 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-white to-green-200 h-2 rounded-full transition-all duration-700 shadow-inner" 
                      style={{ width: `${(slotsFilled / TOTAL_PARTS) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-green-100 text-xs">
                    {selectedParts.length > 0 && `Your investment: ₹${userShare.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 text-center">
              <h3 className="text-lg font-bold flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Reference & Networking Section
              </h3>
              <p className="text-green-100 mt-1 text-xs">Invite friends and family to join your investment group</p>
            </div>
            
            <div className="p-3 space-y-3">
              {canAddRefer && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <input 
                    className="border border-gray-200 rounded px-2 py-1 focus:border-green-500 focus:outline-none transition-colors text-xs" 
                    placeholder="Full Name" 
                    value={referForm.name} 
                    onChange={e => setReferForm(f => ({ ...f, name: e.target.value }))} 
                  />
                  <input 
                    className="border border-gray-200 rounded px-2 py-1 focus:border-green-500 focus:outline-none transition-colors text-xs" 
                    placeholder="Email Address" 
                    type="email"
                    value={referForm.email} 
                    onChange={e => setReferForm(f => ({ ...f, email: e.target.value }))} 
                  />
                  <input 
                    className="border border-gray-200 rounded px-2 py-1 focus:border-green-500 focus:outline-none transition-colors text-xs" 
                    placeholder="Phone Number" 
                    value={referForm.phone} 
                    onChange={e => setReferForm(f => ({ ...f, phone: e.target.value }))} 
                  />
                  <input 
                    className="border border-gray-200 rounded px-2 py-1 focus:border-green-500 focus:outline-none transition-colors text-xs" 
                    placeholder="Location" 
                    value={referForm.location} 
                    onChange={e => setReferForm(f => ({ ...f, location: e.target.value }))} 
                  />
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                {canAddRefer && (
                  <button 
                    onClick={handleAddRefer}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded px-2 py-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={refers.length >= (TOTAL_PARTS-selectedParts.length) || !referForm.name || !referForm.email || !referForm.phone || !referForm.location}
                  >
                    <Plus className="w-4 h-4" />
                    Add Reference ({TOTAL_PARTS-selectedParts.length-refers.length} slots left)
                  </button>
                )}
                
                <button 
                  className="flex-1 bg-white text-green-700 font-bold rounded border border-green-400 py-2 hover:bg-green-50 transition-all hover:scale-105 text-xs disabled:opacity-50" 
                  onClick={() => setShowNoReference(true)} 
                  disabled={showNoReference}
                >
                  Continue Without References
                </button>
              </div>
              
              <p className="text-center text-gray-500 text-xs">
                💡 Tip: Adding references helps complete the syndicate faster and may offer better terms
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/20 mb-4">
            <h3 className="font-bold text-lg text-green-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Investment Summary
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div>
                <h4 className="font-semibold mb-2 text-xs text-gray-700">Your Selections ({selectedParts.length} shares)</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedParts.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Select shares from the plot split section above</p>
                    </div>
                  ) : (
                    selectedParts.map((part) => (
                      <div key={part} className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded p-2 border border-blue-200 text-xs">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-bold text-blue-800">Your Share</span>
                          <span className="text-xs text-blue-600 ml-1">(Part {part})</span>
                        </div>
                        <span className="font-bold text-blue-800">₹{Math.round(1000000/6).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-xs text-gray-700">References ({refers.length} people)</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {refers.length === 0 && !showNoReference ? (
                    <div className="text-gray-400 text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Add references to help complete the syndicate</p>
                    </div>
                  ) : (
                    <>
                      {refers.map((ref, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 border border-green-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-green-600" />
                              <span className="font-semibold text-green-800">{ref.name}</span>
                              <span className="text-[10px] text-green-600 bg-green-200 px-1 py-0.5 rounded-full">(Part {ref.part})</span>
                            </div>
                            <button 
                              className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1" 
                              onClick={() => handleRemoveRefer(idx)}
                            >
                              <XCircle className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                          <div className="text-[10px] text-gray-600 space-y-0.5">
                            <div>📧 {ref.email}</div>
                            <div>📱 {ref.phone} • 📍 {ref.location}</div>
                            <span className={`inline-block px-1 py-0.5 rounded-full text-[10px] font-medium mt-1
                              ${ref.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}
                            `}>
                              {ref.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {showNoReference && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded p-2 border border-gray-200 text-xs">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-gray-600" />
                            <span className="font-semibold text-gray-700">Proceeding Without References</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">Group formation will be handled automatically</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Policy Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded p-2 font-bold text-xs hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-1">
              <FileText className="w-4 h-4" />
              Refund Policy
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded p-2 font-bold text-xs hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              Terms & Conditions
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded p-2 font-bold text-xs hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-1">
              <FileText className="w-4 h-4" />
              Privacy Policy
            </button>
          </div>

          {/* Payment Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h3 className="text-base font-bold mb-2">Ready to Secure Your Investment?</h3>
                <div className="text-2xl font-bold mb-2">
                  {selectedParts.length > 0 ? `₹${userShare.toLocaleString()}` : 'Select shares to see amount'}
                </div>
                <button 
                  className="bg-white text-green-600 font-bold rounded py-2 px-6 text-xs shadow-xl hover:shadow-2xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 mx-auto"
                  onClick={handleContinuePayment}
                  disabled={selectedParts.length === 0}
                >
                  <CreditCard className="w-4 h-4" />
                  {selectedParts.length > 0 ? 'Continue to Payment' : 'Select Shares to Continue'}
                </button>
                <p className="text-green-100 mt-2 text-xs">
                  🔒 Secure payment • ✅ Instant confirmation • 📋 Legal documentation included
                </p>
                {selectedParts.length > 0 && (
                  <div className="mt-2 bg-white/20 rounded p-2 backdrop-blur-sm">
                    <p className="text-green-100 text-xs">
                      <strong>Your Investment:</strong> {selectedParts.length} share{selectedParts.length !== 1 ? 's' : ''} of {TOTAL_PARTS} • 
                      <strong> Ownership:</strong> {Math.round((selectedParts.length / TOTAL_PARTS) * 100)}% of the plot
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Additional Payment Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-white/60 backdrop-blur-sm rounded p-2 border border-white/30 text-xs">
                <div className="text-lg mb-1">🏦</div>
                <h4 className="font-bold text-gray-700">Secure Payment</h4>
                <p className="text-[10px] text-gray-600">Bank-grade encryption and security</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded p-2 border border-white/30 text-xs">
                <div className="text-lg mb-1">⚡</div>
                <h4 className="font-bold text-gray-700">Instant Processing</h4>
                <p className="text-[10px] text-gray-600">Immediate confirmation and receipt</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded p-2 border border-white/30 text-xs">
                <div className="text-lg mb-1">📜</div>
                <h4 className="font-bold text-gray-700">Legal Protection</h4>
                <p className="text-[10px] text-gray-600">Complete documentation and ownership rights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyndicatePlot;