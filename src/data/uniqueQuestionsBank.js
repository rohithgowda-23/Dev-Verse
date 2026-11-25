import {
  GLASS_BOMB_ITEMS,
  DUMMY_ITEMS,
  PACKET_ROUTING_ITEMS,
  ARRANGE_PROCESS_ITEMS,
} from './specialAndNewGamesData.js';
import {
  EXPANDED_MEMORY_DECKS,
  EXPANDED_ASSEMBLY_SCENARIOS,
} from './expandedGamesData.js';

export const GAME_TYPES = {
  SCRAMBLED_WORD: 'ScrambledWord',
  PAIR_MATCHING: 'PairMatching',
  CLICK_INVESTIGATION: 'ClickInvestigation',
  SUSPICIOUS_ROOM: 'SuspiciousRoom',
  ODD_ONE_OUT: 'OddOneOut',
  COMPUTER_ASSEMBLY: 'ComputerAssembly',
  MEMORY_GAME: 'MemoryGame',
  DUMMY_DECOY: 'DummyDecoy',
  PACKET_ROUTING: 'PacketRouting',
  ARRANGE_PROCESS: 'ArrangeProcess',
  GLASS_BOMB: 'GlassBomb',
};

function scrambleDeterministic(word, seed) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = (seed * 7 + i * 3) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.join('') === word) {
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
  }
  return arr;
}

// 7 Unique Scrambled Words
const SCRAMBLE_ITEMS = [
  { word: 'KERNEL', title: 'Core OS Kernel Unscrambler', hint: 'Central operating system component that manages CPU, memory, and hardware.' },
  { word: 'PROTOCOL', title: 'Transmission Rulebook Decode', hint: 'Standardized set of rules governing how devices communicate.' },
  { word: 'DATABASE', title: 'Structured Vault Recovery', hint: 'Organized collection of structured information stored electronically.' },
  { word: 'COMPILER', title: 'Code Translation Engine', hint: 'Translates high-level source code into machine-readable instructions.' },
  { word: 'ETHERNET', title: 'Wired LAN Standard', hint: 'Common wired networking technology connecting local computers.' },
  { word: 'CHECKSUM', title: 'Integrity Verification Digest', hint: 'Small value computed from data to detect accidental transmission errors.' },
  { word: 'SANDBOX', title: 'Isolated Execution Chamber', hint: 'Restricted testing environment used to run untrusted code safely.' },
];

