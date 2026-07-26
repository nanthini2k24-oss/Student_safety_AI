// ===== Student Safety AI — Local data (JSON-style) =====
// All data lives here as JS objects; runtime state is persisted in LocalStorage.

export const safetyTips = [
  { icon: '🚸', title: 'Cross at crossings', text: 'Always use pedestrian crossings or zebra crossings. Look left, right, and left again before crossing.' },
  { icon: '🎒', title: 'Walk with a buddy', text: 'Travel with friends whenever possible. There is safety in numbers on the way to school.' },
  { icon: '📱', title: 'Share your location', text: 'Let a parent or guardian know your live location when travelling to or from school.' },
  { icon: '⛑️', title: 'Wear a helmet', text: 'If you ride a cycle, always wear a properly fitted helmet. It protects your most important organ.' },
  { icon: '🚌', title: 'Wait safely for the bus', text: 'Stand at least three big steps back from the road while waiting for your school bus.' },
  { icon: '🚦', title: 'Obey signals', text: 'Never cross on a red signal, even if the road looks empty. Wait for the green man.' },
  { icon: '🌙', title: 'Be seen at night', text: 'Wear bright or reflective clothing so drivers can see you clearly in low light.' },
  { icon: '🚫', title: 'Stranger danger', text: 'Never accept lifts, gifts, or food from strangers. Move to a safe place and tell a trusted adult.' },
  { icon: '💧', title: 'Stay hydrated', text: 'Carry a water bottle. Dehydration can make you dizzy and less alert on the road.' },
  { icon: '🧠', title: 'Stay focused', text: 'Do not use headphones or text while crossing roads. Keep your eyes and ears open.' },
  { icon: '🏠', title: 'Know safe places', text: 'Identify shops, police stations, and friendly homes along your route where you can seek help.' },
  { icon: '🗣️', title: 'Use your loud voice', text: 'If someone makes you uncomfortable, shout "NO!" loudly and run to a safe crowded place.' },
];

export const dailyMissions = [
  { id: 'm1', text: 'Cross the road only at a pedestrian crossing today', reward: 10 },
  { id: 'm2', text: 'Greet your bus driver or a school helper kindly', reward: 5 },
  { id: 'm3', text: 'Check in with SafeBuddy AI about how you feel', reward: 15 },
  { id: 'm4', text: 'Walk with a friend on at least part of your journey', reward: 10 },
  { id: 'm5', text: 'Notice one safety sign on your route and name it', reward: 8 },
  { id: 'm6', text: 'Complete a 2-minute breathing exercise', reward: 12 },
  { id: 'm7', text: 'Report a hazard if you spot one in your community', reward: 20 },
];

export const liveAlerts = [
  { type: 'weather', text: 'Light rain expected after 3 PM — carry an umbrella and walk carefully.' },
  { type: 'hazard', text: 'Community report: Broken pavement near Maple Street crossing. Stay alert.' },
  { type: 'traffic', text: 'Heavy traffic on Route 12 — bus 7 may arrive 5 minutes late.' },
  { type: 'general', text: 'New pedestrian crossing installed at Lake Road. Safer route now available.' },
  { type: 'safety', text: 'Stranger reported near Oak Park. Avoid the side lane and use the main road.' },
  { type: 'health', text: 'High pollen today — students with asthma, carry your inhaler.' },
];

export const safeBuddyTopics = [
  { key: 'fear', icon: '😨', label: 'I feel scared', desc: 'Something frightened me on the way' },
  { key: 'lonely', icon: '😔', label: 'I feel lonely', desc: 'Nobody seems to talk to me' },
  { key: 'bullying', icon: '😢', label: 'I am being bullied', desc: 'Someone is hurting or teasing me' },
  { key: 'stress', icon: '😣', label: 'I feel stressed', desc: 'Too much pressure from school' },
  { key: 'anxiety', icon: '😰', label: 'I feel anxious', desc: 'My heart races and I worry a lot' },
  { key: 'angry', icon: '😠', label: 'I feel angry', desc: 'I am upset and do not know why' },
  { key: 'happy', icon: '😊', label: 'I feel happy', desc: 'I want to share something good' },
  { key: 'breathing', icon: '🌬️', label: 'Breathing exercise', desc: 'Help me calm down' },
];

