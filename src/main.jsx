import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Magnet from './components/Magnet';
import Atmosphere from './components/Atmosphere';
import { asset, categories, films, posters, events, links, videos } from './data';
import './styles.css';
import './atmosphere.css';

const num = n => String(n).padStart(2, '0');

function Icon({ name = 'arrow', ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...props}>
    {name === 'play' ? <path d="m9 5 11 7-11 7Z" fill="currentColor" stroke="none" /> : name === 'down' ? <path d="M12 4v16m-7-7 7 7 7-7" /> : name === 'external' ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>;
}

function External({ href, children, className = '' }) {
  return <a className={`text-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">{children}<Icon name="external" /></a>;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-paused'));
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduce(media.matches || document.body.classList.contains('motion-paused'));
    media.addEventListener('change', change);
    window.addEventListener('portfolio-motion', change);
    return () => {
      media.removeEventListener('change', change);
      window.removeEventListener('portfolio-motion', change);
    };
  }, []);
  return reduce;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (reduce) { el.classList.remove('reveal-pending'); return; }
    el.classList.add('reveal-pending');
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { el.classList.remove('reveal-pending'); observer.disconnect(); }
    }, { threshold: 0.06 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function RoundButton({ previous, label, ...props }) {
  return <button className="round-button" aria-label={label} {...props}><Icon style={previous ? { transform: 'rotate(180deg)' } : undefined} /></button>;
}

function Section({ index, description, children }) {
  const [id, title, english] = categories[index];
  return <section id={id} className="work-section">
    <Reveal><div className="section-heading"><div className="section-title"><span className="section-index">{num(index + 1)}</span><h2>{title}</h2></div><span className="english-label">{english}</span></div>
      <p className="section-description">{description}</p></Reveal>
    {children}
  </section>;
}

function Carousel({ images, title, label = '现场记录' }) {
  const [index, setIndex] = useState(0);
  const start = useRef(null);
  const change = direction => setIndex(i => (i + direction + images.length) % images.length);
  return <div className="carousel" role="region" aria-label={`${title}图片轮播`}>
    <div className="media-label"><span>{label}</span><div className="carousel-tools"><span className="counter" aria-live="polite">{num(index + 1)}<span> / {num(images.length)}</span></span><RoundButton previous label={`${title}上一张`} onClick={() => change(-1)} /><RoundButton label={`${title}下一张`} onClick={() => change(1)} /></div></div>
    <div className="carousel-stage" tabIndex="0" aria-label={`${title}图片，左右方向键切换`}
      onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); change(e.key === 'ArrowLeft' ? -1 : 1); } }}
      onPointerDown={e => { start.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerCancel={() => { start.current = null; }}
      onPointerUp={e => { if (!start.current) return; const dx = e.clientX - start.current.x; const dy = e.clientY - start.current.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) change(dx < 0 ? 1 : -1); start.current = null; }}>
      {images.map((image, i) => <img key={image} className={i === index ? 'active' : ''} src={asset(image)} alt={`${title} · ${label} ${num(i + 1)}`} loading="lazy" draggable="false" aria-hidden={i !== index} />)}
    </div>
  </div>;
}

function Player({ film, label = '完整影片' }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const reduce = useReducedMotion();
  return <div className="player">
    <div className="media-label"><span>{label}</span><span className="english-label">{label === '完整影片' ? 'WATCH FILM' : 'WATCH VIDEO'}</span></div>
    <div className={`player-stage${film.portrait ? ' portrait-player' : ''}`}>
      {playing ? <video src={film.source} poster={asset(film.cover)} aria-label={`${film.title}视频播放器`} controls autoPlay playsInline preload="metadata" onError={() => setError(true)} /> : <>
        <img src={asset(film.cover)} alt={`${film.title} 影片封面`} loading="lazy" />
        <button className="play-target" onClick={() => setPlaying(true)} aria-label={`播放 ${film.title}`}><Magnet padding={35} maxOffset={10} magnetStrength={5} disabled={reduce}><span className="play-disc"><Icon name="play" /></span></Magnet></button>
      </>}
    </div>
    <div className="player-bottom"><External href={film.url}>外部备用观看</External>{playing && <button className="quiet-button" onClick={() => { setPlaying(false); setError(false); }}>关闭播放</button>}</div>
    {error && <p className="play-help" role="alert">视频暂时无法加载，可使用上方备用入口观看。</p>}
  </div>;
}

function AccountVideo({ title, source, cover, url, portrait = false }) {
  const [expanded, setExpanded] = useState(false);
  return <div className="account-video"><button className="text-link quiet-button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? '收起代表视频' : `观看${title}`}<Icon name="play" /></button>{expanded && <Player film={{ title, source, cover, url, portrait }} label="代表视频" />}</div>;
}

function Film({ film }) {
  return <article className="film-card">
    <Carousel images={film.images} title={film.title} label="电影剧照" />
    <div className="film-copy"><h3 className="film-title">{film.title}</h3><span className="small-label">项目介绍 / PROJECT</span><p>{film.description}</p>
      {film.role && <><span className="small-label role-label">我的职责 / MY ROLE</span><p>{film.role}</p><div className="role-tags">{film.tags.map(tag => <span key={tag}>{tag}</span>)}</div></>}
    </div>
    <Player film={film} />
  </article>;
}

function HorizontalGallery({ children, label, className = '', count, dots = false }) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const go = next => {
    const track = ref.current;
    const card = track.children[Math.min(Math.max(next, 0), count - 1)];
    const step = track.children[1]?.offsetLeft - track.children[0].offsetLeft || track.clientWidth;
    const max = track.scrollWidth - track.clientWidth;
    let left = Math.min(card.offsetLeft - track.children[0].offsetLeft, max);
    if (next < index && left >= track.scrollLeft - 1) left = Math.max(0, track.scrollLeft - step);
    track.scrollTo({ left, behavior: reduce ? 'instant' : 'smooth' });
  };
  const update = () => {
    const track = ref.current;
    const origin = track.children[0].offsetLeft;
    let closest = 0;
    Array.from(track.children).forEach((el, i) => { if (Math.abs(el.offsetLeft - origin - track.scrollLeft) < Math.abs(track.children[closest].offsetLeft - origin - track.scrollLeft)) closest = i; });
    setIndex(track.scrollWidth > track.clientWidth + 2 && track.scrollLeft >= track.scrollWidth - track.clientWidth - 2 ? count - 1 : closest);
  };
  return <div className={`horizontal-gallery ${className}`}>
    <div className="gallery-bar"><span className="small-label">{label}</span><div className="carousel-tools"><span className="counter" aria-live="polite">{num(index + 1)}<span> / {num(count)}</span></span><RoundButton previous label={`${label}上一张`} disabled={index === 0} onClick={() => go(index - 1)} /><RoundButton label={`${label}下一张`} disabled={index === count - 1} onClick={() => go(index + 1)} /></div></div>
    <div className="gallery-track" ref={ref} onScroll={update} tabIndex="0" role="region" aria-label={label} onKeyDown={e => { if (e.target === ref.current && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); go(index + (e.key === 'ArrowLeft' ? -1 : 1)); } }}>{children}</div>
    {dots && <div className="gallery-dots">{Array.from({ length: count }, (_, i) => <button key={i} aria-label={`${label}第${i + 1}张`} aria-current={index === i ? 'true' : undefined} className={index === i ? 'current' : ''} onClick={() => go(i)} />)}</div>}
  </div>;
}

function VideoCard({ image, title, description, meta, url, source }) {
  return <article className="video-card"><Player film={{ title, source, cover: image, url }} label="视频作品" /><div className="video-card-copy"><h3>{title}</h3><p>{description}</p><p className="project-meta">{meta}</p></div></article>;
}

function App() {
  const reduce = useReducedMotion();
  const [motionPaused, setMotionPaused] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('motion-paused', motionPaused);
    window.dispatchEvent(new Event('portfolio-motion'));
    return () => document.body.classList.remove('motion-paused');
  }, [motionPaused]);
  return <>
    <a className="skip-link" href="#works">跳到精选作品</a>
    <Atmosphere enabled={!reduce} />
    <div className="reading-progress" aria-hidden="true" />
    <header className="site-header wrap"><a className="wordmark" href="#home">YILIN WANG<span>.</span></a><div className="header-tools"><button className="motion-toggle" type="button" aria-label="切换氛围动效" aria-pressed={!reduce} disabled={window.matchMedia('(prefers-reduced-motion: reduce)').matches} title={window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '已遵循设备的减少动态效果设置' : '开启或关闭氛围动效'} onClick={() => setMotionPaused(value => !value)}>{reduce ? '动态关闭' : '动态开启'}</button><a className="about-nav" href="#about">关于我<Icon name="external" /></a></div></header>
    <main className="wrap">
      <section className="hero" id="home">
        <div className="hero-atmosphere" aria-hidden="true"><div className="hero-beam" /><div className="hero-orbit" /></div>
        <div className="hero-copy"><p className="eyebrow">个人作品集 <span>/</span> 2026</p><h1 aria-label="用镜头，讲述故事。">{['用镜头', '讲述', '故事.'].map((line, i) => <span className="title-line" key={line} aria-hidden="true"><span style={{ '--line': i }}>{line}</span></span>)}</h1></div>
        <figure className="portrait"><img src={asset(1)} width="900" height="1200" alt="王艺霖个人肖像" fetchPriority="high" /><figcaption>王艺霖 <span>/ Yilin Wang</span></figcaption></figure>
        <div className="hero-intro"><p className="hero-specialty">影视创作 · 创意叙事 · 数字媒体</p><p className="hero-description">我关注影像如何讲述故事，也热爱把创意变成真实的作品。</p><div className="hero-foot"><span>王艺霖 / 莫纳什大学马来西亚分校</span><Magnet padding={35} maxOffset={9} magnetStrength={5} disabled={reduce}><a href="#works" className="scroll-link" aria-label="浏览精选作品"><Icon name="down" /></a></Magnet></div></div>
      </section>

      <section id="works" className="works-directory"><Reveal><div className="directory-heading"><h2>精选作品</h2><span className="small-label">01 / 作品目录</span></div><p>按创作类型与项目职责整理的个人作品集。从影视叙事，到账号运营、活动组织、新闻采访与产品设计。</p><nav className="category-grid" aria-label="作品分类目录">{categories.map(([id, title], i) => <a href={`#${id}`} key={id}><span className="directory-number">{num(i + 1)}</span><span>{title}</span><Icon /></a>)}</nav></Reveal></section>

      <Section index={0} description="从构思、叙事到影像表达，两部剧情短片是作品集的视觉主角。"><div className="two-column films">{films.map(film => <Film film={film} key={film.title} />)}</div></Section>

      <Section index={1} description="把选题策划、内容制作与实际传播成果集中呈现。">
        <article className="xhs-project"><div className="account-feature"><div className="xhs-profile"><img src={asset(12)} alt="椿屋奈奈子小红书账号主页与运营数据" loading="lazy" /></div><div><span className="small-label">小红书个人账号</span><h3>椿屋奈奈子</h3><p>从 0 到 1 独立运营海外留学类账号，围绕 Study With Me、学习 Vlog 与商单推广确定账号定位；通过竞品分析、热点追踪与内容复盘进行选题，独立完成脚本撰写、拍摄剪辑、封面设计和发布。</p><div className="results"><p>发布笔记 100+ 篇 · 3个月从 0 增长至 1100+ 粉丝</p><p>打造爆款笔记 5+ 篇 · 单篇最高 13万+ 播放、1万+ 点赞</p><p>商单变现 5000+ 元</p><span className="data-note">粉丝数据：1193（原记录快照）</span></div><div className="project-links"><External href={links.xhs}>访问小红书主页</External><AccountVideo title="小红书代表视频" source={videos.xhs} cover={15} url={links.xhsVideo} portrait /></div></div></div>
          <div className="screenshot-grid" role="region" aria-label="小红书代表内容截图" tabIndex="0">{['代表笔记 · 9,633 点赞', 'Study With Me · 学习内容', '学习日常 · 视频创作'].map((title, i) => <figure key={title}><div className="screenshot-frame"><img src={asset(13 + i)} alt={title} loading="lazy" /></div><figcaption><span>{num(i + 1)}</span>{title}</figcaption></figure>)}</div>
        </article>
        <div className="two-column business-accounts"><article><div className="business-image"><img src={asset(16)} alt="黄刚频道主页，账号整体粉丝规模170.5万" loading="lazy" /></div><h3>黄刚频道</h3><p className="project-meta">农业内容与趋势传播</p><p>参与「日本稻田绣球农业考察」主题视频制作，负责素材筛选与剪辑；结合海外农业考察素材，将新农业技术与产业模式转化为易于理解的短视频内容。</p><p className="results">代表视频：全平台累计播放 100万+、点赞 5万+。账号截图显示粉丝 170.5万（账号整体规模，非个人增粉成果）。</p><div className="project-links"><External href={links.huang}>访问黄刚频道抖音主页</External><AccountVideo title="黄刚频道代表视频" source={videos.huang} cover={16} url={links.huangVideo} /></div></article>
        <article><div className="business-image"><img src={asset(17)} alt="农特主页，账号整体粉丝规模222.5万" loading="lazy" /></div><h3>农特</h3><p className="project-meta">农业品牌内容传播</p><p>参与「农特」抖音与视频号运营，承担海外农业选题、脚本辅助撰写及后台数据分析；参与产出视频 30+ 条，记录日本农业考察的企业参访与农业项目素材。</p><p className="results">参与产出视频累计播放 100万+，平均每条点赞 1000+；拍摄素材 50+ 条，应用率约 90%。账号截图显示粉丝 222.5万（账号整体规模）。</p><External href={links.nong}>访问农特抖音主页</External></article></div>
      </Section>

      <Section index={2} description="将视频快剪与视觉海报并列展示，体现活动宣传的完整表达。">
        <VideoCard image={18} title="校园活动快剪视频" description="为学生协会文化及校园活动制作现场记录与节奏化快剪，突出活动氛围和参与体验。" meta="活动影像 · Hide and Seek / MUMCSA 2025" url={links.campus} source={videos.campus} />
        <div className="poster-section"><h3>活动宣传海报</h3><p>四组校园活动与公益视觉作品，点击任一海报展开项目详情。</p><HorizontalGallery label="活动宣传海报" count={4} className="posters">{posters.map(poster => <details className="poster-card" key={poster.image}><summary><div className="poster-image"><img src={asset(poster.image)} alt={poster.title} loading="lazy" draggable="false" /></div><span className="poster-title">{poster.title}<span className="expand-mark" aria-hidden="true">+</span></span></summary><div className="poster-details">{[['项目背景', poster.background], ['作品简介', poster.description], ['设计职责', poster.role]].map(([label, text]) => <div key={label}><h4>{label}</h4><p>{text}</p></div>)}</div></details>)}</HorizontalGallery></div>
      </Section>

      <Section index={3} description="展示从筹备、跨团队沟通到活动执行的实践经验。"><div className="two-column">{events.map(event => <article key={event.title}><Carousel {...event} /><h3>{event.title}</h3><p>{event.description}</p><p className="project-meta">{event.meta}</p></article>)}</div></Section>

      <Section index={4} description="从信息搜集到人物与议题的呈现，突出采访和纪实表达能力。"><VideoCard image={33} title="SCMP 国际危机模拟报道" description="在国际危机模拟中承担记者角色，参与信息核实、利益相关方采访与新闻视频制作。" meta="新闻采访 · 视频作品" url={links.scmp} source={videos.scmp} /></Section>

      <Section index={5} description="以视觉界面与使用场景收尾，呈现从内容传播延伸到用户体验的能力。"><HorizontalGallery label="星守 · 界面展示" count={3} className="product-gallery" dots>{['小程序首页', '行程守护', '紧急求助'].map((title, i) => <figure className="product-card" key={title}><img src={asset(34 + i)} alt={`星守${title}完整界面`} loading="lazy" /><figcaption><span>{num(i + 1)} / {title}</span><p>{['安心出发，一路有守护', '旅程进行中 · 行程状态', '我需要帮助 · 求助方式'][i]}</p></figcaption></figure>)}</HorizontalGallery><div className="product-description"><h3>星守 · 女性留学生安全小程序</h3><p>面向女性国际学生的安全服务设计，规划行程守护、紧急求助和附近帮助等功能，重视易用性与隐私保护。</p><p className="project-meta">交互与界面设计 · 首页、行程守护与紧急求助界面</p></div></Section>

      <section id="about" className="about-section"><div className="section-kicker">02 / 个人简介</div><div className="about-grid"><div><span className="small-label">数字媒体与传播</span><h2>用创意表达，<br />用影像沟通，<br />用故事连接。</h2></div><div><p>我在莫纳什大学马来西亚分校学习数字媒体与传播，具有剧情短片、账号运营、校园宣传、活动组织、新闻采访和数字产品界面设计等实践经历。</p><p>希望通过有创意、有温度的影像与内容，让复杂的信息更容易被理解，让值得讲述的故事被更多人看见。</p><div className="about-tags">{['创意策划', '影视制作', '视频剪辑', '社交媒体运营'].map(tag => <span key={tag}>{tag}</span>)}</div></div></div></section>

      <section className="contact-section"><span className="section-kicker">03 / 联系方式</span><h2>期待与你交流<span>。</span></h2><p>欢迎查看我的完整简历，了解更多实践经历与专业技能。</p><div className="contact-links"><a className="resume-link text-link" href={`${import.meta.env.BASE_URL}王艺霖Cream_简历.pdf`} download="王艺霖Cream_简历.pdf">下载个人简历 PDF<Icon name="external" /></a><a className="email-link" href="mailto:15988151033@163.com">邮箱：15988151033@163.com</a></div></section>
    </main>
    <footer className="wrap"><span>© 2026 YILIN WANG</span><a href="#home">回到顶部<Icon name="down" style={{ transform: 'rotate(180deg)' }} /></a></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