// 7 Unique Odd One Out Puzzles (varied 6, 7, and 8 selectable boxes)
const ODD_ONE_OUT_ITEMS = [
  {
    title: 'Hardware vs. Malware Outlier',
    prompt: 'Five of these are physical computer hardware parts. Select the one item that is malicious software.',
    items: [
      { id: 'o1', label: 'CPU', detail: 'Central Processing Unit' },
      { id: 'o2', label: 'Trojan', detail: 'Disguised malicious program' },
      { id: 'o3', label: 'RAM', detail: 'System volatile memory' },
      { id: 'o4', label: 'NVMe SSD', detail: 'Solid-state storage drive' },
      { id: 'o5', label: 'Motherboard', detail: 'Main printed circuit board' },
      { id: 'o6', label: 'GPU', detail: 'Dedicated graphics processor' },
    ],
    correctItemId: 'o2',
  },
  {
    title: 'Network Protocol Audit',
    prompt: 'Seven of these are network communication protocols. Identify the single item that is a programming language.',
    items: [
      { id: 'o1', label: 'TCP', detail: 'Reliable transport layer' },
      { id: 'o2', label: 'FTP', detail: 'File transfer standard' },
      { id: 'o3', label: 'SMTP', detail: 'Email routing standard' },
      { id: 'o4', label: 'Python', detail: 'High-level scripting language' },
      { id: 'o5', label: 'SSH', detail: 'Encrypted remote shell' },
      { id: 'o6', label: 'DNS', detail: 'Domain name resolution' },
      { id: 'o7', label: 'UDP', detail: 'Low-latency datagram protocol' },
      { id: 'o8', label: 'ICMP', detail: 'Network diagnostic messaging' },
    ],
    correctItemId: 'o4',
  },
  {
    title: 'Linux Command Line Inspection',
    prompt: 'Seven of these are standard Linux shell commands. Select the item that is a web browser.',
    items: [
      { id: 'o1', label: 'ls', detail: 'List directory contents' },
      { id: 'o2', label: 'grep', detail: 'Search text patterns' },
      { id: 'o3', label: 'ps', detail: 'List active processes' },
      { id: 'o4', label: 'mkdir', detail: 'Create a directory' },
      { id: 'o5', label: 'Firefox', detail: 'Graphical web client' },
      { id: 'o6', label: 'pwd', detail: 'Print working directory' },
      { id: 'o7', label: 'top', detail: 'Monitor system CPU usage' },
      { id: 'o8', label: 'whoami', detail: 'Print current user name' },
    ],
    correctItemId: 'o5',
  },
  {
    title: 'Operating System Inventory',
    prompt: 'Five of these are operating systems. Identify the item that is a database query language.',
    items: [
      { id: 'o1', label: 'Ubuntu', detail: 'Debian-based Linux OS' },
      { id: 'o2', label: 'Windows 11', detail: 'Desktop OS by Microsoft' },
      { id: 'o3', label: 'macOS', detail: 'Apple desktop OS' },
      { id: 'o4', label: 'SQL', detail: 'Structured Query Language' },
      { id: 'o5', label: 'Fedora', detail: 'RPM-based Linux OS' },
      { id: 'o6', label: 'Debian', detail: 'Community Linux distribution' },
    ],
    correctItemId: 'o4',
  },
  {
    title: 'Storage Media Check',
    prompt: 'Six of these are data storage media. Identify the single item that is an output printer.',
    items: [
      { id: 'o1', label: 'NVMe SSD', detail: 'Flash PCIe storage' },
      { id: 'o2', label: 'SATA HDD', detail: 'Magnetic spinning drive' },
      { id: 'o3', label: 'SD Card', detail: 'Portable camera flash' },
      { id: 'o4', label: 'Laser Printer', detail: 'Paper document output device' },
      { id: 'o5', label: 'USB Flash', detail: 'Thumb drive storage' },
      { id: 'o6', label: 'LTO Tape', detail: 'Archival tape cartridge' },
      { id: 'o7', label: 'Blu-ray Disc', detail: 'Optical disc storage' },
    ],
    correctItemId: 'o4',
  },
  {
    title: 'Cloud Platforms Check',
    prompt: 'Seven of these are cloud or edge infrastructure providers. Identify the local desktop text editor.',
    items: [
      { id: 'o1', label: 'AWS', detail: 'Amazon Web Services' },
      { id: 'o2', label: 'Microsoft Azure', detail: 'Microsoft Cloud Platform' },
      { id: 'o3', label: 'Google Cloud', detail: 'GCP Infrastructure' },
      { id: 'o4', label: 'Cloudflare', detail: 'Global Edge & CDN' },
      { id: 'o5', label: 'Notepad++', detail: 'Local Windows Text Editor' },
      { id: 'o6', label: 'DigitalOcean', detail: 'Developer Cloud Droplets' },
      { id: 'o7', label: 'Linode', detail: 'Cloud Compute Provider' },
      { id: 'o8', label: 'Oracle Cloud', detail: 'OCI Infrastructure' },
    ],
    correctItemId: 'o5',
  },
  {
    title: 'Encryption Algorithm Check',
    prompt: 'Six of these are cryptographic encryption algorithms. Select the item that is a data interchange format.',
    items: [
      { id: 'o1', label: 'AES-256', detail: 'Symmetric block cipher' },
      { id: 'o2', label: 'RSA-4096', detail: 'Asymmetric public-key cipher' },
      { id: 'o3', label: 'ChaCha20', detail: 'High-speed stream cipher' },
      { id: 'o4', label: 'JSON', detail: 'JavaScript Object Notation' },
      { id: 'o5', label: 'Twofish', detail: 'Symmetric block cipher' },
      { id: 'o6', label: 'Blowfish', detail: 'Legacy symmetric cipher' },
      { id: 'o7', label: '3DES', detail: 'Triple Data Encryption Standard' },
    ],
    correctItemId: 'o4',
  },
];

