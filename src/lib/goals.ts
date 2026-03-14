export interface GoalOption {
  id: string;
  emoji: string;
  name: string;
  hint: string;
  defaultCost: number;
}

export const PRESET_GOALS: GoalOption[] = [
  { id: "home",    emoji: "🏠", name: "Buy a Home",   hint: "Down payment or full purchase", defaultCost: 5000000 },
  { id: "car",     emoji: "🚗", name: "New Car",       hint: "Next vehicle purchase",         defaultCost: 1200000 },
  { id: "edu",     emoji: "🎓", name: "Education",     hint: "Higher studies or college",     defaultCost: 2000000 },
  { id: "travel",  emoji: "✈️", name: "Travel",        hint: "Your dream vacation",           defaultCost: 500000  },
  { id: "wedding", emoji: "💍", name: "Wedding",       hint: "Your big day",                  defaultCost: 2500000 },
  { id: "medical", emoji: "🏥", name: "Medical Fund",  hint: "Healthcare buffer",             defaultCost: 1000000 },
  { id: "biz",     emoji: "💼", name: "Business",      hint: "Startup or expansion",          defaultCost: 3000000 },
  { id: "custom",  emoji: "⭐", name: "Custom Goal",   hint: "Define your own milestone",     defaultCost: 1000000 },
];

export const CUSTOM_EMOJIS = ["⭐","🏆","🎯","🚀","💡","🌟","🎨","📚","🌍","🌱"];

export const DISCLAIMER =
  "This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.";