export const safeBuddyResponses = {
  greeting: [
    "Hi there! I'm SafeBuddy, your safety friend. I'm here to listen — how are you feeling today?",
    "Hey! SafeBuddy here. You can tell me anything — I'll never judge you. What's on your mind?",
  ],
  fear: [
    "It sounds like something really scared you. That's a brave thing to admit. Let's take a slow breath together — in for 4 seconds, out for 6. You are safe right now.",
    "Being scared means your body is trying to protect you. Can you tell me where you are? If you are in danger right now, please press the red SOS button so a trusted adult can help immediately.",
    "Fear shrinks when we share it. Try naming what scared you out loud. Then remind yourself: 'I am strong, I am alert, and I can get to a safe place.'",
  ],
  lonely: [
    "Feeling lonely hurts — but you are not alone in feeling this way. Reaching out, even to me, is a real step. Is there one person at school you could smile at today?",
    "Loneliness can trick us into thinking nobody cares. The truth is, there are people who would be glad to hear from you. Try greeting one classmate tomorrow — small steps count.",
    "You matter, and your feelings matter. Would you like to try a 2-minute breathing exercise with me? It can make the quiet feel less heavy.",
  ],
  bullying: [
    "I'm so sorry this is happening to you. Bullying is never your fault. You deserve to feel safe. Please tell a trusted teacher, parent, or school counsellor — you do not have to face this alone.",
    "If someone is hurting or teasing you, your safety comes first. Walk away, stay near other people, and tell an adult you trust. If you are in danger now, press the SOS button.",
    "Bullying thrives in silence. By telling me, you've already broken the silence. Write down what happened — when, where, who. It helps adults take action to protect you.",
  ],
  stress: [
    "School pressure can feel like a heavy backpack. Let's set it down for a moment. Try this: breathe in for 4, hold for 4, out for 4. Do it three times with me.",
    "Stress often comes from trying to do everything at once. Can we pick just one thing to focus on? The rest can wait. You are allowed to take breaks.",
    "You are more than your marks and your homework. Your wellbeing matters most. Talk to a parent or teacher about what's overwhelming you — they can help lighten the load.",
  ],
  anxiety: [
    "Anxiety can make your chest feel tight. Let's ground ourselves. Name 5 things you can see around you, 4 you can touch, 3 you can hear. It brings your mind back to the present.",
    "Your racing heart is a feeling, not a fact. It will pass. Try breathing out longer than you breathe in — like blowing out a candle slowly. This calms your body.",
    "If anxiety keeps coming back, please tell a trusted adult or your school counsellor. There are kind people who can help you feel steady again. You deserve support.",
  ],
  angry: [
    "Anger tells us something matters to you. That's okay. Let's let it out safely — try pressing your palms together hard for 10 seconds, then release. Or take a slow walk.",
    "It's brave to notice anger instead of acting on it. Try naming the feeling: 'I feel angry because...'. Saying it shrinks it. You are in control.",
    "If the anger is about someone hurting you, please tell a trusted adult. Your feelings are valid and you deserve to be heard and protected.",
  ],
  happy: [
    "I love hearing this! Happiness shared is happiness doubled. What made your day bright? Savour it — write it down or tell someone you love.",
    "That's wonderful! When good things happen, your brain learns to notice them more. Keep a tiny 'happy moments' note — it's a light on tough days.",
    "Yay! I'm doing a little happy dance for you. Remember this feeling — it's proof that good days come. You deserve every one of them.",
  ],
  breathing: [
    "Let's breathe together. Follow the circle: breathe in as it grows for 4 seconds... and out as it shrinks for 6 seconds. Repeat 5 times. You're doing great.",
    "Try box breathing: in for 4, hold for 4, out for 4, hold for 4. It's what calm people use before big moments. You've got this.",
    "Place a hand on your belly. Breathe so your belly pushes your hand out. Slow and deep. This is your calm switch. Use it anytime, anywhere.",
  ],
  thanks: [
    "Anytime. I'm always here for you — day or night. You're braver than you think. 💙",
    "It's an honour to listen. Come back whenever you need a friend. You matter.",
  ],
  default: [
    "I hear you. Thank you for sharing that with me. Can you tell me a bit more about how it's making you feel?",
    "That sounds important. You're not alone in this — would you like to talk about what happened, or try a calming breathing exercise together?",
    "I'm here for you. Whatever you're feeling is okay. If you're in danger, please press the red SOS button so a trusted adult can help right away.",
  ],
};

