/*
 * Interactive activity widgets. Each Activity renders into #activityContainer.
 * Every widget is self-contained (no external libraries).
 */

const Activities = {};

// ---------- Utility ----------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[rand(0, arr.length - 1)];
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function simplify(num, den) { const d = gcd(num, den) || 1; return [num / d, den / d]; }

function newScoreState() { return { correct: 0, attempts: 0, streak: 0 }; }

function renderScore(state) {
  return `<div class="score-bar"><span>Correct: ${state.correct}/${state.attempts}</span><span>Streak: ${state.streak}</span></div>`;
}

function setFeedback(el, text, type) {
  el.innerHTML = text;
  el.className = 'feedback ' + (type || 'info');
}

// ---------- Matching/ordering data ----------
const MATCH_SETS = {
  senses: [["Sight", "Eyes"], ["Hearing", "Ears"], ["Smell", "Nose"], ["Taste", "Tongue"], ["Touch", "Skin"]],
  scientificMethod: [["Question", "What do I want to know?"], ["Hypothesis", "Educated guess"], ["Experiment", "Test the guess"], ["Observation", "What happened"], ["Conclusion", "What it means"]],
  variables: [["Independent", "What you change"], ["Dependent", "What you measure"], ["Control", "What stays the same"], ["Constants", "Same for every trial"]],
  forces: [["Gravity", "Pulls things down"], ["Friction", "Slows moving objects"], ["Push", "Away from you"], ["Pull", "Toward you"], ["Magnetism", "Attracts iron"]],
  plantParts: [["Roots", "Drink water"], ["Stem", "Holds plant up"], ["Leaves", "Make food"], ["Flower", "Makes seeds"], ["Seed", "Grows into new plant"]],
  simpleMachines: [["Lever", "Seesaw"], ["Pulley", "Flag pole"], ["Wheel & Axle", "Car wheel"], ["Inclined Plane", "Ramp"], ["Wedge", "Knife"], ["Screw", "Jar lid"]],
  circuits: [["Battery", "Power source"], ["Wire", "Conducts current"], ["Bulb", "Gives light"], ["Switch", "Opens/closes circuit"]],
  magnets: [["North pole", "Seeks north"], ["Attract", "Pull together"], ["Repel", "Push apart"], ["Iron", "Magnetic metal"]],
  phaseChanges: [["Melting", "Solid → Liquid"], ["Freezing", "Liquid → Solid"], ["Evaporation", "Liquid → Gas"], ["Condensation", "Gas → Liquid"]],
  newtonsLaws: [["1st Law", "Objects stay at rest/motion"], ["2nd Law", "F = ma"], ["3rd Law", "Action = Reaction"]],
  energyForms: [["Kinetic", "Motion"], ["Potential", "Stored height"], ["Thermal", "Heat"], ["Chemical", "In food/fuel"], ["Electrical", "Charges"], ["Light", "Photons"], ["Sound", "Vibrations"]],
  ecosystem: [["Producer", "Plant"], ["Herbivore", "Rabbit"], ["Carnivore", "Fox"], ["Omnivore", "Human"], ["Decomposer", "Mushroom"]],
  photosynthesis: [["Sunlight", "Energy source"], ["Water", "From roots"], ["CO2", "From air"], ["Oxygen", "Released"], ["Sugar", "Plant food"]],
  adaptations: [["Camouflage", "Blend in"], ["Hibernation", "Sleep in winter"], ["Migration", "Fly south"], ["Thick fur", "Warmth"], ["Webbed feet", "Swim better"]],
  bodySystems: [["Heart", "Pumps blood"], ["Lungs", "Gas exchange"], ["Brain", "Commands"], ["Stomach", "Digestion"], ["Kidneys", "Filter waste"]],
  habitats: [["Polar bear", "Arctic"], ["Camel", "Desert"], ["Shark", "Ocean"], ["Monkey", "Rainforest"], ["Cow", "Grassland"]],
  rocks: [["Igneous", "From lava"], ["Sedimentary", "Layered"], ["Metamorphic", "Changed by heat/pressure"]],
  earthLayers: [["Crust", "Outermost"], ["Mantle", "Thickest"], ["Outer core", "Liquid metal"], ["Inner core", "Solid iron"]],
  kingdoms: [["Animals", "Multicellular, move"], ["Plants", "Make food from sun"], ["Fungi", "Decomposers"], ["Protists", "Mostly single-cell"], ["Bacteria", "Tiny & ancient"]],
  cells: [["Nucleus", "Brain of cell"], ["Membrane", "Outer skin"], ["Cytoplasm", "Fluid inside"], ["Mitochondria", "Powerhouse"], ["Chloroplast", "Plant only — photosynthesis"]],
  atoms: [["Proton", "Positive, in nucleus"], ["Neutron", "Neutral, in nucleus"], ["Electron", "Negative, orbits"], ["Nucleus", "Center of atom"]],
  oceanFeatures: [["Current", "Flow of water"], ["Tide", "Moon-caused rise/fall"], ["Wave", "Wind-caused ripple"], ["Trench", "Deepest part"]],
  biomes: [["Tundra", "Cold & treeless"], ["Rainforest", "Wet & lush"], ["Desert", "Dry & hot"], ["Grassland", "Open & windy"]],
  environment: [["Recycle", "Reuse materials"], ["Pollution", "Harmful stuff"], ["Conservation", "Save resources"], ["Renewable", "Never runs out"]],
  earthProcesses: [["Weathering", "Rock breaks down"], ["Erosion", "Moves broken rock"], ["Deposition", "Drops it elsewhere"]],
  earthSpheres: [["Geosphere", "Rocks & land"], ["Hydrosphere", "Water"], ["Atmosphere", "Air"], ["Biosphere", "Life"]],
  climates: [["Tropical", "Warm year-round"], ["Temperate", "Four seasons"], ["Polar", "Very cold"]],
  weatherTools: [["Thermometer", "Temperature"], ["Barometer", "Air pressure"], ["Anemometer", "Wind speed"], ["Rain gauge", "Rainfall"]],
  foodGroups: [["Fruits", "Apples, berries"], ["Vegetables", "Carrots, broccoli"], ["Grains", "Bread, rice"], ["Protein", "Meat, beans"], ["Dairy", "Milk, cheese"]],
  instruments: [["Microscope", "Tiny things"], ["Telescope", "Far things"], ["Thermometer", "Temperature"], ["Scale", "Mass"]],
  energyBasic: [["Heat", "Warmth"], ["Light", "Brightness"], ["Sound", "Noise"], ["Electrical", "Plugs in wall"]],
  energySources: [["Solar", "Renewable"], ["Wind", "Renewable"], ["Coal", "Non-renewable"], ["Oil", "Non-renewable"], ["Hydro", "Renewable"]],
  resources: [["Tree", "Renewable"], ["Fish", "Renewable"], ["Oil", "Non-renewable"], ["Gold", "Non-renewable"]],
  earthMaterials: [["Rock", "Solid & hard"], ["Soil", "Plants grow in it"], ["Water", "Liquid we drink"], ["Sand", "Tiny rock bits"]]
};

const ORDER_SETS = {
  butterfly: ["Egg", "Caterpillar", "Chrysalis", "Butterfly"],
  frogLife: ["Egg", "Tadpole", "Tadpole w/ legs", "Froglet", "Adult frog"],
  foodChain: ["Sun", "Grass", "Rabbit", "Fox"],
  waterCycle: ["Evaporation", "Condensation", "Precipitation", "Collection"],
  digestion: ["Mouth", "Esophagus", "Stomach", "Small Intestine", "Large Intestine"],
  moonPhases: ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"],
  designProcess: ["Ask", "Imagine", "Plan", "Create", "Test", "Improve"],
  planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  atmosphere: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere", "Exosphere"]
};

