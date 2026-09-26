import React, { useState } from "react";
import { Sparkles, HelpCircle, AlertTriangle, ArrowRight, CheckCircle2, MessageSquareText } from "lucide-react";
import { BookProject, StoryQuestion } from "../types";

interface QuestionAssistantViewProps {
  project: BookProject;
  onAnswerSaved: (updatedQuestions: StoryQuestion[]) => void;
  onCompleteQuestions: () => void;
}

export const QuestionAssistantView: React.FC<QuestionAssistantViewProps> = ({
  project,
  onAnswerSaved,
  onCompleteQuestions
}) => {
  const [questions, setQuestions] = useState<StoryQuestion[]>(project.questions || []);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [aiSuggestionsMap, setAiSuggestionsMap] = useState<Record<string, { recommendedOption: string; reasoning: string }>>({});
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState<boolean>(false);

  const currentQ = questions[activeQuestionIdx];

  const handleSelectOption = (qId: string, option: string) => {
    const updated = questions.map((q) => (q.id === qId ? { ...q, selectedOption: option } : q));
    setQuestions(updated);
    onAnswerSaved(updated);
  };

  const handleRequestAiSuggestion = async (q: StoryQuestion) => {
    setIsLoadingSuggestion(true);
    try {
      const res = await fetch("/api/suggest-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionTitle: q.title,
          questionText: q.question,
          options: q.options,
          bookContext: `${project.title}: ${project.summary}`
        })
      });
      const data = await res.json();
      setAiSuggestionsMap((prev) => ({
        ...prev,
        [q.id]: {
          recommendedOption: data.recommendedOption || q.options[1] || q.options[0],
          reasoning: data.reasoning || "This choice maintains steady narrative momentum."
        }
      }));
      // Auto pre-select recommended option
      handleSelectOption(q.id, data.recommendedOption || q.options[1] || q.options[0]);
    } catch {
      // Fallback recommendation
      const fallback = q.aiSuggestion || {
        recommendedOption: q.options[1] || q.options[0],
        reasoning: "Builds anticipation as other characters gradually discover the protagonist's gifts."
      };
      setAiSuggestionsMap((prev) => ({ ...prev, [q.id]: fallback }));
      handleSelectOption(q.id, fallback.recommendedOption);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => q.selectedOption).length;
  const isLastQuestion = activeQuestionIdx === totalQuestions - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquareText className="w-3.5 h-3.5" />
          Step 4: Conversational Refinement
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          I Need Your Help With {totalQuestions} Things
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          No complicated forms. Just answer each question one at a time to shape the flow of your novel.
        </p>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setActiveQuestionIdx(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              idx === activeQuestionIdx
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : q.selectedOption
                ? "bg-slate-800 text-slate-300 border border-slate-700"
                : "bg-slate-800/40 text-slate-500 border border-slate-800"
            }`}
          >
            <span>Question {idx + 1}</span>
            {q.selectedOption && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${idx === activeQuestionIdx ? "text-slate-950" : "text-emerald-400"}`} />
            )}
          </button>
        ))}
      </div>

      {currentQ && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Critical Decision Alert Banner */}
          {currentQ.isCritical && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>This Decision Will Affect Your Story</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                This choice significantly impacts how characters perceive the protagonist and will influence{" "}
                <strong>{currentQ.affectedChapters?.join(", ") || "Act II"}</strong>.
              </p>
            </div>
          )}

          {/* Question Title & Text */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Question {activeQuestionIdx + 1} of {totalQuestions}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              «"{currentQ.question}"»
            </h3>

            {/* Why Am I Asking? Box */}
            <div className="mt-3 inline-flex items-start gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2 text-xs text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-amber-300">Why am I asking?</span>{" "}
                <span>{currentQ.whyAsking}</span>
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = currentQ.selectedOption === opt;
              const isAiOpt = opt.toLowerCase().includes("ai suggest") || opt.toLowerCase().includes("ai recommend");

              if (isAiOpt) {
                return (
                  <button
                    key={idx}
                    id={`btn-ai-suggest-${currentQ.id}`}
                    onClick={() => handleRequestAiSuggestion(currentQ)}
                    disabled={isLoadingSuggestion}
                    className="w-full text-left p-3.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 text-xs sm:text-sm font-semibold text-amber-300 flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>{isLoadingSuggestion ? "Consulting AI..." : "✨ Let AI Suggest"}</span>
                    </span>
                    <span className="text-xs text-slate-400">Get recommended choice & reasoning →</span>
                  </button>
                );
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isSelected
                      ? "bg-slate-800 border-amber-500 ring-1 ring-amber-500 shadow-md"
                      : "bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected ? "border-amber-400 bg-amber-500" : "border-slate-500"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                    <span className={`text-xs sm:text-sm ${isSelected ? "text-white font-medium" : "text-slate-300"}`}>
                      {opt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Display AI Suggestion Reasoning Box if available */}
          {(aiSuggestionsMap[currentQ.id] || currentQ.aiSuggestion) && (
            <div className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-amber-500/30 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommendation: {(aiSuggestionsMap[currentQ.id] || currentQ.aiSuggestion)?.recommendedOption}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {(aiSuggestionsMap[currentQ.id] || currentQ.aiSuggestion)?.reasoning}
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveQuestionIdx(Math.max(0, activeQuestionIdx - 1))}
              disabled={activeQuestionIdx === 0}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-30"
            >
              Previous Question
            </button>

            {isLastQuestion ? (
              <button
                id="btn-complete-questions"
                onClick={onCompleteQuestions}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <span>Review Story Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-next-question"
                onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
