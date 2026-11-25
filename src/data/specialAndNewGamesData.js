// 7 Unique Glass Bomb Scenarios (EXACTLY 15 glasses per row, 1 random bomb, 1 safe target)
export const GLASS_BOMB_ITEMS = [
  {
    title: 'Glass Bomb #01: Prime Safe Cell',
    glassCount: 15,
    safeIndex: 6, // Glass #7
    clueText: '15 glasses (#1–#15). The safe glass number is the only prime number strictly between 5 and 10.',
  },
  {
    title: 'Glass Bomb #02: Odd Square Vault',
    glassCount: 15,
    safeIndex: 8, // Glass #9
    clueText: '15 glasses (#1–#15). The safe glass is an ODD perfect square greater than 4.',
  },
  {
    title: 'Glass Bomb #03: Even Multiple of Seven',
    glassCount: 15,
    safeIndex: 13, // Glass #14
    clueText: '15 glasses (#1–#15). The safe glass is an EVEN multiple of 7.',
  },
  {
    title: 'Glass Bomb #04: Fibonacci Thirteen',
    glassCount: 15,
    safeIndex: 12, // Glass #13
    clueText: '15 glasses (#1–#15). Pick the Fibonacci number that directly follows 5 and 8.',
  },
  {
    title: 'Glass Bomb #05: Factorial Six',
    glassCount: 15,
    safeIndex: 5, // Glass #6
    clueText: '15 glasses (#1–#15). The safe glass equals 3 factorial (3 × 2 × 1).',
  },
  {
    title: 'Glass Bomb #06: Cube of Two',
    glassCount: 15,
    safeIndex: 7, // Glass #8
    clueText: '15 glasses (#1–#15). The safe glass number is 2 cubed (2 × 2 × 2).',
  },
  {
    title: 'Glass Bomb #07: Smaller Twin Prime',
    glassCount: 15,
    safeIndex: 10, // Glass #11
    clueText: '15 glasses (#1–#15). Pick the smaller of the two twin primes between 10 and 14.',
  },
];