// 7 Unique Click Investigation Environments
const CLICK_SCENES = [
  {
    title: 'Reception Lobby: Tailgating Log',
    sceneTitle: 'Main Lobby Check-In Desk',
    suspiciousName: 'Unverified Visitor Tablet',
    suspiciousDesc: 'Tablet shows an approved badge printed at 02:30 AM without any security escort signature.',
    clean: [
      { name: 'Badge Printer', desc: 'Standard thermal pass printer.' },
      { name: 'Potted Plant', desc: 'Lobby corner plant.' },
      { name: 'Reception Desk', desc: 'Front security counter.' },
      { name: 'Wall Clock', desc: 'Synchronized lobby clock.' },
    ],
  },
  {
    title: 'Server Rack Row B: Unauthorized KVM',
    sceneTitle: 'Colocation Rack Row B',
    suspiciousName: 'Unknown IP-KVM Adapter',
    suspiciousDesc: 'Unlabeled HDMI-to-Ethernet KVM dongle transmitting video outside the management VLAN.',
    clean: [
      { name: 'Rack Patch Panel', desc: '24-port labeled Cat6a panel.' },
      { name: 'Rack PDU', desc: 'Metered vertical power strip.' },
      { name: 'Cage Nut Tray', desc: 'Spare M6 mounting screws.' },
      { name: 'Temperature Probe', desc: 'Cold-aisle intake sensor.' },
    ],
  },
  {
    title: 'Night Shift SOC: Unlocked Terminal',
    sceneTitle: 'Security Operations Console',
    suspiciousName: 'Unlocked Admin Session',
    suspiciousDesc: 'Privilege escalation console left unlocked with no screen timeout after shift handover.',
    clean: [
      { name: 'Dual Monitors', desc: 'Status wall display panels.' },
      { name: 'Desk Phone', desc: 'VoIP hotline handset.' },
      { name: 'Incident Binder', desc: 'Printed escalation contacts.' },
      { name: 'Ceramic Mug', desc: 'Empty coffee mug.' },
    ],
  },
  {
    title: 'Ethernet Test Bench: Inline Tap',
    sceneTitle: 'Hardware Network Bench',
    suspiciousName: 'Concealed Inline Tap',
    suspiciousDesc: 'Unmarked passive tap inserted between the core switch uplink and wall jack.',
    clean: [
      { name: 'Oscilloscope', desc: 'Powered-off bench scope.' },
      { name: 'Patch Cord', desc: 'Standard 1m blue Cat6 cable.' },
      { name: 'Wire Stripper', desc: 'Insulated cable tool.' },
      { name: 'Label Maker', desc: 'Thermal port label printer.' },
    ],
  },
  {
    title: 'Conference Room: Abandoned Token',
    sceneTitle: 'Executive Briefing Room',
    suspiciousName: 'Unmarked Hardware Key',
    suspiciousDesc: 'Personal FIDO2 security token left plugged into the shared presentation podium.',
    clean: [
      { name: 'HDMI Projector', desc: 'Ceiling-mounted projector.' },
      { name: 'Whiteboard Marker', desc: 'Dry-erase marker tray.' },
      { name: 'Speakerphone', desc: 'Tabletop conference mic.' },
      { name: 'Water Carafe', desc: 'Glass water pitcher.' },
    ],
  },
  {
    title: 'Print Station: Badge Skimmer',
    sceneTitle: 'Corridor Print Bay',
    suspiciousName: 'Loose Badge Overlay',
    suspiciousDesc: 'Plastic RFID skimmer shell snapped over the printer’s employee badge tap pad.',
    clean: [
      { name: 'Laser Printer', desc: 'Standard workgroup printer.' },
      { name: 'Paper Tray', desc: 'A4 copy paper stack.' },
      { name: 'Toner Cartridge', desc: 'Sealed spare toner box.' },
      { name: 'Desk Stapler', desc: 'Heavy-duty office stapler.' },
    ],
  },
  {
    title: 'Wi-Fi Closet: Rogue Access Point',
    sceneTitle: 'Floor 3 Wiring Closet',
    suspiciousName: 'Unlisted Dual-Antenna AP',
    suspiciousDesc: 'Consumer travel router taped behind the shelf broadcasting an open "CorpGuest" SSID.',
    clean: [
      { name: 'Smoke Sensor', desc: 'Ceiling fire detector.' },
      { name: 'Patch Shelf', desc: 'Labeled fiber trunk tray.' },
      { name: 'Cable Comb', desc: 'Velcro cable organizer.' },
      { name: 'Rack UPS', desc: 'Battery backup unit.' },
    ],
  },
];

