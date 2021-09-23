import path from "path";
import fsExtra from "fs-extra";
import fs from "fs";
import Handlebars from "handlebars";

import { Configuration } from "./configuration";

const getFiles = async (
  dir: string,
  nestedDir: string | null = null
): Promise<string[]> => {
  const dirents = await fs.promises.readdir(dir, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    dirents.map(async (dirent): Promise<string[]> => {
      const res = path.resolve(dir, dirent.name);

      if (dirent.isDirectory()) {
        return getFiles(
          res,
          nestedDir ? path.join(nestedDir, dirent.name) : dirent.name
        );
      }

      return [nestedDir ? path.join(nestedDir, dirent.name) : dirent.name];
    })
  );

  return files.flat();
};

const loadTemplateFiles = async () => {
  const files = await getFiles(
    path.resolve(__dirname, "../../files/templated")
  );

  const handlebarsFiles = files
    .filter((fileName) => fileName.endsWith(".hbs"))
    .map((fileName) => fileName.replace(/\.hbs$/, ""));

  return handlebarsFiles;
};

const renderTemplatedFile = async (
  fileName: string,
  data: Configuration,
  outputDirectory: string
) => {
  const templateBuffer = await fs.promises.readFile(
    path.resolve(__dirname, `../../files/templated/${fileName}.hbs`)
  );

  const template = Handlebars.compile(templateBuffer.toString());
  const fileContents = template(data);

  const destination = path.resolve(
    __dirname,
    `../../${outputDirectory}/${fileName}`
  );

  await fs.promises.writeFile(destination, Buffer.from(fileContents));
};

export const copyStaticFiles = async (outputDirectory: string) => {
  await fsExtra.copy(
    path.resolve(__dirname, "../../files/static"),
    path.resolve(__dirname, `../../${outputDirectory}`)
  );
};

export const renderTemplatedFiles = async (
  outputDirectory: string,
  configuration: Configuration
) => {
  const templateFileNames = await loadTemplateFiles();

  for (let fileName of templateFileNames) {
    await renderTemplatedFile(fileName, configuration, outputDirectory);
  }
};