// 7 Unique Dummy / Decoy Investigation Scenarios
export const DUMMY_ITEMS = [
  {
    title: 'Evidence Audit #01: Impossible IPv4 Log',
    prompt: 'Five network log entries were collected from Router 01. One is a fabricated decoy with an impossible IPv4 address.',
    evidenceCards: [
      { id: 'd1', title: 'Log Entry A', summary: '192.168.1.14 → Port 443', detail: 'Source: 192.168.1.14 | Dest: 10.0.0.5 | Protocol: TLS' },
      { id: 'd2', title: 'Log Entry B', summary: '192.168.1.310 → Port 22', detail: 'Source: 192.168.1.310 | Dest: 10.0.0.8 | Octet 310 exceeds 255' },
      { id: 'd3', title: 'Log Entry C', summary: '10.0.4.22 → Port 53', detail: 'Source: 10.0.4.22 | Dest: 10.0.0.2 | Protocol: DNS' },
      { id: 'd4', title: 'Log Entry D', summary: '172.16.0.9 → Port 123', detail: 'Source: 172.16.0.9 | Dest: 10.0.0.5 | Protocol: NTP' },
      { id: 'd5', title: 'Log Entry E', summary: '192.168.1.88 → Port 22', detail: 'Source: 192.168.1.88 | Dest: 10.0.0.9 | Protocol: SSH' },
    ],
    decoyId: 'd2',
  },
  {
    title: 'Evidence Audit #02: Forged Timestamp',
    prompt: 'Examine five server access records. One record is a planted dummy containing an impossible 24-hour clock timestamp.',
    evidenceCards: [
      { id: 'd1', title: 'Auth #1', summary: '09:14:22 UTC', detail: 'User: svc_backup | Action: Read snapshot' },
      { id: 'd2', title: 'Auth #2', summary: '14:05:09 UTC', detail: 'User: admin_01 | Action: Rotate key' },
      { id: 'd3', title: 'Auth #3', summary: '23:59:58 UTC', detail: 'User: cron_job | Action: Sync clock' },
      { id: 'd4', title: 'Auth #4', summary: '25:61:12 UTC', detail: 'User: unknown | Invalid hour 25 and minute 61' },
      { id: 'd5', title: 'Auth #5', summary: '00:02:19 UTC', detail: 'User: monitor | Action: Heartbeat OK' },
    ],
    decoyId: 'd4',
  },
  {
    title: 'Evidence Audit #03: Corrupted MAC Address',
    prompt: 'Five hardware NIC records were logged. Identify the decoy containing non-hexadecimal characters in its MAC address.',
    evidenceCards: [
      { id: 'd1', title: 'NIC-01', summary: '00:1A:2B:3C:4D:5E', detail: 'Valid 48-bit hexadecimal MAC address.' },
      { id: 'd2', title: 'NIC-02', summary: 'A4:5E:60:C1:9F:02', detail: 'Valid 48-bit hexadecimal MAC address.' },
      { id: 'd3', title: 'NIC-03', summary: 'F8:32:E4:7B:10:9A', detail: 'Valid 48-bit hexadecimal MAC address.' },
      { id: 'd4', title: 'NIC-04', summary: '12:4G:9Z:00:AB:CD', detail: 'Contains invalid non-hex letters G and Z.' },
      { id: 'd5', title: 'NIC-05', summary: '3C:52:82:44:19:EF', detail: 'Valid 48-bit hexadecimal MAC address.' },
    ],
    decoyId: 'd4',
  },
  {
    title: 'Evidence Audit #04: Impossible Subnet Mask',
    prompt: 'Five IPv4 subnet masks were exported. Identify the decoy mask that cannot be a valid contiguous subnet mask.',
    evidenceCards: [
      { id: 'd1', title: 'Mask A', summary: '255.255.255.0', detail: 'Standard /24 subnet mask.' },
      { id: 'd2', title: 'Mask B', summary: '255.255.0.0', detail: 'Standard /16 subnet mask.' },
      { id: 'd3', title: 'Mask C', summary: '255.0.255.0', detail: 'Non-contiguous 0 between 255 octets — invalid IPv4 mask.' },
      { id: 'd4', title: 'Mask D', summary: '255.255.255.128', detail: 'Standard /25 subnet mask.' },
      { id: 'd5', title: 'Mask E', summary: '255.0.0.0', detail: 'Standard /8 subnet mask.' },
    ],
    decoyId: 'd3',
  },
  {
    title: 'Evidence Audit #05: Fake Memory Capacity',
    prompt: 'Five workstation RAM inventory tags were submitted. Flag the decoy tag with an impossible capacity unit.',
    evidenceCards: [
      { id: 'd1', title: 'Unit 1', summary: '16 GB DDR5', detail: 'Standard dual-channel workstation RAM.' },
      { id: 'd2', title: 'Unit 2', summary: '32 GB DDR4', detail: 'Standard developer workstation RAM.' },
      { id: 'd3', title: 'Unit 3', summary: '64 GB ECC', detail: 'Standard server workstation RAM.' },
      { id: 'd4', title: 'Unit 4', summary: '16 GHz DDR5', detail: 'GHz measures clock frequency, not RAM storage capacity.' },
      { id: 'd5', title: 'Unit 5', summary: '8 GB DDR4', detail: 'Entry-level workstation RAM.' },
    ],
    decoyId: 'd4',
  },
  {
    title: 'Evidence Audit #06: Impossible TCP Port',
    prompt: 'Six socket bindings were captured. Flag the decoy binding whose port exceeds the 16-bit TCP maximum (65535).',
    evidenceCards: [
      { id: 'd1', title: 'Socket 1', summary: '0.0.0.0:443', detail: 'Valid TLS listener port.' },
      { id: 'd2', title: 'Socket 2', summary: '127.0.0.1:5432', detail: 'Valid PostgreSQL local listener.' },
      { id: 'd3', title: 'Socket 3', summary: '10.0.0.4:72400', detail: 'Port 72400 exceeds the 16-bit TCP ceiling of 65535.' },
      { id: 'd4', title: 'Socket 4', summary: '127.0.0.1:6379', detail: 'Valid Redis cache listener.' },
      { id: 'd5', title: 'Socket 5', summary: '0.0.0.0:22', detail: 'Valid SSH daemon listener.' },
      { id: 'd6', title: 'Socket 6', summary: '10.0.0.8:8080', detail: 'Valid alternate proxy port.' },
    ],
    decoyId: 'd3',
  },
  {
    title: 'Evidence Audit #07: Invalid CIDR Prefix',
    prompt: 'Six IPv4 routing prefixes were exported. Identify the decoy whose CIDR prefix exceeds 32 bits.',
    evidenceCards: [
      { id: 'd1', title: 'Route A', summary: '10.0.0.0/8', detail: 'Valid Class A private block.' },
      { id: 'd2', title: 'Route B', summary: '172.16.0.0/12', detail: 'Valid RFC1918 private block.' },
      { id: 'd3', title: 'Route C', summary: '192.168.1.0/24', detail: 'Valid Class C subnet.' },
      { id: 'd4', title: 'Route D', summary: '10.4.0.1/32', detail: 'Valid single-host IPv4 route.' },
      { id: 'd5', title: 'Route E', summary: '192.168.9.0/40', detail: 'IPv4 addresses are only 32 bits wide; /40 is impossible.' },
      { id: 'd6', title: 'Route F', summary: '10.10.0.0/16', detail: 'Valid /16 subnet allocation.' },
    ],
    decoyId: 'd5',
  },
];

