/* Adaptive Banking prototype: the customer app, Adaptive Engine, staff hand-off and bank insights. */
"use strict";
/* Simple stroke icons (decorative: aria-hidden). */
const ICONS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  pay: '<path d="M4 8h13"/><path d="M14 4l4 4-4 4"/><path d="M20 16H7"/><path d="M10 12l-4 4 4 4"/>',
  scan: '<path d="M4 8V5a1 1 0 011-1h3"/><path d="M16 4h3a1 1 0 011 1v3"/><path d="M20 16v3a1 1 0 01-1 1h-3"/><path d="M8 20H5a1 1 0 01-1-1v-3"/><rect x="8" y="8" width="3" height="3"/><rect x="13" y="8" width="3" height="3"/><rect x="8" y="13" width="3" height="3"/><path d="M13 13h3v3"/>',
  learn: '<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M7 10v5c0 1.5 2.5 3 5 3s5-1.5 5-3v-5"/><path d="M21 8v6"/>',
  more: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
  shieldx: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  bank: '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>',
  shop: '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a3 3 0 01-5.3 2 3 3 0 01-5.4 0A3 3 0 014 11V9z"/><path d="M5 13v7h14v-7"/>',
  plane: '<path d="M10 14l-6-2 1-2 7 1 4-6a1.5 1.5 0 012.5 1.5L15 13l2 7-2 1-4-5-3 3v3l-1.5.5L6 19l-2.5-1.5L4 16h3l3-2z"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M9 14l2 2 4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6 8-6s7 1.5 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.8 3.5-5.5 6.5-5.5s5.7 1.7 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14.8c2 .7 3.2 2.4 3.6 5.2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  alert: '<path d="M12 4l9 16H3l9-16z"/><path d="M12 10v4M12 17h.01"/>',
  arrow: '<path d="M9 5l7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  text: '<path d="M4 18l5-12 5 12M5.8 14h6.4"/><path d="M15 18l3-7 3 7M16 15.5h4"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 000-18z" fill="currentColor"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8.5 17h7"/>',
  map: '<path d="M4 19V5M4 19h16"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  play: '<path d="M7 4l13 8-13 8V4z"/>',
  bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4l2-2z"/><path d="M10 20a2 2 0 004 0"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
  wallet: '<path d="M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H4z"/><path d="M4 7l11-3v3"/><circle cx="16" cy="13.5" r="1.2"/>',
  hourglass: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>',
  logout: '<path d="M14 4h5v16h-5"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 5v6h-6"/>'
};
function ic(name, size, extra) {
  const s = size || 22;
  return '<svg aria-hidden="true" focusable="false" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + (ICONS[name] || '') + '</svg>';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Language layer (Idea I) ----------
   UI strings in English, Chinese, Malay and Tamil.
   Translations are a first draft for the prototype and must be
   checked by native speakers before any real use. */
const LANGS = [
  { code: 'en', name: 'English', speech: 'en-SG' },
  { code: 'zh', name: '中文', speech: 'zh-CN' },
  { code: 'ms', name: 'Bahasa Melayu', speech: 'ms-MY' },
  { code: 'ta', name: 'தமிழ்', speech: 'ta-IN' }
];

const L = {
  en: {
    mode_chat: 'Chat',
    sum_guided: 'Step-by-step help for', sum_quick: 'Quick forms for', sum_practice: 'Practice suggested first', sum_how: 'How you get help', sum_safety: 'Scam pause before big transfers to new people', sum_note: 'Nothing here was guessed. It all comes from your answers, and you can change it anytime in More.', on: 'On', off: 'Off', none_w: 'None',
    layout: 'Layout', step_of: 'Step {n} of {m}', or_mobile: 'Or type a mobile number', fix_title: "Let's fix this together",
    r_to: 'To', r_amount: 'Amount', r_fee: 'Fee', r_arrives: 'Arrives', r_note: 'Note', r_ref: 'Reference', fee_none: 'None', in_secs: 'In seconds',
    mistake_t: 'Made a mistake?', mistake_b: 'Tell Helper or call the number on the back of your card straight away. The sooner we know, the better the chance of getting money back.',
    practice_t: 'Practice mode', practice_b: 'Pretend money only. Nothing you do here is real.',
    new_t: 'New to this?', new_b: 'You said {task} is new to you. Try it first with pretend money, then come back.',
    never_t: 'Real banks and police never ask you to move money', never_b: 'If someone is telling you to make this transfer, stop and call the number on the back of your card.',
    well_t: 'Well done.', well_b: 'You practised every step. When you are ready, do it for real. Your details are kept so you do not type them again.',
    recent: 'Recent activity',
    nav_home: 'Home', nav_pay: 'Pay', nav_scan: 'Scan', nav_learn: 'Learn', nav_more: 'More',
    hello: 'Hello', acct_name: '360 Account', avail: 'Available balance',
    shortcuts: 'Your shortcuts', shortcuts_why: 'Ordered by what you use most', all_services: 'All services',
    call_none: 'OCBC is not calling you right now',
    call_none_sub: 'If someone on the phone says they are from OCBC, hang up and check here.',
    call_live: 'You are on a verified call with OCBC',
    call_live_sub: 'Agent {name}. Your code is {code}. The agent sees the same code.',
    conf_title: 'Your banking confidence', conf_sub: 'This sets how much help each task gives you.',
    edit: 'Edit', lvl_never: 'New to me', lvl_help: 'With some help', lvl_often: 'I do this often',
    helper: 'Helper', ask_helper: 'Ask Helper',
    practice: 'Practice', try_first: 'Try it first with pretend money', do_real: 'Do it for real',
    next: 'Next', back: 'Back', cont: 'Continue', confirm: 'Confirm', cancel: 'Cancel', done: 'Done',
    change: 'Change', undo: 'Undo', skip: 'Skip', close: 'Close', send: 'Send', save: 'Save',
    guided: 'Guide me step by step', quick: 'Quick form',
    show_as: 'Show as', mode_visual: 'Visual', mode_text: 'Text', mode_voice: 'Voice',
    review_title: 'Check before you send', is_right: 'Is this right?', yes_send: 'Yes, send it',
    not_quite: 'Not quite, let me fix it', in_words: 'In words',
    receipt_title: 'Sent successfully', receipt_practice: 'Practice complete. No money moved.',
    t_scan: 'Scan & Pay', t_paynow: 'PayNow to a mobile number', t_uen: 'PayNow to a business (UEN)',
    t_newpayee: 'Transfer to a new bank account', t_overseas: 'Overseas transfer', t_giro: 'Set up GIRO',
    t_moneylock: 'Money Lock',
    s_scan: 'Scan', s_paynow: 'PayNow', s_uen: 'Pay business', s_newpayee: 'New payee',
    s_overseas: 'Overseas', s_giro: 'GIRO', s_moneylock: 'Money Lock',
    why_you: 'You chose this', why_helper: 'You asked Helper', why_suggest: 'You said yes to a suggestion',
    simple: 'Simple wording', larger: 'Larger text', contrast: 'High contrast', read_aloud: 'Read aloud',
    language: 'Language', text_size: 'Text size',
    ob_hi: 'Hi {name}, welcome to the OCBC app. Before we start, can I ask a few quick questions so the app fits the way you bank?',
    ob_hi2: 'Takes about a minute. I will never ask your age, health or income, and you can change every answer later.',
    ob_lang: 'Which language would you like?',
    ob_tasks: 'What do you use your bank for? Pick all that apply.',
    ob_conf: 'For each one, how familiar are you?',
    ob_how: 'When you do something new, how do you like help?',
    how_show: 'Show me with pictures', how_tell: 'Tell me out loud', how_read: 'Let me read it',
    ob_serve: 'Anything that helps when we serve you? Tell us what helps, not why. Pick any, or none.',
    serve_simple: 'Use simple words', serve_larger: 'Make text bigger', serve_patient: 'Give me more time',
    serve_trusted: 'A trusted person may help me', serve_none: 'None of these',
    ob_safety: 'Scams often start with someone telling you to move money fast. Would you like a short check before big transfers to new people?',
    yes_please: 'Yes please', no_thanks: 'No thanks',
    ob_done: 'All set. Here is what I set up for you.',
    your_app: 'Here is your app', go_home: 'Go to my app', start: "Let's start", skip_ob: 'Skip, use standard app',
    sugg_quick: "You've done {task} {n} times with guidance. Want the quicker version next time?",
    sugg_help: 'That looked tricky. Want step-by-step guidance for {task} next time?',
    yes: 'Yes', no: 'No', not_now: 'Not now',
    passport: 'My Assistance Passport', passport_sub: 'How you want OCBC to serve you, in the app and on calls. You decide what to share.',
    log_title: 'Why the app looks this way', safety: 'Safety settings',
    trusted: 'Trusted contact', cooling: 'Cooling time for new payees',
    learn_title: 'Practice Hub', learn_sub: 'Practise real tasks with pretend money. Nothing you do here moves money.',
    drills: 'Scam drills', drills_sub: 'Spot the scam before it reaches your money.',
    stuck: 'Taking a while? I can explain this step or show you a practice run.',
    explain_screen: 'Explain this screen', talk_person: 'Talk to a person',
    type_q: 'Type a question', listening: 'Listening...'
  },
  zh: {
    mode_chat: '聊天',
    sum_guided: '一步一步引导', sum_quick: '快速表格', sum_practice: '建议先练习', sum_how: '您喜欢的帮助方式', sum_safety: '大额转账给新收款人前的防骗检查', sum_note: '这里没有任何猜测，全部来自您的回答，随时可以在“更多”里修改。', on: '开', off: '关', none_w: '无',
    layout: '版面', step_of: '第 {n} 步，共 {m} 步', or_mobile: '或输入手机号码', fix_title: '我们一起来解决',
    r_to: '收款人', r_amount: '金额', r_fee: '手续费', r_arrives: '到账', r_note: '备注', r_ref: '参考号', fee_none: '无', in_secs: '几秒内',
    mistake_t: '转错了？', mistake_b: '请马上告诉小助手，或拨打卡背面的电话。越早通知，越有机会拿回钱。',
    practice_t: '练习模式', practice_b: '只用模拟的钱，这里做的一切都不是真的。',
    new_t: '第一次做？', new_b: '您说{task}是没做过的。先用模拟的钱试一次，再回来。',
    never_t: '真正的银行和警察绝不会叫您转钱', never_b: '如果有人叫您做这笔转账，请停下，拨打卡背面的电话。',
    well_t: '做得好。', well_b: '您练习了每一步。准备好了就正式操作，资料会保留，不用再输入。',
    recent: '最近交易',
    nav_home: '首页', nav_pay: '付款', nav_scan: '扫码', nav_learn: '学习', nav_more: '更多',
    hello: '您好', acct_name: '360 账户', avail: '可用余额',
    shortcuts: '您的快捷方式', shortcuts_why: '按您最常用的排序', all_services: '所有服务',
    call_none: 'OCBC 现在没有打电话给您',
    call_none_sub: '如果有人在电话里说自己是 OCBC，请挂断并在这里查看。',
    call_live: '您正在与 OCBC 进行已验证的通话',
    call_live_sub: '客服 {name}。您的验证码是 {code}，客服看到的是同一个号码。',
    conf_title: '您的银行操作熟练度', conf_sub: '这决定每项操作给您多少帮助。',
    edit: '修改', lvl_never: '没做过', lvl_help: '需要帮助', lvl_often: '很熟练',
    helper: '小助手', ask_helper: '问小助手',
    practice: '练习', try_first: '先用模拟钱试一次', do_real: '正式操作',
    next: '下一步', back: '返回', cont: '继续', confirm: '确认', cancel: '取消', done: '完成',
    change: '更改', undo: '撤销', skip: '跳过', close: '关闭', send: '发送', save: '保存',
    guided: '一步一步带我做', quick: '快速表格',
    show_as: '显示方式', mode_visual: '图像', mode_text: '文字', mode_voice: '语音',
    review_title: '发送前请检查', is_right: '这些对吗？', yes_send: '对，发送',
    not_quite: '不对，我要修改', in_words: '大写',
    receipt_title: '转账成功', receipt_practice: '练习完成，没有真的转钱。',
    t_scan: '扫码付款', t_paynow: 'PayNow 转账到手机号', t_uen: 'PayNow 付款给商家 (UEN)',
    t_newpayee: '转账到新的银行账户', t_overseas: '海外汇款', t_giro: '设置 GIRO 自动扣款',
    t_moneylock: '资金锁 Money Lock',
    s_scan: '扫码', s_paynow: 'PayNow', s_uen: '付商家', s_newpayee: '新收款人',
    s_overseas: '海外汇款', s_giro: 'GIRO', s_moneylock: '资金锁',
    why_you: '这是您选的', why_helper: '您请小助手设置的', why_suggest: '您同意了建议',
    simple: '简单用语', larger: '大字体', contrast: '高对比度', read_aloud: '朗读',
    language: '语言', text_size: '字体大小',
    ob_hi: '{name}您好，欢迎使用 OCBC 应用。开始之前，可以问您几个简单问题，让应用更适合您吗？',
    ob_hi2: '大约 2 分钟。所有答案以后都可以修改。',
    ob_lang: '您想用哪种语言？',
    ob_tasks: '您平时用银行做什么？可以选多个。',
    ob_conf: '每一项您有多熟悉？',
    ob_how: '做新的操作时，您喜欢怎样的帮助？',
    how_show: '用图片教我', how_tell: '念给我听', how_read: '让我自己看',
    ob_serve: '有什么能让您用银行更方便？可以选，也可以不选。',
    serve_simple: '用简单的话', serve_larger: '字大一点', serve_patient: '给我多一点时间',
    serve_trusted: '我有时会请信任的人帮忙', serve_none: '都不需要',
    ob_safety: '很多骗案都是有人叫您赶快转钱。大额转账给新收款人之前，要不要加一个简单检查？',
    yes_please: '好的', no_thanks: '不用了',
    ob_done: '设置好了。这是我为您安排的。',
    your_app: '这是您的应用', go_home: '进入我的应用', start: '开始', skip_ob: '跳过，用标准版',
    sugg_quick: '您已经在引导下完成了 {n} 次{task}。下次要用快速版本吗？',
    sugg_help: '刚才好像有点难。下次{task}要一步一步引导吗？',
    yes: '要', no: '不要', not_now: '以后再说',
    passport: '我的协助护照', passport_sub: '告诉 OCBC 您希望怎样被服务，包括应用和电话。分享什么由您决定。',
    log_title: '应用为什么是这样', safety: '安全设置',
    trusted: '信任联系人', cooling: '新收款人冷静期',
    learn_title: '练习中心', learn_sub: '用模拟的钱练习真实操作，不会动到真的钱。',
    drills: '防骗演练', drills_sub: '在骗子碰到您的钱之前认出他们。',
    stuck: '需要帮忙吗？我可以解释这一步，或带您练习一次。',
    explain_screen: '解释这个页面', talk_person: '找真人帮忙',
    type_q: '输入问题', listening: '正在听...'
  },
  ms: {
    mode_chat: 'Sembang',
    sum_guided: 'Bimbingan langkah demi langkah', sum_quick: 'Borang pantas', sum_practice: 'Disyorkan berlatih dahulu', sum_how: 'Cara anda dibantu', sum_safety: 'Semakan penipuan sebelum pindahan besar kepada orang baru', sum_note: 'Tiada apa yang diteka. Semuanya dari jawapan anda dan boleh diubah dalam Lagi.', on: 'Hidup', off: 'Mati', none_w: 'Tiada',
    layout: 'Susun atur', step_of: 'Langkah {n} daripada {m}', or_mobile: 'Atau taip nombor telefon', fix_title: 'Mari betulkan bersama',
    r_to: 'Kepada', r_amount: 'Jumlah', r_fee: 'Yuran', r_arrives: 'Sampai', r_note: 'Nota', r_ref: 'Rujukan', fee_none: 'Tiada', in_secs: 'Dalam beberapa saat',
    mistake_t: 'Tersilap?', mistake_b: 'Beritahu Pembantu atau hubungi nombor di belakang kad anda segera. Lebih cepat kami tahu, lebih baik peluang mendapatkan wang semula.',
    practice_t: 'Mod latihan', practice_b: 'Wang olok-olok sahaja. Tiada apa yang sebenar di sini.',
    new_t: 'Baru bagi anda?', new_b: 'Anda kata {task} baru bagi anda. Cuba dulu dengan wang olok-olok.',
    never_t: 'Bank dan polis sebenar tidak pernah suruh anda pindah wang', never_b: 'Jika seseorang menyuruh anda membuat pindahan ini, berhenti dan hubungi nombor di belakang kad anda.',
    well_t: 'Syabas.', well_b: 'Anda sudah latih setiap langkah. Bila sedia, buat betul-betul. Butiran anda disimpan.',
    recent: 'Aktiviti terkini',
    nav_home: 'Utama', nav_pay: 'Bayar', nav_scan: 'Imbas', nav_learn: 'Belajar', nav_more: 'Lagi',
    hello: 'Hai', acct_name: 'Akaun 360', avail: 'Baki tersedia',
    shortcuts: 'Pintasan anda', shortcuts_why: 'Disusun ikut apa yang paling kerap anda guna', all_services: 'Semua perkhidmatan',
    call_none: 'OCBC tidak menelefon anda sekarang',
    call_none_sub: 'Jika seseorang di telefon kata dia dari OCBC, letak telefon dan semak di sini.',
    call_live: 'Anda dalam panggilan OCBC yang disahkan',
    call_live_sub: 'Ejen {name}. Kod anda {code}. Ejen nampak kod yang sama.',
    conf_title: 'Keyakinan perbankan anda', conf_sub: 'Ini menentukan berapa banyak bantuan untuk setiap tugas.',
    edit: 'Ubah', lvl_never: 'Baru bagi saya', lvl_help: 'Perlu bantuan', lvl_often: 'Yakin',
    helper: 'Pembantu', ask_helper: 'Tanya Pembantu',
    practice: 'Latihan', try_first: 'Cuba dulu dengan wang olok-olok', do_real: 'Buat betul-betul',
    next: 'Seterusnya', back: 'Kembali', cont: 'Teruskan', confirm: 'Sahkan', cancel: 'Batal', done: 'Selesai',
    change: 'Tukar', undo: 'Batalkan', skip: 'Langkau', close: 'Tutup', send: 'Hantar', save: 'Simpan',
    guided: 'Bimbing saya langkah demi langkah', quick: 'Borang pantas',
    show_as: 'Papar sebagai', mode_visual: 'Visual', mode_text: 'Teks', mode_voice: 'Suara',
    review_title: 'Semak sebelum hantar', is_right: 'Betulkah ini?', yes_send: 'Ya, hantar',
    not_quite: 'Tidak, saya mahu betulkan', in_words: 'Dalam perkataan',
    receipt_title: 'Berjaya dihantar', receipt_practice: 'Latihan selesai. Tiada wang dipindahkan.',
    t_scan: 'Imbas & Bayar', t_paynow: 'PayNow ke nombor telefon', t_uen: 'PayNow ke perniagaan (UEN)',
    t_newpayee: 'Pindahan ke akaun bank baru', t_overseas: 'Pindahan ke luar negara', t_giro: 'Tetapkan GIRO',
    t_moneylock: 'Money Lock',
    s_scan: 'Imbas', s_paynow: 'PayNow', s_uen: 'Bayar niaga', s_newpayee: 'Penerima baru',
    s_overseas: 'Luar negara', s_giro: 'GIRO', s_moneylock: 'Money Lock',
    why_you: 'Anda pilih ini', why_helper: 'Anda minta Pembantu', why_suggest: 'Anda setuju cadangan',
    simple: 'Perkataan mudah', larger: 'Teks lebih besar', contrast: 'Kontras tinggi', read_aloud: 'Baca kuat',
    language: 'Bahasa', text_size: 'Saiz teks',
    ob_hi: 'Hai {name}, selamat datang ke aplikasi OCBC. Boleh saya tanya beberapa soalan supaya aplikasi ini sesuai dengan cara anda?',
    ob_hi2: 'Lebih kurang 2 minit. Semua jawapan boleh diubah kemudian.',
    ob_lang: 'Bahasa apa yang anda mahu?',
    ob_tasks: 'Anda guna bank untuk apa? Pilih semua yang berkaitan.',
    ob_conf: 'Untuk setiap satu, sejauh mana anda biasa?',
    ob_how: 'Bila buat sesuatu yang baru, bantuan macam mana anda suka?',
    how_show: 'Tunjuk dengan gambar', how_tell: 'Beritahu dengan suara', how_read: 'Biar saya baca',
    ob_serve: 'Apa yang boleh memudahkan perbankan anda? Pilih mana-mana, atau tiada.',
    serve_simple: 'Guna perkataan mudah', serve_larger: 'Besarkan teks', serve_patient: 'Beri saya lebih masa',
    serve_trusted: 'Kadang-kadang saya dibantu orang yang dipercayai', serve_none: 'Tiada',
    ob_safety: 'Penipuan selalunya bermula dengan orang suruh anda pindah wang dengan cepat. Mahu semakan ringkas sebelum pindahan besar kepada orang baru?',
    yes_please: 'Ya, tolong', no_thanks: 'Tidak, terima kasih',
    ob_done: 'Siap. Ini yang saya tetapkan untuk anda.',
    your_app: 'Inilah aplikasi anda', go_home: 'Pergi ke aplikasi saya', start: 'Mula', skip_ob: 'Langkau, guna versi biasa',
    sugg_quick: 'Anda sudah buat {task} {n} kali dengan bimbingan. Mahu versi pantas lain kali?',
    sugg_help: 'Itu nampak sukar. Mahu bimbingan langkah demi langkah untuk {task} lain kali?',
    yes: 'Ya', no: 'Tidak', not_now: 'Bukan sekarang',
    passport: 'Pasport Bantuan Saya', passport_sub: 'Cara anda mahu OCBC melayan anda, dalam aplikasi dan panggilan. Anda tentukan apa yang dikongsi.',
    log_title: 'Kenapa aplikasi nampak begini', safety: 'Tetapan keselamatan',
    trusted: 'Kenalan dipercayai', cooling: 'Masa bertenang untuk penerima baru',
    learn_title: 'Pusat Latihan', learn_sub: 'Latih tugas sebenar dengan wang olok-olok. Tiada wang dipindahkan.',
    drills: 'Latihan penipuan', drills_sub: 'Kenal pasti penipuan sebelum ia sampai ke wang anda.',
    stuck: 'Perlu bantuan? Saya boleh terangkan langkah ini atau tunjuk latihan.',
    explain_screen: 'Terangkan skrin ini', talk_person: 'Cakap dengan orang',
    type_q: 'Taip soalan', listening: 'Mendengar...'
  },
  ta: {
    mode_chat: 'அரட்டை',
    sum_guided: 'படிப்படியான உதவி', sum_quick: 'விரைவுப் படிவங்கள்', sum_practice: 'முதலில் பயிற்சி பரிந்துரை', sum_how: 'உதவி பெறும் விதம்', sum_safety: 'புதியவர்களுக்குப் பெரிய தொகைக்கு முன் மோசடிச் சோதனை', sum_note: 'எதுவும் ஊகிக்கப்படவில்லை. அனைத்தும் உங்கள் பதில்களிலிருந்து; மேலும் பகுதியில் மாற்றலாம்.', on: 'இயக்கம்', off: 'நிறுத்தம்', none_w: 'இல்லை',
    layout: 'அமைப்பு', step_of: 'படி {n} / {m}', or_mobile: 'அல்லது கைபேசி எண்ணை உள்ளிடவும்', fix_title: 'சேர்ந்து சரிசெய்வோம்',
    r_to: 'பெறுநர்', r_amount: 'தொகை', r_fee: 'கட்டணம்', r_arrives: 'வந்து சேரும்', r_note: 'குறிப்பு', r_ref: 'குறிப்பு எண்', fee_none: 'இல்லை', in_secs: 'சில விநாடிகளில்',
    mistake_t: 'தவறு நடந்ததா?', mistake_b: 'உடனே உதவியாளரிடம் சொல்லுங்கள் அல்லது அட்டையின் பின்னால் உள்ள எண்ணை அழையுங்கள்.',
    practice_t: 'பயிற்சி முறை', practice_b: 'போலிப் பணம் மட்டுமே. இங்கே எதுவும் உண்மையல்ல.',
    new_t: 'இது புதிதா?', new_b: '{task} உங்களுக்குப் புதியது என்றீர்கள். முதலில் போலிப் பணத்தில் முயற்சி செய்யுங்கள்.',
    never_t: 'உண்மையான வங்கியும் காவல்துறையும் பணத்தை நகர்த்தச் சொல்லாது', never_b: 'யாராவது இதைச் செய்யச் சொன்னால், நிறுத்தி அட்டையின் பின்னால் உள்ள எண்ணை அழையுங்கள்.',
    well_t: 'நன்று.', well_b: 'ஒவ்வொரு படியையும் பயிற்சி செய்தீர்கள். தயாரானதும் உண்மையாகச் செய்யுங்கள்.',
    recent: 'சமீபத்திய செயல்பாடு',
    nav_home: 'முகப்பு', nav_pay: 'செலுத்து', nav_scan: 'ஸ்கேன்', nav_learn: 'கற்க', nav_more: 'மேலும்',
    hello: 'வணக்கம்', acct_name: '360 கணக்கு', avail: 'கிடைக்கும் இருப்பு',
    shortcuts: 'உங்கள் குறுக்குவழிகள்', shortcuts_why: 'நீங்கள் அதிகம் பயன்படுத்துவதின்படி', all_services: 'அனைத்து சேவைகள்',
    call_none: 'OCBC இப்போது உங்களை அழைக்கவில்லை',
    call_none_sub: 'தொலைபேசியில் யாராவது OCBC என்று சொன்னால், அழைப்பைத் துண்டித்து இங்கே சரிபார்க்கவும்.',
    call_live: 'நீங்கள் சரிபார்க்கப்பட்ட OCBC அழைப்பில் உள்ளீர்கள்',
    call_live_sub: 'முகவர் {name}. உங்கள் குறியீடு {code}. முகவரும் அதே குறியீட்டைப் பார்க்கிறார்.',
    conf_title: 'உங்கள் வங்கி நம்பிக்கை', conf_sub: 'ஒவ்வொரு பணிக்கும் எவ்வளவு உதவி என்பதை இது தீர்மானிக்கிறது.',
    edit: 'திருத்து', lvl_never: 'புதியது', lvl_help: 'உதவியுடன்', lvl_often: 'நம்பிக்கையுடன்',
    helper: 'உதவியாளர்', ask_helper: 'உதவியாளரிடம் கேள்',
    practice: 'பயிற்சி', try_first: 'முதலில் போலிப் பணத்தில் முயற்சி', do_real: 'உண்மையாகச் செய்',
    next: 'அடுத்து', back: 'பின்', cont: 'தொடர்', confirm: 'உறுதிசெய்', cancel: 'ரத்து', done: 'முடிந்தது',
    change: 'மாற்று', undo: 'திரும்பப் பெறு', skip: 'தவிர்', close: 'மூடு', send: 'அனுப்பு', save: 'சேமி',
    guided: 'படிப்படியாக வழிகாட்டு', quick: 'விரைவுப் படிவம்',
    show_as: 'காட்டும் விதம்', mode_visual: 'படம்', mode_text: 'உரை', mode_voice: 'குரல்',
    review_title: 'அனுப்பும் முன் சரிபார்க்கவும்', is_right: 'இது சரியா?', yes_send: 'ஆம், அனுப்பு',
    not_quite: 'இல்லை, திருத்த வேண்டும்', in_words: 'எழுத்தில்',
    receipt_title: 'வெற்றிகரமாக அனுப்பப்பட்டது', receipt_practice: 'பயிற்சி முடிந்தது. பணம் எதுவும் நகரவில்லை.',
    t_scan: 'ஸ்கேன் செய்து செலுத்து', t_paynow: 'கைபேசி எண்ணுக்கு PayNow', t_uen: 'வணிகத்துக்கு PayNow (UEN)',
    t_newpayee: 'புதிய வங்கிக் கணக்குக்கு அனுப்பு', t_overseas: 'வெளிநாட்டுப் பணப் பரிமாற்றம்', t_giro: 'GIRO அமை',
    t_moneylock: 'Money Lock',
    s_scan: 'ஸ்கேன்', s_paynow: 'PayNow', s_uen: 'வணிகம்', s_newpayee: 'புதியவர்',
    s_overseas: 'வெளிநாடு', s_giro: 'GIRO', s_moneylock: 'Money Lock',
    why_you: 'நீங்கள் தேர்ந்தெடுத்தது', why_helper: 'உதவியாளரிடம் கேட்டீர்கள்', why_suggest: 'பரிந்துரையை ஏற்றீர்கள்',
    simple: 'எளிய சொற்கள்', larger: 'பெரிய எழுத்து', contrast: 'அதிக மாறுபாடு', read_aloud: 'சத்தமாகப் படி',
    language: 'மொழி', text_size: 'எழுத்து அளவு',
    ob_hi: 'வணக்கம் {name}, OCBC செயலிக்கு வரவேற்கிறோம். உங்களுக்கு ஏற்றபடி அமைக்க சில கேள்விகள் கேட்கலாமா?',
    ob_hi2: 'சுமார் 2 நிமிடங்கள். எல்லா பதில்களையும் பின்னர் மாற்றலாம்.',
    ob_lang: 'எந்த மொழி வேண்டும்?',
    ob_tasks: 'வங்கியை எதற்குப் பயன்படுத்துகிறீர்கள்? பொருந்துவதை எல்லாம் தேர்ந்தெடுக்கவும்.',
    ob_conf: 'ஒவ்வொன்றும் உங்களுக்கு எவ்வளவு பழக்கம்?',
    ob_how: 'புதிதாக ஒன்றைச் செய்யும்போது எப்படிப்பட்ட உதவி வேண்டும்?',
    how_show: 'படங்களுடன் காட்டு', how_tell: 'சத்தமாகச் சொல்', how_read: 'நானே படிக்கிறேன்',
    ob_serve: 'வங்கியை எளிதாக்க ஏதாவது? எதையும் தேர்ந்தெடுக்கலாம், அல்லது எதுவும் வேண்டாம்.',
    serve_simple: 'எளிய சொற்கள்', serve_larger: 'பெரிய எழுத்து', serve_patient: 'எனக்குக் கூடுதல் நேரம்',
    serve_trusted: 'சில நேரம் நம்பிக்கையான ஒருவர் உதவுவார்', serve_none: 'எதுவும் வேண்டாம்',
    ob_safety: 'மோசடிகள் பெரும்பாலும் பணத்தை வேகமாக அனுப்பச் சொல்வதில் தொடங்கும். புதியவர்களுக்குப் பெரிய தொகை அனுப்பும் முன் ஒரு சிறு சோதனை வேண்டுமா?',
    yes_please: 'ஆம்', no_thanks: 'வேண்டாம்',
    ob_done: 'தயார். உங்களுக்காக அமைத்தவை இவை.',
    your_app: 'இதோ உங்கள் செயலி', go_home: 'என் செயலிக்குச் செல்', start: 'தொடங்கு', skip_ob: 'தவிர், வழக்கமான செயலி',
    sugg_quick: '{task} ஐ வழிகாட்டலுடன் {n} முறை செய்துவிட்டீர்கள். அடுத்த முறை விரைவுப் பதிப்பு வேண்டுமா?',
    sugg_help: 'அது கடினமாகத் தெரிந்தது. அடுத்த முறை {task} க்குப் படிப்படியான வழிகாட்டல் வேண்டுமா?',
    yes: 'ஆம்', no: 'இல்லை', not_now: 'இப்போது வேண்டாம்',
    passport: 'என் உதவிக் கடவுச்சீட்டு', passport_sub: 'செயலியிலும் அழைப்பிலும் OCBC உங்களுக்கு எப்படிச் சேவை செய்ய வேண்டும். எதைப் பகிர்வது என்பது உங்கள் முடிவு.',
    log_title: 'செயலி ஏன் இப்படித் தெரிகிறது', safety: 'பாதுகாப்பு அமைப்புகள்',
    trusted: 'நம்பகத் தொடர்பு', cooling: 'புதிய பெறுநர்களுக்குக் காத்திருப்பு நேரம்',
    learn_title: 'பயிற்சி மையம்', learn_sub: 'போலிப் பணத்தில் உண்மையான பணிகளைப் பயிற்சி செய்யுங்கள்.',
    drills: 'மோசடிப் பயிற்சி', drills_sub: 'மோசடியை உங்கள் பணத்தை அடையும் முன் கண்டுபிடியுங்கள்.',
    stuck: 'உதவி வேண்டுமா? இந்தப் படியை விளக்கலாம் அல்லது பயிற்சி காட்டலாம்.',
    explain_screen: 'இந்தத் திரையை விளக்கு', talk_person: 'ஒருவரிடம் பேசு',
    type_q: 'கேள்வியைத் தட்டச்சு செய்யவும்', listening: 'கேட்கிறது...'
  }
};

function t(key, vars) {
  const lang = (typeof S !== 'undefined' && S && S.settings.lang) || 'en';
  let s = (L[lang] && L[lang][key]) || L.en[key] || key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}

/* Pick the current-language variant of a content object {en, zh, ms, ta}. */
function tx(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  const lang = S.settings.lang;
  return obj[lang] || obj.en || '';
}

/* ---------- Amount in words (catches extra-zero mistakes) ---------- */
function wordsEN(n) {
  const ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  function under1000(x) {
    let out = [];
    if (x >= 100) { out.push(ones[Math.floor(x / 100)] + ' hundred'); x %= 100; if (x) out.push('and'); }
    if (x >= 20) { out.push(tens[Math.floor(x / 10)] + (x % 10 ? '-' + ones[x % 10] : '')); }
    else if (x > 0 || out.length === 0) out.push(ones[x]);
    return out.join(' ');
  }
  if (n === 0) return 'zero';
  const parts = [];
  const scales = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
  for (const [v, name] of scales) {
    if (n >= v) { parts.push(under1000(Math.floor(n / v)) + ' ' + name); n %= v; }
  }
  if (n > 0) parts.push(under1000(n));
  return parts.join(' ');
}
function wordsZH(n) {
  const d = ['零','一','二','三','四','五','六','七','八','九'];
  const u = ['','十','百','千'];
  function sec(x) {
    let s = '', zero = false;
    for (let i = 3; i >= 0; i--) {
      const p = Math.pow(10, i), dig = Math.floor(x / p) % 10;
      if (dig === 0) { if (s) zero = true; continue; }
      if (zero) { s += '零'; zero = false; }
      s += d[dig] + u[i];
    }
    return s;
  }
  if (n === 0) return '零';
  let s = '';
  const wan = Math.floor(n / 10000), rest = n % 10000;
  if (wan) s += sec(wan) + '万';
  if (rest) s += (wan && rest < 1000 ? '零' : '') + sec(rest);
  return s.replace(/^一十/, '十');
}
function wordsMS(n) {
  const ones = ['kosong','satu','dua','tiga','empat','lima','enam','tujuh','lapan','sembilan'];
  function under1000(x) {
    let o = [];
    const h = Math.floor(x / 100); x %= 100;
    if (h) o.push(h === 1 ? 'seratus' : ones[h] + ' ratus');
    if (x >= 20) { o.push(ones[Math.floor(x / 10)] + ' puluh'); if (x % 10) o.push(ones[x % 10]); }
    else if (x >= 11) o.push(x === 11 ? 'sebelas' : ones[x - 10] + ' belas');
    else if (x === 10) o.push('sepuluh');
    else if (x > 0) o.push(ones[x]);
    return o.join(' ');
  }
  if (n === 0) return 'kosong';
  const parts = [];
  if (n >= 1e6) { parts.push(under1000(Math.floor(n / 1e6)) + ' juta'); n %= 1e6; }
  if (n >= 1000) { const th = Math.floor(n / 1000); parts.push(th === 1 ? 'seribu' : under1000(th) + ' ribu'); n %= 1000; }
  if (n) parts.push(under1000(n));
  return parts.join(' ');
}
function amountWords(amount) {
  const a = Number(amount);
  if (!isFinite(a) || a <= 0) return '';
  const dollars = Math.floor(a), cents = Math.round((a - dollars) * 100);
  const lang = S.settings.lang;
  if (lang === 'zh') return wordsZH(dollars) + '新元' + (cents ? wordsZH(cents) + '分' : '整');
  if (lang === 'ms') return wordsMS(dollars) + ' dolar' + (cents ? ' ' + wordsMS(cents) + ' sen' : '');
  const en = wordsEN(dollars) + ' dollar' + (dollars === 1 ? '' : 's') + (cents ? ' and ' + wordsEN(cents) + ' cent' + (cents === 1 ? '' : 's') : '');
  return lang === 'ta' ? en + ' (English)' : en.charAt(0).toUpperCase() + en.slice(1);
}
function money(n, cur) {
  const v = Number(n || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (cur || 'S$') + v;
}

/* Suggestion card and Life Moment strings (merged build) */
(function () {
  const add = {
    en: { sugg_label: 'Suggested for you', sugg_whybtn: 'Why am I seeing this?', sugg_never: "Don't suggest this again", sugg_promise: 'The app only changes when you say yes. Safety checks always stay on.',
      sugg_practiced: 'You finished the {task} practice. Change it from "{a}" to "{b}"? You will still get step-by-step guidance.', sugg_full: '{task} needed a few fixes last time. Want full explanations on every step next time?',
      why_quick: 'You have made {n} {task} payments step by step and none needed fixing. The quick version skips the tips. Safety checks stay on either way. Based only on how this task went, never on anything about you.',
      why_full: '{task} needed 2 or more fixes, or you asked for full guidance. Full explanations could make it easier. Based only on how this task went.',
      why_help: '{task} needed 2 or more fixes on the quick form. Step-by-step tips could help. Based only on how this task went.',
      why_practiced: 'You finished a practice run of {task}. Moving up a level means short tips instead of full explanations. You can change it back anytime.',
      for_moment: 'For your moment:' },
    zh: { sugg_label: '为您推荐', sugg_whybtn: '为什么看到这个？', sugg_never: '不要再推荐这个', sugg_promise: '只有您同意，应用才会改变。防骗检查始终开启。',
      sugg_practiced: '您完成了“{task}”的练习。要把它从“{a}”改成“{b}”吗？您仍然会得到一步一步的引导。', sugg_full: '上次“{task}”需要改正几次。下次要在每一步显示完整说明吗？',
      why_quick: '您已经一步一步完成了 {n} 次“{task}”，都不需要改正。快速版本会省略提示，防骗检查照样开启。只根据这项任务的情况，不涉及您的个人资料。',
      why_full: '“{task}”需要改正两次或以上，或您要求了完整引导。完整说明可能更容易。只根据这项任务的情况。',
      why_help: '“{task}”在快速表格上需要改正两次或以上。一步一步的提示可能有帮助。只根据这项任务的情况。',
      why_practiced: '您完成了“{task}”的练习。升一级表示用简短提示代替完整说明。随时可以改回来。',
      for_moment: '适合您现在的情况：' },
    ms: { sugg_label: 'Cadangan untuk anda', sugg_whybtn: 'Kenapa saya nampak ini?', sugg_never: 'Jangan cadangkan ini lagi', sugg_promise: 'Aplikasi hanya berubah jika anda setuju. Semakan keselamatan sentiasa aktif.',
      sugg_practiced: 'Anda sudah selesai latihan {task}. Tukar daripada "{a}" kepada "{b}"? Anda masih dapat panduan langkah demi langkah.', sugg_full: '{task} perlu beberapa pembetulan kali lalu. Mahu penerangan penuh pada setiap langkah lain kali?',
      why_quick: 'Anda telah membuat {n} pembayaran {task} langkah demi langkah tanpa perlu dibetulkan. Versi cepat melangkau petua. Semakan keselamatan tetap aktif. Berdasarkan tugas ini sahaja, bukan maklumat peribadi anda.',
      why_full: '{task} perlu 2 atau lebih pembetulan, atau anda meminta panduan penuh. Berdasarkan tugas ini sahaja.',
      why_help: '{task} perlu 2 atau lebih pembetulan pada borang cepat. Petua langkah demi langkah boleh membantu. Berdasarkan tugas ini sahaja.',
      why_practiced: 'Anda sudah selesai latihan {task}. Naik satu tahap bermaksud petua ringkas, bukan penerangan penuh. Boleh ditukar balik bila-bila masa.',
      for_moment: 'Untuk keadaan anda:' },
    ta: { sugg_label: 'உங்களுக்கான பரிந்துரை', sugg_whybtn: 'இது ஏன் காட்டப்படுகிறது?', sugg_never: 'இதை மீண்டும் பரிந்துரைக்க வேண்டாம்', sugg_promise: 'நீங்கள் ஆம் என்றால் மட்டுமே செயலி மாறும். பாதுகாப்புச் சோதனைகள் எப்போதும் இயங்கும்.',
      sugg_practiced: '{task} பயிற்சியை முடித்தீர்கள். "{a}" என்பதிலிருந்து "{b}" ஆக மாற்றவா? படிப்படியான வழிகாட்டல் தொடரும்.', sugg_full: 'கடந்த முறை {task} சில திருத்தங்கள் தேவைப்பட்டது. அடுத்த முறை ஒவ்வொரு படியிலும் முழு விளக்கம் வேண்டுமா?',
      why_quick: '{task} பணப்பரிமாற்றங்களை {n} முறை படிப்படியாகத் திருத்தமின்றிச் செய்தீர்கள். விரைவுப் பதிப்பு குறிப்புகளைத் தவிர்க்கும். பாதுகாப்புச் சோதனைகள் தொடரும். இந்தப் பணியை மட்டுமே அடிப்படையாகக் கொண்டது.',
      why_full: '{task} இரண்டு அல்லது அதற்கு மேற்பட்ட திருத்தங்கள் தேவைப்பட்டது, அல்லது முழு வழிகாட்டல் கேட்டீர்கள். இந்தப் பணியை மட்டுமே அடிப்படையாகக் கொண்டது.',
      why_help: 'விரைவுப் படிவத்தில் {task} இரண்டு அல்லது அதற்கு மேற்பட்ட திருத்தங்கள் தேவைப்பட்டது. படிப்படியான குறிப்புகள் உதவலாம்.',
      why_practiced: '{task} பயிற்சியை முடித்தீர்கள். ஒரு நிலை மேலே செல்வது என்றால் சுருக்கமான குறிப்புகள். எப்போது வேண்டுமானாலும் மாற்றலாம்.',
      for_moment: 'உங்கள் தருணத்திற்கு:' }
  };
  for (const k in add) L[k] = Object.assign(L[k] || {}, add[k]);
})();

/* OCBC-style navigation labels */
(function () {
  const add = {
    en: { nav_plan: 'Plan', nav_paytransfer: 'Pay & Transfer', nav_rewards: 'Rewards' },
    zh: { nav_plan: '计划', nav_paytransfer: '转账与付款', nav_rewards: '奖励积点' },
    ms: { nav_plan: 'Rancang', nav_paytransfer: 'Bayar & Pindah', nav_rewards: 'Ganjaran' },
    ta: { nav_plan: 'திட்டம்', nav_paytransfer: 'செலுத்து & மாற்று', nav_rewards: 'வெகுமதி' }
  };
  for (const k in add) L[k] = Object.assign(L[k] || {}, add[k]);
})();

/* ==========================================================
   Synthetic content and data. No real customer data is used.
   ========================================================== */

const TASKS = [
  { id: 'scan', icon: 'scan', practice: true, mins: 2,
    learn: { en: 'Scan a hawker stall QR code and pay the right amount.', zh: '扫描小贩摊位的二维码，付正确的金额。', ms: 'Imbas kod QR gerai penjaja dan bayar jumlah yang betul.', ta: 'உணவுக்கடை QR குறியீட்டை ஸ்கேன் செய்து சரியான தொகையைச் செலுத்துங்கள்.' } },
  { id: 'paynow', icon: 'pay', practice: true, mins: 2,
    learn: { en: 'Send money to a friend or family member using their mobile number.', zh: '用手机号码转钱给家人或朋友。', ms: 'Hantar wang kepada keluarga atau kawan guna nombor telefon.', ta: 'கைபேசி எண் மூலம் குடும்பத்தினருக்குப் பணம் அனுப்புங்கள்.' } },
  { id: 'uen', icon: 'shop', practice: true, mins: 3,
    learn: { en: 'Pay a business such as a tuition centre using its UEN, and check you are paying the right company.', zh: '用 UEN 付款给补习中心等商家，并确认收款公司是对的。', ms: 'Bayar perniagaan guna UEN, dan semak syarikat yang betul.', ta: 'UEN மூலம் வணிகத்துக்குச் செலுத்தி, சரியான நிறுவனமா எனச் சரிபார்க்கவும்.' } },
  { id: 'newpayee', icon: 'bank', practice: true, mins: 3,
    learn: { en: 'Send money to a bank account you have never paid before, safely.', zh: '安全地转账到一个从没付过的银行账户。', ms: 'Hantar wang ke akaun bank baru dengan selamat.', ta: 'முன்பு அனுப்பாத வங்கிக் கணக்குக்குப் பாதுகாப்பாக அனுப்புங்கள்.' } },
  { id: 'overseas', icon: 'plane', practice: true, mins: 4,
    learn: { en: 'Send money abroad and understand the exchange rate, fee and arrival time.', zh: '汇款到海外，了解汇率、手续费和到账时间。', ms: 'Hantar wang ke luar negara dan faham kadar tukaran, yuran dan masa tiba.', ta: 'வெளிநாட்டுக்குப் பணம் அனுப்பி, மாற்று விகிதம், கட்டணம், நேரம் புரிந்துகொள்ளுங்கள்.' } },
  { id: 'giro', icon: 'calendar', practice: true, mins: 3,
    learn: { en: 'Let a bill be paid automatically every month, with a limit you choose.', zh: '让账单每月自动扣款，并设定您的上限。', ms: 'Biar bil dibayar automatik setiap bulan dengan had pilihan anda.', ta: 'நீங்கள் தேர்ந்தெடுக்கும் வரம்புடன் கட்டணம் தானாகச் செலுத்தப்படட்டும்.' } },
  { id: 'moneylock', icon: 'lock', practice: true, mins: 2,
    learn: { en: 'Lock savings so nobody can move them online, even if your phone is taken over.', zh: '锁住存款，即使手机被控制，别人也不能在网上转走。', ms: 'Kunci simpanan supaya tiada siapa boleh pindahkan dalam talian.', ta: 'உங்கள் சேமிப்பை யாரும் இணையத்தில் நகர்த்த முடியாதபடி பூட்டுங்கள்.' } }
];
const TASK = Object.fromEntries(TASKS.map(x => [x.id, x]));

const BANKS = ['OCBC', 'DBS / POSB', 'UOB', 'Standard Chartered', 'Maybank', 'HSBC', 'Citibank', 'Trust Bank', 'GXS Bank'];

const COUNTRIES = [
  { code: 'MY', name: 'Malaysia', cur: 'MYR', rate: 3.24 },
  { code: 'IN', name: 'India', cur: 'INR', rate: 64.10 },
  { code: 'CN', name: 'China', cur: 'CNY', rate: 5.38 },
  { code: 'PH', name: 'Philippines', cur: 'PHP', rate: 43.20 },
  { code: 'ID', name: 'Indonesia', cur: 'IDR', rate: 12150 }
];

/* UEN directory for the demo (fictional businesses) */
const UEN_DIR = {
  '53312345A': { name: 'Bright Minds Tuition Centre', type: 'Education' },
  '201812345K': { name: 'Kopi Corner Catering Pte Ltd', type: 'Food and beverage' },
  '202499999Z': { name: 'QUICK GAINS TRADING PTE LTD', type: 'Registered 3 weeks ago', risky: true }
};

const GIRO_ORGS = ['Electricity and water bill', 'Town council conservancy', 'Life insurance premium', 'Mobile phone bill'];

/* ---------- Personas (synthetic). Defined by needs, never by age: any of them could be 22 or 72.
   Notes are for the demo team only; the app never reads them. ---------- */
const PERSONAS = [
  {
    id: 'lim', need: 'Prefers to be shown', needSub: 'Wants to see it done before trying', name: 'Mdm Lim Siew Lan', short: 'Mdm Lim', initials: 'LS', color: '#8a4fbf',
    notes: 'Demo note (the app never sees this): starts with the welcome setup. Pick 中文, "Read things out to me" and "Use simple words". Good for Dialect Mode, ghost hand and Family Co-pilot.',
    onboarded: false, lang: 'en',
    told: { conf: 'PayNow: with some help · Overseas: new to me', help: 'Show me and read it out', passport: '中文, larger text, simple words, be patient, trusted person may help' },
    adapts: ['Read-aloud and plain-language lines in Chinese', 'Ghost hand offered on every new step', 'Family Co-pilot: her daughter can point at buttons, never tap'],
    confidence: { scan: 'often', paynow: 'help', uen: 'never', newpayee: 'never', overseas: 'never', giro: 'never', moneylock: 'never' },
    usage: { scan: 41, paynow: 6, uen: 0, newpayee: 0, overseas: 0, giro: 0, moneylock: 0 },
    balance: 8420.55,
    contacts: [{ name: 'Mei Ling (daughter)', mobile: '9123 4567', family: true, since: '2 years' }, { name: 'Ah Kow (brother)', mobile: '8765 4321', family: true, since: '3 years' }, { name: 'Mr Tan (new contact)', mobile: '8111 2222', since: '2 days' }]
  },
  {
    id: 'arjun', need: 'First-time banker', needSub: 'Doing grown-up banking for the first time', name: 'Arjun Nair', short: 'Arjun', initials: 'AN', color: '#1d5fbf',
    notes: 'Demo note (the app never sees this): PayNow with some help (2 guided runs done, the 3rd triggers the quick-version offer). Bank transfer and overseas are new: shows practice first, then "Do it for real".',
    onboarded: true, lang: 'en',
    told: { conf: 'Scan & Pay: often · PayNow: with some help · Bank transfer: new to me', help: 'Chat with me', passport: 'Nothing shared' },
    adapts: ['Bank transfer: full guidance and a practice run first', 'After 3 guided PayNow payments, the app offers the quick version', 'Helper is the first place to go when stuck'],
    confidence: { scan: 'often', paynow: 'help', uen: 'help', newpayee: 'never', overseas: 'never', giro: 'never', moneylock: 'never' },
    usage: { scan: 35, paynow: 12, uen: 3, newpayee: 0, overseas: 0, giro: 0, moneylock: 0 },
    guided: { paynow: 2 },
    balance: 3150.20,
    settings: { simple: false, scale: 2, contrast: false, mode: 'visual', readAloud: false },
    passport: { simple: false, larger: false, patient: false, trustedHelp: false, offerHelp: true },
    safety: { pause: true, cooling: false, coolHours: 12, coolMin: 1000, trusted: null },
    contacts: [{ name: 'Priya (sister)', mobile: '9012 3344', family: true, since: '1 year' }, { name: 'Wei Jie (flatmate)', mobile: '8222 1199', since: '6 months' }]
  },
  {
    id: 'nurul', need: 'Business owner', needSub: 'Pays suppliers and bills from the app', name: 'Nurul Huda', short: 'Nurul', initials: 'NH', color: '#0f7b45',
    notes: 'Demo note (the app never sees this): runs a home-tuition business, pays suppliers by UEN often (quick form). Prefers Malay and simple words. Has a trusted contact and cooling time set.',
    onboarded: true, lang: 'en',
    told: { conf: 'Pay a business: often · Bank transfer: often', help: 'Chat with me', passport: 'Simple words, larger text' },
    adapts: ['Quick form with no tips for familiar tasks', 'Tasks ordered by how often she uses them', 'Cooling time and a trusted contact on big new payments, which she chose'],
    confidence: { scan: 'often', paynow: 'often', uen: 'often', newpayee: 'often', overseas: 'never', giro: 'help', moneylock: 'help' },
    usage: { scan: 22, paynow: 18, uen: 41, newpayee: 9, overseas: 0, giro: 3, moneylock: 0 },
    balance: 12780.00,
    settings: { simple: true, scale: 4, contrast: false, mode: 'visual', readAloud: false },
    passport: { simple: true, larger: true, patient: false, trustedHelp: false, offerHelp: true },
    safety: { pause: true, cooling: true, coolHours: 12, coolMin: 3000, trusted: { name: 'Faiz (husband)', mobile: '9876 5432', min: 3000 } },
    contacts: [{ name: 'Faiz (husband)', mobile: '9876 5432', family: true, since: '4 years' }, { name: 'Kak Ros (sister)', mobile: '9555 0101', family: true, since: '4 years' }]
  },
  {
    id: 'daniel', need: 'Busy and confident', needSub: 'Wants speed and nothing in the way', name: 'Daniel Tan', short: 'Daniel', initials: 'DT', color: '#a8480f',
    notes: 'Demo note (the app never sees this): everything familiar opens as a quick form with no tips. Shows that the safety check still appears on a risky payment (new payee, S$1,000 or more), and that guidance still appears for the one task he has never done (overseas).',
    onboarded: true, lang: 'en', setupCard: true,
    told: { conf: 'Scan & Pay: often · PayNow: often · Overseas: new to me', help: 'Show me on screen', passport: 'Nothing shared' },
    adapts: ['Fewest taps, no tips', 'Safety check only appears on risky payments', 'Still guided on any task he has never done'],
    confidence: { scan: 'often', paynow: 'often', uen: 'often', newpayee: 'often', overseas: 'never', giro: 'often', moneylock: 'often' },
    usage: { scan: 60, paynow: 74, uen: 12, newpayee: 15, overseas: 0, giro: 6, moneylock: 1 },
    balance: 21450.75,
    settings: { simple: false, scale: 2, contrast: false, mode: 'visual', readAloud: false },
    passport: { simple: false, larger: false, patient: false, trustedHelp: false, offerHelp: false },
    safety: { pause: true, cooling: false, coolHours: 12, coolMin: 1000, trusted: null },
    contacts: [{ name: 'Rachel (wife)', mobile: '9333 4455', family: true, since: '5 years' }, { name: 'Marcus (colleague)', mobile: '8444 5566', since: '1 year' }]
  }
];

/* ---------- Plain-language explanations ---------- */
function X(enStd, enSimple, zhStd, zhSimple, msSimple, taSimple) {
  return { std: { en: enStd, zh: zhStd || enStd, ms: enStd, ta: enStd }, simple: { en: enSimple, zh: zhSimple || enSimple, ms: msSimple || enSimple, ta: taSimple || enSimple } };
}
function Q(en, zh, ms, ta) { return { en, zh, ms, ta }; }

/* ---------- Flow definitions (one engine renders guided or quick) ---------- */
const FLOWS = {
  paynow: {
    steps: [
      { id: 'to', type: 'contact', q: Q('Who are you sending to?', '您要转给谁？', 'Hantar kepada siapa?', 'யாருக்கு அனுப்புகிறீர்கள்?'),
        x: X('PayNow sends money instantly to a mobile number registered with any Singapore bank.', 'Pick a person. The money goes straight to their bank using their phone number.', 'PayNow 可以即时转账到在新加坡任何银行登记的手机号码。', '选一个人。钱会通过他的手机号直接到他的银行。', 'Pilih orang. Wang terus masuk ke bank mereka guna nombor telefon.', 'ஒருவரைத் தேர்ந்தெடுங்கள். அவர் கைபேசி எண் மூலம் பணம் நேராக வங்கிக்குச் செல்லும்.') },
      { id: 'amount', type: 'amount', q: Q('How much?', '转多少钱？', 'Berapa banyak?', 'எவ்வளவு?'),
        x: X('Amounts are in Singapore dollars. Your daily PayNow limit is S$5,000.', 'Type the amount. We will also say it in words so you can spot a wrong zero.', '金额以新元计算。每天 PayNow 上限是 5,000 新元。', '输入金额。我们会用大写再写一次，方便您检查有没有多打一个零。', 'Taip jumlah. Kami tulis dalam perkataan supaya anda nampak jika tersilap sifar.', 'தொகையை உள்ளிடுங்கள். தவறான பூஜ்ஜியத்தைக் கண்டுபிடிக்க எழுத்திலும் காட்டுவோம்.') },
      { id: 'ref', type: 'text', optional: true, q: Q('Add a note (optional)', '加个备注（可选）', 'Tambah nota (pilihan)', 'குறிப்பு சேர் (விருப்பம்)'),
        x: X('The recipient sees this note in their transaction history.', 'A short note like "dinner" helps both of you remember what it was for.', '收款人会在交易记录里看到这个备注。', '写个短备注，比如“晚饭”，双方都记得是什么钱。') }
    ]
  },
  uen: {
    steps: [
      { id: 'uen', type: 'uen', q: Q("What is the business's UEN?", '商家的 UEN 是什么？', 'Apakah UEN perniagaan?', 'வணிகத்தின் UEN என்ன?'),
        x: X('A UEN (Unique Entity Number) is the registration number of a Singapore business. It is printed on invoices and payment notices.', "A UEN is like a business's IC number. Copy it from the bill or letter, not from a chat message.", 'UEN（唯一实体编号）是新加坡公司的注册号码，印在发票和付款通知上。', 'UEN 就像公司的身份证号码。请从账单或信件抄，不要从聊天信息抄。', 'UEN seperti nombor IC syarikat. Salin dari bil atau surat, bukan dari mesej.', 'UEN என்பது நிறுவனத்தின் அடையாள எண் போன்றது. கட்டணச் சீட்டிலிருந்து நகலெடுக்கவும்.'),
        hint: 'Try 53312345A (tuition centre) or 202499999Z (scam demo)' },
      { id: 'check', type: 'namecheck', q: Q('Is this who you meant to pay?', '这是您要付款的对象吗？', 'Adakah ini penerima yang anda maksudkan?', 'நீங்கள் செலுத்த நினைத்தவர் இவரா?'),
        x: X('PayNow shows the name registered to this UEN. Scammers often give a UEN that belongs to a different company.', 'Read the name slowly. If it is not who you expected, stop.', 'PayNow 显示这个 UEN 登记的名字。骗子常给一个属于别的公司的 UEN。', '慢慢看名字。如果不是您以为的那个，请停止。', 'Baca nama perlahan-lahan. Jika bukan yang anda jangka, berhenti.', 'பெயரை மெதுவாகப் படியுங்கள். எதிர்பார்த்தவர் இல்லையென்றால் நிறுத்துங்கள்.') },
      { id: 'amount', type: 'amount', q: Q('How much?', '付多少钱？', 'Berapa banyak?', 'எவ்வளவு?'),
        x: X('The business receives the money immediately.', 'Check the amount against your bill.', '商家会马上收到钱。', '请和账单上的金额对一对。') },
      { id: 'ref', type: 'text', q: Q('Bill or invoice number', '账单或发票号码', 'Nombor bil atau invois', 'கட்டண / விலைப்பட்டியல் எண்'),
        x: X('The business uses this reference to match your payment to your account.', 'Copy the number on your bill so the business knows the money is from you.', '商家用这个号码来对应您的付款。', '抄账单上的号码，让商家知道是您付的钱。') }
    ]
  },
  newpayee: {
    steps: [
      { id: 'bank', type: 'bank', q: Q('Which bank is the account with?', '对方账户在哪家银行？', 'Akaun di bank mana?', 'கணக்கு எந்த வங்கியில்?'),
        x: X('Transfers to most Singapore banks arrive within minutes through FAST.', 'Pick the bank of the person you are paying.', '大部分新加坡银行之间的转账通过 FAST 几分钟内到账。', '选收款人用的银行。') },
      { id: 'acct', type: 'text', inputmode: 'numeric', q: Q('Account number', '账户号码', 'Nombor akaun', 'கணக்கு எண்'),
        x: X('Account numbers are usually 9 to 12 digits.', 'Check every digit. Money sent to a wrong account is hard to get back.', '账户号码通常有 9 到 12 位数字。', '每一个数字都要检查。转错账户很难拿回钱。'), hint: 'Demo: 123456789 belongs to Tan Ah Beng; 555566667 belongs to someone else' },
      { id: 'name', type: 'text', q: Q("Account holder's name", '账户持有人姓名', 'Nama pemegang akaun', 'கணக்கு வைத்திருப்பவர் பெயர்'),
        x: X('We compare this with the name the receiving bank has on record (concept feature: confirmation of payee).', 'Type the name you expect. We will tell you if the bank has a different name.', '我们会和对方银行登记的名字对比（概念功能：收款人确认）。', '输入您以为的名字。如果银行登记的不一样，我们会告诉您。') },
      { id: 'payee', type: 'payeecheck', q: Q("Check who you're paying", '确认收款人是谁', 'Semak siapa yang anda bayar', 'யாருக்குச் செலுத்துகிறீர்கள் என்று சரிபாருங்கள்'),
        x: X('The receiving bank tells us the name on this account, with some letters hidden. We compare it with the name you typed before any money moves.', 'We check that the account really belongs to the person you think you are paying.', '对方银行会告诉我们这个账户的名字（部分字母隐藏）。我们会和您输入的名字对比，然后才转钱。', '我们检查这个账户真的是您以为的那个人的。', 'Kami semak akaun ini benar-benar milik orang yang anda fikir anda bayar.', 'இந்தக் கணக்கு நீங்கள் நினைக்கும் நபருடையதுதானா என்று சரிபார்க்கிறோம்.') },
      { id: 'amount', type: 'amount', q: Q('How much?', '转多少钱？', 'Berapa banyak?', 'எவ்வளவு?'),
        x: X('First transfers to a new payee may be checked by our safety layer.', 'Take your time. Nobody real will rush you to pay a new person.', '第一次转给新收款人可能会经过安全检查。', '慢慢来。真正的人不会催您赶快转钱给陌生人。') }
    ]
  },
  overseas: {
    steps: [
      { id: 'country', type: 'country', q: Q('Which country are you sending to?', '汇到哪个国家？', 'Hantar ke negara mana?', 'எந்த நாட்டுக்கு அனுப்புகிறீர்கள்?'),
        x: X('Overseas transfers use the SWIFT network between banks.', "Pick the country where the person's bank is.", '海外汇款通过银行之间的 SWIFT 网络。', '选收款人银行所在的国家。') },
      { id: 'name', type: 'text', q: Q("Recipient's full name", '收款人全名', 'Nama penuh penerima', 'பெறுநரின் முழுப் பெயர்'),
        x: X('Use the name exactly as it appears on their bank account.', 'Write the name the same way as their bank book.', '请完全按照对方银行账户上的名字填写。', '名字要和对方存折上的一样。') },
      { id: 'swift', type: 'text', q: Q("Bank's SWIFT code", '银行的 SWIFT 代码', 'Kod SWIFT bank', 'வங்கியின் SWIFT குறியீடு'),
        x: X('A SWIFT (BIC) code is 8 or 11 letters and numbers that identify a bank worldwide.', "A SWIFT code is like a postal code for a bank. Ask the person you are paying, or find it on their bank's website.", 'SWIFT（BIC）代码是 8 或 11 位字母和数字，用来识别全球的银行。', 'SWIFT 代码就像银行的邮区编号。可以问收款人，或在对方银行网站找到。', 'Kod SWIFT seperti poskod untuk bank. Tanya penerima atau semak laman web bank mereka.', 'SWIFT குறியீடு வங்கியின் அஞ்சல் குறியீடு போன்றது. பெறுநரிடம் கேளுங்கள்.'), hint: 'Demo: e.g. SBININBB' },
      { id: 'acct', type: 'text', q: Q('Account number', '账户号码', 'Nombor akaun', 'கணக்கு எண்'),
        x: X('Some countries use an IBAN instead of an account number.', 'Copy it carefully from the invoice or from the person.', '有些国家用 IBAN 代替账户号码。', '从账单或收款人那里仔细抄下来。') },
      { id: 'amount', type: 'amount', q: Q('How much in Singapore dollars?', '要汇多少新元？', 'Berapa dalam dolar Singapura?', 'சிங்கப்பூர் டாலரில் எவ்வளவு?'),
        x: X('We show the amount they receive, the fee and when it arrives before you confirm. Rates in this demo are illustrative.', 'We will show exactly how much they get and how much it costs before you confirm.', '确认前我们会显示对方收到多少、手续费和到账时间。本演示的汇率仅供参考。', '确认前会清楚显示对方收到多少钱、要付多少手续费。') }
    ]
  },
  giro: {
    steps: [
      { id: 'org', type: 'org', q: Q('What bill do you want to pay automatically?', '您想自动支付哪种账单？', 'Bil apa yang mahu dibayar automatik?', 'எந்தக் கட்டணத்தைத் தானாகச் செலுத்த வேண்டும்?'),
        x: X('GIRO lets an organisation deduct the bill amount from your account on the due date.', 'GIRO means the bill pays itself each month, so you never pay late.', 'GIRO 让机构在到期日从您的账户扣除账单金额。', 'GIRO 就是账单每个月自己付，不会迟交。') },
      { id: 'ref', type: 'text', q: Q('Your account number with them', '您在该机构的账户号码', 'Nombor akaun anda dengan mereka', 'அவர்களிடம் உங்கள் கணக்கு எண்'),
        x: X('This is on your bill, not your bank account number.', 'Look at the top of your bill for your account or customer number.', '这个号码在账单上，不是您的银行账号。', '看账单上方的“账户号码”或“客户号码”。') },
      { id: 'limit', type: 'amount', q: Q('Highest amount they can take each month', '每月最多可扣多少？', 'Jumlah maksimum sebulan', 'மாதம் அதிகபட்சத் தொகை'),
        x: X('If a bill is higher than this limit, it will not be paid and you will be told.', 'Set a limit a bit above your usual bill. Anything higher needs your OK.', '如果账单高于这个上限，就不会扣款并会通知您。', '设一个比平常账单高一点的上限。超过的话要您同意。') }
    ]
  },
  moneylock: {
    steps: [
      { id: 'amount', type: 'amount', q: Q('How much do you want to lock?', '您想锁住多少钱？', 'Berapa yang mahu dikunci?', 'எவ்வளவு பூட்ட வேண்டும்?'),
        x: X('Locked money stays in your account and keeps earning interest, but it cannot be transferred, paid or withdrawn digitally.', 'Locked money is still yours and still earns interest. Nobody can move it from a phone, not even you.', '锁住的钱仍在您的账户里，继续有利息，但不能在网上转账、付款或提款。', '锁住的钱还是您的，也有利息。谁都不能用手机把它转走，包括您自己。') },
      { id: 'understand', type: 'ack', q: Q('How to unlock it', '怎样解锁', 'Cara membuka kunci', 'எப்படித் திறப்பது'),
        x: X('To unlock, use your OCBC card and PIN at an OCBC ATM in Singapore. It cannot be unlocked in the app. This is on purpose.', 'To get it back, go to an OCBC ATM with your card and PIN. This is on purpose: a scammer on the phone cannot do it.', '解锁需要在新加坡的 OCBC 提款机使用您的卡和密码，不能在手机上解锁。这是故意的。', '要拿回钱，带卡和密码去 OCBC 提款机。这是故意的：电话里的骗子做不到。') }
    ]
  }
};

/* ---------- Glossary for Helper ---------- */
const GLOSSARY = {
  uen: { words: ['uen', 'unique entity'], en: 'A UEN is the registration number of a Singapore business, like an IC number for a company. Copy it from a bill or letter, never from a chat message.', zh: 'UEN 是新加坡公司的注册号码，就像公司的身份证号码。请从账单或信件抄，不要从聊天信息抄。', ms: 'UEN ialah nombor pendaftaran perniagaan di Singapura, seperti nombor IC syarikat.', ta: 'UEN என்பது சிங்கப்பூர் நிறுவனத்தின் பதிவு எண், நிறுவனத்தின் அடையாள அட்டை எண் போன்றது.' },
  paynow: { words: ['paynow', 'pay now'], en: 'PayNow sends money instantly using a mobile number, NRIC or UEN instead of a bank account number. It works across Singapore banks.', zh: 'PayNow 用手机号码、身份证号码或 UEN 即时转账，不需要银行账号。适用于新加坡各银行。', ms: 'PayNow menghantar wang serta-merta guna nombor telefon, NRIC atau UEN.', ta: 'PayNow கைபேசி எண், NRIC அல்லது UEN மூலம் உடனடியாகப் பணம் அனுப்புகிறது.' },
  swift: { words: ['swift', 'bic'], en: 'A SWIFT code is like a postal code for a bank. It tells the world which bank should receive your overseas transfer. It has 8 or 11 characters.', zh: 'SWIFT 代码就像银行的邮区编号，告诉全世界海外汇款要到哪家银行。它有 8 或 11 个字符。', ms: 'Kod SWIFT seperti poskod untuk bank, 8 atau 11 aksara.', ta: 'SWIFT குறியீடு வங்கியின் அஞ்சல் குறியீடு போன்றது, 8 அல்லது 11 எழுத்துகள்.' },
  giro: { words: ['giro'], en: 'GIRO lets a bill pay itself every month from your account. You set a limit, and anything above it needs your OK.', zh: 'GIRO 让账单每个月自动从您的账户付款。您设定上限，超过的话要您同意。', ms: 'GIRO membolehkan bil dibayar sendiri setiap bulan dengan had anda.', ta: 'GIRO மூலம் கட்டணம் ஒவ்வொரு மாதமும் தானாகச் செலுத்தப்படும்.' },
  fast: { words: ['fast transfer', 'fast'], en: 'FAST is the system Singapore banks use to move money between each other within minutes.', zh: 'FAST 是新加坡银行之间几分钟内转账的系统。', ms: 'FAST ialah sistem pindahan pantas antara bank di Singapura.', ta: 'FAST என்பது சிங்கப்பூர் வங்கிகளுக்கு இடையே நிமிடங்களில் பணம் அனுப்பும் முறை.' },
  moneylock: { words: ['money lock', 'lock'], en: 'Money Lock keeps an amount you choose safe from online transfers. It still earns interest. Only you can unlock it, at an OCBC ATM with your card and PIN.', zh: '资金锁让您选的金额不能在网上被转走，仍然有利息。只有您可以在 OCBC 提款机用卡和密码解锁。', ms: 'Money Lock melindungi wang daripada pindahan dalam talian. Buka di ATM OCBC.', ta: 'Money Lock நீங்கள் தேர்ந்தெடுக்கும் தொகையை இணையப் பரிமாற்றத்திலிருந்து காக்கிறது.' },
  qr: { words: ['qr', 'sgqr', 'scan'], en: 'An SGQR code is the square code at shops and hawker stalls. Scan it with the OCBC app, check the shop name, then type the amount.', zh: 'SGQR 是商店和小贩摊位的方形二维码。用 OCBC 应用扫描，核对店名，再输入金额。', ms: 'SGQR ialah kod segi empat di kedai. Imbas, semak nama kedai, kemudian taip jumlah.', ta: 'SGQR என்பது கடைகளில் உள்ள சதுரக் குறியீடு. ஸ்கேன் செய்து, கடைப் பெயரைச் சரிபார்க்கவும்.' },
  cooling: { words: ['cooling', 'delay'], en: 'Cooling time is a delay you choose for big first-time transfers to new payees. It gives you time to think and cancel if something feels wrong.', zh: '冷静期是您为第一次大额转给新收款人设定的等待时间，让您有时间想清楚，觉得不对可以取消。', ms: 'Masa bertenang ialah tempoh tunggu pilihan anda sebelum pindahan besar pertama.', ta: 'காத்திருப்பு நேரம் என்பது புதியவர்களுக்கான பெரிய முதல் பரிமாற்றத்துக்கு நீங்கள் தேர்ந்தெடுக்கும் தாமதம்.' },
  trusted: { words: ['trusted contact', 'trusted'], en: 'A trusted contact is someone you choose to be told about big transfers. They cannot see your balance or approve anything. You can remove them anytime.', zh: '信任联系人是您选的人，大额转账时会通知他。他看不到余额，也不能批准任何东西。随时可以移除。', ms: 'Kenalan dipercayai dimaklumkan tentang pindahan besar, tetapi tidak boleh lihat baki.', ta: 'நம்பகத் தொடர்பு பெரிய பரிமாற்றங்களைப் பற்றி அறிவிக்கப்படுவார்; இருப்பைப் பார்க்க முடியாது.' }
};

/* ---------- What each screen is for (Helper: Explain this screen) ---------- */
const SCREEN_HELP = {
  home: { en: 'This is your home screen. At the top is your account balance. Below are your shortcuts, ordered by what you use most. The green box tells you whether OCBC is really calling you. Tap Helper at the bottom right any time.', zh: '这是首页。上面是账户余额，下面是您的快捷方式，按最常用排序。绿色框告诉您 OCBC 是不是真的在打电话给您。随时可以点右下角的小助手。' },
  pay: { en: 'This screen lists all the ways to pay. Each one shows how familiar you said you are. New tasks offer a practice run first.', zh: '这个页面列出所有付款方式。每一项显示您的熟悉程度。没做过的可以先练习。' },
  scan: { en: 'Point the camera at the QR code at the stall. Check the shop name that appears, then type the amount.', zh: '把镜头对准摊位的二维码。核对出现的店名，然后输入金额。' },
  learn: { en: 'The Practice Hub. Choose a task to practise with pretend money. Scam drills teach you to spot scam messages.', zh: '练习中心。选一个操作，用模拟的钱练习。防骗演练教您认出诈骗信息。' },
  more: { en: 'Settings for how the app looks and helps you: language, text size, simple wording, your Assistance Passport and safety settings.', zh: '设置应用的外观和帮助方式：语言、字体大小、简单用语、协助护照和安全设置。' },
  flow: { en: 'You are in the middle of a transfer. Answer the question on screen. The dashed box explains why we ask. Nothing is sent until you confirm on the check screen.', zh: '您正在转账。请回答屏幕上的问题，虚线框解释为什么要问。要在检查页面确认后才会发送。' },
  review: { en: 'This is the last check. Read the summary sentence. If anything is wrong, tap "Not quite" and fix it. Money moves only when you tap "Yes, send it".', zh: '这是最后检查。看清楚摘要。如果有错，点“不对”去修改。只有点“对，发送”钱才会转出。' },
  receipt: { en: 'Your transfer is complete. This page explains in plain words what happened and what to do if you made a mistake.', zh: '转账完成。这个页面用简单的话说明发生了什么，以及如果出错该怎么办。' },
  onboarding: { en: 'The app is asking a few questions so it can fit the way you bank. Every answer can be changed later in More.', zh: '应用在问几个问题，让它更适合您。所有答案以后都可以在“更多”里修改。' }
};

/* ---------- Scam drills ---------- */
const DRILLS = [
  { id: 'd1', from: 'SMS from "OCBC-Alert"', text: 'Your account has been SUSPENDED due to unusual activity. Verify within 24 hours at ocbc-secure-verify.com to avoid closure.', scam: true,
    why: { en: 'Banks in Singapore do not send clickable links in SMS. The made-up web address and the 24-hour threat are signs of phishing.', zh: '新加坡的银行不会在短信里发可以点的链接。陌生网址和“24 小时内”的威胁都是钓鱼诈骗的迹象。' } },
  { id: 'd2', from: 'Phone call', text: 'This is Inspector Lee from the police. Your bank account is linked to money laundering. To protect your savings, transfer them to this safe account now and do not tell anyone.', scam: true,
    why: { en: 'Police and banks will never ask you to move money to a "safe account" or keep it secret. Government impersonation is one of the costliest scams in Singapore.', zh: '警察和银行绝不会叫您把钱转到“安全账户”或要您保密。冒充政府官员是新加坡损失最大的骗案之一。' } },
  { id: 'd3', from: 'App notification from OCBC', text: 'You sent S$25.00 to MEI LING via PayNow on 2 Nov. If this was not you, open the OCBC app and use the Kill Switch, or call the number on the back of your card.', scam: false,
    why: { en: 'This one is genuine: it has no link, does not ask for your details, and tells you to act through the app or the number on your card.', zh: '这条是真的：没有链接，没有要您的资料，并叫您通过应用或卡背面的号码处理。' } },
  { id: 'd4', from: 'WhatsApp message', text: 'Part-time job! Earn S$300 a day liking videos. Pay a S$50 registration fee by PayNow to UEN 202499999Z to start today.', scam: true,
    why: { en: 'Real jobs do not ask you to pay to start. Job scams are one of the most common scam types in Singapore.', zh: '真正的工作不会要您先付钱。求职诈骗是新加坡最常见的骗案之一。' } }
];

/* ---------- Scam pause questions ---------- */
const PAUSE_QS = [
  { id: 'phone', q: { en: 'Is someone on a call or chat telling you to make this transfer right now?', zh: '现在有人在电话或聊天里叫您转这笔钱吗？', ms: 'Adakah seseorang di telefon atau chat menyuruh anda buat pindahan ini sekarang?', ta: 'இப்போது யாராவது தொலைபேசியில் அல்லது அரட்டையில் இதைச் செய்யச் சொல்கிறார்களா?' },
    type: 'pressure' },
  { id: 'official', q: { en: 'Did they say they are from the police, a government agency, or a bank?', zh: '对方说自己是警察、政府机构或银行吗？', ms: 'Adakah mereka kata mereka dari polis, agensi kerajaan atau bank?', ta: 'அவர்கள் காவல்துறை, அரசு அல்லது வங்கியிலிருந்து என்று சொன்னார்களா?' },
    type: 'impersonation' },
  { id: 'promise', q: { en: 'Were you promised a high return, a job, a prize or a parcel?', zh: '对方有没有承诺高回报、工作、奖品或包裹？', ms: 'Adakah anda dijanjikan pulangan tinggi, kerja, hadiah atau bungkusan?', ta: 'உங்களுக்கு அதிக லாபம், வேலை, பரிசு அல்லது பார்சல் வாக்களிக்கப்பட்டதா?' },
    type: 'promise' }
];

/* ---------- Synthetic aggregate data for the bank insights dashboard ---------- */
const DASH = {
  customers: 1240,
  onboard: { completed: 967, skipped: 273 },
  conf: {
    scan: [62, 258, 920], paynow: [118, 402, 720], uen: [410, 486, 344], newpayee: [522, 438, 280],
    overseas: [804, 302, 134], giro: [590, 408, 242], moneylock: [702, 341, 197]
  },
  practice: { scan: [212, 188], paynow: [301, 241], uen: [266, 171], newpayee: [244, 139], overseas: [318, 152], giro: [140, 77], moneylock: [189, 120] },
  helperTop: [['What is a UEN?', 214], ['Explain this screen', 198], ['Is this message a scam?', 176], ['What is a SWIFT code?', 141], ['Talk to a person', 93], ['Why was my transfer paused?', 66]],
  helperResolved: 0.81,
  pause: { shown: 412, cancelled: 151, continued: 238, coolingHeld: 23 },
  settings: [['Simple wording', 418], ['Larger text', 506], ['Read aloud', 133], ['High contrast', 61], ['Trusted contact set', 207], ['Cooling time on', 289]],
  suggestions: { offered: 640, accepted: 452 },
  sus: 78,
  purpose: [['Paying family or a friend', 'family', 212, 196, 2, 6, 8], ['Paying a bill or a business', 'bill', 88, 84, 0, 2, 2], ['Buying something online', 'shop', 46, 21, 6, 17, 2], ['A job, task or commission', 'job', 31, 2, 4, 20, 5], ['An investment opportunity', 'invest', 22, 3, 7, 9, 3], ['Government, police or bank told me to', 'gov', 13, 0, 0, 6, 7]],
  helperByScreen: [['What is a UEN?', 'Pay a business, step 1', 214], ['Explain this screen', 'Safety check', 198], ['Why does it show a name?', 'Pay a business, name check', 141], ['What is a SWIFT code?', 'Overseas, step 3', 141], ['Why are you asking me this?', 'Safety check', 88], ['Can I cancel after paying?', 'Check screen', 64]],
  reachedPerson: [['Suspected scam', 71], ['Asked for a call-back', 52], ['Locked out of the app', 18]],
  helpCodes: [['Overseas transfer, fees and rate', 63], ['Pay a business, name check', 41], ['Safety check', 37], ['Adding a new payee', 29], ['GIRO setup', 12]]
};

/* ---------- No-assumption audit: every adaptation rule and the input it depends on ---------- */
const RULES = [
  { rule: 'Guided step-by-step form', input: 'Customer set the task to "New to me" or "With help"', never: 'Age, disability, income' },
  { rule: 'Offer practice before a task', input: 'Task set to "New to me"', never: 'Age' },
  { rule: 'Offer the quicker version', input: '3 successful guided runs of that task, and the customer says yes', never: 'Any profile trait' },
  { rule: 'Simple wording line', input: 'Customer switched on Simple wording', never: 'Reading ability guesses' },
  { rule: 'Text size and contrast', input: 'Customer chose a size or contrast', never: 'Eyesight guesses' },
  { rule: 'Read aloud and voice mode', input: 'Customer chose voice mode or read aloud', never: 'Disability' },
  { rule: 'Shortcut order on home', input: 'How often the customer used each task', never: 'Removing any service' },
  { rule: 'Safety check ("What is this payment for?")', input: 'Transaction only: new payee and S$1,000 or more, a first overseas transfer, or a flagged UEN', never: 'Age or who the customer is' },
  { rule: 'Cooling time', input: 'Customer switched it on and chose the hours', never: 'Bank-imposed by profile' },
  { rule: 'Trusted contact notification', input: 'Customer added a contact and threshold', never: 'Any automatic sharing' },
  { rule: 'Dialect audio', input: 'Customer chose a dialect in More', never: 'Ethnicity or age' },
  { rule: 'Family Co-pilot', input: 'Customer invited a named person; ends when they say', never: 'Automatic sharing; family cannot tap' },
  { rule: 'Life Moment suggestions', input: 'Customer told us their life event', never: 'Inferring life events; hiding services' },
  { rule: 'Undo window', input: 'Customer undo setting; transfers to people only, never shops, businesses or bills', never: 'Profile of the customer' },
  { rule: 'Fuller guidance offer', input: '2 or more fixes in one task, or the customer tapped "Show full guidance"', never: 'Age or reading-ability guesses' },
  { rule: 'Suggestion snooze', input: 'Customer tapped "Not now" (30 days) or "Don\'t suggest this again"', never: 'Repeating offers the customer declined' },
  { rule: 'Help code for phone calls', input: 'Customer asked for a code to read to the hotline; expires in 30 minutes', never: 'Account access; sharing outside OCBC' },
  { rule: 'Chat banking', input: 'What the customer typed or said; everything is checked before sending', never: 'Acting without confirmation' },
  { rule: '"Need help?" nudge', input: 'Customer left "Offer help if I seem stuck" on; 25 seconds on one step', never: 'Stored about the person' }
];

/* ==========================================================
   Engine: state, adaptation rules, logging, speech
   ========================================================== */
const SCALES = [0.85, 0.92, 1, 1.1, 1.2, 1.32, 1.45]; // 7 text sizes, matching OCBC's 7-size resizing
const LEVELS = ['never', 'help', 'often'];

/* G = demo-wide state (persists across persona switches). S = the current customer's state. */
const G = { view: 'app', tickets: [], events: [], call: null, personaId: 'lim', newTicket: null, copilot: null, clips: {}, recording: null };
let S = null;

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function nowTime() { return new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }); }

function loadPersona(id) {
  const p = PERSONAS.find(x => x.id === id);
  G.personaId = id;
  S = {
    personaId: p.id, name: p.name, short: p.short,
    onboarded: p.onboarded,
    confidence: clone(p.confidence), usage: clone(p.usage), guided: clone(p.guided || {}),
    practiced: {}, drills: {},
    settings: Object.assign({ lang: p.lang, simple: false, scale: 2, contrast: false, mode: 'visual', readAloud: false, reduceMotion: false }, clone(p.settings || {})),
    passport: Object.assign({ simple: false, larger: false, patient: false, trustedHelp: false, offerHelp: true }, clone(p.passport || {})),
    safety: Object.assign({ pause: true, cooling: false, coolHours: 12, coolMin: 1000, trusted: null }, clone(p.safety || {})),
    balance: p.balance, contacts: clone(p.contacts), payees: [], held: [],
    txns: [
      { d: '01 Nov', what: 'Scan & Pay, Kopi Corner', amt: -4.20 },
      { d: '31 Oct', what: 'Salary / pension credit', amt: 1850.00 },
      { d: '30 Oct', what: 'PayNow to ' + (p.contacts[0] ? p.contacts[0].name.split(' (')[0] : 'family'), amt: -50.00 }
    ],
    log: [], suggestion: null,
    screen: p.onboarded ? 'home' : 'onboarding', stack: [],
    flow: null, ob: { step: 0, a: { tasks: [], conf: {}, how: null, serve: [], safety: null } },
    helper: { open: false, msgs: [] }, modal: null, nudge: false, toast: null,
    dialect: p.dialect || 'off', realThings: !!p.realThings, undoMode: 'new', pending: [], lifeMoment: p.lifeMoment || null, photos: {}, chatBank: [],
    snooze: {}, neverSuggest: {}, adapt: [], hideBal: false, locked: 0, setupCard: !!p.setupCard, safetyOffered: false,
    realUnit: 'food', undoSecs: 60, eraseConfirm: false, tcEdit: false
  };
  S.chatBank.push(chatBankGreeting());
  seedThreads(p); S.thread = null;
  if (G.copilot && G.copilot.persona !== id) G.copilot = null;
  if (p.onboarded) {
    addLog('Loaded saved preferences', 'Set by ' + p.short + ' during an earlier welcome setup', 'you');
    seedAdapt();
  }
  applyScale();
}

/* ---------- Logging: every adaptation has a reason the customer can see ---------- */
function addLog(what, why, kind) {
  S.log.unshift({ t: nowTime(), what, why, kind: kind || 'you' });
  if (S.log.length > 60) S.log.pop();
}
function track(type, data) {
  G.events.push(Object.assign({ type, persona: S.personaId, t: Date.now() }, data || {}));
}

/* ---------- Adaptation rules ---------- */
function opensAs(task) {
  const sp = engineCompose(task);
  if (task === 'scan') return sp.explain === 'none' ? 'Camera, no tips' : 'Camera with tips';
  return sp.layout === 'quick' ? 'Quick form' : 'Step by step';
}
function guidanceFor(task) { return engineCompose(task).layout === 'quick' ? 'quick' : 'guided'; }
function levelLabel(l) { return t('lvl_' + l); }
function taskName(id) { return t('t_' + id); }
function taskShort(id) { return t('s_' + id); }

function setLevel(task, level, source) {
  const before = S.confidence[task];
  if (before === level) return;
  S.confidence[task] = level;
  const why = source === 'suggest' ? t('why_suggest') : source === 'helper' ? t('why_helper') : t('why_you');
  addLog(taskName(task) + ': ' + levelLabel(before) + ' to ' + levelLabel(level), why + '. ' + (task === 'scan' ? (level === 'often' ? 'Scan now opens straight to the camera, without tips.' : 'Scan now shows tips with the camera.') : level === 'often' ? 'This task now opens as a quick form.' : 'This task now guides you step by step.'), source === 'suggest' ? 'suggest' : 'you');
  track('conf_change', { task, from: before, to: level, source });
  recordAdapt('lvl:' + task, taskName(task) + ': ' + levelLabel(level), source, { t: 'level', task, v: before }, level);
}

function setSetting(key, value, source) {
  const before = S.settings[key];
  S.settings[key] = value;
  const why = source === 'helper' ? t('why_helper') : t('why_you');
  const names = { simple: t('simple'), contrast: t('contrast'), readAloud: t('read_aloud'), scale: t('text_size'), lang: t('language'), mode: t('show_as'), reduceMotion: 'Reduce motion', spacing: 'Extra spacing', calm: 'Calm mode' };
  let shown = value;
  if (key === 'scale') shown = (value + 1) + ' of 7';
  if (key === 'lang') shown = (LANGS.find(l => l.code === value) || {}).name;
  if (typeof value === 'boolean') shown = value ? 'on' : 'off';
  addLog((names[key] || key) + ': ' + shown, why, source === 'helper' ? 'you' : 'you');
  track('setting', { key, value });
  if (key === 'scale') applyScale();
  recordAdapt('set:' + key, (names[key] || key) + ': ' + shown, source, { t: 'setting', k: key, v: before }, value);
  return before;
}

function applyScale() {
  document.documentElement.style.setProperty('--scale', SCALES[S.settings.scale] || 1);
}

/* Shortcuts ordered by real usage, never hiding any service */
function shortcutOrder() {
  return TASKS.map(x => x.id).sort((a, b) => (S.usage[b] || 0) - (S.usage[a] || 0)).slice(0, 4);
}

/* After a real task completes: offer, never impose. One suggestion at a time; "Not now" snoozes
   it for 30 days and "Don't suggest this again" turns it off. Rules read task counts only. */
const SNOOZE_MS = 30 * 24 * 3600e3;
function canSuggest(kind, task) {
  const k = kind + ':' + task;
  if (S.neverSuggest[k]) return false;
  if (S.snooze[k] && S.snooze[k] > Date.now()) return false;
  return !S.suggestion;
}
function offer(s) { if (canSuggest(s.kind, s.task)) { S.suggestion = s; track('suggest_offer', { task: s.task, kind: s.kind }); } }
function afterComplete(task, mode, errors, practice, usedFull) {
  if (practice) {
    S.practiced[task] = true;
    track('practice_done', { task });
    if (S.confidence[task] === 'never') offer({ kind: 'practiced', task });
    return;
  }
  S.usage[task] = (S.usage[task] || 0) + 1;
  track('real_done', { task, mode, afterPractice: !!S.practiced[task] });
  if (mode === 'guided') {
    S.guided[task] = (S.guided[task] || 0) + 1;
    S.guidedErrors = S.guidedErrors || {};
    if (errors) S.guidedErrors[task] = (S.guidedErrors[task] || 0) + errors;
    if ((errors >= 2 || usedFull) && S.confidence[task] === 'help') offer({ kind: 'full', task });
    else if (S.guided[task] >= 3 && !(S.guidedErrors[task] > 0) && S.confidence[task] !== 'often') offer({ kind: 'quick', task, n: S.guided[task] });
  } else if (errors >= 2 && S.confidence[task] === 'often') {
    offer({ kind: 'help', task });
  }
}

/* ---------- "Your adaptations": one removable list of everything changed, with its source ---------- */
const ADAPT_SRC = { you: 'You chose this', setup: 'From your welcome setup', suggest: 'You said yes to a suggestion', helper: 'You asked Helper', saved: 'Saved earlier' };
function recordAdapt(key, label, source, undo, now) {
  if (!S || !S.adapt) return;
  const src = (source === 'you' && S.screen === 'onboarding') ? 'setup' : (source || 'you');
  const i = S.adapt.findIndex(a => a.key === key);
  if (i >= 0) {
    if (JSON.stringify(S.adapt[i].undo.v) === JSON.stringify(now)) { S.adapt.splice(i, 1); return; }
    Object.assign(S.adapt[i], { label, src, when: nowTime() });
    return;
  }
  if (undo && JSON.stringify(undo.v) === JSON.stringify(now)) return;
  S.adapt.unshift({ key, label, src, when: nowTime(), undo });
}
function seedAdapt() {
  const p = PERSONAS.find(x => x.id === S.personaId);
  const sc = S.settings, add = (key, label, undo) => S.adapt.push({ key, label, src: 'saved', when: 'Earlier', undo });
  if (sc.simple) add('set:simple', t('simple') + ': on', { t: 'setting', k: 'simple', v: false });
  if (sc.scale !== 2) add('set:scale', t('text_size') + ': ' + (sc.scale + 1) + ' of 7', { t: 'setting', k: 'scale', v: 2 });
  if (sc.contrast) add('set:contrast', t('contrast') + ': on', { t: 'setting', k: 'contrast', v: false });
  TASKS.forEach(x => { if (S.confidence[x.id] === 'often') add('lvl:' + x.id, taskName(x.id) + ': ' + levelLabel('often'), { t: 'level', task: x.id, v: 'help' }); });
  if (S.safety.cooling) add('safety:cooling', 'Cooling time for new payees: on', { t: 'safety', k: 'cooling', v: false });
  if (S.safety.trusted) add('safety:trusted', 'Trusted contact: ' + S.safety.trusted.name, { t: 'trusted' });
  void p;
}
function removeAdapt(key) {
  const i = S.adapt.findIndex(a => a.key === key); if (i < 0) return;
  const a = S.adapt.splice(i, 1)[0], u = a.undo || {};
  if (u.t === 'level') { S.confidence[u.task] = u.v; addLog(taskName(u.task) + ': back to ' + levelLabel(u.v), 'You removed it from your adaptations', 'you'); }
  else if (u.t === 'setting') { S.settings[u.k] = u.v; if (u.k === 'scale') applyScale(); if (u.k === 'simple') S.passport.simple = u.v; addLog(a.label.split(':')[0] + ': back to before', 'You removed it from your adaptations', 'you'); }
  else if (u.t === 'safety') { S.safety[u.k] = u.v; addLog(a.label.split(':')[0] + ': off', 'You removed it from your adaptations', 'safety'); }
  else if (u.t === 'trusted') { S.safety.trusted = null; addLog('Trusted contact removed', 'You removed it from your adaptations', 'safety'); }
  else if (u.t === 'life') { S.lifeMoment = null; addLog('Life moment removed', 'You removed it from your adaptations', 'you'); }
  else if (u.t === 'dialect') { S.dialect = 'off'; addLog('Dialect audio: off', 'You removed it from your adaptations', 'you'); }
  else if (u.t === 'real') { S.realThings = false; }
  else if (u.t === 'undoMode') { S.undoMode = u.v; }
  else if (u.t === 'undoSecs') { S.undoSecs = 60; }
  else if (u.t === 'passport') { S.passport[u.k] = u.v; }
  track('adapt_remove', { key });
}

/* ---------- Scam Shield rules (based on the transaction, never on the person) ---------- */
function isNewPayee(flow) {
  if (flow.task === 'newpayee' || flow.task === 'overseas') return true;
  if (flow.task === 'paynow') return String(flow.data.to || '').startsWith('mobile:');
  if (flow.task === 'uen') return !S.payees.includes(flow.data.uen);
  return false;
}
function needsPause(flow) {
  const amt = Number(flow.data.amount || 0);
  if (!S.safety.pause) return false;
  if (flow.task === 'uen' && UEN_DIR[flow.data.uen] && UEN_DIR[flow.data.uen].risky) return true;
  if (flow.task === 'overseas' && !(S.usage.overseas > 0)) return true; // first overseas transfer
  return isNewPayee(flow) && amt >= 1000;
}
function coolingApplies(flow) {
  return S.safety.cooling && isNewPayee(flow) && Number(flow.data.amount || 0) >= S.safety.coolMin;
}
function trustedApplies(flow) {
  const tc = S.safety.trusted;
  return tc && Number(flow.data.amount || flow.data.limit || 0) >= (tc.min || 1000) && flow.task !== 'moneylock';
}

/* ---------- Speech (read aloud + voice input) ---------- */
/* speak() and stopSpeak() live in views-speech.js */

function listen(onText, onEnd) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!R) { onEnd && onEnd(false); return false; }
  try {
    const r = new R();
    const lang = LANGS.find(l => l.code === S.settings.lang);
    r.lang = lang ? lang.speech : 'en-SG';
    r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = e => onText(e.results[0][0].transcript);
    r.onend = () => onEnd && onEnd(true);
    r.onerror = () => onEnd && onEnd(false);
    r.start();
    return true;
  } catch (e) { onEnd && onEnd(false); return false; }
}

/* Parse spoken numbers like "five hundred" or "500" */
function parseSpokenAmount(s) {
  const digits = String(s).replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (digits) return digits[0];
  const map = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
  let total = 0, cur = 0;
  for (const w of String(s).toLowerCase().split(/[\s-]+/)) {
    if (map[w] != null) cur += map[w];
    else if (w === 'hundred') cur *= 100;
    else if (w === 'thousand') { total += cur * 1000; cur = 0; }
  }
  total += cur;
  return total ? String(total) : '';
}

/* Mask sensitive values in anything shared with staff */
function mask(v) {
  const s = String(v || '');
  if (s.length <= 4) return '****';
  return '*'.repeat(Math.max(0, s.length - 4)) + s.slice(-4);
}

/* ==========================================================
   App screens: home, pay hub, learn, more, passport, confidence,
   safety, log, drills, onboarding
   ========================================================== */

function header(title, opts) {
  opts = opts || {};
  return '<div class="apphead plain">' +
    (opts.noBack ? '' : '<button class="iconbtn" data-a="back" aria-label="' + t('back') + '">' + ic('back') + '</button>') +
    '<h1 id="screen-title" tabindex="-1">' + esc(title) + '</h1>' + (opts.right || (opts.noHelper ? '' : helperHeadBtn())) + '</div>';
}

let ENG_PLAIN = false;
function expl(x) {
  // Official text, plus a plain-language line when Simple wording is on
  if (!x) return '';
  const lang = S.settings.lang;
  const std = (x.std && (x.std[lang] || x.std.en)) || '';
  const simple = (x.simple && (x.simple[lang] || x.simple.en)) || '';
  if (S.settings.simple || ENG_PLAIN || S.settings.mode === 'text') return esc(std) + '<span class="simple-line">' + esc(simple) + '</span>';
  return esc(std);
}

function activeAdaptations() {
  const out = [];
  if (S.settings.lang !== 'en') out.push({ k: 'lang', label: (LANGS.find(l => l.code === S.settings.lang) || {}).name });
  if (S.settings.simple) out.push({ k: 'simple', label: t('simple') });
  if (S.settings.scale > 2) out.push({ k: 'scale', label: t('larger') });
  if (S.settings.contrast) out.push({ k: 'contrast', label: t('contrast') });
  if (S.settings.readAloud) out.push({ k: 'readAloud', label: t('read_aloud') });
  if (S.settings.mode !== 'visual') out.push({ k: 'mode', label: t('mode_' + S.settings.mode) });
  return out;
}
function whyChips() {
  const a = activeAdaptations();
  if (!a.length) return '';
  return '<div class="card" style="padding:10px 12px" aria-label="Active adaptations"><div class="small muted" style="margin-bottom:6px">' + ic('info', 14) + ' ' + t('why_you') + ' · ' + t('undo') + ' ×</div>' + a.map(x =>
    '<button class="why" data-a="undoSetting" data-v="' + x.k + '" aria-label="' + esc(x.label) + '. ' + t('why_you') + '. ' + t('undo') + '">' +
    esc(x.label) + ' <span class="x" aria-hidden="true">×</span></button>').join('') + '</div>';
}
function callBanner() {
  if (G.call && (!G.call.persona || G.call.persona === S.personaId)) {
    return '<div class="banner safe" role="status">' + ic('shield') + '<div><b>' + t('call_live') + '</b>' + t('call_live_sub', { name: esc(G.call.agent), code: G.call.code }) + '</div></div>';
  }
  return '<div class="banner safe" role="status">' + ic('shield') + '<div><b>' + t('call_none') + '</b>' + '<span class="sr-only">' + t('call_none_sub') + '</span>' + '</div></div>';
}

function dots(level) {
  const n = LEVELS.indexOf(level) + 1;
  return '<span class="dots" aria-hidden="true"><i class="' + (n >= 1 ? 'on' : '') + '"></i><i class="' + (n >= 2 ? 'on' : '') + '"></i><i class="' + (n >= 3 ? 'on' : '') + '"></i></span>';
}

function suggestionCard() {
  const s = S.suggestion;
  if (!s) return '';
  let text = '', yesV = '';
  if (s.kind === 'quick') { text = t('sugg_quick', { task: taskName(s.task), n: s.n }); }
  else if (s.kind === 'help') { text = t('sugg_help', { task: taskName(s.task) }); }
  else if (s.kind === 'practiced') { text = t('sugg_practiced', { task: taskName(s.task), a: t('lvl_never'), b: t('lvl_help') }); }
  else if (s.kind === 'full') { text = t('sugg_full', { task: taskName(s.task) }); }
  const why = suggestionWhy(s);
  return '<div class="card" role="region" aria-label="Suggestion" style="border-left:4px solid var(--green)">' +
    '<div class="row" style="align-items:flex-start">' + '<span style="color:var(--green)">' + ic('sparkle') + '</span><div style="flex:1"><div class="small" style="font-weight:700;color:var(--green);margin-bottom:2px">' + t('sugg_label') + '</div><div style="font-weight:600;line-height:1.4">' + esc(text) + '</div>' +
    '<button class="linkbtn" style="padding:4px 0;min-height:32px" data-a="suggestWhy" aria-expanded="' + !!S.suggestWhy + '">' + ic('info', 14) + ' ' + t('sugg_whybtn') + '</button>' +
    (S.suggestWhy ? '<div class="small" style="background:var(--bg);border-radius:8px;padding:8px 10px;margin:2px 0 4px">' + esc(why) + '</div>' : '') +
    '<div class="small muted">' + t('sugg_promise') + '</div>' +
    '<div class="row" style="margin-top:10px;flex-wrap:wrap"><button class="btn green" data-a="suggestYes">' + t('yes') + '</button><button class="btn ghost" data-a="suggestNo">' + t('not_now') + '</button></div>' +
    '<button class="linkbtn" style="padding:2px 0;min-height:32px;font-size:calc(13px*var(--scale))" data-a="suggestNever">' + t('sugg_never') + '</button></div></div></div>';
}

function heldCard() {
  if (!S.held.length) return '';
  return '<div class="card"><h2 class="row">' + ic('hourglass') + ' Held by your cooling time</h2>' +
    S.held.map((h, i) => '<div class="between" style="padding:8px 0;border-top:1px solid var(--line)"><div><div style="font-weight:600">' + money(h.amount) + ' to ' + esc(h.to) + '</div><div class="small muted">Sends at ' + esc(h.at) + ' unless you cancel</div></div><button class="btn secondary" data-a="cancelHeld" data-v="' + i + '">' + t('cancel') + '</button></div>').join('') + '</div>';
}

/* ---------------- HOME ---------------- */
function viewHome() {
  const order = shortcutOrder();
  const firstNew = TASKS.find(x => S.confidence[x.id] === 'never' && !S.practiced[x.id]);
  return '<div class="apphead"><div class="between"><span class="wordmark">OCBC</span><div class="row">' +
    '<button class="iconbtn" style="color:#fff" aria-label="Notifications">' + ic('bell') + '</button>' +
    '<button class="iconbtn" style="color:#fff" data-a="go" data-v="more" aria-label="Settings">' + ic('user') + '</button></div></div>' +
    '<div class="greet" id="screen-title" tabindex="-1">' + t('hello') + ', ' + esc(S.short) + '</div><div class="sub">' + new Date().toLocaleDateString({ zh: 'zh-SG', ms: 'ms-MY', ta: 'ta-SG' }[S.settings.lang] || 'en-SG', { weekday: 'long', day: 'numeric', month: 'long' }) + '</div></div>' +
    '<div class="acct"><div class="between"><div><div class="label">' + t('acct_name') + ' · <span class="sensitive">6xx-xxxxx3-001</span></div><div class="big sensitive">' + (S.hideBal ? 'S$ ••••••' : money(S.balance)) + '</div><div class="label">' + t('avail') + (S.locked ? ' · <span class="sensitive">' + money(S.locked) + '</span> locked with Money Lock' : '') + '</div></div>' +
    '<button class="iconbtn" data-a="hideBal" aria-label="' + (S.hideBal ? 'Show balance' : 'Hide balance') + '" aria-pressed="' + !!S.hideBal + '" style="color:var(--red)">' + ic('eye', 24) + '</button></div></div>' +
    '<div class="pad" style="padding-top:2px">' +
    setupCard() + (typeof forYou === 'function' ? forYou() : '') + callBanner() + pendingCard() + suggestionCard() + heldCard() + lifeCard() + whyChips() +
    '<div class="between" style="margin:6px 0 8px;flex-wrap:wrap"><h2 style="font-size:calc(16px*var(--scale));margin:0">' + t('shortcuts') + '</h2><span class="small muted">' + t('shortcuts_why') + '</span></div>' +
    '<div class="qa">' + order.map(id => '<button data-a="startTask" data-v="' + id + '"><span class="ic">' + ic(TASK[id].icon) + '</span>' + esc(taskShort(id)) + '<span class="lvl">' + levelLabel(S.confidence[id]) + '</span></button>').join('') + '</div>' +
    '<button class="linkbtn" data-a="go" data-v="pay">' + t('all_services') + ' ' + ic('arrow', 16) + '</button>' +
    '<div class="qa" style="grid-template-columns:1fr 1fr;margin-bottom:12px"><button data-a="go" data-v="chatbank" style="flex-direction:row;min-height:60px;gap:10px;padding:10px 12px;text-align:left"><span class="ic">' + ic('chat') + '</span>Chat with your account</button><button data-a="copilotStart" style="flex-direction:row;min-height:60px;gap:10px;padding:10px 12px;text-align:left"><span class="ic">' + ic('family') + '</span>Ask family to help</button></div>' +
    (firstNew ? '<div class="card row" style="margin-top:4px"><span class="ic" style="color:var(--red)">' + ic('learn', 28) + '</span><div style="flex:1"><h3>' + esc(taskName(firstNew.id)) + '</h3><div class="small muted">' + esc(tx(firstNew.learn)) + '</div></div><button class="btn secondary" data-a="startPractice" data-v="' + firstNew.id + '">' + t('practice') + '</button></div>' : '') +
    '<div class="card"><div class="between"><h2>' + t('conf_title') + '</h2><button class="linkbtn" data-a="go" data-v="confidence">' + t('edit') + '</button></div>' +
    '<div class="conf-mini">' + TASKS.map(x => '<span class="cm" title="' + esc(levelLabel(S.confidence[x.id])) + '"><span>' + esc(taskShort(x.id)) + '</span>' + dots(S.confidence[x.id]) + '<span class="sr-only">' + levelLabel(S.confidence[x.id]) + '</span></span>').join('') + '</div></div>' +
    '<div class="card"><h2>' + t('recent') + '</h2>' + S.txns.slice(0, 4).map(x => '<div class="kv tx"><span class="tx-av' + (x.amt < 0 ? '' : ' in') + '" aria-hidden="true">' + (typeof txIcon === 'function' ? txIcon(x) : ic('arrow', 18)) + '</span><span class="tx-m"><span class="tx-w">' + esc(typeof txMain === 'function' ? txMain(x) : x.what) + '</span><span class="tx-d">' + esc(typeof txSub === 'function' ? txSub(x) : x.d) + '</span></span><span class="tx-a" style="color:' + (x.amt < 0 ? 'var(--ink)' : 'var(--green)') + '">' + (x.amt < 0 ? '-' : '+') + money(Math.abs(x.amt)) + '</span></div>').join('') + '</div>' +
    '</div>';
}

/* ---------------- PAY HUB ---------------- */
function viewPay() {
  return header(t('nav_pay'), { noBack: true }) + '<div class="pad">' + callBanner() +
    '<div class="list">' + TASKS.map(x => {
      const lvl = S.confidence[x.id];
      return '<button data-a="startTask" data-v="' + x.id + '"><span class="ic">' + ic(x.icon) + '</span><span class="grow"><span class="t1">' + esc(taskName(x.id)) + '</span><br><span class="t2">' + levelLabel(lvl) + ' · ' + (guidanceFor(x.id) === 'guided' ? t('guided') : t('quick')) + '</span></span>' + ic('arrow', 18) + '</button>';
    }).join('') + '</div>' +
    '<p class="small muted">Each task opens the way your confidence setting says. You can switch between step-by-step and quick form inside any task.</p></div>';
}

/* ---------------- LEARN (Practice Hub) ---------------- */
function viewLearn() {
  const done = TASKS.filter(x => S.practiced[x.id]).length;
  return header(t('learn_title'), { noBack: true }) + '<div class="pad"><p class="muted" style="margin-top:0">' + t('learn_sub') + '</p>' +
    '<div class="card row" style="gap:12px"><b style="font-size:calc(22px*var(--scale));color:var(--red)">' + done + ' of ' + TASKS.length + '</b><div style="flex:1"><div style="font-weight:700">practised</div><div class="progress" style="margin:6px 0 0"><span style="width:' + Math.round(done / TASKS.length * 100) + '%"></span></div></div></div>' +
    '<p class="small muted">Practice never asks for your OneToken, OTP or real account numbers. Anything that does is not practice.</p>' +
    TASKS.map(x => {
      const lvl = S.confidence[x.id];
      const tags = (S.practiced[x.id] ? '<span class="tag done">Practised</span>' : '') + (lvl === 'never' && !S.practiced[x.id] ? '<span class="tag rec">Recommended for you</span>' : '') + '<span class="tag">' + x.mins + ' min</span>';
      return '<div class="card scenario"><span class="ic">' + ic(x.icon) + '</span><div style="flex:1"><h3>' + esc(taskName(x.id)) + '</h3><div class="small muted" style="margin-bottom:6px">You will learn: ' + esc(tx(x.learn)) + '</div>' + tags +
        '<div style="margin-top:10px"><button class="btn secondary" data-a="startPractice" data-v="' + x.id + '">' + ic('play', 16) + ' ' + t('practice') + '</button></div></div></div>';
    }).join('') +
    '<h2 style="font-size:calc(17px*var(--scale));margin:18px 0 4px">' + t('drills') + '</h2><p class="small muted" style="margin-top:0">' + t('drills_sub') + '</p>' +
    '<div class="list">' + DRILLS.map((d, i) => '<button data-a="openDrill" data-v="' + i + '"><span class="ic">' + ic('shieldx') + '</span><span class="grow"><span class="t1">Drill ' + (i + 1) + ': ' + esc(d.from) + '</span><br><span class="t2">' + (S.drills[d.id] != null ? (S.drills[d.id] ? 'Answered correctly' : 'Try again') : 'Not tried yet') + '</span></span>' + ic('arrow', 18) + '</button>').join('') + '</div></div>';
}

function viewDrill() {
  const i = S.drillIdx || 0, d = DRILLS[i], ans = S.drillAnswer;
  let res = '';
  if (ans != null) {
    const right = ans === d.scam;
    res = '<div class="banner ' + (right ? 'safe' : 'danger') + '" role="alert">' + ic(right ? 'check' : 'alert') + '<div><b>' + (right ? 'Correct.' : 'Not quite.') + ' This is ' + (d.scam ? 'a scam' : 'genuine') + '.</b>' + esc(tx(d.why)) + '</div></div>' +
      (i < DRILLS.length - 1 ? '<button class="btn primary block" data-a="openDrill" data-v="' + (i + 1) + '">Next drill</button>' : '<button class="btn primary block" data-a="go" data-v="learn">' + t('done') + '</button>');
  }
  return header('Drill ' + (i + 1) + ' of ' + DRILLS.length) + '<div class="pad"><p class="muted">Is this message a scam?</p>' +
    '<div class="sms"><div class="from">' + esc(d.from) + '</div>' + esc(d.text) + '</div>' +
    (ans == null ? '<div class="yn" style="margin-top:16px"><button class="btn primary" data-a="drillAnswer" data-v="1">Scam</button><button class="btn secondary" data-a="drillAnswer" data-v="0">Looks real</button></div>' : '<div style="margin-top:16px">' + res + '</div>') + '</div>';
}

/* ---------------- MORE / SETTINGS ---------------- */
function toggleRow(label, sub, key, checked, action) {
  const id = 'tg-' + key;
  return '<div class="li"><span class="grow"><label for="' + id + '" class="t1">' + esc(label) + '</label>' + (sub ? '<br><span class="t2">' + esc(sub) + '</span>' : '') + '</span>' +
    '<span class="toggle"><input type="checkbox" role="switch" id="' + id + '" data-a="' + (action || 'toggleSetting') + '" data-v="' + key + '"' + (checked ? ' checked' : '') + '><span></span></span></div>';
}
function viewMore() {
  const sc = S.settings;
  return moreHead() + '<div class="pad">' + whyChips() +
    '<h2 class="o-h2">Made for you</h2><div class="list">' +
    navRow('sparkle', 'adaptations', 'Your adaptations', S.adapt.length + ' changes made for you, each removable') +
    navRow('passport', 'passport', t('passport'), 'What OCBC staff and Helper know about how to serve you') +
    navRow('map', 'confidence', t('conf_title'), 'Change how much help each task gives you') +
    navRow('shield', 'safety', t('safety'), 'Scam pause, cooling time, trusted contact') +
    navRow('heart', 'life', 'Life Moments', S.lifeMoment ? 'You told us: ' + LIFE.find(x => x.id === S.lifeMoment).title : 'Tell us about a change in your life, if you want') +
    navRow('family', 'copilotSetup', 'Ask family to help', 'Family Co-pilot: they see and point, never tap') +
    navRow('chat', 'chatbank', 'Chat with your account', 'Bank by typing or sending voice notes') +
    navRow('learn', 'learn', 'Practice Hub', 'Practise any task with pretend money') +
    navRow('list', 'log', t('log_title'), S.log.length + ' changes, each with its reason') +
    '<button data-a="redoOnboarding"><span class="ic">' + ic('refresh') + '</span><span class="grow"><span class="t1">Redo welcome setup</span><br><span class="t2">Answer the questions again</span></span>' + ic('arrow', 18) + '</button></div>' +
    '<h2 class="o-h2">Payments &amp; transfers</h2><div class="list">' +
    navRow('users', 'payees', 'My payees', 'Add photos so you see a face when you pay') +
    '<button data-a="startTask" data-v="moneylock"><span class="ic">' + ic('lock') + '</span><span class="grow"><span class="t1">Use Money Lock</span><br><span class="t2">Lock money so it cannot be moved from a phone</span></span>' + ic('arrow', 18) + '</button></div>' +
    '<div class="card"><h2>Undo window</h2><div class="seg" role="group" aria-label="Undo window">' + [['off', 'Off'], ['new', 'New people'], ['all', 'All people']].map(o => '<button data-a="setUndo" data-v="' + o[0] + '" aria-pressed="' + (S.undoMode === o[0]) + '">' + o[1] + '</button>').join('') + '</div>' + '<div class="small" style="margin:10px 0 4px;font-weight:700">Wait for</div><div class="seg" role="group" aria-label="Undo wait">' + [10, 30, 60].map(n => '<button data-a="setUndoSecs" data-v="' + n + '" aria-pressed="' + ((S.undoSecs || 60) === n) + '">' + n + ' seconds</button>').join('') + '</div>' +
    '<p class="small muted" style="margin:8px 0 0">Transfers to people wait before they are sent, with an Undo button. Never for Scan & Pay, businesses or bills: they are paid instantly. Until it is sent, the screen says "Not paid yet".</p></div>' +
    '<h2 class="o-h2">Profile &amp; app settings</h2>' +
    '<div class="card"><h2>' + t('language') + '</h2><div class="seg" role="group" aria-label="' + t('language') + '">' + LANGS.map(l => '<button data-a="setLang" data-v="' + l.code + '" aria-pressed="' + (sc.lang === l.code) + '">' + esc(l.name) + '</button>').join('') + '</div>' +
    '<p class="small muted" style="margin:8px 0 0">Prototype translations: to be checked by native speakers.</p></div>' +
    '<div class="card"><h2>' + t('text_size') + '</h2><div class="between"><button class="btn secondary" data-a="scale" data-v="-1" aria-label="Smaller text">A-</button>' +
    '<div class="row" aria-hidden="true" style="gap:4px">' + SCALES.map((_, i) => '<span style="width:12px;height:' + (8 + i * 3) + 'px;border-radius:3px;background:' + (i <= sc.scale ? 'var(--red)' : 'var(--line)') + ';display:inline-block"></span>').join('') + '</div>' +
    '<button class="btn secondary" data-a="scale" data-v="1" aria-label="Larger text">A+</button></div><p class="small muted" style="margin:8px 0 0" aria-live="polite">Size ' + (sc.scale + 1) + ' of 7</p></div>' +
    '<div class="card"><h2>' + t('show_as') + '</h2><div class="seg" role="group" aria-label="' + t('show_as') + '">' + ['visual', 'text', 'voice', 'chat'].map(m => '<button data-a="setMode" data-v="' + m + '" aria-pressed="' + (sc.mode === m) + '">' + t('mode_' + m) + '</button>').join('') + '</div><p class="small muted" style="margin:8px 0 0">Visual uses pictures, icons and short tips. Text uses words only, with the full explanation on every step and a typed option instead of the camera. Voice reads each step aloud and lets you answer by speaking. Balances and account numbers are not read aloud unless you ask. Chat turns every task into a conversation, with voice notes. You can switch in the middle of a task without losing anything.</p></div>' +
    '<div class="card"><h2>Dialect audio</h2><div class="seg" role="group" aria-label="Dialect audio" style="grid-auto-flow:row;grid-template-columns:1fr 1fr">' + DIALECTS.map(d => '<button data-a="setDialect" data-v="' + d.code + '" aria-pressed="' + (S.dialect === d.code) + '">' + esc(d.name) + '</button>').join('') + '</div><p class="small muted" style="margin:8px 0 0">Screens stay in your chosen language. Key steps and the final check are read to you in your dialect.</p>' + (S.dialect !== 'off' ? '<button class="pill" style="margin-top:8px" data-a="playDialect" data-v="welcome">' + ic('speaker', 14) + ' Try it</button>' : '') + '</div>' +
    '<div class="list">' + toggleRow(t('simple'), 'Adds a plain-language line under official text. Never removes fees or risks.', 'simple', sc.simple) +
    toggleRow('Calm mode', 'Hides promotions, deals and festive banners.', 'calm', !!sc.calm) +
    toggleRow(t('contrast'), 'Stronger borders and darker text.', 'contrast', sc.contrast) +
    toggleRow(t('read_aloud'), 'Reads new screens and steps aloud.', 'readAloud', sc.readAloud) +
    toggleRow('Extra spacing', 'More space between lines, letters and words (WCAG 1.4.12).', 'spacing', !!sc.spacing) +
    toggleRow('Reduce motion', 'Turns off animations.', 'reduceMotion', sc.reduceMotion) +
    toggleRow('Amounts in everyday things', 'Optional, off by default. Shows an amount in something you choose.', 'realThings', S.realThings, 'toggleReal') + '</div>' +
    (S.realThings ? '<div class="card"><h2>Show amounts as</h2><div class="seg" role="group" aria-label="Show amounts as" style="grid-auto-flow:row;grid-template-columns:1fr 1fr">' + REAL_UNITS.map(u => '<button data-a="setRealUnit" data-v="' + u.id + '" aria-pressed="' + (S.realUnit === u.id) + '">' + esc(u.label) + '</button>').join('') + '</div></div>' : '') +
    '<h2 class="o-h2">Need more help?</h2><div class="list">' +
    '<button data-a="openHelper"><span class="ic">' + ic('chat') + '</span><span class="grow"><span class="t1">Ask OCBC Helper</span><br><span class="t2">Knows the screen you are on</span></span>' + ic('arrow', 18) + '</button>' +
    '<button data-a="helpCode"><span class="ic">' + ic('headset') + '</span><span class="grow"><span class="t1">Phoning us? Get a help code</span><br><span class="t2">The officer sees where you got stuck</span></span>' + ic('arrow', 18) + '</button></div>' +
    '</div>';
}
function navRow(icon, screen, title, sub) {
  return '<button data-a="go" data-v="' + screen + '"><span class="ic">' + ic(icon) + '</span><span class="grow"><span class="t1">' + esc(title) + '</span><br><span class="t2">' + esc(sub) + '</span></span>' + ic('arrow', 18) + '</button>';
}

/* ---------------- PASSPORT (Idea G) ---------------- */
function viewPassport() {
  const p = S.passport;
  const shared = [];
  shared.push('Language: ' + (LANGS.find(l => l.code === S.settings.lang) || {}).name);
  if (p.simple) shared.push('Use simple words');
  if (p.larger) shared.push('Larger text');
  if (p.patient) shared.push('Please give me more time');
  if (p.trustedHelp) shared.push('May have a trusted person helping');
  if (S.settings.mode === 'voice') shared.push('Prefers voice');
  if (S.dialect !== 'off') shared.push('Prefers ' + dialectName(S.dialect).split(' ')[0]);
  return header(t('passport')) + '<div class="pad"><p class="muted" style="margin-top:0">' + t('passport_sub') + '</p>' +
    '<div class="list">' +
    toggleRow(t('serve_simple'), 'Helper and staff explain things plainly', 'simple', p.simple, 'togglePassport') +
    toggleRow(t('serve_larger'), 'Also sets the app text size', 'larger', p.larger, 'togglePassport') +
    toggleRow(t('serve_patient'), 'Slower read-aloud, no time-outs on steps, staff told not to rush', 'patient', p.patient, 'togglePassport') +
    toggleRow(t('serve_trusted'), 'Staff will not assume you are alone on a call', 'trustedHelp', p.trustedHelp, 'togglePassport') +
    toggleRow('Offer help if I seem stuck', 'Helper offers (never forces) help after 25 seconds on one step', 'offerHelp', p.offerHelp, 'togglePassport') +
    '</div><div class="card"><h2 class="row">' + ic('eye') + ' What staff see on a call-back</h2>' +
    (shared.length ? shared.map(s => '<span class="pchip">' + esc(s) + '</span>').join('') : '<span class="muted small">Nothing shared yet.</span>') +
    '<p class="small muted" style="margin:10px 0 0">We store your choices, never the reasons behind them. You never need to tell us about a condition or your age.</p></div>' +
    '<div class="card"><h2 class="row">' + ic('list') + ' Who has seen your Passport</h2>' + (passportViews().length ? passportViews().map(v => '<div class="kv"><span>' + esc(v.who) + '</span><span>' + esc(v.at) + '</span></div>').join('') : '<span class="small muted">Nobody yet. Only Helper and the officer handling your request can see it, and every view is listed here.</span>') +
    '<p class="small muted" style="margin:8px 0 0">Last checked by you: today. We will ask you to check it once a year.</p></div></div>';
}

/* ---------------- CONFIDENCE MAP (Idea B) ---------------- */
function viewConfidence() {
  return header(t('conf_title')) + '<div class="pad"><p class="muted" style="margin-top:0">' + t('conf_sub') + ' ' + 'Nothing else about you is used. New to me teaches, With some help reminds, I do this often gets out of your way.</p>' +
    TASKS.map(x => '<div class="card"><div class="between"><h3>' + esc(taskName(x.id)) + '</h3><span class="small muted">' + (S.usage[x.id] || 0) + ' times</span></div>' +
      '<div class="seg" role="group" aria-label="' + esc(taskName(x.id)) + '" style="margin:8px 0">' + LEVELS.map(l => '<button data-a="setLevel" data-v="' + x.id + ':' + l + '" aria-pressed="' + (S.confidence[x.id] === l) + '">' + levelLabel(l) + '</button>').join('') + '</div>' +
      '<div class="small muted">' + (S.confidence[x.id] === 'often' ? 'Gets out of your way: a quick form, no tips. "Guide me this time" is always there. Safety checks still apply.' : S.confidence[x.id] === 'help' ? 'Reminds you: one question per screen with a short tip, and "Tell me more" if you want detail.' : 'Teaches you: one question per screen with full explanations, "Show me how", and a practice run first.') + '</div></div>').join('') +
    '<p class="small muted">This is only a starting point. The app may offer changes based on how tasks go, and always asks first.</p>' +
    (S.eraseConfirm ? '<div class="card" role="alertdialog" aria-label="Erase my map" style="border:2px solid var(--red)"><b>Erase your Confidence Map?</b><p class="small muted" style="margin:4px 0 10px">Every task goes back to "With some help", and the counts the app keeps are deleted. Your other settings stay.</p><div class="row"><button class="btn primary" data-a="eraseMap">Yes, erase it</button><button class="btn ghost" data-a="eraseCancel">Keep it</button></div></div>'
      : '<button class="btn ghost block" data-a="eraseMap">' + ic('close', 16) + ' Erase my map</button>') + '</div>';
}

/* ---------------- SAFETY (Idea F settings) ---------------- */
function viewSafety() {
  const s = S.safety;
  const tc = s.trusted;
  return header(t('safety')) + '<div class="pad">' + callBanner() +
    '<div class="list">' + toggleRow('Scam pause', 'Asks 3 quick questions before a transfer of S$1,000 or more to a new payee', 'pause', s.pause, 'toggleSafety') +
    toggleRow(t('cooling'), 'Holds big first transfers to new payees so you have time to think', 'cooling', s.cooling, 'toggleSafety') + '</div>' +
    (s.cooling ? '<div class="card"><div class="field"><label for="coolHours">Hold for</label><select id="coolHours" class="input" data-in="coolHours">' + [6, 12, 24].map(h => '<option value="' + h + '"' + (s.coolHours === h ? ' selected' : '') + '>' + h + ' hours</option>').join('') + '</select></div>' +
      '<div class="field" style="margin:0"><label for="coolMin">For first transfers of at least</label><select id="coolMin" class="input" data-in="coolMin">' + [500, 1000, 3000, 5000].map(v => '<option value="' + v + '"' + (s.coolMin === v ? ' selected' : '') + '>' + money(v) + '</option>').join('') + '</select></div></div>' : '') +
    '<div class="card"><h2 class="row">' + ic('users') + ' ' + t('trusted') + '</h2>' +
    (s.tcPending ? '<div class="banner warn">' + ic('hourglass') + '<div style="flex:1"><b>' + (s.tcPending.kind === 'remove' ? 'Removing ' + esc(s.tcPending.name) : esc(s.tcPending.name) + ' becomes your trusted contact') + ' at ' + esc(s.tcPending.at) + '</b>Changes wait 12 hours and ' + esc(tc ? tc.name : 'your current contact') + ' has been told, so nobody can quietly swap themselves in.<div class="row" style="margin-top:8px;flex-wrap:wrap"><button class="btn secondary" data-a="cancelTcPending">Cancel the change</button><button class="btn ghost" data-a="skipTcWait">Skip 12 hours (demo)</button></div></div></div>' : '') +
    (tc && !S.tcEdit ? '<div class="between"><div><div style="font-weight:600">' + esc(tc.name) + '</div><div class="small muted">Told about transfers of ' + money(tc.min) + ' or more. Cannot see your balance or approve anything.</div></div>' + (s.tcPending ? '' : '<div class="row" style="flex-direction:column;gap:6px"><button class="btn secondary" data-a="changeTrusted">Change</button><button class="btn ghost" data-a="removeTrusted">Remove</button></div>') + '</div>'
      : (tc ? '<p class="small muted" style="margin-top:0">Who should replace ' + esc(tc.name) + '? The change waits 12 hours and ' + esc(tc.name) + ' is told.</p>' : '<p class="small muted" style="margin-top:0">Choose someone to be told about big transfers. They cannot see your balance or approve anything, and you can remove them anytime.</p>') +
      '<div class="field"><label for="tcName">Name</label><input id="tcName" class="input" data-in="tcName" autocomplete="off"></div><div class="field"><label for="tcMobile">Mobile number</label><input id="tcMobile" class="input" inputmode="tel" data-in="tcMobile" autocomplete="off"></div>' +
      '<button class="btn primary block" data-a="addTrusted">Add trusted contact</button>') + '</div>' +
    '<div class="list">' + navRow('lock', 'moneylockInfo', t('t_moneylock'), 'Lock savings so they cannot be moved online') + '</div></div>';
}

/* ---------------- LOG ---------------- */
function viewLog() {
  return header(t('log_title')) + '<div class="pad"><p class="muted" style="margin-top:0">Every change to how your app looks or behaves, and why. Nothing here was guessed about you.</p>' +
    (S.log.length ? '<div class="list">' + S.log.map(l => '<div class="li"><span class="ic">' + ic(l.kind === 'suggest' ? 'sparkle' : l.kind === 'safety' ? 'shield' : 'user') + '</span><span class="grow"><span class="t1">' + esc(l.what) + '</span><br><span class="t2">' + esc(l.t) + ' · ' + esc(l.why) + '</span></span></div>').join('') + '</div>' : '<div class="empty">No changes yet.</div>') + '</div>';
}

/* ---------------- ONBOARDING (Idea A) ---------------- */
function viewOnboarding() {
  const st = S.ob.step, a = S.ob.a;
  const bot = (txt, extra) => '<div class="msg bot">' + esc(txt) + (extra || '') + '<br><button class="speak" data-a="speakText" data-v="' + esc(txt) + '" aria-label="' + t('read_aloud') + '">' + ic('speaker', 14) + ' ' + t('read_aloud') + '</button></div>';
  const me = txt => '<div class="msg me">' + esc(txt) + '</div>';
  let h = '<div class="apphead"><div class="between"><span class="wordmark">OCBC</span><div class="row" style="gap:6px">' + helperHeadBtn('onred') + (S.ob && S.ob.step > 0 ? '<button class="btn ghost" style="color:#fff;min-height:44px" data-a="skipOnboarding">' + t('skip') + '</button>' : '') + '</div></div>' +
    '<div class="greet" id="screen-title" tabindex="-1">' + (st === 7 ? t('your_app') : 'Welcome to OCBC') + '</div><div class="progress" style="background:rgba(255,255,255,.3)"><span style="width:' + Math.round(Math.min(st, 6) / 6 * 100) + '%;background:#fff"></span></div></div>';
  h += '<div class="accbar" role="group" aria-label="Make this easier to read">' + LANGS.map(l => '<button class="pill" data-a="setLang" data-v="' + l.code + '" aria-pressed="' + (S.settings.lang === l.code) + '" lang="' + l.code + '">' + esc(l.name) + '</button>').join('') +
    '<button class="pill" data-a="scale" data-v="1" aria-label="Larger text">A+</button><button class="pill" data-a="speakText" data-v="' + esc(t('ob_hi', { name: S.short }) + ' ' + t('ob_hi2')) + '">' + ic('speaker', 14) + ' ' + t('read_aloud') + '</button></div>' +
    '<div class="promise">' + ic('shield', 16) + ' I will never ask your age, health or income.</div>';
  h += '<div class="chat" aria-live="polite">';
  h += bot(t('ob_hi', { name: S.short })) + bot(t('ob_hi2'));
  if (st >= 1) h += me(t('start'));
  if (st >= 1) h += bot(t('ob_lang'));
  if (st >= 2) h += me((LANGS.find(l => l.code === S.settings.lang) || {}).name);
  if (st >= 2) h += bot(t('ob_tasks'));
  if (st >= 3) h += me(a.tasks.map(taskShort).join(', ') || '-');
  if (st >= 3) h += bot(t('ob_conf'));
  if (st >= 4) h += me(a.tasks.map(x => taskShort(x) + ': ' + levelLabel(a.conf[x] || 'help')).join(', '));
  if (st >= 4) h += bot(t('ob_how'));
  if (st >= 5) h += me(a.how === 'skip' ? 'Skip for now' : t('how_' + a.how));
  if (st >= 5) h += bot(t('ob_serve'));
  if (st >= 7) h += me(a.serve.length ? a.serve.map(s => serveLabel(s)).join(', ') : t('serve_none'));
  if (st >= 7) h += bot(t('ob_done') + ' Safety checks are always on for risky payments. I will offer extra protection the first time you pay someone new.');
  h += '</div>';

  if (st === 0) h += '<div class="choices"><button class="choice primary-choice" data-a="obStart">' + t('start') + '</button><button class="choice" data-a="skipOnboarding">' + t('skip_ob') + '</button></div>';
  if (st === 1) h += '<div class="choices" role="group" aria-label="' + t('language') + '">' + LANGS.map(l => '<button class="choice" data-a="obLang" data-v="' + l.code + '">' + esc(l.name) + '</button>').join('') + '</div>';
  if (st === 2) h += '<div class="pad"><div class="tiles">' + TASKS.map(x => '<button class="tile" data-a="obTask" data-v="' + x.id + '" aria-pressed="' + a.tasks.includes(x.id) + '">' + esc(taskShort(x.id)) + '</button>').join('') + '</div><button class="btn primary block" style="margin-top:12px" data-a="obNext" ' + (a.tasks.length ? '' : 'disabled') + '>' + t('cont') + '</button></div>';
  if (st === 3) h += a.tasks.map(x => '<div class="conf-row"><div class="name">' + esc(taskName(x)) + '</div><div class="seg" role="group" aria-label="' + esc(taskName(x)) + '">' + LEVELS.map(l => '<button data-a="obConf" data-v="' + x + ':' + l + '" aria-pressed="' + ((a.conf[x] || 'help') === l) + '">' + levelLabel(l) + '</button>').join('') + '</div></div>').join('') + '<div class="pad"><button class="btn primary block" data-a="obNext">' + t('cont') + '</button></div>';
  if (st === 4) h += '<div class="pad" style="padding-bottom:0"><div class="banner safe" style="margin:0">' + ic('check') + '<div><b>That is all I need.</b>Two more questions are optional and take 30 seconds. They help me offer the right kind of help.<div style="margin-top:8px"><button class="btn secondary" data-a="obSkipRest">Skip both, go to my app</button></div></div></div></div>';
  if (st === 4) h += '<div class="choices">' + ['show', 'tell', 'read'].map(k => '<div class="row" style="gap:6px"><button class="choice" style="flex:1" data-a="obHow" data-v="' + k + '">' + t('how_' + k) + '</button><button class="pill" data-a="' + (k === 'show' ? 'ghost' : 'speakText') + '" data-v="' + esc(k === 'show' ? '' : 'This is how read aloud sounds. I can read every step to you.') + '" aria-label="Preview ' + esc(t('how_' + k)) + '">Preview</button></div>').join('') + '<button class="choice" data-a="obHowSkip">Skip this question</button></div>';
  if (st === 5) h += '<div class="pad"><p class="small" style="margin:0 0 8px;font-weight:700">Tell us what helps, not why.</p><div class="tiles">' + ['simple', 'larger', 'slow', 'patient', 'readout', 'trusted'].map(k => '<button class="tile" data-a="obServe" data-v="' + k + '" aria-pressed="' + a.serve.includes(k) + '">' + esc(serveLabel(k)) + '</button>').join('') + '</div><p class="small muted">Something else? Ask Helper or tell us on a call. Nothing you say there is saved to your profile.</p><button class="btn primary block" style="margin-top:8px" data-a="obNext">' + (a.serve.length ? t('cont') : t('serve_none')) + '</button></div>';
  if (st === 7) h += obSummary();
  return h;
}

function obSummary() {
  const a = S.ob.a;
  const row = (icon, title, value, screen) => '<div class="li"><span class="ic">' + ic(icon) + '</span><span class="grow"><span class="t1">' + esc(title) + '</span><br><span class="t2">' + esc(value) + '</span></span><button class="linkbtn" data-a="obChange" data-v="' + screen + '">' + t('change') + '</button></div>';
  // Only the tasks the customer picked are summarised; nothing is assumed about the rest
  const picked = TASKS.filter(x => a.tasks.includes(x.id));
  const guided = picked.filter(x => S.confidence[x.id] !== 'often').map(x => taskShort(x.id));
  const quick = picked.filter(x => S.confidence[x.id] === 'often').map(x => taskShort(x.id));
  const others = TASKS.length - picked.length;
  return '<div class="pad" id="ob-summary"><div class="card" style="padding:0;overflow:hidden"><div style="background:var(--red);color:#fff;padding:12px 14px;font-weight:700">' + t('your_app') + '</div><div class="list" style="box-shadow:none;margin:0">' +
    row('globe', t('language'), (LANGS.find(l => l.code === S.settings.lang) || {}).name, 'more') +
    row('map', t('sum_guided'), guided.join(', ') || t('none_w'), 'confidence') +
    row('pay', t('sum_quick'), quick.join(', ') || t('none_w'), 'confidence') +
    row('learn', t('sum_practice'), picked.filter(x => S.confidence[x.id] === 'never').map(x => taskShort(x.id)).join(', ') || t('none_w'), 'learn') +
    (others ? row('more', 'Everything else', others + ' other services keep the standard look, with a one-line tip. Change any of them later.', 'confidence') : '') +
    row(a.how === 'tell' ? 'speaker' : 'eye', t('sum_how'), a.how === 'skip' || !a.how ? 'Not set yet; I will offer help when you need it' : t('how_' + a.how), 'more') +
    row('passport', t('passport'), a.serve.length ? a.serve.map(s => serveLabel(s)).join(', ') : t('serve_none'), 'passport') +
    row('shield', 'Safety checks', 'Always on for risky payments', 'safety') +
    '</div></div><p class="small muted">' + t('sum_note') + '</p>' +
    '<button class="btn primary block" data-a="obFinish">' + t('go_home') + '</button></div>';
}

/* ==========================================================
   Flow engine: one definition renders as guided (one question
   per screen) or quick (one form), with practice mode, voice,
   accessible errors, teach-back review and Scam Shield.
   ========================================================== */

FLOWS.scan = {
  steps: [
    { id: 'merchant', type: 'scanqr', q: Q('Scan the QR code at the stall', '扫描摊位的二维码', 'Imbas kod QR di gerai', 'கடையின் QR குறியீட்டை ஸ்கேன் செய்யுங்கள்'),
      x: X('Hold your phone over the SGQR code. We show the shop name so you can check it before paying.', 'Point the camera at the square code. Check the shop name matches the stall in front of you.', '把手机对准 SGQR 二维码。付款前我们会显示店名让您核对。', '把镜头对准方形码。核对店名和面前的摊位一样。', 'Halakan kamera ke kod segi empat. Semak nama kedai sama dengan gerai di depan anda.', 'கேமராவைச் சதுரக் குறியீட்டை நோக்கிக் காட்டுங்கள். கடைப் பெயரைச் சரிபார்க்கவும்.') },
    { id: 'amount', type: 'amount', q: Q('How much is your order?', '您的餐点多少钱？', 'Berapa harga pesanan anda?', 'உங்கள் ஆர்டர் எவ்வளவு?'),
      x: X('Type the amount the stall tells you. Hawker payments are instant.', 'Type what the stall owner says. We show it in words so you can check.', '输入摊主说的金额。小贩付款是即时的。', '输入摊主说的价钱。我们用大写显示方便您核对。') }
  ]
};
const MERCHANT = { name: 'Ah Huat Chicken Rice', place: 'Stall #01-23, Kampong Market (demo)' };

function startFlow(task, practice) {
  stopSpeak();
  S.flow = { task, practice: !!practice, mode: guidanceFor(task), step: 0, data: {}, errors: 0, err: null, stage: 'steps', pause: {}, pausePassed: false, forceHold: false, trustedAsked: false, trustedReply: false, t0: Date.now() };
  if (task === 'scan') S.flow.mode = 'guided'; // camera first, then amount
  S.screen = 'flow';
  S.helper.open = false;
  track(practice ? 'practice_start' : 'task_start', { task, mode: S.flow.mode, level: S.confidence[task] });
}

/* Text mode: words only, with the full written explanation on every step.
   Visual mode keeps pictures, icons, short tips and the Show me how pointer. */
function textMode() { return S.settings.mode === 'text'; }
const DEMO_QR = 'SG01234567';
function flowSteps() { return FLOWS[S.flow.task].steps; }
function curStep() { return flowSteps()[S.flow.step]; }

/* ---------- Validation with accessible, actionable errors ---------- */
function validateStep(step) {
  const d = S.flow.data, v = d[step.id], task = S.flow.task;
  const amt = Number(d.amount);
  switch (step.type) {
    case 'contact':
      if (!v) return { msg: 'Choose who to send to, or type an 8-digit mobile number.' };
      if (String(v).startsWith('mobile:') && !/^[89]\d{7}$/.test(String(v).slice(7).replace(/\s/g, ''))) return { msg: 'Singapore mobile numbers have 8 digits and start with 8 or 9. Check the number and try again.' };
      return null;
    case 'amount': {
      const val = step.id === 'limit' ? Number(d.limit) : amt;
      if (!val || val <= 0) return { msg: 'Type an amount above S$0.00.' };
      if (task === 'paynow' && val > 5000) return { msg: 'Your PayNow limit is S$5,000 a day. Nothing has been sent.', fix: [{ label: 'Send S$5,000 today', a: 'fixAmount', v: '5000' }, { label: 'Use a bank transfer instead', a: 'switchTask', v: 'newpayee' }] };
      if (step.id !== 'limit' && val > S.balance && !S.flow.practice) return { msg: 'That is more than your available balance of ' + money(S.balance) + '. No money has left your account.', fix: [{ label: 'Use ' + money(Math.floor(S.balance)), a: 'fixAmount', v: String(Math.floor(S.balance)) }] };
      return null;
    }
    case 'uen':
      if (!v) return { msg: 'Type the UEN from your bill. It looks like 53312345A.' };
      if (!UEN_DIR[String(v).toUpperCase().trim()]) return { msg: "We couldn't find that UEN. Check it against the bill or letter (not a chat message). It is 9 or 10 characters, for example 53312345A." };
      return null;
    case 'namecheck':
      if (v !== 'yes') return { msg: 'Please confirm this is the business you meant to pay, or stop here.' };
      return null;
    case 'payeecheck':
      if (v !== 'yes') return { msg: 'Check the name the bank shows, then confirm it is who you meant to pay, or stop here.' };
      return null;
    case 'bank': case 'country': case 'org':
      if (!v) return { msg: 'Choose one option to continue.' };
      return null;
    case 'ack':
      if (!v) return { msg: 'Tick the box to show you have read how unlocking works.' };
      return null;
    case 'scanqr':
      if (!v) return { msg: 'Point the camera at the QR code, or tap "Scan" in this demo.' };
      return null;
    default:
      if (step.optional) return null;
      if (!v || !String(v).trim()) return { msg: 'This is needed to continue.' };
      if (step.id === 'acct' && task === 'newpayee' && !/^\d{9,12}$/.test(String(v).replace(/[\s-]/g, ''))) return { msg: 'Account numbers are 9 to 12 digits. Check the number on the bank book or invoice.' };
      if (step.id === 'swift' && !/^[A-Za-z0-9]{8}([A-Za-z0-9]{3})?$/.test(String(v).trim())) return { msg: 'A SWIFT code has 8 or 11 letters and numbers, for example SBININBB. Ask the person you are paying.' };
      return null;
  }
}

/* ---------- Inputs for each step type ---------- */
function stepInput(step) {
  const d = S.flow.data, v = d[step.id] || '', mode = S.settings.mode, task = S.flow.task;
  const fid = 'f-' + step.id;
  switch (step.type) {
    case 'contact':
      if (mode === 'text') {
        return '<select id="' + fid + '" class="input" data-in="' + step.id + '"><option value="">Choose a contact</option>' + S.contacts.map((c, i) => '<option value="c:' + i + '"' + (v === 'c:' + i ? ' selected' : '') + '>' + esc(c.name) + ' (' + esc(c.mobile) + ')</option>').join('') + '</select>' +
          '<div class="field" style="margin-top:10px"><label for="f-mobile">' + t('or_mobile') + '</label><input id="f-mobile" class="input" inputmode="tel" data-in="toMobile" value="' + esc(String(v).startsWith('mobile:') ? v.slice(7) : '') + '"></div>';
      }
      return (task === 'paynow' ? recentRow() : '') + '<div class="tiles">' + S.contacts.map((c, i) => '<button class="tile" data-a="pick" data-v="' + step.id + '|c:' + i + '" aria-pressed="' + (v === 'c:' + i) + '"><span class="row">' + avatar(c.name, 36) + '<span>' + esc(c.name.split(' (')[0]) + '<small>' + esc(c.mobile) + ' · PayNow: ' + esc(paynowName(c)) + '</small></span></span></button>').join('') + '</div>' +
        '<div class="field" style="margin-top:10px"><label for="f-mobile">' + t('or_mobile') + '</label><input id="f-mobile" class="input" inputmode="tel" data-in="toMobile" value="' + esc(String(v).startsWith('mobile:') ? v.slice(7) : '') + '"></div>';
    case 'amount': {
      const key = step.id;
      const w = amountWords(d[key]);
      return '<div class="field"><label for="' + fid + '" class="' + (S.flow.mode === 'guided' ? 'sr-only' : '') + '">' + esc(tx(step.q)) + '</label><div class="row"><span style="font-weight:800;font-size:calc(20px*var(--scale))">S$</span><input id="' + fid + '" class="input amount" inputmode="decimal" data-in="' + key + '" value="' + esc(d[key] || '') + '" placeholder="0.00" aria-describedby="words-' + key + '"></div>' +
        (key === 'amount' && !textMode() && ['paynow', 'newpayee', 'scan', 'uen'].includes(task) ? '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px" role="group" aria-label="Quick amounts">' + [10, 20, 50, 100].map(n => '<button class="pill" data-a="quickAmt" data-v="' + n + '">S$' + n + '</button>').join('') + '</div>' : '') +
        '<div class="words" id="words-' + key + '" aria-live="polite">' + t('in_words') + ': <b>' + esc(w || '-') + '</b></div>' + '<div id="ob-' + key + '" aria-live="polite">' + overBalance(d[key], key) + '</div>' + (textMode() ? '' : '<div id="rt-' + key + '">' + realThings(d[key]) + '</div>') +
        (task === 'overseas' && key === 'amount' ? overseasQuote() : '') + voiceBtn(key) + '</div>';
    }
    case 'uen':
      return '<div class="field"><label for="' + fid + '" class="' + (S.flow.mode === 'guided' ? 'sr-only' : '') + '">' + esc(tx(step.q)) + '</label><input id="' + fid + '" class="input" data-in="uen" value="' + esc(v) + '" autocomplete="off" style="text-transform:uppercase"><div class="hint">' + esc(step.hint || '') + '</div></div>';
    case 'namecheck': {
      const biz = UEN_DIR[String(d.uen || '').toUpperCase().trim()];
      if (!biz) return '<div class="banner warn">' + ic('alert') + '<div>Enter a UEN first.</div></div>';
      if (textMode()) return '<div class="card txt-card"><p style="margin:0">The UEN ' + esc(String(d.uen || '').toUpperCase()) + ' is registered to <b>' + esc(biz.name) + '</b>, a ' + esc(biz.type.toLowerCase()) + '.</p><p class="small" style="margin:8px 0 0">We checked this name with the business registry.' + (biz.risky ? ' It was registered recently.' : '') + '</p></div>' +
        (biz.risky ? '<div class="card txt-card txt-danger" role="alert"><p style="margin:0"><b>Be careful.</b> This company was registered recently and is not a name most people expect to pay. Scammers often ask victims to pay a UEN like this. If someone told you to pay it, stop and check.</p></div>' : '') +
        '<div class="yn" style="margin-top:12px"><button class="btn ' + (v === 'yes' ? 'dark' : 'secondary') + '" data-a="pick" data-v="check|yes" aria-pressed="' + (v === 'yes') + '">Yes, this is right</button><button class="btn secondary" data-a="nameNo">No, not who I expected</button></div>';
      return '<div class="card" style="text-align:center"><div class="small muted">This UEN is registered to</div><div style="font-size:calc(19px*var(--scale));font-weight:800;margin:6px 0">' + esc(biz.name) + '</div><div class="small muted">' + esc(biz.type) + '</div>' +
        '<div class="verified" style="margin-top:8px">' + ic('check', 16) + ' Registered name, checked with the business registry' + (biz.risky ? '. Registered recently.' : '') + '</div></div>' +
        (biz.risky ? '<div class="banner danger" role="alert">' + ic('alert') + '<div><b>Be careful</b>This company was registered recently and is not a name most people expect to pay. Scammers often ask victims to pay a UEN like this. If someone told you to pay it, stop and check.</div></div>' : '') +
        '<div class="yn"><button class="btn ' + (v === 'yes' ? 'dark' : 'secondary') + '" data-a="pick" data-v="check|yes" aria-pressed="' + (v === 'yes') + '">Yes, this is right</button><button class="btn secondary" data-a="nameNo">No, not who I expected</button></div>';
    }
    case 'payeecheck':
      return payeeCheckView(d, v);
    case 'bank':
      if (mode === 'text') return '<select id="' + fid + '" class="input" data-in="bank"><option value="">Choose a bank</option>' + BANKS.map(b => '<option' + (v === b ? ' selected' : '') + '>' + esc(b) + '</option>').join('') + '</select>';
      return '<div class="tiles">' + BANKS.map(b => '<button class="tile" data-a="pick" data-v="bank|' + esc(b) + '" aria-pressed="' + (v === b) + '">' + esc(b) + '</button>').join('') + '</div>';
    case 'country':
      if (mode === 'text') return '<select id="' + fid + '" class="input" data-in="country"><option value="">Choose a country</option>' + COUNTRIES.map(c => '<option value="' + c.code + '"' + (v === c.code ? ' selected' : '') + '>' + esc(c.name) + ' (' + c.cur + ')</option>').join('') + '</select>';
      return '<div class="tiles">' + COUNTRIES.map(c => '<button class="tile" data-a="pick" data-v="country|' + c.code + '" aria-pressed="' + (v === c.code) + '">' + esc(c.name) + '<small>Paid in ' + c.cur + '</small></button>').join('') + '</div>';
    case 'org':
      if (mode === 'text') return '<select id="' + fid + '" class="input" data-in="org"><option value="">Choose a bill</option>' + GIRO_ORGS.map(o => '<option' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select>';
      return '<div class="tiles">' + GIRO_ORGS.map(o => '<button class="tile" data-a="pick" data-v="org|' + esc(o) + '" aria-pressed="' + (v === o) + '">' + esc(o) + '</button>').join('') + '</div>';
    case 'ack':
      return '<label class="card row" style="cursor:pointer"><input type="checkbox" data-a="ack" ' + (v ? 'checked' : '') + ' style="width:24px;height:24px"><span style="font-weight:600">I understand that unlocking needs my card and PIN at an OCBC ATM.</span></label>';
    case 'scanqr':
      return '';
    default:
      return '<div class="field"><label for="' + fid + '" class="' + (S.flow.mode === 'guided' ? 'sr-only' : '') + '">' + esc(tx(step.q)) + '</label><input id="' + fid + '" class="input" data-in="' + step.id + '" value="' + esc(v) + '" autocomplete="off"' + (step.inputmode ? ' inputmode="' + step.inputmode + '"' : '') + '>' + (step.hint ? '<div class="hint">' + esc(step.hint) + '</div>' : '') + voiceBtn(step.id) + '</div>';
  }
}

function voiceBtn(key) {
  if (S.settings.mode !== 'voice') return '';
  return '<button class="btn secondary" style="margin-top:10px" data-a="voiceInput" data-v="' + key + '">' + ic('mic', 18) + ' Say your answer</button>';
}

function overseasQuote() {
  const c = COUNTRIES.find(x => x.code === S.flow.data.country);
  const amt = Number(S.flow.data.amount);
  if (!c || !amt) return '';
  const recv = (amt * c.rate).toLocaleString('en-SG', { maximumFractionDigits: 2 });
  return (typeof fxNote === 'function' ? fxNote() : '') + '<div class="card" style="margin-top:10px;box-shadow:none;border:1px solid var(--line)"><div class="kv"><span>They receive about</span><span>' + c.cur + ' ' + recv + '</span></div><div class="kv"><span>Fee (demo)</span><span>S$10.00</span></div><div class="kv"><span>Arrives</span><span>1 to 2 working days</span></div><div class="kv"><span>Rate (demo)</span><span>1 SGD = ' + c.rate + ' ' + c.cur + '</span></div></div>';
}

function scanView() {
  const d = S.flow.data;
  if (d.merchant) {
    return '<div class="card" style="text-align:center;margin-top:8px"><span style="color:var(--green)">' + ic('check', 34) + '</span><div class="small muted">You are paying</div><div style="font-size:calc(19px*var(--scale));font-weight:800">' + esc(MERCHANT.name) + '</div><div class="small muted">' + esc(MERCHANT.place) + '</div><p class="small" style="margin:10px 0 0">Does this match the stall in front of you?</p></div>';
  }
  if (textMode()) return '<div class="card txt-card"><p style="margin:0">There are two ways to read the stall\'s QR code:</p><ol style="margin:8px 0 0;padding-left:22px"><li>Tap <b>Scan</b> at the bottom and point your camera at the square code.</li><li>Or type the number printed under the code.</li></ol></div>' +
    '<div class="field"><label for="f-qrcode">Number under the QR code</label><input id="f-qrcode" class="input" data-in="qrcode" value="' + esc(d.qrcode || '') + '" autocomplete="off" style="text-transform:uppercase"><div class="hint">Demo: the stall\'s number is SG 0123 4567</div>' +
    '<button class="btn secondary" style="margin-top:10px" data-a="qrTyped">Use this number</button></div>';
  return '<div class="viewfinder" style="margin:0 -16px"><div class="frame"><div class="qr">' + fakeQR() + '</div><div class="scanline"></div></div><div class="hint">Demo camera. Tap Scan to read the stall\'s QR code.</div></div>' +
    '';
}
function fakeQR() {
  // Deterministic decorative pattern (not a real QR code)
  let cells = '';
  const n = 21;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    let on;
    if (finder) { const fx = x > 13 ? x - 14 : x, fy = y > 13 ? y - 14 : y; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); }
    else on = ((x * 7 + y * 13 + x * y) % 5) < 2;
    if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
  }
  return '<svg role="img" aria-label="Stall QR code (demo)" width="150" height="150" viewBox="0 0 21 21" fill="#111" shape-rendering="crispEdges">' + cells + '</svg>';
}

/* ---------- Flow screen ---------- */
function viewFlow() {
  const f = S.flow;
  if (f.stage === 'review') return viewReview();
  if (f.stage === 'receipt') return viewReceipt();
  const steps = flowSteps();
  const spec = engineCompose(f.task);
  ENG_PLAIN = spec.plain;
  const focus = spec.simplified && f.mode === 'guided';
  const title = (f.practice ? t('practice') + ': ' : '') + taskName(f.task);
  let h = header(title, { right: helperHeadBtn() + '<button class="iconbtn" data-a="exitFlow" aria-label="' + t('close') + '">' + ic('close') + '</button>' });
  if (f.practice) h += '<div class="banner practice" role="status">' + ic('learn') + '<div><b>' + t('practice_t') + '</b>' + t('practice_b') + '</div></div>';
  h += '<div class="pad">';
  if (!f.practice && S.confidence[f.task] === 'never' && !S.practiced[f.task]) {
    h += '<div class="banner info">' + ic('learn') + '<div style="flex:1"><b>' + t('new_t') + '</b>' + esc(t('new_b', { task: taskName(f.task) })) + '<div style="margin-top:8px"><button class="btn secondary" data-a="startPractice" data-v="' + f.task + '">' + t('try_first') + '</button></div></div></div>';
  }
  if (f.mode === 'guided') h += liveBanner(f, steps[f.step]);
  // Interaction controls: switching keeps everything already entered
  if (focus) h += '<details class="more-ways"><summary>More ways to see this</summary>';
  h += '<div class="modebar"><span class="lbl">' + t('show_as') + ':</span>' + ['visual', 'text', 'voice', 'chat'].map(m => '<button class="pill" data-a="flowMode" data-v="' + m + '" aria-pressed="' + (S.settings.mode === m) + '">' + ic(m === 'visual' ? 'eye' : m === 'text' ? 'text' : m === 'voice' ? 'speaker' : 'chat', 14) + t('mode_' + m) + '</button>').join('') + '</div>';
  // Layout switch is one quiet link, not a second row of controls above every question
  const layoutLink = (f.task !== 'scan' && f.mode === 'guided') ? '<button class="linkbtn layout-link" data-a="flowLayout" data-v="quick">' + ic('pay', 14) + ' ' + t('quick') + '</button>' : '';
  if (focus && f.task !== 'scan') {
    h += '<div class="modebar"><span class="lbl">' + t('layout') + ':</span><button class="pill" data-a="flowLayout" data-v="guided" aria-pressed="' + (f.mode === 'guided') + '">' + t('guided') + '</button><button class="pill" data-a="flowLayout" data-v="quick" aria-pressed="' + (f.mode === 'quick') + '">' + t('quick') + '</button></div>';
  }
  if (focus) h += '</details><div class="eng-focus">';

  if (S.settings.mode === 'chat' && f.mode === 'guided') {
    ENG_PLAIN = false;
    h += '</div>' + viewFlowChat() + '<div class="footer-actions">' + (f.step > 0 ? '<button class="btn secondary" data-a="flowBack">' + t('back') + '</button>' : '') + (curStep().type === 'scanqr' && !f.data.merchant ? '<button class="btn secondary cam-btn" data-a="camScan" aria-label="Use the camera">' + ic('camera', 20) + '</button><button class="btn primary" style="flex:1" data-a="doScan">' + ic('scan', 18) + ' ' + t('nav_scan') + '</button>' : '<button class="btn primary" style="flex:1" data-a="flowNext">' + t('send') + '</button>') + '</div>';
    return h;
  }
  if (f.mode === 'guided') {
    const step = steps[f.step];
    h += '<div class="between step-line"><div class="small muted">' + t('step_of', { n: f.step + 1, m: steps.length }) + '</div>' + (focus ? '' : layoutLink) + '</div><div class="progress" role="progressbar" aria-label="' + esc(t('step_of', { n: f.step + 1, m: steps.length })) + '" aria-valuemin="0" aria-valuemax="' + steps.length + '" aria-valuenow="' + (f.step + 1) + '"><span style="width:' + ((f.step + 1) / steps.length * 100) + '%"></span></div>';
    const full = isFullGuidance();
    h += '<div class="stepq" id="step-q">' + esc(tx(step.q)) + '</div>';
    // Voice mode is visibly different: the question is read out, and the answer can be spoken
    if (S.settings.mode === 'voice') h += '<div class="voice-bar" role="status">' + ic('speaker', 18) + '<span class="grow">Voice mode: questions are read out. Speak or tap your answer.</span><button class="pill" data-a="speakText" data-v="' + esc(tx(step.q)) + '">' + ic('speaker', 14) + ' Read again</button></div>';
    h += '<div class="row" style="flex-wrap:wrap;gap:6px">' + (textMode() ? '' : '<button class="pill" data-a="ghost" aria-pressed="false" style="' + (full ? 'border-color:var(--red);color:var(--red)' : '') + '">' + ic('hand', 16) + ' Show me how</button>') + dialectBtn(dialectKeyForStep(step)).replace('margin-top:8px', 'margin-top:0') + '</div>';
    // Simplified step after a mistake: the error box already explains, so keep only the plain one-line version here
    if (focus && f.err) h += '<div class="explain">' + ic('info', 16) + ' <span class="simple-line" style="display:inline;margin:0">' + esc(tx(step.x.simple)) + '</span></div>';
    else if (full) h += '<div class="explain">' + ic('info', 16) + ' ' + expl(step.x) + '</div>';
    else {
      const more = f.more && f.more[step.id];
      h += '<div class="explain tip">' + ic('info', 16) + ' <b>Tip:</b> ' + esc(firstSentence(tx(step.x.simple))) + ' <button class="linkbtn" style="padding:0 2px;min-height:28px" data-a="tellMore" data-v="' + step.id + '" aria-expanded="' + !!more + '">' + (more ? 'Show less' : 'Tell me more') + '</button>' + (more ? '<div style="margin-top:6px">' + expl(step.x) + '</div>' : '') + '</div>' +
        '<button class="linkbtn" style="padding:2px 0;min-height:32px" data-a="showFull">Need more help with this? Show full guidance</button>';
    }
    // Simplified step: show what went wrong right above the box to fix, so the input stays in view
    if (focus) h += errorBox();
    h += step.type === 'scanqr' ? scanView() : stepInput(step);
    if (!focus) h += errorBox();
    if (focus) h += '</div>';
    h += '</div><div class="footer-actions' + (focus ? ' eng-focus' : '') + '">' + (f.step > 0 ? '<button class="btn secondary" data-a="flowBack">' + t('back') + '</button>' : '') +
      (step.type === 'scanqr' && !f.data.merchant ? '<button class="btn secondary cam-btn" data-a="camScan" aria-label="Use the camera">' + ic('camera', 20) + '</button><button class="btn primary" style="flex:1" data-a="doScan">' + ic('scan', 18) + ' ' + t('nav_scan') + '</button>' : '<button class="btn primary" style="flex:1" data-a="flowNext">' + (f.step === steps.length - 1 ? t('review_title') : t('next')) + '</button>') + '</div>';
  } else {
    h += '<button class="linkbtn" style="margin:0 0 8px;padding:2px 0" data-a="flowLayout" data-v="guided">' + ic('map', 16) + ' Guide me this time</button>';
    h += steps.map(step => '<div class="card"><h3>' + esc(tx(step.q)) + '</h3>' + (textMode() ? '<div class="small" style="margin-bottom:8px">' + expl(step.x) + '</div>' : S.settings.simple ? '<div class="small" style="color:var(--blue);margin-bottom:8px">' + esc(tx(step.x.simple)) + '</div>' : '') + stepInput(step) + (f.errStep === step.id ? errorBox() : '') + '</div>').join('');
    h += '</div><div class="footer-actions"><button class="btn primary block" data-a="flowQuickNext">' + t('review_title') + '</button></div>';
  }
  ENG_PLAIN = false;
  return h;
}

function errorBox() {
  const e = S.flow.err;
  if (!e) return '';
  return '<div class="banner warn" role="alert" style="margin-top:10px">' + ic('alert') + '<div style="flex:1"><b>' + t('fix_title') + '</b>' + esc(e.msg) +
    (e.fix ? '<div class="row" style="flex-wrap:wrap;margin-top:8px">' + e.fix.map(x => '<button class="btn secondary" data-a="' + x.a + '" data-v="' + esc(x.v) + '">' + esc(x.label) + '</button>').join('') + '</div>' : '') +
    '<div style="margin-top:6px"><button class="linkbtn" data-a="helperAbout" data-v="error">' + t('ask_helper') + '</button></div></div></div>';
}

/* ---------- Review with teach-back ---------- */
function reviewModel() {
  const f = S.flow, d = f.data, amt = Number(d.amount || 0), lang = S.settings.lang;
  const zh = lang === 'zh';
  const words = amountWords(d.amount);
  let to = '', rows = [], teach = '';
  if (f.task === 'paynow') {
    const c = String(d.to).startsWith('c:') ? S.contacts[Number(String(d.to).slice(2))] : { name: 'Mobile number', mobile: String(d.to).slice(7) };
    to = c.name.split(' (')[0];
    rows = [[t('r_to'), c.name + ' · ' + c.mobile], ['Name shown by PayNow', String(d.to).startsWith('c:') ? paynowName(c) : paynowMobileName(c.mobile)], [t('r_amount'), money(amt)], [t('r_fee'), t('fee_none')], [t('r_arrives'), t('in_secs')], [t('r_note'), d.ref || '-']];
    teach = zh ? '也就是说：您要转 ' + money(amt) + '（' + words + '）给 ' + c.name + '，手机 ' + c.mobile + '。几秒内到账，没有手续费。' : 'So: you are sending ' + money(amt) + ' (' + words + ') to ' + c.name + ' at ' + c.mobile + '. It arrives in seconds and there is no fee.';
  } else if (f.task === 'uen') {
    const biz = UEN_DIR[String(d.uen).toUpperCase().trim()] || { name: '?' };
    to = biz.name;
    rows = [[t('r_to'), biz.name + (biz.risky ? '' : ' (verified)')], ['UEN', String(d.uen).toUpperCase()], [t('r_amount'), money(amt)], [t('r_ref'), d.ref || '-'], [t('r_arrives'), t('in_secs')]];
    teach = zh ? '也就是说：您要付 ' + money(amt) + '（' + words + '）给 ' + biz.name + '（UEN ' + String(d.uen).toUpperCase() + '），账单号码 ' + (d.ref || '-') + '。几秒内到账。' : 'So: you are paying ' + money(amt) + ' (' + words + ') to ' + biz.name + ' (UEN ' + String(d.uen).toUpperCase() + ') for bill ' + (d.ref || '-') + '. It arrives in seconds.';
  } else if (f.task === 'newpayee') {
    to = d.name;
    const pc = payeeCheck(d);
    rows = [['To', d.name], ['Name at the bank', pc.masked ? pc.masked + ' (' + ({ match: 'matches', close: 'close match', no: 'different' })[pc.status] + ')' : 'Could not be checked'], ['Bank', d.bank], ['Account', mask(String(d.acct).replace(/\D/g, ''))], ['Amount', money(amt)], ['Arrives', 'Usually within minutes (FAST)']];
    teach = zh ? '也就是说：您要转 ' + money(amt) + '（' + words + '）给 ' + d.name + '，' + d.bank + ' 账户尾号 ' + String(d.acct).slice(-4) + '。这是新收款人，通常几分钟内到账。' : 'So: you are sending ' + money(amt) + ' (' + words + ') to ' + d.name + ' at ' + d.bank + ', account ending ' + String(d.acct).slice(-4) + '. This is a new payee. It usually arrives within minutes.';
  } else if (f.task === 'overseas') {
    const c = COUNTRIES.find(x => x.code === d.country) || COUNTRIES[0];
    const recv = (amt * c.rate).toLocaleString('en-SG', { maximumFractionDigits: 2 });
    to = d.name;
    rows = [['To', d.name + ', ' + c.name], ['SWIFT', String(d.swift).toUpperCase()], ['Account', mask(d.acct)], ['You send', money(amt)], ['Fee (demo)', 'S$10.00'], ['They receive about', c.cur + ' ' + recv], ['Arrives', '1 to 2 working days']];
    teach = zh ? '也就是说：您汇出 ' + money(amt) + '（' + words + '），手续费 10 新元。' + d.name + ' 在' + c.name + '大约收到 ' + c.cur + ' ' + recv + '，1 到 2 个工作日到账。' : 'So: you send ' + money(amt) + ' (' + words + '). The fee is S$10.00. ' + d.name + ' in ' + c.name + ' receives about ' + c.cur + ' ' + recv + ' in 1 to 2 working days.';
  } else if (f.task === 'giro') {
    const lim = Number(d.limit || 0);
    to = d.org;
    rows = [['Bill', d.org], ['Your account with them', d.ref], ['Monthly limit', money(lim)], ['Starts', 'Next billing cycle']];
    teach = zh ? '也就是说：' + d.org + ' 每月最多可以从您的账户扣 ' + money(lim) + '。超过这个金额就不会扣，我们会通知您。' : 'So: ' + d.org + ' can take up to ' + money(lim) + ' (' + amountWords(lim) + ') each month. Anything above that will not be paid, and we will tell you.';
  } else if (f.task === 'moneylock') {
    to = 'Money Lock';
    rows = [['Lock', money(amt)], ['Still earns interest', 'Yes'], ['Unlock', 'Only at an OCBC ATM, with your card and PIN']];
    teach = zh ? '也就是说：' + money(amt) + '（' + words + '）会被锁住。钱还是您的，也有利息，但谁都不能在网上转走。解锁要带卡和密码去 OCBC 提款机。' : 'So: ' + money(amt) + ' (' + words + ') will be locked. It is still yours and earns interest, but nobody can move it online. To unlock, use your card and PIN at an OCBC ATM.';
  } else if (f.task === 'scan') {
    to = MERCHANT.name;
    rows = [[t('r_to'), MERCHANT.name], ['', MERCHANT.place], [t('r_amount'), money(amt)]];
    teach = zh ? '也就是说：您要付 ' + money(amt) + '（' + words + '）给 ' + MERCHANT.name + '，即时付款。' : 'So: you are paying ' + money(amt) + ' (' + words + ') to ' + MERCHANT.name + '. It is paid instantly.';
  }
  return { to, rows, teach };
}

function viewReview() {
  const f = S.flow, m = reviewModel();
  let h = header(t('review_title'), { right: helperHeadBtn() + '<button class="iconbtn" data-a="exitFlow" aria-label="' + t('close') + '">' + ic('close') + '</button>' });
  if (f.practice) h += '<div class="banner practice" role="status">' + ic('learn') + '<div><b>' + t('practice_t') + '</b>' + t('practice_b') + '</div></div>';
  h += '<div class="pad">';
  if (copilotLive() && !f.practice) h += '<div class="banner info" role="status" data-new="copilot-pause">' + ic('family') + '<div><b>' + esc(G.copilot.name.split(' (')[0]) + ' cannot see this screen.</b>Check the details and confirm on your own. Their view comes back after this step.</div></div>';
  if (textMode() && f.task === 'paynow' && String(f.data.to).startsWith('c:')) { const c = S.contacts[Number(String(f.data.to).slice(2))]; h += '<div class="card txt-card"><p style="margin:0">You are paying <b>' + esc(c.name) + '</b>, a saved contact (' + esc(c.mobile) + ').</p></div>'; }
  else if (textMode() && isNewPayee(f) && f.task !== 'moneylock' && f.task !== 'giro') { h += '<div class="card txt-card"><p style="margin:0">You are paying <b>someone new</b>. You have never paid ' + esc(m.to) + ' before.</p></div>'; }
  else if (f.task === 'paynow' && String(f.data.to).startsWith('c:')) { const c = S.contacts[Number(String(f.data.to).slice(2))]; h += '<div class="card row" style="gap:14px">' + avatar(c.name, 56) + '<div><div class="small muted">You are paying</div><div style="font-weight:800;font-size:calc(18px*var(--scale))">' + esc(c.name) + '</div></div></div>'; }
  else if (isNewPayee(f) && f.task !== 'moneylock' && f.task !== 'giro') { h += '<div class="card row" style="gap:14px">' + silhouette(56) + '<div><div style="font-weight:800;font-size:calc(18px*var(--scale))">Someone new</div><div class="small muted">You have never paid ' + esc(m.to) + ' before</div></div></div>'; }
  if (f.toTeam) h += '<div class="banner danger" role="status">' + ic('shield') + '<div style="flex:1"><b>Paused while you talk to our anti-scam team</b>Nothing has been sent. An officer will call you in the app.<div style="margin-top:8px"><button class="btn primary" data-a="pauseCancel">Cancel this transfer</button></div></div></div>';
  const amtShown = f.task === 'giro' ? Number(f.data.limit || 0) : Number(f.data.amount || 0);
  h += '<div class="o-review"><div class="small muted">' + (f.task === 'moneylock' ? 'Review locked amount' : f.task === 'giro' ? 'Review monthly limit' : 'Review payment of') + '</div><div class="o-amt">' + money(amtShown).replace('S$', '') + ' <span>SGD</span></div><div class="o-bar"><div class="small muted">' + (f.task === 'moneylock' ? 'From' : 'Pay to') + '</div><div style="font-weight:700">' + esc(m.to || '') + '</div></div></div>';
  h += dialectBtn('review');
  const risky = isNewPayee(f) || f.task === 'overseas' || Number(f.data.amount || 0) >= 500 || S.confidence[f.task] !== 'often' || f.practice;
  if (risky || textMode()) h += '<div class="teach" id="teach" style="margin-top:8px">' + esc(m.teach) + '<br><button class="speak" style="border:0;background:#fff;border-radius:999px;padding:4px 10px;margin-top:8px;font-weight:600;min-height:32px" data-a="speakText" data-v="' + esc(m.teach) + '">' + ic('speaker', 14) + ' ' + t('read_aloud') + '</button></div>';
  else h += '<p class="small muted" style="margin:8px 0 0">A regular payment you know well, so here is the short version.</p>';
  if (!f.practice && undoApplies(f) && !coolingApplies(f)) h += '<div class="banner info" style="margin-top:10px">' + ic('undo') + '<div><b>' + (S.undoSecs || 60) + ' seconds to undo</b>After you tap send, this waits ' + (S.undoSecs || 60) + ' seconds before it goes, with an Undo button. Until then it is not paid.</div></div>';
  if (!f.practice && isNewPayee(f) && !S.safety.trusted && !S.safety.cooling && !S.safetyOffered && f.task !== 'moneylock' && f.task !== 'giro') h += '<div class="banner info" style="margin-top:10px">' + ic('shield') + '<div style="flex:1"><b>First time paying someone new?</b>You can add a cooling time or a trusted contact for big transfers to new people, in More, Safety. Optional.<div style="margin-top:6px"><button class="linkbtn" style="padding:0" data-a="safetyOfferClose">Got it</button></div></div></div>';
  h += '<div class="card" style="margin-top:12px">' + m.rows.map(r => '<div class="kv"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') + '</div>';
  if (trustedApplies(f)) {
    const tc = S.safety.trusted;
    h += '<div class="banner info">' + ic('users') + '<div style="flex:1"><b>' + esc(tc.name) + ' will be told about this transfer</b>You chose this for transfers of ' + money(tc.min) + ' or more. They cannot see your balance.' +
      (f.trustedReply ? '<div style="margin-top:6px;font-weight:700">' + esc(tc.name.split(' (')[0]) + ' replied: "Looks fine to me."</div>' : f.trustedAsked ? '<div style="margin-top:6px">Waiting for ' + esc(tc.name.split(' (')[0]) + '... you can still send now.</div>' : '<div style="margin-top:8px"><button class="btn secondary" data-a="askTrusted">Ask ' + esc(tc.name.split(' (')[0]) + ' to check first</button></div>') + '</div></div>';
  }
  if (!f.practice && coolingApplies(f)) {
    h += '<div class="banner warn">' + ic('hourglass') + '<div><b>Your cooling time applies</b>This will be held for ' + S.safety.coolHours + ' hours before it is sent. You can cancel any time before then.</div></div>';
  }
  if (isNewPayee(f) && f.task !== 'moneylock' && f.task !== 'giro' && risky) {
    h += '<div class="banner danger">' + ic('shieldx') + '<div><b>' + t('never_t') + '</b>' + t('never_b') + '</div></div>';
  }
  h += risky ? '<div class="stepq" style="font-size:calc(18px*var(--scale))">' + t('is_right') + '</div></div>' : '</div>';
  const slideLabel = f.task === 'moneylock' ? 'Slide to lock' : f.task === 'giro' ? 'Slide to confirm' : t('yes_send');
  h += '<div class="footer-actions col"><p class="small muted" style="margin:0 0 8px">Please check that all details are correct before proceeding.</p><button class="slide" data-a="reviewYes" aria-label="' + esc(slideLabel) + '"><span class="knob" aria-hidden="true">&#187;</span><span class="slide-t">' + esc(slideLabel) + '</span></button><button class="linkbtn" style="margin-top:6px;align-self:center" data-a="reviewBack">' + t('not_quite') + '</button></div>';
  return h;
}

/* ---------- Receipt ---------- */
function viewReceipt() {
  const f = S.flow, m = reviewModel();
  const held = f.heldAt;
  const pend = f.pendingId && S.pending.find(p => p.id === f.pendingId);
  let title = f.practice ? t('receipt_practice') : held ? 'Scheduled. Held by your cooling time.' : pend ? 'Not paid yet' : f.undone ? 'Undone. No money left your account.' : t('receipt_title');
  if (!f.practice && f.task === 'moneylock') title = 'Money locked';
  if (!f.practice && f.task === 'giro') title = 'GIRO request submitted';
  let h = '<div class="apphead plain"><h1 id="screen-title" tabindex="-1">' + (f.practice ? t('practice') : taskName(f.task)) + '</h1>' + helperHeadBtn() + '</div><div class="pad" style="text-align:center">';
  h += '<div class="tick" style="' + (held || pend ? 'background:var(--amber-tint);color:var(--amber)' : '') + '">' + ic(held ? 'hourglass' : pend ? 'clock' : 'check', 36) + '</div><h2 style="font-size:calc(20px*var(--scale));margin:0 0 6px">' + esc(title) + '</h2>';
  if (pend) h += '<div class="card" style="text-align:center;border:2px solid var(--amber);background:var(--amber-tint)"><div style="font-weight:700">Sending in <span data-countdown="' + pend.id + '">' + fmtLeft(pendingLeft(pend)) + '</span></div><div class="small" style="margin:4px 0 0">Nothing has been sent yet, so this is not proof of payment. Your receipt appears once the money has gone.</div><button class="btn dark block" style="margin-top:10px" data-a="undoSend" data-v="' + pend.id + '">' + ic('undo', 18) + ' ' + t('undo') + ' this transfer</button></div>';
  h += dialectBtn('sent');
  h += '<p class="muted" style="margin:0 0 14px">' + esc((x => x.charAt(0).toUpperCase() + x.slice(1))(m.teach.replace(/^So: /, '').replace(/^也就是说：/, ''))) + '</p></div><div class="pad" style="padding-top:0">';
  h += '<div class="card">' + m.rows.map(r => '<div class="kv"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') + (held ? '<div class="kv"><span>Will send at</span><span>' + esc(held) + '</span></div>' : '') + (pend ? '<div class="kv"><span>' + t('r_ref') + '</span><span class="muted">Given once sent</span></div>' : '<div class="kv"><span>' + t('r_ref') + '</span><span>' + (f.practice ? 'PRACTICE' : 'OC' + String(f.t0).slice(-8)) + '</span></div>') + '</div>';
  if (!f.practice && f.trustedNotified) h += '<div class="banner info">' + ic('users') + '<div>' + esc(S.safety.trusted.name) + ' has been sent a notification about this transfer.</div></div>';
  if (!f.practice && !pend && f.task !== 'moneylock' && f.task !== 'giro') h += '<div class="banner warn">' + ic('info') + '<div><b>' + t('mistake_t') + '</b>' + t('mistake_b') + '</div></div>';
  if (f.practice) {
    h += '<div class="banner safe">' + ic('learn') + '<div><b>' + t('well_t') + '</b>' + t('well_b') + '</div></div>';
    h += '<button class="btn primary block" data-a="practiceToReal">' + t('do_real') + '</button><button class="btn ghost block" data-a="finishFlow">' + t('done') + '</button>';
  } else {
    h += '<button class="btn secondary block" data-a="shareReceipt">' + ic('arrow', 18) + ' Share receipt</button><button class="btn primary block" data-a="finishFlow">' + t('done') + '</button>';
  }
  return h + '</div>';
}

/* ---------- Safety check: "What's this payment for?" (shown only on warning signs) ---------- */
const PURPOSES = [
  { id: 'family', label: 'Paying family or a friend', level: 'ok' },
  { id: 'bill', label: 'Paying a bill or a business I know', level: 'ok' },
  { id: 'shop', label: 'Buying something online', level: 'warn', t: 'Online shopping scams are common', b: 'Scam sellers ask you to pay by bank transfer, then never deliver. Pay through the platform\'s own checkout, not straight to a person you met online.' },
  { id: 'job', label: 'A job, task or commission', level: 'warn', t: 'Real jobs never ask you to pay first', b: 'Being asked to pay to start a job, or to "unlock" your earnings, is how job scams work. Job scams are one of the most common scams in Singapore.' },
  { id: 'invest', label: 'An investment opportunity', level: 'warn', t: 'Check before you invest', b: 'Check the company is licensed on the MAS Financial Institutions Directory. Be very careful of guaranteed or high returns.' },
  { id: 'gov', label: 'Government, police or bank told me to', level: 'stop', t: 'Stop. This is very likely a scam', b: 'Government officials, the police and OCBC will never ask you to transfer money, even to "protect" it. Hang up or stop replying.' },
  { id: 'other', label: 'Something else', level: 'ok' }
];
function viewPauseModal() {
  const f = S.flow, P = PURPOSES.find(x => x.id === f.purpose);
  const biz = f.task === 'uen' ? UEN_DIR[String(f.data.uen).toUpperCase().trim()] : null;
  let h = '<div class="modal-wrap"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="pause-title">';
  if (copilotLive()) h += '<div class="banner info" style="margin:0 0 10px">' + ic('family') + '<div>' + esc(G.copilot.name.split(' (')[0]) + "'s view is paused while you answer. Please answer on your own.</div></div>";
  const why = biz && biz.risky ? 'You are paying a recently registered company you have not paid before.' : f.task === 'overseas' && !(S.usage.overseas > 0) ? 'This is your first overseas transfer.' : 'You are sending ' + money(f.data.amount) + ' to someone you have not paid before.';
  const done = P && f.onPhone != null;
  if (!done) {
    h += '<div class="shield">' + ic('shield', 30) + '</div><h2 id="pause-title" tabindex="-1">Let\'s check this together</h2><p class="muted" style="margin:0 0 6px">' + esc(why) + ' We ask everyone this when a payment shows warning signs. It takes 20 seconds.</p>';
    h += '<div class="q"><p>What is this payment for?</p><div role="radiogroup" aria-label="What is this payment for?">' + PURPOSES.map(x => '<button class="choice" style="width:100%;margin:0 0 6px;text-align:left" role="radio" aria-checked="' + (f.purpose === x.id) + '" data-a="pausePurpose" data-v="' + x.id + '">' + (f.purpose === x.id ? ic('check', 16) + ' ' : '') + esc(x.label) + '</button>').join('') + '</div></div>';
    if (P) h += '<div class="q"><p>Is anyone on a call or chat telling you what to do right now?</p><div class="yn"><button class="btn secondary" data-a="pausePhone" data-v="1">' + t('yes') + '</button><button class="btn secondary" data-a="pausePhone" data-v="0">' + t('no') + '</button></div></div>';
    h += '<button class="btn ghost block" data-a="pauseCancel">' + t('cancel') + ' transfer</button>';
    return h + '</div></div>';
  }
  const stop = P.level === 'stop' || f.onPhone;
  if (stop) {
    h += '<div class="shield" style="background:#b3261e;color:#fff">' + ic('alert', 30) + '</div><h2 id="pause-title" tabindex="-1">' + esc(P.level === 'stop' ? P.t : 'Stop. Someone is telling you what to do') + '</h2>' + dialectBtn('careful') +
      '<p style="margin:0 0 10px;line-height:1.5">' + esc(P.level === 'stop' ? P.b : 'Being told to pay while someone stays on the line is how most scams work. A real person will give you time to check. Hang up, then call the number on the back of your card.') + '</p>' +
      '<div class="banner danger">' + ic('info') + '<div>In 2025, about 8 in 10 scam cases in Singapore were victims sending the money themselves after being tricked (SPF).</div></div>' +
      '<button class="btn primary block" data-a="pauseCancel">Cancel this transfer</button>' +
      '<button class="btn secondary block" style="margin-top:8px" data-a="pauseCall">' + ic('phone', 18) + ' Talk to our anti-scam team</button>' +
      '<button class="btn secondary block" style="margin-top:8px" data-a="pauseLock">' + ic('lock', 18) + ' Lock my savings with Money Lock</button>' +
      '<button class="btn ghost block" style="margin-top:8px;font-size:calc(13px*var(--scale))" data-a="pauseOverride">I am sure. Send it, but hold it for 24 hours first</button>';
  } else if (P.level === 'warn') {
    h += '<div class="shield" style="background:var(--amber-tint);color:var(--amber)">' + ic('alert', 30) + '</div><h2 id="pause-title" tabindex="-1">' + esc(P.t) + '</h2><p style="margin:0 0 10px;line-height:1.5">' + esc(P.b) + '</p>' +
      '<button class="btn primary block" data-a="pauseCancel">Cancel this transfer</button>' +
      '<button class="btn secondary block" style="margin-top:8px" data-a="pauseOverride">' + ic('hourglass', 18) + ' Hold it for 24 hours, then send</button>' +
      '<button class="btn secondary block" style="margin-top:8px" data-a="pauseCall">' + ic('phone', 18) + ' Talk to our anti-scam team</button>';
  } else {
    h += '<div class="shield">' + ic('check', 30) + '</div><h2 id="pause-title" tabindex="-1">Thank you</h2><div class="banner safe">' + ic('shield') + '<div>Remember: OCBC, the police and the government will never ask you to move money to keep it safe.</div></div>' +
      '<button class="btn primary block" data-a="pauseContinue">Continue to send</button><button class="btn ghost block" data-a="pauseCancel">' + t('cancel') + ' transfer</button>';
  }
  return h + '</div></div>';
}

function helperHeadBtn(variant) {
  return '<button class="pill helper-btn' + (variant ? ' ' + variant : '') + '" data-a="openHelper" aria-label="' + t('ask_helper') + '">' + ic('chat', 16) + ' ' + t('helper') + '</button>';
}

/* ==========================================================
   OCBC Helper (Idea E): context-aware, chatbot first,
   hand-off to a person with a masked summary.
   Answers come from a fixed glossary and screen texts: it
   never invents fees or figures.
   ========================================================== */

function helperContext() {
  if (S.screen === 'flow' && S.flow) {
    const f = S.flow;
    if (f.stage === 'review') return { key: 'review', label: taskName(f.task) + ', check screen', task: f.task };
    if (f.stage === 'receipt') return { key: 'receipt', label: taskName(f.task) + ', done', task: f.task };
    const st = flowSteps()[f.step];
    return { key: 'flow', label: taskName(f.task) + ', step ' + (f.step + 1) + ' (' + tx(st.q) + ')', task: f.task, step: st };
  }
  const names = { home: t('nav_home'), pay: t('nav_pay'), learn: t('learn_title'), more: t('nav_more'), onboarding: t('your_app'), passport: t('passport'), confidence: t('conf_title'), safety: t('safety'), log: t('log_title'), drill: t('drills') };
  return { key: S.screen, label: names[S.screen] || S.screen };
}

function helperSuggestions(ctx) {
  const out = [{ label: t('explain_screen'), a: 'helperAsk', v: '__explain' }];
  const glossFor = { uen: 'uen', paynow: 'paynow', overseas: 'swift', giro: 'giro', moneylock: 'moneylock', scan: 'qr', newpayee: 'fast' };
  if (ctx.task && glossFor[ctx.task]) out.push({ label: 'What is ' + glossFor[ctx.task].toUpperCase().replace('MONEYLOCK', 'Money Lock').replace('QR', 'an SGQR code') + '?', a: 'helperAsk', v: '__gloss:' + glossFor[ctx.task] });
  if (ctx.task && S.flow && !S.flow.practice) out.push({ label: 'Practise this first', a: 'startPractice', v: ctx.task });
  out.push({ label: 'Ask family to help', a: 'copilotStart', v: '' });
  out.push({ label: 'Is this message a scam?', a: 'helperAsk', v: '__scam' });
  out.push({ label: 'Open Money Lock', a: 'startTask', v: 'moneylock' });
  out.push({ label: t('talk_person'), a: 'helperAsk', v: '__person' });
  out.push({ label: 'Phoning us? Get a help code', a: 'helpCode', v: '' });
  return out;
}

function openHelper(reason) {
  const ctx = helperContext();
  S.helper.open = true;
  S.nudge = false;
  if (!S.helper.msgs.length || S.helper.ctxKey !== ctx.label) {
    S.helper.ctxKey = ctx.label;
    S.helper.msgs.push({ who: 'bot', text: (S.settings.lang === 'zh' ? '您好，我是小助手。' : "Hi, I'm Helper.") + ' ' + (reason === 'error' ? 'I saw something went wrong. No money has moved. I can explain what happened.' : reason === 'stuck' ? 'Take your time. Here is what this step is about.' : 'How can I help?'), actions: helperSuggestions(ctx) });
    if (reason === 'stuck' || reason === 'error') helperAnswer('__explain', true);
  }
  track('helper_open', { ctx: ctx.key, reason: reason || 'button' });
}

function helperAnswer(q, silentUser) {
  const ctx = helperContext();
  const raw = String(q || '').trim();
  if (!raw) return;
  const lower = raw.toLowerCase();
  if (!silentUser && !raw.startsWith('__')) S.helper.msgs.push({ who: 'me', text: raw });
  const say = (text, actions, extra) => { S.helper.msgs.push(Object.assign({ who: 'bot', text, actions }, extra || {})); if (S.settings.readAloud || S.settings.mode === 'voice') speak(text); };

  // Built-in quick intents
  if (raw === '__explain' || /explain|what is this (page|screen)|解释|terangkan|விளக்கு/.test(lower)) {
    if (!silentUser && raw === '__explain') S.helper.msgs.push({ who: 'me', text: t('explain_screen') });
    let text = tx(SCREEN_HELP[ctx.key] || SCREEN_HELP.home);
    if (ctx.step) {
      const lang = S.settings.lang;
      text += ' ' + ((ctx.step.x.simple[lang]) || ctx.step.x.simple.en);
    }
    track('helper_q', { q: 'Explain this screen' });
    return say(text, [{ label: t('read_aloud'), a: 'speakText', v: text }].concat(ctx.task && S.flow && !S.flow.practice ? [{ label: 'Practise this first', a: 'startPractice', v: ctx.task }] : []));
  }
  if (raw.startsWith('__gloss:')) {
    const k = raw.slice(8);
    S.helper.msgs.push({ who: 'me', text: 'What is ' + k.toUpperCase() + '?' });
    track('helper_q', { q: 'What is ' + k.toUpperCase() + '?' });
    return say(tx(GLOSSARY[k]), [{ label: t('read_aloud'), a: 'speakText', v: tx(GLOSSARY[k]) }]);
  }
  if (typeof mlScam === 'function' && !raw.startsWith('__') && (raw.length >= 70 || /https?:|www\.|bit\.ly|tinyurl|\.(xyz|top|site|online)\b/i.test(raw))) {
    const r = mlScam(raw);
    mlRecord('Scam message model', raw.slice(0, 70) + (raw.length > 70 ? '…' : ''), r.p, 'Answered in Helper');
    const up = r.parts.filter(x => x.w > 0.4).slice(0, 4).map(x => tokLabel(x.t));
    track('helper_q', { q: 'Pasted a message' });
    return say('If this is a message you received: my scam model gives it ' + Math.round(r.p * 100) + '%. ' + (r.level === 'scam' ? 'That is very likely a scam' : r.level === 'careful' ? 'Be careful with it' : r.level === 'ok' ? 'Nothing scam-like stood out, but a model can be wrong' : 'It is too short to judge') + (up.length ? ' (it noticed ' + up.join(', ') + ')' : '') + '. Do not tap links in it, and never share an OTP or password. OCBC will never ask for them.', [{ label: 'Open the message checker', a: 'go', v: 'msgcheck' }, { label: t('talk_person'), a: 'helperAsk', v: '__person' }]);
  }
  if (raw === '__scam' || /scam|fraud|suspicious|骗|penipuan|மோசடி/.test(lower)) {
    if (raw === '__scam') S.helper.msgs.push({ who: 'me', text: 'Is this message a scam?' });
    track('helper_q', { q: 'Is this message a scam?' });
    return say('Three quick checks: 1) Does it have a link or ask for your password or OTP? Banks never do. 2) Does it rush you or threaten you? 3) Does someone want you to move money to keep it "safe"? If any answer is yes, it is very likely a scam. Do not reply, and do not click.',
      [{ label: 'Check a message with the scam model', a: 'go', v: 'msgcheck' }, { label: 'Practise with scam drills', a: 'openDrill', v: '0' }, { label: 'Lock my savings', a: 'startTask', v: 'moneylock' }, { label: t('talk_person'), a: 'helperAsk', v: '__person' }]);
  }
  if (raw === '__person' || /person|human|agent|staff|call me|真人|客服|orang|ஒருவர்/.test(lower)) {
    if (raw === '__person') S.helper.msgs.push({ who: 'me', text: t('talk_person') });
    track('helper_q', { q: 'Talk to a person' });
    S.helper.msgs.push({ who: 'bot', text: 'I can ask an OCBC officer to call you back inside the app, so you know it is really us. This is what I will share, so you never have to repeat yourself:', card: 'handoff', actions: [{ label: 'I would rather phone you: get a help code', a: 'helpCode', v: '' }] });
    return;
  }
  // Settings by conversation (each logged as "You asked Helper")
  if (/bigger|larger|text size|字大|besar|பெரிய/.test(lower)) {
    setSetting('scale', Math.min(6, S.settings.scale + 1), 'helper');
    return say('Done. I made the text one size bigger. You can undo this from the chip on your home screen or in More.', []);
  }
  if (/simple|plain|简单|mudah|எளிய/.test(lower)) {
    setSetting('simple', true, 'helper'); S.passport.simple = true;
    return say('Done. Simple wording is on. Official details like fees and risks are still shown.', []);
  }
  if (/read|speak|aloud|voice|朗读|baca|படி/.test(lower)) {
    setSetting('readAloud', true, 'helper');
    return say('Done. I will read new steps aloud.', []);
  }
  if (/chinese|中文|华语/.test(lower)) { setSetting('lang', 'zh', 'helper'); return say('好的，已换成中文。', []); }
  if (/malay|melayu/.test(lower)) { setSetting('lang', 'ms', 'helper'); return say('Baik, bahasa ditukar ke Bahasa Melayu.', []); }
  if (/tamil|தமிழ்/.test(lower)) { setSetting('lang', 'ta', 'helper'); return say('சரி, மொழி தமிழுக்கு மாற்றப்பட்டது.', []); }
  if (/practi|练习|latih|பயிற்சி/.test(lower)) {
    return say('You can practise any task with pretend money.', TASKS.slice(0, 5).map(x => ({ label: taskShort(x.id), a: 'startPractice', v: x.id })));
  }
  // Glossary
  for (const k in GLOSSARY) {
    if (GLOSSARY[k].words.some(w => lower.includes(w))) { track('helper_q', { q: 'What is ' + k.toUpperCase() + '?' }); return say(tx(GLOSSARY[k]), [{ label: t('read_aloud'), a: 'speakText', v: tx(GLOSSARY[k]) }]); }
  }
  if (/fee|charge|cost|rate|手续费|yuran/.test(lower)) {
    return say('Fees depend on the task. PayNow, Scan & Pay and FAST transfers in Singapore have no fee. For overseas transfers, the exact fee and the amount received are shown on the check screen before you confirm. I will not guess a number for you.', []);
  }
  track('helper_q', { q: 'Other (not understood)' });
  say("I don't want to guess about your money. I can explain a word, explain this screen, or connect you with a person.", helperSuggestions(ctx));
}

function handoffSummary() {
  const ctx = helperContext();
  const f = S.flow;
  const items = [['Customer', S.name], ['Where they are', ctx.label]];
  if (f && f.err) items.push(['Last error', f.err.msg]);
  if (f && f.purpose) {
    const P = PURPOSES.find(x => x.id === f.purpose);
    const urgent = P && (P.level === 'stop' || f.onPhone);
    items.push([urgent ? 'URGENT: safety check' : 'Safety check', 'Payment for: "' + (P ? P.label : f.purpose) + '"' + (f.onPhone ? '. Someone is on a call or chat telling them what to do' : '') + '. Transfer paused, not sent.']);
  }
  if (f) items.push(['Mode', (f.practice ? 'Practice, ' : '') + (f.mode === 'guided' ? 'step by step' : 'quick form') + ', ' + S.settings.mode]);
  if (f && f.data.amount) items.push(['Amount entered', money(f.data.amount)]);
  if (f && f.data.acct) items.push(['Account entered', mask(f.data.acct)]);
  return items;
}
function passportChips() {
  const p = S.passport, out = ['Language: ' + (LANGS.find(l => l.code === S.settings.lang) || {}).name];
  if (p.simple || S.settings.simple) out.push('Use simple words');
  if (p.larger) out.push('Larger text');
  if (p.patient) out.push('Please give more time');
  if (p.trustedHelp) out.push('May have a trusted person helping');
  if (S.settings.mode === 'voice') out.push('Prefers voice');
  if (S.dialect !== 'off') out.push('Prefers ' + dialectName(S.dialect).split(' ')[0]);
  return out;
}

function viewHelper() {
  const ctx = helperContext();
  let h = '<div class="sheet-wrap" data-a="closeHelperBg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="helper-title" data-stop="1">' +
    '<div class="sheet-head"><span class="avatar">' + ic('chat', 20) + '</span><div style="flex:1"><div id="helper-title" tabindex="-1" style="font-weight:800">OCBC ' + t('helper') + '</div><div class="small muted">Answers from OCBC guidance only. Can hand you to a person.</div></div><button class="iconbtn" data-a="closeHelper" aria-label="' + t('close') + '">' + ic('close') + '</button></div>' +
    '<div class="sheet-body" id="helper-body"><div class="ctx">' + ic('eye', 14) + ' Helper can see you are on: <b>' + esc(ctx.label) + '</b></div><div class="chat" aria-live="polite">';
  S.helper.msgs.forEach((m, idx) => {
    if (m.who === 'me') { h += '<div class="msg me">' + esc(m.text) + '</div>'; return; }
    h += '<div class="msg bot">' + esc(m.text);
    if (m.card === 'handoff') {
      if (m.sent) {
        h += '<div class="banner safe" style="margin:10px 0 0">' + ic('check') + '<div><b>Request ' + esc(m.sent) + ' sent</b>An officer will call you in the app. You will see "verified call" on your home screen, so you know it is really OCBC.</div></div>';
      } else {
        h += '<div style="background:var(--bg);border-radius:10px;padding:10px;margin-top:8px;font-size:calc(13px*var(--scale))">' + handoffSummary().map(r => '<div class="kv" style="padding:5px 0"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>').join('') +
          '<div style="margin-top:6px">' + passportChips().map(c => '<span class="pchip">' + esc(c) + '</span>').join('') + '</div><div class="small muted" style="margin-top:6px">Account numbers are masked. Your Passport shares choices, never reasons.</div></div>' +
          '<div class="small" style="margin:10px 0 6px;font-weight:700">When should we call?</div><div class="row" style="flex-wrap:wrap"><button class="choice" data-a="handoffSend" data-v="' + idx + '|Now (about 5 minutes)">Now (about 5 min)</button><button class="choice" data-a="handoffSend" data-v="' + idx + '|Today, 6pm to 8pm">Today 6 to 8pm</button></div>';
      }
    }
    if (m.actions && m.actions.length) h += '<div class="row" style="flex-wrap:wrap;margin-top:8px;gap:6px">' + m.actions.map(a => '<button class="pill" data-a="' + a.a + '" data-v="' + esc(a.v) + '">' + esc(a.label) + '</button>').join('') + '</div>';
    h += '</div>';
  });
  h += '</div></div><form class="sheet-input" data-a="helperSubmit"><label class="sr-only" for="helper-q">' + t('type_q') + '</label><input id="helper-q" placeholder="' + t('type_q') + '" autocomplete="off">' +
    '<button type="button" class="iconbtn" data-a="helperMic" aria-label="Speak your question" style="background:var(--bg)">' + ic('mic') + '</button>' +
    '<button type="submit" class="iconbtn" aria-label="' + t('send') + '" style="background:var(--red);color:#fff">' + ic('arrow') + '</button></form></div></div>';
  return h;
}

/* ==========================================================
   Outside the phone: demo controls, behind-the-scenes log,
   staff console and bank insights dashboard (Idea H)
   ========================================================== */

function viewTopbar() {
  const tab = (v, label) => '<button role="tab" aria-selected="' + (G.view === v) + '" data-a="view" data-v="' + v + '">' + label + (v === 'staff' && G.tickets.some(x => x.status === 'new') ? ' <span class="badge" style="background:var(--red);color:#fff">' + G.tickets.filter(x => x.status === 'new').length + '</span>' : '') + '</button>';
  return '<header class="topbar"><span class="brand">OCBC</span><span class="title">Adaptive Banking: One Experience for Every Customer</span>' +
    '<span class="badge">Student concept prototype · PS4 · synthetic data · not an OCBC product</span>' +
    '<nav class="tabs" role="tablist" aria-label="Prototype views">' + tab('app', 'Customer app') + tab('engine', 'Adaptive Engine') + tab('four', 'One app, four experiences') + tab('staff', 'Staff hand-off') + tab('dash', 'Bank insights') + tab('ml', 'Machine learning') + '</nav></header>';
}

function viewControls() {
  const p = PERSONAS.find(x => x.id === G.personaId);
  return '<div class="side"><section class="panel" aria-labelledby="pp"><h2 id="pp">Demo persona</h2>' +
    PERSONAS.map(x => '<button class="persona-btn" data-a="persona" data-v="' + x.id + '" aria-pressed="' + (G.personaId === x.id) + '"><span class="av" style="background:' + x.color + '">' + x.initials + '</span><span><b>' + esc(x.need) + '</b><small>' + esc(x.name) + (x.onboarded ? '' : ' · starts with welcome setup') + '</small></span></button>').join('') +
    '<div class="note">' + esc(p.notes) + '</div></section>' +
    '<section class="panel" aria-labelledby="dc"><h2 id="dc">Demo controls</h2>' +
    '<div class="ctl-row"><button class="chip-btn ' + (G.call ? 'on' : '') + '" data-a="simCall">' + (G.call ? 'End verified OCBC call' : 'Simulate a verified OCBC call') + '</button></div>' +
    '<div class="ctl-row"><button class="chip-btn ' + (G.spotlight ? 'on' : '') + '" data-a="spotlight" aria-pressed="' + !!G.spotlight + '">' + (G.spotlight ? 'Spotlight on: hide the labels' : 'Spotlight: show what we added (Shift + S)') + '</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="simStruggle">Live Adaptation: simulate struggling on this step</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="mlSim">Machine learning: add small struggle signs on this step</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="simStuck">Simulate "customer seems stuck"</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="simScam">Scam scenario: pay a UEN a "caller" gave</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="simFirstOverseas">First overseas transfer (practice offer)</button></div>' +
    '<div class="ctl-row"><button class="chip-btn" data-a="resetPersona">Reset this persona</button></div>' +
    '<h3>Suggested 3-minute demo</h3><ol class="note" style="margin:0;padding-left:28px">' +
    '<li>Open "Adaptive Engine": change the four inputs and watch the same step rebuild, then switch to ATM and Hotline.</li><li>Customer app, any user: PayNow to a business, type a wrong UEN twice. The step simplifies itself, with Undo.</li><li>Pay &amp; Transfer, Local: add 555566667 as "Tan Ah Beng". "Check who you\'re paying" shows a different masked name.</li><li>Prefers to be shown: welcome setup in 中文, then "Show me how" and dialect audio.</li><li>First-time banker: PayNow a third time, tap "Why am I seeing this?", accept the quick version.</li><li>First-time banker: send to a new mobile number: 60-second Undo, "Not paid yet".</li><li>Scam scenario: "What is this payment for?" answer "Government told me", then talk to the anti-scam team.</li><li>Staff hand-off: read the page, call back in the app.</li><li>Bank insights: outcomes, top questions, no-assumption audit.</li></ol></section></div>';
}

function viewBehind() {
  const rows = TASKS.map(x => '<tr><td>' + esc(taskShort(x.id)) + '</td><td>' + levelLabel(S.confidence[x.id]) + '</td><td>' + opensAs(x.id) + '</td><td>' + (S.usage[x.id] || 0) + '</td></tr>').join('');
  return '<div class="side"><section class="panel" aria-labelledby="bs"><h2 id="bs">Behind the scenes (for judges)</h2>' +
    '<p class="note" style="margin-top:0">Everything the app adapts comes from what ' + esc(S.short) + ' chose or did. The app never stores age, disability or income.</p>' +
    '<h3>Confidence Map</h3><table class="t"><thead><tr><th>Task</th><th>Level</th><th>Opens as</th><th>Uses</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    (typeof mlLivePanel === 'function' ? mlLivePanel() : '') +
    '<h3>Live adaptation log</h3><div class="log" aria-live="polite">' + (S.log.length ? S.log.map(l => '<div class="log-item ' + l.kind + '"><div class="t">' + esc(l.t) + '</div><div class="w">' + esc(l.what) + '</div><div class="y">' + esc(l.why) + '</div></div>').join('') : '<div class="note">No changes yet. Try changing a setting or finishing a task.</div>') + '</div></section></div>';
}

/* ---------------- STAFF HAND-OFF (slim: no one watches screens live) ---------------- */
const SAMPLE_TICKETS = [
  { id: 'CB-0998', persona: 'sample', customer: 'Customer 2 (sample)', at: '09:12', when: 'Today, 6pm to 8pm', status: 'new', reason: 'Call-back request', urgent: false, passport: ['Language: English', 'Use simple words'], summary: [['Where they are', 'Cards, replace a damaged card'], ['Asked Helper', 'How long does a new card take?']], journey: [{ t: '09:10', w: 'Opened Helper' }, { t: '09:11', w: 'Asked Helper: How long does a new card take?' }], chat: [], conf: '', sample: true },
  { id: 'CB-0997', persona: 'sample', customer: 'Customer 3 (sample)', at: '09:05', when: 'Now (about 5 minutes)', status: 'new', reason: 'Locked out of the app', urgent: false, passport: ['Language: Bahasa Melayu', 'Please give more time'], summary: [['Where they are', 'Login, account locked after 3 tries'], ['Needed', 'Identity check before unlocking']], journey: [{ t: '09:02', w: 'Login failed 3 times' }, { t: '09:04', w: 'Asked for a call-back' }], chat: [], conf: '', sample: true }
];
function viewStaff() {
  const tickets = G.tickets.slice().reverse().concat(SAMPLE_TICKETS);
  const sel = tickets.find(x => x.id === G.staffSel) || tickets[0];
  const badge = tk => '<span class="pchip" style="' + (tk.urgent ? 'background:var(--red-tint);color:var(--red)' : '') + '">' + esc(tk.reason || 'Call-back request') + '</span>';
  let h = '<main class="wide"><div class="banner info" style="max-width:none">' + ic('info') + '<div><b>Slim hand-off.</b> Nobody watches customer screens live. Helper answers everyday questions; only suspected scams, locked accounts and call-back requests reach a person. The officer reads one page, makes one short in-app call, and closes the case. This uses OCBC\'s existing contact centre and anti-scam team.</div></div>' +
    '<div class="dash-card"><h2>Look up a help code</h2><p class="lead">For customers who phone the hotline instead of using the app. The code only shows this summary, expires in 30 minutes and gives no account access. Verify identity as usual.</p>' +
    '<div class="row" style="max-width:420px"><label class="sr-only" for="hc-q">Help code</label><input id="hc-q" class="input" inputmode="numeric" maxlength="4" placeholder="4-digit code" value="' + esc(G.hcQuery || '') + '"><button class="btn dark" data-a="staffLookup">Look up</button></div>';
  if (G.hcQuery) {
    const c = G.helpCodes[G.hcQuery];
    if (!c || c.expires < Date.now()) h += '<p class="lead" style="margin-top:10px">No active code ' + esc(G.hcQuery) + '. It may have expired.</p>';
    else h += '<div class="grid2" style="margin-top:12px"><div><div class="small muted">Customer</div><b>' + esc(c.customer) + '</b> · code made ' + esc(c.at) + '<div class="small muted" style="margin:8px 0 4px">How to serve them (their Passport)</div>' + c.passport.map(x => '<span class="pchip">' + esc(x) + '</span>').join('') + '</div><div><div class="small muted" style="margin-bottom:4px">Where they were</div><table class="t">' + c.summary.map(r => '<tr><td class="muted">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table></div></div>';
  }
  h += '</div><div class="staff-grid"><div class="dash-card"><h2>Handed over by Helper · ' + tickets.filter(x => x.status !== 'resolved').length + '</h2>' +
    tickets.map(tk => '<button class="ticket-btn' + (sel && tk.id === sel.id ? ' on' : '') + (tk.urgent ? ' urgent' : '') + '" data-a="staffPick" data-v="' + tk.id + '"><b>' + esc(tk.customer) + '</b>' + badge(tk) + '<small>' + esc(tk.id) + ' · ' + esc(tk.at) + ' · ' + (tk.status === 'new' ? 'waiting' : tk.status === 'calling' ? 'on verified call' : 'resolved') + '</small></button>').join('') +
    '<p class="lead" style="margin-top:10px">Try it: in the customer app, open Helper and tap "Talk to a person", or use the scam scenario.</p></div>';
  if (sel) {
    h += '<div class="dash-card"><div class="between"><h2 style="margin:0">' + esc(sel.customer) + '</h2>' + badge(sel) + '</div><p class="lead">' + esc(sel.id) + ' · requested ' + esc(sel.at) + ' · call ' + esc(sel.when) + (sel.lang && sel.lang !== 'en' ? ' · customer\'s language: ' + esc((LANGS.find(l => l.code === sel.lang) || {}).name) + '. Call back in that language.' : '') + '</p>' +
      '<div class="grid2"><div><h3>How to serve them (their Passport)</h3>' + sel.passport.map(c => '<span class="pchip">' + esc(c) + '</span>').join('') + (sel.conf ? '<div class="small muted" style="margin-top:6px">Confidence Map: ' + esc(sel.conf) + '</div>' : '') +
      '<p class="small muted">Choices the customer shared once. Never reasons. Nothing inferred. Passwords, OTPs and full account numbers are never shown.</p>' +
      '<h3>Where they got stuck</h3><table class="t">' + sel.summary.map(r => '<tr><td class="muted">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table></div>' +
      '<div><h3>Journey so far</h3>' + (sel.journey && sel.journey.length ? '<ol class="timeline">' + sel.journey.map(j => '<li><span>' + esc(j.t) + '</span>' + esc(j.w) + '</li>').join('') + '</ol>' : '<div class="muted">-</div>') +
      '<h3>Chat with Helper</h3>' + (sel.chat && sel.chat.length ? sel.chat.map(m => '<div class="staff-msg ' + m.who + '">' + esc(m.text) + (m.en ? '<div class="staff-en">English: ' + esc(m.en) + '</div>' : '') + '</div>').join('') : '<div class="muted">No chat. ' + (sel.asked && sel.asked.length ? 'Asked: ' + sel.asked.map(q => '"' + esc(q) + '"').join(', ') : '') + '</div>') + '</div></div>' +
      '<div class="row" style="margin-top:14px;flex-wrap:wrap">' + (sel.status === 'new' ? '<button class="btn primary" data-a="staffCall" data-v="' + sel.id + '">' + ic('phone', 18) + ' Call back in the app (verified)</button>' : sel.status === 'calling' ? '<span class="muted">Customer sees code <b>' + (G.call ? G.call.code : '') + '</b> on their screen, so they know it is really OCBC.</span><button class="btn dark" data-a="staffEnd" data-v="' + sel.id + '">End call and resolve</button>' : '<span class="muted">Resolved.</span>') +
      (sel.urgent && sel.status !== 'resolved' && !sel.sample ? (G.staffRing && G.staffRing.persona === sel.persona ? '<button class="btn secondary" data-a="staffRingClear">Remove highlight</button><span class="small muted">The Cancel button is ringed in blue on their screen.</span>' : '<button class="btn secondary" data-a="staffHighlight" data-v="' + sel.id + '">' + ic('hand', 18) + ' Highlight "Cancel" on their screen</button><span class="small muted">Suspected scams only. Staff can point, never press.</span>') : '') +
      '</div></div>';
  }
  return h + '</div></main>';
}

/* ---------------- BANK INSIGHTS DASHBOARD ---------------- */
function liveCounts() {
  const ev = G.events;
  const c = k => ev.filter(e => e.type === k).length;
  return {
    practice: c('practice_done'), real: c('real_done'), realAfterPractice: ev.filter(e => e.type === 'real_done' && e.afterPractice).length,
    helper: c('helper_open'), helperQ: ev.filter(e => e.type === 'helper_q'), handoffs: c('handoff'),
    pauseShown: c('pause_shown'), pauseCancelled: c('pause_cancel'), pauseCont: c('pause_continue'), conf: c('conf_change'), settings: c('setting'),
    suggestYes: c('suggest_yes'), suggestNo: c('suggest_no'), onboard: c('onboard_done'), onboardSkip: c('onboard_skip')
  };
}

function barStack(data) {
  const W = 520, rowH = 30, labelW = 120, H = TASKS.length * rowH + 30;
  const cols = ['#e1251b', '#f0a33a', '#0f7b45'];
  let s = '<svg role="img" aria-label="Customer confidence by task" viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:640px">';
  TASKS.forEach((x, i) => {
    const v = data[x.id], tot = v[0] + v[1] + v[2], y = i * rowH + 6;
    let xx = labelW;
    s += '<text x="0" y="' + (y + 15) + '" font-size="12" fill="#4a4a4f">' + esc(taskShort(x.id)) + '</text>';
    v.forEach((n, j) => {
      const w = (W - labelW - 10) * n / tot;
      s += '<rect x="' + xx + '" y="' + y + '" width="' + Math.max(0, w - 1) + '" height="20" rx="3" fill="' + cols[j] + '"><title>' + LEVELS[j] + ': ' + n + '</title></rect>';
      if (w > 34) s += '<text x="' + (xx + w / 2) + '" y="' + (y + 14) + '" font-size="11" fill="#fff" text-anchor="middle">' + Math.round(n / tot * 100) + '%</text>';
      xx += w;
    });
  });
  return s + '</svg>';
}
function hbars(rows, color, fmt) {
  const max = Math.max(...rows.map(r => r[1]));
  return '<div>' + rows.map(r => '<div style="display:grid;grid-template-columns:170px 1fr 54px;gap:8px;align-items:center;margin-bottom:6px"><span style="font-size:12.5px">' + esc(r[0]) + '</span><span style="background:var(--bg);border-radius:4px;height:14px;display:block"><span style="display:block;height:14px;border-radius:4px;width:' + (r[1] / max * 100) + '%;background:' + color + '"></span></span><span style="font-size:12.5px;text-align:right;font-weight:600">' + (fmt ? fmt(r[1]) : r[1]) + '</span></div>').join('') + '</div>';
}

function viewDash() {
  const L2 = liveCounts();
  const confData = clone(DASH.conf);
  // add this session's customer to the aggregate
  TASKS.forEach(x => { confData[x.id][LEVELS.indexOf(S.confidence[x.id])] += 1; });
  const pr = Object.values(DASH.practice).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
  const conv = Math.round((pr[1] + L2.realAfterPractice) / (pr[0] + L2.practice) * 100);
  const onboardRate = Math.round((DASH.onboard.completed + L2.onboard) / (DASH.customers + L2.onboard + L2.onboardSkip) * 100);
  const stopRate = Math.round((DASH.pause.cancelled + L2.pauseCancelled) / (DASH.pause.shown + L2.pauseShown) * 100);
  const sugg = Math.round((DASH.suggestions.accepted + L2.suggestYes) / (DASH.suggestions.offered + L2.suggestYes + L2.suggestNo) * 100);
  const kpi = (v, l, d) => '<div class="kpi"><div class="v">' + v + '</div><div class="l">' + l + '</div>' + (d ? '<div class="d">' + d + '</div>' : '') + '</div>';
  const helperRows = DASH.helperTop.map(r => [r[0], r[1] + L2.helperQ.filter(q => q.q === r[0]).length]);
  const practiceRows = TASKS.map(x => [taskShort(x.id), Math.round(DASH.practice[x.id][1] / DASH.practice[x.id][0] * 100)]);

  return '<main class="wide">' +
    '<div class="banner warn" style="max-width:none">' + ic('info') + '<div><b>Synthetic data for the prototype.</b> Aggregates are generated for ' + DASH.customers.toLocaleString() + ' pretend customers, plus live events from this demo session. Grouped by task and chosen settings, never by age or any guessed trait. Groups smaller than 10 people are hidden. All figures on this page are sample data, not results.</div></div>' +
    '<div class="kpis">' + kpi(onboardRate + '%', 'Finished the welcome setup', 'Rest use the standard app') + kpi(conv + '%', 'Went from practice to the real task', '+' + L2.realAfterPractice + ' this session') + kpi(Math.round(DASH.helperResolved * 100) + '%', 'Helper questions solved without a person', L2.handoffs + ' hand-offs this session') + kpi(stopRate + '%', 'Safety checks where the customer cancelled', (DASH.pause.shown + L2.pauseShown) + ' checks shown') + kpi(sugg + '%', 'Accepted "quicker version" suggestions', 'Offered, never imposed') + kpi(DASH.sus, 'SUS usability score (sample)', 'Out of 100. 68 is the industry average') + '</div>' +
    livePanel() +
    purposePanel() +
    '<div class="grid2"><div class="dash-card"><h2>Top questions to Helper, by screen</h2><p class="lead">Each one points at a screen to improve.</p><table class="t"><thead><tr><th>Question</th><th>Asked on</th><th>Times</th></tr></thead><tbody>' + DASH.helperByScreen.map(r => '<tr><td>' + esc(r[0]) + '</td><td class="muted">' + esc(r[1]) + '</td><td>' + r[2] + '</td></tr>').join('') + '</tbody></table><p class="lead" style="margin-top:8px"><b>Act on this:</b> "What is a UEN?" is the top question, so explain UEN on the screen itself.</p></div>' +
    '<div class="dash-card"><h2>Why chats reached a person</h2><p class="lead">People are kept for what needs them.</p>' + hbars(DASH.reachedPerson.map((r, i) => [r[0], r[1] + G.tickets.filter(tk => i === 0 ? tk.urgent : i === 1 ? !tk.urgent : false).length]), 'var(--red)') +
    '<h2 style="margin-top:16px">Screens that send people to the hotline</h2><p class="lead">From help codes customers read out on the phone.</p>' + hbars(DASH.helpCodes.map(r => [r[0], r[1] + G.events.filter(e => e.type === 'help_code' && String(e.where).toLowerCase().includes(r[0].split(',')[0].toLowerCase().split(' ')[0])).length]), 'var(--blue)') + '<p class="lead" style="margin-top:8px"><b>Act on this:</b> most hotline calls start on the overseas fee screen, so rewrite it first.</p></div></div>' +
    '<div class="grid3"><div class="dash-card"><h2>Where customers lack confidence</h2><p class="lead">Share of customers at each level, per task. This tells OCBC which journeys to redesign or teach first.</p>' +
    '<div class="legend"><span><i style="background:#e1251b"></i>New to me</span><span><i style="background:#f0a33a"></i>With some help</span><span><i style="background:#0f7b45"></i>I do this often</span></div>' + barStack(confData) +
    '<p class="lead" style="margin-top:8px">Insight: overseas transfers and new payees have the most "New to me" customers. Those are also the journeys scammers target.</p></div>' +
    '<div class="dash-card"><h2>Practice that turned into real use</h2><p class="lead">% of practice runs followed by the real task within 7 days.</p>' + hbars(practiceRows, 'var(--green)', v => v + '%') + '</div></div>' +
    '<div class="grid2"><div class="dash-card"><h2>What customers ask Helper</h2><p class="lead">Top questions. Frequent "What is..." questions point to jargon OCBC could remove from screens.</p>' + hbars(helperRows, 'var(--blue)') + '</div>' +
    '<div class="dash-card"><h2>Settings customers chose</h2><p class="lead">Number of customers who switched each one on.</p>' + hbars(DASH.settings, '#8a4fbf') + '</div></div>' +
    '<div class="grid2"><div class="dash-card"><h2>Life Moments customers told us about</h2><p class="lead">Customer-declared only. Shows OCBC which life events to design journeys for.</p>' + hbars([['Helping someone else with money', 184 + G.events.filter(e => e.type === 'life' && e.id === 'caring').length], ['Stopping work', 152 + G.events.filter(e => e.type === 'life' && e.id === 'retiring').length], ['Starting my first job', 131], ['Studying or working overseas', 97], ['New regular bills', 58], ['Sorting out a family member\'s accounts', 41]], 'var(--blue)') + '</div>' +
    '<div class="dash-card"><h2>New help features used</h2><p class="lead">This demo session plus synthetic baseline.</p>' + hbars([['Family Co-pilot sessions', 236 + G.events.filter(e => e.type === 'copilot_live').length], ['Ghost hand demos watched', 612 + G.events.filter(e => e.type === 'ghost_hand').length], ['Dialect audio plays', 455 + G.events.filter(e => e.type === 'dialect_play').length], ['Chat or voice-note requests', 389 + G.events.filter(e => e.type === 'chat_intent').length], ['Transfers undone in 60s', 47 + G.events.filter(e => e.type === 'undo').length]], 'var(--green)') + '</div></div>' +
    viewDialectStudio() +
    '<div class="dash-card"><h2>Live accessibility audit of the customer app</h2><p class="lead">Runs in the browser on the app screens each time this tab opens (WCAG 2.2 AA checks we can automate). Manual screen-reader testing is still needed.</p><div id="a11y-audit">Running...</div></div>' +
    '<div class="dash-card"><h2>No-assumption audit</h2><p class="lead">Every rule that changes the app, and the customer input it depends on. The brief rules out inferring sensitive traits; this table is how we prove we did not.</p><table class="t"><thead><tr><th>Adaptation rule</th><th>Depends only on</th><th>Never uses</th></tr></thead><tbody>' + RULES.map(r => '<tr><td>' + esc(r.rule) + '</td><td>' + esc(r.input) + '</td><td class="muted">' + esc(r.never) + '</td></tr>').join('') + '</tbody></table></div>' +
    '<div class="dash-card"><h2>This session\'s events</h2><p class="lead">Raw events from the demo, newest first.</p>' + (G.events.length ? '<table class="t"><thead><tr><th>Time</th><th>Customer</th><th>Event</th><th>Detail</th></tr></thead><tbody>' + G.events.slice(-25).reverse().map(e => '<tr><td>' + new Date(e.t).toLocaleTimeString('en-SG') + '</td><td>' + esc(e.persona) + '</td><td>' + esc(e.type) + '</td><td class="muted">' + esc(Object.entries(e).filter(([k]) => !['t', 'type', 'persona'].includes(k)).map(([k, v]) => k + ': ' + v).join(', ')) + '</td></tr>').join('') + '</tbody></table>' : '<div class="empty">No events yet.</div>') + '</div>' +
    '</main>';
}

/* ---------- Live accessibility audit (renders app screens offscreen and measures them) ---------- */
function hexToRgb(h) { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function lum(rgb) { const a = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
function contrastRatio(a, b) { const l1 = lum(hexToRgb(a)), l2 = lum(hexToRgb(b)); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }

function runAudit() {
  const host = document.getElementById('a11y-audit');
  if (!host) return;
  const saved = { screen: S.screen, flow: S.flow, helper: S.helper.open, modal: S.modal, nudge: S.nudge };
  const box = document.createElement('div');
  box.className = 'phone';
  box.style.cssText = 'position:absolute;left:-5000px;top:0;';
  document.body.appendChild(box);
  const screens = [['Home', 'home'], ['Pay', 'pay'], ['Practice Hub', 'learn'], ['More / settings', 'more'], ['Guided step', 'flowG'], ['Quick form', 'flowQ'], ['Safety settings', 'safety']];
  const results = [];
  S.helper.open = false; S.modal = null; S.nudge = false;
  for (const [label, key] of screens) {
    if (key.startsWith('flow')) { S.screen = 'flow'; S.flow = { task: 'paynow', practice: false, mode: key === 'flowG' ? 'guided' : 'quick', step: 0, data: {}, errors: 0, err: null, stage: 'steps', pause: {}, t0: Date.now() }; }
    else { S.screen = key; S.flow = null; }
    box.innerHTML = '<div class="screen">' + phoneInner() + '</div>';
    const btns = [...box.querySelectorAll('button, [role="switch"], select, input:not([type="hidden"])')].filter(b => b.offsetParent !== null);
    let small44 = 0, small24 = 0, unnamed = 0;
    btns.forEach(b => {
      const r = b.getBoundingClientRect();
      const target = b.matches('input[type="checkbox"]') ? b.parentElement.getBoundingClientRect() : r;
      if (Math.min(target.width, target.height) < 24) small24++;
      else if (Math.min(target.width, target.height) < 44 && !b.classList.contains('why') && !b.classList.contains('pill')) small44++;
      const name = (b.getAttribute('aria-label') || b.textContent || '').trim() || (b.id && box.querySelector('label[for="' + b.id + '"]'));
      if (!name) unnamed++;
    });
    const inputs = [...box.querySelectorAll('input:not([type="checkbox"]), select')];
    const unlabeled = inputs.filter(i => !(i.id && box.querySelector('label[for="' + i.id + '"]')) && !i.getAttribute('aria-label')).length;
    const svgs = [...box.querySelectorAll('svg')].filter(s => s.getAttribute('aria-hidden') !== 'true' && !s.getAttribute('aria-label')).length;
    const h1 = box.querySelector('#screen-title') ? 1 : 0;
    results.push({ label, controls: btns.length, small24, small44, unnamed, unlabeled, svgs, h1 });
  }
  box.remove();
  Object.assign(S, { screen: saved.screen, flow: saved.flow, modal: saved.modal, nudge: saved.nudge }); S.helper.open = saved.helper;
  const pf = ok => ok ? '<span class="pass">Pass</span>' : '<span class="fail">Fix</span>';
  const pairs = [['Body text on white', '#1d1d1f', '#ffffff'], ['Secondary text on white', '#75757c', '#ffffff'], ['White on OCBC red button', '#ffffff', '#e1251b'], ['Red text on white', '#e1251b', '#ffffff'], ['Green banner text', '#0b5532', '#e6f4ec'], ['Blue chip text', '#1d5fbf', '#e8f0fc']];
  host.innerHTML = '<table class="t"><thead><tr><th>Screen</th><th>Controls</th><th>2.5.8 Target size (24px min)</th><th>Our 44px goal</th><th>4.1.2 Every control named</th><th>1.3.1 Inputs labelled</th><th>Icons hidden or labelled</th><th>Page heading</th></tr></thead><tbody>' +
    results.map(r => '<tr><td>' + r.label + '</td><td>' + r.controls + '</td><td>' + pf(r.small24 === 0) + (r.small24 ? ' (' + r.small24 + ')' : '') + '</td><td>' + (r.small44 === 0 ? '<span class="pass">All</span>' : '<span class="muted">' + r.small44 + ' below</span>') + '</td><td>' + pf(r.unnamed === 0) + '</td><td>' + pf(r.unlabeled === 0) + (r.unlabeled ? ' (' + r.unlabeled + ')' : '') + '</td><td>' + pf(r.svgs === 0) + '</td><td>' + pf(r.h1) + '</td></tr>').join('') + '</tbody></table>' +
    '<h3 style="font-size:13px;margin:14px 0 6px">1.4.3 Colour contrast (4.5:1 for normal text)</h3><table class="t"><thead><tr><th>Pair</th><th>Ratio</th><th>Result</th></tr></thead><tbody>' +
    pairs.map(p => { const r = contrastRatio(p[1], p[2]); return '<tr><td><span style="display:inline-block;padding:2px 8px;border-radius:4px;background:' + p[2] + ';color:' + p[1] + ';border:1px solid var(--line)">Aa</span> ' + p[0] + '</td><td>' + r.toFixed(2) + ':1</td><td>' + pf(r >= 4.5) + '</td></tr>'; }).join('') + '</tbody></table>';
}

function purposePanel() {
  const live = k => G.events.filter(e => e.purpose === k);
  const rows = DASH.purpose.map(r => {
    const L = live(r[1]);
    return [r[0], r[2] + L.filter(e => e.type === 'pause_continue' || e.type === 'pause_cancel' || e.type === 'pause_hold' || e.type === 'pause_team').length, r[3] + L.filter(e => e.type === 'pause_continue').length, r[4] + L.filter(e => e.type === 'pause_hold').length, r[5] + L.filter(e => e.type === 'pause_cancel').length, r[6] + L.filter(e => e.type === 'pause_team').length];
  });
  return '<div class="dash-card"><h2>Safety check outcomes, by answer to "What is this payment for?"</h2><p class="lead">The check only appears when the payment shows warning signs. Sample baseline plus this session.</p><table class="t"><thead><tr><th>Answer</th><th>Checks</th><th>Continued</th><th>Held 24h</th><th>Cancelled</th><th>To anti-scam team</th></tr></thead><tbody>' +
    rows.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + r.slice(1).join('</td><td>') + '</td></tr>').join('') + '</tbody></table><p class="lead" style="margin-top:8px"><b>Act on this:</b> nobody who said "government told me to" continued, so the stop message works. Job and shopping answers are where cancellations happen.</p></div>';
}

/* Live Adaptation outcomes for OCBC's designers */
function livePanel() {
  const ls = G.liveStats || { shown: 0, undone: 0, by: {} };
  const base = { fails: 412, idle: 233, backs: 97, taps: 58, ml: 186 };
  const names = { fails: 'Same step needed fixing twice', idle: 'No progress for 15 seconds', backs: 'Went back and forth', taps: 'Quick taps on nothing', ml: 'Struggle model (several small signs)', demo: 'Demo control (this session)' };
  const rows = Object.keys(names).filter(k => base[k] != null || ls.by[k]).map(k => [names[k], (base[k] || 0) + (ls.by[k] || 0)]);
  const shown = 800 + ls.shown, undone = 61 + ls.undone;
  return '<div class="grid2"><div class="dash-card"><h2>Live Adaptation</h2><p class="lead">Steps that simplified themselves when a customer struggled. Only counts and screens, never who.</p>' +
    '<div class="kpis" style="grid-template-columns:repeat(3,1fr)"><div class="kpi"><div class="v">' + shown.toLocaleString() + '</div><div class="l">Steps simplified</div><div class="d">+' + ls.shown + ' this session</div></div><div class="kpi"><div class="v">' + Math.round(undone / shown * 100) + '%</div><div class="l">Customers pressed Undo</div><div class="d">Low means the change helped</div></div><div class="kpi"><div class="v">74%</div><div class="l">Finished the task after</div><div class="d">Sample baseline</div></div></div>' +
    hbars(rows, 'var(--blue)') + '<p class="small"><b>Act on this:</b> the UEN step triggers most often. Show the UEN on bills in a bigger box.</p></div>' +
    '<div class="dash-card"><h2>How the engine decides</h2><p class="lead">Four inputs, approved building blocks only.</p><ol class="small" style="padding-left:18px;line-height:1.6"><li><b>Who you are:</b> Passport choices (language, plain words, larger text, audio, more time)</li><li><b>What you can do:</b> Confidence Map level for that task</li><li><b>How it is going:</b> live signals on this step, never stored</li><li><b>Where you are:</b> app, ATM or hotline</li></ol><p class="small muted">Fees, risks, the safety check and the final confirm step are never changed by the engine.</p></div></div>';
}

/* ==========================================================
   New features (round 2):
   N1 Family Co-pilot, N2 Dialect Mode, N3 Ghost hand,
   N4 Chat banking with voice notes, O1 Payee photos,
   O2 "In real things" amounts, O3 Life Moments, S3 Undo for money
   ========================================================== */

ICONS.hand = '<path d="M9 11V5.5a1.5 1.5 0 013 0V10"/><path d="M12 10V4.5a1.5 1.5 0 013 0V10"/><path d="M15 10V6a1.5 1.5 0 013 0v7c0 4-2.5 7-6.5 7-3 0-4.5-1.5-6-4l-2-3.5a1.5 1.5 0 012.5-1.6L9 13"/>';
ICONS.family = '<circle cx="8" cy="7" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M2.5 20c.6-3.8 2.8-6 5.5-6s4.9 2.2 5.5 6"/><path d="M13.5 15.5c.9-1.3 1.9-2 3-2 2.3 0 4 1.9 4.5 5"/>';
ICONS.wave = '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/>';
ICONS.plate = '<ellipse cx="12" cy="14" rx="9" ry="4"/><path d="M6 13c1-3 3.5-5 6-5s5 2 6 5"/>';
ICONS.heart = '<path d="M12 20s-7-4.5-9-9a4.5 4.5 0 018-3 4.5 4.5 0 018 3c-2 4.5-9 9-9 9z"/>';
ICONS.undo = '<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 010 12h-2" transform="translate(0 -6)"/>';
ICONS.record = '<circle cx="12" cy="12" r="6" fill="currentColor"/>';

/* ---------------- N2 Dialect Mode ---------------- */
const DIALECTS = [
  { code: 'off', name: 'Off' },
  { code: 'hokkien', name: 'Hokkien 福建话' },
  { code: 'cantonese', name: 'Cantonese 广东话' },
  { code: 'teochew', name: 'Teochew 潮州话' }
];
/* Cantonese lines are written in Cantonese. Hokkien and Teochew are spoken
   dialects with no standard script: the meaning is given in Mandarin and the
   team records the real line with a native speaker in the Dialect studio. */
const DIALECT_LINES = [
  { key: 'welcome', meaning: '欢迎使用 OCBC。慢慢来，不用急。', en: 'Welcome to OCBC. Take your time, no rush.', canto: '歡迎使用 OCBC。慢慢嚟，唔使急。' },
  { key: 'who', meaning: '您要把钱转给谁？', en: 'Who do you want to send money to?', canto: '你想俾錢邊個？' },
  { key: 'amount', meaning: '您要转多少钱？', en: 'How much do you want to send?', canto: '你想轉幾多錢？' },
  { key: 'uen', meaning: '请输入公司的 UEN 号码，在账单上可以找到。', en: "Type the business's UEN. You can find it on the bill.", canto: '請輸入公司嘅 UEN 號碼，喺單據上面搵到。' },
  { key: 'check_name', meaning: '请看清楚公司名字对不对。不对就不要付。', en: "Check the company name carefully. If it's wrong, don't pay.", canto: '睇清楚公司個名啱唔啱。唔啱就唔好俾錢。' },
  { key: 'scan', meaning: '把手机对准摊位的二维码。', en: "Point your phone at the stall's QR code.", canto: '將部電話對住檔口個二維碼。' },
  { key: 'step', meaning: '跟着画面，一步一步来。', en: 'Follow the screen, one step at a time.', canto: '跟住個畫面，一步一步嚟。' },
  { key: 'review', meaning: '发送之前再看清楚：给谁，多少钱。', en: 'Before sending, check again: who, and how much.', canto: '送出之前再睇清楚：俾邊個，幾多錢。' },
  { key: 'sent', meaning: '好了，钱已经送出。', en: 'Done. The money has been sent.', canto: '搞掂，錢已經送出咗。' },
  { key: 'careful', meaning: '小心！如果有人在电话里叫您转钱，马上停下来。', en: 'Careful! If someone on the phone tells you to send money, stop now.', canto: '小心！如果有人喺電話叫你轉錢，即刻停手。' },
  { key: 'help', meaning: '需要帮忙，可以按小助手，或请家人帮您看。', en: 'If you need help, tap Helper or ask family to look.', canto: '需要幫手可以撳小助手，或者叫屋企人幫你睇。' }
];
const DL = Object.fromEntries(DIALECT_LINES.map(x => [x.key, x]));

function loadClips() {
  try { G.clips = JSON.parse(localStorage.getItem('ab_dialect_clips') || '{}'); } catch (e) { G.clips = {}; }
}
function saveClips() {
  try { localStorage.setItem('ab_dialect_clips', JSON.stringify(G.clips)); } catch (e) { toast('Could not save the recording in this browser. It will last until you close the page.'); }
}
function dialectName(code) { return (DIALECTS.find(d => d.code === code) || {}).name || code; }

function dialectKeyForStep(step) {
  if (!step) return 'step';
  return { contact: 'who', amount: 'amount', uen: 'uen', namecheck: 'check_name', scanqr: 'scan' }[step.type] || 'step';
}
let dialectAudio = null;
function playDialect(key, quiet) {
  const d = S.dialect;
  if (!d || d === 'off') return;
  const line = DL[key] || DL.step;
  const clip = G.clips && G.clips[d] && G.clips[d][key];
  stopSpeak();
  if (dialectAudio) { try { dialectAudio.pause(); } catch (e) { /* ignore */ } }
  if (clip) {
    dialectAudio = new Audio(clip);
    dialectAudio.play().catch(() => {});
    track('dialect_play', { dialect: d, key, source: 'recording' });
    return;
  }
  // No recording yet: honest placeholder voice
  if (d === 'cantonese') {
    try {
      const u = new SpeechSynthesisUtterance(line.canto); u.lang = 'zh-HK'; u.rate = 0.9; if (typeof abVoice === 'function') { const vv = abVoice(u.lang); if (vv) u.voice = vv; }
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  } else {
    try {
      const u = new SpeechSynthesisUtterance(line.meaning); u.lang = 'zh-CN'; u.rate = 0.9; if (typeof abVoice === 'function') { const vv = abVoice(u.lang); if (vv) u.voice = vv; }
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
    if (!quiet) toast('Placeholder voice in Mandarin: no ' + dialectName(d).split(' ')[0] + ' recording yet. Record one in Bank insights > Dialect studio.');
  }
  track('dialect_play', { dialect: d, key, source: 'placeholder' });
}
function dialectBtn(key) {
  if (!S.dialect || S.dialect === 'off') return '';
  return '<button class="pill" data-a="playDialect" data-v="' + key + '" style="margin-top:8px">' + ic('speaker', 14) + ' ' + esc(dialectName(S.dialect).split(' ')[0]) + '</button>';
}

/* Dialect studio (in Bank insights): record real lines with native speakers */
let recorder = null, recChunks = [];
function viewDialectStudio() {
  const rows = DIALECT_LINES.map(l => {
    const cells = ['hokkien', 'cantonese', 'teochew'].map(d => {
      const has = G.clips && G.clips[d] && G.clips[d][l.key];
      const recording = G.recording === d + ':' + l.key;
      return '<td>' + (recording ? '<button class="btn primary" style="min-height:36px;padding:0 10px" data-a="recStop">Stop</button>'
        : '<button class="chip-btn" data-a="recStart" data-v="' + d + ':' + l.key + '">' + ic('record', 12) + ' Record</button>') +
        (has ? ' <button class="chip-btn" data-a="recPlay" data-v="' + d + ':' + l.key + '">Play</button> <button class="chip-btn" data-a="recDelete" data-v="' + d + ':' + l.key + '">Delete</button>' : '') + '</td>';
    }).join('');
    return '<tr><td><b>' + esc(l.en) + '</b><div class="muted">' + esc(l.meaning) + '</div><div class="muted">粤: ' + esc(l.canto) + '</div></td>' + cells + '</tr>';
  }).join('');
  const count = ['hokkien', 'cantonese', 'teochew'].reduce((n, d) => n + Object.keys((G.clips || {})[d] || {}).length, 0);
  return '<div class="dash-card"><h2>Dialect studio</h2><p class="lead">Record each line with a native speaker (a grandparent, a relative, a volunteer). Recordings play in Dialect Mode instead of the placeholder voice and are saved in this browser. ' + count + ' of ' + DIALECT_LINES.length * 3 + ' lines recorded.</p>' +
    '<table class="t"><thead><tr><th>Line (English / meaning)</th><th>Hokkien</th><th>Cantonese</th><th>Teochew</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

/* ---------------- O1 Payee photos ---------------- */
function hashColor(s) {
  let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cols = ['#8a4fbf', '#1d5fbf', '#0f7b45', '#b8552a', '#9c2f6b', '#2d7a8a'];
  return cols[h % cols.length];
}
function avatar(name, size) {
  const s = size || 40;
  const photo = S.photos && S.photos[name];
  if (photo) return '<img src="' + photo + '" alt="" width="' + s + '" height="' + s + '" style="border-radius:50%;object-fit:cover;flex:none">';
  const col = hashColor(name);
  const init = String(name).split(' (')[0].split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return '<svg aria-hidden="true" width="' + s + '" height="' + s + '" viewBox="0 0 40 40" style="flex:none"><circle cx="20" cy="20" r="20" fill="' + col + '"/><circle cx="20" cy="16" r="7" fill="rgba(255,255,255,.35)"/><path d="M7 35c2-7 7-10 13-10s11 3 13 10" fill="rgba(255,255,255,.35)"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="inherit">' + esc(init) + '</text></svg>';
}
function silhouette(size) {
  const s = size || 40;
  return '<svg aria-hidden="true" width="' + s + '" height="' + s + '" viewBox="0 0 40 40" style="flex:none"><circle cx="20" cy="20" r="20" fill="#c9c9cf"/><circle cx="20" cy="15" r="6.5" fill="#fff"/><path d="M8 33c2-6.5 6.5-9.5 12-9.5s10 3 12 9.5" fill="#fff"/></svg>';
}
function viewPayees() {
  return header('My payees') + '<div class="pad"><p class="muted" style="margin-top:0">Add a photo to people you pay often. When you pay them, you will see their face. Anyone without a photo shows as "Someone new", so a stranger stands out.</p><p class="small" style="margin-top:0"><b>Photos stay on this phone.</b> Nothing is uploaded to OCBC, and only you can add one, after the payee is saved.</p>' +
    '<div class="list">' + S.contacts.map((c, i) => '<div class="li">' + avatar(c.name, 44) + '<span class="grow"><span class="t1">' + esc(c.name) + '</span><br><span class="t2">' + esc(c.mobile) + '</span></span>' +
      '<label class="btn secondary" style="min-height:40px;cursor:pointer">' + (S.photos[c.name] ? 'Change photo' : 'Add photo') + '<input type="file" accept="image/*" class="sr-only" data-photo="' + esc(c.name) + '"></label></div>').join('') + '</div>' +
    '<div class="card row">' + silhouette(44) + '<div><b>Someone new</b><div class="small muted">How a payee you have never paid before looks.</div></div></div></div>';
}

/* ---------------- O2 "In real things" amounts ---------------- */
function realThings(amount) {
  if (!S.realThings) return '';
  const a = Number(amount);
  if (!a || a <= 0) return '';
  const zh = S.settings.lang === 'zh';
  let text, n, unit;
  const U = REAL_UNITS.find(x => x.id === S.realUnit) || REAL_UNITS[0];
  if (U.id !== 'food') {
    n = Math.max(1, Math.round(a / U.price));
    text = 'About ' + n.toLocaleString() + ' ' + (n > 1 ? U.plural : U.one) + ' (' + U.note + ')';
    const shownU = Math.min(n, 20);
    return '<div class="words" style="margin-top:6px"><div>' + esc(text) + '</div><div style="display:flex;flex-wrap:wrap;gap:1px;margin-top:4px" aria-hidden="true">' + Array.from({ length: shownU }, () => '<span style="color:var(--amber)">' + ic(U.icon, 16) + '</span>').join('') + (n > 20 ? '<b style="margin-left:4px">+' + (n - 20).toLocaleString() + ' more</b>' : '') + '</div>' +
      (a >= 2000 ? '<div style="color:#8a120c;font-weight:700;margin-top:4px">That is a lot of money. Check the amount again.</div>' : '') + '</div>';
  }
  if (a < 5) { n = Math.max(1, Math.round(a / 1.5)); unit = 'kopi'; text = zh ? '大约 ' + n + ' 杯咖啡（每杯 1.50 新元）' : 'About ' + n + ' cup' + (n > 1 ? 's' : '') + ' of kopi (S$1.50 each)'; }
  else { n = Math.round(a / 5); unit = 'plate'; text = zh ? '大约 ' + n.toLocaleString() + ' 盘鸡饭（每盘 5 新元）' : 'About ' + n.toLocaleString() + ' plates of chicken rice (S$5 a plate)'; }
  const shown = Math.min(n, 20);
  const icons = Array.from({ length: shown }, () => '<span style="color:var(--amber)">' + ic(unit === 'kopi' ? 'wallet' : 'plate', 16) + '</span>').join('');
  return '<div class="words" style="margin-top:6px"><div>' + esc(text) + '</div><div style="display:flex;flex-wrap:wrap;gap:1px;margin-top:4px" aria-hidden="true">' + icons + (n > 20 ? '<b style="margin-left:4px">+' + (n - 20).toLocaleString() + ' more</b>' : '') + '</div>' +
    (n >= 400 ? '<div style="color:#8a120c;font-weight:700;margin-top:4px">' + (zh ? '这是很大的一笔钱，请再检查金额。' : 'That is a lot of money. Check the amount again.') + '</div>' : '') + '</div>';
}

/* ---------------- O3 Life Moments ---------------- */
const LIFE = [
  { id: 'firstjob', icon: 'card', title: 'Starting my first job', desc: 'Salary, bills and saving for the first time.',
    offers: [{ label: 'Practise setting up GIRO for bills', a: 'startPractice', v: 'giro' }, { label: 'Practise paying a business by UEN', a: 'startPractice', v: 'uen' }, { label: 'Learn about Money Lock', a: 'helperAsk', v: 'what is money lock' }] },
  { id: 'retiring', icon: 'heart', title: 'Stopping work', desc: 'Keeping savings safe and bills simple.',
    offers: [{ label: 'Lock part of my savings with Money Lock', a: 'startTask', v: 'moneylock' }, { label: 'Let regular bills pay themselves (GIRO)', a: 'startPractice', v: 'giro' }, { label: 'Hear steps in my dialect', a: 'go', v: 'more' }] },
  { id: 'caring', icon: 'family', title: 'Helping someone else with money', desc: 'Paying or managing money for someone you look after.',
    offers: [{ label: 'Set up Family Co-pilot', a: 'copilotStart', v: '' }, { label: 'Add a trusted contact', a: 'go', v: 'safety' }, { label: 'Show my parent the Practice Hub', a: 'go', v: 'learn' }] },
  { id: 'abroad', icon: 'plane', title: 'Studying or working overseas', desc: 'Sending and receiving money across borders.',
    offers: [{ label: 'Practise an overseas transfer', a: 'startPractice', v: 'overseas' }, { label: 'What is a SWIFT code?', a: 'helperAsk', v: 'what is swift' }] },
  { id: 'baby', icon: 'users', title: 'New regular bills', desc: 'Bills like childcare, rent or insurance.',
    offers: [{ label: 'Practise paying childcare by UEN', a: 'startPractice', v: 'uen' }, { label: 'Set up GIRO for insurance', a: 'startPractice', v: 'giro' }] },
  { id: 'loss', icon: 'heart', title: 'Sorting out a family member\'s accounts', desc: 'We will go slowly and keep things simple.',
    offers: [{ label: 'Talk to a person, gently and without rushing', a: 'helperAsk', v: '__person' }, { label: 'Turn on simple wording', a: 'lifeSimple', v: '' }] }
];
function viewLife() {
  const cur = S.lifeMoment;
  return header('Life Moments') + '<div class="pad"><p class="muted" style="margin-top:0">Tell us about a change in your life, only if you want to. We use it to suggest helpful tasks. Nothing is hidden or taken away, and you can remove it anytime.</p>' +
    LIFE.map(m => '<button class="card scenario" style="width:100%;text-align:left;border:' + (cur === m.id ? '2px solid var(--red)' : '0') + '" data-a="setLife" data-v="' + m.id + '" aria-pressed="' + (cur === m.id) + '"><span class="ic">' + ic(m.icon) + '</span><span style="flex:1"><h3>' + esc(m.title) + '</h3><span class="small muted">' + esc(m.desc) + '</span></span></button>').join('') +
    (cur ? '<button class="btn ghost block" data-a="setLife" data-v="">Remove my life moment</button>' : '') +
    '<p class="small muted">Only used to suggest tasks in the app. Not shared with staff unless you add it to your Passport.</p></div>';
}
function lifeCard() {
  const m = LIFE.find(x => x.id === S.lifeMoment);
  if (!m) return '';
  return '<div class="card" style="border-left:4px solid var(--blue)"><div class="between"><h2 class="row" style="margin:0">' + ic(m.icon) + ' ' + t('for_moment') + ' ' + esc(m.title) + '</h2></div>' +
    '<div class="small muted" style="margin:4px 0 8px">You told us this. <button class="linkbtn" style="padding:0 4px" data-a="go" data-v="life">Change</button></div>' +
    m.offers.map(o => '<button class="pill" style="margin:0 6px 6px 0" data-a="' + o.a + '" data-v="' + esc(o.v) + '">' + esc(o.label) + '</button>').join('') + '</div>';
}

/* ---------------- S3 Undo for money ---------------- */
let undoTicker = null;
function undoApplies(f) {
  if (!['paynow', 'newpayee', 'overseas'].includes(f.task)) return false; // people only: never businesses, shops or bills
  return S.undoMode === 'all' || (S.undoMode === 'new' && isNewPayee(f));
}
function fmtLeft(n) { return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); }
function pendingLeft(p) { return Math.max(0, Math.ceil((p.until - Date.now()) / 1000)); }
function startUndoTicker() {
  if (undoTicker) return;
  undoTicker = setInterval(() => {
    let finalized = false;
    for (const p of S.pending.slice()) {
      const left = pendingLeft(p);
      document.querySelectorAll('[data-countdown="' + p.id + '"]').forEach(el => { el.textContent = fmtLeft(left); });
      if (left <= 0) {
        S.pending = S.pending.filter(x => x !== p);
        S.txns.unshift({ d: 'Today', what: p.what, amt: -(p.amount + p.fee) });
        threadSettle(p.id, 'sent');
        addLog('Sent: ' + money(p.amount) + ' to ' + p.to, 'Your 60-second undo window ended', 'event');
        finalized = true;
      }
    }
    if (!S.pending.length) { clearInterval(undoTicker); undoTicker = null; }
    if (finalized) render();
  }, 1000);
}
function pendingCard() {
  if (!S.pending.length) return '';
  return S.pending.map(p => '<div class="card row" style="border-left:4px solid var(--amber)"><span style="color:var(--amber)">' + ic('clock') + '</span><div style="flex:1"><b>Sending ' + money(p.amount) + ' to ' + esc(p.to) + '</b><div class="small muted">You can still undo for <span data-countdown="' + p.id + '">' + fmtLeft(pendingLeft(p)) + '</span></div></div><button class="btn dark" data-a="undoSend" data-v="' + p.id + '">' + t('undo') + '</button></div>').join('');
}

/* ---------------- N3 Ghost hand ---------------- */
function ghostTargets(step) {
  const next = { sel: '[data-a="flowNext"]', cap: 'Then tap ' + t('next') };
  switch (step.type) {
    case 'contact': return [{ sel: '[data-a="pick"][data-v^="to|"]', cap: 'Tap the person you want to pay' }, next];
    case 'amount': return [{ sel: '.input.amount', cap: 'Tap here and type the amount' }, { sel: '.words', cap: 'Check the amount in words' }, next];
    case 'uen': return [{ sel: '#f-uen', cap: 'Type the UEN from your bill' }, next];
    case 'namecheck': return [{ sel: '[data-v="check|yes"]', cap: 'If the name is right, tap Yes' }, next];
    case 'bank': case 'country': case 'org': return [{ sel: '.tile', cap: 'Tap one option' }, next];
    case 'ack': return [{ sel: '[data-a="ack"]', cap: 'Tick to say you understand' }, next];
    case 'scanqr': return [{ sel: '.viewfinder .frame', cap: 'Point the camera at the code' }, { sel: '[data-a="doScan"]', cap: 'Then tap Scan' }];
    default: return [{ sel: '.content .input', cap: 'Tap here and type' }, next];
  }
}
let ghostRun = 0;
function runGhost() {
  const step = S.flow && S.flow.stage === 'steps' ? curStep() : null;
  const screen = document.querySelector('#cust-phone .screen');
  if (!step || !screen) return;
  const run = ++ghostRun;
  track('ghost_hand', { task: S.flow.task, step: step.id });
  const targets = ghostTargets(step).map(x => ({ el: screen.querySelector(x.sel), cap: x.cap })).filter(x => x.el);
  let hand = screen.querySelector('.ghosthand'); if (hand) hand.remove();
  hand = document.createElement('div');
  hand.className = 'ghosthand'; hand.setAttribute('aria-live', 'polite');
  hand.innerHTML = '<span class="ghost-hand">' + ic('hand', 46) + '</span><span class="ghost-cap"></span>';
  screen.appendChild(hand);
  const sr = screen.getBoundingClientRect();
  const reduce = S.settings.reduceMotion;
  let i = 0;
  const stepOnce = () => {
    if (run !== ghostRun || !document.body.contains(hand)) return;
    if (i >= targets.length) { hand.remove(); return; }
    const tg = targets[i++];
    scrollWithin(tg.el);
    setTimeout(() => {
      const r = tg.el.getBoundingClientRect();
      hand.style.left = (r.left - sr.left + Math.min(r.width / 2, 60)) + 'px';
      hand.style.top = (r.top - sr.top + r.height / 2) + 'px';
      const cap = hand.querySelector('.ghost-cap'); cap.textContent = tg.cap;
      const hx = r.left - sr.left + Math.min(r.width / 2, 60);
      cap.style.left = (Math.max(8, Math.min(sr.width - 228, hx - 110)) - hx) + 'px';
      tg.el.classList.add('pointed');
      setTimeout(() => { hand.classList.add('tap'); }, reduce ? 0 : 650);
      setTimeout(() => { hand.classList.remove('tap'); tg.el.classList.remove('pointed'); stepOnce(); }, reduce ? 2200 : 1900);
    }, reduce ? 0 : 350);
  };
  stepOnce();
}

/* ---------------- N4 Chat banking + voice notes ---------------- */
function answerLabel(step) {
  const d = S.flow.data, v = d[step.id];
  switch (step.type) {
    case 'contact': return String(v).startsWith('c:') ? S.contacts[Number(String(v).slice(2))].name : String(v || '').replace('mobile:', '');
    case 'amount': return money(d[step.id]);
    case 'namecheck': return 'Yes, this is right';
    case 'ack': return 'I understand';
    case 'country': return (COUNTRIES.find(c => c.code === v) || {}).name || v;
    case 'scanqr': return MERCHANT.name;
    default: return v || '-';
  }
}
function viewFlowChat() {
  const f = S.flow, steps = flowSteps(), step = steps[f.step];
  let h = '<div class="chat" aria-live="polite">';
  for (let i = 0; i < f.step; i++) {
    h += '<div class="msg bot">' + esc(tx(steps[i].q)) + '</div><div class="msg me">' + esc(answerLabel(steps[i])) + '</div>';
  }
  h += '<div class="msg bot"><b>' + esc(tx(step.q)) + '</b><div class="small" style="margin-top:4px;color:var(--ink-2)">' + esc(tx(step.x.simple)) + '</div>' + dialectBtn(dialectKeyForStep(step)) + '</div>';
  h += '</div><div class="pad" style="padding-top:0"><div class="card" style="margin-left:24px">' + (step.type === 'scanqr' ? scanView() : stepInput(step)) + errorBox() + '</div>' +
    '<div class="row" style="justify-content:flex-end"><button class="btn secondary" data-a="voiceNote" data-v="flow">' + ic('mic', 18) + ' Voice note</button></div></div>';
  return h;
}

/* Chat banking home screen: "talk to your account" */
function viewChatBank() {
  const msgs = S.chatBank;
  return header('Chat with your account') + '<div class="chat" aria-live="polite">' +
    msgs.map(m => m.who === 'me' ? '<div class="msg me">' + (m.voice ? ic('wave', 16) + ' <i>Voice note:</i> ' : '') + esc(m.text) + '</div>'
      : '<div class="msg bot">' + esc(m.text) + (m.actions ? '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px">' + m.actions.map(a => '<button class="pill" data-a="' + a.a + '" data-v="' + esc(a.v) + '">' + esc(a.label) + '</button>').join('') + '</div>' : '') + '</div>').join('') +
    '</div><form class="sheet-input" data-a="chatBankSubmit" style="position:sticky;bottom:0"><label class="sr-only" for="cb-q">Type what you want to do</label><input id="cb-q" placeholder="e.g. Send ' + esc(S.contacts[0].name.split(' (')[0]) + ' $20" autocomplete="off">' +
    '<button type="button" class="iconbtn" data-a="voiceNote" data-v="bank" aria-label="Send a voice note" style="background:var(--bg)">' + ic('mic') + '</button>' +
    '<button type="submit" class="iconbtn" aria-label="' + t('send') + '" style="background:var(--red);color:#fff">' + ic('arrow') + '</button></form>';
}
function chatBankGreeting() {
  const first = S.contacts[0].name.split(' (')[0];
  return { who: 'bot', text: 'Hi ' + S.short + '. Tell me what you want to do, in your own words. Type it or send a voice note.', actions: [{ label: 'Send ' + first + ' $20', a: 'chatBankSay', v: 'Send ' + first + ' $20' }, { label: 'How much do I have?', a: 'chatBankSay', v: 'How much do I have?' }, { label: 'Pay my tuition bill', a: 'chatBankSay', v: 'Pay my tuition bill' }, { label: 'Lock $1000 of my savings', a: 'chatBankSay', v: 'Lock $1000 of my savings' }] };
}
function parseIntent(text) {
  const s = String(text).toLowerCase();
  const amtM = s.replace(/,/g, '').match(/(\d+(?:\.\d{1,2})?)/);
  const amount = amtM ? amtM[1] : parseSpokenAmount(s);
  if (/balance|how much (do i|money)|余额|baki/.test(s)) return { kind: 'balance' };
  if (/lock|money lock|锁/.test(s)) return { kind: 'task', task: 'moneylock', data: amount ? { amount } : {} };
  if (/overseas|abroad|india|malaysia|china|philippines|indonesia|海外/.test(s)) return { kind: 'task', task: 'overseas', data: amount ? { amount } : {} };
  if (/uen|bill|tuition|invoice|business|账单/.test(s)) return { kind: 'task', task: 'uen', data: amount ? { amount } : {} };
  if (/giro/.test(s)) return { kind: 'task', task: 'giro', data: {} };
  if (/scan|qr|hawker/.test(s)) return { kind: 'task', task: 'scan', data: {} };
  if (/send|pay|transfer|give|转|给|hantar/.test(s)) {
    const idx = S.contacts.findIndex(c => s.includes(c.name.split(' (')[0].toLowerCase()) || s.includes(c.name.split(' ')[0].toLowerCase()));
    const data = {};
    if (idx >= 0) data.to = 'c:' + idx;
    if (amount) data.amount = amount;
    return { kind: 'task', task: 'paynow', data, unknownName: idx < 0 };
  }
  return { kind: 'unknown' };
}
function chatBankHandle(text, voice) {
  if (!String(text).trim()) return;
  S.chatBank.push({ who: 'me', text, voice: !!voice });
  track('chat_intent', { text: text.slice(0, 40), voice: !!voice });
  const it = parseIntent(text);
  if (it.kind === 'balance') { S.chatBank.push({ who: 'bot', text: 'You have ' + money(S.balance) + ' available in your 360 Account.' }); return; }
  if (it.kind === 'unknown') { S.chatBank.push({ who: 'bot', text: 'I can send money, pay a bill, lock savings or check your balance. Try "Send Mei Ling $20".' }); return; }
  if (it.unknownName) { S.chatBank.push({ who: 'bot', text: "I couldn't find that person in your contacts. Who should I send it to?", actions: S.contacts.map((c, i) => ({ label: c.name.split(' (')[0], a: 'chatBankSay', v: 'Send ' + c.name.split(' (')[0] + ' ' + (it.data.amount ? '$' + it.data.amount : '') })) }); return; }
  S.chatBank.push({ who: 'bot', text: 'OK. Let me set that up. You will check everything before anything is sent.' });
  const prevMode = S.settings.mode;
  startFlow(it.task, false);
  Object.assign(S.flow.data, it.data);
  S.flow.fromChat = true;
  if (prevMode !== 'chat') { S.settings.mode = 'chat'; S.flow.restoreMode = prevMode; }
  const bad = goToFirstInvalid();
  if (bad) { S.flow.mode = 'guided'; S.flow.step = bad.i; } else S.flow.stage = 'review';
  addLog('Chat banking: "' + text.slice(0, 40) + '"', 'You asked in your own words; the app filled in what it understood for you to check', 'you');
}
function voiceNote(target) {
  toast(t('listening'));
  const ok = listen(text => {
    if (target === 'bank') chatBankHandle(text, true);
    else {
      const st = curStep(); const d = S.flow.data;
      if (st.type === 'amount') d[st.id] = parseSpokenAmount(text);
      else if (st.type === 'contact') { const it = parseIntent('send ' + text); if (it.data && it.data.to) d.to = it.data.to; }
      else d[st.id] = text;
      S.flow.err = null;
    }
    render();
  }, success => { if (!success) { toast('Voice notes need Chrome with a microphone and internet. You can type instead.'); render(); } });
  if (!ok) toast('Voice notes need Chrome with a microphone and internet. You can type instead.');
}

/* ---------------- N1 Family Co-pilot ---------------- */
function viewCopilotSetup() {
  const opts = S.contacts.map((c, i) => c.family
    ? '<button class="tile row" data-a="copilotInvite" data-v="' + i + '" style="width:100%;margin-bottom:8px;gap:12px">' + avatar(c.name, 40) + '<span>' + esc(c.name) + '<small>Saved as family ' + esc(c.since || '') + ' ago</small></span></button>'
    : '<div class="tile row" aria-disabled="true" style="width:100%;margin-bottom:8px;gap:12px;opacity:.55">' + avatar(c.name, 40) + '<span>' + esc(c.name) + '<small>Not saved as family' + (c.since ? ', added ' + esc(c.since) + ' ago' : '') + '. Needs 7 days as family.</small></span></div>').join('');
  return header('Ask family to help') + '<div class="pad"><div class="banner info">' + ic('family') + '<div><b>Family Co-pilot</b>Someone you trust sees your screen live and can point to buttons or send you a message. They can never tap, type, approve anything or see your balance. You can end it anytime.</div></div>' +
    '<h2 style="font-size:calc(16px*var(--scale))">Who should help you?</h2>' + opts +
    '<div class="banner warn">' + ic('shield') + '<div><b>Kept safe from scammers</b>Only you can start a session, only with someone saved as family for at least 7 days. They join with their own OCBC app or Singpass. During a safety check their view pauses, so you answer on your own. OCBC will never ask you to share your screen.</div></div></div>';
}
function copilotLive() { return G.copilot && G.copilot.persona === S.personaId && G.copilot.status === 'live'; }
function copilotBanner() {
  if (!G.copilot || G.copilot.persona !== S.personaId) return '';
  const c = G.copilot;
  let h = '<div class="copilot-bar" role="status">' + ic('family', 18) + '<span style="flex:1"><b>' + esc(c.name) + '</b> ' + (c.status === 'live' ? 'is helping you' + (c.via ? ' (verified with ' + c.via + ')' : '') + '. Sees your screen, cannot tap.' : 'has been invited. Waiting for them to verify and join...') + '</span><button class="btn" style="min-height:34px;padding:0 12px;background:#fff;color:var(--ink)" data-a="copilotEnd">End</button></div>';
  if (c.lastMsg && c.status === 'live' && !copilotConfirmPause()) h += '<div class="copilot-msg" role="status">' + avatar(c.name, 28) + '<span style="flex:1"><b>' + esc(c.name.split(' (')[0]) + ':</b> ' + esc(c.lastMsg) + '</span><button class="iconbtn" style="width:36px;height:36px" data-a="copilotMsgClose" aria-label="Dismiss message">' + ic('close', 16) + '</button></div>';
  return h;
}
/* Build 4.2: Family Co-pilot scam fixes.
   1. On real payment screens the helper can only send preset messages, so nobody can type instructions such as "ignore the warning, just send".
   2. The helper's view pauses on the check screen and slide to pay, as well as the safety check, so the customer confirms on their own.
   Practice payments use pretend money, so free messages and the full view stay on there. */
const COPILOT_QUICK = ['Tap the button I highlighted', "You're doing well, take your time", "Wait, don't send yet", 'Check the name carefully'];
function copilotOnPayment() { return S.screen === 'flow' && !!S.flow && !S.flow.practice; }
function copilotConfirmPause() { return copilotOnPayment() && S.flow.stage === 'review'; }
function viewFamilyPanel() {
  const c = G.copilot;
  const quick = COPILOT_QUICK, presetOnly = copilotOnPayment();
  return '<section class="panel" aria-labelledby="fam-h"><h2 id="fam-h">' + esc(c.name.split(' (')[0]) + "'s phone: family view</h2>" +
    (c.status !== 'live' ? '<div class="note"><b>' + esc(c.name.split(' (')[0]) + ' opens the invite link.</b> To join, they must prove who they are. Demo steps:</div><div class="ctl-row"><button class="chip-btn" data-a="copilotJoin" data-v="singpass">Log in with Singpass (demo)</button><button class="chip-btn" data-a="copilotJoin" data-v="app">Open in my own OCBC app (demo)</button></div><p class="note">The link expires in 10 minutes and only works for ' + esc(c.name.split(' (')[0]) + '. If the name from Singpass does not match the family member ' + esc(S.short) + ' chose, the session does not start.</p>'
      : S.modal === 'pause' ? '<div class="note" style="background:var(--amber-tint);padding:12px;border-radius:10px"><b>Paused.</b> ' + esc(S.short) + ' is answering a safety check on their own. The view comes back when they finish.</div>'
      : copilotConfirmPause() ? '<div class="note" style="background:var(--amber-tint);padding:12px;border-radius:10px"><b>Paused.</b> ' + esc(S.short) + ' is checking and confirming the payment on their own. You cannot see this screen or send messages until they finish.</div>'
      : '<p class="note" style="margin-top:0">Read-only mirror of ' + esc(S.short) + "'s screen. Balance and account numbers are blurred. Click any button below to point at it on " + esc(S.short) + "'s phone.</p>" +
      '<div class="mirror-wrap"><div class="phone mirror-phone ' + (S.settings.contrast ? 'hc' : '') + '" id="family-phone"><div class="screen mirror">' + phoneInner() + '</div></div></div>' +
      '<div class="ctl-row">' + quick.map(q => '<button class="chip-btn" data-a="copilotSay" data-v="' + esc(q) + '">' + esc(q) + '</button>').join('') + '</div>' +
      (presetOnly ? '<p class="note" style="margin-top:8px"><b>Payment screen: preset messages only.</b> Typing is turned off while money is involved, so nobody can type instructions to rush or hide a payment.</p>'
        : '<form data-a="copilotSayForm" class="row" style="margin-top:8px"><label class="sr-only" for="fam-say">Message</label><input id="fam-say" class="input" style="min-height:40px" placeholder="Type a message"><button class="btn dark" style="min-height:40px" type="submit">Send</button></form>')) + '</section>';
}
function scrollWithin(el) {
  const box = el.closest('.content, .sheet-body');
  if (!box) return;
  const br = box.getBoundingClientRect(), er = el.getBoundingClientRect();
  const scale = br.height / box.clientHeight || 1;
  box.scrollTop += (er.top - br.top) / scale - box.clientHeight / 2 + (er.height / scale) / 2;
}
function syncMirrorScroll() {
  const c = document.querySelector('#cust-phone .content'), m = document.querySelector('#family-phone .content');
  if (c && m) m.scrollTop = c.scrollTop;
}
function renderMirror() {
  const fp = document.querySelector('#family-phone .screen');
  if (!fp || !copilotLive()) return;
  fp.innerHTML = phoneInner();
  prepMirror(fp);
  syncMirrorScroll();
}
function prepMirror(root) {
  root.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  root.querySelectorAll('input, select, textarea').forEach(el => { el.readOnly = true; el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); });
  root.querySelectorAll('button, label').forEach(el => { el.tabIndex = -1; });
}
function applyPointer() {
  document.querySelectorAll('.pointed-family').forEach(el => el.classList.remove('pointed-family'));
  const c = G.copilot;
  if (!c || !c.point || c.persona !== S.personaId) return;
  const sel = '[data-a="' + c.point.a + '"]' + (c.point.v != null && c.point.v !== '' ? '[data-v="' + CSS.escape(c.point.v) + '"]' : '');
  ['#cust-phone', '#family-phone'].forEach(root => {
    const els = document.querySelectorAll(root + ' ' + sel);
    const el = els[c.point.idx] || els[0];
    if (el) { el.classList.add('pointed-family'); scrollWithin(el); }
  });
}

/* ==========================================================
   Merged build: pieces brought in from the team's design
   prototype and fixes from the OCBC judge review.
   - "Why am I seeing this?" and the removable adaptations list
   - Setup card for existing customers
   - Level-based guidance helpers
   - Help code for customers who phone the hotline
   - Slim staff hand-off helpers (journey timeline, highlight ring)
   - "One app, four experiences" board
   ========================================================== */

G.helpCodes = G.helpCodes || {};

function serveLabel(k) {
  const extra = { slow: 'Please speak slowly', readout: 'Read things out to me' };
  return extra[k] || t('serve_' + k);
}
function firstSentence(s) {
  const m = String(s || '').match(/^.*?[.。!?](\s|$)/);
  return (m ? m[0] : String(s || '')).trim();
}
/* "New to me" teaches (full explanations), "With some help" reminds (one-line tip),
   and the customer can switch to full guidance on any step. */
function isFullGuidance() {
  const f = S.flow;
  return !!(f.practice || f.full || S.settings.mode === 'text' || engineCompose(f.task).explain === 'full');
}
function overBalance(v, key) {
  if (key !== 'amount' || !S.flow || S.flow.practice) return '';
  const a = Number(v);
  if (a > S.balance) return '<div class="small" style="color:#8a120c;font-weight:700;margin-top:4px">That is more than your available balance of ' + money(S.balance) + '.</div>';
  return '';
}

/* ---------- "Why am I seeing this?" ---------- */
function suggestionWhy(s) {
  const v = { task: taskName(s.task), n: s.n };
  if (['quick', 'full', 'help', 'practiced'].includes(s.kind)) return t('why_' + s.kind, v);
  return 'Based only on how this task went.';
}

/* ---------- Setup card for existing customers (never forced) ---------- */
function setupCard() {
  if (!S.setupCard) return '';
  return '<div class="card" style="border-left:4px solid var(--blue)"><div class="row" style="align-items:flex-start"><span style="color:var(--blue)">' + ic('sparkle') + '</span><div style="flex:1"><div style="font-weight:700">Set up the app for you (1 minute)</div><div class="small muted" style="margin:2px 0 8px">Tell us which tasks you know well and which are new. We never ask your age, health or income.</div>' +
    '<div class="row" style="flex-wrap:wrap"><button class="btn secondary" data-a="redoOnboarding">Set up</button><button class="btn ghost" data-a="setupCardClose">No thanks</button></div></div></div></div>';
}

/* ---------- Your adaptations: one place to see and undo everything ---------- */
function viewAdaptations() {
  const groups = [
    ['From how you use the app', a => a.src === 'suggest'],
    ['Your choices', a => ['you', 'setup', 'helper'].includes(a.src)],
    ['Saved earlier', a => a.src === 'saved']
  ];
  const row = a => '<div class="li"><span class="ic">' + ic(a.src === 'suggest' ? 'sparkle' : a.key.startsWith('safety') ? 'shield' : 'user') + '</span><span class="grow"><span class="t1">' + esc(a.label) + '</span><br><span class="t2">' + esc(ADAPT_SRC[a.src] || a.src) + ' · ' + esc(a.when) + '</span></span>' +
    (a.undo && a.undo.t !== 'passportAll' ? '<button class="btn secondary" style="min-height:40px" data-a="removeAdapt" data-v="' + esc(a.key) + '">Remove</button>' : '<button class="btn secondary" style="min-height:40px" data-a="go" data-v="passport">Change</button>') + '</div>';
  let h = header('Your adaptations') + '<div class="pad"><p class="muted" style="margin-top:0">Everything the app has changed for you, where it came from, and a Remove button that puts it back. Nothing here was guessed about you.</p>';
  if (!S.adapt.length) h += '<div class="empty">Nothing adapted yet. The app looks the same as for everyone.</div>';
  groups.forEach(([title, fn]) => {
    const items = S.adapt.filter(fn);
    if (items.length) h += '<h2 style="font-size:calc(15px*var(--scale));margin:14px 0 6px">' + esc(title) + '</h2><div class="list">' + items.map(row).join('') + '</div>';
  });
  h += '<p class="small muted">Safety checks on risky payments are the same for everyone and are not on this list.</p>';
  return h + '<button class="btn ghost block" data-a="go" data-v="log">See the full history</button></div>';
}

/* ---------- Help code: for customers who phone the hotline instead ---------- */
function makeHelpCode() {
  let code;
  do { code = String(1000 + Math.floor(Math.random() * 9000)); } while (G.helpCodes[code]);
  const ctx = helperContext();
  const en = inEnglish(() => ({ where: helperContext().label, summary: handoffSummary(), passport: passportChips(), journey: journeyFor(S.personaId) }));
  G.helpCodes[code] = Object.assign({ code, persona: S.personaId, customer: S.name, at: nowTime(), expires: Date.now() + 30 * 60e3, lang: S.settings.lang }, en);
  S.helpCode = code;
  track('help_code', { where: ctx.key === 'flow' || ctx.key === 'review' ? taskName(ctx.task) : ctx.label });
  addLog('Help code ' + code + ' created', 'You asked for a code to read to the hotline. It expires in 30 minutes and gives no account access.', 'you');
}
function viewHelpCode() {
  const c = G.helpCodes[S.helpCode];
  if (!c) return header('Help code') + '<div class="pad"><div class="empty">No active code.</div></div>';
  const mins = Math.max(0, Math.round((c.expires - Date.now()) / 60e3));
  return header('Your help code') + '<div class="pad" style="text-align:center"><p class="muted" style="margin-top:0">Calling OCBC instead of using the app? Read this code to the officer and they will see where you were, so you do not have to explain again.</p>' +
    '<div class="card" style="padding:22px 12px"><div class="small muted">Help code</div><div style="font-size:calc(44px*var(--scale));font-weight:800;letter-spacing:.18em;color:var(--red)">' + esc(c.code) + '</div><div class="small muted">Expires in ' + mins + ' minutes</div></div>' +
    '<div class="banner danger" style="text-align:left">' + ic('shieldx') + '<div><b>Only read this to OCBC\'s official hotline</b>Use the number on the back of your card. Never read it to someone who calls you.</div></div>' +
    '<div class="banner info" style="text-align:left">' + ic('info') + '<div>It shows the officer what you were doing and how you like to be served. It does not give access to your account: they will still check who you are.</div></div>' +
    '<button class="btn primary block" data-a="helpCodeDone">' + t('done') + '</button></div>';
}

/* ---------- Journey timeline for staff (built from what the customer did) ---------- */
function journeyFor(pid) {
  const m = e => {
    const tn = e.task ? taskName(e.task) : '';
    switch (e.type) {
      case 'task_start': return 'Started ' + tn + (e.level ? ' (' + levelLabel(e.level) + ')' : '');
      case 'practice_start': return 'Started a practice run: ' + tn;
      case 'step_error': return 'Needed a fix on ' + tn + ', step "' + e.step + '"';
      case 'pause_shown': return 'Safety check shown on ' + tn + (e.amount ? ' (' + money(e.amount) + ')' : '');
      case 'pause_team': return 'Asked for the anti-scam team. Transfer paused';
      case 'pause_cancel': return 'Cancelled at the safety check';
      case 'helper_open': return 'Opened Helper';
      case 'helper_q': return 'Asked Helper: ' + e.q;
      case 'real_done': return 'Completed ' + tn;
      case 'ghost_hand': return 'Watched "Show me how"';
      case 'layout_switch': return 'Switched to ' + (e.to === 'guided' ? 'step by step' : 'quick form');
      case 'copilot_live': return 'Family Co-pilot joined';
      default: return null;
    }
  };
  return G.events.filter(e => e.persona === pid).map(e => ({ t: new Date(e.t).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }), w: m(e) })).filter(x => x.w).slice(-8);
}

/* ---------- Staff highlight (suspected scams only) ---------- */
function applyStaffRing() {
  document.querySelectorAll('.staff-ring').forEach(el => el.classList.remove('staff-ring'));
  const r = G.staffRing;
  if (!r || r.persona !== S.personaId) return;
  const el = document.querySelector('#cust-phone [data-a="' + r.a + '"]') || document.querySelector('#cust-phone [data-a="exitFlow"]');
  if (el) el.classList.add('staff-ring');
}

/* ---------- One app, four experiences ---------- */
function viewFour() {
  const top = p => TASKS.map(x => x.id).sort((a, b) => (p.usage[b] || 0) - (p.usage[a] || 0)).slice(0, 4);
  const card = p => '<div class="dash-card four-card"><div class="row" style="gap:10px;margin-bottom:6px"><span class="av" style="background:' + p.color + '">' + p.initials + '</span><div><h2 style="margin:0">' + esc(p.need) + '</h2><div class="small muted">' + esc(p.needSub) + '</div></div></div>' +
    '<h3>They told us</h3><div class="kvs"><div><span>Confidence</span><b>' + esc(p.told.conf) + '</b></div><div><span>Help</span><b>' + esc(p.told.help) + '</b></div><div><span>Passport</span><b>' + esc(p.told.passport) + '</b></div></div>' +
    '<h3>Their home shortcuts</h3><div class="mini-qa">' + top(p).map(id => '<span><i>' + ic(TASK[id].icon, 18) + '</i>' + esc(t('s_' + id)) + '</span>').join('') + '</div>' +
    '<h3>What adapts for them</h3><ul>' + p.adapts.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul>' +
    '<div class="small muted" style="margin:6px 0 10px">Sample user: ' + esc(p.name) + '</div><button class="btn primary block" data-a="openPersona" data-v="' + p.id + '">Open in the app</button></div>';
  return '<main class="wide"><div class="dash-card" style="border-top:4px solid var(--red)"><div class="small" style="color:var(--red);font-weight:800;letter-spacing:.04em">TARGET AUDIENCE: EVERYONE</div><h2 style="font-size:24px;margin:4px 0 6px">One app, four experiences</h2>' +
    '<p class="lead" style="margin:0">Same features and the same safety checks for every customer. What changes is the guidance each task gets, set by the customer\'s own Confidence Map and updated as they use the app. Users are defined by needs, not age: any of these could be 22 or 72.</p></div>' +
    '<div class="four-grid">' + PERSONAS.map(card).join('') + '</div>' +
    '<div class="same-band"><h2>The same for everyone</h2><div class="same-grid">' +
    [['Same features', 'Every service is one tap away in every mode. Nothing is hidden.'], ['Same safety checks', 'Triggered by the payment (new payee, large amount, first overseas), never by who you are.'], ['Same route to help', 'Helper first, then family, then a person who already knows the story.'], ['Customer stays in control', 'Every change is explained and can be removed in one place.']].map(x => '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>').join('') +
    '</div></div></main>';
}

function findTicket(id) { return G.tickets.find(x => x.id === id) || SAMPLE_TICKETS.find(x => x.id === id); }

/* ---------- Everyday-amount units the customer chooses ---------- */
const REAL_UNITS = [
  { id: 'food', label: 'Chicken rice and kopi', icon: 'plate' },
  { id: 'phone', label: 'Months of phone bill', one: 'month of phone bill', plural: 'months of phone bill', price: 30, note: 'S$30 a month', icon: 'phone' },
  { id: 'rent', label: 'Months of room rent', one: 'month of room rent', plural: 'months of room rent', price: 900, note: 'S$900 a month', icon: 'home' },
  { id: 'grocery', label: 'Weeks of groceries', one: 'week of groceries', plural: 'weeks of groceries', price: 120, note: 'S$120 a week', icon: 'wallet' }
];

/* ---------- Times and Passport view log ---------- */
function laterTime(hours) {
  const d = new Date(Date.now() + hours * 3600e3);
  return d.toLocaleString('en-SG', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
}
G.passportViews = G.passportViews || [];
function logPassportView(id) {
  const tk = findTicket(id);
  if (!tk || tk.sample) return;
  if (G.passportViews.some(v => v.ticket === id)) return;
  G.passportViews.push({ ticket: id, persona: tk.persona, who: 'OCBC officer, request ' + id, at: nowTime() });
}
function passportViews() { return G.passportViews.filter(v => v.persona === S.personaId); }

/* ---------- English for staff: Helper messages keep an English copy ---------- */
function toEnglish(text, lang) {
  if (!lang || lang === 'en') return null;
  const dict = L[lang] || {};
  for (const k in dict) if (dict[k] === text && L.en[k]) return L.en[k];
  const known = { '您好，我是小助手。': "Hi, I'm Helper." };
  for (const k in known) if (String(text).startsWith(k)) return known[k] + String(text).slice(k.length);
  return /[^\x00-\x7F]/.test(text) ? '(Translated by the translation service in the real system.)' : null;
}

/* Staff always read English, whatever language the customer uses */
function inEnglish(fn) {
  const lang = S.settings.lang;
  S.settings.lang = 'en';
  try { return fn(); } finally { S.settings.lang = lang; }
}

/* ==========================================================
   ADAPTIVE ENGINE
   Every step of every task is composed for this customer, at
   this moment, on this channel, from four inputs:
     1. Who you are      - Assistance Passport (language, plain words,
                           larger text, audio, extra time)
     2. What you can do  - Confidence Map level for this task
     3. How it is going  - live struggle signals on this step
     4. Where you are    - channel: app, ATM or hotline
   The engine can only pick from approved building blocks (layouts,
   wording sets, explanations, controls). It never writes new text,
   and it can never remove fees, risks, the safety check or the
   final confirm step.
   ========================================================== */

const LIVE_RULES = { fails: 2, idleMs: 15000, idleMsPatient: 30000, backs: 2, taps: 4, tapWindow: 1500 };
const LIVE_WHY = {
  fails: n => 'the same step needed fixing ' + n + ' times',
  idle: () => 'nothing happened on this step for a while',
  backs: () => 'you went back and forth between steps',
  taps: () => 'several quick taps landed on things that do nothing',
  demo: () => 'the demo control said this customer is struggling',
  ml: n => 'the on-phone model saw several small signs of difficulty together (' + n + '% sure)'
};
const APPROVED_PARTS = {
  'layout.guided': 'One question per screen',
  'layout.quick': 'All questions on one form',
  'explain.full': 'Full explanation (approved text)',
  'explain.tip': 'One-line tip with "Tell me more"',
  'explain.none': 'No tips',
  'wording.plain': 'Plain-words line under the official text',
  'text.larger': 'Larger text size',
  'audio.on': 'Read aloud / dialect audio',
  'controls.focus': 'Bigger buttons, extra options tucked away',
  'promo.hidden': 'Promotions hidden (Calm mode)',
  'banner.simplified': '"We made this simpler" with Undo',
  'atm.twoChoice': 'ATM: at most two choices per screen',
  'atm.wait': 'ATM: screen waits longer before timing out',
  'hotline.brief': 'Hotline: one-page brief in English'
};
const GUARDRAILS = ['Fees, rates and risks are always shown', 'The safety check always runs on risky payments', 'Amounts, names and account numbers are never changed', 'Official wording stays; plain words are added, never swapped in', 'The final confirm step is never skipped'];

function liveFor(f, stepId) {
  if (!f || !f.live) return null;
  const on = f.live.on[stepId];
  if (!on || f.live.off[stepId]) return null;
  return on;
}
function liveInit(f) {
  if (!f.live) f.live = { fails: {}, backs: 0, taps: [], on: {}, off: {}, why: false };
  return f.live;
}

/* Compose: the single place that decides how a step looks. */
function engineCompose(task, o) {
  o = o || {};
  const st = o.state || S;
  const f = o.flow !== undefined ? o.flow : st.flow;
  const channel = o.channel || 'app';
  const level = st.confidence[task] || 'help';
  const lang = st.settings.lang;
  const stepId = o.stepId || (f && f.task === task && FLOWS[task] ? (FLOWS[task].steps[f.step] || {}).id : null);
  const live = o.live !== undefined ? o.live : liveFor(f, stepId);
  const who = { lang, simple: !!(st.settings.simple || st.passport.simple), larger: st.settings.scale > 2 || !!st.passport.larger, audio: !!(st.settings.readAloud || st.settings.mode === 'voice' || st.dialect !== 'off'), patient: !!st.passport.patient };
  const spec = { task, channel, level, lang, layout: 'guided', explain: 'tip', plain: who.simple, larger: who.larger, audio: who.audio, patient: who.patient, focus: false, calm: !!st.settings.calm, simplified: false, parts: [], reasons: [] };
  const lname = LANGS.find(l => l.code === lang) || { name: 'English' };
  const why = (from, said, did) => spec.reasons.push({ from, said, did });

  // 2. What you can do
  if (level === 'never') { spec.layout = 'guided'; spec.explain = 'full'; why('Confidence Map', '"New to me" for ' + taskName(task), 'One question per screen with the full explanation'); }
  else if (level === 'help') { spec.layout = 'guided'; spec.explain = 'tip'; why('Confidence Map', '"With some help" for ' + taskName(task), 'One question per screen with a one-line tip'); }
  else { spec.layout = 'quick'; spec.explain = 'none'; why('Confidence Map', '"I do this often" for ' + taskName(task), 'All questions on one form, no tips'); }
  if (task === 'scan') spec.layout = 'guided';

  // 1. Who you are
  why('Passport', 'Language: ' + lname.name, 'Every word comes from the approved ' + lname.name + ' set');
  if (who.simple) why('Passport', 'Plain words', 'Adds a plain-words line; the official text stays');
  if (who.larger) why('Passport', 'Larger text', 'Text size ' + (st.settings.scale + 1) + ' of 7, layout reflows');
  if (who.audio) why('Passport', st.dialect !== 'off' ? 'Dialect audio' : 'Read aloud', 'Steps are read out');
  if (who.patient) why('Passport', 'Please give me more time', 'No time-outs; struggle check waits twice as long');

  // 3. How it is going right now
  if (live) {
    spec.simplified = true; spec.focus = true; spec.calm = true; spec.plain = true;
    if (spec.layout === 'quick') { spec.layout = 'guided'; }
    spec.explain = 'full';
    why('Right now', 'Struggling: ' + LIVE_WHY[live.signal](live.n || 2), 'This step only: one question, full explanation, plain words, bigger buttons, promotions hidden. Undo any time.');
  } else {
    why('Right now', 'No struggle signals on this step', 'Nothing extra');
  }

  // 4. Where you are
  if (channel === 'atm') {
    spec.layout = 'atm'; spec.larger = true;
    why('Channel', 'OCBC ATM (after scanning the QR in the app)', 'At most two choices per screen, side keys labelled' + (who.patient ? ', waits 90 seconds' : '') + (who.audio ? ', audio through the earphone jack' : ''));
  } else if (channel === 'hotline') {
    spec.layout = 'brief';
    why('Channel', 'Hotline (customer read out a help code)', 'Staff get a one-page brief in English with how to talk to this customer');
  } else why('Channel', 'OCBC app', 'Phone layout');

  // Approved parts actually used
  const P = spec.parts;
  if (channel === 'app') { P.push(spec.layout === 'quick' ? 'layout.quick' : 'layout.guided'); P.push('explain.' + spec.explain); }
  if (spec.plain) P.push('wording.plain');
  if (spec.larger) P.push('text.larger');
  if (spec.audio) P.push('audio.on');
  if (spec.focus) P.push('controls.focus');
  if (spec.calm) P.push('promo.hidden');
  if (spec.simplified) P.push('banner.simplified');
  if (channel === 'atm') { P.push('atm.twoChoice'); if (who.patient) P.push('atm.wait'); }
  if (channel === 'hotline') P.push('hotline.brief');
  return spec;
}

/* ---------- Live Adaptation: triggers ---------- */
function liveTrigger(signal, n) {
  const f = S.flow;
  if (!f || f.stage !== 'steps' || G.view !== 'app') return false;
  const live = liveInit(f);
  const steps = flowSteps();
  // In the quick form, adapt the field that has the problem (or the first one)
  const stepId = f.mode === 'quick' ? (f.errStep || steps[0].id) : steps[f.step].id;
  if (live.on[stepId] || live.off[stepId]) return false;
  live.on[stepId] = { signal, n: n || 2, at: nowTime() };
  if (f.mode === 'quick') { f.mode = 'guided'; f.step = Math.max(0, steps.findIndex(s => s.id === stepId)); f.liveSwitched = true; }
  G.liveStats = G.liveStats || { shown: 0, undone: 0, by: {} };
  G.liveStats.shown++; G.liveStats.by[signal] = (G.liveStats.by[signal] || 0) + 1;
  addLog(taskName(f.task) + ': this step was made simpler', 'Because ' + LIVE_WHY[signal](n || 2) + '. Only this step. Nothing was saved about you.', 'engine');
  track('live_adapt', { task: f.task, step: stepId, signal });
  return true;
}
const LIVE_TEXT = {
  en: { t: 'We made this step simpler', because: 'Because ', sw: '. We switched to one question at a time and kept what you typed.', undo: 'Undo', how: 'How was this decided?', why: { fails: 'the same step needed fixing twice', idle: 'nothing happened on this step for a while', backs: 'you went back and forth between steps', taps: 'several quick taps landed on things that do nothing', demo: 'the demo control said this customer is struggling', ml: 'several small signs of difficulty showed up together' } },
  zh: { t: '我们把这一步变简单了', because: '因为', sw: '。我们改成一次一个问题，您输入的都保留了。', undo: '撤销', how: '这是怎么决定的？', why: { fails: '这一步改了两次还不对', idle: '这一步停了一段时间', backs: '您在几个步骤之间来回切换', taps: '连续点了几下没有反应的地方', demo: '演示按钮表示这位顾客遇到困难', ml: '同时出现了几个小的困难迹象' } },
  ms: { t: 'Kami permudahkan langkah ini', because: 'Kerana ', sw: '. Kami tukar kepada satu soalan pada satu masa dan simpan apa yang anda taip.', undo: 'Batal', how: 'Bagaimana ini diputuskan?', why: { fails: 'langkah yang sama perlu dibetulkan dua kali', idle: 'tiada apa berlaku pada langkah ini untuk seketika', backs: 'anda berulang-alik antara langkah', taps: 'beberapa ketukan pantas pada bahagian yang tidak berfungsi', demo: 'kawalan demo menandakan pelanggan ini sukar', ml: 'beberapa tanda kecil kesukaran muncul serentak' } },
  ta: { t: 'இந்தப் படியை எளிதாக்கினோம்', because: 'ஏனெனில் ', sw: '. ஒரு நேரத்தில் ஒரு கேள்வியாக மாற்றினோம், நீங்கள் தட்டச்சு செய்தது அப்படியே உள்ளது.', undo: 'செயல்தவிர்', how: 'இது எப்படி முடிவு செய்யப்பட்டது?', why: { fails: 'இதே படியை இரண்டு முறை திருத்த வேண்டியிருந்தது', idle: 'இந்தப் படியில் சிறிது நேரம் எதுவும் நடக்கவில்லை', backs: 'படிகளுக்கு இடையே முன்னும் பின்னும் சென்றீர்கள்', taps: 'செயல்படாத இடங்களில் பல முறை வேகமாகத் தட்டினீர்கள்', demo: 'டெமோ கட்டுப்பாடு இந்த வாடிக்கையாளர் சிரமப்படுவதாகக் காட்டியது', ml: 'சிரமத்தின் பல சிறிய அறிகுறிகள் ஒன்றாகத் தெரிந்தன' } }
};
function liveBanner(f, step) {
  const on = liveFor(f, step.id);
  if (!on) return '';
  const spec = engineCompose(f.task);
  const T = LIVE_TEXT[S.settings.lang] || LIVE_TEXT.en;
  return '<div class="banner live" role="status" id="live-banner">' + ic('sparkle') + '<div style="flex:1"><b>' + esc(T.t) + '</b>' +
    esc(T.because + T.why[on.signal]) + esc(f.liveSwitched ? T.sw : (S.settings.lang === 'zh' ? '。' : '.')) +
    '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px"><button class="btn secondary" style="min-height:40px" data-a="liveUndo">' + ic('undo', 16) + ' ' + esc(T.undo) + '</button>' +
    '<button class="linkbtn" style="min-height:40px;padding:0 4px" data-a="liveWhy" aria-expanded="' + !!f.live.why + '">' + esc(T.how) + '</button></div>' +
    (f.live.why ? '<ul class="small" style="margin:8px 0 0;padding-left:18px">' + spec.reasons.map(r => '<li><b>' + esc(r.from) + ':</b> ' + esc(r.said) + '. ' + esc(r.did) + '.</li>').join('') + '</ul><div class="small muted" style="margin-top:6px">Nothing about you was stored. Fees, risks and the final check are never changed.</div>' : '') +
    '</div></div>';
}

let liveIdleTimer = null;
function liveArmIdle() {
  clearTimeout(liveIdleTimer);
  const f = S.flow;
  if (G.view !== 'app' || !f || f.stage !== 'steps' || S.modal || S.helper.open || S.thread || f.mode === 'quick') return; // quick form = confident user: only repeated errors count
  const steps = flowSteps(), stepId = f.mode === 'quick' ? null : steps[f.step].id;
  if (stepId && f.live && (f.live.on[stepId] || f.live.off[stepId])) return;
  liveIdleTimer = setTimeout(() => { if (S.flow === f && liveTrigger('idle')) render(); }, S.passport.patient ? LIVE_RULES.idleMsPatient : LIVE_RULES.idleMs);
}
function liveTap(e) {
  const f = S.flow;
  if (!f || f.stage !== 'steps') return;
  if (!e.target.closest('#cust-phone .content') || e.target.closest('[data-a],button,input,select,textarea,label,a')) return;
  const live = liveInit(f), now = Date.now();
  live.taps = live.taps.filter(x => now - x < LIVE_RULES.tapWindow); live.taps.push(now);
  if (live.taps.length >= LIVE_RULES.taps) { live.taps = []; if (liveTrigger('taps')) render(); }
}

const ENGINE_ACTIONS = {
  liveUndo() {
    const f = S.flow, steps = flowSteps(), id = steps[f.step].id;
    f.live.off[id] = true;
    G.liveStats = G.liveStats || { shown: 0, undone: 0, by: {} }; G.liveStats.undone++;
    addLog(taskName(f.task) + ': back to how it was', 'You tapped Undo on "We made this step simpler"', 'you');
    track('live_undo', { task: f.task, step: id });
  },
  liveWhy() { const l = liveInit(S.flow); l.why = !l.why; },
  simStruggle() { if (!S.flow || S.flow.stage !== 'steps') { toast('Start a payment first, then press this on any step.'); return; } liveTrigger('demo'); },
  login() { S.screen = S.onboarded ? 'home' : 'onboarding'; track('login'); },
  logout() { stopSpeak(); S.flow = null; S.modal = null; S.helper.open = false; S.screen = 'login'; },
  loginQuick(v) { toast(v === 'onetoken' ? 'OneToken works here in the real app. In this demo, tap Log in.' : 'Log in first to use this in the demo.'); },
  payChooser() { S.payChooser = !S.payChooser; },
  callUs() { S.callSheet = !S.callSheet; },
  rewardsTab(v) { S.rewardsTab = v; },
  // Engine demo tab
  eng(v, el) {
    const E = G.eng; const [k, val] = String(v).split(':');
    if (k === 'lang') E.lang = val;
    else if (k === 'level') E.level = val;
    else if (k === 'channel') { E.channel = val; if (val === 'atm') E.journey = 'unlock'; else if (E.journey === 'unlock') E.journey = 'uen'; }
    else if (k === 'step') E.step = Number(val);
    else if (k === 'journey') { E.journey = val; E.step = 0; if (val === 'uen' && E.channel === 'atm') E.channel = 'app'; if (val === 'unlock' && E.channel === 'hotline') E.channel = 'atm'; }
    else if (k === 'struggle') E.struggle = !E.struggle;
    else E[k] = !E[k];
    E.changed = k;
  },
  engReset() { G.eng = engDefaults(); }
};

/* ---------- "Check who you're paying" ---------- */
const ACCT_DIR = {
  '123456789': 'TAN AH BENG',
  '1234567890': 'TAN AH BENG',
  '555566667': 'LEE KAH WAI',
  '987654321': 'SITI NUR AISYAH'
};
function maskName(n) {
  return String(n || '').toUpperCase().split(/\s+/).filter(Boolean).map(w => w.length <= 2 ? w : w.slice(0, 2) + 'X'.repeat(w.length - 2)).join(' ');
}
function normName(n) { return String(n || '').toUpperCase().replace(/[^A-Z ]/g, ' ').split(/\s+/).filter(Boolean); }
function payeeCheck(d) {
  const acct = String(d.acct || '').replace(/[\s-]/g, '');
  const holder = ACCT_DIR[acct];
  if (!holder) return { status: 'unknown', masked: '', holder: '' };
  const a = normName(d.name), b = normName(holder);
  let status = 'no';
  if (a.join(' ') === b.join(' ')) status = 'match';
  else if (a.length && b.length && a[0] === b[0] && a.some(w => b.includes(w))) status = 'close';
  return { status, masked: maskName(holder), holder };
}
function payeeCheckView(d, v) {
  const r = payeeCheck(d);
  const typed = esc(d.name || '');
  let box = '';
  if (r.status === 'unknown') box = '<div class="banner warn" role="status">' + ic('info') + '<div><b>We could not check this name</b>The receiving bank did not answer in time. Only continue if you got these details from the person directly, not from a message or caller.</div></div>';
  else if (r.status === 'match') box = '<div class="banner safe" role="status">' + ic('check') + '<div><b>The name matches</b>The bank has this account under the name you typed.</div></div>';
  else if (r.status === 'close') box = '<div class="banner warn" role="status">' + ic('alert') + '<div><b>Close, but not exact</b>It may be a short name or a spelling. Check with the person before you pay.</div></div>';
  else box = '<div class="banner danger" role="alert">' + ic('shieldx') + '<div><b>Stop: the name is different</b>You typed "' + typed + '", but this account belongs to someone else. If a caller or a message gave you these details, it may be a scam.</div></div>';
  return '<div class="card" style="text-align:center"><div class="small muted">The receiving bank says this account belongs to</div><div style="font-size:calc(19px*var(--scale));font-weight:800;margin:6px 0;letter-spacing:.04em">' + esc(r.masked || 'Not available') + '</div><div class="small muted">Shown with some letters hidden, as banks do since June 2026</div></div>' + box +
    '<div class="yn"><button class="btn ' + (v === 'yes' ? 'dark' : 'secondary') + '" data-a="pick" data-v="payee|yes" aria-pressed="' + (v === 'yes') + '">' + (r.status === 'match' ? 'Yes, this is right' : 'I checked, continue') + '</button><button class="btn secondary" data-a="payeeNo">No, stop</button></div>';
}
ENGINE_ACTIONS.payeeNo = function () {
  track('name_mismatch', { task: S.flow.task });
  S.flow.err = { msg: 'Good call. Nothing has been sent. Check the account details with the person using a number you already know.', fix: [{ label: 'Cancel this payment', a: 'exitFlow', v: '' }, { label: t('talk_person'), a: 'helperAsk', v: '__person' }] };
  addLog('Payment stopped at "Check who you\'re paying"', 'You said the account holder was not who you expected', 'safety');
};

/* Registered PayNow names (synthetic), shown masked */
function paynowName(c) {
  const base = String(c.name || '').split(' (')[0];
  const reg = { 'Mei Ling': 'TAN MEI LING', 'Ah Kow': 'LIM AH KOW', 'Mr Tan': 'TAN KOK MENG', 'Priya': 'PRIYA NAIR', 'Wei Jie': 'ONG WEI JIE', 'Faiz': 'MUHAMMAD FAIZ BIN OSMAN', 'Kak Ros': 'ROSNAH BINTE ALI' }[base];
  return maskName(reg || base);
}
function paynowMobileName(m) {
  const n = String(m || '').replace(/\D/g, '');
  const known = { '91234567': 'CHUA BEE LIAN', '81112222': 'TAN KOK MENG' };
  return maskName(known[n] || 'WONG SIEW MEI');
}

/* ---------- Engine demo tab ---------- */
function engDefaults() { return { journey: 'uen', step: 0, lang: 'en', simple: false, larger: false, audio: false, patient: false, level: 'help', struggle: false, channel: 'app', changed: null }; }
G.eng = engDefaults();

function engState() {
  // A sandbox copy of the current customer, with the four inputs applied
  const E = G.eng, s = clone(S);
  s.settings.lang = E.lang; s.settings.simple = E.simple; s.passport.simple = E.simple;
  s.settings.scale = E.larger ? 5 : 2; s.passport.larger = E.larger;
  s.settings.readAloud = E.audio; s.passport.patient = E.patient; s.settings.mode = 'visual'; s.dialect = 'off';
  s.settings.contrast = false; s.settings.calm = false;
  s.confidence = Object.assign({}, s.confidence, { uen: E.level, moneylock: E.level });
  s.helper = { open: false, msgs: [] }; s.modal = null; s.nudge = false; s.toast = null; s.suggestion = null; s.pending = [];
  return s;
}
function engPreviewPhone(E) {
  const saved = S, savedLast = lastKey, evLen = G.events.length, savedTop = G.view;
  let html = '';
  try {
    S = engState();
    startFlow('uen', false);
    S.flow.data = { uen: '53312345A', check: E.step > 1 ? 'yes' : '', amount: E.step > 2 ? '120' : '', ref: '' };
    const spec0 = engineCompose('uen');
    if (spec0.layout === 'quick') S.flow.mode = 'quick';
    if (E.step === 4) { S.flow.stage = 'review'; }
    else S.flow.step = Math.min(E.step, 3);
    if (E.struggle && S.flow.stage === 'steps') {
      liveInit(S.flow);
      const id = S.flow.mode === 'quick' ? 'uen' : flowSteps()[S.flow.step].id;
      S.flow.live.on[id] = { signal: 'fails', n: 2 };
      if (S.flow.mode === 'quick') { S.flow.mode = 'guided'; S.flow.liveSwitched = true; }
      S.flow.data.uen = id === 'uen' ? '5331234' : S.flow.data.uen;
      if (id === 'uen') S.flow.err = { msg: "We couldn't find that UEN. Check it against the bill or letter (not a chat message). It is 9 or 10 characters, for example 53312345A." };
    }
    html = '<div class="phone eng-phone" lang="' + S.settings.lang + '" style="--scale:' + SCALES[S.settings.scale] + '"><div class="screen">' + phoneInner() + '</div></div>';
  } finally { S = saved; lastKey = savedLast; G.events.length = evLen; G.view = savedTop; }
  return html;
}

/* ATM: the same customer, the same Passport, at an OCBC ATM after scanning the QR */
const ATM_TEXT = {
  en: { title: 'Release Money Lock', locked: 'You have S$1,000.00 locked.', q1: 'How much do you want to release?', all: 'All S$1,000.00', other: 'Another amount', q2: 'Is anyone on the phone telling you to do this?', yes: 'Yes', no: 'No, it is my choice', q3: 'Release S$1,000.00 to your 360 Account?', ok: 'Yes, release', cancel: 'Cancel', plain: 'The money goes back to your account. You can spend it again.', call: 'Talk to OCBC now', wait: 'No rush. This screen waits 90 seconds.', audio: 'Audio is on in your earphones.', simpler: 'Let us do this one step at a time.' },
  zh: { title: '解除资金锁', locked: '您有 S$1,000.00 被锁住。', q1: '您要解锁多少钱？', all: '全部 S$1,000.00', other: '其他金额', q2: '有没有人在电话里叫您这样做？', yes: '有', no: '没有，是我自己决定', q3: '把 S$1,000.00 解锁到您的 360 账户？', ok: '是，解锁', cancel: '取消', plain: '钱会回到您的账户，可以再用。', call: '马上联系 OCBC', wait: '不用急。这个画面会等 90 秒。', audio: '耳机里有语音。', simpler: '我们一步一步来。' },
  ms: { title: 'Lepaskan Money Lock', locked: 'Anda ada S$1,000.00 yang dikunci.', q1: 'Berapa yang mahu dilepaskan?', all: 'Semua S$1,000.00', other: 'Jumlah lain', q2: 'Adakah sesiapa di telefon menyuruh anda buat ini?', yes: 'Ya', no: 'Tidak, ini pilihan saya', q3: 'Lepaskan S$1,000.00 ke Akaun 360 anda?', ok: 'Ya, lepaskan', cancel: 'Batal', plain: 'Wang kembali ke akaun anda. Anda boleh guna semula.', call: 'Bercakap dengan OCBC sekarang', wait: 'Jangan risau. Skrin ini tunggu 90 saat.', audio: 'Audio dihidupkan di fon telinga anda.', simpler: 'Mari buat satu langkah demi satu.' },
  ta: { title: 'Money Lock விடுவிப்பு', locked: 'உங்களிடம் S$1,000.00 பூட்டப்பட்டுள்ளது.', q1: 'எவ்வளவு விடுவிக்க வேண்டும்?', all: 'முழுவதும் S$1,000.00', other: 'வேறு தொகை', q2: 'யாராவது தொலைபேசியில் இதைச் செய்யச் சொல்கிறார்களா?', yes: 'ஆம்', no: 'இல்லை, இது என் முடிவு', q3: 'S$1,000.00 ஐ உங்கள் 360 கணக்கிற்கு விடுவிக்கவா?', ok: 'ஆம், விடுவி', cancel: 'ரத்து', plain: 'பணம் உங்கள் கணக்கிற்குத் திரும்பும். மீண்டும் பயன்படுத்தலாம்.', call: 'இப்போது OCBC யுடன் பேசுங்கள்', wait: 'அவசரம் இல்லை. இந்தத் திரை 90 விநாடி காத்திருக்கும்.', audio: 'காதணியில் ஒலி இயங்குகிறது.', simpler: 'ஒவ்வொரு படியாகச் செய்வோம்.' }
};
function viewATM(E, spec) {
  const T = ATM_TEXT[E.lang] || ATM_TEXT.en;
  const step = Math.min(E.step, 2);
  const q = [T.q1, T.q2, T.q3][step];
  const choices = [[T.all, T.other], [T.no, T.yes], [T.ok, T.cancel]][step];
  const big = spec.larger;
  let side = '<div class="atm-keys left"><span></span><span></span><span></span><span></span></div><div class="atm-keys right"><span></span><span></span><span></span><span></span></div>';
  let body = '<div class="atm-head"><span class="atm-brand">OCBC</span><span>' + esc(T.title) + '</span></div><div class="atm-body' + (big ? ' big' : '') + '">';
  if (E.struggle) body += '<div class="atm-note">' + esc(T.simpler) + '</div>';
  if (step === 0) body += '<div class="atm-sub">' + esc(T.locked) + '</div>';
  body += '<div class="atm-q">' + esc(q) + '</div>';
  if (E.simple) body += '<div class="atm-plain">' + esc(step === 2 ? T.plain : step === 1 ? (E.lang === 'zh' ? '骗子常叫人来提款机解锁。' : 'Scammers often tell people to come to an ATM to do this.') : (E.lang === 'zh' ? '选一个。' : 'Pick one.')) + '</div>';
  body += '<div class="atm-choices">' + choices.map((c, i) => '<div class="atm-choice ' + (i === 0 ? 'r' : 'r2') + '">' + esc(c) + ' <span>&#9654;</span></div>').join('') + '</div>';
  if (step === 1) body += '<div class="atm-choice call">' + esc(T.call) + ' <span>&#9654;</span></div>';
  body += '<div class="atm-foot">' + (E.patient ? '<span>' + esc(T.wait) + '</span>' : '<span>&nbsp;</span>') + (E.audio ? '<span>' + ic('speaker', 14) + ' ' + esc(T.audio) + '</span>' : '') + '</div></div>';
  return '<div class="atm"><div class="atm-screen">' + side + '<div class="atm-inner">' + body + '</div></div><div class="atm-slot"><span>Card</span><span>Cash</span><span>Earphones</span></div><div class="small muted" style="margin-top:8px;text-align:center">Concept: OCBC ATM after the customer scans the QR from the app. Money Lock can only be released at an OCBC ATM.</div></div>';
}

/* Hotline: what staff see when the customer reads out a help code */
function viewHotlineBrief(E, spec) {
  const lname = (LANGS.find(l => l.code === E.lang) || { name: 'English' }).name;
  const stepNames = ['Typing the UEN (step 1 of 4)', 'Checking the business name (step 2 of 4)', 'Typing the amount (step 3 of 4)', 'Bill number (step 4 of 4)', 'Final check before paying'];
  const how = ['Speak ' + lname];
  if (E.simple) how.push('Use simple words');
  if (E.patient) how.push('Speak slowly, do not rush');
  if (E.audio) how.push('Prefers to listen rather than read');
  if (E.larger) how.push('Uses large text (screens may look different)');
  const conf = { never: 'New to this task', help: 'Has done this with some help', often: 'Does this often' }[E.level];
  const line = { en: 'I can see you are paying a business. Let us look at the UEN together.', zh: '我看到您在付款给一家公司。我们一起看看 UEN 号码。', ms: 'Saya nampak anda sedang membayar perniagaan. Mari kita semak UEN bersama.', ta: 'நீங்கள் ஒரு வணிகத்திற்குப் பணம் செலுத்துவதைப் பார்க்கிறேன். UEN ஐ ஒன்றாகப் பார்ப்போம்.' }[E.lang];
  return '<div class="hot"><div class="hot-head"><b>OCBC hotline · caller brief</b><span class="tag">Help code 482 913 · verified</span></div>' +
    '<div class="hot-grid"><div><div class="hot-l">Where they are</div><div class="hot-v">PayNow to a business · ' + esc(stepNames[E.step]) + '</div></div>' +
    '<div><div class="hot-l">Confidence</div><div class="hot-v">' + esc(conf) + '</div></div>' +
    '<div><div class="hot-l">What happened</div><div class="hot-v">' + (E.struggle ? 'Typed a UEN that does not exist, twice. App made the step simpler.' : 'No problems so far.') + '</div></div>' +
    '<div><div class="hot-l">Safety</div><div class="hot-v">Paying Bright Minds Tuition Centre (registered name checked). Not a new risky payee.</div></div></div>' +
    '<div class="hot-l" style="margin-top:12px">How to talk to them (from their Passport)</div><div>' + how.map(h => '<span class="pchip">' + esc(h) + '</span>').join('') + '</div>' +
    '<div class="hot-l" style="margin-top:12px">Suggested first line</div><div class="hot-say">' + esc(line) + (E.lang !== 'en' ? '<div class="small muted" style="margin-top:4px">In English: I can see you are paying a business. Let us look at the UEN together.</div>' : '') + '</div>' +
    '<div class="banner danger" style="margin-top:12px">' + ic('shieldx') + '<div><b>Never ask for</b>OneToken codes, OTPs, PINs or passwords. The help code is the only thing the customer reads out.</div></div></div>';
}

function engSeg(key, opts, cur) {
  return '<div class="seg" role="group">' + opts.map(o => '<button data-a="eng" data-v="' + key + ':' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + '</button>').join('') + '</div>';
}
function engToggle(key, label, on) {
  return '<button class="chip-btn ' + (on ? 'on' : '') + '" data-a="eng" data-v="' + key + '" aria-pressed="' + !!on + '">' + (on ? '&#10003; ' : '') + esc(label) + '</button>';
}
function viewEngine() {
  const E = G.eng;
  const s = engState();
  const live = E.struggle && E.channel === 'app' ? { signal: 'fails', n: 2 } : (E.struggle ? { signal: 'fails', n: 2 } : null);
  const task = E.journey === 'unlock' ? 'moneylock' : 'uen';
  const spec = engineCompose(task, { state: s, flow: null, channel: E.channel, live, stepId: 'x' });
  const stepOpts = E.journey === 'unlock' ? [[0, 'How much'], [1, 'Safety question'], [2, 'Confirm']] : [[0, 'UEN'], [1, 'Name check'], [2, 'Amount'], [3, 'Bill number'], [4, 'Final check']];
  const out = E.channel === 'atm' ? viewATM(E, spec) : E.channel === 'hotline' ? viewHotlineBrief(E, spec) : (E.journey === 'unlock' ? viewUnlockApp(E) : engPreviewPhone(E));
  const stepDef = E.journey === 'uen' && E.step < 4 ? FLOWS.uen.steps[E.step] : null;
  return '<div class="eng-wrap">' +
    '<section class="panel eng-in" aria-labelledby="eng-h"><h2 id="eng-h">The four inputs</h2><p class="note" style="margin-top:0">Change any input. The screen on the right is rebuilt by the same engine the customer app uses.</p>' +
    '<h3>Journey</h3>' + engSeg('journey', [['uen', 'PayNow to a business'], ['unlock', 'Release Money Lock']], E.journey) +
    '<h3>Step</h3>' + engSeg('step', stepOpts, E.step) +
    '<h3><span class="eng-n">1</span> Who you are <small>(Passport)</small></h3>' + engSeg('lang', LANGS.map(l => [l.code, l.name]), E.lang) +
    '<div class="ctl-row" style="flex-wrap:wrap;gap:6px;margin-top:8px">' + engToggle('simple', 'Plain words', E.simple) + engToggle('larger', 'Larger text', E.larger) + engToggle('audio', 'Read aloud', E.audio) + engToggle('patient', 'More time', E.patient) + '</div>' +
    '<h3><span class="eng-n">2</span> What you can do <small>(Confidence Map)</small></h3>' + engSeg('level', [['never', 'New to me'], ['help', 'With some help'], ['often', 'I do this often']], E.level) +
    '<h3><span class="eng-n">3</span> How it is going <small>(live signals)</small></h3><div class="ctl-row">' + engToggle('struggle', 'Struggling: 2 wrong tries', E.struggle) + '</div>' +
    '<h3><span class="eng-n">4</span> Where you are <small>(channel)</small></h3>' + engSeg('channel', [['app', 'App'], ['atm', 'ATM'], ['hotline', 'Hotline']], E.channel) +
    '<div class="ctl-row" style="margin-top:12px"><button class="chip-btn" data-a="engReset">Reset inputs</button></div></section>' +
    '<section class="eng-out" aria-label="Result" aria-live="polite"><div class="eng-out-head">' + esc(E.channel === 'app' ? 'Customer app' : E.channel === 'atm' ? 'OCBC ATM' : 'Hotline staff screen') + '</div><div class="eng-stage ' + E.channel + '" inert>' + out + '</div></section>' +
    '<section class="panel eng-why" aria-labelledby="ew"><h2 id="ew">Why it looks like this</h2><ol class="eng-reasons">' + spec.reasons.map(r => '<li class="' + (E.changed && engChangedMatch(E.changed, r.from) ? 'hl' : '') + '"><b>' + esc(r.from) + '</b><span>' + esc(r.said) + '</span><em>' + esc(r.did) + '</em></li>').join('') + '</ol>' +
    '<h3>Approved building blocks used</h3><div>' + spec.parts.map(p => '<span class="pchip" title="' + esc(p) + '">' + esc(APPROVED_PARTS[p]) + '</span>').join('') + '</div>' +
    '<h3>Never changed by the engine</h3><ul class="note" style="margin:0;padding-left:18px">' + GUARDRAILS.map(g => '<li>' + esc(g) + '</li>').join('') + '</ul>' +
    (stepDef ? '<h3>Built once: this step as data</h3><pre class="eng-code">' + esc(JSON.stringify({ id: stepDef.id, type: stepDef.type, question: { en: stepDef.q.en, zh: stepDef.q.zh }, explain: { official: stepDef.x.std.en, plain: stepDef.x.simple.en } }, null, 2)) + '</pre><p class="note">One definition. The engine turns it into the guided step, the quick form, chat, voice, large text and the hotline brief.</p>' : '') +
    '</section></div>';
}
function engChangedMatch(k, from) {
  return ({ lang: 'Passport', simple: 'Passport', larger: 'Passport', audio: 'Passport', patient: 'Passport', level: 'Confidence Map', struggle: 'Right now', channel: 'Channel' })[k] === from;
}
function viewUnlockApp(E) {
  const lang = E.lang;
  const tt = { en: ['Release Money Lock', 'For your safety, locked money can only be released at an OCBC ATM with your card and PIN.', 'Show me the nearest ATM', 'At the ATM, scan this code so the ATM uses your language and settings.'], zh: ['解除资金锁', '为了您的安全，锁住的钱只能在 OCBC 提款机用卡和密码解锁。', '找最近的提款机', '在提款机扫描这个码，提款机就会用您的语言和设置。'], ms: ['Lepaskan Money Lock', 'Untuk keselamatan anda, wang yang dikunci hanya boleh dilepaskan di ATM OCBC dengan kad dan PIN.', 'Tunjukkan ATM terdekat', 'Di ATM, imbas kod ini supaya ATM guna bahasa dan tetapan anda.'], ta: ['Money Lock விடுவிப்பு', 'உங்கள் பாதுகாப்பிற்காக, பூட்டிய பணத்தை OCBC ATM இல் அட்டை மற்றும் PIN மூலம் மட்டுமே விடுவிக்க முடியும்.', 'அருகிலுள்ள ATM ஐக் காட்டு', 'ATM இல் இந்தக் குறியீட்டை ஸ்கேன் செய்யுங்கள், ATM உங்கள் மொழியையும் அமைப்புகளையும் பயன்படுத்தும்.'] }[lang] || [];
  const sc = E.larger ? 1.32 : 1;
  return '<div class="phone eng-phone" style="--scale:' + sc + '"><div class="screen"><div class="notch"></div><div class="statusbar"><span class="sb-time">9:41</span><span class="sb-icons"><svg aria-hidden="true" focusable="false" width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4c2.4 0 4.6.9 6.2 2.5l1.3-1.4A10.6 10.6 0 008 .4 10.6 10.6 0 00.5 3.5l1.3 1.4A8.7 8.7 0 018 2.4zm0 3.7c1.4 0 2.6.5 3.6 1.4l1.3-1.4A7 7 0 008 4.2a7 7 0 00-4.9 1.9l1.3 1.4C5.4 6.6 6.6 6.1 8 6.1zm0 3.4c.6 0 1.1.2 1.5.6L8 11.7 6.5 10.1c.4-.4.9-.6 1.5-.6z"/></svg><svg aria-hidden="true" focusable="false" width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><path d="M24.5 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span></div><main class="content"><div class="apphead plain"><button class="iconbtn">' + ic('back') + '</button><h1>' + esc(tt[0]) + '</h1></div><div class="pad">' +
    '<div class="banner info">' + ic('lock') + '<div>' + esc(tt[1]) + '</div></div><div class="card" style="text-align:center"><div style="display:inline-block">' + fakeQR() + '</div><p class="small" style="margin:8px 0 0">' + esc(tt[3]) + '</p></div>' +
    '<button class="btn secondary block">' + ic('pin', 18) + ' ' + esc(tt[2]) + '</button></div></main><div class="concept">Concept prototype · synthetic data</div></div></div>';
}
function liveOnNow() {
  const f = S && S.flow;
  if (!f || f.stage !== 'steps' || !FLOWS[f.task]) return false;
  return !!liveFor(f, flowSteps()[f.step].id);
}

/* ==========================================================
   OCBC-style shell: login, Home, Plan, Pay & Transfer, Rewards,
   More. Same features underneath; the look follows the real
   OCBC app (red header, bottom tabs, slide to pay). All content
   is synthetic. The login screen has no password fields: it is
   a demo entry, so it cannot be mistaken for a real login.
   ========================================================== */

ICONS.transfer = '<circle cx="12" cy="12" r="9"/><path d="M8 10h8l-2.5-2.5"/><path d="M16 14H8l2.5 2.5"/>';
ICONS.plan = '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>';
ICONS.gift = '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11"/><path d="M12 9c-2-4-6-4-6-1.5S9 9 12 9zM12 9c2-4 6-4 6-1.5S15 9 12 9z"/>';
ICONS.headset = '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>';
ICONS.token = '<rect x="7" y="3" width="10" height="18" rx="2"/><rect x="10" y="9" width="4" height="4" rx="1"/><path d="M11 17h2"/>';
ICONS.bulb = '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>';
ICONS.fx = '<circle cx="9" cy="9" r="5"/><path d="M15 6.5a5 5 0 11-5.5 10"/><path d="M9 7v4M7.5 8h3"/>';
ICONS.pin = '<path d="M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>';
ICONS.local = '<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v1.5M12 16v1.5"/>';
ICONS.bills = '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6"/>';
ICONS.cog = '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>';
ICONS.stars = '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>';
ICONS.chevron = '<path d="M9 5l7 7-7 7"/>';

/* ---------- Login (demo entry, no credentials) ---------- */
function viewLogin() {
  const q = (k, icon, label) => '<button class="lq" data-a="loginQuick" data-v="' + k + '"><span class="lq-ic">' + ic(icon, 22) + '</span>' + esc(label) + '</button>';
  return '<div class="login">' +
    '<div class="login-top"><button class="iconbtn" data-a="loginQuick" data-v="scan" aria-label="Scan">' + ic('scan') + '</button><button class="iconbtn" data-a="loginQuick" data-v="notify" aria-label="Notifications">' + ic('bell') + '</button></div>' +
    '<div class="login-arc" aria-hidden="true"></div>' +
    '<div class="login-hero"><div class="login-script">Hello</div><div class="login-line">one app,</div><div class="login-line"><span>built around</span></div><div class="login-line"><span>every customer.</span></div><div class="login-sub">Adaptive Banking concept for the OCBC Innovation Challenge</div></div>' +
    '<div class="login-grid">' + q('onetoken', 'token', 'OneToken') + q('scan', 'scan', 'Scan & Pay') + q('paynow', 'phone', 'PayNow') + q('insights', 'bulb', 'Wealth Insights') + q('fx', 'fx', 'Foreign Exchange') + q('more', 'stars', 'More') + '</div>' +
    '<button class="btn dark block login-btn" data-a="login" id="screen-title">Log in (demo)</button>' +
    '<p class="small login-adv"><b>Security tip:</b> OCBC will never send you a link to log in. Always open the app yourself.</p>' +
    '<p class="small muted login-adv">Demo only. There are no password fields. Pick a sample customer in Demo tools.</p></div>';
}

/* ---------- Home ---------- */
function promo(title, body, link, go) {
  return (go ? '<button class="promo-card promo" data-a="go" data-v="' + go + '">' : '<div class="promo-card promo">') + '<div class="small promo-k">' + esc(title) + '</div><div class="promo-t">' + esc(body) + '</div><span class="promo-l">' + esc(link) + '</span>' + (go ? '</button>' : '</div>');
}
function viewHome() {
  const order = shortcutOrder().slice(0, 3);
  const firstNew = TASKS.find(x => S.confidence[x.id] === 'never' && !S.practiced[x.id]);
  const calm = S.settings.calm;
  const sc = id => '<button class="sc" data-a="startTask" data-v="' + id + '"><span class="sc-ic">' + ic(TASK[id].icon, 22) + '</span><span class="sc-t">' + esc(taskShort(id)) + '</span><span class="lvl">' + levelLabel(S.confidence[id]) + '</span></button>';
  return '<div class="o-top"><button class="o-tokens" data-a="go" data-v="rewards">' + ic('gift', 16) + ' Rewards</button><div class="row" style="gap:4px"><button class="iconbtn" data-a="voiceOpen" aria-label="Say it">' + ic('mic') + '</button><button class="iconbtn" aria-label="Notifications">' + ic('bell') + '</button>' + helperHeadBtn() + '</div></div>' +
    '<div class="o-hero' + (calm ? ' calm' : '') + '"><div class="o-hero-txt"><div class="o-welcome" id="screen-title" tabindex="-1">' + t('hello') + ', ' + esc(S.short) + '</div><div class="o-hero-sub">' + (calm ? esc(new Date().toLocaleDateString({ zh: 'zh-SG', ms: 'ms-MY', ta: 'ta-SG' }[S.settings.lang] || 'en-SG', { weekday: 'long', day: 'numeric', month: 'long' })) : 'Wishing you a bright and joyful festive season') + '</div></div>' + (calm ? '' : '<div class="o-hero-art promo" aria-hidden="true"><svg aria-hidden="true" focusable="false" viewBox="0 0 132 132"><circle cx="70" cy="72" r="48" fill="#fff" opacity=".45"/><rect x="38" y="66" width="60" height="44" rx="7" fill="#e1251b"/><rect x="33" y="52" width="70" height="18" rx="6" fill="#f2553a"/><rect x="62" y="52" width="12" height="58" fill="#ffc94a"/><path d="M68 52c-7-13-25-15-25-5 0 7 13 7 25 5z M68 52c7-13 25-15 25-5 0 7-13 7-25 5z" fill="none" stroke="#ffc94a" stroke-width="5" stroke-linejoin="round"/><path d="M26 34l2.4 6.6L35 43l-6.6 2.4L26 52l-2.4-6.6L17 43l6.6-2.4z" fill="#ffc94a"/><path d="M108 26l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#fff"/><path d="M112 92l1.3 3.7 3.7 1.3-3.7 1.3-1.3 3.7-1.3-3.7-3.7-1.3 3.7-1.3z" fill="#ffc94a"/><circle cx="22" cy="86" r="3" fill="#fff" opacity=".9"/><circle cx="98" cy="14" r="2.5" fill="#ffc94a"/></svg></div>') + '</div>' +
    '<div class="o-sc">' + order.map(sc).join('') + '<span class="o-sc-div" aria-hidden="true"></span><button class="sc" data-a="go" data-v="more"><span class="sc-ic grey">' + ic('cog', 22) + '</span><span class="sc-t">Customise</span><span class="lvl">Ordered by use</span></button></div>' +
    '<div class="o-tabs" role="group" aria-label="Accounts"><button class="o-eye" data-a="hideBal" aria-label="' + (S.hideBal ? 'Show balance' : 'Hide balance') + '" aria-pressed="' + !!S.hideBal + '">' + ic('eye', 18) + '</button><span class="o-pill on">Accounts</span><span class="o-pill">Cards</span><span class="o-pill">Investments</span><span class="o-pill">Loans</span></div>' +
    '<div class="pad" style="padding-top:4px">' +
    '<div class="o-acct"><div class="row" style="gap:12px"><span class="o-360">360</span><div style="flex:1"><div style="font-weight:700">' + t('acct_name') + '</div><div class="small muted sensitive">6xx-xxxxx3-001</div></div>' + ic('chevron', 18) + '</div>' +
    '<div class="kv"><span>' + t('avail') + '</span><span class="sensitive" style="font-weight:800">' + (S.hideBal ? 'S$ ••••••' : money(S.balance)) + '</span></div>' +
    (S.locked ? '<div class="kv"><span>Locked with Money Lock</span><span class="sensitive">' + money(S.locked) + '</span></div><button class="o-safe" data-a="atmOpen"><span>' + ic('pin', 16) + ' Unlock at an OCBC ATM</span>' + ic('chevron', 16) + '</button>' : '') + (typeof safeRow === 'function' ? safeRow() : '') + '</div>' +
    setupCard() + (typeof forYou === 'function' ? forYou() : '') + callBanner() + pendingCard() + suggestionCard() + heldCard() + lifeCard() + whyChips() +
    '<div class="qa" style="grid-template-columns:1fr 1fr;margin:4px 0 12px"><button data-a="go" data-v="chatbank" style="flex-direction:row;min-height:60px;gap:10px;padding:10px 12px;text-align:left"><span class="ic">' + ic('chat') + '</span>Chat with your account</button><button data-a="copilotStart" style="flex-direction:row;min-height:60px;gap:10px;padding:10px 12px;text-align:left"><span class="ic">' + ic('family') + '</span>Ask family to help</button></div>' +
    (calm ? '' : '<div class="promo-row promo">' + promo('SAVINGS GOAL', 'Stay on track and make your plans happen', 'View goals') + promo('MONEY INSIGHTS', 'See where your money went this month', 'Take a look', 'insights') + '</div>') +
    (firstNew ? '<div class="card row" style="margin-top:4px"><span class="ic" style="color:var(--red)">' + ic('learn', 28) + '</span><div style="flex:1"><h3>' + esc(taskName(firstNew.id)) + '</h3><div class="small muted">' + esc(tx(firstNew.learn)) + '</div></div><button class="btn secondary" data-a="startPractice" data-v="' + firstNew.id + '">' + t('practice') + '</button></div>' : '') +
    '<div class="card"><div class="between"><h2>' + t('conf_title') + '</h2><button class="linkbtn" data-a="go" data-v="confidence">' + t('edit') + '</button></div>' +
    '<div class="conf-mini">' + TASKS.map(x => '<span class="cm" title="' + esc(levelLabel(S.confidence[x.id])) + '"><span>' + esc(taskShort(x.id)) + '</span>' + dots(S.confidence[x.id]) + '<span class="sr-only">' + levelLabel(S.confidence[x.id]) + '</span></span>').join('') + '</div></div>' +
    '<div class="card"><h2>' + t('recent') + '</h2>' + S.txns.slice(0, 4).map(x => '<div class="kv tx"><span class="tx-av' + (x.amt < 0 ? '' : ' in') + '" aria-hidden="true">' + (typeof txIcon === 'function' ? txIcon(x) : ic('arrow', 18)) + '</span><span class="tx-m"><span class="tx-w">' + esc(typeof txMain === 'function' ? txMain(x) : x.what) + '</span><span class="tx-d">' + esc(typeof txSub === 'function' ? txSub(x) : x.d) + '</span></span><span class="tx-a" style="color:' + (x.amt < 0 ? 'var(--ink)' : 'var(--green)') + '">' + (x.amt < 0 ? '-' : '+') + money(Math.abs(x.amt)) + '</span></div>').join('') + '</div>' +
    '</div>';
}

/* ---------- Pay & Transfer ---------- */
function payTile(a, v, icon, label, task) {
  const sub = task ? '<span class="lvl">' + (engineCompose(task).layout === 'quick' ? 'Quick form' : 'Step by step') + '</span>' : '';
  return '<button class="pt" data-a="' + a + '" data-v="' + v + '"><span class="pt-ic">' + ic(icon, 22) + '</span>' + esc(label) + sub + '</button>';
}
function viewPay() {
  return '<div class="o-pagehead"><h1 id="screen-title" tabindex="-1">Payments &amp; Transfers</h1><div class="row" style="gap:8px;flex-wrap:wrap"><button class="o-say" data-a="voiceOpen">' + ic('mic', 16) + ' Say a payment</button>' + helperHeadBtn() + '</div><div class="o-pagehead-art" aria-hidden="true"><svg aria-hidden="true" focusable="false" viewBox="0 0 128 128"><circle cx="66" cy="64" r="50" fill="#fff" opacity=".65"/><circle cx="50" cy="74" r="26" fill="#ffc94a"/><circle cx="50" cy="74" r="18.5" fill="none" stroke="#e9a530" stroke-width="3"/><path d="M50 63v22M44 68.5c0-2.5 2.6-4 6-4s6 1.5 6 3.6c0 5.4-12 2.6-12 8.4 0 2.2 2.6 3.8 6 3.8s6-1.5 6-4" fill="none" stroke="#c9861c" stroke-width="2.6" stroke-linecap="round"/><circle cx="84" cy="50" r="22" fill="#e1251b"/><path d="M74 45h17l-4.5-4.5M94 55H77l4.5 4.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M106 92l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z" fill="#7b5cd6"/><circle cx="22" cy="40" r="4" fill="#7b5cd6" opacity=".55"/></svg></div></div>' +
    '<div class="o-tiles">' + payTile('startTask', 'scan', 'scan', 'Scan', 'scan') + payTile('payChooser', '', 'phone', 'PayNow', null) + payTile('startTask', 'newpayee', 'local', 'Local', 'newpayee') + payTile('startTask', 'overseas', 'globe', 'Overseas', 'overseas') + payTile('startTask', 'giro', 'bills', 'Bills', 'giro') + '</div>' +
    (S.payChooser ? '<div class="pad" style="padding-bottom:0"><div class="list" role="group" aria-label="PayNow to"><button data-a="startTask" data-v="paynow"><span class="ic">' + ic('phone') + '</span><span class="grow"><span class="t1">PayNow to a mobile number</span><br><span class="t2">' + levelLabel(S.confidence.paynow) + '</span></span>' + ic('arrow', 18) + '</button><button data-a="startTask" data-v="uen"><span class="ic">' + ic('shop') + '</span><span class="grow"><span class="t1">PayNow to a business (UEN)</span><br><span class="t2">' + levelLabel(S.confidence.uen) + '</span></span>' + ic('arrow', 18) + '</button></div></div>' : '') +
    '<div class="pad">' + recentRow() + callBanner() +
    (S.settings.calm ? '' : '<div class="promo-card promo" style="margin-bottom:12px"><div class="promo-t">Share the joy this festive season</div><div class="small muted">Send festive packets instantly using PayNow mobile number transfer</div></div>') +
    '<h2 class="o-h2">Manage</h2><div class="o-list">' +
    '<button data-a="go" data-v="payees"><span>Payee list</span>' + ic('chevron', 18) + '</button>' +
    '<button data-a="startTask" data-v="moneylock"><span>Use Money Lock</span>' + ic('chevron', 18) + '</button>' +
    '<button data-a="atmOpen"><span>Find an OCBC ATM</span>' + ic('chevron', 18) + '</button>' +
    '<button data-a="loginQuick" data-v="sched"><span>Scheduled transfers</span>' + ic('chevron', 18) + '</button>' +
    '<button data-a="loginQuick" data-v="limits"><span>Transaction limits</span>' + ic('chevron', 18) + '</button>' +
    '<button data-a="startTask" data-v="giro"><span>GIRO services</span>' + ic('chevron', 18) + '</button></div>' +
    '<h2 class="o-h2">Every task, opened the way you need it</h2><div class="list">' + TASKS.map(x => '<button data-a="startTask" data-v="' + x.id + '"><span class="ic">' + ic(x.icon) + '</span><span class="grow"><span class="t1">' + esc(taskName(x.id)) + '</span><br><span class="t2">' + levelLabel(S.confidence[x.id]) + ' · ' + (engineCompose(x.id).layout === 'quick' ? t('quick') : t('guided')) + '</span></span>' + ic('arrow', 18) + '</button>').join('') + '</div></div>';
}

/* ---------- Plan ---------- */
function viewPlan() {
  const done = TASKS.filter(x => S.practiced[x.id]).length;
  const card = (k, title, body, a, v, link) => '<button class="pl-card" data-a="' + a + '" data-v="' + v + '"><span class="small pl-k">' + esc(k) + '</span><span class="pl-t">' + esc(title) + '</span><span class="small muted">' + esc(body) + '</span><span class="pl-l">' + esc(link) + '</span></button>';
  return '<div class="o-pagehead plain"><h1 id="screen-title" tabindex="-1">Plan your finances</h1><div class="small muted">Manage, protect, build and grow your money.</div></div><div class="pad">' +
    '<div class="pl-grid">' +
    card('LEARN', 'Practice Hub', done + ' of ' + TASKS.length + ' practised. Pretend money only.', 'go', 'learn', 'Practise a task') +
    card('CONFIDENCE', 'Confidence Map', 'How much help each task gives you', 'go', 'confidence', 'Change levels') +
    card('LIFE MOMENTS', S.lifeMoment ? (LIFE.find(x => x.id === S.lifeMoment) || {}).title || 'Life Moments' : 'Life Moments', 'Tell us about a change, if you want', 'go', 'life', 'Choose a moment') +
    card('SAFETY', 'Spot the scam', 'Four real-looking messages to test yourself', 'openDrill', '0', 'Start') +
    '</div>' +
    '<button class="pl-card ml-plan" data-a="go" data-v="msgcheck"><span class="ml-plan-ic" aria-hidden="true">' + ic('shield', 24) + '</span><span class="ml-plan-txt"><span class="small pl-k">ON-DEVICE AI</span><span class="pl-t">Check a message</span><span class="small muted">Not sure about an SMS or WhatsApp? A model on your phone checks it for scam patterns.</span></span>' + ic('chevron', 18) + '</button>' +
    (typeof planInsights === 'function' ? planInsights() : '') + '</div>';
}

/* ---------- Rewards (synthetic) ---------- */
function viewRewards() {
  const tab = S.rewardsTab || 'deals';
  const cats = [['plate', 'Food and groceries'], ['shop', 'Shopping'], ['plane', 'Travel'], ['heart', 'Wellness']];
  return '<div class="o-pagehead plain"><h1 id="screen-title" tabindex="-1">Rewards</h1></div><div class="pad">' +
    '<div class="card between"><div><div style="font-weight:800">0 reward points</div><div class="small muted">Demo content only</div></div><span class="ic" style="color:var(--red)">' + ic('gift', 28) + '</span></div>' +
    '<div class="seg" role="group" aria-label="Rewards"><button data-a="rewardsTab" data-v="deals" aria-pressed="' + (tab === 'deals') + '">Deals</button><button data-a="rewardsTab" data-v="redeem" aria-pressed="' + (tab === 'redeem') + '">Redeem</button></div>' +
    (tab === 'deals' ? '<div class="pl-grid" style="margin-top:12px">' + cats.map(c => '<div class="pl-card"><span class="ic" style="color:var(--red)">' + ic(c[0], 24) + '</span><span class="pl-t">' + esc(c[1]) + '</span></div>').join('') + '</div>' : '<div class="empty" style="margin-top:12px">Nothing to redeem yet.</div>') +
    '<p class="small muted">In Calm mode, deals and promotions are hidden across the app.</p></div>';
}

/* ---------- More (OCBC structure, all our features inside) ---------- */
function moreHead() {
  return '<div class="o-redhead"><span class="o-redhead-t" id="screen-title" tabindex="-1">' + t('nav_more') + '</span><button class="iconbtn" style="color:#fff" data-a="callUs" aria-label="Call us">' + ic('headset') + '</button>' + helperHeadBtn('onred') + '<button class="o-logout white" data-a="logout">Logout</button></div>' +
    (S.callSheet ? '<div class="pad" style="padding-bottom:0"><div class="card"><h2>Call us</h2><p class="small muted" style="margin-top:0">Phoning OCBC? Get a help code first, so the officer sees where you got stuck without you explaining again.</p><button class="btn dark block" data-a="helpCode">Get a help code</button><div class="small muted" style="margin-top:8px">Hotline numbers are on the back of your card and on ocbc.com.</div></div></div>' : '');
}

/* ---------- PayNow Recent + payment history chat (inspired by Revolut) ---------- */
const TH_TEXT = {
  recent: Q('Recent', '最近', 'Terkini', 'சமீபத்தியவை'),
  sendMoney: Q('Send money', '转账', 'Hantar wang', 'பணம் அனுப்பு'),
  again: Q('Send again', '再转一次', 'Hantar lagi', 'மீண்டும் அனுப்பு'),
  sent: Q('Sent', '已转出', 'Dihantar', 'அனுப்பப்பட்டது'),
  received: Q('Received', '已收到', 'Diterima', 'பெறப்பட்டது'),
  history: Q('Payment history', '交易记录', 'Sejarah bayaran', 'பணம் செலுத்திய வரலாறு'),
  never: Q('You have never paid this person. Check the name before you send.', '您从未转账给此人。转账前请核对名字。', 'Anda tidak pernah membayar orang ini. Semak nama sebelum menghantar.', 'இவருக்கு நீங்கள் இதுவரை பணம் அனுப்பியதில்லை. அனுப்பும் முன் பெயரைச் சரிபார்க்கவும்.'),
  tip: Q('This shows every PayNow between you and this person. Your payments are on the right. Money they sent you is on the left.', '这里显示您和此人之间的每一笔PayNow。右边是您转出的钱，左边是对方转给您的钱。', 'Ini menunjukkan setiap PayNow antara anda dan orang ini. Bayaran anda di sebelah kanan. Wang yang mereka hantar di sebelah kiri.', 'உங்களுக்கும் இவருக்கும் இடையிலான ஒவ்வொரு PayNow பரிவர்த்தனையும் இங்கே உள்ளது. நீங்கள் அனுப்பியவை வலப்பக்கம், அவர் அனுப்பியவை இடப்பக்கம்.'),
  check: Q('You will still see the check screen before anything is sent.', '转账前仍会显示核对页面。', 'Anda masih akan melihat skrin semakan sebelum apa-apa dihantar.', 'எதுவும் அனுப்பப்படுவதற்கு முன் சரிபார்ப்புத் திரை காட்டப்படும்.')
};
function thKey(mobile) { return String(mobile || '').replace(/\D/g, ''); }
function thDay(iso) { return Date.parse(iso + 'T12:00:00+08:00') + (Date.now() - 3 * 864e5 - Date.parse('2026-10-30T12:00:00+08:00')); }
function seedThreads(p) {
  const seeds = [
    [['2026-10-12', 'out', 100, 'Allowance'], ['2026-10-19', 'in', 25.5, 'Groceries share'], ['2026-10-26', 'out', 20, 'Lunch'], ['2026-10-30', 'out', 50, 'Groceries']],
    [['2026-10-05', 'out', 30, 'Dinner'], ['2026-10-21', 'in', 12, 'Kopi'], ['2026-10-28', 'out', 15.8, 'Movie tickets']],
    [['2026-10-09', 'in', 40, 'Birthday'], ['2026-10-24', 'out', 18, 'Bubble tea']]
  ];
  S.threads = {};
  (p.contacts || []).forEach((c, i) => {
    const k = thKey(c.mobile);
    S.threads[k] = /day/.test(c.since || '') ? [] : (seeds[i] || seeds[2]).map((s, j) => ({ id: 'seed' + i + j, ts: thDay(s[0]), dir: s[1], amt: s[2], note: s[3], status: 'sent' }));
  });
}
function thContact(k) {
  const i = S.contacts.findIndex(c => thKey(c.mobile) === k);
  if (i >= 0) { const c = S.contacts[i]; return { i, name: c.name.split(' (')[0], full: c.name, mobile: c.mobile, masked: paynowName(c), since: c.since, family: c.family }; }
  const m = k.replace(/(\d{4})(\d{4})/, '$1 $2');
  return { i: -1, name: m, full: 'Mobile number ' + m, mobile: m, masked: paynowMobileName(k), since: null, family: false };
}
function thRecent() {
  if (!S.threads) return [];
  return Object.keys(S.threads).filter(k => S.threads[k].some(x => x.dir === 'out')).map(k => ({ k, last: S.threads[k].reduce((a, b) => (b.ts > a.ts ? b : a)) }))
    .sort((a, b) => b.last.ts - a.last.ts).slice(0, 6);
}
function thWhen(ts) {
  const d = new Date(ts), today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today, ' + d.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' });
  return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });
}
function recentRow() {
  const r = thRecent(); if (!r.length) return '';
  return '<div class="th-recent"><div class="th-recent-h">' + esc(tx(TH_TEXT.recent)) + '</div><div class="th-recent-row" role="list">' +
    r.map(x => { const c = thContact(x.k); return '<button class="th-person" role="listitem" data-a="threadOpen" data-v="' + x.k + '" aria-label="' + esc(c.name + ', ' + tx(TH_TEXT.history) + ', last ' + money(x.last.amt) + ' on ' + thWhen(x.last.ts)) + '">' + (c.i >= 0 ? avatar(c.full, 48) : silhouette(48)) + '<span class="th-pn">' + esc(c.name) + '</span><span class="th-pl">' + (x.last.dir === 'out' ? '-' : '+') + money(x.last.amt) + '</span></button>'; }).join('') +
    '</div></div>';
}
function viewThread() {
  const k = S.thread, c = thContact(k), items = (S.threads[k] || []).slice().sort((a, b) => a.ts - b.ts);
  const sentTotal = items.filter(x => x.dir === 'out' && x.status === 'sent').reduce((a, b) => a + b.amt, 0);
  const gotTotal = items.filter(x => x.dir === 'in').reduce((a, b) => a + b.amt, 0);
  const full = (S.flow ? isFullGuidance() : engineCompose('paynow').explain === 'full') || S.settings.simple;
  let body = '', lastDay = '';
  items.forEach(x => {
    const day = new Date(x.ts).toDateString() === new Date().toDateString() ? 'Today' : new Date(x.ts).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'long' });
    if (day !== lastDay) { body += '<div class="th-day">' + esc(day) + '</div>'; lastDay = day; }
    const st = x.status === 'pending' ? 'Not paid yet' + (x.pid ? ' · <span data-countdown="' + x.pid + '">' + fmtLeft(pendingLeft(S.pending.find(p => p.id === x.pid) || { until: 0 })) + '</span> to undo' : '')
      : x.status === 'undone' ? 'Undone. Nothing was sent' : x.status === 'held' ? 'Held by your cooling time' : (x.dir === 'out' ? tx(TH_TEXT.sent) : tx(TH_TEXT.received)) + ' · ' + esc(thWhen(x.ts));
    body += '<div class="th-msg ' + x.dir + (x.status === 'undone' ? ' undone' : '') + (x.status === 'pending' ? ' pending' : '') + '"><div class="th-amt">' + (x.dir === 'out' ? '-' : '+') + money(x.amt) + '</div>' + (x.note ? '<div class="th-note">' + esc(x.note) + '</div>' : '') + '<div class="th-st">' + st + '</div></div>';
  });
  if (!items.length) body = '<div class="banner warn" role="note" style="margin:16px">' + ic('alert') + '<div><b>Someone new</b>' + esc(tx(TH_TEXT.never)) + '</div></div>';
  const agains = [...new Set(items.filter(x => x.dir === 'out' && x.status === 'sent').map(x => x.amt).reverse())].slice(0, 3);
  const say = c.name + '. ' + (items.length ? 'You have sent ' + money(sentTotal) + ' and received ' + money(gotTotal) + '. ' + tx(TH_TEXT.tip) : tx(TH_TEXT.never));
  return '<div class="th-wrap" role="dialog" aria-modal="true" aria-labelledby="th-title">' +
    '<div class="th-head"><button class="iconbtn" data-a="threadClose" aria-label="' + t('back') + '">' + ic('back') + '</button>' + (c.i >= 0 ? avatar(c.full, 40) : silhouette(40)) +
    '<div style="flex:1;min-width:0"><div id="th-title" tabindex="-1" class="th-name">' + esc(c.name) + '</div><div class="small muted">' + esc(c.mobile) + ' · PayNow: ' + esc(c.masked) + '</div></div>' +
    '<button class="iconbtn" data-a="speakText" data-v="' + esc(say) + '" aria-label="Read aloud">' + ic('speaker', 20) + '</button></div>' +
    (items.length ? '<div class="th-sum"><span>' + esc(tx(TH_TEXT.sent)) + ' <b>' + money(sentTotal) + '</b></span><span>' + esc(tx(TH_TEXT.received)) + ' <b>' + money(gotTotal) + '</b></span>' + (c.family ? '<span>Saved as family' + (c.since ? ' ' + esc(c.since) : '') + '</span>' : '') + '</div>' : '') +
    (full && items.length ? '<div class="banner info" style="margin:10px 12px 0">' + ic('info') + '<div>' + esc(tx(TH_TEXT.tip)) + '</div></div>' : '') +
    '<div class="th-body" id="th-body" aria-live="polite">' + body + '</div>' +
    '<div class="th-foot">' + (agains.length ? '<div class="th-again" role="group" aria-label="' + esc(tx(TH_TEXT.again)) + '"><span class="small muted">' + esc(tx(TH_TEXT.again)) + ':</span>' + agains.map(a => '<button class="pill" data-a="threadPay" data-v="' + k + '|' + a + '">' + money(a) + '</button>').join('') + '</div>' : '') +
    '<button class="btn primary block" data-a="threadPay" data-v="' + k + '|">' + esc(tx(TH_TEXT.sendMoney)) + '</button><div class="small muted" style="text-align:center;margin-top:6px">' + esc(tx(TH_TEXT.check)) + '</div></div></div>';
}
function threadRecord(f) {
  if (!S.threads || f.task !== 'paynow' || f.practice) return;
  const d = f.data, to = String(d.to || '');
  const k = to.startsWith('c:') ? thKey((S.contacts[Number(to.slice(2))] || {}).mobile) : thKey(to.slice(7));
  if (!k) return;
  (S.threads[k] = S.threads[k] || []).push({ id: 'T' + Date.now(), ts: Date.now(), dir: 'out', amt: Number(d.amount) || 0, note: d.ref || '', status: f.pendingId ? 'pending' : f.heldAt ? 'held' : 'sent', pid: f.pendingId || null });
}
function threadSettle(pid, status) {
  if (!S.threads) return;
  Object.values(S.threads).forEach(list => list.forEach(x => { if (x.pid === pid) x.status = status; }));
}
const THREAD_ACTIONS = {
  threadOpen(k) { S.thread = k; S.helper.open = false; stopSpeak(); track('thread_open', {}); },
  threadClose() { S.thread = null; stopSpeak(); },
  threadPay(v) {
    const [k, amt] = v.split('|'); const c = thContact(k);
    if (!S.flow || S.flow.task !== 'paynow' || S.flow.stage !== 'steps') startFlow('paynow', false);
    const f = S.flow;
    f.data.to = c.i >= 0 ? 'c:' + c.i : 'mobile:' + k;
    if (amt) f.data.amount = amt;
    if (f.mode !== 'quick') { const idx = flowSteps().findIndex(s => s.id === 'amount'); if (idx > 0) f.step = idx; }
    f.err = null; S.thread = null;
    addLog('Paying ' + c.name + ' from payment history' + (amt ? ', ' + money(Number(amt)) + ' again' : ''), 'You chose it from Recent. The check screen still comes before anything is sent', 'you');
  }
};

/* ---------- Read aloud: numbers read digit by digit, and tap again to stop (build 2.2) ---------- */
const STOP_TEXT = Q('Stop', '停止', 'Berhenti', 'நிறுத்து');
// Phone numbers, account numbers, UENs and codes are read one digit at a time ("9 1 2 3, 4 5 6 7"),
// never as "nine thousand one hundred and twenty-three". Money amounts (S$1,000.00) are left as they are.
function spellDigits(s) { return s.replace(/\s|-/g, '').split('').join(' '); }
function spokenNumbers(text) {
  let s = String(text);
  // +65 9123 4567, 9123 4567, 9123-4567, 91234567
  s = s.replace(/(\+65[\s-]?)?(?<![\w$.,])([3689]\d{3})[\s-]?(\d{4})(?!\w|[.,]\d)/g, (m, cc, a, b) => (cc ? 'plus 6 5, ' : '') + spellDigits(a) + ', ' + spellDigits(b));
  // UENs such as 53312345A or 202499999Z
  s = s.replace(/(?<![\w$.,])(\d{8,9})([A-Z])(?![\w])/g, (m, d, l) => spellDigits(d) + ' ' + l);
  // help codes, OTPs and PINs: "code 3861"
  s = s.replace(/\b(code|OTP|PIN)(\s*(?:is\s*)?[:#]?\s*)(\d{3,8})\b/gi, (m, w, sep, d) => w + sep.replace(/[:#]/g, ' ') + spellDigits(d));
  // any other run of 5 or more digits (account numbers), not money
  s = s.replace(/(?<![\w$.,])(\d{5,})(?!\w|[.,]\d)/g, (m, d) => spellDigits(d));
  return s;
}
let SPEAK_KEY = null, SPEAK_ID = 0;
function speak(text, key) {
  if (!('speechSynthesis' in window) || !text) return false;
  try {
    window.speechSynthesis.cancel();
    const id = ++SPEAK_ID;
    const u = new SpeechSynthesisUtterance(spokenNumbers(String(text).replace(/<[^>]+>/g, '')));
    const lang = LANGS.find(l => l.code === S.settings.lang);
    u.lang = lang ? lang.speech : 'en-SG';
    u.rate = S.passport.patient ? 0.85 : 0.95;
    if (typeof abVoice === 'function') { const vv = abVoice(u.lang); if (vv) u.voice = vv; }
    const done = () => { if (id === SPEAK_ID) { SPEAK_KEY = null; markSpeakButtons(); } };
    u.onend = done; u.onerror = done;
    SPEAK_KEY = key || null;
    window.speechSynthesis.speak(u);
    markSpeakButtons();
    return true;
  } catch (e) { return false; }
}
function stopSpeak() {
  SPEAK_ID++; SPEAK_KEY = null;
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  markSpeakButtons();
}
function markSpeakButtons() {
  document.querySelectorAll('[data-a="speakText"]').forEach(b => {
    const on = SPEAK_KEY !== null && b.dataset.v === SPEAK_KEY;
    if (on && !b.dataset.orig) {
      b.dataset.orig = b.innerHTML; b.dataset.origLabel = b.getAttribute('aria-label') || '';
      const hadText = b.textContent.trim().length > 0;
      b.innerHTML = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="2" fill="currentColor"/></svg>' + (hadText ? ' ' + esc(tx(STOP_TEXT)) : '');
      b.setAttribute('aria-label', tx(STOP_TEXT) + ' reading'); b.setAttribute('aria-pressed', 'true'); b.classList.add('speaking');
    } else if (!on && b.dataset.orig) {
      b.innerHTML = b.dataset.orig; delete b.dataset.orig;
      if (b.dataset.origLabel) b.setAttribute('aria-label', b.dataset.origLabel); else b.removeAttribute('aria-label');
      delete b.dataset.origLabel; b.removeAttribute('aria-pressed'); b.classList.remove('speaking');
    }
  });
}
const SPEECH_ACTIONS = {
  speakText(v) {
    if (SPEAK_KEY !== null && SPEAK_KEY === v) { stopSpeak(); track('read_aloud_stop', {}); return; }
    if (!speak(v, v)) toast('Read aloud is not available in this browser.');
  }
};

/* ==========================================================
   Rendering, actions and event wiring
   ========================================================== */
let lastKey = '', stuckTimer = null, toastTimer = null;

function navActive() {
  if (['home', 'chatbank'].includes(S.screen)) return 'home';
  if (['pay'].includes(S.screen)) return 'pay';
  if (['plan', 'learn', 'drill', 'msgcheck', 'insights'].includes(S.screen)) return 'plan';
  if (S.screen === 'atms') return 'pay';
  if (['rewards'].includes(S.screen)) return 'rewards';
  if (['more', 'passport', 'confidence', 'safety', 'log', 'life', 'payees', 'copilotSetup', 'adaptations', 'helpcode'].includes(S.screen)) return 'more';
  return '';
}

function screenBody() {
  switch (S.screen) {
    case 'login': return viewLogin();
    case 'plan': return viewPlan();
    case 'rewards': return viewRewards();
    case 'onboarding': return viewOnboarding();
    case 'home': return viewHome();
    case 'pay': return viewPay();
    case 'learn': return viewLearn();
    case 'drill': return viewDrill();
    case 'more': return viewMore();
    case 'passport': return viewPassport();
    case 'confidence': return viewConfidence();
    case 'safety': return viewSafety();
    case 'log': return viewLog();
    case 'life': return viewLife();
    case 'payees': return viewPayees();
    case 'copilotSetup': return viewCopilotSetup();
    case 'chatbank': return viewChatBank();
    case 'adaptations': return viewAdaptations();
    case 'helpcode': return viewHelpCode();
    case 'insights': return typeof viewInsights === 'function' ? viewInsights() : viewHome();
    case 'atms': return typeof viewAtms === 'function' ? viewAtms() : viewHome();
    case 'msgcheck': return typeof viewMsgCheck === 'function' ? viewMsgCheck() : viewHome();
    case 'flow': return S.flow ? viewFlow() : viewHome();
    default: return viewHome();
  }
}

function phoneInner() {
  const red = S.screen === 'onboarding' || S.screen === 'more';
  const showNav = !['onboarding', 'flow', 'login'].includes(S.screen);
  const act = navActive();
  const nb = (k, icon, label) => '<button data-a="go" data-v="' + k + '"' + (act === k ? ' aria-current="page"' : '') + '>' + ic(icon) + label + '</button>';
  let h = '<div class="notch" aria-hidden="true"></div><div class="statusbar ' + (red ? 'red' : '') + '" aria-hidden="true"><span class="sb-time">9:41</span><span class="sb-icons"><svg aria-hidden="true" focusable="false" width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4c2.4 0 4.6.9 6.2 2.5l1.3-1.4A10.6 10.6 0 008 .4 10.6 10.6 0 00.5 3.5l1.3 1.4A8.7 8.7 0 018 2.4zm0 3.7c1.4 0 2.6.5 3.6 1.4l1.3-1.4A7 7 0 008 4.2a7 7 0 00-4.9 1.9l1.3 1.4C5.4 6.6 6.6 6.1 8 6.1zm0 3.4c.6 0 1.1.2 1.5.6L8 11.7 6.5 10.1c.4-.4.9-.6 1.5-.6z"/></svg><svg aria-hidden="true" focusable="false" width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><path d="M24.5 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span></div>';
  h += copilotBanner();
  if (G.faceId) h += '<div class="faceid" aria-hidden="true"><div class="faceid-box"><svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M4 18V10a6 6 0 0 1 6-6h8M46 4h8a6 6 0 0 1 6 6v8M60 46v8a6 6 0 0 1-6 6h-8M18 60h-8a6 6 0 0 1-6-6v-8M22 24v4M42 24v4M32 26v10h-3M24 44c4 3 12 3 16 0"/></svg><span>Face ID</span></div></div>';
  if (S.toast) h += '<div class="banner info toast-n" role="status" style="position:absolute;top:50px;left:12px;right:12px;z-index:45;box-shadow:var(--shadow)">' + ic('info') + '<div>' + esc(S.toast) + '</div></div>';
  const body = screenBody();
  const hasHelperBtn = body.indexOf('data-a="openHelper"') !== -1;
  h += '<main class="content" id="content">' + body + '</main>';
  if (showNav) {
    h += '<nav class="bottomnav o-nav" aria-label="Main">' + nb('home', 'home', t('nav_home')) + nb('plan', 'plan', t('nav_plan')) +
      '<button class="o-paynav" data-a="go" data-v="pay"' + (act === 'pay' ? ' aria-current="page"' : '') + '><span class="o-paynav-ic">' + ic('transfer', 24) + '</span>' + t('nav_paytransfer') + '</button>' +
      nb('rewards', 'gift', t('nav_rewards')) + nb('more', 'more', t('nav_more')) + '</nav>';
  }
  const fabBottom = showNav ? 98 : (S.screen === 'flow' ? 96 : 20);
  if (!hasHelperBtn && S.screen !== 'flow' && S.screen !== 'chatbank' && S.screen !== 'login') h += '<button class="fab" style="bottom:' + fabBottom + 'px" data-a="openHelper" aria-label="' + t('ask_helper') + '">' + ic('chat', 20) + t('helper') + '</button>';
  if (S.nudge && !S.helper.open) {
    h += '<div class="nudge" role="status" style="bottom:' + (fabBottom + 60) + 'px"><div style="font-weight:600;margin-bottom:8px">' + t('stuck') + '</div><div class="row" style="flex-wrap:wrap;gap:6px"><button class="pill" data-a="nudgeExplain">' + t('explain_screen') + '</button>' +
      (S.flow && !S.flow.practice ? '<button class="pill" data-a="startPractice" data-v="' + S.flow.task + '">' + t('practice') + '</button>' : '') + '<button class="pill" data-a="nudgeClose">' + t('close') + '</button></div><div class="small muted" style="margin-top:6px">You can turn these offers off in your Passport.</div></div>';
  }
  if (S.thread && S.threads) h += viewThread();
  if (S.helper.open) h += viewHelper();
  if (S.modal === 'pause' && S.flow) h += viewPauseModal();
  h += '<div class="concept" aria-hidden="true">Concept prototype · synthetic data</div>';
  return h;
}

function keepInputVisible(content) {
  // The part to fix: the last box or button after the error note (text box, choice buttons)
  const pad = content.querySelector('.pad');
  const warn = pad && pad.querySelector('.banner.warn');
  let inp = null;
  if (pad && warn) {
    const after = [...pad.querySelectorAll('input, select, textarea, button')].filter(el => !warn.contains(el) && (warn.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
    inp = after[after.length - 1] || null;
  }
  if (!inp) inp = content.querySelector('.pad input, .pad select, .pad textarea');
  const foot = content.querySelector('.footer-actions');
  if (!inp) return;
  const cr = content.getBoundingClientRect(), ir = inp.getBoundingClientRect();
  const footH = foot ? foot.getBoundingClientRect().height : 0;
  const visibleBottom = cr.bottom - footH - 12;
  if (ir.bottom > visibleBottom) content.scrollTop += ir.bottom - visibleBottom;
}
function render() {
  const root = document.getElementById('app');
  const key = G.view + '|' + S.personaId + '|' + S.screen + '|' + (S.flow ? S.flow.task + S.flow.stage + S.flow.step + S.flow.mode : '') + '|' + (S.ob ? S.ob.step : '');
  const prevContent = document.getElementById('content');
  const prevScroll = prevContent ? prevContent.scrollTop : 0;
  const helperBody = document.getElementById('helper-body');
  document.body.classList.toggle('reduce-motion', !!S.settings.reduceMotion);
  document.body.classList.toggle('spacing', !!S.settings.spacing);

  let h = viewTopbar();
  if (G.view === 'app') {
    h += '<div class="stage">' + viewControls() + '<div><div class="phone ' + (S.settings.contrast ? 'hc' : '') + (S.settings.spacing ? ' sp' : '') + (S.settings.mode === 'text' && S.screen === 'flow' ? ' txt' : '') + (S.settings.scale >= 4 ? ' big' : '') + (S.settings.calm || liveOnNow() ? ' calm' : '') + '" id="cust-phone" lang="' + S.settings.lang + '"><div class="screen">' + phoneInner() + '</div></div></div>' + viewBehind().replace('<div class="side">', '<div class="side">' + (G.copilot && G.copilot.persona === S.personaId ? viewFamilyPanel() : '')) + '</div>';
  } else if (G.view === 'engine') h += viewEngine();
  else if (G.view === 'staff') h += viewStaff();
  else if (G.view === 'four') h += viewFour();
  else if (G.view === 'ml') h += (typeof viewML === 'function' ? viewML() : '');
  else h += viewDash();
  root.innerHTML = h;

  const content = document.getElementById('content');
  const changed = key !== lastKey;
  if (changed && lastKey && content && G.view === 'app' && !S.settings.reduceMotion) content.classList.add('enter');
  if (content) {
    content.style.scrollBehavior = 'auto';
    content.scrollTop = changed ? 0 : prevScroll;
    if (S.screen === 'flow' && S.flow && S.flow.stage === 'steps' && S.settings.mode === 'chat' && S.flow.mode === 'guided') content.scrollTop = content.scrollHeight;
    if (S.screen === 'chatbank') content.scrollTop = content.scrollHeight;
    // After a mistake, make sure the box to fix is not hidden behind the sticky Next button
    if (S.screen === 'flow' && S.flow && S.flow.stage === 'steps' && S.flow.mode === 'guided' && S.flow.err && S.settings.mode !== 'chat') keepInputVisible(content);
    if (S.screen === 'onboarding') {
      const sum = document.getElementById('ob-summary');
      content.scrollTop = sum ? sum.offsetTop - 12 : content.scrollHeight;
    }
    content.style.scrollBehavior = '';
  }
  const hb = document.getElementById('helper-body');
  if (hb) hb.scrollTop = hb.scrollHeight;

  if (G.view === 'dash') setTimeout(runAudit, 30);
  const fam = document.querySelector('#family-phone .screen'); if (fam) prepMirror(fam);
  if (changed && G.copilot) G.copilot.point = null;
  applyPointer();
  applyStaffRing();
  syncMirrorScroll();
  if (content && !content.dataset.sync) { content.dataset.sync = '1'; content.addEventListener('scroll', syncMirrorScroll); }

  // Focus management for keyboard and screen-reader users
  if (S.modal === 'pause') { const m = document.getElementById('pause-title'); if (m && changed) m.focus(); }
  else if (changed) {
    const ttl = document.getElementById('step-q') || document.getElementById('screen-title');
    if (ttl && G.view === 'app' && lastKey) { ttl.setAttribute('tabindex', '-1'); ttl.focus({ preventScroll: true }); }
    if (S.settings.readAloud || S.settings.mode === 'voice') readCurrent();
    if (S.dialect !== 'off' && G.view === 'app' && lastKey) {
      if (S.screen === 'flow' && S.flow) playDialect(S.flow.stage === 'review' ? 'review' : S.flow.stage === 'receipt' ? 'sent' : dialectKeyForStep(curStep()), true);
      else if (S.screen === 'onboarding') playDialect('welcome', true);
    }
  }
  lastKey = key;

  liveArmIdle();
  markSpeakButtons();
  { const tb = document.getElementById("th-body"); if (tb && !tb.dataset.scrolled) { tb.scrollTop = tb.scrollHeight; tb.dataset.scrolled = "1"; } }
  // "Seems stuck" offer: only if the customer allowed it
  clearTimeout(stuckTimer);
  if (G.view === 'app' && S.screen === 'flow' && S.flow && S.flow.stage === 'steps' && S.flow.mode === 'guided' && S.passport.offerHelp && !S.helper.open && !S.nudge) {
    stuckTimer = setTimeout(() => { if (S.screen === 'flow' && !S.helper.open) { S.nudge = true; track('stuck_offer', { task: S.flow.task }); render(); } }, S.passport.patient ? 40000 : 25000);
  }
}

function readCurrent() {
  if (S.screen === 'flow' && S.flow && S.flow.stage === 'steps') {
    const st = flowSteps()[S.flow.step];
    const lang = S.settings.lang;
    speak(tx(st.q) + '. ' + (st.x.simple[lang] || st.x.simple.en));
  } else if (S.screen === 'flow' && S.flow && S.flow.stage === 'review') {
    speak(reviewModel().teach);
  } else {
    const ttl = document.getElementById('screen-title');
    if (ttl) speak(ttl.textContent);
  }
}

function toast(msg) {
  S.toast = msg; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { S.toast = null; render(); }, 3500);
}

/* ---------------- Completing a task ---------------- */
function completeFlow() {
  const f = S.flow, task = f.task, d = f.data;
  const amt = Number(task === 'giro' ? d.limit : d.amount) || 0;
  const m = reviewModel();
  if (f.practice) {
    afterComplete(task, f.mode, f.errors, true);
    f.stage = 'receipt';
    return;
  }
  if (task === 'moneylock') {
    S.balance -= amt; S.locked = (S.locked || 0) + amt;
    S.txns.unshift({ d: 'Today', what: 'Locked with Money Lock', amt: -amt });
    addLog('Money Lock: ' + money(amt) + ' locked', 'You chose to lock it', 'safety');
  } else if (task === 'giro') {
    S.txns.unshift({ d: 'Today', what: 'GIRO set up: ' + d.org, amt: 0 });
  } else if ((coolingApplies(f) || f.forceHold)) {
    const hrs = f.forceHold ? 24 : S.safety.coolHours;
    const at = new Date(Date.now() + hrs * 3600e3).toLocaleString('en-SG', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    S.held.push({ amount: amt, to: m.to, at });
    f.heldAt = at;
    addLog('Transfer of ' + money(amt) + ' held ' + hrs + ' hours', f.forceHold ? 'You continued after the safety check, so it is held for 24 hours' : 'Your cooling time for new payees', 'safety');
  } else if (undoApplies(f)) {
    const fee = task === 'overseas' ? 10 : 0;
    const id = 'P' + Date.now();
    S.balance -= amt + fee;
    S.pending.push({ id, amount: amt, fee, to: m.to, what: taskName(task) + ' to ' + m.to, until: Date.now() + (S.undoSecs || 60) * 1000 });
    f.pendingId = id;
    addLog('Undo window: ' + money(amt) + ' to ' + m.to + ' waits ' + (S.undoSecs || 60) + ' seconds', 'Your undo setting (' + (S.undoMode === 'all' ? 'all transfers to people' : 'new people') + ')', 'safety');
    startUndoTicker();
  } else {
    const fee = task === 'overseas' ? 10 : 0;
    S.balance -= amt + fee;
    S.txns.unshift({ d: 'Today', what: taskName(task) + ' to ' + m.to, amt: -(amt + fee) });
  }
  if (task === 'uen') S.payees.push(String(d.uen).toUpperCase().trim());
  if (trustedApplies(f)) { f.trustedNotified = true; addLog(S.safety.trusted.name + ' notified', 'You set them as your trusted contact for transfers of ' + money(S.safety.trusted.min) + '+', 'safety'); }
  threadRecord(f);
  afterComplete(task, f.mode, f.errors, false, !!f.usedFull);
  f.stage = 'receipt';
}

function goToFirstInvalid() {
  const steps = flowSteps();
  for (let i = 0; i < steps.length; i++) { const e = validateStep(steps[i]); if (e) return { i, e }; }
  return null;
}

/* ---------------- Actions ---------------- */
const A = {
  view(v) { G.view = v; if (v === 'staff') G.tickets.forEach(x => { if (x.status === 'new') x.seen = true; }); },
  persona(id) { stopSpeak(); loadPersona(id); G.view = 'app'; lastKey = ''; },
  go(v) {
    stopSpeak();
    if (v === 'scan') return startFlow('scan', false);
    if (v === 'moneylockInfo') return startFlow('moneylock', false);
    S.flow = null; S.modal = null; S.nudge = false; S.helper.open = false; S.screen = v; S.thread = null;
  },
  back() {
    stopSpeak();
    if (S.screen === 'helpcode') S.screen = S.flow ? 'flow' : 'home';
    else if (['passport', 'confidence', 'safety', 'log', 'adaptations', 'life', 'payees'].includes(S.screen)) S.screen = 'more';
    else if (S.screen === 'drill') S.screen = 'learn';
    else if (S.screen === 'msgcheck' || S.screen === 'insights') S.screen = 'plan';
    else if (S.screen === 'atms') S.screen = 'pay';
    else if (S.screen === 'flow') { if (S.flow.stage === 'review') S.flow.stage = 'steps'; else if (S.flow.mode === 'guided' && S.flow.step > 0) S.flow.step--; else { S.flow = null; S.screen = 'home'; } }
    else S.screen = 'home';
  },
  startTask(id) { S.onboarded = true; startFlow(id, false); },
  startPractice(id) {
    const carry = S.flow && S.flow.task === id ? clone(S.flow.data) : {};
    startFlow(id, true); S.flow.data = carry; S.nudge = false;
  },
  practiceToReal() {
    const f = S.flow, data = clone(f.data), task = f.task;
    startFlow(task, false); S.flow.data = data;
    addLog(taskName(task) + ': practice details carried into the real task', 'So you do not have to type them again', 'event');
    const bad = goToFirstInvalid();
    if (bad) { S.flow.mode = 'guided'; S.flow.step = bad.i; S.flow.err = bad.e; } else S.flow.stage = 'review';
  },
  exitFlow() { stopSpeak(); const f = S.flow; if (f && f.restoreMode) S.settings.mode = f.restoreMode; S.flow = null; S.modal = null; S.nudge = false; S.screen = f && f.fromChat ? 'chatbank' : 'home'; if (f && f.fromChat) S.chatBank.push({ who: 'bot', text: 'Cancelled. Nothing was sent.' }); },
  finishFlow() { const f = S.flow; if (f && f.restoreMode) S.settings.mode = f.restoreMode; S.flow = null; S.screen = f && f.fromChat ? 'chatbank' : 'home'; if (f && f.fromChat) S.chatBank.push({ who: 'bot', text: f.practice ? 'Practice done.' : 'Done. ' + (f.pendingId ? 'You can still undo it from your home screen for a few seconds.' : 'Anything else?') }); },
  pick(v) {
    const [k, val] = v.split('|');
    S.flow.data[k] = val; S.flow.err = null;
    if (k === 'country' && S.flow.mode === 'guided') { /* quote recalculates on amount step */ }
  },
  nameNo() {
    track('name_mismatch', { task: S.flow.task });
    S.flow.err = { msg: 'Good call. Do not pay. Contact the business using a phone number you find yourself, on their website or a printed bill, not one from a message or caller.', fix: [{ label: 'Cancel this payment', a: 'exitFlow', v: '' }, { label: t('talk_person'), a: 'helperAsk', v: '__person' }] };
    addLog('Payment stopped at name check', 'You said the UEN name was not who you expected', 'safety');
  },
  ack(v, el) { S.flow.data.understand = el.checked ? 'yes' : ''; S.flow.err = null; },
  flowNext() {
    const f = S.flow, st = curStep(), e = validateStep(st);
    if (e) { f.err = e; f.errors++; track('step_error', { task: f.task, step: st.id }); const l = liveInit(f); l.fails[st.id] = (l.fails[st.id] || 0) + 1; if (l.fails[st.id] >= LIVE_RULES.fails) liveTrigger('fails', l.fails[st.id]); return; }
    f.err = null; S.nudge = false;
    if (f.step < flowSteps().length - 1) f.step++; else f.stage = 'review';
  },
  flowBack() { const f = S.flow; f.err = null; if (f.step > 0) f.step--; const l = liveInit(f); l.backs++; if (l.backs >= LIVE_RULES.backs) liveTrigger('backs'); },
  flowQuickNext() {
    const f = S.flow;
    for (const st of flowSteps()) { const e = validateStep(st); if (e) { f.err = e; f.errStep = st.id; f.errors++; track('step_error', { task: f.task, step: st.id }); const l = liveInit(f); l.fails[st.id] = (l.fails[st.id] || 0) + 1; if (l.fails[st.id] >= LIVE_RULES.fails) liveTrigger('fails', l.fails[st.id]); return; } }
    f.err = null; f.errStep = null; f.stage = 'review';
  },
  flowLayout(m) {
    const f = S.flow; if (f.mode === m) return;
    f.mode = m; f.err = null;
    if (m === 'guided') { const bad = goToFirstInvalid(); f.step = bad ? bad.i : 0; }
    addLog(taskName(f.task) + ': ' + (m === 'guided' ? t('guided') : t('quick')) + ' for this task only', 'You switched inside the task. Your Confidence Map is unchanged.', 'you');
    track('layout_switch', { task: f.task, to: m });
  },
  flowMode(m) { if (S.settings.mode === m) return; setSetting('mode', m, 'you'); addLog('Switched to ' + t('mode_' + m) + ' mid-task', 'Everything you entered was kept', 'event'); if (m === 'voice') setTimeout(readCurrent, 50); else stopSpeak(); },
  fixAmount(v) { const f = S.flow; const st = curStep(); f.data[st && st.id === 'limit' ? 'limit' : 'amount'] = v; f.err = null; },
  switchTask(task) { const amt = S.flow.data.amount; startFlow(task, false); S.flow.data.amount = amt; },
  reviewBack() { S.flow.stage = 'steps'; S.flow.step = S.flow.mode === 'guided' ? flowSteps().length - 1 : 0; },
  reviewYes() {
    const f = S.flow;
    if (needsPause(f) && !f.pausePassed) { S.modal = 'pause'; f.pause = {}; f.purpose = null; f.onPhone = null; if (!f.practice) track('pause_shown', { task: f.task, amount: f.data.amount }); return; }
    completeFlow();
  },
  pauseAns(v) { const [id, yn] = v.split(':'); S.flow.pause[id] = yn === '1'; },
  pauseContinue() { S.flow.pausePassed = true; S.modal = null; if (!S.flow.practice) track('pause_continue', { task: S.flow.task, purpose: S.flow.purpose }); completeFlow(); },
  pauseCancel() {
    if (!S.flow.practice) track('pause_cancel', { task: S.flow.task, purpose: S.flow.purpose });
    addLog('Transfer cancelled at the safety check', 'You chose to cancel. No money moved.', 'safety');
    S.modal = null; S.flow = null; S.screen = 'home'; toast('Transfer cancelled. No money has left your account.');
  },
  pauseLock() { track('pause_cancel', { task: S.flow.task }); S.modal = null; startFlow('moneylock', false); },
  pauseCall() { track('pause_team', { task: S.flow.task, purpose: S.flow.purpose }); S.flow.toTeam = true; S.modal = null; addLog('Transfer paused for the anti-scam team', 'You asked to talk to OCBC. No money moved.', 'safety'); openHelper(); helperAnswer('__person'); },
  pauseOverride() { S.flow.pausePassed = true; S.flow.forceHold = !S.flow.practice; S.modal = null; if (!S.flow.practice) track('pause_hold', { task: S.flow.task, purpose: S.flow.purpose }); completeFlow(); },
  pausePurpose(v) { S.flow.purpose = v; },
  pausePhone(v) { S.flow.onPhone = v === '1'; },
  askTrusted() {
    const f = S.flow; f.trustedAsked = true;
    addLog('Asked ' + S.safety.trusted.name + ' to check', 'You asked for a second look before sending', 'safety');
    setTimeout(() => { if (S.flow === f) { f.trustedReply = true; render(); } }, 3500);
  },
  cancelHeld(i) { const h = S.held.splice(Number(i), 1)[0]; addLog('Held transfer of ' + money(h.amount) + ' cancelled', 'You cancelled during your cooling time. No money moved.', 'safety'); toast('Cancelled. No money moved.'); },
  suggestYes() {
    const s = S.suggestion;
    if (s.kind === 'quick') setLevel(s.task, 'often', 'suggest');
    else setLevel(s.task, 'help', 'suggest');
    track('suggest_yes', { task: s.task, kind: s.kind }); S.suggestion = null;
  },
  suggestNo() { const s = S.suggestion; track('suggest_no', { task: s.task }); S.snooze[s.kind + ':' + s.task] = Date.now() + SNOOZE_MS; addLog('Suggestion hidden for 30 days: ' + taskName(s.task), 'You tapped Not now. Nothing changed.', 'suggest'); S.suggestion = null; },
  suggestNever() { const s = S.suggestion; track('suggest_never', { task: s.task }); S.neverSuggest[s.kind + ':' + s.task] = true; S.adapt.unshift({ key: 'never:' + s.kind + ':' + s.task, label: 'No more "' + ({ quick: 'quick version', full: 'fuller guidance', help: 'more guidance', practiced: 'move up a level' })[s.kind] + '" offers for ' + taskName(s.task), src: 'you', when: nowTime(), undo: { t: 'never', k: s.kind + ':' + s.task } }); addLog('Suggestion turned off: ' + taskName(s.task), 'You tapped Don\'t suggest this again', 'suggest'); S.suggestion = null; },
  suggestWhy() { S.suggestWhy = !S.suggestWhy; },
  removeAdapt(k) { const a = S.adapt.find(x => x.key === k); if (a && a.undo && a.undo.t === 'never') { delete S.neverSuggest[a.undo.k]; S.adapt = S.adapt.filter(x => x !== a); } else removeAdapt(k); toast('Removed. It is back to how it was.'); },
  hideBal() { S.hideBal = !S.hideBal; },
  setupCardClose() { S.setupCard = false; },
  showFull() { S.flow.full = true; S.flow.usedFull = true; addLog(taskName(S.flow.task) + ': full guidance for this payment', 'You tapped Show full guidance', 'you'); },
  tellMore(id) { S.flow.more = S.flow.more || {}; S.flow.more[id] = !S.flow.more[id]; },
  quickAmt(v) { const st = curStep(); S.flow.data[st && st.id === 'limit' ? 'limit' : 'amount'] = v; S.flow.err = null; },
  helpCode() { makeHelpCode(); S.helper.open = false; S.screen = 'helpcode'; },
  helpCodeDone() { S.screen = S.flow ? 'flow' : 'home'; },
  staffPick(id) { G.staffSel = id; logPassportView(id); },
  staffLookup() { const el = document.getElementById('hc-q'); G.hcQuery = el ? el.value.replace(/\D/g, '') : ''; track('helpcode_lookup', { found: !!G.helpCodes[G.hcQuery] }); },
  staffHighlight(id) { const tk = findTicket(id); G.staffRing = { persona: tk.persona, a: 'pauseCancel' }; tk.highlighted = true; },
  staffRingClear() { G.staffRing = null; },
  eraseMap() { if (!S.eraseConfirm) { S.eraseConfirm = true; return; }
    TASKS.forEach(x => { S.confidence[x.id] = 'help'; }); S.guided = {}; S.guidedErrors = {}; S.snooze = {}; S.neverSuggest = {}; S.suggestion = null;
    S.adapt = S.adapt.filter(a => !a.key.startsWith('lvl:') && !a.key.startsWith('never:')); S.eraseConfirm = false;
    addLog('Confidence Map erased', 'You asked us to erase it. Every task is back to "With some help" and the counts are deleted.', 'you'); track('map_erase'); toast('Erased. Every task is back to "With some help".'); },
  eraseCancel() { S.eraseConfirm = false; },
  setRealUnit(u) { S.realUnit = u; },
  setUndoSecs(n) { S.undoSecs = Number(n); addLog('Undo window: ' + n + ' seconds', t('why_you'), 'you'); recordAdapt('undosecs', 'Undo wait: ' + n + ' seconds', 'you', { t: 'undoSecs', v: 60 }, Number(n)); },
  previewShow() { toast('"Show me how": an animated hand taps through each step on your own screen, then hands control back to you.'); },
  safetyOfferClose() { S.safetyOffered = true; },
  openPersona(id) { stopSpeak(); G.copilot = null; loadPersona(id); G.view = 'app'; lastKey = ''; },
  undoSetting(k) {
    const def = { lang: 'en', simple: false, scale: 2, contrast: false, readAloud: false, mode: 'visual' };
    setSetting(k, def[k], 'you'); if (k === 'simple') S.passport.simple = false; if (k === 'scale') S.passport.larger = false;
  },
  toggleSetting(k, el) { setSetting(k, el.checked, 'you'); if (k === 'simple') S.passport.simple = el.checked; },
  togglePassport(k, el) {
    S.passport[k] = el.checked;
    const names = { simple: t('serve_simple'), larger: t('serve_larger'), patient: t('serve_patient'), trustedHelp: t('serve_trusted'), offerHelp: 'Offer help if I seem stuck' };
    addLog(t('passport') + ': ' + names[k] + ' ' + (el.checked ? 'on' : 'off'), t('why_you') + '. Shared with Helper and with staff on call-backs.', 'you');
    if (k === 'larger') setSetting('scale', el.checked ? Math.max(4, S.settings.scale) : 2, 'you');
    if (k === 'simple') setSetting('simple', el.checked, 'you');
  },
  toggleSafety(k, el) {
    S.safety[k] = el.checked;
    addLog((k === 'pause' ? 'Safety check' : t('cooling')) + ' ' + (el.checked ? 'on' : 'off'), t('why_you'), 'safety');
    if (k === 'cooling') recordAdapt('safety:cooling', 'Cooling time for new payees: ' + (el.checked ? 'on' : 'off'), 'you', { t: 'safety', k: 'cooling', v: !el.checked }, el.checked);
    track('setting', { key: k, value: el.checked });
  },
  addTrusted() {
    const d = S.tcDraft || {};
    if (!d.name || !/^[89]\d{7}$/.test(String(d.mobile || '').replace(/\s/g, ''))) { toast('Add a name and an 8-digit Singapore mobile number.'); return; }
    S.tcDraft = {}; S.tcEdit = false;
    if (S.safety.trusted) {
      const old = S.safety.trusted;
      S.safety.tcPending = { kind: 'change', name: d.name, mobile: d.mobile, at: laterTime(12) };
      addLog('Trusted contact change requested: ' + d.name, 'Takes effect in 12 hours. ' + old.name + ' has been told, so a scammer cannot quietly swap themselves in.', 'safety');
      return;
    }
    S.safety.trusted = { name: d.name, mobile: d.mobile, min: 1000 };
    S.adapt.unshift({ key: 'safety:trusted', label: 'Trusted contact: ' + d.name, src: 'you', when: nowTime(), undo: { t: 'trusted' } });
    addLog('Trusted contact added: ' + d.name, t('why_you') + '. They are told about transfers of S$1,000+ and cannot see your balance.', 'safety');
  },
  removeTrusted() {
    const old = S.safety.trusted;
    S.safety.tcPending = { kind: 'remove', name: old.name, at: laterTime(12) };
    addLog('Trusted contact removal requested: ' + old.name, 'Takes effect in 12 hours. ' + old.name + ' has been told.', 'safety');
  },
  changeTrusted() { S.tcEdit = true; },
  cancelTcPending() { addLog('Trusted contact change cancelled', 'You cancelled it. Nothing changed.', 'safety'); S.safety.tcPending = null; },
  skipTcWait() {
    const pd = S.safety.tcPending; if (!pd) return;
    if (pd.kind === 'remove') { S.safety.trusted = null; S.adapt = S.adapt.filter(a => a.key !== 'safety:trusted'); addLog('Trusted contact removed: ' + pd.name, 'The 12-hour wait ended', 'safety'); }
    else { S.safety.trusted = { name: pd.name, mobile: pd.mobile, min: 1000 }; S.adapt = S.adapt.filter(a => a.key !== 'safety:trusted'); S.adapt.unshift({ key: 'safety:trusted', label: 'Trusted contact: ' + pd.name, src: 'you', when: nowTime(), undo: { t: 'trusted' } }); addLog('Trusted contact is now ' + pd.name, 'The 12-hour wait ended', 'safety'); }
    S.safety.tcPending = null;
  },
  setLang(c) { setSetting('lang', c, 'you'); },
  scale(d) { const n = Math.max(0, Math.min(6, S.settings.scale + Number(d))); if (n !== S.settings.scale) setSetting('scale', n, 'you'); },
  setMode(m) { setSetting('mode', m, 'you'); },
  setLevel(v) { const [task, l] = v.split(':'); setLevel(task, l, 'you'); },
  redoOnboarding() { S.screen = 'onboarding'; S.ob = { step: 0, a: { tasks: [], conf: {}, how: null, serve: [], safety: null } }; },
  skipOnboarding() { S.onboarded = true; S.screen = 'home'; track('onboard_skip'); addLog('Welcome setup skipped', 'You chose the standard app. You can do it later in More.', 'you'); },
  obStart() { S.ob.step = 1; },
  obLang(c) { setSetting('lang', c, 'you'); S.ob.step = 2; },
  obTask(id) { const a = S.ob.a; a.tasks = a.tasks.includes(id) ? a.tasks.filter(x => x !== id) : a.tasks.concat(id); },
  obNext() {
    const ob = S.ob, a = ob.a;
    if (ob.step === 2) { a.tasks.forEach(x => { if (!a.conf[x]) a.conf[x] = 'help'; }); ob.step = 3; }
    else if (ob.step === 3) { TASKS.forEach(x => setLevel(x.id, a.tasks.includes(x.id) ? a.conf[x.id] : 'help', 'you')); ob.step = 4; }
    else if (ob.step === 5) {
      ['simple', 'larger', 'patient', 'slow', 'readout'].forEach(k => { S.passport[k] = a.serve.includes(k); });
      if (a.serve.includes('readout')) setSetting('readAloud', true, 'you');
      S.passport.trustedHelp = a.serve.includes('trusted');
      if (a.serve.includes('simple')) setSetting('simple', true, 'you');
      if (a.serve.includes('larger')) setSetting('scale', 4, 'you');
      if (a.serve.length) { addLog(t('passport') + ': ' + a.serve.map(s => serveLabel(s)).join(', '), t('why_you'), 'you'); S.adapt.unshift({ key: 'passport:ob', label: t('passport') + ': ' + a.serve.map(s => serveLabel(s)).join(', '), src: 'setup', when: nowTime(), undo: { t: 'passportAll' } }); }
      ob.step = 7;
    }
  },
  obConf(v) { const [task, l] = v.split(':'); S.ob.a.conf[task] = l; },
  obHow(k) {
    S.ob.a.how = k;
    if (k === 'tell') { setSetting('mode', 'voice', 'you'); setSetting('readAloud', true, 'you'); }
    else if (k === 'read') setSetting('mode', 'text', 'you');
    else setSetting('mode', 'visual', 'you');
    S.ob.step = 5;
  },
  obHowSkip() { S.ob.a.how = 'skip'; S.ob.step = 5; },
  obSkipRest() { S.ob.a.how = 'skip'; S.ob.step = 7; addLog('Optional setup questions skipped', 'You can answer them later; Helper will offer help when you need it.', 'you'); },
  obServe(k) { const a = S.ob.a; a.serve = a.serve.includes(k) ? a.serve.filter(x => x !== k) : a.serve.concat(k); },
  obSafety(v) { S.ob.a.safety = v === '1'; S.safety.pause = v === '1'; addLog('Scam pause ' + (v === '1' ? 'on' : 'off'), t('why_you'), 'safety'); S.ob.step = 7; },
  obChange(screen) { A.obFinish(); S.screen = screen; },
  obFinish() { S.onboarded = true; S.screen = 'home'; track('onboard_done'); addLog('Welcome setup finished', 'Everything above came from your answers', 'you'); },
  speakText(v) { if (!speak(v)) toast('Read aloud is not available in this browser.'); },
  openDrill(i) { S.screen = 'drill'; S.drillIdx = Number(i); S.drillAnswer = null; S.helper.open = false; S.flow = null; },
  drillAnswer(v) { const d = DRILLS[S.drillIdx]; S.drillAnswer = v === '1'; S.drills[d.id] = (v === '1') === d.scam; track('drill', { id: d.id, correct: S.drills[d.id] }); },
  qrTyped() {
    const f = S.flow, raw = String(f.data.qrcode || '').replace(/[\s-]/g, '').toUpperCase();
    if (!raw) { f.err = { msg: 'Type the number printed under the QR code, or tap Scan to use the camera.' }; return; }
    if (raw !== DEMO_QR) { f.err = { msg: 'That number does not match a stall. Check each letter and digit under the QR code, or tap Scan to use the camera.' }; f.errors++; const l = liveInit(f); l.fails.merchant = (l.fails.merchant || 0) + 1; if (l.fails.merchant >= LIVE_RULES.fails) liveTrigger('fails', l.fails.merchant); return; }
    f.data.merchant = MERCHANT.name; f.err = null; track('scan_typed');
  },
  doScan() { S.flow.data.merchant = MERCHANT.name; S.flow.err = null; track('scan_ok'); },
  voiceInput(key) {
    const f = S.flow;
    toast(t('listening'));
    const ok = listen(text => { f.data[key] = key === 'amount' || key === 'limit' ? parseSpokenAmount(text) : text; f.err = null; render(); }, success => { if (!success) { f.err = { msg: 'Voice input is not available in this browser. You can type instead; everything you entered is kept.' }; render(); } });
    if (!ok) f.err = { msg: 'Voice input is not available in this browser. You can type instead; everything you entered is kept.' };
  },
  openHelper() { openHelper(); },
  closeHelper() { S.helper.open = false; stopSpeak(); },
  closeHelperBg(v, el, e) { if (e.target === el) { S.helper.open = false; stopSpeak(); } else return 'noop'; },
  helperAsk(v) { if (!S.helper.open) openHelper(); helperAnswer(v); },
  helperAbout(v) { openHelper(v); },
  helperMic() {
    const ok = listen(text => { helperAnswer(text); render(); }, s => { if (!s) { S.helper.msgs.push({ who: 'bot', text: 'Voice input is not available in this browser. Please type your question.' }); render(); } });
    if (!ok) S.helper.msgs.push({ who: 'bot', text: 'Voice input is not available in this browser. Please type your question.' });
  },
  handoffSend(v) {
    const [idx, when] = v.split('|');
    const id = 'CB-' + (1001 + G.tickets.length);
    const f = S.flow, P = f && f.purpose ? PURPOSES.find(x => x.id === f.purpose) : null;
    const urgent = !!(P && (P.level === 'stop' || f.onPhone));
    const custLang = S.settings.lang;
    const en = inEnglish(() => ({ passport: passportChips(), summary: handoffSummary(), journey: journeyFor(S.personaId), conf: TASKS.filter(x => S.confidence[x.id] !== 'often').map(x => taskShort(x.id) + ': ' + levelLabel(S.confidence[x.id])).join(' · ') }));
    G.tickets.push({ id, persona: S.personaId, customer: S.name, at: nowTime(), when, status: 'new', passport: en.passport, summary: en.summary, asked: S.helper.msgs.filter(m => m.who === 'me').slice(-3).map(m => m.text),
      urgent, reason: urgent ? 'Suspected scam' : 'Call-back request', lang: custLang, journey: en.journey, conf: en.conf,
      chat: S.helper.msgs.filter(m => m.text).slice(-4).map(m => ({ who: m.who, text: m.text, en: toEnglish(m.text, S.settings.lang) })) });
    G.staffSel = id;
    S.helper.msgs[Number(idx)].sent = id;
    track('handoff', { id });
    addLog('Call-back requested (' + id + ')', 'Shared your Passport choices and where you were. Account numbers masked.', 'you');
  },
  nudgeExplain() { openHelper('stuck'); },
  nudgeClose() { S.nudge = false; track('stuck_dismiss'); },
  staffCall(id) {
    const tk = findTicket(id); tk.status = 'calling';
    G.call = { agent: 'Priya Ramasamy', code: String(1000 + Math.floor(Math.random() * 9000)), ticket: id, persona: tk.persona };
    if (S.personaId === tk.persona) addLog('Verified OCBC call started', 'An officer is calling you back in the app (' + id + ')', 'safety');
  },
  staffEnd(id) { const tk = findTicket(id); tk.status = 'resolved'; G.call = null; },
  simCall() { G.call = G.call ? null : { agent: 'Priya Ramasamy', code: String(1000 + Math.floor(Math.random() * 9000)), persona: S.personaId }; },
  simStuck() {
    if (!(S.screen === 'flow' && S.flow && S.flow.stage === 'steps')) { S.onboarded = true; startFlow('newpayee', false); S.flow.mode = 'guided'; }
    S.nudge = true; track('stuck_offer', { task: S.flow.task });
  },
  simScam() {
    S.onboarded = true; startFlow('uen', false); S.flow.mode = 'guided'; S.flow.data.uen = '202499999Z';
    addLog('Demo: a "caller" gave the customer a UEN to pay', 'Scenario started from demo controls', 'event');
  },
  simFirstOverseas() { if (G.personaId !== 'arjun') loadPersona('arjun'); startFlow('overseas', false); },
  resetPersona() { stopSpeak(); G.copilot = null; loadPersona(G.personaId); lastKey = ''; },
  /* ---- round 2 features ---- */
  playDialect(k) { playDialect(k, false); return 'noop'; },
  setDialect(code) { const before = S.dialect; S.dialect = code; recordAdapt('dialect', 'Dialect audio: ' + dialectName(code), 'you', { t: 'dialect', v: before }, code); addLog('Dialect audio: ' + dialectName(code), t('why_you') + '. Screens stay in ' + (LANGS.find(l => l.code === S.settings.lang) || {}).name, 'you'); track('setting', { key: 'dialect', value: code }); if (code !== 'off') setTimeout(() => playDialect('welcome', true), 50); },
  recStart(v) {
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Recording needs a browser with microphone access (Chrome or Edge).'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      recChunks = []; recorder = new MediaRecorder(stream); G.recording = v;
      recorder.ondataavailable = e => recChunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(tk => tk.stop());
        const blob = new Blob(recChunks, { type: recorder.mimeType || 'audio/webm' });
        const fr = new FileReader();
        fr.onload = () => { const [d, k] = v.split(':'); G.clips[d] = G.clips[d] || {}; G.clips[d][k] = fr.result; saveClips(); G.recording = null; track('dialect_record', { dialect: d, key: k }); render(); };
        fr.readAsDataURL(blob);
      };
      recorder.start(); render();
    }).catch(() => { G.recording = null; toast('Microphone permission was not given.'); render(); });
  },
  recStop() { if (recorder && recorder.state !== 'inactive') recorder.stop(); return 'noop'; },
  recPlay(v) { const [d, k] = v.split(':'); new Audio(G.clips[d][k]).play().catch(() => {}); return 'noop'; },
  recDelete(v) { const [d, k] = v.split(':'); delete G.clips[d][k]; saveClips(); },
  toggleReal(k, el) { S.realThings = el.checked; recordAdapt('real', 'Amounts in everyday things: on', 'you', { t: 'real', v: false }, el.checked); addLog('Amounts in everyday things: ' + (el.checked ? 'on' : 'off'), t('why_you'), 'you'); track('setting', { key: 'realThings', value: el.checked }); },
  setUndo(v) { const before = S.undoMode; S.undoMode = v; recordAdapt('undo', 'Undo window: ' + ({ off: 'off', new: 'new people only', all: 'all transfers to people' })[v], 'you', { t: 'undoMode', v: before }, v); addLog('Undo window: ' + ({ off: 'off', new: 'new payees', all: 'all transfers' })[v], t('why_you'), 'safety'); track('setting', { key: 'undo', value: v }); },
  undoSend(id) {
    const p = S.pending.find(x => x.id === id); if (!p) return;
    S.pending = S.pending.filter(x => x !== p); S.balance += p.amount + p.fee;
    if (S.flow && S.flow.pendingId === id) { S.flow.pendingId = null; S.flow.undone = true; }
    threadSettle(id, 'undone');
    addLog('Transfer undone: ' + money(p.amount) + ' to ' + p.to, 'You tapped Undo before it was sent. No money left your account.', 'safety');
    track('undo', { amount: p.amount }); toast('Undone. No money left your account.');
  },
  setLife(id) {
    const prev = S.lifeMoment; S.lifeMoment = id || null;
    if (id) { addLog('Life moment: ' + LIFE.find(x => x.id === id).title, 'You told us. Used only to suggest tasks; nothing is hidden.', 'you'); track('life', { id }); S.screen = 'home'; S.adapt = S.adapt.filter(a => a.key !== 'life'); S.adapt.unshift({ key: 'life', label: 'Life moment: ' + LIFE.find(x => x.id === id).title, src: 'you', when: nowTime(), undo: { t: 'life' } }); }
    else { addLog('Life moment removed', t('why_you'), 'you'); S.adapt = S.adapt.filter(a => a.key !== 'life'); }
  },
  lifeSimple() { setSetting('simple', true, 'you'); S.passport.simple = true; S.passport.patient = true; toast('Simple wording is on, and Helper will go slowly.'); },
  ghost() { setTimeout(runGhost, 30); return 'noop'; },
  voiceNote(target) { voiceNote(target); },
  chatBankSay(v) { chatBankHandle(v, false); },
  copilotStart() { S.flowBeforeCopilot = S.screen === 'flow' ? S.flow : null; S.helper.open = false; S.nudge = false; S.copilotReturn = S.screen; S.screen = 'copilotSetup'; },
  copilotInvite(i) {
    const c = S.contacts[Number(i)];
    if (!c.family) { toast('Only people saved as family for at least 7 days can help.'); return; }
    G.copilot = { persona: S.personaId, name: c.name, status: 'waiting', point: null, lastMsg: null };
    addLog('Family Co-pilot: invited ' + c.name, 'You asked for help. They will see your screen but cannot tap or see your balance.', 'you');
    track('copilot_invite');
    if (S.flowBeforeCopilot) { S.flow = S.flowBeforeCopilot; S.screen = 'flow'; } else S.screen = S.copilotReturn && S.copilotReturn !== 'copilotSetup' ? S.copilotReturn : 'home';
    setTimeout(() => { if (G.copilot && G.copilot.status === 'waiting') { G.copilot.status = 'live'; track('copilot_live'); render(); } }, 4000);
  },
  copilotJoin(how) { if (G.copilot) { G.copilot.status = 'live'; G.copilot.via = how === 'app' ? 'their own OCBC app' : 'Singpass'; track('copilot_live', { via: G.copilot.via }); } },
  copilotMsgClose() { if (G.copilot) G.copilot.lastMsg = null; },
  copilotEnd() { if (G.copilot) addLog('Family Co-pilot ended', 'You ended the session. ' + G.copilot.name + ' can no longer see your screen.', 'you'); G.copilot = null; },
  copilotSay(v) { if (!G.copilot || copilotConfirmPause()) return; if (copilotOnPayment() && !COPILOT_QUICK.includes(v)) { toast('On payment screens, family helpers can only send preset messages.'); return; } G.copilot.lastMsg = v; track('copilot_msg'); if (S.settings.readAloud || S.settings.mode === 'voice') speak(G.copilot.name.split(' (')[0] + ' says: ' + v); }
};

/* ---------------- Event wiring ---------------- */
function handle(name, v, el, e) {
  if (!A[name]) { console.warn('No action', name); return; }
  const r = A[name](v, el, e);
  if (r !== 'noop') render();
}
document.addEventListener('click', e => {
  liveTap(e);
  const famPhone = e.target.closest('#family-phone');
  if (famPhone) {
    e.preventDefault(); e.stopPropagation();
    const t2 = e.target.closest('[data-a]');
    if (t2 && G.copilot) {
      const sel = '[data-a="' + t2.dataset.a + '"]' + (t2.dataset.v != null ? '[data-v="' + CSS.escape(t2.dataset.v) + '"]' : '');
      const idx = [...famPhone.querySelectorAll(sel)].indexOf(t2);
      G.copilot.point = { a: t2.dataset.a, v: t2.dataset.v, idx: Math.max(0, idx) };
      track('copilot_point', { a: t2.dataset.a });
      applyPointer();
    }
    return;
  }
  const el = e.target.closest('[data-a]');
  if (!el || el.tagName === 'FORM') return;
  if (el.tagName === 'INPUT' && el.type === 'checkbox') return; // handled on change
  e.preventDefault();
  handle(el.dataset.a, el.dataset.v, el, e);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('input[type="checkbox"][data-a]')) return handle(el.dataset.a, el.dataset.v, el, e);
  if (el.matches('select[data-in]')) onInput(el, true);
  if (el.matches('input[type="file"][data-photo]') && el.files[0]) {
    const name = el.dataset.photo, fr = new FileReader();
    fr.onload = () => { S.photos[name] = fr.result; addLog('Photo added for ' + name, 'You added it so you see their face when paying', 'you'); render(); };
    fr.readAsDataURL(el.files[0]);
  }
});
document.addEventListener('input', e => { if (e.target.matches('input[data-in]')) onInput(e.target, false); });
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.dataset.a === 'chatBankSubmit') { e.preventDefault(); const q = document.getElementById('cb-q').value; chatBankHandle(q, false); render(); const i2 = document.getElementById('cb-q'); if (i2) i2.focus(); return; }
  if (f.dataset.a === 'copilotSayForm') { e.preventDefault(); const q = document.getElementById('fam-say').value.trim(); if (q) { A.copilotSay(q); render(); } return; }
  if (f.dataset.a === 'helperSubmit') { e.preventDefault(); const q = document.getElementById('helper-q').value; helperAnswer(q); render(); const inp = document.getElementById('helper-q'); if (inp) inp.focus(); }
});
/* Slide to pay: drag the knob to the end, or press the button (keyboard, switch and screen-reader users) */
let slideDrag = null, slideSwallow = false;
document.addEventListener('pointerdown', e => {
  const sl = e.target.closest('.slide'); if (!sl) return;
  slideDrag = { el: sl, x0: e.clientX, w: sl.clientWidth - 56, moved: 0 };
});
document.addEventListener('pointermove', e => {
  if (!slideDrag) return;
  const dx = Math.max(0, Math.min(slideDrag.w, e.clientX - slideDrag.x0)); slideDrag.moved = dx;
  const k = slideDrag.el.querySelector('.knob'); if (k) k.style.transform = 'translateX(' + dx + 'px)';
});
document.addEventListener('pointerup', () => {
  if (!slideDrag) return;
  const d = slideDrag; slideDrag = null;
  if (d.moved > 6 && d.moved < d.w * 0.75) { slideSwallow = true; const k = d.el.querySelector('.knob'); if (k) k.style.transform = ''; setTimeout(() => { slideSwallow = false; }, 400); }
});
document.addEventListener('click', e => { if (slideSwallow && e.target.closest('.slide')) { e.stopImmediatePropagation(); e.preventDefault(); slideSwallow = false; } }, true);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && S.helper.open) { S.helper.open = false; render(); }
});

function onInput(el, rerender) {
  const k = el.dataset.in, v = el.value;
  if (k === 'coolHours' || k === 'coolMin') { S.safety[k] = Number(v); addLog(k === 'coolHours' ? 'Cooling time: ' + v + ' hours' : 'Cooling time applies from ' + money(v), t('why_you'), 'safety'); return render(); }
  if (k === 'tcName' || k === 'tcMobile') { S.tcDraft = S.tcDraft || {}; S.tcDraft[k === 'tcName' ? 'name' : 'mobile'] = v; return; }
  if (!S.flow) return;
  const d = S.flow.data;
  if (k === 'toMobile') { d.to = v.trim() ? 'mobile:' + v.trim() : ''; document.querySelectorAll('[data-v^="to|"]').forEach(b => b.setAttribute('aria-pressed', 'false')); return; }
  if (k === 'to') { d.to = v; return; }
  d[k] = k === 'uen' ? v.toUpperCase().trim() : v;
  if (k === 'amount' || k === 'limit') {
    const w = document.getElementById('words-' + k);
    if (w) w.innerHTML = t('in_words') + ': <b>' + esc(amountWords(v) || '-') + '</b>';
    const rt = document.getElementById('rt-' + k); if (rt) rt.innerHTML = realThings(v);
    const obx = document.getElementById('ob-' + k); if (obx) obx.innerHTML = overBalance(v, k);
    if (S.flow.task === 'overseas') { const q = w && w.nextElementSibling; if (q && q.classList.contains('card')) q.outerHTML = overseasQuote() || '<span></span>'; else if (w) w.insertAdjacentHTML('afterend', overseasQuote()); }
  }
  if (rerender) render(); else renderMirror();
}

Object.assign(A, ENGINE_ACTIONS); Object.assign(A, THREAD_ACTIONS); Object.assign(A, SPEECH_ACTIONS);
loadClips();
loadPersona('lim');
S.screen = 'login';
render();
