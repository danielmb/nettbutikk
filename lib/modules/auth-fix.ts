import type { NuxtModule } from 'nuxt/schema';
import fsPromises from 'fs/promises';
import { resolve } from 'path';
export default <NuxtModule>function (moduleOptions, nuxt) {
  nuxt.hook('nitro:init', async (nitro) => {
    nitro.hooks.hook('compiled', async (compiled) => {
      const tsConfigPath = resolve(
        nitro.options.buildDir,
        nitro.options.typescript.tsconfigPath,
      );
      const tsConfig = JSON.parse(
        await fsPromises.readFile(tsConfigPath, 'utf-8'),
      );
      tsConfig?.include?.push('./types/auth.d.ts');
      await fsPromises.writeFile(
        tsConfigPath,
        JSON.stringify(tsConfig, null, 2),
      );
    });
  });
};
