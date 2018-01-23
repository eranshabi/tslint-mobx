import * as fs from "fs";
import {Configuration, Linter} from "tslint";

export const lint = (path, fileName) => {
    const filePath = path + fileName;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const linter = new Linter({ fix: false });
    const configuration = Configuration.findConfiguration(`${path}/tslint.json` ,filePath).results;

    linter.lint(filePath, fileContent, configuration);
    return linter.getResult();
};