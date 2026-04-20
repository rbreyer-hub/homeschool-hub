/*
 * Reading & Writing curriculum — 36 weeks × 3 grades × 2 subjects × 4 daily lessons.
 *
 * Shape per block: { topic, focus, lessons: [{day, title, task, duration}], challenge, resources }
 */

const LITERACY_RESOURCES = {
  reading: [
    { label: "Reading Rockets", url: "https://www.readingrockets.org/" },
    { label: "Epic! for Kids (free to educators)", url: "https://www.getepic.com/" },
    { label: "Storyline Online (free read-alouds)", url: "https://www.storylineonline.net/" },
    { label: "Starfall", url: "https://www.starfall.com/" }
  ],
  writing: [
    { label: "Time4Writing", url: "https://www.time4writing.com/" },
    { label: "K5 Learning Worksheets", url: "https://www.k5learning.com/" },
    { label: "Scholastic Teachables", url: "https://www.scholastic.com/teachers/teaching-tools/" },
    { label: "Night Zookeeper (writing games)", url: "https://www.nightzookeeper.com/" }
  ]
};

// ============================== TEMPLATES ==============================
// Each template builds a 4-lesson week given a `topic` + any extras.
// Templates are chosen based on topic type so variety stays natural.

const TEMPLATES = {
  // -------- READING TEMPLATES --------
  phonics: (t) => [
    { day: 1, title: `Meet the sound: ${t}`, task: `Read aloud 8–10 words featuring ${t}. Child repeats and highlights the target sound. Make a word chart together.`, duration: "15 min" },
    { day: 2, title: `Build & blend`, task: `Use letter tiles or magnet letters to build 6 words with ${t}. Child reads each aloud after building.`, duration: "15 min" },
    { day: 3, title: `Decodable read`, task: `Read a short decodable book/passage featuring ${t} (Bob Books, Progressive Phonics, Reading A-Z). Child tracks with finger, reads aloud.`, duration: "20 min" },
    { day: 4, title: `Write & fluency`, task: `Child writes 3 sentences using ${t} words. Re-read yesterday's passage twice for fluency.`, duration: "20 min" }
  ],
  sightWord: (t) => [
    { day: 1, title: `Introduce: ${t}`, task: `Show each word on a card. Read, spell, read again. Child traces or writes each word 3 times.`, duration: "15 min" },
    { day: 2, title: `Use in sentences`, task: `Child says a sentence using each new sight word. Parent writes it down; child reads it back.`, duration: "15 min" },
    { day: 3, title: `Scavenger hunt`, task: `Find each new sight word in a book or magazine (parent helps younger readers). Tally finds.`, duration: "15 min" },
    { day: 4, title: `Flash-card game`, task: `Play speed flashcards: 15 seconds to read as many as possible. Track score over weeks.`, duration: "10 min" }
  ],
  comprehension: (t) => [
    { day: 1, title: `Teach ${t}`, task: `Read aloud a short text. Model thinking about ${t}. Use "I notice..." and "I wonder..." sentence stems.`, duration: "20 min" },
    { day: 2, title: `Guided practice: ${t}`, task: `Read a new passage together. Pause to discuss ${t} using post-it notes or a graphic organizer.`, duration: "20 min" },
    { day: 3, title: `Apply solo`, task: `Child reads independently. Records 3 observations about ${t} in their reading notebook.`, duration: "25 min" },
    { day: 4, title: `Share & reflect`, task: `Child teaches ${t} back to parent using their book as evidence. Discuss what was easy/hard.`, duration: "15 min" }
  ],
  genre: (t) => [
    { day: 1, title: `Preview ${t}`, task: `Introduce the genre. Discuss common features. Browse 2–3 examples at library or online.`, duration: "20 min" },
    { day: 2, title: `Read together`, task: `Read aloud a ${t} selection. Child points out genre features as they hear them.`, duration: "25 min" },
    { day: 3, title: `Independent read`, task: `Child reads a ${t} book/selection on their own. Lists 3 genre features noticed.`, duration: "25 min" },
    { day: 4, title: `Compare & discuss`, task: `Compare today's ${t} piece with a different-genre text. Chart 3 similarities & 3 differences.`, duration: "20 min" }
  ],
  fluency: (t) => [
    { day: 1, title: `Cold read`, task: `Child reads a new passage aloud. Time it. Count errors. Save baseline.`, duration: "15 min" },
    { day: 2, title: `Model & echo`, task: `Parent models expressive reading of the passage. Child echo-reads each line.`, duration: "15 min" },
    { day: 3, title: `Partner read`, task: `Parent and child take turns reading sentences. Focus on pace and expression (not just accuracy).`, duration: "15 min" },
    { day: 4, title: `Hot read & record`, task: `Child reads passage one final time, recorded on phone. Compare to Day 1. Celebrate growth.`, duration: "15 min" }
  ],
  independent: (t) => [
    { day: 1, title: `Choose & preview`, task: `Child picks a book around ${t}. Previews cover, title, first page. Sets a reading goal.`, duration: "15 min" },
    { day: 2, title: `Read & note`, task: `Independent reading. Child records one interesting sentence and one question in reading log.`, duration: "25 min" },
    { day: 3, title: `Continue & summarize`, task: `Continue reading. At the end, write a 2–3 sentence summary of what happened.`, duration: "25 min" },
    { day: 4, title: `Wrap & share`, task: `Finish the reading. Child discusses favorite part, main character, and what they learned.`, duration: "20 min" }
  ],

  // -------- WRITING TEMPLATES --------
  letterForm: (t) => [
    { day: 1, title: `Model ${t}`, task: `Demonstrate correct stroke order for ${t}. Child practices in tray of sand or shaving cream first.`, duration: "15 min" },
    { day: 2, title: `Trace & copy`, task: `Use handwriting paper. Trace 5 times each, then copy 5 times. Focus on letter size and spacing.`, duration: "15 min" },
    { day: 3, title: `Write in context`, task: `Child writes 3 words and 1 sentence using ${t}. Circle the best-formed letter.`, duration: "15 min" },
    { day: 4, title: `Review all week`, task: `Go back through the week's letters. Child writes each once more, self-grades neatness 1–5.`, duration: "15 min" }
  ],
  mechanics: (t) => [
    { day: 1, title: `Learn the rule: ${t}`, task: `Teach the rule with 3 clear examples. Child writes each example in their grammar notebook.`, duration: "15 min" },
    { day: 2, title: `Find it`, task: `In a short passage, child circles every instance of ${t}. Discuss why it's used each time.`, duration: "15 min" },
    { day: 3, title: `Fix it`, task: `Provide 5 sentences missing or misusing ${t}. Child corrects each.`, duration: "15 min" },
    { day: 4, title: `Use it`, task: `Child writes 4 original sentences each demonstrating ${t}. Peer or parent reviews.`, duration: "15 min" }
  ],
  writingProcess: (t) => [
    { day: 1, title: `Plan: ${t}`, task: `Brainstorm topic ideas for ${t}. Child picks one. Create a simple planner or story map.`, duration: "20 min" },
    { day: 2, title: `Draft`, task: `Child writes the rough draft without worrying about spelling. Focus on getting ideas down.`, duration: "25 min" },
    { day: 3, title: `Revise`, task: `Re-read together. Add at least 2 details. Remove 1 thing that doesn't fit. Change 1 weak word for a stronger one.`, duration: "20 min" },
    { day: 4, title: `Edit & publish`, task: `Check capital letters, end punctuation, spelling. Child rewrites (or types) a clean final copy. Read it aloud to someone.`, duration: "25 min" }
  ],
  paragraph: (t) => [
    { day: 1, title: `Study a model`, task: `Read a strong paragraph on ${t}. Identify topic sentence, detail sentences, conclusion. Highlight each.`, duration: "15 min" },
    { day: 2, title: `Plan your own`, task: `Child writes a topic sentence about ${t} and lists 3 supporting details.`, duration: "15 min" },
    { day: 3, title: `Draft`, task: `Turn the plan into a full paragraph with topic + details + conclusion sentence.`, duration: "20 min" },
    { day: 4, title: `Revise & share`, task: `Revise for clarity. Check all 3 parts are present. Read aloud and discuss.`, duration: "20 min" }
  ],
  journal: (t) => [
    { day: 1, title: `Prompt: ${t}`, task: `Discuss the prompt. Child jots notes or draws a quick picture before writing.`, duration: "10 min" },
    { day: 2, title: `Write`, task: `Child writes a journal entry about ${t}. Goal: at least ${t.length > 30 ? '5 sentences' : '3 sentences'}.`, duration: "15 min" },
    { day: 3, title: `Add detail`, task: `Re-read yesterday's entry. Add 2 sensory details (saw, heard, felt, smelled, tasted).`, duration: "15 min" },
    { day: 4, title: `Share & reflect`, task: `Child reads the entry aloud. Discuss what they liked best and what they'd change.`, duration: "10 min" }
  ],
  research: (t) => [
    { day: 1, title: `Question & pick`, task: `Pick a question about ${t}. Write it at the top of a research page.`, duration: "15 min" },
    { day: 2, title: `Find facts`, task: `Use 2 sources (library book + trusted website) to collect 5 facts. Write each in own words.`, duration: "25 min" },
    { day: 3, title: `Organize & draft`, task: `Group facts into 2–3 categories. Write a short informational draft using those groups.`, duration: "25 min" },
    { day: 4, title: `Polish & present`, task: `Edit for clarity and facts. Add a title. Present findings to family in 1 minute.`, duration: "20 min" }
  ],
  creative: (t) => [
    { day: 1, title: `Imagine: ${t}`, task: `Brainstorm characters and setting for ${t}. Sketch the main character.`, duration: "20 min" },
    { day: 2, title: `Draft a scene`, task: `Write the opening scene of the story. Focus on what the reader needs to know first.`, duration: "25 min" },
    { day: 3, title: `Add dialogue`, task: `Add at least 3 lines of dialogue. Review quotation marks together.`, duration: "20 min" },
    { day: 4, title: `Finish & share`, task: `Write the ending. Read aloud to family. Ask for one piece of positive feedback.`, duration: "25 min" }
  ]
};

