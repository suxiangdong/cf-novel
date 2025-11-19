/**
 * SEO工具函数
 * 用于动态设置页面标题和meta标签
 */

/**
 * 设置页面标题
 * @param {string} title - 页面标题
 */
export const setPageTitle = (title) => {
  document.title = title ? `${title} - 朝戈读书` : '朝戈读书 - 每一个短篇，都是一段完整的旅程';
};

/**
 * 设置meta描述
 * @param {string} description - 页面描述
 */
export const setMetaDescription = (description) => {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description || '朝戈读书 - 每一个短篇，都是一段完整的旅程。用碎片时间，品味完整故事。');
};

/**
 * 设置Open Graph标签
 * @param {Object} ogData - OG数据
 * @param {string} ogData.title - OG标题
 * @param {string} ogData.description - OG描述
 * @param {string} ogData.image - OG图片
 * @param {string} ogData.url - OG URL
 */
export const setOpenGraph = ({ title, description, image, url }) => {
  const baseUrl = window.location.origin;
  
  const ogTags = {
    'og:title': title || '朝戈读书 - 每一个短篇，都是一段完整的旅程',
    'og:description': description || '朝戈读书 - 每一个短篇，都是一段完整的旅程。用碎片时间，品味完整故事。',
    'og:image': image || `${baseUrl}/vite.svg`,
    'og:url': url || baseUrl + window.location.pathname,
    'og:type': 'website',
    'og:site_name': '朝戈读书',
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });
};

/**
 * 设置页面SEO信息
 * @param {Object} seoData - SEO数据
 */
export const setSEO = (seoData = {}) => {
  const { title, description, image, url } = seoData;
  
  setPageTitle(title);
  setMetaDescription(description);
  setOpenGraph({ title, description, image, url });
};

