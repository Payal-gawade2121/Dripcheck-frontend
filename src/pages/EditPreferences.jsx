import { useState, useEffect } from 'react';
import Chips from '../components/Chips';
import Button from '../components/Button';
import { fetchPreferences, updatePreferences } from '../api';

const KNOWN_COLORS = {
  'Black': '#1a1a1a',
  'White': '#ffffff',
  'Blue': '#2563eb',
  'Grey': '#9ca3af',
  'Beige': '#d6c7a1',
  'Green': '#16a34a',
  'Red': '#dc2626',
  'Pastel Shades': 'linear-gradient(135deg,#fca5a5,#93c5fd,#bbf7d0)',
};

export default function EditPreferences({ onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [originalAnswers, setOriginalAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPreferences();
        const qs = data.questions || [];
        setQuestions(qs);

        const initial = {};
        qs.forEach((q) => {
          let val = q.user_answer;
          if (val == null) val = [];
          if (!Array.isArray(val)) val = [val];
          val = val.filter((v) => v != null && v !== '');
          initial[q.id] = val;
        });

        setAnswers(initial);
        setOriginalAnswers(JSON.parse(JSON.stringify(initial)));
      } catch (e) {
        setError(e.message || 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (questionId, val) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const isColorQuestion = (q) => q.question_text.toLowerCase().includes('color');

  const customOptionsFor = (q) => {
    const labels = new Set(q.options.map((o) => o.text));
    const extras = (answers[q.id] || []).filter((v) => !labels.has(v));
    return extras.map((v) => ({ label: v, value: v }));
  };

  const toResponses = () => {
    const responses = {};
    questions.forEach((q) => {
      const val = answers[q.id] || [];
      const isSingle = q.question_type === 'single_choice';
      responses[q.id] = isSingle && val.length ? [val[val.length - 1]] : val;
    });
    return responses;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await updatePreferences(toResponses());
      onNavigate('profile');
    } catch (e) {
      setError(e.message || 'Failed to update preferences');
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanges =
    JSON.stringify(answers) !== JSON.stringify(originalAnswers);

  return (
    <div className="w-full h-full flex flex-col bg-[#f9fafb] relative overflow-hidden">
      <div className="flex-1 overflow-y-auto app-scroll">
        <div className="px-5 sm:px-8 xl:px-12 py-8 xl:py-10 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex items-start gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Back to profile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight tracking-tight">Edit Preferences</h1>
              <p className="text-sm lg:text-[15px] text-gray-500 mt-1.5">
                Tune your style profile so recommendations get sharper.
              </p>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-24 text-gray-400 text-sm">Loading preferences...</div>
            ) : error && !questions.length ? (
              <div className="text-center text-rose-500 text-sm py-24">{error}</div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2 items-start">
                {questions.map((q) => {
                  const isColor = isColorQuestion(q);
                  const isSingle = q.question_type === 'single_choice';
                  const selected = answers[q.id] || [];
                  const allOptions = [
                    ...q.options.map((o) => (isColor ? { label: o.text, value: o.text, color: KNOWN_COLORS[o.text] } : o.text)),
                    ...customOptionsFor(q),
                  ];

                  return (
                    <div key={q.id} className="bg-white border border-gray-200/80 rounded-3xl p-6">
                      <label className="text-[15px] font-semibold text-gray-900 mb-3 block">{q.question_text}</label>
                      <Chips
                        options={allOptions}
                        selectedOptions={selected}
                        onChange={(val) => handleChange(q.id, val)}
                        multiSelect={!isSingle}
                        colorMode={isColor}
                      />
                    </div>
                  );
                })}

                {error && questions.length > 0 && (
                  <p className="lg:col-span-2 text-rose-500 text-sm text-center">{error}</p>
                )}
              </div>
            )}
          </div>

          <div className="h-28" />
        </div>
      </div>

      {/* Submit bar — sticks to the bottom only while there are unsaved changes */}
      {hasChanges && (
        <div className="shrink-0 border-t border-gray-200 bg-white/90 backdrop-blur px-5 sm:px-8 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <p className="hidden sm:block text-sm text-gray-500">You have unsaved changes.</p>
            <div className="sm:w-64 ml-auto">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}