const MC_BANKS = {
  livingNonliving: [
    { q: "Which is LIVING?", a: ["Rock", "Tree", "Toy car", "Lamp"], c: 1 },
    { q: "Which is NON-LIVING?", a: ["Dog", "Flower", "Spoon", "Baby"], c: 2 },
    { q: "What do all living things need?", a: ["TV", "Wi-Fi", "Water", "Gold"], c: 2 },
    { q: "Can plants grow?", a: ["Yes", "No", "Only in winter", "Only at night"], c: 0 }
  ],
  animals: [
    { q: "A mammal has…", a: ["Feathers", "Fur/hair", "Scales", "Shell"], c: 1 },
    { q: "A bird can usually…", a: ["Breathe underwater", "Fly", "Hibernate", "Photosynthesize"], c: 1 },
    { q: "A frog is a(n)…", a: ["Insect", "Mammal", "Amphibian", "Reptile"], c: 2 },
    { q: "A snake is cold-blooded. This means…", a: ["It's always cold", "Its temp matches surroundings", "It doesn't have blood", "It can't move"], c: 1 }
  ],
  weather: [
    { q: "What tool measures temperature?", a: ["Ruler", "Thermometer", "Scale", "Clock"], c: 1 },
    { q: "Clouds are made of…", a: ["Smoke", "Tiny water droplets", "Dust", "Cotton"], c: 1 },
    { q: "What causes wind?", a: ["Trees moving", "Moving air", "Earth spinning fast", "Rain falling"], c: 1 },
    { q: "Which is a form of precipitation?", a: ["Sunshine", "Snow", "Cloud", "Wind"], c: 1 }
  ],
  seasons: [
    { q: "Which season is coldest?", a: ["Spring", "Summer", "Fall", "Winter"], c: 3 },
    { q: "Trees lose leaves in…", a: ["Spring", "Summer", "Fall", "Winter"], c: 2 },
    { q: "Why do seasons happen?", a: ["Earth's tilt", "Sun moves", "Moon phases", "Random"], c: 0 }
  ],
  dayNight: [
    { q: "Day and night happen because…", a: ["Sun turns off", "Earth rotates", "Clouds block sun", "Moon blocks sun"], c: 1 },
    { q: "Earth rotates once every…", a: ["Hour", "Day", "Week", "Year"], c: 1 },
    { q: "Shadows are shortest at…", a: ["Sunrise", "Noon", "Sunset", "Midnight"], c: 1 }
  ],
  statesOfMatter: [
    { q: "Water is a…", a: ["Solid", "Liquid", "Gas", "Plasma"], c: 1 },
    { q: "Ice is a…", a: ["Solid", "Liquid", "Gas", "Mix"], c: 0 },
    { q: "Steam is a…", a: ["Solid", "Liquid", "Gas", "Plasma"], c: 2 },
    { q: "Which keeps its shape?", a: ["Solid", "Liquid", "Gas", "None"], c: 0 }
  ],
  space1: [
    { q: "The Sun is a…", a: ["Planet", "Star", "Moon", "Comet"], c: 1 },
    { q: "How many planets in our solar system?", a: ["7", "8", "9", "10"], c: 1 },
    { q: "The Moon goes around…", a: ["The Sun", "Earth", "Mars", "Jupiter"], c: 1 }
  ],
  measurement1: [
    { q: "12 inches = ", a: ["1 foot", "1 yard", "1 mile", "1 meter"], c: 0 },
    { q: "Which is heaviest?", a: ["Feather", "Pencil", "Brick", "Paper"], c: 2 },
    { q: "A ruler measures…", a: ["Weight", "Length", "Time", "Heat"], c: 1 }
  ],
  motion: [
    { q: "What makes a rolling ball stop?", a: ["Gravity only", "Friction", "Magic", "Wind only"], c: 1 },
    { q: "A larger force usually means…", a: ["Slower motion", "Faster motion", "No motion", "Random motion"], c: 1 },
    { q: "Which has most gravity?", a: ["Earth", "Moon", "Pebble", "Balloon"], c: 0 }
  ],
  matterProperties: [
    { q: "Density is…", a: ["Mass per volume", "Color", "Weight only", "Size only"], c: 0 },
    { q: "Volume measures…", a: ["How heavy", "How much space", "Color", "Hardness"], c: 1 },
    { q: "Mass is measured with…", a: ["Ruler", "Balance", "Clock", "Magnet"], c: 1 }
  ],
  changes: [
    { q: "Melting ice is…", a: ["Physical", "Chemical", "Both", "Neither"], c: 0 },
    { q: "Burning paper is…", a: ["Physical", "Chemical", "Neither", "Magical"], c: 1 },
    { q: "Cutting paper is…", a: ["Physical", "Chemical", "Magical", "Neither"], c: 0 },
    { q: "A sign of chemical change is…", a: ["New color", "Cutting", "Melting", "Squishing"], c: 0 }
  ],
  wordProblems1: [
    { q: "Sam has 5 apples. He gets 3 more. How many now?", a: ["7", "8", "9", "10"], c: 1 },
    { q: "There are 10 birds. 4 fly away. How many left?", a: ["4", "5", "6", "14"], c: 2 },
    { q: "Lia has 6 candies. Twin gets same. Total?", a: ["10", "12", "8", "13"], c: 1 }
  ],
  wordProblems3: [
    { q: "5 kids each have 4 cookies. Total?", a: ["9", "16", "20", "25"], c: 2 },
    { q: "24 ÷ 3 = ?", a: ["6", "7", "8", "9"], c: 2 },
    { q: "You have $20, spend $7. How much left?", a: ["$13", "$14", "$11", "$27"], c: 0 }
  ],
  sound: [
    { q: "Sound is…", a: ["Light", "Vibrations", "Heat", "Smell"], c: 1 },
    { q: "Higher pitch means…", a: ["Louder", "Faster vibrations", "Quieter", "Slower"], c: 1 }
  ],
  light: [
    { q: "Shadows form when…", a: ["Light bends", "Light is blocked", "It's night", "Sun is gone"], c: 1 },
    { q: "Light travels in…", a: ["Curves", "Zigzags", "Straight lines", "Circles"], c: 2 }
  ],
  lightVision: [
    { q: "We see because…", a: ["Eyes send rays", "Light bounces to our eyes", "Brain imagines", "Magic"], c: 1 },
    { q: "A mirror…", a: ["Absorbs light", "Reflects light", "Makes light", "Blocks light"], c: 1 }
  ],
  foodWebs: [
    { q: "A food web shows…", a: ["Who eats whom", "Recipes", "Store layout", "Weather"], c: 0 },
    { q: "Energy in food webs starts with…", a: ["Water", "Sun", "Soil", "Air"], c: 1 },
    { q: "What % of energy passes up each level?", a: ["90%", "50%", "10%", "1%"], c: 2 }
  ],
  waterCycleAdv: [
    { q: "Transpiration is water released from…", a: ["Oceans", "Plants", "Animals", "Rocks"], c: 1 },
    { q: "Runoff moves water to…", a: ["Sky", "Oceans", "Space", "Underground only"], c: 1 },
    { q: "Most of Earth's water is in…", a: ["Lakes", "Rivers", "Oceans", "Ice"], c: 2 }
  ],
  pushPull: [
    { q: "Opening a door is a…", a: ["Push", "Pull", "Either", "Neither"], c: 2 },
    { q: "Pushing a swing — it moves…", a: ["Away", "Toward you", "Up only", "Not at all"], c: 0 }
  ],
  sounds: [
    { q: "An echo is…", a: ["New sound", "Sound that bounces", "Magic", "Broken sound"], c: 1 }
  ],
  plantNeeds: [
    { q: "Plants need…", a: ["Darkness", "Sunlight", "Salt", "Oil"], c: 1 },
    { q: "Roots take up…", a: ["Air", "Water", "Heat", "Sound"], c: 1 }
  ],
  ocean: [
    { q: "The deepest zone is…", a: ["Sunlight", "Twilight", "Midnight", "Cloud"], c: 2 },
    { q: "A shark is a…", a: ["Mammal", "Fish", "Reptile", "Bird"], c: 1 }
  ],
  dinosaurs: [
    { q: "T-Rex was a…", a: ["Plant eater", "Meat eater", "Fish eater", "Bug eater"], c: 1 },
    { q: "Dinosaurs went extinct about…", a: ["1000 yrs ago", "1 million yrs", "65 million yrs", "Yesterday"], c: 2 }
  ],
  insectsSpiders: [
    { q: "Insects have how many legs?", a: ["4", "6", "8", "10"], c: 1 },
    { q: "Spiders are…", a: ["Insects", "Arachnids", "Reptiles", "Crustaceans"], c: 1 }
  ],
  weatherTools: [
    { q: "Wind speed is measured by…", a: ["Ruler", "Anemometer", "Thermometer", "Clock"], c: 1 },
    { q: "A rain gauge measures…", a: ["Temperature", "Rain", "Wind", "Pressure"], c: 1 }
  ],
  foodGroups: [
    { q: "Protein is in…", a: ["Bread", "Meat", "Lettuce", "Ice cream"], c: 1 },
    { q: "Dairy is in…", a: ["Chicken", "Milk", "Apples", "Rice"], c: 1 }
  ],
  weightCapacity: [
    { q: "Which holds MORE liquid?", a: ["Spoon", "Cup", "Bucket", "Thimble"], c: 2 },
    { q: "Which is HEAVIER?", a: ["Feather", "Marble", "Book", "Paper"], c: 2 }
  ],
  air: [
    { q: "Air is…", a: ["Nothing", "Matter", "Magic", "Liquid"], c: 1 },
    { q: "Wind is…", a: ["Hot air only", "Moving air", "Cold air only", "Steam"], c: 1 }
  ],
  nature: [
    { q: "A tree is a…", a: ["Plant", "Animal", "Mineral", "Gas"], c: 0 },
    { q: "Pollination helps plants…", a: ["Die", "Make seeds", "Get wet", "Sing"], c: 1 }
  ],
  birds: [
    { q: "Hummingbirds like…", a: ["Nectar", "Seeds only", "Meat", "Leaves"], c: 0 },
    { q: "Cardinals are…", a: ["Bright red", "All blue", "Green", "Purple"], c: 0 }
  ],
  inquiry1: [
    { q: "A good science question is…", a: ["Answered yes/no only", "Can be tested", "About feelings", "Too big to study"], c: 1 }
  ],
  jobs: [
    { q: "Engineers…", a: ["Sing only", "Design & build", "Cook", "Drive trains only"], c: 1 },
    { q: "Scientists do what?", a: ["Study the world", "Nothing", "Draw only", "Sleep"], c: 0 }
  ],
  tallies: [
    { q: "||||  ||| means how many?", a: ["6", "7", "8", "9"], c: 2 },
    { q: "A full tally group has…", a: ["3", "4", "5", "10"], c: 2 }
  ],
  review1: [
    { q: "Humans are made of…", a: ["Robots", "Cells", "Metal", "Nothing"], c: 1 },
    { q: "A magnet pulls on…", a: ["Glass", "Iron", "Water", "Wood"], c: 1 },
    { q: "Ice floats because…", a: ["Magic", "It's lighter than water", "It's invisible", "It's hot"], c: 1 }
  ],
  review3: [
    { q: "A circuit needs…", a: ["Just a battery", "Complete loop", "Just a wire", "Open ends"], c: 1 },
    { q: "Butterflies come from…", a: ["Eggs", "Nothing", "Rocks", "Fire"], c: 0 },
    { q: "Water's 3 states are…", a: ["Ice, water, steam", "Up, down, sideways", "Hot, cold, warm", "Red, blue, green"], c: 0 }
  ],
  review5: [
    { q: "Photosynthesis input is…", a: ["Meat", "Sunlight", "Smoke", "Rocks"], c: 1 },
    { q: "Force = ?", a: ["Mass × acceleration", "Mass + weight", "Weight only", "Nothing"], c: 0 },
    { q: "DNA carries…", a: ["Energy only", "Genetic code", "Water", "Air"], c: 1 }
  ],
  metric: [
    { q: "1 kilometer = ", a: ["10 m", "100 m", "1000 m", "10000 m"], c: 2 },
    { q: "A gram measures…", a: ["Length", "Time", "Mass", "Volume"], c: 2 },
    { q: "1 liter = ?", a: ["1 cup", "1000 mL", "100 mL", "1 mL"], c: 1 }
  ],
  ratios: [
    { q: "Ratio 2:3 means…", a: ["2 for every 3", "2 minus 3", "2 times 3", "2 divided by 3"], c: 0 },
    { q: "Unit rate of $12/3 books = ", a: ["$4/book", "$36", "$3", "$9"], c: 0 }
  ],
  heredity: [
    { q: "Genes come from…", a: ["Food", "Parents", "Air", "Water"], c: 1 },
    { q: "DNA is shaped like a…", a: ["Ladder/double helix", "Circle", "Square", "Triangle"], c: 0 }
  ],
  stars: [
    { q: "Our galaxy is the…", a: ["Andromeda", "Milky Way", "Magellanic", "Sombrero"], c: 1 },
    { q: "Light-year is…", a: ["Time", "Distance", "Speed", "Mass"], c: 1 }
  ],
  probability: [
    { q: "Chance of heads on a fair coin?", a: ["1/2", "1/3", "1/4", "0"], c: 0 },
    { q: "Roll a die — chance of 3?", a: ["1/6", "1/3", "1/2", "1/4"], c: 0 }
  ],
  negatives: [
    { q: "-3 vs 2, which is larger?", a: ["-3", "2", "Equal", "Can't compare"], c: 1 },
    { q: "-10 vs -2, which is larger?", a: ["-10", "-2", "Same", "Neither"], c: 1 }
  ],
  patterns3: [
    { q: "2, 4, 6, 8, __?", a: ["9", "10", "12", "11"], c: 1 },
    { q: "5, 10, 15, __?", a: ["17", "20", "25", "30"], c: 1 }
  ],
  patterns5: [
    { q: "3, 6, 12, 24, __?", a: ["30", "36", "48", "42"], c: 2 },
    { q: "1, 4, 9, 16, __?", a: ["20", "25", "24", "30"], c: 1 }
  ],
  polygons: [
    { q: "A hexagon has how many sides?", a: ["5", "6", "7", "8"], c: 1 },
    { q: "A parallelogram has…", a: ["No parallel sides", "1 pair parallel sides", "2 pairs parallel sides", "3 pairs"], c: 2 },
    { q: "A square is also a…", a: ["Triangle", "Rectangle", "Pentagon", "Circle"], c: 1 }
  ],
  mixtures: [
    { q: "Salt water is a…", a: ["Element", "Compound", "Solution", "Atom"], c: 2 },
    { q: "Can you separate sand and iron?", a: ["No", "Yes, with a magnet", "Yes, by melting", "No way"], c: 1 }
  ],
  fossils: [
    { q: "Fossils tell us about…", a: ["The future", "Past life", "Stars", "Today's weather"], c: 1 }
  ],
  climateChange: [
    { q: "Extra CO2 causes…", a: ["Cooler Earth", "Warmer Earth", "No change", "Blue skies"], c: 1 }
  ],
  soundAdv: [
    { q: "Sound does NOT travel through…", a: ["Air", "Water", "Metal", "Vacuum"], c: 3 },
    { q: "Pitch depends on…", a: ["Loudness", "Frequency", "Color", "Age"], c: 1 }
  ],
  biomes: [
    { q: "Tundra is…", a: ["Hot & wet", "Cold & treeless", "Dry desert", "Warm forest"], c: 1 },
    { q: "Rainforests have…", a: ["Few plants", "Many plants", "Snow", "Sand"], c: 1 }
  ],
  conservation: [
    { q: "Recycling helps by…", a: ["Making trash", "Reducing waste", "Using more stuff", "Nothing"], c: 1 }
  ],
  humanImpact: [
    { q: "Pollution can hurt…", a: ["Nobody", "Animals only", "All living things", "Rocks only"], c: 2 }
  ],
  scienceFair: [
    { q: "A science fair needs a…", a: ["Question, hypothesis, test, result", "Just a poster", "Just data", "Just a guess"], c: 0 }
  ],
  showcase3: [
    { q: "When presenting, you should…", a: ["Mumble", "Speak clearly", "Read silently", "Hide your work"], c: 1 }
  ],
  projectPlan1: [
    { q: "Before starting an experiment…", a: ["Guess randomly", "Plan it out", "Skip it", "Copy someone"], c: 1 }
  ],
  wordProblemsMix1: [
    { q: "Anna had 12 stickers. Gave 5 away. How many left?", a: ["5", "7", "17", "8"], c: 1 },
    { q: "3 groups of 4 cookies = ?", a: ["7", "12", "9", "8"], c: 1 }
  ],
  strategy3: [
    { q: "To solve 48 ÷ 4 mentally…", a: ["Double it", "Halve twice", "Add 4", "Multiply by 4"], c: 1 }
  ],
  realWorld5: [
    { q: "Shirt is $24, tax 8%. Tax = ?", a: ["$1.92", "$3", "$4.80", "$0.80"], c: 0 },
    { q: "Trip is 250 mi at 50 mph. Hours?", a: ["3", "4", "5", "6"], c: 2 }
  ],
  genetics: [
    { q: "Traits come from…", a: ["Food only", "Genes from parents", "Nothing", "TV"], c: 1 }
  ],
  research5: [
    { q: "Good sources are…", a: ["Random blogs", "Verified & cited", "Opinion pieces", "Social posts"], c: 1 }
  ],
  capstone5: [
    { q: "Best scientists ask…", a: ["No questions", "Lots of questions", "Silly ones only", "None"], c: 1 }
  ],
  mathProperties: [
    { q: "Commutative: 3×4 = ?", a: ["3+4", "4×3", "12-4", "4+3"], c: 1 },
    { q: "Distributive: 3×(2+5) = ?", a: ["3×2 + 3×5", "3×2×5", "3+2+5", "25"], c: 0 }
  ],
  experiments: [
    { q: "In a good experiment, you change…", a: ["Nothing", "One thing", "Everything", "Random things"], c: 1 }
  ],
  graphs3: [
    { q: "A bar graph's tallest bar means…", a: ["Smallest amount", "Largest amount", "Middle", "Average"], c: 1 }
  ],
  multistep3: [
    { q: "You have $30, buy 3 toys at $7 each. Left?", a: ["$9", "$11", "$21", "$30"], c: 0 }
  ],
  dataGraphs: [
    { q: "In a pictograph, one picture might equal…", a: ["Just itself", "A unit you pick", "Always 10", "Always 100"], c: 1 }
  ],
  workBackward: [
    { q: "After doubling and adding 3, I got 11. Start?", a: ["3", "4", "5", "6"], c: 1 }
  ],
  fractionWords: [
    { q: "1/4 of 20 = ?", a: ["4", "5", "10", "25"], c: 1 }
  ],
  barGraphs1: [
    { q: "Bar graph shows 6 apples, 3 bananas. Total fruit?", a: ["3", "6", "9", "12"], c: 2 }
  ],
  seasonal: [
    { q: "Bears in winter…", a: ["Swim", "Hibernate", "Migrate", "Play"], c: 1 }
  ],
  probExperiment: [
    { q: "Theoretical probability of heads in 100 flips?", a: ["25", "50", "75", "100"], c: 1 }
  ],
  engineering: [
    { q: "Engineers test and then…", a: ["Give up", "Improve", "Delete it", "Ignore results"], c: 1 }
  ],
  plantProject: [
    { q: "To compare plants, change ONE variable like…", a: ["Everything", "Nothing", "Only water", "Random"], c: 2 }
  ],
  magnets: [
    { q: "Which sticks to a magnet?", a: ["Wood", "Paper", "Iron nail", "Plastic"], c: 2 },
    { q: "Same poles…", a: ["Attract", "Repel", "Nothing", "Bond"], c: 1 }
  ],
  vertebrates: [
    { q: "Fish, reptiles, birds, mammals all are…", a: ["Invertebrates", "Vertebrates", "Insects", "Plants"], c: 1 }
  ],
  water: [
    { q: "Humans are about __ water.", a: ["10%", "25%", "60%", "90%"], c: 2 },
    { q: "Fresh water comes mostly from…", a: ["Oceans", "Sky (rain)", "Underground", "Lakes & rivers (via cycle)"], c: 3 }
  ],
  erosion: [
    { q: "Wind & water wearing down rock is…", a: ["Erosion", "Volcano", "Magic", "Photosynthesis"], c: 0 }
  ],
  logic1: [
    { q: "I'm 5 more than 7. I am…", a: ["11", "12", "2", "10"], c: 1 }
  ]
};

