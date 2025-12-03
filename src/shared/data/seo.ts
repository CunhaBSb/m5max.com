import config from '@/shared/lib/config';

export type SeoMeta = {
  title: string;
  description: string;
  keywords: string;
  path: string; // deve começar com "/"
  ogImage?: string;
  noIndex?: boolean;
};

export type BuiltSeoMeta = SeoMeta & {
  url: string;
  image: string;
  siteName: string;
};

const normalizeBaseUrl = (base: string) =>
  base.endsWith('/') ? base.slice(0, -1) : base;

const baseUrl = normalizeBaseUrl(config.siteUrl || 'https://m5max.com');
const defaultOgImage = `${baseUrl}/assets/kits.show.webp`;

export const buildSeo = (meta: SeoMeta): BuiltSeoMeta => ({
  ...meta,
  url: `${baseUrl}${meta.path}`,
  image: meta.ogImage
    ? `${baseUrl}${meta.ogImage.startsWith('/') ? meta.ogImage : `/${meta.ogImage}`}`
    : defaultOgImage,
  siteName: config.siteName,
});

export const seoHome: SeoMeta = {
  title: 'Espetáculo visual para eventos corporativos | M5 Max Produções',
  description:
    'Shows visuais e pirotécnicos com engenharia, licenças e seguro para eventos corporativos, prefeituras, resorts e réveillon. Simulação 3D e operação em campo com 40 anos de experiência.',
  keywords:
    'espetáculo visual para eventos, produção de eventos corporativos, show visual para réveillon, pirotecnia licenciada, shows sincronizados, simulação 3D, segurança em eventos',
  path: '/',
  ogImage: '/assets/kits.show.webp',
};

export const seoReveillon: SeoMeta = {
  title: 'Show visual para Réveillon 2025 | Pirotecnia licenciada e segura',
  description:
    'Show visual coreografado para a virada do ano: efeitos de baixo impacto, sincronismo musical e equipe certificada. Licenças, seguro e plano técnico para orlas, clubes e resorts.',
  keywords:
    'show visual para réveillon, espetáculo de luz réveillon 2025, pirotecnia licenciada, evento de virada do ano, produção de eventos, brasília, clubes e resorts',
  path: '/reveillon',
  ogImage: '/assets/thumbapresentação.webp',
};

export const seoProdutos: SeoMeta = {
  title: 'Portfólio de shows pirotécnicos e visuais | M5 Max',
  description:
    'Catálogo profissional de espetáculos visuais: kits para celebrações e shows sob medida para empresas, prefeituras e resorts. Projetos autorizados, operação segura e foco em impacto visual.',
  keywords:
    'catálogo de shows pirotécnicos, espetáculos visuais, produção de eventos corporativos, kits pirotécnicos profissionais, fogos sincronizados, soluções para prefeituras',
  path: '/produtos',
  ogImage: '/m5logo.svg',
};

export const seoOrcamentoIate: SeoMeta = {
  title: 'Orçamento reservado • Réveillon 2026 | Iate Clube de Brasília',
  description:
    'Acesso privado ao orçamento do show visual de Réveillon 2026 para o Iate Clube de Brasília, com efeitos coreografados, licenças e seguro incluídos.',
  keywords:
    'orçamento show visual, réveillon 2026, Iate Clube de Brasília, proposta privada, pirotecnia licenciada, produção de eventos',
  path: '/orcamento-iate-2026',
  noIndex: true,
};