// 6 Unique Packet Routing Challenges (Distinct Network Topologies)
export const PACKET_ROUTING_ITEMS = [
  {
    title: 'Packet Route #01: Bypass Offline Switch',
    prompt: 'Click nodes in order to route a packet from Workstation A to Vault Server, avoiding the offline Switch B.',
    nodes: [
      { id: 'pc', label: 'Workstation A', info: 'Source: 10.0.1.5' },
      { id: 'swA', label: 'Switch A', info: 'Healthy (1ms)' },
      { id: 'swB', label: 'Switch B', info: 'OFFLINE / Dropped' },
      { id: 'rt1', label: 'Core Router', info: 'Active Gateway' },
      { id: 'srv', label: 'Vault Server', info: 'Target: 10.0.9.10' },
    ],
    validRoute: ['pc', 'swA', 'rt1', 'srv'],
  },
  {
    title: 'Packet Route #02: DNS Resolution Path',
    prompt: 'Click the exact sequence to resolve a domain: Browser → Local Cache → DNS Resolver → Web Server.',
    nodes: [
      { id: 'br', label: 'Browser', info: 'Requests devverse.org' },
      { id: 'cache', label: 'Local Cache', info: 'Cache Miss' },
      { id: 'printer', label: 'Print Spooler', info: 'Unrelated Device' },
      { id: 'dns', label: 'DNS Resolver', info: 'Returns IP Address' },
      { id: 'web', label: 'Web Server', info: 'Serves Application' },
    ],
    validRoute: ['br', 'cache', 'dns', 'web'],
  },
  {
    title: 'Packet Route #03: Incident Containment',
    prompt: 'Route the quarantine command from Admin Console → Core Controller → Infected Host.',
    nodes: [
      { id: 'adm', label: 'Admin Console', info: 'Issues Isolation' },
      { id: 'ctrl', label: 'Core Controller', info: 'Enforces VLAN Block' },
      { id: 'guest', label: 'Cafeteria AP', info: 'Unrelated Access Point' },
      { id: 'host', label: 'Infected Host', info: 'Target Quarantine' },
    ],
    validRoute: ['adm', 'ctrl', 'host'],
  },
  {
    title: 'Packet Route #04: Fiber Failover Path',
    prompt: 'Route backup traffic across healthy links: Edge Gateway → Primary Fiber Ring → Backup Core → Cloud Storage, avoiding Congested Copper.',
    nodes: [
      { id: 'edge', label: 'Edge Gateway', info: 'Ingress Router' },
      { id: 'copper', label: 'Congested Copper', info: '99% Packet Loss' },
      { id: 'fiber', label: 'Primary Fiber Ring', info: '10Gbps Healthy' },
      { id: 'core', label: 'Backup Core', info: 'Redundant Spine' },
      { id: 'cloud', label: 'Cloud Storage', info: 'Archive Target' },
    ],
    validRoute: ['edge', 'fiber', 'core', 'cloud'],
  },
  {
    title: 'Packet Route #05: Zero-Trust Service Call',
    prompt: 'Construct the authorized microservice call: API Client → Identity Broker → Policy Engine → Billing Service.',
    nodes: [
      { id: 'client', label: 'API Client', info: 'Signed Request' },
      { id: 'legacy', label: 'Legacy Proxy', info: 'Deprecated / Blocked' },
      { id: 'idp', label: 'Identity Broker', info: 'Verifies Token' },
      { id: 'policy', label: 'Policy Engine', info: 'Checks RBAC Scope' },
      { id: 'billing', label: 'Billing Service', info: 'Target Endpoint' },
    ],
    validRoute: ['client', 'idp', 'policy', 'billing'],
  },
  {
    title: 'Packet Route #06: Telemetry Alert Pipeline',
    prompt: 'Connect the real-time monitoring pipeline: Sensor Hub → Message Queue → Stream Processor → Alert Dashboard.',
    nodes: [
      { id: 'sensor', label: 'Sensor Hub', info: 'Emits Rack Metrics' },
      { id: 'devsink', label: 'Unmonitored Dev Sink', info: 'Drops Alerts' },
      { id: 'queue', label: 'Message Queue', info: 'Buffers Events' },
      { id: 'stream', label: 'Stream Processor', info: 'Detects Anomalies' },
      { id: 'dash', label: 'Alert Dashboard', info: 'Notifies On-Call' },
    ],
    validRoute: ['sensor', 'queue', 'stream', 'dash'],
  },
];