// ============================== Generic Builders ==============================

function buildMultipleChoice(config) {
  const bank = MC_BANKS[config.set];
  if (!bank) return `<p>No questions for "${config.set}" yet.</p>`;
  let state = newScoreState();
  let remaining = shuffle(bank.slice());
  let current;
  const container = document.createElement('div');
  container.className = 'activity-widget';
  container.innerHTML = `
    <h3>Multiple Choice Quiz</h3>
    <p class="instruction">Tap the best answer. Aim for a streak of 5!</p>
    <div class="score"></div>
    <div class="question"></div>
    <div class="options"></div>
    <div class="feedback"></div>
  `;
  function nextQuestion() {
    if (remaining.length === 0) remaining = shuffle(bank.slice());
    current = remaining.pop();
    container.querySelector('.question').innerHTML = `<div class="problem-display">${escapeHtml(current.q)}</div>`;
    const optsEl = container.querySelector('.options');
    optsEl.innerHTML = '';
    current.a.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = text;
      btn.onclick = () => handleAnswer(btn, i);
      optsEl.appendChild(btn);
    });
    container.querySelector('.feedback').innerHTML = '';
    container.querySelector('.score').innerHTML = renderScore(state);
  }
  function handleAnswer(btn, idx) {
    state.attempts++;
    if (idx === current.c) {
      state.correct++;
      state.streak++;
      btn.classList.add('correct');
      setFeedback(container.querySelector('.feedback'), '&#10003; Correct! Next question coming...', 'correct');
    } else {
      state.streak = 0;
      btn.classList.add('wrong');
      const correctBtn = container.querySelectorAll('.option-btn')[current.c];
      if (correctBtn) correctBtn.classList.add('correct');
      setFeedback(container.querySelector('.feedback'), `The answer is: <strong>${escapeHtml(current.a[current.c])}</strong>`, 'wrong');
    }
    container.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    setTimeout(nextQuestion, 1400);
  }
  nextQuestion();
  return container;
}