// ============================== PROGRESSIONS ==============================
// [topic, focus, templateName]

const G1_READING = [
  ["all 26 letter sounds", "Solidify alphabet sounds a–z before formal phonics", "phonics"],
  ["short a (-at, -an, -ap)", "Read and spell CVC words with short-a", "phonics"],
  ["short i (-it, -ig, -in)", "Read and spell CVC words with short-i", "phonics"],
  ["short o (-op, -ot, -og)", "Read and spell CVC words with short-o", "phonics"],
  ["short e (-en, -et, -ed)", "Read and spell CVC words with short-e", "phonics"],
  ["short u (-ug, -un, -ut)", "Read and spell CVC words with short-u", "phonics"],
  ["CVC blending all vowels", "Fluent blending of consonant-vowel-consonant words", "phonics"],
  ["L-blends (bl, cl, fl, gl, pl, sl)", "Decode words with L-blends at start", "phonics"],
  ["S-blends (sc, sk, sn, sp, st, sw)", "Decode words with S-blends at start", "phonics"],
  ["R-blends (br, cr, dr, fr, gr, pr, tr)", "Decode words with R-blends at start", "phonics"],
  ["digraphs sh, ch", "Two letters, one sound: sh as in ship, ch as in chin", "phonics"],
  ["digraphs th, wh", "Voiced/unvoiced th; wh-question words", "phonics"],
  ["silent-e: a-e (cake, tape)", "Magic-e makes vowel long", "phonics"],
  ["silent-e: i-e (bike, ride)", "Long-i pattern with silent-e", "phonics"],
  ["silent-e: o-e, u-e", "Long-o/u patterns with silent-e", "phonics"],
  ["vowel team ai, ay", "Long-a spelled ai (middle) or ay (end)", "phonics"],
  ["vowel team ee, ea", "Long-e: ee (see) and ea (beach)", "phonics"],
  ["vowel team oa, ow", "Long-o: oa (boat) and ow (snow)", "phonics"],
  ["sight words set 1 (the, and, a, to, is)", "Master top-5 sight words instantly", "sightWord"],
  ["r-controlled ar (car, star)", "R changes the a sound", "phonics"],
  ["r-controlled or (corn, fork)", "R changes the o sound", "phonics"],
  ["r-controlled er/ir/ur", "Three spellings, one sound (her, bird, fur)", "phonics"],
  ["sight words set 2 (of, was, said, you, all)", "Next common sight words", "sightWord"],
  ["diphthong ou, ow (cloud, cow)", "Mouth-drop sound", "phonics"],
  ["diphthong oi, oy (coin, boy)", "Lip-pucker sound", "phonics"],
  ["oo sounds (moon, book)", "Two sounds for oo", "phonics"],
  ["fluency practice A", "Re-read decodables from early weeks for speed/accuracy", "fluency"],
  ["compound words", "Two words make one (sunlight, backpack)", "phonics"],
  ["contractions (isn't, don't, can't)", "Apostrophe = missing letters", "phonics"],
  ["short picture books", "Read for enjoyment and main idea", "comprehension"],
  ["retelling a story", "Tell beginning, middle, end in order", "comprehension"],
  ["character feelings", "Notice how characters feel and why", "comprehension"],
  ["fluency practice B", "Time a familiar passage; track progress", "fluency"],
  ["asking questions while reading", "Who? What? Where? Why?", "comprehension"],
  ["favorite book deep read", "Pick a loved book; reread and discuss", "independent"],
  ["year-end celebration & showcase", "Read aloud to family; share favorites", "independent"]
];

