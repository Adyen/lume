const _importDynamic = new Function('modulePath', 'return import(modulePath)');

export const mdxLoaderOptions = async (config: {
  mdxCompileOptions: { remarkPlugins?: unknown[] };
}) => {
  config.mdxCompileOptions.remarkPlugins =
    config.mdxCompileOptions.remarkPlugins || [];
  const { default: remarkGfm } = await _importDynamic('remark-gfm');
  config.mdxCompileOptions.remarkPlugins.push(remarkGfm);
  return config;
};