function buildArithmetic(config) {
  let state = newScoreState();
  const container = document.createElement('div');
  container.className = 'activity-widget';
  container.innerHTML = `
    <h3>Math Drill</h3>
    <p class="instruction">Type the answer and press Enter.</p>
    <div class="score"></div>
    <div class="problem-display"></div>
    <div style="text-align:center;">
      <input type="number" class="answer-input" autocomplete="off" />
      <button class="btn-primary" style="margin-left:0.5rem;">Check</button>
    </div>
    <div class="feedback"></div>
  `;
  let currentAnswer;
  function generate() {
    let a, b, op, answer;
    let useOp = config.op;
    if (useOp === 'mixed') {
      useOp = pick(['+', '-', '*', '/']);
    }
    const min = config.min || 0;
    const max = config.max || 20;
    if (useOp === '+') {
      if (config.stepOf) {
        a = rand(1, max / config.stepOf) * config.stepOf;
        b = rand(1, max / config.stepOf) * config.stepOf;
      } else {
        a = rand(min, max);
        b = rand(min, max);
        if (config.sumMin && a + b < config.sumMin) b = Math.max(b, config.sumMin - a);
        if (config.sumMax && a + b > config.sumMax) { a = rand(min, Math.floor(config.sumMax/2)); b = rand(min, config.sumMax - a); }
        if (config.noRegroup) { a = rand(Math.floor(min/10), Math.floor(max/10)) * 10 + rand(0, 4); b = rand(Math.floor(min/10), Math.floor(max/10)) * 10 + rand(0, 4); }
        if (config.needsRegroup) { a = rand(10, max); b = rand(10, max); if ((a%10) + (b%10) < 10) b += 10 - ((a%10)+(b%10)); }
      }
      answer = a + b;
    } else if (useOp === '-') {
      a = rand(min, max);
      b = rand(min, max);
      if (config.ensurePositive && b > a) [a, b] = [b, a];
      if (config.noRegroup) { a = rand(Math.floor(min/10)+1, Math.floor(max/10)) * 10 + rand(4, 9); b = rand(1, Math.floor(a/10)-1) * 10 + rand(0, (a%10)); }
      if (config.needsRegroup) { a = rand(20, max); b = rand(10, a-1); if ((a%10) >= (b%10)) a = Math.floor(a/10)*10 + rand(0, (b%10)-1 > 0 ? (b%10)-1 : 0); }
      answer = a - b;
    } else if (useOp === '*') {
      a = rand(config.min || 2, config.max || 12);
      const oMin = config.otherMin || config.min || 2;
      const oMax = config.otherMax || config.max || 12;
      b = rand(oMin, oMax);
      answer = a * b;
    } else if (useOp === '/') {
      b = rand(config.min || 2, config.max || 12);
      const q = rand(2, 12);
      a = b * q;
      if (config.dividendMin) a = Math.max(a, config.dividendMin);
      if (config.dividendMax) a = Math.min(a, config.dividendMax);
      if (config.withRemainders && Math.random() < 0.4) {
        a += rand(1, b-1);
      }
      answer = config.withRemainders ? Math.floor(a/b) : a / b;
    }
    currentAnswer = answer;
    const opSym = useOp === '*' ? '×' : useOp === '/' ? '÷' : useOp;
    container.querySelector('.problem-display').textContent = `${a} ${opSym} ${b} = ?`;
    container.querySelector('.score').innerHTML = renderScore(state);
    container.querySelector('.feedback').innerHTML = '';
    const input = container.querySelector('.answer-input');
    input.value = '';
    input.focus();
  }
  function check() {
    const input = container.querySelector('.answer-input');
    const userVal = parseFloat(input.value);
    if (isNaN(userVal)) return;
    state.attempts++;
    if (Math.abs(userVal - currentAnswer) < 0.01) {
      state.correct++;
      state.streak++;
      setFeedback(container.querySelector('.feedback'), '&#10003; Correct!', 'correct');
    } else {
      state.streak = 0;
      setFeedback(container.querySelector('.feedback'), `Not quite. The answer is <strong>${currentAnswer}</strong>`, 'wrong');
    }
    setTimeout(generate, 1200);
  }
  container.querySelector('.btn-primary').onclick = check;
  container.querySelector('.answer-input').addEventListener('keypress', e => { if (e.key === 'Enter') check(); });
  generate();
  return container;
}

