import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
/** Optional, local licensed sculpture; not used until a real asset is supplied. */
export async function loadLicensedModel(url:string){if(!url.startsWith('/models/'))throw new Error('Use a local licensed model in public/models');return (await new GLTFLoader().loadAsync(url)).scene;}