// 7 Unique Pair Matching Sets
const PAIR_SETS = [
  {
    title: 'Standard Network Ports',
    pairs: [
      { id: 'p1', term: 'Port 22', match: 'SSH Encrypted Shell' },
      { id: 'p2', term: 'Port 53', match: 'DNS Name Resolution' },
      { id: 'p3', term: 'Port 443', match: 'TLS Encrypted Web' },
      { id: 'p4', term: 'Port 123', match: 'NTP Clock Synchronization' },
    ],
  },
  {
    title: 'Cloud & Container Primitives',
    pairs: [
      { id: 'p1', term: 'Docker', match: 'Packages apps into portable containers' },
      { id: 'p2', term: 'Load Balancer', match: 'Distributes incoming traffic across servers' },
      { id: 'p3', term: 'CDN', match: 'Caches static assets at edge locations' },
      { id: 'p4', term: 'Kubernetes Pod', match: 'Smallest deployable compute unit' },
    ],
  },
  {
    title: 'OSI Layer Responsibilities',
    pairs: [
      { id: 'p1', term: 'Physical Layer', match: 'Transmits raw electrical or optical bits' },
      { id: 'p2', term: 'Data Link Layer', match: 'Handles MAC addressing and frame switching' },
      { id: 'p3', term: 'Network Layer', match: 'Routes IP packets across subnets' },
      { id: 'p4', term: 'Transport Layer', match: 'Provides end-to-end TCP/UDP delivery' },
    ],
  },
  {
    title: 'Database Indexing & Integrity',
    pairs: [
      { id: 'p1', term: 'Primary Key', match: 'Uniquely identifies each table row' },
      { id: 'p2', term: 'Foreign Key', match: 'Links rows across related tables' },
      { id: 'p3', term: 'B-Tree Index', match: 'Accelerates sorted range lookups' },
      { id: 'p4', term: 'ACID Transaction', match: 'Guarantees atomic all-or-nothing commits' },
    ],
  },
  {
    title: 'Authentication & Access Control',
    pairs: [
      { id: 'p1', term: 'MFA', match: 'Requires two or more verification factors' },
      { id: 'p2', term: 'RBAC', match: 'Assigns permissions based on user roles' },
      { id: 'p3', term: 'JWT', match: 'Signed compact token carrying claims' },
      { id: 'p4', term: 'Least Privilege', match: 'Grants only minimum required access' },
    ],
  },
  {
    title: 'Malware Behavior Profiles',
    pairs: [
      { id: 'p1', term: 'Worm', match: 'Self-replicates across networks autonomously' },
      { id: 'p2', term: 'Rootkit', match: 'Conceals malicious presence inside the OS' },
      { id: 'p3', term: 'Ransomware', match: 'Locks data and demands payment' },
      { id: 'p4', term: 'Trojan', match: 'Disguises malware as legitimate software' },
    ],
  },
  {
    title: 'Git Collaboration Concepts',
    pairs: [
      { id: 'p1', term: 'Branch', match: 'Isolated line of parallel development' },
      { id: 'p2', term: 'Pull Request', match: 'Proposes and reviews code before merging' },
      { id: 'p3', term: 'Merge Conflict', match: 'Competing edits on the same lines' },
      { id: 'p4', term: 'Cherry-Pick', match: 'Applies one specific commit onto a branch' },
    ],
  },
];

