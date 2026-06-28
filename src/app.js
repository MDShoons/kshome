const seed = {
  albums: [
    { title: '다시 부르는 노래', desc: '음반별 수록 정보와 개인 감상 메모를 정리하는 카드입니다.', tag: '음반' },
    { title: '공연의 기록', desc: '소극장, 방송, 기념공연 등 시대별 공연 흐름을 모읍니다.', tag: '공연' },
    { title: '사람들이 남긴 말', desc: '노래를 기억하는 사람들의 짧은 글과 해석을 보관합니다.', tag: '기억' }
  ],
  videos: [
    { title: '1990년대 방송 무대 기록', desc: '외부 플랫폼 링크를 등록하는 예시 항목입니다.', link: '#', date: '2026.06.28' },
    { title: '대학로 라이브 영상 메모', desc: '영상 설명, 출처, 확인일을 함께 남길 수 있습니다.', link: '#', date: '2026.06.28' }
  ],
  radio: [
    { title: '라디오 출연 음성 아카이브', desc: '음성만 남아 있는 자료를 정리하는 공간입니다.', link: '#', date: '2026.06.28' },
    { title: '인터뷰 클립 기록', desc: '인터뷰 주제와 발언 맥락을 메모합니다.', link: '#', date: '2026.06.28' }
  ],
  gallery: [
    { title: '공연 포스터', desc: '권리 확인 후 이미지 등록' },
    { title: '무대 사진', desc: '촬영자·출처 표기' },
    { title: '신문 스크랩', desc: '기사 링크 중심 등록' },
    { title: '기념 자료', desc: '개인 소장품 기록' }
  ],
  board: [
    { title: '자료 등록 전 확인할 것', desc: '사진, 음원, 영상은 반드시 사용 권한 또는 링크 공유 가능 여부를 확인하세요.', date: '2026.06.28' },
    { title: '아카이브 분류 기준', desc: '영상/음성/음반/사진/글로 나누어 등록하면 검색이 쉬워집니다.', date: '2026.06.28' }
  ],
  guestbook: [
    { title: '오래 남는 노래', desc: '시간이 지나도 다시 찾아 듣게 되는 노래들을 이곳에 남깁니다.' },
    { title: '오늘의 기억', desc: '처음 들었던 순간과 지금의 감정을 짧게 기록합니다.' }
  ],
  notice: [
    { title: '사이트 오픈 준비 중', desc: 'Firebase 연결 전에는 브라우저 저장소 기반으로 작동합니다.', date: '2026.06.28' },
    { title: '관리자 기능 안내', desc: '데모 로그인 후 자료 등록 버튼을 사용할 수 있습니다.', date: '2026.06.28' }
  ]
};

const STORAGE_KEY = 'ks_archive_original_data_v1';
const LOGIN_KEY = 'ks_archive_login_v1';
let data = loadData();
let loggedIn = localStorage.getItem(LOGIN_KEY) === 'true';
let activeRoute = 'home';

