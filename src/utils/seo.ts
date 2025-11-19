/**
 * SEO工具函数
 * 用于动态设置页面标题和meta标签
 */

import type { SEOData } from '../types';

/**
 * 设置页面标题
 * @param title - 页面标题
 */
export const setPageTitle = (title?: string): void => {
  document.title = title ? `${title} - 朝戈读书` : '朝戈读书 - 每一个短篇，都是一段完整的旅程';
};

/**
 * 设置meta描述
 * @param description - 页面描述
 */
export const setMetaDescription = (description?: string): void => {
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
 * @param ogData - OG数据
 */
export const setOpenGraph = ({ title, description, image, url }: SEOData): void => {
  const baseUrl = window.location.origin;
  
  const ogTags: Record<string, string> = {
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
 * @param seoData - SEO数据
 */
export const setSEO = (seoData: SEOData = {}): void => {
  const { title, description, image, url } = seoData;
  
  setPageTitle(title);
  setMetaDescription(description);
  setOpenGraph({ title, description, image, url });
};

