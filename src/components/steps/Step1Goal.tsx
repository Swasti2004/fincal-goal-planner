"use client";
import { PRESET_GOALS, CUSTOM_EMOJIS } from "@/lib/goals";

interface Props {
  selectedGoalId: string;
  customName: string;
  customEmoji: string;
  onSelect: (id: string, emoji: string, name: string) => void;
  onCustomNameChange: (name: string) => void;
  onCustomEmojiChange: (emoji: string) => void;
  onNext: () => void;
}

export default function Step1Goal({
  selectedGoalId, customName, customEmoji,
  onSelect, onCustomNameChange, onCustomEmojiChange, onNext,
}: Props) {
  const isCustom = selectedGoalId === "custom";
  const canContinue = selectedGoalId !== "" && (!isCustom || customName.trim().length > 0);

  return (
    <div>
      <p className="breadcrumb"><strong>Goal Selection</strong></p>
      <h1 className="page-title">Choose Your Goal</h1>
      <p className="page-sub">Select the financial milestone you want to plan for.</p>

      <div className="goal-grid" role="group" aria-label="Goal selection">
        {PRESET_GOALS.map((g) => (
          <button key={g.id}
            className={`goal-btn${selectedGoalId === g.id ? " selected" : ""}`}
            onClick={() => onSelect(g.id, g.id === "custom" ? customEmoji : g.emoji,
              g.id === "custom" ? (customName || "My Goal") : g.name)}
            aria-pressed={selectedGoalId === g.id}>
            {selectedGoalId === g.id && <span className="check-badge" aria-hidden="true">✓</span>}
            <span className="g-icon" aria-hidden="true">{g.emoji}</span>
            <span className="g-name">{g.name}</span>
            <span className="g-hint">{g.hint}</span>
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="custom-box">
          <p className="cb-title">Name your goal <span className="required">*</span></p>
          <label htmlFor="customNameInput" className="sl-num-lbl" style={{ display: "block", marginBottom: 4 }}>
            Goal name (required)
          </label>
          <input className="ci" id="customNameInput" type="text"
            placeholder="e.g. Dream Startup, World Tour..." maxLength={40}
            value={customName} onChange={(e) => onCustomNameChange(e.target.value)} aria-required="true" />
          {customName.trim().length === 0 && (
            <p className="field-error" role="alert">Please enter a name for your custom goal.</p>
          )}
          <p className="cb-title" style={{ marginTop: ".75rem" }}>Pick an icon</p>
          <div className="emoji-row" role="group" aria-label="Icon picker">
            {CUSTOM_EMOJIS.map((e) => (
              <button key={e} className="ep" aria-pressed={customEmoji === e}
                onClick={() => onCustomEmojiChange(e)} aria-label={`Select icon`}>{e}</button>
            ))}
          </div>
        </div>
      )}

      <div className="nav-btns">
        <div />
        <button className="btn btn-primary" onClick={onNext}
          disabled={!canContinue} aria-disabled={!canContinue}>Continue →</button>
      </div>
      <p className="cant-see">
        <strong>Can&apos;t see your goal?</strong> Use &ldquo;Custom Goal&rdquo; to define your own.
      </p>
    </div>
  );
}