function loadData(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(!saved) return structuredClone(seed);
  try { return { ...structuredClone(seed), ...JSON.parse(saved) }; }
  catch { return structuredClone(seed); }
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function today(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}.${m}.${day}`;
}
function $(id){ return document.getElementById(id); }

function render(){
  renderTags();
  renderStats();
  renderAlbums();
  renderArchive('videoList', data.videos, '▶');
  renderArchive('radioList', data.radio, '♪');
  renderGallery();
  renderBoard();
  renderGuestbook();
  renderNotice();
  renderLogin();
}
function renderTags(){
  const tags = ['김광석','공연','라디오','음반','사진','방명록','아카이브','추억','자료정리'];
  $('tagList').innerHTML = tags.map(t => `<button type="button" data-search="${t}">#${t}</button>`).join('');
}
function renderStats(){
  $('statPosts').textContent = data.board.length + data.notice.length;
  $('statVideos').textContent = data.videos.length + data.radio.length;
  $('statGallery').textContent = data.gallery.length;
  $('statGuests').textContent = data.guestbook.length;
}
function renderAlbums(){
  $('albumCards').innerHTML = data.albums.map(item => `
    <article class="album-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.desc)}</p></article>
  `).join('');
}
function renderArchive(targetId, items, icon){
  $(targetId).innerHTML = items.map(item => `
    <article class="archive-item">
      <div class="archive-icon">${icon}</div>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.desc)}</p><small class="meta">${escapeHtml(item.date || '')}</small></div>
      <a href="${sanitizeLink(item.link)}" target="_blank" rel="noreferrer">열기</a>
    </article>
  `).join('');
}
function renderGallery(){
  $('galleryGrid').innerHTML = data.gallery.map(item => `
    <article class="photo-card"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.desc)}</span></article>
  `).join('');
}
function renderBoard(){
  $('boardList').innerHTML = data.board.map(item => `
    <article class="board-item"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.desc)}</p></div><span class="meta">${escapeHtml(item.date || '')}</span></article>
  `).join('');
}
function renderGuestbook(){
  $('guestbookList').innerHTML = data.guestbook.map(item => `
    <article class="guest-item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.desc)}</p></article>
  `).join('');
}
function renderNotice(){
  $('noticeList').innerHTML = data.notice.map(item => `
    <li><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.desc)}</p><span class="meta">${escapeHtml(item.date || '')}</span></li>
  `).join('');
}
function renderLogin(){
  $('loginState').textContent = loggedIn ? '관리자로 로그인됨' : '비회원으로 보는 중';
  $('openAdmin').disabled = !loggedIn;
  $('openAdmin').textContent = loggedIn ? '자료 등록' : '로그인 필요';
}
function escapeHtml(str=''){
  return String(str).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function sanitizeLink(link=''){
  if(!link) return '#';
  return /^https?:\/\//i.test(link) ? link : '#';
}
function navigate(route){
  activeRoute = route || 'home';
  document.querySelectorAll('.main-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === activeRoute));
  if(activeRoute === 'home') window.scrollTo({ top:0, behavior:'smooth' });
  else document.querySelector(`[data-page="${activeRoute}"]`)?.scrollIntoView({ behavior:'smooth', block:'start' });
  $('sideNav').classList.remove('open');
}
function filterAll(query){
  const q = query.trim().toLowerCase();
  if(!q){ data = loadData(); render(); return; }
  const next = structuredClone(loadData());
  ['videos','radio','gallery','board','guestbook','notice'].forEach(key => {
    next[key] = next[key].filter(item => `${item.title} ${item.desc}`.toLowerCase().includes(q));
  });
  next.albums = next.albums.filter(item => `${item.title} ${item.desc} ${item.tag}`.toLowerCase().includes(q));
  data = next;
  render();
}

document.addEventListener('click', e => {
  const routeEl = e.target.closest('[data-route]');
  if(routeEl){
    e.preventDefault();
    navigate(routeEl.dataset.route);
  }
  const searchEl = e.target.closest('[data-search]');
  if(searchEl){
    $('searchInput').value = searchEl.dataset.search;
    filterAll(searchEl.dataset.search);
  }
});
$('menuToggle').addEventListener('click', () => $('sideNav').classList.toggle('open'));
$('openLogin').addEventListener('click', () => $('loginBox').scrollIntoView({ behavior:'smooth' }));
$('loginBtn').addEventListener('click', () => {
  const id = $('loginId').value.trim();
  const pw = $('loginPw').value.trim();
  if(id === 'admin' && pw === 'demo1234'){
    loggedIn = true;
    localStorage.setItem(LOGIN_KEY, 'true');
    renderLogin();
    alert('관리자 로그인 완료');
  } else alert('데모 계정은 admin / demo1234 입니다.');
});
$('logoutBtn').addEventListener('click', () => {
  loggedIn = false;
  localStorage.removeItem(LOGIN_KEY);
  renderLogin();
});
$('openAdmin').addEventListener('click', () => {
  if(!loggedIn){ alert('먼저 로그인하세요.'); return; }
  $('adminDialog').showModal();
});
$('cancelAdmin').addEventListener('click', () => $('adminDialog').close());
$('adminForm').addEventListener('submit', e => {
  e.preventDefault();
  const type = $('entryType').value;
  const entry = {
    title: $('entryTitle').value.trim(),
    desc: $('entryDesc').value.trim(),
    link: $('entryLink').value.trim(),
    date: today()
  };
  if(!entry.title || !entry.desc) return;
  data = loadData();
  data[type].unshift(entry);
  saveData();
  $('adminForm').reset();
  $('adminDialog').close();
  render();
  navigate(type === 'videos' ? 'videos' : type === 'radio' ? 'radio' : type === 'gallery' ? 'gallery' : type === 'notice' ? 'notice' : 'board');
});
$('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  filterAll($('searchInput').value);
});

render();
