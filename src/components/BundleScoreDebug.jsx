// src/components/BundleScoreDebug.jsx
//
// TEMPORARY observability panel for bundle scoring (debug only).
//
// Renders the REAL scoring values sent by the backend on each bundle:
//
//   Compatibility + Personalization - Diversity = Ranking Score
//
// This component performs NO scoring math: every number it shows is a field
// from the bundle API response. The diversity penalty is always rendered as
// "-<n>" (the backend stores a positive number of points to subtract; if a
// backend ever sends a negative value it is normalized for display only).
//
// The panel only renders in development builds (import.meta.env.DEV) and
// only when the backend actually provided scoring data — production and
// bundles without scoring metadata are untouched. Delete this file (and
// its single usage in Home.jsx) to remove the feature entirely.

const isDev = import.meta.env.DEV;

const BREAKDOWN_LABELS = {
  same_top: 'Same Top',
  same_bottom: 'Same Bottom',
  same_layer: 'Same Layer',
  same_footwear: 'Same Shoe',
  same_color: 'Same Color',
  same_style: 'Same Style',
  same_fit: 'Same Fit',
  same_occasion: 'Same Occasion',
};

// Extract the scoring fields from a raw bundle response. Pure passthrough —
// no calculations, no defaults that could fake a value.
function scoringOf(raw) {
  if (!raw) return null;
  const compatibilityScore = raw.compatibility_score;
  const personalizationScore = raw.personalization_score;
  const diversityPenalty = raw.diversity_penalty;
  const rankingScore = raw.ranking_score;
  const diversityBreakdown = raw.diversity_breakdown;

  if (
    compatibilityScore == null &&
    personalizationScore == null &&
    diversityPenalty == null &&
    rankingScore == null &&
    diversityBreakdown == null
  ) {
    return null;
  }
  return {
    compatibilityScore,
    personalizationScore,
    diversityPenalty,
    rankingScore,
    diversityBreakdown,
  };
}

// Display-normalize the diversity penalty: backend semantics are "positive
// number of points to subtract" (e.g. 18 => shows "-18"). A pre-negated
// value (-18) is normalized to the same display so it is never subtracted
// twice anywhere.
function displayPenalty(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return -Math.abs(Number(value));
}

function renderNumber(value) {
  return value == null || Number.isNaN(Number(value)) ? '—' : String(Number(value));
}

function breakdownRows(breakdown) {
  if (!breakdown || typeof breakdown !== 'object') return [];
  return Object.entries(breakdown)
    .filter(([key, value]) => Number(value) > 0 && BREAKDOWN_LABELS[key])
    .map(([key, value]) => ({
      label: BREAKDOWN_LABELS[key],
      penalty: displayPenalty(value),
    }));
}

export default function BundleScoreDebug({ raw }) {
  const scoring = isDev ? scoringOf(raw) : null;
  if (!scoring) return null;

  const compat = renderNumber(scoring.compatibilityScore);
  const pers = scoring.personalizationScore == null
    ? null
    : `+${renderNumber(scoring.personalizationScore)}`;
  const div = displayPenalty(scoring.diversityPenalty);
  const rankingScore = renderNumber(scoring.rankingScore);
  const rows = breakdownRows(scoring.diversityBreakdown);
  const hasAnyScore = compat !== '—' || pers !== null || div !== null || rankingScore !== '—';

  if (!hasAnyScore) return null;

  return (
    <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-3 py-2.5 text-[11px] font-mono text-gray-700">
      <p className="mb-1.5 font-sans text-[10px] font-bold uppercase tracking-wide text-amber-700">
        Scoring debug
      </p>
      <div className="space-y-0.5">
        <div className="flex justify-between gap-3">
          <span>Compatibility</span>
          <span className="font-bold tabular-nums">{compat}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Personalization</span>
          <span className="font-bold tabular-nums">{pers ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Diversity</span>
          <span className="font-bold tabular-nums text-rose-600">{div ?? '—'}</span>
        </div>
        <div className="my-1 border-t border-dashed border-amber-300" />
        <div className="flex justify-between gap-3">
          <span>Ranking Score</span>
          <span className="font-bold tabular-nums text-gray-900">{rankingScore}</span>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <p className="mt-2 mb-1 font-sans text-[10px] font-bold uppercase tracking-wide text-amber-700">
            Diversity breakdown
          </p>
          <div className="space-y-0.5">
            {rows.map(({ label, penalty }) => (
              <div key={label} className="flex justify-between gap-3">
                <span>{label}</span>
                <span className="font-bold tabular-nums text-rose-600">{penalty}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}