// components/contact-form.tsx

'use client';

import { useState } from 'react';
import { SERVICE_CATEGORIES, type FormData, type ServiceSelection } from '../../types/form';
import { Check, X, Plus, Calendar, CheckCircle, Globe, PartyPopper, Sparkles } from 'lucide-react';

interface ContactFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function ContactForm({ onClose, isModal = false }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    website: '',
    services: []
  });

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (category: string) => {
    setSelectedService(category);
    setSelectedSubServices([]);
  };

  const handleSubServiceChange = (subService: string) => {
    setSelectedSubServices(prev =>
      prev.includes(subService)
        ? prev.filter(s => s !== subService)
        : [...prev, subService]
    );
  };

  const addService = () => {
    if (!selectedService) return;

    const newService: ServiceSelection = {
      category: selectedService,
      subServices: selectedSubServices.length > 0 ? [...selectedSubServices] : undefined
    };

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));

    setSelectedService('');
    setSelectedSubServices([]);
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        // Reset form after 3 seconds and auto-close modal
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 5000);
      } else {
        alert(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state - Enhanced UI
  if (showSuccess) {
    return (
      <div className={`${isModal ? "min-h-[300px] md:min-h-[350px]" : "min-h-[400px]"} flex flex-col items-center justify-center p-6 md:p-8`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#f7af00]/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-[#f7af00]/10 rounded-full blur-xl"></div>
        </div>
        
        {/* Success icon with animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#f7af00] rounded-full animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#f7af00] to-[#e69f00] rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-white" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2">
            <PartyPopper className="w-8 h-8 text-[#f7af00] animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="w-8 h-8 text-[#f7af00] animate-pulse" />
          </div>
        </div>

        {/* Success message */}
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-[#31302f] mb-3">
            Successfully Submitted! 🎉
          </h3>
          
          <div className="mb-6">
            <p className="text-lg md:text-xl font-medium text-[#050504] mb-2">
              Thank you, {formData.name}!
            </p>
            <p className="text-[#31302f]">
              Your consultation request has been received successfully.
            </p>
          </div>

          {/* Next steps */}
          <div className="bg-[#f0eadd] rounded-xl p-4 md:p-5 mb-6">
            <h4 className="font-semibold text-[#050504] mb-3 flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              What happens next?
            </h4>
            <div className="space-y-2 text-sm md:text-base text-left">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#f7af00] rounded-full mt-2 flex-shrink-0"></div>
                <span>We'll review your information within 24 hours</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#f7af00] rounded-full mt-2 flex-shrink-0"></div>
                <span>Our team will contact you to schedule your strategy call</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-[#f7af00] rounded-full mt-2 flex-shrink-0"></div>
                <span>Prepare any questions you have for our consultation</span>
              </div>
            </div>
          </div>

          {/* Countdown to close */}
          <div className="mt-6">
            <div className="w-full bg-[#faf4e5] rounded-full h-2 mb-2">
              <div 
                className="bg-[#f7af00] h-2 rounded-full transition-all duration-3000 ease-linear"
                style={{ width: '100%' }}
              ></div>
            </div>
            <p className="text-sm text-[#7a7565]">
              This window will close automatically in a few seconds...
            </p>
          </div>

          {/* Manual close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-transparent border border-[#f7af00] text-[#f7af00] hover:bg-[#f7af00]/10 rounded-xl font-medium transition-colors"
            >
              Close Now
            </button>
          )}
        </div>
      </div>
    );
  }

  // Rest of the form remains the same...
  return (
    <div className={isModal ? "max-h-[80vh] md:max-h-[85vh] overflow-y-auto" : ""}>
      <div className={`${isModal ? "p-0" : "p-4 md:p-6 lg:p-8"} ${!isModal && "bg-[#f0eadd] rounded-2xl md:rounded-3xl shadow-lg border border-[#f0eadd]"}`}>
        {isModal && (
          <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-[#f0eadd] sticky top-0 bg-[#faf4e5] z-10 px-4 md:px-6 pt-4">
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-[#31302f] pr-2">
              Schedule Free Consultation
            </h2>
            <button
              onClick={onClose}
              className="p-1 md:p-2 hover:bg-[#f0eadd] rounded-lg transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-[#31302f]" />
            </button>
          </div>
        )}

        {!isModal && (
          <div className="text-center mb-6 md:mb-8 px-2">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#31302f] mb-2 md:mb-3">
              Get Your Free Strategy Call
            </h2>
            <p className="text-sm md:text-base text-[#31302f]">
              Fill out the form below and we'll schedule your consultation
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 px-4 md:px-6 pb-4 md:pb-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-[#31302f] mb-1 md:mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 md:p-3 bg-[#faf4e5] border border-[#f0eadd] rounded-lg md:rounded-xl text-[#31302f] placeholder-[#7a7565] focus:outline-none focus:ring-2 focus:ring-[#f7af00] focus:border-transparent transition-all text-sm md:text-base"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#31302f] mb-1 md:mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 md:p-3 bg-[#faf4e5] border border-[#f0eadd] rounded-lg md:rounded-xl text-[#31302f] placeholder-[#7a7565] focus:outline-none focus:ring-2 focus:ring-[#f7af00] focus:border-transparent transition-all text-sm md:text-base"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#31302f] mb-1 md:mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 md:p-3 bg-[#faf4e5] border border-[#f0eadd] rounded-lg md:rounded-xl text-[#31302f] placeholder-[#7a7565] focus:outline-none focus:ring-2 focus:ring-[#f7af00] focus:border-transparent transition-all text-sm md:text-base"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#31302f] mb-1 md:mb-2">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website 
                </span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 md:p-3 bg-[#faf4e5] border border-[#f0eadd] rounded-lg md:rounded-xl text-[#31302f] placeholder-[#7a7565] focus:outline-none focus:ring-2 focus:ring-[#f7af00] focus:border-transparent transition-all text-sm md:text-base"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Services Selection Section */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-medium text-[#31302f]">
              Services You're Interested In
            </h3>
            
            {/* Service Category Selection */}
            <div>
              <label className="block text-sm font-medium text-[#31302f] mb-2 md:mb-3">
                Select Service Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(SERVICE_CATEGORIES).map(([key, service]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleServiceChange(key)}
                    className={`p-2.5 md:p-3 rounded-lg md:rounded-xl border transition-all ${selectedService === key
                        ? 'bg-[#f7af00] border-[#f7af00] text-[#050504] shadow-md'
                        : 'bg-[#faf4e5] border-[#f0eadd] text-[#31302f] hover:border-[#f7af00]'
                      }`}
                  >
                    <div className="font-medium text-xs md:text-sm text-left leading-tight">
                      {service.label}
                    </div>
                    {service.subcategories.length > 0 && (
                      <div className="text-xs text-[#7a7565] mt-0.5">
                        {service.subcategories.length} sub-options
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-services for Marketing */}
            {selectedService === 'marketing' && (
              <div className="bg-[#faf4e5] p-3 md:p-4 rounded-lg md:rounded-xl border border-[#f0eadd]">
                <label className="block text-sm font-medium text-[#31302f] mb-2 md:mb-3">
                  Select Marketing Sub-services
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                  {SERVICE_CATEGORIES.marketing.subcategories.map((sub) => (
                    <label key={sub} className="flex items-center space-x-2 md:space-x-3 p-2 rounded-lg hover:bg-[#f0eadd] transition-colors cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedSubServices.includes(sub)}
                          onChange={() => handleSubServiceChange(sub)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded border-2 flex items-center justify-center ${selectedSubServices.includes(sub)
                            ? 'bg-[#f7af00] border-[#f7af00]'
                            : 'border-[#7a7565]'
                          }`}>
                          {selectedSubServices.includes(sub) && (
                            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#050504]" />
                          )}
                        </div>
                      </div>
                      <span className="text-[#31302f] text-xs md:text-sm">{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add Service Button */}
            {selectedService && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={addService}
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[#f7af00] text-[#050504] rounded-lg md:rounded-xl font-medium hover:bg-[#e69f00] transition-all hover:scale-105 text-xs md:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  Add Service
                </button>
                <span className="text-xs text-[#7a7565] text-center sm:text-left">
                  Click to add selected service
                </span>
              </div>
            )}

            {/* Selected Services List */}
            {formData.services.length > 0 && (
              <div className="mt-4 md:mt-6">
                <h4 className="font-medium text-[#31302f] mb-2 md:mb-3 text-sm md:text-base">Selected Services:</h4>
                <div className="space-y-2 md:space-y-3">
                  {formData.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start md:items-center p-3 bg-[#faf4e5] rounded-lg md:rounded-xl border border-[#f0eadd]"
                    >
                      <div className="pr-2">
                        <div className="font-medium text-[#050504] text-sm md:text-base">
                          {SERVICE_CATEGORIES[service.category as keyof typeof SERVICE_CATEGORIES]?.label || service.category}
                        </div>
                        {service.subServices && service.subServices.length > 0 && (
                          <div className="text-xs text-[#7a7565] mt-1">
                            <span className="font-medium">Sub-services:</span> {service.subServices.join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="p-1 md:p-2 hover:bg-[#f0eadd] rounded-lg transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Remove service"
                      >
                        <X className="w-3 h-3 md:w-4 md:h-4 text-[#7a7565]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3 md:pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full inline-flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#f7af00] hover:bg-[#e69f00] text-[#050504] hover:scale-105 hover:shadow-xl'
                }`}
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              {isSubmitting ? 'Submitting...' : 'Schedule Free Consultation'}
            </button>
            
            <p className="text-center text-xs md:text-sm text-[#7a7565] mt-2 md:mt-3 px-2">
              We'll review your information and contact you within 24 hours to schedule your strategy call.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}