export const motivationalQuotes = [
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "Safety isn't expensive — it's priceless. Your wellbeing always comes first.",
  "A calm mind is a safe mind. Breathe, then decide.",
  "Asking for help is a sign of strength, not weakness.",
  "Every safe step you take is a victory. Celebrate the small wins.",
  "Your voice is your first defence. Use it loudly and proudly.",
  "You don't have to fight — you just have to get to a safe place. That's winning.",
  "Kindness to yourself is the first kind of safety. Be gentle with you.",
];

export const breathingExercises = [
  { id: 'box', name: 'Box Breathing', desc: 'Calm focus in 4 simple steps', pattern: [4, 4, 4, 4], labels: ['Breathe in', 'Hold', 'Breathe out', 'Hold'], color: 'blue' },
  { id: '478', name: '4-7-8 Calm', desc: 'Release anxiety and drift calm', pattern: [4, 7, 8, 0], labels: ['Breathe in', 'Hold', 'Breathe out', 'Rest'], color: 'green' },
  { id: 'belly', name: 'Belly Breathing', desc: 'Ground yourself when overwhelmed', pattern: [4, 0, 6, 0], labels: ['Breathe in (belly)', 'Rest', 'Breathe out slowly', 'Rest'], color: 'yellow' },
];

export const affirmations = [
  "I am safe. I am strong. I am cared for.",
  "I can handle hard things, one step at a time.",
  "My feelings are valid, and I am allowed to ask for help.",
  "I am surrounded by people who want me to be safe.",
  "I trust my instincts to keep me out of danger.",
  "Every breath I take calms my body and mind.",
  "I am kind to myself, especially on difficult days.",
  "I have the courage to speak up when something feels wrong.",
];

