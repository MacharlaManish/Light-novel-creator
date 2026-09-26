import { BookProject } from "../types";

export const SAMPLE_NIZAM_PROJECT: BookProject = {
  id: "project-nizam-1886",
  title: "Reincarnated as Nizam's Heir",
  subtitle: "Building an Industrial Empire in 19th Century Hyderabad",
  author: "Ravi M.",
  series: "Deccan Chronicles",
  volume: "Vol. 1",
  genres: ["Historical Alternate History", "Light Novel", "Reincarnation", "Adventure"],
  controlLevel: "Balanced",
  setting: "Hyderabad State — Late 19th Century (1886–1896)",
  bookType: "Historical Alternate History Light Novel",
  summary: "A modern hydraulic engineer reincarnates as the young crown prince of Hyderabad in 1886. Armed with future blueprints, he must navigate colonial intrigues, master palace politics, and build flood defenses before a legendary catastrophe strikes.",
  isHistorical: true,
  historicalIdentityNote: "This character is based on a real person (Mir Osman Ali Khan, the 7th Nizam). The app preserves his documented royal identity while allowing your alternate-history story to change decisions and industrial outcomes.",
  protagonistName: "Mir Osman Ali Khan",
  protagonistAge: 10,
  protagonistRole: "Protagonist / Future 7th Nizam",
  protagonistBio: "A 21st-century civil engineer reincarnated into the princely court of Hyderabad in 1886, carrying modern technical knowledge and intense royal duty.",
  protagonistWants: "To modernize Hyderabad, prevent catastrophic monsoon floods, and build an autonomous industrial base before colonial pressure tightens.",
  protagonistFears: "Failing his people, triggering British imperial intervention, and alienating his traditionalist father.",
  coverImage: "",
  coverStyle: "Light Novel",
  planningMode: "Let AI Plan As We Go",
  currentStep: 7, // writing step
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  characters: [
    {
      id: "char-1",
      name: "Mir Osman Ali Khan",
      role: "Protagonist",
      age: 10,
      description: "Heir apparent possessing the memories of a 21st-century infrastructure engineer.",
      relationship: "Family",
      wants: "To build a flood-proof, self-sufficient Hyderabad with modern power, clean water, and railways.",
      fears: "Being exposed as an anomaly or causing conflict between his father and the British Resident.",
      avatarUrl: "",
      storyJourney: [
        "1886: Awakens at Purani Haveli with dual memories.",
        "1889: Astonishes court tutors by recalculating state tax ledgers.",
        "1892: Opens clandestine workshop behind palace stables to cast precision steel gears.",
        "1896: Conducts covert geological surveys along the treacherous Musi riverbed."
      ],
      relationshipsList: [
        { targetName: "Mahboob Ali Khan", relationshipType: "Father & Sovereign", note: "Deep mutual love, but Osman must tread cautiously around royal protocol." },
        { targetName: "Server-ul-Mulk", relationshipType: "Tutor & Ally", note: "Recognizes Osman's genius and shields his unconventional studies." },
        { targetName: "Sir Trevor Plowden", relationshipType: "Colonial Rival", note: "Suspicious of Hyderabad's sudden technological self-reliance." }
      ]
    },
    {
      id: "char-2",
      name: "Mahboob Ali Khan (6th Nizam)",
      role: "Father & Sovereign",
      age: 30,
      description: "A beloved, generous monarch who laid Hyderabad's modern railway and telegraph grid.",
      relationship: "Family",
      wants: "The prosperity and prestige of Hyderabad without succumbing to colonial annexations.",
      fears: "Losing sovereign autonomy to British residency mandates.",
      storyJourney: [
        "Reigns over Hyderabad during rapid Victorian railway expansions.",
        "Notices his young son's uncanny foresight in budget allocations."
      ]
    },
    {
      id: "char-3",
      name: "Server-ul-Mulk",
      role: "Court Tutor & Scholar",
      age: 52,
      description: "A distinguished conservative scholar versed in Persian literature and Islamic jurisprudence.",
      relationship: "Allies",
      wants: "To preserve traditional Deccan scholarship while raising an enlightened ruler.",
      fears: "That Western secular education will erode Hyderabad's spiritual heritage.",
      storyJourney: [
        "Assigns classical Persian poetry only to find Osman calculating fluid dynamics.",
        "Agrees to keep Osman's technical blueprints secret from palace gossip."
      ]
    },
    {
      id: "char-4",
      name: "Sir Trevor Plowden",
      role: "British Resident",
      age: 48,
      description: "An astute colonial administrator watchful of any princely state attempting independent industrialization.",
      relationship: "Rivals",
      wants: "To enforce Hyderabad's reliance on British imports and colonial advisors.",
      fears: "An unmanageable technological and industrial renaissance in the Deccan plateau.",
      storyJourney: [
        "Inquires about sudden machinery shipments arriving via Bombay port.",
        "Visits the palace durbar to test the young prince's political leanings."
      ]
    },
    {
      id: "char-5",
      name: "Farooq",
      role: "Royal Foundry Artisan",
      age: 36,
      description: "Master gunsmith and metal caster who turns Osman's sketches into precision steel reality.",
      relationship: "Allies",
      wants: "To revive the legendary Wootz steel traditions with modern metallurgy.",
      fears: "Accidental explosions in the secret night foundry.",
      storyJourney: [
        "Casts the first standardized bevel gear under Osman's direction.",
        "Helps build scaled water turbine models in the palace gardens."
      ]
    }
  ],
  technologies: [
    {
      id: "tech-1",
      name: "Flood Control & Hydraulic Gates",
      stage: "Prototype",
      description: "Automated reservoir sluice gates and catchment dams along the Musi and Esi river systems.",
      whyNeeded: "To preemptively prevent the catastrophic 1908 Musi flood 15 years before it can happen.",
      whatRequired: "Hydraulic cement, accurate topographic surveyor data, and royal cabinet funding.",
      whatHappened: "Scaled water flow models tested successfully inside the Purani Haveli courtyard fountains.",
      nextStep: "Surveying upstream catchment valleys near the historic Golconda ridge."
    },
    {
      id: "tech-2",
      name: "High-Tensile Bessemer Steel Foundry",
      stage: "Workshop",
      description: "Upgraded charcoal blast furnace utilizing local Telangana hematite iron ore.",
      whyNeeded: "To cast durable train tracks, bridge girders, and agricultural pipes without British import tariffs.",
      whatRequired: "Refractory firebricks, steam blower blowpipes, and pure flux limestone.",
      whatHappened: "First batch of high-grade steel ingots forged and tested against British Sheffield samples.",
      nextStep: "Constructing twin reverberatory furnaces near the Singareni coal fields."
    },
    {
      id: "tech-3",
      name: "Underground Telegraph & Signaling Line",
      stage: "Experiment",
      description: "Insulated telegraph cable linking state grain storehouses to the royal palace.",
      whyNeeded: "Instant emergency communication and price-stabilization during drought threats.",
      whatRequired: "Gutta-percha insulation and pure drawn copper wire.",
      whatHappened: "Sent encoded signals across 3 miles of palace grounds with zero resistance drop.",
      nextStep: "Extending the line to Secunderabad railway junction."
    }
  ],
  historicalFacts: [
    {
      id: "fact-1",
      claim: "Mahboob Ali Khan established modern postal & railway infrastructure in 1880s.",
      status: "Confirmed",
      usedIn: "Chapter 2, Chapter 4",
      details: "Historically verified in Hyderabad State Gazette archives and the Nizam's Guaranteed State Railway records."
    },
    {
      id: "fact-2",
      claim: "The Great Musi River flood caused massive devastation in September 1908.",
      status: "Confirmed",
      usedIn: "Chapter 1, Chapter 5",
      details: "Historical disaster that killed 15,000+ people. In our novel, Osman's lifelong goal is early prevention."
    },
    {
      id: "fact-3",
      claim: "Secret steam workshop opened inside Purani Haveli in 1892.",
      status: "Story-created",
      usedIn: "Chapter 3",
      details: "Fictional alternate development where young Osman experiments with machine tools and lathe designs."
    }
  ],
  timeline: [
    {
      id: "time-1",
      year: "1886",
      title: "Birth of Mir Osman Ali Khan",
      description: "Born at Purani Haveli; modern engineering memories awaken as consciousness forms.",
      type: "Historical Record",
      isDivergence: false
    },
    {
      id: "time-2",
      year: "1889",
      title: "Early Mathematical Prodigy",
      description: "Young Osman recalculates court treasury ledgers, startling his tutors with calculus.",
      type: "Historical Record",
      isDivergence: false
    },
    {
      id: "time-3",
      year: "1892",
      title: "The Secret Foundry Experiment",
      description: "Osman secretly casts standardized steel gears in the royal armory with Farooq.",
      type: "My Story",
      isDivergence: true
    },
    {
      id: "time-4",
      year: "1894",
      title: "First Telegraph Demonstration",
      description: "Osman demonstrates instant signaling between palaces, bypassing British cables.",
      type: "My Story",
      isDivergence: true
    },
    {
      id: "time-5",
      year: "1896",
      title: "The Musi River Survey",
      description: "Osman presents a 20-year civil flood defense plan to the Nizam's cabinet.",
      type: "My Story",
      isDivergence: true
    }
  ],
  chapters: [
    {
      id: "chap-1",
      number: 1,
      act: "Act I",
      actTitle: "The Child Who Remembered",
      title: "The Memory of Iron",
      description: "A ten-year-old prince gazes upon the minarets of Charminar, holding the blueprints of a future century in his mind.",
      status: "Approved",
      wordCount: 1450,
      content: `CHAPTER 1\nTHE MEMORY OF IRON\n\nThe afternoon heat of the Deccan plateau hung heavy over Purani Haveli, scented with jasmine, sandalwood, and the distant, metallic tang of the palace blacksmiths.\n\nTen-year-old Mir Osman Ali Khan stood beside the carved jali balcony, his small hands resting upon marble that had absorbed the sun for two centuries. Below, in the courtyard, courtiers in embroidered sherwanis bowed to passing elders, while royal messengers on horseback clattered across the cobblestones.\n\nTo the world, he was the young Sahebzada—quiet, perhaps a little too solemn for a prince of his age.\n\nTo himself, he was a soul carrying thirty-five years of modern civil engineering, power grid calculations, and hydraulic thermodynamics from a century that had not yet been born.\n\n"Osman," a voice called gently.\n\nHe turned. Server-ul-Mulk, his chief preceptor, approached with a leather-bound volume of Persian verses under his arm. The scholar's silver beard was meticulously trimmed, his spectacles resting upon a patrician nose.\n\n"You have been staring at the outer walls for over an hour," the tutor observed, adjusting his glasses. "The Diwan-e-Hafiz awaits our recitation. The court expects the future Nizam to command the language of diplomacy, not daydreams."\n\nOsman bowed with the effortless grace drilled into him since infancy. "Forgive me, Khwaja Sahib. I was not daydreaming. I was observing the gradient of the south drainage channel."\n\nServer-ul-Mulk frowned, pausing. "The drainage channel?"\n\n"Yes. It drops four inches per fifty yards, which is sufficient during light autumn showers. But when the monsoon cloudburst strikes from the Golconda ridge, the hydraulic friction will cause backwater pooling against the grain store foundations." Osman spoke evenly, the cadence of Urdu poetry wrapping around calculations of fluid dynamics. "If the foundation mortar leaches lime over ten seasons, the eastern storehouse will subside."\n\nSilence settled between them. A sparrow fluttered down to the marble parapet, chirping inquisitively.\n\n[Illustration: Young Osman in royal Deccan silk pointing toward the distant river plains, while his scholarly tutor looks down with startled reverence.]\n\nServer-ul-Mulk stared at the ten-year-old prince. For months now, the boy had displayed an unnerving aptitude for mechanics. While other royal children raced Arab colts or collected ivory chess sets, Osman had requested balance scales, lead ingots, and surveyor's brass compasses.\n\n"You have read the British railway reports," Server-ul-Mulk murmured, half-question, half-accusation.\n\n"I have read what is available," Osman answered softly, though in truth the knowledge came from his previous life—the memory of sitting in an air-conditioned office in Mumbai, reviewing geological hazard maps for the Musi River Basin.\n\nHe knew what was coming.\n\nIn 1908, the Musi River would swell into a monstrous wall of water, washing away tens of thousands of homes, drowning the historic Afzal Gunj district, and leaving Hyderabad in ruin.\n\nUnless he stopped it first.\n\n"Come," Server-ul-Mulk sighed, though there was a new glint of deep respect in his gaze. "Your father, His Highness the Mahboob Ali Khan, will hold court before the Maghrib prayer. He asked to see your penmanship."\n\n"Of course, Khwaja Sahib."\n\nAs they walked down the cool corridor, Osman reached into his tunic pocket. His fingers brushed against a cold, hand-filed steel gear—the first prototype he and Farooq the armorer had cast in secret three nights ago.\n\nThe road to saving an empire would not be paved with words alone. It would be forged in steel, stone, and sheer will.\n\n***`
    },
    {
      id: "chap-2",
      number: 2,
      act: "Act I",
      actTitle: "The Child Who Remembered",
      title: "Palace Tutors and Broken Clocks",
      description: "Server-ul-Mulk tests Osman's Persian poetry, only to find the prince calculating gears and planetary motions.",
      status: "Approved",
      wordCount: 1220,
      content: `CHAPTER 2\nPALACE TUTORS AND BROKEN CLOCKS\n\nThe library of Purani Haveli smelled of old cedar, calfskin bindings, and dried cloves. Dust motes drifted lazily through the shafts of light penetrating the high arched clerestory windows.\n\n"A poem is not a mathematical formula, Osman," Server-ul-Mulk said, tapping a reed pen against the rosewood desk. "When Saadi speaks of the caravan, he speaks of the passing of mortal glory, not the weight capacity of camels."\n\n"Yet if the caravan is overloaded by thirty percent, Khwaja Sahib, the glory passes much sooner than expected," Osman replied without looking up from his paper. His ink strokes were flawless, but in the margins he had doodled an escapement wheel with twenty-four teeth.\n\nOn the side table sat a grand English mantel clock, brass-cased and silent. It had ceased ticking during the monsoon of 1888 when damp air fouled its pendulum pivot.\n\n"May I examine the clock?" Osman asked.\n\nServer-ul-Mulk smiled faintly. "Clockmakers from Madras could not balance that escapement. Do you intend to recite verses to it?"\n\n"No. Just a question of balance." Osman took a small bronze pin from his lapel, approached the grandfather clock, and gently eased the back panel open.\n\nHis child-sized fingers moved with the muscle memory of an engineer who had spent decades disassembling turbines. He felt for the tension spring, adjusted the pallet fork clearance by less than half a millimeter, and freed a microscopic speck of verdigris from the hairspring.\n\nTick.\n\nTock.\n\nThe sound was crisp, rhythmic, and resonant. It echoed through the vaulted library like a miniature heartbeat.\n\nServer-ul-Mulk froze mid-breath. His spectacles slid an inch down his nose.\n\n"How did you know where to touch it?" the scholar whispered.\n\n"Every machine has a rhythm, Khwaja Sahib," Osman smiled serenely. "It only wants to do what physics allows."`
    },
    {
      id: "chap-3",
      number: 3,
      act: "Act I",
      actTitle: "The Child Who Remembered",
      title: "The Secret Workshop",
      description: "Behind the horse stables of Purani Haveli, Osman and artisan Farooq strike the first blow of an industrial revolution.",
      status: "Ready to Write",
      wordCount: 0
    },
    {
      id: "chap-4",
      number: 4,
      act: "Act II",
      actTitle: "The Gilded Shadows",
      title: "Dinner with the British Resident",
      description: "Sir Trevor Plowden visits the Nizam's durbar. Osman must play the naive child while deflecting sharp questions.",
      status: "Not Started",
      wordCount: 0
    },
    {
      id: "chap-5",
      number: 5,
      act: "Act II",
      actTitle: "The Gilded Shadows",
      title: "Surveying the Musi",
      description: "Riding out before dawn to sketch the river bends that will one day swell into a deluge.",
      status: "Not Started",
      wordCount: 0
    },
    {
      id: "chap-6",
      number: 6,
      act: "Act III",
      actTitle: "The Forge of the Deccan",
      title: "The First Ingot",
      description: "The high-tensile steel furnace is ignited under the cover of monsoon thunder.",
      status: "Not Started",
      wordCount: 0
    }
  ],
  questions: [
    {
      id: "q-1",
      title: "Modern Engineering Timeline",
      question: "When should Osman begin actively using his modern engineering knowledge?",
      whyAsking: "This determines how quickly other characters notice his gifts and shapes the pacing of Act I.",
      options: [
        "Immediately from childhood",
        "Gradually during childhood",
        "Only after a major public crisis",
        "Let AI suggest an option"
      ],
      selectedOption: "Gradually during childhood",
      aiSuggestion: {
        recommendedOption: "Gradually during childhood",
        reasoning: "Gradual revelation creates satisfying emotional payoffs as court scholars and craftsmen slowly realize the prince is a once-in-a-century prodigy."
      }
    },
    {
      id: "q-2",
      title: "Historical Fidelity",
      question: "How closely should we follow the historical record of Hyderabad?",
      whyAsking: "Controls how bold alternate inventions can be before clashing with real historical events.",
      options: [
        "Very closely (Accurate records with subtle private drama)",
        "Mostly historical, with major alternate developments",
        "Freely alternate history (Rapid industrial empire)",
        "Let AI recommend"
      ],
      selectedOption: "Mostly historical, with major alternate developments",
      aiSuggestion: {
        recommendedOption: "Mostly historical, with major alternate developments",
        reasoning: "Grounding the story in real Nizam institutions while introducing bold hydraulic projects offers the best balance of authentic flavor and exciting alternate fiction."
      }
    },
    {
      id: "q-3",
      title: "Narrative Voice",
      question: "How should the story usually be told?",
      whyAsking: "Affects the emotional intimacy and perspective of each chapter.",
      options: [
        "Mostly from Osman's perspective",
        "Follow multiple viewpoints (Father, Tutor, British Resident)",
        "Mostly Osman, with occasional dramatic outsider glimpses",
        "Let AI recommend"
      ],
      selectedOption: "Mostly Osman, with occasional dramatic outsider glimpses",
      aiSuggestion: {
        recommendedOption: "Mostly Osman, with occasional dramatic outsider glimpses",
        reasoning: "Having Osman as the main lens keeps the reincarnator's charm front-and-center, while brief cutaways to shocked courtiers heighten the humor and drama."
      }
    },
    {
      id: "q-4",
      title: "Protagonist Relationship with Father",
      question: "What is the core dynamic between young Osman and the 6th Nizam?",
      whyAsking: "Shapes the emotional heart of Chapter 4 and Chapter 5.",
      options: [
        "Devoted son who gently advises his sovereign",
        "Secret tension between royal duty and private ambition",
        "Conspiracy of two: Father secretly trusts the boy's visions",
        "Let AI recommend"
      ],
      selectedOption: "Conspiracy of two: Father secretly trusts the boy's visions",
      isCritical: true,
      affectedChapters: ["Chapter 4", "Chapter 5", "Chapter 6"]
    }
  ],
  illustrations: [
    {
      id: "ill-1",
      chapterNumber: 1,
      title: "Osman on the Purani Haveli Balcony",
      description: "Young Osman gazing out across the minarets of Hyderabad, holding a filed steel gear.",
      imageUrl: "",
      character: "Mir Osman Ali Khan",
      location: "Purani Haveli Balcony",
      mood: "Dramatic",
      isCharacterReference: true
    },
    {
      id: "ill-2",
      chapterNumber: 2,
      title: "The Repair of the English Clock",
      description: "Osman carefully adjusting the clock mechanism with a bronze pin while Server-ul-Mulk watches in astonishment.",
      imageUrl: "",
      character: "Mir Osman Ali Khan & Server-ul-Mulk",
      location: "Cedar Library",
      mood: "Calm",
      isCharacterReference: false
    },
    {
      id: "ill-3",
      chapterNumber: 3,
      title: "The Secret Foundry Sparks",
      description: "Artisan Farooq pouring glowing liquid steel as Osman checks the sand molds.",
      imageUrl: "",
      character: "Osman & Farooq",
      location: "Stable Armory Workshop",
      mood: "Epic",
      isCharacterReference: false
    }
  ],
  continuityAlerts: [
    {
      id: "alert-1",
      title: "Age Reference Check",
      description: "Chapter 1 introduces Osman as 10 years old (1886 + 10 = 1896), but early notes mentioned 1892. Ensure timestamps match.",
      severity: "info",
      chaptersInvolved: ["Chapter 1", "Chapter 2"],
      suggestedFix: "Clarify that 1892 was his early experiments at age 6, and 1896 is his 10th birthday.",
      applied: true
    },
    {
      id: "alert-2",
      title: "Historical Fact Confirmation",
      description: "The Great Musi Flood date is 1908. In Chapter 1, Osman notes he has 12 years to prepare.",
      severity: "warning",
      chaptersInvolved: ["Chapter 1", "Chapter 5"],
      suggestedFix: "Keep countdown explicit so readers feel the ticking clock of history."
    }
  ]
};
