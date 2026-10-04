import 'server-only';
import {defineLive} from 'next-sanity/live';
import {client} from './client';
// No browser token: privileged draft access remains entirely on the server.
export const live = client ? defineLive({client,serverToken:process.env.SANITY_API_READ_TOKEN||false,browserToken:false}) : null;