const G1_WRITING = [
  ["letters a–g", "Proper letter formation, lowercase first", "letterForm"],
  ["letters h–n", "Letter formation with correct stroke order", "letterForm"],
  ["letters o–u", "Continue handwriting mastery", "letterForm"],
  ["letters v–z and capitals", "Finish alphabet; intro capital letters", "letterForm"],
  ["writing my name & family names", "Proper noun capitalization", "letterForm"],
  ["labeling pictures (word level)", "Match written words to drawings", "journal"],
  ["simple sentences (I am ___)", "Complete thought, capital + period", "mechanics"],
  ["capital letters at start", "First letter of sentences is always capital", "mechanics"],
  ["ending punctuation: period", "Statements end with periods", "mechanics"],
  ["ending punctuation: question mark", "Questions end with ?", "mechanics"],
  ["ending punctuation: exclamation", "Strong feeling ends with !", "mechanics"],
  ["My family sentences", "Describe each family member in 1 sentence", "journal"],
  ["My day journal", "Write 2 things I did today", "journal"],
  ["describing words — colors", "Use color words to add detail", "mechanics"],
  ["describing words — sizes & shapes", "Use size/shape words to add detail", "mechanics"],
  ["'I like' sentences", "Opinions with reasons (because)", "journal"],
  ["'I can' statements", "Describe abilities using 'I can ___'", "journal"],
  ["action verbs (run, jump, eat)", "Pick strong verbs that show action", "mechanics"],
  ["nouns — people, places, things", "Identify and use nouns in sentences", "mechanics"],
  ["writing from a picture prompt", "3-sentence response to an image", "writingProcess"],
  ["short narrative: beginning/middle/end", "Tell a tiny true story in 3 parts", "writingProcess"],
  ["diagram labels", "Label parts of a plant, animal, or object", "journal"],
  ["sequence words (first, next, then, last)", "Use order words when telling what happened", "mechanics"],
  ["making a list", "Shopping list, to-do list, or pack list", "journal"],
  ["sensory words (saw, heard, felt)", "Add 2 sensory details to any writing", "mechanics"],
  ["all about my pet (or favorite animal)", "Informational mini-paragraph", "writingProcess"],
  ["how-to: 2-step instructions", "Teach a simple task in 2 steps", "writingProcess"],
  ["how-to: 3–4 step instructions", "Add detail and sequence", "writingProcess"],
  ["thank-you note", "Greeting, body, closing", "writingProcess"],
  ["daily journal habit", "Start a sustained journal routine", "journal"],
  ["dialogue with 'said'", "Character speaks; use quotation marks (intro)", "creative"],
  ["simple poem (rhyming couplet)", "Two lines that rhyme", "creative"],
  ["acrostic poem", "Spell a word with lines", "creative"],
  ["informational mini-book", "3 pages on a topic of choice", "writingProcess"],
  ["publishing: best piece of the year", "Pick favorite; neat copy with cover", "writingProcess"],
  ["read-aloud celebration", "Read a piece of own writing to family", "journal"]
];