// 6 Genuinely Distinct 3D Suspicious Room Scenarios
const ROOM_SCENARIOS = [
  {
    title: '3D Room #01: Obstructed CCTV Feed',
    suspiciousId: 'cctv',
    hotspots: {
      computer: { label: 'Workstation', desc: 'Display is locked on the standard idle screen.' },
      desk: { label: 'Entry Desk', desc: 'Visitor logbook matches today’s reception roster.' },
      documents: { label: 'Desk Reference', desc: 'Laminated emergency phone directory.' },
      cctv: { label: 'CCTV Camera', desc: 'SUSPICIOUS: Lens is masked with black tape and feed dropped at 02:14 AM.' },
      storage: { label: 'Rack Cabinet', desc: 'Cabinet door is latched and tamper seal is intact.' },
    },
  },
  {
    title: '3D Room #02: Rogue Workstation Script',
    suspiciousId: 'computer',
    hotspots: {
      computer: { label: 'Analyst Terminal', desc: 'SUSPICIOUS: Hidden background daemon is exfiltrating telemetry to an external IP.' },
      desk: { label: 'Entry Desk', desc: 'Clean steel desk with an authorized badge holder.' },
      documents: { label: 'Desk Reference', desc: 'Public campus map and shift schedule.' },
      cctv: { label: 'CCTV Camera', desc: 'Recording normally with green status LED.' },
      storage: { label: 'Rack Cabinet', desc: 'Locked backup vault with verified seal.' },
    },
  },
  {
    title: '3D Room #03: Breached Backup Vault',
    suspiciousId: 'storage',
    hotspots: {
      computer: { label: 'Workstation', desc: 'Screen locked; last login verified by shift lead.' },
      desk: { label: 'Entry Desk', desc: 'Standard equipment checkout clipboard.' },
      documents: { label: 'Desk Reference', desc: 'Hardware warranty booklet.' },
      cctv: { label: 'CCTV Camera', desc: 'Active 1080p stream with clear lens.' },
      storage: { label: 'Backup Cabinet', desc: 'SUSPICIOUS: Security padlock is pried open and two cold-backup drives are missing.' },
    },
  },
  {
    title: '3D Room #04: Exposed Recovery Sheet',
    suspiciousId: 'documents',
    hotspots: {
      computer: { label: 'Workstation', desc: 'Powered down cleanly at 18:00.' },
      desk: { label: 'Entry Desk', desc: 'Standard wrist rest and optical mouse.' },
      documents: { label: 'Printed Sheet', desc: 'SUSPICIOUS: Unencrypted master recovery passphrase printed face-up on the desk.' },
      cctv: { label: 'CCTV Camera', desc: 'Normal infrared night-vision recording.' },
      storage: { label: 'Rack Cabinet', desc: 'Sealed and locked.' },
    },
  },
  {
    title: '3D Room #05: Cloned Access Badge',
    suspiciousId: 'desk',
    hotspots: {
      computer: { label: 'Workstation', desc: 'Standard BIOS setup screen, no network activity.' },
      desk: { label: 'Visitor Badge', desc: 'SUSPICIOUS: Blank white RFID card with handwritten admin ID taped over a real badge.' },
      documents: { label: 'Desk Reference', desc: 'Blank notepad and pen.' },
      cctv: { label: 'CCTV Camera', desc: 'Steady green indicator; stream healthy.' },
      storage: { label: 'Rack Cabinet', desc: 'Padlock intact.' },
    },
  },
  {
    title: '3D Room #06: Unauthorized Network Bridge',
    suspiciousId: 'computer',
    hotspots: {
      computer: { label: 'Workstation NIC', desc: 'SUSPICIOUS: Dual-homed USB Ethernet dongle bridging internal LAN to an unknown hotspot.' },
      desk: { label: 'Entry Desk', desc: 'Standard keyboard and monitor stand.' },
      documents: { label: 'Desk Reference', desc: 'Routine maintenance checklist.' },
      cctv: { label: 'CCTV Camera', desc: 'Lens clear and recording.' },
      storage: { label: 'Rack Cabinet', desc: 'Door locked; no anomalies.' },
    },
  },
];

