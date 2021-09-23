import mockFs from "mock-fs";

import { Configuration, getConfigurationData } from "../configuration";

describe("configuration", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe("#getConfigurationData()", () => {
    it("should throw if no config path is provided", async () => {
      await expect(getConfigurationData({})).rejects.toThrow(
        /No config path specified/
      );
    });

    it("should throw if the config file is not found", async () => {
      mockFs({
        "path/to/fake/dir": {
          "config.json": "this is not valid JSON",
        },
      });

      await expect(
        getConfigurationData({
          configPath: "path/to/fake/dir/other-config.json",
        })
      ).rejects.toThrow(/no such file or directory/);
    });

    it("should throw if the config file contains invalid JSON", async () => {
      mockFs({
        "path/to/fake/dir": {
          "config.json": "this is not valid JSON",
        },
      });

      await expect(
        getConfigurationData({
          configPath: "path/to/fake/dir/config.json",
        })
      ).rejects.toThrow(/Unexpected token/);
    });

    it("should throw if the config file does not match the required schema", async () => {
      mockFs({
        "path/to/fake/dir": {
          "config.json": JSON.stringify({
            unexpected: "schema",
          }),
        },
      });

      await expect(
        getConfigurationData({
          configPath: "path/to/fake/dir/config.json",
        })
      ).rejects.toThrow(/"unexpected" is not allowed/);
    });

    it("should return the configuration object if it is valid", async () => {
      const mockConfiguration: Configuration = {
        service: {
          name: "Example Service",
          description: "This is an example service",
          slug: "example-service",
          environments: [
            {
              name: "UI",
              type: "production",
              url: "https://example.com",
            },
          ],
          monitoring: {
            dashboards: [
              {
                label: "Cloudwatch",
                url: "https://example.com/cloudwatch/dashboard",
              },
            ],
            logs: [
              {
                label: "Cloudwatch",
                url: "https://example.com/cloudwatch/logs",
              },
            ],
          },
        },
      };

      mockFs({
        "path/to/fake/dir": {
          "config.json": JSON.stringify(mockConfiguration),
        },
      });

      expect(
        await getConfigurationData({
          configPath: "path/to/fake/dir/config.json",
        })
      ).toEqual(mockConfiguration);
    });
  });
});