const G3_READING = [
  ["reading baseline & goal setting", "Set weekly pages/minutes target", "independent"],
  ["decoding multisyllabic words", "Break long words into syllables", "phonics"],
  ["main idea", "What is the whole text about?", "comprehension"],
  ["supporting details", "Find evidence that backs the main idea", "comprehension"],
  ["sequencing events", "Order what happened in a narrative", "comprehension"],
  ["character traits", "How the character IS (kind, brave, clever)", "comprehension"],
  ["character motivation", "Why the character acts as they do", "comprehension"],
  ["setting — time and place", "Where and when a story unfolds", "comprehension"],
  ["plot structure (problem → solution)", "Story arc: setup, trouble, resolve", "comprehension"],
  ["point of view (1st vs 3rd person)", "Who is telling the story?", "comprehension"],
  ["asking questions while reading", "Stop and wonder aloud", "comprehension"],
  ["making predictions", "Use clues to guess what's next", "comprehension"],
  ["making inferences", "Read between the lines with text evidence", "comprehension"],
  ["context clues for new words", "Use surrounding sentence to guess meaning", "comprehension"],
  ["synonyms & antonyms", "Words that mean same / opposite", "comprehension"],
  ["prefixes (un-, re-, pre-, dis-)", "Small word parts change meaning", "phonics"],
  ["suffixes (-ful, -less, -ly)", "Endings that shift meaning or part of speech", "phonics"],
  ["fiction vs nonfiction", "Imagined stories vs true information", "genre"],
  ["biography", "True story of a real person's life", "genre"],
  ["poetry — rhythm & rhyme", "Hear and feel the pattern", "genre"],
  ["fables & morals", "Short tales with lessons", "genre"],
  ["folktales & myths", "Cultural stories passed down", "genre"],
  ["text features (headings, captions)", "Nonfiction tools to navigate info", "comprehension"],
  ["main idea in nonfiction", "Find the big point of an article", "comprehension"],
  ["comparing two texts", "Same topic, different treatment", "comprehension"],
  ["summarizing", "Retell briefly in own words", "comprehension"],
  ["author's purpose (PIE: persuade/inform/entertain)", "Why was this written?", "comprehension"],
  ["theme", "The life lesson of a story", "comprehension"],
  ["cause and effect", "Event A leads to event B", "comprehension"],
  ["fact vs opinion", "Provable statements vs personal beliefs", "comprehension"],
  ["reading informational articles", "Engage with nonfiction kid magazines", "independent"],
  ["drama / plays", "Characters speaking on a stage", "genre"],
  ["author study", "Read multiple works by one author", "independent"],
  ["independent reading project — book of choice", "Sustained chapter book reading", "independent"],
  ["book sharing", "Mini book talk to family", "independent"],
  ["year-end reading showcase", "Celebrate growth; set summer reading goals", "independent"]
];