function buildRoomQuestion(id, lane, scenario) {
  const positions = {
    computer: [0, 1.28, -1.05],
    desk: [-0.95, 0.9, -0.75],
    documents: [0.9, 0.9, -0.8],
    cctv: [-1.45, 2.55, -2.95],
    storage: [2.2, 1.0, -2.0],
  };

  return {
    id,
    lane,
    gameType: GAME_TYPES.SUSPICIOUS_ROOM,
    title: scenario.title,
    briefing: {
      missionDescription: `Inspect ${scenario.title} in interactive 3D space.`,
      objective: 'Rotate the 3D room, inspect all 5 objects, and flag the single suspicious anomaly.',
      whatToDo: 'Click each object marker in the 3D room to read its forensic inspection note.',
      howToInteract: 'Drag to orbit the 3D camera, click markers, then press Flag as Suspicious.',
      completionCondition: 'Flagging the exact suspicious object completes this stage.',
    },
    payload: {
      roomTitle: scenario.title,
      hotspots: Object.entries(scenario.hotspots).map(([hid, meta]) => ({
        id: hid,
        label: meta.label,
        description: meta.desc,
        position: positions[hid],
        isSuspicious: scenario.suspiciousId === hid,
      })),
    },
  };
}

// EXACTLY 75 UNIQUE QUESTIONS
// Distribution:
// MemoryMatching: 7, ClickInvestigation: 7, GlassBomb: 7, PairMatching: 7,
// ComputerAssembly: 7, DummyDecoy: 7, ArrangeProcess: 7, OddOneOut: 7,
// SuspiciousRoom: 6, PacketRouting: 6, ScrambledWord: 7 => TOTAL = 75
const POOL_75 = [
  ...Array(7).fill(GAME_TYPES.MEMORY_GAME),
  ...Array(7).fill(GAME_TYPES.CLICK_INVESTIGATION),
  ...Array(7).fill(GAME_TYPES.GLASS_BOMB),
  ...Array(7).fill(GAME_TYPES.PAIR_MATCHING),
  ...Array(7).fill(GAME_TYPES.COMPUTER_ASSEMBLY),
  ...Array(7).fill(GAME_TYPES.DUMMY_DECOY),
  ...Array(7).fill(GAME_TYPES.ARRANGE_PROCESS),
  ...Array(7).fill(GAME_TYPES.ODD_ONE_OUT),
  ...Array(6).fill(GAME_TYPES.SUSPICIOUS_ROOM),
  ...Array(6).fill(GAME_TYPES.PACKET_ROUTING),
  ...Array(7).fill(GAME_TYPES.SCRAMBLED_WORD),
];