export const selfDefenceTechniques = [
  {
    id: 'ready', title: 'Ready Stance', icon: '🧍', focus: 'Awareness',
    desc: 'Stand balanced and alert. This is the foundation of all self-defence — being ready to move, not to fight.',
    steps: [
      'Stand with feet shoulder-width apart, knees slightly soft.',
      'Keep your weight balanced on both feet, ready to move either way.',
      'Hold your hands open at chest height — relaxed, not clenched.',
      'Look ahead, scan your surroundings, and breathe steadily.',
    ],
    arrows: [{ x: '50%', y: '20%', dir: '↓', label: 'Soft knees' }],
  },
  {
    id: 'wrist', title: 'Wrist Release', icon: '✋', focus: 'Escape',
    desc: 'If someone grabs your wrist, break free using your body\'s strongest direction — never pull straight back.',
    steps: [
      'Do not pull backwards — the grip is strongest that way.',
      'Rotate your arm toward the attacker\'s thumb (the weak side of the grip).',
      'Step back and pull sharply in the direction of the thumb gap.',
      'Once free, run toward a safe, crowded place immediately.',
    ],
    arrows: [{ x: '30%', y: '40%', dir: '↖', label: 'Twist toward thumb' }],
  },
  {
    id: 'palm', title: 'Palm Strike', icon: '🖐️', focus: 'Create space',
    desc: 'A palm strike to an attacker\'s face creates the seconds you need to escape. Aim for the nose or chin.',
    steps: [
      'Open your hand, fingers curled back slightly, palm firm.',
      'Drive the heel of your palm forward and slightly upward.',
      'Aim for the nose or chin — push through the target.',
      'Immediately turn and run to safety. Do not stay to fight.',
    ],
    arrows: [{ x: '70%', y: '30%', dir: '→', label: 'Strike forward' }],
  },
  {
    id: 'elbow', title: 'Elbow Strike', icon: '💪', focus: 'Close-range escape',
    desc: 'When an attacker is very close, your elbow is a powerful tool to create space and get away.',
    steps: [
      'Bend your arm sharply so your elbow points forward.',
      'Drive your elbow sideways or forward into the attacker\'s ribs or face.',
      'Keep your other hand up to protect your face.',
      'The moment space opens, run. Your goal is escape, not victory.',
    ],
    arrows: [{ x: '70%', y: '40%', dir: '⇒', label: 'Elbow drive' }],
  },
  {
    id: 'knee', title: 'Knee Strike', icon: '🦵', focus: 'Emergency escape',
    desc: 'A knee strike to the thigh or groin can stop an attacker long enough for you to flee to safety.',
    steps: [
      'Grab the attacker\'s shoulders for balance if you cannot pull away.',
      'Drive your knee up sharply into their thigh or groin.',
      'Use your whole body, not just your leg.',
      'As they react, break free and sprint to the nearest safe place.',
    ],
    arrows: [{ x: '50%', y: '70%', dir: '↑', label: 'Knee up' }],
  },
  {
    id: 'bag', title: 'School Bag Shield', icon: '🎒', focus: 'Protect & distance',
    desc: 'Your school bag is a shield you carry every day. Use it to block, distance, and protect yourself.',
    steps: [
      'Swing your bag in front of your body to create a barrier.',
      'Hold it with both arms through the straps, firm against your chest.',
      'Use it to block grabs or push the attacker back.',
      'Back away while keeping the bag between you and them, then run.',
    ],
    arrows: [{ x: '50%', y: '50%', dir: '⬅', label: 'Bag as shield' }],
  },
  {
    id: 'voice', title: 'Loud Voice Practice', icon: '🗣️', focus: 'Draw attention',
    desc: 'A loud, confident voice stops most attackers and draws helpful attention. Practice until it is automatic.',
    steps: [
      'From your belly (not your throat), shout "NO! STOP! BACK OFF!"',
      'Keep your voice low and firm, not high and squeaky.',
      'Shout words people understand: "HELP! I DON\'T KNOW THIS PERSON!"',
      'Loud attention is your enemy\'s worst fear. Use it freely.',
    ],
    arrows: [{ x: '50%', y: '15%', dir: '🔊', label: 'Belly shout' }],
  },
  {
    id: 'escape', title: 'Safe Escape', icon: '🏃', focus: 'Get to safety',
    desc: 'Every technique has one goal: get to a safe place. Escape is always the win.',
    steps: [
      'The instant you break free, run — do not look back, do not freeze.',
      'Run toward crowds, lit shops, police stations, or known safe homes.',
      'Keep running until you reach a place with trusted adults.',
      'Tell the first adult you trust what happened. You are not in trouble.',
    ],
    arrows: [{ x: '60%', y: '60%', dir: '↗', label: 'Run to safety' }],
  },
  {
    id: 'stranger', title: 'Stranger Awareness', icon: '👁️', focus: 'Stay alert',
    desc: 'Most danger can be avoided by staying alert and trusting your instincts about strangers.',
    steps: [
      'Keep a safe distance (an arm\'s length plus a step) from strangers.',
      'Never accept gifts, food, or rides from someone you do not know.',
      'If a stranger asks for help finding a place, do not go with them — tell an adult.',
      'Trust the feeling in your stomach. If something feels wrong, leave.',
    ],
    arrows: [{ x: '50%', y: '40%', dir: '👁', label: 'Stay alert' }],
  },
  {
    id: 'emergency', title: 'Emergency Action', icon: '🆘', focus: 'Get help fast',
    desc: 'When something goes wrong, know exactly what to do in the first 10 seconds.',
    steps: [
      'Move to safety first — out of the road, away from the person.',
      'Call the emergency number or press your SOS button.',
      'Say your name, where you are, and what happened — clearly.',
      'Stay on the line and stay where it is safe until help arrives.',
    ],
    arrows: [{ x: '50%', y: '50%', dir: '🆘', label: 'Get help' }],
  },
];

