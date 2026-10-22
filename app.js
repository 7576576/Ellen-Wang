(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const output = $('#terminal-output');
  const scroll = $('#terminal-scroll');
  const input = $('#command-input');
  const suggestions = $('#suggestion-row');
  const storage = { get(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  let lang = storage.get('ellen-language', 'en') === 'zh' ? 'zh' : 'en';
  let theme = storage.get('ellen-theme', 'terminal') === 'espresso' ? 'espresso' : 'terminal';
  let entries = [{ id: 0, command: 'welcome', raw: 'welcome' }];
  let entryId = 0;
  const history = [];
  let historyIndex = 0;
  let draft = '';
  let toastTimer;
  const email = 'ziyuewang91@gmail.com';
  const github = 'https://github.com/7576576';
  const commands = ['help', 'about', 'education', 'projects', 'skills', 'interests', 'contact', 'email', 'github', 'themes', 'coffee', 'history', 'welcome', 'clear', 'whoami', 'pwd', 'echo'];
  const text = {
    en: {
      skip: 'Skip to command input', explore: 'EXPLORE', navAbout: 'about', navProjects: 'projects', navSkills: 'skills', navInterests: 'interests', navContact: 'contact', autocomplete: 'autocomplete', history: 'history', clear: 'clear', clickHint: 'or click a command above', status: 'a little space for data, ideas & curiosity', help: 'help', inspired: 'Inspired by', placeholder: 'Type help to get started…', inputLabel: 'Enter a command', outputLabel: 'Terminal output', runLabel: 'Run command', themeLabel: 'Switch to espresso theme', themeBackLabel: 'Switch to terminal theme', languageLabel: 'Language', navLabel: 'Portfolio commands',
      boot: 'Personal terminal · ready to explore', discipline: 'COMPUTER SCIENCE / DATA SCIENCE / USYD', headline: 'A curious mind.<br><span>A creative perspective.</span>', intro: "Hi, I'm Ellen — a Computer Science student minoring in Data Science at the University of Sydney. Exploring the space between data, AI, and creative technology.", aboutLink: 'Get to know me', projectsLink: 'Explore my work', contactLink: 'Say hello', welcomeHint: 'Make yourself at home. Type {help} or choose a command above.', coffeeCaption: 'A SMALL COFFEE BREAK',
      aboutTitle: 'A little about me',
      about: [
        "I'm <strong>Ellen Wang</strong>, majoring in Computer Science and minoring in Data Science at the <span class='highlight'>University of Sydney</span>.",
        'My studies began in Digital Media Technology, where I explored photography, 3D modeling, and game development, before moving toward computing and data analysis. This background has shaped my interest in how programs work, and how information is understood, presented, and used.',
        'My current interests are data analysis, visualization, and AI applications. My project experience spans data cleaning, statistical analysis, and visual reports, as well as generative AI image training and output evaluation. I have also built interactive projects with Unity.',
        'I enjoy turning ideas into tangible results: using charts to explain data, prototypes to explore interaction, and experiments to understand the capabilities and limitations of AI.'
      ],
      projectsTitle: 'Selected explorations', projectsNote: 'A selection of coursework and workshop projects. Descriptions reflect my contributions; public repositories are not yet available.',
      projects: [
        { title: 'Understanding student learning', description: 'Contributed to a group analysis of 5,057 student survey responses, preparing data, producing grouped summaries, and visualizing relationships between study styles, target marks, interest, and study hours.', tags: ['R', 'tidyverse', 'ggplot2', 'Survey analysis'] },
        { title: 'Lecture preferences & commute times', description: 'Analyzed the difference in commute times between two groups in a 590-student survey. Used Welch’s t-test, boxplots, and sensitivity analysis to examine how extreme observations affected the conclusions.', tags: ['R', 'Statistical inference', 'Sensitivity analysis'] },
        { title: 'Generative images, human judgment', description: 'At the Tongji DigitalFUTURES workshop, collected image data, trained a custom Stable Diffusion model locally, and contributed to manual output evaluation. The generated material became part of a final video work.', tags: ['Stable Diffusion', 'Output evaluation', 'Creative AI'] },
        { title: 'Interactive worlds with Unity', description: 'Built gameplay features in a semester-long course project, including character movement, collisions, user interfaces, level interactions, scoring, and save functionality.', tags: ['Unity', 'C#', 'Interactive development'] }
      ],
      skillsTitle: 'Tools I work with', skillsNote: 'Tools and methods used in coursework, workshops, and personal prototypes.',
      skills: [
        ['Data & analysis', 'Python · R · SQL / T-SQL', 'Data cleaning, grouped summaries, exploratory analysis, statistical testing'],
        ['Visualization', 'ggplot2 · tidyverse · Quarto', 'Charts, reproducible reports, and communicating results'],
        ['AI practice', 'Stable Diffusion · Hugging Face · LLM APIs', 'Generative image training, text classification, and output evaluation'],
        ['Creative technology', 'Unity · C# · Blender', 'Game mechanics, interactive prototypes, and 3D modeling'],
        ['Everyday tools', 'Git · GitHub · VS Code · RStudio', 'Version control and development workflows']
      ],
      interestsTitle: 'Beyond the terminal',
      interests: [
        ['☕', 'Coffee', 'A small personal ritual — and the inspiration for this terminal’s espresso theme.'],
        ['↟', 'Trails & landscapes', 'Hiking around Sydney, with a particular interest in deserts, rainforests, and rocky landscapes.'],
        ['⌁', 'Trying something new', 'Archery and beginner tennis have become part of my university experience.'],
        ['◉', 'Visual curiosity', 'Photography, 3D work, and game development are part of the digital media background I bring to computing.']
      ],
      contactTitle: 'Let’s connect', contactIntro: 'Have a question or something interesting to share? You can reach me here.', emailLabel: 'email', githubLabel: 'GitHub', copy: 'copy', open: 'open ↗', copied: 'Email address copied', copyFailed: 'Select and copy the email address above.',
      educationTitle: 'Learning, across disciplines', university: 'University of Sydney', degree: 'Bachelor of Science', fields: 'Major · Computer Science<br>Minor · Data Science', prior: 'Previously studied Digital Media Technology at Jiangsu University of Technology, with coursework in photography, 3D modeling, and game development.',
      helpTitle: 'A few ways to explore', helpNote: 'Click a command or type it below. Tab completes a command; ↑ / ↓ browse your history.',
      helpDescriptions: { about: 'My background and interests', education: 'My learning path', projects: 'A selection of project experiences', skills: 'Tools and methods I have used', interests: 'Life beyond the screen', contact: 'Email and GitHub', themes: 'Choose terminal or espresso', coffee: 'Take a small coffee break', history: 'See commands from this session', welcome: 'Show the welcome screen', clear: 'Clear the terminal' },
      themesTitle: 'Choose your atmosphere', themesIntro: 'A familiar terminal, or a warmer coffee-inspired palette.', terminalTheme: 'terminal', espressoTheme: 'espresso', coffeeTitle: 'A pause between commands', coffeeText: 'A small coffee break. Then, back to the next idea.', coffeeReturn: 'Back to exploring',
      historyTitle: 'Your session history', historyEmpty: 'No commands yet. Start with help.', empty: 'A fresh start. Type help or welcome to explore again.', unknown: 'Command not found:', tryHelp: 'Type {help} to see available commands.', themeUnknown: 'Available themes: terminal, espresso.', pwd: '/home/visitor/ellen-wang', visitor: 'visitor — welcome to Ellen’s little corner of the web.', echoUsage: 'Usage: echo your message',
    },
    zh: {
      skip: '跳至命令输入框', explore: '探索', navAbout: '关于', navProjects: '项目', navSkills: '技能', navInterests: '兴趣', navContact: '联系', autocomplete: '自动补全', history: '历史命令', clear: '清屏', clickHint: '也可以点击上方命令', status: '留给数据、想法与好奇心的一小片空间', help: '帮助', inspired: '灵感来自', placeholder: '输入 help 开始探索…', inputLabel: '输入命令', outputLabel: '终端输出', runLabel: '执行命令', themeLabel: '切换到咖啡主题', themeBackLabel: '切换到终端主题', languageLabel: '语言', navLabel: '个人主页命令',
      boot: '个人终端 · 准备就绪', discipline: '计算机科学 / 数据科学 / 悉尼大学', headline: '保持好奇。<br><span>也保留一点创意。</span>', intro: '你好，我是 Ellen。目前在悉尼大学主修计算机科学、辅修数据科学，探索数据、AI 与创意技术之间的连接。', aboutLink: '认识一下我', projectsLink: '看看我的项目', contactLink: '打个招呼', welcomeHint: '欢迎来到我的小小空间。输入 {help}，或点击上方命令。', coffeeCaption: '给自己一个咖啡间隙',
      aboutTitle: '关于我',
      about: [
        '我是 <strong>Ellen Wang</strong>，目前在<span class="highlight">悉尼大学</span>主修计算机科学、辅修数据科学。',
        '我的学习从数字媒体技术开始，接触过摄影、三维建模和游戏开发，后来逐渐转向计算机与数据分析。这段经历让我既关注程序如何运行，也关注信息如何被理解、呈现和使用。',
        '目前，我的兴趣集中在数据分析、可视化和 AI 应用。我参与过从数据清洗、统计分析到可视化报告的完整流程，也做过生成式 AI 图像训练与输出评估，并使用 Unity 开发交互项目。',
        '我喜欢把想法转化为具体成果：用图表解释数据，用原型探索交互，也通过实验理解 AI 的能力与局限。'
      ],
      projectsTitle: '一些项目与探索', projectsNote: '以下为课程及工作营中的项目经历，介绍对应我的参与内容，目前暂无公开代码仓库。',
      projects: [
        { title: '学生学习行为分析', description: '在小组项目中参与分析 5,057 份学生问卷，负责数据整理、分组统计与可视化，探索学习方式、目标成绩、学习兴趣和学习时长之间的关系。', tags: ['R', 'tidyverse', 'ggplot2', '问卷分析'] },
        { title: '讲座偏好与通勤时间', description: '基于 590 名学生的问卷数据，比较不同讲座形式偏好群体的通勤时间，使用 Welch 双样本 t 检验、箱线图与敏感性分析，检查极端观测对结论的影响。', tags: ['R', '统计推断', '敏感性分析'] },
        { title: '生成式图像与人工评估', description: '在同济大学 DigitalFUTURES 工作营中收集图像数据，在本地训练自定义 Stable Diffusion 模型，并参与生成输出的人工评估，将生成素材用于最终视频作品。', tags: ['Stable Diffusion', '输出评估', '创意 AI'] },
        { title: 'Unity 交互游戏开发', description: '在一学期的课程项目中实现角色移动、碰撞检测、界面交互、关卡、计分与存档等功能，把游戏设计转化为可运行的交互体验。', tags: ['Unity', 'C#', '交互开发'] }
      ],
      skillsTitle: '使用过的工具与方法', skillsNote: '来自课程、工作营和原型实践中的工具与方法。',
      skills: [
        ['数据处理与分析', 'Python · R · SQL / T-SQL', '数据清洗、分组汇总、探索性分析与统计检验'],
        ['可视化与报告', 'ggplot2 · tidyverse · Quarto', '图表制作、可复现报告与分析结果表达'],
        ['AI 应用实践', 'Stable Diffusion · Hugging Face · LLM API', '生成式图像训练、文本分类与输出评估'],
        ['交互与视觉创作', 'Unity · C# · Blender', '游戏机制、交互原型与三维建模'],
        ['日常开发工具', 'Git · GitHub · VS Code · RStudio', '版本管理与开发工作流']
      ],
      interestsTitle: '终端之外',
      interests: [
        ['☕', '咖啡', '一点日常的小乐趣，也是这个终端咖啡主题的灵感来源。'],
        ['↟', '徒步与自然', '喜欢在悉尼周边徒步，对沙漠、雨林和岩石地貌尤其感兴趣。'],
        ['⌁', '尝试新事物', '在大学生活中参加射箭，也开始学习网球。'],
        ['◉', '视觉与创作', '摄影、三维制作与游戏开发，是我从数字媒体学习中带到计算机领域的另一种视角。']
      ],
      contactTitle: '保持联系', contactIntro: '有问题，或有有趣的想法想交流？可以在这里找到我。', emailLabel: '邮箱', githubLabel: 'GitHub', copy: '复制', open: '打开 ↗', copied: '邮箱已复制', copyFailed: '请选中上方邮箱地址并复制。',
      educationTitle: '跨学科的学习路径', university: '悉尼大学', degree: '理学学士', fields: '主修 · 计算机科学<br>辅修 · 数据科学', prior: '此前在江苏理工学院学习数字媒体技术，接触摄影、三维建模与游戏开发等课程。',
      helpTitle: '从这里开始探索', helpNote: '点击命令或在下方输入。按 Tab 自动补全，按 ↑ / ↓ 浏览历史命令。',
      helpDescriptions: { about: '我的背景与关注方向', education: '我的学习路径', projects: '课程与工作营项目', skills: '使用过的工具与方法', interests: '屏幕之外的生活', contact: '邮箱与 GitHub', themes: '选择终端或咖啡主题', coffee: '一个小小的咖啡间隙', history: '查看本次会话的历史命令', welcome: '显示欢迎页', clear: '清空终端' },
      themesTitle: '选择一种氛围', themesIntro: '熟悉的深色终端，或温暖一些的咖啡配色。', terminalTheme: '终端', espressoTheme: '咖啡', coffeeTitle: '命令之间，稍作停留', coffeeText: '给自己一个咖啡间隙，然后继续探索下一个想法。', coffeeReturn: '继续探索',
      historyTitle: '本次会话的命令', historyEmpty: '还没有历史命令。试试 help。', empty: '一个新的开始。输入 help 或 welcome 继续探索。', unknown: '未找到命令：', tryHelp: '输入 {help} 查看可用命令。', themeUnknown: '可用主题：terminal、espresso。', pwd: '/home/visitor/ellen-wang', visitor: 'visitor —— 欢迎来到 Ellen 的小小空间。', echoUsage: '用法：echo 你想说的话',
    }
  };
  const esc = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t = (key) => text[lang][key];
  const prompt = () => '<span class="prompt" aria-hidden="true"><span class="prompt-user">visitor</span><span class="prompt-at">@</span><span class="prompt-host">ellen</span><span class="prompt-path">:~</span><span class="prompt-dollar">$</span></span>';
  const heading = (number, title) => `<h2 class="output-heading"><span class="num">${number}</span><span>${esc(title)}</span><span class="heading-rule" aria-hidden="true"></span></h2>`;
  const helpText = (value) => value.replace('{help}', '<button type="button" class="inline-command" data-command="help">help</button>');
  // A compact, custom-drawn wordmark keeps the complete name on one line.
  const glyphs = { E:['┏━━━','┃   ','┣━━ ','┃   ','┗━━━'], L:['┃   ','┃   ','┃   ','┃   ','┗━━━'], N:['┃  ┃','┃╲ ┃','┃ ╲┃','┃  ┃','╹  ╹'], W:['┃   ┃','┃   ┃','┃ ╻ ┃','┃╱ ╲┃','╹   ╹'], A:[' ┏━┓ ','┏┛ ┗┓','┣━━━┫','┃   ┃','╹   ╹'], G:['┏━━━┓','┃    ','┃ ━━┓','┃   ┃','┗━━━┛'] };
  const nameMark = Array.from({length:5}, (_, row) => 'ELLEN WANG'.split('').map(c => c === ' ' ? '  ' : (glyphs[c]?.[row] || '')).join(' ')).join('\n');
  const coffee = '      ( (\n       ) )\n    .-‾‾‾‾‾-.\n    |       |‾)\n    |       |/\n     \\_____/\n   ───────────';
  function coffeeArt() {
    return `<div class="coffee-art" aria-hidden="true"><div class="coffee-steam"><span>∿</span><span>∿</span><span>∿</span></div><pre class="coffee-cup">    .─────────.
   /  ───────  \\
  ┌─────────────┐──╮
  │             │  │
  │     e_      │  │
  │             │──╯
   ╲           ╱
    ╰─────────╯
  ───────────────</pre><div class="coffee-caption">${esc(t('coffeeCaption'))}</div></div>`;
  }
  function welcome() {
    return `<div class="hero"><div class="boot-tag"><span class="live-dot"></span>${esc(t('boot'))}</div><div class="hero-top"><div class="hero-identity"><h1 class="name-heading" aria-label="Ellen Wang"><span class="name-ascii" aria-hidden="true">${esc(nameMark)}</span></h1><div class="hero-name-label">${esc(t('discipline'))}</div></div>${coffeeArt()}</div><h2 class="hero-tagline">${t('headline')}</h2><p class="hero-description">${esc(t('intro'))}</p><div class="hero-divider"></div><div class="welcome-links"><button type="button" class="text-link" data-command="about">${esc(t('aboutLink'))}<span class="arrow">↗</span></button><button type="button" class="text-link" data-command="projects">${esc(t('projectsLink'))}<span class="arrow">↗</span></button><button type="button" class="text-link" data-command="contact">${esc(t('contactLink'))}<span class="arrow">↗</span></button></div><div class="welcome-note"><span class="bracket">[ tip ]</span><span>${helpText(t('welcomeHint'))}</span></div></div>`;
  }
  function contacts() {
    return `${heading('05', t('contactTitle'))}<div class="prose"><p>${esc(t('contactIntro'))}</p></div><div class="contact-list"><div class="contact-item"><span class="contact-label">${t('emailLabel')}</span><a href="mailto:${email}">${email}</a><button type="button" class="copy-button" data-copy-email>${t('copy')}</button></div><div class="contact-item"><span class="contact-label">${t('githubLabel')}</span><a href="${github}" target="_blank" rel="noopener noreferrer">github.com/7576576</a><a class="copy-button" href="${github}" target="_blank" rel="noopener noreferrer" aria-label="${lang === 'zh' ? '打开 GitHub 主页' : 'Open GitHub profile'}">${t('open')}</a></div></div>`;
  }
  function content(entry) {
    const data = text[lang];
    switch (entry.command) {
      case 'welcome': return welcome();
      case 'about': return heading('01', t('aboutTitle')) + `<div class="prose">${data.about.map(p => `<p>${p}</p>`).join('')}</div>`;
      case 'projects': return heading('02', t('projectsTitle')) + `<p class="context-note">${esc(t('projectsNote'))}</p><div class="project-list">${data.projects.map((p, i) => `<article class="project-item"><span class="project-index">${String(i + 1).padStart(2, '0')}</span><div><h3 class="project-title">${esc(p.title)}</h3><p class="project-description">${esc(p.description)}</p><div class="tags">${p.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div></div></article>`).join('')}</div>`;
      case 'skills': return heading('03', t('skillsTitle')) + `<p class="context-note">${esc(t('skillsNote'))}</p><dl class="skill-table">${data.skills.map(([label, tools, methods]) => `<dt>${esc(label)}</dt><dd>${esc(tools)}<br><span class="muted">${esc(methods)}</span></dd>`).join('')}</dl>`;
      case 'interests': return heading('04', t('interestsTitle')) + `<div class="interest-grid">${data.interests.map(([icon, label, description]) => `<article class="interest-item"><span class="interest-symbol" aria-hidden="true">${icon}</span><div><h3>${esc(label)}</h3><p>${esc(description)}</p></div></article>`).join('')}</div>`;
      case 'contact': case 'email': case 'github': return contacts();
      case 'education': return heading('06', t('educationTitle')) + `<div class="edu-card"><h3>${esc(t('university'))}</h3><p>${esc(t('degree'))}</p><p class="edu-fields">${t('fields')}</p><div class="prose"><p>${esc(t('prior'))}</p></div></div>`;
      case 'help': return heading('?', t('helpTitle')) + `<p class="context-note">${esc(t('helpNote'))}</p><div class="help-grid">${Object.entries(data.helpDescriptions).map(([cmd, desc]) => `<button type="button" data-command="${cmd}">${cmd}</button><span>${esc(desc)}</span>`).join('')}</div>`;
      case 'themes': return heading('◐', t('themesTitle')) + `<p class="context-note">${esc(t('themesIntro'))}</p><div class="theme-options">${[['terminal', '#17242d', '#8ddcc1', '#d9bb7f'], ['espresso', '#26221d', '#d5b78c', '#a9c1a2']].map(([name, a, b, c]) => `<button type="button" class="theme-option ${theme === name ? 'active' : ''}" data-theme-choice="${name}" aria-pressed="${theme === name}"><span class="theme-swatch" aria-hidden="true"><i style="background:${a}"></i><i style="background:${b}"></i><i style="background:${c}"></i></span>${esc(t(name + 'Theme'))}${theme === name ? ' ✓' : ''}</button>`).join('')}</div>`;
      case 'coffee': return heading('☕', t('coffeeTitle')) + `<div class="large-coffee" aria-hidden="true"><pre>${esc(coffee)}</pre></div><p class="prose">${esc(t('coffeeText'))}</p><button type="button" class="text-link" data-command="welcome">${esc(t('coffeeReturn'))} ↗</button>`;
      case 'history': return heading('↶', t('historyTitle')) + `<ol class="history-list">${entry.snapshot.length ? entry.snapshot.map((raw, i) => `<li><span class="history-no">${i + 1}</span><button type="button" data-command="${esc(raw)}">${esc(raw)}</button></li>`).join('') : `<li>${esc(t('historyEmpty'))}</li>`}</ol>`;
      case 'pwd': return `<div class="plain-output">${esc(t('pwd'))}</div>`;
      case 'whoami': return `<div class="plain-output">${esc(t('visitor'))}</div>`;
      case 'echo': return `<div class="plain-output">${esc(entry.args || t('echoUsage'))}</div>`;
      case 'theme-error': return `<div class="error-line">${esc(t('themeUnknown'))}</div>`;
      default: return `<div class="error-line">${esc(t('unknown'))} ${esc(entry.raw)}</div><p class="context-note">${helpText(t('tryHelp'))}</p>`;
    }
  }
  function render(animate = true) {
    output.innerHTML = entries.length ? entries.map(entry => `<section class="output-entry" id="entry-${entry.id}" ${animate && entry.id === entries.at(-1)?.id ? '' : 'style="animation:none"'}><div class="command-line">${prompt()}<span class="command-verb">${esc(entry.raw)}</span></div><div class="response">${content(entry)}</div></section>`).join('') : `<div class="empty-output">${esc(t('empty'))}</div>`;
    const last = entries.at(-1)?.command;
    document.querySelectorAll('.command-nav [data-command]').forEach(el => {
      el.classList.toggle('active', el.dataset.command === last);
      if (el.dataset.command === last) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
    });
  }
  function updateInterface() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-lang]').forEach(el => { const active = el.dataset.lang === lang; el.classList.toggle('active', active); el.setAttribute('aria-pressed', String(active)); });
    $('.language-switch').setAttribute('aria-label', t('languageLabel'));
    $('.command-nav').setAttribute('aria-label', t('navLabel'));
    input.placeholder = t('placeholder'); input.setAttribute('aria-label', t('inputLabel'));
    scroll.setAttribute('aria-label', t('outputLabel'));
    $('.submit-command').setAttribute('aria-label', t('runLabel'));
    $('#theme-toggle').setAttribute('aria-label', theme === 'terminal' ? t('themeLabel') : t('themeBackLabel'));
    $('#theme-toggle').title = theme === 'terminal' ? t('themeLabel') : t('themeBackLabel');
    document.title = lang === 'zh' ? 'Ellen Wang — 个人终端' : 'Ellen Wang — Personal Terminal';
    render(false);
  }
  function applyTheme(value) {
    theme = value;
    document.body.dataset.theme = theme;
    storage.set('ellen-theme', theme);
    document.querySelector('meta[name="theme-color"]').content = theme === 'espresso' ? '#26221d' : '#17242d';
    updateInterface();
  }
  function showSuggestions(matches) {
    suggestions.innerHTML = matches.map(c => `<button type="button" data-complete="${c}">${c}</button>`).join('');
    suggestions.classList.toggle('visible', matches.length > 1);
  }
  function run(raw, keyboard = false) {
    raw = raw.trim();
    if (!raw) return;
    // Keep a long exploration session responsive without changing the visible command history.
    if (entries.length >= 60) entries = entries.slice(-40);
    const firstSpace = raw.indexOf(' ');
    const command = (firstSpace === -1 ? raw : raw.slice(0, firstSpace)).toLowerCase();
    const args = firstSpace === -1 ? '' : raw.slice(firstSpace + 1).trim();
    history.push(raw); historyIndex = history.length; draft = '';
    input.value = ''; showSuggestions([]);
    if (command === 'clear') {
      entries = []; render(); scroll.scrollTop = 0;
    } else if (command === 'themes' && args) {
      if (['terminal', 'espresso'].includes(args.toLowerCase())) { entries.push({id: ++entryId, command: 'themes', raw}); applyTheme(args.toLowerCase()); }
      else { entries.push({id: ++entryId, command: 'theme-error', raw}); render(); }
      scrollToEntry(entryId);
    } else {
      entries.push({id: ++entryId, command: commands.includes(command) ? command : 'unknown', raw, args, snapshot: command === 'history' ? history.slice() : []});
      render(); scrollToEntry(entryId);
    }
    if (keyboard || window.matchMedia('(min-width: 761px)').matches) input.focus({preventScroll: true});
  }
  function scrollToEntry(id) {
    requestAnimationFrame(() => {
      const target = document.getElementById(`entry-${id}`);
      if (target) scroll.scrollTo({top: target.offsetTop - scroll.offsetTop - 23, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
  }
  function toast(message) {
    clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600);
  }
  $('#command-form').addEventListener('submit', e => { e.preventDefault(); run(input.value, true); });
  input.addEventListener('input', () => showSuggestions([]));
  input.addEventListener('keydown', e => {
    if (e.isComposing) return;
    if (e.key === 'Tab' && !e.shiftKey && !input.value.includes(' ')) {
      const prefix = input.value.trim().toLowerCase();
      if (!prefix) return;
      const matches = commands.filter(c => c.startsWith(prefix));
      if (matches.length === 1 && prefix === matches[0]) return;
      if (matches.length) { e.preventDefault(); if (matches.length === 1) { input.value = matches[0]; showSuggestions([]); } else showSuggestions(matches); }
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return; e.preventDefault(); if (historyIndex === history.length) draft = input.value;
      historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex]; showSuggestions([]);
      requestAnimationFrame(() => input.setSelectionRange(input.value.length, input.value.length));
    } else if (e.key === 'ArrowDown') {
      if (!history.length) return; e.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = historyIndex === history.length ? draft : history[historyIndex]; showSuggestions([]);
    } else if (e.key === 'Escape') showSuggestions([]);
  });
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l' && document.activeElement === input) { e.preventDefault(); run('clear', true); }
  });
  document.addEventListener('click', async e => {
    const target = e.target.closest('button, a');
    if (!target) return;
    if (target.dataset.command) { e.preventDefault(); run(target.dataset.command); }
    if (target.dataset.lang) { lang = target.dataset.lang; storage.set('ellen-language', lang); const top = scroll.scrollTop; updateInterface(); scroll.scrollTop = top; }
    if (target.id === 'theme-toggle') { const top = scroll.scrollTop; applyTheme(theme === 'terminal' ? 'espresso' : 'terminal'); scroll.scrollTop = top; }
    if (target.dataset.themeChoice) { const top = scroll.scrollTop; applyTheme(target.dataset.themeChoice); scroll.scrollTop = top; }
    if (target.dataset.complete) { input.value = target.dataset.complete; showSuggestions([]); input.focus(); }
    if (target.hasAttribute('data-copy-email')) { try { await navigator.clipboard.writeText(email); toast(t('copied')); } catch { toast(t('copyFailed')); } }
    if (target.classList.contains('wordmark')) { e.preventDefault(); entries = [{id: ++entryId, command: 'welcome', raw: 'welcome'}]; render(); scroll.scrollTop = 0; }
  });
  $('#year').textContent = new Date().getFullYear();
  applyTheme(theme);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('.name-ascii')?.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:650,easing:'steps(12, end)'});
  }
})();