function buildMatch(config) {
  const set = MATCH_SETS[config.set];
  if (!set) return errBox('No match set: ' + config.set);
  const container = document.createElement('div');
  container.className = 'activity-widget';
  container.innerHTML = `
    <h3>Matching Game</h3>
    <p class="instruction">Click a term, then its match.</p>
    <div class="match-game">
      <div class="match-col left"></div>
      <div class="match-col right"></div>
    </div>
    <div class="feedback"></div>
  `;
  const left = shuffle(set.map(p => p[0]));
  const right = shuffle(set.map(p => p[1]));
  const lookup = Object.fromEntries(set);
  let selected = null;
  let matchesLeft = set.length;

  const leftCol = container.querySelector('.left');
  const rightCol = container.querySelector('.right');
  left.forEach(term => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.dataset.term = term;
    el.dataset.side = 'left';
    el.textContent = term;
    el.onclick = () => handleClick(el);
    leftCol.appendChild(el);
  });
  right.forEach(def => {
    const el = document.createElement('div');
    el.className = 'match-item';
    el.dataset.def = def;
    el.dataset.side = 'right';
    el.textContent = def;
    el.onclick = () => handleClick(el);
    rightCol.appendChild(el);
  });

  function handleClick(el) {
    if (el.classList.contains('matched')) return;
    if (!selected) {
      selected = el;
      el.classList.add('selected');
      return;
    }
    if (selected === el) {
      el.classList.remove('selected');
      selected = null;
      return;
    }
    if (selected.dataset.side === el.dataset.side) {
      selected.classList.remove('selected');
      selected = el;
      el.classList.add('selected');
      return;
    }
    const termEl = selected.dataset.side === 'left' ? selected : el;
    const defEl = selected.dataset.side === 'right' ? selected : el;
    if (lookup[termEl.dataset.term] === defEl.dataset.def) {
      termEl.classList.add('matched');
      defEl.classList.add('matched');
      termEl.classList.remove('selected');
      defEl.classList.remove('selected');
      matchesLeft--;
      setFeedback(container.querySelector('.feedback'), '&#10003; Matched! (' + matchesLeft + ' to go)', 'correct');
      if (matchesLeft === 0) setFeedback(container.querySelector('.feedback'), '&#127881; All matched! Great job!', 'correct');
    } else {
      termEl.classList.add('wrong');
      defEl.classList.add('wrong');
      setFeedback(container.querySelector('.feedback'), 'Not quite — try another pairing.', 'wrong');
      setTimeout(() => {
        termEl.classList.remove('wrong', 'selected');
        defEl.classList.remove('wrong', 'selected');
      }, 700);
    }
    selected = null;
  }
  return container;
}

