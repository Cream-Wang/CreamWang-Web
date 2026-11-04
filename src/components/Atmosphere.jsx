import React, { useEffect } from 'react';

export default function Atmosphere({ enabled }) {
  useEffect(() => {
    const items = [...document.querySelectorAll('.film-card, .xhs-project, .business-accounts>article, .video-card, .poster-card, .product-card, .about-grid>div, .contact-section')];
    if (!enabled) {
      items.forEach(item => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -24px 0px' });
    items.forEach(item => {
      item.classList.add('motion-item');
      item.style.setProperty('--reveal-delay', `${Math.min([...item.parentElement.children].indexOf(item), 2) * 85}ms`);
      observer.observe(item);
    });
    const revealOnFocus = event => event.target.closest('.motion-item')?.classList.add('is-visible');
    document.addEventListener('focusin', revealOnFocus);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', revealOnFocus);
    };
  }, [enabled]);

  useEffect(() => {
    const sections = [...document.querySelectorAll('.work-section')];
    const update = () => {
      const current = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= innerHeight * 0.4 && rect.bottom > innerHeight * 0.4;
      });
      sections.forEach(section => section.classList.toggle('is-current', section === current));
      document.querySelectorAll('.category-grid a').forEach(link => {
        if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { update(); frame = 0; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    const portrait = document.querySelector('.portrait');
    let frame = 0;
    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      hero.style.removeProperty('--pointer-x');
      hero.style.removeProperty('--pointer-y');
      portrait.style.removeProperty('--tilt-x');
      portrait.style.removeProperty('--tilt-y');
    };
    if (!enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      clear();
      return;
    }
    const move = event => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        hero.style.setProperty('--pointer-x', `${x * 100}%`);
        hero.style.setProperty('--pointer-y', `${y * 100}%`);
        portrait.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
        portrait.style.setProperty('--tilt-y', `${(x - 0.5) * 4}deg`);
      });
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', clear);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', clear);
      clear();
    };
  }, [enabled]);

  useEffect(() => {
    const update = () => document.body.classList.toggle('page-hidden', document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      document.body.classList.remove('page-hidden');
    };
  }, []);

  return <div className="ambient-scene" aria-hidden="true"><div className="ambient-light" /><div className="ambient-grain" /><div className="ambient-lines" /></div>;
}