// 7 Unique Arrange the Process Challenges
export const ARRANGE_PROCESS_ITEMS = [
  {
    title: 'Process #01: Computer Boot Sequence',
    prompt: 'Arrange the 4 stages of starting a computer from power-on to user desktop.',
    shuffledSteps: [
      { id: 's3', label: 'Bootloader loads the Operating System kernel' },
      { id: 's1', label: 'Power Supply sends power to the Motherboard' },
      { id: 's4', label: 'User login screen appears' },
      { id: 's2', label: 'BIOS/UEFI runs Power-On Self Test (POST)' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #02: Git Commit & Push Workflow',
    prompt: 'Arrange the 4 Git actions in the proper order to publish local code changes.',
    shuffledSteps: [
      { id: 's3', label: 'git commit -m "Save changes"' },
      { id: 's1', label: 'Modify source code locally' },
      { id: 's4', label: 'git push origin main' },
      { id: 's2', label: 'git add .' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #03: Incident Response Lifecycle',
    prompt: 'Order the 4 cybersecurity incident-response phases from start to finish.',
    shuffledSteps: [
      { id: 's4', label: 'Recovery & Post-Incident Lessons Learned' },
      { id: 's2', label: 'Detection & Analysis of the Threat' },
      { id: 's1', label: 'Preparation & Monitoring Setup' },
      { id: 's3', label: 'Containment & Eradication' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #04: Secure Password Verification',
    prompt: 'Arrange how a backend safely verifies a user login password.',
    shuffledSteps: [
      { id: 's4', label: 'Compare computed hash with stored hash' },
      { id: 's2', label: 'Retrieve user’s stored salt and hash' },
      { id: 's1', label: 'User submits username and password' },
      { id: 's3', label: 'Hash submitted password with the salt' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #05: Network Cable Troubleshooting',
    prompt: 'Order these 4 troubleshooting steps from physical check to browser check.',
    shuffledSteps: [
      { id: 's3', label: 'Ping the default gateway IP' },
      { id: 's1', label: 'Check that the Ethernet cable is plugged in' },
      { id: 's4', label: 'Test loading the web page in a browser' },
      { id: 's2', label: 'Verify the NIC link light is glowing' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #06: Two-Factor Login Flow',
    prompt: 'Arrange the 4 steps of signing in with Two-Factor Authentication (2FA).',
    shuffledSteps: [
      { id: 's4', label: 'Session granted to user dashboard' },
      { id: 's2', label: 'System verifies primary password' },
      { id: 's1', label: 'User enters username and password' },
      { id: 's3', label: 'User enters 6-digit OTP from authenticator' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
  {
    title: 'Process #07: CI/CD Release Pipeline',
    prompt: 'Arrange the 4 automated deployment stages from code push to live production.',
    shuffledSteps: [
      { id: 's3', label: 'Build and tag production container image' },
      { id: 's1', label: 'Developer pushes commit to main branch' },
      { id: 's4', label: 'Roll out container to production cluster' },
      { id: 's2', label: 'Automated runner executes unit & lint tests' },
    ],
    correctOrderIds: ['s1', 's2', 's3', 's4'],
  },
];