const G3_WRITING = [
  ["writing baseline & journal launch", "Establish a routine notebook", "journal"],
  ["complete vs fragment sentences", "Every sentence needs subject + verb", "mechanics"],
  ["4 sentence types (statement, question, exclaim, command)", "Vary sentence types", "mechanics"],
  ["paragraph structure overview", "Topic + details + conclusion", "paragraph"],
  ["topic sentences", "The 'big idea' of the paragraph", "paragraph"],
  ["supporting details", "Facts and examples that prove the topic", "paragraph"],
  ["concluding sentences", "Wrap up the paragraph", "paragraph"],
  ["narrative writing intro", "Small-moment personal story", "writingProcess"],
  ["personal narrative — draft", "Write a true story from your own life", "writingProcess"],
  ["narrative — revising", "Add details, cut boring parts", "writingProcess"],
  ["narrative — editing & publishing", "Fix mistakes; produce final copy", "writingProcess"],
  ["descriptive writing", "Paint a picture with words", "writingProcess"],
  ["sensory details (5 senses)", "Use sight, sound, smell, touch, taste", "mechanics"],
  ["informational writing intro", "Teach a reader something", "writingProcess"],
  ["research basics — using 2 sources", "Gather facts from books and web", "research"],
  ["note-taking", "Jot key facts in own words", "research"],
  ["informational — drafting", "Turn notes into paragraphs", "writingProcess"],
  ["informational — revising & publishing", "Polish and share the report", "writingProcess"],
  ["opinion writing intro", "State a clear opinion", "writingProcess"],
  ["reasons and evidence", "Back up opinions with 3 reasons", "writingProcess"],
  ["opinion — drafting", "Write a full opinion paragraph/essay", "writingProcess"],
  ["opinion — revising & publishing", "Strengthen reasons; polish final", "writingProcess"],
  ["friendly letter format", "Greeting, body, closing", "writingProcess"],
  ["envelope addressing", "Proper address format", "mechanics"],
  ["email etiquette (with parent)", "Clear subject, polite body", "mechanics"],
  ["poetry — acrostic & haiku", "Structured short poems", "creative"],
  ["figurative language — simile", "Compare with 'like' or 'as'", "mechanics"],
  ["figurative language — metaphor", "Compare without 'like'", "mechanics"],
  ["dialogue punctuation", "Commas and quotation marks", "mechanics"],
  ["book reports", "Summary + favorite part + rating", "writingProcess"],
  ["compare/contrast essays", "Venn diagram → paragraph", "writingProcess"],
  ["how-to guides", "Step-by-step instructions", "writingProcess"],
  ["adjectives & adverbs", "Words that describe nouns / verbs", "mechanics"],
  ["creative short story", "Full narrative with characters & plot", "creative"],
  ["portfolio review", "Pick best pieces; reflect on growth", "journal"],
  ["year-end writing celebration", "Share a polished piece aloud", "writingProcess"]
];

