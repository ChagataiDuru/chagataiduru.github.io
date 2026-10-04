import {defineCliConfig} from 'sanity/cli';
import {loadEnvConfig} from '@next/env';
loadEnvConfig(process.cwd());
export default defineCliConfig({
 api:{projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET},
 typegen:{enabled:true,path:['./lib/**/*.{ts,tsx}','./sanity/public.ts'],schema:'schema.json',generates:'./sanity.types.ts',overloadClientMethods:true},
});