function buildOrder(config) {
  const items = ORDER_SETS[config.set];
  if (!items) return errBox('No order set: ' + config.set);
  const container = document.createElement('div');
  container.className = 'activity-widget';
  container.innerHTML = `
    <h3>Put in Order</h3>
    <p class="instruction">Click items in the correct order.</p>
    <div class="order-zone" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;"></div>
    <div class="section-heading">Your answer</div>
    <div class="answer-zone" style="display:flex;flex-wrap:wrap;gap:0.5rem;min-height:3rem;padding:0.5rem;background:#f4f6fb;border-radius:10px;"></div>
    <div style="text-align:center;margin-top:1rem;">
      <button class="btn-primary" id="checkOrderBtn">Check</button>
      <button class="secondary" id="resetOrderBtn" style="margin-left:0.5rem;">Reset</button>
    </div>
    <div class="feedback"></div>
  `;
  const zone = container.querySelector('.order-zone');
  const answer = container.querySelector('.answer-zone');
  const scrambled = shuffle(items.slice());
  function render() {
    zone.innerHTML = '';
    scrambled.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'match-item';
      btn.textContent = item;
      btn.onclick = () => { answer.appendChild(btn); btn.onclick = () => { zone.appendChild(btn); btn.onclick = () => answer.appendChild(btn); }; };
      zone.appendChild(btn);
    });
  }
  render();
  container.querySelector('#checkOrderBtn').onclick = () => {
    const user = Array.from(answer.children).map(c => c.textContent);
    const correct = items.every((v, i) => user[i] === v);
    if (correct) setFeedback(container.querySelector('.feedback'), '&#127881; Perfect order!', 'correct');
    else setFeedback(container.querySelector('.feedback'), 'Not quite — try rearranging.', 'wrong');
  };
  container.querySelector('#resetOrderBtn').onclick = () => { answer.innerHTML = ''; render(); container.querySelector('.feedback').innerHTML = ''; };
  return container;
}

function errBox(msg) {
  const d = document.createElement('div');
  d.className = 'activity-widget';
  d.innerHTML = `<h3>Activity</h3><p>${escapeHtml(msg)}</p><p>Coming soon — use the resource links in the meantime!</p>`;
  return d;
}

// ============================== Specialized Widgets ==============================