const G5_READING = [
  ["reading survey & yearly goals", "Set pages/minutes and genre variety targets", "independent"],
  ["close reading techniques", "Read slowly, annotate, ask questions", "comprehension"],
  ["annotating text", "Underline, circle, note in margins", "comprehension"],
  ["main idea vs theme", "What it's ABOUT vs the bigger lesson", "comprehension"],
  ["character development arcs", "How characters change across a story", "comprehension"],
  ["complex plot structures", "Exposition → rising → climax → falling → resolution", "comprehension"],
  ["subplots", "Secondary storylines that support the main plot", "comprehension"],
  ["point of view (omniscient, limited, 1st)", "Distinguish narrator types and effects", "comprehension"],
  ["author's craft — word choice & voice", "Why a word or sentence was chosen", "comprehension"],
  ["figurative language (simile, metaphor, personification, hyperbole)", "Identify and analyze effect", "comprehension"],
  ["symbolism", "When an object stands for an idea", "comprehension"],
  ["mood and tone", "How a text feels vs author's attitude", "comprehension"],
  ["inference with text evidence", "Claim + evidence + reasoning", "comprehension"],
  ["theme analysis", "State the theme in a sentence; prove with evidence", "comprehension"],
  ["comparing characters across texts", "How two characters differ in similar situations", "comprehension"],
  ["historical fiction", "Fiction anchored in a real era", "genre"],
  ["science fiction", "Imagined future or 'what if' with science", "genre"],
  ["mystery", "Clues, red herrings, resolution", "genre"],
  ["poetry analysis", "Meter, rhyme, imagery, meaning", "genre"],
  ["epic poetry (kid-friendly)", "Long narrative poems (Odyssey for kids)", "genre"],
  ["allegory", "Story where everything represents something else", "genre"],
  ["drama — Shakespeare for kids", "Scene + soliloquy + characters", "genre"],
  ["nonfiction: memoir", "A real person's true stories, in their voice", "genre"],
  ["nonfiction: informational articles", "Current-events or science magazines", "genre"],
  ["text structure (compare, cause/effect, sequence, problem/solution)", "Identify how nonfiction is organized", "comprehension"],
  ["evaluating sources", "Who wrote it? When? Why trust it?", "comprehension"],
  ["fact vs interpretation", "What's proven vs what the writer thinks", "comprehension"],
  ["author's argument", "What is the author trying to convince you of?", "comprehension"],
  ["multiple perspectives on one event", "Read 2 accounts; compare framing", "comprehension"],
  ["book-to-movie comparison", "What the film keeps, cuts, and changes", "independent"],
  ["research article reading", "Real primary-source articles (adapted)", "independent"],
  ["critical response writing", "Write a short response defending a claim", "comprehension"],
  ["book club discussion", "Parent + child or sibling book club", "independent"],
  ["independent reading project (novel)", "Full chapter book with response log", "independent"],
  ["presenting analysis", "Share theme/character analysis aloud", "independent"],
  ["year-end reading portfolio & summer list", "Review year's books; pick summer stack", "independent"]
];

