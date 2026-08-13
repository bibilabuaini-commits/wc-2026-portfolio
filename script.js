(() => {
  'use strict';

  const pad = (value) => String(value).padStart(2, '0');
  const asset = (number) => `assets/work-${String(number).padStart(3, '0')}.webp`;
  const orientation = (number) => (
    ((number >= 55 && number <= 79) || number >= 99) ? 'portrait' : 'landscape'
  );

  const category = (id, label, start, end) => ({
    id,
    label,
    items: Array.from({ length: end - start + 1 }, (_, index) => {
      const number = start + index;
      return {
        number,
        src: asset(number),
        orientation: orientation(number),
        title: `${label} · ${pad(index + 1)}`,
      };
    }),
  });

  const projects = {
    haitong: {
      name: '海通·观悦',
      categories: [
        category('overview', '双方向概览', 2, 3),
        category('east', '东方红韵', 4, 29),
        category('crystal', '轻奢晶体', 30, 54),
        category('screen', '刷屏系列', 55, 65),
        category('taidong', '台东系列', 66, 79),
        category('feeling', '情怀系列', 80, 87),
        category('events', '活动画面', 88, 95),
        category('explore', '备选探索', 96, 98),
      ],
    },
    hisense: {
      name: '海信张村河',
      categories: [
        category('home', '家是张村河', 99, 105),
        category('creative', '文创与羽毛球', 106, 111),
        category('longform', '社群推文长图', 112, 116),
        category('psychology', '心理活动', 117, 120),
        category('recruit', '主理人招募', 121, 127),
        category('qixi', '七夕前宣', 144, 149),
        category('guandan', '掼蛋活动', 150, 153),
        category('badminton-event', '羽毛球活动刷屏', 154, 154),
      ],
    },
    fuying: {
      name: '福瀛·紫园',
      categories: [
        category('value', '价值小绿书', 128, 132),
        category('story', '项目价值长图', 133, 137),
      ],
    },
    lifecity: {
      name: '生活城',
      categories: [
        category('building', '6 号楼价值传播', 138, 143),
        category('landscape', '园林价值传播', 155, 157),
      ],
    },
  };

  Object.values(projects).forEach((project) => {
    project.allItems = project.categories.flatMap((group) =>
      group.items.map((item) => ({ ...item, group: group.label }))
    );
  });

  const state = {
    lightboxItems: [],
    lightboxIndex: 0,
    galleryBlocks: new Map(),
  };

  const loader = () => {
    const count = document.querySelector('.loader__count');
    const line = document.querySelector('.loader__line span');
    const start = performance.now();
    const duration = 880;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);
      count.textContent = String(value).padStart(3, '0');
      line.style.transform = `scaleX(${eased})`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        document.body.classList.add('is-ready');
        window.setTimeout(() => document.body.classList.remove('is-loading'), 950);
      }
    };
    requestAnimationFrame(tick);
  };

  const initReveal = () => {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element) => observer.observe(element));
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min(1, (now - start) / 1000);
          const value = Math.round(target * (1 - Math.pow(1 - progress, 4)));
          element.textContent = String(value).padStart(target > 9 ? 3 : 2, '0');
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        currentObserver.unobserve(element);
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => observer.observe(counter));
  };

  const initScroll = () => {
    const progressBar = document.querySelector('.scroll-progress span');
    const aiOrb = document.querySelector('.ai-orb');
    let ticking = false;
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? window.scrollY / maximum : 0;
      progressBar.style.transform = `scaleX(${progress})`;
      if (aiOrb) {
        const rect = aiOrb.parentElement.getBoundingClientRect();
        const local = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        aiOrb.style.transform = `translate3d(0, ${(local - 0.5) * 90}px, 0)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  };

  const initCursor = () => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = document.querySelector('.cursor--dot');
    const ring = document.querySelector('.cursor--ring');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    document.body.classList.add('has-cursor');
    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }, { passive: true });
    const follow = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.addEventListener('pointerover', (event) => {
      if (event.target.closest('a, button, .gallery-viewport')) document.body.classList.add('cursor-active');
    });
    document.addEventListener('pointerout', (event) => {
      if (event.target.closest('a, button, .gallery-viewport')) document.body.classList.remove('cursor-active');
    });
  };

  const initMagnetic = () => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const strength = element.classList.contains('folder') ? 4 : 9;
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
        element.style.translate = `${x}px ${y}px`;
      });
      element.addEventListener('pointerleave', () => { element.style.translate = ''; });
    });
  };

  const initFolders = () => {
    const stage = document.querySelector('.folder-stage');
    if (!stage) return;
    const folders = [...stage.querySelectorAll('.folder')];
    if (window.matchMedia('(pointer: fine)').matches) {
      stage.addEventListener('pointermove', (event) => {
        const rect = stage.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
        folders.forEach((folder) => {
          const depth = Number(folder.dataset.depth || 1);
          folder.style.setProperty('--px', `${x * depth}px`);
          folder.style.setProperty('--py', `${y * depth}px`);
        });
      });
      stage.addEventListener('pointerleave', () => {
        folders.forEach((folder) => {
          folder.style.setProperty('--px', '0px');
          folder.style.setProperty('--py', '0px');
        });
      });
    }
    folders.forEach((folder) => {
      folder.addEventListener('click', () => document.querySelector(folder.dataset.target)?.scrollIntoView({ behavior: 'smooth' }));
    });
  };

  const initMobileMenu = () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  };

  const initCareerFilm = () => {
    const screen = document.querySelector('[data-career-film]');
    if (!screen) return;
    const canvas = screen.querySelector('[data-film-canvas]');
    const context = canvas?.getContext('2d', { alpha: false, desynchronized: true });
    if (!canvas || !context) return;

    const scenes = [
      {
        duration: 3000, chapter: 0, phase: '00 / PROLOGUE', title: '我的工作履历', role: '三段经历，形成复合型设计判断',
        description: '地产执行、品牌训练与 AI 生产力，在同一套方法中汇合。',
        tags: ['地产执行', '品牌判断', 'AI 生产力'], accent: '#ed174c', theme: 'light', layout: 'micro', visual: 'seed', tools: [],
      },
      {
        duration: 3700, chapter: 1, phase: '01 / FOUNDATION', title: '众合摆渡', role: '地产广告经验',
        description: '建立地产项目语感、卖点表达与高强度执行能力。',
        tags: ['项目语感', '卖点表达', '高强度执行'], accent: '#ed174c', theme: 'light', layout: 'left', visual: 'network', tools: ['ai'],
      },
      {
        duration: 3700, chapter: 1, phase: '01.1 / LANGUAGE', title: '项目语感', role: '从卖点，到准确的视觉表达',
        description: '在复杂信息中找到传播重心，让画面首先完成沟通。',
        tags: ['信息提炼', '卖点转译', '画面秩序'], accent: '#ed174c', theme: 'light', layout: 'right', visual: 'horizon', tools: ['ai'],
      },
      {
        duration: 3700, chapter: 1, phase: '01.2 / DELIVERY', title: '高强度执行', role: '速度，首先是一种可靠性',
        description: '在密集节点与持续交付中，建立稳定、准确的执行能力。',
        tags: ['快速响应', '连续交付', '品质稳定'], accent: '#ed174c', theme: 'dark', layout: 'micro', visual: 'scatter', tools: ['ai'],
      },
      {
        duration: 3700, chapter: 1, phase: '01.3 / FOUNDATION', title: '第一层能力', role: '准确 · 快速 · 可落地',
        description: '地产广告训练，让执行不只是完成，而是按目标完成。',
        tags: ['准确', '速度', '落地'], accent: '#ed174c', theme: 'light', layout: 'micro', visual: 'cross', tools: [],
      },
      {
        duration: 3700, chapter: 2, phase: '02 / BRAND TRAINING', title: '深度传媒', role: '地产 + 品牌经验',
        description: '延续地产项目，同时接受系统的品牌规范与专业沟通训练。',
        tags: ['品牌规范', '系统判断', '专业沟通'], accent: '#192557', theme: 'light', layout: 'right', visual: 'modules', tools: ['ps'],
      },
      {
        duration: 3700, chapter: 2, phase: '02.1 / STANDARD', title: '品牌标准', role: '从单张好看，走向系统统一',
        description: '理解规范、识别边界，并在不同触点保持一致的品牌体验。',
        tags: ['规范', '一致性', '延展'], accent: '#192557', theme: 'light', layout: 'left', visual: 'ribbon', tools: ['ps'],
      },
      {
        duration: 3700, chapter: 2, phase: '02.2 / COMMUNICATION', title: '专业沟通', role: '让设计判断可以被解释',
        description: '从被动接收需求，到理解目标、澄清问题并形成共识。',
        tags: ['理解目标', '澄清问题', '形成共识'], accent: '#ed174c', theme: 'dark', layout: 'micro', visual: 'orbital', tools: ['ai', 'ps'],
      },
      {
        duration: 3700, chapter: 2, phase: '02.3 / JUDGEMENT', title: '第二层能力', role: '规范 · 系统 · 判断',
        description: '品牌训练让设计从个人感受，转向可解释、可复用的标准。',
        tags: ['系统意识', '品牌判断', '专业表达'], accent: '#192557', theme: 'light', layout: 'micro', visual: 'matrix', tools: [],
      },
      {
        duration: 3700, chapter: 3, phase: '03 / INTEGRATION', title: '大策略传媒', role: '能力整合',
        description: '承接提报、社群、活动与日常执行，形成跨类型输出。',
        tags: ['提报', '社群', '活动', '日常'], accent: '#ed174c', theme: 'dark', layout: 'left', visual: 'skyline', tools: ['ai', 'ps', 'gpt'],
      },
      {
        duration: 3700, chapter: 3, phase: '03.1 / MULTI-FORMAT', title: '多类型输出', role: '在不同传播语境中保持判断',
        description: '不是重复同一种画面，而是理解每一次传播的任务。',
        tags: ['提报逻辑', '社群内容', '活动传播'], accent: '#ed174c', theme: 'light', layout: 'right', visual: 'wave', tools: ['ai', 'ps'],
      },
      {
        duration: 3700, chapter: 3, phase: '03.2 / AI WORKFLOW', title: 'AI 协同', role: '把工具，真正变成生产力',
        description: '用 ChatGPT 梳理信息，用 AI 扩展方案，再由专业判断完成取舍。',
        tags: ['信息整理', '视觉探索', '判断取舍'], accent: '#ed174c', theme: 'light', layout: 'micro', visual: 'tools', tools: ['ai', 'ps', 'gpt'],
      },
      {
        duration: 3700, chapter: 3, phase: '03.3 / METHOD', title: '方法形成', role: '理解 → 判断 → 表达 → 交付',
        description: '把经验整理成路径，让创意质量与执行效率同时提升。',
        tags: ['理解', '判断', '表达', '交付'], accent: '#192557', theme: 'dark', layout: 'micro', visual: 'constellation', tools: ['gpt'],
      },
      {
        duration: 3700, chapter: 4, phase: '04 / SYNTHESIS', title: '复合型设计能力', role: '基本功 × 品牌判断 × AI 生产力',
        description: '三段经历没有彼此替代，而是在今天汇聚成一套完整能力。',
        tags: ['设计基本功', '品牌判断', 'AI 生产力'], accent: '#ed174c', theme: 'light', layout: 'final', visual: 'synthesis', tools: ['ai', 'ps', 'gpt'],
      },
      {
        duration: 3700, chapter: 4, phase: '04.1 / GROWTH', title: '持续生长', role: '从个人产出，走向可复用的方法',
        description: '做出好作品，也沉淀更好的工作方式，让能力持续产生价值。',
        tags: ['作品', '方法', '协作'], accent: '#ed174c', theme: 'dark', layout: 'micro', visual: 'manifesto', tools: ['ai', 'ps', 'gpt'],
      },
      {
        duration: 5200, chapter: 4, phase: '05 / EPILOGUE', title: '把意图，变成看得见的价值', role: 'WORK HISTORY / 2026',
        description: '众合摆渡 → 深度传媒 → 大策略传媒',
        tags: ['VISUAL DESIGN', 'BRAND THINKING', 'AI WORKFLOW'], accent: '#ed174c', theme: 'light', layout: 'final', visual: 'close', tools: [],
      },
    ];
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    screen.dataset.duration = String(totalDuration);
    const fields = {
      phase: screen.querySelector('[data-film-phase]'),
      title: screen.querySelector('[data-film-title]'),
      role: screen.querySelector('[data-film-role]'),
      description: screen.querySelector('[data-film-description]'),
      tags: screen.querySelector('[data-film-tags]'),
      clock: screen.querySelector('[data-film-clock]'),
      progress: screen.querySelector('.film-progress span'),
    };
    const toggle = screen.querySelector('.film-toggle');
    const chapterMarkers = [...screen.querySelectorAll('[data-chapter]')];
    const toolCards = [...screen.querySelectorAll('[data-tool]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fract = (value) => value - Math.floor(value);
    const random = (seed) => fract(Math.sin(seed * 91.173 + 17.41) * 43758.5453);
    const nodes = Array.from({ length: 58 }, (_, index) => ({
      x: random(index * 3 + 1), y: random(index * 3 + 2), size: 2 + random(index * 3 + 3) * 6,
    }));
    const blocks = Array.from({ length: 54 }, (_, index) => ({
      x: random(index * 5 + 1), y: random(index * 5 + 2), size: 4 + random(index * 5 + 3) * 24,
      rotate: random(index * 5 + 4) * Math.PI, tone: random(index * 5 + 5),
    }));
    const toolPositions = {
      1: { ai: [83, 70, -6] }, 2: { ai: [17, 70, 5] }, 3: { ai: [15, 21, -4] },
      5: { ps: [15, 69, 5] }, 6: { ps: [86, 68, -5] }, 7: { ai: [14, 21, -5], ps: [86, 75, 6] },
      9: { ai: [58, 79, -5], ps: [73, 79, 4], gpt: [87, 23, 4] }, 10: { ai: [13, 24, -5], ps: [15, 72, 5] },
      11: { ai: [24, 66, -4], ps: [50, 23, 0], gpt: [76, 66, 4] }, 12: { gpt: [84, 22, 4] },
      13: { ai: [42, 76, -3], ps: [50, 76, 0], gpt: [58, 76, 3] }, 14: { ai: [18, 74, -5], ps: [50, 74, 0], gpt: [82, 74, 5] },
    };
    let sceneIndex = reducedMotion ? scenes.length - 3 : 0;
    let userPaused = reducedMotion;
    let inView = false;
    let frame = 0;
    let elapsed = reducedMotion ? scenes.slice(0, sceneIndex).reduce((sum, scene) => sum + scene.duration, 0) + 4200 : 0;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const ease = (value) => 1 - Math.pow(1 - clamp(value), 4);
    const smooth = (value) => value * value * (3 - 2 * value);
    const rgba = (hex, alpha) => {
      const value = hex.replace('#', '');
      const number = parseInt(value.length === 3 ? value.split('').map((item) => item + item).join('') : value, 16);
      return `rgba(${(number >> 16) & 255},${(number >> 8) & 255},${number & 255},${alpha})`;
    };

    const resize = () => {
      const bounds = screen.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const scale = Math.min(window.devicePixelRatio || 1, 3840 / width, 2160 / height);
      const pixelWidth = Math.max(1, Math.round(width * scale));
      const pixelHeight = Math.max(1, Math.round(height * scale));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
      }
    };

    const line = (x1, y1, x2, y2, color, alpha = 1, lineWidth = 1) => {
      context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2);
      context.strokeStyle = rgba(color, alpha); context.lineWidth = lineWidth; context.stroke();
    };
    const square = (x, y, size, color, alpha = 1, rotation = 0, outline = false) => {
      context.save(); context.translate(x, y); context.rotate(rotation); context.globalAlpha = alpha;
      if (outline) { context.strokeStyle = color; context.lineWidth = 1; context.strokeRect(-size / 2, -size / 2, size, size); }
      else { context.fillStyle = color; context.fillRect(-size / 2, -size / 2, size, size); }
      context.restore(); context.globalAlpha = 1;
    };
    const circle = (x, y, radius, color, alpha = 1, lineWidth = 1) => {
      context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.strokeStyle = rgba(color, alpha); context.lineWidth = lineWidth; context.stroke();
    };
    const label = (text, x, y, color, alpha = .55, align = 'center') => {
      context.save(); context.globalAlpha = alpha; context.fillStyle = color; context.textAlign = align;
      context.font = `600 ${Math.max(7, width * .006)}px Arial, sans-serif`; context.letterSpacing = '1px'; context.fillText(text, x, y); context.restore();
    };

    const background = (scene, local, seconds) => {
      const dark = scene.theme === 'dark';
      const bg = dark ? '#050711' : '#f2f2ef';
      const ink = dark ? '#f4f3ef' : '#10131d';
      context.fillStyle = bg; context.fillRect(0, 0, width, height);
      const glow = context.createRadialGradient(width * .5, height * .5, 0, width * .5, height * .5, Math.max(width, height) * .72);
      glow.addColorStop(0, rgba(scene.accent, dark ? .12 : .055)); glow.addColorStop(.55, rgba(scene.accent, .015)); glow.addColorStop(1, rgba(bg, 0));
      context.fillStyle = glow; context.fillRect(0, 0, width, height);
      context.lineWidth = 1;
      for (let index = 1; index < 12; index += 1) {
        const x = (width / 12) * index + Math.sin(seconds * .07 + index) * 3;
        line(x, 0, x, height, ink, dark ? .026 : .035);
      }
      for (let index = 1; index < 7; index += 1) line(0, (height / 7) * index, width, (height / 7) * index, ink, dark ? .022 : .03);
      nodes.slice(0, 24).forEach((node, index) => {
        const shimmer = .012 + .018 * (Math.sin(seconds * .8 + index) * .5 + .5);
        square(node.x * width, node.y * height, 1.2, ink, shimmer);
      });
      return { dark, bg, ink, accent: scene.accent, local };
    };

    const drawSeed = (palette, progress, seconds) => {
      const reveal = ease(progress * 2.2); const size = 7 + reveal * 7; const x = width / 2; const y = height / 2;
      const glow = context.createRadialGradient(x, y, 0, x, y, width * .16);
      glow.addColorStop(0, rgba(palette.accent, .2 * reveal)); glow.addColorStop(1, rgba(palette.accent, 0));
      context.fillStyle = glow; context.fillRect(0, 0, width, height);
      line(width * .17, y, width * .83, y, palette.ink, .13 * reveal);
      line(x, height * .22, x, height * .78, palette.ink, .1 * reveal);
      circle(x, y, 48 + Math.sin(seconds) * 4, palette.accent, .15 * reveal);
      square(x, y, size, palette.accent, reveal, seconds * .07);
      label('CAREER / ORIGIN', x, y + 76, palette.ink, .36 * reveal);
    };

    const drawNetwork = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.6); const centerX = width * .68; const centerY = height * .5;
      nodes.forEach((node, index) => {
        const x = centerX + (node.x * width - centerX) * reveal;
        const y = centerY + (node.y * height - centerY) * reveal;
        const other = nodes[(index * 7 + 11) % nodes.length];
        const ox = centerX + (other.x * width - centerX) * reveal;
        const oy = centerY + (other.y * height - centerY) * reveal;
        if (Math.hypot(x - ox, y - oy) < width * .3) line(x, y, ox, oy, palette.ink, .1 * reveal);
        square(x, y, index % 6 === 0 ? node.size + 3 : 3, index % 8 === 0 ? palette.accent : palette.ink, .75 * reveal, seconds * .05 + node.x);
      });
      circle(centerX, centerY, width * (.06 + .012 * Math.sin(seconds)), palette.accent, .25 * reveal);
      label('FOUNDATION / 01', centerX, centerY + width * .095, palette.ink, .45 * reveal);
    };

    const drawHorizon = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.8); const y = height * .53;
      const gradient = context.createLinearGradient(0, y, width, y);
      gradient.addColorStop(0, rgba(palette.ink, 0)); gradient.addColorStop(.35, rgba(palette.ink, .2 * reveal)); gradient.addColorStop(.5, rgba(palette.accent, .8 * reveal)); gradient.addColorStop(.65, rgba(palette.ink, .2 * reveal)); gradient.addColorStop(1, rgba(palette.ink, 0));
      context.fillStyle = gradient; context.fillRect(0, y - 1, width, 2);
      const x = width * (.13 + .7 * smooth(clamp(progress * 1.08)));
      square(x, y - 7, 11, palette.accent, .95, seconds * .18);
      for (let index = 0; index < 21; index += 1) {
        const tickX = width * (.1 + index * .04);
        line(tickX, y + 16, tickX, y + 20 + (index % 5 === 0 ? 8 : 0), palette.ink, .18 * reveal);
      }
      label('FROM INFORMATION TO IMAGE', width * .5, y + 58, palette.ink, .42 * reveal);
    };

    const drawScatter = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.4); const cx = width * .5; const cy = height * .5;
      blocks.forEach((block, index) => {
        const distance = .1 + block.tone * .9;
        const x = cx + (block.x - .5) * width * 1.25 * reveal * distance;
        const y = cy + (block.y - .5) * height * 1.25 * reveal * distance;
        const color = index % 9 === 0 ? palette.accent : (index % 4 === 0 ? '#f4f3ef' : '#18214d');
        square(x, y, block.size * (.3 + .7 * reveal), color, .72 * reveal, block.rotate + seconds * (index % 2 ? .06 : -.04));
      });
      circle(cx, cy, width * .09 * reveal, palette.accent, .38 * reveal);
      circle(cx, cy, width * .15 * reveal, palette.ink, .1 * reveal);
    };

    const drawCross = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.7); const cx = width * .5; const cy = height * .5;
      for (let index = -6; index <= 6; index += 1) {
        line(cx + index * width * .028, cy - height * .24 * reveal, cx + index * width * .028, cy + height * .24 * reveal, palette.ink, .08 * reveal);
        line(cx - width * .18 * reveal, cy + index * height * .045, cx + width * .18 * reveal, cy + index * height * .045, palette.ink, .08 * reveal);
      }
      const pulse = .75 + Math.sin(seconds * 2) * .12;
      square(cx, cy, width * .055 * pulse, palette.accent, .92 * reveal, Math.PI * .25, true);
      square(cx, cy, width * .018, palette.accent, reveal, seconds * .1);
      label('ACCURACY / SPEED / DELIVERY', cx, cy + height * .33, palette.ink, .45 * reveal);
    };

    const drawModules = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.45); const originX = width * .23; const originY = height * .5;
      blocks.slice(0, 42).forEach((block, index) => {
        const column = index % 7; const row = Math.floor(index / 7);
        const targetX = width * (.09 + column * .045); const targetY = height * (.28 + row * .075);
        const x = originX + (targetX - originX) * reveal; const y = originY + (targetY - originY) * reveal;
        const size = Math.min(width, height) * (.025 + (index % 5) * .004);
        square(x, y, size, index % 8 === 0 ? palette.accent : '#152052', .88 * reveal, (1 - reveal) * block.rotate);
      });
      line(width * .06, height * .73, width * .39, height * .73, palette.ink, .18 * reveal);
      label('BRAND MODULES / 02', width * .225, height * .78, palette.ink, .45 * reveal);
    };

    const drawRibbon = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.8);
      for (let index = 0; index < 11; index += 1) {
        context.beginPath();
        for (let step = 0; step <= 70; step += 1) {
          const t = step / 70; const x = width * (.08 + .84 * t);
          const y = height * (.5 + Math.sin(t * Math.PI * 2 + index * .38 + seconds * .25) * (.02 + index * .004));
          if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = rgba(index === 5 ? palette.accent : palette.ink, (index === 5 ? .55 : .08) * reveal);
        context.lineWidth = index === 5 ? 2 : 1; context.stroke();
      }
      square(width * (.12 + .76 * smooth(progress)), height * .5, 10, palette.accent, .95, seconds * .12);
      label('ONE SYSTEM / MANY TOUCHPOINTS', width * .5, height * .66, palette.ink, .42 * reveal);
    };

    const drawOrbital = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.4); const cx = width * .5; const cy = height * .49;
      for (let ring = 1; ring <= 4; ring += 1) circle(cx, cy, width * (.045 + ring * .04) * reveal, ring === 3 ? palette.accent : palette.ink, ring === 3 ? .38 : .12);
      for (let index = 0; index < 18; index += 1) {
        const radius = width * (.09 + (index % 4) * .04) * reveal;
        const angle = seconds * (index % 2 ? .18 : -.12) + index * .78;
        const x = cx + Math.cos(angle) * radius; const y = cy + Math.sin(angle) * radius * .6;
        square(x, y, index % 5 === 0 ? 9 : 4, index % 5 === 0 ? palette.accent : palette.ink, .8 * reveal, angle);
      }
      label('UNDERSTAND / ALIGN / DECIDE', cx, cy + height * .31, palette.ink, .45 * reveal);
    };

    const drawMatrix = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.5); const cx = width * .5; const cy = height * .49;
      context.save(); context.translate(cx, cy); context.rotate(Math.sin(seconds * .22) * .08);
      for (let row = -4; row <= 4; row += 1) for (let column = -6; column <= 6; column += 1) {
        const distance = Math.hypot(row / 4, column / 6); const size = Math.max(2, 12 - distance * 5) * reveal;
        square(column * width * .032, row * width * .032, size, (row + column) % 9 === 0 ? palette.accent : '#182451', .72 * reveal, seconds * .03 + distance);
      }
      context.restore();
      circle(cx, cy, width * .24 * reveal, palette.ink, .08);
    };

    const drawSkyline = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.35); const base = height * .68;
      for (let index = 0; index < 34; index += 1) {
        const x = width * (.44 + index * .016); const buildingHeight = height * (.05 + random(index + 40) * .29) * reveal;
        const buildingWidth = width * (.009 + random(index + 90) * .009);
        context.fillStyle = rgba(index % 8 === 0 ? palette.accent : '#182451', .78);
        context.fillRect(x, base - buildingHeight, buildingWidth, buildingHeight);
        context.fillStyle = rgba('#f4f3ef', .15);
        for (let floor = 8; floor < buildingHeight; floor += 13) context.fillRect(x + 3, base - floor, Math.max(1, buildingWidth - 6), 1);
      }
      line(width * .41, base, width * .97, base, palette.accent, .55 * reveal, 1.5);
      const flare = context.createRadialGradient(width * .7, base, 0, width * .7, base, width * .27);
      flare.addColorStop(0, rgba(palette.accent, .16)); flare.addColorStop(1, rgba(palette.accent, 0)); context.fillStyle = flare; context.fillRect(width * .38, base - height * .35, width * .62, height * .7);
      label('INTEGRATED OUTPUT / 03', width * .7, height * .79, palette.ink, .46 * reveal);
    };

    const drawWave = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.7); const points = 64; let previous = null;
      for (let index = 0; index < points; index += 1) {
        const t = index / (points - 1); const x = width * (.07 + .86 * t);
        const y = height * (.5 + Math.sin(t * Math.PI * 4 + seconds * .45) * .12 * Math.sin(t * Math.PI));
        if (previous) line(previous.x, previous.y, x, y, palette.ink, .18 * reveal);
        square(x, y, index % 8 === 0 ? 8 : 3, index % 8 === 0 ? palette.accent : palette.ink, .75 * reveal, seconds * .1);
        previous = { x, y };
      }
      for (let index = 0; index < 7; index += 1) circle(width * (.12 + index * .125), height * .5, width * .018 * reveal, palette.accent, .15 * reveal);
    };

    const drawTools = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.5); const points = [[.24,.66],[.5,.23],[.76,.66]];
      line(width * points[0][0], height * points[0][1], width * points[1][0], height * points[1][1], palette.ink, .25 * reveal);
      line(width * points[1][0], height * points[1][1], width * points[2][0], height * points[2][1], palette.ink, .25 * reveal);
      line(width * points[2][0], height * points[2][1], width * points[0][0], height * points[0][1], palette.accent, .35 * reveal);
      points.forEach(([x, y], index) => {
        circle(width * x, height * y, width * (.055 + Math.sin(seconds + index) * .004), index === 2 ? palette.accent : palette.ink, .24 * reveal);
        for (let dot = 0; dot < 10; dot += 1) {
          const angle = seconds * (index % 2 ? -.2 : .18) + dot * Math.PI * .2;
          square(width * x + Math.cos(angle) * width * .075, height * y + Math.sin(angle) * width * .075, 3, index === 2 ? palette.accent : palette.ink, .55 * reveal);
        }
      });
      label('TOOLS BECOME A WORKFLOW', width * .5, height * .82, palette.ink, .45 * reveal);
    };

    const drawConstellation = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.45); const visible = Math.floor(nodes.length * reveal);
      nodes.forEach((node, index) => {
        if (index >= visible) return;
        const x = width * (.08 + node.x * .84); const y = height * (.18 + node.y * .64);
        for (let offset = 1; offset <= 2; offset += 1) {
          const other = nodes[(index + offset * 9) % nodes.length]; const ox = width * (.08 + other.x * .84); const oy = height * (.18 + other.y * .64);
          if (Math.hypot(x - ox, y - oy) < width * .19) line(x, y, ox, oy, palette.ink, .09 * reveal);
        }
        square(x, y, index % 10 === 0 ? 8 : 3, index % 10 === 0 ? palette.accent : palette.ink, .75 * reveal, seconds * .05);
      });
      const x = width * (.5 + Math.sin(seconds * .2) * .06); const y = height * (.5 + Math.cos(seconds * .17) * .05);
      circle(x, y, width * .08, palette.accent, .28 * reveal);
    };

    const drawSynthesis = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.45); const cx = width * .5; const cy = height * .48;
      const origins = [[.18,.22],[.82,.22],[.18,.75],[.82,.75]];
      origins.forEach(([ox, oy], group) => {
        for (let index = 0; index < 11; index += 1) {
          const angle = index * .72 + group; const spread = width * (.03 + index * .006);
          const startX = width * ox + Math.cos(angle) * spread; const startY = height * oy + Math.sin(angle) * spread;
          const x = startX + (cx - startX) * reveal; const y = startY + (cy - startY) * reveal;
          square(x, y, 4 + (index % 4) * 2, group === 0 ? palette.accent : '#182451', .74, angle + seconds * .03);
          line(startX, startY, x, y, group === 0 ? palette.accent : palette.ink, .06 * reveal);
        }
      });
      circle(cx, cy, width * .16 * reveal, palette.ink, .1 * reveal);
      circle(cx, cy, width * .095 * reveal, palette.accent, .22 * reveal);
      square(cx, cy, 14 + Math.sin(seconds * 1.4) * 2, palette.accent, .95, seconds * .08);
    };

    const drawManifesto = (palette, progress, seconds) => {
      const reveal = ease(progress * 1.5); const cx = width * .5; const cy = height * .47;
      for (let index = 0; index < 32; index += 1) {
        const ring = index % 3; const radius = width * (.07 + ring * .055) * reveal;
        const angle = index * .92 + seconds * (ring % 2 ? -.08 : .11);
        const x = cx + Math.cos(angle) * radius; const y = cy + Math.sin(angle) * radius * .62;
        square(x, y, 4 + (index % 5), index % 8 === 0 ? palette.accent : palette.ink, .72 * reveal, angle);
      }
      line(cx, height * .14, cx, height * .82, palette.ink, .11 * reveal);
      square(cx, cy, width * .035, palette.accent, .9 * reveal, Math.PI * .25 + seconds * .05, true);
    };

    const drawClose = (palette, progress, seconds) => {
      const enter = ease(progress * 2); const exit = ease(clamp((progress - .68) / .32)); const cx = width * .5; const cy = height * .5;
      blocks.slice(0, 36).forEach((block, index) => {
        const spread = (1 - enter) * 1.1 + exit * 1.25; const x = cx + (block.x - .5) * width * spread; const y = cy + (block.y - .5) * height * spread;
        square(x, y, Math.max(2, block.size * .42), index % 9 === 0 ? palette.accent : '#182451', .42 * (1 - exit), block.rotate + seconds * .03);
      });
      const radius = width * (.13 * (1 - exit) + .02); circle(cx, cy, radius, palette.accent, .25 * (1 - exit));
      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, width * .18);
      glow.addColorStop(0, rgba(palette.accent, .17 * (1 - exit))); glow.addColorStop(1, rgba(palette.accent, 0)); context.fillStyle = glow; context.fillRect(0, 0, width, height);
      square(cx, cy, 13 * (1 - exit) + 5, palette.accent, 1 - exit * .45, seconds * .06);
    };

    const renderers = {
      seed: drawSeed, network: drawNetwork, horizon: drawHorizon, scatter: drawScatter, cross: drawCross,
      modules: drawModules, ribbon: drawRibbon, orbital: drawOrbital, matrix: drawMatrix, skyline: drawSkyline,
      wave: drawWave, tools: drawTools, constellation: drawConstellation, synthesis: drawSynthesis, manifesto: drawManifesto, close: drawClose,
    };

    const applyScene = (index, immediate = false) => {
      const scene = scenes[index];
      const commit = () => {
        screen.dataset.scene = String(index);
        screen.dataset.theme = scene.theme;
        screen.dataset.layout = scene.layout;
        screen.style.setProperty('--film-accent', scene.accent);
        fields.phase.textContent = scene.phase;
        fields.title.textContent = scene.title;
        fields.role.textContent = scene.role;
        fields.description.textContent = scene.description;
        fields.tags.replaceChildren(...scene.tags.map((label) => {
          const span = document.createElement('span');
          span.textContent = label;
          return span;
        }));
        chapterMarkers.forEach((marker) => marker.classList.toggle('is-active', Number(marker.dataset.chapter) === scene.chapter));
        toolCards.forEach((card) => {
          const position = toolPositions[index]?.[card.dataset.tool];
          card.classList.toggle('is-visible', scene.tools.includes(card.dataset.tool));
          if (position) {
            card.style.setProperty('--tool-x', `${position[0]}%`);
            card.style.setProperty('--tool-y', `${position[1]}%`);
            card.style.setProperty('--tool-r', `${position[2]}deg`);
          }
        });
        requestAnimationFrame(() => screen.classList.remove('is-switching'));
      };
      if (immediate) commit();
      else {
        screen.classList.add('is-switching');
        window.setTimeout(commit, 260);
      }
    };

    const locateScene = (time) => {
      let offset = 0;
      for (let index = 0; index < scenes.length; index += 1) {
        const end = offset + scenes[index].duration;
        if (time < end) return { index, local: time - offset, duration: scenes[index].duration };
        offset = end;
      }
      return { index: 0, local: 0, duration: scenes[0].duration };
    };

    const render = (now) => {
      frame = 0;
      resize();
      if (!userPaused && inView) elapsed = (elapsed + Math.min(100, now - lastTime)) % totalDuration;
      lastTime = now;
      const located = locateScene(elapsed);
      if (located.index !== sceneIndex) {
        sceneIndex = located.index;
        applyScene(sceneIndex);
      }
      const scene = scenes[located.index];
      const progress = clamp(located.local / located.duration);
      const seconds = elapsed / 1000;
      const palette = background(scene, progress, seconds);
      context.save();
      const transitionIn = smooth(clamp(progress / .1));
      const transitionOut = smooth(clamp((1 - progress) / .08));
      context.globalAlpha = Math.min(transitionIn, transitionOut);
      const motionProgress = scene.visual === 'close' ? progress : clamp(progress * 1.85);
      const motionSeconds = seconds * 1.65;
      renderers[scene.visual]?.(palette, motionProgress, motionSeconds);
      context.restore();
      fields.progress.style.transform = `scaleX(${elapsed / totalDuration})`;
      const wholeSeconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(wholeSeconds / 60);
      const secondsPart = wholeSeconds % 60;
      const frames = Math.floor((elapsed % 1000) / (1000 / 24));
      fields.clock.textContent = `00:${String(minutes).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
      if (inView && !userPaused) frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (frame || !inView) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    screen.addEventListener('career-film:seek', (event) => {
      stop();
      elapsed = clamp(Number(event.detail) || 0, 0, totalDuration - 1);
      const located = locateScene(elapsed);
      sceneIndex = located.index;
      applyScene(sceneIndex, true);
      lastTime = performance.now();
      render(lastTime);
    });

    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      screen.classList.toggle('is-paused', userPaused);
      toggle.querySelector('span').textContent = userPaused ? 'PLAY' : 'PAUSE';
      toggle.setAttribute('aria-label', userPaused ? '播放履历动画' : '暂停履历动画');
      lastTime = performance.now();
      if (!frame) start();
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        if (inView) start(); else stop();
      });
    }, { threshold: 0.18 });
    observer.observe(screen);
    window.addEventListener('resize', resize, { passive: true });
    if (reducedMotion) {
      screen.classList.add('is-paused');
      toggle.querySelector('span').textContent = 'PLAY';
    }
    applyScene(sceneIndex, true);
    resize();
    render(performance.now());
  };

  const cardTemplate = (item, index, projectName) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-card gallery-card--${item.orientation}`;
    button.dataset.index = String(index);
    button.setAttribute('aria-label', `查看 ${projectName} ${item.title}`);
    const image = document.createElement('img');
    image.alt = `${projectName}｜${item.title}`;
    // Native lazy-loading can miss absolutely positioned images inside a horizontal scroller.
    // Load the first two cards immediately, then promote nearby cards as the visitor moves.
    image.loading = index < 2 ? 'eager' : 'lazy';
    if (index === 0) image.fetchPriority = 'high';
    image.decoding = 'async';
    const applyNaturalRatio = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      button.style.setProperty('--asset-ratio', String(image.naturalWidth / image.naturalHeight));
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
    };
    image.addEventListener('load', applyNaturalRatio, { once: true });
    image.src = item.src;
    if (image.complete) applyNaturalRatio();
    const meta = document.createElement('span');
    meta.className = 'gallery-card__meta';
    meta.innerHTML = `<span>${pad(index + 1)}</span><strong>${item.title}</strong>`;
    button.append(image, meta);
    return button;
  };

  const updateGalleryCounter = (record) => {
    const cards = [...record.track.children];
    if (!cards.length) return;
    const left = record.viewport.scrollLeft;
    let nearest = 0;
    let distance = Infinity;
    cards.forEach((card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - left);
      if (currentDistance < distance) {
        distance = currentDistance;
        nearest = index;
      }
    });
    record.counter.textContent = `${pad(nearest + 1)} / ${pad(record.items.length)}`;
    cards.slice(Math.max(0, nearest - 1), nearest + 3).forEach((card) => {
      const image = card.querySelector('img');
      if (image && !image.complete) image.loading = 'eager';
    });
  };

  const renderGallery = (record, categoryId = 'all') => {
    record.activeCategory = categoryId;
    const project = projects[record.projectId];
    record.items = categoryId === 'all'
      ? project.allItems
      : project.categories.find((group) => group.id === categoryId).items.map((item) => ({
          ...item,
          group: project.categories.find((group) => group.id === categoryId).label,
        }));
    record.track.style.opacity = '0';
    window.setTimeout(() => {
      record.track.replaceChildren(...record.items.map((item, index) => {
        const card = cardTemplate(item, index, project.name);
        card.addEventListener('click', () => {
          if (!record.wasDragged) openLightbox(record.items, index, project.name);
        });
        return card;
      }));
      record.viewport.scrollLeft = 0;
      record.track.style.opacity = '1';
      record.counter.textContent = `01 / ${pad(record.items.length)}`;
    }, 160);
    record.filters.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === categoryId);
    });
  };

  const initGalleryDrag = (record) => {
    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    record.wasDragged = false;
    record.viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = record.viewport.scrollLeft;
      record.wasDragged = false;
    });
    record.viewport.addEventListener('pointermove', (event) => {
      if (pointerId !== event.pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5 && !record.wasDragged) {
        record.wasDragged = true;
        record.viewport.classList.add('is-dragging');
        record.viewport.setPointerCapture(pointerId);
      }
      record.viewport.scrollLeft = startScroll - delta;
    });
    const finish = (event) => {
      if (pointerId !== event.pointerId) return;
      record.viewport.classList.remove('is-dragging');
      if (record.viewport.hasPointerCapture(pointerId)) record.viewport.releasePointerCapture(pointerId);
      pointerId = null;
      window.setTimeout(() => { record.wasDragged = false; }, 60);
    };
    record.viewport.addEventListener('pointerup', finish);
    record.viewport.addEventListener('pointercancel', finish);
  };

  const initGalleries = () => {
    document.querySelectorAll('[data-gallery-block]').forEach((block) => {
      const projectId = block.dataset.galleryBlock;
      const project = projects[projectId];
      const record = {
        projectId,
        block,
        filters: block.querySelector('.gallery-filters'),
        viewport: block.querySelector('.gallery-viewport'),
        track: block.querySelector('.gallery-track'),
        counter: block.querySelector('.gallery-counter'),
        items: [],
      };
      const filters = [{ id: 'all', label: '全部' }, ...project.categories.map(({ id, label }) => ({ id, label }))];
      filters.forEach((filter) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.category = filter.id;
        button.textContent = filter.label;
        button.addEventListener('click', () => renderGallery(record, filter.id));
        record.filters.append(button);
      });
      block.querySelector('[data-gallery-prev]').addEventListener('click', () => {
        record.viewport.scrollBy({ left: -record.viewport.clientWidth * 0.75, behavior: 'smooth' });
      });
      block.querySelector('[data-gallery-next]').addEventListener('click', () => {
        record.viewport.scrollBy({ left: record.viewport.clientWidth * 0.75, behavior: 'smooth' });
      });
      let scrollTimer;
      record.viewport.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => updateGalleryCounter(record), 80);
      }, { passive: true });
      initGalleryDrag(record);
      state.galleryBlocks.set(projectId, record);
      renderGallery(record);
    });
  };

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCount = lightbox?.querySelector('figcaption span');
  const lightboxTitle = lightbox?.querySelector('figcaption strong');

  const updateLightbox = () => {
    const item = state.lightboxItems[state.lightboxIndex];
    if (!item) return;
    lightboxImage.style.opacity = '0';
    lightboxImage.onload = () => { lightboxImage.style.opacity = '1'; };
    lightboxImage.src = item.src;
    lightboxImage.alt = `${state.lightboxProject}｜${item.title}`;
    lightboxCount.textContent = `${pad(state.lightboxIndex + 1)} / ${pad(state.lightboxItems.length)}`;
    lightboxTitle.textContent = `${state.lightboxProject} · ${item.title}`;
    [-1, 1].forEach((offset) => {
      const index = (state.lightboxIndex + offset + state.lightboxItems.length) % state.lightboxItems.length;
      const preload = new Image();
      preload.src = state.lightboxItems[index].src;
    });
  };

  const moveLightbox = (direction) => {
    state.lightboxIndex = (state.lightboxIndex + direction + state.lightboxItems.length) % state.lightboxItems.length;
    updateLightbox();
  };

  const openLightbox = (items, index, projectName) => {
    state.lightboxItems = items;
    state.lightboxIndex = index;
    state.lightboxProject = projectName;
    updateLightbox();
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  };

  const initLightbox = () => {
    if (!lightbox) return;
    const close = () => {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
      document.body.style.overflow = '';
    };
    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => moveLightbox(-1));
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => moveLightbox(1));
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    lightbox.addEventListener('close', () => { document.body.style.overflow = ''; });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.hasAttribute('open')) return;
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    });
    let touchX = 0;
    lightbox.addEventListener('touchstart', (event) => { touchX = event.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (event) => {
      const delta = event.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 55) moveLightbox(delta < 0 ? 1 : -1);
    }, { passive: true });
  };

  loader();
  initReveal();
  initCounters();
  initScroll();
  initCursor();
  initFolders();
  initMobileMenu();
  initCareerFilm();
  initGalleries();
  initLightbox();
  initMagnetic();
})();
