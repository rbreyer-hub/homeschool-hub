/*
 * Seed projects & adventures. Categories:
 *   build     — build/test/experiment at home
 *   hike      — nature walk / day hike
 *   camping   — camping trips & camp-skills
 *   fishing   — fishing trips and fish-centric activities
 *
 * Each entry:
 *   title, category, ages (["1","3","5"] or subset), materials, steps, lesson
 */

const SEED_PROJECTS = [
  // ============== BUILD / EXPERIMENT ==============
  {
    id: "seed-1",
    title: "Baking Soda Volcano",
    category: "build",
    ages: ["1", "3", "5"],
    materials: ["Baking soda (2 tbsp)", "Vinegar (½ cup)", "Red food coloring", "Small bottle", "Tray to catch spills", "Optional: playdough or sand to shape a mountain"],
    steps: [
      "Shape a 'mountain' around the bottle with dough or sand.",
      "Put baking soda in the bottle.",
      "Mix vinegar and a few drops of food coloring.",
      "Pour vinegar in quickly — watch it erupt!",
      "Try different ratios — does more baking soda make a bigger eruption?"
    ],
    lesson: "Chemical reactions — acid + base releases CO2 gas. 5th graders: try measuring reaction time and temperature change. 1st graders: focus on cause & effect."
  },
  {
    id: "seed-2",
    title: "Grow Sugar or Salt Crystals",
    category: "build",
    ages: ["3", "5"],
    materials: ["1 cup sugar OR salt", "1 cup water", "Jar", "String + pencil", "Patience (7-10 days)"],
    steps: [
      "Heat water (parent helps) and dissolve as much sugar/salt as possible.",
      "Pour into jar. Tie string to a pencil resting on the rim, string hanging in liquid.",
      "Place in a still, warm spot.",
      "Check daily. Measure and photograph crystal growth.",
      "Compare sugar vs. salt crystal shapes."
    ],
    lesson: "Saturation, crystallization, and how different molecules form different crystal shapes. Great intro to the scientific method — observe over time."
  },
  {
    id: "seed-3",
    title: "Lemon Battery",
    category: "build",
    ages: ["3", "5"],
    materials: ["2-4 lemons", "Copper pennies or wire", "Zinc-coated (galvanized) nails", "Small LED bulb or digital clock", "Thin wires with clips"],
    steps: [
      "Roll each lemon on a table to release juice inside.",
      "Push a penny into one side and a nail into the other of each lemon.",
      "Connect lemons in series with wires — penny of one to nail of next.",
      "Connect the loose ends to a small LED. Does it light?",
      "Try 2 lemons, then 3, then 4. More voltage?"
    ],
    lesson: "Chemical energy → electrical energy. Electrolytes, circuits, and series vs. parallel. Ask: why do we need BOTH metals?"
  },
  {
    id: "seed-4",
    title: "Marshmallow Catapult",
    category: "build",
    ages: ["1", "3", "5"],
    materials: ["Craft sticks (10)", "Rubber bands", "Plastic spoon", "Mini marshmallows", "Tape measure", "Masking tape for floor target"],
    steps: [
      "Build a catapult: stack 7 sticks banded at both ends, wedge 2 crossed sticks as base, tape spoon to top.",
      "Load a marshmallow. Pull the spoon back, release!",
      "Measure distance. Try 3 pull angles — which goes farthest?",
      "Record each trial in a table.",
      "Challenge: hit a target from 6 feet away."
    ],
    lesson: "Simple machines (lever), elastic potential energy → kinetic energy, angles & trajectory, data collection. Controlled variables: only change one thing at a time."
  },
  {
    id: "seed-5",
    title: "Egg Drop Challenge",
    category: "build",
    ages: ["3", "5"],
    materials: ["Raw eggs (1-3)", "Recycled materials: straws, tape, paper, bubble wrap, cotton, boxes", "Measuring tape", "Safe high spot (2nd story window, chair on lawn)"],
    steps: [
      "Design a container that protects an egg when dropped.",
      "Build it using ONLY the materials allowed.",
      "Weigh the full package. Drop from gradually greater heights.",
      "Open carefully — did the egg survive?",
      "Iterate: redesign based on results."
    ],
    lesson: "Engineering design process (ask-imagine-plan-create-test-improve). Gravity, impact force, cushioning, iteration. 5th graders: compute impact force = mass × acceleration."
  },
  {
    id: "seed-6",
    title: "Density Column (Rainbow in a Jar)",
    category: "build",
    ages: ["1", "3", "5"],
    materials: ["Tall clear jar", "Honey", "Dish soap (colored)", "Water (dyed)", "Vegetable oil", "Rubbing alcohol (dyed)", "Food coloring"],
    steps: [
      "Pour honey in first (slowest).",
      "Gently add dish soap down the side.",
      "Add colored water next.",
      "Pour oil slowly — watch it sit on the water!",
      "Float a coin, grape, ping-pong ball. Which layer does each stop at?"
    ],
    lesson: "Density — denser liquids sink, less dense float. Test solid objects to find their relative density. Tie in to 5th-grade matter properties."
  },
  {
    id: "seed-7",
    title: "DIY Water Filter",
    category: "build",
    ages: ["3", "5"],
    materials: ["2-liter bottle (cut in half)", "Coffee filter or cotton", "Sand", "Pebbles", "Activated charcoal (pet-store)", "Dirty water (muddy, leaves)"],
    steps: [
      "Invert the top half of the bottle into the bottom.",
      "Layer: coffee filter, charcoal, sand, pebbles (top).",
      "Slowly pour dirty water in.",
      "Compare dirty water to filtered water.",
      "IMPORTANT: don't drink — this doesn't kill germs!"
    ],
    lesson: "Filtration, mixtures vs. solutions, water as essential. Connect to real-world: how do cities purify drinking water? (Filtration + chemicals + UV.)"
  },
  {
    id: "seed-8",
    title: "Solar Oven Pizza Box",
    category: "build",
    ages: ["3", "5"],
    materials: ["Pizza box", "Aluminum foil", "Plastic wrap", "Black paper", "Tape & scissors", "Thermometer", "S'mores ingredients"],
    steps: [
      "Cut a flap in the box lid (3 sides cut, 1 folds back).",
      "Line inside of flap with foil (reflector).",
      "Cover the opening under the flap with plastic wrap (window).",
      "Line bottom with black paper.",
      "Place s'mores inside. Angle toward sun. Track temperature every 10 min."
    ],
    lesson: "Solar energy, reflection (foil), absorption (black paper), insulation (plastic wrap traps heat). Make a temp vs. time graph."
  },
  {
    id: "seed-9",
    title: "Paper Airplane Science Fair",
    category: "build",
    ages: ["1", "3", "5"],
    materials: ["Printer paper (10 sheets)", "Tape measure", "Timer (phone)", "Paper clips", "Recording sheet"],
    steps: [
      "Build 3 different designs: dart, glider, stunt.",
      "Fly each 3 times. Measure distance. Record.",
      "Add 1 paperclip to nose. Fly again. Better or worse?",
      "Take the winner. Adjust wing angles. Beat the record.",
      "Present findings with a bar graph."
    ],
    lesson: "Controlled experiments (change ONE variable), aerodynamics (lift, drag, weight, thrust), data recording and graphing."
  },
  {
    id: "seed-10",
    title: "Bean Seed Germination — Light vs. Dark",
    category: "build",
    ages: ["1", "3", "5"],
    materials: ["Dried beans (10)", "Paper towels", "Zip bags (2)", "Water", "Sunny window + dark closet"],
    steps: [
      "Moisten paper towels, put 5 beans in each bag.",
      "Label: 'LIGHT' (window) and 'DARK' (closet).",
      "Check daily for 7-10 days. Measure root and shoot length.",
      "Photograph progress.",
      "Which grew better? Why?"
    ],
    lesson: "Plants germinate in dark BUT need light to keep growing (photosynthesis). Controlled experiment — only light changes, all else same. Journaling practice."
  },
  {
    id: "seed-11",
    title: "Magnet Obstacle Course",
    category: "build",
    ages: ["1", "3"],
    materials: ["Strong magnets (2-3)", "Paper clips, coins, small toys", "Cardboard (thick)", "Paper & crayons"],
    steps: [
      "Draw a racetrack or maze on cardboard.",
      "Put a paper clip on top, magnet UNDER the cardboard.",
      "Move the magnet — the clip follows!",
      "Test which objects are magnetic by trying to move them.",
      "Build the fastest racer with paper and a paper clip inside."
    ],
    lesson: "Magnetism works through materials, attracts iron/steel only. Poles: N-N repels, N-S attracts."
  },
  {
    id: "seed-12",
    title: "Invisible Ink Messages",
    category: "build",
    ages: ["3", "5"],
    materials: ["Lemon juice", "Cotton swab or paintbrush", "Paper", "Heat source (lamp, iron with parent help)"],
    steps: [
      "Dip swab in lemon juice. Write a secret message.",
      "Let it dry — invisible!",
      "Heat the paper (lamp from above, or iron with parent).",
      "Message appears in brown!",
      "Try orange juice, milk, vinegar — which works best?"
    ],
    lesson: "Oxidation — organic liquids darken faster than paper when heated. Chemistry and cryptography in one!"
  },

  // ============== HIKE / NATURE WALK ==============
  {
    id: "seed-13",
    title: "Leaf Identification Walk",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["Small notebook", "Pencil", "Field guide or iNaturalist app", "Bag for samples", "Crayon for rubbings"],
    steps: [
      "Pick a trail or even your neighborhood.",
      "Collect 1 leaf from each different tree.",
      "Photograph or sketch each tree.",
      "Use app/guide to identify.",
      "Make leaf rubbings at home. Label with tree names."
    ],
    lesson: "Classification, plant diversity, observation. Older kids: learn differences between simple vs. compound leaves, deciduous vs. evergreen."
  },
  {
    id: "seed-14",
    title: "Bird Watching Adventure",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["Binoculars (even cheap ones)", "Merlin Bird ID app (free)", "Notebook", "Quiet voices!", "Snack (sit still and watch)"],
    steps: [
      "Go early morning or dusk (best bird activity).",
      "Sit quietly for 10 minutes. Listen first.",
      "Merlin can identify birds by SOUND — try it.",
      "Count how many different species you see/hear.",
      "Keep a 'life list' you add to every walk."
    ],
    lesson: "Classification, habitats, observation patience. Great for 5th graders: migratory vs. resident birds, bird calls as communication."
  },
  {
    id: "seed-15",
    title: "Rock Hunt & Classification",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["Bag or bucket", "Egg carton for sorting", "Magnifying glass", "Small hammer (parent use)", "Rock ID guide"],
    steps: [
      "Walk along creek or trail with visible rocks.",
      "Collect 12 rocks of different types.",
      "At home, sort by: color, hardness, weight, texture.",
      "Try a scratch test (penny vs. fingernail).",
      "Guess: igneous, sedimentary, or metamorphic?"
    ],
    lesson: "Geology basics, Mohs hardness scale, observation. Older kids can connect rock types to how they formed (volcanic, layered, heated)."
  },
  {
    id: "seed-16",
    title: "Stream or Pond Ecology",
    category: "hike",
    ages: ["3", "5"],
    materials: ["Small net", "White tray or bucket", "Magnifying glass", "Field notebook", "Rubber boots"],
    steps: [
      "Find a safe, shallow stream or pond edge.",
      "Scoop up water with some leaves/mud into the tray.",
      "Watch for movement. Count types of creatures.",
      "Sketch what you find.",
      "Return everything to the water when done."
    ],
    lesson: "Macroinvertebrates = water quality indicators! Mayfly/stonefly larvae = clean water. Lots of worms = polluted. Citizen science connection."
  },
  {
    id: "seed-17",
    title: "Night Sky Walk",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["Dark, safe location", "Star map or SkyView app", "Red flashlight (preserves night vision)", "Blanket", "Warm clothes"],
    steps: [
      "Go out on a clear, moonless night.",
      "Let eyes adjust 10-15 minutes — no phone screens!",
      "Find the Big Dipper, then Polaris.",
      "Use app to identify planets (Mars red, Venus bright).",
      "Watch for satellites and shooting stars."
    ],
    lesson: "Astronomy, our place in the universe. Discuss: Why is the sky dark when space is full of stars? (Olbers' paradox — older kids.)"
  },
  {
    id: "seed-18",
    title: "One Tree, Four Seasons",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["One nearby tree you'll revisit", "Journal/camera", "Measuring tape"],
    steps: [
      "Pick a tree near home. Measure trunk circumference.",
      "Photograph it the same way every month.",
      "Draw leaves, bark, any animals on it.",
      "Record temperature and date.",
      "After a year, compare spring-summer-fall-winter."
    ],
    lesson: "Long-term observation, seasonal changes, tree biology. Phenology = the study of seasonal timing. Real scientists do exactly this."
  },
  {
    id: "seed-19",
    title: "Insect Scavenger Hunt",
    category: "hike",
    ages: ["1", "3", "5"],
    materials: ["Clear jar with holes (temporary)", "Magnifying glass", "Checklist: ant, spider, butterfly, bee, beetle, worm, dragonfly, cricket", "Notebook"],
    steps: [
      "Set a 30-minute time limit.",
      "Search under logs, in grass, by flowers.",
      "Gently observe — release every bug!",
      "Check off each type on your list.",
      "Count how many species total."
    ],
    lesson: "Biodiversity, insect anatomy (6 legs vs. 8 for spiders), importance of pollinators. Teach respect for small creatures."
  },
  {
    id: "seed-20",
    title: "Animal Track & Scat Hunt",
    category: "hike",
    ages: ["3", "5"],
    materials: ["Track field guide", "Ruler", "Camera", "Stick to point (don't touch scat!)"],
    steps: [
      "Go after rain or light snow — tracks show best.",
      "Look at creek banks, muddy areas, forest edges.",
      "Measure any track found: length, width, toe count.",
      "Photograph next to a ruler or coin.",
      "Identify from book/app: deer, raccoon, coyote, fox, rabbit?"
    ],
    lesson: "Animal adaptations, hunting/scavenging behavior, inference from evidence (like detective work = science!)."
  },

  // ============== CAMPING ==============
  {
    id: "seed-21",
    title: "Tent Setup Engineering",
    category: "camping",
    ages: ["3", "5"],
    materials: ["Tent & poles", "Stakes", "Mallet", "Ground tarp"],
    steps: [
      "Read the instructions together — IF you get stuck.",
      "Kids sort parts and lay out the tarp.",
      "Assemble poles. Notice the geometry: triangles are strong!",
      "Thread poles through sleeves, raise tent.",
      "Stake corners. Check tautness — adjust."
    ],
    lesson: "Geometry (triangles = rigid structures), engineering design, teamwork, following instructions. Try it once at home first."
  },
  {
    id: "seed-22",
    title: "Campfire Chemistry",
    category: "camping",
    ages: ["3", "5"],
    materials: ["Firewood (parent supervises!)", "Kindling: dry twigs, paper, fatwood", "Matches/lighter", "Metal bucket of water ALWAYS nearby"],
    steps: [
      "Discuss the fire triangle: fuel + oxygen + heat.",
      "Build a teepee or log cabin structure.",
      "Light kindling. Watch fire grow as it catches tinder.",
      "Observe colors — yellow vs. blue flame = different temperatures.",
      "Put it out COLD with water before bed."
    ],
    lesson: "Combustion is a chemical reaction — fuel + O2 → heat + light + CO2 + H2O. Fire safety = non-negotiable. Teach LEAVE NO TRACE."
  },
  {
    id: "seed-23",
    title: "Map & Compass Navigation",
    category: "camping",
    ages: ["3", "5"],
    materials: ["Topographic map of your area", "Compass", "Pencil", "Open area (park, field)"],
    steps: [
      "Align map with compass pointing north (orient the map).",
      "Identify visible landmarks on map (hills, streams, roads).",
      "Practice taking bearings: point compass at a tree, read degree.",
      "Set up a course with 4-5 waypoints by bearing & distance.",
      "Kids navigate without help!"
    ],
    lesson: "Cardinal directions, coordinate systems (latitude/longitude), scale, and practical problem solving. 5th grade: coordinate plane connection."
  },
  {
    id: "seed-24",
    title: "Constellation Star Mapping",
    category: "camping",
    ages: ["1", "3", "5"],
    materials: ["Star chart for your season", "Red flashlight", "Blanket", "Optional: small telescope or binoculars"],
    steps: [
      "Lie down 20+ min after dark (no moon is best).",
      "Start with the Big Dipper. Use it to find Polaris (North Star).",
      "Find 2-3 constellations: Orion (winter), Cassiopeia, Cygnus.",
      "Spot any planets? They don't twinkle like stars.",
      "Track the Moon's phase each night you camp."
    ],
    lesson: "Astronomy, navigation history (sailors used stars!), Earth's rotation (stars 'move' across the sky). Inspire wonder."
  },
  {
    id: "seed-25",
    title: "Water Collection & Safety",
    category: "camping",
    ages: ["3", "5"],
    materials: ["Clear container", "Coffee filters", "Cheesecloth", "Backpacker's filter OR boiling pot", "Optional: water testing strips"],
    steps: [
      "Find the 'best-looking' natural water source (moving > still).",
      "Pre-filter through cloth/coffee filter to remove sediment.",
      "Use a real filter or boil 1 minute (3 min at altitude).",
      "Test with strips: pH, hardness, nitrates.",
      "Compare before & after filtering — visible change?"
    ],
    lesson: "Water purification stages, microorganisms (bacteria/protozoa), and why 'clear' water isn't 'clean' water. Survival skill + chemistry."
  },
  {
    id: "seed-26",
    title: "Shelter Building (Day Fort)",
    category: "camping",
    ages: ["1", "3", "5"],
    materials: ["Fallen branches (no live cutting!)", "Rope or paracord", "Leaves/pine boughs for thatching"],
    steps: [
      "Find a strong 'ridgepole' branch. Lean against a tree crotch.",
      "Lean smaller branches along both sides (ribs).",
      "Thatch the outside with leaves, thickest at top.",
      "Test waterproofing with a cup of water on top.",
      "IMPORTANT: dismantle before leaving — Leave No Trace."
    ],
    lesson: "Structural engineering (triangles, load paths), primitive skills, Leave No Trace ethics. Great bonding activity."
  },
  {
    id: "seed-27",
    title: "Cooking Without a Kitchen",
    category: "camping",
    ages: ["3", "5"],
    materials: ["Foil packet dinner ingredients (potatoes, carrots, meat)", "Heavy foil", "Fire coals or grill", "Tongs", "Plates"],
    steps: [
      "Chop ingredients small (parent helps with knife).",
      "Layer on foil: oil, veggies, meat, seasoning. Wrap tight.",
      "Place on hot coals (not flames). 20-25 min, flip halfway.",
      "Open carefully — STEAM!",
      "Taste: is it cooked? Too dry? Adjust next time."
    ],
    lesson: "Heat transfer (conduction vs. convection vs. radiation), measurement, chemical changes in cooking (Maillard reaction). Life skill."
  },

  // ============== FISHING ==============
  {
    id: "seed-28",
    title: "First Fishing Trip",
    category: "fishing",
    ages: ["1", "3", "5"],
    materials: ["Fishing pole for each kid", "Bait (worms, crickets, dough)", "Bobbers, hooks, sinkers", "License (check local rules)", "Tackle box", "Patience!"],
    steps: [
      "Review casting on land first (no hooks).",
      "Find a calm spot: pond, dock, slow river.",
      "Thread bait. Cast. Watch the bobber.",
      "Set the hook gently when it dips.",
      "Practice catch & release — unhook carefully, revive in water."
    ],
    lesson: "Patience, observation, ecosystems (where fish live and why), predator/prey relationships. 5th graders: discuss fish sustainability."
  },
  {
    id: "seed-29",
    title: "Knot Tying Practice",
    category: "fishing",
    ages: ["3", "5"],
    materials: ["Fishing line (or paracord for practice)", "Hooks (lures for practice)", "YouTube: 'improved clinch knot'"],
    steps: [
      "Learn 3 knots: improved clinch, palomar, loop knot.",
      "Practice 10 times each until smooth.",
      "Test strength: tie knot, pull until it breaks or slips.",
      "Compare which knot is strongest.",
      "Teach a sibling."
    ],
    lesson: "Geometry (how loops distribute force), real-world problem solving. 5th graders can calculate breaking strength vs. line rating."
  },
  {
    id: "seed-30",
    title: "Fish Anatomy Study",
    category: "fishing",
    ages: ["3", "5"],
    materials: ["A fresh-caught (legal-size) fish you'll keep OR fish from market", "Tray", "Parent to help clean", "Diagram to compare", "Paper & pencil"],
    steps: [
      "Identify external parts: fins (dorsal, pectoral, caudal), gills, lateral line, scales.",
      "Observe scales with magnifier — count rings (like tree rings, show age!).",
      "When cleaning, carefully look inside: swim bladder, heart, gills.",
      "Compare to a mammal (your own body!).",
      "Draw and label what you saw."
    ],
    lesson: "Anatomy, adaptations for water life (gills extract O2 from water, fins for swimming, streamlined body). Respectful use of the catch."
  },
  {
    id: "seed-31",
    title: "Water Quality Investigation",
    category: "fishing",
    ages: ["3", "5"],
    materials: ["pH test strips", "Thermometer", "Clear jar", "Notebook", "Camera"],
    steps: [
      "At your fishing spot, check: water clarity (dip jar), temperature at surface, pH.",
      "Note: any algae? Trash? Plants on bank? Other wildlife?",
      "Record time of day and weather.",
      "Compare across multiple trips or locations.",
      "Did you catch more fish on certain water conditions?"
    ],
    lesson: "Water chemistry, correlation vs. causation, field science. Real fisheries biologists do exactly this to manage fish populations."
  },
  {
    id: "seed-32",
    title: "Local Species Field Guide",
    category: "fishing",
    ages: ["1", "3", "5"],
    materials: ["Notebook", "Colored pencils", "Local fish ID resource (state fish & wildlife site)"],
    steps: [
      "Research what 5-10 fish live in your local waters.",
      "Draw each one. Include: size range, coloring, habitat (surface/bottom, weeds/rocks).",
      "Note diet and what bait catches them.",
      "Use your guide on every fishing trip.",
      "Update with notes after each catch."
    ],
    lesson: "Species identification, habitat specialization, food webs. Turns a one-time trip into ongoing citizen science."
  }
];

function loadProjects() {
  try {
    const stored = JSON.parse(localStorage.getItem('homeschool-projects-v1') || '[]');
    return [...SEED_PROJECTS, ...stored];
  } catch { return SEED_PROJECTS.slice(); }
}

function loadUserProjects() {
  try { return JSON.parse(localStorage.getItem('homeschool-projects-v1') || '[]'); }
  catch { return []; }
}

function saveUserProjects(arr) {
  localStorage.setItem('homeschool-projects-v1', JSON.stringify(arr));
}

function addUserProject(project) {
  const arr = loadUserProjects();
  project.id = 'user-' + Date.now();
  project.userAdded = true;
  arr.push(project);
  saveUserProjects(arr);
  return project;
}

function deleteUserProject(id) {
  const arr = loadUserProjects().filter(p => p.id !== id);
  saveUserProjects(arr);
}

const CATEGORY_INFO = {
  build:   { label: "Build / Experiment", icon: "🔬", color: "#e85d75" },
  hike:    { label: "Nature Walk / Hike", icon: "🥾", color: "#22a06b" },
  camping: { label: "Camping",            icon: "⛺", color: "#f7a440" },
  fishing: { label: "Fishing",            icon: "🎣", color: "#3b6ef5" }
};
