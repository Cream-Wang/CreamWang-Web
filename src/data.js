export const asset = n => `${import.meta.env.BASE_URL}assets/asset-${String(n).padStart(2, '0')}.jpg`;
const video = name => `${import.meta.env.BASE_URL}videos/${name}`;

export const videos = {
  xhs: video('study-with-me.mp4'),
  campus: video('hide-and-seek.mp4'),
  shadow: video('the-shadow-of-success.mp4'),
  sunnie: video('sunnie-1357.mp4'),
  scmp: video('scmp-crisis-report.mp4'),
  huang: video('huanggang-japan.mp4'),
};

export const categories = [
  ['film', '影视作品', 'NARRATIVE FILMS'],
  ['accounts', '账号运营作品', 'SOCIAL MEDIA'],
  ['student', '学生协会宣传作品', 'CAMPUS MEDIA'],
  ['events', '活动组织', 'EVENT PROJECTS'],
  ['interviews', '采访类视频', 'INTERVIEWS'],
  ['product', '小程序界面设计', 'DIGITAL PRODUCT'],
];

export const films = [
  {
    title: 'The Shadow of Success', images: [2, 3, 4, 5], cover: 6,
    description: '以中式家庭教育中的母女关系为核心，讲述母亲对成绩与成功的期待如何影响女儿的心理状态，呼吁以理解和倾听代替比较与压力。',
    role: '独立负责选题策划、剧本撰写、分镜设计，以及影片拍摄与后期剪辑，完成从创意构思到成片输出的全过程。',
    tags: ['选题策划', '剧本撰写', '分镜设计', '拍摄剪辑'],
    url: 'https://my.feishu.cn/file/Rb93bnwh5om7j3xwyoZcHryx6zd',
    source: videos.shadow,
  },
  {
    title: 'Sunnie#1357', images: [7, 8, 9, 10], cover: 11,
    description: '围绕网红直播行业中的过度劳动与资本控制展开叙事，通过主播被迅速替代的结局，呈现数字时代内容创作者被商品化的处境。',
    url: 'https://drive.google.com/file/d/14r3J5W1bRXO-UNHyEJFtefbQ49caJf0S/view?usp=drivesdk',
    source: videos.sunnie,
  },
];

export const posters = [
  { image: 19, title: 'International Movie Festival', background: '以国际电影节为主题，面向校园观众传达放映活动的时间、地点与主题。', description: '为校园国际电影节制作的宣传海报，通过电影主题人物、暖色调及中英双语信息呈现活动氛围。', role: '主视觉设计、文字与信息层级排版。' },
  { image: 20, title: 'Hide and Seek', background: '为 MUMCSA Hide and Seek 校园活动制作活动信息宣传视觉。', description: '以《猫和老鼠》式的追逐形象与鲜明撞色，突出校园寻宝游戏的趣味性及参与感。', role: '创意视觉呈现、活动信息整理与排版。' },
  { image: 21, title: 'MUMCSA 2026 招新', background: '面向对学生协会感兴趣的同学，展示招新岗位与组织理念。', description: '以红色主视觉与书法字体突出招新主题，让岗位信息与社团文化同时清晰呈现。', role: '主题视觉设计、岗位信息结构化排版。' },
  { image: 22, title: 'Rescue Handbook', background: '以流浪猫安全接触为主题的信息图，用于传达基础观察和安全提示。', description: '通过图文对照与不同警示等级，帮助读者理解接近流浪猫前应观察的行为信号。', role: '信息可视化、图文组织与版式设计。' },
];

export const events = [
  { title: '生鲜供应链总裁峰会', images: [23, 24, 25, 26, 27], description: '协助行业峰会的前期筹备、流程协调与现场支持，参与活动宣传素材的整理与制作。', meta: '企业活动 · 活动现场与会务执行记录' },
  { title: '莫纳什文化晚会', images: [28, 29, 30, 31, 32], description: '参与校园文化晚会相关策划与宣传，支持跨文化活动的组织和传播。', meta: '校园文化活动 · 舞台演出、现场协作与活动记录' },
];

export const links = {
  xhs: 'https://xhslink.cn/o/1MYNDo5i5LU',
  xhsVideo: 'https://my.feishu.cn/file/KGeiby4pVoo67OxEel2cPt6l6gb',
  huang: 'https://v.douyin.com/MtDZ36uusL4/',
  huangVideo: 'https://my.feishu.cn/file/WQoXbcNWooPQ3qxlHM4cFLYc6Qf',
  nong: 'https://v.douyin.com/xiLt6ywo8oI/',
  campus: 'https://my.feishu.cn/file/S55SbGrxEonmeKxOZIaczZRf6yf',
  scmp: 'https://my.feishu.cn/file/TKwmbNN6OoT9LnxxK2xcF03F6Fh',
};