function genericInputWidget(title, instruction, generateFn) {
  let state = newScoreState();
  const container = document.createElement('div');
  container.className = 'activity-widget';
  container.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p class="instruction">${escapeHtml(instruction)}</p>
    <div class="score"></div>
    <div class="problem-display"></div>
    <div style="text-align:center;">
      <input type="text" class="answer-input" autocomplete="off" />
      <button class="btn-primary" style="margin-left:0.5rem;">Check</button>
    </div>
    <div class="feedback"></div>
  `;
  let current;
  function next() {
    current = generateFn();
    container.querySelector('.problem-display').innerHTML = current.display;
    container.querySelector('.score').innerHTML = renderScore(state);
    container.querySelector('.feedback').innerHTML = '';
    const input = container.querySelector('.answer-input');
    input.value = '';
    input.focus();
  }
  function check() {
    const input = container.querySelector('.answer-input');
    const val = input.value.trim();
    if (val === '') return;
    state.attempts++;
    if (current.check(val)) {
      state.correct++;
      state.streak++;
      setFeedback(container.querySelector('.feedback'), '&#10003; Correct!', 'correct');
    } else {
      state.streak = 0;
      setFeedback(container.querySelector('.feedback'), `Not quite. Answer: <strong>${escapeHtml(current.answer)}</strong>`, 'wrong');
    }
    setTimeout(next, 1300);
  }
  container.querySelector('.btn-primary').onclick = check;
  container.querySelector('.answer-input').addEventListener('keypress', e => { if (e.key === 'Enter') check(); });
  next();
  return container;
}

Activities.counting = () => genericInputWidget('Counting', 'Type the next number.', () => {
  const n = rand(0, 19);
  return { display: `${n}, ?`, answer: String(n+1), check: v => parseInt(v) === n+1 };
});

Activities.beforeAfter = () => genericInputWidget('Before & After', 'What comes BEFORE the number?', () => {
  const n = rand(1, 20);
  return { display: `? , ${n}`, answer: String(n-1), check: v => parseInt(v) === n-1 };
});

Activities.skipCounting = (cfg) => genericInputWidget(`Skip Count by ${cfg.step}`, 'What comes next?', () => {
  const step = cfg.step || 2;
  const max = cfg.max || 20;
  const start = rand(0, Math.max(1, max/step - 3)) * step;
  const disp = `${start}, ${start+step}, ${start+step*2}, ?`;
  const ans = start + step * 3;
  return { display: disp, answer: String(ans), check: v => parseInt(v) === ans };
});

Activities.numberLine = (cfg) => genericInputWidget('Number Line Jump', 'Start + jumps = ?', () => {
  const start = rand(0, cfg.max-5);
  const jumps = rand(1, 5);
  return { display: `Start at ${start}, jump forward ${jumps}. Where are you?`, answer: String(start+jumps), check: v => parseInt(v) === start+jumps };
});

Activities.makeTen = () => genericInputWidget('Make 10', 'How many more to make 10?', () => {
  const n = rand(1, 9);
  return { display: `${n} + ? = 10`, answer: String(10-n), check: v => parseInt(v) === 10-n };
});

Activities.placeValue = (cfg) => genericInputWidget('Place Value', 'Type the digit in the named place.', () => {
  const digits = cfg.digits || 3;
  const n = rand(Math.pow(10, digits-1), Math.pow(10, digits)-1);
  const places = ['ones','tens','hundreds','thousands','ten thousands','hundred thousands','millions'];
  const pos = rand(0, digits-1);
  const digit = Math.floor(n / Math.pow(10, pos)) % 10;
  return { display: `${n}<br><span style="font-size:1rem;color:#5a6378;">What digit is in the ${places[pos]} place?</span>`, answer: String(digit), check: v => parseInt(v) === digit };
});

Activities.decimalPlace = () => genericInputWidget('Decimal Place Value', 'Type the digit in the named decimal place.', () => {
  const whole = rand(1, 99);
  const decimals = [rand(0,9), rand(0,9), rand(0,9)];
  const n = `${whole}.${decimals.join('')}`;
  const places = ['tenths','hundredths','thousandths'];
  const pos = rand(0, 2);
  return { display: `${n}<br><span style="font-size:1rem;color:#5a6378;">What digit is in the ${places[pos]} place?</span>`, answer: String(decimals[pos]), check: v => parseInt(v) === decimals[pos] };
});

Activities.compare = (cfg) => genericInputWidget('Compare Numbers', 'Type <, >, or =', () => {
  const max = cfg.max || 100;
  const a = rand(0, max);
  const b = rand(0, max);
  const ans = a < b ? '<' : a > b ? '>' : '=';
  return { display: `${a} __ ${b}`, answer: ans, check: v => v.trim() === ans };
});

Activities.multiplicationTable = (cfg) => genericInputWidget('Times Tables', 'Answer the multiplication.', () => {
  const tables = cfg.tables || [2,3,4,5];
  const a = pick(tables);
  const b = rand(1, 12);
  return { display: `${a} × ${b} = ?`, answer: String(a*b), check: v => parseInt(v) === a*b };
});

Activities.powersOfTen = () => genericInputWidget('Powers of 10', 'Multiply or divide by 10, 100, 1000.', () => {
  const n = rand(1, 99) * (Math.random() < 0.5 ? 1 : 0.1);
  const power = pick([10, 100, 1000]);
  const op = pick(['×', '÷']);
  const ans = op === '×' ? n * power : n / power;
  return { display: `${n} ${op} ${power} = ?`, answer: String(ans), check: v => Math.abs(parseFloat(v) - ans) < 0.001 };
});

Activities.fractionIdentify = () => genericInputWidget('Identify Fraction', 'Type the fraction (like 3/4).', () => {
  const d = rand(2, 8);
  const n = rand(1, d-1);
  const boxes = Array(d).fill('&#9633;').map((b, i) => i < n ? '&#9632;' : b).join(' ');
  return { display: `${boxes}<br><span style="font-size:1rem;color:#5a6378;">What fraction is shaded?</span>`, answer: `${n}/${d}`, check: v => {
    const m = v.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return false;
    const [vn, vd] = [parseInt(m[1]), parseInt(m[2])];
    return vn * d === n * vd;
  }};
});

Activities.equivalentFractions = () => genericInputWidget('Equivalent Fraction', 'Find an equivalent fraction.', () => {
  const d = rand(2, 6);
  const n = rand(1, d-1);
  const mult = rand(2, 5);
  return { display: `${n}/${d} = ?/${d*mult}`, answer: String(n*mult), check: v => parseInt(v) === n*mult };
});

Activities.fractionCompare = () => genericInputWidget('Compare Fractions', 'Type <, >, or =', () => {
  const d1 = rand(2, 8), d2 = rand(2, 8);
  const n1 = rand(1, d1-1), n2 = rand(1, d2-1);
  const v1 = n1/d1, v2 = n2/d2;
  const ans = v1 < v2 ? '<' : v1 > v2 ? '>' : '=';
  return { display: `${n1}/${d1} __ ${n2}/${d2}`, answer: ans, check: v => v.trim() === ans };
});

Activities.fractionNumberLine = () => genericInputWidget('Fraction Number Line', 'Between which 2 whole numbers?', () => {
  const n = rand(3, 15);
  const d = rand(2, 5);
  const lower = Math.floor(n/d);
  return { display: `Where is ${n}/${d} on a number line?<br><span style="font-size:1rem;color:#5a6378;">Type 'between X and Y'</span>`, answer: `between ${lower} and ${lower+1}`, check: v => v.toLowerCase().includes(`${lower}`) && v.toLowerCase().includes(`${lower+1}`) };
});

Activities.fractionShape = () => genericInputWidget('Fraction of Shape', 'Type the fraction (e.g., 1/4).', () => {
  const d = pick([2,4]);
  const n = 1;
  return { display: `What fraction is one equal piece of ${d} pieces?`, answer: `${n}/${d}`, check: v => {
    const m = v.match(/(\d+)\s*\/\s*(\d+)/);
    return m && parseInt(m[1]) === n && parseInt(m[2]) === d;
  }};
});

Activities.fractionAddSub = (cfg) => genericInputWidget('Fraction Add/Subtract', 'Type answer as num/den.', () => {
  let d1, d2;
  if (cfg.sameDenominator) { d1 = d2 = rand(3, 10); } else { d1 = rand(2, 6); d2 = rand(2, 6); while (d2 === d1) d2 = rand(2, 6); }
  const n1 = rand(1, d1-1), n2 = rand(1, d2-1);
  const op = Math.random() < 0.5 ? '+' : '-';
  const common = d1 === d2 ? d1 : d1*d2;
  const cn1 = n1 * (common/d1), cn2 = n2 * (common/d2);
  let resN = op === '+' ? cn1+cn2 : cn1-cn2;
  if (resN < 0) { resN = cn2-cn1; }
  const [sn, sd] = simplify(resN, common);
  return { display: `${n1}/${d1} ${op} ${n2}/${d2} = ?`, answer: `${sn}/${sd}`, check: v => {
    const m = v.match(/(-?\d+)\s*\/\s*(\d+)/);
    if (!m) { if (sd === 1 && parseInt(v) === sn) return true; return false; }
    return parseInt(m[1]) * sd === sn * parseInt(m[2]);
  }};
});

Activities.fractionMultiply = () => genericInputWidget('Fraction Multiply', 'Type answer as num/den.', () => {
  const n1 = rand(1, 5), d1 = rand(2, 8);
  const n2 = rand(1, 5), d2 = rand(2, 8);
  const [sn, sd] = simplify(n1*n2, d1*d2);
  return { display: `${n1}/${d1} × ${n2}/${d2} = ?`, answer: `${sn}/${sd}`, check: v => {
    const m = v.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return sd === 1 && parseInt(v) === sn;
    return parseInt(m[1]) * sd === sn * parseInt(m[2]);
  }};
});

Activities.fractionDivide = () => genericInputWidget('Fraction Divide', 'Type answer as num/den or whole.', () => {
  const whole = rand(1, 8);
  const d = rand(2, 5);
  const ans = whole * d;
  return { display: `${whole} ÷ 1/${d} = ?`, answer: String(ans), check: v => parseInt(v) === ans };
});

Activities.decimalArithmetic = (cfg) => genericInputWidget('Decimal Practice', 'Type the answer.', () => {
  const a = (rand(10, 999) / 10).toFixed(1);
  const b = (rand(10, 999) / 10).toFixed(1);
  const op = cfg.op === '*' ? '*' : pick(['+', '-']);
  let ans;
  if (op === '+') ans = (parseFloat(a) + parseFloat(b)).toFixed(1);
  else if (op === '-') ans = Math.abs(parseFloat(a) - parseFloat(b)).toFixed(1);
  else ans = (parseFloat(a) * parseFloat(b)).toFixed(2);
  const sym = op === '*' ? '×' : op;
  return { display: `${a} ${sym} ${op === '-' && parseFloat(a) < parseFloat(b) ? b + ' (larger first)' : b} = ?`, answer: ans, check: v => Math.abs(parseFloat(v) - parseFloat(ans)) < 0.01 };
});

Activities.volume = () => genericInputWidget('Volume', 'Volume = length × width × height', () => {
  const l = rand(2, 8), w = rand(2, 8), h = rand(2, 8);
  const v = l*w*h;
  return { display: `Box: ${l} × ${w} × ${h}<br><span style="font-size:1rem;color:#5a6378;">Volume = ?</span>`, answer: String(v), check: x => parseInt(x) === v };
});

Activities.coordinate = () => genericInputWidget('Coordinate Plane', 'Type x,y coords for the described point.', () => {
  const x = rand(-5, 10), y = rand(-5, 10);
  return { display: `Plot a point ${x} right and ${y} up from origin.<br><span style="font-size:1rem;color:#5a6378;">Type as x,y</span>`, answer: `${x},${y}`, check: v => {
    const m = v.replace(/[()\s]/g, '').split(',');
    return parseInt(m[0]) === x && parseInt(m[1]) === y;
  }};
});

Activities.measurementConvert = () => genericInputWidget('Unit Conversion', 'Convert the unit.', () => {
  const probs = [
    { d: 'How many inches in 2 feet?', a: '24' },
    { d: 'How many feet in 36 inches?', a: '3' },
    { d: 'How many cm in 3 meters?', a: '300' },
    { d: 'How many mL in 2 liters?', a: '2000' },
    { d: 'How many ounces in 2 pounds?', a: '32' },
    { d: 'How many grams in 5 kg?', a: '5000' }
  ];
  const p = pick(probs);
  return { display: p.d, answer: p.a, check: v => v.trim() === p.a };
});

Activities.timeQuiz = (cfg) => genericInputWidget('Time', 'Read the time (type as HH:MM).', () => {
  const h = rand(1, 12);
  const m = cfg.precision === 'minute' ? rand(0, 59) : (Math.random() < 0.5 ? 0 : 30);
  const ans = `${h}:${String(m).padStart(2, '0')}`;
  return { display: `Analog clock shows: ${h} o'clock plus ${m} minutes<br><span style="font-size:1rem;color:#5a6378;">Write as digital time</span>`, answer: ans, check: v => v.trim().replace(/\s/g,'') === ans };
});

