import fs from "fs";
import path from "path";
import remark from 'remark'
import plugin from './index'

const fixtureDirName = "__fixtures__";
const inputFileName = "input.md";
const expectedFileName = "expected.md";

describe("Remark transformer", () => {
  const fixturesDir = path.join(__dirname, fixtureDirName);

  const names = fs.readdirSync(fixturesDir);

  const directories = names.filter(name =>
    fs.lstatSync(path.join(fixturesDir, name)).isDirectory()
  );

  directories.forEach(directory => {
    const caseName = directory.split('-').join(' ');
    const fixtureDir = path.join(fixturesDir, directory);

    const inputFilePath = path.join(fixtureDir, inputFileName);
    const input = fs.readFileSync(inputFilePath, 'utf-8');

    const expectedFilePath = path.join(fixtureDir, expectedFileName);
    const expected = fs.readFileSync(expectedFilePath, 'utf-8');

    test(caseName, (done) => {
      const processor = remark().use(plugin);
      processor.process(input, (err, actual) => {
        if (err) {
          throw new Error(err);
        }

        expect(actual && actual.contents).toEqual(expected);
        done();
      });
    })
  });
});
