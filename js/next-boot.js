/* global NexT, CONFIG */

/**
 * @overview: 子模块NexT.boot的创建和函数定义
 * 最后将所有函数用于监听器中 document.addEventListener('DOMContentLoaded'...
 */

//创建子模块
NexT.boot = {};

NexT.boot.registerEvents = function() {

  NexT.utils.registerScrollPercent();
  NexT.utils.registerCanIUseTag();

/*  // Mobile top menu bar.
  document.querySelector('.site-nav-toggle .toggle').addEventListener('click', event => {
    event.currentTarget.classList.toggle('toggle-close');
    const siteNav = document.querySelector('.site-nav');
    if (!siteNav) return;
    siteNav.style.setProperty('--scroll-height', siteNav.scrollHeight + 'px');
    document.body.classList.toggle('site-nav-on');
  });
*/

  document.querySelectorAll('.sidebar-nav li').forEach((element, index) => {
    element.addEventListener('click', () => {
      NexT.utils.activateSidebarPanel(index);
    });
  });

  window.addEventListener('hashchange', () => {
    const tHash = location.hash;
    if (tHash !== '' && !tHash.match(/%\S{2}/)) {
      const target = document.querySelector(`.tabs ul.nav-tabs li a[href="${tHash}"]`);
      target && target.click();
    }
  });

  window.addEventListener('tabs:click', e => {
    NexT.utils.registerCodeblock(e.target);
  });


  /**
   * homepage modal相关
   */
    const siteLogo = document.getElementById('siteLogo');
    const modalMap = document.getElementById('home_map__modal');
    const mapDimmer = modalMap.querySelector('.modal__dimmer');
    function showMap() {
      modalMap.style.display = 'flex';
      //TODO找到当前页面所在位置，画圈圈
    }
    function closeMap() {
      modalMap.style.display = 'none';
    }
    siteLogo.addEventListener('click', showMap);
    mapDimmer.addEventListener('click', closeMap);

  //和
  /**
   * gallery modal相关
   */
  const galleryModal = document.getElementById('galleryModal');
  const modalInfo = galleryModal.querySelector('#modalInfo');
  const modalImg = galleryModal.querySelector('#modalImage');
  const modalDimmer = galleryModal.querySelector('.modal__dimmer');
  const closeBtn = document.querySelector('.modal__toolkit .close');
  const prevBtn = document.querySelector('.modal__toolkit .prev');
  const nextBtn = document.querySelector('.modal__toolkit .next');
  const galleryItems = document.querySelectorAll('article.post__zettel');
  const postImageItems = document.querySelectorAll('.media');//TODO 
  const linkInfo = modalInfo.querySelector('.link');
  let currentIndex;

  function openModal(index) {
    document.body.classList.add('no-scroll'); //禁止滚动

    currentIndex = index;
    const currentElement = galleryItems[index];
    const img = currentElement.querySelector('img');
    const info = currentElement.querySelector('.media')
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const title = modalInfo.querySelector('.title');
    const tags = modalInfo.querySelector('.tags');
    const location = modalInfo.querySelector('.location');
    const description = modalInfo.querySelector('.description');
    
    modalImg.src = src;
    modalImg.alt = alt;
    title.innerText = alt;
    //tags.innerText = 。。。
    description.innerText = info.dataset.description;
    
    if (info.dataset.url){
      linkInfo.innerText = "See: "
      const link = document.createElement('a');
      link.className = 'post__link';
      link.href = info.dataset.url;
      link.itemProp = 'url';
      link.innerText = info.dataset.title;
      linkInfo.appendChild(link);
      linkInfo.style.display = 'block';
    } else {
      linkInfo.innerHTML = '';
    }
    galleryModal.style.display = 'block';
  }

  function clearModal() {
    linkInfo.innerHTML = '';
  }

  function closeModal() {
    galleryModal.style.display = 'none';
    clearModal();
    document.body.classList.remove('no-scroll');
  }

  function showPrev() {
      if (currentIndex > 0) {
        clearModal()  
        openModal(currentIndex - 1);
      } else {
        //TODO 先黑屏 提示至最后一张
      }
  }

  function showNext() {
      if (currentIndex < galleryItems.length - 1) {
        clearModal()
        openModal(currentIndex + 1);
      } else {
        //TODO 先黑屏 提示回到第一张
      }
  }

  galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openModal(index)); 
      //注意index 不是 data-index 属性的值，而是 galleryItems NodeList 中的当前项的索引
  });
  postImageItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index)); 
  });

  modalDimmer.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

};

NexT.boot.refresh = function() {

  /**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'scripts/helpers/next-config.js' file.
   */
  CONFIG.prism && window.Prism.highlightAll();
  CONFIG.mediumzoom && window.mediumZoom('.post-body :not(a) > img, .post-body > img', {
    background: 'var(--content-bg-color)'
  });
  CONFIG.lazyload && window.lozad('.post-body img').observe();
  CONFIG.pangu && window.pangu.spacingPage();

  CONFIG.exturl && NexT.utils.registerExtURL();
  NexT.utils.wrapTableWithBox();
  NexT.utils.registerCodeblock();
  NexT.utils.registerTabsTag();
  NexT.utils.registerActiveMenuItem();
  NexT.utils.registerLangSelect();
  NexT.utils.registerSidebarTOC();
  NexT.utils.registerPostReward();
  NexT.utils.registerVideoIframe();
};

NexT.boot.motion = function() {
  // Define Motion Sequence & Bootstrap Motion.
  if (CONFIG.motion.enable) {
    NexT.motion.integrator
      .add(NexT.motion.middleWares.header)
      .add(NexT.motion.middleWares.postList)
      .add(NexT.motion.middleWares.sidebar)
      .add(NexT.motion.middleWares.footer)
      .bootstrap();
  }
  NexT.utils.updateSidebarPosition();
};

document.addEventListener('DOMContentLoaded', () => {
  NexT.boot.registerEvents();
  NexT.boot.refresh();
  NexT.boot.motion();
});
