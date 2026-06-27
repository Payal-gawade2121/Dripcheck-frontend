import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const categories = ['Top Wear', 'Bottom Wear', 'Foot Wear'];

const categoryIcons = {
  'Top Wear': '👕',
  'Bottom Wear': '👖',
  'Foot Wear': '👟',
};

const categoryColors = {
  'Top': 'bg-violet-100 text-violet-700 border-violet-200',
  'Bottom': 'bg-blue-100 text-blue-700 border-blue-200',
  'Footwear': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Layer': 'bg-amber-100 text-amber-700 border-amber-200',
  'Accessory': 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function AddProduct({ onNavigate }) {
  // Step machine: 'form' → 'loading' → 'preview' | 'avatar'
  const [step, setStep] = useState('form');
  const [activeMode, setActiveMode] = useState(null); // 'upload' | 'avatar'

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [typeStr, setTypeStr] = useState('');
  const [category, setCategory] = useState('Top Wear');

  // Loading text
  const [loadingText, setLoadingText] = useState('');
  const uploadLoadingSteps = [
    'Uploading product photo...',
    'Invoking Nano Banana AI...',
    'Nano Banana is clearing background...',
    'Polishing product lighting...',
    'Extracting style tags and fit...',
  ];
  const avatarLoadingSteps = [
    'Analysing your clothing item...',
    'Finding best matching styles from wardrobe...',
    'Building your curated outfit bundle...',
    'Crafting your FLUX avatar prompt...',
    'FLUX.2 is generating your fashion avatar...',
    'Rendering your look...',
  ];

  // API Response States
  const [uploadResult, setUploadResult] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [avatarResult, setAvatarResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let interval;
    if (step === 'loading') {
      const steps = activeMode === 'avatar' ? avatarLoadingSteps : uploadLoadingSteps;
      let idx = 0;
      setLoadingText(steps[0]);
      interval = setInterval(() => {
        idx = (idx + 1) % steps.length;
        setLoadingText(steps[idx]);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [step, activeMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit.');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    if (!image) { setErrorMsg('Please select a product image.'); return false; }
    if (!name.trim() || !color.trim() || !typeStr.trim()) {
      setErrorMsg('Please fill in all compulsory fields.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  // ── Standard upload + AI shot ──────────────────────────────────────────────
  const handleUploadSubmit = async () => {
    if (!validate()) return;
    setActiveMode('upload');
    setStep('loading');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('color', color);
    formData.append('type', typeStr);
    formData.append('category', category);
    formData.append('user_id', 'user_demo');

    try {
      const response = await fetch(`${API_BASE_URL}/wardrobe/upload-product`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUploadResult(data);
        setEditedProduct({
          name: data.product.name,
          color: data.product.color,
          type: data.product.type,
          category: data.product.category,
          metadata: { ...data.product.metadata },
        });
        setStep('preview');
      } else {
        setErrorMsg(data.error || 'Failed to process image with AI.');
        setStep('form');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Network error. Failed to connect to server.');
      setStep('form');
    }
  };

  // ── Avatar + Bundle Generation ─────────────────────────────────────────────
  const handleAvatarGenerate = async () => {
    if (!validate()) return;
    setActiveMode('avatar');
    setStep('loading');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name);
    formData.append('color', color);
    formData.append('type', typeStr);
    formData.append('category', category);
    formData.append('user_id', 'user_demo');

    try {
      const response = await fetch(`${API_BASE_URL}/wardrobe/generate-avatar`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAvatarResult(data);
        setStep('avatar');
      } else {
        setErrorMsg(data.error || 'Failed to generate avatar.');
        setStep('form');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Network error. Failed to connect to server.');
      setStep('form');
    }
  };

  // ── Approve / Save wardrobe item (from standard preview) ─────────────────
  const handleConfirm = async (approved) => {
    if (!uploadResult) return;
    setStep('loading');
    setActiveMode('upload');
    setLoadingText(approved ? 'Saving to wardrobe...' : 'Cleaning up...');

    try {
      const response = await fetch(`${API_BASE_URL}/wardrobe/approve-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved,
          temp_orig_name: uploadResult.temp_orig_name,
          temp_gen_name: uploadResult.temp_gen_name,
          fallback_used: uploadResult.fallback_used,
          user_id: 'user_demo',
          product: editedProduct,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (approved) alert('Success! Added to wardrobe.');
        onNavigate('home');
      } else {
        alert(data.error || 'Failed to save product.');
        setStep('preview');
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Failed to save product.');
      setStep('preview');
    }
  };

  const updateMetadataField = (field, val) => {
    setEditedProduct(prev => ({ ...prev, metadata: { ...prev.metadata, [field]: val } }));
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Form Step
  // ════════════════════════════════════════════════════════════════════════════
  if (step === 'form') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#0a0a0a] text-white relative overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-6">
          <button
            onClick={() => onNavigate('home')}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Add Item</p>
            <h2 className="text-lg font-bold text-white leading-tight">Upload Clothing</h2>
          </div>
        </div>

        <div className="flex-1 px-5 pb-10 space-y-5">
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold p-3.5 rounded-2xl">
              {errorMsg}
            </div>
          )}

          {/* Image Picker */}
          <div>
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
              Product Photo
            </label>
            <div className="relative border-2 border-dashed border-white/15 hover:border-violet-500/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/5 min-h-[180px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity">
                    Change Image
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white/70">Upload Product Image</p>
                  <p className="text-xs text-white/30 mt-1">JPG, PNG, WEBP · Max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <DarkInput
              label="Product Name"
              placeholder="e.g. Black Oversized Tee"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <DarkInput
              label="Primary Color"
              placeholder="e.g. Jet Black"
              value={color}
              onChange={e => setColor(e.target.value)}
            />
            <DarkInput
              label="Type / Style"
              placeholder="e.g. T-Shirt, Slim Jeans, Sneakers"
              value={typeStr}
              onChange={e => setTypeStr(e.target.value)}
            />

            {/* Category Selector */}
            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      category === cat
                        ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    <span className="text-lg">{categoryIcons[cat]}</span>
                    <span style={{ fontSize: '9px' }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            {/* PRIMARY: Generate Avatar + Bundle */}
            <button
              onClick={handleAvatarGenerate}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 transition-all active:scale-95"
            >
              <span className="text-lg">✨</span>
              Generate Avatar &amp; Bundle
            </button>

            {/* SECONDARY: Standard AI shot only */}
            <button
              onClick={handleUploadSubmit}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI E-Commerce Shot Only
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Loading Step
  // ════════════════════════════════════════════════════════════════════════════
  if (step === 'loading') {
    const isAvatar = activeMode === 'avatar';
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-8 text-center">
        {/* Animated ring */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${
            isAvatar ? 'border-violet-500' : 'border-emerald-400'
          }`} />
          <div className={`w-20 h-20 rounded-full blur-xl opacity-30 animate-pulse ${
            isAvatar ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
          }`} />
          <span className="text-4xl absolute">{isAvatar ? '🧬' : '⚡'}</span>
        </div>

        <p className="text-xl font-bold tracking-wide">
          {isAvatar ? 'FLUX is crafting your look' : 'Nano Banana processing'}
        </p>
        <p className={`text-sm font-semibold mt-2 min-h-[20px] animate-pulse ${
          isAvatar ? 'text-violet-400' : 'text-emerald-400'
        }`}>
          {loadingText}
        </p>
        <p className="text-xs text-white/30 mt-6 max-w-xs leading-relaxed">
          {isAvatar
            ? 'Analysing compatibility, building your bundle, and generating a fashion avatar with FLUX.2-klein-9B…'
            : 'Generating studio lighting, removing background, and analysing product attributes…'}
        </p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Avatar Step (the new step)
  // ════════════════════════════════════════════════════════════════════════════
  if (step === 'avatar' && avatarResult) {
    const ar = avatarResult;
    const avatarImgUrl = ar.avatar_url
      ? `${API_BASE_URL.replace('/api', '')}${ar.avatar_url}`
      : null;

    const allBundleItems = [ar.uploaded_item, ...ar.bundle];

    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-4">
          <button
            onClick={() => setStep('form')}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">AI Generated</p>
            <h2 className="text-lg font-bold text-white leading-tight">Your Avatar &amp; Bundle</h2>
          </div>
        </div>

        <div className="px-5 pb-10">
          {/* Avatar Image */}
          <div className="mb-5">
            {avatarImgUrl ? (
              <div className="relative w-full rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-500/20">
                <img
                  src={avatarImgUrl}
                  alt="Generated Avatar"
                  className="w-full object-cover"
                  style={{ maxHeight: '520px', objectPosition: 'top' }}
                />
                {/* Overlay badge */}
                <div className="absolute top-3 right-3 bg-violet-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  FLUX.2 Generated
                </div>
              </div>
            ) : (
              <div className="w-full h-64 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6">
                <span className="text-4xl mb-3">🤖</span>
                <p className="text-sm font-semibold text-white/60">Avatar Generation Failed</p>
                <p className="text-xs text-white/30 mt-1">
                  The FLUX model is currently unavailable. Your bundle is still ready below.
                </p>
              </div>
            )}
          </div>

          {/* Score + Style Tags */}
          <div className="flex items-center gap-3 mb-5">
            {/* Compatibility Score */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Compatibility</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {ar.compatibility_score > 0 ? `${ar.compatibility_score}` : '—'}
                <span className="text-sm font-semibold text-white/40">/100</span>
              </p>
            </div>

            {/* Style Tags */}
            <div className="flex-[2] flex flex-wrap gap-1.5 items-center">
              {(ar.style_tags || []).map(tag => (
                <span
                  key={tag}
                  className="bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {(ar.occasion_tags || []).slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bundle Breakdown */}
          <div className="mb-5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
              Curated Bundle ({allBundleItems.length} items)
            </p>
            <div className="space-y-2">
              {allBundleItems.map((item, idx) => {
                const isUploaded = idx === 0;
                const colorClass = categoryColors[item.category] || 'bg-white/5 text-white/60 border-white/10';
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition ${
                      isUploaded
                        ? 'bg-violet-600/15 border-violet-500/30'
                        : 'bg-white/5 border-white/8'
                    }`}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 border border-white/10 flex items-center justify-center"
                      style={{ backgroundColor: colorToHex(item.primary_color) }}
                    >
                      <span className="text-lg">{catEmoji(item.category)}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-bold text-white truncate">{item.name}</p>
                        {isUploaded && (
                          <span className="text-[9px] font-bold text-violet-400 bg-violet-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                          {item.category}
                        </span>
                        <span className="text-[9px] text-white/30 font-semibold">
                          {item.primary_color}
                        </span>
                        {item.fit && (
                          <span className="text-[9px] text-white/30 font-semibold">
                            · {item.fit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {allBundleItems.length <= 1 && (
                <div className="text-center py-6 bg-white/5 border border-white/8 rounded-2xl">
                  <p className="text-xs text-white/30 font-semibold">No matching items found in wardrobe.</p>
                  <p className="text-[10px] text-white/20 mt-1">Add more items to get a complete bundle.</p>
                </div>
              )}
            </div>
          </div>

          {/* Dominant Color */}
          {ar.dominant_color && (
            <div className="mb-5 bg-white/5 border border-white/8 rounded-2xl p-3 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex-shrink-0 border border-white/10"
                style={{ backgroundColor: colorToHex(ar.dominant_color) }}
              />
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Dominant Palette</p>
                <p className="text-xs font-bold text-white">{ar.dominant_color} · {ar.dominant_palette}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mt-6">
            {/* Add to Wardrobe — proceed with standard upload */}
            <button
              onClick={handleUploadSubmit}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Add Item to Wardrobe
            </button>

            {/* Try different avatar */}
            <button
              onClick={handleAvatarGenerate}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <span>🔄</span>
              Regenerate Avatar
            </button>

            <button
              onClick={() => setStep('form')}
              className="w-full py-3.5 text-sm font-semibold text-white/30 hover:text-white/60 transition"
            >
              ← Back to Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: Standard Preview Step (existing)
  // ════════════════════════════════════════════════════════════════════════════
  if (step === 'preview' && uploadResult) {
    const isFallback = uploadResult.fallback_used;
    const prodUrl = `${API_BASE_URL.replace('/api', '')}${uploadResult.generated_image}`;
    const origUrl = `${API_BASE_URL.replace('/api', '')}${uploadResult.original_image}`;

    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#0a0a0a] text-white p-5 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setStep('form')} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Review</p>
            <h2 className="text-lg font-bold text-white">Verify AI Result</h2>
          </div>
        </div>

        {isFallback && (
          <div className="mb-4 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold p-3.5 rounded-2xl flex gap-2">
            <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>AI enhancement unavailable. Original image used instead.</span>
          </div>
        )}

        {/* Images */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Original</span>
            <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <img src={origUrl} alt="Original" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              {!isFallback && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
              E-Commerce Shot
            </span>
            <div className="aspect-[4/5] bg-white/5 border-2 border-emerald-500/50 rounded-xl overflow-hidden relative">
              <img src={prodUrl} alt="AI Enhanced" className="w-full h-full object-cover" />
              {!isFallback && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  AI
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="border-t border-white/10 pt-4 space-y-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">AI Inferred Attributes</p>

          <div className="grid grid-cols-2 gap-3">
            <DarkInput label="Name" value={editedProduct.name} onChange={e => setEditedProduct(prev => ({ ...prev, name: e.target.value }))} />
            <DarkInput label="Color" value={editedProduct.color} onChange={e => setEditedProduct(prev => ({ ...prev, color: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DarkSelect label="Color Family" value={editedProduct.metadata.color_family} onChange={e => updateMetadataField('color_family', e.target.value)} options={['Neutral','Earth','Dark','Bold','Pastel','Warm']} />
            <DarkSelect label="Pattern" value={editedProduct.metadata.pattern} onChange={e => updateMetadataField('pattern', e.target.value)} options={['Solid','Stripes','Checks','Graphic','Floral','Abstract']} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DarkSelect label="Fit" value={editedProduct.metadata.fit} onChange={e => updateMetadataField('fit', e.target.value)} options={['Slim','Regular','Relaxed','Oversized','Cropped','Baggy','Tapered']} />
            <DarkSelect label="Season" value={editedProduct.metadata.season} onChange={e => updateMetadataField('season', e.target.value)} options={['Summer','Winter','Monsoon','All-season']} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => handleConfirm(true)}
            className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Approve &amp; Add to Wardrobe
          </button>
          <button
            onClick={() => handleConfirm(false)}
            className="w-full py-3.5 text-sm font-bold text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition duration-300"
          >
            Discard &amp; Start Over
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Helper Components ─────────────────────────────────────────────────────────
function DarkInput({ label, placeholder, value, onChange, type = 'text', ...rest }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3.5 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition"
      />
    </div>
  );
}

function DarkSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition appearance-none"
      >
        {options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
    </div>
  );
}

// ── Utility helpers ───────────────────────────────────────────────────────────
function colorToHex(colorName) {
  const map = {
    'Black': '#111111', 'White': '#f5f5f5', 'Grey': '#9ca3af', 'Navy': '#1e3a5f',
    'Blue': '#3b82f6', 'Red': '#ef4444', 'Green': '#22c55e', 'Dark Green': '#166534',
    'Brown': '#92400e', 'Beige': '#d4b896', 'Khaki': '#c3b091', 'Olive': '#708238',
    'Yellow': '#fbbf24', 'Orange': '#f97316', 'Purple': '#a855f7', 'Pink': '#ec4899',
    'Cream': '#fffbeb', 'Charcoal': '#374151', 'Burgundy': '#7f1d1d', 'Rust': '#b45309',
    'Tan': '#d2b48c', 'Camel': '#c19a6b', 'Lavender': '#a78bfa', 'Mint': '#6ee7b7',
    'Mustard': '#ca8a04', 'Terracotta': '#b45309', 'Sage Green': '#84a98c',
    'Cobalt Blue': '#2563eb', 'Baby Pink': '#f9a8d4', 'Ivory': '#fffff0',
  };
  const lc = (colorName || '').toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (lc.includes(k.toLowerCase())) return v;
  }
  return '#6b7280';
}

function catEmoji(cat) {
  const m = { 'Top': '👕', 'Bottom': '👖', 'Footwear': '👟', 'Layer': '🧥', 'Accessory': '👜' };
  return m[cat] || '👔';
}
