import * as path from 'path';
import { MAIN_JS } from '../interfaces';
import { AppState } from '../renderer/state';
import { getUsername } from './get-username';

export interface PackageJsonOptions {
  include?: boolean;
  includeElectron?: boolean;
  includeDependencies?: boolean;
}

export const DEFAULT_OPTIONS = {
  includeElectron: true,
  includeDependencies: true,
};

export function getForgeVersion(): string {
  const fiddlePackageJSON = require(path.join(__dirname, '../../package.json'));
  return fiddlePackageJSON.devDependencies['@electron-forge/cli'];
}

/**
 * Returns the package.json for the current Fiddle
 *
 * @param {AppState} appState
 * @param {EditorValues} [values]
 * @param {PackageJsonOptions} [options]
 * @returns {string}
 */
export async function getPackageJson(
  appState: AppState,
  options?: PackageJsonOptions,
): Promise<string> {
  const { includeElectron, includeDependencies } = options || DEFAULT_OPTIONS;
  const name = await appState.getName();

  const devDependencies: Record<string, string> = {};
  const dependencies: Record<string, string> = {};

  if (includeElectron) {
    const packageName = appState.version?.includes('nightly')
      ? 'electron-nightly'
      : 'electron';
    devDependencies[packageName] = appState.version;
  }

  if (includeDependencies) {
    const { packages } = appState;
    for (const [module, version] of packages.entries()) {
      dependencies[module] = version;
    }
  }

  return JSON.stringify(
    {
      name,
      productName: name,
      description: 'My Electron application description',
      keywords: [],
      main: `./${MAIN_JS}`,
      version: '1.0.0',
      author: getUsername(),
      scripts: {
        start: 'electron .',
      },
      dependencies,
      devDependencies,
    },
    undefined,
    2,
  );
}
