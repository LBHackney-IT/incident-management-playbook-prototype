import commandLineArgs from "command-line-args";
import chalk from "chalk";

import { getConfigurationData } from "../lib/configuration";
import { copyStaticFiles, renderTemplatedFiles } from "../lib/files";

(async () => {
  try {
    const options = commandLineArgs([
      {
        name: "configPath",
        type: String,
        defaultOption: true,
      },
      {
        name: "outputDirectory",
        type: String,
        defaultValue: "docs",
        alias: "o",
      },
    ]) as {
      configPath: string;
      outputDirectory: string;
    };

    const configuration = await getConfigurationData(options);

    await copyStaticFiles(options.outputDirectory);
    await renderTemplatedFiles(options.outputDirectory, configuration);

    console.log(
      chalk.green(
        `Successfully generated Docusaurus site in ${options.outputDirectory}!\r\n`
      )
    );
    console.log(
      chalk.white(
        `To generate a static version of your new documentation site, run:\r\n`
      ),
      chalk.magenta(`  $ cd ${options.outputDirectory} && yarn && yarn build`)
    );

    process.exit();
  } catch (e) {
    console.error("Error: ", e instanceof Error ? e.message : "Unknown error");
    process.exit(1);
  }
})();