export const selfDefenceQuiz = [
  {
    q: 'What is the main goal of every self-defence technique?',
    options: ['To defeat the attacker', 'To escape to a safe place', 'To fight as long as possible', 'To punish the attacker'],
    answer: 1,
    explain: 'Self-defence is always about escaping danger and reaching safety — never about winning a fight.',
  },
  {
    q: 'If someone grabs your wrist, which direction should you pull?',
    options: ['Straight back toward you', 'Toward the attacker\'s thumb', 'Up toward the sky', 'Down toward the ground'],
    answer: 1,
    explain: 'The thumb is the weak side of a grip. Twist and pull toward the thumb to break free.',
  },
  {
    q: 'What should you shout if a stranger makes you uncomfortable?',
    options: ['"Please go away"', '"NO! I don\'t know you! HELP!"', 'Nothing, stay quiet', '"Sorry, I\'m busy"'],
    answer: 1,
    explain: 'A loud, clear shout draws attention and warns others. Your voice is a powerful safety tool.',
  },
  {
    q: 'After breaking free from danger, what is your first action?',
    options: ['Stay and check on the person', 'Run to a safe, crowded place', 'Hide nearby silently', 'Call a friend to chat'],
    answer: 1,
    explain: 'Always run to a safe, crowded place and tell a trusted adult. Do not stay near the danger.',
  },
];

export const trafficSigns = [
  { name: 'Stop', meaning: 'Come to a complete halt', shape: 'octagon', color: '#f04d3a', text: 'STOP' },
  { name: 'Give Way', meaning: 'Slow down and let others go first', shape: 'triangle', color: '#fff', border: '#f04d3a' },
  { name: 'Pedestrian Crossing', meaning: 'People may be crossing — slow down', shape: 'diamond', color: '#ffd54a', text: 'PED' },
  { name: 'No Entry', meaning: 'You cannot enter this road', shape: 'circle', color: '#f04d3a', text: 'NO' },
  { name: 'Speed Limit 30', meaning: 'Maximum speed is 30 km/h (school zone)', shape: 'circle', color: '#fff', border: '#1e293b', text: '30' },
  { name: 'School Ahead', meaning: 'Children crossing — drive carefully', shape: 'triangle', color: '#fff', border: '#1e293b', text: '🏫' },
  { name: 'No Honking', meaning: 'Do not use the horn (near schools/hospitals)', shape: 'circle', color: '#fff', border: '#f04d3a', text: '🔇' },
  { name: 'U-Turn Allowed', meaning: 'You may turn around here', shape: 'circle', color: '#16b85f', text: '↺' },
];

export const roadRules = [
  { icon: '🚸', title: 'Use pedestrian crossings', text: 'Always cross at zebra crossings, footbridges, or signal-controlled crossings. They are placed where drivers expect people.' },
  { icon: '👀', title: 'Look both ways', text: 'Look left, right, and left again before crossing. Keep looking as you cross — drivers can appear suddenly.' },
  { icon: '🚦', title: 'Follow signals', text: 'Cross only when the green man shows. Even then, check that vehicles have actually stopped.' },
  { icon: '🚫', title: 'No phone while walking', text: 'Do not text or wear headphones near roads. Your ears and eyes keep you safe.' },
  { icon: '🧒', title: 'Hold an adult\'s hand', text: 'Younger children should hold an adult\'s hand near roads and in car parks.' },
  { icon: '🛴', title: 'Dismount cycles and scooters', text: 'Walk your cycle or scooter across roads. Riding across is dangerous.' },
  { icon: '🌙', title: 'Be visible after dark', text: 'Wear bright or reflective gear so drivers can see you in low light.' },
  { icon: '🚌', title: 'Wait behind the kerb', text: 'Stand well back from the road edge while waiting for a bus. Never rush toward a moving bus.' },
];

