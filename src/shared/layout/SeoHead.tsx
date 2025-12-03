import { Helmet } from 'react-helmet-async';
import { BuiltSeoMeta } from '@/shared/data/seo';

interface SeoHeadProps {
  meta: BuiltSeoMeta;
}

export const SeoHead = ({ meta }: SeoHeadProps) => (
  <Helmet>
    <title>{meta.title}</title>
    <link rel="canonical" href={meta.url} />
    <meta name="description" content={meta.description} />
    <meta name="keywords" content={meta.keywords} />
    <meta name="robots" content={meta.noIndex ? 'noindex,nofollow' : 'index,follow'} />

    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={meta.url} />
    <meta property="og:site_name" content={meta.siteName} />
    <meta property="og:locale" content="pt_BR" />
    {meta.image && <meta property="og:image" content={meta.image} />}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    {meta.image && <meta name="twitter:image" content={meta.image} />}
  </Helmet>
);