Activities.elapsedTime = () => genericInputWidget('Elapsed Time', 'How many minutes between the times?', () => {
  const h1 = rand(1, 11), m1 = rand(0, 50);
  const h2 = h1 + rand(0, 2);
  let m2 = rand(m1+1, 59);
  if (h2 > h1) m2 = rand(0, 59);
  const total = (h2-h1)*60 + (m2-m1);
  return { display: `Start: ${h1}:${String(m1).padStart(2,'0')}<br>End: ${h2}:${String(m2).padStart(2,'0')}`, answer: String(total), check: v => parseInt(v) === total };
});

Activities.coinCount = () => genericInputWidget('Coin Counter', 'Total value in cents.', () => {
  const nickels = rand(0, 5);
  const dimes = rand(0, 5);
  const quarters = rand(0, 3);
  const pennies = rand(0, 10);
  const total = nickels*5 + dimes*10 + quarters*25 + pennies;
  return { display: `${quarters} quarters, ${dimes} dimes, ${nickels} nickels, ${pennies} pennies`, answer: String(total), check: v => parseInt(v) === total };
});

Activities.makeChange = () => genericInputWidget('Making Change', 'How much change?', () => {
  const cost = rand(100, 1900);
  const paid = Math.ceil(cost/100) * 100 + (Math.random() < 0.5 ? 0 : 100);
  const change = paid - cost;
  return { display: `Cost: $${(cost/100).toFixed(2)}<br>Paid with: $${(paid/100).toFixed(2)}<br><span style="font-size:1rem;color:#5a6378;">Change?</span>`, answer: `$${(change/100).toFixed(2)}`, check: v => {
    const n = parseFloat(v.replace('$',''));
    return Math.abs(n - change/100) < 0.01;
  }};
});

Activities.solveForX = () => genericInputWidget('Solve for x', 'Type the value of x.', () => {
  const type = pick(['+', '-', '*']);
  const x = rand(1, 15);
  const a = rand(1, 20);
  let disp, b;
  if (type === '+') { b = a + x; disp = `${a} + x = ${b}`; }
  else if (type === '-') { b = x - a; disp = `x - ${a} = ${b}`; }
  else { b = a * x; disp = `${a}x = ${b}`; }
  return { display: disp, answer: String(x), check: v => parseInt(v) === x };
});

Activities.evaluateExpr = () => genericInputWidget('Evaluate Expression', 'Calculate with the given x value.', () => {
  const x = rand(1, 10);
  const a = rand(2, 9);
  const b = rand(1, 10);
  const ans = a * x + b;
  return { display: `${a}x + ${b} = ?<br><span style="font-size:1rem;color:#5a6378;">when x = ${x}</span>`, answer: String(ans), check: v => parseInt(v) === ans };
});

Activities.stats = () => genericInputWidget('Statistics', 'Calculate the named statistic.', () => {
  const values = [rand(1,20), rand(1,20), rand(1,20), rand(1,20), rand(1,20)];
  const stat = pick(['mean', 'range', 'max', 'min']);
  let ans;
  if (stat === 'mean') ans = values.reduce((a,b)=>a+b,0) / values.length;
  else if (stat === 'range') ans = Math.max(...values) - Math.min(...values);
  else if (stat === 'max') ans = Math.max(...values);
  else ans = Math.min(...values);
  return { display: `Data: ${values.join(', ')}<br><span style="font-size:1rem;color:#5a6378;">Find the ${stat}</span>`, answer: String(ans), check: v => Math.abs(parseFloat(v) - ans) < 0.1 };
});

Activities.percent = () => genericInputWidget('Percent', 'Find the percent of the number.', () => {
  const p = pick([10, 20, 25, 50, 75]);
  const n = p === 25 ? rand(1, 10) * 4 : p === 20 ? rand(1, 10) * 5 : p === 75 ? rand(1, 10) * 4 : rand(1, 10) * 10;
  const ans = n * p / 100;
  return { display: `${p}% of ${n} = ?`, answer: String(ans), check: v => Math.abs(parseFloat(v) - ans) < 0.01 };
});

Activities.orderOfOps = () => genericInputWidget('Order of Operations', 'PEMDAS — calculate.', () => {
  const a = rand(2, 9), b = rand(2, 9), c = rand(2, 9);
  const ans = a + b * c;
  return { display: `${a} + ${b} × ${c} = ?`, answer: String(ans), check: v => parseInt(v) === ans };
});

Activities.areaPerimeter = () => genericInputWidget('Area & Perimeter', 'Find area OR perimeter as asked.', () => {
  const l = rand(3, 15), w = rand(3, 15);
  const ask = pick(['area', 'perimeter']);
  const ans = ask === 'area' ? l*w : 2*(l+w);
  return { display: `Rectangle: ${l} by ${w}<br><span style="font-size:1rem;color:#5a6378;">Find the ${ask}</span>`, answer: String(ans), check: v => parseInt(v) === ans };
});

Activities.shapeId = (cfg) => {
  const shapes2D = [
    { name: 'triangle', sides: 3 }, { name: 'square', sides: 4 },
    { name: 'rectangle', sides: 4 }, { name: 'pentagon', sides: 5 },
    { name: 'hexagon', sides: 6 }, { name: 'octagon', sides: 8 }
  ];
  const shapes3D = [
    { name: 'cube', faces: 6 }, { name: 'sphere', faces: 0 },
    { name: 'cylinder', faces: 3 }, { name: 'cone', faces: 2 }
  ];
  const shapes = cfg.dim === 3 ? shapes3D : shapes2D;
  return genericInputWidget('Shape Identifier', 'Name the shape from its description.', () => {
    const s = pick(shapes);
    const detail = cfg.dim === 3 ? `Has ${s.faces} flat faces` : `Has ${s.sides} sides`;
    return { display: detail, answer: s.name, check: v => v.toLowerCase().trim() === s.name };
  });
};

// Main dispatcher
function launchActivity(type, config) {
  const container = document.getElementById('activityContainer');
  container.innerHTML = '';
  let widget;
  if (type === 'multipleChoice') widget = buildMultipleChoice(config);
  else if (type === 'arithmetic') widget = buildArithmetic(config);
  else if (type === 'match') widget = buildMatch(config);
  else if (type === 'order') widget = buildOrder(config);
  else if (Activities[type]) widget = Activities[type](config || {});
  else widget = errBox('Activity type not implemented: ' + type);
  if (typeof widget === 'string') container.innerHTML = widget;
  else container.appendChild(widget);
  document.getElementById('activityModal').classList.remove('hidden');
}