export const roadSafetyQuiz = [
  {
    q: 'Before crossing a road, you should look...',
    options: ['Left only', 'Right only', 'Left, right, and left again', 'Straight ahead only'],
    answer: 2,
    explain: 'Looking left, right, and left again covers traffic from the side nearest you first, then checks the far side, then rechecks the near side before you step out.',
  },
  {
    q: 'A green pedestrian signal means...',
    options: ['Run across quickly', 'Cross, but still check that vehicles have stopped', 'It is always safe', 'You can use your phone while crossing'],
    answer: 1,
    explain: 'Even with a green signal, always confirm vehicles have actually stopped before stepping onto the road.',
  },
  {
    q: 'While walking near a road, you should...',
    options: ['Use headphones at low volume', 'Text a friend', 'Keep eyes and ears open, no headphones', 'Play a mobile game'],
    answer: 2,
    explain: 'Your senses are your safety tools. Headphones and phones take your attention away from traffic.',
  },
  {
    q: 'The safest place to wait for a school bus is...',
    options: ['On the road edge', 'At least three steps back from the kerb', 'In the middle of the road', 'Behind a parked car'],
    answer: 1,
    explain: 'Stand well back from the road so you cannot be hit if a vehicle comes too close. Wait until the bus stops fully.',
  },
];

export const busRoutes = [
  {
    id: 'bus7', number: '7', name: 'Lakeview Route', color: 'blue',
    driver: { name: 'Mr. Sharma', phone: '555-0142', experience: '12 years', rating: 4.9 },
    stops: [
      { name: 'Sunrise Apartments', time: '07:15', lat: 28.6135, lng: 77.2090 },
      { name: 'Maple Street', time: '07:22', lat: 28.6150, lng: 77.2100 },
      { name: 'Green Park Corner', time: '07:30', lat: 28.6170, lng: 77.2115 },
      { name: 'Lake Road Junction', time: '07:38', lat: 28.6190, lng: 77.2130 },
      { name: 'Sunrise Public School', time: '07:50', lat: 28.6210, lng: 77.2145 },
    ],
    capacity: 36,
  },
  {
    id: 'bus12', number: '12', name: 'Riverside Route', color: 'green',
    driver: { name: 'Ms. Verma', phone: '555-0188', experience: '8 years', rating: 4.8 },
    stops: [
      { name: 'Riverside Flats', time: '07:10', lat: 28.6100, lng: 77.2050 },
      { name: 'Old Bridge Stop', time: '07:18', lat: 28.6120, lng: 77.2070 },
      { name: 'Garden Market', time: '07:26', lat: 28.6140, lng: 77.2090 },
      { name: 'City Library', time: '07:34', lat: 28.6160, lng: 77.2110 },
      { name: 'Sunrise Public School', time: '07:48', lat: 28.6210, lng: 77.2145 },
    ],
    capacity: 32,
  },
  {
    id: 'bus21', number: '21', name: 'Hilltop Route', color: 'yellow',
    driver: { name: 'Mr. Khan', phone: '555-0167', experience: '15 years', rating: 5.0 },
    stops: [
      { name: 'Hilltop Residency', time: '07:05', lat: 28.6050, lng: 77.2000 },
      { name: 'Pine Avenue', time: '07:13', lat: 28.6080, lng: 77.2030 },
      { name: 'Community Hall', time: '07:21', lat: 28.6110, lng: 77.2060 },
      { name: 'Stadium Gate', time: '07:29', lat: 28.6140, lng: 77.2090 },
      { name: 'Sunrise Public School', time: '07:45', lat: 28.6210, lng: 77.2145 },
    ],
    capacity: 40,
  },
  {
    id: 'bus33', number: '33', name: 'Market Route', color: 'coral',
    driver: { name: 'Mrs. Iyer', phone: '555-0199', experience: '10 years', rating: 4.7 },
    stops: [
      { name: 'Main Market', time: '07:20', lat: 28.6180, lng: 77.2160 },
      { name: 'Town Square', time: '07:28', lat: 28.6190, lng: 77.2175 },
      { name: 'Hospital Road', time: '07:36', lat: 28.6200, lng: 77.2185 },
      { name: 'Sunrise Public School', time: '07:44', lat: 28.6210, lng: 77.2145 },
    ],
    capacity: 28,
  },
];