export function buildAll75Questions() {
  const cursors = {
    [GAME_TYPES.SCRAMBLED_WORD]: 0,
    [GAME_TYPES.PAIR_MATCHING]: 0,
    [GAME_TYPES.ODD_ONE_OUT]: 0,
    [GAME_TYPES.COMPUTER_ASSEMBLY]: 0,
    [GAME_TYPES.CLICK_INVESTIGATION]: 0,
    [GAME_TYPES.SUSPICIOUS_ROOM]: 0,
    [GAME_TYPES.MEMORY_GAME]: 0,
    [GAME_TYPES.DUMMY_DECOY]: 0,
    [GAME_TYPES.PACKET_ROUTING]: 0,
    [GAME_TYPES.ARRANGE_PROCESS]: 0,
    [GAME_TYPES.GLASS_BOMB]: 0,
  };

  const result = [];

  for (let i = 0; i < POOL_75.length; i += 1) {
    const gameType = POOL_75[i];
    const itemIdx = cursors[gameType];
    cursors[gameType] += 1;

    const lane = (i % 4) + 1;
    const id = `q-${String(i + 1).padStart(2, '0')}`;

    if (gameType === GAME_TYPES.SCRAMBLED_WORD) {
      const item = SCRAMBLE_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: item.title,
        briefing: {
          missionDescription: `Intercepted log #${i + 1} contains a scrambled ${item.word.length}-letter technical keyword.`,
          objective: 'Rearrange the scrambled letters to form the exact technical term.',
          whatToDo: 'Place all letter tiles into the answer slots in the right order and submit.',
          howToInteract: 'Tap or drag letter tiles into the empty slots. Tap a placed letter to return it.',
          completionCondition: `Form the valid ${item.word.length}-letter word matching the clue.`,
        },
        payload: {
          answer: item.word,
          hint: item.hint,
          scrambledLetters: scrambleDeterministic(item.word, itemIdx + 1),
        },
      });
    } else if (gameType === GAME_TYPES.PAIR_MATCHING) {
      const item = PAIR_SETS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: item.title,
        briefing: {
          missionDescription: `Reference table #${i + 1} was fragmented during a system reboot.`,
          objective: 'Match all four terms on the left with their exact descriptions on the right.',
          whatToDo: 'Select one term card and pair it with its matching description until all 4 pairs are linked.',
          howToInteract: 'Tap a term on the left, then tap its matching description on the right.',
          completionCondition: 'Link all 4 pairs accurately to complete this stage.',
        },
        payload: { pairs: item.pairs },
      });
    } else if (gameType === GAME_TYPES.ODD_ONE_OUT) {
      const item = ODD_ONE_OUT_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: item.title,
        briefing: {
          missionDescription: `Audit panel #${i + 1} displays ${item.items.length} items, with one clear outlier.`,
          objective: 'Identify the single item that does not belong to the technical group.',
          whatToDo: 'Compare every card carefully and select the one outlier.',
          howToInteract: 'Tap the odd item card, then press Verify Selection.',
          completionCondition: 'Selecting the true outlier completes this stage.',
        },
        payload: {
          prompt: item.prompt,
          items: item.items,
          correctItemId: item.correctItemId,
        },
      });
    } else if (gameType === GAME_TYPES.COMPUTER_ASSEMBLY) {
      const scenario = EXPANDED_ASSEMBLY_SCENARIOS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: scenario.title,
        briefing: {
          missionDescription: `Hardware bay #${i + 1} (${scenario.blueprintTitle}) has 12 unassigned components.`,
          objective: 'Install all 12 hardware parts into their matching chassis slots.',
          whatToDo: 'Drag or tap each component from the left tray into its correct slot on the right.',
          howToInteract: 'Drag onto a slot or tap a component then tap its slot. Use Reset to start over.',
          completionCondition: 'Correctly install all 12 components to complete this stage.',
        },
        payload: {
          blueprintTitle: scenario.blueprintTitle,
          instructionText: scenario.instructionText,
          components: scenario.components,
          slots: scenario.slots,
        },
      });
    } else if (gameType === GAME_TYPES.CLICK_INVESTIGATION) {
      const scene = CLICK_SCENES[itemIdx];
      const coords = [
        [48, 34],
        [78, 42],
        [20, 70],
        [58, 72],
        [26, 30],
      ];
      const suspPos = (itemIdx * 2 + 1) % 5;
      const targets = [];
      let cleanCursor = 0;
      for (let t = 0; t < 5; t += 1) {
        const [x, y] = coords[t];
        if (t === suspPos) {
          targets.push({
            id: 'susp',
            name: scene.suspiciousName,
            x,
            y,
            isSuspicious: true,
            description: scene.suspiciousDesc,
          });
        } else {
          const cl = scene.clean[cleanCursor++];
          targets.push({
            id: `c${cleanCursor}`,
            name: cl.name,
            x,
            y,
            isSuspicious: false,
            description: cl.desc,
          });
        }
      }
      result.push({
        id,
        lane,
        gameType,
        title: scene.title,
        briefing: {
          missionDescription: `Room inspection #${i + 1} (${scene.sceneTitle}) requires locating one security anomaly.`,
          objective: 'Inspect all objects in the scene and flag the suspicious item.',
          whatToDo: 'Click each hotspot marker to read its forensic inspection note.',
          howToInteract: 'Select the suspicious marker and press Flag Selected Anomaly.',
          completionCondition: 'Flagging the exact suspicious object completes this stage.',
        },
        payload: { sceneTitle: scene.sceneTitle, objects: targets },
      });
    } else if (gameType === GAME_TYPES.SUSPICIOUS_ROOM) {
      result.push(buildRoomQuestion(id, lane, ROOM_SCENARIOS[itemIdx]));
    } else if (gameType === GAME_TYPES.MEMORY_GAME) {
      const deck = EXPANDED_MEMORY_DECKS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: deck.title,
        briefing: {
          missionDescription: `Security cache #${i + 1} (${deck.themeLabel}) requires matching all 10 pairs.`,
          objective: 'Flip two cards at a time until all 10 pairs (20 cards) are matched.',
          whatToDo: 'Tap face-down cards to reveal and pair matching concepts or symbols.',
          howToInteract: 'Tap any two cards to flip them. Matched pairs remain open.',
          completionCondition: 'Match all 10 pairs (20 cards) to complete this stage.',
        },
        payload: { cards: deck.cards, themeLabel: deck.themeLabel },
      });
    } else if (gameType === GAME_TYPES.DUMMY_DECOY) {
      const dummy = DUMMY_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: dummy.title,
        briefing: {
          missionDescription: `Forensic packet #${i + 1} contains multiple records, including one planted dummy/decoy.`,
          objective: 'Inspect every evidence card and flag the single misleading decoy.',
          whatToDo: 'Click each card to inspect its technical metadata and find the impossible or fake entry.',
          howToInteract: 'Select the decoy card and press Flag as Dummy / Decoy.',
          completionCondition: 'Flagging the exact decoy item completes this stage.',
        },
        payload: dummy,
      });
    } else if (gameType === GAME_TYPES.PACKET_ROUTING) {
      const pr = PACKET_ROUTING_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: pr.title,
        briefing: {
          missionDescription: `Network topology #${i + 1} requires routing a packet safely across healthy nodes.`,
          objective: 'Select the valid sequence of network nodes from source to destination.',
          whatToDo: 'Click nodes in order while avoiding offline, restricted, or faulty nodes.',
          howToInteract: 'Tap nodes in sequence to build the path, then press Transmit Packet.',
          completionCondition: 'Transmitting along the exact valid route completes this stage.',
        },
        payload: pr,
      });
    } else if (gameType === GAME_TYPES.ARRANGE_PROCESS) {
      const proc = ARRANGE_PROCESS_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: proc.title,
        briefing: {
          missionDescription: `Procedure log #${i + 1} has its technical steps out of order.`,
          objective: 'Arrange all steps into the exact chronological sequence.',
          whatToDo: 'Reorder the shuffled steps from Step 1 to Step 4.',
          howToInteract: 'Drag and drop steps or use the Up/Down arrow buttons, then press Verify Sequence.',
          completionCondition: 'Submitting the complete correct order completes this stage.',
        },
        payload: proc,
      });
    } else if (gameType === GAME_TYPES.GLASS_BOMB) {
      const gb = GLASS_BOMB_ITEMS[itemIdx];
      result.push({
        id,
        lane,
        gameType,
        title: gb.title,
        briefing: {
          missionDescription: `Glass Bomb Chamber #${i + 1} has 15 identical glass containers, with one hidden bomb and one safe key.`,
          objective: 'Use the logic clue to click the exact safe glass without triggering 4 wrong attempts.',
          whatToDo: 'Read the clue, inspect a glass one at a time, and open the safe glass.',
          howToInteract: 'Tap any glass container to reveal what is underneath. 4 mistakes trigger a 2-minute lockout.',
          completionCondition: 'Revealing the safe glass completes this stage.',
        },
        payload: {
          glassCount: gb.glassCount,
          safeIndex: gb.safeIndex,
          clueText: gb.clueText,
          lockoutDurationSeconds: 120,
        },
      });
    }
  }

  return result;
}
