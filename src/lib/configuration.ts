import path from "path";
import fs from "fs";
import Joi from "joi";
import { CommandLineOptions } from "command-line-args";

export type Configuration = {
  service: {
    name: string;
    description: string;
    slug: string;
    environments: {
      type: string;
      name: string;
      url: string;
      healthcheckEndpoint?: string;
    }[];
    monitoring: {
      logs: {
        label: string;
        url: string;
      }[];
      dashboards: {
        label: string;
        url: string;
      }[];
    };
  };
};

const configSchema = Joi.object<Configuration>({
  service: Joi.object<Configuration["service"]>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string()
      .required()
      .regex(/^[a-z0-9-]+$/, "valid slug"),
    environments: Joi.array()
      .items(
        Joi.object<Configuration["service"]["environments"][0]>({
          type: Joi.string().required(),
          name: Joi.string().required(),
          url: Joi.string().required(),
          healthcheckEndpoint: Joi.string(),
        })
      )
      .required(),
    monitoring: Joi.object<Configuration["service"]["monitoring"]>({
      logs: Joi.array()
        .items(
          Joi.object<Configuration["service"]["monitoring"]["logs"][0]>({
            label: Joi.string().required(),
            url: Joi.string().required(),
          })
        )
        .required(),
      dashboards: Joi.array()
        .items(
          Joi.object<Configuration["service"]["monitoring"]["dashboards"][0]>({
            label: Joi.string().required(),
            url: Joi.string().required(),
          })
        )
        .required(),
    }).required(),
  }),
});

export const getConfigurationData = async (
  options: CommandLineOptions
): Promise<Configuration> => {
  if (!options.configPath) {
    throw new Error("No config path specified");
  }

  const file = await fs.promises.readFile(
    path.resolve(__dirname, `../../${options.configPath}`)
  );

  const rawJson = JSON.parse(file.toString());

  const validationResult = configSchema.validate(rawJson);

  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }

  return validationResult.value as Configuration;
};