export const mapPoints = {
  // School and home defaults (used until student selects their own)
  home: { lat: 28.6135, lng: 77.2090, label: 'Home' },
  school: { lat: 28.6210, lng: 77.2145, label: 'Sunrise Public School' },
  // Safety points along the route
  crossings: [
    { lat: 28.6150, lng: 77.2100, name: 'Maple Street Crossing' },
    { lat: 28.6175, lng: 77.2120, name: 'Green Park Crossing' },
    { lat: 28.6195, lng: 77.2135, name: 'Lake Road Crossing' },
  ],
  speedZones: [
    { lat: 28.6145, lng: 77.2095, name: 'School Zone 30 km/h', radius: 120 },
    { lat: 28.6200, lng: 77.2140, name: 'School Zone 20 km/h', radius: 150 },
  ],
  accidentProne: [
    { lat: 28.6180, lng: 77.2125, name: 'Sharp bend — low visibility' },
  ],
  hospitals: [
    { lat: 28.6195, lng: 77.2165, name: 'City Care Hospital', phone: '555-0100' },
  ],
  police: [
    { lat: 28.6160, lng: 77.2110, name: 'Lake Road Police Station', phone: '555-0112' },
  ],
  busStops: [
    { lat: 28.6135, lng: 77.2090, name: 'Sunrise Apartments Stop' },
    { lat: 28.6170, lng: 77.2115, name: 'Green Park Stop' },
    { lat: 28.6210, lng: 77.2145, name: 'School Gate Stop' },
  ],
  safePlaces: [
    { lat: 28.6158, lng: 77.2108, name: '24/7 Mart (safe shelter)' },
    { lat: 28.6185, lng: 77.2130, name: 'Community Library' },
  ],
};

export const communityCategories = [
  { id: 'broken-road', icon: '🚧', label: 'Broken Road' },
  { id: 'street-light', icon: '💡', label: 'Damaged Street Light' },
  { id: 'waterlogging', icon: '💧', label: 'Waterlogging' },
  { id: 'animal', icon: '🐕', label: 'Dangerous Animal' },
  { id: 'suspicious', icon: '👁️', label: 'Suspicious Person' },
  { id: 'construction', icon: '🏗️', label: 'Construction Work' },
  { id: 'unsafe-area', icon: '⚠️', label: 'Unsafe Location' },
];

export const communitySeedReports = [
  { id: 'r-seed-1', category: 'broken-road', desc: 'Large pothole near Maple Street crossing, hard to see at night.', location: 'Maple Street', date: Date.now() - 86400000 * 2, status: 'verified' },
  { id: 'r-seed-2', category: 'street-light', desc: 'Street light not working on the lane beside Oak Park for 4 days.', location: 'Oak Park Lane', date: Date.now() - 86400000, status: 'pending' },
  { id: 'r-seed-3', category: 'waterlogging', desc: 'Water collects near the school gate after rain, slippery for children.', location: 'School Gate', date: Date.now() - 86400000 * 3, status: 'verified' },
];

