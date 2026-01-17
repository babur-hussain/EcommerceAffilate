import { SectionConfig } from '../shared/types';
export const electronicsSectionConfig: Record<string, SectionConfig> = {};
export const getElectronicsSection = (id: string) => electronicsSectionConfig[id];