const G5_WRITING = [
  ["writing baseline & portfolio launch", "Set aside a folder for all pieces", "journal"],
  ["paragraph mastery review", "Topic + 3 details + conclusion", "paragraph"],
  ["multi-paragraph structure", "Three or more connected paragraphs", "paragraph"],
  ["intro-body-conclusion essay", "5-paragraph basic essay", "writingProcess"],
  ["thesis statements", "One sentence that names your argument", "mechanics"],
  ["narrative writing — small-moment", "Zoom in on a single memorable moment", "writingProcess"],
  ["narrative: show don't tell", "Use action and detail instead of summary", "mechanics"],
  ["narrative: dialogue punctuation", "Proper quotation marks, commas, tags", "mechanics"],
  ["narrative: publishing", "Full polished personal narrative", "writingProcess"],
  ["informational: picking a worthy topic", "Something you care about with enough research", "writingProcess"],
  ["research skills — multiple sources", "Find 3+ trustworthy sources", "research"],
  ["note-taking & paraphrasing", "Own words, not copy-paste", "research"],
  ["citation basics", "List where facts came from", "research"],
  ["informational: drafting", "Multi-paragraph report", "writingProcess"],
  ["informational: revising", "Improve organization and detail", "writingProcess"],
  ["informational: publishing", "Final copy with citations", "writingProcess"],
  ["opinion/persuasive intro", "Claim + why it matters", "writingProcess"],
  ["counterclaims", "Acknowledge and respond to opposing view", "writingProcess"],
  ["evidence types (fact, example, expert)", "Strongest evidence wins", "mechanics"],
  ["opinion essay — drafting", "Intro → 3 reasons → conclusion", "writingProcess"],
  ["opinion — revising", "Strengthen argument and word choice", "writingProcess"],
  ["opinion — publishing", "Polished persuasive essay", "writingProcess"],
  ["compare/contrast essays", "Find meaningful similarities and differences", "writingProcess"],
  ["cause/effect essays", "Trace chains of consequences", "writingProcess"],
  ["poetry — various forms", "Haiku, sonnet intro, free verse", "creative"],
  ["creative fiction — short story", "Characters, plot, setting, theme", "creative"],
  ["plot arc in fiction", "Exposition → rising → climax → resolution", "creative"],
  ["character development in fiction", "Character wants, flaws, growth", "creative"],
  ["grammar: complex sentences", "Dependent + independent clauses", "mechanics"],
  ["grammar: punctuation deep dive", "Comma rules, semicolon, dash", "mechanics"],
  ["editing skills", "Proofread for grammar, clarity, flow", "mechanics"],
  ["peer review", "Give and receive constructive feedback", "writingProcess"],
  ["research report — capstone", "Multi-week research project", "research"],
  ["final essay project", "Topic of choice; full writing process", "writingProcess"],
  ["presentations", "Read work aloud; field questions", "writingProcess"],
  ["portfolio reflection", "Pick best pieces; reflect on growth; preview 6th grade", "journal"]
];

// ============================== BUILDER ==============================

function makeBlock(subject, entry) {
  const [topic, focus, templateName] = entry;
  const template = TEMPLATES[templateName] || TEMPLATES.comprehension;
  const lessons = template(topic);
  const label = subject === "reading" ? "Reading" : "Writing";
  return {
    topic: `${label}: ${topic}`,
    focus: focus,
    lessons: lessons,
    challenge: subject === "reading"
      ? `Read for 15 extra minutes today — any book of your choice. Share one favorite sentence.`
      : `Write a single perfect sentence about today. Read it aloud. Why do you love it?`,
    resources: LITERACY_RESOURCES[subject]
  };
}

const LITERACY = [];
for (let w = 0; w < 36; w++) {
  LITERACY.push({
    grades: {
      "1": {
        reading: makeBlock("reading", G1_READING[w]),
        writing: makeBlock("writing", G1_WRITING[w])
      },
      "3": {
        reading: makeBlock("reading", G3_READING[w]),
        writing: makeBlock("writing", G3_WRITING[w])
      },
      "5": {
        reading: makeBlock("reading", G5_READING[w]),
        writing: makeBlock("writing", G5_WRITING[w])
      }
    }
  });
}