export const achievements = [
  { id: 'safe-explorer', icon: '🧭', title: 'Safe Explorer', desc: 'Complete your first safe school journey.', check: (s) => s.journeysCompleted >= 1, progress: (s) => Math.min(s.journeysCompleted, 1) },
  { id: 'road-master', icon: '🚦', title: 'Road Sign Master', desc: 'Score 100% in the Traffic Signs Quiz.', check: (s) => s.bestRoadQuizScore >= 100, progress: (s) => s.bestRoadQuizScore },
  { id: 'safebuddy-pal', icon: '💙', title: 'SafeBuddy Pal', desc: 'Share your feelings with SafeBuddy AI.', check: (s) => s.safebuddyChats >= 1, progress: (s) => Math.min(s.safebuddyChats, 1) },
  { id: 'guardian-angel', icon: '🛡️', title: 'Guardian Angel', desc: 'Report a community road hazard.', check: (s) => s.reportsSubmitted >= 1, progress: (s) => Math.min(s.reportsSubmitted, 1) },
  { id: 'calm-breeze', icon: '🌬️', title: 'Calm Breeze', desc: 'Complete a 2-minute breathing exercise.', check: (s) => s.breathingMinutes >= 2, progress: (s) => Math.min(s.breathingMinutes, 2) },
  { id: 'safety-sentinel', icon: '⭐', title: 'Safety Sentinel', desc: 'Maintain a 7-day safe journey streak.', check: (s) => s.journeyStreak >= 7, progress: (s) => Math.min(s.journeyStreak, 7) },
];

export const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', score: 5 },
  { id: 'calm', emoji: '😌', label: 'Calm', score: 4 },
  { id: 'okay', emoji: '😐', label: 'Okay', score: 3 },
  { id: 'worried', emoji: '😟', label: 'Worried', score: 2 },
  { id: 'sad', emoji: '😢', label: 'Sad', score: 1 },
  { id: 'scared', emoji: '😨', label: 'Scared', score: 1 },
  { id: 'angry', emoji: '😠', label: 'Angry', score: 2 },
];

export const safetyScoreFactors = [
  { id: 'journey', label: 'Safe journeys', max: 30, getValue: (s) => Math.min(s.journeysCompleted * 6, 30) },
  { id: 'learning', label: 'Safety learning', max: 25, getValue: (s) => Math.min(s.quizzesCompleted * 5, 25) },
  { id: 'mood', label: 'Emotional wellbeing', max: 20, getValue: (s) => s.avgMood ? Math.round((s.avgMood / 5) * 20) : 10 },
  { id: 'reports', label: 'Community care', max: 15, getValue: (s) => Math.min(s.reportsSubmitted * 5, 15) },
  { id: 'breathing', label: 'Calm practice', max: 10, getValue: (s) => Math.min(s.breathingMinutes * 2, 10) },
];

// Default student profile
export const defaultProfile = {
  name: 'Aarav',
  grade: 'Class 8',
  rollNo: 'SS-2026-042',
  school: 'Sunrise Public School',
  busNo: '7',
  bloodGroup: 'O+',
  allergies: 'None',
  emergencyNumber: '555-0911',
  guardian: 'Mrs. Priya (Mother)',
  guardianPhone: '555-0123',
  trustedContacts: [
    { name: 'Mom (Priya)', relation: 'Mother', phone: '555-0123' },
    { name: 'Dad (Raj)', relation: 'Father', phone: '555-0124' },
    { name: 'Teacher (Ms. Nair)', relation: 'Class Teacher', phone: '555-0135' },
  ],
  avatarInitials: 'A',
};

// Default settings
export const defaultSettings = {
  notifications: true,
  sosLocationShare: true,
  dailyTips: true,
  moodReminders: true,
  safeBuddyAuto: true,
  animations: true,
  theme: 'soft',
};

console.log('[Student Safety AI] data.js loaded');
