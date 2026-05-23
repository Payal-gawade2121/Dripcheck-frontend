import React, { useState } from 'react';
import namer from 'color-namer';
import AuthCard from '../components/AuthCard';
import Input from '../components/Input';
import Chips from '../components/Chips';
import Button from '../components/Button';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [customColor, setCustomColor] = useState('#000000');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    styles: [],
    clothes: [],
    colors: [],
    goal: [],
    buyingFrequency: []
  });

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log('Onboarding Complete:', formData);
      onComplete(); // Navigate to main app
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const addCustomColor = () => {
    try {
      const name = namer(customColor).ntc[0].name;
      const newColor = { label: name, value: name, color: customColor };
      // Prevent duplicates
      if (!formData.colors.find(c => c.color === customColor)) {
        updateData('colors', [...formData.colors, newColor]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeColor = (colorObj) => {
    updateData('colors', formData.colors.filter(c => c.color !== colorObj.color));
  };

  // Step Content Renderers
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input 
              label="Full Name" 
              placeholder="e.g. John Doe" 
              value={formData.fullName} 
              onChange={e => updateData('fullName', e.target.value)} 
            />
            <Input 
              label="Username (Optional)" 
              placeholder="e.g. johndoe99" 
              value={formData.username} 
              onChange={e => updateData('username', e.target.value)} 
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email} 
              onChange={e => updateData('email', e.target.value)} 
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block ml-1">Choose the styles you wear most often</label>
            <Chips 
              options={['Casual', 'Streetwear', 'Formal', 'Minimal', 'Ethnic', 'Sporty', 'Vintage', 'Korean Fashion', 'Smart Casual', 'Other']}
              selectedOptions={formData.styles}
              onChange={val => updateData('styles', val)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block ml-1">Select items already present in your wardrobe</label>
            <Chips 
              options={['T-Shirts', 'Shirts', 'Hoodies', 'Jeans', 'Cargo Pants', 'Shorts', 'Sneakers', 'Jackets', 'Traditional Wear', 'Other']}
              selectedOptions={formData.clothes}
              onChange={val => updateData('clothes', val)}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block ml-1">Pick your favorite outfit colors</label>
            <div className="flex items-center space-x-4 mb-4 mt-2">
              <input 
                type="color" 
                value={customColor} 
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-14 h-14 rounded-full border-0 cursor-pointer p-0 bg-transparent"
              />
              <button 
                onClick={addCustomColor}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                Add Color
              </button>
            </div>
            
            {formData.colors.length > 0 && (
              <div className="mt-4 border-t pt-4 border-gray-100">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Selected Colors</p>
                <div className="flex flex-col space-y-2">
                  {formData.colors.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-2 px-3 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: c.color }}></div>
                        <span className="text-sm font-medium text-gray-800">{c.label}</span>
                      </div>
                      <button onClick={() => removeColor(c)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block ml-1">Select your main goal</label>
            <Chips 
              multiSelect={false}
              options={[
                'Best Outfit Suggestions',
                'Matching Clothes From My Wardrobe',
                'Daily Outfit Planner',
                'Fashion Recommendations',
                'Color Combination Suggestions',
                'Occasion-Based Styling',
                'AI Fashion Rating',
                'Other'
              ]}
              selectedOptions={formData.goal}
              onChange={val => updateData('goal', val)}
            />
          </div>
        );
      case 6:
        return (
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block ml-1">How often do you buy clothes?</label>
            <Chips 
              multiSelect={false}
              options={[
                'Monthly',
                'Every Few Months',
                'Occasionally',
                'Only During Sales',
                'Prefer Not To Say'
              ]}
              selectedOptions={formData.buyingFrequency}
              onChange={val => updateData('buyingFrequency', val)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "Basic Profile Setup",
    "What's Your Fashion Style?",
    "What Clothes Do You Wear Most?",
    "Preferred Colors",
    "How Can We Help?",
    "Bonus Question"
  ];

  const footer = (
    <div className="flex flex-col space-y-3 mt-8">
      <Button onClick={handleNext}>{step === totalSteps ? 'Finish' : 'Next'}</Button>
      {step > 1 && (
        <button onClick={handleBack} className="text-gray-500 font-semibold text-sm hover:text-black">
          Back
        </button>
      )}
      <div className="flex justify-center space-x-1 mt-4">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className={`h-1.5 rounded-full transition-all ${idx < step ? 'bg-black w-4' : 'bg-gray-300 w-1.5'}`} />
        ))}
      </div>
    </div>
  );

  return (
    <AuthCard title="Welcome!" subtitle={stepTitles[step - 1]} footer={footer}>
      <div className="min-h-[280px]">
        {renderStepContent()}
      </div>
    </AuthCard>
  );
}
