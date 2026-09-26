import React, { useState } from "react";
import { User, Users, Shield, Heart, AlertTriangle, Sparkles, Check, Edit2, Plus, ArrowRight, Eye } from "lucide-react";
import { BookProject, Character } from "../types";

interface CharactersViewProps {
  project: BookProject;
  onUpdateProject: (updated: BookProject) => void;
  onGenerateCharacterArt?: (charName: string) => void;
}

export const CharactersView: React.FC<CharactersViewProps> = ({
  project,
  onUpdateProject,
  onGenerateCharacterArt
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(project.characters[0] || null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editCharData, setEditCharData] = useState<Partial<Character>>({});
  const [consistencyAlert, setConsistencyAlert] = useState<{ affectedChapters: number; fieldChanged: string } | null>(null);

  // Group characters
  const protagonist = project.characters.find((c) => c.role.toLowerCase().includes("protagonist") || c.name === project.protagonistName) || project.characters[0];
  const family = project.characters.filter((c) => c.relationship === "Family" && c.id !== protagonist?.id);
  const allies = project.characters.filter((c) => c.relationship === "Allies" && c.id !== protagonist?.id);
  const rivals = project.characters.filter((c) => (c.relationship === "Rivals" || c.relationship === "Colonial Rival") && c.id !== protagonist?.id);
  const others = project.characters.filter(
    (c) => c.id !== protagonist?.id && c.relationship !== "Family" && c.relationship !== "Allies" && c.relationship !== "Rivals" && c.relationship !== "Colonial Rival"
  );

  const handleOpenEdit = (char: Character) => {
    setEditCharData({ ...char });
    setConsistencyAlert(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = (applyEverywhere: boolean) => {
    if (!editCharData.id) return;
    const updatedList = project.characters.map((c) => (c.id === editCharData.id ? ({ ...c, ...editCharData } as Character) : c));
    let updatedProject = { ...project, characters: updatedList };

    if (editCharData.id === protagonist?.id && editCharData.name) {
      updatedProject.protagonistName = editCharData.name;
      if (editCharData.age) updatedProject.protagonistAge = editCharData.age;
      if (editCharData.wants) updatedProject.protagonistWants = editCharData.wants;
      if (editCharData.fears) updatedProject.protagonistFears = editCharData.fears;
    }

    onUpdateProject(updatedProject);
    setSelectedCharacter(updatedList.find((c) => c.id === editCharData.id) || null);
    setShowEditModal(false);
    setConsistencyAlert(null);
  };

  const checkFieldChange = (field: keyof Character, val: any) => {
    setEditCharData((prev) => ({ ...prev, [field]: val }));
    if (field === "age" && selectedCharacter && selectedCharacter.age !== Number(val)) {
      setConsistencyAlert({
        affectedChapters: Math.min(6, project.chapters.length),
        fieldChanged: `age from ${selectedCharacter.age} to ${val}`
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-slate-100 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5" />
          Step 6: Character Roster & Bible
        </span>
        <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
          Characters of Your World
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          Keep appearances, relationships, and motivations consistent across every chapter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Column: Characters List categorized */}
        <div className="space-y-6">
          {/* Protagonist Card */}
          {protagonist && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                👑 Protagonist
              </span>
              <div
                onClick={() => setSelectedCharacter(protagonist)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                  selectedCharacter?.id === protagonist.id
                    ? "bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/10"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-white text-base shrink-0 shadow-md">
                  {protagonist.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white truncate">{protagonist.name}</h4>
                    <span className="text-[11px] text-amber-400 font-semibold">Age {protagonist.age}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{protagonist.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Family Category */}
          {family.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-2">
                👨‍👩‍👧 Family & Court
              </span>
              <div className="space-y-2">
                {family.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCharacter(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedCharacter?.id === c.id
                        ? "bg-slate-800 border-rose-500 shadow-md"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-white truncate">{c.name}</h5>
                        <span className="text-[10px] text-slate-400">Age {c.age}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allies Category */}
          {allies.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-2">
                🤝 Allies & Advisors
              </span>
              <div className="space-y-2">
                {allies.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCharacter(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedCharacter?.id === c.id
                        ? "bg-slate-800 border-sky-500 shadow-md"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-white truncate">{c.name}</h5>
                        <span className="text-[10px] text-slate-400">Age {c.age}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rivals Category */}
          {rivals.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                ⚔️ Rivals & Antagonists
              </span>
              <div className="space-y-2">
                {rivals.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCharacter(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      selectedCharacter?.id === c.id
                        ? "bg-slate-800 border-indigo-500 shadow-md"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-white truncate">{c.name}</h5>
                        <span className="text-[10px] text-slate-400">Age {c.age}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Character Details & Story Journey */}
        <div className="lg:col-span-2">
          {selectedCharacter ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Header with Portrait & Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selectedCharacter.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                        {selectedCharacter.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                        Age {selectedCharacter.age}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedCharacter.role} • {selectedCharacter.relationship}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedCharacter)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-amber-500 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Profile</span>
                  </button>
                  {onGenerateCharacterArt && (
                    <button
                      onClick={() => onGenerateCharacterArt(selectedCharacter.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Art Portrait</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Who is this person? */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Who is this person?
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedCharacter.description || "A pivotal figure shaping the destiny of the realm."}
                </p>
              </div>

              {/* Wants & Fears */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    What do they want?
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCharacter.wants || "To secure progress, sovereignty, and prosperity for their court."}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    What do they fear?
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCharacter.fears || "Premature disaster or loss of autonomy to foreign mandates."}
                  </p>
                </div>
              </div>

              {/* Visual Relationships */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Relationships & Dynamics
                </h4>
                {selectedCharacter.relationshipsList && selectedCharacter.relationshipsList.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCharacter.relationshipsList.map((rel, idx) => (
                      <div key={idx} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 flex items-start gap-3 text-xs">
                        <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-slate-100">{rel.targetName}</strong> ({rel.relationshipType}):{" "}
                          <span className="text-slate-300">{rel.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Allied with the royal household; loyal to the legacy of Hyderabad.
                  </p>
                )}
              </div>

              {/* Story Journey across Chapters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Story Journey
                </h4>
                {selectedCharacter.storyJourney && selectedCharacter.storyJourney.length > 0 ? (
                  <div className="space-y-2 pl-2 border-l-2 border-slate-800">
                    {selectedCharacter.storyJourney.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Actively participates throughout Act I and Act II.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Select a character on the left to view their detailed profile.
            </div>
          )}
        </div>
      </div>

      {/* Edit Character Modal with Consistency Warning */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-white mb-1">
              Edit Character: {editCharData.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update attributes. Any changes affecting earlier chapters will be flagged automatically.
            </p>

            {/* Consistency Warning Banner */}
            {consistencyAlert && (
              <div className="mb-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Consistency Warning</span>
                </div>
                <p>
                  You modified {consistencyAlert.fieldChanged}. This change may affect{" "}
                  <strong>{consistencyAlert.affectedChapters} chapters</strong>.
                </p>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editCharData.name || ""}
                  onChange={(e) => checkFieldChange("name", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    value={editCharData.age || 10}
                    onChange={(e) => checkFieldChange("age", Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Relationship</label>
                  <select
                    value={editCharData.relationship || "Allies"}
                    onChange={(e) => checkFieldChange("relationship", e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Family">Family</option>
                    <option value="Allies">Allies</option>
                    <option value="Rivals">Rivals</option>
                    <option value="Colonial Rival">Colonial Rival</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Who is this person?</label>
                <textarea
                  rows={2}
                  value={editCharData.description || ""}
                  onChange={(e) => checkFieldChange("description", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">What do they want?</label>
                <input
                  type="text"
                  value={editCharData.wants || ""}
                  onChange={(e) => checkFieldChange("wants", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">What do they fear?</label>
                <input
                  type="text"
                  value={editCharData.fears || ""}
                  onChange={(e) => checkFieldChange("fears", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              {consistencyAlert ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl text-xs"
                  >
                    Apply Only Here
                  </button>
                  <button
                    onClick={() => handleSaveEdit(true)}
                    className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Apply Everywhere
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleSaveEdit(true)}
                  className="w-full sm:w-auto px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Save Character
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
